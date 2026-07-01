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
  LIST: '/employee/get-all-emp',
  DETAILS: (id) => `/employee/get-emp/${id}`,
  CREATE: '/employee/create-emp',
  UPDATE: (id) => `/employee/update-emp/${id}`,
  DELETE: (id) => `/employee/delete-emp/${id}`,
  UPDATE_ME: '/employee/update-me',
  UPLOAD_PHOTO: '/employee/upload-profile-photo',
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
