const CalendarLegend = () => {
  const legendItems = [
    { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Attendance (Present)' },
    { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Holidays' },
    { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Leaves (Absent/Sick)' },
    { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Meetings' },
    { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Current Date (Today)' },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
      <h4 className="font-bold text-slate-800 text-sm">Calendar Legend</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {legendItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <span className={`w-3.5 h-3.5 rounded-md border ${item.color} flex-shrink-0`} />
            <span className="text-xs font-semibold text-slate-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarLegend;
