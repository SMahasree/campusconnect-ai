import Claim from '../models/Claim.js';
import Item from '../models/Item.js';
import { BadRequest, Forbidden, NotFound } from '../utils/httpErrors.js';

export async function createClaim(req, res, next) {
  try {
    const { itemId, message } = req.body;

    const item = await Item.findById(itemId);
    if (!item) throw new NotFound('Item not found');

    if (item.status !== 'found') {
      throw new BadRequest('Claims are only allowed for found items');
    }

    if (String(item.userId) === String(req.user.userId)) {
      throw new BadRequest('You cannot claim your own found item');
    }

    const claim = await Claim.create({ itemId, userId: req.user.userId, message });

    return res.status(201).json(claim);
  } catch (err) {
    // Handle unique index conflict (one claim per user per item)
    if (err && err.code === 11000) {
      return res.status(400).json({ message: 'Claim already submitted for this item' });
    }
    return next(err);
  }
}

export async function listClaims(req, res, next) {
  try {
    // Return both: claims you made + claims on your items.
    // For simplicity: all claims where either claim.userId or item.userId is current user.

    const claims = await Claim.find().populate('itemId').populate('userId');
    const filtered = claims.filter(c => {
      const itemOwnerId = c.itemId?.userId ? String(c.itemId.userId) : null;
      return String(c.userId._id) === String(req.user.userId) || itemOwnerId === String(req.user.userId);
    });

    return res.json(filtered);
  } catch (err) {
    return next(err);
  }
}

export async function updateClaim(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const claim = await Claim.findById(id).populate('itemId');
    if (!claim) throw new NotFound('Claim not found');

    const item = claim.itemId;

    // Only owner of the claimed found item can approve/reject.
    if (String(item.userId) !== String(req.user.userId)) {
      throw new Forbidden('You can only approve/reject claims for your items');
    }

    claim.status = status;
    await claim.save();

    return res.json(claim);
  } catch (err) {
    return next(err);
  }
}

