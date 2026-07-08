import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Plus,
  Loader2,
  AlertTriangle,
  X,
  ArrowUpDown
} from 'lucide-react';
import api from '../../../services/api';
import { selectUser } from '../../../store/slices/authslice';
import { usePermission } from '../../../hooks/usepermission';
import { PERMISSIONS } from '../../../constants/permissions';
import UploadDocumentModal from '../components/uploaddocumentmodal';
import DocumentsTable from '../components/documentstable';
import { DOCUMENT_TYPES } from '../constants/documenttypes';

const DocumentsPage = () => {
  const queryClient = useQueryClient();
  const currentUser = useSelector(selectUser);

  // Permissions checks
  const { hasPermission } = usePermission();
  const canViewAll = hasPermission(PERMISSIONS.EMP_VIEW_DOCUMENTS);
  const canUpload = hasPermission(PERMISSIONS.EMP_ADD_DOCUMENTS);
  const canVerify = hasPermission(PERMISSIONS.EMP_VERIFY_DOCUMENTS);
  const canDelete = hasPermission(PERMISSIONS.EMP_REMOVE_DOCUMENTS);

  // Local state
  const [activeTab, setActiveTab] = useState(() => (canViewAll ? 'all-docs' : 'my-docs'));

  // Search & Filters for All Documents
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc' by created_at

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadEmpId, setUploadEmpId] = useState('');
  const [uploadDocType, setUploadDocType] = useState('aadhar');

  // Verification Modal State
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedDocToVerify, setSelectedDocToVerify] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('verified');
  const [rejectionReason, setRejectionReason] = useState('');

  // Delete Confirmation State
  const [docToDelete, setDocToDelete] = useState(null);

  // Queries
  // 1. Get my documents
  const { data: myDocs = [], isLoading: myDocsLoading } = useQuery({
    queryKey: ['my-documents'],
    queryFn: async () => {
      const response = await api.get('/documents/my-documents');
      return response.data?.data?.documents || [];
    }
  });

  // Pagination states for all-documents
  const [docsPage, setDocsPage] = useState(1);
  const [docsLimit, setDocsLimit] = useState(10);

  // 2. Get all documents (only enabled if user has view permission)
  const { data: allDocsResponse, isLoading: allDocsLoading } = useQuery({
    queryKey: ['all-documents', docsPage, docsLimit, searchQuery, statusFilter, typeFilter],
    queryFn: async () => {
      const response = await api.get('/documents/all-documents', {
        params: {
          page: docsPage,
          limit: docsLimit,
          search: searchQuery,
          status: statusFilter,
          type: typeFilter
        }
      });
      return response.data?.data || { documents: [], pagination: {} };
    },
    enabled: !!canViewAll
  });

  const allDocs = useMemo(() => allDocsResponse?.documents || [], [allDocsResponse]);
  const paginationMeta = allDocsResponse?.pagination || {
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  // 3. Get employees (only enabled if user can upload documents)
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/employee/get-all-emp');
      return response.data?.data?.employees || [];
    },
    enabled: !!canUpload
  });



  // 2. Verify Mutation
  const verifyMutation = useMutation({
    mutationFn: async ({ document_id, status, rejection_reason }) => {
      const response = await api.patch(`/documents/${document_id}/verify`, {
        status,
        rejection_reason: status === 'rejected' ? rejection_reason : undefined
      });
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Updating verification status...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message || 'Verification status updated successfully!', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['all-documents'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      setIsVerifyOpen(false);
      setSelectedDocToVerify(null);
      setRejectionReason('');
    },
    onError: (err, variables, context) => {
      const errorMsg = err.response?.data?.message || 'Failed to update verification status.';
      toast.error(errorMsg, { id: context.toastId });
    }
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (document_id) => {
      const response = await api.delete(`/documents/delete/${document_id}`);
      return response.data;
    },
    onMutate: () => {
      const toastId = toast.loading('Deleting document...');
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success(data?.message || 'Document deleted successfully!', { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ['all-documents'] });
      queryClient.invalidateQueries({ queryKey: ['my-documents'] });
      setDocToDelete(null);
    },
    onError: (err, variables, context) => {
      const errorMsg = err.response?.data?.message || 'Failed to delete document.';
      toast.error(errorMsg, { id: context.toastId });
    }
  });

  // Proxy download helper
  const handleDownload = async (docId, docName, docType) => {
    const toastId = toast.loading('Preparing download...');
    try {
      const response = await api.get(`/documents/download/${docId}`, {
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Determine file extension
      const contentType = response.headers['content-type'] || '';
      let extension = 'bin';
      if (contentType.includes('pdf')) extension = 'pdf';
      else if (contentType.includes('image/jpeg')) extension = 'jpg';
      else if (contentType.includes('image/png')) extension = 'png';
      else if (contentType.includes('image/gif')) extension = 'gif';
      else if (contentType.includes('word')) extension = 'docx';

      const filename = `${docName || docType || 'document'}.${extension}`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download completed!', { id: toastId });
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document', { id: toastId });
    }
  };

  // Helper: Get document details by type for My Documents
  const getMyDocByType = (typeKey) => {
    return myDocs.find((doc) => doc.document_type === typeKey);
  };

  // Filtered and Sorted Documents
  const filteredAllDocs = useMemo(() => {
    let result = [...allDocs];

    // Sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [allDocs, sortOrder]);



  // Clean form states
  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setUploadEmpId('');
    setUploadDocType('aadhar');
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    if (!selectedDocToVerify) return;
    if (verifyStatus === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection.');
      return;
    }

    verifyMutation.mutate({
      document_id: selectedDocToVerify.document_id,
      status: verifyStatus,
      rejection_reason: verifyStatus === 'rejected' ? rejectionReason : undefined
    });
  };

  return (
    <div className="flex flex-col gap-6 text-left min-h-screen pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Documents Vault</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Access corporate policies, contracts, and manage personal identity documents.</p>
        </div>

        {/* Show Upload button if user has permission OR if they are on 'my-docs' tab */}
        {(canUpload || activeTab === 'my-docs') && (
          <button
            onClick={() => {
              setUploadEmpId(currentUser?.emp_id);
              setIsUploadOpen(true);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-sm shadow-indigo-600/10 transition-all"
          >
            <Plus size={16} />
            <span>Upload File</span>
          </button>
        )}
      </div>

      {/* Tabs selectors - Only visible if user has view-all permission */}
      {canViewAll && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 transition-colors duration-200">
          <button
            onClick={() => setActiveTab('all-docs')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 relative px-2 cursor-pointer ${activeTab === 'all-docs'
              ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            All Employee Documents
            {allDocs.filter(d => d.verification_status === 'pending').length > 0 && (
              <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {allDocs.filter(d => d.verification_status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('my-docs')}
            className={`pb-3 font-semibold text-sm transition-all border-b-2 relative px-2 cursor-pointer ${activeTab === 'my-docs'
              ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
              : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            My Documents
          </button>
        </div>
      )}

      {/* Main content sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'my-docs' ? (
          <motion.div
            key="my-docs-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {myDocsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
                <span className="text-sm font-medium">Fetching documents...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DOCUMENT_TYPES.map((type) => {
                  const userDoc = getMyDocByType(type.key);
                  return (
                    <motion.div
                      key={type.key}
                      whileHover={{ y: -3 }}
                      className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[210px] hover:shadow-md hover:border-slate-200/80 dark:hover:border-slate-750 transition-all duration-200 transition-colors duration-200"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{type.label}</h3>
                          {userDoc ? (
                            <span
                              className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${userDoc.verification_status === 'verified'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                                  : userDoc.verification_status === 'rejected'
                                    ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/40'
                                }`}
                            >
                              {userDoc.verification_status === 'verified' && <CheckCircle2 size={10} />}
                              {userDoc.verification_status === 'rejected' && <XCircle size={10} />}
                              {userDoc.verification_status === 'pending' && <Clock size={10} />}
                              <span className="capitalize">{userDoc.verification_status}</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 dark:bg-slate-950/20 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800/80">
                              Missing
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-3 line-clamp-2">{type.description}</p>

                        {userDoc && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium space-y-1">
                            {userDoc.document_number && (
                              <p>
                                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[9px] tracking-wider block">Doc Number</span>
                                <span className="text-slate-700 dark:text-slate-355 font-semibold">{userDoc.document_number}</span>
                              </p>
                            )}
                            {userDoc.verification_status === 'rejected' && userDoc.rejection_reason && (
                              <div className="mt-1 flex items-start gap-1 p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/40">
                                <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={12} />
                                <p className="text-[10px] text-rose-600 dark:text-rose-400 leading-normal">
                                  <strong>Reason:</strong> {userDoc.rejection_reason}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-end gap-2 border-t border-slate-55 dark:border-slate-800/60 pt-3 mt-3">
                        {userDoc ? (
                          <>
                            <button
                              onClick={() => window.open(userDoc.file_url, '_blank')}
                              className="flex items-center gap-1 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                            >
                              <Eye size={12} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleDownload(userDoc.document_id, userDoc.document_name, userDoc.document_type)}
                              className="flex items-center gap-1 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                            >
                              <Download size={12} />
                              <span>Download</span>
                            </button>
                            {userDoc.verification_status === 'rejected' && (
                              <button
                                onClick={() => {
                                  setUploadDocType(type.key);
                                  setUploadEmpId(currentUser?.emp_id);
                                  setIsUploadOpen(true);
                                }}
                                className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all"
                              >
                                <Upload size={12} />
                                <span>Re-upload</span>
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => setDocToDelete(userDoc)}
                                title="Delete Document"
                                className="p-2 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-xl transition-all cursor-pointer active:scale-95 border border-rose-100/50 dark:border-rose-900/40"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setUploadDocType(type.key);
                              setUploadEmpId(currentUser?.emp_id);
                              setIsUploadOpen(true);
                            }}
                            className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950/20 border border-slate-200/80 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 hover:border-indigo-100 hover:text-indigo-700 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer active:scale-95 transition-all"
                          >
                            <Upload size={12} />
                            <span>Upload Now</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="all-docs-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Search and filter toolbar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by employee, code, doc type..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setDocsPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm font-medium focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-200 transition-all placeholder:text-slate-400 bg-slate-50/30 dark:bg-slate-950/40"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl transition-colors">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={typeFilter}
                    onChange={(e) => { setTypeFilter(e.target.value); setDocsPage(1); }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer dark:bg-slate-900"
                  >
                    <option value="all" className="dark:bg-slate-900 dark:text-slate-100">All Document Types</option>
                    {DOCUMENT_TYPES.map(t => (
                      <option key={t.key} value={t.key} className="dark:bg-slate-900 dark:text-slate-100">{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl transition-colors">
                  <Clock size={14} className="text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setDocsPage(1); }}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer dark:bg-slate-900"
                  >
                    <option value="all" className="dark:bg-slate-900 dark:text-slate-100">All Verification Statuses</option>
                    <option value="pending" className="dark:bg-slate-900 dark:text-slate-100">Pending</option>
                    <option value="verified" className="dark:bg-slate-900 dark:text-slate-100">Verified</option>
                    <option value="rejected" className="dark:bg-slate-900 dark:text-slate-100">Rejected</option>
                  </select>
                </div>

                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl cursor-pointer active:scale-95 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
                >
                  <ArrowUpDown size={14} />
                  <span>Date: {sortOrder === 'asc' ? 'Oldest' : 'Newest'}</span>
                </button>
              </div>
            </div>

            {/* Document listings table */}
            <DocumentsTable
              documents={filteredAllDocs}
              canVerify={canVerify}
              canDelete={canDelete}
              allDocsLoading={allDocsLoading}
              handleDownload={handleDownload}
              setSelectedDocToVerify={setSelectedDocToVerify}
              setVerifyStatus={setVerifyStatus}
              setIsVerifyOpen={setIsVerifyOpen}
              setDocToDelete={setDocToDelete}
              paginationMeta={paginationMeta}
              docsPage={docsPage}
              docsLimit={docsLimit}
              setDocsPage={setDocsPage}
              setDocsLimit={setDocsLimit}
            />
          </motion.div>
        )}
      </AnimatePresence>      {/* Modal: Upload Document */}
      {/* Upload Modal Component */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        currentUser={currentUser}
        canUpload={canUpload}
        activeTab={activeTab}
        employees={employees}
        initialDocType={uploadDocType}
        initialEmpId={uploadEmpId}
      />      {/* Modal: Verify Document */}
      <AnimatePresence>
        {isVerifyOpen && selectedDocToVerify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-md w-full overflow-hidden transition-colors duration-250"
            >
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-50 dark:border-slate-800">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Verify Document</h3>
                <button
                  onClick={() => {
                    setIsVerifyOpen(false);
                    setSelectedDocToVerify(null);
                  }}
                  className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleVerifySubmit} className="p-6 space-y-4">
                <div className="bg-slate-50 dark:bg-slate-950/20 p-4 rounded-2xl text-xs space-y-2 border border-slate-100/50 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-bold">Employee</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">
                      {selectedDocToVerify.employee?.first_name} {selectedDocToVerify.employee?.last_name} ({selectedDocToVerify.employee?.empCode})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500 font-bold">Doc Type</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold capitalize">
                      {selectedDocToVerify.document_type}
                    </span>
                  </div>
                  {selectedDocToVerify.document_number && (
                    <div className="flex justify-between">
                      <span className="text-slate-400 dark:text-slate-500 font-bold">Doc ID/Number</span>
                      <span className="text-slate-700 dark:text-slate-200 font-bold">
                        {selectedDocToVerify.document_number}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800/80 pt-2 mt-2">
                    <span className="text-slate-400 dark:text-slate-500 font-bold">File Link</span>
                    <button
                      type="button"
                      onClick={() => window.open(selectedDocToVerify.file_url, '_blank')}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Review Original File</span>
                    </button>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Action Status *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVerifyStatus('verified')}
                      className={`py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${verifyStatus === 'verified'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'
                        }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve / Verify</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVerifyStatus('rejected')}
                      className={`py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${verifyStatus === 'rejected'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-900'
                        }`}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Rejection Reason (only visible if rejecting) */}
                {verifyStatus === 'rejected' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Rejection Reason *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Specify what is incorrect, e.g. Uploaded blurred image, expired ID proof..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all resize-none placeholder:text-slate-400"
                    />
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-50 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyOpen(false);
                      setSelectedDocToVerify(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-sm transition-all cursor-pointer bg-white dark:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={verifyMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm shadow-indigo-600/10 flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {verifyMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Save Status</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Deletion Modal */}
      <AnimatePresence>
        {docToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl max-w-sm w-full p-6 text-center transition-colors duration-200"
            >
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={20} />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">Delete Document?</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mb-5">
                Are you sure you want to delete this document from the system? This action is permanent and cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDocToDelete(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer bg-white dark:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(docToDelete.document_id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs active:scale-[0.98] transition-all cursor-pointer shadow-sm shadow-rose-600/10 flex items-center justify-center gap-1"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" size={12} />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Confirm Delete</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;
