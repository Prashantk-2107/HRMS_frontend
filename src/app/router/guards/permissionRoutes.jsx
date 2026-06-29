import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store.js';

const PermissionRoute = ({ requiredPermissions, checkAll = false }) => {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission);
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions);

  if (!requiredPermissions) {
    return <Outlet />;
  }

  let hasAccess = false;
  if (Array.isArray(requiredPermissions)) {
    hasAccess = checkAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);
  } else {
    hasAccess = hasPermission(requiredPermissions);
  }

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PermissionRoute;
