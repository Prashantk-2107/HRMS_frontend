import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ChevronDown, Check, Landmark, Plus, Pencil, Trash2 } from 'lucide-react';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';
import Skeleton from '../../../components/ui/Skeleton';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../constants/permissions';

const EditEmployeeModal = ({ isOpen, onClose, onSuccess, employeeId }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    joining_date: '',
    role_id: '',
    role_name: '',
    date_of_birth: '',
    employment_type: '',
    gender: '',
    employee_status: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    address: '',
  });

  const [detailsLoading, setDetailsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const { hasPermission } = usePermission();
  const canManageBank = hasPermission(PERMISSIONS.EMP_MANAGE_BANK_DETAILS);

  // Bank details states
  const [bankDetails, setBankDetails] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const [deleteConfirmBankId, setDeleteConfirmBankId] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_address: '',
    account_type: 'savings'
  });

  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isEmpTypeDropdownOpen, setIsEmpTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const employmentTypeOptions = [
    { value: 'permanent', label: 'Permanent' },
    { value: 'intern', label: 'Intern' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'in_active', label: 'Inactive' },
  ];

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  };

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchDetails = async () => {
      try {
        setDetailsLoading(true);

        // Fetch employee details
        const detailsResponse = await api.get(EMPLOYEE_ENDPOINTS.DETAILS(employeeId));
        if (detailsResponse.data && detailsResponse.data.data && detailsResponse.data.data.employee) {
          const emp = detailsResponse.data.data.employee;
          const initialFields = {
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            email: emp.email || '',
            phone_number: emp.phone_number || '',
            joining_date: formatDateForInput(emp.joining_date),
            role_id: emp.role_id || emp.role?.role_id || '',
            role_name: emp.role?.name || 'N/A',
            date_of_birth: formatDateForInput(emp.date_of_birth),
            employment_type: emp.employment_type || '',
            gender: emp.gender || '',
            employee_status: emp.employee_status || '',
            emergency_contact_name: emp.emergency_contact_name || '',
            emergency_contact_number: emp.emergency_contact_number || '',
            address: emp.address || '',
          };
          setFormData(initialFields);
          setInitialData(initialFields);
        } else {
          toast.error('Failed to load employee details.');
          onClose();
        }
      } catch (err) {
        console.error('Error fetching employee edit details:', err);
        toast.error('Failed to load employee details. Please try again.');
        onClose();
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, employeeId]);

  const fetchBankDetails = useCallback(async () => {
    if (!employeeId) return;
    try {
      setBankLoading(true);
      const response = await api.get(`/bank-details/get-bank-details/${employeeId}`);
      if (response.data && response.data.data) {
        setBankDetails(response.data.data.bank_details || []);
      }
    } catch (err) {
      console.error('Error fetching employee bank details:', err);
    } finally {
      setBankLoading(false);
    }
  }, [employeeId]);

  const handleBankFormSubmit = async (e) => {
    e?.preventDefault();
    if (
      !bankFormData.bank_name.trim() ||
      !bankFormData.account_number.trim() ||
      !bankFormData.ifsc_code.trim() ||
      !bankFormData.branch_address.trim()
    ) {
      toast.error('All bank detail fields are required.');
      return;
    }

    const toastId = toast.loading('Saving bank details...');
    try {
      if (editingBankId) {
        await api.patch(`/bank-details/update-bank-details/${editingBankId}`, bankFormData);
        toast.success('Bank details updated successfully!', { id: toastId });
      } else {
        await api.post('/bank-details/add-bank-details', {
          emp_id: employeeId,
          ...bankFormData
        });
        toast.success('Bank details linked successfully!', { id: toastId });
      }
      setShowBankForm(false);
      fetchBankDetails();
    } catch (err) {
      console.error('Failed to save bank details:', err);
      toast.error(err.response?.data?.message || 'Failed to save bank details', { id: toastId });
    }
  };

  const handleConfirmDeleteBank = async () => {
    if (!deleteConfirmBankId) return;
    const bankId = deleteConfirmBankId;
    setDeleteConfirmBankId(null);
    const toastId = toast.loading('Removing bank details...');
    try {
      await api.delete(`/bank-details/delete-bank-details/${bankId}`);
      toast.success('Bank details removed successfully!', { id: toastId });
      fetchBankDetails();
    } catch (err) {
      console.error('Failed to delete bank details:', err);
      toast.error(err.response?.data?.message || 'Failed to delete bank details', { id: toastId });
    }
  };

  useEffect(() => {
    if (isOpen && employeeId && canManageBank) {
      fetchBankDetails();
    }
  }, [isOpen, employeeId, canManageBank, fetchBankDetails]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any fields have actually changed from the original fetched data
    if (initialData) {
      const hasChanges = Object.keys(formData).some(
        (key) => formData[key] !== initialData[key]
      );

      if (!hasChanges) {
        toast.success('No changes detected.');
        onClose();
        return;
      }
    }

    // Required Validations on UI
    if (!formData.first_name.trim()) {
      toast.error('First Name is required');
      return;
    }
    if (!formData.joining_date) {
      toast.error('Joining date is required');
      return;
    }
    if (!formData.role_id) {
      toast.error('Please select a role');
      return;
    }
    if (formData.phone_number.trim() && !/^\d{10}$/.test(formData.phone_number)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        address: formData.address.trim() || 'Not Provided',
        phone_number: formData.phone_number.trim() || '0000000000',
        joining_date: formData.joining_date,
        role_id: formData.role_id,
        employee_status: formData.employee_status || 'active',
      };

      if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
      if (formData.employment_type) payload.employment_type = formData.employment_type;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.emergency_contact_name.trim()) payload.emergency_contact_name = formData.emergency_contact_name.trim();
      if (formData.emergency_contact_number.trim()) payload.emergency_contact_number = formData.emergency_contact_number.trim();

      const response = await api.patch(EMPLOYEE_ENDPOINTS.UPDATE(employeeId), payload);
      if (response.status === 200) {
        toast.success(response.data?.message || 'Employee profile updated successfully');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] transition-colors duration-300 z-10"
          >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 rounded-t-2xl shrink-0 transition-colors duration-200">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Edit Employee Profile</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Update employee details. Fields marked with * are required.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {detailsLoading ? (
          <div className="p-6 flex flex-col gap-6 text-left overflow-y-auto">
            {/* Section 1 Skeleton: Personal Info */}
            <div>
              <Skeleton className="h-4 w-32 mb-4 bg-indigo-50 dark:bg-indigo-950/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2 Skeleton: Employment Details */}
            <div>
              <Skeleton className="h-4 w-36 mb-4 bg-indigo-50 dark:bg-indigo-950/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={`flex flex-col gap-2 ${idx === 4 || idx === 5 ? 'sm:col-span-2' : ''}`}>
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3 Skeleton: Additional Details */}
            <div>
              <Skeleton className="h-4 w-48 mb-4 bg-indigo-50 dark:bg-indigo-950/30" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex gap-3 mt-4 shrink-0">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Context Meta Card (Read-only System Info) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl mb-2 transition-colors">
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate" title={formData.email}>
                  {formData.email || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</span>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {formData.role_name || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Joining Date</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {formData.joining_date ? new Date(formData.joining_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</span>
                <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  formData.employee_status === 'active' 
                    ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40' 
                    : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                }`}>
                  {formData.employee_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Section: Personal Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="e.g. John"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="e.g. Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Gender</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={formData.gender ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}>
                        {formData.gender
                          ? genderOptions.find(opt => opt.value === formData.gender)?.label
                          : 'Select gender...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isGenderDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isGenderDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsGenderDropdownOpen(false)} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1">
                          {genderOptions.map((opt) => {
                            const isSelected = opt.value === formData.gender;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, gender: opt.value }));
                                  setIsGenderDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                                  }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section: Employment Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                Employment Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    maxLength={10}
                    placeholder="e.g. 9876543210 (Optional)"
                    value={formData.phone_number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData((prev) => ({ ...prev, phone_number: val }));
                    }}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Employment Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && setIsEmpTypeDropdownOpen(!isEmpTypeDropdownOpen)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={formData.employment_type ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-500"}>
                        {formData.employment_type
                          ? employmentTypeOptions.find(opt => opt.value === formData.employment_type)?.label
                          : 'Select type...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isEmpTypeDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isEmpTypeDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsEmpTypeDropdownOpen(false)} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1">
                          {employmentTypeOptions.map((opt) => {
                            const isSelected = opt.value === formData.employment_type;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, employment_type: opt.value }));
                                  setIsEmpTypeDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100'
                                  }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600 dark:text-indigo-400" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Additional Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
                Additional Details & Emergency Contacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="Street name, City, State"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    placeholder="e.g. Spouse, Parent Name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Emergency Contact Number</label>
                  <input
                    type="text"
                    name="emergency_contact_number"
                    placeholder="Emergency phone number"
                    value={formData.emergency_contact_number}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 mt-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
            </form>

            {/* Bank details section (visible only to authorized roles) */}
            {canManageBank && (
              <div className="border-t border-slate-150 dark:border-slate-800 pt-6 mt-4 flex flex-col gap-4 text-xs font-semibold">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 pb-1.5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Landmark size={14} /> Linked Bank Accounts ({bankDetails.length})
                  </span>
                  {!showBankForm && bankDetails.length < 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingBankId(null);
                        setBankFormData({
                          bank_name: '',
                          account_number: '',
                          ifsc_code: '',
                          branch_address: '',
                          account_type: 'savings'
                        });
                        setShowBankForm(true);
                      }}
                      className="text-[10px] font-bold text-indigo-605 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus size={12} /> Add Account
                    </button>
                  )}
                </h5>

                {/* Inline form to Add/Edit Bank Details */}
                {showBankForm && (
                  <form onSubmit={handleBankFormSubmit} className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl flex flex-col gap-3">
                    <h6 className="font-bold text-slate-800 dark:text-slate-205">
                      {editingBankId ? 'Edit Bank Details' : 'Link New Bank Details'}
                    </h6>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Bank Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium"
                          value={bankFormData.bank_name}
                          onChange={(e) => setBankFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                          placeholder="e.g. HDFC Bank"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Account Number</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium font-mono"
                          value={bankFormData.account_number}
                          onChange={(e) => setBankFormData(prev => ({ ...prev, account_number: e.target.value }))}
                          placeholder="e.g. 5010023485"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">IFSC Code</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium font-mono uppercase"
                          value={bankFormData.ifsc_code}
                          onChange={(e) => setBankFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                          placeholder="e.g. HDFC0000129"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Account Type</label>
                        <select
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-205 bg-white dark:bg-slate-900 font-semibold"
                          value={bankFormData.account_type}
                          onChange={(e) => setBankFormData(prev => ({ ...prev, account_type: e.target.value }))}
                        >
                          <option value="savings">Savings</option>
                          <option value="current">Current</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Branch Address</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-202 bg-white dark:bg-slate-900 font-medium"
                          value={bankFormData.branch_address}
                          onChange={(e) => setBankFormData(prev => ({ ...prev, branch_address: e.target.value }))}
                          placeholder="e.g. Sector 62 Branch, Noida"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowBankForm(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                      >
                        Save Details
                      </button>
                    </div>
                  </form>
                )}

                {/* Bank Accounts List */}
                {bankLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-indigo-650" size={20} />
                  </div>
                ) : bankDetails.length === 0 ? (
                  <div className="text-center py-4 text-slate-400 dark:text-slate-500 font-semibold">
                    No linked bank accounts found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {bankDetails.map((bank) => (
                      <div
                        key={bank.emp_bank_id}
                        className="p-3 bg-slate-50/50 dark:bg-slate-950/15 border border-slate-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                      >
                        <div className="text-left">
                          <div className="font-bold text-slate-850 dark:text-slate-200">
                            {bank.bank_name}{' '}
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-500 capitalize bg-white dark:bg-slate-900 ml-1">
                              {bank.account_type}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                            Acc: {bank.account_number} • IFSC: {bank.ifsc_code}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                            Branch: {bank.branch_address}
                          </div>
                        </div>

                        <div className="flex gap-1.5 sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBankId(bank.emp_bank_id);
                              setBankFormData({
                                bank_name: bank.bank_name,
                                account_number: bank.account_number,
                                ifsc_code: bank.ifsc_code,
                                branch_address: bank.branch_address,
                                account_type: bank.account_type
                              });
                              setShowBankForm(true);
                            }}
                            className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700 hover:bg-slate-100 text-slate-500 dark:text-slate-400 cursor-pointer"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmBankId(bank.emp_bank_id)}
                            className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Themed Bank Delete Confirmation Modal */}
            <AnimatePresence>
              {deleteConfirmBankId && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDeleteConfirmBankId(null)}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
                  />

                  {/* Confirmation Box */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ type: 'spring', duration: 0.25 }}
                    className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-10 flex flex-col items-center text-center transition-colors"
                  >
                    {/* Icon Container */}
                    <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mb-4">
                      <Trash2 size={24} />
                    </div>

                    {/* Title & Desc */}
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                      Remove Bank Details?
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Are you sure you want to remove this bank account details? This action is permanent and cannot be undone.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 w-full mt-6">
                      <button
                        onClick={() => setDeleteConfirmBankId(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 bg-white dark:bg-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmDeleteBank}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shadow-rose-600/10"
                      >
                        Confirm Delete
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditEmployeeModal;
