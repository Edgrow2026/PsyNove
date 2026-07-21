'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, Check, Languages } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/translations';

export interface ClientRegisterValues {
  name: string;
  nic: string;
  phone: string;
  email: string;
  district: string;
  languages: string[];
  password: string;
}

interface ClientRegisterModalProps {
  lang: Language;
  t: TranslationSet;
  districtList: string[];
  onBackToLogin: () => void;
  onSubmit: (values: ClientRegisterValues) => Promise<string | void>;
}

const languageOptions = ['Sinhala', 'Tamil', 'English'];

export default function ClientRegisterModal({
  t,
  districtList,
  onBackToLogin,
  onSubmit,
}: ClientRegisterModalProps) {
  const [values, setValues] = useState<ClientRegisterValues>({
    name: '',
    nic: '',
    phone: '',
    email: '',
    district: 'Colombo',
    languages: ['Sinhala'],
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = <K extends keyof ClientRegisterValues>(key: K, value: ClientRegisterValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const toggleLanguage = (language: string) => {
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

    if (!values.name || !values.nic || !values.phone || !values.email || !values.password) {
      setError('Complete all required patient fields.');
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

    setIsSubmitting(true);
    try {
      const message = await onSubmit(values);
      setSuccess(message || 'Patient account created successfully.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Patient registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      <div className="rounded-lg border border-hairline bg-paper px-3 py-2.5 text-[11px] font-medium leading-relaxed text-slate-600">
        Patient registration is required before booking a consultation.
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
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-navy">Patient details</span>
          <span className="text-[10px] font-bold text-slate-500">Required</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Full name" value={values.name} onChange={(value) => updateValue('name', value)} placeholder="Kavindu Perera" />
        <Field label="NIC / Passport" value={values.nic} onChange={(value) => updateValue('nic', value)} placeholder="199428392019V" />
        <Field label="Mobile number" value={values.phone} onChange={(value) => updateValue('phone', value)} placeholder="+94 77 123 4567" />
        <Field label="Email address" type="email" value={values.email} onChange={(value) => updateValue('email', value)} placeholder="patient@psynova.lk" />

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
          label="Password"
          type="password"
          value={values.password}
          onChange={(value) => updateValue('password', value)}
          placeholder="Minimum 6 characters"
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Re-enter password"
        />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-hairline bg-white p-3.5 shadow-sm">
        <label className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">
          <Languages className="h-3.5 w-3.5 text-warm-turmeric" />
          <span>Preferred languages</span>
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
          {isSubmitting ? 'Creating account...' : 'Create patient account'}
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
