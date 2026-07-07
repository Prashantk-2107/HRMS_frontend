import React from 'react';
import { Settings } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500">Manage account information, dark mode, and security features.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <div>
              <span className="font-bold text-slate-800 text-sm block">Email Notifications</span>
              <span className="text-xs text-slate-400">Receive emails for salary credits, leaves, and approvals.</span>
            </div>
            <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <div>
              <span className="font-bold text-slate-800 text-sm block">Multi-Factor Authentication</span>
              <span className="text-xs text-slate-400">Enhance your account security with MFA codes.</span>
            </div>
            <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
