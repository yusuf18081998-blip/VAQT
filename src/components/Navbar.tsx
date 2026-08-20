import React from 'react';
import { Clock, Timer, Flame, Hourglass, Code, Sun, Moon, Volume2, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { TabType, ThemeMode } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  onOpenSoundModal: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  onOpenSoundModal,
  isFullscreen,
  toggleFullscreen,
}) => {
  const tabs = [
    { id: 'clock' as TabType, label: 'Soat', icon: Clock },
    { id: 'stopwatch' as TabType, label: 'Sekundomer', icon: Timer },
    { id: 'pomodoro' as TabType, label: 'Pomodoro', icon: Flame },
    { id: 'countdown' as TabType, label: 'Taymer', icon: Hourglass },
    { id: 'source_code' as TabType, label: 'HTML/CSS/JS Kodlar', icon: Code, highlight: true },
  ];

  return (
    <header className="w-full rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-slate-900/45 border border-white/40 dark:border-white/10 shadow-xl shadow-indigo-950/5 dark:shadow-black/30 p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
      {/* Brand */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider text-slate-900 dark:text-white font-mono">VAQT</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aniq vaqt & Fokus platformasi</p>
          </div>
        </div>

        {/* Mobile quick actions */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            id="mobileThemeBtn"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            title="Mavzuni almashtirish"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
          <button
            id="mobileSoundBtn"
            onClick={onOpenSoundModal}
            className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-colors"
            title="Ovoz sozlamalari"
          >
            <Volume2 className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex items-center bg-slate-200/50 dark:bg-slate-950/50 p-1 rounded-xl border border-slate-300/40 dark:border-white/10 w-full md:w-auto overflow-x-auto justify-start sm:justify-center gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`navTab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-indigo-400' : 'text-slate-400 dark:text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.highlight && !isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-2">
        <button
          id="soundSettingsBtn"
          onClick={onOpenSoundModal}
          className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-sm flex items-center gap-1.5 text-xs font-medium"
          title="Signal va ovoz sozlamalari"
        >
          <Volume2 className="w-4 h-4 text-indigo-500" />
          <span>Ovoz</span>
        </button>

        <button
          id="themeToggleBtn"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-sm"
          title="Mavzuni almashtirish (Dark / Light)"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        <button
          id="fullscreenBtn"
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-105 transition-all shadow-sm"
          title="Toʻliq ekran rejimi"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
