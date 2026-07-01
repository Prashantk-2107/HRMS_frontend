import React, { useState, useEffect } from 'react';
import { Users, UserPlus, FileDown, Search } from 'lucide-react';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(EMPLOYEE_ENDPOINTS.LIST);
        if (response.data && response.data.data && Array.isArray(response.data.data.employees)) {
          setEmployees(response.data.data.employees);
        } else {
          setEmployees([]);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError(err.response?.data?.message || 'Failed to fetch employees. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter based on search term
  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase();
    const id = (emp.empCode || emp.emp_id || '').toLowerCase();
    const role = (emp.role?.name || '').toLowerCase();
    const email = (emp.email || '').toLowerCase();
    return (
      fullName.includes(term) ||
      id.includes(term) ||
      role.includes(term) ||
      email.includes(term)
    );
  });

  // Calculate stats dynamically
  const totalStaff = employees.length;
  const activeStaff = employees.filter((emp) => emp.employee_status === 'active').length;
  const inactiveStaff = employees.filter((emp) => emp.employee_status === 'in_active').length;

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees Directory</h1>
          <p className="text-sm text-slate-500">Manage, view, and add corporate staff members.</p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm">
            <FileDown size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10">
            <UserPlus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Grid containing Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Staff</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : totalStaff}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Active Staff</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : activeStaff}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Inactive Staff</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : inactiveStaff}</span>
          </div>
        </div>
      </div>

      {/* Main content table panel */}
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
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-500 font-semibold">
                    {error}
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-semibold">
                    No staff members found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, i) => (
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
