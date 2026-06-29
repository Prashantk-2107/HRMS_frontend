import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPermissions } from '../../../store/slices/authSlice.js';

const PermissionRoute = ({ requiredPermissions, checkAll = false }) => {
  const userPermissions = useSelector(selectPermissions) || [];

  if (!requiredPermissions) {
    return <Outlet />;
  }

  let hasAccess = false;
  if (Array.isArray(requiredPermissions)) {
    hasAccess = checkAll
      ? requiredPermissions.every((perm) => userPermissions.includes(perm))
      : requiredPermissions.some((perm) => userPermissions.includes(perm));
  } else {
    hasAccess = userPermissions.includes(requiredPermissions);
  }

  return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default PermissionRoute;
