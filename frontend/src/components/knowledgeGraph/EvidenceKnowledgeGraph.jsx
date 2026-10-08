import React, { useState } from 'react';
import {
  Share2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import CitationBadge from '../common/CitationBadge';

export default function EvidenceKnowledgeGraph({
  caseData,
  contradictions = [],
  onSelectCitation,
  isSimpleMode,
  language = 'en'
}) {
  const isTa = language === 'ta';
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'clash' | 'evidence'

  // Pre-configured nodes and links derived from active case
  const getGraphData = () => {
    if (caseData?.id === 'CASE-CRIM-001') {
      return {
        nodes: [
          {
            id: 'node-accused',
            label: 'Accused: Vikramaditya Sen',
            category: 'PERSON',
            color: '#1d4ed8',
            bgColor: '#eff6ff',
            borderColor: '#93c5fd',
            x: 450,
            y: 190,
            icon: 'PERSON',
            desc: 'Subject arrested under Section 420 IPC / 318(4) BNS without mandatory Section 41A notice.'
          },
          {
            id: 'node-complainant',
            label: 'Complainant: Rajesh Khurana',
            category: 'PERSON',
            color: '#b91c1c',
            bgColor: '#fef2f2',
            borderColor: '#fca5a5',
            x: 130,
            y: 80,
            icon: 'PERSON',
            desc: 'Filed FIR 182 alleging INR 45 Lakhs misappropriation & Starbucks Bangalore cash handover.'
          },
          {
            id: 'node-fir',
            label: 'FIR No. 182/2024 (Cyber PS)',
            category: 'DOCUMENT',
            color: '#9333ea',
            bgColor: '#faf5ff',
            borderColor: '#d8b4fe',
            x: 130,
            y: 220,
            paraId: 'DOC-FIR-182:P4',
            desc: 'Allegation of INR 25L in-person cash handover on 12-Oct at 16:30 hrs at Indiranagar, BLR.'
          },
          {
            id: 'node-immigration',
            label: 'Bureau of Immigration (SQ-503)',
            category: 'GOV_RECORD',
            color: '#059669',
            bgColor: '#ecfdf5',
            borderColor: '#6ee7b7',
            x: 760,
            y: 80,
            paraId: 'DOC-ALIBI-IMMIGRATION:P2',
            desc: 'Official manifest proves accused departed BLR on 11-Oct and was physically in Singapore on 12-Oct.'
          },
          {
            id: 'node-bank',
            label: 'Axis Bank Forensic Audit',
            category: 'FINANCIAL',
            color: '#0d9488',
            bgColor: '#f0fdfa',
            borderColor: '#99f6e4',
            x: 450,
            y: 350,
            paraId: 'DOC-BANK-AXIS:P4',
            desc: 'Zero record of INR 25L cash deposit; INR 18.5L legitimately deployed into crypto exchange hedges.'
          },
          {
            id: 'node-arrest-memo',
            label: 'Arrest Memo & 65B Omission',
            category: 'PROCEDURAL',
            color: '#d97706',
            bgColor: '#fffbeb',
            borderColor: '#fde68a',
            x: 760,
            y: 310,
            paraId: 'DOC-ARREST-MEMO:P4',
            desc: 'Arrest effected without Section 41A notice; phone chats seized without Section 65B/63 BSA certificate.'
          },
          {
            id: 'node-precedent-antil',
            label: 'Satender Kumar Antil (2022) 10 SCC 51',
            category: 'PRECEDENT',
            color: '#2563eb',
            bgColor: '#eff6ff',
            borderColor: '#bfdbfe',
            x: 450,
            y: 40,
            desc: 'Supreme Court binding ratio: Category A offences (<=7 yrs) require bail without custodial remand.'
          }
        ],
        links: [
          {
            source: 'node-complainant',
            target: 'node-fir',
            type: 'EVIDENCE',
            label: 'Filed Averment',
            color: '#94a3b8',
            style: 'solid'
          },
          {
            source: 'node-fir',
            target: 'node-immigration',
            type: 'CLASH',
            label: 'TEMPORAL IMPOSSIBILITY (Singapore Alibi 3,000km)',
            color: '#ef4444',
            style: 'dashed',
            glow: true
          },
          {
            source: 'node-fir',
            target: 'node-bank',
            type: 'CLASH',
            label: 'FINANCIAL DISCREPANCY (Zero Cash Found)',
            color: '#f59e0b',
            style: 'dashed',
            glow: true
          },
          {
            source: 'node-accused',
            target: 'node-immigration',
            type: 'CORROBORATION',
            label: 'Proves Physical Presence',
            color: '#10b981',
            style: 'solid'
          },
          {
            source: 'node-accused',
            target: 'node-arrest-memo',
            type: 'PROCEDURAL',
            label: 'Arrest Without S. 41A Notice',
            color: '#f59e0b',
            style: 'solid'
          },
          {
            source: 'node-accused',
            target: 'node-precedent-antil',
            type: 'STATUTORY',
            label: 'Protected Under Category A Bail',
            color: '#3b82f6',
            style: 'solid'
          }
        ]
      };
    }

    if (caseData?.id === 'CASE-COMM-002') {
      return {
        nodes: [
          {
            id: 'node-customer',
            label: 'Customer: Apex Solutions Ltd.',
            category: 'PERSON',
            color: '#1d4ed8',
            bgColor: '#eff6ff',
            borderColor: '#93c5fd',
            x: 160,
            y: 100,
            desc: 'Exercised Clause 4.2 Termination for Convenience upon paying all accrued subscription fees.'
          },
          {
            id: 'node-provider',
            label: 'Provider: Quantix Cloud Inc.',
            category: 'PERSON',
            color: '#b91c1c',
            bgColor: '#fef2f2',
            borderColor: '#fca5a5',
            x: 750,
            y: 100,
            desc: 'Demands USD 270,000 for unserved months under Clause 14.1 Liquidated Damages.'
          },
          {
            id: 'node-clause-42',
            label: 'Clause 4.2 (Termination for Convenience)',
            category: 'DOCUMENT',
            color: '#059669',
            bgColor: '#ecfdf5',
            borderColor: '#6ee7b7',
            x: 240,
            y: 280,
            paraId: 'DOC-AGREE-SAAS:P3',
            desc: 'Non-obstante clause granting customer unconditional right to terminate with 30 days notice.'
          },
          {
            id: 'node-clause-141',
            label: 'Clause 14.1 (100% Liquidated Damages)',
            category: 'DOCUMENT',
            color: '#ef4444',
            bgColor: '#fef2f2',
            borderColor: '#fca5a5',
            x: 680,
            y: 280,
            paraId: 'DOC-AGREE-SAAS:P5',
            desc: 'Demands 100% of all future unaccrued fees, operating as an unlawful penalty in terrorem.'
          },
          {
            id: 'node-precedent-ongc',
            label: 'ONGC v. Saw Pipes (2003) 5 SCC 705',
            category: 'PRECEDENT',
            color: '#2563eb',
            bgColor: '#eff6ff',
            borderColor: '#bfdbfe',
            x: 460,
            y: 190,
            desc: 'Section 74 Contract Act limits damages to reasonable compensation; bars extortionate penalty clauses.'
          }
        ],
        links: [
          {
            source: 'node-clause-42',
            target: 'node-clause-141',
            type: 'CLASH',
            label: 'DIRECT CONTRACTUAL CONFLICT (Supremacy Clause)',
            color: '#ef4444',
            style: 'dashed',
            glow: true
          },
          {
            source: 'node-customer',
            target: 'node-clause-42',
            type: 'EVIDENCE',
            label: 'Valid 30-Day Notice Served',
            color: '#10b981',
            style: 'solid'
          },
          {
            source: 'node-clause-141',
            target: 'node-precedent-ongc',
            type: 'STATUTORY',
            label: 'Unenforceable Penalty Under S. 74',
            color: '#3b82f6',
            style: 'solid'
          }
        ]
      };
    }

    // Dynamic graph generation for custom cases or other benchmarks
    const nodes = [
      {
        id: 'node-case-main',
        label: caseData?.title || 'Active Case Dossier',
        category: 'DOCUMENT',
        color: '#1d4ed8',
        bgColor: '#eff6ff',
        borderColor: '#93c5fd',
        x: 450,
        y: 180,
        desc: caseData?.summary || 'Ingested case files and verified factual assertions.'
      }
    ];

    const links = [];
    const docs = caseData?.documents || [];

    docs.slice(0, 4).forEach((d, idx) => {
      const angle = (idx / Math.min(docs.length, 4)) * 2 * Math.PI;
      const x = 450 + Math.cos(angle) * 260;
      const y = 180 + Math.sin(angle) * 110;
      const dId = `node-doc-${idx}`;

      nodes.push({
        id: dId,
        label: d.title,
        category: 'DOCUMENT',
        color: '#0d9488',
        bgColor: '#f0fdfa',
        borderColor: '#99f6e4',
        x: Math.round(x),
        y: Math.round(y),
        paraId: `${d.id}:P1`,
        desc: `${d.type} - Ingested source document with ${d.paragraphs?.length || 0} verified paragraphs.`
      });

      links.push({
        source: 'node-case-main',
        target: dId,
        type: 'EVIDENCE',
        label: 'Source Ingested',
        color: '#64748b',
        style: 'solid'
      });
    });

    if (contradictions.length > 0 && nodes.length > 2) {
      links.push({
        source: nodes[1].id,
        target: nodes[2].id,
        type: 'CLASH',
        label: `IRRECONCILABLE CONTRADICTION (${contradictions[0].category})`,
        color: '#ef4444',
        style: 'dashed',
        glow: true
      });
    }

    return { nodes, links };
  };

  const graphData = getGraphData();
  const filteredLinks = filterType === 'all' 
    ? graphData.links 
    : filterType === 'clash' 
      ? graphData.links.filter(l => l.type === 'CLASH')
      : graphData.links.filter(l => l.type !== 'CLASH');

  return (
    <div className="space-y-4">
      {/* Graph Toolbar & Explainer */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#0f2d59]">
                {isTa ? 'ஊடாடும் சட்ட அறிவு & ஆதார வலைப்பின்னல் வரைபடம்' : 'Interactive Evidentiary & Contradiction Knowledge Graph'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Live Force Visualizer
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTa 
                ? 'வழக்கின் நபர்கள், சாட்சியங்கள், அலிபி பதிவுகள் மற்றும் நேரடி முரண்பாடுகளை இணைக்கும் நேரடி காட்சி வரைபடம்.'
                : 'Visually connects complainant allegations, physical alibi manifests, banking ledgers, and statutory impeachment anchors.'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              filterType === 'all'
                ? 'bg-[#1d4ed8] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isTa ? 'அனைத்து இணைப்புகளும்' : 'All Links'}
          </button>
          <button
            onClick={() => setFilterType('clash')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              filterType === 'clash'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isTa ? 'முரண்பாடுகள் மட்டும்' : 'Contradictions Only'}</span>
          </button>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-2 sm:p-4 min-h-[460px] flex flex-col justify-between">
        {/* Canvas Background Grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#60a5fa 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Legend Overlay */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 w-fit">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
            {isTa ? 'வரைபடக் குறியீடுகள்:' : 'Graph Legend:'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-red-500 border-t-2 border-dashed border-red-400 animate-pulse" />
            <span className="text-red-400 font-semibold">{isTa ? 'முரண்பாடு / அலிபி முறிவு' : 'Irreconcilable Clash'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-emerald-500" />
            <span className="text-emerald-400 font-semibold">{isTa ? 'சரிபார்க்கப்பட்ட சான்று' : 'Verified Evidence'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500" />
            <span className="text-blue-400 font-semibold">{isTa ? 'சட்ட விதி' : 'Statutory Precedent'}</span>
          </div>
        </div>

        {/* SVG Drawing Canvas */}
        <div className="relative z-10 w-full overflow-x-auto py-4">
          <svg
            viewBox="0 0 920 420"
            className="w-full min-w-[760px] h-[380px] select-none"
          >
            <defs>
              <marker
                id="arrowhead-red"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#ef4444" />
              </marker>
              <marker
                id="arrowhead-emerald"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#10b981" />
              </marker>
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#3b82f6" />
              </marker>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Links */}
            {filteredLinks.map((link, idx) => {
              const sourceNode = graphData.nodes.find(n => n.id === link.source);
              const targetNode = graphData.nodes.find(n => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;

              return (
                <g key={`link-${idx}`}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={link.color}
                    strokeWidth={link.glow ? 3 : 2}
                    strokeDasharray={link.style === 'dashed' ? '6 4' : undefined}
                    filter={link.glow ? 'url(#glow-red)' : undefined}
                    opacity="0.85"
                  />
                  {/* Link Label Tag */}
                  <rect
                    x={midX - 85}
                    y={midY - 10}
                    width="170"
                    height="20"
                    rx="10"
                    fill="#0f172a"
                    stroke={link.color}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text
                    x={midX}
                    y={midY + 3}
                    fill={link.color}
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {graphData.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-105"
                  transform={`translate(${node.x}, ${node.y})`}
                >
                  {/* Outer Pulsing Aura if selected or critical */}
                  {isSelected && (
                    <circle
                      r="42"
                      fill="none"
                      stroke={node.color}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="animate-spin"
                    />
                  )}

                  {/* Main Node Disc */}
                  <circle
                    r="32"
                    fill={node.bgColor}
                    stroke={node.color}
                    strokeWidth={isSelected ? 3.5 : 2}
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.4))"
                  />

                  {/* Category Pill Tag */}
                  <rect
                    x="-40"
                    y="36"
                    width="80"
                    height="16"
                    rx="8"
                    fill="#1e293b"
                    stroke={node.color}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="47"
                    fill="#e2e8f0"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono uppercase"
                  >
                    {node.category}
                  </text>

                  {/* Main Node Label text */}
                  <text
                    x="0"
                    y="4"
                    fill={node.color}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-sans"
                  >
                    {node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Inspector Drawer at Bottom */}
        {selectedNode && (
          <div className="relative z-10 mt-3 p-4 bg-slate-950/95 backdrop-blur-md rounded-xl border border-slate-800 text-xs text-white flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold border border-blue-700">
                  {selectedNode.category}
                </span>
                <h4 className="font-bold text-sm text-slate-100">{selectedNode.label}</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] max-w-3xl">
                {selectedNode.desc}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selectedNode.paraId && (
                <CitationBadge citationId={selectedNode.paraId} onClick={onSelectCitation} />
              )}
              <button
                onClick={() => setSelectedNode(null)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer text-[10px]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
