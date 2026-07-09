import { Clock, UserCheck, CalendarDays } from 'lucide-react';

/**
 * StatsDashboard renders three metrics cards using historical statistics:
 * 1. Present Days ratio (out of total logs).
 * 2. Average daily working hours.
 * 3. Total Late check-ins count.
 */
const StatsDashboard = ({ statistics }) => {
  const {
    totalDays = 0,
    presentDays = 0,
    halfDays = 0,
    avgWorkingHours = 0,
    lateCheckIns = 0,
  } = statistics || {};

  // Calculate percentage of present days (active days) out of total calendar logs
  const presentRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  // Calculate average hours out of standard 8 hour shift
  const hoursRate = Math.min(100, Math.round((avgWorkingHours / 8.0) * 100));
  // Calculate percentage of logs that were late
  const lateRate = totalDays > 0 ? Math.round((lateCheckIns / totalDays) * 100) : 0;

  return (
    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Present Days Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Present Days
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 transition-colors">
              {presentDays} <span className="text-sm font-normal text-slate-400">/ {totalDays} days</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${presentRate}%` }}
          />
        </div>
      </div>

      {/* Average Working Hours Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Avg. Working Hours
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 transition-colors">
              {avgWorkingHours} <span className="text-sm font-normal text-slate-400">hrs / day</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Clock size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-650 h-full rounded-full transition-all duration-500"
            style={{ width: `${hoursRate}%` }}
          />
        </div>
      </div>

      {/* Late Check-ins Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32 sm:col-span-2 transition-all duration-300">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Late Check-ins
            </span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 transition-colors">
              {lateCheckIns} <span className="text-sm font-normal text-slate-400">{lateCheckIns === 1 ? 'Day' : 'Days'}</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 flex items-center justify-center">
            <CalendarDays size={20} />
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${lateRate}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
