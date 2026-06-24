import Verification from '../models/Verification.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';
import { NotFound, Forbidden, BadRequest } from '../utils/httpErrors.js';
import { awardPoints } from '../services/reputationService.js';

/**
 * Verification controller
 */

export async function createVerification(req, res, next) {
  try {
    const { claimId, proofDescription } = req.body;
    const proofFile = req.file;

    const claim = await Claim.findById(claimId).populate('itemId');
    if (!claim) throw new NotFound('Claim not found');

    const item = claim.itemId;
    if (String(item.userId) !== String(req.user.userId)) {
      throw new Forbidden('You can only verify claims on your items');
    }

    const verification = await Verification.create({
      claimId,
      itemId: item._id,
      finderUserId: claim.userId,
      ownerUserId: item.userId,
      proofPhoto: proofFile ? `/uploads/${proofFile.filename}` : null,
      proofDescription
    });

    return res.status(201).json(verification);
  } catch (err) {
    return next(err);
  }
}

export async function listVerifications(req, res, next) {
  try {
    const userId = req.user.userId;

    const verifications = await Verification.find({
      $or: [
        { ownerUserId: userId },
        { finderUserId: userId }
      ]
    })
      .populate('claimId')
      .populate('itemId')
      .sort({ createdAt: -1 })
      .lean();

    return res.json(verifications);
  } catch (err) {
    return next(err);
  }
}

export async function approveVerification(req, res, next) {
  try {
    const { id } = req.params;
    const { ownerNotes } = req.body;

    const verification = await Verification.findById(id).populate('itemId');
    if (!verification) throw new NotFound('Verification not found');

    // Only item owner can approve
    if (String(verification.ownerUserId) !== String(req.user.userId)) {
      throw new Forbidden('Only item owner can approve');
    }

    verification.status = 'approved';
    verification.ownerNotes = ownerNotes;
    verification.verificationDate = new Date();
    await verification.save();

    // Award points to finder for verified claim
    await awardPoints(verification.finderUserId, 'CLAIM_VERIFIED');
    
    // Mark item as returned
    await Item.findByIdAndUpdate(verification.itemId._id, { returned: true });

    // Award points to owner for returning item
    await awardPoints(verification.ownerUserId, 'ITEM_RETURNED');

    // Update claim status
    await Claim.findByIdAndUpdate(verification.claimId, { status: 'approved' });

    return res.json(verification);
  } catch (err) {
    return next(err);
  }
}

export async function rejectVerification(req, res, next) {
  try {
    const { id } = req.params;
    const { ownerNotes } = req.body;

    const verification = await Verification.findById(id);
    if (!verification) throw new NotFound('Verification not found');

    if (String(verification.ownerUserId) !== String(req.user.userId)) {
      throw new Forbidden('Only item owner can reject');
    }

    verification.status = 'rejected';
    verification.ownerNotes = ownerNotes;
    verification.verificationDate = new Date();
    await verification.save();

    // Update claim status
    await Claim.findByIdAndUpdate(verification.claimId, { status: 'rejected' });

    return res.json(verification);
  } catch (err) {
    return next(err);
  }
}
