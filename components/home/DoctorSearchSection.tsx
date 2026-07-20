'use client';

import { Dispatch, SetStateAction } from 'react';
import { AlertCircle, Calendar, DollarSign, Globe, MapPin, Search } from 'lucide-react';
import { Psychiatrist } from '@/lib/store';
import { TranslationSet } from '@/lib/translations';
import DoctorCard from './DoctorCard';

interface DoctorSearchSectionProps {
  t: TranslationSet;
  searchQuery: string;
  selectedDistrict: string;
  selectedLanguage: string;
  selectedDate: string;
  maxFee: number;
  districtList: string[];
  boostedDocs: Psychiatrist[];
  regularDocs: Psychiatrist[];
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSelectedDistrict: Dispatch<SetStateAction<string>>;
  setSelectedLanguage: Dispatch<SetStateAction<string>>;
  setSelectedDate: Dispatch<SetStateAction<string>>;
  setMaxFee: Dispatch<SetStateAction<number>>;
  formatTime: (time: string) => string;
  onBook: (doctor: Psychiatrist, slot: string) => void;
}

export default function DoctorSearchSection({
  t,
  searchQuery,
  selectedDistrict,
  selectedLanguage,
  selectedDate,
  maxFee,
  districtList,
  boostedDocs,
  regularDocs,
  setSearchQuery,
  setSelectedDistrict,
  setSelectedLanguage,
  setSelectedDate,
  setMaxFee,
  formatTime,
  onBook,
}: DoctorSearchSectionProps) {
  return (
    <section className="space-y-4 pt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-hairline pb-3" id="search-anchor">
        <div className="font-sans">
          <h3 className="text-lg font-black text-ink-navy font-display">{t.searchTitle}</h3>
          <p className="text-slate-600 text-xs">Search and secure live sessions instantly below</p>
        </div>

        <div className="mt-3 md:mt-0 max-w-xs bg-white p-2 rounded-xl border border-hairline flex items-center space-x-2 text-ink-navy shadow-sm">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs outline-hidden border-none text-ink-navy focus:ring-0 placeholder-slate-500 font-medium bg-transparent"
          />
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-warm-turmeric p-4 rounded-r-xl flex items-start space-x-3 text-amber-900 border-y border-r border-hairline shadow-xs font-sans">
        <AlertCircle className="w-5 h-5 text-warm-turmeric flex-shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed text-slate-700">
          <strong>{t.emergencyDisclaimer.split(':')[0]}:</strong> {t.emergencyDisclaimer.split(':')[1]}
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-5 font-sans">
          <h3 className="font-bold text-sm text-ink-navy tracking-tight uppercase border-b border-hairline pb-2.5 font-display">
            {t.searchTitle}
          </h3>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-warm-turmeric" />
              <span>{t.filterDistrict}</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy"
            >
              <option value="">{t.allDistricts}</option>
              {districtList.map((dist) => (
                <option key={dist} value={dist}>{t.districts[dist] || dist}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-warm-turmeric" />
              <span>{t.filterLanguage}</span>
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy"
            >
              <option value="">{t.allLanguages}</option>
              <option value="Sinhala">සිංහල (Sinhala)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-warm-turmeric" />
              <span>{t.filterDate}</span>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy scheme-light"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-warm-turmeric" />
                <span>{t.filterFee}</span>
              </span>
              <span className="text-ink-navy">LKR {maxFee}</span>
            </div>
            <input
              type="range"
              min="3000"
              max="6000"
              step="500"
              value={maxFee}
              onChange={(e) => setMaxFee(parseInt(e.target.value))}
              className="w-full accent-warm-turmeric cursor-pointer"
            />
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDistrict('');
              setSelectedLanguage('');
              setSelectedDate('');
              setMaxFee(6000);
            }}
            className="w-full bg-paper hover:bg-slate-100 text-ink-navy text-[11px] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-center block border border-hairline"
          >
            Filters Clear
          </button>
        </div>

        <div className="lg:col-span-9 space-y-10 font-sans">
          {boostedDocs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-warm-turmeric text-ink-navy text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-md uppercase">
                  {t.boostedLabel}
                </span>
                <h2 className="text-lg font-extrabold text-ink-navy tracking-tight font-display">
                  {t.boostedTitle}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {boostedDocs.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    featured
                    t={t}
                    formatTime={formatTime}
                    onBook={onBook}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-ink-navy tracking-tight font-display">
              {t.boostedSub}
            </h2>

            {regularDocs.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-hairline">
                <p className="text-slate-600 text-xs sm:text-sm font-medium">No psychiatrists match your search filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regularDocs.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    t={t}
                    formatTime={formatTime}
                    onBook={onBook}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}
