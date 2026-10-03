// server/controllers/notificationController.js
const NotificationModel = require('../models/Notification');

// @desc    Get user notifications (FR19)
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const list = await NotificationModel.find({ userId: req.user._id });
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const unreadCount = list.filter(n => !n.isRead).length;

    return res.status(200).json({
      success: true,
      unreadCount,
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

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const updated = await NotificationModel.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const list = await NotificationModel.find({ userId: req.user._id });
    for (const item of list) {
      await NotificationModel.findByIdAndUpdate(item._id, { isRead: true });
    }
    return res.status(200).json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    await NotificationModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Notification deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
};
