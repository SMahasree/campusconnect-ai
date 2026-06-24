import mongoose from 'mongoose';

/**
 * Lost & Found Item model with verification and matching
 */
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },

    // 'lost' | 'found'
    status: { type: String, enum: ['lost', 'found'], required: true },

    // multer stores filename; we store relative path.
    image: { type: String },

    // date user entered (optional). If omitted: use createdAt
    date: { type: Date },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    returned: { type: Boolean, default: false },
    
    // Verification system
    requiresVerification: { type: Boolean, default: false },
    verificationProof: { type: String },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    
    // AI-extracted structured data
    structuredData: {
      itemType: String,
      color: String,
      brand: String,
      otherDetails: [String]
    },
    
    // Best match cache (updated by matching service)
    bestMatch: {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      score: Number,
      reason: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);

