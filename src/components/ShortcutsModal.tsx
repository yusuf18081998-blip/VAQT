import React from 'react';
import { Command, X, Keyboard } from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, lang }) => {
  const t = TRANSLATIONS[lang];
  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'Space', desc: t.shortcuts.space },
    { key: 'R', desc: t.shortcuts.rKey },
    { key: 'M', desc: t.shortcuts.mKey },
    { key: 'F', desc: t.shortcuts.fKey },
    { key: 'T', desc: t.shortcuts.tKey },
    { key: 'L', desc: t.shortcuts.lKey },
    { key: '? / H', desc: t.shortcuts.hKey },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl p-6 text-slate-100 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <Keyboard className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-white text-base">{t.shortcuts.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {shortcutsList.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition"
            >
              <span className="text-xs text-slate-300 font-medium">{item.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px] font-bold shadow-inner">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
        >
          {t.actions.close}
        </button>
      </div>
    </div>
  );
};
