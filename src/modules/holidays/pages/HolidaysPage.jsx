import React from 'react';
import { Calendar, Plus, Palmtree } from 'lucide-react';

const HolidaysPage = () => {
  const holidays = [
    { date: 'Aug 15, 2026', name: 'Independence Day', type: 'National Holiday', day: 'Saturday' },
    { date: 'Oct 02, 2026', name: 'Gandhi Jayanti', type: 'National Holiday', day: 'Friday' },
    { date: 'Nov 08, 2026', name: 'Diwali Festival', type: 'Restricted Holiday', day: 'Sunday' },
    { date: 'Dec 25, 2026', name: 'Christmas Day', type: 'Gazetted Holiday', day: 'Friday' },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Holidays Calendar</h1>
          <p className="text-sm text-slate-500">Official list of gazetted and festival holidays for the current fiscal year.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10">
          <Plus size={16} />
          <span>Add Holiday</span>
        </button>
      </div>

      {/* Grid of holiday lists / layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary / Quick Widget */}
        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-6 rounded-3xl shadow-lg shadow-indigo-600/10 flex flex-col justify-between h-56 lg:h-auto">
          <div className="flex items-center justify-between">
            <Palmtree size={32} className="text-indigo-200" />
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold uppercase tracking-wider">Year 2026</span>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold mt-4">12 Paid Holidays</h2>
            <p className="text-sm text-indigo-100 mt-2">Take time off to recharge. All corporate offices will remain closed on gazetted holidays.</p>
          </div>
        </div>

        {/* Right Side: List of Holidays */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            <span>Upcoming Holidays</span>
          </h3>

          <div className="flex flex-col gap-3 mt-2">
            {holidays.map((h, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all duration-200 gap-3"
              >
                <div>
                  <h4 className="text-base font-bold text-slate-800">{h.name}</h4>
                  <span className="text-xs text-slate-500 font-medium capitalize mt-1 block">
                    {h.type} • {h.day}
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200">
                  {h.date}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HolidaysPage;
