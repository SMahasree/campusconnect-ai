import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import Item from '../models/Item.js';
import Claim from '../models/Claim.js';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing');

  await mongoose.connect(uri);

  // Clean existing
  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Claim.deleteMany({})
  ]);

  const pass = await bcrypt.hash('password123', Number(process.env.BCRYPT_SALT_ROUNDS || 10));

  const alice = await User.create({ name: 'Alice', email: 'alice@example.com', passwordHash: pass });
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com', passwordHash: pass });

  // Lost item (Alice)
  const lostPhone = await Item.create({
    title: 'Black Samsung Phone',
    description: 'Black Samsung phone lost near library',
    category: 'Electronics',
    location: 'Library',
    status: 'lost',
    userId: alice._id,
    returned: false
  });

  // Found item (Bob)
  const foundPhone = await Item.create({
    title: 'Samsung mobile found near library',
    description: 'Found Samsung phone close to library entrance',
    category: 'Electronics',
    location: 'Library',
    status: 'found',
    userId: bob._id,
    returned: false
  });

  // Claim request (Alice claims Bob's found item)
  await Claim.create({
    itemId: foundPhone._id,
    userId: alice._id,
    status: 'pending',
    message: 'This looks like my lost phone.'
  });

  console.log('🌱 Seed data inserted');
  console.log('Login credentials:');
  console.log('Alice:', { email: 'alice@example.com', password: 'password123' });
  console.log('Bob:', { email: 'bob@example.com', password: 'password123' });

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

