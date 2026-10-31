import React, { useState, useRef, useEffect } from 'react';
import { MedicalReport, ChatMessage, UserProfile } from '../types/medical';
import { api } from '../services/api';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  Bot,
  User,
  ShieldAlert,
  ChevronDown,
  FileText,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  reports: MedicalReport[];
  initialPrompt?: string;
  initialReportId?: string;
}

export const AIChatView: React.FC<Props> = ({
  user,
  reports,
  initialPrompt,
  initialReportId,
}) => {
  const [activeReportId, setActiveReportId] = useState<string>(
    initialReportId || reports[0]?.id || ''
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hello ${user.name}! I am your HealthLens AI medical educator. 

I can explain your laboratory test parameters (such as hemoglobin, blood glucose, cholesterol, and platelets) in simple, everyday English. If you have any specific test questions or want ideas on what to ask your doctor, feel free to ask!

*Remember: I provide educational explanations to help you understand your reports, not medical diagnoses or prescriptions.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'What does my hemoglobin result mean?',
    'Why is my blood sugar high?',
    'What is a platelet count?',
    'Explain my report in simple English.',
    'What questions should I ask my healthcare professional?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send initial prompt if passed
  useEffect(() => {
    if (initialPrompt && initialPrompt !== input) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportIdReferenced: activeReportId || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const reply = await api.sendChatMessage(chatHistory, activeReportId || undefined);

      const assistantMessage: ChatMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reportIdReferenced: activeReportId || undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          'I apologize, but I encountered an error connecting to the service. Please feel free to ask your question again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const selectedReport = reports.find((r) => r.id === activeReportId);

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
      {/* Header bar with Grounding Context Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-xs">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">
              AI Health Explainer Assistant
            </h1>
            <p className="text-xs text-slate-500">
              Answers laboratory questions in simple English
            </p>
          </div>
        </div>

        {/* Report Grounding Selector */}
        {reports.length > 0 && (
          <div className="relative">
            <label htmlFor="chat-grounding-report" className="sr-only">Context grounding report</label>
            <select
              id="chat-grounding-report"
              value={activeReportId}
              onChange={(e) => setActiveReportId(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              <option value="">General Medical Context (No specific report)</option>
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  Active Report: {r.title} ({r.reportDate})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2 pointer-events-none" />
          </div>
        )}
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-xs">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-teal-600 text-white ring-2 ring-teal-500/20'
                    : 'bg-slate-900 text-white ring-2 ring-slate-800/20'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed space-y-1.5 ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div
                  className={`text-[10px] text-right ${
                    isUser ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-500 ml-1">Analyzing report details...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>Suggestions:</span>
        </span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 bg-white hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedReport
                ? `Ask anything about ${selectedReport.title}...`
                : 'Ask a medical report or laboratory question in simple English...'
            }
            className="flex-1 px-4 py-2 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-40 text-white rounded-xl transition-colors shrink-0 shadow-xs"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
