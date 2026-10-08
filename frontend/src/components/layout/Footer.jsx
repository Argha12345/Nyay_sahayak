import React from 'react';
import { TAMIL_TRANSLATIONS } from '../../utils/tamilLocale';

export default function Footer({ language = 'en' }) {
  const isTa = language === 'ta';

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-4 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-[#0f2d59]">
            {isTa ? TAMIL_TRANSLATIONS.footerPortal : 'e-Nyay Sahayak (VeriJuris Portal)'}
          </span>
          <span className="mx-2">•</span>
          <span>
            {isTa ? TAMIL_TRANSLATIONS.footerSubtitle : 'National Verifiable Legal Assistant & Research System'}
          </span>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-3">
          <span>{isTa ? TAMIL_TRANSLATIONS.footerZero : 'Zero Hallucinations Verified'}</span>
          <span>•</span>
          <span>{isTa ? TAMIL_TRANSLATIONS.footerAccess : 'Accessibility Compliant (WCAG 2.1)'}</span>
        </div>
      </div>
    </footer>
  );
}
