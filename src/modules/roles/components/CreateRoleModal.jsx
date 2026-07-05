import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldPlus } from 'lucide-react';

const CreateRoleModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Role name is required.');
      return;
    }

    onSubmit({ name: trimmedName, description: description.trim() });
    
    // Reset state only on submission transition
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setError('');
    onClose();
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
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col z-10 text-left transition-colors duration-300"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start transition-colors duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <ShieldPlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    Create New Role
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Define access roles for your organization structure.
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {error}
                </div>
              )}

              {/* Role Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Role Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CCE, Content Moderator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all duration-200 font-medium placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Description
                </label>
                <textarea
                  placeholder="Describe the duties or access scope of this role..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 outline-none transition-all duration-200 font-medium placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-50 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 shadow-sm shadow-indigo-600/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Role</span>
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

export default CreateRoleModal;
