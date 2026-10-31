import React, { useState } from 'react';
import { symptomsGuideData } from '../data/symptomsData';
import { SymptomGuideItem } from '../types/medical';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  Stethoscope,
  Search,
  AlertOctagon,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  HeartPulse,
  Thermometer,
  Brain,
  BatteryLow,
  Activity,
  Wind,
  Compass,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const SymptomsGuideView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedSymptomId, setExpandedSymptomId] = useState<string | null>('sym-fatigue');

  const categories = ['All', 'General', 'Neurological', 'Respiratory', 'Digestive', 'Musculoskeletal'];

  const filteredSymptoms = symptomsGuideData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.simpleExplanation.toLowerCase().includes(q) ||
      item.commonPossibleCauses.some((c) => c.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const getSymptomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Thermometer':
        return <Thermometer className="w-5 h-5 text-teal-600" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-sky-600" />;
      case 'BatteryLow':
        return <BatteryLow className="w-5 h-5 text-amber-600" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-indigo-600" />;
      case 'Wind':
        return <Wind className="w-5 h-5 text-teal-600" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-blue-600" />;
      case 'AlertCircle':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      default:
        return <HeartPulse className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Common Symptoms Guide
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plain English explanations, common causes, precautions, and critical red-flag warnings
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Stethoscope className="w-4 h-4 text-teal-600" />
          <span>Educational Clinical Reference</span>
        </div>
      </div>

      <MedicalDisclaimerBanner />

      {/* Emergency Warning Callout Banner */}
      <div className="bg-rose-50/80 border border-rose-200/90 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-rose-900 shadow-xs">
        <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold text-rose-950">
            Emergency Warning Signs
          </p>
          <p className="text-rose-800 leading-relaxed">
            If you or someone around you experiences crushing chest pressure, sudden numbness or paralysis on one side of the face or body, coughing up blood, high fever with severe neck stiffness, or acute difficulty breathing, call emergency services (911) or visit the nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms (e.g., fatigue, headache, dizziness)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms Accordion / Cards List */}
      <div className="space-y-4">
        {filteredSymptoms.map((symptom) => {
          const isExpanded = expandedSymptomId === symptom.id;
          return (
            <div
              key={symptom.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded ? 'border-teal-400 shadow-md ring-1 ring-teal-500/10' : 'border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              {/* Header Toggle */}
              <button
                onClick={() => setExpandedSymptomId(isExpanded ? null : symptom.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getSymptomIcon(symptom.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">
                        {symptom.name}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {symptom.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {symptom.simpleExplanation}
                    </p>
                  </div>
                </div>

                <div className="p-1 text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Detailed Section */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in duration-150">
                  {/* Plain English explanation */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">
                      Understanding this symptom:
                    </span>
                    {symptom.simpleExplanation}
                  </div>

                  {/* 2-Column Grid: Causes & Precautions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Common Causes */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-sky-600" />
                        <span>Common Possible Causes</span>
                      </p>
                      <ul className="space-y-1.5 text-slate-600">
                        {symptom.commonPossibleCauses.map((cause, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-sky-500 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* General Health Precautions */}
                    <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                      <p className="font-bold text-slate-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-600" />
                        <span>General Health Precautions</span>
                      </p>
                      <ul className="space-y-1.5 text-slate-600">
                        {symptom.generalHealthPrecautions.map((prec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-teal-600 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{prec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* When to Seek Medical Attention */}
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-900">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      <span>When to Seek Medical Attention (Non-Emergency)</span>
                    </p>
                    <ul className="space-y-1.5 text-amber-900/90">
                      {symptom.whenToSeekMedicalAttention.map((when, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{when}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emergency Warning Signs for this specific symptom */}
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-rose-800">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      <span>Emergency Warning Signs for {symptom.name}</span>
                    </p>
                    <ul className="space-y-1.5 text-rose-900">
                      {symptom.emergencyWarningSigns.map((sign, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold mt-0.5">⚠</span>
                          <span className="leading-relaxed font-medium">{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Laboratory Tests */}
                  <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 text-xs space-y-2">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>Related Blood & Diagnostic Tests</span>
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {symptom.relatedLabTests.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
