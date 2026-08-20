import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2, Terminal, ExternalLink, Sparkles } from 'lucide-react';
import { STANDALONE_HTML, STANDALONE_CSS, STANDALONE_JS } from '../utils/standaloneCode';

export const SourceCodeView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const getActiveContent = () => {
    switch (activeFile) {
      case 'html':
        return { name: 'index.html', content: STANDALONE_HTML, lang: 'html' };
      case 'css':
        return { name: 'style.css', content: STANDALONE_CSS, lang: 'css' };
      case 'js':
        return { name: 'script.js', content: STANDALONE_JS, lang: 'javascript' };
    }
  };

  const current = getActiveContent();

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadFile = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    handleDownloadFile('index.html', STANDALONE_HTML, 'text/html');
    setTimeout(() => handleDownloadFile('style.css', STANDALONE_CSS, 'text/css'), 300);
    setTimeout(() => handleDownloadFile('script.js', STANDALONE_JS, 'text/javascript'), 600);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in">
      {/* Yuqori E'lon & Yuklab Olish Banneri */}
      <div className="rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900/50 to-purple-900/40 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileCode className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Sof HTML, CSS va JS Kodlari
            </h2>
          </div>
          <p className="text-sm text-slate-300 max-w-xl">
            Sizning soʻrovingiz boʻyicha barcha kodlar toza, alohida fayllarda va toʻliq izohlar (comments) bilan tayyorlandi. Ushbu fayllarni toʻgʻridan-toʻgʻri GitHub Pages (<span className="text-indigo-400 font-mono text-xs">VAQT</span>) loyihangizga yuklashingiz mumkin!
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <button
            onClick={handleDownloadAll}
            className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>3 ta Faylni Yuklab Olish</span>
          </button>
        </div>
      </div>

      {/* Kod Ko'rish Paneli */}
      <div className="rounded-3xl backdrop-blur-2xl bg-slate-950/80 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Fayllar Tabs */}
        <div className="flex items-center justify-between bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('html')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFile === 'html'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>index.html</span>
            </button>

            <button
              onClick={() => setActiveFile('css')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFile === 'css'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>style.css</span>
            </button>

            <button
              onClick={() => setActiveFile('js')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeFile === 'js'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>script.js</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(current.name, current.content)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all"
            >
              {copiedFile === current.name ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Nusxalandi!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nusxa olish</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleDownloadFile(
                  current.name,
                  current.content,
                  activeFile === 'html' ? 'text/html' : activeFile === 'css' ? 'text/css' : 'text/javascript'
                )
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{current.name} yuklab olish</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] font-mono text-xs sm:text-sm text-slate-300 leading-relaxed scrollbar-thin bg-[#090d16]">
          <pre className="whitespace-pre">
            <code>{current.content}</code>
          </pre>
        </div>
      </div>

      {/* GitHub Pages Qo'llanmasi */}
      <div className="rounded-3xl backdrop-blur-xl bg-white/30 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 p-6 shadow-xl flex flex-col gap-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-500" />
          GitHub Pages ga Joylashtirish Qoʻllanmasi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">1-Qadam:</span>
            <p className="text-slate-600 dark:text-slate-300">
              Ushbu sahifadagi <strong>3 ta faylni</strong> (<code className="font-mono bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">index.html</code>, <code className="font-mono bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">style.css</code>, <code className="font-mono bg-slate-200 dark:bg-slate-900 px-1 py-0.5 rounded">script.js</code>) yuklab oling.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">2-Qadam:</span>
            <p className="text-slate-600 dark:text-slate-300">
              GitHub dagi <strong className="font-mono">VAQT</strong> repozitoriyingizning asosiy ildiz papkasiga (<code className="font-mono">root</code>) ushbu 3 ta faylni yuklang (Commit changes).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">3-Qadam:</span>
            <p className="text-slate-600 dark:text-slate-300">
              Repozitoriy <em>Settings → Pages → Branch: main (root) → Save</em> qiling. 1-2 daqiqada yangi dizayn jonli ishga tushadi!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
