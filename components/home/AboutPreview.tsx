'use client';

import { Activity, HeartHandshake } from 'lucide-react';

export default function AboutPreview() {
  const scrollToSearch = () => {
    const searchSec = document.getElementById('search-anchor');
    if (searchSec) {
      searchSec.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 border-b border-hairline" id="about-us-section">
      <div className="lg:col-span-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-hairline shadow-sm space-y-3.5">
            <div className="bg-warm-turmeric/10 p-2.5 rounded-xl w-fit">
              <Activity className="w-5 h-5 text-warm-turmeric" />
            </div>
            <h4 className="font-extrabold text-sm text-ink-navy font-display">Our Vision</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Pioneering state-of-the-art mental care accessibility for every home across Sri Lanka.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-hairline shadow-sm space-y-3.5">
            <div className="bg-warm-turmeric/10 p-2.5 rounded-xl w-fit">
              <HeartHandshake className="w-5 h-5 text-warm-turmeric" />
            </div>
            <h4 className="font-extrabold text-sm text-ink-navy font-display">Our Mission</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Delivering empathetic, fully certified and secure tele-health treatments instantly.
            </p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6 text-left font-sans">
        <div className="space-y-1.5">
          <span className="text-warm-turmeric text-xs font-bold uppercase tracking-wider block">About Us</span>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-ink-navy leading-tight font-display">
            Quality Care From Quality <span className="border border-warm-turmeric/35 text-warm-turmeric bg-warm-turmeric/10 px-3 py-0.5 rounded-2xl mx-1 font-bold inline-block select-none shadow-md shadow-warm-turmeric/5">Experts</span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          At PsyNova, we gather Sri Lanka&apos;s leading licensed psychiatrists to assist you through virtual consultation sessions. From diagnostic checkups to treatment programs, our platform guarantees highly certified, discrete and supportive clinical results without high hospital costs or travel constraints.
        </p>

        <button
          onClick={scrollToSearch}
          className="bg-warm-turmeric text-ink-navy hover:bg-warm-turmeric/90 text-xs font-extrabold px-6 py-3 rounded-full flex items-center space-x-2 transition-all cursor-pointer shadow-md"
        >
          <span>Learn More</span>
          <span>→</span>
        </button>
      </div>
    </section>
  );
}
