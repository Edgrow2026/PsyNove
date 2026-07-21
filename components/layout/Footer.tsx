import Link from 'next/link';
import { Language, translations } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];
  const copy = uiCopy[lang];

  return (
    <footer className="bg-white text-ink-navy mt-12 py-10 border-t border-hairline font-normal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-slate-600">
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">PsyNova Sri Lanka</h4>
          <p className="leading-relaxed">{copy.footerAbout}</p>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">{copy.quickNav}</h4>
          <div className="space-y-1">
            <Link href="/" className="block hover:text-amber-800 transition-colors">{t.home}</Link>
            <Link href="/about" className="block hover:text-amber-800 transition-colors">{t.about}</Link>
            <Link href="/support" className="block hover:text-amber-800 transition-colors">{t.support}</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">{copy.legal}</h4>
          <div className="space-y-1">
            <Link href="/terms" className="block hover:text-amber-800 transition-colors">{t.terms}</Link>
            <Link href="/privacy" className="block hover:text-amber-800 transition-colors">{t.privacy}</Link>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">{copy.pdpaCompliance}</h4>
          <p className="leading-relaxed font-sans">{copy.pdpaText}</p>
        </div>
      </div>
      <div className="border-t border-hairline mt-8 pt-4 text-center text-[11px] text-slate-500">
        {copy.footerCopyright}
      </div>
    </footer>
  );
}
