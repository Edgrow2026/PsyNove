'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { TranslationSet } from '@/lib/translations';

interface HeroSectionProps {
  t: TranslationSet;
}

export default function HeroSection({ t }: HeroSectionProps) {
  const scrollToSearch = () => {
    const searchSec = document.getElementById('search-anchor');
    if (searchSec) {
      searchSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-paper py-20 sm:py-28 text-ink-navy border-b border-hairline">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.08),rgba(255,255,255,0))]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-2">
              <span className="text-warm-turmeric text-xs sm:text-sm font-bold tracking-widest uppercase block">
                Welcome To PsyNova
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ink-navy leading-[1.1] max-w-2xl font-display">
                The <span className="bg-warm-turmeric text-ink-navy px-4 py-1 rounded-2xl mx-1 font-black inline-block leading-none select-none shadow-md shadow-warm-turmeric/10">Healthy</span> Mind Is A Wealthy Soul
              </h1>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-hairline shadow-md shadow-ink-navy/5 space-y-2 max-w-xl">
              <div className="w-full h-12 relative overflow-hidden select-none" id="calming-shoreline">
                <svg className="w-full h-full" viewBox="0 0 800 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M 10 25 L 20 10 L 35 40 L 50 12 L 65 38 L 80 15 L 95 35 L 110 20 L 125 30 L 140 22 L 155 28 Q 180 38, 205 25 T 265 25 T 325 25 T 385 25 T 445 25 T 505 25 T 565 25 T 625 25 T 685 25 T 745 25 T 790 25"
                    stroke="url(#shoreline-grad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="shoreline-grad" x1="0%" y1="0%" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F2D5D5" />
                      <stop offset="30%" stopColor="#8DAA9D" />
                      <stop offset="70%" stopColor="#ECC09B" />
                      <stop offset="100%" stopColor="#ECC09B" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] text-red-600 uppercase tracking-widest font-mono font-bold">
                  high stress (ලැදියාව)
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-amber-800 uppercase tracking-widest font-mono font-bold">
                  calming shoreline (සන්සුන් වෙරළ)
                </div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-600 font-sans">
                <span>Sri Lanka Calming Shoreline Metaphor</span>
                <span className="font-mono text-emerald-750">Transitioning anxiety into absolute peace</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-xl font-sans">
              {t.heroSub}
            </p>

            <div className="flex items-center space-x-4 pt-2 font-sans">
              <button
                onClick={scrollToSearch}
                className="bg-warm-turmeric text-ink-navy hover:bg-warm-turmeric/90 text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-full flex items-center space-x-2.5 shadow-xl shadow-warm-turmeric/15 transition-all cursor-pointer group"
              >
                <span>Let&apos;s Get Started</span>
                <span className="text-base font-bold transition-transform group-hover:translate-x-1">→</span>
              </button>

              <button
                onClick={scrollToSearch}
                className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center text-ink-navy hover:bg-paper hover:border-ink-navy/40 transition-all cursor-pointer shadow-md"
                title="Watch Intro Video"
              >
                <span className="text-xs ml-0.5">▶</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="aspect-4/3 w-full bg-white rounded-3xl overflow-hidden border border-hairline shadow-xl relative">
              <Image
                src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=800"
                alt="Psychotherapy Session"
                fill
                className="object-cover opacity-85 select-none"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            </div>

            <div className="absolute -top-5 -right-4 bg-white border border-hairline rounded-2xl p-3 flex items-center space-x-3 shadow-xl max-w-[220px]">
              <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-warm-turmeric/30 flex-shrink-0 relative">
                <Image
                  src="https://picsum.photos/seed/doctor-ruwan/100/100"
                  alt="Dr. Ruwan"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 font-sans">
                <span className="block text-[11px] font-bold text-ink-navy truncate">Dr. Ruwan Fernando</span>
                <span className="block text-[9px] text-[#9E642A] font-medium truncate">Chief Psychiatrist / Founder</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-4 bg-white border border-hairline rounded-2xl p-3.5 shadow-xl flex flex-col space-y-1.5 max-w-[195px] font-sans">
              <div className="flex items-center space-x-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <span className="block text-xs font-black text-ink-navy leading-tight">1000+ Happy Souls</span>
                <span className="block text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Active Patient Base</span>
              </div>
              <div className="flex -space-x-1.5 pt-1 overflow-hidden">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="relative h-5.5 w-5.5 rounded-full ring-2 ring-white overflow-hidden inline-block">
                    <Image
                      src={`https://picsum.photos/seed/patient-avatar-${id}/60/60`}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
                <div className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-warm-turmeric text-ink-navy font-black text-[9px] ring-2 ring-white">
                  +
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-12 mt-12 grid grid-cols-3 gap-4 max-w-5xl mx-auto font-sans">
          <div className="text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-ink-navy tracking-tight font-display">25+</span>
            <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Years Experience</span>
          </div>
          <div className="text-center space-y-1 border-x border-hairline">
            <span className="block text-3xl sm:text-4xl font-extrabold text-ink-navy tracking-tight font-display">7.8K+</span>
            <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Active Members</span>
          </div>
          <div className="text-center space-y-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-amber-800 tracking-tight font-display">99%</span>
            <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Satisfied Client</span>
          </div>
        </div>

        <div className="pt-10 border-t border-hairline space-y-5 max-w-5xl mx-auto font-sans">
          <span className="block text-center text-xs text-slate-600 font-bold tracking-widest uppercase">
            Trusted By 100,245+ PsyNova Patients Across Sri Lanka
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-30 hover:opacity-45 transition-opacity duration-300 select-none">
            {['logo-1', 'logo-2', 'logo-3', 'logo-4', 'logo-5'].map((logo, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 font-mono text-[10px] sm:text-xs tracking-widest text-slate-600 font-black">
                <div className="w-2.5 h-2.5 bg-slate-500 rounded-xs rotate-45" />
                <span>logoipsum</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
