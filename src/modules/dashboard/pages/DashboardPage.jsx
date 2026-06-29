import React from 'react';
import { useAuthStore } from '../../../store/auth.store.js';

const DashboardPage = () => {
  const {
    user,
    accessToken,
    refreshToken,
    permissions,
    role,
    isAuthenticated,
    isLoading,
    logout
  } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        <header className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-xs text-slate-500">Zustand Store Viewer</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-550 hover:bg-red-600 active:scale-[0.98] text-white font-medium text-sm py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
            style={{ backgroundColor: '#ef4444' }}
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">User Information</h2>
            {user ? (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-xs text-slate-400 block">Name</span>
                  <span className="text-sm font-semibold text-slate-800">{user.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Email</span>
                  <span className="text-sm font-semibold text-slate-800">{user.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Raw User Object</span>
                  <pre className="text-xs bg-slate-50 p-3 rounded-lg overflow-x-auto text-slate-600 border border-slate-200 mt-1 max-h-40">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <span className="text-sm text-slate-500">No user data stored.</span>
            )}
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Session Details</h2>
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-xs text-slate-400 block">Authentication Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 
                  ${isAuthenticated ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {isAuthenticated ? 'Authenticated' : 'Guest'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Loading Status</span>
                <span className="text-sm font-semibold text-slate-800">{isLoading ? 'Loading' : 'Idle'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Access Token</span>
                <span className="text-xs font-mono break-all text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 block mt-1">
                  {accessToken || 'None'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Refresh Token</span>
                <span className="text-xs font-mono break-all text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 block mt-1">
                  {refreshToken || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-4 text-left">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Roles & Permissions</h2>
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-slate-400 block">User Role</span>
              <span className="text-sm font-semibold text-slate-800">
                {role && typeof role === 'object' ? (role.name || role.title || JSON.stringify(role)) : (role || 'No role assigned')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Permissions Array</span>
              {permissions && permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-md border border-indigo-100"
                    >
                      {permission && typeof permission === 'object' ? (permission.name || permission.title || JSON.stringify(permission)) : permission}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs text-slate-500 italic block mt-1">No permissions listed</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
