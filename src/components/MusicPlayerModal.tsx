import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Upload,
  Plus,
  Trash2,
  X,
  Sparkles,
  Link2,
  Headphones,
  Bell
} from 'lucide-react';
import { AudioTrack, AlarmTone } from '../types';
import { soundEngine, DEFAULT_TRACKS } from '../utils/audioEngine';

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  onSelectTrack: (track: AudioTrack) => void;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  uploadedTracks: AudioTrack[];
  onAddUploadedTrack: (track: AudioTrack) => void;
  onDeleteUploadedTrack: (id: string) => void;
  selectedAlarm: AlarmTone;
  onSelectAlarm: (tone: AlarmTone) => void;
}

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  isPlaying,
  onSelectTrack,
  onTogglePlay,
  volume,
  onVolumeChange,
  uploadedTracks,
  onAddUploadedTrack,
  onDeleteUploadedTrack,
  selectedAlarm,
  onSelectAlarm,
}) => {
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customAudioTitle, setCustomAudioTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Handle local audio file upload (MP3, WAV, AAC, M4A, etc.)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newTrack: AudioTrack = {
        id: 'uploaded_' + Date.now(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'uploaded',
        icon: '🎵',
        type: 'file',
        source: dataUrl,
      };
      onAddUploadedTrack(newTrack);
      onSelectTrack(newTrack);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAddUrlTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAudioUrl.trim()) return;
    const newTrack: AudioTrack = {
      id: 'url_' + Date.now(),
      title: customAudioTitle.trim() || 'Internet Qoʻshiq',
      category: 'uploaded',
      icon: '🔗',
      type: 'url',
      source: customAudioUrl.trim(),
    };
    onAddUploadedTrack(newTrack);
    onSelectTrack(newTrack);
    setCustomAudioUrl('');
    setCustomAudioTitle('');
  };

  const alarmTones: { id: AlarmTone; name: string; desc: string }[] = [
    { id: 'marimba', name: '🎵 Marimba Akkordi', desc: 'Mayin va yoqimli musiqiy akkord' },
    { id: 'zen_bell', name: '🧘 Zen Qoʻngʻirogʻi', desc: 'Chuqur tinchlantiruvchi jarang' },
    { id: 'crystal', name: '💎 Kristal Navo', desc: 'Yorqin va toza qisqa kuylar' },
    { id: 'digital', name: '⏰ Raqamli Signal', desc: 'Klassik uygʻotgich bipi' },
    { id: 'cosmic_pulse', name: '🌌 Kosmik Puls', desc: 'Futuristik pulsatsiyali ovoz' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">Musiqa va Ovozlar Studiyasi</h3>
              <p className="text-xs text-slate-400">Dars uchun fon musiqasi va shaxsiy qoʻshiqlaringizni yuklang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Track Player & Volume */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">
              {currentTrack ? currentTrack.icon : '🎵'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">Hozirgi Tanlov</span>
              <h4 className="font-bold text-slate-100 text-sm truncate">
                {currentTrack ? currentTrack.title : "Musiqa tanlanmagan"}
              </h4>
              <span className="text-xs text-slate-400">
                {isPlaying ? "Ijro etilmoqda..." : "To'xtatilgan"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className={`p-3 rounded-2xl font-bold transition flex items-center gap-2 text-xs shadow-lg ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? "To'xtatish" : "Tinglash"}</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
              {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-indigo-400" />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-24 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 1. O'z qo'shig'ingizni fayldan yuklash (File Upload) */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>Oʻzingizning Musiqa yoki Qoʻshiq Faylingizni Yuklang</span>
            </h4>
            <span className="text-[10px] text-slate-400">MP3, WAV, M4A, OGG</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              id="audioFileInput"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? "Yuklanmoqda..." : "Faylni tanlash (Kompyuter/Telefon)"}</span>
            </button>
            <span className="text-xs text-slate-400 text-center sm:text-left">
              Faylingiz toʻgʻridan-toʻgʻri brauzeringizda xavfsiz saqlanadi va darsda ijro etiladi.
            </span>
          </div>

          {/* Audio URL orqali qo'shish */}
          <form onSubmit={handleAddUrlTrack} className="flex flex-col sm:flex-row gap-2 mt-1 pt-2 border-t border-indigo-500/20">
            <input
              type="text"
              placeholder="Qoʻshiq nomi (masalan: Sokin Piano)"
              value={customAudioTitle}
              onChange={(e) => setCustomAudioTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-full sm:w-48"
            />
            <input
              type="text"
              placeholder="Audio URL (https://...mp3)"
              value={customAudioUrl}
              onChange={(e) => setCustomAudioUrl(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>URL Qoʻshish</span>
            </button>
          </form>
        </div>

        {/* Foydalanuvchi yuklagan treklar ro'yxati */}
        {uploadedTracks.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-300">Siz Yuklagan Qoʻshiqlar ({uploadedTracks.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {uploadedTracks.map((track) => (
                <div
                  key={track.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between gap-2 ${
                    currentTrack?.id === track.id
                      ? 'bg-indigo-600/25 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectTrack(track);
                      if (!isPlaying) onTogglePlay();
                    }}
                    className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                  >
                    <span className="text-base">{track.icon}</span>
                    <span className="text-xs font-bold truncate">{track.title}</span>
                  </div>
                  <button
                    onClick={() => onDeleteUploadedTrack(track.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Dastur ichidagi Tayyor Tabiat va Lo-Fi Ovozlar */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Tayyor Tabiat & Fokus Ovozlar (Sintezator)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {DEFAULT_TRACKS.map((track) => {
              const isSelected = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    onSelectTrack(track);
                    if (!isPlaying) onTogglePlay();
                  }}
                  className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{track.icon}</span>
                    <div>
                      <h5 className="text-xs font-bold">{track.title}</h5>
                      <span className="text-[10px] text-slate-400">Cheksiz, mayin fon</span>
                    </div>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Taymer Yakunlangandagi Alarm Ovozini Tanlash */}
        <div className="flex flex-col gap-2.5 pt-4 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Taymer Yakunlangandagi Alarm Qoʻngʻirogʻi</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {alarmTones.map((tone) => (
              <div
                key={tone.id}
                onClick={() => onSelectAlarm(tone.id)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between gap-1.5 ${
                  selectedAlarm === tone.id
                    ? 'bg-indigo-600/25 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{tone.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playAlarm(tone.id);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30"
                  >
                    Eshitish ▶
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">{tone.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer close */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
        >
          Tayyor va Yopish
        </button>
      </div>
    </div>
  );
};
