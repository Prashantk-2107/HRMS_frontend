import { Plus, Trash2, ShieldAlert } from 'lucide-react';

const RolesHeader = ({ onCreateClick, onDeleteModeToggle, isDeleteMode }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Roles and Permissions</h1>
        <p className="text-sm text-slate-500">Configure roles and permissions.</p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onDeleteModeToggle}
          className={`flex items-center gap-2 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer active:scale-[0.98] ${
            isDeleteMode
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

        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10"
        >
          <Plus size={16} />
          <span>Create New Role</span>
        </button>
      </div>
    </div>
  );
};

export default RolesHeader;
