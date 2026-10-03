// server/models/Job.js
const mongoose = require('mongoose');
const { createDualModel } = require('./dbAdapter');

const jobSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  company: { type: String, required: true },
  companyId: { type: String, ref: 'User' },
  logo: { type: String, default: '' },
  location: { type: String, default: 'Bangalore, India' },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Internship', 'Contract', 'Remote'],
    default: 'Full-Time'
  },
  experienceLevel: {
    type: String,
    enum: ['Fresher', '1-2 Years', '2-4 Years', 'Senior'],
    default: 'Fresher'
  },
  salary: {
    min: { type: Number, default: 600000 },
    max: { type: Number, default: 1200000 },
    currency: { type: String, default: 'INR' },
    period: { type: String, default: 'Per Annum' }
  },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  requiredSkills: [{ type: String, required: true }],
  preferredSkills: [{ type: String }],
  eligibility: {
    minCgpa: { type: Number, default: 7.0 },
    allowedBranches: [{ type: String }],
    maxBacklogs: { type: Number, default: 0 },
    degree: { type: String, default: 'B.Tech / B.E / MCA' }
  },
  deadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Draft', 'Pending Approval'],
    default: 'Active'
  },
  isApproved: { type: Boolean, default: true },
  applicantsCount: { type: Number, default: 0 },
  postedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// FR8: Job Matching Engine
// Weights:
// Skill Match: 50%
// Education Match: 15%
// CGPA Match: 15%
// Experience Match: 10%
// Certification Match: 5%
// Location Preference: 5%
function computeJobMatch(studentProfile, job) {
  if (!studentProfile || !job) {
    return {
      matchPercentage: 0,
      breakdown: { skill: 0, education: 0, cgpa: 0, experience: 0, certification: 0, location: 0 },
      matchingSkills: [],
      missingSkills: job ? job.requiredSkills || [] : [],
      reasoning: 'Profile or job data incomplete.'
    };
  }

  const studentSkills = (studentProfile.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase().trim());
  const requiredSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());

  // 1. Skill Match (50%)
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(req => {
    if (studentSkills.some(sk => sk.includes(req) || req.includes(sk))) {
      matchedSkills.push(req);
    } else {
      missingSkills.push(req);
    }
  });

  const skillRaw = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 100 : 100;
  const skillScore = (skillRaw * 0.50);

  // 2. Education & Branch Match (15%)
  const studentBranch = (studentProfile.academic?.branch || '').toLowerCase();
  const allowedBranches = (job.eligibility?.allowedBranches || []).map(b => b.toLowerCase());
  let eduRaw = 50; // baseline if degree matches
  if (allowedBranches.length === 0 || allowedBranches.some(b => studentBranch.includes(b) || b.includes(studentBranch) || b.includes('all'))) {
    eduRaw = 100;
  }
  const educationScore = (eduRaw * 0.15);

  // 3. CGPA Match (15%)
  const studentCgpa = Number(studentProfile.academic?.cgpa || 0);
  const minCgpa = Number(job.eligibility?.minCgpa || 6.0);
  let cgpaRaw = 0;
  if (studentCgpa >= minCgpa) {
    cgpaRaw = 100;
  } else if (studentCgpa > 0) {
    cgpaRaw = Math.max(0, Math.round((studentCgpa / minCgpa) * 100));
  }
  const cgpaScore = (cgpaRaw * 0.15);

  // 4. Experience Match (10%)
  const expCount = (studentProfile.experience || []).length;
  let expRaw = 50;
  if (job.experienceLevel === 'Fresher') {
    expRaw = expCount > 0 ? 100 : 90;
  } else {
    expRaw = expCount >= 1 ? 100 : 40;
  }
  const experienceScore = (expRaw * 0.10);

  // 5. Certification Match (5%)
  const certCount = (studentProfile.certifications || []).length;
  const certRaw = certCount >= 2 ? 100 : certCount === 1 ? 75 : 40;
  const certScore = (certRaw * 0.05);

  // 6. Location Preference (5%)
  const studentLocations = (studentProfile.preferences?.preferredLocations || []).map(l => l.toLowerCase());
  const jobLoc = (job.location || '').toLowerCase();
  let locRaw = 60;
  if (jobLoc.includes('remote') || studentLocations.some(l => jobLoc.includes(l))) {
    locRaw = 100;
  }
  const locationScore = (locRaw * 0.05);

  const totalMatch = Math.min(100, Math.round(skillScore + educationScore + cgpaScore + experienceScore + certScore + locationScore));

  const reasons = [
    `Skill Match: ${matchedSkills.length}/${requiredSkills.length} required skills matched (${Math.round(skillRaw)}%)`,
    `CGPA Criterion: Student CGPA (${studentCgpa}) ${studentCgpa >= minCgpa ? 'meets or exceeds' : 'is below'} minimum required (${minCgpa})`,
    `Branch Eligibility: ${eduRaw === 100 ? 'Branch is eligible' : 'Branch under special review'}`,
    `Experience & Projects: Profile showcases ${expCount} internships/experience and ${(studentProfile.projects || []).length} projects`,
    `Location & Certifications: Contributes ${Math.round(certScore + locationScore)}/10 points to readiness`
  ];

  return {
    matchPercentage: totalMatch,
    breakdown: {
      skillScore: Math.round(skillScore),
      educationScore: Math.round(educationScore),
      cgpaScore: Math.round(cgpaScore),
      experienceScore: Math.round(experienceScore),
      certificationScore: Math.round(certScore),
      locationScore: Math.round(locationScore)
    },
    matchingSkills: matchedSkills,
    missingSkills: missingSkills,
    reasoning: reasons.join(' | ')
  };
}

const JobModel = mongoose.models.Job || mongoose.model('Job', jobSchema);

module.exports = {
  JobModel,
  computeJobMatch
};
