import Notification from '../models/Notification.js';

/**
 * Notification Service
 */

export async function createNotification(data) {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    return null;
  }
}

export async function getUserNotifications(userId, limit = 20) {
  try {
    const notifications = await Notification.find({ userId })
      .populate('itemId')
      .populate('matchedItemId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return notifications;
  } catch (err) {
    console.error('Error getting notifications:', err);
    return [];
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  } catch (err) {
    console.error('Error marking notification as read:', err);
    return null;
  }
}

export async function getUnreadCount(userId) {
  try {
    return await Notification.countDocuments({ userId, read: false });
  } catch (err) {
    console.error('Error getting unread count:', err);
    return 0;
  }
}
