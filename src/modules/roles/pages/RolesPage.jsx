import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import RolesHeader from '../components/RolesHeader';
import RoleCard from '../components/RoleCard';
import PermissionsModal from '../components/PermissionsModal';
import CreateRoleModal from '../components/CreateRoleModal';
import EmployeePermissionsModal from '../components/EmployeePermissionsModal';
import api, { ROLE_ENDPOINTS, PERMISSION_ENDPOINTS } from '../../../services/api';
import Skeleton from '../../../components/ui/Skeleton';

const RolesPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEmpPermissionsModalOpen, setIsEmpPermissionsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteConfirmRole, setDeleteConfirmRole] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreatingRole, setIsCreatingRole] = useState(false);
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
    setIsCreateModalOpen(true);
  };

  const handleCreateRoleSubmit = async (roleData) => {
    setIsCreatingRole(true);
    const toastId = toast.loading('Creating new role...');
    try {
      await api.post(ROLE_ENDPOINTS.CREATE, {
        name: roleData.name,
        description: roleData.description,
      });
      toast.success('Role created successfully!', { id: toastId });
      setIsCreateModalOpen(false);
      // Invalidate roles query cache to refresh role lists instantly
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    } catch (err) {
      console.error('Failed to create role:', err);
      toast.error(err.response?.data?.message || 'Failed to create role', { id: toastId });
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleTogglePermission = async (roleId, permissionId, isGranted) => {
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
  };

  const handleDeleteClick = (role) => {
    setDeleteConfirmRole(role);
  };

  const handleConfirmDeleteSubmit = async () => {
    if (!deleteConfirmRole) return;

    setIsUpdating(true);
    const toastId = toast.loading(`Deleting role "${deleteConfirmRole.name}"...`);
    try {
      await api.delete(ROLE_ENDPOINTS.DELETE(deleteConfirmRole.role_id));
      toast.success('Role deleted successfully!', { id: toastId });
      setDeleteConfirmRole(null);
      // Invalidate roles query cache to refresh role lists instantly
      await queryClient.invalidateQueries({ queryKey: ['roles'] });
    } catch (err) {
      console.error('Failed to delete role:', err);
      toast.error(err.response?.data?.message || 'Failed to delete role', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignRole = () => {
    console.log('Assign Role clicked');
    toast.success('Assign Role clicked (Mock Action)');
  };

  const handleExport = () => {
    console.log('Export clicked');
    toast.success('Export clicked (Mock Action)');
  };

  // Get the most up-to-date selected role data from roles list
  const activeRole = roles.find(r => r.role_id === selectedRole?.role_id) || selectedRole;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <RolesHeader
        onCreateClick={handleCreateRole}
        onDeleteModeToggle={() => setIsDeleteMode(!isDeleteMode)}
        isDeleteMode={isDeleteMode}
        onAssignClick={handleAssignRole}
        onExportClick={handleExport}
        onDirectPermissionsClick={() => setIsEmpPermissionsModalOpen(true)}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col gap-6 text-left relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-5 w-32 mt-3" />
                <Skeleton className="h-3 w-full mt-3" />
                <Skeleton className="h-3 w-4/5 mt-1.5" />
              </div>
              <div className="border-t border-slate-50 pt-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-rose-50 rounded-2xl border border-rose-100 p-6">
          <p className="text-rose-600 font-medium">Failed to load roles. Please try again later.</p>
        </div>
      ) : (
        /* Role list representation */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((r, i) => (
            <RoleCard
              key={i}
              role={r}
              onViewPermissions={handleViewPermissions}
              isDeleteMode={isDeleteMode}
              onDeleteClick={handleDeleteClick}
            />
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

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateRoleSubmit}
        isSubmitting={isCreatingRole}
      />

      {/* Themed Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmRole && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmRole(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', duration: 0.25 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Delete Role?
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete the role{' '}
                <span className="font-semibold text-slate-700">"{deleteConfirmRole.name}"</span>?
                This action is permanent and cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  disabled={isUpdating}
                  onClick={() => setDeleteConfirmRole(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  disabled={isUpdating}
                  onClick={handleConfirmDeleteSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shadow-rose-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Employee Permissions Modal */}
      {isEmpPermissionsModalOpen && (
        <EmployeePermissionsModal
          isOpen={isEmpPermissionsModalOpen}
          onClose={() => setIsEmpPermissionsModalOpen(false)}
          allPermissions={allPermissions}
        />
      )}
    </div>
  );
};

export default RolesPage;
