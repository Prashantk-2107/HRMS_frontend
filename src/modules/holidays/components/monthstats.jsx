import { CheckSquare, Calendar, Coffee, FileText, Users } from 'lucide-react';

const MonthStats = ({ currentDate, events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 h-full transition-colors duration-200 animate-pulse">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 text-left">
          <div className="w-36 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="w-24 h-3 bg-slate-200 dark:bg-slate-800 rounded mt-2" />
        </div>

        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-3.5 rounded-2xl border border-slate-50 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
              <div className="w-6 h-5 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper calculation functions
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getWorkingDaysCount = (y, m) => {
    let count = 0;
    const days = getDaysInMonth(y, m);
    for (let d = 1; d <= days; d++) {
      const dayOfWeek = new Date(y, m, d).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
        count++;
      }
    }
    return count;
  };

  const workingDays = getWorkingDaysCount(year, month);

  // Filter events belonging to current month and year
  const currentMonthEvents = events.filter(evt => {
    const evtDate = new Date(evt.date);
    return evtDate.getFullYear() === year && evtDate.getMonth() === month;
  });

  const presentCount = currentMonthEvents.filter(e => e.type === 'attendance').length;
  const leaveCount = currentMonthEvents.filter(e => e.type === 'leave').length;
  const holidayCount = currentMonthEvents.filter(e => e.type === 'holiday').length;
  const meetingCount = currentMonthEvents.filter(e => e.type === 'meeting').length;

  const statItems = [
    {
      title: 'Total Present',
      value: presentCount,
      icon: CheckSquare,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40',
    },
    {
      title: 'Total Leaves',
      value: leaveCount,
      icon: FileText,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/40',
    },
    {
      title: 'Total Holidays',
      value: holidayCount,
      icon: Coffee,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40',
    },
    {
      title: 'Total Meetings',
      value: meetingCount,
      icon: Users,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40',
    },
    {
      title: 'Working Days',
      value: workingDays,
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-5 h-full transition-colors duration-200">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 text-left">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">Monthly Summary</h4>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold block mt-1">
          Stats for {monthNames[month]} {year}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex justify-between items-center p-3.5 rounded-2xl border border-slate-50 dark:border-slate-800 hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{item.title}</span>
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthStats;
