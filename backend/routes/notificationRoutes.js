import { Router } from 'express';
import { 
  getNotifications, 
  markAsRead, 
  getUnreadCount 
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(requireAuth);

/**
 * GET /api/notifications
 * Get user notifications
 */
router.get('/', getNotifications);

/**
 * GET /api/notifications/unread-count
 * Get unread notification count
 */
router.get('/unread-count', getUnreadCount);

/**
 * PUT /api/notifications/:id/read
 * Mark notification as read
 */
router.put('/:id/read', markAsRead);

export default router;
