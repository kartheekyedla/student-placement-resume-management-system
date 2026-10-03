// server/controllers/applicationController.js
const ApplicationModel = require('../models/Application');
const { JobModel, computeJobMatch } = require('../models/Job');
const { StudentProfileModel } = require('../models/StudentProfile');
const NotificationModel = require('../models/Notification');

// @desc    Apply for a job with eligibility and deadline verification (FR13)
// @route   POST /api/applications/apply
// @access  Private (Student)
const applyForJob = async (req, res) => {
  try {
    const { jobId, resumeId } = req.body;

    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    // 1. Deadline check (FR13)
    if (new Date() > new Date(job.deadline)) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline for this job has expired.'
      });
    }

    // 2. Duplicate application check (FR13)
    const existingApp = await ApplicationModel.findOne({
      studentId: req.user._id,
      jobId
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this job.'
      });
    }

    // 3. Eligibility verification (FR13)
    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const studentCgpa = Number(profile?.academic?.cgpa || 0);
    const minCgpa = Number(job.eligibility?.minCgpa || 0);

    if (studentCgpa < minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Eligibility criterion not met. Minimum CGPA required is ${minCgpa}, your current CGPA is ${studentCgpa}.`
      });
    }

    const match = computeJobMatch(profile, job);

    const application = await ApplicationModel.create({
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentBranch: profile?.academic?.branch || 'Computer Science',
      studentCgpa: studentCgpa,
      jobId: job._id,
      jobTitle: job.title,
      companyName: job.company,
      resumeId: resumeId || '',
      status: 'Applied',
      statusHistory: [
        {
          status: 'Applied',
          note: 'Application submitted successfully via SmartHire candidate portal.',
          changedAt: new Date().toISOString(),
          changedBy: req.user.name
        }
      ],
      matchScore: match.matchPercentage,
      matchBreakdown: match.breakdown
    });

    // Increment applicantsCount on job
    await JobModel.findByIdAndUpdate(job._id, {
      applicantsCount: (job.applicantsCount || 0) + 1
    });

    // Create in-app notification (FR19)
    await NotificationModel.create({
      userId: req.user._id,
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} was submitted successfully.`,
      type: 'application',
      link: '/applications'
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully.',
      data: application
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get all applications of current student
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const apps = await ApplicationModel.find({ studentId: req.user._id });
    return res.status(200).json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get applicants for a specific job (Recruiter / Placement Officer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Officer / Admin)
const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const apps = await ApplicationModel.find({ jobId });

    return res.status(200).json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Update application status & append to timeline history (FR13: 7 Stages)
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter / Officer / Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    const history = application.statusHistory || [];
    history.push({
      status,
      note: note || `Status updated to ${status} by ${req.user.name}.`,
      changedAt: new Date().toISOString(),
      changedBy: req.user.name
    });

    const updated = await ApplicationModel.findByIdAndUpdate(
      id,
      { status, statusHistory: history, updatedAt: new Date().toISOString() },
      { new: true }
    );

    // Notify student (FR19)
    await NotificationModel.create({
      userId: application.studentId,
      title: `Application Status Updated: ${status}`,
      message: `Your application for ${application.jobTitle} at ${application.companyName} is now marked as "${status}".`,
      type: 'application',
      link: '/applications'
    });

    return res.status(200).json({
      success: true,
      message: `Application moved to ${status}.`,
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

// @desc    Schedule interview round (FR13: Interview Calendar)
// @route   PUT /api/applications/:id/schedule-interview
// @access  Private (Recruiter / Officer / Admin)
const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledDate, scheduledTime, interviewType, locationOrLink, notes } = req.body;

    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const interviewData = {
      scheduledDate,
      scheduledTime,
      interviewType: interviewType || 'Technical Interview',
      locationOrLink: locationOrLink || 'Google Meet',
      notes: notes || '',
      isReminderSent: true
    };

    const history = application.statusHistory || [];
    history.push({
      status: interviewType || 'Interview Scheduled',
      note: `Interview scheduled on ${scheduledDate} at ${scheduledTime} (${locationOrLink}).`,
      changedAt: new Date().toISOString(),
      changedBy: req.user.name
    });

    const updated = await ApplicationModel.findByIdAndUpdate(
      id,
      {
        interview: interviewData,
        status: interviewType?.includes('HR') ? 'HR Interview' : 'Technical Interview',
        statusHistory: history,
        updatedAt: new Date().toISOString()
      },
      { new: true }
    );

    // Notify student with calendar reminder
    await NotificationModel.create({
      userId: application.studentId,
      title: `Interview Scheduled: ${application.companyName}`,
      message: `${interviewType} confirmed for ${scheduledDate} at ${scheduledTime}. Link/Venue: ${locationOrLink}`,
      type: 'interview',
      link: '/applications'
    });

    return res.status(200).json({
      success: true,
      message: 'Interview scheduled and calendar updated.',
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

// @desc    Get upcoming interview calendar events
// @route   GET /api/applications/calendar
// @access  Private
const getInterviewCalendar = async (req, res) => {
  try {
    let apps = [];
    if (req.user.role === 'student') {
      apps = await ApplicationModel.find({ studentId: req.user._id });
    } else {
      apps = await ApplicationModel.find();
    }

    // Filter applications with scheduled interview dates
    const interviews = apps
      .filter(a => a.interview && a.interview.scheduledDate)
      .map(a => ({
        id: a._id,
        studentName: a.studentName,
        jobTitle: a.jobTitle,
        companyName: a.companyName,
        date: a.interview.scheduledDate,
        time: a.interview.scheduledTime,
        type: a.interview.interviewType,
        locationOrLink: a.interview.locationOrLink,
        status: a.status
      }));

    return res.status(200).json({
      success: true,
      data: interviews
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
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  scheduleInterview,
  getInterviewCalendar
};
