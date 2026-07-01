import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import RolesHeader from '../components/RolesHeader';
import RoleCard from '../components/RoleCard';
import PermissionsModal from '../components/PermissionsModal';
import api, { ROLE_ENDPOINTS, PERMISSION_ENDPOINTS } from '../../../services/api';

const RolesPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading, error } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await api.get(ROLE_ENDPOINTS.GET_ALL);
      console.log("Role Response", response.data)
      return response.data?.data?.roles || [];
    },
  });

  const { data: allPermissions = [] } = useQuery({
    queryKey: ['allPermissions'],
    queryFn: async () => {
      const response = await api.get(PERMISSION_ENDPOINTS.GET_ALL);
      return response.data?.data?.permissions || [];
    },
  });

  const handleCreateRole = () => {
    console.log('Create New Role clicked');
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleTogglePermission = async (roleId, permissionId, isGranted, permissionName, roleName) => {
    const action = isGranted ? 'grant' : 'revoke';
    const ok = window.confirm(`Are you sure you want to ${action} the "${permissionName.replace(/:/g, ' - ').replace(/_/g, ' ')}" permission for "${roleName}"?`);
    if (ok) {
      setIsUpdating(true);
      const toastId = toast.loading(`${isGranted ? 'Granting' : 'Revoking'} permission...`);
      try {
        await api.post(PERMISSION_ENDPOINTS.GRANT_REVOKE, {
          role_id: roleId,
          permission_id: permissionId,
          isGranted,
        });
        toast.success(`Permission ${isGranted ? 'granted' : 'revoked'} successfully!`, { id: toastId });
        // Invalidate roles query to get the updated roles and permissions list
        await queryClient.invalidateQueries({ queryKey: ['roles'] });
      } catch (err) {
        console.error('Failed to toggle permission:', err);
        toast.error(err.response?.data?.message || 'Failed to update permission', { id: toastId });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Get the most up-to-date selected role data from roles list
  const activeRole = roles.find(r => r.role_id === selectedRole?.role_id) || selectedRole;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <RolesHeader onCreateClick={handleCreateRole} />

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-rose-50 rounded-2xl border border-rose-100 p-6">
          <p className="text-rose-600 font-medium">Failed to load roles. Please try again later.</p>
        </div>
      ) : (
        /* Role list representation */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <RoleCard key={i} role={r} onViewPermissions={handleViewPermissions} />
          ))}
        </div>
      )}

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={activeRole}
        allPermissions={allPermissions}
        onTogglePermission={handleTogglePermission}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default RolesPage;
