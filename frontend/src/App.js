import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import Claims from './pages/Claims';
import Matches from './pages/Matches';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';

export default function App() {
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE';

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items"
          element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          }
        />

        <Route
          path="/items/:id"
          element={
            <ProtectedRoute>
              <ItemDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-item"
          element={
            <ProtectedRoute>
              <CreateItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-item/:id"
          element={
            <ProtectedRoute>
              <CreateItem />
            </ProtectedRoute>
          }
        />

        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />

        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

