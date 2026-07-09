import { useState } from 'react';
import { UserCheck, Check, X, AlertCircle, Loader2 } from 'lucide-react';

/**
 * AdminApprovalPanel renders a table of pending correction requests.
 * Provides quick actions to Approve and Reject (with reason) each request.
 */
const AdminApprovalPanel = ({ requests, onApprove, onReject, isPending }) => {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Helper to format ISO dates to time strings
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to format request date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
      alert('Please enter a rejection reason (at least 3 characters).');
      return;
    }
    onReject(id, rejectionReason.trim());
    setRejectingId(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden mb-8 transition-colors duration-300">
      <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/10">
        <div className="flex items-center gap-2">
          <UserCheck size={18} className="text-indigo-600" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">
            Pending Regularization Requests
          </h3>
        </div>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-50 dark:bg-indigo-950/45 text-indigo-700 dark:text-indigo-400">
          {requests?.length || 0} Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/20 dark:bg-slate-800/20 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-50 dark:border-slate-850">
              <th className="py-4 px-6">Employee</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Current Times</th>
              <th className="py-4 px-6">Requested Times</th>
              <th className="py-4 px-6">Reason</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
            {requests && requests.length > 0 ? (
              requests.map((req) => {
                const empName = `${req.employee?.first_name || ''} ${req.employee?.last_name || ''}`;
                const isThisRejecting = rejectingId === req.id;

                return (
                  <tr key={req.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {empName}
                        </span>
                        <span className="text-[10px] text-slate-450 dark:text-slate-500">
                          {req.employee?.empCode} • {req.employee?.email}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {formatDate(req.requested_date)}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      <div>In: {formatTime(req.attendance?.check_in)}</div>
                      <div>Out: {formatTime(req.attendance?.check_out)}</div>
                    </td>
                    <td className="py-4 px-6 text-indigo-650 dark:text-indigo-400 font-semibold text-xs">
                      <div>In: {req.check_in ? formatTime(req.check_in) : 'No Change'}</div>
                      <div>Out: {req.check_out ? formatTime(req.check_out) : 'No Change'}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs max-w-xs break-words">
                      {req.reason}
                    </td>
                    <td className="py-4 px-6">
                      {isThisRejecting ? (
                        <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                          <input
                            type="text"
                            placeholder="Rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-150 text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={handleCancelReject}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-150 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleConfirmReject(req.id)}
                              disabled={isPending}
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer flex items-center gap-1"
                            >
                              {isPending && <Loader2 size={10} className="animate-spin" />}
                              Confirm
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onApprove(req.id)}
                            disabled={isPending}
                            className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                            title="Approve Request"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleStartReject(req.id)}
                            disabled={isPending}
                            className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 hover:bg-rose-100 dark:hover:bg-rose-950/60 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
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
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Check size={28} className="text-emerald-500" />
                    <span className="font-semibold text-slate-600 dark:text-slate-400">All caught up!</span>
                    <span className="text-xs text-slate-400 dark:text-slate-550">No pending regularization requests.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApprovalPanel;
