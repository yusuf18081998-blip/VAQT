import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Download, Copy, Check, Sparkles } from 'lucide-react';
import { StopwatchLap } from '../types';
import { SoundStatusIndicator } from './SoundStatusIndicator';

export const StopwatchView: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<StopwatchLap[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastLapTotalRef = useRef<number>(0);

  // High precision, CPU-efficient timer loop
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - elapsedTime;
      const updateTimer = (now: number) => {
        // Limit React re-renders to ~30-40 fps to prevent 100% CPU spikes and memory buildup
        if (now - lastUpdateRef.current >= 30) {
          lastUpdateRef.current = now;
          setElapsedTime(now - startTimeRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      };
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (!isRunning) return;
    const currentTotal = elapsedTime;
    const lapTime = currentTotal - lastLapTotalRef.current;
    lastLapTotalRef.current = currentTotal;

    const newLap: StopwatchLap = {
      id: laps.length + 1,
      timeMs: currentTotal,
      lapTimeMs: lapTime,
      timestamp: new Date().toLocaleTimeString(),
    };

    setLaps([newLap, ...laps]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    lastLapTotalRef.current = 0;
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      m: String(minutes).padStart(2, '0'),
      s: String(seconds).padStart(2, '0'),
      ms: String(centiseconds).padStart(2, '0'),
    };
  };

  const { m, s, ms } = formatTime(elapsedTime);

  // Find min and max laps
  let fastestLapId: number | null = null;
  let slowestLapId: number | null = null;

  if (laps.length > 1) {
    let min = Infinity;
    let max = -Infinity;
    laps.forEach((l) => {
      if (l.lapTimeMs < min) {
        min = l.lapTimeMs;
        fastestLapId = l.id;
      }
      if (l.lapTimeMs > max) {
        max = l.lapTimeMs;
        slowestLapId = l.id;
      }
    });
  }

  const handleCopyLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map((l) => {
        const lapFmt = formatTime(l.lapTimeMs);
        const totFmt = formatTime(l.timeMs);
        return `Davra #${l.id} | Oraliq: ${lapFmt.m}:${lapFmt.s}.${lapFmt.ms} | Jami: ${totFmt.m}:${totFmt.s}.${totFmt.ms}`;
      })
      .join('\n');

    navigator.clipboard.writeText(`VAQT Sekundomer Natijalari:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (laps.length === 0) return;
    let csv = 'Davra Raqami,Oraliq Vaqt (ms),Oraliq Vaqt (Format),Jami Vaqt (Format)\n';
    laps.forEach((l) => {
      const lapFmt = formatTime(l.lapTimeMs);
      const totFmt = formatTime(l.timeMs);
      csv += `${l.id},${l.lapTimeMs},${lapFmt.m}:${lapFmt.s}.${lapFmt.ms},${totFmt.m}:${totFmt.s}.${totFmt.ms}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vaqt_sekundomer_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Asosiy Sekundomer Kartasi */}
      <div className="relative rounded-3xl backdrop-blur-2xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/15 dark:bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/15 dark:bg-cyan-500/25 rounded-full blur-3xl pointer-events-none"></div>

        {/* Live Pulse Circle Indicator */}
        <div className="relative mb-8 flex items-center justify-center">
          <div
            className={`w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 ${
              isRunning
                ? 'border-indigo-500/80 shadow-2xl shadow-indigo-500/30 animate-pulse'
                : 'border-slate-300/60 dark:border-white/10'
            } flex items-center justify-center bg-white/40 dark:bg-slate-950/60 backdrop-blur-xl relative`}
          >
            {/* Display Digits with bold high-contrast font */}
            <div className="flex flex-col items-center select-none font-timer">
              <div className="flex items-baseline text-6xl sm:text-7xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xl text-glow-white">
                <span>{m}</span>
                <span className="text-indigo-500 px-0.5 sm:px-1 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]">:</span>
                <span>{s}</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30">
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-sans font-bold">
                  MS:
                </span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-timer text-glow-cyan">
                  .{ms}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Boshqaruv Tugmalari */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap z-10">
          <SoundStatusIndicator compact={false} showHotkey={true} />

          <button
            id="swToggleBtn"
            onClick={handleStartPause}
            className={`px-6 sm:px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white shadow-indigo-500/30'
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
                <span>{elapsedTime > 0 ? 'Davom ettirish' : 'Boshlash'}</span>
              </>
            )}
          </button>

          <button
            id="swLapBtn"
            onClick={handleLap}
            disabled={!isRunning}
            className="px-5 sm:px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-white/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-white/15 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-sm"
          >
            <Flag className="w-4 h-4 text-indigo-500" />
            <span>Davra (Lap)</span>
          </button>

          <button
            id="swResetBtn"
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className="px-5 sm:px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/25 transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Qaytarish</span>
          </button>
        </div>
      </div>

      {/* Davralar (Laps) Ro'yxati */}
      {laps.length > 0 && (
        <div className="rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 p-5 sm:p-6 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                Qayd Etilgan Davralar ({laps.length})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLaps}
                className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                title="Matn sifatida nusxalash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Nusxalandi!' : 'Nusxalash'}</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-3 py-1.5 rounded-xl bg-white/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all flex items-center gap-1.5"
                title="CSV yuklab olish"
              >
                <Download className="w-3.5 h-3.5 text-indigo-500" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/10">
            <div className="grid grid-cols-3 bg-slate-200/50 dark:bg-slate-800/60 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <span>Davra #</span>
              <span className="text-center">Oraliq Vaqt</span>
              <span className="text-right">Jami Vaqt</span>
            </div>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-200/40 dark:divide-white/5 scrollbar-thin">
              {laps.map((lap) => {
                const lapFmt = formatTime(lap.lapTimeMs);
                const totFmt = formatTime(lap.timeMs);
                const isFastest = lap.id === fastestLapId;
                const isSlowest = lap.id === slowestLapId;

                return (
                  <div
                    key={lap.id}
                    className={`grid grid-cols-3 px-4 py-3 text-sm font-mono items-center transition-colors ${
                      isFastest
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold'
                        : isSlowest
                        ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-sans font-semibold">
                      <span>#{lap.id}</span>
                      {isFastest && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                          Tezkor
                        </span>
                      )}
                      {isSlowest && (
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                          Sekin
                        </span>
                      )}
                    </div>
                    <div className="text-center">
                      +{lapFmt.m}:{lapFmt.s}.{lapFmt.ms}
                    </div>
                    <div className="text-right font-bold">
                      {totFmt.m}:{totFmt.s}.{totFmt.ms}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
