import { CheckSquare, Calendar, Coffee, FileText, Users } from 'lucide-react';

const MonthStats = ({ currentDate, events }) => {
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
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Leaves',
      value: leaveCount,
      icon: FileText,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Total Holidays',
      value: holidayCount,
      icon: Coffee,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
    {
      title: 'Total Meetings',
      value: meetingCount,
      icon: Users,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Working Days',
      value: workingDays,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5 h-full">
      <div className="border-b border-slate-100 pb-3 text-left">
        <h4 className="font-bold text-slate-800 text-base">Monthly Summary</h4>
        <span className="text-xs text-slate-400 font-semibold block mt-1">
          Stats for {monthNames[month]} {year}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex justify-between items-center p-3.5 rounded-2xl border border-slate-50 hover:bg-slate-50/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}>
                  <Icon size={18} />
                </div>
                <span className="text-sm font-semibold text-slate-600">{item.title}</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthStats;
