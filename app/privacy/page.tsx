'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SimulatorSettings from '../../components/SimulatorSettings';
import PwaRegister from '../../components/PwaRegister';
import { store, AppState } from '../../lib/store';
import { translations } from '../../lib/translations';
import { ShieldCheck, HeartPulse, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  const lang = state.currentLanguage;
  const t = translations[lang];

  // Robust Privacy Policy texts
  const privacyTexts = {
    si: {
      title: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය (Privacy Policy)",
      sub: "ඔබගේ සංවේදී සෞඛ්‍ය සහ පුද්ගලික දත්ත සුරක්ෂිතභාවය පිළිබඳ අපගේ වගකීම.",
      sensitiveHeader: "සංවේදී දත්ත පිළිබඳ විශේෂ අවධානය (Sensitive Health Data Notice)",
      sensitiveBody: "PsyNova මනෝ වෛද්‍ය උපදේශන සේවාවන්හිදී හුවමාරු වන සායනික වාර්තා සහ වෛද්‍ය සටහන් අතිශය සංවේදී පුද්ගලික දත්ත ලෙස සලකා කටයුතු කරනු ලැබේ. මෙම දත්ත පද්ධතිය තුළ සුරක්ෂිතව සංකේතනය කර ඇති අතර (Encrypted at rest & in transit), කිසිදු තෙවන පාර්ශවයකට හෝ වෙළඳ දැන්වීම් ආයතනයකට කිසිදු හේතුවක් මත විකිණීම හෝ හෙළිදරව් කිරීම සිදු නොකෙරේ. පරිපාලන අංශයටද මෙම වෛද්‍ය සටහන් කියවීමට අවසර නොමැත.",
      introTitle: "1. හඳුන්වාදීම",
      introBody: "PsyNova පද්ධතිය භාවිතා කිරීමේදී ඔබගේ දත්ත එක්රැස් කිරීම, ගබඩා කිරීම සහ භාවිතය සිදුවන ආකාරය මෙම ප්‍රතිපත්තිය මඟින් පැහැදිලි කරයි. ශ්‍රී ලංකාවේ පෞද්ගලික දත්ත ආරක්ෂණ පනත (PDPA) ට අනුකූලව අපි කටයුතු කරන්නෙමු.",
      collectTitle: "2. අප රැස්කරන තොරතුරු",
      collectBody: "සම්පූර්ණ නම, ජාතික හැඳුනුම්පත් (NIC) හෝ විදේශ ගමන් බලපත්‍ර අංකය, ජංගම දුරකථන අංකය, විද්‍යුත් තැපෑල, දිස්ත්‍රික්කය, භාෂා මනාප, ගෙවීම් වාර්තා (PayHere ගෙවීම් ද්වාරය හරහා පමණක්, අපි කාඩ්පත් තොරතුරු ගබඩා නොකරමු) සහ වෛද්‍යවරුන් ඇතුළත් කරන සායනික සටහන්.",
      purposeTitle: "3. තොරතුරු රැස්කිරීමේ අරමුණ",
      purposeBody: "සේවාලාභී ගිණුම් නිර්මාණය, වෙන්කිරීම් සම්බන්ධීකරණය, SMS මතක්කිරීම් යැවීම, ගැටළු විසඳීම සහ වෛද්‍යවරුන්ගේ SLMC අක්තපත්‍ර නීත්‍යානුකූලව සත්‍යාපනය කිරීම.",
      sharingTitle: "4. තෙවන පාර්ශවීය හුවමාරුව",
      sharingBody: "ආරක්ෂිත ගෙවීම් සඳහා PayHere ද්වාරය සමඟද, කෙටි පණිවිඩ සන්නිවේදනය සඳහා දේශීය SMS ද්වාරය සමඟද, සහ රෙකෝඩ් නොකෙරෙන වීඩියෝ ඇමතුම් සේවා සඳහා Jitsi සේවාව සමඟද පමණක් දත්ත හුවමාරු වේ.",
      retentionTitle: "5. රඳවා තබා ගැනීම සහ දින 7ක රඳවා ගැනීම",
      retentionBody: "ගිණුමක් අක්‍රීය කිරීමේදී වෛද්‍ය වාර්තා නීතිමය සුරක්ෂිතභාවය වෙනුවෙන් අවම වශයෙන් දින 7ක පරිපාලන රඳවා ගැනීමේ කාලසීමාවකට යටත් වේ. ඉන්පසු සියලු පුද්ගලික තොරතුරු පද්ධතියෙන් ස්ථිරවම ඉවත් කෙරේ.",
      rightsTitle: "6. සේවාලාභී අයිතිවාසිකම්",
      rightsBody: "ඔබේ දත්ත පරීක්ෂා කිරීමට, වෙනස් කිරීමට, හෝ මකා දැමීමට ඉල්ලීම් ඉදිරිපත් කිරීමට ඔබට නීත්‍යානුකූල අයිතිය ඇත. ඕනෑම ගැටලුවක් support@psynova.lk හරහා අප වෙත යොමුකළ හැක."
    },
    ta: {
      title: "தனியுரிமைக் கொள்கை",
      sub: "உங்களின் மனநலம் மற்றும் தனிப்பட்ட தரவுகளின் பாதுகாப்பிற்கான எங்கள் அர்ப்பணிப்பு.",
      sensitiveHeader: "உணர்திறன் மிக்க சுகாதார தரவு அறிவிப்பு (Sensitive Health Data Notice)",
      sensitiveBody: "PsyNova ஆலோசனைகளின் போது பகிரப்படும் மருத்துவ அறிக்கைகள் மற்றும் குறிப்புகள் மிகவும் உணர்திறன் வாய்ந்த தனிப்பட்ட தரவுகளாகக் கருதப்படுகின்றன. இவை எங்கள் தரவுத்தளத்தில் குறியாக்கம் (Encryption) செய்யப்பட்டுள்ளது. எந்தவொரு விளம்பர நிறுவனங்களுக்கும் இந்த தரவுகள் விற்கப்பட மாட்டாது. உங்களின் ஆலோசனைக் குறிப்புகளைப் பார்க்க நிர்வாகப் பிரிவினருக்கு அதிகாரம் கிடையாது.",
      introTitle: "1. அறிமுகம்",
      introBody: "எங்கள் சேவைகளைப் பயன்படுத்தும்போது உங்கள் தனிப்பட்ட தரவு எவ்வாறு சேகரிக்கப்பட்டு பாதுகாக்கப்படுகிறது என்பதை இக்கொள்கை விளக்குகிறது. நாங்கள் இலங்கையின் தனிப்பட்ட தரவுப் பாதுகாப்புச் சட்டத்திற்கு (PDPA) முற்றிலும் இணங்குகிறோம்.",
      collectTitle: "2. சேகரிக்கப்படும் தரவுகள்",
      collectBody: "முழுப் பெயர், தேசிய அடையாள அட்டை (NIC) அல்லது பாஸ்போர்ட் எண், கைபேசி எண், மின்னஞ்சல், வசிக்கும் மாவட்டம், மொழி விருப்பம், கட்டண விபரங்கள் (கார்டு எண்களை நாங்கள் சேமிப்பதில்லை) மற்றும் மனநல மருத்துவர் எழுதும் ஆலோசனை அறிக்கைகள்.",
      purposeTitle: "3. தரவு சேகரிப்பின் நோக்கம்",
      purposeBody: "கணக்கை உருவாக்குதல், ஆலோசனைகளை முன்பதிவு செய்தல், உறுதிப்படுத்தல் SMS அனுப்புதல், புகார்களைத் தீர்த்தல் மற்றும் மருத்துவர்களின் SLMC தகுதிச் சான்றுகளைச் சரிபார்த்தல்.",
      sharingTitle: "4. மூன்றாம் தரப்பு பகிர்வு",
      sharingBody: "பாதுகாப்பான கட்டணங்களைச் செலுத்த PayHere தளத்துடனும், SMS அனுப்ப உள்ளூர் தொலைத்தொடர்பு வழங்குநர்களுடனும், மற்றும் பதிவுசெய்யப்படாத வீடியோக்களுக்கு Jitsi தளத்துடனும் மட்டுமே தரவு பகிரப்படும்.",
      retentionTitle: "5. தரவு தக்கவைப்பு மற்றும் 7 நாட்கள் கால அவகாசம்",
      retentionBody: "ஒரு பயனர் தனது கணக்கை முடக்கக் கோரினால், சட்ட மற்றும் பாதுகாப்பு விதிகளை மதித்து 7 நாட்களுக்கு அந்தத் தரவுகள் தற்காலிகமாக வைக்கப்படும். அதன் பின்னர் தரவுகள் முற்றிலும் நீக்கப்படும்.",
      rightsTitle: "6. பயனர் உரிமைகள்",
      rightsBody: "உங்கள் தனிப்பட்ட தரவை அணுகவும், திருத்தவும் மற்றும் முற்றிலும் நீக்கக் கோரவும் உங்களுக்கு உரிமை உண்டு. கேள்விகளுக்கு support@psynova.lk ஐத் தொடர்பு கொள்ளவும்."
    },
    en: {
      title: "Privacy & Data Policy",
      sub: "Understanding how we safeguard your sensitive psychiatric consultation records and identities.",
      sensitiveHeader: "Sensitive Personal Health Information Care (Notice)",
      sensitiveBody: "PsyNova enforces absolute safeguards over patient mental health data. Consultation notes, session prescriptions, and incident logs are treated as highly sensitive medical archives. These data structures are fully encrypted both at rest and during transmission. We maintain a non-negotiable policy prohibiting the monetization or selling of user telemetry. Administrative personnel are strictly restricted from viewing private psychiatrist clinical summaries.",
      introTitle: "1. Introduction",
      introBody: "This document describes our principles regarding the collection, transmission, storage, and legal retention of clinical and personal data. We operate under full compliance with Sri Lanka's Personal Data Protection Act (PDPA).",
      collectTitle: "2. Classifications of Data Collected",
      collectBody: "Full legal name, NIC or Passport numbers, mobile phone numbers, email addresses, residential district of Sri Lanka, preferred application languages, financial receipt histories (card numbers are processed securely by PayHere and never touch our servers), and specialized clinical session reports.",
      purposeTitle: "3. Justification & Purposes of Data Collection",
      purposeBody: "To establish valid client logs, facilitate booking sync, execute automated multi-lingual SMS notifications, resolve client-practitioner grievances, and manually verify SLMC regulatory doctor standing.",
      sharingTitle: "4. Authorized Third-Party Integrations",
      sharingBody: "Data is shared with PayHere (secured payment processing), Sri Lankan SMS Gateways (direct reminder dispatch), and Jitsi Meet (peer-to-peer encrypted clinical consultation where session content is never recorded or stored).",
      retentionTitle: "5. Dynamic Retention & The 7-Day Safety Hold",
      retentionBody: "Upon deactivation, account indexes enter a non-bypassable 7-calendar-day administrative hold to satisfy audit requirements. Following this quarantine window, all clinical profiles and communication databases are permanently purged.",
      rightsTitle: "6. User Data Rights",
      rightsBody: "You hold the statutory right to request absolute access, correction, or permanent erasure of your data records. For inquiries, reach out to support@psynova.lk."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans" id="privacy-page-root">
      <PwaRegister />
      <Navbar activeSection="privacy" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-paper py-12 text-ink-navy border-b border-hairline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <div className="mx-auto bg-white p-3 rounded-full w-fit mb-2 border border-hairline">
            <Lock className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-light tracking-tight">{privacyTexts.title}</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            {privacyTexts.sub}
          </p>
        </div>
      </section>

      {/* Policy Details */}
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Clinical Sensitive Callout Box */}
        <div className="bg-warm-turmeric/10 border-l-4 border-warm-turmeric p-5 rounded-r-2xl shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-warm-turmeric font-bold text-sm sm:text-base">
            <HeartPulse className="w-5 h-5 text-warm-turmeric" />
            <span>{privacyTexts.sensitiveHeader}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {privacyTexts.sensitiveBody}
          </p>
        </div>

        {/* Clauses list */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-hairline shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-navy flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-warm-turmeric" />
              <span>{privacyTexts.introTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.introBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{privacyTexts.collectTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.collectBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{privacyTexts.purposeTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.purposeBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy flex items-center space-x-2">
              <EyeOff className="w-4 h-4 text-warm-turmeric" />
              <span>{privacyTexts.sharingTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.sharingBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-warm-turmeric">{privacyTexts.retentionTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.retentionBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{privacyTexts.rightsTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{privacyTexts.rightsBody}</p>
          </div>

          <div className="space-y-3 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">7. Security, Minors, Cookies, Updates & Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <p className="bg-paper border border-hairline rounded-xl p-3"><strong>Security:</strong> sensitive records require encryption, access control, and breach notification before production launch.</p>
              <p className="bg-paper border border-hairline rounded-xl p-3"><strong>Children/Minors:</strong> independent registration is intended for adults 18+. Guardian workflows require legal review.</p>
              <p className="bg-paper border border-hairline rounded-xl p-3"><strong>Cookies:</strong> essential app preference storage may be used for language and PWA behavior.</p>
              <p className="bg-paper border border-hairline rounded-xl p-3"><strong>Policy Updates:</strong> material privacy changes should be shown in-app and through SMS where required.</p>
              <p className="bg-paper border border-hairline rounded-xl p-3 sm:col-span-2"><strong>Contact:</strong> privacy and data-rights requests can be routed to support@psynova.lk or the platform compliance desk.</p>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-paper text-slate-500 py-6 border-t border-hairline text-center text-xs">
        <p>© 2026 PsyNova Platform Sri Lanka. Privacy & General Compliance Directorate.</p>
      </footer>

      <SimulatorSettings />
    </div>
  );
}
