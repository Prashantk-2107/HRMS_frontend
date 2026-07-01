import React from 'react';
import { Plus } from 'lucide-react';

const RolesHeader = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles and Permissions</h1>
        <p className="text-sm text-slate-500">Configure roles and permissions.</p>
      </div>

      <button
        onClick={onCreateClick}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
      >
        <Plus size={16} />
        <span>Create New Role</span>
      </button>
    </div>
  );
};

export default RolesHeader;
