import { Plus, Trash2, ShieldAlert, UserCheck, Download, Import } from 'lucide-react';
import PermissionGuard from '../../../components/common/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';

const RolesHeader = ({ onCreateClick, onDeleteModeToggle, isDeleteMode, onAssignClick, onExportClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles and Permissions</h1>
        <p className="text-sm text-slate-500">Configure roles and permissions.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <Import size={16} />
          <span>Import</span>
        </button>

        <PermissionGuard permissions={PERMISSIONS.ROLE_DELETE}>
          <button
            onClick={onDeleteModeToggle}
            className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${isDeleteMode
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10'
              : 'border border-rose-200 bg-rose-50/20 hover:bg-rose-50 text-rose-600 hover:text-rose-700'
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
          className="flex items-center gap-2 border border-indigo-200 bg-indigo-50/10 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <UserCheck size={16} />
          <span>Assign Role</span>
        </button>

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
