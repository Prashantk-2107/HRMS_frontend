import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const WelcomeBanner = ({ user, greeting, currentTime, formattedTodayDate }) => {
  const userName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Guest User';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 dark:from-slate-900 dark:via-indigo-950 dark:to-purple-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 bg-white/10 dark:bg-white/5 border border-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide w-fit">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>WORKSPACE SUMMARY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {userName}!
          </h1>
          <p className="text-sm text-indigo-100/90 dark:text-slate-350 max-w-lg leading-relaxed">
            We're glad to see you today. Here is what is happening across the workspace. Monitor your logs and track directory metrics below.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1.5 bg-white/10 dark:bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
          <span className="text-xs font-bold text-indigo-200 dark:text-slate-400 uppercase tracking-wider">Current Time</span>
          <span className="text-2xl font-black font-mono tracking-wider">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="text-xs text-indigo-100 font-medium">
            {formattedTodayDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
