import React, { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, ShieldCheck, User, Sparkles, CheckCircle2, ChevronDown, Flame, TreePine } from 'lucide-react';
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

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  user,
  onUserChange,
  userLocation,
  onOpenAdminModal,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleGoogleSignIn = async () => {
    if (isLoading) return;
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
      // If popup closed by user, ignore quietly, otherwise alert gracefully
      if (err?.code !== 'auth/popup-closed-by-user') {
        alert("Google bilan kirishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
      }
    } finally {
      setIsLoading(false);
    }
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

  // If not logged in, render Google Login Button
  if (!user) {
    return (
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
    );
  }

  // If logged in, render user avatar + dropdown menu
  return (
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
  );
};
