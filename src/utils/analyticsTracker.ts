import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AnalyticsEvent, TrackedUser, SystemAnnouncement, UserProfile } from '../types';
import { UserLocationInfo } from './locationService';

export const ADMIN_EMAIL = 'yusuf18081998@gmail.com';

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

// Brauzer yoki foydalanuvchining barqaror unikal ID si
function getVisitorId(userEmail?: string): string {
  if (userEmail && userEmail !== 'mehmon@vaqt.uz') {
    return `user_${userEmail.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
  }
  let localId = localStorage.getItem('vaqt_visitor_uuid');
  if (!localId) {
    localId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('vaqt_visitor_uuid', localId);
  }
  return localId;
}

export class AnalyticsTracker {
  private static localEvents: AnalyticsEvent[] = [];
  private static localUsers: TrackedUser[] = [];

  // Real-vaqt harakatni Firebase Firestorega yozish
  public static async trackEvent(
    type: AnalyticsEvent['type'],
    user: UserProfile | null,
    location: UserLocationInfo,
    details?: string
  ) {
    const { device, browser } = getDeviceInfo();
    const userName = user?.name || 'Mehmon (Anonim)';
    const userEmail = user?.email || 'mehmon@vaqt.uz';
    const city = location?.city || 'Toshkent';
    const country = location?.country || 'Oʻzbekiston';
    const timestamp = Date.now();
    const eventId = `ev_${timestamp}_${Math.random().toString(36).substring(2, 7)}`;
    const visitorId = getVisitorId(user?.email);

    const newEvent: AnalyticsEvent = {
      id: eventId,
      type,
      userName,
      userEmail,
      city,
      country,
      timestamp,
      details: details || '',
      device,
      browser,
    };

    // 1. Firebase Firestore "analytics_events" ga saqlash
    try {
      const eventRef = doc(db, 'analytics_events', eventId);
      await setDoc(eventRef, newEvent);
    } catch (err) {
      console.warn('Firebase event log failed, saving locally:', err);
    }

    // 2. Firebase Firestore "tracked_users" ga yangilash
    try {
      const userRef = doc(db, 'tracked_users', visitorId);
      const existingUser = this.localUsers.find((u) => u.id === visitorId);

      const totalPomodoros = (existingUser?.totalPomodoros || 0) + (type === 'pomodoro_complete' ? 1 : 0);
      const focusMinutes = (existingUser?.focusMinutes || 0) + (type === 'pomodoro_complete' ? 25 : 0);
      const treesPlanted = (existingUser?.treesPlanted || 0) + (type === 'tree_planted' ? 1 : 0);
      const tasksCompleted = (existingUser?.tasksCompleted || 0) + (type === 'task_completed' ? 1 : 0);

      const userDocData: TrackedUser = {
        id: visitorId,
        name: userName,
        email: userEmail,
        picture: user?.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${visitorId}`,
        city,
        country,
        firstSeen: existingUser?.firstSeen || timestamp,
        lastActive: timestamp,
        totalPomodoros,
        focusMinutes,
        treesPlanted,
        tasksCompleted,
        isOnline: true,
        device,
      };

      await setDoc(userRef, userDocData, { merge: true });
    } catch (err) {
      console.warn('Firebase user update failed:', err);
    }
  }

  // Real-vaqt hodisalarni Firestore dan jonli tinglash (Admin uchun)
  public static subscribeEvents(callback: (events: AnalyticsEvent[]) => void) {
    try {
      const q = query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(100));
      return onSnapshot(
        q,
        (snapshot) => {
          const evs: AnalyticsEvent[] = [];
          snapshot.forEach((docSnap) => {
            evs.push(docSnap.data() as AnalyticsEvent);
          });
          this.localEvents = evs;
          callback(evs);
        },
        (error) => {
          console.warn('Firestore subscribe error:', error);
          callback(this.localEvents);
        }
      );
    } catch {
      callback(this.localEvents);
      return () => {};
    }
  }

  // Real-vaqt barcha foydalanuvchilarni Firestore dan jonli tinglash
  public static subscribeUsers(callback: (users: TrackedUser[]) => void) {
    try {
      const q = query(collection(db, 'tracked_users'), orderBy('lastActive', 'desc'), limit(150));
      return onSnapshot(
        q,
        (snapshot) => {
          const usrs: TrackedUser[] = [];
          const now = Date.now();
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as TrackedUser;
            // 15 daqiqa ichida faol bo'lsa jonli onlayn
            data.isOnline = now - data.lastActive < 1000 * 60 * 15;
            usrs.push(data);
          });
          this.localUsers = usrs;
          callback(usrs);
        },
        (error) => {
          console.warn('Firestore users error:', error);
          callback(this.localUsers);
        }
      );
    } catch {
      callback(this.localUsers);
      return () => {};
    }
  }

  // Real-vaqt umumiy hisob-kitoblar
  public static computeSummary(users: TrackedUser[], events: AnalyticsEvent[]) {
    const now = Date.now();
    const activeUsers = users.filter((u) => now - u.lastActive < 1000 * 60 * 15).length;
    const totalPomodoros = users.reduce((acc, u) => acc + (u.totalPomodoros || 0), 0);
    const totalMinutes = users.reduce((acc, u) => acc + (u.focusMinutes || 0), 0);
    const totalTrees = users.reduce((acc, u) => acc + (u.treesPlanted || 0), 0);
    const totalTasks = users.reduce((acc, u) => acc + (u.tasksCompleted || 0), 0);

    const cityMap: Record<string, number> = {};
    users.forEach((u) => {
      const c = `${u.city || 'Toshkent'} (${u.country || 'UZ'})`;
      cityMap[c] = (cityMap[c] || 0) + 1;
    });

    const totalVisits = events.filter((e) => e.type === 'visit').length;

    return {
      totalUsers: users.length,
      activeUsers: Math.max(activeUsers, users.length > 0 ? 1 : 0),
      totalVisits: Math.max(totalVisits, events.length),
      totalPomodoros,
      totalHours: (totalMinutes / 60).toFixed(1),
      totalTrees,
      totalTasks,
      cityMap,
    };
  }

  // Tizim e'lonini Firestore dan tinglash
  public static subscribeAnnouncement(callback: (ann: SystemAnnouncement | null) => void) {
    try {
      const docRef = doc(db, 'system_announcements', 'global_banner');
      return onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            callback(snap.data() as SystemAnnouncement);
          } else {
            callback(null);
          }
        },
        () => callback(null)
      );
    } catch {
      return () => {};
    }
  }

  // Tizim e'lonini saqlash yoki o'chirish
  public static async setAnnouncement(announcement: SystemAnnouncement | null) {
    try {
      const docRef = doc(db, 'system_announcements', 'global_banner');
      if (announcement) {
        await setDoc(docRef, announcement);
      } else {
        await deleteDoc(docRef);
      }
    } catch (err) {
      console.warn('Failed to set announcement in Firebase:', err);
    }
  }

  // Barcha eski loglarni tozalash (Admin uchun)
  public static async clearAllData() {
    try {
      const evsSnap = await getDocs(collection(db, 'analytics_events'));
      evsSnap.forEach(async (d) => {
        await deleteDoc(d.ref);
      });
    } catch (err) {
      console.warn('Error clearing Firestore logs:', err);
    }
  }
}
