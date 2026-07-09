import { useState, useEffect } from 'react';
import { Clock, Play, LogOut, Loader2 } from 'lucide-react';

/**
 * ClockCard displays the ticking current time, today's check-in/check-out status,
 * and handles the user interaction to clock in/out.
 */
const ClockCard = ({ todayAttendance, onCheckIn, onCheckOut, isMutating }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format digital time
  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Format date header
  const formattedDate = time.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Helper to format iso date string to time
  const formatTimeStr = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine current state
  const isCheckedIn = !!todayAttendance && !todayAttendance.check_out && todayAttendance.status !== 'absent';
  const isCheckedOut = !!todayAttendance && !!todayAttendance.check_out;
  const isAbsent = !!todayAttendance && todayAttendance.status === 'absent';

  let statusText = 'Not Checked-In';
  let statusColor = 'text-slate-400 dark:text-slate-500';
  let buttonText = 'Clock In';
  let buttonIcon = <Play size={16} />;
  let buttonAction = onCheckIn;
  let buttonClass = 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10 dark:shadow-indigo-650/10';

  if (isAbsent) {
    statusText = 'Absent';
    statusColor = 'text-rose-500 dark:text-rose-400 font-semibold';
  } else if (isCheckedIn) {
    statusText = `Checked-In at ${formatTimeStr(todayAttendance.check_in)}`;
    statusColor = 'text-emerald-500 dark:text-emerald-400 font-semibold';
    buttonText = 'Clock Out';
    buttonIcon = <LogOut size={16} />;
    buttonAction = onCheckOut;
    buttonClass = 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10';
  } else if (isCheckedOut) {
    const workingHours = todayAttendance.working_hours || 0;
    statusText = `Checked-Out (Worked: ${workingHours} hrs)`;
    statusColor = 'text-slate-500 dark:text-slate-400 font-semibold';
    buttonText = 'Completed';
    buttonIcon = null;
    buttonAction = null;
    buttonClass = 'bg-slate-150 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed';
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-72 transition-all duration-300">
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          <span>Mark Attendance</span>
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
          {formattedDate}
        </span>
      </div>

      <div className="my-4 text-center">
        <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono tracking-tight transition-colors">
          {formattedTime}
        </span>
        <span className={`text-xs block mt-2 transition-colors ${statusColor}`}>
          Status: {statusText}
        </span>
      </div>

      {isAbsent ? (
        <div className="flex flex-col gap-2 w-full text-center">
          <div className="py-3 px-4 rounded-2xl text-sm font-semibold bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/30 select-none">
            Absent
          </div>
          <span className="text-xs text-rose-500 dark:text-rose-450 font-medium">
            Contact administration to approve attendance
          </span>
        </div>
      ) : isCheckedOut ? (
        <div className="w-full text-center py-3.5 px-4 rounded-2xl text-sm font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50 select-none">
          Today's Shift Finished
        </div>
      ) : (
        <button
          onClick={buttonAction}
          disabled={isMutating}
          className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-4 rounded-2xl text-sm transition-all duration-200 cursor-pointer shadow-md active:scale-[0.98] ${buttonClass} disabled:opacity-50`}
        >
          {isMutating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            buttonIcon
          )}
          <span>{isMutating ? 'Processing...' : buttonText}</span>
        </button>
      )}
    </div>
  );
};

export default ClockCard;
