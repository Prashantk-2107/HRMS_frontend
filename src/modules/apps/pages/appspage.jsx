import { Grid, Plus } from 'lucide-react';

const AppsPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Apps & Integrations</h1>
        <p className="text-sm text-slate-500">Connect third-party plugins, calendar sync, and mail services.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-5 border border-slate-100 rounded-3xl flex flex-col justify-between h-40">
            <div>
              <span className="font-bold text-slate-800">Google Calendar</span>
              <p className="text-xs text-slate-500 mt-2">Sync holidays and leaves dynamically to your personal calendar.</p>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">Configure</button>
          </div>
          <div className="p-5 border border-slate-100 rounded-3xl flex flex-col justify-between h-40">
            <div>
              <span className="font-bold text-slate-800">Slack Notifications</span>
              <p className="text-xs text-slate-500 mt-2">Send daily logs and check-in statuses to your Slack workspace.</p>
            </div>
            <button className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer">Configure</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppsPage;
