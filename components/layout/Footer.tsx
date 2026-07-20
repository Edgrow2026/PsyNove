import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white text-ink-navy mt-12 py-10 border-t border-hairline font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-slate-600">
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">PsyNova Sri Lanka</h4>
          <p className="leading-relaxed">Connecting clients with verified SLMC-licensed expert psychiatrists. 100% online, secure, and multi-lingual.</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">Quick Navigations</h4>
          <div className="space-y-1">
            <Link href="/" className="block hover:text-amber-800 transition-colors">Home</Link>
            <Link href="/about" className="block hover:text-amber-800 transition-colors">About PsyNova</Link>
            <Link href="/support" className="block hover:text-amber-800 transition-colors">Support Hub</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">Legal</h4>
          <div className="space-y-1">
            <Link href="/terms" className="block hover:text-amber-800 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="block hover:text-amber-800 transition-colors">Privacy Policy</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">PDPA Compliance</h4>
          <p className="leading-relaxed font-sans">Fully compliant with the Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022. All clinical recordings are strictly barred.</p>
        </div>
      </div>
      <div className="border-t border-hairline mt-8 pt-4 text-center text-[11px] text-slate-500">
        © 2026 PsyNova. Developed and optimized for the Ministry of Health tele-psychiatry standard.
      </div>
    </footer>
  );
}
