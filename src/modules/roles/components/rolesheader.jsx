import { Plus, Trash2, ShieldAlert, UserCheck, Import } from 'lucide-react';
import PermissionGuard from '../../../components/common/permissionguard';
import { PERMISSIONS } from '../../../constants/permissions';

const RolesHeader = ({ onCreateClick, onDeleteModeToggle, isDeleteMode, onAssignClick, onExportClick, onDirectPermissionsClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Roles and Permissions</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure roles and permissions.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <Import size={16} />
          <span>Import</span>
        </button>

        <PermissionGuard permissions={PERMISSIONS.ROLE_DELETE}>
          <button
            onClick={onDeleteModeToggle}
            className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isDeleteMode
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
              : 'border border-rose-300 dark:border-rose-500/50 bg-rose-50/20 dark:bg-rose-950/10 hover:bg-rose-50 dark:hover:bg-rose-950/25 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
              }`}
          >
            {isDeleteMode ? (
              <>
                <ShieldAlert size={16} />
                <span>Exit Delete Mode</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Role</span>
              </>
            )}
          </button>
        </PermissionGuard>

        <button
          onClick={onAssignClick}
          className="flex items-center gap-2 border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/10 dark:bg-indigo-950/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <UserCheck size={16} />
          <span>Assign Role</span>
        </button>

        <PermissionGuard permissions={PERMISSIONS.EMP_GRANT_EXTRA_PERMISSION}>
          <button
            onClick={onDirectPermissionsClick}
            className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
            title="Grant direct permission overrides to a specific employee"
          >
            <UserCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Employee Permissions</span>
          </button>
        </PermissionGuard>

        <PermissionGuard permissions={PERMISSIONS.ROLE_CREATE}>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
          >
            <Plus size={16} />
            <span>Create New Role</span>
          </button>
        </PermissionGuard>
      </div>
    </div>
  );
};

export default RolesHeader;
