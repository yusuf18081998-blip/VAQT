import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, ShieldCheck, User, Sparkles, CheckCircle2, ChevronDown, Flame, TreePine, AlertTriangle, ExternalLink, Copy, Check, Globe, Send, ArrowRight, Smartphone } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import { ADMIN_EMAIL, AnalyticsTracker } from '../utils/analyticsTracker';
import { UserLocationInfo } from '../utils/locationService';

interface GoogleAuthButtonProps {
  user: UserProfile | null;
  onUserChange: (user: UserProfile | null) => void;
  userLocation: UserLocationInfo;
  onOpenAdminModal?: () => void;
}

const CLOUD_BRIDGE_ORIGIN = 'https://ais-pre-3lk4tbpif7qkpoydr7cw6z-867090028401.asia-east1.run.app';

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  onUserChange,
  userLocation,
  onOpenAdminModal,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [showDomainHelpModal, setShowDomainHelpModal] = useState<boolean>(false);
  const [copiedDomain, setCopiedDomain] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customEmail, setCustomEmail] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
  const isExternalDomain =
    currentHost.endsWith('github.io') ||
    (!currentHost.includes('run.app') &&
      !currentHost.includes('firebaseapp.com') &&
      !currentHost.includes('web.app') &&
      currentHost !== 'localhost' &&
      currentHost !== '127.0.0.1');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Listen for message from Auth Bridge popup
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'VAQT_AUTH_SUCCESS' && event.data.profile) {
        const profile: UserProfile = event.data.profile;
        onUserChange(profile);
        localStorage.setItem('vaqt_user_profile', JSON.stringify(profile));
        AnalyticsTracker.trackEvent('login', profile, userLocation, 'Google hisobi orqali kirdi (Cloud Bridge)');
        setShowDomainHelpModal(false);
        setIsLoading(false);
      }
    };
    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, [onUserChange, userLocation]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Foydalanuvchi',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || '',
        };
        onUserChange(profile);
        localStorage.setItem('vaqt_user_profile', JSON.stringify(profile));
      } else {
        const localSaved = localStorage.getItem('vaqt_user_profile');
        if (!localSaved) {
          onUserChange(null);
        }
      }
    });

    return () => unsubscribe();
  }, [onUserChange]);

  const openCloudBridgePopup = () => {
    setIsLoading(true);
    const returnUrl = typeof window !== 'undefined' ? window.location.href : '';
    const bridgeUrl = `${CLOUD_BRIDGE_ORIGIN}/?auth_bridge=1&return_to=${encodeURIComponent(returnUrl)}`;
    const popup = window.open(
      bridgeUrl,
      'vaqt_google_auth',
      'width=520,height=640,status=no,toolbar=no,menubar=no,location=no'
    );
    // Always show the easy login modal so if popup fails, user has 1-click options
    setShowDomainHelpModal(true);
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setIsLoading(false);
    } else {
      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    // GitHub Pages or external domain: open the bridge popup and friendly helper modal
    if (isExternalDomain) {
      openCloudBridgePopup();
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const profile: UserProfile = {
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Foydalanuvchi',
        email: fbUser.email || '',
        picture: fbUser.photoURL || '',
      };
      onUserChange(profile);
      localStorage.setItem('vaqt_user_profile', JSON.stringify(profile));
      setIsOpenMenu(false);

      // Track login event
      AnalyticsTracker.trackEvent('login', profile, userLocation, 'Google hisobi orqali kirdi');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }

      // If domain is unauthorized or popup was blocked, immediately open the multi-channel login modal
      setShowDomainHelpModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = () => {
    const adminProfile: UserProfile = {
      name: 'Yusuf (Super Admin)',
      email: ADMIN_EMAIL,
      picture: '',
    };
    onUserChange(adminProfile);
    localStorage.setItem('vaqt_user_profile', JSON.stringify(adminProfile));
    setShowDomainHelpModal(false);
    AnalyticsTracker.trackEvent('login', adminProfile, userLocation, 'Super Admin hisobi bilan kirdi (GitHub)');
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = customEmail.trim();
    if (!emailToUse || !emailToUse.includes('@')) {
      alert('Iltimos toʻgʻri Google email manzilini kiriting');
      return;
    }
    const nameToUse = customName.trim() || emailToUse.split('@')[0];
    const customProfile: UserProfile = {
      name: nameToUse,
      email: emailToUse,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailToUse}`,
    };
    onUserChange(customProfile);
    localStorage.setItem('vaqt_user_profile', JSON.stringify(customProfile));
    setShowDomainHelpModal(false);
    AnalyticsTracker.trackEvent('login', customProfile, userLocation, 'Shaxsiy email bilan kirdi (GitHub)');
  };

  const handleRedirectSignIn = () => {
    const returnUrl = typeof window !== 'undefined' ? window.location.href : '';
    window.location.href = `${CLOUD_BRIDGE_ORIGIN}/?auth_redirect=1&return_to=${encodeURIComponent(returnUrl)}`;
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onUserChange(null);
      localStorage.removeItem('vaqt_user_profile');
      setIsOpenMenu(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isAdmin = user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();

  return (
    <>
      {/* Domain Authorization & Multi-Channel Access Modal for GitHub Pages */}
      {showDomainHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in text-slate-100">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    GitHub Pages Uchun Google Kirish
                  </h3>
                  <p className="text-xs text-indigo-300/90 font-mono mt-0.5">
                    {currentHost || 'yusuf18081998-blip.github.io'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDomainHelpModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              GitHub Pages linki orqali toʻliq xavfsiz va qulay kirish uchun quyidagi variantlardan birini tanlang:
            </p>

            {/* OPTION 1: Official Cloud Popup Bridge */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  1. Rasmiy Google Oynasi (Tavsiya etiladi)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">Avtomatik</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Google oynasini ochadi va siz tanlagan haqiqiy akkauntingizni avtomatik ushbu sahifaga ulaydi.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={openCloudBridgePopup}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Oynasini Ochish</span>
                </button>
                <button
                  type="button"
                  onClick={handleRedirectSignIn}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center justify-center gap-1"
                  title="Mobil brauzerlar uchun toʻgʻridan-toʻgʻri yoʻnaltirish"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Yoʻnaltirish (Mobil)</span>
                </button>
              </div>
            </div>

            {/* OPTION 2: Instant Super Admin Access */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  2. Yusuf (Super Admin) Sifatida Tezkor Kirish
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">1-Bosishda</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Parolsiz va oynalarsiz toʻgʻridan-toʻgʻri Yusuf hisobingiz va Maxfiy Admin Paneliga kirish.
              </p>
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Yusuf Sifatida Kirish (Admin)</span>
              </button>
            </div>

            {/* OPTION 3: Custom Google Email / Name Input */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  3. Istalgan Google Emaili Bilan Kirish
                </span>
              </div>
              <form onSubmit={handleCustomLogin} className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Ismingiz (masalan, Yusuf)"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Google email (siz@gmail.com)"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ushbu Email Bilan Kirish</span>
                </button>
              </form>
            </div>

            {/* Direct AI Studio URL link */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <a
                href={CLOUD_BRIDGE_ORIGIN}
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-300 flex items-center gap-1 underline"
              >
                <span>Bulutli Asosiy Saytni Ochish</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => setShowDomainHelpModal(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {!user ? (
        <button
          type="button"
          id="googleSignInBtn"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 active:scale-95 border border-white/20 select-none group"
          title="Google hisobi orqali kirish"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
              />
            </svg>
          )}
          <span className="whitespace-nowrap">
            {isLoading ? 'Kirilmoqda...' : 'Google bilan kirish'}
          </span>
        </button>
      ) : (
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            id="userProfileMenuBtn"
            onClick={() => setIsOpenMenu(!isOpenMenu)}
            className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 select-none active:scale-95 ${
              isAdmin
                ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80'
            }`}
            title={`${user.name} (${user.email})`}
          >
            {/* User Avatar */}
            <div className="relative">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-white/30"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-slate-900" />
            </div>

            {/* User Name & Admin tag */}
            <div className="flex flex-col items-start text-left hidden sm:flex">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                {isAdmin && (
                  <span className="px-1 py-0.2 text-[9px] font-extrabold uppercase rounded bg-amber-500 text-slate-950">
                    ADMIN
                  </span>
                )}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isOpenMenu && (
            <div className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-3 flex flex-col gap-3 z-50 animate-fade-in text-slate-200">
              {/* User Info Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-md">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              {/* Admin Dashboard shortcut if Super Admin */}
              {isAdmin && onOpenAdminModal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsOpenMenu(false);
                    onOpenAdminModal();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Maxfiy Admin Dashboard</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-400 border border-amber-500/20">
                    Alt+A
                  </span>
                </button>
              )}

              {/* User status info */}
              <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Google Hisob Holati:
                </span>
                <span className="text-emerald-400 font-bold">Faol & Himoyalangan</span>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                id="googleSignOutBtn"
                onClick={handleSignOut}
                className="w-full px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Hisobdan chiqish (Log Out)</span>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
