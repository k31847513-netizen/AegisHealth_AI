import React, { useState } from 'react';
import { MedicalReport } from '../types/medical';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  History,
  Search,
  Calendar,
  Building2,
  FileText,
  Trash2,
  GitCompare,
  ArrowRight,
  Eye,
  AlertTriangle,
  X,
  TrendingUp,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface Props {
  reports: MedicalReport[];
  onSelectReport: (report: MedicalReport) => void;
  onDeleteReport: (id: string) => Promise<void>;
  onNavigateToUpload: () => void;
}

export const ReportHistoryView: React.FC<Props> = ({
  reports,
  onSelectReport,
  onDeleteReport,
  onNavigateToUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Comparison Tool State
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareReportAId, setCompareReportAId] = useState<string>(reports[0]?.id || '');
  const [compareReportBId, setCompareReportBId] = useState<string>(reports[1]?.id || reports[0]?.id || '');

  const filteredReports = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.laboratoryName.toLowerCase().includes(q) ||
      r.reportDate.includes(q) ||
      r.parameters.some((p) => p.testName.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await onDeleteReport(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const reportA = reports.find((r) => r.id === compareReportAId);
  const reportB = reports.find((r) => r.id === compareReportBId);

  // Match parameters between report A and report B for comparison
  const comparisonRows: Array<{
    name: string;
    unit: string;
    paramA?: any;
    paramB?: any;
  }> = [];

  if (reportA && reportB) {
    const allNames = new Set<string>();
    reportA.parameters.forEach((p) => allNames.add(p.testName));
    reportB.parameters.forEach((p) => allNames.add(p.testName));

    allNames.forEach((name) => {
      const pA = reportA.parameters.find((p) => p.testName === name);
      const pB = reportB.parameters.find((p) => p.testName === name);
      comparisonRows.push({
        name,
        unit: pA?.unit || pB?.unit || '',
        paramA: pA,
        paramB: pB,
      });
    });
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Medical Report History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access previous diagnostic records, examine past AI explanations, and compare test results
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {reports.length >= 2 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold rounded-xl transition-colors border border-slate-200"
            >
              <GitCompare className="w-4 h-4 text-teal-600" />
              <span>Compare Two Reports</span>
            </button>
          )}

          <button
            onClick={onNavigateToUpload}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <span>Upload New Report</span>
          </button>
        </div>
      </div>

      <MedicalDisclaimerBanner compact />

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by test name (e.g. Hemoglobin, Glucose), lab name, or date..."
          className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none placeholder:text-slate-400 text-slate-800"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 text-xs font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Reports Grid / List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {report.fileType.toUpperCase()}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Collected {report.reportDate}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{report.laboratoryName}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.summaryOverview}
                </p>

                {/* Parameters pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {report.parameters.slice(0, 5).map((p) => (
                    <span
                      key={p.id}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                        p.status === 'Normal'
                          ? 'bg-slate-100 text-slate-700'
                          : p.status === 'High'
                          ? 'bg-amber-50 text-amber-700 font-semibold'
                          : 'bg-sky-50 text-sky-700 font-semibold'
                      }`}
                    >
                      {p.testName}: {p.measuredValue}
                    </span>
                  ))}
                  {report.parameters.length > 5 && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      +{report.parameters.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2.5 sm:border-l sm:border-slate-100 sm:pl-4 shrink-0">
                <button
                  onClick={() => onSelectReport(report)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold rounded-xl transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Explanation</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(report.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Report"
                  aria-label="Delete Report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">
            {searchQuery ? 'No reports matched your query' : 'No medical reports saved'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try searching for different terms or clear your search input.'
              : 'Upload a report to begin tracking your diagnostic documents over time.'}
          </p>
          {!searchQuery && (
            <button
              onClick={onNavigateToUpload}
              className="mt-2 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-xl"
            >
              Upload Report
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Medical Report?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This report and its stored AI explanations will be permanently removed from your vault.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {showCompareModal && reportA && reportB && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                  <GitCompare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Side-by-Side Report Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Track parameter changes between two testing dates
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                aria-label="Close Comparison"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selectors for Report A and B */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl">
              <div>
                <label htmlFor="select-baseline-report-a" className="block text-xs font-semibold text-slate-700 mb-1">
                  Report A (Baseline / Earlier)
                </label>
                <select
                  id="select-baseline-report-a"
                  value={compareReportAId}
                  onChange={(e) => setCompareReportAId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-lg"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.reportDate})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="select-current-report-b" className="block text-xs font-semibold text-slate-700 mb-1">
                  Report B (Current / Follow-up)
                </label>
                <select
                  id="select-current-report-b"
                  value={compareReportBId}
                  onChange={(e) => setCompareReportBId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-lg"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.reportDate})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Parameter Name</th>
                    <th className="py-3 px-4">{reportA.reportDate} (Report A)</th>
                    <th className="py-3 px-4">{reportB.reportDate} (Report B)</th>
                    <th className="py-3 px-4">Change / Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => {
                    const valA = row.paramA?.numericValue;
                    const valB = row.paramB?.numericValue;
                    const hasBoth = typeof valA === 'number' && typeof valB === 'number';
                    const delta = hasBoth ? Number((valB - valA).toFixed(2)) : null;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {row.paramA ? (
                            <span className="flex items-center gap-1.5">
                              <span>
                                {row.paramA.measuredValue} {row.unit}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  row.paramA.status === 'Normal'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {row.paramA.status}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Tested</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums">
                          {row.paramB ? (
                            <span className="flex items-center gap-1.5">
                              <span>
                                {row.paramB.measuredValue} {row.unit}
                              </span>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                  row.paramB.status === 'Normal'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'bg-amber-50 text-amber-700'
                                }`}
                              >
                                {row.paramB.status}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-400">Not Tested</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-semibold">
                          {delta !== null ? (
                            <span
                              className={`flex items-center gap-1 ${
                                delta > 0
                                  ? 'text-teal-700'
                                  : delta < 0
                                  ? 'text-sky-700'
                                  : 'text-slate-500'
                              }`}
                            >
                              {delta > 0 && <ArrowUp className="w-3.5 h-3.5" />}
                              {delta < 0 && <ArrowDown className="w-3.5 h-3.5" />}
                              <span>
                                {delta > 0 ? `+${delta}` : delta} {row.unit}
                              </span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
