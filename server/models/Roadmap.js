// server/models/Roadmap.js
const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true, ref: 'User' },
  roleId: { type: String, required: true },
  roleTitle: { type: String, required: true },
  description: { type: String, default: '' },
  targetSkills: [{ type: String }],
  stages: [
    {
      stageId: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, default: 1 },
      items: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          category: { type: String, default: 'Concept' }, // Concept, Tool, Project, Skill
          status: {
            type: String,
            enum: ['Not Started', 'Learning', 'Completed'],
            default: 'Not Started'
          },
          learningResource: { type: String, default: '' },
          estimatedHours: { type: Number, default: 10 }
        }
      ]
    }
  ],
  overallProgress: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

// Helper to compute progress: completed items / total items * 100
function calculateRoadmapProgress(stages) {
  let totalItems = 0;
  let completedItems = 0;
  let learningItems = 0;

  (stages || []).forEach(stage => {
    (stage.items || []).forEach(item => {
      totalItems++;
      if (item.status === 'Completed') completedItems++;
      else if (item.status === 'Learning') learningItems += 0.5;
    });
  });

  if (totalItems === 0) return 0;
  return Math.round(((completedItems + learningItems) / totalItems) * 100);
}

const RoadmapModel = mongoose.models.Roadmap || mongoose.model('Roadmap', roadmapSchema);

module.exports = {
  RoadmapModel,
  calculateRoadmapProgress
};
