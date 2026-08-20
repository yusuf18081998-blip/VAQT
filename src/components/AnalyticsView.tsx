import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Trees,
  Download,
  Upload,
  Calendar,
  FileSpreadsheet,
  FileJson,
  Sparkles,
  RotateCcw,
  Zap,
  Target,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '../utils/translations';
import { PlantedTree, TaskItem } from '../types';

interface AnalyticsViewProps {
  lang: Language;
  plantedTrees: PlantedTree[];
  tasks: TaskItem[];
  onDataImported?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  lang,
  plantedTrees,
  tasks,
  onDataImported,
}) => {
  const t = TRANSLATIONS[lang];
  const [history, setHistory] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const raw = localStorage.getItem('pomodoro_sessions_history');
    if (raw) {
      try {
        setHistory(JSON.parse(raw));
      } catch (e) {
        setHistory([]);
      }
    } else {
      // Seed initial mock-realistic weekly baseline if empty for immediate rich chart visualization
      const sampleDays = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
      const initial = sampleDays.map((day, idx) => ({
        day,
        date: new Date(Date.now() - (6 - idx) * 86400000).toISOString().split('T')[0],
        minutes: idx === 6 ? 45 : Math.floor(60 + Math.random() * 120),
        pomodoros: idx === 6 ? 2 : Math.floor(2 + Math.random() * 4),
      }));
      setHistory(initial);
      localStorage.setItem('pomodoro_sessions_history', JSON.stringify(initial));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Compute metrics
  const totalMinutes = history.reduce((acc, curr) => acc + (curr.minutes || 0), 0) +
    plantedTrees.reduce((acc, t) => acc + (t.status === 'alive' ? t.minutesFocused : 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntry = history.find((h) => h.date === todayStr);
  const todayHours = (((todayEntry?.minutes || 0) + (plantedTrees.filter(t => new Date(t.plantedAt).toISOString().split('T')[0] === todayStr && t.status === 'alive').reduce((a, b) => a + b.minutesFocused, 0))) / 60).toFixed(1);

  const completedPomosCount = history.reduce((acc, curr) => acc + (curr.pomodoros || 0), 0) +
    plantedTrees.filter(t => t.status === 'alive').length;

  const aliveTreesCount = plantedTrees.filter(t => t.status === 'alive').length;
  const completedTasksCount = tasks.filter(t => t.completed).length;

  // Productivity Score formula
  const productivityScore = Math.min(
    100,
    Math.round(
      (completedPomosCount * 12) +
      (aliveTreesCount * 10) +
      (completedTasksCount * 8) +
      (parseFloat(todayHours) * 15)
    )
  );

  // Prepare 7-day chart data
  const chartData = history.slice(-7).map((item) => ({
    name: item.day || item.date?.slice(5),
    hours: parseFloat(((item.minutes || 0) / 60).toFixed(1)),
    pomos: item.pomodoros || 1,
  }));

  // EXPORT TO JSON
  const handleExportJson = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      history,
      plantedTrees,
      tasks,
      theme: localStorage.getItem('theme_preference') || 'dark',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaqt_backup_${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON zaxira fayli yuklab olindi!');
  };

  // EXPORT TO CSV
  const handleExportCsv = () => {
    let csvContent = 'Date,Day,Focus_Minutes,Focus_Hours,Pomodoros_Completed\n';
    history.forEach((row) => {
      csvContent += `${row.date || ''},${row.day || ''},${row.minutes || 0},${((row.minutes || 0) / 60).toFixed(2)},${row.pomodoros || 0}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaqt_analytics_${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV fayli Excel uchun tayyorlandi va yuklandi!');
  };

  // IMPORT FROM JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.history) {
          localStorage.setItem('pomodoro_sessions_history', JSON.stringify(parsed.history));
          setHistory(parsed.history);
        }
        if (parsed.plantedTrees) {
          localStorage.setItem('vaqt_forest_trees', JSON.stringify(parsed.plantedTrees));
        }
        if (parsed.tasks) {
          localStorage.setItem('vaqt_tasks', JSON.stringify(parsed.tasks));
        }
        showToast(t.analytics.importSuccess);
        if (onDataImported) onDataImported();
      } catch (err) {
        showToast(t.analytics.importError);
      }
    };
    reader.readAsText(file);
  };

  // Clear history
  const handleClearHistory = () => {
    if (window.confirm('Haqiqatan ham barcha statistikani tozalamoqchimisiz?')) {
      localStorage.removeItem('pomodoro_sessions_history');
      setHistory([]);
      showToast(t.analytics.historyCleared);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in text-slate-100 pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-5 z-50 px-4 py-3 rounded-2xl bg-indigo-600/90 text-white font-semibold text-xs shadow-2xl backdrop-blur-md flex items-center gap-2 border border-indigo-400/40 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Export/Import Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-indigo-500/20 shadow-2xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{t.analytics.title}</h2>
              <p className="text-xs text-slate-400">{t.analytics.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Buttons for Export & Import */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <FileJson className="w-3.5 h-3.5" />
            <span>.JSON</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>.CSV</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-700 active:scale-95">
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.actions.import}</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* KPI Cards Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Hours */}
        <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex flex-col gap-1 relative overflow-hidden group hover:border-indigo-500/50 transition">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{t.analytics.totalHours}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalHours} <span className="text-sm font-normal text-indigo-400">soat</span>
          </div>
        </div>

        {/* Today Focus */}
        <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex flex-col gap-1 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{t.analytics.todayFocus}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {todayHours} <span className="text-sm font-normal text-emerald-400">soat</span>
          </div>
        </div>

        {/* Forest Trees */}
        <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex flex-col gap-1 relative overflow-hidden group hover:border-pink-500/50 transition">
          <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-1">
            <Trees className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{t.analytics.treesPlanted}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {aliveTreesCount} <span className="text-sm font-normal text-pink-400">daraxt</span>
          </div>
        </div>

        {/* Productivity Index */}
        <div className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-slate-800 flex flex-col gap-1 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-medium text-slate-400">{t.analytics.productivityScore}</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {productivityScore}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-amber-500 to-pink-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${productivityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Focus Trend Recharts Graph */}
      <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.analytics.weeklyChartTitle}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">So'nggi 7 kun</span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pomoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                name="Fokus (Soat)"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#focusGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Clear Data Reset Button */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleClearHistory}
          className="px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 text-xs font-semibold border border-slate-800 hover:border-rose-500/30 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.analytics.clearHistory}</span>
        </button>
      </div>
    </div>
  );
};
