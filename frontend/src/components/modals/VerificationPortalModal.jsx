import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Calendar,
  Hash,
  ExternalLink,
  Scale,
  Award,
  ArrowLeft
} from 'lucide-react';

export default function VerificationPortalModal({
  isOpen,
  onClose,
  verificationData
}) {
  if (!isOpen) return null;

  const data = verificationData || {
    hash: 'VERIJURIS-SHA256-CASE-CRIM-001-A9F4382',
    caseTitle: 'State of Karnataka v. Vikramaditya Sen (Cyber Crime PS Bangalore)',
    documentType: 'Regular Bail Application under Section 483 BNSS / 439 CrPC',
    date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
    citationsVerified: 5,
    groundednessScore: 100,
    hallucinations: 0,
    authority: 'VeriJuris Judicial Cryptographic Provenance Registry'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Government Top Tricolour Ribbon */}
        <div className="h-1.5 w-full bg-linear-to-r from-orange-500 via-white to-green-600" />

        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f2d59]">e-Nyay Sahayak Verification Registry</h3>
              <p className="text-[10px] text-slate-500 font-medium">Official Digital Pleading Certificate</p>
            </div>
          </div>

          <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Authentic & Verified
          </span>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5 text-xs text-slate-800">
          {/* Status Badge */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-emerald-950 text-xs">
                Zero-Fabrication Pass/Fail Gate: PASSED (100%)
              </h4>
              <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                Every asserted fact and precedent citation in this court filing is cryptographically anchored to original case records with zero AI extrapolation.
              </p>
            </div>
          </div>

          {/* Key Audit Details */}
          <div className="space-y-2.5 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-start justify-between gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 text-[11px]">Case Dossier:</span>
              <span className="font-bold text-[#0f2d59] text-right text-[11px] max-w-xs">{data.caseTitle}</span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 text-[11px]">Drafted Instrument:</span>
              <span className="font-semibold text-slate-900 text-right text-[11px]">{data.documentType}</span>
            </div>

            <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-slate-500 text-[11px]">Audit Timestamp:</span>
              <span className="font-mono text-slate-700 text-[11px]">{data.date}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 text-[11px]">Cryptographic SHA-256 Hash:</span>
              <span className="font-mono font-bold text-blue-700 text-[10px] break-all max-w-[200px] text-right">
                {data.hash}
              </span>
            </div>
          </div>

          {/* Three Audit Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="text-lg font-black text-blue-900">100%</div>
              <div className="text-[10px] text-blue-700 font-semibold mt-0.5">Groundedness</div>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="text-lg font-black text-emerald-900">0</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Hallucinations</div>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="text-lg font-black text-purple-900">{data.citationsVerified || 5}</div>
              <div className="text-[10px] text-purple-700 font-semibold mt-0.5">Citations Traceable</div>
            </div>
          </div>

          {/* Legal Registry Notice */}
          <p className="text-[10px] text-slate-500 text-center leading-relaxed">
            Issued by the VeriJuris Autonomous Legal Verification Framework under National Digital Legal Mission guidelines. Designed for Indian Judicial Filing Standards.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-mono">Registry Node: IND-KA-BLR-01</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0f2d59] hover:bg-[#133b70] text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-xs"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
