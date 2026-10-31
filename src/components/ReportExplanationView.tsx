import React, { useState } from 'react';
import { MedicalReport, TestParameter } from '../types/medical';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Search,
  Filter,
  Copy,
  Check,
  MessageSquareHeart,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';

interface Props {
  activeReport: MedicalReport | null;
  allReports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onNavigateToChat: (initialPrompt?: string, reportId?: string) => void;
  onNavigateToUpload: () => void;
}

export const ReportExplanationView: React.FC<Props> = ({
  activeReport,
  allReports,
  onSelectReport,
  onNavigateToChat,
  onNavigateToUpload,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Normal' | 'High' | 'Low'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  if (!activeReport) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Report Selected</h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Please upload a medical report or select one from your report history to view AI-powered explanations.
        </p>
        <button
          onClick={onNavigateToUpload}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
        >
          Upload Medical Report
        </button>
      </div>
    );
  }

  // Filter parameters
  const filteredParameters = activeReport.parameters.filter((p) => {
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;
    const matchesSearch =
      p.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const normalCount = activeReport.parameters.filter((p) => p.status === 'Normal').length;
  const highCount = activeReport.parameters.filter((p) => p.status === 'High').length;
  const lowCount = activeReport.parameters.filter((p) => p.status === 'Low').length;

  const handleCopyQuestion = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestionIndex(index);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Header with Report Switcher & Basic Info */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Report Explanation
              </span>
              <span aria-hidden="true">·</span>
              <span>Patient: {activeReport.patientName}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {activeReport.title}
            </h1>
          </div>

          {/* Switch report dropdown */}
          {allReports.length > 1 && (
            <div className="relative shrink-0">
              <label htmlFor="report-switcher" className="sr-only">Switch active medical report</label>
              <select
                id="report-switcher"
                value={activeReport.id}
                onChange={(e) => {
                  const found = allReports.find((r) => r.id === e.target.value);
                  if (found) onSelectReport(found);
                }}
                className="appearance-none bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
              >
                {allReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.reportDate})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Report Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>{activeReport.laboratoryName}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Test Date: {activeReport.reportDate}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{activeReport.fileName}</span>
          </span>
        </div>

        {/* Overview Summary Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Report Overview & Findings
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {activeReport.summaryOverview}
          </p>
        </div>

        {/* Parameters Score Breakdown Counters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-semibold text-slate-700">Summary:</span>
          <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 font-semibold">
            {normalCount} Normal
          </span>
          {highCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-semibold">
              {highCount} Above Range (High)
            </span>
          )}
          {lowCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-semibold">
              {lowCount} Below Range (Low)
            </span>
          )}
          <span className="text-slate-400 ml-auto">
            Total {activeReport.parameters.length} Parameters Evaluated
          </span>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search parameter name or test..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto justify-center">
          {(['All', 'Normal', 'High', 'Low'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                filterStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Detailed Parameter Cards */}
      <div className="space-y-4">
        {filteredParameters.length > 0 ? (
          filteredParameters.map((param) => (
            <ParameterCard
              key={param.id}
              parameter={param}
              reportTitle={activeReport.title}
              reportId={activeReport.id}
              onAskAI={(question) => onNavigateToChat(question, activeReport.id)}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            No test parameters match your filter "{filterStatus}" or search term "{searchQuery}".
          </div>
        )}
      </div>

      {/* 4. Questions to Ask Your Doctor */}
      {activeReport.questionsForDoctor && activeReport.questionsForDoctor.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recommended Questions for Your Healthcare Provider
                </h3>
                <p className="text-xs text-slate-500">
                  Take these proactive questions to your next appointment
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const allQuestions = activeReport.questionsForDoctor.join('\n');
                navigator.clipboard.writeText(allQuestions);
                setCopiedQuestionIndex(999);
                setTimeout(() => setCopiedQuestionIndex(null), 2000);
              }}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              {copiedQuestionIndex === 999 ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied All</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2">
            {activeReport.questionsForDoctor.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start justify-between gap-3 text-xs text-slate-700 group hover:border-teal-200 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-bold text-teal-700 font-mono mt-0.5">
                    0{idx + 1}.
                  </span>
                  <p className="leading-relaxed">{q}</p>
                </div>
                <button
                  onClick={() => handleCopyQuestion(q, idx)}
                  className="p-1 text-slate-400 hover:text-teal-600 shrink-0"
                  title="Copy question"
                >
                  {copiedQuestionIndex === idx ? (
                    <Check className="w-4 h-4 text-teal-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Sub-Component: Individual Parameter Card
// -----------------------------------------------------------------------------

interface ParameterCardProps {
  parameter: TestParameter;
  reportTitle: string;
  reportId: string;
  onAskAI: (question: string) => void;
}

const ParameterCard: React.FC<ParameterCardProps> = ({
  parameter,
  reportTitle,
  reportId,
  onAskAI,
}) => {
  // Visual Range Indicator: where does numericValue lie relative to refMin and refMax?
  const hasRange = parameter.refMax > parameter.refMin;
  let barPercent = 50;
  if (hasRange) {
    const rangeSpan = parameter.refMax - parameter.refMin;
    const offset = parameter.numericValue - parameter.refMin;
    barPercent = Math.min(Math.max((offset / rangeSpan) * 100, 5), 95);
  }

  const isNormal = parameter.status === 'Normal';
  const isHigh = parameter.status === 'High';
  const isLow = parameter.status === 'Low';

  const defaultQuestion = `What does my ${parameter.testName} result of ${parameter.measuredValue} ${parameter.unit} mean, and what should I ask my doctor?`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-all">
      {/* Parameter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {parameter.category}
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            {parameter.testName}
          </h3>
        </div>

        {/* Value, Unit & Status Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {parameter.measuredValue}
            </span>
            <span className="text-xs text-slate-500 ml-1 font-medium">
              {parameter.unit}
            </span>
            <p className="text-[11px] text-slate-400">
              Ref: {parameter.referenceRange}
            </p>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs ${
              isNormal
                ? 'bg-teal-50 text-teal-700 border border-teal-200/60'
                : isHigh
                ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                : 'bg-sky-50 text-sky-700 border border-sky-200/60'
            }`}
          >
            {isNormal && <CheckCircle2 className="w-3.5 h-3.5" />}
            {isHigh && <ArrowUp className="w-3.5 h-3.5" />}
            {isLow && <ArrowDown className="w-3.5 h-3.5" />}
            <span>{parameter.status}</span>
          </div>
        </div>
      </div>

      {/* Visual Reference Range Bar */}
      {hasRange && (
        <div className="space-y-1.5 py-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Min: {parameter.refMin} {parameter.unit}</span>
            <span className="font-semibold text-slate-700">Normal Reference Zone</span>
            <span>Max: {parameter.refMax} {parameter.unit}</span>
          </div>
          <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
            {/* Safe zone indicator */}
            <div className="absolute inset-y-0 left-[15%] right-[15%] bg-teal-100/70 border-x border-teal-300" />
            {/* Measured Value Marker Dot */}
            <div
              className={`absolute top-0 bottom-0 w-3 -ml-1.5 rounded-full shadow-xs ${
                isNormal ? 'bg-teal-600' : isHigh ? 'bg-amber-500' : 'bg-sky-600'
              }`}
              style={{ left: `${barPercent}%` }}
              title={`Your result: ${parameter.measuredValue}`}
            />
          </div>
        </div>
      )}

      {/* Explanations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-600" />
            <span>Simple English Explanation</span>
          </p>
          <p className="text-slate-600 leading-relaxed">
            {parameter.simpleExplanation}
          </p>
        </div>

        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 space-y-1">
          <p className="font-semibold text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Why This Marker Matters</span>
          </p>
          <p className="text-slate-600 leading-relaxed">
            {parameter.importance}
          </p>
        </div>
      </div>

      {/* General Educational Info & Dietary notes */}
      <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100/70 text-xs text-slate-700 space-y-1">
        <p className="font-semibold text-teal-900">
          General Educational Information
        </p>
        <p className="text-slate-600 leading-relaxed">
          {parameter.generalEducationalInfo}
        </p>
        {parameter.dietaryLifestyleNotes && (
          <p className="text-teal-800 text-[11px] pt-1 border-t border-teal-100 mt-1">
            <strong>Lifestyle & Nutrition:</strong> {parameter.dietaryLifestyleNotes}
          </p>
        )}
      </div>

      {/* Ask AI quick prompt button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => onAskAI(defaultQuestion)}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-teal-50 transition-colors"
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>Ask AI about {parameter.testName}</span>
        </button>
      </div>
    </div>
  );
};
