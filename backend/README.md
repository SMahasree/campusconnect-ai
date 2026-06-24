# Smart Campus Lost & Found System (Backend)

## Run
1) Install deps
- cd backend
- npm install

2) Ensure MongoDB is running
- Uses MONGODB_URI from .env (default: mongodb://127.0.0.1:27017/smart-campus-lost-found)

3) Start server
- npm run start

## Seed data
- node scripts/seed.js

## Swagger docs
- http://localhost:5000/api-docs

## Base routes
- /api/auth/register
- /api/auth/login
- /api/items
- /api/claims
- /api/matches
- /api/dashboard/stats

