import React from 'react';
import { Navigate } from 'react-router-dom';
import PublicRoute from '../guards/publicroutes';
import ProtectedRoute from '../guards/protectedroutes';
import LoginPage from '../../../modules/auth/pages/loginpage';
import ForgotPasswordPage from '../../../modules/auth/pages/forgotpasswordpage';
import CreatePasswordPage from '../../../modules/auth/pages/createpasswordpage';
import DashboardPage from '../../../modules/dashboard/pages/dashboardpage';
import DashboardLayout from '../../../components/layout/dashboardlayout';
import EmployeesPage from '../../../modules/employees/pages/employeespage';
import BankAccountsPage from '../../../modules/bank-accounts/pages/bankaccountspage';
import HolidaysPage from '../../../modules/holidays/pages/holidayspage';
import AttendancePage from '../../../modules/attendance/pages/attendancepage';
import RolesPage from '../../../modules/roles/pages/rolespage';
import LeavesPage from '../../../modules/leaves/pages/leavespage';
import DocumentsPage from '../../../modules/documents/pages/documentspage';
import AppsPage from '../../../modules/apps/pages/appspage';
import SettingsPage from '../../../modules/settings/pages/settingspage';
import HelpPage from '../../../modules/help/pages/helppage';
import ProfilePage from '../../../modules/profile/pages/profilepage';
import PermissionRoute from '../guards/permissionroutes';
import { SIDEBAR_PERMISSIONS } from '../../../constants/permissions';

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
        element: <LoginPage />
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />
      },
      {
        path: '/create-password',
        element: <CreatePasswordPage />
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
            element: <DashboardPage />
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.EMPLOYEES} />,
            children: [
              {
                path: '/employees',
                element: <EmployeesPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.HOLIDAYS} />,
            children: [
              {
                path: '/holidays',
                element: <HolidaysPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.ATTENDANCE} />,
            children: [
              {
                path: '/attendance',
                element: <AttendancePage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.ROLES} />,
            children: [
              {
                path: '/roles',
                element: <RolesPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions={SIDEBAR_PERMISSIONS.LEAVES} />,
            children: [
              {
                path: '/leaves',
                element: <LeavesPage />
              }
            ]
          },
          {
            path: '/documents',
            element: <DocumentsPage />
          },
          {
            path: '/bank-accounts',
            element: <BankAccountsPage />
          },
          {
            path: '/apps',
            element: <AppsPage />
          },
          {
            path: '/profile',
            element: <ProfilePage />
          },
          {
            path: '/settings',
            element: <SettingsPage />
          },
          {
            path: '/help',
            element: <HelpPage />
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
