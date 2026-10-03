// server/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['job', 'application', 'interview', 'drive', 'resume', 'system'],
    default: 'system'
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = NotificationModel;
