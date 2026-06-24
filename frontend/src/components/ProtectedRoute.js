import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// ProtectedRoute blocks access to pages that require authentication.
export default function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext);

  if (!auth || auth.loading) {
    return <div className="container">Loading...</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

