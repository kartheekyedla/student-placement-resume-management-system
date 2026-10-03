// server/models/Drive.js
const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, default: '' },
  roleOffered: { type: String, required: true },
  packageDetails: { type: String, default: '8.5 - 14.0 LPA' },
  description: { type: String, default: '' },
  eligibilityCriteria: {
    minCgpa: { type: Number, default: 7.0 },
    allowedBranches: [{ type: String }],
    requiredSkills: [{ type: String }],
    maxBacklogs: { type: Number, default: 0 },
    batchYear: { type: Number, default: 2026 }
  },
  driveDate: { type: String, required: true },
  venue: { type: String, default: 'Placement Auditorium & Online Portal' },
  deadline: { type: String, required: true },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  registeredStudents: [
    {
      studentId: { type: String, required: true },
      studentName: { type: String, default: '' },
      registeredAt: { type: Date, default: Date.now }
    }
  ],
  eligibleCount: { type: Number, default: 0 },
  createdBy: { type: String, default: 'Placement Cell' },
  createdAt: { type: Date, default: Date.now }
});

const DriveModel = mongoose.models.Drive || mongoose.model('Drive', driveSchema);

module.exports = DriveModel;
