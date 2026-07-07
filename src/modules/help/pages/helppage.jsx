import React from 'react';
import { HelpCircle } from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Help & Support</h1>
        <p className="text-sm text-slate-500">Contact administrators, read user documentation, or file tickets.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-slate-800">Frequently Asked Questions</h3>
        <div className="flex flex-col gap-4 mt-2">
          <div>
            <span className="font-bold text-sm text-slate-700 block">How do I view my salary slips?</span>
            <p className="text-xs text-slate-500 mt-1">Navigate to the Payroll section and view linked accounts to see transaction receipts.</p>
          </div>
          <div>
            <span className="font-bold text-sm text-slate-700 block">Who do I contact for role change requests?</span>
            <p className="text-xs text-slate-500 mt-1">Please raise a request to your assigned HR manager who holds role-editing privileges.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
