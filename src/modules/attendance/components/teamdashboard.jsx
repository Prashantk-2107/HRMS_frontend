import { useState, useMemo } from 'react';
import { Users, LogIn, LogOut, AlertTriangle, CalendarDays, Search, Download, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * TeamDashboard monitors daily attendance for all employees and handles monthly CSV reporting.
 */
const TeamDashboard = ({ dashboardData, isLoading, onFetchReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Export report state
  const [exportYear, setExportYear] = useState(new Date().getFullYear());
  const [exportMonth, setExportMonth] = useState(new Date().getMonth() + 1);
  const [isExporting, setIsExporting] = useState(false);

  const { statistics = {}, logs = [] } = dashboardData || {};

  // Filters calculation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const nameMatch = log.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        log.empCode?.toLowerCase().includes(searchTerm.toLowerCase());
      
      let statusMatch = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'late') {
          // Calculate if late (after 09:30 AM local)
          if (!log.check_in) statusMatch = false;
          else {
            const checkInTime = new Date(log.check_in);
            const hour = checkInTime.getHours();
            const minute = checkInTime.getMinutes();
            statusMatch = hour > 9 || (hour === 9 && minute > 30);
          }
        } else {
          statusMatch = log.status?.toLowerCase() === statusFilter.toLowerCase();
        }
      }

      return nameMatch && statusMatch;
    });
  }, [logs, searchTerm, statusFilter]);

  // Export CSV Handler
  const handleExportCSV = async () => {
    try {
      setIsExporting(true);
      const reportData = await onFetchReport({ year: exportYear, month: exportMonth });

      if (!reportData || reportData.length === 0) {
        toast.error("No attendance logs found for the selected month.");
        return;
      }

      const headers = ["Employee Code", "Name", "Email", "Role", "Date", "Check-In", "Check-Out", "Working Hours", "Status"];
      const rows = reportData.map(log => [
        log.empCode || '',
        log.name || '',
        log.email || '',
        log.role || '',
        log.date || '',
        log.check_in ? new Date(log.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        log.check_out ? new Date(log.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
        log.working_hours !== null && log.working_hours !== undefined ? log.working_hours.toFixed(2) : '0.00',
        log.status || ''
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `attendance_report_${exportYear}_${exportMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV report exported successfully!");
    } catch (error) {
      toast.error("An error occurred during export.");
    } finally {
      setIsExporting(false);
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    return new Date(timeStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStatusBadge = (status, checkIn) => {
    let classes = 'px-2.5 py-1 text-xs font-semibold rounded-full ';
    let label = status || 'Not Clocked-In';

    // Verify if Checked-In late (after 09:30 AM)
    let isLate = false;
    if (checkIn) {
      const checkInTime = new Date(checkIn);
      const hour = checkInTime.getHours();
      const minute = checkInTime.getMinutes();
      isLate = hour > 9 || (hour === 9 && minute > 30);
    }

    if (isLate && status !== 'absent') {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
          Late Checked-In
        </span>
      );
    }

    switch (status?.toLowerCase()) {
      case 'present':
        classes += 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
        label = 'Present';
        break;
      case 'half_day':
        classes += 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-450';
        label = 'Half Day';
        break;
      case 'absent':
        classes += 'bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-450';
        label = 'Absent';
        break;
      default:
        classes += 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-450';
        label = 'Not Clocked-In';
    }

    return <span className={classes}>{label}</span>;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 1. Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Staff</span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{statistics.totalEmployees || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On-Duty Today</span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{statistics.checkedIn || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <LogIn size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Shifts</span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">{statistics.checkedOut || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center">
            <LogOut size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-all duration-300">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Arrivals / Absent</span>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {statistics.lateArrivals || 0} <span className="text-sm font-normal text-slate-400">/ {statistics.absent || 0}</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-955/20 text-rose-600 dark:text-rose-450 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* 2. Monthly Logs Exporter Panel */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
        <div>
          <h4 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-650" />
            <span>Generate Attendance Report</span>
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Select a month and year to download the complete attendance log CSV.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={exportMonth}
            onChange={(e) => setExportMonth(parseInt(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {new Date(0, idx).toLocaleString([], { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={exportYear}
            onChange={(e) => setExportYear(parseInt(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {[2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-5 rounded-xl text-xs transition-all duration-200 shadow-md shadow-indigo-650/10 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* 3. Team Attendance Logs Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* Search & Filters */}
        <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/10 dark:bg-slate-800/10">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Daily Team Roster</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-60">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search staff name / code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white dark:bg-slate-800 text-slate-805 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none w-full sm:w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="half_day">Half Day</option>
              <option value="absent">Absent</option>
              <option value="late">Late Arrival</option>
              <option value="not_checked_in">Not Clocked-In</option>
            </select>
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-50 dark:border-slate-850">
                <th className="py-4 px-6">Employee</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Check In</th>
                <th className="py-4 px-6">Check Out</th>
                <th className="py-4 px-6">Working Hours</th>
                <th className="py-4 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 text-sm text-slate-700 dark:text-slate-300">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-32"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-16"></div></td>
                    <td className="py-4 px-6"><div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-12"></div></td>
                    <td className="py-4 px-6 flex justify-center"><div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-full w-20"></div></td>
                  </tr>
                ))
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.emp_id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{log.name}</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{log.empCode} • {log.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {log.role}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {formatTime(log.check_in)}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      {formatTime(log.check_out)}
                    </td>
                    <td className="py-4 px-6 text-slate-650 dark:text-slate-350">
                      {log.working_hours !== null && log.working_hours !== undefined 
                        ? `${log.working_hours.toFixed(2)} hrs` 
                        : '--:--'}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {renderStatusBadge(log.status, log.check_in)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-450 dark:text-slate-500">
                    No logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamDashboard;
