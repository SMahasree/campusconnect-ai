import mongoose from 'mongoose';

/**
 * Notification model for smart alerts
 */
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    matchedItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    
    // Type: potential_match, claim_update, item_verified, etc.
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    
    // Match confidence
    matchScore: { type: Number },
    reason: String,
    
    read: { type: Boolean, default: false },
    actionUrl: String
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
