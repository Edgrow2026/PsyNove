'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import SimulatorSettings from '../../components/SimulatorSettings';
import PwaRegister from '../../components/PwaRegister';
import { store, AppState } from '../../lib/store';
import { translations } from '../../lib/translations';
import { FileText, ShieldAlert, BookOpen } from 'lucide-react';

export default function TermsPage() {
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  const lang = state.currentLanguage;
  const t = translations[lang];

  // Large-scale legal terms translations for accuracy
  const termsTexts = {
    si: {
      title: "සේවා කොන්දේසි සහ ගිවිසුම්",
      sub: "PsyNova පද්ධතිය භාවිතයට අදාළ වන නීතිමය කොන්දේසි.",
      crisisHeader: "හදිසි අවස්ථා සඳහා වගකීම් සහතිකයෙන් බැහැරවීම (Emergency Disclaimer)",
      crisisBody: "PsyNova යනු හදිසි මානසික සෞඛ්‍ය අනතුරු හෝ සායනික හදිසි අවස්ථා සඳහා සපයනු ලබන ක්ෂණික සේවාවක් නොවේ. ඔබට තමාට හානි කරගැනීමට සිතේ නම් හෝ බරපතල මානසික පීඩනයක් ඇත්නම් කරුණාකර ජාතික මානසික සෞඛ්‍ය උපකාරක අංකය වන 1926 (නොමිලේ, පැය 24 පුරා) හෝ සුමිත්‍රයෝ සංවිධානය (+94 11 268 2535) අමතන්න.",
      introTitle: "1. ගිවිසුම පිළිගැනීම",
      introBody: "මෙම වෙබ් අඩවිය සහ එහි ඇති සේවාවන් භාවිතා කිරීම මඟින් ඔබ මෙම කොන්දේසි වලට එකඟ වන බව ප්‍රකාශ කෙරේ. ඔබ මෙහි සඳහන් කොන්දේසි වලට එකඟ නොවන්නේ නම් කරුණාකර අපගේ වෙබ් අඩවිය භාවිතා කිරීමෙන් වළකින්න.",
      eligTitle: "2. සුදුසුකම් ලැබීම",
      eligBody: "සේවාලාභීන් ලෙස ලියාපදිංචි වීමට වයස අවුරුදු 18 ක් හෝ ඊට වැඩි විය යුතු අතර, වෛද්‍යවරුන් ලෙස සම්බන්ධ වීමට ශ්‍රී ලංකා වෛද්‍ය සභාවේ (SLMC) වලංගු ලියාපදිංචියක් පැවතීම අනිවාර්ය වේ.",
      natureTitle: "3. සේවාවේ ස්වභාවය",
      natureBody: "PsyNova යනු වෛද්‍යවරුන් සහ රෝගීන් සම්බන්ධ කරන පහසුකම් සපයන තාක්ෂණික මධ්‍යස්ථානයක් පමණක් වන අතර එය සෘජුවම වෛද්‍ය ප්‍රතිකාර සපයන්නෙකු නොවේ.",
      paymentTitle: "4. වෙන්කිරීම්, කොමිස් සහ ගෙවීම්",
      paymentBody: "සියලුම වෙන්කිරීම් වලංගු ගෙවීමකින් පසුව පමණක් තහවුරු කෙරේ. වෛද්‍යවරුන්ගෙන් අය කෙරෙන කොමිස් මුදල වෙන්කිරීමේ අගයෙන් 15% ත් 20% ත් අතර වේ. කිසිදු මාසික දායකත්ව ගාස්තුවක් අය නොකෙරේ.",
      refundTitle: "5. මුදල් ආපසු ගෙවීම් සහ අවලංගු කිරීම්",
      refundBody: "සාධාරණ හේතූන් මත මුදල් ආපසු ගෙවීමේ අනුමැතිය පරිපාලක මණ්ඩලයේ තීරණය මත පමණක් තීරණය වේ. ගෙවීම් අතරතුර අසාර්ථක වන වෙන්කිරීම් විනාඩි 5ක් තුළ නැවත නිදහස් කරනු ලැබේ.",
      deactTitle: "6. ගිණුම් අක්‍රීය කිරීම සහ දින 7ක රඳවා ගැනීම",
      deactBody: "ආරක්ෂිත සහ සෞඛ්‍ය වාර්තා ප්‍රතිපත්ති අනුව, ඕනෑම සාමාජිකයෙකු තම ගිණුම අක්‍රීය කිරීමට ඉල්ලූ විට ගිණුම සම්පූර්ණයෙන්ම මැකී යාමට පෙර අවම වශයෙන් දින 7ක අනිවාර්ය රඳවා ගැනීමේ කාලසීමාවක් ක්‍රියාත්මක වේ. මෙම කාලය කිසිදු ලෙසකින් කෙටි කළ නොහැක.",
      lawTitle: "7. පාලක නීතිය",
      lawBody: "මෙම කොන්දේසි ශ්‍රී ලංකා ජනරජයේ පවතින නීති පද්ධතියට යටත් වන අතර ඕනෑම ගැටලුවක් කොළඹ පිහිටි අධිකරණ බල සීමාව යටතේ විසඳිය යුතුය."
    },
    ta: {
      title: "விதிமுறைகள் மற்றும் நிபந்தனைகள்",
      sub: "PsyNova இணையதளப் பயன்பாட்டை ஒழுங்குபடுத்தும் சட்ட விதிமுறைகள்.",
      crisisHeader: "அவசரகால பொறுப்புத் துறப்பு (Emergency Disclaimer)",
      crisisBody: "PsyNova தளம் அவசர மருத்துவத் தேவைகளுக்கானது அல்ல. தற்கொலை எண்ணங்கள் அல்லது கடுமையான ஆபத்துக்கள் உள்ளவர்கள் தயவுசெய்து இலங்கையின் அதிகாரப்பூர்வ அவசர உதவி எண்களான 1926 (இலவச அழைப்பு, 24 மணி நேர சேவை) அல்லது சுமித்ரயோ அமைப்பை (+94 11 268 2535) உடனடியாகத் தொடர்புகொள்ளுமாறு அறிவுறுத்தப்படுகிறார்கள்.",
      introTitle: "1. விதிமுறைகளை ஏற்றுக்கொள்வது",
      introBody: "எங்கள் சேவைகளைப் பயன்படுத்துவதன் மூலம், இந்த விதிமுறைகளை நீங்கள் முழுமையாக ஒப்புக்கொள்கிறீர்கள். விதிமுறைகளில் உடன்பாடு இல்லாவிடில், இந்தத் தளத்தைப் பயன்படுத்துவதைத் தவிர்க்கவும்.",
      eligTitle: "2. தகுதி",
      eligBody: "பயனாளராக பதிவுசெய்ய குறைந்தது 18 வயது பூர்த்தியாகியிருக்க வேண்டும். மருத்துவர்கள் இலங்கையின் மருத்துவக் கவுன்சில் (SLMC) அங்கீகாரம் பெற்றிருப்பது கட்டாயமாகும்.",
      natureTitle: "3. சேவையின் தன்மை",
      natureBody: "PsyNova என்பது மருத்துவர்களையும் நோயாளிகளையும் இணைக்கும் ஒரு முன்பதிவுத் தளமாகும், இது நேரடியாக மருத்துவ சிகிச்சைகளை வழங்குவதில்லை.",
      paymentTitle: "4. முன்பதிவு, கட்டணம் மற்றும் கமிஷன்",
      paymentBody: "முன்பதிவுகள் கட்டணம் செலுத்தப்பட்ட பின்னரே உறுதிசெய்யப்படும். மருத்துவர்களின் கட்டணத்திலிருந்து 15% முதல் 20% வரை தளத்திற்கான கமிஷனாகப் பெறப்படும்.",
      refundTitle: "5. ரத்து செய்தல் மற்றும் பணம் திரும்புதல்",
      refundBody: "பணம் திருப்பி வழங்குவது நிர்வாகியின் ஒப்புதலுக்கு உட்பட்டது. கட்டணம் செலுத்தத் தவறிய முன்பதிவுகள் 5 நிமிடங்களில் தானாகவே ரத்து செய்யப்பட்டு மீண்டும் தளத்தில் பட்டியலிடப்படும்.",
      deactTitle: "6. கணக்கு நீக்கம் மற்றும் 7 நாட்கள் நிறுத்திவைப்பு",
      deactBody: "பாதுகாப்பு மற்றும் மருத்துவ ஆவண விதிகளின்படி, ஒரு கணக்கை முடக்கிய பிறகு அது முழுமையாக நீக்கப்படுவதற்கு 7 நாட்கள் கட்டாயக் காத்திருப்பு காலம் அமல்படுத்தப்படும். இதனை நிர்வாகிகளால் குறைக்க முடியாது.",
      lawTitle: "7. சட்ட வரம்பு",
      lawBody: "இந்த விதிகள் இலங்கையின் சட்டங்களுக்கு உட்பட்டவை. ஏதேனும் தகராறுகள் இருப்பின் கொழும்பு நீதிமன்ற எல்லைக்குள் தீர்க்கப்பட வேண்டும்."
    },
    en: {
      title: "Terms & Conditions of Service",
      sub: "The legal framework governing your access and usage of PsyNova.",
      crisisHeader: "No Emergency or Crisis Medical Care (Disclaimer)",
      crisisBody: "PsyNova is an intermediary booking and tele-psychiatry platform, not an emergency services provider. If you are experiencing suicidal thoughts, severe depression, self-harm impulses, or a medical crisis, you must immediately call the 24/7 free National Mental Health Helpline on 1926, Sumithrayo (+94 11 268 2535), or visit your nearest hospital.",
      introTitle: "1. Agreement to Terms",
      introBody: "By registering, searching, or conducting appointments on PsyNova, you express absolute consent to these terms. If you do not agree, you are prohibited from utilizing our software.",
      eligTitle: "2. Participant Eligibility",
      eligBody: "Clients must be at least 18 years of age to register independently. Psychiatrists must possess an active, unrevoked Sri Lanka Medical Council (SLMC) registration.",
      natureTitle: "3. Scope of Intermediary Services",
      natureBody: "PsyNova functions solely as a listing and coordination portal. Tele-health video services are conducted through third-party encrypted applications like Jitsi; clinical outcomes are the sole responsibility of the practitioner.",
      paymentTitle: "4. Financial & Facilitation Commission",
      paymentBody: "Consultations require full gateway prepayment. A commission rate structured within a strict 15% to 20% range is applied to doctor earnings. No recurring subscriptions are allowed.",
      refundTitle: "5. Cancellations & Admin Discretionary Refunds",
      refundBody: "Cancellations and subsequent refunds are strictly handled manually by our administration team. Booking slots where payment has failed are automatically released after 5 minutes.",
      deactTitle: "6. Permanent Deactivation administrative Hold",
      deactBody: "In compliance with health-information protection standards, all profile deactivations are placed on a non-negotiable 7-calendar-day safety hold before complete database deletion. This cannot be shortened under any circumstance.",
      lawTitle: "7. Governing Sri Lankan Law",
      lawBody: "These terms are fully governed by and interpreted under the judicial laws of the Democratic Socialist Republic of Sri Lanka. All disputes fall under Colombo jurisdiction."
    }
  }[lang];

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans" id="terms-page-root">
      <PwaRegister />
      <Navbar activeSection="terms" />

      {/* Header Banner */}
      <section className="relative overflow-hidden bg-paper py-12 text-ink-navy border-b border-hairline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <div className="mx-auto bg-white p-3 rounded-full w-fit mb-2 border border-hairline">
            <FileText className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-light tracking-tight">{termsTexts.title}</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            {termsTexts.sub}
          </p>
        </div>
      </section>

      {/* Main Terms Body */}
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Emergency Callout Box */}
        <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl shadow-lg space-y-2">
          <div className="flex items-center space-x-2 text-red-600 font-bold text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>{termsTexts.crisisHeader}</span>
          </div>
          <p className="text-xs sm:text-sm text-red-700 leading-relaxed font-normal">
            {termsTexts.crisisBody}
          </p>
        </div>

        {/* Detailed Clauses */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-hairline shadow-2xl space-y-6">
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-ink-navy flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-warm-turmeric" />
              <span>{termsTexts.introTitle}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.introBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{termsTexts.eligTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.eligBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{termsTexts.natureTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.natureBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{termsTexts.paymentTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.paymentBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{termsTexts.refundTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.refundBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-red-600">{termsTexts.deactTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.deactBody}</p>
          </div>

          <div className="space-y-2 border-t border-hairline pt-5">
            <h2 className="text-lg font-bold text-ink-navy">{termsTexts.lawTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">{termsTexts.lawBody}</p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-paper text-slate-500 py-6 border-t border-hairline text-center text-xs">
        <p>© 2026 PsyNova Platform Sri Lanka. Legal Documentation Department.</p>
      </footer>

      <SimulatorSettings />
    </div>
  );
}
