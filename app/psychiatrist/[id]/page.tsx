'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Globe, MapPin, ShieldCheck, UserCheck } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import PwaRegister from '../../../components/PwaRegister';
import SimulatorSettings from '../../../components/SimulatorSettings';
import { store, AppState } from '../../../lib/store';
import { translations } from '../../../lib/translations';
import { uiCopy } from '../../../lib/ui-copy';

export default function PsychiatristProfilePage() {
  const params = useParams<{ id: string }>();
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => setState({ ...store.getState() }));
    return unsub;
  }, []);

  const t = translations[state.currentLanguage];
  const copy = uiCopy[state.currentLanguage];
  const doctor = state.psychiatrists.find((doc) => doc.id === params.id);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-paper text-ink-navy font-sans">
        <PwaRegister />
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
          <h1 className="text-3xl font-display font-bold">{copy.profileNotFound}</h1>
          <Link href="/" className="text-amber-800 font-bold hover:underline">{copy.backToSearch}</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans">
      <PwaRegister />
      <Navbar />

      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Link href="/#search-anchor" className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-ink-navy">
          <ArrowLeft className="w-4 h-4" />
          <span>{copy.backToSpecialists}</span>
        </Link>

        <section className="bg-white border border-hairline rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-4 bg-paper p-6 flex flex-col items-center justify-center text-center space-y-4 border-b lg:border-b-0 lg:border-r border-hairline">
              <div className="relative w-40 h-40 rounded-3xl overflow-hidden border border-hairline bg-white shadow-sm">
                <Image src={doctor.photo} alt={doctor.name} width={160} height={160} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-ink-navy">{doctor.name}</h1>
                <p className="text-xs text-slate-600 mt-1">{doctor.qualifications}</p>
              </div>
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${
                doctor.slmcVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <UserCheck className="w-3.5 h-3.5" />
                <span>{doctor.slmcVerified ? t.slmcVerified : t.slmcPending}</span>
              </span>
            </div>

            <div className="lg:col-span-8 p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-paper border border-hairline rounded-xl p-3">
                  <MapPin className="w-4 h-4 text-warm-turmeric mb-1" />
                  <span className="block text-slate-500 font-bold uppercase text-[10px]">{t.filterDistrict}</span>
                  <span className="font-bold">{t.districts[doctor.district] || doctor.district}</span>
                </div>
                <div className="bg-paper border border-hairline rounded-xl p-3">
                  <Globe className="w-4 h-4 text-warm-turmeric mb-1" />
                  <span className="block text-slate-500 font-bold uppercase text-[10px]">{t.consultationLanguage}</span>
                  <span className="font-bold">{doctor.languages.join(' / ')}</span>
                </div>
                <div className="bg-paper border border-hairline rounded-xl p-3">
                  <ShieldCheck className="w-4 h-4 text-warm-turmeric mb-1" />
                  <span className="block text-slate-500 font-bold uppercase text-[10px]">{t.hourlyFee}</span>
                  <span className="font-bold">LKR {doctor.fee}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold font-display">{t.profile}</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{doctor.bio}</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold font-display">{t.specializations}</h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.specializations.map((item) => (
                    <span key={item} className="bg-warm-turmeric/15 text-ink-navy border border-warm-turmeric/30 px-3 py-1.5 rounded-full text-xs font-bold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold font-display flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-warm-turmeric" />
                  <span>{t.availableSlots}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">{copy.noSlots}</span>
                  ) : (
                    doctor.availableSlots.map((slot) => (
                      <Link
                        key={slot}
                        href="/#search-anchor"
                        className="bg-white border border-hairline hover:border-warm-turmeric hover:bg-warm-turmeric px-3 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                        {slot.replace('T', ' | ')}
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SimulatorSettings />
    </div>
  );
}
