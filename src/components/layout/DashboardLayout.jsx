import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import api, { PERMISSION_ENDPOINTS } from '../../services/api';
import { selectUser, setPermissions } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const syncUserPermissions = async () => {
      if (user?.emp_id) {
        try {
          const permResponse = await api.get(PERMISSION_ENDPOINTS.GET_USER_PERMISSIONS(user.emp_id));
          if (permResponse.data.success) {
            const rawPermissions = permResponse.data.data?.effectivePermissions || [];

            // Convert to string array if objects are received
            const processedPermissions = Array.isArray(rawPermissions)
              ? rawPermissions.map(p => (p && typeof p === 'object' ? (p.name || p.codename || p.permission || p.title || JSON.stringify(p)) : p))
              : [];

            dispatch(setPermissions(processedPermissions));
          }
        } catch (err) {
          console.error('Failed to sync permissions:', err);
        }
      }
    };

    syncUserPermissions();
  }, [location.pathname, user?.emp_id, dispatch]);

  // Simple helper to derive page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/employees')) return 'Employees Management';
    if (path.startsWith('/bank-accounts')) return 'Bank Accounts';
    if (path.startsWith('/holidays')) return 'Holidays Calendar';
    if (path.startsWith('/attendance')) return 'Attendance Records';
    if (path.startsWith('/roles')) return 'Roles & Permissions';
    if (path.startsWith('/profile')) return 'Profile';
    return 'CRM Portal';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col h-full md:h-screen md:py-4 md:pr-4 md:pl-2 overflow-hidden">
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 md:rounded-[24px] md:border md:border-slate-100/80 dark:md:border-slate-800/80 md:shadow-sm dark:shadow-indigo-950/10 overflow-hidden transition-colors duration-300">
          {/* Top Header Bar */}
          <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-6 z-10 shadow-sm dark:shadow-indigo-950/10 flex-shrink-0 transition-colors duration-300">

            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight hidden sm:block">
                {getPageTitle()}
              </h2>
            </div>

            {/* Right: Search, Notifications & Actions */}
            <div className="flex items-center gap-4">
              {/* Search Input (Decorative mockup) */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80 rounded-xl px-3 py-1.5 w-64 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                />
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 border border-slate-100 dark:border-slate-800/80 transition-all duration-150 cursor-pointer relative flex items-center justify-center"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="relative w-[18px] h-[18px] flex items-center justify-center">
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: theme === 'dark' ? 180 : 0,
                      scale: theme === 'dark' ? 0 : 1,
                      opacity: theme === 'dark' ? 0 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Moon size={18} />
                  </motion.div>
                  <motion.div
                    initial={false}
                    animate={{
                      rotate: theme === 'dark' ? 0 : -180,
                      scale: theme === 'dark' ? 1 : 0,
                      opacity: theme === 'dark' ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <Sun size={18} />
                  </motion.div>
                </div>
              </button>

              {/* Notification Icon Button */}
              <button className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 active:scale-95 border border-slate-100 dark:border-slate-800/80 transition-all duration-150 cursor-pointer relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
              </button>

              <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 hidden sm:block" />

              {/* Quick Link to Profile/Dashboard */}
              <Link
                to="/profile"
                className="flex items-center justify-center p-1 rounded-full border-2 border-transparent hover:border-indigo-100 dark:hover:border-indigo-950/60 transition-all duration-150"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center overflow-hidden font-bold text-sm">
                  {user?.profile_image ? (
                    <img src={user.profile_image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
              </Link>
            </div>
          </header>

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20 p-6 custom-scrollbar transition-colors duration-300">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
