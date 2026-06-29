import React from 'react';
import { Navigate } from 'react-router-dom';
import PublicRoute from '../guards/publicRoutes';
import ProtectedRoute from '../guards/protectedRoutes';
import LoginPage from '../../../modules/auth/pages/LoginPage';
import ForgotPasswordPage from '../../../modules/auth/pages/ForgotPasswordPage';
import DashboardPage from '../../../modules/dashboard/pages/DashboardPage';

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
        path: '/dashboard',
        element: <DashboardPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />
  }
];
