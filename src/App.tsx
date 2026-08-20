import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Globe,
  Clock,
  Flame,
  CheckSquare,
  Timer,
  Hourglass,
  Play,
  Pause,
  RotateCcw,
  Flag,
  Plus,
  Trash2,
  Check,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Settings,
  LogIn,
  LogOut,
  Search,
  BookOpen,
  Coffee,
  Sparkles,
  Code,
  Copy,
  Download,
  X,
  Calendar,
  Layers,
  ChevronRight,
  Headphones,
  Music,
  Upload,
  Volume1,
  Compass,
  TreePine,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { TabType, UserProfile, TaskItem, WorldCity, AudioTrack, AlarmTone, TreeSpecies, PlantedTree, SystemAnnouncement } from './types';
import { soundEngine, DEFAULT_TRACKS } from './utils/audioEngine';
import { MusicPlayerModal } from './components/MusicPlayerModal';
import { BackgroundSettingsModal, PRESET_BACKGROUNDS } from './components/BackgroundSettingsModal';
import { FocusTreeVisualizer, SPECIES_INFO } from './components/FocusTreeVisualizer';
import { ForestGardenModal } from './components/ForestGardenModal';
import { ClockView } from './components/ClockView';
import { SecretAdminDashboard } from './components/SecretAdminDashboard';
import { AnalyticsTracker, ADMIN_EMAIL } from './utils/analyticsTracker';
import { UserLocationInfo, requestGpsLocation, detectTimezoneLocation } from './utils/locationService';
import { MapPin, Navigation, Bell, Lock, Radio } from 'lucide-react';

const DEFAULT_CITIES: WorldCity[] = [
  { id: 'tashkent', name: 'Toshkent', country: "O'zbekiston", timezone: 'Asia/Tashkent', flag: '🇺🇿' },
  { id: 'samarkand', name: 'Samarqand', country: "O'zbekiston", timezone: 'Asia/Samarkand', flag: '🇺🇿' },
  { id: 'mecca', name: 'Makka', country: 'Saudiya Arabistoni', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkiya', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { id: 'dubai', name: 'Dubay', country: 'BAA', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'london', name: 'London', country: 'Buyuk Britaniya', timezone: 'Europe/London', flag: '🇬🇧' },
  { id: 'newyork', name: 'Nyu-York', country: 'AQSH', timezone: 'America/New_York', flag: '🇺🇸' },
  { id: 'tokyo', name: 'Tokio', country: 'Yaponiya', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'seoul', name: 'Seul', country: 'Janubiy Koreya', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'paris', name: 'Parij', country: 'Fransiya', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'moscow', name: 'Moskva', country: 'Rossiya', timezone: 'Europe/Moscow', flag: '🇷🇺' },
  { id: 'beijing', name: 'Pekin', country: 'Xitoy', timezone: 'Asia/Shanghai', flag: '🇨🇳' },
];

export default function App() {
  // --- Navigation & Active View ---
  const [activeTab, setActiveTab] = useState<TabType>('world_clock');

  // --- Geolocation State & Time Detection ---
  const [userLocation, setUserLocation] = useState<UserLocationInfo>(() => {
    try {
      const saved = localStorage.getItem('vaqt_user_location');
      if (saved) return JSON.parse(saved);
    } catch {}
    return detectTimezoneLocation();
  });
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  // Saytga birinchi marta kirganda joylashuv so'rash
  useEffect(() => {
    const hasAskedLocation = localStorage.getItem('vaqt_location_prompt_seen');
    if (!hasAskedLocation) {
      const timer = setTimeout(() => {
        setShowLocationModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllowLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const loc = await requestGpsLocation();
      setUserLocation(loc);
      localStorage.setItem('vaqt_user_location', JSON.stringify(loc));
      localStorage.setItem('vaqt_location_prompt_seen', 'true');
    } catch {
      const fallback = detectTimezoneLocation();
      setUserLocation(fallback);
      localStorage.setItem('vaqt_user_location', JSON.stringify(fallback));
      localStorage.setItem('vaqt_location_prompt_seen', 'true');
    } finally {
      setIsDetectingLocation(false);
      setShowLocationModal(false);
    }
  };

  const handleDeclineLocation = () => {
    const fallback = detectTimezoneLocation();
    setUserLocation(fallback);
    localStorage.setItem('vaqt_user_location', JSON.stringify(fallback));
    localStorage.setItem('vaqt_location_prompt_seen', 'true');
    setShowLocationModal(false);
  };

  // --- Auth State ---
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('vaqt_user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');

  // --- Secret Super Admin State & Telemetry ---
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const [systemAnnouncement, setSystemAnnouncement] = useState<SystemAnnouncement | null>(null);
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState<boolean>(false);

  // E'lonlarni Firestore dan real vaqtda tinglash
  useEffect(() => {
    const unsub = AnalyticsTracker.subscribeAnnouncement((ann) => {
      setSystemAnnouncement(ann);
      if (ann && ann.active) {
        setIsAnnouncementDismissed(false);
      }
    });
    return () => unsub();
  }, []);

  // Saytga kirishni telemetriyaga yozish (Visit tracking)
  useEffect(() => {
    AnalyticsTracker.trackEvent('visit', user, userLocation, 'Sayt sahifasi ochildi');
  }, []);

  // Maxfiy klaviatura tugmalari (Ctrl+Shift+A yoki Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        if (user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdminModalOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user]);

  // Logoga 5 marta ketma-ket bosilganda admin panelini tekshirish
  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        if (user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdminModalOpen(true);
        } else {
          setIsAuthModalOpen(true);
        }
        return 0;
      }
      return next;
    });
  };

  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  // --- Background State & Customizer ---
  const [isBgModalOpen, setIsBgModalOpen] = useState(false);
  const [activeBgId, setActiveBgId] = useState<string>(() => localStorage.getItem('vaqt_bg_preset') || 'cosmic');
  const [customBgUrl, setCustomBgUrl] = useState<string>(() => localStorage.getItem('vaqt_custom_bg') || '');
  const [bgDarkness, setBgDarkness] = useState<number>(() => Number(localStorage.getItem('vaqt_bg_darkness')) || 0.75);
  const [bgBlur, setBgBlur] = useState<number>(() => Number(localStorage.getItem('vaqt_bg_blur')) || 0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Audio State & Music Player ---
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(DEFAULT_TRACKS[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState<number>(() => Number(localStorage.getItem('vaqt_vol')) || 0.6);
  const [isTickEnabled, setIsTickEnabled] = useState<boolean>(() => localStorage.getItem('vaqt_tick') !== 'false');
  const [selectedAlarm, setSelectedAlarm] = useState<AlarmTone>(() => (localStorage.getItem('vaqt_alarm_tone') as AlarmTone) || 'marimba');
  const [uploadedTracks, setUploadedTracks] = useState<AudioTrack[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_uploaded_tracks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sound Engine Sync
  useEffect(() => {
    soundEngine.setVolume(volume);
    localStorage.setItem('vaqt_vol', String(volume));
  }, [volume]);

  useEffect(() => {
    soundEngine.setTickEnabled(isTickEnabled);
    localStorage.setItem('vaqt_tick', String(isTickEnabled));
  }, [isTickEnabled]);

  const handleSelectTrack = (track: AudioTrack) => {
    setCurrentTrack(track);
    soundEngine.playTrack(track);
    setIsMusicPlaying(true);
    AnalyticsTracker.trackEvent('music_played', user, userLocation, `"${track.title}" foni yangradi`);
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      soundEngine.stopAllAudio();
      setIsMusicPlaying(false);
    } else {
      if (currentTrack) {
        soundEngine.playTrack(currentTrack);
        setIsMusicPlaying(true);
      } else {
        handleSelectTrack(DEFAULT_TRACKS[0]);
      }
    }
  };

  const handleAddUploadedTrack = (track: AudioTrack) => {
    const updated = [track, ...uploadedTracks];
    setUploadedTracks(updated);
    try {
      localStorage.setItem('vaqt_uploaded_tracks', JSON.stringify(updated));
    } catch {
      // LocalStorage quota safety
    }
  };

  const handleDeleteUploadedTrack = (id: string) => {
    const updated = uploadedTracks.filter((t) => t.id !== id);
    setUploadedTracks(updated);
    localStorage.setItem('vaqt_uploaded_tracks', JSON.stringify(updated));
    if (currentTrack?.id === id) {
      soundEngine.stopAllAudio();
      setIsMusicPlaying(false);
      setCurrentTrack(DEFAULT_TRACKS[0]);
    }
  };

  const handleSelectPresetBg = (id: string) => {
    setActiveBgId(id);
    localStorage.setItem('vaqt_bg_preset', id);
  };

  const handleSetCustomBg = (url: string) => {
    setCustomBgUrl(url);
    try {
      localStorage.setItem('vaqt_custom_bg', url);
    } catch {
      // LocalStorage quota safety
    }
  };

  const handleDarknessChange = (val: number) => {
    setBgDarkness(val);
    localStorage.setItem('vaqt_bg_darkness', String(val));
  };

  const handleBlurChange = (val: number) => {
    setBgBlur(val);
    localStorage.setItem('vaqt_bg_blur', String(val));
  };

  const handleSelectAlarmTone = (tone: AlarmTone) => {
    setSelectedAlarm(tone);
    localStorage.setItem('vaqt_alarm_tone', tone);
  };

  // --- Dynamic Wallpaper Background CSS ---
  const currentBgStyle = useMemo(() => {
    if (customBgUrl.trim()) {
      return {
        backgroundImage: `linear-gradient(rgba(2, 6, 23, ${bgDarkness}), rgba(2, 6, 23, ${Math.min(0.98, bgDarkness + 0.1)})), url("${customBgUrl}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
      };
    }
    const found = PRESET_BACKGROUNDS.find((p) => p.id === activeBgId);
    if (found) {
      if (found.type === 'image') {
        return {
          backgroundImage: `linear-gradient(rgba(2, 6, 23, ${bgDarkness}), rgba(2, 6, 23, ${Math.min(0.98, bgDarkness + 0.1)})), url("${found.value}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      return { background: found.value };
    }
    return { background: PRESET_BACKGROUNDS[0].value };
  }, [activeBgId, customBgUrl, bgDarkness, bgBlur]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const GOOGLE_CLIENT_ID = '490471193935-10epq4o6ueobnfhms7t87lr2s7lcvv2i.apps.googleusercontent.com';

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const handleGoogleCredentialResponse = (response: any) => {
    if (response?.credential) {
      const payload = parseJwt(response.credential);
      if (payload) {
        const googleUser: UserProfile = {
          name: payload.name || payload.given_name || 'Foydalanuvchi',
          email: payload.email || '',
          picture: payload.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${payload.email || 'user'}`,
        };
        setUser(googleUser);
        localStorage.setItem('vaqt_user_profile', JSON.stringify(googleUser));
        setIsAuthModalOpen(false);
        AnalyticsTracker.trackEvent(
          'visit',
          googleUser,
          userLocation,
          googleUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
            ? '👑 Asoschi (Yusuf) Google orqali tizimga kirdi'
            : 'Foydalanuvchi Google orqali kirdi'
        );
        if (googleUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
          setIsAdminModalOpen(true);
        }
      }
    }
  };

  useEffect(() => {
    if (isAuthModalOpen && typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });
        const buttonDiv = document.getElementById('google-signin-btn-container');
        if (buttonDiv) {
          (window as any).google.accounts.id.renderButton(buttonDiv, {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: '100%',
          });
        }
      } catch (err) {
        console.error('Google GSI initialization error:', err);
      }
    }
  }, [isAuthModalOpen]);

  // Auth Submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authName.trim()) return;
    const newProfile: UserProfile = {
      name: authName.trim(),
      email: authEmail.trim(),
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authName.trim()}`,
    };
    setUser(newProfile);
    localStorage.setItem('vaqt_user_profile', JSON.stringify(newProfile));
    setIsAuthModalOpen(false);
    AnalyticsTracker.trackEvent(
      'visit',
      newProfile,
      userLocation,
      newProfile.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
        ? '👑 Asoschi (Yusuf) tizimga kirdi'
        : 'Foydalanuvchi profiliga kirdi'
    );
    if (newProfile.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      setIsAdminModalOpen(true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('vaqt_user_profile');
  };

  // =========================================================================
  // 1-TAB: DUNYO VAQTLARI & ANIQ SOAT (WORLD CLOCK)
  // =========================================================================
  const [time, setTime] = useState(new Date());
  const [citySearch, setCitySearch] = useState('');
  const [isAnalogView, setIsAnalogView] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return DEFAULT_CITIES;
    const q = citySearch.toLowerCase();
    return DEFAULT_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q)
    );
  }, [citySearch]);

  const formatCityTime = (timezone: string) => {
    try {
      const d = new Date();
      return new Intl.DateTimeFormat('uz-UZ', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(d);
    } catch {
      return '--:--:--';
    }
  };

  const formatCityDate = (timezone: string) => {
    try {
      const d = new Date();
      return new Intl.DateTimeFormat('uz-UZ', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(d);
    } catch {
      return '';
    }
  };

  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  const localDateStr = `${time.getDate()} - ${months[time.getMonth()]}, ${time.getFullYear()}`;
  const localDayName = days[time.getDay()];

  // Seconds, Minutes, Hours rotation degrees for Analog Clock
  const secDeg = (time.getSeconds() / 60) * 360;
  const minDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hrDeg = (((time.getHours() % 12) + time.getMinutes() / 60) / 12) * 360;

  // =========================================================================
  // 2-TAB: POMODORO & DARS TAYMERI + FOKUS DARAXTI (FOCUS FOREST)
  // =========================================================================
  const [pomoMode, setPomoMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  const [studyMin, setStudyMin] = useState<number>(() => Number(localStorage.getItem('vaqt_study_min')) || 25);
  const [breakMin, setBreakMin] = useState<number>(() => Number(localStorage.getItem('vaqt_break_min')) || 5);
  const [longBreakMin, setLongBreakMin] = useState<number>(() => Number(localStorage.getItem('vaqt_long_min')) || 15);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Focus Tree & Anti-Distraction States
  const [treeSpecies, setTreeSpecies] = useState<TreeSpecies>(() => (localStorage.getItem('vaqt_tree_species') as TreeSpecies) || 'apple');
  const [isDeepFocusActive, setIsDeepFocusActive] = useState<boolean>(() => localStorage.getItem('vaqt_deep_focus') !== 'false');
  const [strictDistractionMode, setStrictDistractionMode] = useState<boolean>(() => localStorage.getItem('vaqt_strict_focus') === 'true');
  const [isForestModalOpen, setIsForestModalOpen] = useState(false);
  const [isTreeWithered, setIsTreeWithered] = useState(false);
  const [witherWarning, setWitherWarning] = useState(false);
  const [leftAppCount, setLeftAppCount] = useState(0);

  const [plantedTrees, setPlantedTrees] = useState<PlantedTree[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_planted_trees');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const pomoTotalSeconds = useMemo(() => {
    if (pomoMode === 'study') return studyMin * 60;
    if (pomoMode === 'short_break') return breakMin * 60;
    return longBreakMin * 60;
  }, [pomoMode, studyMin, breakMin, longBreakMin]);

  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [pomoRunning, setPomoRunning] = useState<boolean>(false);
  const [completedPomodoros, setCompletedPomodoros] = useState<number>(() => Number(localStorage.getItem('vaqt_pomo_count')) || 0);

  const handleSelectTreeSpecies = (sp: TreeSpecies) => {
    setTreeSpecies(sp);
    localStorage.setItem('vaqt_tree_species', sp);
  };

  const handleToggleDeepFocus = () => {
    const next = !isDeepFocusActive;
    setIsDeepFocusActive(next);
    localStorage.setItem('vaqt_deep_focus', String(next));
  };

  const handleToggleStrictMode = () => {
    const next = !strictDistractionMode;
    setStrictDistractionMode(next);
    localStorage.setItem('vaqt_strict_focus', String(next));
  };

  const handleClearForestHistory = () => {
    setPlantedTrees([]);
    localStorage.removeItem('vaqt_planted_trees');
  };

  const switchPomoMode = (mode: 'study' | 'short_break' | 'long_break') => {
    setPomoRunning(false);
    setPomoMode(mode);
    setIsTreeWithered(false);
    setLeftAppCount(0);
    setWitherWarning(false);
    if (mode === 'study') setPomoSeconds(studyMin * 60);
    else if (mode === 'short_break') setPomoSeconds(breakMin * 60);
    else setPomoSeconds(longBreakMin * 60);
  };

  const handlePomoReset = () => {
    setPomoRunning(false);
    setPomoSeconds(pomoTotalSeconds);
    setIsTreeWithered(false);
    setLeftAppCount(0);
    setWitherWarning(false);
  };

  // =========================================================================
  // 3-TAB: VAZIFALAR (TASKS)
  // =========================================================================
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('vaqt_tasks');
      return saved ? JSON.parse(saved) : [
        { id: '1', title: 'Matematika vazifasini bajarish', category: 'dars', pomodorosEstimated: 2, pomodorosCompleted: 1, completed: false, createdAt: Date.now() },
        { id: '2', title: 'Ingliz tili lugʻat yodlash (50 ta soʻz)', category: 'dars', pomodorosEstimated: 1, pomodorosCompleted: 1, completed: true, createdAt: Date.now() - 10000 },
        { id: '3', title: 'Dasturlash loyihasini yakunlash', category: 'loyiha', pomodorosEstimated: 4, pomodorosCompleted: 2, completed: false, createdAt: Date.now() - 20000 },
      ];
    } catch {
      return [];
    }
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'dars' | 'ish' | 'shaxsiy' | 'loyiha'>('dars');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState<number>(2);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const saveTasks = (updated: TaskItem[]) => {
    setTasks(updated);
    localStorage.setItem('vaqt_tasks', JSON.stringify(updated));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      pomodorosEstimated: newTaskPomodoros,
      pomodorosCompleted: 0,
      completed: false,
      createdAt: Date.now(),
    };
    saveTasks([newTask, ...tasks]);
    AnalyticsTracker.trackEvent('task_created', user, userLocation, `Yangi vazifa qoʻshildi: "${newTask.title}"`);
    setNewTaskTitle('');
  };

  const toggleTaskCompleted = (id: string) => {
    const target = tasks.find(t => t.id === id);
    const willBeCompleted = target ? !target.completed : false;
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
    if (willBeCompleted) {
      AnalyticsTracker.trackEvent('task_completed', user, userLocation, `Vazifa bajarildi: "${target?.title || 'Vazifa'}"`);
    }
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    if (activeTaskId === id) setActiveTaskId(null);
    saveTasks(updated);
  };

  // Anti-Distraction Tab / Window Blur Detection
  useEffect(() => {
    const handleLeavingApp = () => {
      if (pomoRunning && pomoMode === 'study' && isDeepFocusActive && !isTreeWithered) {
        setLeftAppCount((prev) => {
          const nextCount = prev + 1;
          soundEngine.playTreeWitherWarning();
          setWitherWarning(true);

          if (strictDistractionMode || nextCount >= 2) {
            setIsTreeWithered(true);
            const witheredTree: PlantedTree = {
              id: Date.now().toString(),
              species: treeSpecies,
              name: SPECIES_INFO[treeSpecies]?.name || 'Daraxt',
              status: 'withered',
              minutesFocused: Math.max(1, Math.floor((pomoTotalSeconds - pomoSeconds) / 60)),
              plantedAt: Date.now(),
              taskTitle: activeTaskId ? tasks.find(t => t.id === activeTaskId)?.title : undefined,
              witherReason: "Dars paytida boshqa ilovaga chiqildi",
            };
            setPlantedTrees((prevTrees) => {
              const updated = [witheredTree, ...prevTrees];
              localStorage.setItem('vaqt_planted_trees', JSON.stringify(updated));
              return updated;
            });
          }
          return nextCount;
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLeavingApp();
      } else {
        if (witherWarning && !isTreeWithered) {
          const t = setTimeout(() => setWitherWarning(false), 3500);
          return () => clearTimeout(t);
        }
      }
    };

    const handleWindowBlur = () => {
      handleLeavingApp();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [pomoRunning, pomoMode, isDeepFocusActive, isTreeWithered, strictDistractionMode, treeSpecies, pomoTotalSeconds, pomoSeconds, activeTaskId, tasks, witherWarning]);

  // Pomodoro Timer Interval Loop
  useEffect(() => {
    let interval: number | null = null;
    if (pomoRunning && pomoSeconds > 0) {
      interval = window.setInterval(() => {
        setPomoSeconds((prev) => {
          if (prev <= 1) {
            soundEngine.playAlarm(selectedAlarm);
            setPomoRunning(false);
            if (pomoMode === 'study') {
              const newCount = completedPomodoros + 1;
              setCompletedPomodoros(newCount);
              localStorage.setItem('vaqt_pomo_count', String(newCount));
              AnalyticsTracker.trackEvent('pomodoro_complete', user, userLocation, `${studyMin} daqiqalik fokus seansi yakunlandi (${newCount}-seans)`);

              // If deep focus was enabled and tree did not wither, plant a healthy alive tree!
              if (isDeepFocusActive && !isTreeWithered) {
                soundEngine.playTreeSuccess();
                const aliveTree: PlantedTree = {
                  id: Date.now().toString(),
                  species: treeSpecies,
                  name: SPECIES_INFO[treeSpecies]?.name || 'Daraxt',
                  status: 'alive',
                  minutesFocused: studyMin,
                  plantedAt: Date.now(),
                  taskTitle: activeTaskId ? tasks.find(t => t.id === activeTaskId)?.title : undefined,
                };
                setPlantedTrees((prevTrees) => {
                  const updated = [aliveTree, ...prevTrees];
                  localStorage.setItem('vaqt_planted_trees', JSON.stringify(updated));
                  return updated;
                });
                AnalyticsTracker.trackEvent('tree_planted', user, userLocation, `"${aliveTree.name}" daraxti muvaffaqiyatli yetishtirildi`);
              }

              // Reset tree states for the next session
              setIsTreeWithered(false);
              setLeftAppCount(0);
              setWitherWarning(false);
              
              if (activeTaskId) {
                setTasks((prevTasks) => {
                  const updated = prevTasks.map((t) =>
                    t.id === activeTaskId ? { ...t, pomodorosCompleted: t.pomodorosCompleted + 1 } : t
                  );
                  localStorage.setItem('vaqt_tasks', JSON.stringify(updated));
                  return updated;
                });
              }

              if (newCount % 4 === 0) {
                switchPomoMode('long_break');
              } else {
                switchPomoMode('short_break');
              }
            } else {
              switchPomoMode('study');
            }
            return 0;
          }
          soundEngine.playTick(prev % 5 === 0);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomoRunning, pomoSeconds, pomoMode, completedPomodoros, activeTaskId, selectedAlarm, isDeepFocusActive, isTreeWithered, treeSpecies, studyMin, tasks]);

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeTaskId), [tasks, activeTaskId]);

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'pending') return tasks.filter((t) => !t.completed);
    if (taskFilter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }, [tasks, taskFilter]);

  // =========================================================================
  // 4-TAB: SEKUNDOMER (STOPWATCH)
  // =========================================================================
  const [swTime, setSwTime] = useState<number>(0);
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swTimerRef = useRef<number | null>(null);
  const swStartTimestamp = useRef<number>(0);

  useEffect(() => {
    if (swRunning) {
      swStartTimestamp.current = Date.now() - swTime;
      swTimerRef.current = window.setInterval(() => {
        setSwTime(Date.now() - swStartTimestamp.current);
      }, 10);
    } else {
      if (swTimerRef.current) clearInterval(swTimerRef.current);
    }
    return () => {
      if (swTimerRef.current) clearInterval(swTimerRef.current);
    };
  }, [swRunning]);

  const handleSwToggle = () => {
    setSwRunning(!swRunning);
  };
  const handleSwReset = () => {
    setSwRunning(false);
    setSwTime(0);
    setLaps([]);
  };
  const handleSwLap = () => {
    if (swRunning) setLaps([swTime, ...laps]);
  };

  const formatSw = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  // =========================================================================
  // 5-TAB: QAYTMA TAYMER (COUNTDOWN)
  // =========================================================================
  const [cdHours, setCdHours] = useState(0);
  const [cdMinutes, setCdMinutes] = useState(10);
  const [cdSeconds, setCdSeconds] = useState(0);
  const [cdTotalSeconds, setCdTotalSeconds] = useState(10 * 60);
  const [cdRemaining, setCdRemaining] = useState(10 * 60);
  const [cdRunning, setCdRunning] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (cdRunning && cdRemaining > 0) {
      interval = window.setInterval(() => {
        setCdRemaining((prev) => {
          if (prev <= 1) {
            soundEngine.playAlarm(selectedAlarm);
            setCdRunning(false);
            return 0;
          }
          soundEngine.playTick(prev % 5 === 0);
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cdRunning, cdRemaining, selectedAlarm]);

  const handleCdStart = () => {
    if (cdRemaining === 0) {
      const total = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
      if (total <= 0) return;
      setCdTotalSeconds(total);
      setCdRemaining(total);
    }
    setCdRunning(true);
  };

  const handleCdPause = () => {
    setCdRunning(false);
  };

  const handleCdReset = () => {
    setCdRunning(false);
    const total = cdHours * 3600 + cdMinutes * 60 + cdSeconds;
    setCdTotalSeconds(total);
    setCdRemaining(total);
  };

  const handleQuickPreset = (minutes: number) => {
    setCdRunning(false);
    setCdHours(0);
    setCdMinutes(minutes);
    setCdSeconds(0);
    const total = minutes * 60;
    setCdTotalSeconds(total);
    setCdRemaining(total);
  };

  const formatCd = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h > 0 ? String(h).padStart(2, '0') + ':' : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Nav Items
  const navTabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'world_clock', label: 'Dunyo Vaqti', icon: <Globe className="w-4 h-4" /> },
    { id: 'pomodoro', label: 'Pomodoro Taymer', icon: <Flame className="w-4 h-4" /> },
    { id: 'tasks', label: 'Vazifalar', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'stopwatch', label: 'Sekundomer', icon: <Timer className="w-4 h-4" /> },
    { id: 'countdown', label: 'Qaytma Taymer', icon: <Hourglass className="w-4 h-4" /> },
  ];

  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col font-sans transition-all duration-700 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white"
      style={currentBgStyle}
    >
      {/* Background Dimming & Blur Overlay */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-500"
        style={{
          backgroundColor: `rgba(2, 6, 23, ${bgDarkness})`,
          backdropFilter: bgBlur > 0 ? `blur(${bgBlur}px)` : undefined,
        }}
      />

      {/* Main Content Wrap */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* ========================================================================= */}
        {/* HEADER & NAV */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 px-3 sm:px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Logo with Secret 5-clicks trigger */}
            <div
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer select-none group"
              title="Vaqt Pro Studio"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition">
                <Clock className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400">
                    VAQT
                  </h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider hidden sm:inline-block">
                    Pro Studio
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block">
                  Dunyo Vaqti, Pomodoro, Vazifalar & Fon Musiqasi
                </p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2">
              {/* Secret Admin Button - ONLY visible to yusuf18081998@gmail.com */}
              {user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && (
                <button
                  id="secret-super-admin-btn"
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-indigo-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 hover:text-white shadow-lg shadow-amber-950/40 hover:scale-105 active:scale-95 animate-fade-in"
                  title="Super Admin Maxfiy Boshqaruv Paneli"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}

              {/* Forest & Garden Button */}
              <button
                id="header-forest-btn"
                type="button"
                onClick={() => setIsForestModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:text-white shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95"
                title="Ekilgan Daraxtlar & Bog'im"
              >
                <TreePine className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Bogʻim</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-emerald-200 font-mono font-bold">
                  {plantedTrees.filter((t) => t.status === 'alive').length}
                </span>
              </button>

              {/* Music Player Studio Button */}
              <button
                onClick={() => setIsMusicModalOpen(true)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
                  isMusicPlaying
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-500/20 animate-pulse'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
                title="Musiqa & Ovozlar"
              >
                <Music className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isMusicPlaying ? 'Musiqa Oʻynayapti' : 'Qoʻshiq / Musiqa'}
                </span>
                {isMusicPlaying && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping hidden sm:inline-block"></span>
                )}
              </button>

              {/* Background Customizer Button */}
              <button
                onClick={() => setIsBgModalOpen(true)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                title="Fon Suratini Tanlash & Yuklash"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Orqa Fon</span>
              </button>

              {/* Tick sound toggle */}
              <button
                onClick={() => setIsTickEnabled(!isTickEnabled)}
                className={`p-2 rounded-xl transition border ${
                  isTickEnabled
                    ? 'bg-slate-900/80 border-slate-800 text-indigo-400 hover:text-indigo-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-400'
                }`}
                title={isTickEnabled ? "Chiqillash ovozi faol" : "Chiqillash ovozi o'chiq"}
              >
                {isTickEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white transition"
                title="To'liq ekran"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* User Profile / Auth */}
              {user ? (
                <div className="flex items-center gap-2 pl-1">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl border border-indigo-500/50 bg-slate-800 object-cover"
                  />
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
                    title="Chiqish"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Kirish</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Tabs Bar */}
          <nav className="flex lg:hidden items-center justify-between gap-1 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-900/50'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </header>

        {/* System Announcement Banner (If active) */}
        {systemAnnouncement && systemAnnouncement.active && !isAnnouncementDismissed && (
          <div className="w-full bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-slate-950/90 border-b border-indigo-500/30 px-4 py-2.5 backdrop-blur-xl flex items-center justify-between gap-3 text-xs z-30 animate-fade-in">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-indigo-200 font-medium">
                <Bell className="w-4 h-4 text-amber-400 animate-bounce flex-shrink-0" />
                <span>{systemAnnouncement.message}</span>
              </div>
              <button
                onClick={() => setIsAnnouncementDismissed(true)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition flex-shrink-0"
                title="Yopish"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN BODY PER TAB */}
        {/* ========================================================================= */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* TAB 1: DUNYO VAQTLARI & ANIQ SOAT (CLOCK VIEW) */}
          {activeTab === 'world_clock' && (
            <ClockView userLocation={userLocation} onUpdateLocation={setUserLocation} />
          )}

          {/* TAB 2: POMODORO & DARS TAYMERI + FOKUS DARAXTI */}
          {activeTab === 'pomodoro' && (
            <div className="flex flex-col gap-6 animate-fadeIn max-w-4xl mx-auto w-full">
              {/* Pomodoro & Tree Card */}
              <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 mb-6 max-w-md w-full justify-between">
                  <button
                    id="pomo-mode-study"
                    type="button"
                    onClick={() => switchPomoMode('study')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      pomoMode === 'study'
                        ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Dars / Fokus 🌱</span>
                  </button>
                  <button
                    id="pomo-mode-short-break"
                    type="button"
                    onClick={() => switchPomoMode('short_break')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      pomoMode === 'short_break'
                        ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Qisqa Tanaffus</span>
                  </button>
                  <button
                    id="pomo-mode-long-break"
                    type="button"
                    onClick={() => switchPomoMode('long_break')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      pomoMode === 'long_break'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Uzoq Tanaffus</span>
                  </button>
                </div>

                {/* If Study Mode: Render Focus Tree Visualizer */}
                {pomoMode === 'study' && isDeepFocusActive ? (
                  <div className="w-full mb-6">
                    <FocusTreeVisualizer
                      species={treeSpecies}
                      progressPercent={
                        pomoTotalSeconds > 0
                          ? Math.min(100, Math.max(0, ((pomoTotalSeconds - pomoSeconds) / pomoTotalSeconds) * 100))
                          : 0
                      }
                      isWithered={isTreeWithered}
                      witherWarning={witherWarning}
                      leftAppCount={leftAppCount}
                      isDeepFocusActive={isDeepFocusActive}
                      pomoRunning={pomoRunning}
                      pomoMode={pomoMode}
                      taskTitle={activeTask?.title}
                      onOpenForest={() => setIsForestModalOpen(true)}
                      onChangeSpecies={handleSelectTreeSpecies}
                    />
                  </div>
                ) : null}

                {/* Circular Progress & Huge Digital Countdown */}
                <div className="relative my-2 flex items-center justify-center">
                  <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="stroke-slate-800"
                      strokeWidth="5"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className={`transition-all duration-1000 ${
                        isTreeWithered
                          ? 'stroke-rose-600'
                          : pomoMode === 'study'
                          ? 'stroke-emerald-400'
                          : pomoMode === 'short_break'
                          ? 'stroke-teal-400'
                          : 'stroke-blue-400'
                      }`}
                      strokeWidth="5"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={
                        2 * Math.PI * 44 * (1 - (pomoTotalSeconds > 0 ? pomoSeconds / pomoTotalSeconds : 0))
                      }
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center select-none">
                    <span className="font-mono font-black text-4xl sm:text-5xl tracking-tight text-white drop-shadow-md">
                      {Math.floor(pomoSeconds / 60)
                        .toString()
                        .padStart(2, '0')}
                      :
                      {(pomoSeconds % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 mt-2 flex items-center gap-1">
                      {isTreeWithered
                        ? '🥀 Daraxt quridi'
                        : pomoRunning
                        ? '⏱️ Taymer ketmoqda'
                        : '⏸️ Toʻxtatilgan'}
                    </span>
                  </div>
                </div>

                {/* Tree Withered Alert Callout */}
                {isTreeWithered && (
                  <div className="w-full max-w-md my-4 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-left flex flex-col gap-2 animate-fade-in">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Daraxtingiz qurib qoldi!</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Dars paytida boshqa ilovaga chiqib ketildi. Diqqatingizni jamlang va darsni toʻliq bajaring!
                    </p>
                    <button
                      type="button"
                      onClick={handlePomoReset}
                      className="mt-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg transition self-start"
                    >
                      🌱 Yangi Nihol Ekish
                    </button>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    id="pomo-play-pause-btn"
                    type="button"
                    onClick={() => {
                      if (isTreeWithered) {
                        handlePomoReset();
                      } else {
                        setPomoRunning(!pomoRunning);
                      }
                    }}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-xl ${
                      isTreeWithered
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : pomoRunning
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/40 hover:scale-105'
                    }`}
                  >
                    {isTreeWithered ? (
                      <>
                        <RotateCcw className="w-5 h-5" />
                        <span>Boshidan Boshlash</span>
                      </>
                    ) : pomoRunning ? (
                      <>
                        <Pause className="w-5 h-5 fill-current" />
                        <span>Tanaffus Qilish</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 fill-current" />
                        <span>{pomoMode === 'study' ? 'Darsni & Ekishni Boshlash' : 'Boshlash'}</span>
                      </>
                    )}
                  </button>

                  <button
                    id="pomo-reset-btn"
                    type="button"
                    onClick={handlePomoReset}
                    className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                    title="Qayta boshlash"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Linked Active Task banner if any */}
                {activeTask && (
                  <div className="mt-6 p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-3 max-w-md w-full text-left">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg">🎯</span>
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-mono text-indigo-400 tracking-wider">
                          Bogʻlangan Vazifa:
                        </span>
                        <h5 className="font-bold text-white text-xs truncate">{activeTask.title}</h5>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-300 whitespace-nowrap">
                      {activeTask.pomodorosCompleted} / {activeTask.pomodorosEstimated} 🍅
                    </span>
                  </div>
                )}

                {/* Completed Pomodoro Streak & Forest Summary */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>Bugungi seanslar:</span>
                    <span className="font-bold text-amber-400 font-mono">{completedPomodoros} ta Pomodoro</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-emerald-400" />
                    <span>Bogʻdagi daraxtlar:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {plantedTrees.filter((t) => t.status === 'alive').length} ta yashil
                    </span>
                  </div>
                </div>
              </div>

              {/* Anti-Distraction & Deep Focus Control Panel */}
              <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Anti-Chalgʻish & Daraxt Ekish Himoyasi</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsForestModalOpen(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Bogʻimni koʻrish</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Deep Focus Toggle Card */}
                  <div
                    onClick={handleToggleDeepFocus}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isDeepFocusActive
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5 mb-1 text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Daraxt Ekish & Fokus Rejimi</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Dars vaqtida boshqa ilovaga chiqib ketsangiz, daraxtingiz quriy boshlaydi.
                      </p>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                        isDeepFocusActive ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          isDeepFocusActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Strict Mode Toggle Card */}
                  <div
                    onClick={handleToggleStrictMode}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      strictDistractionMode
                        ? 'bg-amber-950/40 border-amber-500/40 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5 mb-1 text-white">
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        <span>Qatʻiy Rejim (1-marta chiqishda)</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {strictDistractionMode
                          ? "1 marta boshqa ilovaga o'tilsa darhol quriydi!"
                          : "2 marta ogohlantirishdan so'ng quriydi (Yumshoq rejim)"}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors flex-shrink-0 ${
                        strictDistractionMode ? 'bg-amber-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          strictDistractionMode ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pomodoro Settings (Duration Customizer) */}
              <div className="p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-lg flex flex-col gap-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-indigo-400" />
                  <span>Daqiqalarni Sozlash</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400">Fokus / Dars vaqti (daq)</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={studyMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 25;
                        setStudyMin(val);
                        localStorage.setItem('vaqt_study_min', String(val));
                        if (pomoMode === 'study' && !pomoRunning) setPomoSeconds(val * 60);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400">Qisqa Tanaffus (daq)</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={breakMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 5;
                        setBreakMin(val);
                        localStorage.setItem('vaqt_break_min', String(val));
                        if (pomoMode === 'short_break' && !pomoRunning) setPomoSeconds(val * 60);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1.5">
                    <label className="text-xs text-slate-400">Uzoq Tanaffus (daq)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={longBreakMin}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 15;
                        setLongBreakMin(val);
                        localStorage.setItem('vaqt_long_min', String(val));
                        if (pomoMode === 'long_break' && !pomoRunning) setPomoSeconds(val * 60);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VAZIFALAR (TASKS / TO-DO PLANNER) */}
          {activeTab === 'tasks' && (
            <div className="flex flex-col gap-6 animate-fadeIn max-w-4xl mx-auto w-full">
              {/* Add New Task Form */}
              <form
                onSubmit={handleAddTask}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
              >
                <input
                  type="text"
                  placeholder="Yangi reja yoki dars vazifasini yozing..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />

                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as any)}
                  className="px-3 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="dars">📚 Dars / Oʻqish</option>
                  <option value="ish">💼 Ish / Kasb</option>
                  <option value="loyiha">🚀 Loyiha</option>
                  <option value="shaxsiy">🌿 Shaxsiy</option>
                </select>

                <div className="flex items-center gap-1 bg-slate-950/80 px-3 py-2 rounded-2xl border border-slate-800" title="Taxminiy Pomodoro seanslari">
                  <span className="text-xs">🍅</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newTaskPomodoros}
                    onChange={(e) => setNewTaskPomodoros(parseInt(e.target.value) || 1)}
                    className="w-10 bg-transparent text-xs font-mono font-bold text-center text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Qoʻshish</span>
                </button>
              </form>

              {/* Task Filter & List */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-400" />
                    <span>Rejalar Roʻyxati ({filteredTasks.length})</span>
                  </h3>

                  <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      onClick={() => setTaskFilter('all')}
                      className={`px-3 py-1 rounded-lg transition ${
                        taskFilter === 'all' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Barchasi
                    </button>
                    <button
                      onClick={() => setTaskFilter('pending')}
                      className={`px-3 py-1 rounded-lg transition ${
                        taskFilter === 'pending' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Bajarilmagan
                    </button>
                    <button
                      onClick={() => setTaskFilter('completed')}
                      className={`px-3 py-1 rounded-lg transition ${
                        taskFilter === 'completed' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Bajarilgan
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {filteredTasks.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 text-center text-slate-500 text-sm">
                      Hozircha hech qanday vazifa kiritilmagan.
                    </div>
                  ) : (
                    filteredTasks.map((task) => {
                      const isTaskActive = activeTaskId === task.id;
                      return (
                        <div
                          key={task.id}
                          className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 ${
                            task.completed
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                              : isTaskActive
                              ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleTaskCompleted(task.id)}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition ${
                                task.completed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : 'border-slate-600 hover:border-indigo-400 bg-slate-950'
                              }`}
                            >
                              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                            </button>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <h4
                                className={`text-sm font-bold truncate ${
                                  task.completed ? 'line-through text-slate-500' : 'text-slate-100'
                                }`}
                              >
                                {task.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                                  {task.category}
                                </span>
                                <span className="text-[10px] text-indigo-300 font-mono">
                                  🍅 {task.pomodorosCompleted} / {task.pomodorosEstimated} seans
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {/* Set as Active Pomodoro Task */}
                            {!task.completed && (
                              <button
                                onClick={() => {
                                  setActiveTaskId(isTaskActive ? null : task.id);
                                  setActiveTab('pomodoro');
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                                  isTaskActive
                                    ? 'bg-indigo-600 text-white shadow'
                                    : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                                }`}
                              >
                                <span>{isTaskActive ? 'Faol 🎯' : 'Tanlash'}</span>
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEKUNDOMER (STOPWATCH) */}
          {activeTab === 'stopwatch' && (
            <div className="flex flex-col gap-6 animate-fadeIn max-w-3xl mx-auto w-full">
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
                  Millisekundlik Aniq Sekundomer
                </span>

                <div className="my-6 font-mono font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white drop-shadow-xl select-none">
                  {formatSw(swTime)}
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={handleSwToggle}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-xl ${
                      swRunning
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/40 hover:scale-105'
                    }`}
                  >
                    {swRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{swRunning ? 'Toʻxtatish' : 'Boshlash'}</span>
                  </button>

                  <button
                    onClick={handleSwLap}
                    disabled={!swRunning}
                    className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
                  >
                    <Flag className="w-4 h-4 text-indigo-400" />
                    <span>Lap (Davr)</span>
                  </button>

                  <button
                    onClick={handleSwReset}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                    title="Nollash"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                {/* Lap Table */}
                {laps.length > 0 && (
                  <div className="w-full mt-8 pt-6 border-t border-slate-800/80 flex flex-col gap-2 max-h-60 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left mb-1">
                      Belgilangan Oraliqlar ({laps.length})
                    </h4>
                    {laps.map((lap, idx) => {
                      const lapNumber = laps.length - idx;
                      return (
                        <div
                          key={idx}
                          className="px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
                        >
                          <span className="text-slate-400">#{lapNumber} Oraliq</span>
                          <span className="font-bold text-indigo-300">{formatSw(lap)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: QAYTMA TAYMER (COUNTDOWN) */}
          {activeTab === 'countdown' && (
            <div className="flex flex-col gap-6 animate-fadeIn max-w-3xl mx-auto w-full">
              <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center text-center">
                {/* Preset Quick Badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                  {[1, 5, 10, 15, 25, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleQuickPreset(mins)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        cdTotalSeconds === mins * 60
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow'
                          : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {mins} daq
                    </button>
                  ))}
                </div>

                {/* Main Countdown Display */}
                <div className="my-4 font-mono font-black text-6xl sm:text-7xl md:text-8xl tracking-tight text-white drop-shadow-xl select-none">
                  {formatCd(cdRemaining)}
                </div>

                {/* Custom Time Pickers (if not running) */}
                {!cdRunning && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase mb-1">Soat</span>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={cdHours}
                        onChange={(e) => {
                          const h = parseInt(e.target.value) || 0;
                          setCdHours(h);
                          const total = h * 3600 + cdMinutes * 60 + cdSeconds;
                          setCdTotalSeconds(total);
                          setCdRemaining(total);
                        }}
                        className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <span className="text-2xl font-mono text-slate-500 mt-3">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase mb-1">Daqiqa</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={cdMinutes}
                        onChange={(e) => {
                          const m = parseInt(e.target.value) || 0;
                          setCdMinutes(m);
                          const total = cdHours * 3600 + m * 60 + cdSeconds;
                          setCdTotalSeconds(total);
                          setCdRemaining(total);
                        }}
                        className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <span className="text-2xl font-mono text-slate-500 mt-3">:</span>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-slate-500 uppercase mb-1">Soniya</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={cdSeconds}
                        onChange={(e) => {
                          const s = parseInt(e.target.value) || 0;
                          setCdSeconds(s);
                          const total = cdHours * 3600 + cdMinutes * 60 + s;
                          setCdTotalSeconds(total);
                          setCdRemaining(total);
                        }}
                        className="w-16 bg-slate-950 border border-slate-800 rounded-xl p-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Countdown Actions */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    onClick={cdRunning ? handleCdPause : handleCdStart}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 shadow-xl ${
                      cdRunning
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/40 hover:scale-105'
                    }`}
                  >
                    {cdRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                    <span>{cdRunning ? 'Toʻxtatish' : 'Boshlash'}</span>
                  </button>

                  <button
                    onClick={handleCdReset}
                    className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                    title="Qaytarish"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ========================================================================= */}
        {/* FLOATING MINI AUDIO PLAYER BAR (BOTTOM BAR) */}
        {/* ========================================================================= */}
        <div className="sticky bottom-0 z-30 backdrop-blur-xl bg-slate-950/85 border-t border-slate-800/80 px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
            <div
              onClick={() => setIsMusicModalOpen(true)}
              className="flex items-center gap-3 cursor-pointer group w-full sm:w-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-lg border border-indigo-500/30 group-hover:scale-105 transition">
                {currentTrack ? currentTrack.icon : '🎵'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-medium">Fon Musiqasi:</span>
                <h5 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 transition">
                  {currentTrack ? currentTrack.title : 'Qoʻshiq tanlanmagan'}
                </h5>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Play/Pause */}
              <button
                onClick={handleToggleMusic}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
                  isMusicPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {isMusicPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isMusicPlaying ? "To'xtatish" : "Ijro etish"}</span>
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-indigo-400" />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 sm:w-20 accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Open Playlist/Upload Modal */}
              <button
                onClick={() => setIsMusicModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Music className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pleylist & Yuklash</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Music Player & Audio Upload Modal */}
      <MusicPlayerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isMusicPlaying}
        onSelectTrack={handleSelectTrack}
        onTogglePlay={handleToggleMusic}
        volume={volume}
        onVolumeChange={setVolume}
        uploadedTracks={uploadedTracks}
        onAddUploadedTrack={handleAddUploadedTrack}
        onDeleteUploadedTrack={handleDeleteUploadedTrack}
        selectedAlarm={selectedAlarm}
        onSelectAlarm={handleSelectAlarmTone}
      />

      {/* Background & Wallpaper Upload Modal */}
      <BackgroundSettingsModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        activeBgId={activeBgId}
        onSelectPreset={handleSelectPresetBg}
        customBgUrl={customBgUrl}
        onSetCustomBgUrl={handleSetCustomBg}
        bgDarkness={bgDarkness}
        onDarknessChange={handleDarknessChange}
        bgBlur={bgBlur}
        onBlurChange={handleBlurChange}
      />

      {/* Focus Forest Garden Modal */}
      <ForestGardenModal
        isOpen={isForestModalOpen}
        onClose={() => setIsForestModalOpen(false)}
        trees={plantedTrees}
        selectedSpecies={treeSpecies}
        onSelectSpecies={handleSelectTreeSpecies}
        onClearHistory={handleClearForestHistory}
      />

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Profilga Kirish</h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Google Sign In Official Button Container */}
            <div className="flex flex-col gap-2">
              <div id="google-signin-btn-container" className="w-full flex justify-center min-h-[42px]"></div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Yoki qoʻlda kirish
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Ismingiz</label>
                <input
                  type="text"
                  required
                  placeholder="Ismingizni kiriting"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Elektron pochta</label>
                <input
                  type="email"
                  required
                  placeholder="pochta@misol.uz"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition mt-2"
              >
                Kirish & Saqlash
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Geolocation Permission Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-indigo-500/40 p-6 sm:p-7 shadow-2xl shadow-indigo-950/50 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            {/* Ambient background light */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            {/* Icon */}
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
              <MapPin className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <h3 className="font-extrabold text-white text-lg sm:text-xl">
                Mahalliy Vaqtingizni Aniqlash
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Joylashuvingizdan foydalanishga ruxsat bersangiz, sayt qayerda ekanligingizni aniqlab, soatni aynan sizning mahalliy vaqtingizga toʻgʻrilab beradi.
              </p>
            </div>

            {/* Current detected suggestion */}
            <div className="w-full p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-center gap-2 text-xs text-indigo-300 font-medium">
              <span>{userLocation.flag}</span>
              <span>Taxminiy hudud: <strong>{userLocation.city}, {userLocation.country}</strong></span>
            </div>

            {/* Actions */}
            <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-2">
              <button
                id="allow-location-btn"
                type="button"
                onClick={handleAllowLocation}
                disabled={isDetectingLocation}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                {isDetectingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Aniqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Ruxsat Berish & Vaqtni Moslash</span>
                  </>
                )}
              </button>

              <button
                id="decline-location-btn"
                type="button"
                onClick={handleDeclineLocation}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
              >
                Oʻtkazib yuborish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secret Super Admin Dashboard Modal (Protected for yusuf18081998@gmail.com) */}
      <SecretAdminDashboard
        user={user}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onBroadcastAnnouncement={(ann) => {
          setSystemAnnouncement(ann);
          setIsAnnouncementDismissed(false);
        }}
      />
    </div>
  );
}
