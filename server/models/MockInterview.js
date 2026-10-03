// server/models/MockInterview.js
const mongoose = require('mongoose');
const { createDualModel } = require('./dbAdapter');

const mockInterviewSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true, ref: 'User' },
  category: {
    type: String,
    enum: ['HR', 'Java', 'Python', 'JavaScript', 'SQL', 'DBMS', 'OOP', 'DSA', 'Web Development', 'Project'],
    required: true
  },
  title: { type: String, default: 'Technical Mock Assessment' },
  answers: [
    {
      questionId: { type: String, required: true },
      questionText: { type: String, required: true },
      expectedKeywords: [{ type: String }],
      studentAnswer: { type: String, default: '' },
      score: { type: Number, default: 0 }, // 0 to 100
      matchedKeywords: [{ type: String }],
      missingKeywords: [{ type: String }],
      feedback: { type: String, default: '' },
      lengthWordCount: { type: Number, default: 0 }
    }
  ],
  totalQuestions: { type: Number, default: 5 },
  answeredCount: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  topicCoverage: { type: Number, default: 0 },
  improvementAreas: [{ type: String }],
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'Completed'
  },
  completedAt: { type: Date, default: Date.now }
});

// Rule-based answer evaluation (FR12)
function evaluateMockAnswer(answerText, expectedKeywords = [], minWords = 25) {
  if (!answerText || answerText.trim().length === 0) {
    return {
      score: 0,
      matchedKeywords: [],
      missingKeywords: expectedKeywords,
      feedback: 'No answer provided. Please articulate your response clearly with relevant technical concepts.',
      wordCount: 0
    };
  }

  const words = answerText.trim().split(/\s+/);
  const wordCount = words.length;
  const lowerAnswer = answerText.toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];

  expectedKeywords.forEach(kw => {
    if (lowerAnswer.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  // Score components:
  // 1. Keyword coverage: 60%
  const kwRatio = expectedKeywords.length > 0 ? (matchedKeywords.length / expectedKeywords.length) : 0.8;
  const kwScore = kwRatio * 60;

  // 2. Length/Depth of explanation: 30%
  let lengthScore = 0;
  if (wordCount >= minWords) lengthScore = 30;
  else if (wordCount >= Math.floor(minWords / 2)) lengthScore = 18;
  else lengthScore = 8;

  // 3. Technical clarity / structure: 10%
  const hasStructure = answerText.includes('.') && (wordCount > 15);
  const structureScore = hasStructure ? 10 : 4;

  const totalScore = Math.min(100, Math.round(kwScore + lengthScore + structureScore));

  let feedback = '';
  if (totalScore >= 80) {
    feedback = 'Excellent answer! Strong conceptual depth and comprehensive keyword coverage.';
  } else if (totalScore >= 60) {
    feedback = `Good attempt. To achieve top marks, incorporate missing core terms: ${missingKeywords.slice(0, 3).join(', ')}.`;
  } else {
    feedback = `Needs improvement. Your answer lacks critical depth. Include key concepts like: ${missingKeywords.slice(0, 4).join(', ')}.`;
  }

  return {
    score: totalScore,
    matchedKeywords,
    missingKeywords,
    feedback,
    wordCount
  };
}

// Holistic Placement Readiness Calculation (FR11)
// Out of 100 points:
// 1. Profile Completion: 15%
// 2. Resume Assessment: 20%
// 3. Skills Strength: 15%
// 4. Projects Portfolio: 15%
// 5. Certifications: 10%
// 6. Mock Interview Practice: 15%
// 7. Career Roadmap Progress: 10%
function computePlacementReadiness(profile, resumeScore = 0, interviewScore = 0, roadmapScore = 0) {
  const pCompletion = profile?.profileCompletion || 0;
  const profileScore = Math.round((pCompletion / 100) * 15);

  const resScore = Math.round(((resumeScore || 65) / 100) * 20);

  const skillsCount = (profile?.skills || []).length;
  const skillsScore = Math.min(15, Math.round((skillsCount / 8) * 15));

  const projectsCount = (profile?.projects || []).length;
  const projectsScore = Math.min(15, Math.round((projectsCount / 3) * 15));

  const certsCount = (profile?.certifications || []).length;
  const certsScore = Math.min(10, Math.round((certsCount / 2) * 10));

  const intScore = Math.round(((interviewScore || 50) / 100) * 15);

  const roadScore = Math.round(((roadmapScore || 40) / 100) * 10);

  const totalReadiness = Math.min(100, profileScore + resScore + skillsScore + projectsScore + certsScore + intScore + roadScore);

  const recommendations = [];
  if (pCompletion < 80) recommendations.push('Complete your academic and personal profile details to reach 100% completion.');
  if (resScore < 15) recommendations.push('Improve your resume ATS score by adding missing skills and detailed project summaries.');
  if (projectsCount < 2) recommendations.push('Add at least 2 full-stack or domain projects with live demo and GitHub links.');
  if (interviewScore < 60) recommendations.push('Practice at least 2-3 mock interview question sets to build verbal confidence.');
  if (roadmapScore < 50) recommendations.push('Advance your target career roadmap modules from Learning to Completed.');

  return {
    score: totalReadiness,
    breakdown: {
      profileScore: { current: profileScore, max: 15 },
      resumeScore: { current: resScore, max: 20 },
      skillsScore: { current: skillsScore, max: 15 },
      projectsScore: { current: projectsScore, max: 15 },
      certsScore: { current: certsScore, max: 10 },
      interviewScore: { current: intScore, max: 15 },
      roadmapScore: { current: roadScore, max: 10 }
    },
    recommendations: recommendations.slice(0, 4),
    disclaimer: 'Notice: SmartHire Placement Readiness is an internal self-assessment metric and not a guarantee of employment.'
  };
}

const MockInterviewModel = mongoose.models.MockInterview || mongoose.model('MockInterview', mockInterviewSchema);

module.exports = {
  MockInterviewModel,
  evaluateMockAnswer,
  computePlacementReadiness
};
