import React from 'react';
import { HelpCircle, X, FileSearch, Scale, MessageSquare } from 'lucide-react';

export default function BeginnerGuide({ onClose, isSimpleMode, onSelectTab }) {
  return (
    <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm relative overflow-hidden mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0f2d59] flex items-center gap-2">
              <span>New to e-Nyay Sahayak? Quick 60-Second Beginners Guide</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                Simple Guide
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Unlike normal AI, this portal <strong>cannot make up fake facts or fake laws</strong>. Every claim is verified with source evidence.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          title="Close guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Step Visual Cards in Clean White and Blue Shade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div
          onClick={() => onSelectTab && onSelectTab('review')}
          className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 p-4 rounded-xl space-y-1.5 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Step 1</span>
            <FileSearch className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition">
            1. Find Contradictions & Missing Proof
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            The AI reads all case documents side-by-side. It immediately spots when someone's story doesn't match real records (e.g. complainant says cash was handed over in Bangalore, but passport logs show accused was in Singapore!).
          </p>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => onSelectTab && onSelectTab('drafting')}
          className="bg-slate-50 hover:bg-emerald-50/40 border border-slate-200 hover:border-emerald-300 p-4 rounded-xl space-y-1.5 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Step 2</span>
            <Scale className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 transition">
            2. Get Court-Ready Documents
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Generate formal Bail Petitions or Legal Notices. Every sentence contains a clickable proof badge. Click any badge to view the exact original paragraph and verified Supreme Court rule.
          </p>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => onSelectTab && onSelectTab('chat')}
          className="bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 p-4 rounded-xl space-y-1.5 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Step 3</span>
            <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-900 transition">
            3. Ask Any Question With Guaranteed Proof
          </h3>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Ask any question in plain English. If evidence doesn't exist, the AI says so rather than making things up. Guaranteed 100% zero fabricated answers.
          </p>
        </div>
      </div>
    </div>
  );
}
