import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

const PermissionsModal = ({ isOpen, onClose, role, allPermissions, onTogglePermission, isUpdating }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmData, setConfirmData] = useState(null);

  if (!isOpen || !role) return null;

  // Filter permissions based on search query
  const filteredPermissions = allPermissions.filter(p =>
    p.name.toLowerCase().replace(/_/g, ' ').includes(searchQuery.toLowerCase())
  );

  const isGranted = (permissionName) => {
    return role?.permissions?.some(p => p.name === permissionName);
  };

  const handleConfirmAction = async () => {
    if (confirmData) {
      await onTogglePermission(
        confirmData.roleId,
        confirmData.permissionId,
        confirmData.isGranted
      );
      setConfirmData(null);
    }
  };

  return (
    <>
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
              className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh] z-10 text-left transition-colors duration-300"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start flex-shrink-0 transition-colors duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {role.name} Permissions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Showing granted and revoked privileges for this role. Click a status badge to toggle.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 transition-colors duration-200">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-xl px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                  <Search size={16} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-slate-700 dark:text-slate-200 outline-none w-full placeholder-slate-400 dark:placeholder-slate-500 font-medium"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-3">
                {filteredPermissions.length > 0 ? (
                  filteredPermissions.map((p, idx) => {
                    const granted = isGranted(p.name);
                    return (
                      <div
                        key={p.id || idx}
                        className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                          granted
                            ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100/50 dark:border-emerald-900/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20'
                            : 'bg-slate-50/30 dark:bg-slate-950/10 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-950/25'
                        }`}
                      >
                        <div className="flex flex-col pr-4">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                            {p.name.replace(/:/g, ' - ').replace(/_/g, ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                            {p.name.split(':')[0]} module
                          </span>
                        </div>

                        <div className="flex-shrink-0">
                          <button
                            disabled={isUpdating}
                            onClick={() => setConfirmData({
                              roleId: role.role_id,
                              permissionId: p.permission_id,
                              isGranted: !granted,
                              permissionName: p.name,
                              roleName: role.name
                            })}
                            className={`flex items-center outline-none select-none transition-all duration-150 active:scale-95 cursor-pointer ${
                              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {granted ? (
                              <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 border border-emerald-200 dark:border-emerald-900/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-all">
                                <CheckCircle size={10} className="text-emerald-500" />
                                Granted
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 border border-rose-200 dark:border-rose-900/40 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-all">
                                <XCircle size={10} className="text-rose-500" />
                                Revoked
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">No permissions found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Themed Confirmation Modal */}
      <AnimatePresence>
        {confirmData && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Dark overlay for confirmation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmData(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Confirmation Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', duration: 0.25 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 z-10 flex flex-col items-center text-center transition-colors duration-300"
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                confirmData.isGranted 
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                  : 'bg-rose-50/80 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'
              }`}>
                <ShieldAlert size={24} />
              </div>

              {/* Title & Desc */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                {confirmData.isGranted ? 'Grant' : 'Revoke'} Permission?
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Are you sure you want to {confirmData.isGranted ? 'grant' : 'revoke'} the{' '}
                <span className="font-semibold text-slate-750 dark:text-slate-200">
                  "{confirmData.permissionName.replace(/:/g, ' - ').replace(/_/g, ' ')}"
                </span>{' '}
                permission for{' '}
                <span className="font-semibold text-slate-750 dark:text-slate-200">"{confirmData.roleName}"</span>?
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full mt-6">
                <button
                  onClick={() => setConfirmData(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 py-2.5 rounded-xl text-white font-semibold text-xs transition-all duration-150 cursor-pointer active:scale-95 shadow-sm ${
                    confirmData.isGranted
                      ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PermissionsModal;
