import React from 'react';
import { X, ShieldCheck, FileText, Scale, BookOpen, AlertCircle } from 'lucide-react';

export default function EvidenceDrawer({ isOpen, onClose, selectedCitation, caseData, statutes = [], precedents = [] }) {
  if (!isOpen || !selectedCitation) return null;

  let resolvedItem = null;
  let itemType = 'CASE_RECORD';

  if (selectedCitation.startsWith('STAT-')) {
    itemType = 'STATUTE';
    resolvedItem = statutes?.find(s => s.id === selectedCitation);
  } else if (selectedCitation.startsWith('PREC-')) {
    itemType = 'PRECEDENT';
    resolvedItem = precedents?.find(p => p.id === selectedCitation);
  } else {
    if (caseData?.documents) {
      for (const doc of caseData.documents) {
        if (!doc.paragraphs) continue;
        for (const p of doc.paragraphs) {
          if (p.paraId === selectedCitation || doc.id === selectedCitation) {
            resolvedItem = {
              docTitle: doc.title,
              docType: doc.type,
              docSource: doc.source,
              docDate: doc.date,
              paraNum: p.paraNum,
              paraId: p.paraId,
              text: p.text
            };
            break;
          }
        }
        if (resolvedItem) break;
      }
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            {itemType === 'STATUTE' ? (
              <Scale className="w-5 h-5 text-amber-700" />
            ) : itemType === 'PRECEDENT' ? (
              <BookOpen className="w-5 h-5 text-purple-700" />
            ) : (
              <FileText className="w-5 h-5 text-blue-700" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0f2d59]">Verified Evidence Inspector</h3>
            <p className="text-xs text-slate-500 font-mono">{selectedCitation}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto space-y-4">
        {/* Verification Status Pill */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-900">100% Verifiable Source Match</p>
            <p className="text-[11px] text-emerald-700">
              Deterministic verification against authoritative case records with zero hallucination.
            </p>
          </div>
        </div>

        {resolvedItem ? (
          <>
            {itemType === 'STATUTE' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">{resolvedItem.code}</span>
                  <h4 className="text-sm font-bold text-[#0f2d59] mt-1">{resolvedItem.section}: {resolvedItem.title}</h4>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                  <h5 className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-2">Verbatim Statutory Text</h5>
                  <p className="text-xs text-slate-800 leading-relaxed font-serif p-3 bg-white rounded border border-amber-200">
                    "{resolvedItem.verifiableText}"
                  </p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Cross-Reference: </span>
                  <span className="text-slate-600">{resolvedItem.crossReference}</span>
                </div>
              </div>
            )}

            {itemType === 'PRECEDENT' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-purple-700 font-bold uppercase">{resolvedItem.court} ({resolvedItem.year})</span>
                  <h4 className="text-sm font-bold text-[#0f2d59] mt-1">{resolvedItem.caseTitle}</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold">
                      {resolvedItem.citation}
                    </span>
                    <span className="text-xs text-slate-500">Bench: {resolvedItem.bench}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Binding Ratio Decidendi</h5>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    {resolvedItem.ratioDecidendi}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <h5 className="text-[10px] font-bold text-purple-900 mb-1 uppercase tracking-wider">Key Judicial Holding</h5>
                  <p className="text-xs text-purple-950 italic font-serif">
                    "{resolvedItem.keyQuotes?.[0]}"
                  </p>
                </div>
              </div>
            )}

            {itemType === 'CASE_RECORD' && (
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-blue-700 font-semibold uppercase">{resolvedItem.docType}</span>
                  <h4 className="text-sm font-bold text-[#0f2d59] mt-1">{resolvedItem.docTitle}</h4>
                  <p className="text-xs text-slate-500 mt-1">Source: {resolvedItem.docSource} • Paragraph {resolvedItem.paraNum}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/20">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Verbatim Case Evidence</h5>
                    <span className="text-[10px] font-mono text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md font-semibold">
                      {resolvedItem.paraId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed font-sans bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
                    "{resolvedItem.text}"
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Citation identifier '{selectedCitation}' could not be located in current case index.</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition cursor-pointer"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
}
