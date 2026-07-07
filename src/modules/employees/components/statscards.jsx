import React from 'react';
import { Users } from 'lucide-react';

const StatsCards = ({ loading, totalStaff, activeStaff, inactiveStaff }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-200">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Total Staff</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{loading ? '...' : totalStaff}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-colors duration-200">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Active Staff</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{loading ? '...' : activeStaff}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1 transition-colors duration-200">
        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <Users size={24} />
        </div>
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Inactive Staff</span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{loading ? '...' : inactiveStaff}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
