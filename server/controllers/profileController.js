// server/controllers/profileController.js
const { StudentProfileModel, calculateProfileCompletion } = require('../models/StudentProfile');
const UserModel = require('../models/User');

// @desc    Get current student's full profile
// @route   GET /api/profile/me
// @access  Private (Student)
const getMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfileModel.findOne({ userId: req.user._id });

    if (!profile) {
      // Auto-create initial profile if not yet created
      profile = await StudentProfileModel.create({
        userId: req.user._id,
        personal: {
          fullName: req.user.name,
          email: req.user.email,
          phone: req.user.phone || ''
        },
        academic: {
          degree: 'B.Tech',
          branch: req.user.department || 'Computer Science & Engineering',
          graduationYear: 2026,
          cgpa: 8.0,
          backlogs: 0
        },
        skills: [{ name: 'JavaScript', category: 'Technical', level: 'Intermediate' }],
        profileCompletion: 40
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Student profile retrieved.',
      data: profile
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Update current student profile
// @route   PUT /api/profile/me
// @access  Private (Student)
const updateMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfileModel.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfileModel.create({ userId: req.user._id, ...req.body });
    }

    // Merge incoming data
    const updateData = { ...req.body };
    const mergedProfile = { ...profile, ...updateData };

    // Dynamic Profile Completion calculation: completed sections / total sections * 100 (FR2)
    mergedProfile.profileCompletion = calculateProfileCompletion(mergedProfile);
    mergedProfile.updatedAt = new Date().toISOString();

    const updated = await StudentProfileModel.findByIdAndUpdate(profile._id, mergedProfile, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
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

// @desc    Get candidate profile by ID (for Recruiter / Placement Officer review)
// @route   GET /api/profile/candidate/:id
// @access  Private (Recruiter / Officer / Admin)
const getCandidateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await StudentProfileModel.findOne({ userId: id }) || await StudentProfileModel.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found.',
        data: null
      });
    }

    const user = await UserModel.findById(profile.userId);

    return res.status(200).json({
      success: true,
      message: 'Candidate profile fetched.',
      data: {
        ...profile,
        user: user ? { name: user.name, email: user.email, avatar: user.avatar } : null
      }
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
  getMyProfile,
  updateMyProfile,
  getCandidateProfile
};
