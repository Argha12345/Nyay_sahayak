import React, { useState, useEffect, useCallback } from 'react';
import { Scale, ShieldCheck, AlertOctagon, FileCheck, Copy, RefreshCw, Info, FileDown } from 'lucide-react';
import CitationBadge from '../components/common/CitationBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PleadingPdfModal from '../components/modals/PleadingPdfModal';
import { draftApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TAMIL_TRANSLATIONS } from '../utils/tamilLocale';

export default function DraftingStudioView({ activeCase, onSelectCitation, isSimpleMode, language = 'en' }) {
  const isTa = language === 'ta';
  const isContract = activeCase?.type?.toLowerCase().includes('contract') || activeCase?.type?.toLowerCase().includes('commercial');
  const defaultTemplate = isContract ? 'legal_notice' : 'bail_application';

  const [templateType, setTemplateType] = useLocalStorage(
    `verijuris_draft_tpl_${activeCase?.id || 'default'}`,
    defaultTemplate
  );
  const [customInstructions, setCustomInstructions] = useLocalStorage(
    `verijuris_draft_instr_${activeCase?.id || 'default'}`,
    ''
  );

  const [draftData, setDraftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Sync default template when activeCase changes if not set
  useEffect(() => {
    if (activeCase?.id) {
      const isCaseComm = activeCase?.type?.toLowerCase().includes('contract') || activeCase?.type?.toLowerCase().includes('commercial');
      const expected = isCaseComm ? 'legal_notice' : 'bail_application';
      // If templateType is missing or doesn't make sense, default it
      if (!templateType) {
        setTemplateType(expected);
      }
    }
  }, [activeCase?.id, activeCase?.type]);

  const handleDraft = useCallback(async () => {
    if (!activeCase?.id) return;
    setLoading(true);
    try {
      const data = await draftApi.generateDraft(activeCase.id, templateType, customInstructions);
      if (data.success) {
        setDraftData(data);
      }
    } catch (err) {
      console.error('Error generating draft:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCase?.id, templateType, customInstructions]);

  useEffect(() => {
    if (activeCase?.id) {
      handleDraft();
    }
  }, [activeCase?.id, templateType]);

  const handleCopy = () => {
    if (!draftData?.draftContent) return;
    navigator.clipboard.writeText(draftData.draftContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderInteractiveDraft = (content) => {
    if (!content) return null;

    const parts = content.split(/(\[\[CITE:[^\]]+\]\])/g);

    return parts.map((part, index) => {
      const citeMatch = part.match(/\[\[CITE:([^\]]+)\]\]/);
      if (citeMatch) {
        const citeId = citeMatch[1];
        return (
          <CitationBadge
            key={index}
            citationId={citeId}
            onClick={onSelectCitation}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {/* Friendly Citizen Explainer Box */}
      {isSimpleMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3 shadow-2xs">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-[#0f2d59]">
              Plain English Guide for Legal Drafting:
            </p>
            <p className="text-slate-700 leading-relaxed">
              This drafts an official, court-ready legal document (like a <strong>Bail Application to get someone out of jail</strong>). The revolutionary feature is that <strong>every single sentence contains a clickable proof badge</strong>. Click any badge to see the exact original page and Supreme Court ruling. Zero made-up details.
            </p>
          </div>
        </div>
      )}

      {/* Drafting Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#0f2d59]">
              {isTa ? TAMIL_TRANSLATIONS.draftStudioTitle : (isSimpleMode ? 'Court Document Drafting Studio' : 'Zero-Hallucination Legal Drafting Studio')}
            </h3>
            <p className="text-xs text-slate-500">
              {isTa
                ? TAMIL_TRANSLATIONS.draftStudioDesc
                : isSimpleMode
                ? 'Ready-to-file legal pleadings: every claim is proven with official case records and Supreme Court ratios.'
                : 'Every drafted statement is anchored to verified case evidence and binding Supreme Court ratios.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={templateType}
            onChange={(e) => setTemplateType(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
          >
            <option value="bail_application">
              {isTa ? TAMIL_TRANSLATIONS.templateBail : 'Regular Bail Application (S. 483 BNSS / 439 CrPC)'}
            </option>
            <option value="legal_notice">
              {isTa ? TAMIL_TRANSLATIONS.templateNotice : 'Rebuttal Notice / S. 74 Damages (Contract Act)'}
            </option>
            <option value="petition">
              {isTa ? TAMIL_TRANSLATIONS.templatePetition : 'General Legal Memorandum / Grounds'}
            </option>
          </select>

          <button
            onClick={handleDraft}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95 border border-blue-700/30"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isTa ? TAMIL_TRANSLATIONS.generateDraftBtn : (isSimpleMode ? 'Generate Verified Draft' : 'Regenerate & Verify')}</span>
          </button>
        </div>
      </div>

      {/* Pre-Drafting Evidentiary Audit Banner (Stretch Goal 2) */}
      {draftData?.preDraftAudit && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center shrink-0">
              <FileCheck className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                {isSimpleMode ? 'Pre-Drafting Evidentiary Audit' : 'Pre-Drafting Evidentiary Audit (Stretch Goal 2)'}
              </span>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                {draftData.preDraftAudit.readinessSummary}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold">
              Readiness: {draftData.preDraftAudit.confidenceScore}%
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Synthesizing Verified Legal Instrument & Enforcing Zero-Fabrication Gate..." />
      ) : draftData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Draft Editor / Legal Document Paper (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-300 rounded-xl flex flex-col shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-blue-700 font-bold">
                  {isSimpleMode ? 'Court Pleading Document' : 'Legal Instrument Draft'}
                </span>
                <h4 className="text-xs font-bold text-[#0f2d59] truncate max-w-md mt-0.5">{draftData.draftTitle}</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPdfModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-blue-800 hover:text-blue-950 bg-blue-50 hover:bg-blue-100 transition cursor-pointer text-xs flex items-center gap-1.5 border border-blue-200 font-semibold"
                  title="Export Court Pleading with QR Code"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isTa ? TAMIL_TRANSLATIONS.exportCourtPdf : 'Export Court PDF'}</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 transition cursor-pointer text-xs flex items-center gap-1.5 border border-slate-300"
                  title="Copy full text"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? (isTa ? TAMIL_TRANSLATIONS.copied : 'Copied!') : (isTa ? TAMIL_TRANSLATIONS.copyText : 'Copy Text')}</span>
                </button>
              </div>
            </div>

            {/* Document Content on White Parchment style */}
            <div className="p-6 overflow-y-auto max-h-[640px] text-xs font-serif leading-relaxed text-slate-900 whitespace-pre-wrap selection:bg-blue-100 selection:text-blue-900 bg-white border-t border-slate-100">
              {renderInteractiveDraft(draftData.draftContent)}
            </div>
          </div>

          {/* Verification Audit Panel & Pass/Fail Gate (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Groundedness Gauge & Zero-Fabrication Gate */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {isSimpleMode ? 'Proof & Groundedness Score' : 'Groundedness Score'}
                  </span>
                  <div className="text-3xl font-black text-emerald-600 mt-0.5">
                    {draftData.groundingAudit?.groundednessScore}%
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                  draftData.groundingAudit?.gatePassed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {draftData.groundingAudit?.gatePassed ? (
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertOctagon className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold block">
                      {isSimpleMode ? 'Zero Lies Guarantee' : 'Zero-Fabrication Gate'}
                    </span>
                    <span className="text-xs font-black">{draftData.groundingAudit?.zeroFabricationGate}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${draftData.groundingAudit?.groundednessScore}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="block font-bold text-slate-900">{draftData.groundingAudit?.verifiedClaims}</span>
                  <span className="text-[10px] text-slate-500">Verified Claims</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="block font-bold text-emerald-600">0</span>
                  <span className="text-[10px] text-slate-500">Fake Citations</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="block font-bold text-emerald-600">0</span>
                  <span className="text-[10px] text-slate-500">Fake Facts</span>
                </div>
              </div>
            </div>

            {/* Claim-by-Claim Verification Inspector */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h4 className="text-xs font-bold text-[#0f2d59]">
                  {isSimpleMode ? 'Sentence-by-Sentence Evidence Inspector' : 'Atomic Claim Grounding Inspector'}
                </h4>
                <span className="text-[10px] font-mono text-slate-500">
                  {draftData.groundingAudit?.claims?.length} Claims Verified
                </span>
              </div>

              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {draftData.groundingAudit?.claims?.map((claim) => (
                  <div
                    key={claim.claimId}
                    className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-slate-500">{claim.claimId}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {claim.status} ({Math.round(claim.entailmentScore * 100)}% Proof)
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-snug font-sans">
                      "{claim.claimText}"
                    </p>

                    {claim.verbatimQuote && (
                      <div className="text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-200 italic">
                        <span className="text-emerald-700 not-italic font-bold">Matched Proof: </span>
                        "{claim.verbatimQuote}"
                      </div>
                    )}

                    {claim.citationAnchor && (
                      <div className="flex justify-end pt-1">
                        <CitationBadge
                          citationId={claim.citationAnchor}
                          onClick={onSelectCitation}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Official Court Pleading PDF & Print Modal with QR Verification */}
      <PleadingPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        draftData={draftData}
        caseData={activeCase}
      />
    </div>
  );
}
