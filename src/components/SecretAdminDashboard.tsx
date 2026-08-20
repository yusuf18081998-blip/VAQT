import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Eye,
  Activity,
  TreePine,
  Timer,
  CheckSquare,
  Globe,
  Radio,
  RefreshCw,
  Download,
  Trash2,
  Send,
  Bell,
  Smartphone,
  Laptop,
  Check,
  X,
  Search,
  AlertTriangle,
  Lock,
  Sparkles,
  MapPin,
  Clock,
  LogOut,
} from 'lucide-react';
import { AnalyticsTracker, ADMIN_EMAIL } from '../utils/analyticsTracker';
import { AnalyticsEvent, TrackedUser, SystemAnnouncement, UserProfile } from '../types';

interface SecretAdminDashboardProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBroadcastAnnouncement: (announcement: SystemAnnouncement | null) => void;
}

export const SecretAdminDashboard: React.FC<SecretAdminDashboardProps> = ({
  user,
  isOpen,
  onClose,
  onBroadcastAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'feed' | 'users' | 'broadcast' | 'export'>('overview');
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [users, setUsers] = useState<TrackedUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [userSearch, setUserSearch] = useState<string>('');
  const [feedFilter, setFeedFilter] = useState<string>('all');

  // Broadcast state
  const [broadcastMsg, setBroadcastMsg] = useState<string>('');
  const [broadcastType, setBroadcastType] = useState<SystemAnnouncement['type']>('info');
  const [currentAnnouncement, setCurrentAnnouncement] = useState<SystemAnnouncement | null>(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);

  const loadData = () => {
    setIsRefreshing(true);
    const evs = AnalyticsTracker.getEvents();
    const usrs = AnalyticsTracker.getUsers();
    const st = AnalyticsTracker.getSummaryStats();
    const ann = AnalyticsTracker.getAnnouncement();

    setEvents(evs);
    setUsers(usrs);
    setStats(st);
    setCurrentAnnouncement(ann);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  // Autorefresh every 10 seconds while admin open
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEvents(AnalyticsTracker.getEvents());
      setUsers(AnalyticsTracker.getUsers());
      setStats(AnalyticsTracker.getSummaryStats());
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Qat'iy tekshiruv: Faqat Yusufning emaili uchun
  const isAuthorized = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
        <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-rose-500/40 p-6 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Lock className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-white text-lg">Ruxsat Cheklangan</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bu maxfiy boshqaruv paneli faqat tizim asoschisi (<strong>{ADMIN_EMAIL}</strong>) uchun ochiq.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Yopish
          </button>
        </div>
      </div>
    );
  }

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    const newAnn: SystemAnnouncement = {
      id: `ann-${Date.now()}`,
      message: broadcastMsg.trim(),
      type: broadcastType,
      createdAt: Date.now(),
      active: true,
    };

    AnalyticsTracker.setAnnouncement(newAnn);
    setCurrentAnnouncement(newAnn);
    onBroadcastAnnouncement(newAnn);
    setBroadcastSuccess(true);
    setBroadcastMsg('');
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleRemoveBroadcast = () => {
    AnalyticsTracker.setAnnouncement(null);
    setCurrentAnnouncement(null);
    onBroadcastAnnouncement(null);
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats,
      users,
      events,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vaqt-admin-stats-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.city.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredEvents = events.filter((ev) => {
    if (feedFilter === 'all') return true;
    return ev.type === feedFilter;
  });

  const getEventBadge = (type: AnalyticsEvent['type']) => {
    switch (type) {
      case 'visit':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300">Tashrif</span>;
      case 'pomodoro_complete':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300">Pomodoro Tugadi</span>;
      case 'tree_planted':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300">Daraxt Ekildi</span>;
      case 'task_completed':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300">Vazifa Bajarildi</span>;
      case 'location_detected':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300">Joylashuv</span>;
      case 'music_played':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 text-pink-300">Musiqa/Fon</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-700 text-slate-300">{type}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-2xl animate-fade-in overflow-hidden">
      <div className="w-full max-w-6xl max-h-[95vh] rounded-3xl bg-slate-900/95 border border-indigo-500/40 shadow-2xl flex flex-col overflow-hidden text-slate-100 relative">
        {/* Ambient top glow */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* TOP BAR */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-white text-lg sm:text-xl tracking-tight">
                  Maxfiy Boshqaruv & Telemetriya Paneli
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 border border-amber-500/40 text-amber-300">
                  👑 Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Foydalanuvchi: <strong className="text-indigo-300">{user?.email}</strong> (Real-time kuzatuv)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              title="Yangilash"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Yangilash</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STATS BENTO ROW */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 p-4 sm:p-6 border-b border-slate-800/80 bg-slate-950/40">
            {/* Live Users */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 flex flex-col justify-between">
              <div className="flex items-center justify-between text-indigo-400 text-xs font-bold">
                <span>Jonli Onlayn</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.activeUsers}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">🟢 Hozir faol</span>
              </div>
            </div>

            {/* Total Users */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Foydalanuvchilar</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalUsers}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Jami roʻyxatdagi</span>
              </div>
            </div>

            {/* Total Visits */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                <span>Jami Tashrif</span>
                <Eye className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.totalVisits}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Sahifa ochilishlari</span>
              </div>
            </div>

            {/* Trees planted */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400 text-xs font-bold">
                <span>Daraxtlar</span>
                <TreePine className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-300 font-mono">{stats.totalTrees}</span>
                <span className="text-[10px] text-emerald-500 block mt-0.5">Oʻrmonda ekilgan</span>
              </div>
            </div>

            {/* Focus Hours */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-purple-400 text-xs font-bold">
                <span>Fokus Vaqti</span>
                <Timer className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">{stats.totalHours}h</span>
                <span className="text-[10px] text-purple-500 block mt-0.5">Pomodoro soatlari</span>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400 text-xs font-bold">
                <span>Vazifalar</span>
                <CheckSquare className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">{stats.totalTasks}</span>
                <span className="text-[10px] text-amber-500 block mt-0.5">Bajarilgan rejalar</span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 border-b border-slate-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Umumiy Tahlil</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'feed'
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Jonli Faoliyat Jurnali ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'users'
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400" />
            <span>Foydalanuvchilar ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'broadcast'
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Eʼlon Tarqatish</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'export'
                ? 'border-indigo-500 text-white bg-indigo-600/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Eksport & Kesh</span>
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shaharlar Bo'yicha Taqsimot */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span>Foydalanuvchilar Hududlari & Shaharlari</span>
                    </h4>
                    <span className="text-xs text-slate-500 font-mono">Geolokatsiya</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {stats?.cityMap &&
                      Object.entries(stats.cityMap).map(([cityStr, count]: any) => (
                        <div key={cityStr} className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">{cityStr}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-28 sm:w-36 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{
                                  width: `${Math.min(100, (count / (stats?.totalUsers || 1)) * 100)}%`,
                                }}
                              ></div>
                            </div>
                            <span className="font-mono font-bold text-indigo-400 w-6 text-right">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Qurilmalar va Tizim */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-purple-400" />
                        <span>Qurilmalar va Brauzerlar</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">Device Analytics</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">💻 Kompyuter (Desktop)</span>
                        <span className="text-xl font-bold text-white font-mono">65%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">📱 Mobil Qurilmalar</span>
                        <span className="text-xl font-bold text-white font-mono">35%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">🌐 Chrome / Chromium</span>
                        <span className="text-xl font-bold text-white font-mono">72%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs text-slate-400 block mb-1">🧭 Safari & Edge</span>
                        <span className="text-xl font-bold text-white font-mono">28%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-300">
                    💡 <strong>Maslahat:</strong> Platforma toʻliq mobil moslashuvchanlikka ega va har qanday smartfonda qulay ishlaydi.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE FEED */}
          {activeTab === 'feed' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-bold text-white text-sm">Real-vaqt Harakatlar Logi</h4>
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  {['all', 'pomodoro_complete', 'tree_planted', 'task_completed', 'visit'].map((flt) => (
                    <button
                      key={flt}
                      onClick={() => setFeedFilter(flt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                        feedFilter === flt
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {flt === 'all'
                        ? 'Barchasi'
                        : flt === 'pomodoro_complete'
                        ? 'Pomodoro'
                        : flt === 'tree_planted'
                        ? 'Daraxtlar'
                        : flt === 'task_completed'
                        ? 'Vazifalar'
                        : 'Tashriflar'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {filteredEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getEventBadge(ev.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{ev.userName}</span>
                          <span className="text-xs text-slate-500 font-mono">({ev.userEmail})</span>
                          <span className="text-xs text-indigo-400 font-medium">📍 {ev.city}, {ev.country}</span>
                        </div>
                        {ev.details && <p className="text-xs text-slate-300 mt-1">{ev.details}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center text-right">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(ev.timestamp).toLocaleTimeString('uz-UZ', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {ev.device}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USERS DIRECTORY */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Ism, email yoki shahar boʻyicha izlash..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <span className="text-xs text-slate-400">Jami: <strong>{filteredUsers.length}</strong> ta foydalanuvchi</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredUsers.map((u) => {
                  const isAdmin = u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
                  return (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 hover:border-indigo-500/40 transition"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={u.picture}
                          alt={u.name}
                          className="w-11 h-11 rounded-xl border border-slate-700 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-sm font-bold text-white">{u.name}</h5>
                            {isAdmin ? (
                              <span className="px-2 py-0.5 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                👑 ASOSCHI
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">
                                FOYDALANUVCHI
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
                            <span>📍 {u.city}, {u.country}</span>
                            <span>•</span>
                            <span>{u.device}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 font-mono text-xs">
                        <span className="text-emerald-400 font-bold">🌲 {u.treesPlanted} daraxt</span>
                        <span className="text-purple-400 font-bold">⏳ {u.focusMinutes} daq</span>
                        <span className="text-amber-400 font-bold">✅ {u.tasksCompleted} vazifa</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <h4 className="font-bold text-white text-base mb-1 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>Barcha Foydalanuvchilarga Eʼlon Tarqatish</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Bu yerga yozgan xabaringiz barcha saytga kirgan foydalanuvchilar ekranining yuqori qismida koʻrinadi.
                </p>

                {broadcastSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Xabar muvaffaqiyatli tarqatildi!</span>
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Xabar Matni</label>
                    <textarea
                      rows={3}
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="Masalan: Aziz foydalanuvchilar, saytga yangi funksiyalar qoʻshildi!"
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400">Tur:</label>
                    {(['info', 'success', 'warning', 'urgent'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBroadcastType(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase transition ${
                          broadcastType === t
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Xabarni Eʼlon Qilish</span>
                  </button>
                </form>
              </div>

              {/* Hozirgi Faol E'lon */}
              {currentAnnouncement && (
                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Hozirgi faol eʼlon:</span>
                    <p className="text-xs text-amber-200 mt-1 font-medium">{currentAnnouncement.message}</p>
                  </div>
                  <button
                    onClick={handleRemoveBroadcast}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Oʻchirish</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: EXPORT */}
          {activeTab === 'export' && (
            <div className="flex flex-col gap-4 max-w-xl mx-auto text-center py-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Download className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-white text-lg">Maʼlumotlarni Eksport Qilish</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Barcha telemetriya va foydalanuvchilar faoliyatini JSON formatida kompyuteringizga yuklab oling.
              </p>

              <button
                onClick={handleExportJSON}
                className="py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Statistika Faylini Yuklab Olish (.json)</span>
              </button>

              <div className="mt-8 border-t border-slate-800 pt-6">
                <button
                  onClick={() => {
                    if (window.confirm('Haqiqatan ham barcha loglarni tozalab, boshlangʻich holatga keltirmoqchimisiz?')) {
                      AnalyticsTracker.clearAllData();
                      loadData();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-bold transition flex items-center gap-2 mx-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Telemetriya Keshini Tozalash</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
