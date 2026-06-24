import mongoose from 'mongoose';

/**
 * Verification model for item verification workflow
 */
const verificationSchema = new mongoose.Schema(
  {
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    
    // Who is verifying
    finderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Proof from finder/claimant
    proofPhoto: String,
    proofDescription: String,
    
    // Owner can approve or reject
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    ownerNotes: String,
    
    verificationDate: Date
  },
  { timestamps: true }
);

export default mongoose.model('Verification', verificationSchema);
