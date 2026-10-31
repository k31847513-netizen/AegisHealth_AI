import React from 'react';
import { UserProfile } from '../types/medical';
import { Activity, UploadCloud, Menu, ShieldCheck } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onNavigate: (view: string) => void;
  onToggleMobileMenu: () => void;
  reportsCount: number;
}

export const Navbar: React.FC<Props> = ({
  user,
  onNavigate,
  onToggleMobileMenu,
  reportsCount,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-6">
      {/* Zone 1: Brand wordmark & mobile burger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-sky-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 whitespace-nowrap">
              HealthLens <span className="text-teal-600 font-extrabold">AI</span>
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Informational trust indicator */}
      <div className="hidden md:flex items-center gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100/80 rounded-full text-slate-700 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Private & Encrypted Health Vault</span>
        </div>
        <span aria-hidden="true">·</span>
        <span>{reportsCount} {reportsCount === 1 ? 'Report' : 'Reports'} Analyzed</span>
      </div>

      {/* Zone 3: Primary Action & User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Report</span>
        </button>

        {user && (
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
            title="Profile & Settings"
          >
            <img
              src={user.avatar || '/src/assets/images/avatar_man_alex_1793465339123.jpg'}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/20"
              referrerPolicy="no-referrer"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[120px]">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
