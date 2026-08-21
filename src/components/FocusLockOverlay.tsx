import React, { useEffect, useState } from 'react';
import {
  Lock,
  ShieldAlert,
  Flame,
  ArrowRight,
  ExternalLink,
  TreePine,
  AlertTriangle,
  Sparkles,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { FocusStudyApp, TreeSpecies } from '../types';
import { SPECIES_INFO } from './FocusTreeVisualizer';

interface FocusLockOverlayProps {
  isOpen: boolean;
  onDismiss: () => void;
  taskTitle?: string;
  allowedApps: FocusStudyApp[];
  species: TreeSpecies;
  leftAppCount: number;
  minutesRemaining: string;
}

export const FocusLockOverlay: React.FC<FocusLockOverlayProps> = ({
  isOpen,
  onDismiss,
  taskTitle,
  allowedApps,
  species,
  leftAppCount,
  minutesRemaining,
}) => {
  const [pulsing, setPulsing] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger audio beep or alert if available
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch {}
  }, [isOpen]);

  if (!isOpen) return null;

  const allowedStudyList = allowedApps.filter((a) => a.isAllowed);
  const treeInfo = SPECIES_INFO[species] || SPECIES_INFO.apple;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in text-slate-100">
      {/* Background Warning Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-rose-600/20 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900/95 border-2 border-rose-500/50 shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden">
        {/* Top Lock Icon Badge */}
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border-2 border-rose-500/60 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/30 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-black">
            !
          </div>
        </div>

        {/* Header Alert */}
        <span className="text-xs font-black uppercase tracking-widest text-rose-400 bg-rose-950/80 px-3 py-1 rounded-full border border-rose-500/30 mb-2">
          ⛔ VAQT DARS QULFI ISHGA TUSHDI
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
          Chalgʻituvchi Saytlar Qulflangan!
        </h2>

        <p className="text-sm text-slate-300 mt-2 max-w-md">
          Siz hozir <strong className="text-indigo-400">{taskTitle || 'Dars / Chuqur Fokus'}</strong>{' '}
          mashgʻulotidamasiz. Fokus tugashiga yana <strong className="text-white font-mono">{minutesRemaining}</strong> qoldi.
        </p>

        {/* Tree Protection Warning */}
        <div className="w-full my-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-left text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{treeInfo.icon}</span>
            <div>
              <span className="font-bold text-amber-200 block">
                {treeInfo.name} unib oʻsmoqda
              </span>
              <span className="text-amber-400/90 text-[11px]">
                Ilovani tark etsangiz ({leftAppCount}/3), niholingiz qurib qoladi!
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px]">
            Himoyada
          </span>
        </div>

        {/* Allowed Study Apps Quick Links */}
        {allowedStudyList.length > 0 && (
          <div className="w-full my-2 text-left">
            <span className="text-xs font-extrabold text-slate-400 block mb-2">
              📚 Ruxsat etilgan dars vositalariga oʻtish:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {allowedStudyList.map((app) => (
                <a
                  key={app.id}
                  href={app.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between gap-1.5 transition group"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{app.icon || '📖'}</span>
                    <span className="truncate">{app.name}</span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Return to Study Button */}
        <div className="w-full mt-5 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDismiss}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Darsga Qaytish (Fokusni Davom Ettirish)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
