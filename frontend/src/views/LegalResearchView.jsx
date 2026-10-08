import React, { useState, useEffect, useCallback } from 'react';
import { Search, Link2, Info } from 'lucide-react';
import CitationBadge from '../components/common/CitationBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { researchApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TAMIL_TRANSLATIONS } from '../utils/tamilLocale';

export default function LegalResearchView({ activeCase, onSelectCitation, isSimpleMode, language = 'en' }) {
  const isTa = language === 'ta';
  const [researchData, setResearchData] = useState(null);
  const [query, setQuery] = useLocalStorage(`verijuris_research_q_${activeCase?.id || 'default'}`, '');
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useLocalStorage('verijuris_research_filter', 'bridges');

  const handleSearch = useCallback(async (customQuery) => {
    if (!activeCase?.id) return;
    setLoading(true);
    try {
      const q = customQuery !== undefined ? customQuery : query;
      const data = await researchApi.searchIssues(activeCase.id, q);
      if (data.success) {
        setResearchData(data);
      }
    } catch (err) {
      console.error('Error fetching legal research:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCase?.id, query]);

  useEffect(() => {
    if (activeCase?.id) {
      handleSearch();
    }
  }, [activeCase?.id]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="space-y-6">
      {/* Friendly Citizen Explainer Box */}
      {isSimpleMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3 shadow-2xs">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-[#0f2d59]">
              Plain English Guide for Legal Research:
            </p>
            <p className="text-slate-700 leading-relaxed">
              In law, a judge follows past landmark Supreme Court rulings (called <strong>Precedents</strong>). This tab connects the specific facts of this case to binding Supreme Court judgments (like <em>Satender Kumar Antil</em> which says people accused of offences under 7 years shouldn't be jailed unnecessarily).
            </p>
          </div>
        </div>
      )}

      {/* Research Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-[#0f2d59]">
            {isTa ? TAMIL_TRANSLATIONS.researchTitle : (isSimpleMode ? 'Legal Research & Supreme Court Rulings' : 'Authoritative Legal Research & Judicial Ratio Index')}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isTa ? TAMIL_TRANSLATIONS.researchDesc : 'Every legal precedent cited carries verifiable SCC/AIR reporter citations, designated benches, and binding ratios.'}
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
            <input
              type="text"
              placeholder={isTa ? TAMIL_TRANSLATIONS.searchPlaceholder : "Search statutes, landmark rulings, legal tests (e.g., Section 41A arrest notice, Satender Antil, Section 74 penalty)..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95 border border-blue-700/30"
          >
            {isTa ? TAMIL_TRANSLATIONS.searchBtn : 'Search Laws'}
          </button>
        </form>

        {/* Quick filter pills */}
        <div className="flex gap-2 pt-2 border-t border-slate-200">
          <button
            onClick={() => setActiveFilter('bridges')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'bridges' ? 'bg-[#1d4ed8] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isTa ? TAMIL_TRANSLATIONS.filterBridges : (isSimpleMode ? 'Fact & Law Bridges' : `Case-Law Bridges (${researchData?.factualBridges?.length || 0})`)}
          </button>
          <button
            onClick={() => setActiveFilter('precedents')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'precedents' ? 'bg-[#1d4ed8] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isTa ? TAMIL_TRANSLATIONS.filterPrecedents : (isSimpleMode ? 'Supreme Court Rulings' : `Precedents (${researchData?.matchedPrecedents?.length || 0})`)}
          </button>
          <button
            onClick={() => setActiveFilter('statutes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeFilter === 'statutes' ? 'bg-[#1d4ed8] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {isTa ? TAMIL_TRANSLATIONS.filterStatutes : (isSimpleMode ? 'Statutory Sections' : `Statutory Codes (${researchData?.matchedStatutes?.length || 0})`)}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Cross-referencing case record with statutory codes and Supreme Court ratios..." />
      ) : researchData ? (
        <div className="space-y-4">
          {/* Factual Bridges (Connecting facts to precedent) */}
          {activeFilter === 'bridges' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Link2 className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="font-medium">The Factual Bridge links individual case facts directly to controlling judicial tests.</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  Zero Hallucinated Precedents
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {researchData.factualBridges?.map((bridge) => (
                  <div
                    key={bridge.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-4 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {bridge.strength} ARGUMENT
                        </span>
                        <h4 className="text-xs font-bold text-[#0f2d59]">{bridge.legalRule}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-blue-700">{bridge.statutoryProvision}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Case Fact */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="text-[11px] font-bold text-slate-600 mb-1 flex items-center justify-between">
                          <span>Specific Case Record Fact:</span>
                          <CitationBadge citationId={bridge.sourceDocRef} onClick={onSelectCitation} />
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans">
                          "{bridge.caseFact}"
                        </p>
                      </div>

                      {/* Legal Effect */}
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <span className="text-[11px] font-bold text-emerald-800 mb-1 block">
                          Judicial Ratio & Relief Consequence:
                        </span>
                        <p className="text-xs text-slate-800 leading-relaxed font-sans">
                          {bridge.legalEffect}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precedents View */}
          {activeFilter === 'precedents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchData.matchedPrecedents?.map((prec) => (
                <div
                  key={prec.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-3 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-purple-700 font-bold">{prec.domain}</span>
                      <h4 className="text-sm font-bold text-[#0f2d59] mt-0.5">{prec.caseTitle}</h4>
                      <p className="text-xs font-mono text-slate-600 mt-0.5 font-bold">{prec.citation} ({prec.year})</p>
                    </div>
                    <CitationBadge citationId={prec.id} onClick={onSelectCitation} />
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Binding Judicial Ratio
                    </span>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {prec.ratioDecidendi}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 text-xs text-purple-950 italic font-serif">
                    "{prec.keyQuotes?.[0]}"
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <strong className="text-slate-700">Bench: </strong>{prec.bench}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statutes View */}
          {activeFilter === 'statutes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {researchData.matchedStatutes?.map((st) => (
                <div
                  key={st.id}
                  className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs space-y-3 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-amber-700 font-bold">{st.code}</span>
                      <h4 className="text-sm font-bold text-[#0f2d59] mt-0.5">{st.section}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">{st.title}</p>
                    </div>
                    <CitationBadge citationId={st.id} onClick={onSelectCitation} />
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed font-serif bg-amber-50/20">
                    "{st.verifiableText}"
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Cross-Reference: {st.crossReference}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
