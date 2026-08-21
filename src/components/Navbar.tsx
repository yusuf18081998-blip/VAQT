import React, { useState, useEffect } from 'react';
import {
  Clock,
  Timer,
  Flame,
  Hourglass,
  Sun,
  Moon,
  Volume2,
  Maximize2,
  Minimize2,
  TrendingUp,
  Languages,
  Bell,
  BellRing,
  Download,
  Keyboard,
  Sparkles,
  Palette,
  TreePine,
} from 'lucide-react';
import { TabType, ThemeMode, UserProfile } from '../types';
import { Language, TRANSLATIONS } from '../utils/translations';
import { binauralEngine } from '../utils/binauralEngine';
import { SoundStatusIndicator } from './SoundStatusIndicator';
import { GoogleAuthButton } from './GoogleAuthButton';
import { UserLocationInfo } from '../utils/locationService';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenSoundModal: () => void;
  onOpenShortcutsModal: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  deferredPrompt: any;
  onInstallApp: () => void;
  user: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  userLocation: UserLocationInfo;
  onOpenAdminModal?: () => void;
  onOpenGardenModal?: () => void;
  treesCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  lang,
  setLang,
  onOpenSoundModal,
  onOpenShortcutsModal,
  isFullscreen,
  toggleFullscreen,
  deferredPrompt,
  onInstallApp,
  user,
  onUserChange,
  userLocation,
  onOpenAdminModal,
  onOpenGardenModal,
  treesCount = 0,
}) => {
  const t = TRANSLATIONS[lang];
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [showThemeMenu, setShowThemeMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const requestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setHasNotificationPermission(permission === 'granted');
      if (permission === 'granted') {
        new Notification('VAQT Pomodoro', {
          body: 'Bildirishnomalar muvaffaqiyatli faollashtirildi!',
          icon: '/icon-192.svg',
        });
      }
    }
  };

  const tabs = [
    { id: 'pomodoro' as TabType, label: t.nav.pomodoro, icon: Flame, badge: 'FOCUS' },
    { id: 'clock' as TabType, label: t.nav.clock, icon: Clock },
    { id: 'stopwatch' as TabType, label: t.nav.stopwatch, icon: Timer },
    { id: 'countdown' as TabType, label: t.nav.countdown, icon: Hourglass },
    { id: 'analytics' as TabType, label: t.nav.analytics, icon: TrendingUp, highlight: true },
  ];

  const themes: { id: ThemeMode; label: string; bg: string }[] = [
    { id: 'dark', label: t.themes.dark, bg: 'bg-slate-950 border-slate-700' },
    { id: 'light', label: t.themes.light, bg: 'bg-slate-100 border-slate-300' },
    { id: 'cyber', label: t.themes.cyber, bg: 'bg-purple-950 border-pink-500' },
    { id: 'forest', label: t.themes.forest, bg: 'bg-emerald-950 border-emerald-500' },
    { id: 'sunset', label: t.themes.sunset, bg: 'bg-amber-950 border-orange-500' },
    { id: 'oled', label: t.themes.oled, bg: 'bg-black border-neutral-800' },
  ];

  return (
    <header className="w-full rounded-3xl backdrop-blur-2xl bg-slate-900/80 dark:bg-slate-950/85 border border-indigo-500/20 shadow-2xl p-3 sm:p-4 flex flex-col xl:flex-row items-center justify-between gap-3 sm:gap-4 transition-all duration-300 z-30">
      {/* Brand & Quick Tools */}
      <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setActiveTab('pomodoro')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 group-hover:scale-105 transition transform">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-wider text-white font-mono">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30">
                PRO FOCUS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action bar for mobile/desktop top */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick Sound Mute/Unmute Indicator */}
          <SoundStatusIndicator compact={false} showHotkey={true} className="hidden sm:flex" />
          <SoundStatusIndicator compact={true} className="sm:hidden" />

          {/* Garden Land & Planted Trees Button */}
          {onOpenGardenModal && (
            <button
              onClick={onOpenGardenModal}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold shadow-md shadow-emerald-600/10 active:scale-95"
              title={t.garden.title}
            >
              <TreePine className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{t.pomodoro.myGardenBtn}</span>
              {treesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-[10px] text-emerald-200">
                  {treesCount}
                </span>
              )}
            </button>
          )}

          {/* Soundscape & Visualizer Button */}
          <button
            onClick={onOpenSoundModal}
            className="px-2.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold shadow-md shadow-indigo-600/10 active:scale-95"
            title={t.soundscapes.title}
          >
            <Volume2 className="w-4 h-4 text-pink-400" />
            <span className="hidden md:inline">Panel</span>
          </button>

          {/* Notifications Requester */}
          <button
            onClick={requestNotification}
            className={`p-2 rounded-xl border transition ${
              hasNotificationPermission
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={hasNotificationPermission ? t.actions.notificationsEnabled : t.actions.enableNotifications}
          >
            {hasNotificationPermission ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>

          {/* Google Sign-In & User Profile Button */}
          <GoogleAuthButton
            user={user}
            onUserChange={onUserChange}
            userLocation={userLocation}
            onOpenAdminModal={onOpenAdminModal}
          />

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase transition flex items-center gap-1"
              title="Tilni tanlash (UZ / EN / RU)"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 w-28 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 flex flex-col gap-1 z-50 animate-fade-in">
                {(['uz', 'en', 'ru'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setShowLangMenu(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold text-left transition ${
                      lang === l ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {l === 'uz' ? "O'zbek" : l === 'en' ? 'English' : 'Русский'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title="Mavzular (Theme)"
            >
              <Palette className="w-4 h-4 text-amber-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute top-full right-0 mt-2 w-44 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 flex flex-col gap-1 z-50 animate-fade-in">
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => {
                      setTheme(th.id);
                      setShowThemeMenu(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition flex items-center gap-2 ${
                      theme === th.id
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border ${th.bg}`} />
                    <span>{th.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* PWA Install Button if available */}
          {deferredPrompt && (
            <button
              onClick={onInstallApp}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-lg shadow-pink-600/30 animate-pulse"
              title="Ilovani o'rnatish (PWA)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install</span>
            </button>
          )}

          {/* Keyboard Shortcuts Trigger */}
          <button
            onClick={onOpenShortcutsModal}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 transition hidden sm:flex items-center"
            title="Tezkor tugmalar (Hotkeys - ? / H)"
          >
            <Keyboard className="w-4 h-4 text-slate-400" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
            title="To'liq ekran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <nav className="flex items-center bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 w-full xl:w-auto overflow-x-auto justify-start sm:justify-center gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap relative active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? 'text-white' : tab.highlight ? 'text-pink-400' : 'text-slate-400'
                }`}
              />
              <span>{tab.label}</span>
              {tab.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
