import React from 'react';
import { Users, UserPlus, FileDown, Search } from 'lucide-react';

const EmployeesPage = () => {
  const mockEmployees = [
    { id: 'EMP001', name: 'Alok Mishra', email: 'alok.mishra@crm.com', role: 'Super Admin', status: 'Active' },
    { id: 'EMP002', name: 'Prashant Kumar', email: 'prashant.kumar@crm.com', role: 'HR Manager', status: 'Active' },
    { id: 'EMP003', name: 'Sneha Patel', email: 'sneha.patel@crm.com', role: 'Software Engineer', status: 'On Leave' },
    { id: 'EMP004', name: 'Rohan Sharma', email: 'rohan.sharma@crm.com', role: 'Business Analyst', status: 'Active' },
  ];

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
            <span className="text-2xl font-bold text-slate-800">48</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping absolute" />
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Active Staff</span>
            <span className="text-2xl font-bold text-slate-800">45</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">On Leave</span>
            <span className="text-2xl font-bold text-slate-800">3</span>
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
              {mockEmployees.map((emp, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-slate-500">{emp.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{emp.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      emp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
