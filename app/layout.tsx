import type { Metadata } from 'next';
import { Inter, Fraunces, Noto_Sans_Sinhala, Noto_Sans_Tamil } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const notoSansSinhala = Noto_Sans_Sinhala({
  subsets: ['sinhala'],
  weight: ['400', '700'],
  variable: '--font-sinhala',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '700'],
  variable: '--font-tamil',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PsyNova - Online Psychiatrist Consultation Platform',
  description: 'Sri Lanka’s premium, secure, and multi-lingual online psychiatry booking platform.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="si" className="scroll-smooth">
      <body
        className={`${inter.variable} ${fraunces.variable} ${notoSansSinhala.variable} ${notoSansTamil.variable} min-h-screen bg-paper text-ink-navy antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
