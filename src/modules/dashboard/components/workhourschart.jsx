import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] px-3 py-2 rounded-xl border border-slate-700/50 backdrop-blur-md shadow-xl flex flex-col gap-0.5 items-center select-none font-sans">
        <span className="font-extrabold text-[12px] text-white">{data.value} hrs</span>
        <span className="text-[9px] text-slate-300 dark:text-slate-400 font-bold truncate max-w-[120px] text-center mt-0.5">
          {data.date}
        </span>
      </div>
    );
  }
  return null;
};

const WorkHoursChart = ({ logs = [], loading }) => {
  // Fallback default structure
  const defaultData = [
    { label: 'Mon', value: 8.0, date: 'Monday' },
    { label: 'Tue', value: 7.5, date: 'Tuesday' },
    { label: 'Wed', value: 8.5, date: 'Wednesday' },
    { label: 'Thu', value: 9.0, date: 'Thursday' },
    { label: 'Fri', value: 8.0, date: 'Friday' },
    { label: 'Sat', value: 0.0, date: 'Saturday' },
    { label: 'Sun', value: 0.0, date: 'Sunday' }
  ];

  // Map live logs into 7 columns format
  const chartData = useMemo(() => {
    const dataList = [...defaultData];
    if (logs && logs.length > 0) {
      // Filter out records without date, sort chronologically, select last 7 logs
      const activeLogs = [...logs]
        .filter(l => l.attendance_date)
        .sort((a, b) => new Date(a.attendance_date) - new Date(b.attendance_date))
        .slice(-7);

      if (activeLogs.length > 0) {
        activeLogs.forEach((log, i) => {
          const d = new Date(log.attendance_date);
          const formattedDay = d.toLocaleDateString('en-US', { weekday: 'short' });
          const formattedFull = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
          const workingHours = log.working_hours !== null && log.working_hours !== undefined
            ? Number(log.working_hours)
            : (log.check_in && !log.check_out ? 8.0 : 0.0);

          if (i < 7) {
            dataList[i] = {
              label: formattedDay,
              value: Number(workingHours.toFixed(1)),
              date: formattedFull
            };
          }
        });
      }
    }
    return dataList;
  }, [logs]);

  // Find max value to normalize bar heights
  const maxHours = Math.max(12, ...chartData.map(d => d.value));

  if (loading) {
    return (
      <div className="flex-grow min-h-[220px] flex flex-col items-center justify-center text-xs text-slate-400 dark:text-slate-500 font-medium">
        <Loader2 size={24} className="animate-spin text-indigo-500 mb-2" />
        <span>Loading chart logs...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[220px] mt-2 relative font-sans">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 15, right: 5, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="chartBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="chartBarGradHover" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
            className="dark:stroke-slate-800/50"
          />
          <XAxis
            dataKey="label"
            stroke="#94a3b8"
            fontSize={9}
            fontWeight="900"
            tickLine={false}
            axisLine={false}
            dy={8}
            className="uppercase tracking-wider select-none"
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={9}
            fontWeight="900"
            tickLine={false}
            axisLine={false}
            dx={-8}
            domain={[0, maxHours]}
            ticks={[0, 4, 8, 12]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(99, 102, 241, 0.04)', radius: 6 }}
          />
          <ReferenceLine
            y={8}
            stroke="#10b981"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            className="opacity-80"
            label={{
              value: '8h Shift Target',
              position: 'top',
              fill: '#10b981',
              fontSize: 9,
              fontWeight: '900',
              offset: 6
            }}
          />
          <Bar
            dataKey="value"
            fill="url(#chartBarGrad)"
            radius={[5, 5, 0, 0]}
            barSize={26}
            activeBar={{
              fill: 'url(#chartBarGradHover)',
              stroke: '#ec4899',
              strokeWidth: 1
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkHoursChart;
