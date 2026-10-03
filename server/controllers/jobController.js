// server/controllers/jobController.js
const { JobModel, computeJobMatch } = require('../models/Job');
const { StudentProfileModel } = require('../models/StudentProfile');
const UserModel = require('../models/User');

// @desc    Get all jobs with multi-facet search, filtering, and sorting (FR7)
// @route   GET /api/jobs
// @access  Public / Private
const getJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      experienceLevel,
      location,
      minCgpa,
      skill,
      branch,
      sortBy
    } = req.query;

    let jobs = await JobModel.find();

    // In-memory or mongoose filtering
    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      jobs = jobs.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        (j.requiredSkills || []).some(s => s.toLowerCase().includes(q))
      );
    }

    if (jobType && jobType !== 'All') {
      jobs = jobs.filter(j => j.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (experienceLevel && experienceLevel !== 'All') {
      jobs = jobs.filter(j => j.experienceLevel.toLowerCase() === experienceLevel.toLowerCase());
    }

    if (location && location.trim() !== '') {
      const loc = location.toLowerCase();
      jobs = jobs.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (minCgpa) {
      const cgpa = parseFloat(minCgpa);
      jobs = jobs.filter(j => (j.eligibility?.minCgpa || 0) <= cgpa);
    }

    if (skill) {
      const sLower = skill.toLowerCase();
      jobs = jobs.filter(j =>
        (j.requiredSkills || []).some(s => s.toLowerCase().includes(sLower))
      );
    }

    if (branch && branch !== 'All') {
      const bLower = branch.toLowerCase();
      jobs = jobs.filter(j =>
        (j.eligibility?.allowedBranches || []).length === 0 ||
        (j.eligibility?.allowedBranches || []).some(b => b.toLowerCase().includes(bLower))
      );
    }

    // Sorting
    if (sortBy === 'salary-high') {
      jobs.sort((a, b) => (b.salary?.max || 0) - (a.salary?.max || 0));
    } else if (sortBy === 'deadline') {
      jobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
      // Default: newest first
      jobs.sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0));
    }

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Compute explainable job match score for current student (FR8)
// @route   GET /api/jobs/:id/match
// @access  Private (Student)
const getJobMatch = async (req, res) => {
  try {
    const job = await JobModel.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.',
        data: null
      });
    }

    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const matchAnalysis = computeJobMatch(profile, job);

    return res.status(200).json({
      success: true,
      message: 'Job match calculated successfully.',
      data: {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        ...matchAnalysis
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

// @desc    Get ranked recommended jobs for current student (FR9)
// @route   GET /api/jobs/recommendations
// @access  Private (Student)
const getRecommendedJobs = async (req, res) => {
  try {
    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const allJobs = await JobModel.find();

    const scoredJobs = allJobs.map(job => {
      const match = computeJobMatch(profile, job);
      return {
        ...job,
        matchScore: match.matchPercentage,
        matchBreakdown: match.breakdown,
        matchingSkills: match.matchingSkills,
        missingSkills: match.missingSkills,
        matchReasoning: match.reasoning
      };
    });

    // Rank by match percentage descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json({
      success: true,
      count: scoredJobs.length,
      data: scoredJobs
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Create new job posting (FR15 - Recruiter / Placement Officer)
// @route   POST /api/jobs
// @access  Private (Recruiter, Officer, Admin)
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experienceLevel,
      salary,
      description,
      responsibilities,
      requirements,
      requiredSkills,
      preferredSkills,
      eligibility,
      deadline
    } = req.body;

    if (!title || !company || !deadline || !requiredSkills) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, deadline, and required skills are mandatory fields.',
        data: null
      });
    }

    const job = await JobModel.create({
      title,
      company: req.user.role === 'recruiter' && req.user.companyName ? req.user.companyName : company,
      companyId: req.user._id,
      location: location || 'Bangalore, India',
      jobType: jobType || 'Full-Time',
      experienceLevel: experienceLevel || 'Fresher',
      salary: salary || { min: 600000, max: 1200000, currency: 'INR', period: 'Per Annum' },
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n') : []),
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split('\n') : []),
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map(s => s.trim()),
      preferredSkills: Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',').map(s => s.trim()) : []),
      eligibility: eligibility || { minCgpa: 7.0, allowedBranches: ['Computer Science & Engineering'], maxBacklogs: 0 },
      deadline: new Date(deadline).toISOString(),
      status: 'Active',
      isApproved: req.user.role === 'officer' || req.user.role === 'admin'
    });

    return res.status(201).json({
      success: true,
      message: 'Job created successfully.',
      data: job
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Bookmark / save job
// @route   POST /api/jobs/:id/save
// @access  Private (Student)
const toggleSaveJob = async (req, res) => {
  try {
    const { id } = req.params;
    let profile = await StudentProfileModel.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const saved = profile.savedJobs || [];
    const index = saved.indexOf(id);
    let isSaved = false;

    if (index > -1) {
      saved.splice(index, 1);
      isSaved = false;
    } else {
      saved.push(id);
      isSaved = true;
    }

    await StudentProfileModel.findByIdAndUpdate(profile._id, { savedJobs: saved });

    return res.status(200).json({
      success: true,
      message: isSaved ? 'Job saved to bookmarks.' : 'Job removed from bookmarks.',
      data: { isSaved, savedJobs: saved }
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
  getJobs,
  getJobById,
  getJobMatch,
  getRecommendedJobs,
  createJob,
  toggleSaveJob
};
