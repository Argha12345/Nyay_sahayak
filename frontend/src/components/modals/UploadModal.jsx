import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { caseApi } from '../../api';

export default function UploadModal({ isOpen, onClose, onUploadSuccess, activeCaseId }) {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState('Witness Statement');
  const [content, setContent] = useState('');
  const [caseTitle, setCaseTitle] = useState('');
  const [createNewCase, setCreateNewCase] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) {
      setError('Please provide document text or select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('caseId', createNewCase ? '' : (activeCaseId || ''));
      formData.append('title', title || file?.name || 'Uploaded Document');
      formData.append('type', docType);
      if (caseTitle.trim()) formData.append('caseTitle', caseTitle);
      if (content.trim()) formData.append('content', content);
      if (file) formData.append('file', file);

      const data = await caseApi.uploadDocument(formData);

      if (data.success) {
        setSuccessMsg('Document successfully ingested, indexed, and permanently saved!');
        setTimeout(() => {
          onUploadSuccess(data);
          onClose();
        }, 1200);
      } else {
        setError(data.error || 'Failed to ingest document.');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-blue-700" />
            </div>
            <h3 className="text-sm font-bold text-[#0f2d59]">e-Filing: Ingest Case Document / Contract</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs">
            <label className="flex items-center gap-2 font-medium text-blue-900 cursor-pointer">
              <input
                type="checkbox"
                checked={createNewCase}
                onChange={(e) => setCreateNewCase(e.target.checked)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span>Create brand new Case Dossier (instead of adding to active case)</span>
            </label>
          </div>

          {createNewCase && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Case Dossier Title</label>
              <input
                type="text"
                placeholder="e.g. Union of India v. ABC Corp (Commercial Arbitration)"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
              <input
                type="text"
                placeholder="e.g. Supplementary Witness Statement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Document Category</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="FIR / Police Record">FIR / Police Record</option>
                <option value="Witness Statement">Witness Statement</option>
                <option value="Commercial Contract">Commercial Contract</option>
                <option value="Forensic / Medico-legal">Forensic / Medico-legal</option>
                <option value="Statutory Notice">Statutory Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Upload File (PDF / TXT)</label>
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-xs text-slate-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Or Paste Text / Clauses Directly</label>
            <textarea
              rows={5}
              placeholder="Paste raw case paragraphs, FIR text, witness statements, or conflicting clauses here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95 border border-blue-700/30"
            >
              {isUploading ? 'Ingesting & Indexing...' : 'Ingest & Index'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
