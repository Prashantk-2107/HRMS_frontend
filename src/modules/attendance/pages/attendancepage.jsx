import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api, { ATTENDANCE_ENDPOINTS } from '../../../services/api';
import { usePermission } from '../../../hooks/usepermission';
import ClockCard from '../components/clockcard';
import StatsDashboard from '../components/statsdashboard';
import HistoryTable from '../components/historytable';
import RegularizationModal from '../components/regularizationmodal';
import AdminApprovalPanel from '../components/adminapprovalpanel';
import TeamDashboard from '../components/teamdashboard';
import AnalyticsDashboard from '../components/analyticsdashboard';

/**
 * AttendancePage aggregates queries and mutations for check-in/out and correction requests.
 * Supports a toggle switch between personal logs and team dashboards for managers.
 */
const AttendancePage = () => {
  const queryClient = useQueryClient();
  const { role } = usePermission();

  // Role checking for approving corrections
  const roleName = (typeof role === 'object' ? role?.name : role) || '';
  const normalizedRole = roleName.toLowerCase().replace(/[\s_-]/g, '');
  const isHROrAdmin = ['admin', 'superadmin', 'humanresource', 'projectmanager'].includes(normalizedRole);

  const [activeTab, setActiveTab] = useState('my'); // 'my' or 'team'

  // Correction Modal State
  const [selectedLog, setSelectedLog] = useState(null);
  const [isRegularizeOpen, setIsRegularizeOpen] = useState(false);

  // 1. Fetch today's current check-in/checkout status
  const { 
    data: todayData, 
    isLoading: isTodayLoading 
  } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_TODAY);
      return response.data?.data?.attendance || null;
    },
  });

  // 2. Fetch employee's personal logs history and calculated stats
  const { 
    data: summaryData, 
    isLoading: isSummaryLoading 
  } = useQuery({
    queryKey: ['attendance', 'summary'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_MY_SUMMARY);
      return response.data?.data?.summary || { logs: [], statistics: {} };
    },
  });

  // 3. Fetch employee's own regularization requests
  const { 
    data: myRegularizations, 
    isLoading: isMyRequestsLoading 
  } = useQuery({
    queryKey: ['attendance', 'my-regularizations'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_MY_REGULARIZATIONS);
      return response.data?.data?.requests || [];
    },
  });

  // 4. Fetch all pending requests (Admin/HR only)
  const { 
    data: pendingRequests, 
    isLoading: isPendingRequestsLoading 
  } = useQuery({
    queryKey: ['attendance', 'pending-regularizations'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_PENDING_REGULARIZATIONS);
      return response.data?.data?.requests || [];
    },
    enabled: isHROrAdmin, // Only run query if role permits
  });

  // 5. Fetch team dashboard summary (Admin/HR only)
  const {
    data: teamDashboardData,
    isLoading: isTeamDashboardLoading
  } = useQuery({
    queryKey: ['attendance', 'team-dashboard'],
    queryFn: async () => {
      const response = await api.get(ATTENDANCE_ENDPOINTS.GET_TODAY_DASHBOARD);
      return response.data?.data?.dashboard || { statistics: {}, logs: [] };
    },
    enabled: isHROrAdmin && activeTab === 'team',
  });

  // Mutations
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
      const message = error.response?.data?.message || 'Check-in failed.';
      toast.error(message);
    },
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
      const message = error.response?.data?.message || 'Check-out failed.';
      toast.error(message);
    },
  });

  // Mutation to submit correction request
  const regularizeMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await api.post(ATTENDANCE_ENDPOINTS.REGULARIZE, payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Correction request submitted!');
      setIsRegularizeOpen(false);
      setSelectedLog(null);
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to submit request.';
      toast.error(message);
    },
  });

  // Mutation to approve request (Admin/HR)
  const approveRequestMutation = useMutation({
    mutationFn: async (id) => {
      const response = await api.post(ATTENDANCE_ENDPOINTS.APPROVE_REGULARIZATION(id));
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Correction request approved.');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to approve request.';
      toast.error(message);
    },
  });

  // Mutation to reject request (Admin/HR)
  const rejectRequestMutation = useMutation({
    mutationFn: async ({ id, reason }) => {
      const response = await api.post(ATTENDANCE_ENDPOINTS.REJECT_REGULARIZATION(id), {
        rejection_reason: reason,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'Correction request rejected.');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to reject request.';
      toast.error(message);
    },
  });

  const handleOpenRegularize = (log) => {
    setSelectedLog(log);
    setIsRegularizeOpen(true);
  };

  const handleCloseRegularize = () => {
    setIsRegularizeOpen(false);
    setSelectedLog(null);
  };

  const handleRegularizeSubmit = (payload) => {
    regularizeMutation.mutate(payload);
  };

  const handleApproveRequest = (id) => {
    approveRequestMutation.mutate(id);
  };

  const handleRejectRequest = (id, reason) => {
    rejectRequestMutation.mutate({ id, reason });
  };

  // Callback to fetch monthly logs for the CSV exporter
  const handleFetchMonthlyReport = async ({ year, month }) => {
    const response = await api.get(ATTENDANCE_ENDPOINTS.GET_MONTHLY_REPORT, {
      params: { year, month },
    });
    return response.data?.data?.report || [];
  };

  const isClockMutating = checkInMutation.isPending || checkOutMutation.isPending;
  const isApprovalPending = approveRequestMutation.isPending || rejectRequestMutation.isPending;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Attendance Logging
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Log daily check-ins, check-outs, and review monthly work hours.
          </p>
        </div>
      </div>

      {/* Segmented Tab Navigation for HR/Managers */}
      {isHROrAdmin && (
        <div className="flex border-b border-slate-100 dark:border-slate-800 -mt-2">
          <button
            onClick={() => setActiveTab('my')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'my'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650'
            }`}
          >
            My Attendance
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'team'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650'
            }`}
          >
            Team Attendance
          </button>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'team' && isHROrAdmin ? (
        <div className="flex flex-col gap-6">
          {/* Admin Approval Panel */}
          <AdminApprovalPanel
            requests={pendingRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            isPending={isApprovalPending}
            isLoading={isPendingRequestsLoading}
          />

          {/* Today's Daily Roster Stats and Exporter */}
          <TeamDashboard
            dashboardData={teamDashboardData}
            isLoading={isTeamDashboardLoading}
            onFetchReport={handleFetchMonthlyReport}
          />

          {/* Monthly Trend Analytics & Heatmaps */}
          <AnalyticsDashboard />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Check-In Card Widget */}
            <ClockCard
              todayAttendance={todayData}
              onCheckIn={() => checkInMutation.mutate()}
              onCheckOut={() => checkOutMutation.mutate()}
              isMutating={isClockMutating}
            />

            {/* Attendance Statistics Cards */}
            <StatsDashboard 
              statistics={summaryData?.statistics} 
            />
          </div>

          {/* History table log */}
          <HistoryTable
            logs={summaryData?.logs}
            isLoading={isSummaryLoading || isTodayLoading || isMyRequestsLoading}
            regularizationRequests={myRegularizations}
            onOpenRegularize={handleOpenRegularize}
          />
        </div>
      )}

      {/* Correction Form Modal */}
      <RegularizationModal
        isOpen={isRegularizeOpen}
        onClose={handleCloseRegularize}
        log={selectedLog}
        onSubmit={handleRegularizeSubmit}
        isPending={regularizeMutation.isPending}
      />
    </div>
  );
};

export default AttendancePage;
