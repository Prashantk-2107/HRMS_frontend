import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, CheckCircle, XCircle } from 'lucide-react';

const PermissionsModal = ({ isOpen, onClose, role, allPermissions }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen || !role) return null;

  // Filter permissions based on search query
  const filteredPermissions = allPermissions.filter(p =>
    p.name.toLowerCase().replace(/_/g, ' ').includes(searchQuery.toLowerCase())
  );

  const isGranted = (permissionName) => {
    return role?.permissions?.some(p => p.name === permissionName);
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
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[80vh] z-10 text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {role.name} Permissions
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Showing granted and revoked privileges for this role.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white border border-slate-200/60 rounded-xl px-3 py-2 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-200">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder-slate-400 font-medium"
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
                          ? 'bg-emerald-50/20 border-emerald-100/50 hover:bg-emerald-50/30'
                          : 'bg-slate-50/30 border-slate-100 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex flex-col pr-4">
                        <span className="text-sm font-semibold text-slate-700 capitalize">
                          {p.name.replace(/:/g, ' - ').replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                          {p.name.split(':')[0]} module
                        </span>
                      </div>

                      <div className="flex-shrink-0">
                        {granted ? (
                          <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <CheckCircle size={10} className="text-emerald-500" />
                            Granted
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-rose-50/80 text-rose-600 border border-rose-100 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            <XCircle size={10} className="text-rose-500" />
                            Revoked
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-400 font-medium">No permissions found</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PermissionsModal;
