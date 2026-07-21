'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, Check, FileUp, Languages } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/translations';

export interface PsychiatristRegisterValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  slmcNumber: string;
  qualifications: string;
  specializations: string;
  languages: ('Sinhala' | 'Tamil' | 'English')[];
  district: string;
  fee: number;
  bio: string;
  slmcDocumentName: string;
}

interface PsychiatristRegisterModalProps {
  lang: Language;
  t: TranslationSet;
  districtList: string[];
  onBackToLogin: () => void;
  onSubmit: (values: PsychiatristRegisterValues) => Promise<string | void>;
}

const languageOptions: PsychiatristRegisterValues['languages'] = ['Sinhala', 'Tamil', 'English'];

export default function PsychiatristRegisterModal({
  t,
  districtList,
  onBackToLogin,
  onSubmit,
}: PsychiatristRegisterModalProps) {
  const [values, setValues] = useState<PsychiatristRegisterValues>({
    name: '',
    email: '',
    phone: '',
    password: '',
    slmcNumber: '',
    qualifications: '',
    specializations: 'Depression Counselling, Mood Regulation',
    languages: ['Sinhala'],
    district: 'Colombo',
    fee: 3500,
    bio: '',
    slmcDocumentName: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = <K extends keyof PsychiatristRegisterValues>(
    key: K,
    value: PsychiatristRegisterValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const toggleLanguage = (language: 'Sinhala' | 'Tamil' | 'English') => {
    setValues((current) => {
      const hasLanguage = current.languages.includes(language);
      const nextLanguages = hasLanguage
        ? current.languages.filter((item) => item !== language)
        : [...current.languages, language];

      return { ...current, languages: nextLanguages.length > 0 ? nextLanguages : [language] };
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!values.name || !values.email || !values.phone || !values.password || !values.slmcNumber || !values.qualifications || !values.bio) {
      setError('Complete all required doctor registration fields.');
      return;
    }

    if (values.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (values.password !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (values.fee < 1) {
      setError('Consultation fee must be greater than zero.');
      return;
    }

    setIsSubmitting(true);
    try {
      const message = await onSubmit(values);
      setSuccess(message || 'Doctor registration submitted. Admin approval is required.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Doctor registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-[11px] font-medium leading-relaxed text-amber-900">
        Doctor accounts are reviewed by admins. Public profile visibility starts only after SLMC approval.
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          {success}
        </div>
      )}

      <div className="rounded-2xl border border-hairline bg-white p-3.5 shadow-sm">
        <div className="mb-3 flex items-center justify-between border-b border-hairline pb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-navy">Doctor account</span>
          <span className="text-[10px] font-bold text-slate-500">Admin review</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Legal full name" value={values.name} onChange={(value) => updateValue('name', value)} placeholder="Dr. Priyantha Jayasuriya" />
        <Field label="Email address" type="email" value={values.email} onChange={(value) => updateValue('email', value)} placeholder="doctor@psynova.lk" />
        <Field label="Mobile number" value={values.phone} onChange={(value) => updateValue('phone', value)} placeholder="+94 77 123 4567" />
        <Field label="Password" type="password" value={values.password} onChange={(value) => updateValue('password', value)} placeholder="Minimum 6 characters" />
        <Field label="Confirm password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Re-enter password" />
        <Field label="SLMC number" value={values.slmcNumber} onChange={(value) => updateValue('slmcNumber', value)} placeholder="SLMC-PSY-XXXXX" />
        <Field label="Qualifications" value={values.qualifications} onChange={(value) => updateValue('qualifications', value)} placeholder="MBBS, MD Psychiatry" />
        <Field label="Specializations" value={values.specializations} onChange={(value) => updateValue('specializations', value)} placeholder="Anxiety, depression, trauma" />

        <div className="space-y-1">
          <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">District</label>
          <select
            value={values.district}
            onChange={(event) => updateValue('district', event.target.value)}
            className="h-11 w-full rounded-xl border border-hairline bg-paper px-3 text-xs font-bold text-ink-navy outline-hidden focus:ring-1 focus:ring-warm-turmeric"
          >
            {districtList.map((district) => (
              <option key={district} value={district}>
                {t.districts[district] || district}
              </option>
            ))}
          </select>
        </div>

        <Field
          label="Fee per session (LKR)"
          type="number"
          value={String(values.fee)}
          onChange={(value) => updateValue('fee', Number(value))}
          placeholder="3500"
        />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-hairline bg-white p-3.5 shadow-sm">
        <label className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">
          <Languages className="h-3.5 w-3.5 text-warm-turmeric" />
          <span>Consultation languages</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {languageOptions.map((language) => {
            const checked = values.languages.includes(language);

            return (
              <button
                key={language}
                type="button"
                onClick={() => toggleLanguage(language)}
                className={`flex min-h-10 items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-bold transition-all ${
                  checked
                    ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                    : 'border-hairline bg-white text-slate-600'
                }`}
              >
                {checked && <Check className="h-3 w-3" />}
                <span>{language}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5 rounded-2xl border border-hairline bg-white p-3.5 shadow-sm">
        <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">Bio summary</label>
        <textarea
          rows={4}
          value={values.bio}
          onChange={(event) => updateValue('bio', event.target.value)}
          placeholder="Provide a short clinical bio for patient profile view."
          className="w-full rounded-xl border border-hairline bg-paper p-3 text-xs font-semibold leading-relaxed text-ink-navy outline-hidden placeholder:text-slate-400 focus:ring-1 focus:ring-warm-turmeric"
        />
      </div>

      <div className="space-y-1.5 rounded-2xl border border-hairline bg-white p-3.5 shadow-sm">
        <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">SLMC proof upload</label>
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-hairline bg-paper p-3 text-xs font-semibold text-slate-600 hover:border-warm-turmeric">
          <span className="flex items-center gap-2">
            <FileUp className="h-4 w-4 text-warm-turmeric" />
            <span>{values.slmcDocumentName || 'Choose PDF/image proof'}</span>
          </span>
          <span className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-ink-navy">Browse</span>
          <input
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              updateValue('slmcDocumentName', file?.name || '');
            }}
          />
        </label>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-hairline pt-4 sm:flex-row">
        <button
          type="button"
          onClick={onBackToLogin}
          className="flex-1 rounded-xl border border-hairline bg-white py-3 text-xs font-bold text-ink-navy hover:border-warm-turmeric"
        >
          Back to login
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-xl bg-warm-turmeric py-3 text-xs font-extrabold text-ink-navy shadow-xs hover:bg-warm-turmeric/90 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for approval'}
        </button>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({ label, value, onChange, placeholder, type = 'text' }: FieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-extrabold uppercase tracking-wide text-slate-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-hairline bg-paper px-3 text-xs font-bold text-ink-navy outline-hidden placeholder:text-slate-400 focus:ring-1 focus:ring-warm-turmeric"
      />
    </div>
  );
}
