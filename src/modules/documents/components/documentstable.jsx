import { 
  Folder, 
  Eye, 
  Download, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

import { DOCUMENT_TYPES } from '../constants/documenttypes';

const DocumentsTable = ({
  documents = [],
  canVerify,
  canDelete,
  allDocsLoading,
  handleDownload,
  setSelectedDocToVerify,
  setVerifyStatus,
  setIsVerifyOpen,
  setDocToDelete,
  paginationMeta,
  docsPage,
  docsLimit,
  setDocsPage,
  setDocsLimit
}) => {
  if (allDocsLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200 animate-pulse text-left">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-4 px-6 w-3/12 min-w-[180px]">Employee</th>
                <th className="py-4 px-6 w-3/12 min-w-[160px]">Document Info</th>
                <th className="py-4 px-6 w-3/12 min-w-[160px]">Uploaded Details</th>
                <th className="py-4 px-6 w-1/12 min-w-[100px]">Status</th>
                <th className="py-4 px-6 text-right w-2/12 min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {Array.from({ length: docsLimit || 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-1.5">
                        <div className="w-24 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="w-32 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <div className="w-28 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="w-16 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <div className="w-20 h-3 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="w-24 h-2.5 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-800" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800" />
                      <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm p-12 text-center flex flex-col items-center justify-center transition-colors">
        <Folder className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">No documents found</h3>
        <p className="text-sm text-slate-400 dark:text-slate-550 max-w-sm">No employee documents match your current filter parameters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200 text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/30 border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-4 px-6 w-3/12 min-w-[180px]">Employee</th>
              <th className="py-4 px-6 w-3/12 min-w-[160px]">Document Info</th>
              <th className="py-4 px-6 w-3/12 min-w-[160px]">Uploaded Details</th>
              <th className="py-4 px-6 w-1/12 min-w-[100px]">Status</th>
              <th className="py-4 px-6 text-right w-2/12 min-w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60 text-sm font-medium text-slate-700 dark:text-slate-300">
            {documents.map((doc) => {
              const docTypeObj = DOCUMENT_TYPES.find(t => t.key === doc.document_type);
              return (
                <tr key={doc.document_id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/50 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs select-none">
                        {doc.employee?.profile_image ? (
                          <img src={doc.employee.profile_image} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span>
                            {(doc.employee?.first_name?.[0] || '').toUpperCase()}
                            {(doc.employee?.last_name?.[0] || '').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 block text-xs">
                          {doc.employee?.first_name} {doc.employee?.last_name}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 block font-bold uppercase">
                          {doc.employee?.empCode || 'N/A'} • {doc.employee?.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-100 block text-xs">
                        {docTypeObj?.label || doc.document_type}
                      </span>
                      {doc.document_number && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">
                          Num: {doc.document_number}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="text-slate-600 dark:text-slate-300 block text-xs">
                        {new Date(doc.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {doc.uploader && (
                        <span className="text-[10px] text-slate-400 dark:text-slate-550 block">
                          By: {doc.uploader.first_name} {doc.uploader.last_name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col items-start gap-1">
                      <span
                        className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${doc.verification_status === 'verified'
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                          : doc.verification_status === 'rejected'
                            ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                        }`}
                      >
                        {doc.verification_status === 'verified' && <CheckCircle2 size={10} />}
                        {doc.verification_status === 'rejected' && <XCircle size={10} />}
                        {doc.verification_status === 'pending' && <Clock size={10} />}
                        <span className="capitalize">{doc.verification_status}</span>
                      </span>
                      {doc.verification_status === 'rejected' && doc.rejection_reason && (
                        <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold max-w-[200px] truncate" title={doc.rejection_reason}>
                          Reason: {doc.rejection_reason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => window.open(doc.file_url, '_blank')}
                        title="View File"
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-700 transition-all duration-150 cursor-pointer active:scale-90"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownload(doc.document_id, doc.document_name, doc.document_type)}
                        title="Download File"
                        className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-100 border border-slate-200/60 dark:border-slate-700 transition-all duration-150 cursor-pointer active:scale-90"
                      >
                        <Download size={14} />
                      </button>

                      {canVerify && doc.verification_status === 'pending' && (
                        <button
                          onClick={() => {
                            setSelectedDocToVerify(doc);
                            setVerifyStatus('verified');
                            setIsVerifyOpen(true);
                          }}
                          title="Verify Document"
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 transition-all duration-150 cursor-pointer active:scale-90"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}

                      {canDelete && (
                        <button
                          onClick={() => setDocToDelete(doc)}
                          title="Delete Document"
                          className="p-2 bg-rose-50/10 dark:bg-rose-950/5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:text-rose-700 border border-rose-200 dark:border-rose-500/50 rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Premium Pagination Footer */}
      {paginationMeta && paginationMeta.totalItems > 0 && (
        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min((docsPage - 1) * docsLimit + 1, paginationMeta.totalItems)}</span> to{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(docsPage * docsLimit, paginationMeta.totalItems)}</span> of{' '}
            <span className="font-bold text-slate-800 dark:text-slate-200">{paginationMeta.totalItems}</span> documents
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Per Page</span>
              <select
                value={docsLimit}
                onChange={(e) => {
                  setDocsLimit(Number(e.target.value));
                  setDocsPage(1);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer shadow-sm"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} rows
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDocsPage(docsPage - 1)}
                disabled={!paginationMeta.hasPreviousPage}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-55 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: paginationMeta.totalPages }, (_, index) => {
                const pageNum = index + 1;
                const isSelected = pageNum === docsPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setDocsPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${isSelected
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/10'
                      : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-55 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setDocsPage(docsPage + 1)}
                disabled={!paginationMeta.hasNextPage}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-slate-55 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all duration-200"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTable;
