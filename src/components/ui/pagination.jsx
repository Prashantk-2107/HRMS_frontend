import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  page,
  limit,
  pagination,
  onPageChange,
  onLimitChange,
  entityName = 'items',
}) => {
  if (!pagination || pagination.totalItems === 0) return null;

  const getPageNumbers = () => {
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

  return (
    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
      {/* Items range message */}
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
        Showing <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min((page - 1) * limit + 1, pagination.totalItems)}</span> to{' '}
        <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(page * limit, pagination.totalItems)}</span> of{' '}
        <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.totalItems}</span> {entityName}
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
  );
};

export default Pagination;
