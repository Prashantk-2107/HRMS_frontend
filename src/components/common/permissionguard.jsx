import { usePermission } from '../../hooks/usepermission';

const PermissionGuard = ({ permissions, checkAll = false, children, fallback = null }) => {
  const { hasPermission } = usePermission();
  return hasPermission(permissions, checkAll) ? children : fallback;
};

export default PermissionGuard;
