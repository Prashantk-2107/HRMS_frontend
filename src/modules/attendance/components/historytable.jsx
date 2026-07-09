import { Calendar, Edit3, HelpCircle } from 'lucide-react';

/**
 * HistoryTable renders employee's logs and correction states.
 */
const HistoryTable = ({ logs, isLoading, regularizationRequests, onOpenRegularize }) => {
  // Format check-in/out time strings
  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render Check-In Time with a warning indicator for late check-in
  const renderCheckInTime = (timeStr, status) => {
    if (!timeStr) return '--:--';
    const date = new Date(timeStr);
    const timeText = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (status !== 'absent') {
      const hour = date.getHours();
      const minute = date.getMinutes();
      if (hour > 9 || (hour === 9 && minute > 30)) {
        return (
          <div className="flex items-center gap-1.5 justify-start">
            <span>{timeText}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" title="Late Check-in (after 09:30 AM)" />
          </div>
        );
      }
    }
    return timeText;
  };

  // Format attendance date
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Status Badge Mapper
  const renderStatusBadge = (status) => {
    let classes = 'px-2.5 py-1 text-xs font-semibold rounded-full ';
    let label = status || '';

    switch (status?.toLowerCase()) {
      case 'present':
        classes += 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450';
        label = 'Present';
        break;
      case 'half_day':
        classes += 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450';
        label = 'Half Day';
        break;
      case 'absent':
        classes += 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-455';
        label = 'Absent';
        break;
      case 'leave':
        classes += 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
        label = 'On Leave';
        break;
      case 'holiday':
        classes += 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400';
        label = 'Holiday';
        break;
      default:
        classes += 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }

    return <span className={classes}>{label}</span>;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden mt-8 transition-colors duration-300">
      <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Attendance Log History</h3>
        <span className="text-xs text-slate-400 dark:text-slate-550">Showing last 30 logs</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-50 dark:border-slate-850">
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Check In</th>
              <th className="py-4 px-6">Check Out</th>
              <th className="py-4 px-6">Working Hours</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-center">Correction / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-slate-750 dark:text-slate-300">
            {isLoading ? (
              // Skeleton loading rows
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-24"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div></td>
                  <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12"></div></td>
                  <td className="py-4 px-6 flex justify-center"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20"></div></td>
                  <td className="py-4 px-6 flex justify-center"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-24"></div></td>
                </tr>
              ))
            ) : logs && logs.length > 0 ? (
              logs.map((log) => {
                // Find any regularization request linked to this log date
                const associatedRequest = regularizationRequests?.find(
                  (r) => r.attendance_id === log.id
                );

                const canRegularize =
                  !associatedRequest &&
                  (log.status === 'absent' || (log.check_in && !log.check_out));

                return (
                  <tr key={log.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900 dark:text-slate-100">
                      {formatDate(log.attendance_date)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {renderCheckInTime(log.check_in, log.status)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {formatTime(log.check_out)}
                    </td>
                    <td className="py-4 px-6 text-slate-650 dark:text-slate-350">
                      {log.working_hours !== null && log.working_hours !== undefined
                        ? `${Number(log.working_hours).toFixed(2)} hrs`
                        : '--:--'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderStatusBadge(log.status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {associatedRequest ? (
                        <div className="flex items-center justify-center gap-1.5">
                          {associatedRequest.status === 'pending' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400 rounded-md select-none border border-amber-100/30">
                              Pending Correction
                            </span>
                          )}
                          {associatedRequest.status === 'approved' && (
                            <span className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-md select-none border border-emerald-100/30">
                              Correction Approved
                            </span>
                          )}
                          {associatedRequest.status === 'rejected' && (
                            <span
                              className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 dark:bg-rose-955/20 dark:text-rose-450 rounded-md select-none border border-rose-100/30 flex items-center gap-1 cursor-help"
                              title={`Reason: ${associatedRequest.rejection_reason || 'No reason provided'}`}
                            >
                              Correction Rejected
                              <HelpCircle size={10} />
                            </span>
                          )}
                        </div>
                      ) : canRegularize ? (
                        <button
                          onClick={() => onOpenRegularize(log)}
                          className="mx-auto flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 py-1.5 px-3 rounded-lg border border-indigo-200/50 dark:border-indigo-900/50 cursor-pointer active:scale-95 transition-all select-none"
                        >
                          <Edit3 size={11} />
                          <span>Request Correction</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-700">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              // Empty State
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-550">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Calendar size={32} className="text-slate-300 dark:text-slate-700" />
                    <span>No attendance logs found. Make your first check-in above!</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
