import { Calendar, Trash2 } from 'lucide-react';

const HolidaysTable = ({ holidays, onDeleteHoliday }) => {
  const formatDateDisplay = (dateStr) => {
    try {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  const getDayOfWeek = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return days[date.getDay()];
    } catch {
      return '';
    }
  };

  // Sort holidays chronologically
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left flex flex-col mt-6">
      {/* Title Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
          <Calendar size={18} className="text-purple-500" />
          <span>Corporate Holidays List</span>
        </h3>
        <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full border border-purple-100">
          {sortedHolidays.length} Registered Holidays
        </span>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        {sortedHolidays.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Holiday Name</th>
                {onDeleteHoliday && (
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedHolidays.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {formatDateDisplay(h.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {getDayOfWeek(h.date)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    {h.label}
                  </td>
                  {onDeleteHoliday && (
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => onDeleteHoliday(h.date)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-650 cursor-pointer transition-colors"
                        title="Delete Holiday"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <span className="text-slate-400 font-medium text-sm">No Holidays Registered</span>
            <p className="text-xs text-slate-400 mt-1">Use the "Add Holiday" button at the top to register a holiday.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidaysTable;
