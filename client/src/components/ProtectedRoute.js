import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Wrap any route element with this to require an admin-logged-in user.
// Usage: <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useContext(AuthContext);

  if (loading) return null; // avoid flicker while reading localStorage

  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
