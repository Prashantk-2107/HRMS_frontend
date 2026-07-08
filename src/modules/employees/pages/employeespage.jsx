import { useState, useEffect } from 'react';
import { UserPlus, FileDown, Trash2, ShieldAlert, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { EMPLOYEE_ENDPOINTS, AUTH_ENDPOINTS } from '../../../services/api';
import StatsCards from '../components/statscards';
import EmployeeTable from '../components/employeetable';
import AddEmployeeModal from '../components/addemployeemodal';
import ViewEmployeeModal from '../components/viewemployeemodal';
import EditEmployeeModal from '../components/editemployeemodal';
import PermissionGuard from '../../../components/common/permissionguard';
import { PERMISSIONS } from '../../../constants/permissions';
import { usePermission } from '../../../hooks/usepermission';

const EmployeesPage = () => {
  const { hasPermission } = usePermission();
  const queryClient = useQueryClient();

  const canView = hasPermission([
    PERMISSIONS.EMP_GET_ALL,
    PERMISSIONS.EMP_VIEW_ANY,
    PERMISSIONS.EMP_CREATE,
    PERMISSIONS.EMP_UPDATE,
    PERMISSIONS.EMP_DELETE
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedViewEmployeeId, setSelectedViewEmployeeId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditEmployeeId, setSelectedEditEmployeeId] = useState(null);
  const [statusConfirmEmployee, setStatusConfirmEmployee] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Debounce search term
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(1); // Reset page to 1 on search change
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Query: Fetch all employees for stats card computation
  const { data: allEmployees = [], isLoading: isAllLoading } = useQuery({
    queryKey: ['employees', 'all'],
    queryFn: async () => {
      const response = await api.get(EMPLOYEE_ENDPOINTS.LIST);
      return response.data?.data?.employees || [];
    },
    enabled: canView,
  });

  // Query: Fetch paginated/searched employees list
  const { data: paginatedData, isLoading: isTableLoading, error: queryError } = useQuery({
    queryKey: ['employees', 'paginated', page, limit, debouncedSearchTerm],
    queryFn: async () => {
      const response = await api.get(EMPLOYEE_ENDPOINTS.LIST, {
        params: { page, limit, search: debouncedSearchTerm },
      });
      return response.data?.data || { employees: [], pagination: {} };
    },
    enabled: canView,
  });

  const employees = paginatedData?.employees || [];
  const paginationMeta = paginatedData?.pagination || {
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Mutation: Delete Employee
  const deleteMutation = useMutation({
    mutationFn: async (empId) => {
      await api.delete(EMPLOYEE_ENDPOINTS.DELETE(empId));
    },
    onMutate: () => {
      setIsUpdating(true);
      const toastId = toast.loading('Deleting employee...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully!', { id: context.toastId });
      setDeleteConfirmEmployee(null);
    },
    onError: (err, variables, context) => {
      console.error('Failed to delete employee:', err);
      toast.error(err.response?.data?.message || 'Failed to delete employee', { id: context.toastId });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Mutation: Update Employee Status
  const statusMutation = useMutation({
    mutationFn: async ({ empId, status }) => {
      await api.patch(EMPLOYEE_ENDPOINTS.SET_STATUS, {
        emp_id: empId,
        status,
      });
    },
    onMutate: ({ name }) => {
      setIsUpdating(true);
      const toastId = toast.loading(`Updating status for "${name}"...`);
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success(`Employee status updated to ${variables.statusLabel}!`, { id: context.toastId });
      setStatusConfirmEmployee(null);
    },
    onError: (err, variables, context) => {
      console.error('Failed to update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status', { id: context.toastId });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Mutation: Resend Setup invitation Link
  const resendSetupMutation = useMutation({
    mutationFn: async (email) => {
      await api.post(AUTH_ENDPOINTS.RESEND_SETUP_LINK, {
        email,
        frontendUrl: window.location.origin
      });
    },
    onMutate: (email) => {
      const toastId = toast.loading(`Resending invitation link to ${email}...`);
      return { toastId };
    },
    onSuccess: (data, email, context) => {
      toast.success(`Invitation link resent to ${email} successfully!`, { id: context.toastId });
    },
    onError: (err, email, context) => {
      console.error('Failed to resend invitation link:', err);
      toast.error(err.response?.data?.message || 'Failed to resend invitation link', { id: context.toastId });
    }
  });

  const handleDeleteClick = (emp) => {
    setDeleteConfirmEmployee(emp);
  };

  const handleViewClick = (empId) => {
    setSelectedViewEmployeeId(empId);
    setIsViewModalOpen(true);
  };

  const handleEditClick = (empId) => {
    setSelectedEditEmployeeId(empId);
    setIsEditModalOpen(true);
  };

  const handleConfirmDeleteSubmit = () => {
    if (!deleteConfirmEmployee) return;
    deleteMutation.mutate(deleteConfirmEmployee.emp_id);
  };

  const handleStatusClick = (emp) => {
    setStatusConfirmEmployee(emp);
  };

  const handleConfirmStatusSubmit = () => {
    if (!statusConfirmEmployee) return;
    const nextStatus = statusConfirmEmployee.employee_status === 'active' ? 'in_active' : 'active';
    const nextStatusLabel = nextStatus === 'active' ? 'Active' : 'Inactive';
    statusMutation.mutate({
      empId: statusConfirmEmployee.emp_id,
      status: nextStatus,
      name: `${statusConfirmEmployee.first_name} ${statusConfirmEmployee.last_name}`,
      statusLabel: nextStatusLabel,
    });
  };

  const handleResendSetupClick = (email) => {
    resendSetupMutation.mutate(email);
  };

  // Calculate stats dynamically from allEmployees
  const totalStaff = allEmployees.length;
  const activeStaff = allEmployees.filter((emp) => emp.employee_status === 'active').length;
  const inactiveStaff = allEmployees.filter((emp) => emp.employee_status === 'in_active').length;

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white border border-slate-100 rounded-2xl">
        <ShieldAlert size={48} className="text-amber-500 mb-4 animate-bounce" />
        <h3 className="font-bold text-slate-800 text-lg">Access Denied</h3>
        <p className="text-xs text-slate-400 mt-2 max-w-sm">
          You do not have permission to view the employee roster. Please contact your system administrator.
        </p>
      </div>
    );
  }

  const errMessage = queryError ? (queryError.response?.data?.message || 'Failed to fetch employees') : null;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Employees Directory</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage, view, and add corporate staff members.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm">
            <FileDown size={16} />
            <span>Export</span>
          </button>
          <PermissionGuard permissions={PERMISSIONS.EMP_DELETE}>
            <button
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isDeleteMode
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
                  : 'border border-rose-300 dark:border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/25 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
                }`}
            >
              {isDeleteMode ? (
                <>
                  <ShieldAlert size={16} />
                  <span>Exit Delete Mode</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Employee</span>
                </>
              )}
            </button>
          </PermissionGuard>
          <PermissionGuard permissions={PERMISSIONS.EMP_CREATE}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
            >
              <UserPlus size={16} />
              <span>Add Employee</span>
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <StatsCards
        loading={isAllLoading}
        totalStaff={totalStaff}
        activeStaff={activeStaff}
        inactiveStaff={inactiveStaff}
      />

      {/* Staff Roster Table */}
      <EmployeeTable
        loading={isTableLoading}
        error={errMessage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        employees={employees}
        isDeleteMode={isDeleteMode}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        onStatusClick={handleStatusClick}
        onResendSetupClick={handleResendSetupClick}
        pagination={paginationMeta}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
      />

      {/* View Employee Details Modal */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employeeId={selectedViewEmployeeId}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditEmployeeId(null);
        }}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['employees'] })}
        employeeId={selectedEditEmployeeId}
      />

      {/* Themed Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmEmployee && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmEmployee(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', duration: 0.25 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-10 flex flex-col items-center text-center transition-colors duration-200"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Delete Employee?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to delete the employee{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  "{deleteConfirmEmployee.first_name} {deleteConfirmEmployee.last_name}"
                </span>?
                This action is permanent and cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  disabled={isUpdating}
                  onClick={() => setDeleteConfirmEmployee(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
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

        {/* Themed Status Change Confirmation Modal */}
        {statusConfirmEmployee && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusConfirmEmployee(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', duration: 0.25 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-10 flex flex-col items-center text-center transition-colors duration-200"
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                statusConfirmEmployee.employee_status === 'active'
                  ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
                  : 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                <UserCheck size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Change Status?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to change the status of{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  "{statusConfirmEmployee.first_name} {statusConfirmEmployee.last_name}"
                </span> to{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {statusConfirmEmployee.employee_status === 'active' ? 'Inactive' : 'Active'}
                </span>?
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  disabled={isUpdating}
                  onClick={() => setStatusConfirmEmployee(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  disabled={isUpdating}
                  onClick={handleConfirmStatusSubmit}
                  className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    statusConfirmEmployee.employee_status === 'active'
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                  }`}
                >
                  Confirm Change
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmployeesPage;
