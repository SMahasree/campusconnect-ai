import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { Conflict, Unauthorized } from '../utils/httpErrors.js';

function signToken(user) {
  // Keep payload minimal.
  return jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) throw new Conflict('Email already registered');

    const passwordHash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Unauthorized('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Unauthorized('Invalid credentials');

    const token = signToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(req, res, next) {
  try {
    const { token: idToken } = req.body;

    if (!idToken) throw new Unauthorized('ID token is required');

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: name || email,
        email,
        googleId: payload.sub,
        profilePicture: picture
      });
    }

    const token = signToken(user);

    return res.json({
      message: 'Google login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    return next(err);
  }
}

