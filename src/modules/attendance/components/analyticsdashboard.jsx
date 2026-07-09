import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, CalendarDays, LineChart, Loader2, Sparkles } from 'lucide-react';
import api, { ATTENDANCE_ENDPOINTS } from '../../../services/api';

/**
 * AnalyticsDashboard compiles charts and heatmap grids for manager/admin analysis.
 */
const AnalyticsDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Query analytics dataset
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['attendance', 'analytics', selectedYear, selectedMonth],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_ANALYTICS, {
        params: { year: selectedYear, month: selectedMonth },
      });
      return response.data?.data?.analytics || { dailyRates: [], weekdayAverages: [], employeeCount: 0 };
    },
  });

  const { dailyRates = [], weekdayAverages = [], employeeCount = 0 } = analyticsData || {};

  // Tooltip custom renderer for trend line chart
  const CustomTrendTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs p-3 rounded-2xl border border-slate-700/50 backdrop-blur-md shadow-xl flex flex-col gap-1 font-sans">
          <span className="font-extrabold text-[13px]">{info.date}</span>
          <span className="text-slate-350">Rate: <strong className="text-emerald-450">{info.rate}%</strong></span>
          <span className="text-[10px] text-slate-400">Present: {info.present} / {employeeCount} staff</span>
        </div>
      );
    }
    return null;
  };

  // Tooltip custom renderer for weekday averages chart
  const CustomWeekdayTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      return (
        <div className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-xs px-3 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md shadow-xl flex flex-col items-center gap-0.5 font-sans">
          <span className="font-extrabold text-[12px]">{info.name} Avg</span>
          <span className="text-indigo-400 font-bold">{info.rate}% Presence</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Configuration Header Row */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
        <div>
          <h4 className="font-bold text-slate-850 dark:text-slate-200 flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-650" />
            <span>Attendance Trend Analytics</span>
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Explore monthly check-in rates and daily roster health stats.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {Array.from({ length: 12 }).map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {new Date(0, idx).toLocaleString([], { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
          >
            {[2025, 2026, 2027].map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <span className="text-xs font-semibold">Generating analytics visualizations...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Charts Grid Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Daily Trend Area Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                <LineChart size={16} className="text-indigo-650" />
                <span>Daily Attendance Rate (%)</span>
              </h4>
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRates} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} tickLine={false} axisLine={false} ticks={[0, 25, 50, 75, 100]} />
                    <Tooltip content={<CustomTrendTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.1)', strokeWidth: 1 }} />
                    <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#trendGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekday Distribution Bar Chart */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1.5">
                <BarChart3 size={16} className="text-violet-600" />
                <span>Day-of-Week Averages</span>
              </h4>
              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekdayAverages} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/40" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontWeight="900" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} domain={[0, 100]} tickLine={false} axisLine={false} ticks={[0, 25, 50, 75, 100]} />
                    <Tooltip content={<CustomWeekdayTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.04)', radius: 6 }} />
                    <Bar dataKey="rate" fill="url(#weekGrad)" radius={[5, 5, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Calendar Heatmap Grid */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <CalendarDays size={16} className="text-indigo-650" />
                <span>Monthly Presence Grid</span>
              </h4>
              
              {/* Heatmap Legend */}
              <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500/30" /><span>&gt;90% present</span></div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/30" /><span>70%-90%</span></div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-500/30" /><span>&lt;70%</span></div>
                <div className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" /><span>Weekend / Holiday</span></div>
              </div>
            </div>

            {/* Heatmap Layout */}
            <div className="grid grid-cols-7 gap-2.5">
              {/* Days headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-center font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1 select-none">
                  {d}
                </div>
              ))}

              {/* Pad grid with empty cells until start day of month */}
              {Array.from({ length: new Date(selectedYear, selectedMonth - 1, 1).getDay() }).map((_, idx) => (
                <div key={`pad-${idx}`} className="aspect-square" />
              ))}

              {/* Heatmap Squares */}
              {dailyRates.map((day) => {
                let cellClasses = 'aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all duration-200 cursor-help select-none ';

                if (day.status === 'weekend' || day.status === 'holiday') {
                  cellClasses += 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-550 border-slate-100 dark:border-slate-800';
                } else if (day.color === 'green') {
                  cellClasses += 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:scale-105';
                } else if (day.color === 'yellow') {
                  cellClasses += 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:scale-105';
                } else {
                  cellClasses += 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-450 border-rose-500/20 hover:scale-105';
                }

                return (
                  <div
                    key={day.date}
                    className={cellClasses}
                    title={
                      day.status === 'workday'
                        ? `${day.date}: ${day.rate}% present (${day.present} active, ${day.absent} absent)`
                        : `${day.date}: ${day.status === 'weekend' ? 'Weekend' : 'Public Holiday'}`
                    }
                  >
                    <span className="text-xs font-bold">{day.day}</span>
                    {day.status === 'workday' && (
                      <span className="text-[8px] font-extrabold opacity-80 mt-0.5">{day.rate}%</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
