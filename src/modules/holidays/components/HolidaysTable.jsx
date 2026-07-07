import { Calendar, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const getPageNumbers = () => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const currentPage = page;
    const pageLimit = 5;

    if (totalPages <= pageLimit) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = 4;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

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

      {/* Premium Pagination Footer */}
      {pagination && pagination.totalItems > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
          {/* Items range message */}
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min((page - 1) * limit + 1, pagination.totalItems)}</span> to{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(page * limit, pagination.totalItems)}</span> of{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.totalItems}</span> holidays
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Limit selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Per Page</span>
              <select
                value={limit}
                onChange={(e) => {
                  onLimitChange(Number(e.target.value));
                  onPageChange(1); // Reset to page 1
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer shadow-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>

            {/* Page buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={!pagination.hasPreviousPage}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Generate Page Number Buttons */}
              {getPageNumbers().map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 py-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 select-none"
                    >
                      ...
                    </span>
                  );
                }
                const isSelected = pageNum === page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                        : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange(page + 1)}
                disabled={!pagination.hasNextPage}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaysTable;
