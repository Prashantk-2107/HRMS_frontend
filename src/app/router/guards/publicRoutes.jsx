import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store.js';

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
