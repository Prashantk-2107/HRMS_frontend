import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { X, Loader2, Image } from 'lucide-react';
import api from '../../../services/api';
import { DOCUMENT_TYPES } from '../constants/documenttypes';

const UploadDocumentModal = ({
  isOpen,
  onClose,
  currentUser,
  canUpload,
  activeTab,
  employees = [],
  initialDocType = 'aadhar',
  initialEmpId = '',
  onSuccess
}) => {
  const queryClient = useQueryClient();
  const [uploadEmpId, setUploadEmpId] = useState(initialEmpId);
  const [uploadDocType, setUploadDocType] = useState(initialDocType);
  const [uploadDocNumber, setUploadDocNumber] = useState('');
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setUploadEmpId(initialEmpId || currentUser?.emp_id || '');
        setUploadDocType(initialDocType || 'aadhar');
        setUploadDocName('');
        setUploadDocNumber('');
        setUploadFile(null);
      });
    }
  }, [isOpen, initialEmpId, initialDocType, currentUser]);

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Uploading document...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message || 'Document uploaded successfully!', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      queryClient.invalidateQueries({ queryKey: ['all-documents'] });
      onSuccess?.();
      onClose();
    },
    onError: (err, variables, context) => {
      const errorMsg = err.response?.data?.message || 'Upload failed. Please try again.';
      toast.error(errorMsg, { id: context.toastId });
    }
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed!');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed!');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error('Please select a file to upload.');
      return;
    }

    const targetEmpId = (canUpload && activeTab === 'all-docs') ? (uploadEmpId || currentUser?.emp_id) : currentUser?.emp_id;

    if (!targetEmpId) {
      toast.error('Target employee is required.');
      return;
    }

    const formData = new FormData();
    formData.append('emp_id', targetEmpId);
    formData.append('document_type', uploadDocType);
    formData.append('document_name', uploadDocName.trim() || DOCUMENT_TYPES.find(d => d.key === uploadDocType)?.label);
    if (uploadDocNumber.trim()) {
      formData.append('document_number', uploadDocNumber.trim());
    }
    formData.append('document', uploadFile);

    uploadMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-lg w-full overflow-hidden transition-colors duration-200"
      >
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-5-0 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Upload Document</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
          {/* Employee Selector (HR/Admin only and only when on all-docs tab) */}
          {canUpload && activeTab === 'all-docs' ? (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Employee *</label>
              <select
                value={uploadEmpId}
                onChange={(e) => setUploadEmpId(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all dark:bg-slate-900"
              >
                <option value="" className="dark:bg-slate-900 dark:text-slate-150">Select Employee...</option>
                {employees.map((emp) => (
                  <option key={emp.emp_id} value={emp.emp_id} className="dark:bg-slate-900 dark:text-slate-150">
                    {emp.first_name} {emp.last_name} ({emp.empCode})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Employee</label>
              <div className="w-full bg-slate-100 dark:bg-slate-950/30 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {currentUser?.first_name} {currentUser?.last_name} ({currentUser?.empCode})
              </div>
            </div>
          )}

          {/* Document Type Selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Document Type *</label>
            <select
              value={uploadDocType}
              onChange={(e) => setUploadDocType(e.target.value)}
              required
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all dark:bg-slate-900"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t.key} value={t.key} className="dark:bg-slate-900 dark:text-slate-150">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Document Number */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Document Number / ID</label>
            <input
              type="text"
              placeholder="Enter document number (optional)"
              value={uploadDocNumber}
              onChange={(e) => setUploadDocNumber(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Custom Document Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Document Display Name</label>
            <input
              type="text"
              placeholder="e.g. Prashant Aadhaar Card (optional)"
              value={uploadDocName}
              onChange={(e) => setUploadDocName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* File Upload Area */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Attach File *</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-5 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isDragging
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-slate-50/30 dark:bg-slate-950/10'
              }`}
            >
              <label className="flex flex-col items-center gap-1.5 w-full h-full cursor-pointer">
                <Image size={32} className="text-indigo-500 mb-1" />
                {uploadFile ? (
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block max-w-[250px] truncate">
                      {uploadFile.name}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">
                      {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Drag & drop files or click here</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Max limit: 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-50 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-55 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer bg-white dark:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadMutation.isPending}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm shadow-indigo-600/10 flex items-center gap-1.5 disabled:opacity-60"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadDocumentModal;
