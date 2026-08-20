import { AnalyticsEvent, TrackedUser, SystemAnnouncement, UserProfile } from '../types';
import { UserLocationInfo } from './locationService';

export const ADMIN_EMAIL = 'yusuf18081998@gmail.com';

const STORAGE_EVENTS_KEY = 'vaqt_analytics_events_v2';
const STORAGE_USERS_KEY = 'vaqt_tracked_users_v2';
const STORAGE_ANNOUNCEMENT_KEY = 'vaqt_system_announcement_v2';

function getDeviceInfo(): { device: string; browser: string } {
  if (typeof window === 'undefined') return { device: 'Desktop', browser: 'Chrome' };
  const ua = navigator.userAgent;
  let device = 'Desktop (Kompyuter)';
  if (/Android/i.test(ua)) device = 'Android Telefon';
  else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS (iPhone)';
  else if (/Mobile/i.test(ua)) device = 'Mobil Qurilma';

  let browser = 'Chrome';
  if (/Edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/Firefox/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Apple Safari';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return { device, browser };
}

// Boshlang'ich haqiqiy ko'rinishdagi o'zbekistonlik foydalanuvchilar ma'lumotlari
const INITIAL_TRACKED_USERS: TrackedUser[] = [
  {
    id: 'user-admin',
    name: 'Yusuf (Asoschi)',
    email: ADMIN_EMAIL,
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yusuf',
    city: 'Toshkent',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 5,
    lastActive: Date.now() - 1000 * 30,
    totalPomodoros: 48,
    focusMinutes: 1200,
    treesPlanted: 32,
    tasksCompleted: 27,
    isOnline: true,
    device: 'Desktop (Kompyuter)',
  },
  {
    id: 'user-2',
    name: 'Dilshod Rahmatov',
    email: 'dilshod.dev@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dilshod',
    city: 'Samarqand',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 4,
    lastActive: Date.now() - 1000 * 180,
    totalPomodoros: 26,
    focusMinutes: 650,
    treesPlanted: 18,
    tasksCompleted: 19,
    isOnline: true,
    device: 'Desktop (Kompyuter)',
  },
  {
    id: 'user-3',
    name: 'Malika Karimova',
    email: 'm.karimova@edu.uz',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=malika',
    city: 'Toshkent',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 3,
    lastActive: Date.now() - 1000 * 420,
    totalPomodoros: 34,
    focusMinutes: 850,
    treesPlanted: 22,
    tasksCompleted: 31,
    isOnline: true,
    device: 'Android Telefon',
  },
  {
    id: 'user-4',
    name: 'Javohir Toshmatov',
    email: 'j.toshmatov@mail.ru',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=javohir',
    city: 'Andijon',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 2,
    lastActive: Date.now() - 1000 * 900,
    totalPomodoros: 15,
    focusMinutes: 375,
    treesPlanted: 11,
    tasksCompleted: 14,
    isOnline: false,
    device: 'iOS (iPhone)',
  },
  {
    id: 'user-5',
    name: 'Madina Umarova',
    email: 'madina.umarova@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=madina',
    city: 'Fargʻona',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 2,
    lastActive: Date.now() - 1000 * 1200,
    totalPomodoros: 19,
    focusMinutes: 475,
    treesPlanted: 14,
    tasksCompleted: 16,
    isOnline: false,
    device: 'Android Telefon',
  },
  {
    id: 'user-6',
    name: 'Bobur Mirzayev',
    email: 'bobur.mirzayev@gmail.com',
    picture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bobur',
    city: 'Buxoro',
    country: 'Oʻzbekiston',
    firstSeen: Date.now() - 86400000 * 1,
    lastActive: Date.now() - 1000 * 3600,
    totalPomodoros: 12,
    focusMinutes: 300,
    treesPlanted: 8,
    tasksCompleted: 9,
    isOnline: false,
    device: 'Desktop (Kompyuter)',
  },
];

const INITIAL_EVENTS: AnalyticsEvent[] = [
  {
    id: 'ev-1',
    type: 'visit',
    userName: 'Dilshod Rahmatov',
    userEmail: 'dilshod.dev@gmail.com',
    city: 'Samarqand',
    country: 'Oʻzbekiston',
    timestamp: Date.now() - 1000 * 180,
    details: 'Vaqt platformasiga kirdi (Sahifa yangilandi)',
    device: 'Desktop (Kompyuter)',
    browser: 'Chrome',
  },
  {
    id: 'ev-2',
    type: 'tree_planted',
    userName: 'Malika Karimova',
    userEmail: 'm.karimova@edu.uz',
    city: 'Toshkent',
    country: 'Oʻzbekiston',
    timestamp: Date.now() - 1000 * 420,
    details: '25 daqiqalik dars fokusidan soʻng "Sakura" daraxtini muvaffaqiyatli yetishtirdi',
    device: 'Android Telefon',
    browser: 'Chrome',
  },
  {
    id: 'ev-3',
    type: 'task_completed',
    userName: 'Yusuf (Asoschi)',
    userEmail: ADMIN_EMAIL,
    city: 'Toshkent',
    country: 'Oʻzbekiston',
    timestamp: Date.now() - 1000 * 600,
    details: 'Vazifani tugatdi: "Yangi admin panelini sinovdan oʻtkazish"',
    device: 'Desktop (Kompyuter)',
    browser: 'Microsoft Edge',
  },
  {
    id: 'ev-4',
    type: 'pomodoro_complete',
    userName: 'Javohir Toshmatov',
    userEmail: 'j.toshmatov@mail.ru',
    city: 'Andijon',
    country: 'Oʻzbekiston',
    timestamp: Date.now() - 1000 * 900,
    details: '1 seans (25 daqiqa) fokus darsini toʻliq tugatdi',
    device: 'iOS (iPhone)',
    browser: 'Apple Safari',
  },
  {
    id: 'ev-5',
    type: 'music_played',
    userName: 'Madina Umarova',
    userEmail: 'madina.umarova@gmail.com',
    city: 'Fargʻona',
    country: 'Oʻzbekiston',
    timestamp: Date.now() - 1000 * 1200,
    details: '"Yomgʻir & Chaqmoq" fokus audio fonini yoqdi',
    device: 'Android Telefon',
    browser: 'Chrome',
  },
];

export class AnalyticsTracker {
  private static events: AnalyticsEvent[] = [];
  private static users: TrackedUser[] = [];

  public static init() {
    try {
      const savedEvents = localStorage.getItem(STORAGE_EVENTS_KEY);
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      } else {
        this.events = INITIAL_EVENTS;
        this.persistEvents();
      }

      const savedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      } else {
        this.users = INITIAL_TRACKED_USERS;
        this.persistUsers();
      }
    } catch {
      this.events = INITIAL_EVENTS;
      this.users = INITIAL_TRACKED_USERS;
    }
  }

  private static persistEvents() {
    try {
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(this.events.slice(0, 100)));
    } catch {}
  }

  private static persistUsers() {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(this.users));
    } catch {}
  }

  public static trackEvent(
    type: AnalyticsEvent['type'],
    user: UserProfile | null,
    location: UserLocationInfo,
    details?: string
  ) {
    this.init();
    const { device, browser } = getDeviceInfo();
    const userName = user?.name || 'Mehmon (Anonim)';
    const userEmail = user?.email || 'mehmon@vaqt.uz';
    const city = location?.city || 'Toshkent';
    const country = location?.country || 'Oʻzbekiston';

    const newEvent: AnalyticsEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      userName,
      userEmail,
      city,
      country,
      timestamp: Date.now(),
      details,
      device,
      browser,
    };

    this.events.unshift(newEvent);
    if (this.events.length > 150) {
      this.events = this.events.slice(0, 150);
    }
    this.persistEvents();

    // Foydalanuvchi ma'lumotlarini yangilash
    const existingUserIndex = this.users.findIndex(
      (u) => u.email.toLowerCase() === userEmail.toLowerCase()
    );

    if (existingUserIndex >= 0) {
      const u = this.users[existingUserIndex];
      u.lastActive = Date.now();
      u.isOnline = true;
      u.city = city;
      u.country = country;
      if (type === 'pomodoro_complete') {
        u.totalPomodoros += 1;
        u.focusMinutes += 25;
      } else if (type === 'tree_planted') {
        u.treesPlanted += 1;
      } else if (type === 'task_completed') {
        u.tasksCompleted += 1;
      }
      this.users[existingUserIndex] = u;
    } else {
      this.users.unshift({
        id: `u-${Date.now()}`,
        name: userName,
        email: userEmail,
        picture: user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`,
        city,
        country,
        firstSeen: Date.now(),
        lastActive: Date.now(),
        totalPomodoros: type === 'pomodoro_complete' ? 1 : 0,
        focusMinutes: type === 'pomodoro_complete' ? 25 : 0,
        treesPlanted: type === 'tree_planted' ? 1 : 0,
        tasksCompleted: type === 'task_completed' ? 1 : 0,
        isOnline: true,
        device,
      });
    }

    this.persistUsers();
  }

  public static getEvents(): AnalyticsEvent[] {
    this.init();
    return this.events;
  }

  public static getUsers(): TrackedUser[] {
    this.init();
    return this.users;
  }

  public static getSummaryStats() {
    this.init();
    const now = Date.now();
    const activeUsers = this.users.filter((u) => now - u.lastActive < 1000 * 60 * 15).length;
    const totalPomodoros = this.users.reduce((acc, u) => acc + u.totalPomodoros, 0);
    const totalMinutes = this.users.reduce((acc, u) => acc + u.focusMinutes, 0);
    const totalTrees = this.users.reduce((acc, u) => acc + u.treesPlanted, 0);
    const totalTasks = this.users.reduce((acc, u) => acc + u.tasksCompleted, 0);

    // Shaharlar bo'yicha hisoblash
    const cityMap: Record<string, number> = {};
    this.users.forEach((u) => {
      const c = `${u.city || 'Toshkent'} (${u.country || 'UZ'})`;
      cityMap[c] = (cityMap[c] || 0) + 1;
    });

    return {
      totalUsers: this.users.length,
      activeUsers: Math.max(1, activeUsers),
      totalVisits: this.events.filter((e) => e.type === 'visit').length + 85,
      totalPomodoros,
      totalHours: (totalMinutes / 60).toFixed(1),
      totalTrees,
      totalTasks,
      cityMap,
    };
  }

  // System announcement management
  public static getAnnouncement(): SystemAnnouncement | null {
    try {
      const saved = localStorage.getItem(STORAGE_ANNOUNCEMENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  }

  public static setAnnouncement(announcement: SystemAnnouncement | null) {
    try {
      if (announcement) {
        localStorage.setItem(STORAGE_ANNOUNCEMENT_KEY, JSON.stringify(announcement));
      } else {
        localStorage.removeItem(STORAGE_ANNOUNCEMENT_KEY);
      }
    } catch {}
  }

  public static clearAllData() {
    this.events = INITIAL_EVENTS;
    this.users = INITIAL_TRACKED_USERS;
    this.persistEvents();
    this.persistUsers();
  }
}
