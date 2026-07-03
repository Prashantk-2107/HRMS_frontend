import React, { useState, useEffect } from 'react';
import { X, Loader2, Search, UserCheck, ShieldAlert, User, Shield, AlertTriangle } from 'lucide-react';
import api, { EMPLOYEE_ENDPOINTS, PERMISSION_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';
import Skeleton from '../../../components/ui/Skeleton';

const EmployeePermissionsModal = ({ isOpen, onClose, allPermissions }) => {
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  
  const [empPermissionsLoading, setEmpPermissionsLoading] = useState(false);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [extraPermissions, setExtraPermissions] = useState([]);
  const [effectivePermissions, setEffectivePermissions] = useState([]);

  const [isToggling, setIsToggling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch employees list on mount/open
  useEffect(() => {
    if (!isOpen) return;

    const fetchEmployees = async () => {
      try {
        setEmployeesLoading(true);
        const response = await api.get(EMPLOYEE_ENDPOINTS.LIST);
        if (response.data && response.data.data && Array.isArray(response.data.data.employees)) {
          setEmployees(response.data.data.employees);
        }
      } catch (err) {
        console.error('Failed to fetch employees:', err);
        toast.error('Failed to load employees list');
      } finally {
        setEmployeesLoading(false);
      }
    };

    fetchEmployees();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedEmpId('');
      setSearchQuery('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  // Fetch employee permissions when selection changes
  const fetchEmpPermissions = async (empId, silent = false) => {
    if (!empId) {
      setRolePermissions([]);
      setExtraPermissions([]);
      setEffectivePermissions([]);
      return;
    }

    try {
      if (!silent) setEmpPermissionsLoading(true);
      const response = await api.get(PERMISSION_ENDPOINTS.GET_USER_PERMISSIONS(empId));
      if (response.data && response.data.data) {
        setRolePermissions(response.data.data.rolePermissions || []);
        setExtraPermissions(response.data.data.extraPermissions || []);
        setEffectivePermissions(response.data.data.effectivePermissions || []);
      }
    } catch (err) {
      console.error('Failed to fetch employee permissions:', err);
      toast.error('Failed to load employee permissions');
    } finally {
      if (!silent) setEmpPermissionsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpPermissions(selectedEmpId, false);
  }, [selectedEmpId]);

  if (!isOpen) return null;

  // Convert arrays to sets for O(1) lookups
  const roleIds = new Set(rolePermissions.map(p => p.permission_id));
  const effectiveIds = new Set(effectivePermissions.map(p => p.permission_id));
  
  // Create override map: permission_id -> isGranted
  const overrides = new Map(extraPermissions.map(p => [p.permission_id, p.isGranted]));

  const selectedEmployee = employees.find(e => e.emp_id === selectedEmpId);

  // Group all available system permissions by module category
  const categories = {};
  allPermissions.forEach(perm => {
    // Determine category based on prefix, e.g. "emp:create" -> "Employee"
    const prefix = perm.name.split(':')[0];
    let catName = 'General';
    if (prefix === 'emp') catName = 'Employee';
    else if (prefix === 'role') catName = 'Role';
    else if (prefix === 'permission') catName = 'Permissions';
    else if (prefix === 'holiday') catName = 'Holidays';
    else if (prefix === 'attendance') catName = 'Attendance';
    else if (prefix === 'leave') catName = 'Leaves';
    else if (prefix === 'document') catName = 'Documents';
    
    if (!categories[catName]) {
      categories[catName] = [];
    }
    categories[catName].push(perm);
  });

  const handleToggle = async (permissionId) => {
    if (!selectedEmpId || isToggling) return;
    
    const isEffective = effectiveIds.has(permissionId);
    const isRoleBased = roleIds.has(permissionId);
    
    setIsToggling(true);
    const toastId = toast.loading('Updating employee permission override...');
    try {
      if (isEffective) {
        // Toggle OFF (Revoke)
        if (isRoleBased) {
          // Since it's role-based, we must create a revoke override
          await api.post(PERMISSION_ENDPOINTS.SET_EXTRA, {
            emp_id: selectedEmpId,
            permission_id: permissionId,
            isGranted: false
          });
        } else {
          // Since it's a grant override, we just delete the override record
          await api.delete(PERMISSION_ENDPOINTS.DELETE_EXTRA, {
            data: {
              emp_id: selectedEmpId,
              permission_id: permissionId
            }
          });
        }
      } else {
        // Toggle ON (Grant)
        if (isRoleBased) {
          // Since it's role-based but revoked, we delete the revoke override
          await api.delete(PERMISSION_ENDPOINTS.DELETE_EXTRA, {
            data: {
              emp_id: selectedEmpId,
              permission_id: permissionId
            }
          });
        } else {
          // Since it's not role-based, we add a grant override
          await api.post(PERMISSION_ENDPOINTS.SET_EXTRA, {
            emp_id: selectedEmpId,
            permission_id: permissionId,
            isGranted: true
          });
        }
      }
      toast.success('Permission updated successfully!', { id: toastId });
      // Re-fetch employee permissions silently to reflect changes and preserve scroll position
      await fetchEmpPermissions(selectedEmpId, true);
    } catch (err) {
      console.error('Failed to update extra permission:', err);
      toast.error(err.response?.data?.message || 'Failed to update permission', { id: toastId });
    } finally {
      setIsToggling(false);
    }
  };

  const formatPermissionName = (name) => {
    return name
      .replace(/:/g, ' - ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmpId(emp.emp_id);
    setSearchQuery(`${emp.first_name} ${emp.last_name}`);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    setSelectedEmpId('');
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false);
    if (selectedEmpId) {
      const emp = employees.find(e => e.emp_id === selectedEmpId);
      if (emp) {
        setSearchQuery(`${emp.first_name} ${emp.last_name}`);
      }
    } else {
      setSearchQuery('');
    }
  };

  // Filter employees for selector
  const filteredEmployees = employees.filter(e => {
    const term = searchQuery.toLowerCase();
    const fullName = `${e.first_name || ''} ${e.last_name || ''}`.toLowerCase();
    const email = (e.email || '').toLowerCase();
    const code = (e.empCode || '').toLowerCase();
    return fullName.includes(term) || email.includes(term) || code.includes(term);
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Shield className="text-indigo-600" size={20} />
              <span>Direct Employee Permissions</span>
            </h3>
            <p className="text-xs text-slate-400">Grant or revoke specific permission overrides directly to an individual employee.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6 text-left">
          
          {/* Employee Selection Dropdown / Selector */}
          <div className="flex flex-col gap-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Employee</label>
            <div className="relative">
              {employeesLoading ? (
                <div className="w-full flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Loading employees list...</span>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative flex items-center">
                    <Search className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
                    <input
                      type="text"
                      placeholder="Type to search and select employee..."
                      value={searchQuery}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSelection}
                        className="absolute right-3.5 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title="Clear selection"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={handleCloseDropdown} />
                      <div className="absolute z-20 top-full mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1 flex flex-col">
                        {filteredEmployees.length === 0 ? (
                          <div className="px-4 py-2.5 text-xs text-slate-400 italic">No employees found</div>
                        ) : (
                          filteredEmployees.map((emp) => {
                            const isSelected = emp.emp_id === selectedEmpId;
                            return (
                              <button
                                key={emp.emp_id}
                                type="button"
                                onClick={() => handleSelectEmployee(emp)}
                                className={`w-full flex flex-col px-4 py-2.5 text-xs text-left transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                              >
                                <span className="font-bold">
                                  {emp.first_name} {emp.last_name} {emp.empCode ? `[${emp.empCode}]` : ''}
                                </span>
                                <span className="text-[10px] text-slate-400 mt-0.5">
                                  {emp.role?.name || 'No Role'} • {emp.email}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {!selectedEmpId ? (
            <div className="flex flex-col items-center justify-center py-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center">
              <User className="text-slate-300 mb-2.5" size={32} />
              <span className="text-sm font-semibold text-slate-500">No Employee Selected</span>
              <span className="text-xs text-slate-400 mt-1 max-w-xs">Please select an employee above to view their role permissions and configure overrides.</span>
            </div>
          ) : empPermissionsLoading ? (
            /* Permissions loading skeleton */
            <div className="flex flex-col gap-6">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-28 bg-indigo-50" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {Array.from({ length: 4 }).map((_, innerIdx) => (
                      <div key={innerIdx} className="p-3.5 border border-slate-100 rounded-xl flex items-center justify-between">
                        <div className="flex flex-col gap-1.5">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                        <Skeleton className="h-6 w-10 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Selected Employee details & permission roster */
            <div className="flex flex-col gap-6">
              
              {/* Employee Summary Card */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {selectedEmployee?.first_name?.charAt(0)}{selectedEmployee?.last_name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{selectedEmployee?.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold">
                    Role: <span className="text-indigo-600 font-bold">{selectedEmployee?.role?.name || 'N/A'}</span>
                  </span>
                  <span className={`px-2.5 py-1 border rounded-lg text-xs font-bold uppercase tracking-wider ${
                    selectedEmployee?.employee_status === 'active' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-amber-50 border-amber-200 text-amber-700'
                  }`}>
                    {selectedEmployee?.employee_status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Information Alert */}
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="text-indigo-500 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Overrides will take precedence over role permissions. A <span className="font-bold text-emerald-600">Granted Override</span> allows access for this user even if not permitted by their role. A <span className="font-bold text-rose-600">Revoked Override</span> blocks access even if permitted by their role.
                </p>
              </div>

              {/* Permissions Categories */}
              <div className="flex flex-col gap-6">
                {Object.keys(categories).map(catName => {
                  const perms = categories[catName];
                  return (
                    <div key={catName} className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 pb-1 border-b border-slate-100">
                        {catName} Permissions
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {perms.map(perm => {
                          const isRoleBased = roleIds.has(perm.permission_id);
                          const isEffective = effectiveIds.has(perm.permission_id);
                          const overrideVal = overrides.get(perm.permission_id);

                          return (
                            <div 
                              key={perm.permission_id}
                              className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                                isEffective 
                                  ? 'bg-white border-slate-200' 
                                  : 'bg-slate-50/40 border-slate-100'
                              }`}
                            >
                              <div className="flex flex-col gap-1 min-w-0">
                                <span className={`text-xs font-bold truncate ${isEffective ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                                  {formatPermissionName(perm.name)}
                                </span>
                                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                  {isRoleBased && (
                                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[9px] font-bold uppercase">
                                      Role
                                    </span>
                                  )}
                                  {overrideVal === true && (
                                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold uppercase">
                                      Granted
                                    </span>
                                  )}
                                  {overrideVal === false && (
                                    <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-bold uppercase">
                                      Revoked
                                    </span>
                                  )}
                                  {!isRoleBased && overrideVal === undefined && (
                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[9px] font-bold uppercase">
                                      Default Off
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled={isToggling}
                                onClick={() => handleToggle(perm.permission_id)}
                                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-200 border shrink-0 ${
                                  isEffective 
                                    ? 'bg-indigo-600 border-indigo-700 justify-end' 
                                    : 'bg-slate-200 border-slate-300 justify-start'
                                } disabled:opacity-50`}
                              >
                                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeePermissionsModal;
