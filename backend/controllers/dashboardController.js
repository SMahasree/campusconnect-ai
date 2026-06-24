import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user.userId;

    const [totalLost, totalFound, totalReturned, totalClaims, userItems, userClaims] = await Promise.all([
      Item.countDocuments({ status: 'lost' }),
      Item.countDocuments({ status: 'found' }),
      Item.countDocuments({ returned: true }),
      Claim.countDocuments(),
      Item.countDocuments({ userId }),
      Claim.countDocuments({ userId })
    ]);

    return res.json({
      totals: {
        totalLostItems: totalLost,
        totalFoundItems: totalFound,
        totalReturnedItems: totalReturned,
        totalClaims
      },
      user: {
        userItems,
        userClaims
      }
    });
  } catch (err) {
    return next(err);
  }
}

