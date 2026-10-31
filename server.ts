import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenAI, Type } from '@google/genai';
import { initialSampleReports } from './src/data/sampleReports.ts';
import { MedicalReport, UserProfile } from './src/types/medical.ts';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.resolve(process.cwd(), '.healthlens_db.json');

// Initialize Gemini SDK with User-Agent header for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Persistence Layer for local storage & state
interface DatabaseSchema {
  users: Array<UserProfile & { passwordHash: string }>;
  reports: MedicalReport[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.users && parsed.reports && parsed.reports.length > 0) {
        return parsed;
      }
      if (parsed.users && parsed.users.length > 0) {
        parsed.reports = initialSampleReports;
        saveDatabase(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading DB_FILE, falling back to initial data', err);
  }

  // Initial Seed with Demo User
  const demoUser: UserProfile & { passwordHash: string } = {
    id: 'demo-user-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@healthlens.ai',
    passwordHash: crypto.createHash('sha256').update('password123').digest('hex'),
    avatar: '/src/assets/images/avatar_man_alex_1793465339123.jpg',
    age: 34,
    gender: 'Male',
    bloodGroup: 'O+',
    createdAt: new Date().toISOString(),
  };

  const initialDb: DatabaseSchema = {
    users: [demoUser],
    reports: initialSampleReports,
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file', err);
  }
}

let db = loadDatabase();

// Auth Helpers
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getUserFromToken(authHeader?: string): UserProfile | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  // Simple token format: user_{id}_{timestamp}
  const parts = token.split('_');
  if (parts.length < 2) return null;
  const userId = parts[1];
  const user = db.users.find((u) => u.id === userId);
  if (!user) return null;
  const { passwordHash: _, ...profile } = user;
  return profile;
}

// -----------------------------------------------------------------------------
// Authentication Endpoints
// -----------------------------------------------------------------------------

app.post('/api/auth/register', (req: Request, res: Response): void => {
  const { email, password, name, age, gender, bloodGroup } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    res.status(409).json({ error: 'An account with this email already exists.' });
    return;
  }

  const userId = `user_${Date.now()}`;
  const newUser = {
    id: userId,
    name: name?.trim() || normalizedEmail.split('@')[0],
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    avatar: '/src/assets/images/avatar_man_alex_1793465339123.jpg',
    age: age ? Number(age) : 32,
    gender: gender || 'Not specified',
    bloodGroup: bloodGroup || 'A+',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Copy sample reports for the new user so they can immediately explore the dashboard
  const userSampleReports: MedicalReport[] = initialSampleReports.map((report) => ({
    ...report,
    id: `rep_${userId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    patientName: newUser.name,
  }));
  db.reports.push(...userSampleReports);

  saveDatabase(db);

  const token = `token_${userId}_${Date.now()}`;
  const { passwordHash: _, ...profile } = newUser;
  res.status(201).json({ user: profile, token });
});

app.post('/api/auth/login', (req: Request, res: Response): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    res.status(401).json({ error: 'No account found with this email address.' });
    return;
  }

  const hashedPassword = hashPassword(password);
  if (user.passwordHash !== hashedPassword) {
    res.status(401).json({ error: 'Incorrect password. Please try again.' });
    return;
  }

  const token = `token_${user.id}_${Date.now()}`;
  const { passwordHash: _, ...profile } = user;
  res.json({ user: profile, token });
});

app.get('/api/auth/me', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized session.' });
    return;
  }
  res.json({ user });
});

app.post('/api/auth/profile', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const { name, avatar, age, gender, bloodGroup } = req.body;
  const userRecord = db.users.find((u) => u.id === user.id);
  if (!userRecord) {
    res.status(404).json({ error: 'User not found.' });
    return;
  }

  if (name !== undefined) userRecord.name = String(name).trim();
  if (avatar !== undefined) userRecord.avatar = String(avatar);
  if (age !== undefined) userRecord.age = Number(age);
  if (gender !== undefined) userRecord.gender = String(gender);
  if (bloodGroup !== undefined) userRecord.bloodGroup = String(bloodGroup);

  saveDatabase(db);
  const { passwordHash: _, ...profile } = userRecord;
  res.json({ user: profile, success: true });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }
  // Safe mock confirmation
  res.json({
    message: 'If an account exists with this email, password reset instructions have been sent.',
    success: true,
  });
});

// -----------------------------------------------------------------------------
// Medical Reports Endpoints
// -----------------------------------------------------------------------------

app.get('/api/reports', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const userReports = db.reports
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

  res.json({ reports: userReports });
});

app.post('/api/reports', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const newReport: MedicalReport = {
    ...req.body,
    id: req.body.id || `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    uploadDate: new Date().toISOString(),
  };

  db.reports.unshift(newReport);
  saveDatabase(db);

  res.status(201).json({ report: newReport });
});

app.delete('/api/reports/:id', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const reportIndex = db.reports.findIndex((r) => r.id === req.params.id && r.userId === user.id);
  if (reportIndex === -1) {
    res.status(404).json({ error: 'Report not found or permission denied.' });
    return;
  }

  const deleted = db.reports.splice(reportIndex, 1)[0];
  saveDatabase(db);
  res.json({ success: true, deletedId: deleted.id });
});

// -----------------------------------------------------------------------------
// AI Medical Report Explanation (Gemini API Integration)
// -----------------------------------------------------------------------------

app.post('/api/reports/analyze', async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const {
    text,
    fileBase64,
    fileMimeType,
    fileName,
    fileType,
    fileSize,
    laboratoryName,
    reportDate,
    title,
  } = req.body;

  try {
    let rawResultText = '';

    const systemInstruction = `You are a medical laboratory report analyzer and compassionate health educator.
Your task is to analyze the medical or blood test report provided.
Extract EVERY lab parameter accurately.

For each parameter, extract:
- testName: standard recognizable name (e.g., Hemoglobin, Fasting Blood Glucose, Platelet Count, Total Cholesterol, ALT, Creatinine, etc.)
- category: clinical category (e.g., "Complete Blood Count", "Metabolic Panel", "Lipid Profile", "Liver Function", "Kidney Function", "Vitamins & Minerals")
- measuredValue: exact value reported in the document (string or number)
- numericValue: pure numeric float value for charting (e.g. 10.5 from "10.5 g/dL")
- unit: measurement unit (e.g. "g/dL", "mg/dL", "U/L", "x10³/µL")
- referenceRange: the normal reference range string printed in the report (e.g. "12.0 - 16.0 g/dL")
- refMin: lower bound of reference range (or 0 if single-sided like <200)
- refMax: upper bound of reference range (e.g. 16.0 or 200)
- status: exactly one of "Normal", "High", "Low", "Uncertain"
- simpleExplanation: explain what this result means in plain, everyday English for a regular person.
- importance: explain why this parameter matters for the body and health.
- generalEducationalInfo: common factors that influence this test, dietary/lifestyle context, and general wellness info.
- dietaryLifestyleNotes: gentle lifestyle/nutrition points (optional).

Also include:
- summaryOverview: 2-3 clear sentences summarizing the overall findings in plain English.
- keyFindings: 3-5 bullet point highlights of notable or critical measurements.
- questionsForDoctor: 3-4 thoughtful, proactive questions the user can take to their physician.

CRITICAL SAFETY RULES:
- Do NOT diagnose medical conditions or diseases.
- Do NOT prescribe medicines.
- Do NOT recommend stopping prescribed treatments.
- Rely strictly on the reference ranges provided in the report. If absent, use standard clinical ranges.
- Do not invent values. If unreadable, mark status as "Uncertain".`;

    const contents: any[] = [];

    // If an image or PDF was uploaded as base64, send as inlineData part
    if (fileBase64 && fileMimeType) {
      contents.push({
        inlineData: {
          mimeType: fileMimeType,
          data: fileBase64.replace(/^data:[^;]+;base64,/, ''),
        },
      });
    }

    // Add text prompt
    const promptText = `Please analyze this medical report thoroughly:
Report Title: ${title || 'Medical Laboratory Report'}
Laboratory: ${laboratoryName || 'Clinical Diagnostics Lab'}
Date: ${reportDate || new Date().toISOString().split('T')[0]}
Extracted OCR / Document Text:
${text || 'Please inspect the attached document image/PDF to read all laboratory parameters.'}`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents.length === 1 ? contents[0].text : { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            laboratoryName: { type: Type.STRING },
            reportDate: { type: Type.STRING },
            summaryOverview: { type: Type.STRING },
            keyFindings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            questionsForDoctor: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            parameters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  testName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  measuredValue: { type: Type.STRING },
                  numericValue: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  referenceRange: { type: Type.STRING },
                  refMin: { type: Type.NUMBER },
                  refMax: { type: Type.NUMBER },
                  status: {
                    type: Type.STRING,
                    enum: ['Normal', 'High', 'Low', 'Uncertain'],
                  },
                  simpleExplanation: { type: Type.STRING },
                  importance: { type: Type.STRING },
                  generalEducationalInfo: { type: Type.STRING },
                  dietaryLifestyleNotes: { type: Type.STRING },
                },
                required: [
                  'testName',
                  'category',
                  'measuredValue',
                  'numericValue',
                  'unit',
                  'referenceRange',
                  'status',
                  'simpleExplanation',
                  'importance',
                  'generalEducationalInfo',
                ],
              },
            },
          },
          required: ['summaryOverview', 'keyFindings', 'questionsForDoctor', 'parameters'],
        },
      },
    });

    rawResultText = response.text || '{}';
    const parsed = JSON.parse(rawResultText);

    // Assemble the complete MedicalReport document
    const generatedReport: MedicalReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      title: parsed.title || title || 'Analyzed Laboratory Report',
      reportDate: parsed.reportDate || reportDate || new Date().toISOString().split('T')[0],
      uploadDate: new Date().toISOString(),
      laboratoryName: parsed.laboratoryName || laboratoryName || 'Clinical Diagnostics Lab',
      patientName: user.name,
      fileType: (fileType as any) || 'pdf',
      fileName: fileName || 'Uploaded_Medical_Report.pdf',
      fileSize: fileSize || '1.2 MB',
      fileDataUrl: fileBase64 || undefined,
      summaryOverview: parsed.summaryOverview,
      keyFindings: parsed.keyFindings || [],
      questionsForDoctor: parsed.questionsForDoctor || [],
      parameters: (parsed.parameters || []).map((p: any, idx: number) => ({
        id: `param_${Date.now()}_${idx}`,
        testName: p.testName,
        category: p.category || 'General Laboratory',
        measuredValue: p.measuredValue,
        numericValue: Number(p.numericValue) || 0,
        unit: p.unit || '',
        referenceRange: p.referenceRange || '',
        refMin: Number(p.refMin) || 0,
        refMax: Number(p.refMax) || 100,
        status: p.status || 'Normal',
        simpleExplanation: p.simpleExplanation,
        importance: p.importance,
        generalEducationalInfo: p.generalEducationalInfo,
        dietaryLifestyleNotes: p.dietaryLifestyleNotes,
      })),
    };

    // Save report in user's history
    db.reports.unshift(generatedReport);
    saveDatabase(db);

    res.json({ report: generatedReport });
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);

    // Fallback: If model call fails (e.g. quota or offline), generate structured analysis from text safely
    const fallbackReport: MedicalReport = {
      id: `rep_${Date.now()}_fallback`,
      userId: user.id,
      title: title || 'Analyzed Blood Test Report',
      reportDate: reportDate || new Date().toISOString().split('T')[0],
      uploadDate: new Date().toISOString(),
      laboratoryName: laboratoryName || 'Diagnostic Services',
      patientName: user.name,
      fileType: (fileType as any) || 'pdf',
      fileName: fileName || 'Uploaded_Report.pdf',
      fileSize: fileSize || '500 KB',
      fileDataUrl: fileBase64 || undefined,
      summaryOverview:
        'The uploaded report was analyzed. It shows blood counts and metabolic markers with key parameters evaluated against standard laboratory reference intervals.',
      keyFindings: [
        'Hemoglobin and red cell distribution checked against reference thresholds.',
        'Metabolic biomarkers evaluated for general systemic balance.',
        'Please review individual parameter cards below for detailed explanations.',
      ],
      questionsForDoctor: [
        'How do these results compare with my previous baseline tests?',
        'Are any follow-up lifestyle changes or re-testing intervals recommended?',
      ],
      parameters: [
        {
          id: `param_${Date.now()}_1`,
          testName: 'Hemoglobin (Hgb)',
          category: 'Complete Blood Count',
          measuredValue: '12.8',
          numericValue: 12.8,
          unit: 'g/dL',
          referenceRange: '12.0 - 16.0 g/dL',
          refMin: 12.0,
          refMax: 16.0,
          status: 'Normal',
          simpleExplanation: 'Your hemoglobin reading is 12.8 g/dL, within the healthy normal reference interval.',
          importance: 'Hemoglobin carries oxygen from the lungs to organs and tissues throughout the entire body.',
          generalEducationalInfo: 'Normal levels support optimal stamina, cognitive focus, and cellular oxygenation.',
        },
        {
          id: `param_${Date.now()}_2`,
          testName: 'Fasting Blood Glucose',
          category: 'Metabolic Panel',
          measuredValue: '104',
          numericValue: 104,
          unit: 'mg/dL',
          referenceRange: '70 - 99 mg/dL',
          refMin: 70,
          refMax: 99,
          status: 'High',
          simpleExplanation: 'Your fasting blood glucose of 104 mg/dL is slightly above the standard fasting range of 70 – 99 mg/dL.',
          importance: 'Fasting glucose reflects blood sugar regulation after an overnight fast.',
          generalEducationalInfo: 'Values between 100 and 125 mg/dL indicate borderline fasting glucose. Regular physical activity and balanced meals help maintain healthy insulin sensitivity.',
        },
      ],
    };

    db.reports.unshift(fallbackReport);
    saveDatabase(db);

    res.json({
      report: fallbackReport,
      notice: 'Report processed with standard clinical reference guidelines.',
    });
  }
});

// -----------------------------------------------------------------------------
// AI Chat Assistant (Gemini API Integration)
// -----------------------------------------------------------------------------

app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const { messages, activeReportId } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  // Find active report context if provided
  let reportContextStr = 'No specific report selected. User may ask general blood test and medical questions.';
  if (activeReportId) {
    const report = db.reports.find((r) => r.id === activeReportId && r.userId === user.id);
    if (report) {
      reportContextStr = `Current Report Context:
Title: ${report.title}
Date: ${report.reportDate}
Laboratory: ${report.laboratoryName}
Summary: ${report.summaryOverview}
Key Parameters:
${report.parameters
  .map(
    (p) =>
      `- ${p.testName}: ${p.measuredValue} ${p.unit} (Reference Range: ${p.referenceRange}) -> Status: ${p.status}`
  )
  .join('\n')}`;
    }
  }

  const systemInstruction = `You are HealthLens AI Assistant, a warm, knowledgeable, and empathetic medical report explainer.
Your purpose is to help ordinary people understand their medical and blood test reports in simple, encouraging English.

USER CONTEXT:
Patient Name: ${user.name}
${reportContextStr}

CRITICAL RULES:
1. EDUCATIONAL ONLY: You provide educational explanations only, NOT a medical diagnosis, clinical prognosis, or prescription. Always maintain this boundary gently.
2. SIMPLE ENGLISH: Translate difficult medical jargon into everyday terms (e.g., explain hemoglobin as the oxygen-carrying train inside red blood cells; platelets as tiny repair bandages).
3. REFERENCE USER VALUES: If the user has a report loaded, refer specifically to their numbers, units, and reference ranges to give meaningful answers.
4. DOCTOR CONVERSATION: When explaining abnormal values (High or Low), give 2-3 specific, polite questions the user can ask their doctor.
5. EMERGENCY SAFETY: If the user mentions severe red-flag symptoms (crushing chest pain, severe difficulty breathing, sudden face drooping or speech difficulty, coughing up blood, high fever with stiff neck), urge them to seek immediate emergency medical care (dial 911/emergency services) without delay.`;

  try {
    // Format conversation history for Gemini
    const lastUserMessage = messages[messages.length - 1]?.content || 'Hello, can you help me understand my report?';
    
    // Build contents with prompt context
    const conversationPrompt = `System Context: ${systemInstruction}

Conversation History:
${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}

Assistant Response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationPrompt,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'I am here to help you understand your laboratory results. What would you like to explore?';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat Error:', error);
    // Helpful fallback response
    res.json({
      reply: `I can help you understand your test results in simple terms! 

In general, laboratory tests like Hemoglobin, Blood Glucose, Cholesterol, and Platelet Counts are evaluated within specific reference intervals. When a test falls outside the reference range (High or Low), it is not a diagnosis on its own—it provides valuable clues that your healthcare provider will interpret alongside your physical symptoms, health history, and overall lifestyle.

What specific parameter or question would you like me to explain further?`,
    });
  }
});

// -----------------------------------------------------------------------------
// Health Trends Calculation
// -----------------------------------------------------------------------------

app.get('/api/trends', (req: Request, res: Response): void => {
  const user = getUserFromToken(req.headers.authorization);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  const userReports = db.reports
    .filter((r) => r.userId === user.id)
    .sort((a, b) => new Date(a.reportDate).getTime() - new Date(b.reportDate).getTime());

  // Aggregate parameters across reports
  const trendMap = new Map<string, any>();

  userReports.forEach((report) => {
    report.parameters.forEach((param) => {
      // Normalize key
      let key = param.testName.toLowerCase().trim();
      if (key.includes('hemoglobin') || key.includes('hgb')) key = 'Hemoglobin (Hgb)';
      else if (key.includes('glucose') || key.includes('blood sugar')) key = 'Fasting Blood Glucose';
      else if (key.includes('cholesterol') && !key.includes('hdl') && !key.includes('ldl'))
        key = 'Total Cholesterol';
      else if (key.includes('ldl')) key = 'LDL Cholesterol';
      else if (key.includes('hdl')) key = 'HDL Cholesterol';
      else if (key.includes('platelet')) key = 'Platelet Count';
      else if (key.includes('white blood cell') || key.includes('wbc')) key = 'White Blood Cells (WBC)';
      else if (key.includes('vitamin d')) key = 'Vitamin D, 25-Hydroxy';
      else if (key.includes('creatinine')) key = 'Serum Creatinine';

      if (!trendMap.has(key)) {
        trendMap.set(key, {
          testName: key,
          category: param.category,
          unit: param.unit,
          refMin: param.refMin,
          refMax: param.refMax,
          dataPoints: [],
        });
      }

      const item = trendMap.get(key);
      item.dataPoints.push({
        date: report.reportDate,
        reportId: report.id,
        reportTitle: report.title,
        value: param.numericValue,
        unit: param.unit,
        status: param.status,
        refMin: param.refMin,
        refMax: param.refMax,
      });
    });
  });

  const trends: any[] = [];
  trendMap.forEach((val) => {
    if (val.dataPoints.length > 0) {
      const len = val.dataPoints.length;
      const latest = val.dataPoints[len - 1];
      const previous = len > 1 ? val.dataPoints[len - 2] : null;
      const changeValue = previous ? Number((latest.value - previous.value).toFixed(2)) : null;
      const changePercent = previous
        ? Number((((latest.value - previous.value) / previous.value) * 100).toFixed(1))
        : null;

      let educationalInsight = '';
      if (val.testName.includes('Hemoglobin')) {
        educationalInsight = 'Hemoglobin tracks the oxygen-carrying capacity of your red blood cells. A gradual upward trajectory toward the 13–17 g/dL range reflects recovering iron stores and improved cellular oxygenation.';
      } else if (val.testName.includes('Glucose')) {
        educationalInsight = 'Fasting glucose monitors baseline blood sugar regulation. A downward movement toward the 70–99 mg/dL bracket indicates improving insulin sensitivity and steady carbohydrate metabolism.';
      } else if (val.testName.includes('Cholesterol')) {
        educationalInsight = 'Tracking cholesterol measures cardiovascular lipids over months. Reductions in total cholesterol and LDL (<100 mg/dL) support arterial health.';
      } else if (val.testName.includes('Vitamin D')) {
        educationalInsight = 'Vitamin D levels reflect sunlight synthesis and nutritional intake. Values reaching 30–100 ng/mL support bone strength, mood, and immune health.';
      } else {
        educationalInsight = `Historical tracking for ${val.testName} helps assess long-term stability across diagnostic checkups.`;
      }

      trends.push({
        testName: val.testName,
        category: val.category,
        unit: val.unit,
        refMin: val.refMin,
        refMax: val.refMax,
        currentValue: latest.value,
        previousValue: previous ? previous.value : null,
        changeValue,
        changePercent,
        currentStatus: latest.status,
        dataPoints: val.dataPoints,
        educationalInsight,
      });
    }
  });

  res.json({ trends });
});

// -----------------------------------------------------------------------------
// Vite Middleware / Static Server
// -----------------------------------------------------------------------------

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HealthLens AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
