import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-4 px-4 sm:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <span className="font-semibold text-[#0f2d59]">e-Nyay Sahayak (VeriJuris Portal)</span>
          <span className="mx-2">•</span>
          <span>National Verifiable Legal Assistant & Research System</span>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-3">
          <span>Zero Hallucinations Verified</span>
          <span>•</span>
          <span>Accessibility Compliant (WCAG 2.1)</span>
        </div>
      </div>
    </footer>
  );
}
