import mongoose from 'mongoose';

/**
 * Claim request for found items.
 *
 * Only for items with status='found'.
 */
const claimSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // pending | approved | rejected
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    // Optional extra details
    message: { type: String, trim: true }
  },
  { timestamps: true }
);

// One claim per user per item
claimSchema.index({ itemId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Claim', claimSchema);

