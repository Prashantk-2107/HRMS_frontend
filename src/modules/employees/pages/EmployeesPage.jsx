import React, { useState, useEffect } from 'react';
import { UserPlus, FileDown, Trash2, ShieldAlert, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';
import StatsCards from '../components/StatsCards';
import EmployeeTable from '../components/EmployeeTable';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import PermissionGuard from '../../../components/common/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';
import { usePermission } from '../../../hooks/usePermission';

const EmployeesPage = () => {
  const { hasPermission } = usePermission();
  const canView = hasPermission([
    PERMISSIONS.EMP_GET_ALL,
    PERMISSIONS.EMP_VIEW_ANY,
    PERMISSIONS.EMP_CREATE,
    PERMISSIONS.EMP_UPDATE,
    PERMISSIONS.EMP_DELETE
  ]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [deleteConfirmEmployee, setDeleteConfirmEmployee] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedViewEmployeeId, setSelectedViewEmployeeId] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditEmployeeId, setSelectedEditEmployeeId] = useState(null);
  const [statusConfirmEmployee, setStatusConfirmEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(EMPLOYEE_ENDPOINTS.LIST);
      if (response.data && response.data.data && Array.isArray(response.data.data.employees)) {
        setEmployees(response.data.data.employees);
      } else {
        setEmployees([]);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.response?.data?.message || 'Failed to fetch employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleConfirmDeleteSubmit = async () => {
    if (!deleteConfirmEmployee) return;

    setIsUpdating(true);
    const toastId = toast.loading(`Deleting employee "${deleteConfirmEmployee.first_name} ${deleteConfirmEmployee.last_name}"...`);
    try {
      await api.delete(EMPLOYEE_ENDPOINTS.DELETE(deleteConfirmEmployee.emp_id));
      toast.success('Employee deleted successfully!', { id: toastId });
      setDeleteConfirmEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to delete employee:', err);
      toast.error(err.response?.data?.message || 'Failed to delete employee', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusClick = (emp) => {
    setStatusConfirmEmployee(emp);
  };

  const handleConfirmStatusSubmit = async () => {
    if (!statusConfirmEmployee) return;

    setIsUpdating(true);
    const nextStatus = statusConfirmEmployee.employee_status === 'active' ? 'in_active' : 'active';
    const nextStatusLabel = nextStatus === 'active' ? 'Active' : 'Inactive';
    const toastId = toast.loading(`Updating status for "${statusConfirmEmployee.first_name} ${statusConfirmEmployee.last_name}"...`);

    try {
      await api.patch(EMPLOYEE_ENDPOINTS.SET_STATUS, {
        emp_id: statusConfirmEmployee.emp_id,
        status: nextStatus,
      });
      toast.success(`Employee status updated to ${nextStatusLabel}!`, { id: toastId });
      setStatusConfirmEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error('Failed to update employee status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Sort by empCode alphanumeric ascending, then filter based on search term
  const sortedAndFilteredEmployees = [...employees]
    .sort((a, b) => {
      const codeA = a.empCode || '';
      const codeB = b.empCode || '';
      return codeA.localeCompare(codeB, undefined, { numeric: true, sensitivity: 'base' });
    })
    .filter((emp) => {
      const term = searchTerm.toLowerCase();
      const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
      const id = (emp.empCode || emp.emp_id || '').toLowerCase();
      const role = (emp.role?.name || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      return (
        fullName.includes(term) ||
        id.includes(term) ||
        role.includes(term) ||
        email.includes(term)
      );
    });

  // Calculate stats dynamically
  const totalStaff = employees.length;
  const activeStaff = employees.filter((emp) => emp.employee_status === 'active').length;
  const inactiveStaff = employees.filter((emp) => emp.employee_status === 'in_active').length;

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
        loading={loading}
        totalStaff={totalStaff}
        activeStaff={activeStaff}
        inactiveStaff={inactiveStaff}
      />

      {/* Staff Roster Table */}
      <EmployeeTable
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        employees={sortedAndFilteredEmployees}
        isDeleteMode={isDeleteMode}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onEditClick={handleEditClick}
        onStatusClick={handleStatusClick}
      />

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={fetchEmployees}
        />
      )}

      {/* View Employee Details Modal */}
      {isViewModalOpen && (
        <ViewEmployeeModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          employeeId={selectedViewEmployeeId}
        />
      )}

      {/* Edit Employee Modal */}
      {isEditModalOpen && (
        <EditEmployeeModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEditEmployeeId(null);
          }}
          onSuccess={fetchEmployees}
          employeeId={selectedEditEmployeeId}
        />
      )}

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
