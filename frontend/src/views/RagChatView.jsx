import React, { useState } from 'react';
import { Send, Bot, User, ShieldCheck, Sparkles, Info, RotateCcw } from 'lucide-react';
import CitationBadge from '../components/common/CitationBadge';
import { chatApi } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TAMIL_TRANSLATIONS } from '../utils/tamilLocale';

export default function RagChatView({ activeCase, onSelectCitation, isSimpleMode, language = 'en' }) {
  const isTa = language === 'ta';
  const initialGreeting = [
    {
      role: 'assistant',
      text: isTa
        ? TAMIL_TRANSLATIONS.chatGreeting
        : `Hello! I am your **Verifiable Legal Assistant**. I reason exclusively over the ingested case dossier and verified statutes/precedents. Every fact I assert and citation I reference is traceable to source records with zero fabrication. How can I assist you with **${activeCase?.title || 'this case'}**?`,
      citations: [],
      groundednessScore: 100
    }
  ];

  const [messages, setMessages] = useLocalStorage(
    `verijuris_chat_${activeCase?.id || 'default'}`,
    initialGreeting
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Dynamic suggested questions based on active case
  const getDynamicQuestions = () => {
    if (activeCase?.id === 'CASE-CRIM-001') {
      return [
        "Was the cash handover in Bangalore on 12-Oct physically possible?",
        "Was Section 41A CrPC notice issued prior to arrest?",
        "What is the admissibility of WhatsApp chats without Section 65B certificate?",
        "Does the case qualify for bail under Satender Kumar Antil guidelines?"
      ];
    }
    if (activeCase?.id === 'CASE-COMM-002') {
      return [
        "Does Clause 4.2 allow termination without paying liquidated damages?",
        "Can Quantix legally enforce 100% liquidated damages under Section 74?",
        "What is the conflict between Clause 8.1 and Clause 9.3 on liability?",
        "What Supreme Court precedents govern liquidated damages?"
      ];
    }

    // Dynamic questions for custom uploaded dossiers
    const docNames = (activeCase?.documents || []).map(d => d.title).slice(0, 2);
    const questions = [
      `What are the core facts and claims documented in ${docNames[0] || 'the records'}?`,
      "Are there any procedural violations, missing notices, or missing certifications?",
      "What statutory provisions and Supreme Court precedents apply to these facts?",
      "What is the recommended litigation or drafting strategy based on the evidence?"
    ];
    return questions;
  };

  const suggestedQuestions = getDynamicQuestions();

  const handleClearChat = () => {
    setMessages(initialGreeting);
  };

  const handleSend = async (questionToSend) => {
    const q = questionToSend || input;
    if (!q.trim() || loading || !activeCase?.id) return;

    const userMsg = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await chatApi.sendMessage(activeCase.id, q, messages);
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer,
            citations: data.citations || [],
            groundednessScore: data.groundednessScore,
            zeroFabricationGate: data.zeroFabricationGate,
            keyFindings: data.keyFindings || []
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `An error occurred while evaluating the query: ${err.message}`,
          citations: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessageContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(\[\[CITE:[^\]]+\]\])/g);

    return parts.map((part, index) => {
      const citeMatch = part.match(/\[\[CITE:([^\]]+)\]\]/);
      if (citeMatch) {
        const citeId = citeMatch[1];
        return (
          <CitationBadge
            key={index}
            citationId={citeId}
            onClick={onSelectCitation}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[700px] bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Friendly Citizen Explainer Box */}
      {isSimpleMode && (
        <div className="bg-blue-50 border-b border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-slate-700 leading-snug">
            <strong>Simple Q&A Guide:</strong> You can ask any question about the case facts or law. If the official case files do not contain proof, the AI will state that evidence is missing rather than inventing details.
          </p>
        </div>
      )}

      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-800" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#0f2d59]">
              {isSimpleMode ? 'Verified Legal Q&A Chat' : 'Grounded RAG Legal Chat'}
            </h3>
            <p className="text-[11px] text-slate-500">Context: {activeCase?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 cursor-pointer transition"
            title="Clear Chat History for this case"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{isTa ? TAMIL_TRANSLATIONS.clearChatBtn : 'Clear Chat'}</span>
          </button>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{isTa ? '100% பொய்மை அற்றது' : 'Anti-Hallucination Guardrail Active'}</span>
          </span>
        </div>
      </div>

      {/* Suggested Queries */}
      <div className="p-2.5 bg-slate-50/60 border-b border-slate-200 flex gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] text-slate-500 font-semibold shrink-0 flex items-center gap-1 ml-1">
          <Sparkles className="w-3 h-3 text-amber-600" /> Suggested:
        </span>
        {suggestedQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="text-[11px] px-3 py-1 rounded-md bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-200 font-medium"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-blue-800" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 space-y-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0f2d59] text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">
                {renderMessageContent(msg.text)}
              </div>

              {/* Citations & Evidence Pills attached to assistant message */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="border-t border-slate-200 pt-3 mt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span className="uppercase tracking-wider">Verified Source Provenance:</span>
                    <span className="text-emerald-700 font-bold">{msg.groundednessScore}% Grounded</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citations.map((c, i) => (
                      <CitationBadge
                        key={i}
                        citationId={c.citationId}
                        onClick={onSelectCitation}
                        label={`${c.docTitle} ¶${c.paraNum}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-800" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching case records and verifying evidence before answering...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2.5"
        >
          <input
            type="text"
            placeholder={isTa ? TAMIL_TRANSLATIONS.chatInputPlaceholder : (isSimpleMode ? "Ask any question about the case facts or law..." : "Ask anything about the case facts, statutes, contradictions, or evidence...")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-95 border border-blue-700/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isTa ? TAMIL_TRANSLATIONS.sendBtn : 'Send'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
