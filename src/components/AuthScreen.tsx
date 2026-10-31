import React, { useState } from 'react';
import { UserProfile } from '../types/medical';
import { api } from '../services/api';
import {
  Activity,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  FileText,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onSuccess: (user: UserProfile) => void;
}

export const AuthScreen: React.FC<Props> = ({ onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match. Please verify both entries.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const res = await api.register({
          email,
          password,
          name: name.trim() || undefined,
        });
        onSuccess(res.user);
      } else {
        const res = await api.login({ email, password });
        onSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login({
        email: 'alex.morgan@healthlens.ai',
        password: 'password123',
      });
      onSuccess(res.user);
    } catch {
      // If demo user doesn't exist, create it
      try {
        const res = await api.register({
          email: 'alex.morgan@healthlens.ai',
          password: 'password123',
          name: 'Alex Morgan',
        });
        onSuccess(res.user);
      } catch (err: any) {
        setError(err.message || 'Demo login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDemoLogin = () => {
    setIsSignUp(false);
    setEmail('alex.morgan@healthlens.ai');
    setPassword('password123');
    setError(null);
  };

  const handleAutoFillDemoSignUp = () => {
    setIsSignUp(true);
    setName('Alex Morgan');
    setEmail('alex.newaccount@healthlens.ai');
    setPassword('password123');
    setConfirmPassword('password123');
    setError(null);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true);
    try {
      await api.forgotPassword(forgotEmail);
      setForgotSuccess(true);
    } catch {
      setForgotSuccess(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">
      {/* Left Column: Visual Storytelling & Platform Value */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/src/assets/images/healthlens_auth_hero_1793382084826.jpg"
            alt="Clinical Laboratory Diagnostics"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
        </div>

        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">
              HealthLens <span className="text-teal-400">AI</span>
            </span>
            <p className="text-xs text-slate-300">Understand Your Health Better</p>
          </div>
        </div>

        {/* Center Editorial Value Proposition */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Private Patient-Centric Health Intelligence</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Demystify your blood tests with AI-powered clarity.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Translate confusing laboratory terminology, reference intervals, and chemical flags into simple, actionable English designed for everyday people.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Plain English Reports</p>
                <p className="text-xs text-slate-400">Every parameter explained with its health role.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Health Trends</p>
                <p className="text-xs text-slate-400">Track changes in glucose, lipids & hemoglobin over time.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Multi-Format OCR</p>
                <p className="text-xs text-slate-400">Upload PDF, JPG, PNG or camera photos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Secure Data Vault</p>
                <p className="text-xs text-slate-400">User-isolated records with client-level privacy.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800 pt-4 flex items-center justify-between">
          <span>HealthLens AI Platform · Diagnostic Educational Explainer</span>
          <span>HIPAA-Minded Architecture</span>
        </div>
      </div>

      {/* Right Column: Premium Authentication Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Header */}
          <div className="lg:hidden text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-xl bg-teal-600 items-center justify-center text-white shadow-md">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">HealthLens AI</h2>
            <p className="text-sm text-slate-500">Understand your blood reports in simple English</p>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {isSignUp ? 'Create your health account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isSignUp
                ? 'Join to upload, explain, and securely track your medical reports'
                : 'Enter your credentials to access your personal health reports'}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-200/70 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Demo Credentials Visual Banner with 1-Click Auto-Fill */}
          {!isSignUp ? (
            <div className="p-3.5 bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
                  <span>Demo Login Credentials:</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillDemoLogin}
                  className="text-[11px] font-bold text-teal-800 bg-white hover:bg-teal-100/70 border border-teal-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                >
                  ⚡ Auto-fill Form
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div
                  onClick={handleAutoFillDemoLogin}
                  className="p-2 bg-white rounded-lg border border-teal-100 cursor-pointer hover:border-teal-300 transition-colors"
                  title="Click to copy and fill"
                >
                  <span className="text-[10px] text-slate-400 block font-sans font-medium">Email:</span>
                  <span className="text-slate-900 font-bold select-all truncate block">alex.morgan@healthlens.ai</span>
                </div>
                <div
                  onClick={handleAutoFillDemoLogin}
                  className="p-2 bg-white rounded-lg border border-teal-100 cursor-pointer hover:border-teal-300 transition-colors"
                  title="Click to copy and fill"
                >
                  <span className="text-[10px] text-slate-400 block font-sans font-medium">Password:</span>
                  <span className="text-slate-900 font-bold select-all truncate block">password123</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-600 inline-block" />
                  <span>Demo New Account Details:</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillDemoSignUp}
                  className="text-[11px] font-bold text-sky-800 bg-white hover:bg-sky-100/70 border border-sky-300 px-2.5 py-1 rounded-lg transition-colors shadow-2xs"
                >
                  ⚡ Auto-fill Sign Up
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                <div
                  onClick={handleAutoFillDemoSignUp}
                  className="p-2 bg-white rounded-lg border border-sky-100 cursor-pointer hover:border-sky-300 transition-colors"
                  title="Click to copy and fill"
                >
                  <span className="text-[10px] text-slate-400 block font-sans font-medium">New Email:</span>
                  <span className="text-slate-900 font-bold select-all truncate block">alex.newaccount@healthlens.ai</span>
                </div>
                <div
                  onClick={handleAutoFillDemoSignUp}
                  className="p-2 bg-white rounded-lg border border-sky-100 cursor-pointer hover:border-sky-300 transition-colors"
                  title="Click to copy and fill"
                >
                  <span className="text-[10px] text-slate-400 block font-sans font-medium">New Password:</span>
                  <span className="text-slate-900 font-bold select-all truncate block">password123</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Main Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required={isSignUp}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {isSignUp ? 'Create Password' : 'Password'}
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setShowForgotModal(true);
                      setForgotSuccess(false);
                    }}
                    className="text-xs font-medium text-teal-600 hover:text-teal-700"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required={isSignUp}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In to HealthLens'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Test Access Button */}
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-xs text-slate-400 uppercase tracking-wider font-medium">
                Instant Evaluation
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300/80 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Explore Demo Account (Alex Morgan)</span>
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Pre-loaded with CBC, Lipid Profile, and Metabolic Panels ready to inspect.
            </p>
          </div>

          {/* Security & Educational Note */}
          <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200/60 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Privacy & Medical Purpose</span>
            </div>
            <p className="leading-relaxed">
              Your medical reports remain confidential in your private account. HealthLens AI is for educational interpretation and does not provide clinical diagnoses.
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Reset Your Password</h3>
                <p className="text-xs text-slate-500">We'll send password reset instructions</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-800 text-sm space-y-1">
                  <p className="font-semibold">Reset instructions sent!</p>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    Check your inbox at <strong>{forgotEmail}</strong> for the secure password reset link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      Your Registered Email
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotEmail('alex.morgan@healthlens.ai')}
                      className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
                    >
                      Use Demo Email
                    </button>
                  </div>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl"
                  >
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
