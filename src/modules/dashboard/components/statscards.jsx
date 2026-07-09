import { Users, CalendarCheck, Calendar, Shield } from 'lucide-react';

const StatsCards = ({
  canViewEmployees,
  isEmployeesLoading,
  employeesCount,
  isTodayAttendanceLoading,
  isCheckedIn,
  isCheckedOut,
  isHolidaysLoading,
  nextHoliday,
  role
}) => {
  const roleName = role && typeof role === 'object' ? (role.name || role.title || 'Staff') : (role || 'Staff');
  const holidayName = nextHoliday ? nextHoliday.name : 'None Scheduled';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1: Total Staff */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-indigo-100 dark:hover:border-slate-850">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-655 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
          <Users size={20} className="sm:size-6" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider truncate">Total Staff</span>
          {canViewEmployees ? (
            <span className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-slate-150">
              {isEmployeesLoading ? '...' : employeesCount}
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-400">Restricted</span>
          )}
        </div>
      </div>

      {/* Card 2: Attendance Status */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-emerald-100 dark:hover:border-slate-850">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isCheckedIn
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            : isCheckedOut
              ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
        }`}>
          <CalendarCheck size={20} className="sm:size-6" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider truncate">Today's Status</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-150 truncate block mt-0.5">
            {isTodayAttendanceLoading ? 'Checking...' : isCheckedIn ? 'Active Now' : isCheckedOut ? 'Shift Done' : 'Not Clocked'}
          </span>
        </div>
      </div>

      {/* Card 3: Next Holiday */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-purple-100 dark:hover:border-slate-850">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
          <Calendar size={20} className="sm:size-6" />
        </div>
        <div className="overflow-hidden w-full">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider truncate">Next Holiday</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-150 block truncate mt-0.5" title={holidayName}>
            {isHolidaysLoading ? '...' : holidayName}
          </span>
        </div>
      </div>

      {/* Card 4: Access Level */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-amber-100 dark:hover:border-slate-850">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-650 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="sm:size-6" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider truncate">Your Role</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-150 block truncate mt-0.5 capitalize">
            {roleName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
