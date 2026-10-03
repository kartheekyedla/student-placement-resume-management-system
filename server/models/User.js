// server/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'recruiter', 'officer', 'admin'],
    default: 'student'
  },
  companyName: { type: String, default: '' }, // For recruiter
  department: { type: String, default: '' }, // For officer / student
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = UserModel;
