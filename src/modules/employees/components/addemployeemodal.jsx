import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import api, { ROLE_ENDPOINTS, EMPLOYEE_ENDPOINTS } from '../../../services/api';
import toast from 'react-hot-toast';
import Select from '../../../components/ui/select';

const AddEmployeeModal = ({ isOpen, onClose, onSuccess }) => {
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
    emergency_contact_name: '',
    emergency_contact_number: '',
    address: '',
  });

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const employmentTypeOptions = [
    { value: 'permanent', label: 'Permanent' },
    { value: 'intern', label: 'Intern' },
  ];

  useEffect(() => {
    if (!isOpen) return;

    // Reset form data on open
    Promise.resolve().then(() => {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        joining_date: '',
        role_id: '',
        date_of_birth: '',
        employment_type: '',
        gender: '',
        emergency_contact_name: '',
        emergency_contact_number: '',
        address: '',
      });
    });

    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await api.get(ROLE_ENDPOINTS.GET_ALL);
        if (response.data && response.data.data && Array.isArray(response.data.data.roles)) {
          setRoles(response.data.data.roles);
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        toast.error('Failed to load roles. Please try again.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, [isOpen]);



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
    // if (!formData.last_name.trim()) {
    //   toast.error('Last Name is required');
    //   return;
    // }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
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

    // Optional phone validation (if user typed something)
    if (formData.phone_number.trim() && !/^\d{10}$/.test(formData.phone_number)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    let toastId;
    try {
      setSubmitting(true);
      toastId = toast.loading('Creating employee profile...');

      const payload = {
        email: formData.email.trim().toLowerCase(),
        address: formData.address.trim() || 'Not Provided',
        phone_number: formData.phone_number.trim() || '0000000000',
        joining_date: formData.joining_date,
        role_id: formData.role_id,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      };

      if (formData.date_of_birth) payload.date_of_birth = formData.date_of_birth;
      if (formData.employment_type) payload.employment_type = formData.employment_type;
      if (formData.gender) payload.gender = formData.gender;
      if (formData.emergency_contact_name.trim()) payload.emergency_contact_name = formData.emergency_contact_name.trim();
      if (formData.emergency_contact_number.trim()) payload.emergency_contact_number = formData.emergency_contact_number.trim();

      const response = await api.post(EMPLOYEE_ENDPOINTS.CREATE, payload);
      if (response.status === 201 || response.status === 200) {
        toast.success(response.data?.message || 'Employee created successfully', { id: toastId });
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error creating employee:', err);
      toast.error(err.response?.data?.message || 'Failed to create employee. Please try again.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh] transition-colors duration-300 z-10"
          >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20 rounded-t-2xl shrink-0 transition-colors duration-200">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Add New Employee</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">Fields marked with * are required.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-6 text-left">

          {/* Section: Personal Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              Personal Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="e.g. John"
                  value={formData.first_name}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="e.g. Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <Select
                label="Gender"
                value={formData.gender}
                options={genderOptions}
                onChange={(val) => setFormData((prev) => ({ ...prev, gender: val }))}
                placeholder="Select gender..."
                disabled={submitting}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Employment Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              Employment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.doe@crm.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number</label>
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
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Joining Date *</label>
                <input
                  type="date"
                  name="joining_date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <Select
                label="Employment Type"
                value={formData.employment_type}
                options={employmentTypeOptions}
                onChange={(val) => setFormData((prev) => ({ ...prev, employment_type: val }))}
                placeholder="Select type..."
                disabled={submitting}
              />
              <Select
                label="Assign Role"
                required
                value={formData.role_id}
                options={roles.map((role) => ({ value: role.role_id, label: role.name }))}
                onChange={(val) => setFormData((prev) => ({ ...prev, role_id: val }))}
                placeholder={rolesLoading ? 'Loading roles...' : 'Select a role...'}
                disabled={submitting || rolesLoading}
                position="top"
                className="sm:col-span-2"
              />
            </div>
          </div>

          {/* Section: Additional Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
              Additional Details & Emergency Contacts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  placeholder="Street name, City, State"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Emergency Contact Name</label>
                <input
                  type="text"
                  name="emergency_contact_name"
                  placeholder="e.g. Spouse, Parent Name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Emergency Contact Number</label>
                <input
                  type="text"
                  name="emergency_contact_number"
                  placeholder="Emergency phone number"
                  value={formData.emergency_contact_number}
                  onChange={handleChange}
                  disabled={submitting}
                  className="px-3.5 py-2.5 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 transition-colors"
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
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 transition-colors cursor-pointer"
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
                <span>Save Employee</span>
              )}
            </button>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddEmployeeModal;
