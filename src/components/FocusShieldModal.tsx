import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Globe,
  Sparkles,
  Layers,
  Laptop,
  Flame,
  Volume2,
  Terminal,
  Cpu,
} from 'lucide-react';
import { FocusStudyApp, FocusShieldConfig, BlockedDistraction } from '../types';
import { Language } from '../utils/translations';

export const DEFAULT_STUDY_APPS: FocusStudyApp[] = [
  {
    id: 'app_chatgpt',
    name: 'ChatGPT / AI Yordamchi',
    url: 'https://chatgpt.com',
    icon: '🤖',
    category: 'ai',
    isAllowed: true,
  },
  {
    id: 'app_notion',
    name: 'Notion / Konspekt',
    url: 'https://notion.so',
    icon: '📝',
    category: 'notes',
    isAllowed: true,
  },
  {
    id: 'app_youtube_edu',
    name: 'YouTube (Faqat Dars & Ma\'ruzalar)',
    url: 'https://youtube.com',
    icon: '📺',
    category: 'study_video',
    isAllowed: true,
  },
  {
    id: 'app_github',
    name: 'GitHub / Dasturlash',
    url: 'https://github.com',
    icon: '💻',
    category: 'coding',
    isAllowed: true,
  },
  {
    id: 'app_coursera',
    name: 'Coursera / Khan Academy',
    url: 'https://coursera.org',
    icon: '🎓',
    category: 'courses',
    isAllowed: true,
  },
  {
    id: 'app_gdocs',
    name: 'Google Docs & Sheets',
    url: 'https://docs.google.com',
    icon: '📄',
    category: 'docs',
    isAllowed: true,
  },
  {
    id: 'app_w3schools',
    name: 'W3Schools / MDN Docs',
    url: 'https://w3schools.com',
    icon: '🌐',
    category: 'reference',
    isAllowed: true,
  },
  {
    id: 'app_duolingo',
    name: 'Duolingo / Til O\'rganish',
    url: 'https://duolingo.com',
    icon: '🦉',
    category: 'languages',
    isAllowed: false,
  },
  {
    id: 'app_figma',
    name: 'Figma / UI Dizayn',
    url: 'https://figma.com',
    icon: '🎨',
    category: 'design',
    isAllowed: false,
  },
];

export const DEFAULT_BLOCKED_DISTRACTIONS: BlockedDistraction[] = [
  { id: 'b_insta', name: 'Instagram', domain: 'instagram.com', category: 'social' },
  { id: 'b_tiktok', name: 'TikTok', domain: 'tiktok.com', category: 'video' },
  { id: 'b_shorts', name: 'YouTube Shorts / Reels', domain: 'youtube.com/shorts', category: 'video' },
  { id: 'b_tg', name: 'Telegram Web (Chalg\'ituvchi kanallar)', domain: 'web.telegram.org', category: 'social' },
  { id: 'b_twitter', name: 'X / Twitter', domain: 'x.com', category: 'social' },
  { id: 'b_fb', name: 'Facebook', domain: 'facebook.com', category: 'social' },
  { id: 'b_netflix', name: 'Netflix & Kinolar', domain: 'netflix.com', category: 'video' },
  { id: 'b_reddit', name: 'Reddit & Memelar', domain: 'reddit.com', category: 'social' },
  { id: 'b_games', name: 'Twitch & Onlayn O\'yinlar', domain: 'twitch.tv', category: 'gaming' },
];

interface FocusShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FocusShieldConfig;
  onChangeConfig: (newConfig: FocusShieldConfig) => void;
  lang: Language;
  onStartFocusWithApps?: () => void;
  isFocusRunning?: boolean;
}

export const FocusShieldModal: React.FC<FocusShieldModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  lang,
  onStartFocusWithApps,
  isFocusRunning = false,
}) => {
  const [activeTab, setActiveTab] = useState<'allowed' | 'blocked' | 'export'>('allowed');
  const [newAppName, setNewAppName] = useState('');
  const [newAppUrl, setNewAppUrl] = useState('');
  const [newBlockedDomain, setNewBlockedDomain] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const toggleAppAllowed = (appId: string) => {
    const updated = config.allowedApps.map((a) =>
      a.id === appId ? { ...a, isAllowed: !a.isAllowed } : a
    );
    onChangeConfig({ ...config, allowedApps: updated });
  };

  const handleAddNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    let formattedUrl = newAppUrl.trim();
    if (formattedUrl && !formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newApp: FocusStudyApp = {
      id: `app_custom_${Date.now()}`,
      name: newAppName.trim(),
      url: formattedUrl || undefined,
      icon: '✨',
      category: 'custom',
      isAllowed: true,
      custom: true,
    };

    onChangeConfig({
      ...config,
      allowedApps: [newApp, ...config.allowedApps],
    });

    setNewAppName('');
    setNewAppUrl('');
  };

  const handleDeleteApp = (appId: string) => {
    onChangeConfig({
      ...config,
      allowedApps: config.allowedApps.filter((a) => a.id !== appId),
    });
  };

  const handleAddBlockedDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDomain = newBlockedDomain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!cleanDomain || config.customBlockedDomains.includes(cleanDomain)) return;

    onChangeConfig({
      ...config,
      customBlockedDomains: [...config.customBlockedDomains, cleanDomain],
    });
    setNewBlockedDomain('');
  };

  const handleDeleteBlockedDomain = (domain: string) => {
    onChangeConfig({
      ...config,
      customBlockedDomains: config.customBlockedDomains.filter((d) => d !== domain),
    });
  };

  const allowedCount = config.allowedApps.filter((a) => a.isAllowed).length;
  const totalBlockedCount = DEFAULT_BLOCKED_DISTRACTIONS.length + config.customBlockedDomains.length;

  const generateWindowsBat = () => {
    const domains = [
      ...DEFAULT_BLOCKED_DISTRACTIONS.map((b) => b.domain.split('/')[0]),
      ...config.customBlockedDomains,
    ];
    const unique = Array.from(new Set(domains));

    return `@echo off
:: VAQT Focus Shield - 100% Avtomatik Qulflash Skripti
title VAQT Focus Blocker
echo ======================================================
echo    VAQT: Dars vaqtida chalg'ituvchi saytlar qulflanmoqda...
echo ======================================================
echo.

:: Admin huquqini tekshirish
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [XATOLIK] Iltimos, ushbu faylni "Administrator nomidan ishga tushiring"!
    echo (O'ng tugmani bosib, "Run as administrator" ni tanlang)
    echo.
    pause
    exit /b
)

set HOSTS_FILE=%windir%\\System32\\drivers\\etc\\hosts

echo # --- VAQT_FOCUS_SHIELD_START --- >> "%HOSTS_FILE%"
${unique.map((d) => `echo 0.0.0.0 ${d} >> "%HOSTS_FILE%"\necho 0.0.0.0 www.${d} >> "%HOSTS_FILE%"`).join('\n')}
echo # --- VAQT_FOCUS_SHIELD_END --- >> "%HOSTS_FILE%"

ipconfig /flushdns >nul 2>&1

echo.
echo ======================================================
echo  [MUVAFFAQIYAT!] Saytlar 100% qulflandi!
echo  Endi Instagram, TikTok va boshqa saytlarga kirib bo'lmaydi!
echo.
echo  Dars tugagach "vaqt-qulfni-ochish.bat" orqali qulfni ochasiz.
echo ======================================================
echo.
pause
`;
  };

  const generateWindowsUnlockBat = () => {
    return `@echo off
:: VAQT Focus Shield - Qulfni Yechish Skripti
title VAQT Focus Unblocker
echo ======================================================
echo    VAQT: Chalg'ituvchi saytlar qulfi ochilmoqda...
echo ======================================================
echo.

net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [XATOLIK] Iltimos, ushbu faylni "Administrator nomidan ishga tushiring"!
    echo (O'ng tugmani bosib, "Run as administrator" ni tanlang)
    echo.
    pause
    exit /b
)

set HOSTS_FILE=%windir%\\System32\\drivers\\etc\\hosts
set TEMP_FILE=%temp%\\hosts_cleaned.txt

powershell -Command "$content = Get-Content '%HOSTS_FILE%' -Raw; $cleaned = $content -replace '(?s)# --- VAQT_FOCUS_SHIELD_START ---.*?# --- VAQT_FOCUS_SHIELD_END ---\\r?\\n?', ''; Set-Content '%HOSTS_FILE%' $cleaned.Trim()"

ipconfig /flushdns >nul 2>&1

echo.
echo ======================================================
echo  [TABRIKLAYMIZ!] Qulf muvaffaqiyatli ochildi!
echo  Barcha saytlarga kirish yana tiklandi.
echo ======================================================
echo.
pause
`;
  };

  const downloadLockBat = () => {
    const text = generateWindowsBat();
    const blob = new Blob([text], { type: 'application/bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaqt-saytlarni-qulflash.bat';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadUnlockBat = () => {
    const text = generateWindowsUnlockBat();
    const blob = new Blob([text], { type: 'application/bat;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaqt-qulfni-ochish.bat';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-xl text-white">
                  Dars Ilovalari & Saytlar Qulfi (Focus Shield)
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Ultra Lock
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Dars qiladigan saytlaringizni belgilang. Qolgan barcha chalgʻituvchi saytlar qulflanadi!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Global Master Switch & Strict Mode */}
        <div className="p-4 sm:p-5 bg-indigo-950/30 border-b border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => onChangeConfig({ ...config, isEnabled: !config.isEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                config.isEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                  config.isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">
                {config.isEnabled ? '🛡️ Dars Qulfi Faollashtirilgan' : '⚪ Dars Qulfi Oʻchirilgan'}
              </span>
              <span className="text-xs text-slate-400">
                Fokus paytida taymer uzluksiz ishlaydi va chalgʻishlar qulflanadi
              </span>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white">
            <input
              type="checkbox"
              checked={config.strictLockout}
              onChange={(e) => onChangeConfig({ ...config, strictLockout: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
            />
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Qatʻiy Qulf (Tabdan chiqilsa qulf ekrani chiqadi)</span>
          </label>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('allowed')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'allowed'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ruxsat Etilgan Dars Saytlari ({allowedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('blocked')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'blocked'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Qulflangan Saytlar ({totalBlockedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'export'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4 text-indigo-400" />
            <span>Brauzer & Kompyuterda 100% Qulflash</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[50vh]">
          {activeTab === 'allowed' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Quyidagi roʻyxatdan dars vaqtingizda foydalanadigan saytlarni belgilang (yashil chipta). Belgilanmagan har qanday tashqi saytga oʻtilsa, VAQT qulfi ogohlantiradi!
                </span>
              </div>

              {/* Add Custom App Form */}
              <form onSubmit={handleAddNewApp} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Dars portali nomi (masalan: Najot Ta'lim, LMS, LeetCode)"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Sayt havolasi (masalan: lms.edu.uz)"
                  value={newAppUrl}
                  onChange={(e) => setNewAppUrl(e.target.value)}
                  className="sm:w-48 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30 transition shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Qoʻshish</span>
                </button>
              </form>

              {/* Apps List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {config.allowedApps.map((app) => (
                  <div
                    key={app.id}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      app.isAllowed
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-white'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 opacity-60'
                    }`}
                  >
                    <div
                      className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                      onClick={() => toggleAppAllowed(app.id)}
                    >
                      <span className="text-xl shrink-0">{app.icon || '📱'}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs sm:text-sm truncate block">
                            {app.name}
                          </span>
                        </div>
                        {app.url && (
                          <span className="text-[10px] text-slate-500 truncate block">
                            {app.url.replace(/^https?:\/\//, '')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                          title="Saytga o'tish"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleAppAllowed(app.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${
                          app.isAllowed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      {app.custom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteApp(app.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'blocked' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Ushbu chalgʻituvchi tarmoqlar va oʻyinlar fokus davomida 100% qulflangan holatda turadi. Agar oʻzingizning maxsus chalgʻituvchi saytingiz boʻlsa, pastdan qoʻshib qoʻying.
                </span>
              </div>

              {/* Add Custom Distraction */}
              <form onSubmit={handleAddBlockedDomain} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Chalg'ituvchi sayt domeni (masalan: olx.uz, steam.com, anime.uz)"
                  value={newBlockedDomain}
                  onChange={(e) => setNewBlockedDomain(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30 transition shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Qulflash</span>
                </button>
              </form>

              {/* Preset Blocked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEFAULT_BLOCKED_DISTRACTIONS.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                        🚫
                      </div>
                      <div>
                        <span className="font-bold text-rose-200 block">{item.name}</span>
                        <span className="text-[10px] text-rose-400/80 font-mono">{item.domain}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      Qulflangan
                    </span>
                  </div>
                ))}

                {/* Custom Blocked Domains */}
                {config.customBlockedDomains.map((domain) => (
                  <div
                    key={domain}
                    className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-rose-500/30 text-rose-300 flex items-center justify-center">
                        🔒
                      </div>
                      <div>
                        <span className="font-bold text-white block">{domain}</span>
                        <span className="text-[10px] text-rose-400 font-mono">Maxsus qulf</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteBlockedDomain(domain)}
                      className="p-1 text-rose-400 hover:text-white"
                      title="Qulfni olib tashlash"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-start gap-2.5">
                <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-1 text-white text-sm">
                    Kompyuterda Saytlarni 100% Qulflash (Umuman Ochilmaydigan Qilish)
                  </span>
                  <span>
                    Brauzer xavfsizlik cheklovlari tufayli hech qaysi veb-sayt foydalanuvchining boshqa tablarini oʻzi yopolmaydi. Biroq quyidagi <strong>1-bosishda ishlaydigan tayyor dastur (.bat)</strong> orqali Instagram, TikTok, YouTube va oʻyinlarni kompyuteringizda <strong>100% kirib boʻlmaydigan</strong> qilib qulflashingiz mumkin!
                  </span>
                </div>
              </div>

              {/* 1-Click Windows BAT Blockers */}
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" /> ⚡ Windows uchun 1-Bosishda Avtomatik Qulflovchi
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                    ENG OSONI
                  </span>
                </div>

                <p className="text-[12px] text-slate-300 leading-relaxed">
                  1. Pastdagi <strong className="text-emerald-400">"Qulflash (.bat)"</strong> tugmasini bosib faylni yuklab oling.<br />
                  2. Fayl ustiga sichqonchaning oʻng tugmasini bosib, <strong className="text-amber-300">"Run as administrator" (Administrator nomidan ishga tushirish)</strong> ni bosing.<br />
                  3. Barcha chalgʻituvchi saytlar brauzeringizda <strong>umuman ochilmaydi</strong>!<br />
                  4. Dars tugagach <strong className="text-indigo-400">"Qulfni Yechish (.bat)"</strong> faylini xuddi shunday ishga tushirasiz.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={downloadLockBat}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.02]"
                  >
                    <Lock className="w-4 h-4" />
                    <span>1. Saytlarni Qulflash (.bat) Yuklab Olish</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadUnlockBat}
                    className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>2. Qulfni Yechish (.bat) Yuklab Olish</span>
                  </button>
                </div>
              </div>

              {/* Mac / Linux Command */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4" /> Mac va Linux uchun Terminal Buyrugʻi
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const macCmd = `sudo bash -c 'echo "# --- VAQT START ---\\n0.0.0.0 instagram.com\\n0.0.0.0 tiktok.com\\n0.0.0.0 x.com\\n0.0.0.0 twitch.tv\\n# --- VAQT END ---" >> /etc/hosts' && sudo dscacheutil -flushcache`;
                      navigator.clipboard.writeText(macCmd);
                      setCopiedCmd(true);
                      setTimeout(() => setCopiedCmd(false), 2500);
                    }}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd ? 'Nusxalandi!' : 'Terminal buyrugʻini nusxalash'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Terminalni ochib ushbu buyruqni qoʻysangiz, saytlar Mac kompyuteringizda ham zudlik bilan qulflanadi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              <strong className="text-white">{allowedCount}</strong> ta dars vositasi ruxsatda
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            >
              Saqlash va Yopish
            </button>

            {onStartFocusWithApps && !isFocusRunning && (
              <button
                onClick={() => {
                  onClose();
                  onStartFocusWithApps();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Fokusni Boshlash</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
