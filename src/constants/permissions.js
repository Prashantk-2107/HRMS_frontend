export const PERMISSIONS = {
  // Employees
  EMP_GET_ALL: 'emp:get_all',
  EMP_CREATE: 'emp:create',
  EMP_DELETE: 'emp:delete',
  EMP_UPDATE: 'emp:update',
  EMP_ASSIGN_ROLE: 'emp:assign_role',
  EMP_VIEW_ANY: 'emp:view_any',
  EMP_GRANT_EXTRA_PERMISSION: 'emp:grant_extra_permission',

  // Documents
  EMP_VIEW_DOCUMENTS: 'emp:view_documents',
  EMP_ADD_DOCUMENTS: 'emp:add_documents',
  EMP_REMOVE_DOCUMENTS: 'emp:remove_documents',
  EMP_VERIFY_DOCUMENTS: 'emp:verify_documents',

  // Bank details / Payroll
  EMP_MANAGE_BANK_DETAILS: 'emp:manage_bank_details',

  // Roles
  ROLE_CREATE: 'role:create',
  ROLE_GET_ALL: 'role:get_all',
  ROLE_DELETE: 'role:delete',
  ROLE_UPDATE: 'role:update',

  // Holidays
  HOLIDAY_MANAGE: 'holiday:manage',

  // Permissions general
  PERMISSION_GRANT_REVOKE: 'permission:grantAndRevoke',

  // Fallbacks (kept for current design compatibility / future expansion)
  VIEW_ATTENDANCE: 'view_attendance',
  MANAGE_ATTENDANCE: 'manage_attendance',
  VIEW_LEAVES: 'view_leaves',
  MANAGE_LEAVES: 'manage_leaves',
};

// If any of these permissions are present, the sidebar item is visible
export const SIDEBAR_PERMISSIONS = {
  EMPLOYEES: [
    PERMISSIONS.EMP_GET_ALL,
    PERMISSIONS.EMP_VIEW_ANY,
    PERMISSIONS.EMP_CREATE,
    PERMISSIONS.EMP_UPDATE,
    PERMISSIONS.EMP_DELETE
  ],
  ATTENDANCE: [
    PERMISSIONS.VIEW_ATTENDANCE,
    PERMISSIONS.MANAGE_ATTENDANCE,
    'attendance:view',
    'attendance:manage'
  ],
  HOLIDAYS: [
    PERMISSIONS.HOLIDAY_MANAGE,
    'holiday:view'
  ],
  LEAVES: [
    PERMISSIONS.VIEW_LEAVES,
    PERMISSIONS.MANAGE_LEAVES,
    'leave:view',
    'leave:manage'
  ],
  PAYROLL: [
    PERMISSIONS.EMP_MANAGE_BANK_DETAILS
  ],
  DOCUMENTS: [
    PERMISSIONS.EMP_VIEW_DOCUMENTS,
    PERMISSIONS.EMP_ADD_DOCUMENTS,
    PERMISSIONS.EMP_REMOVE_DOCUMENTS,
    PERMISSIONS.EMP_VERIFY_DOCUMENTS
  ],
  ROLES: [
    PERMISSIONS.ROLE_GET_ALL,
    PERMISSIONS.ROLE_CREATE,
    PERMISSIONS.ROLE_UPDATE,
    PERMISSIONS.ROLE_DELETE
  ],
};
