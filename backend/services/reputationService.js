import User from '../models/User.js';

/**
 * Reputation/Points System Service
 */

export const POINTS = {
  ITEM_RETURNED: 50,          // Found item returned
  CLAIM_VERIFIED: 20,         // Verified a claim
  ITEM_POSTED: 5,             // Posted an item
  CLAIM_APPROVED: 15          // Claim was approved by owner
};

/**
 * Award points to user for action
 */
export async function awardPoints(userId, action, pointValue = null) {
  try {
    const points = pointValue || POINTS[action] || 0;
    
    if (points === 0) return null;

    const update = { $inc: { pointsEarned: points, reputation: points } };

    // Track specific actions
    switch (action) {
      case 'ITEM_RETURNED':
        update.$inc.itemsReturned = 1;
        break;
      case 'CLAIM_VERIFIED':
        update.$inc.claimsVerified = 1;
        break;
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    return user;
  } catch (err) {
    console.error('Error awarding points:', err);
    return null;
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(limit = 10) {
  try {
    const leaderboard = await User.find()
      .select('name email reputation pointsEarned itemsReturned claimsVerified')
      .sort({ reputation: -1 })
      .limit(limit)
      .lean();

    return leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user
    }));
  } catch (err) {
    console.error('Error getting leaderboard:', err);
    return [];
  }
}

/**
 * Get user stats
 */
export async function getUserStats(userId) {
  try {
    const user = await User.findById(userId).select(
      'name email reputation pointsEarned itemsReturned claimsVerified'
    ).lean();

    return user;
  } catch (err) {
    console.error('Error getting user stats:', err);
    return null;
  }
}
