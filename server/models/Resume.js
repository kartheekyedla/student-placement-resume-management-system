// server/models/Resume.js
const mongoose = require('mongoose');
const { createDualModel } = require('./dbAdapter');

const resumeSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true, ref: 'User' },
  title: { type: String, default: 'My Primary Resume' },
  template: {
    type: String,
    enum: ['Modern', 'Professional', 'Minimal', 'Software Developer', 'Fresher'],
    default: 'Modern'
  },
  resumeData: { type: mongoose.Schema.Types.Mixed, default: {} },
  pdfUrl: { type: String, default: '' },
  extractedText: { type: String, default: '' },
  overallScore: { type: Number, default: 0 },
  scoreBreakdown: {
    skillsScore: { type: Number, default: 0 },
    projectsScore: { type: Number, default: 0 },
    educationScore: { type: Number, default: 0 },
    keywordsScore: { type: Number, default: 0 },
    completenessScore: { type: Number, default: 0 }
  },
  missingKeywords: [{ type: String }],
  suggestions: [{ type: String }],
  disclaimer: {
    type: String,
    default: 'Notice: This is a system-generated rule-based assessment and not an official third-party ATS accreditation score.'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Rule-based Resume Analyzer (FR5 & FR6)
function analyzeResumeContent(resumeData, targetJob = null) {
  const data = resumeData || {};
  let skillsScore = 0;
  let projectsScore = 0;
  let educationScore = 0;
  let keywordsScore = 0;
  let completenessScore = 0;
  const missingKeywords = [];
  const suggestions = [];

  // 1. Completeness Evaluation (20 max)
  let sectionsPresent = 0;
  if (data.personalInfo?.fullName && data.personalInfo?.email) sectionsPresent++;
  if (data.summary && data.summary.trim().length > 30) sectionsPresent++;
  if (data.education && data.education.length > 0) sectionsPresent++;
  if (data.skills && (data.skills.technical?.length > 0 || Array.isArray(data.skills))) sectionsPresent++;
  if (data.projects && data.projects.length > 0) sectionsPresent++;
  if (data.experience && data.experience.length > 0) sectionsPresent++;
  completenessScore = Math.min(20, Math.round((sectionsPresent / 6) * 20));

  if (!data.summary || data.summary.trim().length <= 30) {
    suggestions.push('Add an impactful 2-3 line Professional Summary highlighting your career focus.');
  }

  // 2. Skills Analysis (25 max)
  const allTechSkills = Array.isArray(data.skills)
    ? data.skills.map(s => (typeof s === 'string' ? s : s.name))
    : [...(data.skills?.technical || []), ...(data.skills?.tools || [])];

  if (allTechSkills.length >= 8) skillsScore = 25;
  else if (allTechSkills.length >= 4) skillsScore = 18;
  else if (allTechSkills.length > 0) skillsScore = 12;
  else {
    skillsScore = 0;
    suggestions.push('Add at least 5-8 relevant core technical skills and developer tools.');
  }

  // 3. Projects Evaluation (25 max)
  const projectsList = data.projects || [];
  if (projectsList.length >= 3) projectsScore = 25;
  else if (projectsList.length >= 2) projectsScore = 20;
  else if (projectsList.length === 1) projectsScore = 12;
  else {
    projectsScore = 0;
    suggestions.push('Showcase at least 2 significant projects with GitHub URLs, live links, and tech stacks.');
  }

  // Check project descriptions for metrics/verbs
  const hasActionVerbs = projectsList.some(p => {
    const desc = (p.description || '').toLowerCase();
    return desc.includes('built') || desc.includes('implemented') || desc.includes('engineered') || desc.includes('developed');
  });
  if (!hasActionVerbs && projectsList.length > 0) {
    suggestions.push('Use strong action verbs (e.g. Developed, Architected, Optimized) in project descriptions.');
  }

  // 4. Education (15 max)
  const eduList = data.education || [];
  if (eduList.length > 0 && eduList[0].degree && eduList[0].institution) {
    educationScore = 15;
  } else {
    educationScore = 5;
    suggestions.push('Include complete university details, degree, branch, and current CGPA.');
  }

  // 5. Industry Keywords & Target Job Comparison (15 max)
  const standardIndustryKeywords = [
    'Git', 'REST API', 'Agile', 'Debugging', 'Full-Stack', 'Data Structures', 'Algorithms',
    'CI/CD', 'Problem Solving', 'Unit Testing'
  ];

  let targetSkillsToCompare = standardIndustryKeywords;
  if (targetJob && targetJob.requiredSkills && targetJob.requiredSkills.length > 0) {
    targetSkillsToCompare = targetJob.requiredSkills;
  }

  let matchedKeywordsCount = 0;
  const flatResumeText = JSON.stringify(data).toLowerCase();

  targetSkillsToCompare.forEach(kw => {
    if (flatResumeText.includes(kw.toLowerCase())) {
      matchedKeywordsCount++;
    } else {
      missingKeywords.push(kw);
    }
  });

  const kwMatchRatio = targetSkillsToCompare.length > 0 ? (matchedKeywordsCount / targetSkillsToCompare.length) : 0.8;
  keywordsScore = Math.min(15, Math.round(kwMatchRatio * 15));

  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding target keywords: ${missingKeywords.slice(0, 4).join(', ')}.`);
  }

  const overallScore = Math.min(100, Math.round(skillsScore + projectsScore + educationScore + keywordsScore + completenessScore));

  return {
    overallScore,
    scoreBreakdown: {
      skillsScore,
      projectsScore,
      educationScore,
      keywordsScore,
      completenessScore
    },
    missingKeywords: missingKeywords.slice(0, 8),
    suggestions: suggestions.slice(0, 5),
    disclaimer: 'Notice: This is a system-generated rule-based assessment and not an official third-party ATS accreditation score.'
  };
}

const ResumeModel = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

module.exports = {
  ResumeModel,
  analyzeResumeContent
};
