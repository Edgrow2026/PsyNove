'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../lib/translations';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const activeLanguage = languages.find((lang) => lang.code === currentLanguage) || languages[2];

  return (
    <div className="relative inline-block text-left" ref={containerRef} id="lang-switcher">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white/80 hover:bg-white border border-hairline px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold text-ink-navy transition-all cursor-pointer select-none focus:outline-hidden"
        id="lang-switcher-btn"
      >
        <Globe className="w-4 h-4 text-warm-turmeric" />
        <span className="font-sans text-xs">{activeLanguage.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-ink-navy/60 transition-transform duration-300 ${isOpen ? 'rotate-180 text-warm-turmeric' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-40 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-hairline py-1.5 z-50 animate-fade-in font-sans"
          id="lang-dropdown-menu"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              id={`lang-opt-${lang.code}`}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                currentLanguage === lang.code
                  ? 'bg-warm-turmeric/15 text-ink-navy font-bold'
                  : 'text-ink-navy/80 hover:bg-paper hover:text-ink-navy'
              }`}
            >
              <span>{lang.nativeName}</span>
              {currentLanguage === lang.code && (
                <Check className="w-3.5 h-3.5 text-warm-turmeric" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
