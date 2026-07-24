import { ShieldAlert, UserCheck, Video } from 'lucide-react';
import { Language } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

interface WhyChooseUsProps {
  lang: Language;
}

export default function WhyChooseUs({ lang }: WhyChooseUsProps) {
  const copy = uiCopy[lang];

  return (
    <section className="space-y-8 border-b border-hairline pb-12" id="why-choose-section">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-warm-turmeric text-xs font-bold uppercase tracking-wider block">{copy.whyChooseUs}</span>
          <h3 className="text-3xl font-light text-ink-navy tracking-tight font-display">
            {copy.gettingYouPrefix} <span className="bg-warm-turmeric text-ink-navy px-3 py-0.5 rounded-2xl mx-1 font-bold inline-block select-none">{copy.gettingYouHighlight}</span> {copy.gettingYouSuffix}
          </h3>
        </div>
        <p className="text-xs text-slate-600 max-w-sm font-normal leading-relaxed font-sans">
          {copy.whyChooseText}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <UserCheck className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">{copy.personalizedCare}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {copy.personalizedCareText}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <Video className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">{copy.telehealthRooms}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {copy.telehealthRoomsText}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <ShieldAlert className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">{copy.goodService}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {copy.goodServiceText}
          </p>
        </div>
      </div>
    </section>
  );
}
