import React from 'react';
import { WifiOff, ShieldAlert, PhoneCall } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      
      <div className="bg-slate-800 p-4 rounded-full w-fit mb-6 animate-pulse">
        <WifiOff className="w-12 h-12 text-sky-400" />
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          ඔබ නොබැඳිව ඇත / ඔබ ஆஃப்லைனில் உள்ளீர்கள் / You are offline
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          PsyNova සේවාවට සම්බන්ධ වීමට සක්‍රීය අන්තර්ජාල සම්බන්ධතාවයක් අවශ්‍ය වේ. කරුණාකර ඔබගේ ජාල සැකසුම් පරීක්ෂා කරන්න.
        </p>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          PsyNova தளத்துடன் இணைக்க இணைய இணைப்பு தேவை. தயவுசெய்து உங்கள் இணைய அமைப்பைச் சரிபார்க்கவும்.
        </p>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
          Connecting to PsyNova requires an active internet connection. Please verify your network parameters.
        </p>
      </div>

      {/* Emergency Crisis Contact in offline mode */}
      <div className="bg-red-950/40 border border-red-900/60 p-5 rounded-2xl max-w-sm mt-8 space-y-3">
        <div className="flex items-center space-x-2 text-red-400 justify-center font-bold text-xs sm:text-sm">
          <ShieldAlert className="w-4 h-4 text-red-500" />
          <span>හදිසි සහාය / அவசர உதவி / Urgent Support</span>
        </div>
        <p className="text-[11px] text-red-200/90 leading-relaxed font-normal">
          ඔබට ක්ෂණික මානසික ආතතියක් ඇත්නම් කරුණාකර ජංගම දුරකථනයෙන් 1926 අමතන්න (නොමිලේ, පැය 24 පුරා).
        </p>
        <p className="text-[11px] text-red-200/90 leading-relaxed font-normal">
          உடனடி மன உளைச்சல் ஏற்பட்டால் 1926 என்ற எண்ணை அழைக்கவும் (இலவசம், 24/7).
        </p>
        <p className="text-[11px] text-red-200/90 leading-relaxed font-normal">
          If in distress, call the National Mental Health Helpline immediately on 1926 (Free 24/7).
        </p>
      </div>

    </div>
  );
}
