export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  PROFILE: '/auth/profile',
  SEND_OTP: '/auth/send-otp',
  FORGOT_PASSWORD: '/auth/forget-password',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  CREATE_PASSWORD: '/auth/create-password',
  RESEND_SETUP_LINK: '/auth/resend-setup-link',
};

export const EMPLOYEE_ENDPOINTS = {
  LIST: '/employee/get-all-emp',
  DETAILS: (id) => `/employee/get-emp/${id}`,
  CREATE: '/employee/create-emp',
  UPDATE: (id) => `/employee/update-emp/${id}`,
  DELETE: (id) => `/employee/delete-emp/${id}`,
  UPDATE_ME: '/employee/update-me',
  UPLOAD_PHOTO: '/employee/upload-profile-photo',
  SET_STATUS: '/employee/set-status',
};

export const PERMISSION_ENDPOINTS = {
  GET_ALL: '/permission/get-all-permissions',
  GET_USER_PERMISSIONS: (empId) => `/permission/emp-permissions/${empId}`,
  GRANT_REVOKE: '/permission/grant-revoke-permission',
  SET_EXTRA: '/permission/set-extra-permission',
  DELETE_EXTRA: '/permission/delete-extra-permission',
};

export const ROLE_ENDPOINTS = {
  GET_ALL: '/role/get-all-roles',
  CREATE: '/role/create-role',
  DELETE: (roleId) => `/role/delete-role/${roleId}`,
};

export const BANK_DETAILS_ENDPOINTS = {
  GET_MY: '/bank-details/my-bank-details',
  ADD_MY: '/bank-details/add-my-bank-details',
  UPDATE_MY: (id) => `/bank-details/update-my-bank-details/${id}`,
};

export const ATTENDANCE_ENDPOINTS = {
  CHECK_IN: '/attendance/check-in',
  CHECK_OUT: '/attendance/check-out',
  GET_TODAY: '/attendance/today',
  GET_MY_SUMMARY: '/attendance/my-summary',
  REGULARIZE: '/attendance/regularize',
  GET_MY_REGULARIZATIONS: '/attendance/regularizations/my',
  GET_PENDING_REGULARIZATIONS: '/attendance/regularizations/pending',
  APPROVE_REGULARIZATION: (id) => `/attendance/regularizations/${id}/approve`,
  REJECT_REGULARIZATION: (id) => `/attendance/regularizations/${id}/reject`,
  GET_TODAY_DASHBOARD: '/attendance/admin/today-dashboard',
  GET_MONTHLY_REPORT: '/attendance/admin/monthly-report',
  GET_ANALYTICS: '/attendance/admin/analytics',
};
