'use client';

import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShieldCheck, X } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/translations';
import ClientRegisterModal, { ClientRegisterValues } from './ClientRegisterModal';
import LoginModal, { LoginRole } from './LoginModal';
import PsychiatristRegisterModal, { PsychiatristRegisterValues } from './PsychiatristRegisterModal';

type AuthView = 'login' | 'client-register' | 'psychiatrist-register';

interface AuthTabsProps {
  lang: Language;
  t: TranslationSet;
  districtList: string[];
  loginError: string;
  onClose: () => void;
  onClientLogin: (phone: string, password: string) => Promise<boolean>;
  onRoleLogin: (role: Exclude<LoginRole, 'client'>, identifier: string, password: string) => Promise<void>;
  onClientRegister: (values: ClientRegisterValues) => Promise<string | void>;
  onPsychiatristRegister: (values: PsychiatristRegisterValues) => Promise<string | void>;
}

export default function AuthTabs({
  lang,
  t,
  districtList,
  loginError,
  onClose,
  onClientLogin,
  onRoleLogin,
  onClientRegister,
  onPsychiatristRegister,
}: AuthTabsProps) {
  const [view, setView] = useState<AuthView>('login');
  const [activeRole, setActiveRole] = useState<LoginRole>('client');

  const modalTitle = useMemo(() => {
    if (view === 'client-register') return 'Create patient account';
    if (view === 'psychiatrist-register') return 'Psychiatrist registration';
    return 'Sign in to PsyNova';
  }, [view]);

  const modalDescription = useMemo(() => {
    if (view === 'client-register') return 'Patient accounts can book and manage online consultations.';
    if (view === 'psychiatrist-register') return 'Doctor profiles require admin approval before going live.';
    return 'Choose the correct account type before signing in.';
  }, [view]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 font-sans backdrop-blur-sm sm:p-6"
    >
      <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl border border-hairline bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)] sm:max-w-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-hairline bg-paper px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-warm-turmeric/40 bg-warm-turmeric/15 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-ink-navy">
              <ShieldCheck className="h-3.5 w-3.5 text-warm-turmeric" />
              <span>Secure account access</span>
            </div>
            <h2 className="text-base font-black leading-tight text-ink-navy sm:text-lg">
              {modalTitle}
            </h2>
            <p className="mt-1 max-w-xl text-[11px] font-medium leading-relaxed text-slate-600">
              {modalDescription}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-hairline bg-white text-slate-600 transition-colors hover:border-warm-turmeric hover:text-ink-navy"
            aria-label="Close authentication dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-4 text-xs sm:px-5 sm:py-5">
          {view === 'login' && (
            <LoginModal
              lang={lang}
              activeRole={activeRole}
              error={loginError}
              onRoleChange={setActiveRole}
              onClientLogin={onClientLogin}
              onRoleLogin={onRoleLogin}
              onShowClientRegister={() => setView('client-register')}
              onShowPsychiatristRegister={() => setView('psychiatrist-register')}
            />
          )}

          {view === 'client-register' && (
            <ClientRegisterModal
              lang={lang}
              t={t}
              districtList={districtList}
              onBackToLogin={() => setView('login')}
              onSubmit={onClientRegister}
            />
          )}

          {view === 'psychiatrist-register' && (
            <PsychiatristRegisterModal
              lang={lang}
              t={t}
              districtList={districtList}
              onBackToLogin={() => setView('login')}
              onSubmit={onPsychiatristRegister}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
