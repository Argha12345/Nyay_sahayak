import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import GovHeader from './components/layout/GovHeader';
import BeginnerGuide from './components/navigation/BeginnerGuide';
import Footer from './components/layout/Footer';
import CaseReviewView from './views/CaseReviewView';
import DraftingStudioView from './views/DraftingStudioView';
import LegalResearchView from './views/LegalResearchView';
import RagChatView from './views/RagChatView';
import AblationBenchmarkView from './views/AblationBenchmarkView';
import EvidenceDrawer from './components/modals/EvidenceDrawer';
import UploadModal from './components/modals/UploadModal';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ShieldCheck } from 'lucide-react';
import { TAMIL_TRANSLATIONS } from './utils/tamilLocale';

function AppContent() {
  const {
    cases,
    activeCaseId,
    setActiveCaseId,
    activeCaseData,
    activeTab,
    setActiveTab,
    statutes,
    precedents,
    fontSize,
    setFontSize,
    isSimpleMode,
    setIsSimpleMode,
    showGuide,
    setShowGuide,
    language,
    setLanguage,
    isUploadOpen,
    setIsUploadOpen,
    selectedCitation,
    isDrawerOpen,
    setIsDrawerOpen,
    handleSelectCitation,
    handleUploadSuccess,
  } = useApp();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Official Government Header */}
      <GovHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCase={activeCaseData}
        cases={cases}
        onSelectCase={setActiveCaseId}
        onOpenUpload={() => setIsUploadOpen(true)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        isSimpleMode={isSimpleMode}
        setIsSimpleMode={setIsSimpleMode}
        showGuide={showGuide}
        setShowGuide={setShowGuide}
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. Main Portal Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Beginner Guide Banner */}
        {showGuide && (
          <BeginnerGuide
            onClose={() => setShowGuide(false)}
            isSimpleMode={isSimpleMode}
            onSelectTab={setActiveTab}
            language={language}
          />
        )}

        {/* Active Case Header Banner */}
        {activeCaseData && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0f2d59] border border-blue-200">
                  {language === 'ta' ? TAMIL_TRANSLATIONS.selectedDossier : (isSimpleMode ? 'Selected Case Dossier' : activeCaseData.type)}
                </span>
                <span className="text-xs text-slate-500">
                  {activeCaseData.documents?.length || 0} {language === 'ta' ? TAMIL_TRANSLATIONS.documentsIngested : 'Official Documents Ingested'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0f2d59]">
                {activeCaseData.title}
              </h2>
              {isSimpleMode || language === 'ta' ? (
                <p className="text-xs text-blue-900 font-medium">
                  <strong>{language === 'ta' ? TAMIL_TRANSLATIONS.plainSummaryLabel : 'Plain English Summary:'}</strong>{' '}
                  {language === 'ta' ? (TAMIL_TRANSLATIONS.caseSummaries[activeCaseData.id] || activeCaseData.summary) : activeCaseData.summary}
                </p>
              ) : (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeCaseData.summary}
                </p>
              )}
            </div>

            {/* Trust Seal */}
            <div className="flex items-center gap-2.5 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold text-emerald-800">
                  {language === 'ta' ? TAMIL_TRANSLATIONS.groundednessTitle : '100% Groundedness Guarantee'}
                </div>
                <div className="text-[10px] text-emerald-700">
                  {language === 'ta' ? TAMIL_TRANSLATIONS.groundednessDesc : 'Zero Fabricated Facts or Citations'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Tab Workflows */}
        {activeCaseData ? (
          <>
            {activeTab === 'review' && (
              <CaseReviewView
                activeCase={activeCaseData}
                onSelectCitation={handleSelectCitation}
                isSimpleMode={isSimpleMode}
                language={language}
              />
            )}

            {activeTab === 'drafting' && (
              <DraftingStudioView
                activeCase={activeCaseData}
                onSelectCitation={handleSelectCitation}
                isSimpleMode={isSimpleMode}
                language={language}
              />
            )}

            {activeTab === 'research' && (
              <LegalResearchView
                activeCase={activeCaseData}
                onSelectCitation={handleSelectCitation}
                isSimpleMode={isSimpleMode}
                language={language}
              />
            )}

            {activeTab === 'chat' && (
              <RagChatView
                activeCase={activeCaseData}
                onSelectCitation={handleSelectCitation}
                isSimpleMode={isSimpleMode}
                language={language}
              />
            )}

            {activeTab === 'ablation' && (
              <AblationBenchmarkView
                activeCase={activeCaseData}
                onSelectCitation={handleSelectCitation}
                isSimpleMode={isSimpleMode}
                language={language}
              />
            )}
          </>
        ) : (
          <LoadingSpinner text="Connecting to Judicial Database & Document Index..." />
        )}
      </main>

      {/* 4. Official Footer */}
      <Footer language={language} />

      {/* Side Evidence Inspector Drawer */}
      <EvidenceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedCitation={selectedCitation}
        caseData={activeCaseData}
        statutes={statutes}
        precedents={precedents}
      />

      {/* Document Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        activeCaseId={activeCaseId}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
