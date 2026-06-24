import { findPotentialMatches } from '../services/matchingService.js';

export async function getMatches(req, res, next) {
  try {
    const { itemType } = req.query; // lost|found

    const matches = await findPotentialMatches({
      itemType
    });

    return res.json({
      count: matches.length,
      matches
    });
  } catch (err) {
    return next(err);
  }
}

