import React, { useState, useRef } from 'react';
import { MedicalReport } from '../types/medical';
import { api } from '../services/api';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Trash2,
  FileCheck,
  Zap,
} from 'lucide-react';

interface Props {
  onReportAnalyzed: (report: MedicalReport) => void;
}

export const UploadReportView: React.FC<Props> = ({ onReportAnalyzed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileMime, setFileMime] = useState<string>('');
  const [title, setTitle] = useState('');
  const [laboratoryName, setLaboratoryName] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [extractedText, setExtractedText] = useState('');

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      id: 'cbc-preset',
      name: 'Complete Blood Count (CBC)',
      lab: 'Metropolis Diagnostics',
      date: '2026-10-20',
      sampleText: `METROPOLIS DIAGNOSTICS LABORATORY
PATIENT DIAGNOSTIC REPORT
TEST: COMPLETE BLOOD COUNT (CBC) WITH DIFFERENTIAL
DATE: 2026-10-20

TEST PARAMETER        RESULT     FLAG    UNITS       REFERENCE INTERVAL
-----------------------------------------------------------------------
Hemoglobin (Hgb)      11.4       LOW     g/dL        13.0 - 17.5
Hematocrit (Hct)      35.8       LOW     %           38.8 - 50.0
WBC Count             6.2        NORMAL  x10^3/uL    4.5 - 11.0
RBC Count             4.2        LOW     x10^6/uL    4.3 - 5.9
Platelet Count        255        NORMAL  x10^3/uL    150 - 450
Absolute Neutrophils  3.9        NORMAL  x10^3/uL    1.8 - 7.7
Absolute Lymphocytes  1.8        NORMAL  x10^3/uL    1.0 - 4.8
MCV (Mean Corp. Vol)  85.2       NORMAL  fL          80.0 - 100.0`,
    },
    {
      id: 'lipid-preset',
      name: 'Lipid Cardiovascular Panel',
      lab: 'Quest Health Diagnostics',
      date: '2026-10-18',
      sampleText: `QUEST HEALTH DIAGNOSTICS
CARDIOVASCULAR RISK PROFILE - LIPID PANEL
DATE: 2026-10-18

TEST PARAMETER        RESULT     FLAG    UNITS       REFERENCE INTERVAL
-----------------------------------------------------------------------
Total Cholesterol     224        HIGH    mg/dL       < 200
HDL Cholesterol       52         NORMAL  mg/dL       > 40
LDL Cholesterol       142        HIGH    mg/dL       < 100
Triglycerides         135        NORMAL  mg/dL       < 150
Non-HDL Cholesterol   172        HIGH    mg/dL       < 130
Cholesterol/HDL Ratio 4.3        NORMAL  ratio       < 5.0`,
    },
    {
      id: 'cmp-preset',
      name: 'Comprehensive Metabolic Panel (CMP)',
      lab: 'Apex Clinical Systems',
      date: '2026-10-12',
      sampleText: `APEX CLINICAL SYSTEMS
COMPREHENSIVE METABOLIC PANEL (CMP-14)
DATE: 2026-10-12

TEST PARAMETER        RESULT     FLAG    UNITS       REFERENCE INTERVAL
-----------------------------------------------------------------------
Fasting Glucose       108        HIGH    mg/dL       70 - 99
Serum Creatinine      0.95       NORMAL  mg/dL       0.70 - 1.30
eGFR                  94         NORMAL  mL/min      > 60
BUN (Blood Urea)      16         NORMAL  mg/dL       7 - 20
ALT (Liver Enzyme)    28         NORMAL  U/L         7 - 56
AST (Liver Enzyme)    22         NORMAL  U/L         10 - 40
Serum Sodium          140        NORMAL  mmol/L      136 - 145
Serum Potassium       4.4        NORMAL  mmol/L      3.5 - 5.1
Serum Calcium         9.6        NORMAL  mg/dL       8.6 - 10.2
Vitamin D, 25-OH      24.5       LOW     ng/mL       30.0 - 100.0`,
    },
  ];

  const validateAndProcessFile = (selectedFile: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 12 * 1024 * 1024; // 12MB

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, JPG, JPEG, or PNG document.');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('File size exceeds the 12MB limit.');
      return;
    }

    setFile(selectedFile);
    setFileMime(selectedFile.type);
    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFilePreview(result);

      // Simple client-side text hint if it's text-like, or let user see ready state
      if (selectedFile.type.startsWith('image/')) {
        setExtractedText(`[Document image selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)]\nReady for Gemini Vision Multimodal OCR Extraction.`);
      } else {
        setExtractedText(`[PDF Document selected: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)]\nReady for Gemini Document OCR Parsing.`);
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectPreset = (preset: typeof samplePresets[0]) => {
    setTitle(preset.name);
    setLaboratoryName(preset.lab);
    setReportDate(preset.date);
    setExtractedText(preset.sampleText);
    setFile(null);
    setFilePreview(null);
    setFileMime('text/plain');
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim() && !filePreview) {
      setError('Please upload a file or choose a sample lab report.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Progress stepper simulation
    setProgressPercent(15);
    setProgressStep('Validating file integrity and format...');

    const timer1 = setTimeout(() => {
      setProgressPercent(45);
      setProgressStep('Extracting test parameters & reference ranges via OCR...');
    }, 600);

    const timer2 = setTimeout(() => {
      setProgressPercent(75);
      setProgressStep('Consulting Google Gemini 3.8 Flash for clinical explanations...');
    }, 1400);

    try {
      const analyzedReport = await api.analyzeReport({
        text: extractedText,
        fileBase64: filePreview || undefined,
        fileMimeType: fileMime || undefined,
        fileName: file?.name || `${title.replace(/\s+/g, '_')}.pdf`,
        fileType: file?.type.includes('pdf') ? 'pdf' : file ? 'png' : 'sample',
        fileSize: file ? `${(file.size / 1024).toFixed(0)} KB` : '420 KB',
        title: title || 'Medical Laboratory Report',
        laboratoryName: laboratoryName || 'Clinical Diagnostics Lab',
        reportDate: reportDate || new Date().toISOString().split('T')[0],
      });

      setProgressPercent(100);
      setProgressStep('Analysis complete! Redirecting to report explanation...');

      setTimeout(() => {
        setIsProcessing(false);
        onReportAnalyzed(analyzedReport);
      }, 500);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsProcessing(false);
      setError(err.message || 'Analysis failed. Please verify the document text.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Upload Medical Report
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Upload blood work or diagnostic laboratory sheets in PDF or Image format
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Zap className="w-4 h-4 text-teal-600" />
          <span>Powered by Gemini 3.8 Flash Multimodal OCR</span>
        </div>
      </div>

      <MedicalDisclaimerBanner compact />

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-rose-700">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-teal-500 bg-teal-50/60 scale-[1.005]'
            : 'border-slate-300 hover:border-teal-400 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              validateAndProcessFile(e.target.files[0]);
            }
          }}
        />

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Drag and drop your report file here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, JPG, JPEG, and PNG (up to 12MB)
            </p>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
            >
              Browse Files from Computer
            </button>
          </div>
        </div>
      </div>

      {/* 2. File Preview & Metadata Card (if file chosen) */}
      {file && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                {file.type.includes('pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{(file.size / 1024).toFixed(0)} KB</span>
                  <span aria-hidden="true">·</span>
                  <span>{file.type}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setFilePreview(null);
                setExtractedText('');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Remove File"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image Thumbnail Preview if image */}
          {filePreview && file.type.startsWith('image/') && (
            <div className="max-h-60 overflow-hidden rounded-lg border border-slate-200 flex justify-center bg-slate-900/5 p-2">
              <img
                src={filePreview}
                alt="Uploaded report preview"
                className="max-h-56 object-contain rounded"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. 1-Click Sample Lab Reports Selector */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Or Try With Ready-to-Test Sample Reports
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">1-click instant load</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {samplePresets.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer group text-left"
            >
              <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {preset.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{preset.lab}</p>
              <span className="mt-2 inline-block text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Click to Load
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Report Metadata Inputs & OCR Text Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Report Details & Extracted Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Report Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Blood Count (CBC)"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Laboratory Name
            </label>
            <input
              type="text"
              value={laboratoryName}
              onChange={(e) => setLaboratoryName(e.target.value)}
              placeholder="e.g. Quest Diagnostics"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Test Collection Date
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Extracted OCR Text / Lab Values
            </label>
            <span className="text-[11px] text-slate-400">
              Editable if you wish to adjust values
            </span>
          </div>
          <textarea
            rows={6}
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Extracted laboratory text will appear here automatically when you select a file or sample..."
            className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 leading-relaxed bg-slate-50/50"
          />
        </div>

        {/* Progress Bar during Analysis */}
        {isProcessing && (
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-900">
              <span>{progressStep}</span>
              <span className="font-mono tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-teal-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isProcessing || (!extractedText.trim() && !filePreview)}
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Explain Medical Report with AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
