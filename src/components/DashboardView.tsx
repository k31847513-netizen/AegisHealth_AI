import React from 'react';
import { MedicalReport, UserProfile } from '../types/medical';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  UploadCloud,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  Stethoscope,
  Sparkles,
  ArrowUpRight,
  Clock,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  user: UserProfile;
  reports: MedicalReport[];
  onNavigate: (view: string, reportId?: string) => void;
  onSelectReport: (report: MedicalReport) => void;
}

export const DashboardView: React.FC<Props> = ({
  user,
  reports,
  onNavigate,
  onSelectReport,
}) => {
  const latestReport = reports[0] || null;

  // Calculate statistics
  const totalReports = reports.length;
  let totalParameters = 0;
  let normalCount = 0;
  let highCount = 0;
  let lowCount = 0;

  reports.forEach((r) => {
    r.parameters.forEach((p) => {
      totalParameters++;
      if (p.status === 'Normal') normalCount++;
      else if (p.status === 'High') highCount++;
      else if (p.status === 'Low') lowCount++;
    });
  });

  const normalPercent = totalParameters > 0 ? Math.round((normalCount / totalParameters) * 100) : 100;
  const flaggedCount = highCount + lowCount;

  // Mini trend data points (e.g. Hemoglobin or Glucose progression over time)
  const miniTrendData = reports
    .map((r) => {
      const hgb = r.parameters.find(
        (p) => p.testName.toLowerCase().includes('hemoglobin') || p.testName.toLowerCase().includes('hgb')
      );
      const glu = r.parameters.find((p) => p.testName.toLowerCase().includes('glucose'));
      return {
        date: r.reportDate.split('-').slice(1).join('/'),
        fullDate: r.reportDate,
        title: r.title,
        Hemoglobin: hgb ? hgb.numericValue : null,
        Glucose: glu ? glu.numericValue : null,
      };
    })
    .reverse();

  return (
    <div className="space-y-6">
      {/* 1. Welcome Message & Quick Upload Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostic Explainer & Health Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              HealthLens AI is actively monitoring your blood work and laboratory documents. Upload a new test or review past parameter trajectories below in simple English.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Report</span>
            </button>
            {latestReport && (
              <button
                onClick={() => {
                  onSelectReport(latestReport);
                  onNavigate('explanation');
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors whitespace-nowrap border border-white/20"
              >
                <FileText className="w-4 h-4 text-teal-400" />
                <span>Explain Latest Report</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Medical Safety Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* 2. Key Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Reports</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalReports}
            </span>
            <span className="text-xs text-slate-500">processed files</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {latestReport ? `Latest checkup: ${latestReport.reportDate}` : 'No reports yet'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Parameters in Range</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-teal-700 font-mono tabular-nums">
              {normalPercent}%
            </span>
            <span className="text-xs text-slate-500">({normalCount} normal)</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Within standard reference bounds</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Flags to Discuss</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono tabular-nums">
              {flaggedCount}
            </span>
            <span className="text-xs text-slate-500">({highCount} high, {lowCount} low)</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Suggested for doctor review</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">AI Health Assistant</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-900">Interactive</span>
          </div>
          <button
            onClick={() => onNavigate('chat')}
            className="mt-1 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span>Ask questions now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Two-Column Core Layout: Latest Medical Report & Health Trend Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Medical Report Card (2 Columns on Desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Latest Medical Report</span>
                <span aria-hidden="true">·</span>
                <span>Uploaded {latestReport ? new Date(latestReport.uploadDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {latestReport ? latestReport.title : 'No Medical Reports Uploaded Yet'}
              </h2>
            </div>

            {latestReport && (
              <button
                onClick={() => {
                  onSelectReport(latestReport);
                  onNavigate('explanation');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100/80 text-teal-800 text-xs font-semibold rounded-lg transition-colors shrink-0"
              >
                <span>Full AI Explanation</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {latestReport ? (
            <div className="space-y-4">
              {/* Summary overview paragraph */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  AI Summary Overview
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {latestReport.summaryOverview}
                </p>
              </div>

              {/* Lab Metadata info */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{latestReport.laboratoryName}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Collected {latestReport.reportDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{latestReport.fileName} ({latestReport.fileSize})</span>
                </span>
              </div>

              {/* Top Parameters Preview Table */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Parameter</span>
                  <div className="flex items-center gap-8">
                    <span>Reference Range</span>
                    <span className="w-20 text-right">Result & Status</span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {latestReport.parameters.slice(0, 4).map((p) => (
                    <div
                      key={p.id}
                      className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/70 transition-colors rounded-lg px-1.5"
                    >
                      <div className="pr-4">
                        <p className="font-semibold text-slate-900">{p.testName}</p>
                        <p className="text-[11px] text-slate-400">{p.category}</p>
                      </div>

                      <div className="flex items-center gap-8 shrink-0">
                        <span className="text-slate-500 text-[11px] hidden sm:inline">
                          {p.referenceRange}
                        </span>

                        <div className="w-24 text-right">
                          <span className="font-mono font-bold text-slate-900 mr-2 tabular-nums">
                            {p.measuredValue} {p.unit}
                          </span>
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              p.status === 'Normal'
                                ? 'bg-teal-50 text-teal-700'
                                : p.status === 'High'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-sky-50 text-sky-700'
                            }`}
                          >
                            {p.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">No medical reports found</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload your blood test or laboratory reports in PDF or image format to see instant explanations.
              </p>
              <button
                onClick={() => onNavigate('upload')}
                className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg"
              >
                Upload First Report
              </button>
            </div>
          )}
        </div>

        {/* Health Trend Overview Mini Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Health Trajectory
              </span>
              <button
                onClick={() => onNavigate('trends')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>Full Trends</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Hemoglobin (g/dL) Over Time
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normal reference: 13.0 – 17.5 g/dL
            </p>
          </div>

          <div className="h-44 w-full">
            {miniTrendData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={miniTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHgb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    domain={[9, 15]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val: any) => [`${val} g/dL`, 'Hemoglobin']}
                  />
                  <Area
                    type="monotone"
                    dataKey="Hemoglobin"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorHgb)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                Upload 2+ reports to unlock time-based charts
              </div>
            )}
          </div>

          <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs text-teal-800 space-y-1">
            <span className="font-semibold block">Trend Observation</span>
            <p className="text-[11px] leading-relaxed text-teal-700">
              Hemoglobin has moved from 10.5 g/dL to 11.2 g/dL (+6.7%), demonstrating steady positive progress toward reference thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Previous Report History Quick Access & Symptoms Guide Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Previous Reports Quick Access */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Previous Report History</h3>
              <p className="text-xs text-slate-500">Access previous laboratory documents and explanations</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 3).map((rep) => (
              <div
                key={rep.id}
                onClick={() => {
                  onSelectReport(rep);
                  onNavigate('explanation');
                }}
                className="p-3.5 rounded-xl border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/30 transition-all cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-100 text-slate-600 group-hover:text-teal-700 flex items-center justify-center shrink-0 transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {rep.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{rep.laboratoryName}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rep.reportDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rep.parameters.length} tests</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded">
                    {rep.fileType.toUpperCase()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms Guide Quick Access Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Symptoms Guide</h3>
              <p className="text-xs text-slate-500">Educational context & red flag warnings</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Wondering about fatigue, dizziness, headaches, or stomach upset? Learn common causes, precautions, and when to seek urgent emergency care.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Fatigue', 'Dizziness', 'Headache', 'Fever', 'Weakness', 'Stomach Pain'].map((sym) => (
              <button
                key={sym}
                onClick={() => onNavigate('symptoms')}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg transition-colors"
              >
                {sym}
              </button>
            ))}
          </div>

          <button
            onClick={() => onNavigate('symptoms')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors mt-2"
          >
            Open Symptoms Guide
          </button>
        </div>
      </div>
    </div>
  );
};
