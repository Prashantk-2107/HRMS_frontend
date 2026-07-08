import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Landmark, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '../../../services/api';

const EmployeeBankDetails = ({ employeeId, isOpen, canManageBank }) => {
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
      Promise.resolve().then(() => {
        fetchBankDetails();
      });
    }
  }, [isOpen, employeeId, canManageBank, fetchBankDetails]);

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

  if (!canManageBank) return null;

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium"
                value={bankFormData.account_number}
                onChange={(e) => setBankFormData(prev => ({ ...prev, account_number: e.target.value }))}
                placeholder="Enter Account Number"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">IFSC Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium"
                value={bankFormData.ifsc_code}
                onChange={(e) => setBankFormData(prev => ({ ...prev, ifsc_code: e.target.value }))}
                placeholder="e.g. HDFC0000123"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Account Type</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-850 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium"
                value={bankFormData.account_type}
                onChange={(e) => setBankFormData(prev => ({ ...prev, account_type: e.target.value }))}
              >
                <option value="savings" className="dark:bg-slate-900">Savings Account</option>
                <option value="current" className="dark:bg-slate-900">Current Account</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">Branch Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 font-medium"
                value={bankFormData.branch_address}
                onChange={(e) => setBankFormData(prev => ({ ...prev, branch_address: e.target.value }))}
                placeholder="Enter bank branch address details"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={() => setShowBankForm(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer bg-white dark:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Save Bank
            </button>
          </div>
        </form>
      )}

      {/* Render Linked Bank Accounts */}
      {!showBankForm && (
        <div className="flex flex-col gap-2.5">
          {bankLoading ? (
            <div className="flex items-center justify-center p-6 text-slate-400">
              <Loader2 size={16} className="animate-spin mr-2" />
              <span>Loading bank accounts...</span>
            </div>
          ) : bankDetails.length === 0 ? (
            <div className="text-center p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-400 dark:text-slate-500 font-medium">
              No bank account linked to this employee profile yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2.5">
              {bankDetails.map((bank) => (
                <div
                  key={bank.emp_bank_id}
                  className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100/50 dark:border-indigo-900/50 shrink-0">
                      <Landmark size={18} />
                    </div>
                    <div>
                      <h6 className="font-bold text-slate-850 dark:text-slate-100 text-xs">
                        {bank.bank_name}{' '}
                        <span className="capitalize text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-650 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20 ml-1">
                          {bank.account_type}
                        </span>
                      </h6>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                        Acc: <span className="font-semibold text-slate-700 dark:text-slate-300">{bank.account_number}</span> • IFSC: <span className="font-semibold text-slate-700 dark:text-slate-300">{bank.ifsc_code}</span>
                      </p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-medium">
                        Branch: {bank.branch_address}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
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
  );
};

export default EmployeeBankDetails;
