import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { BarChart3, TrendingUp } from 'lucide-react';

import api, {
  ATTENDANCE_ENDPOINTS,
  EMPLOYEE_ENDPOINTS
} from '../../../services/api';
import { selectAuth } from '../../../store/slices/authslice.js';
import { usePermission } from '../../../hooks/usepermission';
import { PERMISSIONS } from '../../../constants/permissions';

// Import newly refactored modular components
import WelcomeBanner from '../components/welcomebanner';
import StatsCards from '../components/statscards';
import ClockWidget from '../components/clockwidget';
import WorkHoursChart from '../components/workhourschart';
import QuickActions from '../components/quickactions';
import Announcements from '../components/announcements';

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const { hasPermission } = usePermission();

  const {
    user,
    role
  } = useSelector(selectAuth);

  const canViewEmployees = hasPermission([
    PERMISSIONS.EMP_GET_ALL,
    PERMISSIONS.EMP_VIEW_ANY
  ]);

  // State for greeting and client-side clock
  const [greeting, setGreeting] = useState('Welcome');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Greeting & Clock Timer
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      setCurrentTime(now);
      const hrs = now.getHours();
      if (hrs < 12) setGreeting('Good Morning');
      else if (hrs < 17) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  // 1. Fetch Today's Attendance Check-in status
  const {
    data: todayAttendance,
    isLoading: isTodayAttendanceLoading
  } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_TODAY);
      return response.data?.data?.attendance || null;
    }
  });

  // 2. Fetch Employee roster stats (if permitted)
  const {
    data: allEmployees = [],
    isLoading: isEmployeesLoading
  } = useQuery({
    queryKey: ['employees', 'all'],
    queryFn: async () => {
      const response = await api.get(EMPLOYEE_ENDPOINTS.LIST);
      return response.data?.data?.employees || [];
    },
    enabled: canViewEmployees,
    retry: false
  });

  // 3. Fetch Holiday events list
  const {
    data: holidaysData = [],
    isLoading: isHolidaysLoading
  } = useQuery({
    queryKey: ['holidays', 'all'],
    queryFn: async () => {
      const response = await api.get('/holiday/get-all-holidays');
      return response.data?.data?.holidays || [];
    },
    retry: false
  });

  // 4. Fetch personal summary logs to feed the weekly chart
  const {
    data: summaryData,
    isLoading: isSummaryLoading
  } = useQuery({
    queryKey: ['attendance', 'summary'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_MY_SUMMARY);
      return response.data?.data?.summary || { logs: [], statistics: {} };
    }
  });

  // Mutations for Attendance logging
  const checkInMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(ATTENDANCE_ENDPOINTS.CHECK_IN);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Successfully checked in!');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Check-in failed. Please try again.';
      toast.error(msg);
    }
  });

  const checkOutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(ATTENDANCE_ENDPOINTS.CHECK_OUT);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Successfully checked out!');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Check-out failed. Please try again.';
      toast.error(msg);
    }
  });

  const isClockMutating = checkInMutation.isPending || checkOutMutation.isPending;

  // Process next upcoming holiday
  const nextHoliday = useMemo(() => {
    if (!holidaysData || holidaysData.length === 0) return null;
    const now = new Date();
    // Reset hours to start of day
    now.setHours(0, 0, 0, 0);

    const upcoming = holidaysData
      .filter(h => h.holiday_date && new Date(h.holiday_date) >= now)
      .sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date));
    return upcoming[0] || null;
  }, [holidaysData]);

  // Process live check-in timer if checked in
  const isCheckedIn = !!todayAttendance && !todayAttendance.check_out;
  const isCheckedOut = !!todayAttendance && !!todayAttendance.check_out;

  const [activeDuration, setActiveDuration] = useState('');

  useEffect(() => {
    if (!isCheckedIn || !todayAttendance?.check_in) {
      setActiveDuration('');
      return;
    }

    const calculateDuration = () => {
      const diffMs = new Date() - new Date(todayAttendance.check_in);
      const totalSecs = Math.floor(diffMs / 1000);
      const hrs = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;
      setActiveDuration(
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    calculateDuration();
    const interval = setInterval(calculateDuration, 1000);
    return () => clearInterval(interval);
  }, [isCheckedIn, todayAttendance?.check_in]);

  // Format today's date nicely for the calendar card
  const formattedTodayDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [currentTime]);

  const handleCheckIn = () => {
    checkInMutation.mutate();
  };

  const handleCheckOut = () => {
    checkOutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 p-2 sm:p-6 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* 1. WELCOME BANNER SECTION */}
        <WelcomeBanner
          user={user}
          greeting={greeting}
          currentTime={currentTime}
          formattedTodayDate={formattedTodayDate}
        />

        {/* 2. LIVE DYNAMIC STATS GRID */}
        <StatsCards
          canViewEmployees={canViewEmployees}
          isEmployeesLoading={isEmployeesLoading}
          employeesCount={allEmployees.length}
          isTodayAttendanceLoading={isTodayAttendanceLoading}
          isCheckedIn={isCheckedIn}
          isCheckedOut={isCheckedOut}
          isHolidaysLoading={isHolidaysLoading}
          nextHoliday={nextHoliday}
          role={role}
        />

        {/* 3. CLOCK-IN WIDGET AND SVG CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ClockWidget
            todayAttendance={todayAttendance}
            isCheckedIn={isCheckedIn}
            isCheckedOut={isCheckedOut}
            activeDuration={activeDuration}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
            isClockMutating={isClockMutating}
          />

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between lg:col-span-2 relative">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <BarChart3 size={18} className="text-indigo-500" />
                  <span>Working Hours Activity</span>
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-555 block mt-1">
                  Analysis of daily hours recorded in logs.
                </span>
              </div>
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/60 flex items-center gap-1">
                <TrendingUp size={10} />
                <span>Last 7 Days</span>
              </span>
            </div>

            <WorkHoursChart logs={summaryData?.logs} loading={isSummaryLoading} />
          </div>
        </div>

        {/* 4. QUICK ACTIONS SECTION (Extensible Layout) */}
        <QuickActions canViewEmployees={canViewEmployees} />

        {/* 5. DENSE BOTTOM LAYOUT (Announcements & Corporate Notes) */}
        <Announcements />

      </div>
    </div>
  );
};

export default DashboardPage;
