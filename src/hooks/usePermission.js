import { useSelector } from 'react-redux';
import { selectPermissions, selectRole } from '../store/slices/authSlice';

export const usePermission = () => {
  const userPermissions = useSelector(selectPermissions) || [];
  const role = useSelector(selectRole);

  const hasPermission = (requiredPermissions, checkAll = false) => {
    if (!requiredPermissions) return true;

    // Bypass for admin / superadmin roles
    const roleName = typeof role === 'object' ? role?.name : role;
    if (roleName) {
      const normalizedRole = roleName.toLowerCase().replace(/[\s_-]/g, '');
      if (normalizedRole === 'admin' || normalizedRole === 'superadmin') {
        return true;
      }
    }

    if (Array.isArray(requiredPermissions)) {
      if (requiredPermissions.length === 0) return true;
      return checkAll
        ? requiredPermissions.every((perm) => userPermissions.includes(perm))
        : requiredPermissions.some((perm) => userPermissions.includes(perm));
    }

    return userPermissions.includes(requiredPermissions);
  };

  return { hasPermission, userPermissions, role };
};
