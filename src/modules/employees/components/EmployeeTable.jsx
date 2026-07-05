import React from 'react';
import { Search, Trash2, Eye, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../constants/permissions';

const EmployeeTable = ({ loading, error, searchTerm, setSearchTerm, employees, isDeleteMode, onDeleteClick, onViewClick, onEditClick, onStatusClick }) => {
  const { hasPermission } = usePermission();
  const canView = hasPermission(PERMISSIONS.EMP_VIEW_ANY);
  const canEdit = hasPermission(PERMISSIONS.EMP_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.EMP_DELETE);

  const showActionColumn = canView || canEdit || (canDelete && isDeleteMode);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      {/* Search header inside panel */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 transition-colors duration-200">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Staff Roster</h3>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or role..."
            className="bg-transparent text-xs text-slate-700 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table representation */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Status</th>
              {showActionColumn && (
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16"></div></td>
                  {showActionColumn && (
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24 ml-auto"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={showActionColumn ? 6 : 5} className="px-6 py-8 text-center text-red-500 font-semibold">
                  {error}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={showActionColumn ? 6 : 5} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500 font-semibold">
                  No staff members found matching the search criteria.
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{emp.empCode || emp.emp_id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 font-medium">{emp.role?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    {canEdit ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusClick(emp);
                        }}
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 border ${emp.employee_status === 'active'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40'
                          : 'bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40'
                          }`}
                        title={`Click to change status to ${emp.employee_status === 'active' ? 'Inactive' : 'Active'}`}
                      >
                        {emp.employee_status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    ) : (
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${emp.employee_status === 'active' ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                        }`}>
                        {emp.employee_status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                  {showActionColumn && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {canView && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewClick(emp.emp_id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-700 transition-all duration-150 cursor-pointer active:scale-90"
                            title="View Employee Details"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                        {canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditClick(emp.emp_id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-700 transition-all duration-150 cursor-pointer active:scale-90"
                            title="Edit Employee"
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {isDeleteMode && canDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClick(emp);
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-500/50 transition-all duration-150 cursor-pointer active:scale-90"
                            title="Delete Employee"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
