import React from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

export default function CitationBadge({ citationId, onClick, label, score }) {
  const isPrecedent = citationId?.startsWith('PREC-');
  const isStatute = citationId?.startsWith('STAT-');

  const bgClass = isPrecedent
    ? 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100'
    : isStatute
    ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
    : 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100';

  return (
    <button
      onClick={() => onClick && onClick(citationId)}
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 mx-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 ${bgClass}`}
      title={`Click to inspect verified source [${citationId}]`}
    >
      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
      <span className="font-semibold tracking-tight">{label || citationId}</span>
      <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
    </button>
  );
}
