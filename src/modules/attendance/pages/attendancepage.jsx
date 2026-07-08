import { Clock, Play, UserCheck, CalendarDays } from 'lucide-react';

const AttendancePage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance Logging</h1>
          <p className="text-sm text-slate-500">Log daily check-ins, check-outs, and review monthly work hours.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Check-In Card Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-64">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-indigo-500" />
              <span>Mark Attendance</span>
            </h3>
            <span className="text-xs text-slate-400 block mt-1">Current local time: 10:12 AM</span>
          </div>

          <div className="my-4 text-center">
            <span className="text-3xl font-extrabold text-slate-800 font-mono">10:12:45 AM</span>
            <span className="text-xs text-slate-400 block mt-1">Status: Not Checked-In</span>
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold py-3.5 px-4 rounded-2xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10">
            <Play size={16} />
            <span>Clock In</span>
          </button>
        </div>

        {/* Attendance Statistics Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Present Days</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">21 / 24</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck size={20} />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '87.5%' }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Working Hours</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">8.2 hrs / day</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Clock size={20} />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-28 sm:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Late Check-ins</span>
                <h3 className="text-2xl font-extrabold text-slate-800 mt-1">1 Day</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarDays size={20} />
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '4%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
