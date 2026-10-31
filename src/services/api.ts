import { MedicalReport, UserProfile, ParameterTrend } from '../types/medical';

const TOKEN_KEY = 'healthlens_auth_token';
const USER_KEY = 'healthlens_user_profile';

export const api = {
  // Token Management
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAuth(token: string, user: UserProfile): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getStoredUser(): UserProfile | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  // Auth Endpoints
  async register(params: {
    email: string;
    password: string;
    name?: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
  }): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed.');
    }
    this.setAuth(data.token, data.user);
    return data;
  },

  async login(params: {
    email: string;
    password: string;
  }): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed.');
    }
    this.setAuth(data.token, data.user);
    return data;
  },

  async checkSession(): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getHeaders(),
      });
      if (!res.ok) {
        this.clearAuth();
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return this.getStoredUser();
    }
  },

  async updateProfile(params: {
    name?: string;
    avatar?: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
  }): Promise<UserProfile> {
    const res = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile.');
    }
    const token = this.getToken();
    if (token) {
      this.setAuth(token, data.user);
    }
    return data.user;
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Reports Endpoints
  async getReports(): Promise<MedicalReport[]> {
    const res = await fetch('/api/reports', {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to load reports.');
    }
    const data = await res.json();
    return data.reports || [];
  },

  async saveReport(report: Partial<MedicalReport>): Promise<MedicalReport> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      throw new Error('Failed to save report.');
    }
    const data = await res.json();
    return data.report;
  },

  async deleteReport(id: string): Promise<boolean> {
    const res = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to delete report.');
    }
    return true;
  },

  async analyzeReport(payload: {
    text?: string;
    fileBase64?: string;
    fileMimeType?: string;
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    title?: string;
    laboratoryName?: string;
    reportDate?: string;
  }): Promise<MedicalReport> {
    const res = await fetch('/api/reports/analyze', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to analyze report.');
    }
    return data.report;
  },

  // AI Chat Assistant
  async sendChatMessage(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
    activeReportId?: string
  ): Promise<string> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ messages, activeReportId }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to get chat response.');
    }
    return data.reply;
  },

  // Health Trends
  async getTrends(): Promise<ParameterTrend[]> {
    const res = await fetch('/api/trends', {
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error('Failed to load health trends.');
    }
    const data = await res.json();
    return data.trends || [];
  },
};
