import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  User, Mail, Phone, MapPin, Building,
  Shield, Activity, Contact, CheckCircle2, UploadCloud,
  ClipboardCheck
} from 'lucide-react';
import { selectUser, updateUser } from '../../../store/slices/authSlice';
import api, { EMPLOYEE_ENDPOINTS } from '../../../services/api';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  // Local UI state
  const [isSaving, setIsSaving] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_number: ''
    }
  });

  // Watch names to show initials dynamically in the avatar preview
  const watchFirstName = watch('first_name', '');
  const watchLastName = watch('last_name', '');

  // Sync state with current user data
  useEffect(() => {
    if (currentUser) {
      reset({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        phone_number: currentUser.phone_number || '',
        address: currentUser.address || '',
        emergency_contact_name: currentUser.emergency_contact_name || '',
        emergency_contact_number: currentUser.emergency_contact_number || ''
      });
      setProfileImagePreview(currentUser.profile_image || null);
    }
  }, [currentUser, reset]);

  const handleCancel = () => {
    if (currentUser) {
      reset({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        phone_number: currentUser.phone_number || '',
        address: currentUser.address || '',
        emergency_contact_name: currentUser.emergency_contact_name || '',
        emergency_contact_number: currentUser.emergency_contact_number || ''
      });
      setProfileImagePreview(currentUser.profile_image || null);
      toast.success('Form reset to saved profile data');
    }
  };

  const onSubmit = async (data) => {
    setIsSaving(true);
    const toastId = toast.loading('Saving changes...');

    try {
      const response = await api.patch(EMPLOYEE_ENDPOINTS.UPDATE_ME, {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        phone_number: data.phone_number.trim(),
        address: data.address.trim(),
        emergency_contact_name: data.emergency_contact_name.trim() || null,
        emergency_contact_number: data.emergency_contact_number.trim() || null,
      });

      if (response.data.success) {
        // Update Redux state and localStorage
        const updatedEmp = response.data?.data?.employee;
        dispatch(updateUser(updatedEmp));
        toast.success('Profile updated successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Failed to update profile', { id: toastId });
      }
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const uploadPhotoFile = async (file) => {
    // Immediately show preview
    const localUrl = URL.createObjectURL(file);
    setProfileImagePreview(localUrl);

    const toastId = toast.loading('Uploading profile photo...');
    const formData = new FormData();
    formData.append('profile_image', file);

    try {
      const response = await api.patch(EMPLOYEE_ENDPOINTS.UPLOAD_PHOTO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const updatedEmp = response.data?.data?.employee;
        dispatch(updateUser(updatedEmp));
        toast.success('Profile photo updated successfully!', { id: toastId });
      } else {
        toast.error(response.data.message || 'Failed to upload photo', { id: toastId });
        setProfileImagePreview(currentUser?.profile_image || null);
      }
    } catch (err) {
      console.error('Photo upload error:', err);
      toast.error(err.response?.data?.message || 'Failed to upload photo', { id: toastId });
      setProfileImagePreview(currentUser?.profile_image || null);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadPhotoFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        await uploadPhotoFile(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 text-left py-2 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update your photo & personal details here...</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 bg-white dark:bg-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shadow-indigo-600/10 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Box */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-6 transition-colors duration-200">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-50 dark:border-slate-800 pb-3 flex items-center gap-2 transition-colors">
            <ClipboardCheck size={18} className="text-indigo-600 dark:text-indigo-400" /> Personal Details
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">First Name *</label>
                <div className={`flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                  errors.first_name 
                    ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                    : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
                }`}>
                  <User size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Enter first name"
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    {...register('first_name', {
                      required: 'First name is required',
                      maxLength: { value: 100, message: 'First name cannot exceed 100 characters' }
                    })}
                  />
                </div>
                {errors.first_name && (
                  <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.first_name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Last Name</label>
                <div className={`flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                  errors.last_name 
                    ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                    : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
                }`}>
                  <User size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Enter last name"
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    {...register('last_name', {
                      maxLength: { value: 100, message: 'Last name cannot exceed 100 characters' }
                    })}
                  />
                </div>
                {errors.last_name && (
                  <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.last_name.message}</span>
                )}
              </div>
            </div>

            {/* Row 2: Title / Role & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Title / Role (Read-only)</label>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400 select-none transition-colors duration-200">
                  <Shield size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-sm font-semibold capitalize">
                    {currentUser?.role?.name?.replace(/_/g, ' ') || 'Employee'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Phone Number *</label>
                <div className={`flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                  errors.phone_number 
                    ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                    : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
                }`}>
                  <Phone size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="10-digit mobile number"
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    {...register('phone_number', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{10}$/,
                        message: 'Phone number must be exactly 10 digits'
                      }
                    })}
                  />
                </div>
                {errors.phone_number && (
                  <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.phone_number.message}</span>
                )}
              </div>
            </div>

            {/* Row 3: Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Email Address (Read-only)</label>
              <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-500 dark:text-slate-400 select-none transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <span className="text-sm font-medium">{currentUser?.email}</span>
                </div>
                {currentUser?.is_email_verified && (
                  <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide">
                    <CheckCircle2 size={10} className="text-emerald-500" /> Verified
                  </span>
                )}
              </div>
            </div>

            {/* Row 4: Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Address</label>
              <div className={`flex items-start gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                errors.address 
                  ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                  : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
              }`}>
                <MapPin size={16} className="text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
                <textarea
                  disabled={isSaving}
                  rows={2}
                  placeholder="HQ Office, New Delhi"
                  className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium resize-none"
                  {...register('address', {
                    required: 'Address is required',
                    minLength: { value: 1, message: 'Address cannot be empty' }
                  })}
                />
              </div>
              {errors.address && (
                <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.address.message}</span>
              )}
            </div>

            {/* Row 5: Emergency Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Emergency Contact Name</label>
                <div className={`flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                  errors.emergency_contact_name 
                    ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                    : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
                }`}>
                  <Contact size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Emergency contact name"
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    {...register('emergency_contact_name', {
                      maxLength: { value: 255, message: 'Name cannot exceed 255 characters' }
                    })}
                  />
                </div>
                {errors.emergency_contact_name && (
                  <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.emergency_contact_name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Emergency Phone Number</label>
                <div className={`flex items-center gap-2 bg-slate-50/50 dark:bg-slate-950/40 border rounded-xl px-3 py-2.5 transition-all duration-200 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:bg-white dark:focus-within:bg-slate-950 ${
                  errors.emergency_contact_number 
                    ? 'border-rose-500 focus-within:border-rose-500 focus-within:ring-rose-500' 
                    : 'border-slate-200/80 dark:border-slate-800 focus-within:border-indigo-500'
                }`}>
                  <Phone size={16} className="text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  <input
                    type="text"
                    disabled={isSaving}
                    placeholder="Emergency mobile number"
                    className="bg-transparent text-sm text-slate-800 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                    {...register('emergency_contact_number', {
                      validate: (val) => {
                        if (!val) return true;
                        return /^\d{10}$/.test(val) || 'Emergency number must be exactly 10 digits';
                      }
                    })}
                  />
                </div>
                {errors.emergency_contact_number && (
                  <span className="text-[10px] text-rose-500 font-semibold px-1">{errors.emergency_contact_number.message}</span>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Metadata/Image Box */}
        <div className="space-y-6 lg:col-span-1">
          {/* Profile Picture Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100/80 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center transition-colors duration-200">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 w-full pb-3 border-b border-slate-50 dark:border-slate-800 mb-5 text-left">
              Profile Picture
            </h3>

            {/* Image Preview Container */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full border-4 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-center overflow-hidden mb-6 transition-all duration-200 group-hover:border-indigo-100 dark:group-hover:border-indigo-900/60">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-indigo-600 dark:text-indigo-400 font-black text-3xl select-none">
                    {(watchFirstName[0] || '').toUpperCase()}
                    {(watchLastName[0] || '').toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Drag & Drop Card Container */}
            <div
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 scale-[1.02] shadow-inner'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-slate-50/20 dark:bg-slate-950/10'
              }`}
            >
              <label className="flex flex-col items-center cursor-pointer gap-2">
                <UploadCloud size={28} className="text-indigo-500" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Drag a photo here</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase">or</span>
                <span className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all shadow-sm">
                  Upload Photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* System Properties Card (Read-only) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100/80 dark:border-slate-800 shadow-sm p-6 space-y-4 transition-colors duration-200">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800 flex items-center gap-1.5 text-left">
              <Building size={16} className="text-indigo-600 dark:text-indigo-400" /> Job Details
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Employee Code</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{currentUser?.empCode}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Joining Date</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {currentUser?.joining_date ? new Date(currentUser.joining_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Employment Type</span>
                <span className="text-slate-700 dark:text-slate-300 font-bold capitalize bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/60 px-2 py-0.5 rounded-full text-[10px]">
                  {currentUser?.employment_type || 'permanent'}
                </span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Gender</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold capitalize">{currentUser?.gender || 'male'}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Status</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  <Activity size={10} /> {currentUser?.employee_status || 'active'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
