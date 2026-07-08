import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  LayoutGrid,
  Users,
  Network,
  CircleDollarSign,
  User,
  CalendarDays,
  Folder,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { selectAuth, logout } from '../../store/slices/authslice';
import logoImg from '../../assets/icons/worksphere.png';
import { usePermission } from '../../hooks/usepermission';
import { SIDEBAR_PERMISSIONS } from '../../constants/permissions';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(selectAuth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { hasPermission } = usePermission();
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const navRef = useRef(null);

  const checkScrollLimits = () => {
    if (navRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = navRef.current;
      setShowTopIndicator(scrollTop > 5);
      setShowBottomIndicator(scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  useEffect(() => {
    // Run initial check after layout settles
    const timer = setTimeout(checkScrollLimits, 200);
    return () => clearTimeout(timer);
  }, [isCollapsed, user]);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutGrid,
    },
    {
      name: 'All Employees',
      path: '/employees',
      icon: Users,
      permissions: SIDEBAR_PERMISSIONS.EMPLOYEES,
    },
    {
      name: 'Roles & Permission',
      path: '/roles',
      icon: Network,
      permissions: SIDEBAR_PERMISSIONS.ROLES,
    },
    // {
    //   name: 'Attendance',
    //   path: '/attendance',
    //   icon: CalendarCheck,
    //   permissions: SIDEBAR_PERMISSIONS.ATTENDANCE,
    // },
    {
      name: 'Bank Details',
      path: '/bank-accounts',
      icon: CircleDollarSign,
    },
    // {
    //   name: 'Leaves',
    //   path: '/leaves',
    //   icon: ClipboardList,
    //   permissions: SIDEBAR_PERMISSIONS.LEAVES,
    // },
    {
      name: 'Calendar',
      path: '/holidays',
      icon: CalendarDays,
      permissions: SIDEBAR_PERMISSIONS.HOLIDAYS,
    },
    {
      name: 'Documents',
      path: '/documents',
      icon: Folder,
    },
    // {
    //   name: 'Apps & Integration',
    //   path: '/apps',
    //   icon: Grid,
    // },
    // {
    //   name: 'Settings',
    //   path: '/settings',
    //   icon: Settings,
    // },
    // {
    //   name: 'Help & Support',
    //   path: '/help',
    //   icon: HelpCircle,
    // },
    {
      name: 'My Profile',
      path: '/profile',
      icon: User,
    },
  ];

  const hasAccess = (item) => {
    if (!item.permissions) return true;
    return hasPermission(item.permissions);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleMockClick = (e, name) => {
    e.preventDefault();
    toast.loading(`${name} module is under development!`, {
      id: `mock-${name}`,
      duration: 2000,
    });
  };

  const sidebarVariants = {
    expanded: { width: 260, transition: { duration: 0.3, ease: 'easeInOut' } },
    collapsed: { width: 78, transition: { duration: 0.3, ease: 'easeInOut' } },
  };

  const itemClass = (item) => ({ isActive }) => {
    let base = `flex items-center transition-all duration-300 group relative text-sm font-medium rounded-xl `;

    if (isCollapsed) {
      base += `justify-center py-2.5 mx-2 `;
    } else {
      base += `pl-6 pr-4 py-3.5 mx-2 `;
    }

    if (isActive && !item.isMock) {
      return base + `bg-[#F0EDFF]/80 dark:bg-indigo-950/40 text-[#7B5CF5] dark:text-indigo-400 font-semibold`;
    } else {
      return base + `text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200`;
    }
  };

  const renderSidebarContent = () => (
    <div className="relative h-full flex flex-col">
      {/* Floating Circular Collapse Toggle Button outside the card container to prevent overflow clip */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer shadow-sm absolute top-[26px] -right-3.5 z-50 transition-colors duration-200"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Main Sidebar Card */}
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100/80 dark:border-slate-800/80 rounded-[24px] shadow-sm dark:shadow-indigo-950/10 overflow-hidden select-none transition-colors duration-300">
        {/* Logo Header */}
        <div className={`flex items-center py-6 transition-all duration-300 ${isCollapsed ? 'justify-center pr-[1.5px]' : 'pl-5'} flex-shrink-0`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <img src={logoImg} alt="WorkSphere Logo" className="w-8 h-8 flex-shrink-0" />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="font-black text-indigo-600 text-lg tracking-tight whitespace-nowrap bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent overflow-hidden"
                >
                  WorkSphere
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Navigation Menu Wrapper */}
        <div className="flex-1 relative overflow-hidden flex flex-col min-h-0">
          <nav
            ref={navRef}
            onScroll={checkScrollLimits}
            className={`flex-1 px-1 space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'scrollbar-none' : 'custom-scrollbar'} pb-4`}
          >
            {menuItems.filter(hasAccess).map((item, itemIdx) => {
              const Icon = item.icon;

              if (item.isMock) {
                return (
                  <button
                    key={itemIdx}
                    onClick={(e) => handleMockClick(e, item.name)}
                    className={`w-full flex items-center transition-all duration-300 group relative text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 rounded-xl ${isCollapsed ? 'justify-center py-2.5 mx-2' : 'pl-6 pr-4 py-3.5 mx-2'} cursor-pointer`}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      <Icon size={20} className="transition-transform duration-200 group-hover:scale-105 text-slate-400 group-hover:text-slate-700" />
                    </div>
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="ml-4 whitespace-nowrap overflow-hidden"
                        >
                          {item.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isCollapsed && (
                      <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800 shadow-xl pointer-events-none z-50 whitespace-nowrap">
                        {item.name} (Coming Soon)
                      </div>
                    )}
                  </button>
                );
              }

              return (
                <NavLink
                  key={itemIdx}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={itemClass(item)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <Icon size={20} className="transition-transform duration-200 group-hover:scale-105" />
                  </div>

                  <AnimatePresence initial={false}>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="ml-4 whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isCollapsed && (
                    <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all duration-150 origin-left bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800 shadow-xl pointer-events-none z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Scroll indicators (fade shadows) */}
          <div
            className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white dark:from-slate-900 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showTopIndicator ? 'opacity-100' : 'opacity-0'
              }`}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showBottomIndicator ? 'opacity-100' : 'opacity-0'
              }`}
          />
        </div>

        {/* Logout Button Footer */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 transition-colors duration-300`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center py-2.5' : 'pl-6 pr-4 py-3'} rounded-xl border border-rose-100 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-semibold text-sm shadow-sm active:scale-[0.98] cursor-pointer transition-colors duration-200`}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <LogOut size={16} />
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="ml-3.5 whitespace-nowrap overflow-hidden"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={isCollapsed ? 'collapsed' : 'expanded'}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        variants={sidebarVariants}
        className="hidden md:block h-screen sticky top-0 flex-shrink-0 z-20 py-4 pl-4 pr-2"
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
            className="md:hidden fixed top-0 bottom-0 left-0 w-[260px] z-50 p-4"
          >
            {renderSidebarContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
