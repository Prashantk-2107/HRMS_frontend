import React, { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown, Check } from 'lucide-react';
import api, { ROLE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';

const EditEmployeeModal = ({ isOpen, onClose, onSuccess, employeeId }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    joining_date: '',
    role_id: '',
    date_of_birth: '',
    employment_type: '',
    gender: '',
    employee_status: '',
    emergency_contact_name: '',
    emergency_contact_number: '',
    address: '',
  });

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isEmpTypeDropdownOpen, setIsEmpTypeDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const employmentTypeOptions = [
    { value: 'permanent', label: 'Permanent' },
    { value: 'intern', label: 'Intern' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'in_active', label: 'Inactive' },
  ];

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0];
    }
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return '';
    }
  };

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchRolesAndDetails = async () => {
      try {
        setDetailsLoading(true);
        setRolesLoading(true);

        // Fetch roles
        const rolesResponse = await api.get(ROLE_ENDPOINTS.GET_ALL);
        if (rolesResponse.data && rolesResponse.data.data && Array.isArray(rolesResponse.data.data.roles)) {
          setRoles(rolesResponse.data.data.roles);
        }

        // Fetch employee details
        const detailsResponse = await api.get(EMPLOYEE_ENDPOINTS.DETAILS(employeeId));
        if (detailsResponse.data && detailsResponse.data.data && detailsResponse.data.data.employee) {
          const emp = detailsResponse.data.data.employee;
          setFormData({
            first_name: emp.first_name || '',
            last_name: emp.last_name || '',
            email: emp.email || '',
            phone_number: emp.phone_number || '',
            joining_date: formatDateForInput(emp.joining_date),
            role_id: emp.role_id || emp.role?.role_id || '',
            date_of_birth: formatDateForInput(emp.date_of_birth),
            employment_type: emp.employment_type || '',
            gender: emp.gender || '',
            employee_status: emp.employee_status || '',
            emergency_contact_name: emp.emergency_contact_name || '',
            emergency_contact_number: emp.emergency_contact_number || '',
            address: emp.address || '',
          });
        } else {
          toast.error('Failed to load employee details.');
          onClose();
        }
      } catch (err) {
        console.error('Error fetching employee edit details:', err);
        toast.error('Failed to load employee details. Please try again.');
        onClose();
      } finally {
        setDetailsLoading(false);
        setRolesLoading(false);
      }
    };

    fetchRolesAndDetails();
  }, [isOpen, employeeId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required Validations on UI
    if (!formData.first_name.trim()) {
      toast.error('First Name is required');
      return;
    }
    if (!formData.joining_date) {
      toast.error('Joining date is required');
      return;
    }
    if (!formData.role_id) {
      toast.error('Please select a role');
      return;
    }
    if (formData.phone_number.trim() && !/^\d{10}$/.test(formData.phone_number)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        address: formData.address.trim() || 'Not Provided',
        phone_number: formData.phone_number.trim() || '0000000000',
        joining_date: formData.joining_date,
        role_id: formData.role_id,
        employee_status: formData.employee_status || 'active',
      };

      if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
      if (formData.employment_type) payload.employment_type = formData.employment_type;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.emergency_contact_name.trim()) payload.emergency_contact_name = formData.emergency_contact_name.trim();
      if (formData.emergency_contact_number.trim()) payload.emergency_contact_number = formData.emergency_contact_number.trim();

      const response = await api.patch(EMPLOYEE_ENDPOINTS.UPDATE(employeeId), payload);
      if (response.status === 200) {
        toast.success(response.data?.message || 'Employee profile updated successfully');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error updating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRole = roles.find((r) => r.role_id === formData.role_id);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl shrink-0">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Edit Employee Profile</h3>
            <p className="text-xs text-slate-400">Update employee details. Fields marked with * are required.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {detailsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="animate-spin text-indigo-600" />
            <p className="text-sm text-slate-500 font-semibold">Loading employee profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-6 text-left">
            {/* Section: Personal Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3.5 pb-1 border-b border-slate-100">
                Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    placeholder="e.g. John"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    placeholder="e.g. Doe"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600">Gender</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={formData.gender ? "text-slate-800" : "text-slate-400"}>
                        {formData.gender
                          ? genderOptions.find(opt => opt.value === formData.gender)?.label
                          : 'Select gender...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isGenderDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isGenderDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsGenderDropdownOpen(false)} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1">
                          {genderOptions.map((opt) => {
                            const isSelected = opt.value === formData.gender;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, gender: opt.value }));
                                  setIsGenderDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                  }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Section: Employment Info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3.5 pb-1 border-b border-slate-100">
                Employment Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Email Address (Read-only)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled={true}
                    className="px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 focus:outline-none transition-colors cursor-not-allowed"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                  <input
                    type="text"
                    name="phone_number"
                    maxLength={10}
                    placeholder="e.g. 9876543210 (Optional)"
                    value={formData.phone_number}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setFormData((prev) => ({ ...prev, phone_number: val }));
                    }}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Joining Date *</label>
                  <input
                    type="date"
                    name="joining_date"
                    value={formData.joining_date}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-xs font-semibold text-slate-600">Employment Type</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && setIsEmpTypeDropdownOpen(!isEmpTypeDropdownOpen)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={formData.employment_type ? "text-slate-800" : "text-slate-400"}>
                        {formData.employment_type
                          ? employmentTypeOptions.find(opt => opt.value === formData.employment_type)?.label
                          : 'Select type...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isEmpTypeDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isEmpTypeDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsEmpTypeDropdownOpen(false)} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1">
                          {employmentTypeOptions.map((opt) => {
                            const isSelected = opt.value === formData.employment_type;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, employment_type: opt.value }));
                                  setIsEmpTypeDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                  }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 relative sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Assign Role *</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && !rolesLoading && setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                      disabled={submitting || rolesLoading}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={selectedRole ? "text-slate-800" : "text-slate-400"}>
                        {rolesLoading
                          ? 'Loading roles...'
                          : selectedRole
                            ? selectedRole.name
                            : 'Select a role...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isRoleDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isRoleDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)} />
                        <div className="absolute z-20 bottom-full mb-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-bottom-2 duration-150 py-1">
                          {roles.length === 0 ? (
                            <div className="px-4 py-2.5 text-xs text-slate-400 italic">No roles found</div>
                          ) : (
                            roles.map((role) => {
                              const isSelected = role.role_id === formData.role_id;
                              return (
                                <button
                                  key={role.role_id}
                                  type="button"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, role_id: role.role_id }));
                                    setIsRoleDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                  <span>{role.name}</span>
                                  {isSelected && <Check size={14} className="text-indigo-600" />}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 relative sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Employee Status</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => !submitting && setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                      disabled={submitting}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all duration-200 cursor-pointer disabled:opacity-60 text-left"
                    >
                      <span className={formData.employee_status ? "text-slate-800" : "text-slate-400"}>
                        {formData.employee_status
                          ? statusOptions.find(opt => opt.value === formData.employee_status)?.label
                          : 'Select status...'
                        }
                      </span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {isStatusDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsStatusDropdownOpen(false)} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white border border-slate-100 rounded-xl shadow-lg max-h-48 overflow-y-auto animate-in slide-in-from-top-2 duration-150 py-1">
                          {statusOptions.map((opt) => {
                            const isSelected = opt.value === formData.employee_status;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, employee_status: opt.value }));
                                  setIsStatusDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${isSelected
                                  ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                  }`}
                              >
                                <span>{opt.label}</span>
                                {isSelected && <Check size={14} className="text-indigo-600" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Additional Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3.5 pb-1 border-b border-slate-100">
                Additional Details & Emergency Contacts
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Address</label>
                  <textarea
                    name="address"
                    rows={2}
                    placeholder="Street name, City, State"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors resize-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    placeholder="e.g. Spouse, Parent Name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-600">Emergency Contact Number</label>
                  <input
                    type="text"
                    name="emergency_contact_number"
                    placeholder="Emergency phone number"
                    value={formData.emergency_contact_number}
                    onChange={handleChange}
                    disabled={submitting}
                    className="px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-3 mt-4 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rolesLoading}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEmployeeModal;
