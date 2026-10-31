import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  FileText,
  History,
  TrendingUp,
  Stethoscope,
  MessageSquareHeart,
  Settings,
  LogOut,
  X,
  ShieldAlert,
} from 'lucide-react';

interface Props {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<Props> = ({
  currentView,
  onNavigate,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Report', icon: UploadCloud },
    { id: 'explanation', label: 'AI Report Explanation', icon: FileText },
    { id: 'history', label: 'Report History', icon: History },
    { id: 'trends', label: 'Health Trends', icon: TrendingUp },
    { id: 'symptoms', label: 'Symptoms Guide', icon: Stethoscope },
    { id: 'chat', label: 'AI Health Chat', icon: MessageSquareHeart },
    { id: 'profile', label: 'Profile & Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Mobile Header Close */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
            <span className="text-sm font-bold text-slate-800">Navigation</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <div className="p-3 space-y-1">
            <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Health Navigation
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Area: Logout & Education notice */}
        <div className="p-3 border-t border-slate-200/80 space-y-2">
          <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 leading-normal flex items-start gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <span>Educational Explainer. Always consult your doctor.</span>
          </div>

          <button
            onClick={() => {
              onLogout();
              onCloseMobile();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
