# CampusConnect AI

Smart Lost & Found for Modern Campuses

## Overview

CampusConnect AI is a full-stack MERN application that helps students and staff report, search, and recover lost items on campus. The platform includes secure authentication, item management, claim handling, and a smart matching system that helps identify potential matches between lost and found items.

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes

### Lost & Found Management
- Report Lost Items
- Report Found Items
- Browse All Items
- Search and Filter Items
- Update Item Status

### Smart Matching
- Automatic Lost vs Found Matching
- Match Confidence Score
- Match Analysis
- Potential Match Suggestions

### Claims System
- Submit Claims
- Track Claim Status
- Approve/Reject Claims
- Mark Items as Returned

### Dashboard
- Lost Item Statistics
- Found Item Statistics
- Returned Item Statistics
- Claims Overview

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcryptjs

### Database
- MongoDB
- Mongoose

## Project Structure

```text
Smart Campus Lost & Found System
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── models
│   ├── middleware
│   └── package.json
│
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/SMahasree/campusconnect-ai.git
cd campusconnect-ai
```

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:5000
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Items

```http
GET    /api/items
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

### Claims

```http
POST /api/claims
GET  /api/claims
PUT  /api/claims/:id
```

### Matches

```http
GET /api/matches
```

## Screenshots

### Dashboard
(Add Screenshot)

### Browse Items
(Add Screenshot)

### Smart Matches
(Add Screenshot)

### Claims
(Add Screenshot)

## Future Improvements

- AI-powered item matching using Ollama
- Image-based item recognition
- Email notifications
- Real-time chat
- Campus-wide leaderboard
- QR code item verification
- Mobile application

## Resume Highlights

- Built a full-stack MERN application with React, Node.js, Express, and MongoDB.
- Implemented JWT-based authentication and protected APIs.
- Developed RESTful APIs for item, claim, and user management.
- Designed a smart matching system to identify potential lost-and-found item matches.
- Created a responsive dashboard with analytics and item tracking.

## Author

Mahasree S

GitHub:
https://github.com/SMahasree
