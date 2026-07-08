import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import PublicRoute from '../guards/publicroutes';
import ProtectedRoute from '../guards/protectedroutes';
import PermissionRoute from '../guards/permissionroutes';
import { SIDEBAR_PERMISSIONS } from '../../../constants/permissions';
import { withSuspense } from '../../../components/common/pageloader';

// DashboardLayout is structural and is loaded immediately
import DashboardLayout from '../../../components/layout/dashboardlayout';

// Lazy load actual pages
const LoginPage = lazy(() => import('../../../modules/auth/pages/loginpage'));
const ForgotPasswordPage = lazy(() => import('../../../modules/auth/pages/forgotpasswordpage'));
const CreatePasswordPage = lazy(() => import('../../../modules/auth/pages/createpasswordpage'));
const DashboardPage = lazy(() => import('../../../modules/dashboard/pages/dashboardpage'));
const EmployeesPage = lazy(() => import('../../../modules/employees/pages/employeespage'));
const BankAccountsPage = lazy(() => import('../../../modules/bank-accounts/pages/bankaccountspage'));
const HolidaysPage = lazy(() => import('../../../modules/holidays/pages/holidayspage'));
const AttendancePage = lazy(() => import('../../../modules/attendance/pages/attendancepage'));
const RolesPage = lazy(() => import('../../../modules/roles/pages/rolespage'));
const LeavesPage = lazy(() => import('../../../modules/leaves/pages/leavespage'));
const DocumentsPage = lazy(() => import('../../../modules/documents/pages/documentspage'));
const AppsPage = lazy(() => import('../../../modules/apps/pages/appspage'));
const SettingsPage = lazy(() => import('../../../modules/settings/pages/settingspage'));
const HelpPage = lazy(() => import('../../../modules/help/pages/helppage'));
const ProfilePage = lazy(() => import('../../../modules/profile/pages/profilepage'));

export const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: withSuspense(LoginPage, true)
      },
      {
        path: '/forgot-password',
        element: withSuspense(ForgotPasswordPage, true)
      },
      {
        path: '/create-password',
        element: withSuspense(CreatePasswordPage, true)
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: withSuspense(DashboardPage)
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.EMPLOYEES} />,
            children: [
              {
                path: '/employees',
                element: withSuspense(EmployeesPage)
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.HOLIDAYS} />,
            children: [
              {
                path: '/holidays',
                element: withSuspense(HolidaysPage)
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.ATTENDANCE} />,
            children: [
              {
                path: '/attendance',
                element: withSuspense(AttendancePage)
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.ROLES} />,
            children: [
              {
                path: '/roles',
                element: withSuspense(RolesPage)
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.LEAVES} />,
            children: [
              {
                path: '/leaves',
                element: withSuspense(LeavesPage)
              }
            ]
          },
          {
            path: '/documents',
            element: withSuspense(DocumentsPage)
          },
          {
            path: '/bank-accounts',
            element: withSuspense(BankAccountsPage)
          },
          {
            path: '/apps',
            element: withSuspense(AppsPage)
          },
          {
            path: '/profile',
            element: withSuspense(ProfilePage)
          },
          {
            path: '/settings',
            element: withSuspense(SettingsPage)
          },
          {
            path: '/help',
            element: withSuspense(HelpPage)
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];
