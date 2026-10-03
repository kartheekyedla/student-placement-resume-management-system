// server/controllers/driveController.js
const DriveModel = require('../models/Drive');
const { StudentProfileModel } = require('../models/StudentProfile');
const NotificationModel = require('../models/Notification');
const UserModel = require('../models/User');

// @desc    Get all placement drives
// @route   GET /api/drives
// @access  Public / Private
const getDrives = async (req, res) => {
  try {
    const drives = await DriveModel.find();
    return res.status(200).json({
      success: true,
      count: drives.length,
      data: drives
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get single drive by ID
// @route   GET /api/drives/:id
// @access  Public / Private
const getDriveById = async (req, res) => {
  try {
    const drive = await DriveModel.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found.' });
    }
    return res.status(200).json({ success: true, data: drive });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Create new placement drive (FR16: Placement Officer)
// @route   POST /api/drives
// @access  Private (Officer / Admin)
const createDrive = async (req, res) => {
  try {
    const {
      title,
      companyName,
      roleOffered,
      packageDetails,
      description,
      eligibilityCriteria,
      driveDate,
      venue,
      deadline
    } = req.body;

    if (!title || !companyName || !driveDate || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, company name, drive date, and registration deadline are required.'
      });
    }

    // Auto-calculate matching eligible students (FR16)
    const allProfiles = await StudentProfileModel.find();
    const minCgpa = eligibilityCriteria?.minCgpa || 7.0;
    const allowedBranches = eligibilityCriteria?.allowedBranches || [];

    const eligibleStudents = allProfiles.filter(p => {
      const cgpa = Number(p.academic?.cgpa || 0);
      const branch = (p.academic?.branch || '').toLowerCase();
      const cgpaOk = cgpa >= minCgpa;
      const branchOk = allowedBranches.length === 0 || allowedBranches.some(b => branch.includes(b.toLowerCase()));
      return cgpaOk && branchOk;
    });

    const newDrive = await DriveModel.create({
      title,
      companyName,
      roleOffered: roleOffered || 'Software Engineer',
      packageDetails: packageDetails || '7.5 - 12.0 LPA',
      description: description || '',
      eligibilityCriteria: eligibilityCriteria || { minCgpa: 7.0, allowedBranches: ['Computer Science'], maxBacklogs: 0 },
      driveDate,
      venue: venue || 'Auditorium & Virtual Coding Labs',
      deadline,
      status: 'Upcoming',
      eligibleCount: eligibleStudents.length,
      registeredStudents: [],
      createdBy: req.user.name
    });

    // Notify all eligible students (FR16)
    for (const stud of eligibleStudents.slice(0, 10)) {
      await NotificationModel.create({
        userId: stud.userId,
        title: `Campus Drive Announced: ${companyName}`,
        message: `You meet all eligibility criteria for the ${title}. Register before ${deadline}.`,
        type: 'drive',
        link: '/drives'
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Placement drive created and eligible students notified.',
      data: newDrive
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Register for placement drive (Student)
// @route   POST /api/drives/:id/register
// @access  Private (Student)
const registerForDrive = async (req, res) => {
  try {
    const { id } = req.params;
    const drive = await DriveModel.findById(id);

    if (!drive) {
      return res.status(404).json({ success: false, message: 'Drive not found.' });
    }

    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const studentCgpa = Number(profile?.academic?.cgpa || 0);
    const minCgpa = Number(drive.eligibilityCriteria?.minCgpa || 0);

    if (studentCgpa < minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Your CGPA (${studentCgpa}) does not meet the minimum required (${minCgpa}).`
      });
    }

    const registered = drive.registeredStudents || [];
    const alreadyRegistered = registered.some(r => String(r.studentId) === String(req.user._id));

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this drive.'
      });
    }

    registered.push({
      studentId: req.user._id,
      studentName: req.user.name,
      registeredAt: new Date().toISOString()
    });

    const updated = await DriveModel.findByIdAndUpdate(
      id,
      { registeredStudents: registered },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Successfully registered for placement drive.',
      data: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

module.exports = {
  getDrives,
  getDriveById,
  createDrive,
  registerForDrive
};
