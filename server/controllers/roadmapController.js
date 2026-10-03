// server/controllers/roadmapController.js
const { RoadmapModel, calculateRoadmapProgress } = require('../models/Roadmap');
const { StudentProfileModel } = require('../models/StudentProfile');
const { SEED_ROADMAPS } = require('../config/seedData');

// @desc    Get student career roadmaps
// @route   GET /api/roadmaps
// @access  Private (Student)
const getMyRoadmaps = async (req, res) => {
  try {
    let roadmaps = await RoadmapModel.find({ studentId: req.user._id });

    if (roadmaps.length === 0) {
      // Auto-populate initial fullstack roadmap
      const defaultRm = SEED_ROADMAPS[0];
      const created = await RoadmapModel.create({
        studentId: req.user._id,
        roleId: defaultRm.roleId,
        roleTitle: defaultRm.roleTitle,
        description: defaultRm.description,
        targetSkills: defaultRm.targetSkills,
        stages: defaultRm.stages,
        overallProgress: 45
      });
      roadmaps = [created];
    }

    return res.status(200).json({
      success: true,
      data: roadmaps
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      data: null
    });
  }
};

// @desc    Select target role & compute Skill Gap (FR10)
// @route   POST /api/roadmaps/select-role
// @access  Private (Student)
const selectTargetRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const template = SEED_ROADMAPS.find(r => r.roleId === roleId) || SEED_ROADMAPS[0];

    // Compute Skill Gap: Required Skills - Current Skills
    const profile = await StudentProfileModel.findOne({ userId: req.user._id });
    const currentSkills = (profile?.skills || []).map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

    const missingSkills = [];
    const acquiredSkills = [];

    template.targetSkills.forEach(reqSk => {
      if (currentSkills.some(cs => cs.includes(reqSk.toLowerCase()) || reqSk.toLowerCase().includes(cs))) {
        acquiredSkills.push(reqSk);
      } else {
        missingSkills.push(reqSk);
      }
    });

    // Check if student already has this roadmap
    let roadmap = await RoadmapModel.findOne({ studentId: req.user._id, roleId: template.roleId });

    if (!roadmap) {
      roadmap = await RoadmapModel.create({
        studentId: req.user._id,
        roleId: template.roleId,
        roleTitle: template.roleTitle,
        description: template.description,
        targetSkills: template.targetSkills,
        stages: template.stages,
        overallProgress: calculateRoadmapProgress(template.stages)
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Role roadmap generated with skill gap analysis.',
      data: {
        roadmap,
        skillGap: {
          targetRole: template.roleTitle,
          requiredSkills: template.targetSkills,
          acquiredSkills,
          missingSkills,
          gapPercentage: Math.round((missingSkills.length / template.targetSkills.length) * 100)
        }
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

// @desc    Update progress status of a roadmap item (Not Started, Learning, Completed)
// @route   PUT /api/roadmaps/:id/item-status
// @access  Private (Student)
const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemId, status } = req.body; // status: 'Not Started' | 'Learning' | 'Completed'

    const roadmap = await RoadmapModel.findById(id);
    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    let found = false;
    const stages = roadmap.stages || [];
    for (const stage of stages) {
      for (const item of stage.items) {
        if (item.id === itemId) {
          item.status = status;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const overallProgress = calculateRoadmapProgress(stages);

    const updated = await RoadmapModel.findByIdAndUpdate(
      id,
      { stages, overallProgress, updatedAt: new Date().toISOString() },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: `Item marked as ${status}.`,
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
  getMyRoadmaps,
  selectTargetRole,
  updateItemStatus
};
