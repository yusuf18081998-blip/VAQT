import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Flame,
  Timer,
  Hourglass,
  TrendingUp,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  MapPin,
  Navigation,
  X,
  Boxes,
  Sparkles,
} from 'lucide-react';
import {
  TabType,
  ThemeMode,
  UserProfile,
  TaskItem,
  AudioTrack,
  AlarmTone,
  TreeSpecies,
  PlantedTree,
  SystemAnnouncement,
  PomodoroConfig,
} from './types';
import { Navbar } from './components/Navbar';
import { PomodoroView } from './components/PomodoroView';
import { ClockView } from './components/ClockView';
import { StopwatchView } from './components/StopwatchView';
import { CountdownView } from './components/CountdownView';
import { AnalyticsView } from './components/AnalyticsView';
import { SoundscapeModal } from './components/SoundscapeModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Cyber3DScene } from './components/Cyber3DScene';
import { SecretAdminDashboard } from './components/SecretAdminDashboard';
import { BackgroundSettingsModal, PRESET_BACKGROUNDS } from './components/BackgroundSettingsModal';
import { ForestGardenModal } from './components/ForestGardenModal';
import { Language, TRANSLATIONS } from './utils/translations';
import { binauralEngine } from './utils/binauralEngine';
import { AnalyticsTracker, ADMIN_EMAIL } from './utils/analyticsTracker';
import { UserLocationInfo, requestGpsLocation, detectTimezoneLocation } from './utils/locationService';

export default function App() {
  // --- Active Tab State ---
  const [activeTab, setActiveTab] = useState<TabType>('pomodoro');

  // --- Multi-Language i18n State ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('vaqt_lang') as Language;
    return saved && ['uz', 'en', 'ru'].includes(saved) ? saved : 'uz';
  });

  useEffect(() => {
    localStorage.setItem('vaqt_lang', lang);
  }, [lang]);

  const t = TRANSLATIONS[lang];

  // --- 3D Scene State ---
  const [is3DEnabled, setIs3DEnabled] = useState<boolean>(() => {
    return localStorage.getItem('vaqt_3d_enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('vaqt_3d_enabled', String(is3DEnabled));
  }, [is3DEnabled]);

  // --- Theme Mode State ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme_preference') as ThemeMode;
    return saved || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme_preference', theme);
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'cyber', 'forest', 'sunset', 'oled');
    root.classList.add(theme === 'light' ? 'light' : 'dark');
  }, [theme]);

  // --- Fullscreen State ---
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // --- Modals State ---
  const [isSoundModalOpen, setIsSoundModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isBgModalOpen, setIsBgModalOpen] = useState<boolean>(false);
  const [isForestModalOpen, setIsForestModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // --- PWA Deferred Prompt ---
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  // --- User Profile & Geolocation ---
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vaqt_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  const [userLocation, setUserLocation] = useState<UserLocationInfo>(() => {
    try {
      const saved = localStorage.getItem('vaqt_user_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return detectTimezoneLocation();
  });

  // --- System Announcement ---
  const [systemAnnouncement, setSystemAnnouncement] = useState<SystemAnnouncement | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState<boolean>(false);

  useEffect(() => {
    const unsub = AnalyticsTracker.subscribeAnnouncement((ann) => {
      setSystemAnnouncement(ann);
      if (ann && ann.active) {
        setIsAnnouncementDismissed(false);
      }
    });
    return () => unsub();
  }, []);

  // --- Initial Location & Visit Tracking ---
  useEffect(() => {
    const hasAskedLocation = localStorage.getItem('vaqt_location_prompt_seen');
    if (!hasAskedLocation) {
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    AnalyticsTracker.trackEvent('visit', user, userLocation, 'Sayt sahifasi ochildi');
  }, []);

  // --- Background / Wallpaper ---
  const [activeBgId, setActiveBgId] = useState<string>(() => localStorage.getItem('vaqt_bg_preset') || 'cosmic');
  const [customBgUrl, setCustomBgUrl] = useState<string>(() => localStorage.getItem('vaqt_custom_bg') || '');
  const [bgDarkness, setBgDarkness] = useState<number>(() => Number(localStorage.getItem('vaqt_bg_darkness')) || 0.82);
  const [bgBlur, setBgBlur] = useState<number>(() => Number(localStorage.getItem('vaqt_bg_blur')) || 0);

  const currentBgStyle = useMemo(() => {
    if (customBgUrl.trim()) {
      return {
        backgroundImage: `linear-gradient(rgba(3, 7, 18, ${bgDarkness}), rgba(3, 7, 18, ${Math.min(0.98, bgDarkness + 0.1)})), url("${customBgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
      };
    }
    const found = PRESET_BACKGROUNDS.find((p) => p.id === activeBgId);
    if (found) {
      if (found.type === 'image') {
        return {
          backgroundImage: `linear-gradient(rgba(3, 7, 18, ${bgDarkness}), rgba(3, 7, 18, ${Math.min(0.98, bgDarkness + 0.1)})), url("${found.value}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return { background: found.value };
    }
    return { background: 'radial-gradient(ellipse at top, #0f172a, #030712)' };
  }, [activeBgId, customBgUrl, bgDarkness, bgBlur]);

  // --- Pomodoro Configuration & State ---
  const [pomoConfig, setPomoConfig] = useState<PomodoroConfig>(() => {
    const saved = localStorage.getItem('vaqt_pomo_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoro: false,
      sound: 'zen_bell',
    };
  });

  const handleUpdatePomoConfig = (newConfig: PomodoroConfig) => {
    setPomoConfig(newConfig);
    localStorage.setItem('vaqt_pomo_config', JSON.stringify(newConfig));
  };

  // --- Tasks & Forest State ---
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_forest_trees');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleTreePlanted = (newTree: PlantedTree) => {
    const updated = [newTree, ...plantedTrees];
    setPlantedTrees(updated);
    localStorage.setItem('vaqt_forest_trees', JSON.stringify(updated));
  };

  // --- Global Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Secret Admin Dashboard: Ctrl+Shift+A or Alt+A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        if (user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdminModalOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
        return;
      }

      // Hotkey F: Fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Hotkey 3 or D: 3D Scene Toggle
      if (e.key === '3' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setIs3DEnabled((prev) => !prev);
      }

      // Hotkey T: Cycle Theme
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const themesList: ThemeMode[] = ['dark', 'light', 'cyber', 'forest', 'sunset', 'oled'];
        const currentIdx = themesList.indexOf(theme);
        const nextTheme = themesList[(currentIdx + 1) % themesList.length];
        setTheme(nextTheme);
      }

      // Hotkey L: Cycle Lang
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        const langs: Language[] = ['uz', 'en', 'ru'];
        const currentIdx = langs.indexOf(lang);
        const nextLang = langs[(currentIdx + 1) % langs.length];
        setLang(nextLang);
      }

      // Hotkey M: Mute / Unmute Sound
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        binauralEngine.toggleMute();
      }

      // Hotkey ? or H: Shortcuts Modal
      if (e.key === '?' || e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, lang, user]);

  // Geolocation handling
  const handleAllowLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await requestGpsLocation();
      setUserLocation(loc);
      localStorage.setItem('vaqt_user_location', JSON.stringify(loc));
      localStorage.setItem('vaqt_location_prompt_seen', 'true');
    } catch {
      const fallback = detectTimezoneLocation();
      setUserLocation(fallback);
      localStorage.setItem('vaqt_user_location', JSON.stringify(fallback));
      localStorage.setItem('vaqt_location_prompt_seen', 'true');
    } finally {
      setIsDetectingLocation(false);
      setShowLocationModal(false);
    }
  };

  const handleDeclineLocation = () => {
    const fallback = detectTimezoneLocation();
    setUserLocation(fallback);
    localStorage.setItem('vaqt_user_location', JSON.stringify(fallback));
    localStorage.setItem('vaqt_location_prompt_seen', 'true');
    setShowLocationModal(false);
  };

  return (
    <div
      className="min-h-screen w-full relative flex flex-col font-sans transition-all duration-500 overflow-x-hidden text-slate-100 selection:bg-indigo-500 selection:text-white"
      style={currentBgStyle}
    >
      {/* 3D WebGL Three.js Cyber Background Canvas */}
      <Cyber3DScene enabled={is3DEnabled} theme={theme} />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 min-h-screen">
        {/* System Announcement Banner from Admin if active */}
        {systemAnnouncement && systemAnnouncement.active && !isAnnouncementDismissed && (
          <div
            className={`w-full p-4 rounded-2xl border flex items-center justify-between gap-3 animate-fade-in shadow-xl backdrop-blur-md ${
              systemAnnouncement.type === 'urgent'
                ? 'bg-rose-950/80 border-rose-500 text-rose-100'
                : systemAnnouncement.type === 'warning'
                ? 'bg-amber-950/80 border-amber-500 text-amber-100'
                : systemAnnouncement.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100'
                : 'bg-indigo-950/80 border-indigo-500 text-indigo-100'
            }`}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{systemAnnouncement.message}</span>
            </div>
            <button
              onClick={() => setIsAnnouncementDismissed(true)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          theme={theme}
          setTheme={setTheme}
          lang={lang}
          setLang={setLang}
          is3DEnabled={is3DEnabled}
          setIs3DEnabled={setIs3DEnabled}
          onOpenSoundModal={() => setIsSoundModalOpen(true)}
          onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          deferredPrompt={deferredPrompt}
          onInstallApp={handleInstallApp}
        />

        {/* Active Tab View Rendering */}
        <main className="flex-1 w-full flex flex-col items-center justify-center">
          {activeTab === 'pomodoro' && (
            <PomodoroView
              config={pomoConfig}
              onUpdateConfig={handleUpdatePomoConfig}
              lang={lang}
              onTreePlanted={handleTreePlanted}
            />
          )}

          {activeTab === 'clock' && (
            <ClockView
              userLocation={userLocation}
              onUpdateLocation={(loc) => {
                setUserLocation(loc);
                localStorage.setItem('vaqt_user_location', JSON.stringify(loc));
              }}
            />
          )}

          {activeTab === 'stopwatch' && <StopwatchView />}

          {activeTab === 'countdown' && (
            <CountdownView onAlarm={() => binauralEngine.playAlarm('zen_bell')} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              lang={lang}
              plantedTrees={plantedTrees}
              tasks={tasks}
              onDataImported={() => {
                try {
                  const saved = localStorage.getItem('vaqt_forest_trees');
                  if (saved) setPlantedTrees(JSON.parse(saved));
                } catch {}
              }}
            />
          )}
        </main>

        {/* Subtle Footer */}
        <footer className="w-full py-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-400">VAQT 3D Cyber Edition</span>
            <span>•</span>
            <span>{t.tagline}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsShortcutsModalOpen(true)}
              className="hover:text-indigo-400 transition"
            >
              {t.actions.shortcuts} (Hotkeys)
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSoundModalOpen(true)}
              className="hover:text-pink-400 transition"
            >
              {t.soundscapes.title}
            </button>
          </div>
        </footer>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Binaural Beats & Ambient Soundscape Modal */}
      <SoundscapeModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        lang={lang}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        lang={lang}
      />

      {/* Geolocation Permission Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-indigo-500/40 p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <MapPin className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                Mahalliy Vaqtingizni Aniqlash
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Joylashuvingizdan foydalanishga ruxsat bersangiz, sayt qayerda ekanligingizni aniqlab,
                soatni aynan sizning mahalliy vaqtingizga toʻgʻrilab beradi.
              </p>
            </div>

            <div className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2 text-xs text-indigo-300 font-medium">
              <span>{userLocation.flag}</span>
              <span>
                Taxminiy hudud: <strong>{userLocation.city}, {userLocation.country}</strong>
              </span>
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-2">
              <button
                type="button"
                onClick={handleAllowLocation}
                disabled={isDetectingLocation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                {isDetectingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Aniqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Ruxsat Berish & Vaqtni Moslash</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDeclineLocation}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Oʻtkazib yuborish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Super Admin Dashboard Modal (Gated for yusuf18081998@gmail.com) */}
      <SecretAdminDashboard
        user={user}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onBroadcastAnnouncement={(ann) => {
          setSystemAnnouncement(ann);
          setIsAnnouncementDismissed(false);
        }}
      />
    </div>
  );
}
