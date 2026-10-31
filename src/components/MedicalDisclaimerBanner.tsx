import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const MedicalDisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50/80 border border-teal-200/60 text-xs text-teal-800">
        <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
        <span>For educational purposes only. Does not replace professional medical advice or clinical diagnosis.</span>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Educational Notice" className="bg-gradient-to-r from-teal-50 via-sky-50 to-blue-50 border border-teal-200/70 rounded-xl p-4 text-slate-700 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-teal-600 text-white rounded-lg shrink-0 mt-0.5">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-semibold text-slate-900">
            Important Medical Educational Notice
          </p>
          <p className="text-slate-600 leading-relaxed">
            HealthLens AI is an educational tool designed to help you understand laboratory terminology, test parameters, and reference ranges in plain English. It does not provide medical diagnoses, prescribe treatments, or suggest modifying medical care. Always share and discuss your lab reports with a qualified healthcare professional.
          </p>
        </div>
      </div>
    </aside>
  );
};
