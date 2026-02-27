import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// IMPORTANT: Adjust this import path to where your AuthContext actually is
import { useAuth } from '@/contexts/AuthContext'; 

const AdminRoute = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // If not logged in OR not an admin, redirect to Home
  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If Admin, allow them to see the page
  return <Outlet />;
};

export default AdminRoute;