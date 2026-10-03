// server/controllers/interviewController.js
const {
  MockInterviewModel,
  evaluateMockAnswer,
  computePlacementReadiness
} = require('../models/MockInterview');
const { StudentProfileModel } = require('../models/StudentProfile');
const { ResumeModel } = require('../models/Resume');
const { RoadmapModel } = require('../models/Roadmap');
const { MOCK_QUESTIONS } = require('../config/seedData');

// @desc    Get questions for selected category (FR12)
// @route   GET /api/interviews/questions/:category
// @access  Private (Student)
const getQuestionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const questions = MOCK_QUESTIONS[category] || MOCK_QUESTIONS['JavaScript'];

    return res.status(200).json({
      success: true,
      category,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Evaluate student answer in real-time (FR12: Rule-based)
// @route   POST /api/interviews/evaluate-single
// @access  Private (Student)
const evaluateSingleAnswer = async (req, res) => {
  try {
    const { questionId, category, studentAnswer } = req.body;
    const catQuestions = MOCK_QUESTIONS[category] || [];
    const questionObj = catQuestions.find(q => q.id === questionId);

    const expectedKeywords = questionObj ? questionObj.expectedKeywords : ['concept', 'logic', 'implementation'];
    const minWords = questionObj ? questionObj.minWords : 25;

    const evalResult = evaluateMockAnswer(studentAnswer, expectedKeywords, minWords);

    return res.status(200).json({
      success: true,
      data: evalResult
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Submit complete interview session (FR12)
// @route   POST /api/interviews/submit-session
// @access  Private (Student)
const submitInterviewSession = async (req, res) => {
  try {
    const { category, answers, title } = req.body;

    let totalScore = 0;
    let answeredCount = 0;
    const improvementAreas = [];

    const evaluatedAnswers = (answers || []).map(ans => {
      const qObj = (MOCK_QUESTIONS[category] || []).find(q => q.id === ans.questionId);
      const evalRes = evaluateMockAnswer(ans.studentAnswer, qObj?.expectedKeywords || [], qObj?.minWords || 25);

      if (ans.studentAnswer && ans.studentAnswer.trim().length > 0) {
        answeredCount++;
        totalScore += evalRes.score;
      }

      if (evalRes.missingKeywords.length > 0) {
        improvementAreas.push(`Review ${category} concepts: ${evalRes.missingKeywords.slice(0, 2).join(', ')}`);
      }

      return {
        questionId: ans.questionId,
        questionText: ans.questionText || qObj?.question || '',
        expectedKeywords: qObj?.expectedKeywords || [],
        studentAnswer: ans.studentAnswer || '',
        score: evalRes.score,
        matchedKeywords: evalRes.matchedKeywords,
        missingKeywords: evalRes.missingKeywords,
        feedback: evalRes.feedback,
        lengthWordCount: evalRes.wordCount
      };
    });

    const averageScore = answeredCount > 0 ? Math.round(totalScore / answers.length) : 0;
    const topicCoverage = answers.length > 0 ? Math.round((answeredCount / answers.length) * 100) : 0;

    const interviewRecord = await MockInterviewModel.create({
      studentId: req.user._id,
      category,
      title: title || `${category} Technical Assessment`,
      answers: evaluatedAnswers,
      totalQuestions: answers.length,
      answeredCount,
      averageScore,
      topicCoverage,
      improvementAreas: [...new Set(improvementAreas)].slice(0, 4),
      status: 'Completed'
    });

    return res.status(201).json({
      success: true,
      message: 'Interview evaluation completed.',
      data: interviewRecord
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get past interview history
// @route   GET /api/interviews/history
// @access  Private (Student)
const getInterviewHistory = async (req, res) => {
  try {
    const list = await MockInterviewModel.find({ studentId: req.user._id });
    return res.status(200).json({
      success: true,
      data: list
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Get Placement Readiness Index (FR11)
// @route   GET /api/interviews/placement-readiness
// @access  Private (Student)
const getPlacementReadiness = async (req, res) => {
  try {
    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const resumes = await ResumeModel.find({ studentId: req.user._id });
    const latestResume = resumes[resumes.length - 1];
    const roadmaps = await RoadmapModel.find({ studentId: req.user._id });
    const latestRoadmap = roadmaps[0];
    const interviews = await MockInterviewModel.find({ studentId: req.user._id });
    const avgInterview = interviews.length > 0
      ? Math.round(interviews.reduce((acc, i) => acc + (i.averageScore || 0), 0) / interviews.length)
      : 70;

    const readiness = computePlacementReadiness(
      profile,
      latestResume?.overallScore || 75,
      avgInterview,
      latestRoadmap?.overallProgress || 50
    );

    return res.status(200).json({
      success: true,
      data: readiness
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
  getQuestionsByCategory,
  evaluateSingleAnswer,
  submitInterviewSession,
  getInterviewHistory,
  getPlacementReadiness
};
