'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SimulatorSettings from '../../components/SimulatorSettings';
import PwaRegister from '../../components/PwaRegister';
import { store, AppState } from '../../lib/store';
import { translations } from '../../lib/translations';
import { ShieldCheck, Heart, Award, Users, CheckCircle, Brain } from 'lucide-react';

export default function AboutPage() {
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  const lang = state.currentLanguage;
  const t = translations[lang];

  // Specific copy translations for About page to avoid low-effort translations
  const aboutTexts = {
    si: {
      title: "PsyNova පිළිබඳව",
      sub: "ගුණාත්මක සහ විශ්වසනීය මනෝ චිකිත්සක සේවා ශ්‍රී ලාංකික සැමට සමීප කරවීම.",
      storyTitle: "අපගේ අරමුණ",
      storyBody: "මනෝ සෞඛ්‍ය උපදේශන සේවාවන් සඳහා පවතින දුෂ්කරතා මඟහැර ලියාපදිංචි සහතිකලත් විශේෂඥ වෛද්‍යවරුන් පහසුවෙන් සම්බන්ධ කරගැනීම සඳහා PsyNova බිහිවිය. ශ්‍රී ලංකාව පුරා වෙසෙන රෝගීන්ට තම නිවසේ සිටම, පෞද්ගලිකත්වය උපරිමයෙන් සුරකිමින්, සෘජු වීඩියෝ උපදේශන සැසිවාර වෙන්කරවා ගැනීමේ පහසුකම අප සපයන්නෙමු.",
      valueTitle: "අපගේ මූලික අගයන්",
      val1Title: "SLMC දැඩි අධීක්ෂණය",
      val1Desc: "ලියාපදිංචි වන සෑම වෛද්‍යවරයෙකුගේම ශ්‍රී ලංකා වෛද්‍ය සභාවේ (SLMC) අක්තපත්‍ර පරිපාලක මණ්ඩලය විසින් දැඩි ලෙස සත්‍යාපනය කරනු ලැබේ.",
      val2Title: "රහස්‍යභාවය සුරැකීම",
      val2Desc: "ඔබේ වෛද්‍ය උපදේශන සහ තොරතුරු ලැයිස්තුගත කිරීම් උසස් රහස්‍යතා සංකේතන ක්‍රම මඟින් ආරක්ෂා කර ඇත.",
      val3Title: "සහනදායී සේවාව",
      val3Desc: "අනවශ්‍ය ප්‍රවාහන හෝ රෝහල් අමතර ගාස්තු නොමැතිව, සෘජු සාධාරණ වෛද්‍ය උපදේශන ගාස්තු පමණක් ගෙවීමට පහසුකම.",
      val4Title: "සෑම මොහොතකම සහාය",
      val4Desc: "ඕනෑම තාක්ෂණික හෝ වෛද්‍ය ගැටලුවක් සඳහා සහාය වීමට කැපවූ දේශීය පාරිභෝගික සේවා කණ්ඩායම.",
      missionBadge: "PsyNova මෙහෙවර",
      verifiedTitle: "100% සත්‍යාපිතයි",
      verifiedSub: "ශ්‍රී ලංකා වෛද්‍ය නියාමන ප්‍රමිතීන්ට සම්පූර්ණ අනුකූලයි",
      valuesSub: "අපගේ සේවා ක්‍රියාවලිය සෞඛ්‍ය අඛණ්ඩතාව සහ තාක්ෂණික විශිෂ්ටත්වය මත පදනම් වේ.",
      copyright: "© 2026 PsyNova ශ්‍රී ලංකා වේදිකාව. සියලු හිමිකම් ඇවිරිණි."
    },
    ta: {
      title: "PsyNova பற்றி",
      sub: "தரமான மற்றும் பாதுகாப்பான மனநல சேவைகளை இலங்கையர்களுக்கு கொண்டு சேர்த்தல்.",
      storyTitle: "எங்கள் நோக்கம்",
      storyBody: "மனநல ஆலோசனை சேவைகளைப் பெறுவதில் உள்ள சிரமங்களைக் குறைத்து, உரிமம் பெற்ற தகுதிவாய்ந்த சிறப்பு மருத்துவர்களை எளிதாக அணுகுவதற்கு PsyNova தளம் உருவாக்கப்பட்டுள்ளது. இலங்கையில் உள்ள அனைவரும் தங்கள் வீடுகளில் இருந்தே, முழுமையான ரகசியத்தன்மையுடன், பாதுகாப்பான வீடியோ மூலம் ஆலோசனைகளைப் பெற்றுக்கொள்ள வழிவகை செய்கிறோம்.",
      valueTitle: "எங்கள் முக்கிய மதிப்புகள்",
      val1Title: "கடுமையான SLMC சரிபார்ப்பு",
      val1Desc: "பதிவுசெய்யும் ஒவ்வொரு மனநல மருத்துவரும் இலங்கை மருத்துவக் கவுன்சில் (SLMC) மூலம் முழுமையாகத் தகுதிபெற்றவரா என எங்கள் குழுவால் நேரடியாகச் சரிபார்க்கப்படுகிறது.",
      val2Title: "ரகசியத்தன்மை பாதுகாப்பு",
      val2Desc: "உங்களின் மருத்துவ ஆலோசனைகள் மற்றும் தனிப்பட்ட தரவுகள் அதிநவீன குறியாக்க முறைகள் (Encryption) மூலம் முழுமையாகப் பாதுகாக்கப்படுகின்றன.",
      val3Title: "மலிவு விலை சேவை",
      val3Desc: "தேவையற்ற பயணக் கட்டணங்கள் அல்லது கூடுதல் மருத்துவமனை கட்டணங்களின்றி, நியாயமான ஆலோசனைக் கட்டணங்களை மட்டுமே செலுத்துங்கள்.",
      val4Title: "எந்நேரமும் ஆதரவு",
      val4Desc: "எந்தவொரு தொழில்நுட்ப அல்லது ஆலோசனைத் தேவைகளுக்கும் உதவ எங்கள் பிரத்யேக வாடிக்கையாளர் ஆதரவுக் குழு எப்போதும் தயாராக உள்ளது.",
      missionBadge: "PsyNova பணி",
      verifiedTitle: "100% சரிபார்க்கப்பட்டது",
      verifiedSub: "இலங்கை மருத்துவ விதிமுறைகளுக்கு முழுமையாக இணக்கம்",
      valuesSub: "எங்கள் செயற்பாட்டு நடைமுறை சுகாதார நேர்மை மற்றும் தொழில்நுட்பத் திறனில் அமைந்துள்ளது.",
      copyright: "© 2026 PsyNova இலங்கை தளம். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை."
    },
    en: {
      title: "About PsyNova",
      sub: "Democratizing access to certified and empathetic mental health care in Sri Lanka.",
      storyTitle: "Our Purpose",
      storyBody: "PsyNova was founded to bridge the critical gap between patients seeking mental health guidance and certified psychiatric professionals. We provide a highly secure, frictionless, and multi-lingual scheduling system that allows Sri Lankans from all 25 districts to receive live clinical support from the safety and privacy of their homes.",
      valueTitle: "Our Core Pillars",
      val1Title: "Mandatory SLMC Verification",
      val1Desc: "Every medical practitioner listed must upload valid Sri Lanka Medical Council (SLMC) credentials which undergo meticulous manual auditing before activation.",
      val2Title: "Absolute Privacy Measures",
      val2Desc: "All records, bookings, and tele-psychiatry meeting rooms are encrypted end-to-end to protect the dignity and confidentiality of our patients.",
      val3Title: "Affordable & Fair Pricing",
      val3Desc: "By optimizing digital appointments, patients pay flat doctor fees without premium hospital surcharges or logistical travel expenses.",
      val4Title: "Committed Support Team",
      val4Desc: "Our dedicated Sri Lankan support staff is online to handle any dispute, refund appeal, or booking adjustment within 24 hours.",
      missionBadge: "PsyNova Mission",
      verifiedTitle: "100% Verified Only",
      verifiedSub: "Fully compliant with Sri Lankan medical regulations",
      valuesSub: "We base our operational flow on healthcare integrity and technical excellence.",
      copyright: "© 2026 PsyNova Platform Sri Lanka. All Rights Reserved."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans" id="about-page-root">
      <PwaRegister />
      <Navbar activeSection="about" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-paper py-16 sm:py-24 text-ink-navy border-b border-hairline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-ink-navy">{aboutTexts.title}</h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed">
            {aboutTexts.sub}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Purpose / Story Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-2xl border border-hairline shadow-2xl">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-1.5 bg-warm-turmeric/10 text-warm-turmeric px-3 py-1 rounded-full text-xs font-semibold">
              <Brain className="w-4 h-4 text-warm-turmeric" />
              <span>{aboutTexts.missionBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-ink-navy">{aboutTexts.storyTitle}</h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {aboutTexts.storyBody}
            </p>
          </div>
          <div className="lg:col-span-5 bg-paper p-6 rounded-2xl border border-hairline flex flex-col items-center justify-center space-y-4 text-center">
            <Award className="w-16 h-16 text-warm-turmeric animate-pulse" />
            <div>
              <span className="block text-xl font-bold text-ink-navy">{aboutTexts.verifiedTitle}</span>
              <span className="text-xs text-slate-600 font-medium tracking-wide">{aboutTexts.verifiedSub}</span>
            </div>
          </div>
        </section>

        {/* Pillars / Values */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-light text-ink-navy tracking-tight">{aboutTexts.valueTitle}</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
              {aboutTexts.valuesSub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Value 1 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline hover:shadow-lg hover:border-warm-turmeric/40 transition-all duration-300 space-y-3.5">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <ShieldCheck className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h3 className="font-bold text-base text-ink-navy">{aboutTexts.val1Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{aboutTexts.val1Desc}</p>
            </div>

            {/* Value 2 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline hover:shadow-lg hover:border-warm-turmeric/40 transition-all duration-300 space-y-3.5">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <CheckCircle className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h3 className="font-bold text-base text-ink-navy">{aboutTexts.val2Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{aboutTexts.val2Desc}</p>
            </div>

            {/* Value 3 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline hover:shadow-lg hover:border-warm-turmeric/40 transition-all duration-300 space-y-3.5">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <Heart className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h3 className="font-bold text-base text-ink-navy">{aboutTexts.val3Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{aboutTexts.val3Desc}</p>
            </div>

            {/* Value 4 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline hover:shadow-lg hover:border-warm-turmeric/40 transition-all duration-300 space-y-3.5">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <Users className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h3 className="font-bold text-base text-ink-navy">{aboutTexts.val4Title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{aboutTexts.val4Desc}</p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-paper text-slate-600 py-8 border-t border-hairline">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs space-y-3">
          <p className="font-semibold text-red-600 max-w-3xl mx-auto">{t.emergencyDisclaimer}</p>
          <p>{aboutTexts.copyright}</p>
        </div>
      </footer>

      {/* Simulator Controller Panel */}
      <SimulatorSettings />
    </div>
  );
}
