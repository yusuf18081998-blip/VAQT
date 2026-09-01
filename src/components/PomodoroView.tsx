import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Flame,
  Coffee,
  Palmtree,
  Settings2,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Radio,
  Sliders,
  Zap,
  TreePine,
  Layers,
  Leaf,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  ExternalLink,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PomodoroMode, PomodoroConfig, PlantedTree, TreeSpecies, FocusShieldConfig } from '../types';
import { binauralEngine } from '../utils/binauralEngine';
import { AudioVisualizer } from './AudioVisualizer';
import { Language, TRANSLATIONS } from '../utils/translations';
import { AnalyticsTracker } from '../utils/analyticsTracker';
import { detectTimezoneLocation } from '../utils/locationService';
import { SoundStatusIndicator } from './SoundStatusIndicator';
import { FocusTreeVisualizer, SPECIES_INFO } from './FocusTreeVisualizer';
import { FocusShieldModal, DEFAULT_STUDY_APPS, DEFAULT_BLOCKED_DISTRACTIONS } from './FocusShieldModal';
import { FocusLockOverlay } from './FocusLockOverlay';

interface PomodoroViewProps {
  config: PomodoroConfig;
  onUpdateConfig: (newConfig: PomodoroConfig) => void;
  lang: Language;
  trees?: PlantedTree[];
  onTreePlanted?: (tree: PlantedTree) => void;
  onOpenGardenModal?: () => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  config,
  onUpdateConfig,
  lang,
  trees = [],
  onTreePlanted,
  onOpenGardenModal,
}) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(config.focusTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [enableTickSound, setEnableTickSound] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('vaqt_pomo_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [taskName, setTaskName] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showVisualizer, setShowVisualizer] = useState<boolean>(true);
  
  // Tree Focus State
  const [selectedSpecies, setSelectedSpecies] = useState<TreeSpecies>('apple');
  const [activeTabSubView, setActiveTabSubView] = useState<'timer' | 'tree'>('timer');
  const [isWithered, setIsWithered] = useState<boolean>(false);
  const [witherWarning, setWitherWarning] = useState<boolean>(false);
  const [leftAppCount, setLeftAppCount] = useState<number>(0);

  // Focus App & Website Shield Blocker State
  const [isShieldModalOpen, setIsShieldModalOpen] = useState<boolean>(false);
  const [isLockOverlayOpen, setIsLockOverlayOpen] = useState<boolean>(false);
  const [shieldConfig, setShieldConfig] = useState<FocusShieldConfig>(() => {
    const saved = localStorage.getItem('vaqt_focus_shield_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      isEnabled: true,
      strictLockout: true,
      audioAlertOnDistraction: true,
      allowedApps: DEFAULT_STUDY_APPS,
      customBlockedDomains: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('vaqt_focus_shield_config', JSON.stringify(shieldConfig));
  }, [shieldConfig]);

  const timerRef = useRef<number | null>(null);

  const getModeDuration = (currentMode: PomodoroMode) => {
    switch (currentMode) {
      case 'focus':
      case 'study':
        return config.focusTime * 60;
      case 'shortBreak':
      case 'short_break':
        return config.shortBreak * 60;
      case 'longBreak':
      case 'long_break':
        return config.longBreak * 60;
      default:
        return config.focusTime * 60;
    }
  };

  const totalDuration = getModeDuration(mode);

  // Sync timeLeft when config changes and not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getModeDuration(mode));
      setIsWithered(false);
      setWitherWarning(false);
    }
  }, [config.focusTime, config.shortBreak, config.longBreak, mode]);

  // Track tab blur / app leave for tree protection & Strict Lockout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning && (mode === 'focus' || mode === 'study')) {
        if (shieldConfig.isEnabled && shieldConfig.strictLockout) {
          setIsLockOverlayOpen(true);
        }

        setLeftAppCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount >= 3) {
            setIsWithered(true);
          } else {
            setWitherWarning(true);
            setTimeout(() => setWitherWarning(false), 5000);
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, mode, shieldConfig]);

  // Main countdown effect with ticking sound
  useEffect(() => {
    if (isRunning) {
      AnalyticsTracker.trackEvent(
        'pomodoro_start',
        null,
        detectTimezoneLocation(),
        `${taskName || 'Fokus'} (${Math.round(totalDuration / 60)} daq)`
      );

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (enableTickSound) {
            binauralEngine.playTick();
          }

          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, config, enableTickSound, totalDuration, taskName]);

  // Global Keyboard Shortcuts for Pomodoro
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        binauralEngine.toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, config]);

  const handleComplete = () => {
    setIsRunning(false);
    binauralEngine.playAlarm('zen_bell');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch {}

    if (mode === 'focus' || mode === 'study') {
      const nextSessions = completedSessions + 1;
      setCompletedSessions(nextSessions);
      localStorage.setItem('vaqt_pomo_sessions', String(nextSessions));

      // Plant tree!
      const newTree: PlantedTree = {
        id: `tree_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        species: selectedSpecies,
        name: SPECIES_INFO[selectedSpecies]?.name || 'Fokus Daraxti',
        status: isWithered ? 'withered' : 'alive',
        minutesFocused: config.focusTime,
        plantedAt: Date.now(),
        taskTitle: taskName.trim() || undefined,
        witherReason: isWithered ? "Dars vaqtida ilovadan ko'p marotaba chiqildi" : undefined,
      };

      if (onTreePlanted) {
        onTreePlanted(newTree);
      }

      // Update analytics history in localStorage
      const todayStr = new Date().toISOString().split('T')[0];
      const rawHistory = localStorage.getItem('pomodoro_sessions_history');
      let historyList = rawHistory ? JSON.parse(rawHistory) : [];
      const todayIdx = historyList.findIndex((h: any) => h.date === todayStr);

      if (todayIdx >= 0) {
        historyList[todayIdx].minutes = (historyList[todayIdx].minutes || 0) + config.focusTime;
        historyList[todayIdx].pomodoros = (historyList[todayIdx].pomodoros || 0) + 1;
      } else {
        const daysUz = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
        historyList.push({
          date: todayStr,
          day: daysUz[new Date().getDay()],
          minutes: config.focusTime,
          pomodoros: 1,
        });
      }
      localStorage.setItem('pomodoro_sessions_history', JSON.stringify(historyList));

      // Native HTML5 Push Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t.pomodoro.sessionFinishedTitle, {
          body: `${t.pomodoro.sessionFinishedBody} Bogʻingizda yangi ${SPECIES_INFO[selectedSpecies].name} qad koʻtardi!`,
          icon: '/favicon.svg',
        });
      }

      AnalyticsTracker.trackEvent(
        'pomodoro_complete',
        null,
        detectTimezoneLocation(),
        `${taskName || 'Fokus'} (${config.focusTime} daqiqa) yakunlandi - ${SPECIES_INFO[selectedSpecies].name} ekildi`
      );

      // Auto cycle switch
      if (nextSessions % config.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(config.longBreak * 60);
        if (config.autoStartBreaks) setIsRunning(true);
      } else {
        setMode('shortBreak');
        setTimeLeft(config.shortBreak * 60);
        if (config.autoStartBreaks) setIsRunning(true);
      }
    } else {
      // Break finished
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(t.pomodoro.breakFinishedTitle, {
          body: t.pomodoro.breakFinishedBody,
          icon: '/favicon.svg',
        });
      }

      setMode('focus');
      setTimeLeft(config.focusTime * 60);
      setIsWithered(false);
      setLeftAppCount(0);
      if (config.autoStartPomodoro) setIsRunning(true);
    }
  };

  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getModeDuration(newMode));
    setIsWithered(false);
    setLeftAppCount(0);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeDuration(mode));
    setIsWithered(false);
    setLeftAppCount(0);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(config.shortBreak * 60);
    } else {
      setMode('focus');
      setTimeLeft(config.focusTime * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular ring calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;

  const currentCycleIndex = (completedSessions % config.longBreakInterval) + 1;
  const aliveTreesCount = trees.filter((t) => t.status === 'alive').length;

  const modeThemes = {
    focus: {
      color: 'from-indigo-600 to-purple-600',
      ringColor: '#6366f1',
      title: t.pomodoro.focus,
    },
    shortBreak: {
      color: 'from-emerald-600 to-teal-500',
      ringColor: '#10b981',
      title: t.pomodoro.shortBreak,
    },
    longBreak: {
      color: 'from-cyan-600 to-blue-500',
      ringColor: '#06b6d4',
      title: t.pomodoro.longBreak,
    },
  };

  const activeThemeObj = modeThemes[mode as 'focus' | 'shortBreak' | 'longBreak'] || modeThemes.focus;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in text-slate-100 pb-12">
      {/* Main Glassmorphic 3D Card */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-slate-900/85 border border-indigo-500/30 shadow-2xl p-4 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-30"
          style={{
            backgroundColor:
              mode === 'focus' ? '#6366f1' : mode === 'shortBreak' ? '#10b981' : '#06b6d4',
          }}
        />

        {/* Top Header Controls: Mode Selector & Garden Land Trigger */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 z-10">
          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950/70 border border-slate-800 flex-wrap">
            <button
              onClick={() => handleModeChange('focus')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'focus'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>
                {t.pomodoro.focus} ({config.focusTime}m)
              </span>
            </button>

            <button
              onClick={() => handleModeChange('shortBreak')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'shortBreak'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>
                {t.pomodoro.shortBreak} ({config.shortBreak}m)
              </span>
            </button>

            <button
              onClick={() => handleModeChange('longBreak')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'longBreak'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palmtree className="w-4 h-4" />
              <span>
                {t.pomodoro.longBreak} ({config.longBreak}m)
              </span>
            </button>
          </div>

          {/* Sub-View Switcher: Circular Timer vs 3D Tree Island */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTabSubView('timer')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  activeTabSubView === 'timer'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.pomodoro.digitalClockTab}
              </button>
              <button
                type="button"
                onClick={() => setActiveTabSubView('tree')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  activeTabSubView === 'tree'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{t.pomodoro.treeLandTab}</span>
              </button>
            </div>

            {/* Direct Open Garden Land Button */}
            {onOpenGardenModal && (
              <button
                type="button"
                id="openGardenLandFromPomoBtn"
                onClick={onOpenGardenModal}
                className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-500 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 border border-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                title={t.pomodoro.viewGardenBtn}
              >
                <TreePine className="w-4 h-4 shrink-0" />
                <span>{t.pomodoro.myGardenBtn} ({aliveTreesCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Tree Species Selector Bar (Always selectable when focusing) */}
        {mode === 'focus' && (
          <div className="w-full max-w-lg mb-4 flex items-center justify-center gap-1.5 flex-wrap z-10">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" /> {t.pomodoro.plantSpeciesLabel}
            </span>
            {(Object.keys(SPECIES_INFO) as TreeSpecies[]).map((sp) => {
              const info = SPECIES_INFO[sp];
              const isSelected = selectedSpecies === sp;
              const spName = t.speciesNames?.[sp]?.shortName || info.name.split(' ')[0];
              return (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSelectedSpecies(sp)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-white/20 scale-105'
                      : 'bg-slate-950/70 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{info.icon}</span>
                  <span>{spName}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Task Input Box & Focus Shield Quick Trigger */}
        <div className="w-full max-w-lg mb-4 z-10 flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder={t.pomodoro.taskPlaceholder}
              className="flex-1 text-center px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />

            {/* Focus Study Shield Modal Button */}
            <button
              type="button"
              id="openFocusShieldBtn"
              onClick={() => setIsShieldModalOpen(true)}
              className={`px-3.5 py-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-extrabold shadow-md shrink-0 ${
                shieldConfig.isEnabled
                  ? 'bg-gradient-to-r from-indigo-950/90 to-emerald-950/90 border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:scale-105'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Fokusdan oldin dars saytlari va ilovalarini belgilash"
            >
              {shieldConfig.isEnabled ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-slate-400" />
              )}
              <span className="hidden sm:inline">Dars Qulfi</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">
                {shieldConfig.allowedApps.filter((a) => a.isAllowed).length}
              </span>
            </button>
          </div>

          {/* Quick Active Shield Sub-Bar: Shows Allowed Apps Preview */}
          {shieldConfig.isEnabled && (
            <div className="p-2 rounded-2xl bg-slate-950/60 border border-emerald-500/20 flex items-center justify-between gap-2 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-400 overflow-x-auto py-0.5 max-w-full">
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0">
                  <Lock className="w-3 h-3" /> Dars vositalari:
                </span>
                {shieldConfig.allowedApps
                  .filter((a) => a.isAllowed)
                  .slice(0, 4)
                  .map((app) => (
                    <span
                      key={app.id}
                      className="px-2 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-200 shrink-0 flex items-center gap-1"
                    >
                      <span>{app.icon || '📚'}</span>
                      <span>{app.name.split('/')[0]}</span>
                    </span>
                  ))}
                {shieldConfig.allowedApps.filter((a) => a.isAllowed).length > 4 && (
                  <span className="text-[10px] text-slate-400">
                    +{shieldConfig.allowedApps.filter((a) => a.isAllowed).length - 4} yana
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsShieldModalOpen(true)}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0 ml-auto"
              >
                Tahrirlash / Qoʻshish →
              </button>
            </div>
          )}
        </div>

        {/* MAIN TIMER DISPLAY: Either 3D Tree Visualizer on Soil Island OR Neon Circular Ring */}
        {activeTabSubView === 'tree' ? (
          <div className="w-full max-w-md my-2 z-10 animate-fade-in">
            <FocusTreeVisualizer
              species={selectedSpecies}
              progressPercent={progressPercent * 100}
              isWithered={isWithered}
              witherWarning={witherWarning}
              leftAppCount={leftAppCount}
              isDeepFocusActive={true}
              pomoRunning={isRunning}
              pomoMode={mode === 'focus' ? 'study' : mode === 'shortBreak' ? 'short_break' : 'long_break'}
              taskTitle={taskName}
              onOpenForest={onOpenGardenModal || (() => {})}
              onChangeSpecies={setSelectedSpecies}
              lang={lang}
            />
            {/* Embedded Digital Countdown below tree */}
            <div className="mt-3 text-center">
              <span className="font-timer text-3xl font-black text-white tracking-tight">
                {timeFormatted}
              </span>
            </div>
          </div>
        ) : (
          /* Circular Timer Ring with Neon Visualizer Layer */
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-6 flex items-center justify-center select-none z-10 animate-fade-in">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
              {/* Background Track */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="10"
                fill="none"
              />
              {/* Progress Stroke */}
              <circle
                cx="140"
                cy="140"
                r={radius}
                stroke={activeThemeObj.ringColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-500 ease-linear shadow-lg"
              />
            </svg>

            {/* Center Display with Bold High Contrast Typography */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-timer text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-2xl text-glow-white">
                {timeFormatted}
              </span>
              <span className="mt-2 text-xs font-extrabold uppercase tracking-widest text-slate-300">
                {activeThemeObj.title}
              </span>

              {/* Current Tree being nurtured */}
              {mode === 'focus' && (
                <div className="mt-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <span>{SPECIES_INFO[selectedSpecies]?.icon}</span>
                  <span>{t.speciesNames?.[selectedSpecies]?.shortName || SPECIES_INFO[selectedSpecies]?.name.split(' ')[0]} {t.pomodoro.treeGrowingOnPlot}</span>
                </div>
              )}

              {/* Cycle indicator */}
              <div className="mt-2 flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700/80 text-[11px] font-bold text-slate-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  {currentCycleIndex} / {config.longBreakInterval}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Real-time Neon Waveform Audio Visualizer */}
        {showVisualizer && (
          <div className="w-full max-w-sm mb-6 z-10">
            <AudioVisualizer
              mode="waves"
              isActive={isRunning}
              className="w-full h-14 bg-slate-950/60 border border-indigo-500/20 rounded-2xl shadow-inner"
            />
          </div>
        )}

        {/* Controls Toolbar */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap z-10">
          <SoundStatusIndicator compact={false} showHotkey={true} />

          <button
            id="pomoPlayPauseBtn"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 active:scale-95 text-white ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : `bg-gradient-to-r ${activeThemeObj.color} shadow-indigo-600/30`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>{t.actions.pause}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft < totalDuration ? t.actions.resume : t.actions.start}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className="px-4 py-3.5 rounded-2xl font-bold text-sm bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-2"
            title={t.actions.skip}
          >
            <SkipForward className="w-4 h-4 text-indigo-400" />
            <span>{t.actions.skip}</span>
          </button>

          <button
            onClick={handleReset}
            className="px-4 py-3.5 rounded-2xl font-bold text-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-2"
            title="Reset (R)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.actions.reset}</span>
          </button>

          <button
            onClick={() => setEnableTickSound(!enableTickSound)}
            className={`p-3.5 rounded-2xl border transition ${
              enableTickSound
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={t.pomodoro.tickSoundTooltip}
          >
            <Radio className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3.5 rounded-2xl border transition ${
              showSettings
                ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-sm'
                : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={t.pomodoro.settingsTooltip}
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Active Focus Shield Study Bar when Running */}
        {isRunning && (mode === 'focus' || mode === 'study') && shieldConfig.isEnabled && (
          <div className="w-full max-w-xl mt-4 p-4 rounded-3xl bg-slate-950/90 border border-emerald-500/30 shadow-2xl z-10 animate-fade-in flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black tracking-wide text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> DARS MAYDONI (RUXSAT ETILGAN SAYTLAR)
                </span>
              </div>
              <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Chalgʻituvchilar Qulflangan
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {shieldConfig.allowedApps
                .filter((a) => a.isAllowed)
                .map((app) => (
                  <a
                    key={app.id}
                    href={app.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1.5 transition transform hover:scale-105 shrink-0 shadow-sm"
                  >
                    <span>{app.icon || '📖'}</span>
                    <span>{app.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
            </div>

            <p className="text-[11px] text-slate-400 text-left">
              Fokus vaqtida boshqa chalgʻituvchi saytlarga kirsangiz, VAQT qulf ekrani ishga tushadi!
            </p>
          </div>
        )}

        {/* Settings Accordion */}
        {showSettings && (
          <div className="w-full max-w-lg mt-8 pt-6 border-t border-slate-800 z-10 animate-fade-in flex flex-col gap-4">
            <h4 className="font-bold text-white text-sm text-left">
              {t.pomodoro.settingsHeader}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1 text-left p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-400">{t.pomodoro.focusTimeLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={config.focusTime}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      focusTime: Math.max(1, parseInt(e.target.value) || 25),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold font-mono text-white"
                />
              </div>

              <div className="flex flex-col gap-1 text-left p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-400">{t.pomodoro.shortBreakTimeLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.shortBreak}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      shortBreak: Math.max(1, parseInt(e.target.value) || 5),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold font-mono text-white"
                />
              </div>

              <div className="flex flex-col gap-1 text-left p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <label className="text-xs font-semibold text-slate-400">{t.pomodoro.longBreakTimeLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.longBreak}
                  onChange={(e) =>
                    onUpdateConfig({
                      ...config,
                      longBreak: Math.max(1, parseInt(e.target.value) || 15),
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-bold font-mono text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 text-xs font-medium text-slate-400 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoStartBreaks}
                  onChange={(e) => onUpdateConfig({ ...config, autoStartBreaks: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
                />
                <span>{t.pomodoro.autoBreak}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVisualizer}
                  onChange={(e) => setShowVisualizer(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-900"
                />
                <span>Waveform Visualizer</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Completed Sessions & Forest Summary Strip */}
      <div className="rounded-3xl backdrop-blur-xl bg-slate-900/80 border border-indigo-500/20 p-5 sm:p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm sm:text-base">
              {t.pomodoro.completedCycles}
            </h4>
            <p className="text-xs text-slate-400">
              {t.pomodoro.completedDesc
                .replace('{mins}', String(completedSessions * config.focusTime))
                .replace('{trees}', String(aliveTreesCount))}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenGardenModal && (
            <button
              onClick={onOpenGardenModal}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 transition flex items-center gap-1.5"
            >
              <TreePine className="w-4 h-4" />
              <span>{t.pomodoro.viewGardenBtn}</span>
            </button>
          )}

          <div className="text-right">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-400">
              {completedSessions}
            </span>
            <span className="text-xs text-slate-400 block">{t.pomodoro.sessionsCountLabel}</span>
          </div>

          <button
            onClick={() => {
              if (confirm(t.pomodoro.clearConfirm)) {
                setCompletedSessions(0);
                localStorage.removeItem('vaqt_pomo_sessions');
              }
            }}
            className="p-2.5 text-xs font-semibold rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition"
          >
            {t.actions.clear}
          </button>
        </div>
      </div>

      {/* Focus Shield Modal: Choose allowed study apps & blocked websites */}
      <FocusShieldModal
        isOpen={isShieldModalOpen}
        onClose={() => setIsShieldModalOpen(false)}
        config={shieldConfig}
        onChangeConfig={setShieldConfig}
        lang={lang}
        onStartFocusWithApps={() => {
          if (!isRunning) setIsRunning(true);
        }}
        isFocusRunning={isRunning}
      />

      {/* Focus Lockout Overlay: Active when tab is deserted or distraction accessed */}
      <FocusLockOverlay
        isOpen={isLockOverlayOpen}
        onDismiss={() => setIsLockOverlayOpen(false)}
        taskTitle={taskName}
        allowedApps={shieldConfig.allowedApps}
        species={selectedSpecies}
        leftAppCount={leftAppCount}
        minutesRemaining={timeFormatted}
      />
    </div>
  );
};
