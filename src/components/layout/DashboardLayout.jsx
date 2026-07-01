import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, Search, User } from 'lucide-react';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Simple helper to derive page title from current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/employees')) return 'Employees Management';
    if (path.startsWith('/bank-accounts')) return 'Bank Accounts';
    if (path.startsWith('/holidays')) return 'Holidays Calendar';
    if (path.startsWith('/attendance')) return 'Attendance Records';
    if (path.startsWith('/roles')) return 'Roles & Permissions';
    return 'CRM Portal';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Main Content Layout Wrapper */}
      <div className="flex-1 flex flex-col h-full md:h-screen md:py-4 md:pr-4 md:pl-2 overflow-hidden">
        <div className="flex-1 flex flex-col h-full bg-white md:rounded-[24px] md:border md:border-slate-100/80 md:shadow-sm overflow-hidden">
          {/* Top Header Bar */}
          <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-10 shadow-sm flex-shrink-0">
            
            {/* Left: Mobile Toggle & Page Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
                {getPageTitle()}
              </h2>
            </div>

            {/* Right: Search, Notifications & Actions */}
            <div className="flex items-center gap-4">
              {/* Search Input (Decorative mockup) */}
              <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 w-64 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-xs text-slate-700 outline-none w-full placeholder-slate-400 font-medium"
                />
              </div>

              {/* Notification Icon Button */}
              <button className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-indigo-600 active:scale-95 border border-slate-100 transition-all duration-150 cursor-pointer relative">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              </button>

              <div className="h-8 w-px bg-slate-100 hidden sm:block" />

              {/* Quick Link to Profile/Dashboard */}
              <Link
                to="/dashboard"
                className="flex items-center justify-center p-1 rounded-full border-2 border-transparent hover:border-indigo-100 transition-all duration-150"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  <User size={18} />
                </div>
              </Link>
            </div>
          </header>

          {/* Scrollable View Area */}
          <main className="flex-1 overflow-y-auto bg-slate-50/30 p-6 custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
