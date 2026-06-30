import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  User as UserIcon,
  CheckSquare,
  Calendar,
  LogOut,
  Coins,
  Folder,
  Grid,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { selectAuth, logout } from '../../store/slices/authSlice';
import logoImg from '../../assets/icons/WorkSphere.png';
import { usePermission } from '../../hooks/usePermission';
import { SIDEBAR_PERMISSIONS } from '../../constants/permissions';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { hasPermission } = usePermission();

  const menuSections = [
    {
      title: 'MENU',
      items: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: Home,
        },
        {
          name: 'Employees',
          path: '/employees',
          icon: UserIcon,
          permissions: SIDEBAR_PERMISSIONS.EMPLOYEES,
        },
        {
          name: 'Attendances',
          path: '/attendance',
          icon: CheckSquare,
          permissions: SIDEBAR_PERMISSIONS.ATTENDANCE,
        },
        {
          name: 'Calendar',
          path: '/holidays',
          icon: Calendar,
          permissions: SIDEBAR_PERMISSIONS.HOLIDAYS,
        },
        {
          name: 'Leaves',
          path: '/leaves',
          icon: LogOut,
          permissions: SIDEBAR_PERMISSIONS.LEAVES,
        },
        {
          name: 'Payroll',
          path: '/bank-accounts',
          icon: Coins,
          permissions: SIDEBAR_PERMISSIONS.PAYROLL,
        },
        {
          name: 'Documents',
          path: '/documents',
          icon: Folder,
          permissions: SIDEBAR_PERMISSIONS.DOCUMENTS,
        },
      ],
    },
    {
      title: 'USER',
      items: [
        {
          name: 'Roles & Permissions',
          path: '/roles',
          icon: ShieldCheck,
          permissions: SIDEBAR_PERMISSIONS.ROLES,
        },
        {
          name: 'Apps & Integration',
          path: '/apps',
          icon: Grid,
        },
        {
          name: 'Settings',
          path: '/settings',
          icon: Settings,
        },
        {
          name: 'Help & Support',
          path: '/help',
          icon: HelpCircle,
        },
        {
          name: 'Logout',
          path: '/login',
          icon: LogOut,
          action: 'logout',
        },
      ],
    },
  ];

  // Helper to verify user permissions
  const hasAccess = (item) => {
    if (!item.permission && !item.permissions) return true;
    return hasPermission(item.permissions || item.permission);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const userDisplayName = user?.name || user?.employeeId || 'User';

  const sidebarVariants = {
    expanded: { width: 260, transition: { duration: 0.3, ease: 'easeInOut' } },
    collapsed: { width: 78, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white text-slate-600 border-r border-slate-150 relative shadow-sm">

      {/* Floating Circular Collapse Toggle Button absolute-positioned on the border */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200/70 hover:bg-slate-100 text-slate-400 hover:text-slate-700 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm absolute top-[26px] -right-3.5 z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Logo Header */}
      <div className="flex items-center h-20 px-5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <img src={logoImg} alt="WorkSphere Logo" className="w-8 h-8 flex-shrink-0" />
          {!isCollapsed && (
            <span className="font-black text-indigo-600 text-lg tracking-tight whitespace-nowrap bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
              WorkSphere
            </span>
          )}
        </div>
      </div>

      {/* Main Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
        {menuSections.map((section, idx) => {
          // Filter items within each section based on user permissions
          const visibleItems = section.items.filter(hasAccess);

          if (visibleItems.length === 0) return null;

          return (
            <div key={idx} className="space-y-2">
              {/* Section Header */}
              {!isCollapsed ? (
                <h4 className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 px-4 text-left overflow-hidden whitespace-nowrap">
                  {section.title}
                </h4>
              ) : (
                <div className="h-4" /> // Spacing when collapsed
              )}

              {/* Items List */}
              <div className="space-y-1">
                {visibleItems.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isLogout = item.action === 'logout';

                  const itemClass = ({ isActive }) => `
                    flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative
                    ${isLogout
                      ? 'hover:bg-rose-50 text-slate-500 hover:text-rose-600'
                      : isActive
                        ? 'bg-indigo-50/60 text-indigo-600 font-semibold'
                        : 'hover:bg-slate-50 hover:text-slate-900 text-slate-500'
                    }
                  `;

                  if (isLogout) {
                    return (
                      <button
                        key={itemIdx}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-all duration-200 group relative cursor-pointer"
                        title={isCollapsed ? item.name : undefined}
                      >
                        <div className="flex-shrink-0 text-slate-400 group-hover:text-rose-500">
                          <Icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                        </div>
                        {!isCollapsed && (
                          <span className="whitespace-nowrap">
                            {item.name}
                          </span>
                        )}
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={itemClass}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <div className="flex-shrink-0">
                        <Icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                      </div>

                      {!isCollapsed && (
                        <span className="whitespace-nowrap">
                          {item.name}
                        </span>
                      )}

                      {/* Tooltip for collapsed mode */}
                      {isCollapsed && (
                        <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800 shadow-xl pointer-events-none z-50 whitespace-nowrap">
                          {item.name}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile Card Footer */}
      <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
        <div
          onClick={() => !isCollapsed && navigate('/settings')}
          className="flex items-center justify-between gap-3 overflow-hidden cursor-pointer hover:bg-slate-50 p-2 rounded-2xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-3.5">
            {/* Round Avatar Container with custom styling */}
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-extrabold text-sm border border-indigo-100 flex-shrink-0 relative overflow-hidden shadow-inner">
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-100/50 text-indigo-600 font-extrabold text-sm uppercase">
                  {getInitials(userDisplayName)}
                </div>
              )}
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <h4 className="text-sm font-bold text-slate-850 truncate leading-tight group-hover:text-slate-900">
                  {userDisplayName}
                </h4>
                <span className="text-[11px] text-slate-400 font-medium truncate block mt-1">
                  {user?.email ? `@${user.email.split('@')[0]}` : '@username'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronRight size={14} className="text-slate-350 group-hover:text-slate-600 transition-transform duration-200" />
          )}
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={false}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-20"
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Content */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-0 bottom-0 left-0 w-[260px] z-50 shadow-2xl"
          >
            {renderSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
