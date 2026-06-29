export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
};

export const EMPLOYEE_ENDPOINTS = {
  LIST: '/employees',
  DETAILS: (id) => `/employees/${id}`,
  CREATE: '/employees',
  UPDATE: (id) => `/employees/${id}`,
  DELETE: (id) => `/employees/${id}`,
};
