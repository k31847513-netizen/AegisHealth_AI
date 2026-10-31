import React, { useState, useEffect } from 'react';
import { UserProfile, MedicalReport } from './types/medical';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { UploadReportView } from './components/UploadReportView';
import { ReportExplanationView } from './components/ReportExplanationView';
import { ReportHistoryView } from './components/ReportHistoryView';
import { HealthTrendsView } from './components/HealthTrendsView';
import { SymptomsGuideView } from './components/SymptomsGuideView';
import { AIChatView } from './components/AIChatView';
import { ProfileSettingsView } from './components/ProfileSettingsView';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [activeReport, setActiveReport] = useState<MedicalReport | null>(null);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>();
  const [chatReportId, setChatReportId] = useState<string | undefined>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check existing session on load
  useEffect(() => {
    async function initSession() {
      try {
        const existingUser = await api.checkSession();
        if (existingUser) {
          setUser(existingUser);
          await loadUserReports();
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    initSession();
  }, []);

  const loadUserReports = async () => {
    try {
      const userReports = await api.getReports();
      setReports(userReports);
      if (userReports.length > 0) {
        setActiveReport((prev) => prev || userReports[0]);
      }
    } catch (err) {
      console.error('Failed to load user reports:', err);
    }
  };

  const handleLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    await loadUserReports();
  };

  const handleLogout = () => {
    api.clearAuth();
    setUser(null);
    setReports([]);
    setActiveReport(null);
    setCurrentView('dashboard');
  };

  const handleReportAnalyzed = (newReport: MedicalReport) => {
    setReports((prev) => [newReport, ...prev]);
    setActiveReport(newReport);
    setCurrentView('explanation');
  };

  const handleDeleteReport = async (id: string) => {
    await api.deleteReport(id);
    const updated = reports.filter((r) => r.id !== id);
    setReports(updated);
    if (activeReport?.id === id) {
      setActiveReport(updated[0] || null);
    }
  };

  const handleClearAllReports = async () => {
    for (const r of reports) {
      await api.deleteReport(r.id);
    }
    setReports([]);
    setActiveReport(null);
  };

  const handleNavigateToChat = (prompt?: string, reportId?: string) => {
    setChatInitialPrompt(prompt);
    setChatReportId(reportId);
    setCurrentView('chat');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500/30 border-t-teal-600 rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-700">Loading HealthLens AI...</span>
        </div>
      </div>
    );
  }

  // First page: Authentication Screen
  if (!user) {
    return <AuthScreen onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        reportsCount={reports.length}
        onNavigate={(view) => setCurrentView(view)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Main 9-Item Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'logout') {
              handleLogout();
            } else {
              setCurrentView(view);
            }
          }}
          onLogout={handleLogout}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentView === 'dashboard' && (
            <DashboardView
              user={user}
              reports={reports}
              onNavigate={(view, repId) => {
                if (repId) {
                  const rep = reports.find((r) => r.id === repId);
                  if (rep) setActiveReport(rep);
                }
                setCurrentView(view);
              }}
              onSelectReport={(rep) => {
                setActiveReport(rep);
                setCurrentView('explanation');
              }}
            />
          )}

          {currentView === 'upload' && (
            <UploadReportView onReportAnalyzed={handleReportAnalyzed} />
          )}

          {currentView === 'explanation' && (
            <ReportExplanationView
              activeReport={activeReport}
              allReports={reports}
              onSelectReport={(rep) => setActiveReport(rep)}
              onNavigateToChat={handleNavigateToChat}
              onNavigateToUpload={() => setCurrentView('upload')}
            />
          )}

          {currentView === 'history' && (
            <ReportHistoryView
              reports={reports}
              onSelectReport={(rep) => {
                setActiveReport(rep);
                setCurrentView('explanation');
              }}
              onDeleteReport={handleDeleteReport}
              onNavigateToUpload={() => setCurrentView('upload')}
            />
          )}

          {currentView === 'trends' && <HealthTrendsView />}

          {currentView === 'symptoms' && <SymptomsGuideView />}

          {currentView === 'chat' && (
            <AIChatView
              user={user}
              reports={reports}
              initialPrompt={chatInitialPrompt}
              initialReportId={chatReportId || activeReport?.id}
            />
          )}

          {currentView === 'profile' && (
            <ProfileSettingsView
              user={user}
              reports={reports}
              onLogout={handleLogout}
              onClearAllReports={handleClearAllReports}
              onUpdateUser={(updated) => setUser(updated)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
