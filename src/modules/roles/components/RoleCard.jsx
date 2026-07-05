import React from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';
import PermissionGuard from '../../../components/common/PermissionGuard';
import { PERMISSIONS } from '../../../constants/permissions';

const RoleCard = ({ role, onViewPermissions, isDeleteMode, onDeleteClick }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-indigo-100 dark:hover:border-indigo-900/60 transition-all duration-200 text-left relative overflow-hidden transition-colors duration-200">
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={10} /> Role
          </span>
          {isDeleteMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(role);
              }}
              className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-500/50 transition-all duration-150 cursor-pointer active:scale-90"
              title="Delete Role"
            >
              <Trash2 size={14} />
            </button>
          ) : (
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{role.membersCount} Members</span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{role.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{role.description}</p>
      </div>
      <PermissionGuard permissions={[PERMISSIONS.PERMISSION_GRANT_REVOKE]}>
        <div className="mt-6 border-t border-slate-50 dark:border-slate-800 pt-4 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
            <span>Granted Permissions</span>
            <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[10px] border border-indigo-100/50 dark:border-indigo-900/40">
              {role.permissions?.length || 0} Permissions
            </span>
          </div>

          <button
            onClick={() => onViewPermissions(role)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900/80 hover:border-indigo-200 bg-indigo-50/30 dark:bg-indigo-950/10 hover:bg-indigo-50 dark:hover:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
          >
            <span>See Granted Permissions</span>
          </button>
        </div>
      </PermissionGuard>
    </div>
  );
};

export default RoleCard;
