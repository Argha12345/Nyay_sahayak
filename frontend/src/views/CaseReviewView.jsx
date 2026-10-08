import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, HelpCircle, ChevronRight, BookOpen, Info } from 'lucide-react';
import CitationBadge from '../components/common/CitationBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reviewApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CaseReviewView({ activeCase, onSelectCitation, isSimpleMode }) {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useLocalStorage('verijuris_review_subtab', 'contradictions');
  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => {
    if (!activeCase?.id) return;
    let isMounted = true;

    const fetchReview = async () => {
      setLoading(true);
      try {
        const data = await reviewApi.getAnalysis(activeCase.id);
        if (isMounted && data.success) {
          setReviewData(data);
          if (data.documentsList?.length > 0) {
            setSelectedDocId(data.documentsList[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching review:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReview();

    return () => {
      isMounted = false;
    };
  }, [activeCase?.id]);

  if (loading) {
    return <LoadingSpinner text="Auditing Case Records & Detecting Contradictions Across Documents..." />;
  }

  if (!reviewData) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs">
        No case review data available. Please select or upload a dossier.
      </div>
    );
  }

  const { contradictions, missingInfoAudit, keyFacts, documentsList } = reviewData;

  return (
    <div className="space-y-6">
      {/* Friendly Citizen Explainer Box */}
      {isSimpleMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3 shadow-2xs">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-[#0f2d59]">
              Plain English Guide for Case Review:
            </p>
            <p className="text-slate-700 leading-relaxed">
              This tab analyzes all case documents side-by-side. It spots <strong>contradictions</strong> (when two people give clashing stories or impossible alibis) and <strong>missing procedural steps</strong> (like police arresting someone without a mandatory notice), giving the lawyer an immediate advantage.
            </p>
          </div>
        </div>
      )}

      {/* Sub Tabs Pill Row */}
      <div className="flex space-x-2 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('contradictions')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'contradictions'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${activeSubTab === 'contradictions' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>{isSimpleMode ? 'Contradiction Matrix' : 'Contradiction Matrix (Stretch 1)'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px]">
            {contradictions.totalDetected}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('missing_info')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'missing_info'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className={`w-3.5 h-3.5 ${activeSubTab === 'missing_info' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>{isSimpleMode ? 'Missing Evidence Audit' : 'Missing Info Audit (Stretch 2)'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
            {missingInfoAudit.totalGapsIdentified}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('facts')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'facts'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${activeSubTab === 'facts' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          <span>{isSimpleMode ? 'Verified Key Facts' : 'Grounded Facts'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
            {keyFacts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-4 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'documents'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isSimpleMode ? 'Read Raw Documents' : 'Raw Dossier Explorer'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px]">
            {documentsList.length}
          </span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'contradictions' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>
                {isSimpleMode
                  ? 'Contradictions Detected: See below how the complainant testimony directly clashes with official government records.'
                  : 'Cross-document contradiction detector evaluated pairwise witness statements, bank records, and contractual clauses.'}
              </span>
            </div>
            <span className="text-[10px] font-bold uppercase bg-red-100 px-2.5 py-1 rounded-md text-red-800">
              Proven Conflicts
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contradictions.contradictions?.map((c, idx) => (
              <div
                key={c.contradictionId || idx}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      c.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {c.severity} CONTRADICTION
                    </span>
                    <span className="text-xs font-bold text-[#0f2d59]">{c.category}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">{c.contradictionId}</span>
                </div>

                {/* Side by side comparison in White & Blue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="text-[11px] font-semibold text-rose-800 mb-2 flex items-center justify-between">
                      <span>{isSimpleMode ? 'Claim A (Complainant):' : 'Claim A (Adversary):'}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">{c.claimA?.speaker}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-white p-3 rounded border border-rose-200">
                      "{c.claimA?.text}"
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="text-[11px] font-semibold text-emerald-800 mb-2 flex items-center justify-between">
                      <span>{isSimpleMode ? 'Claim B (Govt Alibi Proof):' : 'Claim B (Corroborating):'}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-normal">{c.claimB?.speaker}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-serif leading-relaxed italic bg-white p-3 rounded border border-emerald-200">
                      "{c.claimB?.text}"
                    </p>
                  </div>
                </div>

                {/* Legal impact */}
                <div className="bg-blue-50/60 p-3.5 rounded-lg border border-blue-200 text-xs">
                  <span className="font-bold text-[#0f2d59]">
                    {isSimpleMode ? 'Why this matters: ' : 'Legal Strategic Consequence: '}
                  </span>
                  <span className="text-slate-700 leading-relaxed">{c.legalImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'missing_info' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-[#0f2d59]">
                {isSimpleMode ? 'Case Evidentiary Readiness Score' : 'Pre-Drafting Evidentiary Readiness Score'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">{missingInfoAudit.readinessSummary}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-amber-600">{missingInfoAudit.confidenceScore}%</span>
              <span className="block text-[10px] uppercase font-bold text-slate-500">Readiness Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {missingInfoAudit.missingItems?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {item.severity}
                    </span>
                    <h4 className="text-xs font-bold text-[#0f2d59]">{item.finding}</h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400 font-semibold">{item.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold">
                      {isSimpleMode ? 'Supreme Court Rule: ' : 'Statutory Rule / Landmark Test: '}
                    </span>
                    <span className="text-amber-800 font-mono font-medium block mt-1">{item.statutoryRule}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold">
                      {isSimpleMode ? 'Defense Advantage: ' : 'Drafting Tactical Advantage: '}
                    </span>
                    <span className="text-slate-700 block mt-1">{item.litigationAdvantage}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 text-xs">
                  <span className="font-bold text-[#0f2d59]">
                    {isSimpleMode ? 'Action to take in court: ' : 'Action Required Before Filing: '}
                  </span>
                  <span className="text-slate-700">{item.actionRequired}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'facts' && (
        <div className="space-y-3">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isSimpleMode
                ? 'Every fact is verified: Each point below is directly traceable to the official case records.'
                : 'Every single factual claim below has been decomposed, indexed, and anchored to verifiable document offsets.'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {keyFacts.map((f, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-start justify-between gap-4 transition shadow-xs"
              >
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 font-semibold leading-relaxed">{f.fact}</p>
                  {f.verbatimSpan && (
                    <p className="text-[11px] text-slate-500 italic">
                      Verbatim Quote: "{f.verbatimSpan}"
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  <CitationBadge
                    citationId={f.paraId || f.sourceDocId}
                    onClick={onSelectCitation}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'documents' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Ingested Files</h4>
            {activeCase.documents?.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full text-left p-3.5 rounded-lg border transition text-xs flex items-center justify-between cursor-pointer ${
                  selectedDocId === doc.id
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="truncate pr-2">
                  <div className="truncate">{doc.title}</div>
                  <span className="text-[10px] text-slate-500 font-normal">{doc.paragraphs?.length || 0} paragraphs • {doc.type}</span>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-400" />
              </button>
            ))}
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            {(() => {
              const currentDoc = activeCase.documents?.find(d => d.id === selectedDocId);
              if (!currentDoc) return <p className="text-xs text-slate-400">Select a document to inspect.</p>;
              return (
                <div>
                  <div className="border-b border-slate-200 pb-3 mb-4">
                    <span className="text-[10px] font-mono uppercase text-blue-700 font-bold">{currentDoc.type}</span>
                    <h3 className="text-sm font-bold text-[#0f2d59]">{currentDoc.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Source: {currentDoc.source} • Date: {currentDoc.date}</p>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {currentDoc.paragraphs?.map((p) => (
                      <div
                        key={p.paraId}
                        id={p.paraId}
                        className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 transition"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono text-slate-600 font-bold">
                            Paragraph {p.paraNum}
                          </span>
                          <CitationBadge
                            citationId={p.paraId}
                            onClick={onSelectCitation}
                          />
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans">{p.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
