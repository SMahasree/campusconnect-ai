import { Router } from 'express';
import { getTopUsers, getUserReputation } from '../controllers/reputationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * GET /api/reputation/leaderboard
 * Get top users by reputation
 */
router.get('/leaderboard', getTopUsers);

/**
 * GET /api/reputation/me
 * GET /api/reputation/:userId
 * Get user reputation stats
 */
router.get('/me', requireAuth, (req, res, next) => {
  req.params.userId = req.user.userId;
  getUserReputation(req, res, next);
});

router.get('/:userId', requireAuth, getUserReputation);

export default router;
