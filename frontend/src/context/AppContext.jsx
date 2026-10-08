import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { caseApi, legalDataApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cases, setCases] = useState([]);
  const [activeCaseId, setActiveCaseId] = useLocalStorage('verijuris_active_case_id', 'CASE-CRIM-001');
  const [activeCaseData, setActiveCaseData] = useState(null);
  const [activeTab, setActiveTab] = useLocalStorage('verijuris_active_tab', 'review');
  const [statutes, setStatutes] = useState([]);
  const [precedents, setPrecedents] = useState([]);

  // Accessibility & Usability Preferences (dynamically persisted)
  const [fontSize, setFontSize] = useLocalStorage('verijuris_font_size', 14);
  const [isSimpleMode, setIsSimpleMode] = useLocalStorage('verijuris_simple_mode', true);
  const [showGuide, setShowGuide] = useLocalStorage('verijuris_show_guide', true);
  const [language, setLanguage] = useLocalStorage('verijuris_language', 'en'); // 'en' | 'ta'

  // Modals & Drawers
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingCase, setIsLoadingCase] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic font scale application
  useEffect(() => {
    document.documentElement.style.setProperty('--app-font-scale', `${fontSize}px`);
  }, [fontSize]);

  const fetchCases = useCallback(async () => {
    try {
      const data = await caseApi.getAll();
      if (data.success) {
        setCases(data.cases);
        // If stored activeCaseId is not valid or empty, select first case
        if (data.cases.length > 0) {
          const exists = data.cases.some((c) => c.id === activeCaseId);
          if (!exists) {
            setActiveCaseId(data.cases[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching cases:', err);
      setError(err.message);
    }
  }, [activeCaseId, setActiveCaseId]);

  const fetchStatutesAndPrecedents = useCallback(async () => {
    try {
      const [dataStat, dataPrec] = await Promise.all([
        legalDataApi.getStatutes(),
        legalDataApi.getPrecedents(),
      ]);
      if (dataStat.success) setStatutes(dataStat.statutes);
      if (dataPrec.success) setPrecedents(dataPrec.precedents);
    } catch (err) {
      console.error('Error fetching statutes/precedents:', err);
    }
  }, []);

  const fetchCaseDetails = useCallback(async (id) => {
    if (!id) return;
    setIsLoadingCase(true);
    try {
      const data = await caseApi.getById(id);
      if (data.success) {
        setActiveCaseData(data.case);
      } else {
        // Stored ID might be from a deleted/old session
        const allCasesRes = await caseApi.getAll();
        if (allCasesRes.success && allCasesRes.cases.length > 0) {
          const fallbackId = allCasesRes.cases[0].id;
          setActiveCaseId(fallbackId);
          const fallbackData = await caseApi.getById(fallbackId);
          if (fallbackData.success) {
            setActiveCaseData(fallbackData.case);
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching case details for ${id}:`, err);
      // Fallback to first available case
      try {
        const allCasesRes = await caseApi.getAll();
        if (allCasesRes.success && allCasesRes.cases.length > 0) {
          const fallbackId = allCasesRes.cases[0].id;
          setActiveCaseId(fallbackId);
          const fallbackData = await caseApi.getById(fallbackId);
          if (fallbackData.success) {
            setActiveCaseData(fallbackData.case);
          }
        }
      } catch (fallbackErr) {
        console.error('Fallback fetch failed:', fallbackErr);
      }
    } finally {
      setIsLoadingCase(false);
    }
  }, [setActiveCaseId]);

  useEffect(() => {
    fetchCases();
    fetchStatutesAndPrecedents();
  }, []);

  useEffect(() => {
    if (activeCaseId) {
      fetchCaseDetails(activeCaseId);
    }
  }, [activeCaseId, fetchCaseDetails]);

  const handleSelectCitation = useCallback((citationId) => {
    setSelectedCitation(citationId);
    setIsDrawerOpen(true);
  }, []);

  const handleUploadSuccess = useCallback(async (uploadResult) => {
    await fetchCases();
    if (uploadResult.caseId) {
      setActiveCaseId(uploadResult.caseId);
    }
  }, [fetchCases, setActiveCaseId]);

  const value = {
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
    setSelectedCitation,
    isDrawerOpen,
    setIsDrawerOpen,
    isLoadingCase,
    error,
    refreshCases: fetchCases,
    handleSelectCitation,
    handleUploadSuccess,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
