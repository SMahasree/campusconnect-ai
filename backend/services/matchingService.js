import Item from '../models/Item.js';
import Notification from '../models/Notification.js';

/**
 * Enhanced Matching Service with improved scoring algorithm
 */

function tokenize(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function jaccardSimilarity(aTokens, bTokens) {
  const a = new Set(aTokens);
  const b = new Set(bTokens);

  const intersection = [...a].filter(x => b.has(x)).length;
  const union = new Set([...a, ...b]).size;

  if (union === 0) return 0;
  return intersection / union;
}

/**
 * Calculate location proximity (0-1, where 1 is exact match)
 */
function locationSimilarity(loc1, loc2) {
  if (!loc1 || !loc2) return 0;
  
  const t1 = tokenize(loc1);
  const t2 = tokenize(loc2);
  
  return jaccardSimilarity(t1, t2);
}

/**
 * Time proximity scoring (recent items are more likely to match)
 */
function timeProximityScore(date1, date2) {
  if (!date1 || !date2) return 0.5;
  
  const diff = Math.abs(new Date(date1) - new Date(date2)) / (1000 * 60 * 60 * 24); // days
  
  // Items within 7 days get higher score
  if (diff <= 7) return 1 - (diff / 7) * 0.3;
  if (diff <= 30) return 0.7 - ((diff - 7) / 23) * 0.3;
  return 0.4;
}

/**
 * Enhanced matching with weighted scoring
 */
export async function findPotentialMatches({
  limit = 20,
  threshold = 0.35,
  itemType = 'lost'
} = {}) {
  const queryType = itemType === 'found' ? 'found' : 'lost';
  const targetType = queryType === 'lost' ? 'found' : 'lost';

  const queryItems = await Item.find({ status: queryType, returned: false }).lean();
  const targetItems = await Item.find({ status: targetType, returned: false }).lean();

  const suggestions = [];

  for (const q of queryItems) {
    const qTokens = tokenize(`${q.title} ${q.description}`);

    for (const t of targetItems) {
      const tTokens = tokenize(`${t.title} ${t.description}`);

      // Weighted scoring
      const textMatch = jaccardSimilarity(qTokens, tTokens);
      const locationMatch = locationSimilarity(q.location, t.location);
      const timeMatch = timeProximityScore(q.date || q.createdAt, t.date || t.createdAt);
      const categoryMatch = (q.category?.toLowerCase() === t.category?.toLowerCase()) ? 1 : 0;

      // Weighted combination
      const score = 
        (textMatch * 0.5) +
        (locationMatch * 0.25) +
        (timeMatch * 0.15) +
        (categoryMatch * 0.1);

      if (score >= threshold) {
        const reason = [];
        if (textMatch > 0.3) reason.push(`Similar description (${(textMatch * 100).toFixed(0)}%)`);
        if (locationMatch > 0.3) reason.push(`Same area (${(locationMatch * 100).toFixed(0)}%)`);
        if (timeMatch > 0.7) reason.push('Recent reports');
        if (categoryMatch) reason.push('Same category');

        suggestions.push({
          lostOrFoundItem: { 
            _id: q._id, 
            title: q.title, 
            description: q.description, 
            status: q.status,
            location: q.location,
            date: q.date,
            structuredData: q.structuredData
          },
          matchItem: { 
            _id: t._id, 
            title: t.title, 
            description: t.description, 
            status: t.status,
            location: t.location,
            date: t.date,
            structuredData: t.structuredData
          },
          similarity: Number(score.toFixed(4)),
          reason: reason.join(' | ')
        });
      }
    }
  }

  suggestions.sort((a, b) => b.similarity - a.similarity);
  return suggestions.slice(0, limit);
}

/**
 * Find matches for a newly created item and create notifications
 */
export async function notifyPotentialMatches(newItem) {
  try {
    const matches = await findPotentialMatches({
      limit: 5,
      threshold: 0.4,
      itemType: newItem.status
    });

    const notifications = [];

    for (const match of matches) {
      const targetItem = match.matchItem;
      
      // Notify the target item owner
      const notification = await Notification.create({
        userId: targetItem.userId || targetItem.userId,
        itemId: targetItem._id,
        matchedItemId: newItem._id,
        type: 'potential_match',
        title: `Potential Match Found! ${(match.similarity * 100).toFixed(0)}%`,
        message: `A ${newItem.status} item was posted that may match: "${newItem.title}"`,
        matchScore: match.similarity,
        reason: match.reason,
        actionUrl: `/items/${newItem._id}`
      });

      notifications.push(notification);
    }

    return notifications;
  } catch (err) {
    console.error('Error creating match notifications:', err);
    return [];
  }
}


