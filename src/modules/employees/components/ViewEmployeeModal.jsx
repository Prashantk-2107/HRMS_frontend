import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, User, Mail, Phone, Calendar, MapPin, Building, Heart, Tag, Landmark, Plus, Pencil, Trash2 } from 'lucide-react';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';
import Skeleton from '../../../components/ui/Skeleton';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../constants/permissions';

const ViewEmployeeModal = ({ isOpen, onClose, employeeId }) => {
  const { hasPermission } = usePermission();
  const canManageBank = hasPermission(PERMISSIONS.EMP_MANAGE_BANK_DETAILS);

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bank details states
  const [bankDetails, setBankDetails] = useState([]);
  const [bankLoading, setBankLoading] = useState(false);

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



  useEffect(() => {
    if (isOpen && employeeId && canManageBank) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchBankDetails();
    }
  }, [isOpen, employeeId, canManageBank, fetchBankDetails]);

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(EMPLOYEE_ENDPOINTS.DETAILS(employeeId));
        if (response.data && response.data.data && response.data.data.employee) {
          setEmployee(response.data.data.employee);
        } else {
          toast.error('Failed to load employee details.');
        }
      } catch (err) {
        console.error('Error fetching employee details:', err);
        toast.error('Failed to load employee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [isOpen, employeeId]);



  const getInitials = () => {
    if (!employee) return '';
    const first = employee.first_name?.[0] || '';
    const last = employee.last_name?.[0] || '';
    return (first + last).toUpperCase() || '?';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
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
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Employee Details</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Read-only profile card.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {loading ? (
          <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left animate-in fade-in duration-200">
            {/* Top Profile Summary Card Skeleton */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              {/* Avatar Initial Skeleton */}
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex-1 flex flex-col gap-2.5 items-center sm:items-start w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-16 rounded-full" />
                </div>
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            {/* Grid Sections Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Section 1: Personal Details Skeleton */}
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-32 bg-indigo-50 dark:bg-indigo-950/30" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <Skeleton className="h-2.5 w-16" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Job Details Skeleton */}
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-36 bg-indigo-50 dark:bg-indigo-950/30" />
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex flex-col gap-1.5">
                      <Skeleton className="h-2.5 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Contact & Address Skeleton */}
              <div className="sm:col-span-2 flex flex-col gap-4">
                <Skeleton className="h-4 w-48 bg-indigo-50 dark:bg-indigo-950/30" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <Skeleton className="h-2.5 w-28" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Close Button Skeleton */}
            <div className="mt-4 shrink-0 flex">
              <Skeleton className="w-full h-10" />
            </div>
          </div>
        ) : !employee ? (
          <div className="text-center py-12 text-rose-500 font-semibold">
            Failed to load employee details.
          </div>
        ) : (
          <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left">
            {/* Top Profile Summary Card */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 bg-slate-50/50 dark:bg-slate-950/10 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
              {/* Avatar Initial */}
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-bold text-xl flex items-center justify-center shrink-0 shadow-inner">
                {getInitials()}
              </div>
              <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    {`${employee.first_name || ''} ${employee.last_name || ''}`}
                  </h4>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${employee.employee_status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
                      : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
                    }`}>
                    {employee.employee_status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Tag size={12} className="text-slate-400" />
                  Code: <span className="text-slate-700 dark:text-slate-300">{employee.empCode || employee.emp_id}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                  <Building size={12} className="text-slate-400" />
                  Role: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{employee.role?.name || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Section 1: Personal Details */}
              <div className="flex flex-col gap-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                  <User size={14} /> Personal Details
                </h5>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Gender</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{employee.gender || 'N/A'}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Date of Birth</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatDate(employee.date_of_birth)}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Email Address</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mt-0.5 break-all">
                      <Mail size={14} className="text-slate-400 shrink-0" />
                      {employee.email || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Phone Number</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Phone size={14} className="text-slate-400" />
                      {employee.phone_number || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Job Details */}
              <div className="flex flex-col gap-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                  <Building size={14} /> Employment Details
                </h5>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Employment Type</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{employee.employment_type || 'N/A'}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Joining Date</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <Calendar size={14} className="text-slate-400" />
                      {formatDate(employee.joining_date)}
                    </span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Role Description</label>
                    <span className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed">
                      {employee.role?.description || 'No role description provided.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Address (Col Span 2) */}
              <div className="sm:col-span-2 flex flex-col gap-4">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                  <Heart size={14} className="text-indigo-600 dark:text-indigo-400" /> Emergency & Additional Details
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Emergency Contact Name</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">{employee.emergency_contact_name || 'N/A'}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Emergency Contact Number</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block mt-0.5">{employee.emergency_contact_number || 'N/A'}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Residential Address</label>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-start gap-1.5 mt-0.5">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      {employee.address || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank details section (visible only to authorized roles) */}
            {canManageBank && (
              <div className="border-t border-slate-150 dark:border-slate-800 pt-6 mt-4 flex flex-col gap-4 text-xs font-semibold">
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 pb-1.5 border-b border-slate-100 dark:border-slate-850 flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Landmark size={14} /> Linked Bank Accounts ({bankDetails.length})
                  </span>
                </h5>

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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer Close Button */}
            <div className="mt-4 shrink-0 flex">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-sm transition-colors cursor-pointer text-center"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewEmployeeModal;
