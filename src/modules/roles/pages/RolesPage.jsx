import React from 'react';
import { ShieldCheck, Plus, Check } from 'lucide-react';

const RolesPage = () => {
  const roles = [
    {
      name: 'Super Admin',
      description: 'Full system access, can manage settings, employee records, roles, and financial details.',
      membersCount: 2,
      permissions: ['view_employees', 'manage_employees', 'view_bank_accounts', 'view_holidays', 'view_attendance', 'view_roles'],
    },
    {
      name: 'HR Manager',
      description: 'Can manage employees, view attendances, manage holidays list, and assign regular roles.',
      membersCount: 5,
      permissions: ['view_employees', 'manage_employees', 'view_holidays', 'view_attendance'],
    },
    {
      name: 'Software Engineer',
      description: 'Standard employee permissions to view own attendance logs, view holidays, and link bank accounts.',
      membersCount: 24,
      permissions: ['view_holidays', 'view_attendance', 'view_bank_accounts'],
    },
  ];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-slate-500">Configure role-based access controls and module permissions.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10">
          <Plus size={16} />
          <span>Create New Role</span>
        </button>
      </div>

      {/* Role list representation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((r, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-100 transition-all duration-200"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={10} /> Role
                </span>
                <span className="text-xs font-semibold text-slate-400">{r.membersCount} Members</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800">{r.name}</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{r.description}</p>
            </div>

            <div className="mt-6 border-t border-slate-50 pt-4">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Granted Permissions</h4>
              <div className="flex flex-wrap gap-1.5">
                {r.permissions.map((p, idx) => (
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
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
