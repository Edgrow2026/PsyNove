'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Globe, MapPin, UserCheck } from 'lucide-react';
import { Psychiatrist } from '@/lib/store';
import { Language, TranslationSet } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

interface DoctorCardProps {
  doctor: Psychiatrist;
  featured?: boolean;
  t: TranslationSet;
  lang: Language;
  formatTime: (time: string) => string;
  onBook: (doctor: Psychiatrist, slot: string) => void;
}

export default function DoctorCard({ doctor, featured = false, t, lang, formatTime, onBook }: DoctorCardProps) {
  const copy = uiCopy[lang];

  return (
    <div
      className={`bg-white ${featured ? 'border-2 border-warm-turmeric' : 'border border-hairline'} rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
      id={`doc-card-${doctor.id}`}
    >
      <div className="p-5 flex space-x-4 items-start">
        <div className={`${featured ? 'w-20 h-20' : 'w-16 h-16 sm:w-20 sm:h-20'} rounded-2xl overflow-hidden bg-paper flex-shrink-0 relative`}>
          <Image
            src={doctor.photo}
            alt={doctor.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <h4 className="font-bold text-ink-navy text-sm sm:text-base truncate leading-tight font-display">{doctor.name}</h4>
            <div className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 border ${
              doctor.slmcVerified
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <UserCheck className="w-2.5 h-2.5" />
              <span>{doctor.slmcVerified ? copy.slmcOk : copy.slmcPendingShort}</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 font-medium truncate">{doctor.qualifications}</p>
          <Link
            href={`/psychiatrist/${doctor.id}`}
            className="inline-flex text-[10px] font-bold text-amber-800 hover:text-ink-navy hover:underline"
          >
            {t.viewProfile}
          </Link>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
              <MapPin className="w-3 h-3 text-warm-turmeric" />
              <span>{t.districts[doctor.district] || doctor.district}</span>
            </span>
            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
              <Globe className="w-3 h-3 text-warm-turmeric" />
              <span>{doctor.languages.join(' / ')}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-paper border-t border-hairline p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-medium">{t.hourlyFee}</span>
          <span className="font-bold text-amber-800">LKR {doctor.fee}</span>
        </div>

        <div className="space-y-1.5">
          <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">{t.availableSlots}</span>
          {doctor.availableSlots.length === 0 ? (
            <span className="block text-slate-500 text-[11px] italic">{copy.noSlots}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {doctor.availableSlots.map((slot) => {
                const [datePart, timePart] = slot.split('T');
                const displayTime = formatTime(timePart);
                return (
                  <button
                    key={slot}
                    onClick={() => onBook(doctor, slot)}
                    className="bg-white border border-hairline text-slate-700 hover:border-warm-turmeric hover:bg-warm-turmeric hover:text-ink-navy px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                  >
                    {datePart} | {displayTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
