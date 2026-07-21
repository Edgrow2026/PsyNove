'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { store, AppState } from '../lib/store';
import { translations, Language } from '../lib/translations';
import { uiCopy } from '../lib/ui-copy';
import { Menu, X, BrainCircuit, User, LogOut, ChevronDown, HeartHandshake } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import AuthTabs from './auth/AuthTabs';
import { ClientRegisterValues } from './auth/ClientRegisterModal';
import { LoginRole } from './auth/LoginModal';
import { PsychiatristRegisterValues } from './auth/PsychiatristRegisterModal';
import {
  getProfile,
  registerClient,
  registerPsychiatrist,
  signInWithRole,
  signOut,
} from '@/lib/auth';
import { supabase } from '@/lib/supabase';

interface NavbarProps {
  activeSection?: string;
}

export default function Navbar({ activeSection = 'home' }: NavbarProps) {
  const [state, setState] = useState<AppState>(() => store.getState());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      if (!user || !isMounted) return;

      try {
        const profile = await getProfile(user.id);
        store.syncAuthenticatedProfile(profile);
      } catch (error) {
        console.warn('Unable to restore auth session.', error);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT') {
        store.setRole('guest', null);
        return;
      }

      if (!session?.user) return;

      try {
        const profile = await getProfile(session.user.id);
        store.syncAuthenticatedProfile(profile);
      } catch (error) {
        console.warn('Unable to sync auth session.', error);
      }
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const t = translations[state.currentLanguage];
  const lang = state.currentLanguage;
  const copy = uiCopy[lang];

  const handleLangChange = (newLang: Language) => {
    store.setLanguage(newLang);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.warn('Supabase logout failed, clearing local session.', error);
    }
    store.setRole('guest', null);
    setUserDropdownOpen(false);
    window.location.href = '/';
  };

  const handleClientLogin = async (phone: string, password: string) => {
    try {
      const result = await signInWithRole('client', phone, password);
      store.syncAuthenticatedProfile(result.profile);
      setLoginError('');
      setLoginOpen(false);
      return true;
    } catch (error) {
      const fallbackOk = store.loginClient(phone, password);
      if (fallbackOk) {
        setLoginError('');
        setLoginOpen(false);
        return true;
      }

      setLoginError(error instanceof Error ? error.message : copy.invalidLogin);
      return false;
    }
  };

  const handleRoleLogin = async (
    role: Exclude<LoginRole, 'client'>,
    identifier: string,
    password: string,
  ) => {
    try {
      const result = await signInWithRole(role, identifier, password);
      store.syncAuthenticatedProfile(result.profile);
      setLoginError(result.warning || '');
      setLoginOpen(false);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed.');
      throw error;
    }
  };

  const handleClientRegister = async (values: ClientRegisterValues) => {
    const result = await registerClient(values);
    store.syncAuthenticatedProfile(result.profile);
    setLoginError('');
    return result.warning || 'Patient account created and connected to Supabase.';
  };

  const handlePsychiatristRegister = async (values: PsychiatristRegisterValues) => {
    const result = await registerPsychiatrist(values);
    store.syncAuthenticatedProfile(result.profile);
    setLoginError('');
    return result.warning || 'Doctor account submitted and connected to Supabase.';
  };

  const goToHomeSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = `/#${sectionId}`;
  };

  const getRoleBadge = () => {
    switch (state.currentRole) {
      case 'client':
        return { text: t.roleClient, color: 'bg-indigo-950/40 text-indigo-300 border-indigo-900/50' };
      case 'psychiatrist':
        return { text: t.roleDoctor, color: 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50' };
      case 'admin':
        return { text: t.roleAdmin, color: 'bg-amber-950/40 text-amber-300 border-amber-900/50' };
      case 'superadmin':
        return { text: t.roleSuperAdmin, color: 'bg-red-950/40 text-red-300 border-red-900/50' };
      default:
        return null;
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 w-full bg-paper/95 backdrop-blur-md border-b border-hairline shadow-md shadow-ink-navy/5" id="psynova-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group" id="brand-link">
          <div className="bg-warm-turmeric text-ink-navy p-2 rounded-xl group-hover:bg-warm-turmeric/80 transition-colors duration-300 shadow-md shadow-warm-turmeric/10">
            <BrainCircuit className="w-5.5 h-5.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold font-display text-ink-navy tracking-tight leading-tight">Psy<span className="text-warm-turmeric">Nova</span></span>
            <span className="text-[10px] text-slate-600 font-medium tracking-wide">Specialist Psychiatry</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-semibold text-ink-navy/70 font-sans" id="desktop-nav">
          <Link
            href="/"
            className={`hover:text-ink-navy hover:opacity-100 transition-colors ${activeSection === 'home' ? 'text-ink-navy font-bold border-b-2 border-warm-turmeric pb-1' : ''}`}
          >
            {t.home}
          </Link>
          <button
            type="button"
            onClick={() => goToHomeSection('search-anchor')}
            className="hover:text-ink-navy hover:opacity-100 transition-colors cursor-pointer"
          >
            {copy.findDoctors}
          </button>
          <Link
            href="/about"
            className={`hover:text-ink-navy hover:opacity-100 transition-colors ${activeSection === 'about' ? 'text-ink-navy font-bold border-b-2 border-warm-turmeric pb-1' : ''}`}
          >
            {t.about}
          </Link>
          <Link
            href="/support"
            className={`hover:text-ink-navy hover:opacity-100 transition-colors ${activeSection === 'support' ? 'text-ink-navy font-bold border-b-2 border-warm-turmeric pb-1' : ''}`}
          >
            {t.support}
          </Link>
        </nav>

        {/* Right Action Side */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Priority Language Switcher */}
          <LanguageSwitcher currentLanguage={lang} onLanguageChange={handleLangChange} />

          {/* User Section */}
          {state.currentRole === 'guest' ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2 text-xs font-bold text-ink-navy/80 hover:text-ink-navy rounded-lg transition-all cursor-pointer"
              >
                {t.login}
              </button>
              <button
                onClick={() => {
                  const scrollSection = document.getElementById('search-anchor');
                  if (scrollSection) {
                    scrollSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/#search-anchor';
                  }
                }}
                className="bg-warm-turmeric text-ink-navy text-xs font-bold px-5 py-2.5 rounded-full hover:bg-warm-turmeric/90 shadow-lg shadow-warm-turmeric/10 transition-all cursor-pointer"
              >
                {t.bookSession}
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-white hover:bg-paper border border-hairline px-3 py-1.5 rounded-xl text-xs font-semibold text-ink-navy transition-all cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-warm-turmeric/15 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-warm-turmeric" />
                </div>
                <span>
                  {state.currentRole === 'client' 
                    ? state.clients.find(c => c.id === state.loggedInUserId)?.name || "Kavindu"
                    : state.currentRole === 'psychiatrist'
                      ? state.psychiatrists.find(d => d.id === state.loggedInUserId)?.name || "Dr. Ruwan"
                      : state.currentRole === 'admin'
                        ? "Platform Admin"
                        : "Super Admin"
                  }
                </span>
                <ChevronDown className="w-3 h-3 text-ink-navy/60" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-hairline py-1.5 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 border-b border-hairline">
                    <span className="block text-[10px] text-slate-500 font-bold tracking-wider uppercase">{copy.accountType}</span>
                    {badge && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] font-bold rounded-md border ${badge.color}`}>
                        {badge.text}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      // Scroll or route to Dashboard section in home page
                      const dbSection = document.getElementById('dashboard-view');
                      if (dbSection) {
                        dbSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/#dashboard-view';
                      }
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-ink-navy/80 hover:bg-paper hover:text-ink-navy transition-colors font-medium flex items-center space-x-2 cursor-pointer"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-warm-turmeric" />
                    <span>{t.myDashboard}</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors font-semibold flex items-center space-x-2 border-t border-hairline cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Icon */}
        <div className="flex items-center space-x-2 md:hidden">
          <LanguageSwitcher currentLanguage={lang} onLanguageChange={handleLangChange} />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-ink-navy/80 hover:text-ink-navy p-1 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-2xl animate-fade-in" id="mobile-drawer">
          <div className="space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-ink-navy/80 hover:text-warm-turmeric">{t.home}</Link>
            <button
              type="button"
              onClick={() => goToHomeSection('search-anchor')}
              className="block w-full text-left py-2 text-sm font-semibold text-ink-navy/80 hover:text-warm-turmeric"
            >
              {copy.findDoctors}
            </button>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-ink-navy/80 hover:text-warm-turmeric">{t.about}</Link>
            <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-ink-navy/80 hover:text-warm-turmeric">{t.support}</Link>
          </div>

          <div className="pt-3 border-t border-hairline flex items-center justify-between">
            {state.currentRole === 'guest' ? (
              <button
                onClick={() => {
                  setLoginOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-warm-turmeric text-ink-navy text-center py-2.5 text-xs font-bold rounded-full cursor-pointer shadow-lg shadow-warm-turmeric/10"
              >
                {t.login} / {t.register}
              </button>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-paper flex items-center justify-center border border-hairline">
                    <User className="w-3.5 h-3.5 text-warm-turmeric" />
                  </div>
                  <span className="text-xs font-semibold text-ink-navy">
                    {state.currentRole === 'client' ? "Kavindu" : "Dr. Ruwan"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href="/#dashboard-view"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white text-ink-navy border border-hairline px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {t.myDashboard}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {loginOpen && (
        <AuthTabs
          lang={lang}
          t={t}
          districtList={Object.keys(translations.en.districts)}
          loginError={loginError}
          onClose={() => {
            setLoginError('');
            setLoginOpen(false);
          }}
          onClientLogin={handleClientLogin}
          onRoleLogin={handleRoleLogin}
          onClientRegister={handleClientRegister}
          onPsychiatristRegister={handlePsychiatristRegister}
        />
      )}
    </header>
  );
}
