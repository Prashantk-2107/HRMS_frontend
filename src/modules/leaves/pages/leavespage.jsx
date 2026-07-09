import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Calendar, AlertCircle, Clock, Check, X, FileText, Loader2, UserCheck, HelpCircle } from 'lucide-react';
import api, { LEAVE_ENDPOINTS } from '../../../services/api';
import { usePermission } from '../../../hooks/usepermission';

/**
 * LeavesPage manages applying for leaves, tracking own balance, and handling pending leave requests.
 */
const LeavesPage = () => {
  const queryClient = useQueryClient();
  const { role } = usePermission();

  // Role permissions checking
  const roleName = (typeof role === 'object' ? role?.name : role) || '';
  const normalizedRole = roleName.toLowerCase().replace(/[\s_-]/g, '');
  const isHROrAdmin = ['admin', 'superadmin', 'humanresource', 'projectmanager'].includes(normalizedRole);

  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('casual');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  // Rejection states
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // 1. Fetch own leave request logs
  const { data: myLeaves = [], isLoading: isMyLeavesLoading } = useQuery({
    queryKey: ['leaves', 'my'],
    queryFn: async () => {
      const response = await api.get(LEAVE_ENDPOINTS.GET_MY);
      return response.data?.data?.requests || [];
    },
  });

  // 2. Fetch pending leave requests (HR/Admin only)
  const { data: pendingLeaves = [], isLoading: isPendingLeavesLoading } = useQuery({
    queryKey: ['leaves', 'pending'],
    queryFn: async () => {
      const response = await api.get(LEAVE_ENDPOINTS.GET_PENDING);
      return response.data?.data?.requests || [];
    },
    enabled: isHROrAdmin,
  });

  // Mutations
  const createLeaveMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(LEAVE_ENDPOINTS.SUBMIT, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Leave request submitted!');
      setStartDate('');
      setEndDate('');
      setLeaveType('casual');
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      // Invalidate attendance queries since approved leaves directly affect logs
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to submit request.';
      toast.error(msg);
    },
  });

  const approveLeaveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.post(LEAVE_ENDPOINTS.APPROVE(id));
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Leave approved.');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to approve leave.';
      toast.error(msg);
    },
  });

  const rejectLeaveMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.post(LEAVE_ENDPOINTS.REJECT(id), {
        rejection_reason: reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Leave request rejected.');
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to reject leave.';
      toast.error(msg);
    },
  });

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate || !reason || !leaveType) {
      setError('Please fill in all the fields.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setError('End date must be on or after start date.');
      return;
    }

    if (reason.trim().length < 5) {
      setError('Please write a detailed reason (at least 5 characters).');
      return;
    }

    createLeaveMutation.mutate({
      start_date: startDate,
      end_date: endDate,
      leave_type: leaveType,
      reason: reason.trim(),
    });
  };

  const handleStartReject = (id) => {
    setRejectingId(id);
    setRejectionReason('');
  };

  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectionReason('');
  };

  const handleConfirmReject = (id) => {
    if (!rejectionReason || rejectionReason.trim().length < 3) {
      alert('Please enter a valid rejection reason.');
      return;
    }
    rejectLeaveMutation.mutate({ id, reason: rejectionReason.trim() });
    setRejectingId(null);
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Render leave type badges
  const renderTypeBadge = (type) => {
    let classes = 'px-2 py-0.5 text-[10px] font-bold uppercase rounded ';
    switch (type) {
      case 'sick':
        classes += 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400';
        break;
      case 'casual':
        classes += 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400';
        break;
      case 'earned':
        classes += 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
        break;
      default:
        classes += 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    }
    return <span className={classes}>{type}</span>;
  };

  // Render leave status badges
  const renderStatusBadge = (status) => {
    let classes = 'px-2.5 py-1 text-xs font-semibold rounded-full ';
    switch (status) {
      case 'approved':
        classes += 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
        break;
      case 'rejected':
        classes += 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400';
        break;
      default:
        classes += 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
    }
    return <span className={classes}>{status}</span>;
  };

  // Summarize leave days
  const getDaysCount = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} ${diff === 1 ? 'Day' : 'Days'}`;
  };

  const isMutatingApproval = approveLeaveMutation.isPending || rejectLeaveMutation.isPending;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Leaves Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Apply for time-off, monitor balance, and process approvals.</p>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Casual Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 block">12 Days</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Annual allocation limit</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Sick Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 block">6 Days</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Full medical coverage</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Earned Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 block">15 Days</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Carried forward leaves</span>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Unpaid Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2 block">Unlimited</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Loss-of-pay category</span>
        </div>
      </div>

      {/* HR/Admin Approvals Panel */}
      {isHROrAdmin && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors duration-300">
          <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200">
                Pending Leave Requests
              </h3>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-400">
              {pendingLeaves.length} Pending
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/20 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-50 dark:border-slate-800">
                  <th className="py-4 px-6">Employee</th>
                  <th className="py-4 px-6">Leave Details</th>
                  <th className="py-4 px-6">Dates</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {isPendingLeavesLoading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">Loading pending requests...</td>
                  </tr>
                ) : pendingLeaves.length > 0 ? (
                  pendingLeaves.map((req) => {
                    const empName = `${req.employee?.first_name || ''} ${req.employee?.last_name || ''}`;
                    const isThisRejecting = rejectingId === req.id;

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col text-left">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">{empName}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">{req.employee?.empCode} • {req.employee?.role?.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 items-start">
                            {renderTypeBadge(req.leave_type)}
                            <span className="text-[11px] text-slate-400 font-medium">
                              ({getDaysCount(req.start_date, req.end_date)})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-medium text-xs">
                          <div>From: {formatDate(req.start_date)}</div>
                          <div>To: {formatDate(req.end_date)}</div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 max-w-xs break-words">{req.reason}</td>
                        <td className="py-4 px-6">
                          {isThisRejecting ? (
                            <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                              <input
                                type="text"
                                placeholder="Rejection reason..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={handleCancelReject}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-150 rounded-md cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleConfirmReject(req.id)}
                                  disabled={isMutatingApproval}
                                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer flex items-center gap-1"
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => approveLeaveMutation.mutate(req.id)}
                                disabled={isMutatingApproval}
                                className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                                title="Approve Request"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={() => handleStartReject(req.id)}
                                disabled={isMutatingApproval}
                                className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                                title="Reject Request"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Check size={28} className="text-emerald-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">All Caught Up!</span>
                        <span className="text-xs text-slate-400">No pending leave requests to process.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Main Form + History Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Form Column */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm transition-colors duration-300">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
            <Clock size={18} className="text-indigo-650" />
            <span>Apply for Leave</span>
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="flex items-start gap-2 text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl border border-rose-100/50 dark:border-rose-900/50">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Leave Type */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Leave Type</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave (Loss of Pay)</option>
              </select>
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Reason for Leave</label>
              <textarea
                rows={3}
                placeholder="Reason details..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none resize-none placeholder-slate-400"
              />
            </div>

            {/* Actions */}
            <button
              type="submit"
              disabled={createLeaveMutation.isPending}
              className="py-3 px-6 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
            >
              {createLeaveMutation.isPending && <Loader2 size={13} className="animate-spin" />}
              <span>{createLeaveMutation.isPending ? 'Submitting...' : 'Submit Leave Request'}</span>
            </button>
          </form>
        </div>

        {/* History Table Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors duration-300">
          <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-200">Leave History</h3>
            <span className="text-xs text-slate-400 dark:text-slate-500">Personal requests logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-50 dark:border-slate-800">
                  <th className="py-4 px-6">Leave Type</th>
                  <th className="py-4 px-6">Date Range</th>
                  <th className="py-4 px-6">Reason</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
                {isMyLeavesLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">Loading leave history...</td>
                  </tr>
                ) : myLeaves.length > 0 ? (
                  myLeaves.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1 items-start">
                          {renderTypeBadge(log.leave_type)}
                          <span className="text-[10px] text-slate-400 font-semibold select-none">
                            {getDaysCount(log.start_date, log.end_date)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-600 dark:text-slate-300">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(log.start_date)}</div>
                        <div className="text-[10px] text-slate-400">to {formatDate(log.end_date)}</div>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-500 max-w-xs break-words">
                        {log.reason}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          {renderStatusBadge(log.status)}
                          {log.status === 'rejected' && log.rejection_reason && (
                            <span 
                              className="text-[9px] text-rose-500 font-semibold flex items-center gap-0.5 cursor-help"
                              title={`Rejection Reason: ${log.rejection_reason}`}
                            >
                              View Reason
                              <HelpCircle size={8} />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-slate-300 dark:text-slate-700" />
                        <span>No leave requests found. Submit your first leave request above!</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
