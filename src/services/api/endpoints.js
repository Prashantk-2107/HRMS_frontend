// Authentication-related API endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
};

// Employee-related API endpoints
export const EMPLOYEE_ENDPOINTS = {
  LIST: '/employees',
  DETAILS: (id) => `/employees/${id}`,
  CREATE: '/employees',
  UPDATE: (id) => `/employees/${id}`,
  DELETE: (id) => `/employees/${id}`,
};
