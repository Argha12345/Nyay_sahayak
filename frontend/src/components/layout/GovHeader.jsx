import React from 'react';
import { ShieldCheck, Upload, Scale, HelpCircle, Languages } from 'lucide-react';
import { TAMIL_TRANSLATIONS } from '../../utils/tamilLocale';

export default function GovHeader({
  activeTab,
  setActiveTab,
  activeCase,
  cases = [],
  onSelectCase,
  onOpenUpload,
  fontSize,
  setFontSize,
  isSimpleMode,
  setIsSimpleMode,
  showGuide,
  setShowGuide,
  language = 'en',
  setLanguage,
}) {
  const isTa = language === 'ta';
  const t = TAMIL_TRANSLATIONS;

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* 1. Tricolour Ribbon at top */}
      <div className="gov-tricolour-stripe" />

      {/* 2. Top Government & Accessibility Utility Bar */}
      <div className="bg-[#0f2d59] text-white text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Government of India / Ministry */}
        <div className="flex items-center gap-2 sm:gap-3 font-medium">
          <span className="font-semibold text-slate-100">{isTa ? t.govIndia : 'Government of India'}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200 hidden sm:inline">
            {isTa ? t.ministry : 'Ministry of Law and Justice (Department of Justice)'}
          </span>
        </div>

        {/* Right: Accessibility Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Tamil / English Bilingual Language Toggle */}
          <button
            onClick={() => setLanguage && setLanguage(isTa ? 'en' : 'ta')}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition cursor-pointer border shadow-2xs ${
              isTa
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle Language between English and தமிழ் (Tamil) for Citizen Accessibility"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{isTa ? 'English (Switch)' : 'தமிழ் (Tamil)'}</span>
          </button>

          {/* Simple Citizen Mode Toggle */}
          <button
            onClick={() => setIsSimpleMode(!isSimpleMode)}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition cursor-pointer border ${
              isSimpleMode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                : 'bg-white/10 text-slate-200 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle between Simple Plain-English Mode and Advocate Legal Pro Mode"
          >
            <span className={`w-2 h-2 rounded-full ${isSimpleMode ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            <span>
              {isSimpleMode
                ? isTa ? t.simpleCitizenMode : 'Simple Citizen Mode (Plain English)'
                : isTa ? t.proMode : 'Advocate Pro Mode'}
            </span>
          </button>

          {/* Quick Guide / Help Button */}
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 text-slate-200 hover:text-white transition cursor-pointer text-[11px]"
            title="Show 60-Second Beginners Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {showGuide
                ? isTa ? t.hideGuide : 'Hide Guide'
                : isTa ? t.howItWorks : 'How it Works'}
            </span>
          </button>

          {/* Text Size Adjuster (A- / A / A+) */}
          <div className="flex items-center gap-1 bg-[#133b70] border border-blue-400/30 rounded px-1.5 py-0.5">
            <span className="text-slate-300 text-[10px] mr-1">Text:</span>
            <button
              onClick={() => setFontSize(13)}
              className={`px-1.5 py-0.2 rounded hover:text-white font-bold cursor-pointer ${fontSize === 13 ? 'text-amber-400' : 'text-slate-300'}`}
              title="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize(14)}
              className={`px-1.5 py-0.2 rounded hover:text-white font-bold cursor-pointer ${fontSize === 14 ? 'text-amber-400' : 'text-slate-300'}`}
              title="Default Font Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize(16)}
              className={`px-1.5 py-0.2 rounded hover:text-white font-bold cursor-pointer ${fontSize === 16 ? 'text-amber-400' : 'text-slate-300'}`}
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Brand Header (Clean White Background with Blue Accents) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 bg-white">
        {/* Brand & Portal Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
            <Scale className="w-6 h-6 text-[#133b70]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg sm:text-xl text-[#0f2d59] tracking-tight">
                {isTa ? t.portalTitle : 'e-Nyay Sahayak'}
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{isTa ? t.zeroFabrication : 'Zero-Fabrication'}</span>
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                {isTa ? t.statutesCountBadge : '1,200+ Statutes & Precedents Ingested'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {isTa ? t.portalSubtitle : 'National Verifiable Legal Assistant & Research Portal • VeriJuris SQLite Relational Knowledge Engine'}
            </p>
          </div>
        </div>

        {/* Case Dossier Selector & Upload Button */}
        <div className="flex items-center gap-3">
          {/* Active Case Selector */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 shadow-xs">
            <span className="text-slate-500 mr-2 text-[11px] font-medium">{isTa ? t.activeCase : 'Active Case:'}</span>
            <select
              value={activeCase?.id || ''}
              onChange={(e) => onSelectCase(e.target.value)}
              className="bg-transparent text-[#0f2d59] font-bold focus:outline-none cursor-pointer max-w-[170px] sm:max-w-[220px] truncate"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-slate-800">
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Upload Case (Professional Blue Action Button) */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] text-white text-xs font-semibold shadow-xs transition cursor-pointer active:scale-95 border border-blue-700/30"
            title="Upload new FIR, petition, or contract file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isTa ? t.uploadCase : 'Upload Case / e-Filing'}</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Navigation Bar (White & Blue Shade) */}
      <div className="bg-[#f8fafc] border-t border-slate-200 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'review', label: isTa ? t.tab1 : '1. Case & Contract Review', simpleLabel: isTa ? t.tab1 : '1. Fact & Contradiction Check', badge: 'Stretch 1 & 2' },
            { id: 'drafting', label: isTa ? t.tab2 : '2. Legal Drafting Studio', simpleLabel: isTa ? t.tab2 : '2. Ready-to-File Documents', badge: '100% Verified' },
            { id: 'research', label: isTa ? t.tab3 : '3. Statutes & Precedents', simpleLabel: isTa ? t.tab3 : '3. Legal Laws & Case Laws', badge: 'SCC Reports' },
            { id: 'chat', label: isTa ? t.tab4 : '4. Grounded Legal Q&A Chat', simpleLabel: isTa ? t.tab4 : '4. Ask Questions with Proof', badge: 'Anti-Hallucination' },
            { id: 'ablation', label: isTa ? t.tab5 : '5. Ablation Benchmark (25%)', simpleLabel: isTa ? t.tab5 : '5. Compare with Ordinary AI', badge: 'vs Naive RAG' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-[#0f2d59] border-b-2 border-[#1d4ed8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{isSimpleMode ? tab.simpleLabel : tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                    isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
