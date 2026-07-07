const CalendarLegend = () => {
  const legendItems = [
    { color: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/40', label: 'Attendance (Present)' },
    { color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/40', label: 'Holidays' },
    { color: 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/40', label: 'Leaves (Absent/Sick)' },
    { color: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/40', label: 'Meetings' },
    { color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/60', label: 'Current Date (Today)' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 transition-colors duration-200">
      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Calendar Legend</h4>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className={`w-3.5 h-3.5 rounded-md border ${item.color} flex-shrink-0`} />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
