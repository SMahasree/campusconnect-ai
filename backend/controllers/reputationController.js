import { getLeaderboard, getUserStats } from '../services/reputationService.js';

/**
 * Leaderboard controller
 */

export async function getTopUsers(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const leaderboard = await getLeaderboard(limit);
    return res.json({ leaderboard, count: leaderboard.length });
  } catch (err) {
    return next(err);
  }
}

export async function getUserReputation(req, res, next) {
  try {
    const userId = req.params.userId || req.user.userId;
    const stats = await getUserStats(userId);
    
    if (!stats) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(stats);
  } catch (err) {
    return next(err);
  }
}
