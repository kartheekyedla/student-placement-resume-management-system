// server/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  studentId: { type: String, required: true, ref: 'User' },
  studentName: { type: String, default: '' },
  studentEmail: { type: String, default: '' },
  studentBranch: { type: String, default: '' },
  studentCgpa: { type: Number, default: 0 },
  jobId: { type: String, required: true, ref: 'Job' },
  jobTitle: { type: String, default: '' },
  companyName: { type: String, default: '' },
  resumeId: { type: String, default: '' },
  status: {
    type: String,
    enum: [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Assessment Scheduled',
      'Technical Interview',
      'HR Interview',
      'Selected',
      'Rejected'
    ],
    default: 'Applied'
  },
  statusHistory: [
    {
      status: { type: String, required: true },
      note: { type: String, default: '' },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: String, default: 'System' }
    }
  ],
  matchScore: { type: Number, default: 0 },
  matchBreakdown: { type: Object, default: {} },
  interview: {
    scheduledDate: { type: String, default: '' },
    scheduledTime: { type: String, default: '' },
    interviewType: { type: String, default: 'Technical Interview' },
    locationOrLink: { type: String, default: 'Google Meet / On-Campus Hall A' },
    notes: { type: String, default: '' },
    isReminderSent: { type: Boolean, default: false }
  },
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ApplicationModel = mongoose.models.Application || mongoose.model('Application', applicationSchema);

module.exports = ApplicationModel;
