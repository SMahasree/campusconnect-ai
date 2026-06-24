import { 
  getUserNotifications, 
  markNotificationAsRead, 
  getUnreadCount as getUnreadCountService
} from '../services/notificationService.js';
import { NotFound } from '../utils/httpErrors.js';

/**
 * Notification controller
 */

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.userId;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    
    const notifications = await getUserNotifications(userId, limit);
    const unreadCount = await getUnreadCountService(userId);

    return res.json({ 
      notifications, 
      unreadCount,
      count: notifications.length 
    });
  } catch (err) {
    return next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { id } = req.params;
    
    const notification = await markNotificationAsRead(id);
    if (!notification) throw new NotFound('Notification not found');

    return res.json(notification);
  } catch (err) {
    return next(err);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const userId = req.user.userId;
    const count = await getUnreadCountService(userId);
    return res.json({ unreadCount: count });
  } catch (err) {
    return next(err);
  }
}
