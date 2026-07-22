'use client';

import { FormEvent, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Lock, Mail, Phone, ShieldCheck, Stethoscope, UserRound } from 'lucide-react';
import { Language } from '@/lib/translations';

export type LoginRole = 'client' | 'psychiatrist' | 'admin' | 'superadmin';

interface LoginModalProps {
  lang: Language;
  activeRole: LoginRole;
  error: string;
  onRoleChange: (role: LoginRole) => void;
  onClientLogin: (phone: string, password: string) => Promise<boolean>;
  onRoleLogin: (role: Exclude<LoginRole, 'client'>, identifier: string, password: string) => Promise<void>;
  onShowClientRegister: () => void;
  onShowPsychiatristRegister: () => void;
}

const roleMeta: Record<LoginRole, { label: string; helper: string; icon: typeof UserRound }> = {
  client: {
    label: 'Patient',
    helper: 'Email or mobile and password',
    icon: UserRound,
  },
  psychiatrist: {
    label: 'Doctor',
    helper: 'Email or mobile after approval',
    icon: Stethoscope,
  },
  admin: {
    label: 'Admin',
    helper: 'Internal operator access',
    icon: ShieldCheck,
  },
  superadmin: {
    label: 'Super Admin',
    helper: 'Platform owner access',
    icon: Lock,
  },
};

export default function LoginModal({
  activeRole,
  error,
  onRoleChange,
  onClientLogin,
  onRoleLogin,
  onShowClientRegister,
  onShowPsychiatristRegister,
}: LoginModalProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selected = roleMeta[activeRole];
  const IdentifierIcon = activeRole === 'client' ? UserRound : Mail;

  const statusMessage = useMemo(() => {
    if (activeRole === 'psychiatrist') {
      return 'Doctor accounts may show pending approval until SLMC verification is completed.';
    }
    if (activeRole === 'admin' || activeRole === 'superadmin') {
      return 'No public registration. Accounts are created by the platform owner.';
    }
    return 'New patients can register from the booking flow or the link below.';
  }, [activeRole]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLocalError('');

    if (!identifier.trim() || !password.trim()) {
      setLocalError('Enter both login fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeRole === 'client') {
        const ok = await onClientLogin(identifier.trim(), password);
        if (!ok) setLocalError('Invalid mobile/password or suspended account.');
        return;
      }

      await onRoleLogin(activeRole, identifier.trim(), password);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(Object.keys(roleMeta) as LoginRole[]).map((role) => {
          const meta = roleMeta[role];
          const Icon = meta.icon;
          const isActive = activeRole === role;

          return (
            <button
              key={role}
              type="button"
              onClick={() => {
                onRoleChange(role);
                setLocalError('');
                setIdentifier('');
                setPassword('');
              }}
              className={`min-h-16 rounded-xl border p-2.5 text-left transition-all ${
                isActive
                  ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                  : 'border-hairline bg-white text-slate-600 hover:border-warm-turmeric'
              }`}
            >
              <Icon className="mb-1.5 h-4 w-4 text-warm-turmeric" />
              <span className="block text-[11px] font-extrabold">{meta.label}</span>
              <span className="block text-[9px] font-medium leading-tight text-slate-500">{meta.helper}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-hairline bg-paper px-3 py-2.5 text-[11px] font-medium leading-relaxed text-slate-600">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-warm-turmeric" />
          <span>{statusMessage}</span>
        </div>
      </div>

      {(error || localError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-hairline bg-white p-3.5 space-y-3.5 shadow-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">
            {activeRole === 'client' ? 'Email or mobile number' : 'Email or username'}
          </label>
          <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-paper px-3">
            <IdentifierIcon className="h-4 w-4 flex-shrink-0 text-warm-turmeric" />
            <input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className="w-full bg-transparent text-xs font-bold text-ink-navy outline-hidden"
              placeholder={activeRole === 'client' ? 'patient@email.com or +94771234567' : 'account@psynova.lk'}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">Password</label>
          <div className="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-paper px-3">
            <Lock className="h-4 w-4 flex-shrink-0 text-warm-turmeric" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full bg-transparent text-xs font-bold text-ink-navy outline-hidden"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-warm-turmeric py-3 text-xs font-extrabold text-ink-navy shadow-xs transition-all hover:bg-warm-turmeric/90 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : `Sign in as ${selected.label}`}
        </button>
      </form>

      <div className="grid grid-cols-1 gap-2 border-t border-hairline pt-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={onShowClientRegister}
          className="rounded-xl border border-hairline bg-white px-3 py-3 text-xs font-bold text-ink-navy hover:border-warm-turmeric"
        >
          Create patient account
        </button>
        <button
          type="button"
          onClick={onShowPsychiatristRegister}
          className="rounded-xl border border-hairline bg-white px-3 py-3 text-xs font-bold text-ink-navy hover:border-warm-turmeric"
        >
          Register as doctor
        </button>
      </div>
    </div>
  );
}
