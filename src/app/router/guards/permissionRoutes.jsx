import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectPermissions, selectRole } from '../../../store/slices/authSlice.js';

const PermissionRoute = ({ requiredPermissions, checkAll = false }) => {
  const userPermissions = useSelector(selectPermissions) || [];
  const role = useSelector(selectRole);

  if (!requiredPermissions) {
    return <Outlet />;
  }

  // Bypass for admin / superadmin roles
  const roleName = typeof role === 'object' ? role?.name : role;
  if (roleName) {
    const normalizedRole = roleName.toLowerCase().replace(/[\s_-]/g, '');
    if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
      return <Outlet />;
    }
  }

  let hasAccess = false;
  if (Array.isArray(requiredPermissions)) {
    hasAccess = checkAll
      ? requiredPermissions.every((perm) => userPermissions.includes(perm))
      : requiredPermissions.some((perm) => userPermissions.includes(perm));
  } else {
    hasAccess = userPermissions.includes(requiredPermissions);
  }

  return hasAccess ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;
