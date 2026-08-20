import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Flame, Coffee, Palmtree, Settings2, Sparkles, CheckCircle2 } from 'lucide-react';
import { PomodoroMode, PomodoroConfig } from '../types';
import { playTimerSound } from '../utils/audio';

interface PomodoroViewProps {
  config: PomodoroConfig;
  onUpdateConfig: (newConfig: PomodoroConfig) => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({ config, onUpdateConfig }) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(config.focusTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('vaqt_pomo_sessions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [taskName, setTaskName] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const getModeDuration = (currentMode: PomodoroMode) => {
    switch (currentMode) {
      case 'focus':
        return config.focusTime * 60;
      case 'shortBreak':
        return config.shortBreak * 60;
      case 'longBreak':
        return config.longBreak * 60;
    }
  };

  const totalDuration = getModeDuration(mode);

  // Sync timeLeft when config changes and not running
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(getModeDuration(mode));
    }
  }, [config.focusTime, config.shortBreak, config.longBreak, mode]);

  // Main countdown effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
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
  }, [isRunning, mode, config]);

  const handleComplete = () => {
    setIsRunning(false);
    playTimerSound(config.sound);

    if (mode === 'focus') {
      const nextSessions = completedSessions + 1;
      setCompletedSessions(nextSessions);
      localStorage.setItem('vaqt_pomo_sessions', String(nextSessions));

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
      setMode('focus');
      setTimeLeft(config.focusTime * 60);
      if (config.autoStartPomodoro) setIsRunning(true);
    }
  };

  const handleModeChange = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getModeDuration(newMode));
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeDuration(mode));
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

  // SVG circular ring
  const radius = 120;
  const circumference = 2 * Math.PI * radius; // ~753.98
  const progressPercent = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  const strokeDashoffset = circumference - progressPercent * circumference;

  const currentCycleIndex = (completedSessions % config.longBreakInterval) + 1;

  const modeThemes = {
    focus: {
      color: 'from-indigo-600 to-indigo-500',
      ringColor: '#6366f1',
      badgeBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      title: '🎯 Dars va Fokus Vaqti',
      desc: 'Diqqatingizni jamlang, chalgʻimang va maqsad sari olgʻa bosing!',
    },
    shortBreak: {
      color: 'from-emerald-600 to-emerald-500',
      ringColor: '#10b981',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      title: '☕ Qisqa Tanaffus',
      desc: 'Koʻzlaringizni dam oldiring, suv iching yoki biroz choʻziling.',
    },
    longBreak: {
      color: 'from-cyan-600 to-cyan-500',
      ringColor: '#06b6d4',
      badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      title: '🌴 Katta Tanaffus',
      desc: 'Siz ajoyib ish bajardingiz! 15 daqiqa toʻliq hordiq chiqaring.',
    },
  };

  const currentTheme = modeThemes[mode];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Asosiy Pomodoro Kartasi */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700"
          style={{ backgroundColor: mode === 'focus' ? 'rgba(99,102,241,0.2)' : mode === 'shortBreak' ? 'rgba(16,185,129,0.2)' : 'rgba(6,182,212,0.2)' }}
        ></div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/50 dark:bg-slate-950/50 border border-slate-300/40 dark:border-white/10 mb-8 flex-wrap justify-center z-10">
          <button
            id="pomoModeFocusBtn"
            onClick={() => handleModeChange('focus')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'focus'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Fokus ({config.focusTime}m)</span>
          </button>

          <button
            id="pomoModeShortBtn"
            onClick={() => handleModeChange('shortBreak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Qisqa tanaffus ({config.shortBreak}m)</span>
          </button>

          <button
            id="pomoModeLongBtn"
            onClick={() => handleModeChange('longBreak')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>Katta tanaffus ({config.longBreak}m)</span>
          </button>
        </div>

        {/* Task Input */}
        <div className="w-full max-w-md mb-6 z-10">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Qaysi vazifa ustida ishlayapsiz? (Masalan: Ingliz tili lugʻat yodlash)"
            className="w-full text-center px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {/* Circular Timer Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-8 flex items-center justify-center select-none z-10">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
            {/* Background Track */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-slate-200/60 dark:stroke-slate-800/80"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress Stroke */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={currentTheme.ringColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Center Info */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
              {timeFormatted}
            </span>
            <span className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {mode === 'focus' ? 'Fokus Vaqti' : 'Tanaffus'}
            </span>

            {/* Cycle indicator */}
            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/40 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sessiya: {currentCycleIndex} / {config.longBreakInterval}</span>
            </div>
          </div>
        </div>

        {/* Boshqaruv Tugmalari */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap z-10">
          <button
            id="pomoToggleBtn"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 text-white ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : `bg-gradient-to-r ${currentTheme.color} shadow-indigo-500/30`
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Toʻxtatish</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{timeLeft < totalDuration ? 'Davom ettirish' : 'Boshlash'}</span>
              </>
            )}
          </button>

          <button
            id="pomoSkipBtn"
            onClick={handleSkip}
            className="px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-2 shadow-sm"
            title="Keyingi rejimga oʻtish"
          >
            <SkipForward className="w-4 h-4 text-indigo-500" />
            <span>Oʻtkazish</span>
          </button>

          <button
            id="pomoResetBtn"
            onClick={handleReset}
            className="px-5 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-all flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qaytarish</span>
          </button>

          <button
            id="pomoSettingsToggleBtn"
            onClick={() => setShowSettings(!showSettings)}
            className="p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/15 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all shadow-sm"
            title="Pomodoro vaqtlarini sozlash"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>

        {/* Sozlamalar paneli (Accordion) */}
        {showSettings && (
          <div className="w-full max-w-lg mt-8 pt-6 border-t border-slate-200/60 dark:border-white/10 z-10 animate-fade-in flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
              Pomodoro Vaqtlarini Moslashtirish (Daqiqalarda)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5 text-left p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  🎯 Fokus (daq):
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={config.focusTime}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, focusTime: Math.max(1, parseInt(e.target.value) || 25) })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  ☕ Qisqa tanaffus (daq):
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.shortBreak}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, shortBreak: Math.max(1, parseInt(e.target.value) || 5) })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  🌴 Katta tanaffus (daq):
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={config.longBreak}
                  onChange={(e) =>
                    onUpdateConfig({ ...config, longBreak: Math.max(1, parseInt(e.target.value) || 15) })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoStartBreaks}
                  onChange={(e) => onUpdateConfig({ ...config, autoStartBreaks: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Tanaffusni avtomatik boshlash</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.autoStartPomodoro}
                  onChange={(e) => onUpdateConfig({ ...config, autoStartPomodoro: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Pomodoroni avtomatik boshlash</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Jami Bajarilgan Sessiyalar Statistikasi */}
      <div className="rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 p-5 sm:p-6 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Bajarilgan Fokus Sessiyalari
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bugungi kunda jami {completedSessions * config.focusTime} daqiqa chuqur fokus vaqti sarflandi.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {completedSessions}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Sessiya</span>
          </div>

          <button
            onClick={() => {
              if (confirm('Fokus sessiyalari hisoblagichini tozalashni xohlaysizmi?')) {
                setCompletedSessions(0);
                localStorage.removeItem('vaqt_pomo_sessions');
              }
            }}
            className="p-2 text-xs font-semibold rounded-xl bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
            title="Statistikani tozalash"
          >
            Tozalash
          </button>
        </div>
      </div>
    </div>
  );
};
