import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, logout } from '../../../store/slices/authSlice.js';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const {
    user,
    accessToken,
    refreshToken,
    permissions,
    role,
    isAuthenticated,
    isLoading
  } = useSelector(selectAuth);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">

        <header className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Redux Store Viewer</p>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-550 hover:bg-red-600 active:scale-[0.98] text-white font-medium text-sm py-2 px-4 rounded-lg transition-all duration-200 cursor-pointer shadow-sm"
            style={{ backgroundColor: '#ef4444' }}
          >
            Logout
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 text-left transition-colors duration-200">
            <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">User Information</h2>
            {user ? (
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Name</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.first_name + ' ' + user.last_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Email</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Raw User Object</span>
                  <pre className="text-xs bg-slate-50 dark:bg-slate-950 p-3 rounded-lg overflow-x-auto text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 mt-1 max-h-40">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <span className="text-sm text-slate-500">No user data stored.</span>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 text-left transition-colors duration-200">
            <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Session Details</h2>
            <div className="flex flex-col gap-2">
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Authentication Status</span>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 
                  ${isAuthenticated ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'}`}>
                  {isAuthenticated ? 'Authenticated' : 'Guest'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Loading Status</span>
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{isLoading ? 'Loading' : 'Idle'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Access Token</span>
                <span className="text-xs font-mono break-all text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 block mt-1">
                  {accessToken || 'None'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 dark:text-slate-500 block">Refresh Token</span>
                <span className="text-xs font-mono break-all text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 block mt-1">
                  {refreshToken || 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 text-left transition-colors duration-200">
          <h2 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Roles & Permissions</h2>
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">User Role</span>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {role && typeof role === 'object' ? (role.name || role.title || JSON.stringify(role)) : (role || 'No role assigned')}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block">Permissions Array</span>
              {permissions && permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {permissions.map((permission, index) => (
                    <span
                      key={index}
                      className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-xs font-medium px-2.5 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/60"
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
