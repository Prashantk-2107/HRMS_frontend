export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
  SEND_OTP: '/auth/send-otp',
  FORGOT_PASSWORD: '/auth/forget-password',
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

export const PERMISSION_ENDPOINTS = {
  GET_ALL: '/permission/get-all-permissions',
  GET_USER_PERMISSIONS: (empId) => `/permission/emp-permissions/${empId}`,
  GRANT_REVOKE: '/permission/grant-revoke-permission',
};

export const ROLE_ENDPOINTS = {
  GET_ALL: '/role/get-all-roles',
  CREATE: '/role/create-role',
  DELETE: (roleId) => `/role/delete-role/${roleId}`,
};
