import React, { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, FirebaseUser } from '../firebase';
import { UserProfile } from '../types';
import { CheckCircle2, Sparkles, LogIn, AlertCircle } from 'lucide-react';

export const AuthBridgeView: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'success' | 'error'>('authenticating');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const searchParams = new URLSearchParams(window.location.search);
  const returnTo = searchParams.get('return_to') || '';

  const sendSuccessAndClose = (profile: UserProfile) => {
    setUserProfile(profile);
    setStatus('success');

    // 1. Post message to opener window (GitHub Pages)
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          {
            type: 'VAQT_AUTH_SUCCESS',
            profile,
          },
          '*'
        );
      } catch (e) {
        console.warn('postMessage failed:', e);
      }
    }

    // 2. If return_to is provided and opener is missing or popup cannot communicate
    setTimeout(() => {
      if (window.opener && !window.opener.closed) {
        window.close();
      } else if (returnTo) {
        const cleanReturn = returnTo.split('#')[0];
        window.location.href = `${cleanReturn}#auth_user=${encodeURIComponent(JSON.stringify(profile))}`;
      }
    }, 800);
  };

  const handleSignIn = async () => {
    setStatus('authenticating');
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const profile: UserProfile = {
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Foydalanuvchi',
        email: fbUser.email || '',
        picture: fbUser.photoURL || '',
      };
      sendSuccessAndClose(profile);
    } catch (err: any) {
      console.error('Bridge auth error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setErrorMsg(err?.message || 'Google bilan ulanishda xatolik yuz berdi');
    }
  };

  useEffect(() => {
    // Check if user is already signed in on this domain
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser && fbUser.email) {
        const profile: UserProfile = {
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Foydalanuvchi',
          email: fbUser.email || '',
          picture: fbUser.photoURL || '',
        };
        sendSuccessAndClose(profile);
      } else {
        // Auto-trigger sign in
        handleSignIn();
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center text-center space-y-5">
        {/* Logo / Badge */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
        </div>

        <div>
          <h2 className="text-xl font-black tracking-tight text-white">
            VAQT — Google Xavfsiz Kirish
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            GitHub Pages va barcha tashqi havolalar uchun rasmiy autentifikatsiya oynasi
          </p>
        </div>

        {status === 'authenticating' && (
          <div className="flex flex-col items-center space-y-3 py-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-semibold text-indigo-300">
              Google hisobi tasdiqlanmoqda...
            </p>
            <p className="text-xs text-slate-500">
              Iltimos, ochilgan Google oynasida profilingizni tanlang
            </p>
          </div>
        )}

        {status === 'success' && userProfile && (
          <div className="flex flex-col items-center space-y-3 py-4 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-emerald-300">
                Xush kelibsiz, {userProfile.name}!
              </p>
              <p className="text-xs text-slate-400">
                {userProfile.email}
              </p>
            </div>
            <p className="text-xs text-slate-400 animate-pulse">
              Sahifangizga yoʻnaltirilmoqda, oyna yopiladi...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 w-full py-2">
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={handleSignIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Qaytadan Urinish</span>
            </button>
          </div>
        )}

        {status === 'idle' && (
          <div className="space-y-3 w-full py-2">
            <button
              onClick={handleSignIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Google Hisobi Bilan Kirish</span>
            </button>
          </div>
        )}

        {returnTo && (
          <a
            href={returnTo}
            className="text-[11px] text-slate-500 hover:text-slate-300 underline transition"
          >
            GitHub Pages sahifasiga qaytish
          </a>
        )}
      </div>
    </div>
  );
};
