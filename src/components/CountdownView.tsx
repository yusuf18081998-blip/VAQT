import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Hourglass, BellRing, Sparkles, CheckCircle } from 'lucide-react';
import { SoundType } from '../types';
import { playTimerSound } from '../utils/audio';
import { SoundStatusIndicator } from './SoundStatusIndicator';

interface CountdownViewProps {
  sound: SoundType;
}

export const CountdownView: React.FC<CountdownViewProps> = ({ sound }) => {
  const [hoursInput, setHoursInput] = useState<number>(0);
  const [minutesInput, setMinutesInput] = useState<number>(5);
  const [secondsInput, setSecondsInput] = useState<number>(0);
  const [label, setLabel] = useState<string>('');

  const [totalSeconds, setTotalSeconds] = useState<number>(300);
  const [secondsLeft, setSecondsLeft] = useState<number>(300);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
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
  }, [isRunning]);

  const handleComplete = () => {
    setIsRunning(false);
    setIsCompleted(true);
    playTimerSound(sound);
  };

  const handleStart = () => {
    if (secondsLeft <= 0 || !isRunning && totalSeconds !== hoursInput * 3600 + minutesInput * 60 + secondsInput) {
      const calculated = hoursInput * 3600 + minutesInput * 60 + secondsInput;
      if (calculated <= 0) {
        alert('Iltimos, taymer vaqtini 0 dan katta qilib belgilang!');
        return;
      }
      setTotalSeconds(calculated);
      setSecondsLeft(calculated);
    }
    setIsCompleted(false);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    const initial = hoursInput * 3600 + minutesInput * 60 + secondsInput;
    setSecondsLeft(initial > 0 ? initial : 300);
    setTotalSeconds(initial > 0 ? initial : 300);
  };

  const addPresetMinutes = (minutesToAdd: number) => {
    let currentTotal = hoursInput * 3600 + minutesInput * 60 + secondsInput + minutesToAdd * 60;
    if (currentTotal < 0) currentTotal = 0;

    const newH = Math.floor(currentTotal / 3600);
    const newM = Math.floor((currentTotal % 3600) / 60);
    const newS = currentTotal % 60;

    setHoursInput(newH);
    setMinutesInput(newM);
    setSecondsInput(newS);

    if (!isRunning) {
      setTotalSeconds(currentTotal);
      setSecondsLeft(currentTotal);
    }
  };

  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;

  const formattedH = String(h).padStart(2, '0');
  const formattedM = String(m).padStart(2, '0');
  const formattedS = String(s).padStart(2, '0');

  const progressPercentage = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Asosiy Taymer Kartasi */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/15 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Label input */}
        <div className="w-full max-w-md mb-6 z-10">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Taymer maqsadi (Masalan: Choy damlash, Sport mashgʻuloti)"
            className="w-full text-center px-4 py-2.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-300/60 dark:border-white/10 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner"
          />
        </div>

        {/* Not Running: Inputs / Running: Digits */}
        {!isRunning && secondsLeft === totalSeconds && !isCompleted ? (
          <div className="flex flex-col items-center gap-6 mb-8 z-10">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={hoursInput}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(99, parseInt(e.target.value) || 0));
                    setHoursInput(val);
                    setTotalSeconds(val * 3600 + minutesInput * 60 + secondsInput);
                    setSecondsLeft(val * 3600 + minutesInput * 60 + secondsInput);
                  }}
                  className="w-18 sm:w-24 h-18 sm:h-24 rounded-2xl bg-white/70 dark:bg-slate-800/80 border-2 border-slate-300/70 dark:border-white/10 text-center font-mono text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Soat</span>
              </div>

              <span className="text-3xl font-extrabold text-slate-400 mb-6">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutesInput}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setMinutesInput(val);
                    setTotalSeconds(hoursInput * 3600 + val * 60 + secondsInput);
                    setSecondsLeft(hoursInput * 3600 + val * 60 + secondsInput);
                  }}
                  className="w-18 sm:w-24 h-18 sm:h-24 rounded-2xl bg-white/70 dark:bg-slate-800/80 border-2 border-slate-300/70 dark:border-white/10 text-center font-mono text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Daqiqa</span>
              </div>

              <span className="text-3xl font-extrabold text-slate-400 mb-6">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={secondsInput}
                  onChange={(e) => {
                    const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                    setSecondsInput(val);
                    setTotalSeconds(hoursInput * 3600 + minutesInput * 60 + val);
                    setSecondsLeft(hoursInput * 3600 + minutesInput * 60 + val);
                  }}
                  className="w-18 sm:w-24 h-18 sm:h-24 rounded-2xl bg-white/70 dark:bg-slate-800/80 border-2 border-slate-300/70 dark:border-white/10 text-center font-mono text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">Soniya</span>
              </div>
            </div>

            {/* Tezkor Presets */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                onClick={() => addPresetMinutes(1)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +1 daq
              </button>
              <button
                onClick={() => addPresetMinutes(5)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +5 daq
              </button>
              <button
                onClick={() => addPresetMinutes(10)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +10 daq
              </button>
              <button
                onClick={() => addPresetMinutes(15)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +15 daq
              </button>
              <button
                onClick={() => addPresetMinutes(30)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +30 daq
              </button>
              <button
                onClick={() => addPresetMinutes(60)}
                className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-all"
              >
                +1 soat
              </button>
            </div>
          </div>
        ) : (
          /* Active Countdown Display */
          <div className="flex flex-col items-center mb-8 z-10">
            {isCompleted ? (
              <div className="flex flex-col items-center py-6 animate-bounce">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-3">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  Vaqt Tugadi!
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {label ? `"${label}" boʻyicha taymer yakunlandi.` : 'Taymer muvaffaqiyatli yakunlandi.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center py-2 sm:py-4">
                <div className="flex items-baseline font-timer text-6xl sm:text-8xl md:text-9xl lg:text-[7.5rem] font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-2xl select-none leading-none">
                  {hoursInput > 0 && (
                    <>
                      <span className="text-glow-white bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-300">{formattedH}</span>
                      <span className="text-indigo-400 dark:text-indigo-400 animate-pulse px-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">:</span>
                    </>
                  )}
                  <span className="text-glow-white bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-300">{formattedM}</span>
                  <span className="text-indigo-400 dark:text-indigo-400 animate-pulse px-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">:</span>
                  <span className="text-cyan-400 dark:text-cyan-400 font-black text-glow-cyan">{formattedS}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-64 sm:w-80 h-3.5 rounded-full bg-slate-200/60 dark:bg-slate-800 mt-6 overflow-hidden border border-slate-300/40 dark:border-white/10 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-1000 ease-linear rounded-full shadow-md"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>

                {label && (
                  <p className="mt-4 text-sm font-bold text-indigo-400 px-4 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/30 shadow-sm">
                    {label}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Boshqaruv Tugmalari */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap z-10">
          <SoundStatusIndicator compact={false} showHotkey={true} />

          {!isRunning ? (
            <button
              id="cdStartBtn"
              onClick={handleStart}
              className="px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-lg shadow-indigo-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{secondsLeft < totalSeconds && !isCompleted ? 'Davom ettirish' : 'Taymerni Boshlash'}</span>
            </button>
          ) : (
            <button
              id="cdPauseBtn"
              onClick={handlePause}
              className="px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
            >
              <Pause className="w-5 h-5" />
              <span>Toʻxtatish</span>
            </button>
          )}

          <button
            id="cdResetBtn"
            onClick={handleReset}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-all flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qaytarish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
