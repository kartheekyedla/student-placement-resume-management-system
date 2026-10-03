// server/models/StudentProfile.js
const mongoose = require('mongoose');
const { createDualModel } = require('./dbAdapter');

const studentProfileSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId: { type: String, required: true, ref: 'User' },
  personal: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' }
  },
  academic: {
    college: { type: String, default: '' },
    degree: { type: String, default: 'B.Tech' },
    branch: { type: String, default: 'Computer Science & Engineering' },
    graduationYear: { type: Number, default: 2026 },
    cgpa: { type: Number, default: 8.5 },
    backlogs: { type: Number, default: 0 }
  },
  skills: [
    {
      name: { type: String, required: true },
      category: { type: String, default: 'Technical' }, // Technical, Soft Skills, Tools
      level: { type: String, default: 'Intermediate' } // Beginner, Intermediate, Advanced
    }
  ],
  experience: [
    {
      title: { type: String, default: '' },
      company: { type: String, default: '' },
      location: { type: String, default: '' },
      startDate: { type: String, default: '' },
      endDate: { type: String, default: '' },
      current: { type: Boolean, default: false },
      description: { type: String, default: '' }
    }
  ],
  projects: [
    {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      technologies: [{ type: String }],
      githubUrl: { type: String, default: '' },
      demoUrl: { type: String, default: '' },
      role: { type: String, default: '' },
      duration: { type: String, default: '' }
    }
  ],
  certifications: [
    {
      title: { type: String, default: '' },
      issuer: { type: String, default: '' },
      issueDate: { type: String, default: '' },
      credentialUrl: { type: String, default: '' }
    }
  ],
  achievements: [
    {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      date: { type: String, default: '' }
    }
  ],
  languages: [
    {
      name: { type: String, default: '' },
      proficiency: { type: String, default: 'Professional' }
    }
  ],
  preferences: {
    targetRoles: [{ type: String }],
    preferredLocations: [{ type: String }],
    expectedSalaryMin: { type: Number, default: 600000 }
  },
  savedJobs: [{ type: String }],
  profileCompletion: { type: Number, default: 0 },
  placementReadiness: {
    score: { type: Number, default: 0 },
    breakdown: {
      profileScore: { type: Number, default: 0 },
      resumeScore: { type: Number, default: 0 },
      skillsScore: { type: Number, default: 0 },
      projectsScore: { type: Number, default: 0 },
      certsScore: { type: Number, default: 0 },
      interviewScore: { type: Number, default: 0 },
      roadmapScore: { type: Number, default: 0 }
    },
    recommendations: [{ type: String }]
  },
  updatedAt: { type: Date, default: Date.now }
});

// Helper function to calculate Profile Completion %
// completed sections / total sections * 100
function calculateProfileCompletion(profile) {
  let completed = 0;
  const total = 8;

  // 1. Personal
  if (profile.personal?.fullName && (profile.personal?.phone || profile.personal?.location)) completed++;
  // 2. Academic
  if (profile.academic?.degree && profile.academic?.branch && profile.academic?.cgpa) completed++;
  // 3. Skills
  if (profile.skills && profile.skills.length > 0) completed++;
  // 4. Experience
  if (profile.experience && profile.experience.length > 0) completed++;
  // 5. Projects
  if (profile.projects && profile.projects.length > 0) completed++;
  // 6. Certifications
  if (profile.certifications && profile.certifications.length > 0) completed++;
  // 7. Achievements
  if (profile.achievements && profile.achievements.length > 0) completed++;
  // 8. Languages
  if (profile.languages && profile.languages.length > 0) completed++;

  return Math.round((completed / total) * 100);
}

const StudentProfileModel = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);

module.exports = {
  StudentProfileModel,
  calculateProfileCompletion
};
