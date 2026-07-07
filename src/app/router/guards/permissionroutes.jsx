import { Navigate, Outlet } from 'react-router-dom';
import { usePermission } from '../../../hooks/usepermission';

const PermissionRoute = ({ requiredPermissions, checkAll = false }) => {
  const { hasPermission } = usePermission();

  if (!requiredPermissions) {
    return <Outlet />;
  }

  const hasAccess = hasPermission(requiredPermissions, checkAll);

  return hasAccess ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PermissionRoute;
