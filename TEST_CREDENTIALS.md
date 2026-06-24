# Test Credentials & Instructions

## 📧 Test Account (Email/Password Login)

Use these to test the application without Google OAuth:

**Email:** test@example.com  
**Password:** password123

---

## 🧪 How to Test Locally:

### 1. Login with Email/Password:
- Go to http://localhost:3000/login
- Click "Sign in" tab
- Use test credentials above
- Click "Sign in" button

### 2. Browse Pages After Login:
- Dashboard: http://localhost:3000/dashboard
- Browse Items: http://localhost:3000/items
- Report Item: http://localhost:3000/items/new
- Leaderboard: http://localhost:3000/leaderboard
- Profile: http://localhost:3000/profile

### 3. Test Google OAuth (When Configured):
- Click "Continue with Google" button
- Will show error if Client ID not configured
- Configure .env files with real Client ID
- Restart servers
- Try again

---

## 🗄️ Database Note:

The app uses **MongoDB** at `mongodb://127.0.0.1:27017/smart-campus-lost-found`

Make sure MongoDB is running:
```bash
mongod
```

---

## 🔧 API Base URL:

- Backend API: http://localhost:5000/api
- Frontend connects to: http://localhost:5000/api

---

## ✅ Verification Checklist:

- [ ] Both backend and frontend servers are running
- [ ] Can access http://localhost:3000
- [ ] Can see login page
- [ ] Can log in with test credentials
- [ ] Can access dashboard
- [ ] Navigation works on all pages
- [ ] Design matches Lovable reference
- [ ] Google OAuth button is visible
