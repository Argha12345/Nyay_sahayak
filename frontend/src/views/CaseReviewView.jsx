import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Info,
  Clock,
  Columns,
  Copy,
  Check,
  MapPin,
  ShieldCheck,
  AlertOctagon,
  Scale
} from 'lucide-react';
import CitationBadge from '../components/common/CitationBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { reviewApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function CaseReviewView({ activeCase, onSelectCitation, isSimpleMode }) {
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useLocalStorage('verijuris_review_subtab', 'contradictions');
  const [selectedDocId, setSelectedDocId] = useState(null);

  // Feature state
  const [selectedDiffIndex, setSelectedDiffIndex] = useState(0);
  const [copiedQuestionId, setCopiedQuestionId] = useState(null);
  const [timelineFilter, setTimelineFilter] = useState('all'); // 'all' | 'clash'

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

  const handleCopyQuestion = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionId(id);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

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

  const {
    contradictions,
    missingInfoAudit,
    keyFacts,
    documentsList,
    timeline = [],
    crossExaminationQuestions = [],
    diffPairs = []
  } = reviewData;

  const filteredTimeline = timelineFilter === 'clash' ? timeline.filter(t => t.isClash) : timeline;
  const currentDiff = diffPairs[selectedDiffIndex] || diffPairs[0];

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
              This tab analyzes all case documents side-by-side. It spots <strong>contradictions</strong> (when two people give clashing stories or impossible alibis), constructs a <strong>verified chronological timeline</strong>, and prepares <strong>cross-examination questions</strong> for your advocate.
            </p>
          </div>
        </div>
      )}

      {/* Sub Tabs Pill Row */}
      <div className="flex space-x-2 text-xs font-semibold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('contradictions')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'contradictions'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${activeSubTab === 'contradictions' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>{isSimpleMode ? 'Contradictions' : 'Contradiction Matrix'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-800 text-[10px]">
            {contradictions.totalDetected}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'timeline'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${activeSubTab === 'timeline' ? 'text-blue-200' : 'text-blue-600'}`} />
          <span>Event Timeline</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
            {timeline.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('cross_exam')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'cross_exam'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Scale className={`w-3.5 h-3.5 ${activeSubTab === 'cross_exam' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>Cross-Exam Questions</span>
          <span className="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 text-[10px]">
            {crossExaminationQuestions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('diff_viewer')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'diff_viewer'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Columns className={`w-3.5 h-3.5 ${activeSubTab === 'diff_viewer' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          <span>Evidence Diff Split-Screen</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
            {diffPairs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('missing_info')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'missing_info'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className={`w-3.5 h-3.5 ${activeSubTab === 'missing_info' ? 'text-amber-300' : 'text-amber-600'}`} />
          <span>Missing Proof Audit</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px]">
            {missingInfoAudit.totalGapsIdentified}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('facts')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'facts'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${activeSubTab === 'facts' ? 'text-emerald-300' : 'text-emerald-600'}`} />
          <span>Grounded Facts</span>
          <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">
            {keyFacts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('documents')}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeSubTab === 'documents'
              ? 'bg-[#1d4ed8] text-white shadow-xs border border-blue-700/30'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Raw Dossier Explorer</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 text-[10px]">
            {documentsList.length}
          </span>
        </button>
      </div>

      {/* Sub-Tab 1: Contradiction Matrix */}
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

      {/* Sub-Tab 2: Interactive Chronological Timeline */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0f2d59] flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-700" />
                <span>Chronological Case Event Timeline</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reconstructs time and location anchors across police records, immigration logs, and bank statements.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimelineFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  timelineFilter === 'all'
                    ? 'bg-[#1d4ed8] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Events ({timeline.length})
              </button>
              <button
                onClick={() => setTimelineFilter('clash')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  timelineFilter === 'clash'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Clashes & Alibi Impossibilities</span>
              </button>
            </div>
          </div>

          {/* Timeline Visual Cards */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredTimeline.map((item, idx) => (
              <div key={item.id || idx} className="relative group">
                {/* Node icon */}
                <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                  item.isClash
                    ? 'border-red-500 text-red-600 ring-4 ring-red-100 animate-pulse'
                    : 'border-blue-600 text-blue-600 ring-2 ring-blue-50'
                }`}>
                  {item.isClash ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </div>

                {/* Event Card */}
                <div className={`bg-white border rounded-xl p-4 sm:p-5 shadow-xs transition hover:shadow-sm ${
                  item.isClash ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0f2d59] bg-slate-100 px-2.5 py-0.5 rounded">
                        {item.date} {item.time && `• ${item.time}`}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.isClash
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {item.category}
                      </span>
                      {item.isClash && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          Alibi Clash / Procedural Defect
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.sourceDoc && (
                        <CitationBadge
                          citationId={item.sourceDoc}
                          onClick={onSelectCitation}
                        />
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#0f2d59] flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {item.location && (
                      <span className="text-xs font-normal text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                    )}
                  </h4>

                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {item.summary}
                  </p>

                  {item.clashDetails && (
                    <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                      <AlertOctagon className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">Judicial Impact of Discrepancy:</strong>
                        <span>{item.clashDetails}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Cross-Examination Strategy Question Generator */}
      {activeSubTab === 'cross_exam' && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-xs text-purple-950 flex items-start gap-3 shadow-2xs">
            <Scale className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-purple-950 text-sm">
                Tactical Advocate Cross-Examination Generator
              </h3>
              <p className="text-purple-900 leading-relaxed">
                These lethal questions are synthesized directly from detected contradictions, alibi impossibility records, and statutory omissions. Use them in trial to impeach hostile witness testimony under <strong>Sections 145 & 155 of the Indian Evidence Act (Section 148 BSA)</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {crossExaminationQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-4 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full font-bold">
                      {q.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Target Witness: </span>
                    <span className="text-xs font-extrabold text-[#0f2d59]">{q.witnessType}</span>
                  </div>

                  <button
                    onClick={() => handleCopyQuestion(q.id, q.question)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer self-start sm:self-auto"
                    title="Copy Question for Advocate Brief"
                  >
                    {copiedQuestionId === q.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Question</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Court Question */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 bg-linear-to-r from-blue-50/40 to-slate-50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                    Courtroom Leading Question:
                  </span>
                  <p className="text-xs sm:text-sm font-serif font-semibold text-slate-900 leading-relaxed italic">
                    "{q.question}"
                  </p>
                </div>

                {/* Strategic Tactical Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider block">
                      Tactical Objective:
                    </span>
                    <p className="text-slate-800 leading-relaxed">{q.objective}</p>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200 space-y-1">
                    <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block">
                      Evidentiary Impeachment Trap:
                    </span>
                    <p className="text-amber-950 leading-relaxed">{q.evidentiaryTrap}</p>
                  </div>
                </div>

                {/* Footer Statutory Anchor */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="text-[11px] text-slate-600 font-mono">
                    <strong className="text-slate-800">Legal Rule: </strong>
                    {q.statutorySection}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {q.sourceDocRef && (
                      <CitationBadge
                        citationId={q.sourceDocRef}
                        onClick={onSelectCitation}
                        label="Source Anchor"
                      />
                    )}
                    {q.impeachmentEvidence && (
                      <CitationBadge
                        citationId={q.impeachmentEvidence}
                        onClick={onSelectCitation}
                        label="Counter Proof"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Side-by-Side Split-Screen Evidence Diff Inspector */}
      {activeSubTab === 'diff_viewer' && (
        <div className="space-y-4">
          {/* Header & Diff Selector Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-[#0f2d59] flex items-center gap-2">
                  <Columns className="w-4 h-4 text-emerald-700" />
                  <span>Dual-Pane Split-Screen Evidence Diff Inspector</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Synchronized side-by-side comparison of conflicting averments versus official corroborating records.
                </p>
              </div>

              {diffPairs.length > 1 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Select Dispute:</span>
                  <select
                    value={selectedDiffIndex}
                    onChange={(e) => setSelectedDiffIndex(Number(e.target.value))}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 font-medium focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    {diffPairs.map((dp, idx) => (
                      <option key={dp.id || idx} value={idx}>
                        {dp.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {currentDiff ? (
            <div className="space-y-4">
              {/* Dual Pane Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left Pane: Adverse Claim */}
                <div className="bg-white border-2 border-rose-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                  <div className="p-3.5 bg-rose-50 border-b border-rose-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        Pane A: Disputed / Complainant Statement
                      </span>
                      <h4 className="text-xs font-bold text-rose-950 truncate max-w-xs sm:max-w-md">
                        {currentDiff.leftDoc?.title}
                      </h4>
                    </div>
                    {currentDiff.leftDoc?.paraId && (
                      <CitationBadge
                        citationId={currentDiff.leftDoc.paraId}
                        onClick={onSelectCitation}
                      />
                    )}
                  </div>

                  <div className="p-5 flex-1 bg-white space-y-3 text-xs leading-relaxed font-serif">
                    <p className="text-slate-800 bg-rose-50/30 p-4 rounded-lg border border-rose-200 italic">
                      "{currentDiff.leftDoc?.text}"
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-sans text-[11px] text-slate-600">
                      <strong className="text-rose-800">Contested Averment: </strong>
                      <span>{currentDiff.leftDoc?.highlightSpan}</span>
                    </div>
                  </div>
                </div>

                {/* Right Pane: Official Corroborating Record */}
                <div className="bg-white border-2 border-emerald-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
                  <div className="p-3.5 bg-emerald-50 border-b border-emerald-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Pane B: Official Government / Alibi Record
                      </span>
                      <h4 className="text-xs font-bold text-emerald-950 truncate max-w-xs sm:max-w-md">
                        {currentDiff.rightDoc?.title}
                      </h4>
                    </div>
                    {currentDiff.rightDoc?.paraId && (
                      <CitationBadge
                        citationId={currentDiff.rightDoc.paraId}
                        onClick={onSelectCitation}
                      />
                    )}
                  </div>

                  <div className="p-5 flex-1 bg-white space-y-3 text-xs leading-relaxed font-serif">
                    <p className="text-slate-800 bg-emerald-50/30 p-4 rounded-lg border border-emerald-200 italic">
                      "{currentDiff.rightDoc?.text}"
                    </p>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-sans text-[11px] text-slate-600">
                      <strong className="text-emerald-800">Authoritative Finding: </strong>
                      <span>{currentDiff.rightDoc?.highlightSpan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Synthesis & Judicial Outcome Box */}
              <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-[#0f2d59] uppercase tracking-wider">
                      Automated Contradiction Analysis & Strategic Outcome:
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {currentDiff.discrepancyAnalysis}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Irreconcilable Clash Proven
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No dual-pane diff records configured for this dossier.
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 5: Missing Evidence Audit */}
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

      {/* Sub-Tab 6: Key Grounded Facts */}
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

      {/* Sub-Tab 7: Raw Documents Explorer */}
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
