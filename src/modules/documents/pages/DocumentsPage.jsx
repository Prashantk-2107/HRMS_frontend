import React from 'react';
import { Folder, FileText, Upload } from 'lucide-react';

const DocumentsPage = () => {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Documents Vault</h1>
          <p className="text-sm text-slate-500">Access corporate policies, contracts, and upload payroll documents.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-sm transition-all">
          <Upload size={16} />
          <span>Upload File</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-4">Files & Folders</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 flex items-center gap-3 cursor-pointer transition-all">
            <Folder className="text-indigo-500" size={24} />
            <div>
              <span className="text-sm font-bold text-slate-800 block">HR Policies</span>
              <span className="text-[10px] text-slate-400">4 items • 12.4 MB</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 flex items-center gap-3 cursor-pointer transition-all">
            <Folder className="text-indigo-500" size={24} />
            <div>
              <span className="text-sm font-bold text-slate-800 block">Offer Letters</span>
              <span className="text-[10px] text-slate-400">12 items • 8.1 MB</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 flex items-center gap-3 cursor-pointer transition-all">
            <FileText className="text-indigo-500" size={24} />
            <div>
              <span className="text-sm font-bold text-slate-800 block">NDA Agreement.pdf</span>
              <span className="text-[10px] text-slate-400">1.2 MB • Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
