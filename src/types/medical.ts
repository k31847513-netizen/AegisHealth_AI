export type ParameterStatus = 'Normal' | 'High' | 'Low' | 'Uncertain';

export interface TestParameter {
  id: string;
  testName: string;
  category: string;
  measuredValue: string | number;
  numericValue: number;
  unit: string;
  referenceRange: string;
  refMin: number;
  refMax: number;
  status: ParameterStatus;
  simpleExplanation: string;
  importance: string;
  generalEducationalInfo: string;
  dietaryLifestyleNotes?: string;
}

export interface MedicalReport {
  id: string;
  userId: string;
  title: string;
  reportDate: string;
  uploadDate: string;
  laboratoryName: string;
  patientName: string;
  fileType: 'pdf' | 'jpg' | 'jpeg' | 'png' | 'sample';
  fileName: string;
  fileSize: string;
  fileDataUrl?: string;
  summaryOverview: string;
  keyFindings: string[];
  questionsForDoctor: string[];
  parameters: TestParameter[];
  emergencyWarningNotes?: string;
}

export interface SymptomGuideItem {
  id: string;
  name: string;
  category: 'General' | 'Neurological' | 'Respiratory' | 'Digestive' | 'Musculoskeletal';
  iconName: string;
  simpleExplanation: string;
  commonPossibleCauses: string[];
  generalHealthPrecautions: string[];
  whenToSeekMedicalAttention: string[];
  emergencyWarningSigns: string[];
  relatedLabTests: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  reportIdReferenced?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
  bloodGroup?: string;
  createdAt: string;
}

export interface TrendDataPoint {
  date: string;
  reportId: string;
  reportTitle: string;
  value: number;
  unit: string;
  status: ParameterStatus;
  refMin: number;
  refMax: number;
}

export interface ParameterTrend {
  testName: string;
  category: string;
  unit: string;
  refMin: number;
  refMax: number;
  currentValue: number;
  previousValue: number | null;
  changeValue: number | null;
  changePercent: number | null;
  currentStatus: ParameterStatus;
  dataPoints: TrendDataPoint[];
  educationalInsight: string;
}
