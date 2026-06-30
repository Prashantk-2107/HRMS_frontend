import React from 'react';
import { Navigate } from 'react-router-dom';
import PublicRoute from '../guards/publicRoutes';
import ProtectedRoute from '../guards/protectedRoutes';
import LoginPage from '../../../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../../../modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '../../../modules/dashboard/pages/DashboardPage';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import EmployeesPage from '../../../modules/employees/pages/EmployeesPage';
import BankAccountsPage from '../../../modules/bank-accounts/pages/BankAccountsPage';
import HolidaysPage from '../../../modules/holidays/pages/HolidaysPage';
import AttendancePage from '../../../modules/attendance/pages/AttendancePage';
import RolesPage from '../../../modules/roles/pages/RolesPage';
import LeavesPage from '../../../modules/leaves/pages/LeavesPage';
import DocumentsPage from '../../../modules/documents/pages/DocumentsPage';
import AppsPage from '../../../modules/apps/pages/AppsPage';
import SettingsPage from '../../../modules/settings/pages/SettingsPage';
import HelpPage from '../../../modules/help/pages/HelpPage';
import PermissionRoute from '../guards/permissionRoutes';

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
            element: <PermissionRoute requiredPermissions="view_employees" />,
            children: [
              {
                path: '/employees',
                element: <EmployeesPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_bank_accounts" />,
            children: [
              {
                path: '/bank-accounts',
                element: <BankAccountsPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_holidays" />,
            children: [
              {
                path: '/holidays',
                element: <HolidaysPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_attendance" />,
            children: [
              {
                path: '/attendance',
                element: <AttendancePage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_roles" />,
            children: [
              {
                path: '/roles',
                element: <RolesPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_leaves" />,
            children: [
              {
                path: '/leaves',
                element: <LeavesPage />
              }
            ]
          },
          {
            element: <PermissionRoute requiredPermissions="view_documents" />,
            children: [
              {
                path: '/documents',
                element: <DocumentsPage />
              }
            ]
          },
          {
            path: '/apps',
            element: <AppsPage />
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
