import { useState, useEffect, useCallback } from 'react';
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
  const [showBankForm, setShowBankForm] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_address: '',
    account_type: 'savings'
  });

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

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to remove this bank account details?')) return;

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 transition-colors duration-300">
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
                    <h6 className="font-bold text-slate-800 dark:text-slate-200">
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
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-505 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
                            className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-700 hover:bg-slate-105 text-slate-500 dark:text-slate-400 cursor-pointer"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBank(bank.emp_bank_id)}
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
      </div>
    </div>
  );
};

export default ViewEmployeeModal;
