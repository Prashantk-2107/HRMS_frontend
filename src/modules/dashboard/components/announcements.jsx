import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle, Calendar, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';

const Announcements = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Recent Announcements */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm md:col-span-2 transition-colors duration-250">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-indigo-500" />
          <span>Announcements</span>
        </h4>
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5">
              <CheckCircle size={14} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-850 dark:text-slate-250">Home Screen Clock-in Widget Active!</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                You can now check in and out directly on the dashboard home screen. Your logged shifts will sync automatically.
              </p>
              <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">Just Now</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-xl flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5">
              <Calendar size={14} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-855 dark:text-slate-250">Corporate Holiday: Eid al-Adha</h5>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Our corporate offices will remain closed on Monday, June 15, 2026, in observance of Eid al-Adha.
              </p>
              <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">2 Days Ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card / Developer Notes */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between transition-colors duration-250">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-indigo-500" />
            <span>Resource Guide</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Need help navigating modules or configuring permissions? Read our central handbook or check your active profile.
          </p>
        </div>
        <Link
          to="/help"
          className="mt-4 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50/50 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <HelpCircle size={14} className="text-slate-400 dark:text-slate-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-350">Knowledge Base</span>
          </div>
          <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* FUTURE EXTENSION SLOT: Add new layout grids or widgets (e.g., tickets feed,
          tasks checklists, alerts banner) here. */}
      {/* ========================================================================= */}

    </div>
  );
};

export default Announcements;
