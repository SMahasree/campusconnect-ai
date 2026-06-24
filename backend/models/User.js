import mongoose from 'mongoose';

/**
 * User model with reputation system
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    
    // Google OAuth
    googleId: { type: String },
    profilePicture: { type: String },
    
    // Reputation system
    reputation: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    itemsReturned: { type: Number, default: 0 },
    claimsVerified: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

