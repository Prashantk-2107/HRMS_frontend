import { useState } from 'react';
import { X, Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';

/**
 * RegularizationModal allows an employee to submit a correction request for a specific log.
 * Computes correct DateTime strings by combining the log's date and user's entered time.
 */
const RegularizationModal = ({ isOpen, onClose, log, onSubmit, isPending }) => {
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !log) return null;

  // Format attendance date for display
  const logDateStr = new Date(log.attendance_date).toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!reason || reason.trim().length < 5) {
      setError('Please provide a reason (at least 5 characters).');
      return;
    }

    if (!checkInTime && !checkOutTime) {
      setError('Please enter at least a Check-In or Check-Out time to correct.');
      return;
    }

    // Extract log date prefix (YYYY-MM-DD)
    const logDateObj = new Date(log.attendance_date);
    const year = logDateObj.getFullYear();
    const month = String(logDateObj.getMonth() + 1).padStart(2, '0');
    const day = String(logDateObj.getDate()).padStart(2, '0');
    const datePrefix = `${year}-${month}-${day}`;

    // Construct local Date and get ISO strings
    let checkInISO = null;
    let checkOutISO = null;

    if (checkInTime) {
      const checkInLocal = new Date(`${datePrefix}T${checkInTime}`);
      if (isNaN(checkInLocal.getTime())) {
        setError('Invalid check-in time format.');
        return;
      }
      checkInISO = checkInLocal.toISOString();
    }

    if (checkOutTime) {
      const checkOutLocal = new Date(`${datePrefix}T${checkOutTime}`);
      if (isNaN(checkOutLocal.getTime())) {
        setError('Invalid check-out time format.');
        return;
      }
      checkOutISO = checkOutLocal.toISOString();

      if (checkInTime) {
        const checkInLocal = new Date(`${datePrefix}T${checkInTime}`);
        if (checkOutLocal <= checkInLocal) {
          setError('Check-out time must be after check-in time.');
          return;
        }
      }
    }

    onSubmit({
      attendance_id: log.id,
      check_in: checkInISO,
      check_out: checkOutISO,
      reason: reason.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-100 dark:border-slate-800 shadow-xl max-w-md w-full overflow-hidden transition-all duration-300">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Request Attendance Correction
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Submit a request to update your attendance times.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Target Date Details */}
          <div className="flex gap-3 items-center bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 p-3.5 rounded-2xl">
            <Calendar size={18} className="text-indigo-650 flex-shrink-0" />
            <div className="text-left">
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                Target Shift Date
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">
                {logDateStr}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-xl border border-rose-100/50 dark:border-rose-900/50">
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Time Picker Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                <span>New Check-In</span>
              </label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-all font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center gap-1">
                <Clock size={12} className="text-slate-400" />
                <span>New Check-Out</span>
              </label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-all font-semibold"
              />
            </div>
          </div>

          {/* Explanation Textarea */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
              Reason / Explanation
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide reason (e.g. forgot to check out, system marked absent in error...)"
              className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-550 transition-all resize-none placeholder-slate-400"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="py-3 px-5 rounded-2xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="py-3 px-6 rounded-2xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-650/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isPending && <Loader2 size={13} className="animate-spin" />}
              <span>{isPending ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegularizationModal;
