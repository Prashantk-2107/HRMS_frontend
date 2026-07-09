import { Link } from 'react-router-dom';
import { Users, Clock, Calendar, CreditCard, User, ChevronRight } from 'lucide-react';

const QuickActions = ({ canViewEmployees }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm transition-colors duration-250">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200">Quick Navigation Actions</h3>
        <span className="text-xs text-slate-400 dark:text-slate-500 block mt-0.5">
          Jump quickly into modules configured for your workstation.
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Action 1: Employees */}
        {canViewEmployees && (
          <Link
            to="/employees"
            className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/15 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
              <Users size={18} />
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Staff Roster</span>
            <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              Open Directory <ChevronRight size={10} />
            </span>
          </Link>
        )}

        {/* Action 2: Attendance */}
        <Link
          to="/attendance"
          className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/15 hover:border-emerald-250 dark:hover:border-emerald-900/60 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
            <Clock size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">My Shifts</span>
          <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Attendance logs <ChevronRight size={10} />
          </span>
        </Link>

        {/* Action 3: Holidays */}
        <Link
          to="/holidays"
          className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-purple-50/30 dark:hover:bg-purple-950/15 hover:border-purple-250 dark:hover:border-purple-900/60 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
            <Calendar size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Calendar</span>
          <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Holiday list <ChevronRight size={10} />
          </span>
        </Link>

        {/* Action 4: Bank Details */}
        <Link
          to="/bank-accounts"
          className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-amber-50/30 dark:hover:bg-amber-950/15 hover:border-amber-250 dark:hover:border-amber-900/60 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
            <CreditCard size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Bank Account</span>
          <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Bank records <ChevronRight size={10} />
          </span>
        </Link>

        {/* Action 5: Profile */}
        <Link
          to="/profile"
          className="group flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/15 hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-200"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-200">
            <User size={18} />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">My Profile</span>
          <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            Settings & profile <ChevronRight size={10} />
          </span>
        </Link>

        {/* ========================================================================= */}
        {/* FUTURE EXTENSION SLOT: Add new navigation links below. Simply replicate
            the Link container structure above. */}
        {/* ========================================================================= */}
      </div>
    </div>
  );
};

export default QuickActions;
