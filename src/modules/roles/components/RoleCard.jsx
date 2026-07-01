import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

const RoleCard = ({ role, onViewPermissions }) => {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100/80 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all duration-200 text-left">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck size={10} /> Role
          </span>
          <span className="text-xs font-semibold text-slate-400">{role.membersCount} Members</span>
        </div>

        <h3 className="text-lg font-bold text-slate-800">{role.name}</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{role.description}</p>
      </div>

      <div className="mt-6 border-t border-slate-50 pt-4 flex flex-col gap-3">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>Granted Permissions</span>
          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full text-[10px] border border-indigo-100/50">
            {role.permissions?.length || 0} Permissions
          </span>
        </div>
        
        <button
          onClick={() => onViewPermissions(role)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-indigo-100 hover:border-indigo-200 bg-indigo-50/30 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 font-semibold text-xs transition-all duration-200 cursor-pointer active:scale-[0.98]"
        >
          <span>See Granted Permissions</span>
        </button>
      </div>
    </div>
  );
};

export default RoleCard;
