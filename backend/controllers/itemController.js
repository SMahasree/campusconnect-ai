import Item from '../models/Item.js';
import { BadRequest, NotFound } from '../utils/httpErrors.js';
import { analyzeDescription } from '../services/aiAnalyzerService.js';
import { notifyPotentialMatches } from '../services/matchingService.js';
import { awardPoints } from '../services/reputationService.js';

export async function createItem(req, res, next) {
  try {
    const { title, description, category, location, status } = req.body;

    const imageFile = req.file;
    const image = imageFile ? `/uploads/${imageFile.filename}` : undefined;

    const date = req.body.date;

    // Analyze description with AI
    const structuredData = await analyzeDescription(description);

    const item = await Item.create({
      title,
      description,
      category,
      location,
      status,
      image,
      date,
      userId: req.user.userId,
      structuredData
    });

    // Award points for posting
    await awardPoints(req.user.userId, 'ITEM_POSTED');

    // Find and notify potential matches
    await notifyPotentialMatches(item);

    return res.status(201).json(item);
  } catch (err) {
    return next(err);
  }
}

export async function getAllItems(req, res, next) {
  try {
    const { keyword, search, category, location, status } = req.query;

    const filter = {};

    // MVP spec: keyword; keep `search` as alias
    const term = keyword || search;
    if (term) {
      filter.title = { $regex: term, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }

    // Optionally return all items to allow matching across users.
    const items = await Item.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return next(err);
  }
}

export async function getItemById(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) throw new NotFound('Item not found');
    return res.json(item);
  } catch (err) {
    return next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) throw new NotFound('Item not found');

    // Only owner can update.
    if (String(item.userId) !== String(req.user.userId)) {
      throw new BadRequest('You can only update your own item');
    }

    const patch = {};
    const allowedFields = ['title', 'description', 'category', 'location', 'status', 'date'];
    for (const f of allowedFields) {
      if (req.body[f] !== undefined) patch[f] = req.body[f];
    }

    if (req.file) {
      patch.image = `/uploads/${req.file.filename}`;
    }

    // Re-analyze if description changed
    if (patch.description) {
      patch.structuredData = await analyzeDescription(patch.description);
    }

    const updated = await Item.findByIdAndUpdate(id, patch, { new: true });
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) throw new NotFound('Item not found');

    if (String(item.userId) !== String(req.user.userId)) {
      throw new BadRequest('You can only delete your own item');
    }

    await Item.findByIdAndDelete(id);

    return res.json({ message: 'Item deleted' });
  } catch (err) {
    return next(err);
  }
}

export async function markReturned(req, res, next) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) throw new NotFound('Item not found');

    // Only owner can mark returned.
    if (String(item.userId) !== String(req.user.userId)) {
      throw new BadRequest('You can only update return status for your own item');
    }

    if (item.returned) return res.json({ message: 'Item already marked returned', item });

    item.returned = true;
    await item.save();

    return res.json({ message: 'Item marked as returned', item });
  } catch (err) {
    return next(err);
  }
}

