import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still waiting on the /auth/me check from AuthContext — don't redirect yet,
  // or a logged-in user gets bounced to /signup on every refresh.
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d0b] flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}