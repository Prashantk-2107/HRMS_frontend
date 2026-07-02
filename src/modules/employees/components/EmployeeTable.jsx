import React from 'react';
import { Search, Trash2, Eye, Pencil } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EmployeeTable = ({ loading, error, searchTerm, setSearchTerm, employees, isDeleteMode, onDeleteClick, onViewClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Search header inside panel */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <h3 className="font-bold text-slate-800">Staff Roster</h3>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 w-full sm:w-72">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or role..."
            className="bg-transparent text-xs text-slate-700 outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table representation */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-16"></div></td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 bg-slate-200 rounded-xl w-24 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-500 font-semibold">
                  {error}
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-semibold">
                  No staff members found matching the search criteria.
                </td>
              </tr>
            ) : (
              employees.map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500">{emp.empCode || emp.emp_id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">
                    {`${emp.first_name || ''} ${emp.last_name || ''}`.trim() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{emp.role?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${emp.employee_status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {emp.employee_status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewClick(emp.emp_id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border border-slate-200/60 transition-all duration-150 cursor-pointer active:scale-90"
                        title="View Employee Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Edit action triggered for: ${emp.first_name || ''} ${emp.last_name || ''}`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-700 border border-slate-200/60 transition-all duration-150 cursor-pointer active:scale-90"
                        title="Edit Employee"
                      >
                        <Pencil size={14} />
                      </button>
                      {isDeleteMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick(emp);
                          }}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-100 transition-all duration-150 cursor-pointer active:scale-90"
                          title="Delete Employee"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
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
