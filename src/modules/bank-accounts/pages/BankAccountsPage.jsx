import React from 'react';
import { Landmark, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

const BankAccountsPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header action panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bank Accounts</h1>
          <p className="text-sm text-slate-500">Link, view, and manage your corporate payroll accounts.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-md shadow-indigo-600/10">
          <Plus size={16} />
          <span>Link New Account</span>
        </button>
      </div>

      {/* Grid of Bank Card Mockups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: HDFC Bank */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 text-white p-6 rounded-3xl border border-blue-850 shadow-xl relative overflow-hidden flex flex-col justify-between h-52 group hover:scale-[1.01] transition-all duration-200">
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-widest block">Primary Payroll Account</span>
              <h3 className="text-lg font-bold mt-1">HDFC Bank Ltd.</h3>
            </div>
            <Landmark size={24} className="text-blue-300" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-widest font-mono">•••• •••• •••• 8845</div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <span className="text-[10px] text-blue-300 uppercase font-semibold block tracking-wider">Account Balance</span>
                <span className="text-xl font-extrabold font-mono">₹1,45,200.00</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> Active
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: ICICI Bank */}
        <div className="bg-gradient-to-br from-amber-800 via-orange-950 to-stone-950 text-white p-6 rounded-3xl border border-amber-900 shadow-xl relative overflow-hidden flex flex-col justify-between h-52 group hover:scale-[1.01] transition-all duration-200">
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-amber-200 font-bold uppercase tracking-widest block">Secondary Savings Account</span>
              <h3 className="text-lg font-bold mt-1">ICICI Bank Ltd.</h3>
            </div>
            <Landmark size={24} className="text-amber-300" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-widest font-mono">•••• •••• •••• 9210</div>
            <div className="flex justify-between items-end mt-4">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-semibold block tracking-wider">Account Balance</span>
                <span className="text-xl font-extrabold font-mono">₹89,450.50</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck size={10} /> Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Mockup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="font-bold text-slate-800 mb-4">Recent Transaction History</h3>
        
        <div className="flex flex-col divide-y divide-slate-100">
          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Salary Credited</h4>
                <span className="text-xs text-slate-400">June 28, 2026 at 10:15 AM</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-emerald-600 font-mono">+₹75,000.00</span>
              <span className="text-xs text-slate-400 block">HDFC Bank</span>
            </div>
          </div>

          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Internet Bill Payment</h4>
                <span className="text-xs text-slate-400">June 25, 2026 at 4:30 PM</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-slate-700 font-mono">-₹1,199.00</span>
              <span className="text-xs text-slate-400 block">ICICI Bank</span>
            </div>
          </div>

          <div className="py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                <ArrowUpRight size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">Gym Membership</h4>
                <span className="text-xs text-slate-400">June 10, 2026 at 9:00 AM</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-slate-700 font-mono">-₹3,000.00</span>
              <span className="text-xs text-slate-400 block">HDFC Bank</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountsPage;
