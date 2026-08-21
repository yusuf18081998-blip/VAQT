import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { binauralEngine } from '../utils/binauralEngine';
import { Language, TRANSLATIONS } from '../utils/translations';

interface SoundStatusIndicatorProps {
  compact?: boolean;
  showHotkey?: boolean;
  className?: string;
  lang?: Language;
}

export const SoundStatusIndicator: React.FC<SoundStatusIndicatorProps> = ({
  compact = false,
  showHotkey = true,
  className = '',
  lang,
}) => {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (lang) return lang;
    const saved = localStorage.getItem('vaqt_lang') as Language;
    return saved && ['uz', 'en', 'ru'].includes(saved) ? saved : 'uz';
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => binauralEngine.getIsMuted());
  const [activeAmbient, setActiveAmbient] = useState<string>(() => binauralEngine.getActiveAmbient());
  const [activeBinaural, setActiveBinaural] = useState<string>(() => binauralEngine.getActiveBinaural());

  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
    }
  }, [lang]);

  useEffect(() => {
    const handleLangChange = () => {
      const saved = localStorage.getItem('vaqt_lang') as Language;
      if (saved && ['uz', 'en', 'ru'].includes(saved)) {
        setCurrentLang(saved);
      }
    };

    window.addEventListener('vaqt_language_changed', handleLangChange);
    window.addEventListener('storage', handleLangChange);
    return () => {
      window.removeEventListener('vaqt_language_changed', handleLangChange);
      window.removeEventListener('storage', handleLangChange);
    };
  }, []);

  useEffect(() => {
    const updateState = () => {
      setIsMuted(binauralEngine.getIsMuted());
      setActiveAmbient(binauralEngine.getActiveAmbient());
      setActiveBinaural(binauralEngine.getActiveBinaural());
    };

    const unsubscribe = binauralEngine.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    binauralEngine.toggleMute();
  };

  const isPlayingSound = !isMuted && (activeAmbient !== 'none' || activeBinaural !== 'none');
  const tSound = TRANSLATIONS[currentLang]?.soundStatus || TRANSLATIONS.uz.soundStatus;

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleToggle}
        title={isMuted ? tSound.clickToUnmute : tSound.clickToMute}
        className={`p-2 rounded-xl border transition-all flex items-center justify-center relative active:scale-95 ${
          isMuted
            ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
            : isPlayingSound
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/20'
            : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30'
        } ${className}`}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4" />
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            {isPlayingSound && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={isMuted ? tSound.muteTooltip : tSound.unmuteTooltip}
      className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-2 select-none active:scale-95 backdrop-blur-md ${
        isMuted
          ? 'bg-rose-950/70 border-rose-500/40 text-rose-300 hover:bg-rose-900/80 shadow-sm'
          : isPlayingSound
          ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/20'
          : 'bg-slate-900/70 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800/80'
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Volume2 className={`w-3.5 h-3.5 ${isPlayingSound ? 'text-emerald-400 animate-pulse' : 'text-indigo-400'}`} />
        )}
        {isPlayingSound && !isMuted && (
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        )}
      </div>

      <span>
        {isMuted ? tSound.muted : isPlayingSound ? tSound.playing : tSound.on}
      </span>

      {showHotkey && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-white/10">
          M
        </span>
      )}
    </button>
  );
};

