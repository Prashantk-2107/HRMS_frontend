import { Calendar, Trash2 } from 'lucide-react';
import Pagination from '../../../components/ui/pagination';

const HolidaysTable = ({
  holidays,
  onDeleteHoliday,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-left flex flex-col mt-6 transition-colors duration-200">
        {/* Skeleton Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-40 h-5 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="w-28 h-6 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>

        {/* Skeleton Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider w-3/12 min-w-[160px]">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider w-2/12 min-w-[100px]">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider w-4/12 min-w-[180px]">Holiday Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider w-2/12 min-w-[120px]">Category</th>
                {onDeleteHoliday && (
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider text-right w-1/12 min-w-[80px]">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {Array.from({ length: limit || 5 }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                  <td className="px-6 py-5">
                    <div className="w-32 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-16 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-28 h-4 rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-24 h-5 rounded bg-slate-200 dark:bg-slate-800" />
                  </td>
                  {onDeleteHoliday && (
                    <td className="px-6 py-5 text-right">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 inline-block" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Skeleton Footer */}
        <div className="px-6 py-5 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 animate-pulse">
          <div className="w-48 h-4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-4">
            <div className="w-24 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="w-40 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }
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
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden text-left flex flex-col mt-6 transition-colors duration-200">
      {/* Title Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base">
          <Calendar size={18} className="text-purple-500" />
          <span>Corporate Holidays List</span>
        </h3>
        <span className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-100 dark:border-purple-900/60 transition-colors">
          {(pagination && pagination.totalItems) || sortedHolidays.length} Registered Holidays
        </span>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        {sortedHolidays.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider w-3/12 min-w-[160px]">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider w-2/12 min-w-[100px]">Day</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider w-4/12 min-w-[180px]">Holiday Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider w-2/12 min-w-[120px]">Category</th>
                {onDeleteHoliday && (
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider text-right w-1/12 min-w-[80px]">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sortedHolidays.map((h, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {formatDateDisplay(h.date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {getDayOfWeek(h.date)}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {h.label === 'Saturday' || h.label === 'Sunday' ? 'Weekly Off' : h.label}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">
                    {h.holidayType ? `${h.holidayType} Holiday` : 'National Holiday'}
                  </td>
                  {onDeleteHoliday && (
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => onDeleteHoliday(h.date)}
                        className="p-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 border border-rose-200 dark:border-rose-500/50 cursor-pointer transition-colors"
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
            <span className="text-slate-400 dark:text-slate-500 font-medium text-sm">No Holidays Registered</span>
          </div>
        )}
      </div>

      {/* Reusable Pagination Footer */}
      <Pagination
        page={page}
        limit={limit}
        pagination={pagination}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        entityName="holidays"
      />
    </div>
  );
};

export default HolidaysTable;
