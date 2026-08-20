import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Headphones,
  CloudRain,
  Waves,
  Trees,
  Coffee,
  Radio,
  Clock,
  Sparkles,
  Zap,
  Flame,
  X,
  Sliders,
  Check,
} from 'lucide-react';
import { binauralEngine, BinauralMode, AmbientNoise } from '../utils/binauralEngine';
import { AudioVisualizer, VisualizerMode } from './AudioVisualizer';
import { Language, TRANSLATIONS } from '../utils/translations';

interface SoundscapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const SoundscapeModal: React.FC<SoundscapeModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeBinaural, setActiveBinaural] = useState<BinauralMode>('none');
  const [activeAmbient, setActiveAmbient] = useState<AmbientNoise>('none');
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('waves');

  useEffect(() => {
    if (isOpen) {
      setActiveBinaural(binauralEngine.getActiveBinaural());
      setActiveAmbient(binauralEngine.getActiveAmbient());
      setVolume(binauralEngine.getVolume());
      setIsMuted(binauralEngine.getIsMuted());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectBinaural = (mode: BinauralMode) => {
    const next = activeBinaural === mode ? 'none' : mode;
    setActiveBinaural(next);
    binauralEngine.setBinauralBeat(next);
  };

  const handleSelectAmbient = (type: AmbientNoise) => {
    const next = activeAmbient === type ? 'none' : type;
    setActiveAmbient(next);
    binauralEngine.setAmbientSound(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    binauralEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    const muted = binauralEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl p-5 sm:p-7 text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                {t.soundscapes.title}
              </h3>
              <p className="text-xs text-slate-400">
                {t.soundscapes.binauralBeats} & {t.soundscapes.ambientSounds}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Banner */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              {t.soundscapes.visualizerMode}
            </span>
            <div className="flex items-center gap-1">
              {(['waves', 'bars', 'particles', 'ring'] as VisualizerMode[]).map((vm) => (
                <button
                  key={vm}
                  onClick={() => setVisualizerMode(vm)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                    visualizerMode === vm
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {vm}
                </button>
              ))}
            </div>
          </div>
          <AudioVisualizer
            mode={visualizerMode}
            isActive={activeBinaural !== 'none' || activeAmbient !== 'none'}
            className="w-full h-20 bg-slate-900/50 rounded-xl border border-slate-800/80"
          />
        </div>

        {/* SECTION 1: BINAURAL BEATS */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.soundscapes.binauralBeats}</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Gamma 40Hz */}
            <button
              onClick={() => handleSelectBinaural('gamma')}
              className={`p-3 rounded-2xl text-left border transition flex items-start gap-3 ${
                activeBinaural === 'gamma'
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.soundscapes.gammaTitle}</span>
                  {activeBinaural === 'gamma' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.soundscapes.gammaDesc}</p>
              </div>
            </button>

            {/* Beta 20Hz */}
            <button
              onClick={() => handleSelectBinaural('beta')}
              className={`p-3 rounded-2xl text-left border transition flex items-start gap-3 ${
                activeBinaural === 'beta'
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.soundscapes.betaTitle}</span>
                  {activeBinaural === 'beta' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.soundscapes.betaDesc}</p>
              </div>
            </button>

            {/* Alpha 10Hz */}
            <button
              onClick={() => handleSelectBinaural('alpha')}
              className={`p-3 rounded-2xl text-left border transition flex items-start gap-3 ${
                activeBinaural === 'alpha'
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Trees className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.soundscapes.alphaTitle}</span>
                  {activeBinaural === 'alpha' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.soundscapes.alphaDesc}</p>
              </div>
            </button>

            {/* Theta 6Hz */}
            <button
              onClick={() => handleSelectBinaural('theta')}
              className={`p-3 rounded-2xl text-left border transition flex items-start gap-3 ${
                activeBinaural === 'theta'
                  ? 'bg-indigo-600/30 border-indigo-500 ring-2 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{t.soundscapes.thetaTitle}</span>
                  {activeBinaural === 'theta' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{t.soundscapes.thetaDesc}</p>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: AMBIENT SOUNDSCAPES */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2.5 flex items-center gap-2">
            <Radio className="w-4 h-4 text-pink-400" />
            <span>{t.soundscapes.ambientSounds}</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'rain', name: t.soundscapes.rain, icon: CloudRain, color: 'text-blue-400' },
              { id: 'waves', name: t.soundscapes.waves, icon: Waves, color: 'text-cyan-400' },
              { id: 'forest', name: t.soundscapes.forest, icon: Trees, color: 'text-emerald-400' },
              { id: 'cafe', name: t.soundscapes.cafe, icon: Coffee, color: 'text-amber-400' },
              { id: 'lofi', name: t.soundscapes.lofi, icon: Radio, color: 'text-purple-400' },
              { id: 'white', name: t.soundscapes.whiteNoise, icon: Sliders, color: 'text-slate-300' },
              { id: 'pink', name: t.soundscapes.pinkNoise, icon: Sliders, color: 'text-pink-400' },
              { id: 'brown', name: t.soundscapes.brownNoise, icon: Sliders, color: 'text-orange-400' },
            ].map((amb) => {
              const IconComp = amb.icon;
              const isSelected = activeAmbient === amb.id;
              return (
                <button
                  key={amb.id}
                  onClick={() => handleSelectAmbient(amb.id as AmbientNoise)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${amb.color}`} />
                  <span className="text-xs font-medium truncate">{amb.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Volume Slider & Controls */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={handleToggleMute}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition shrink-0"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{t.soundscapes.volume}</span>
              <span className="font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          <button
            onClick={() => {
              binauralEngine.stopBinaural();
              binauralEngine.stopAmbient();
              setActiveBinaural('none');
              setActiveAmbient('none');
            }}
            className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition shrink-0"
          >
            {t.actions.clear}
          </button>
        </div>
      </div>
    </div>
  );
};
