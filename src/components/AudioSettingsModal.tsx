import React, { useState } from 'react';
import { Volume2, Bell, Check, Play, Sparkles } from 'lucide-react';
import { SoundType } from '../types';
import { SOUND_OPTIONS, playTimerSound } from '../utils/audio';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSound: SoundType;
  onSelectSound: (sound: SoundType) => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  selectedSound,
  onSelectSound,
}) => {
  const [volume, setVolume] = useState<number>(0.8);
  const [testingSound, setTestingSound] = useState<SoundType | null>(null);

  if (!isOpen) return null;

  const handleTestSound = (sound: SoundType) => {
    setTestingSound(sound);
    playTimerSound(sound, volume);
    setTimeout(() => setTestingSound(null), 1500);
  };

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('VAQT Bildirishnomalari', {
          body: 'Taymer tugaganda sizga shu yerda bildirishnoma yuboriladi!',
          icon: '/favicon.ico',
        });
      }
    } else {
      alert('Brauzeringiz Notification API ni qoʻllab-quvvatlamaydi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl backdrop-blur-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
                Ovoz & Signal Sozlamalari
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Taymer tugaganda yangraydigan ohangni tanlang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Ovoz Balandligi</span>
            <span className="font-mono">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Sound Selection Options */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {SOUND_OPTIONS.map((opt) => {
            const isSelected = selectedSound === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onSelectSound(opt.id)}
                className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/40 text-indigo-900 dark:text-indigo-200'
                    : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {opt.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTestSound(opt.id);
                  }}
                  className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                  title="Sinab ko'rish"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Browser Notifications Button */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <button
            onClick={handleRequestNotification}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Bell className="w-4 h-4 text-indigo-500" />
            <span>Fon bildirishnomalarini yoqish</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Saqlash va Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
