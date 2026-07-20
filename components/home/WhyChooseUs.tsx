import { ShieldAlert, UserCheck, Video } from 'lucide-react';

export default function WhyChooseUs() {
  return (
    <section className="space-y-8 border-b border-hairline pb-12" id="why-choose-section">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-warm-turmeric text-xs font-bold uppercase tracking-wider block">Why Choose Us</span>
          <h3 className="text-3xl font-light text-ink-navy tracking-tight font-display">
            Getting You <span className="bg-warm-turmeric text-ink-navy px-3 py-0.5 rounded-2xl mx-1 font-bold inline-block select-none">Back</span> In Shape
          </h3>
        </div>
        <p className="text-xs text-slate-600 max-w-sm font-normal leading-relaxed font-sans">
          Empathetic clinical consultations tailored perfectly around your personal timeline, language requirements and local privacy needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <UserCheck className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">Personalized Care</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Custom clinical reports, medicine instructions and diagnostic reviews created by leading medical specialists.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <Video className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">Free Sandbox Tools</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Explore simulated billing checkouts, view mock SMS dispatches, and trigger instant tele-health rooms.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
          <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
            <ShieldAlert className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h4 className="font-bold text-base text-ink-navy font-display">24/7 Good Service</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our Sri Lankan compliance desk is online to assist with scheduling, refund requests and administrative security audits.
          </p>
        </div>
      </div>
    </section>
  );
}
