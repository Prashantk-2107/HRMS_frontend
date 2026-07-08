
const LeavesPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leaves Management</h1>
        <p className="text-sm text-slate-500">Apply for time-off and track your leave balance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Casual Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 mt-2 block">8 / 12 Days</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Medical Leave</span>
          <span className="text-3xl font-extrabold text-slate-800 mt-2 block">4 / 6 Days</span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Maternity/Paternity</span>
          <span className="text-3xl font-extrabold text-slate-800 mt-2 block">30 / 30 Days</span>
        </div>
      </div>
    </div>
  );
};

export default LeavesPage;
