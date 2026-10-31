import React, { useState, useRef } from 'react';
import { UserProfile, MedicalReport } from '../types/medical';
import { api } from '../services/api';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';
import {
  User,
  Mail,
  ShieldCheck,
  Download,
  Trash2,
  Lock,
  Heart,
  Calendar,
  CheckCircle2,
  LogOut,
  AlertCircle,
  Camera,
  Upload,
  Check,
} from 'lucide-react';

interface Props {
  user: UserProfile;
  reports: MedicalReport[];
  onLogout: () => void;
  onClearAllReports: () => Promise<void>;
  onUpdateUser?: (updated: UserProfile) => void;
}

export const ProfileSettingsView: React.FC<Props> = ({
  user,
  reports,
  onLogout,
  onClearAllReports,
  onUpdateUser,
}) => {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(
    user.avatar || '/src/assets/images/avatar_man_alex_1793465339123.jpg'
  );
  const [age, setAge] = useState(user.age || 34);
  const [gender, setGender] = useState(user.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(user.bloodGroup || 'O+');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Curated male profile photos & clinical portraits
  const maleAvatars = [
    {
      id: 'alex-modern',
      title: 'Alex (Default Male Portrait)',
      path: '/src/assets/images/avatar_man_alex_1793465339123.jpg',
      description: 'Modern clean portrait, navy shirt',
    },
    {
      id: 'alex-glasses',
      title: 'Professional with Glasses',
      path: '/src/assets/images/avatar_man_glasses_1793465339343.jpg',
      description: 'Studio portrait, dark glasses',
    },
    {
      id: 'dr-marcus',
      title: 'Physician (Dr. Marcus)',
      path: '/src/assets/images/avatar_dr_marcus_1793382086423.jpg',
      description: 'Clinical consultation attire',
    },
    {
      id: 'dr-sarah',
      title: 'Physician (Dr. Sarah)',
      path: '/src/assets/images/avatar_dr_sarah_1793382086582.jpg',
      description: 'Clinical consultation attire',
    },
  ];

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (JPG, PNG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await api.updateProfile({
        name,
        avatar,
        age,
        gender,
        bloodGroup,
      });

      if (onUpdateUser) {
        onUpdateUser(updated);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    const payload = {
      userProfile: {
        id: user.id,
        name,
        email: user.email,
        avatar,
        age,
        gender,
        bloodGroup,
      },
      exportDate: new Date().toISOString(),
      reportsCount: reports.length,
      reports,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HealthLens_Vault_${user.name.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your patient profile photo, personal information, and health vault
          </p>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-2 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Account</span>
        </button>
      </div>

      <MedicalDisclaimerBanner compact />

      {savedSuccess && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-teal-800 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>Profile and photo updated successfully!</span>
        </div>
      )}

      {/* 1. Profile Photo Selection Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-teal-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Profile Photo (Men's & Clinical Portraits)
              </h2>
              <p className="text-xs text-slate-500">
                Choose a high-resolution male profile photo or upload your own
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>Upload Custom Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomUpload}
          />
        </div>

        {/* Current Avatar Spotlight & Grid */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
          {/* Active Preview */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              <img
                src={avatar}
                alt="Active profile preview"
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-teal-500/20 shadow-md"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-2 -right-1 bg-teal-600 text-white p-1 rounded-full shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-600">Active Photo</span>
          </div>

          {/* Preset Male Avatars Grid */}
          <div className="flex-1 w-full space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">
              Curated Male Avatars:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {maleAvatars.map((opt) => {
                const isSelected = avatar === opt.path;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setAvatar(opt.path)}
                    className={`relative p-2 rounded-xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={opt.path}
                      alt={opt.title}
                      className="w-16 h-16 rounded-xl object-cover mx-auto mb-1.5 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[11px] font-bold text-slate-900 truncate">
                      {opt.title}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {opt.description}
                    </p>
                    {isSelected && (
                      <span className="absolute top-1 right-1 bg-teal-600 text-white rounded-full p-0.5 shadow-xs">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Patient Profile Form */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-5">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Personal Medical Details
          </h2>
          <p className="text-xs text-slate-500">
            Basic demographic info used to calibrate reference intervals in health reports
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Patient Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full text-xs sm:text-sm p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div>
              <label htmlFor="profile-gender-select" className="block text-xs font-semibold text-slate-700 mb-1">
                Biological Sex / Gender
              </label>
              <select
                id="profile-gender-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-blood-group" className="block text-xs font-semibold text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                id="select-blood-group"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save Profile & Photo</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Privacy & Data Security Vault */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Privacy, Security & Data Ownership
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Your medical records and extracted values are stored strictly under your isolated user account. You have full ownership of your data, with zero telemetry or sharing with unauthorized parties.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Export Data */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs">
              <Download className="w-4 h-4 text-teal-600" />
              <span>Export Health Vault Data</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Download a complete JSON export of all your uploaded laboratory reports, parameter readings, and historical AI explanations.
            </p>
            <button
              onClick={handleExportData}
              className="mt-1 px-3.5 py-1.5 bg-white border border-slate-300 hover:border-teal-500 text-slate-800 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>Download Health Archive ({reports.length} Reports)</span>
            </button>
          </div>

          {/* Delete Data */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-semibold text-xs">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Clear Medical Records</span>
            </div>
            <p className="text-[11px] text-rose-800/80 leading-relaxed">
              Permanently purge all diagnostic reports and explanations stored under this account.
            </p>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="mt-1 px-3.5 py-1.5 bg-white border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Clear All Vault Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Clear All Reports?</h3>
                <p className="text-xs text-slate-500">Irreversible action</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to clear all {reports.length} reports in your health vault?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onClearAllReports();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
