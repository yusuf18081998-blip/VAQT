import React, { useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Link2,
  Sliders,
  Check,
  X,
  Sparkles,
  Trash2,
  Eye
} from 'lucide-react';
import { BackgroundPreset } from '../types';

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBgId: string;
  onSelectPreset: (id: string) => void;
  customBgUrl: string;
  onSetCustomBgUrl: (url: string) => void;
  bgDarkness: number;
  onDarknessChange: (val: number) => void;
  bgBlur: number;
  onBlurChange: (val: number) => void;
}

export const PRESET_BACKGROUNDS: BackgroundPreset[] = [
  { id: 'cosmic', name: '🌌 Kosmik Tun', type: 'gradient', value: 'radial-gradient(ellipse at top, #1e1b4b, #090d16 60%, #020617 100%)' },
  { id: 'emerald', name: '🌲 Zumrad Kecha', type: 'gradient', value: 'radial-gradient(ellipse at top, #064e3b, #022c22 60%, #020617 100%)' },
  { id: 'nebula', name: '🔮 Binafsha Tuman', type: 'gradient', value: 'radial-gradient(ellipse at top, #581c87, #1e1035 60%, #020617 100%)' },
  { id: 'cyber', name: '💎 Kiber Moviy', type: 'gradient', value: 'radial-gradient(ellipse at top, #0c4a6e, #082f49 60%, #020617 100%)' },
  { id: 'stars', name: '✨ Yulduzli Fazolar', type: 'image', value: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80' },
  { id: 'lofi', name: '☕ Lo-Fi Fokus Xona', type: 'image', value: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1920&q=80' },
  { id: 'sunset', name: '🌇 Oltin Quyosh Botishi', type: 'image', value: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1920&q=80' },
  { id: 'cyberpunk_city', name: '🌆 Kiber Tungi Shahar', type: 'image', value: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1920&q=80' },
  { id: 'minimal_dark', name: '⬛ Toza Chuqur Qora', type: 'gradient', value: '#020617' },
];

export const BackgroundSettingsModal: React.FC<BackgroundSettingsModalProps> = ({
  isOpen,
  onClose,
  activeBgId,
  onSelectPreset,
  customBgUrl,
  onSetCustomBgUrl,
  bgDarkness,
  onDarknessChange,
  bgBlur,
  onBlurChange,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle local image file upload (JPG, PNG, WEBP)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSetCustomBgUrl(dataUrl);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onSetCustomBgUrl(urlInput.trim());
    setUrlInput('');
  };

  const handleClearCustomBg = () => {
    onSetCustomBgUrl('');
    onSelectPreset('cosmic');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">Orqa Fon va Dizayn Sozlamalari</h3>
              <p className="text-xs text-slate-400">Oʻz suratlaringizni yuklang yoki tayyor galereyadan tanlang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. O'z suratingizni fayldan yuklash (Local File Upload) */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Oʻz Kompyuteringiz yoki Telefoningizdan Surat Yuklash</span>
            </h4>
            <span className="text-[10px] text-slate-400">PNG, JPG, WEBP, GIF</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="bgImageFileInput"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Yuklanmoqda..." : "Surat Faylini Tanlash"}</span>
            </button>
            <span className="text-xs text-slate-400 text-center sm:text-left">
              Tanlangan rasm darhol toʻliq ekran foni sifatida oʻrnatiladi.
            </span>
          </div>

          {/* Rasm URL orqali yuklash */}
          <form onSubmit={handleApplyUrl} className="flex gap-2 mt-1 pt-2 border-t border-indigo-500/20">
            <input
              type="text"
              placeholder="Rasm havolasi (https://images.unsplash.com/...)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Link2 className="w-4 h-4" />
              <span>Qoʻllash</span>
            </button>
          </form>

          {/* Agar custom fon mavjud bo'lsa */}
          {customBgUrl && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-emerald-400 font-medium">✓ Shaxsiy rasm foni faol</span>
              <button
                onClick={handleClearCustomBg}
                className="text-rose-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Oʻchirish & Standartga qaytish</span>
              </button>
            </div>
          )}
        </div>

        {/* 2. Fon Qorong'uligi va Xiralik (Darkness & Blur Control) */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Matn Oʻqilishini Yaxshilash (Overlay Sozlamalari)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Qorongʻulik darajasi</span>
                <span className="font-mono text-indigo-400">{Math.round(bgDarkness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.95"
                step="0.05"
                value={bgDarkness}
                onChange={(e) => onDarknessChange(parseFloat(e.target.value))}
                className="accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Fon Xiraligi (Blur)</span>
                <span className="font-mono text-indigo-400">{bgBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={bgBlur}
                onChange={(e) => onBlurChange(parseInt(e.target.value))}
                className="accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3. Tayyor Premium Fonlar Galereyasi */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Tayyor Mavzular va Rasmlar</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {PRESET_BACKGROUNDS.map((preset) => {
              const isSelected = !customBgUrl && activeBgId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSetCustomBgUrl('');
                    onSelectPreset(preset.id);
                  }}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition flex flex-col justify-between h-20 relative overflow-hidden group ${
                    isSelected
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  style={
                    preset.type === 'gradient'
                      ? { background: preset.value }
                      : {
                          backgroundImage: `linear-gradient(rgba(2,6,23,0.5), rgba(2,6,23,0.7)), url("${preset.value}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                  }
                >
                  <span className="text-xs font-bold text-white drop-shadow-md z-10">{preset.name}</span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Saqlash va Yopish
        </button>
      </div>
    </div>
  );
};
