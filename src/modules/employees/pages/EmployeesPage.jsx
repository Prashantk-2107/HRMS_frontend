import React, { useState, useEffect } from 'react';
import { UserPlus, FileDown, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';
import StatsCards from '../components/StatsCards';
import EmployeeTable from '../components/EmployeeTable';
import AddEmployeeModal from '../components/AddEmployeeModal';
import ViewEmployeeModal from '../components/ViewEmployeeModal';
import PermissionGuard from '../../../components/common/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';

const EmployeesPage = () => {
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

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees Directory</h1>
          <p className="text-sm text-slate-500">Manage, view, and add corporate staff members.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm">
            <FileDown size={16} />
            <span>Export</span>
          </button>
          <PermissionGuard permissions={PERMISSIONS.EMP_DELETE}>
            <button
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isDeleteMode
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
                  : 'border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-600 hover:text-rose-700'
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>
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
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEmployees}
      />

      {/* View Employee Details Modal */}
      <ViewEmployeeModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employeeId={selectedViewEmployeeId}
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
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 flex flex-col items-center text-center"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Delete Employee?
              </h4>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Are you sure you want to delete the employee{' '}
                <span className="font-semibold text-slate-700">
                  "{deleteConfirmEmployee.first_name} {deleteConfirmEmployee.last_name}"
                </span>?
                This action is permanent and cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  disabled={isUpdating}
                  onClick={() => setDeleteConfirmEmployee(null)}
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
    </div>
  );
};

export default EmployeesPage;
