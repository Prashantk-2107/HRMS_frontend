import { Clock, Loader2, LogOut, LogIn } from 'lucide-react';

const ClockWidget = ({
  todayAttendance,
  isCheckedIn,
  isCheckedOut,
  activeDuration,
  onCheckIn,
  onCheckOut,
  isClockMutating
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-72 transition-colors duration-250">
      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Clock size={18} className="text-indigo-500" />
          <span>Direct Check-In</span>
        </h3>
        <span className="text-xs text-slate-400 dark:text-slate-500 block mt-1">
          Log attendance without leaving the homepage.
        </span>
      </div>

      <div className="my-2 text-center bg-slate-50/50 dark:bg-slate-950/50 py-4 px-3 rounded-2xl border border-slate-100/50 dark:border-slate-800/30">
        {isCheckedIn ? (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tight text-emerald-500 dark:text-emerald-400">
              {activeDuration || '00:00:00'}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
              Checked in at {todayAttendance?.check_in ? new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
            </span>
          </div>
        ) : isCheckedOut ? (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-400 dark:text-slate-550">
              Shift Ended
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
              Worked today: {todayAttendance?.working_hours ? `${Number(todayAttendance.working_hours).toFixed(2)} hrs` : 'N/A'}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tight text-slate-400 dark:text-slate-650">
              Offline
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-1">
              Please clock in to register your shift.
            </span>
          </div>
        )}
      </div>

      {isCheckedOut ? (
        <div className="w-full text-center py-3.5 px-4 rounded-xl text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-750 select-none">
          Shift Log Completed
        </div>
      ) : (
        <button
          onClick={() => isCheckedIn ? onCheckOut() : onCheckIn()}
          disabled={isClockMutating}
          className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 px-4 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98] ${
            isCheckedIn
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isClockMutating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isCheckedIn ? (
            <LogOut size={16} />
          ) : (
            <LogIn size={16} />
          )}
          <span>{isClockMutating ? 'Processing...' : isCheckedIn ? 'Clock Out' : 'Clock In Now'}</span>
        </button>
      )}
    </div>
  );
};

export default ClockWidget;
