import React from 'react';
import { ShieldCheck, Check } from 'lucide-react';

const RoleCard = ({ role }) => {
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

      <div className="mt-6 border-t border-slate-50 pt-4">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Granted Permissions</h4>
        <div className="flex flex-wrap gap-1.5">
          {role.permissions.map((p, idx) => (
            <span
              key={idx}
              className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-0.5"
            >
              <Check size={10} className="text-emerald-500 flex-shrink-0" />
              {p.split('_').slice(1).join(' ')}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleCard;
