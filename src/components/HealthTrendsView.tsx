import React, { useState, useEffect } from 'react';
import { ParameterTrend } from '../types/medical';
import { api } from '../services/api';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  Info,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  CartesianGrid,
} from 'recharts';

export const HealthTrendsView: React.FC = () => {
  const [trends, setTrends] = useState<ParameterTrend[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('Hemoglobin (Hgb)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, []);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await api.getTrends();
      setTrends(data);
      if (data.length > 0 && !data.some((t) => t.testName === selectedMetric)) {
        setSelectedMetric(data[0].testName);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeTrend = trends.find((t) => t.testName === selectedMetric) || trends[0] || null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Health Trend Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track shifts in blood biomarkers over time to understand your physiological trajectory
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Activity className="w-4 h-4 text-teal-600" />
          <span>Interactive Longitudinal Biomarkers</span>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* Metric Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {trends.map((t) => (
          <button
            key={t.testName}
            onClick={() => setSelectedMetric(t.testName)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedMetric === t.testName
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t.testName}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-500/30 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Calculating biomarker trends...</span>
        </div>
      ) : activeTrend ? (
        <div className="space-y-6">
          {/* KPI Strip for Active Biomarker */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Latest Measurement</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                  {activeTrend.currentValue}
                </span>
                <span className="text-xs text-slate-500 font-medium">{activeTrend.unit}</span>
              </div>
              <span
                className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded ${
                  activeTrend.currentStatus === 'Normal'
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {activeTrend.currentStatus}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Previous Checkup</span>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-700 font-mono tabular-nums">
                  {activeTrend.previousValue !== null ? activeTrend.previousValue : '—'}
                </span>
                {activeTrend.previousValue !== null && (
                  <span className="text-xs text-slate-500 font-medium">{activeTrend.unit}</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Baseline comparison</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Change Between Reports</span>
              <div className="mt-2 flex items-baseline gap-2">
                {activeTrend.changeValue !== null ? (
                  <>
                    <span
                      className={`text-2xl font-bold font-mono tabular-nums flex items-center gap-1 ${
                        activeTrend.changeValue > 0
                          ? 'text-teal-700'
                          : activeTrend.changeValue < 0
                          ? 'text-sky-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {activeTrend.changeValue > 0 && <ArrowUp className="w-5 h-5" />}
                      {activeTrend.changeValue < 0 && <ArrowDown className="w-5 h-5" />}
                      {activeTrend.changeValue > 0 ? `+${activeTrend.changeValue}` : activeTrend.changeValue}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({activeTrend.changePercent}% delta)
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-slate-400 font-mono">—</span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Longitudinal delta</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Normal Reference Band</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums">
                  {activeTrend.refMin} – {activeTrend.refMax}
                </span>
                <span className="text-xs text-slate-500">{activeTrend.unit}</span>
              </div>
              <span className="text-[11px] text-teal-700 font-medium mt-1 block">
                Target healthy range
              </span>
            </div>
          </div>

          {/* Interactive Chart Viewport */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeTrend.testName} Trajectory
                </h3>
                <p className="text-xs text-slate-500">
                  Green shaded band highlights standard normal laboratory interval
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                  <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
                  <span>Measured Result</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3 h-3 rounded bg-teal-100 border border-teal-300 inline-block" />
                  <span>Target Safe Interval</span>
                </span>
              </div>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeTrend.dataPoints}
                  margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[
                      Math.max(0, Math.floor(activeTrend.refMin * 0.7)),
                      Math.ceil(activeTrend.refMax * 1.3),
                    ]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '12px',
                      border: 'none',
                      padding: '10px 14px',
                    }}
                    formatter={(value: any) => [
                      `${value} ${activeTrend.unit}`,
                      activeTrend.testName,
                    ]}
                    labelFormatter={(label) => `Test Date: ${label}`}
                  />
                  {/* Reference safe zone */}
                  <ReferenceArea
                    y1={activeTrend.refMin}
                    y2={activeTrend.refMax}
                    fill="#14b8a6"
                    fillOpacity={0.12}
                    stroke="#0d9488"
                    strokeDasharray="4 4"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#0d9488', stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 7, fill: '#0f766e' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Educational Insight Card */}
          <div className="bg-teal-50/60 rounded-2xl border border-teal-200/70 p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Clinical Educational Insight</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
              {activeTrend.educationalInsight}
            </p>
            <div className="pt-2 border-t border-teal-200/60 text-slate-500 text-[11px] flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Note: Blood test variations of 5–10% can be influenced by time of day, hydration status, recent meals, or differences between laboratory testing instruments. Never treat a statistical trend as a standalone diagnosis.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No sufficient historical parameters found. Upload multiple reports to view trend charts.
        </div>
      )}
    </div>
  );
};
