import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Landmark,
  Plus,
  ShieldCheck,
  Pencil,
  Trash2,
  X,
  Loader2,
  CreditCard,
  Building2,
  DollarSign,
  Search,
  Filter,
  AlertCircle,
  Clock
} from 'lucide-react';
import api, { BANK_DETAILS_ENDPOINTS } from '../../../services/api';
import { usePermission } from '../../../hooks/usepermission';
import { PERMISSIONS } from '../../../constants/permissions';

const BankAccountsPage = () => {
  const { hasPermission } = usePermission();
  const canManageBank = hasPermission(PERMISSIONS.EMP_MANAGE_BANK_DETAILS);

  const [activeTab, setActiveTab] = useState('accounts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    branch_address: '',
    account_type: 'savings'
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmAccountId, setDeleteConfirmAccountId] = useState(null);

  // Transactions Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // 1. Fetch user's bank accounts
  const { data: bankAccounts = [], isLoading, refetch } = useQuery({
    queryKey: ['my-bank-details'],
    queryFn: async () => {
      const response = await api.get(BANK_DETAILS_ENDPOINTS.GET_MY);
      return response.data?.data?.bank_details || [];
    }
  });

  // 2. Add Account Mutation
  const addAccountMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(BANK_DETAILS_ENDPOINTS.ADD_MY, payload);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Linking bank details...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Bank details linked successfully!', { id: context.toastId });
      refetch();
      closeAddModal();
    },
    onError: (err, variables, context) => {
      toast.error(err.response?.data?.message || 'Failed to link bank details', { id: context.toastId });
    }
  });

  // 3. Update Account Mutation
  const updateAccountMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await api.patch(BANK_DETAILS_ENDPOINTS.UPDATE_MY(id), payload);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Updating bank details...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Bank details updated successfully!', { id: context.toastId });
      refetch();
      closeEditModal();
    },
    onError: (err, variables, context) => {
      toast.error(err.response?.data?.message || 'Failed to update bank details', { id: context.toastId });
    }
  });

  // 4. Delete Account Mutation (Accessible only to admins/HR)
  const deleteAccountMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/bank-details/delete-bank-details/${id}`);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Removing bank account...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success('Bank account removed successfully!', { id: context.toastId });
      refetch();
    },
    onError: (err, variables, context) => {
      toast.error(err.response?.data?.message || 'Failed to remove bank account', { id: context.toastId });
    }
  });

  // Form Validations
  const validateForm = () => {
    const errors = {};
    if (!formData.bank_name.trim()) errors.bank_name = 'Bank name is required';
    if (!formData.account_number.trim()) {
      errors.account_number = 'Account number is required';
    } else if (formData.account_number.trim().length < 5) {
      errors.account_number = 'Account number must be at least 5 digits';
    }
    if (!formData.ifsc_code.trim()) {
      errors.ifsc_code = 'IFSC code is required';
    } else if (formData.ifsc_code.trim().length < 5) {
      errors.ifsc_code = 'IFSC code must be at least 5 characters';
    }
    if (!formData.branch_address.trim()) errors.branch_address = 'Branch address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      branch_address: '',
      account_type: 'savings'
    });
    setFormErrors({});
  };

  const handleOpenEditModal = (account) => {
    setSelectedAccount(account);
    setFormData({
      bank_name: account.bank_name,
      account_number: account.account_number,
      ifsc_code: account.ifsc_code,
      branch_address: account.branch_address,
      account_type: account.account_type
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedAccount(null);
    setFormData({
      bank_name: '',
      account_number: '',
      ifsc_code: '',
      branch_address: '',
      account_type: 'savings'
    });
    setFormErrors({});
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    addAccountMutation.mutate(formData);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateAccountMutation.mutate({
      id: selectedAccount.emp_bank_id,
      payload: formData
    });
  };

  const handleConfirmDeleteAccount = () => {
    if (!deleteConfirmAccountId) return;
    deleteAccountMutation.mutate(deleteConfirmAccountId);
    setDeleteConfirmAccountId(null);
  };

  // Mock Payout Transactions mapping to linked accounts
  const mockTransactions = useMemo(() => {
    const hasAccounts = bankAccounts.length > 0;
    const primaryAcc = hasAccounts ? bankAccounts[0] : null;
    const secondaryAcc = hasAccounts && bankAccounts[1] ? bankAccounts[1] : null;

    const formatAcc = (acc) => {
      if (!acc) return 'Corporate Payroll';
      return `${acc.bank_name} (•••• ${acc.account_number.slice(-4)})`;
    };

    return [
      {
        id: 'TXN-9023412',
        date: '2026-06-30T10:00:00.000Z',
        description: 'Monthly Salary - June 2026',
        category: 'salary',
        amount: 85000,
        status: 'success',
        account: formatAcc(primaryAcc)
      },
      {
        id: 'TXN-8931221',
        date: '2026-06-15T14:30:00.000Z',
        description: 'Quarterly Project Performance Bonus',
        category: 'bonus',
        amount: 20000,
        status: 'success',
        account: formatAcc(primaryAcc)
      },
      {
        id: 'TXN-8821943',
        date: '2026-05-31T09:15:00.000Z',
        description: 'Monthly Salary - May 2026',
        category: 'salary',
        amount: 85000,
        status: 'success',
        account: formatAcc(primaryAcc)
      },
      {
        id: 'TXN-8711429',
        date: '2026-05-18T11:45:00.000Z',
        description: 'Local Business Travel Reimbursement',
        category: 'reimbursement',
        amount: 4350,
        status: 'success',
        account: formatAcc(secondaryAcc || primaryAcc)
      },
      {
        id: 'TXN-8600129',
        date: '2026-04-30T10:10:00.000Z',
        description: 'Monthly Salary - April 2026',
        category: 'salary',
        amount: 85000,
        status: 'success',
        account: formatAcc(primaryAcc)
      },
      {
        id: 'TXN-9988220',
        date: '2026-07-31T10:00:00.000Z',
        description: 'Upcoming Payout - July 2026',
        category: 'salary',
        amount: 85000,
        status: 'pending',
        account: formatAcc(primaryAcc)
      }
    ];
  }, [bankAccounts]);

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    let result = [...mockTransactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (txn) =>
          txn.id.toLowerCase().includes(q) ||
          txn.description.toLowerCase().includes(q) ||
          txn.account.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter((txn) => txn.category === typeFilter);
    }

    return result;
  }, [mockTransactions, searchQuery, typeFilter]);

  // Stats Card data
  const totalDisbursed = useMemo(() => {
    return mockTransactions
      .filter((txn) => txn.status === 'success')
      .reduce((sum, txn) => sum + txn.amount, 0);
  }, [mockTransactions]);

  const pendingDisbursements = useMemo(() => {
    return mockTransactions
      .filter((txn) => txn.status === 'pending')
      .reduce((sum, txn) => sum + txn.amount, 0);
  }, [mockTransactions]);

  return (
    <div className="flex flex-col gap-6 text-left max-w-7xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Bank Details & Payroll</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your linked corporate bank accounts and review salary history.</p>
        </div>

        {bankAccounts.length < 1 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4.5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20"
          >
            <Plus size={16} />
            <span>Link Bank Account</span>
          </button>
        )}
      </div>

      {/* Tabs list */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'accounts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
          }`}
        >
          Linked Bank Accounts ({bankAccounts.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'transactions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
          }`}
        >
          Salary & Payout History
        </button>
      </div>

      {/* Loading overlay state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <span className="text-sm font-medium">Fetching bank information...</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === 'accounts' ? (
            <motion.div
              key="accounts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {bankAccounts.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-xs transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <Landmark size={28} />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Bank Details Linked</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 max-w-sm">
                    Link your corporate bank details to receive salary disbursements, performance incentives, and travel reimbursements.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-5 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    <Plus size={14} />
                    <span>Link New Account</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Premium Informational Alert */}
                  <div className="flex items-start gap-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4.5 rounded-2xl transition-colors">
                    <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" size={16} />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Single Active Account Limit</h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-1 leading-relaxed">
                        To register a different bank account, please edit your current details or remove this account first. Only one active account is permitted per employee.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {bankAccounts.map((account, idx) => {
                    const isPrimary = idx === 0;
                    return (
                      <div
                        key={account.emp_bank_id}
                        className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md`}
                      >
                        {/* Elegant Bank Card Header */}
                        <div
                          className={`p-6 text-white flex flex-col justify-between h-44 relative overflow-hidden bg-gradient-to-br ${
                            isPrimary
                              ? 'from-indigo-600 via-indigo-700 to-slate-900'
                              : 'from-slate-700 via-slate-800 to-slate-950'
                          }`}
                        >
                          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />
                          <div className="flex justify-between items-start z-10">
                            <div>
                              <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest block">
                                {isPrimary ? 'Primary Account' : 'Alternate Account'}
                              </span>
                              <h3 className="text-base font-extrabold mt-1 tracking-tight">{account.bank_name}</h3>
                            </div>
                            <Landmark size={22} className="text-white/80" />
                          </div>

                          <div className="z-10 mt-auto">
                            <div className="text-sm font-semibold tracking-widest font-mono text-white/90">
                              •••• •••• •••• {account.account_number.slice(-4)}
                            </div>
                            <div className="flex justify-between items-end mt-3">
                              <div>
                                <span className="text-[9px] text-white/60 uppercase font-bold block tracking-wider">Account Type</span>
                                <span className="text-xs font-bold font-mono capitalize">{account.account_type}</span>
                              </div>
                              <span className="bg-white/25 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
                                <ShieldCheck size={9} /> Linked
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Account Details Panel */}
                        <div className="p-6 flex-1 flex flex-col gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider mb-1">
                                IFSC Code
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wide font-mono">
                                {account.ifsc_code}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider mb-1">
                                Full Account Number
                              </span>
                              <span className="text-slate-800 dark:text-slate-200 font-bold font-mono">{account.account_number}</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider mb-1">
                              Branch Details & Address
                            </span>
                            <span className="text-slate-700 dark:text-slate-300 block leading-relaxed">{account.branch_address}</span>
                          </div>

                          {/* Action Items */}
                          <div className="flex justify-end items-center gap-2 border-t border-slate-55 dark:border-slate-800/60 pt-4 mt-auto">
                            <button
                              onClick={() => handleOpenEditModal(account)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 transition-all font-bold cursor-pointer"
                            >
                              <Pencil size={12} />
                              <span>Edit Details</span>
                            </button>

                            {canManageBank && (
                              <button
                               onClick={() => setDeleteConfirmAccountId(account.emp_bank_id)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30 transition-all font-bold cursor-pointer"
                              >
                                <Trash2 size={12} />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Transactions Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Total Disbursed</span>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">₹{totalDisbursed.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <DollarSign size={20} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Pending Clearances</span>
                    <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">₹{pendingDisbursements.toLocaleString('en-IN')}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex items-center justify-between transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Next Salary Release</span>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">August 1, 2026</h3>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                </div>
              </div>

              {/* Transactions List View */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Company Payout History</h3>

                  {/* Search and filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2 w-full sm:w-64 transition-all">
                      <Search size={14} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search TXN ID or details..."
                        className="bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2 transition-all">
                      <Filter size={14} className="text-slate-400" />
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer"
                      >
                        <option value="all">All Payout Types</option>
                        <option value="salary">Salary</option>
                        <option value="bonus">Bonus</option>
                        <option value="reimbursement">Reimbursement</option>
                      </select>
                    </div>
                  </div>
                </div>

                {bankAccounts.length === 0 && (
                  <div className="mb-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-250/30 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <div>
                      <span className="font-bold">Important: No active bank accounts linked!</span>
                      <p className="mt-1 opacity-90">Please link your primary bank account under the "Linked Bank Accounts" tab to clear upcoming pending disbursements.</p>
                    </div>
                  </div>
                )}

                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-semibold text-sm">
                    No transactions matching the selected filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pb-3">
                          <th className="pb-3 px-4">Payout Date</th>
                          <th className="pb-3 px-4">Transaction ID</th>
                          <th className="pb-3 px-4">Description</th>
                          <th className="pb-3 px-4">Destination Account</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 px-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                        {filteredTransactions.map((txn) => {
                          const dateObj = new Date(txn.date);
                          const isSuccess = txn.status === 'success';

                          return (
                            <tr key={txn.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors text-xs text-slate-705 dark:text-slate-350">
                              <td className="py-4.5 px-4 font-semibold text-slate-500">
                                {dateObj.toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="py-4.5 px-4 font-mono font-bold uppercase text-slate-850 dark:text-slate-300">
                                {txn.id}
                              </td>
                              <td className="py-4.5 px-4">
                                <div className="font-bold text-slate-800 dark:text-slate-200">{txn.description}</div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                                  {txn.category}
                                </span>
                              </td>
                              <td className="py-4.5 px-4 font-medium flex items-center gap-2 mt-1">
                                <Building2 size={12} className="text-slate-400" />
                                <span>{txn.account}</span>
                              </td>
                              <td className="py-4.5 px-4">
                                <span
                                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isSuccess
                                      ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/30'
                                      : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border-amber-100 dark:border-amber-900/30'
                                  }`}
                                >
                                  {isSuccess ? 'Success / Settled' : 'Pending Clearance'}
                                </span>
                              </td>
                              <td className="py-4.5 px-4 text-right font-extrabold font-mono text-slate-800 dark:text-slate-100 text-sm">
                                {isSuccess ? '+' : ''}₹{txn.amount.toLocaleString('en-IN')}.00
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Add Bank Details Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-lg overflow-hidden transition-colors"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                  <Landmark className="text-indigo-650" size={18} />
                  <span>Link Corporate Bank Account</span>
                </h3>
                <button
                  onClick={closeAddModal}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="e.g., HDFC Bank Ltd, ICICI Bank"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                  {formErrors.bank_name && <span className="text-rose-500 mt-1 block font-bold">{formErrors.bank_name}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      placeholder="e.g., 501002349122"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium font-mono"
                    />
                    {formErrors.account_number && <span className="text-rose-500 mt-1 block font-bold">{formErrors.account_number}</span>}
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC0000129"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium font-mono uppercase"
                    />
                    {formErrors.ifsc_code && <span className="text-rose-500 mt-1 block font-bold">{formErrors.ifsc_code}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: 'savings' }))}
                      className={`py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        formData.account_type === 'savings'
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      Savings Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: 'current' }))}
                      className={`py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        formData.account_type === 'current'
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      Current Account
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">Branch Address</label>
                  <textarea
                    name="branch_address"
                    value={formData.branch_address}
                    onChange={handleInputChange}
                    rows={2.5}
                    placeholder="e.g., Sector 62 Branch, Noida, UP"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium resize-none"
                  />
                  {formErrors.branch_address && <span className="text-rose-500 mt-1 block font-bold">{formErrors.branch_address}</span>}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addAccountMutation.isPending}
                    className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {addAccountMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    <span>Link Account</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Bank Details Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl w-full max-w-lg overflow-hidden transition-colors"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/10">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
                  <Pencil className="text-indigo-650" size={16} />
                  <span>Edit Linked Bank Details</span>
                </h3>
                <button
                  onClick={closeEditModal}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-650 dark:text-slate-400 uppercase tracking-wider mb-1.5">Bank Name</label>
                  <input
                    type="text"
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleInputChange}
                    placeholder="e.g., HDFC Bank Ltd"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
                  />
                  {formErrors.bank_name && <span className="text-rose-500 mt-1 block font-bold">{formErrors.bank_name}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-650 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Number</label>
                    <input
                      type="text"
                      name="account_number"
                      value={formData.account_number}
                      onChange={handleInputChange}
                      placeholder="e.g., 501002349122"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium font-mono"
                    />
                    {formErrors.account_number && <span className="text-rose-500 mt-1 block font-bold">{formErrors.account_number}</span>}
                  </div>

                  <div>
                    <label className="block text-slate-650 dark:text-slate-400 uppercase tracking-wider mb-1.5">IFSC Code</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={formData.ifsc_code}
                      onChange={handleInputChange}
                      placeholder="e.g., HDFC0000129"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium font-mono uppercase"
                    />
                    {formErrors.ifsc_code && <span className="text-rose-550 mt-1 block font-bold">{formErrors.ifsc_code}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-650 dark:text-slate-400 uppercase tracking-wider mb-1.5">Account Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: 'savings' }))}
                      className={`py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        formData.account_type === 'savings'
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      Savings Account
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, account_type: 'current' }))}
                      className={`py-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        formData.account_type === 'current'
                          ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 text-indigo-700 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      Current Account
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-650 dark:text-slate-400 uppercase tracking-wider mb-1.5">Branch Address</label>
                  <textarea
                    name="branch_address"
                    value={formData.branch_address}
                    onChange={handleInputChange}
                    rows={2.5}
                    placeholder="e.g., Branch Address"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200 bg-transparent focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium resize-none"
                  />
                  {formErrors.branch_address && <span className="text-rose-500 mt-1 block font-bold">{formErrors.branch_address}</span>}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateAccountMutation.isPending}
                    className="px-4.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updateAccountMutation.isPending && <Loader2 size={12} className="animate-spin" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Themed Bank Account Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmAccountId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmAccountId(null)}
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
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-955 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Remove Bank Account?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to remove this bank account? This action is permanent and cannot be undone.
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  onClick={() => setDeleteConfirmAccountId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteAccount}
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

export default BankAccountsPage;
