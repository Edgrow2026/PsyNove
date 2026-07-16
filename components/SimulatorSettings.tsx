'use client';

import React, { useState, useEffect } from 'react';
import { store, AppState } from '../lib/store';
import { Mail, Settings, RefreshCw, X, ShieldAlert, Smartphone } from 'lucide-react';

export default function SimulatorSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AppState>(() => store.getState());
  const [activeTab, setActiveTab] = useState<'roles' | 'sms'>('roles');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  const currentRole = state.currentRole;
  const loggedInUserId = state.loggedInUserId;

  const handleRoleSwitch = (role: 'guest' | 'client' | 'psychiatrist' | 'admin' | 'superadmin', userId: string | null = null) => {
    store.setRole(role, userId);
  };

  const handleReset = () => {
    if (confirm("Reset application simulator data to defaults?")) {
      localStorage.removeItem('psynova_store');
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans" id="simulator-container">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="simulator-toggle-btn"
        className="flex items-center space-x-2 bg-slate-900 text-white px-3.5 py-2.5 rounded-full shadow-xl hover:bg-slate-800 transition-all duration-300 border border-slate-750 cursor-pointer text-sm font-semibold tracking-wide"
      >
        <Settings className="w-4 h-4 animate-spin-slow" />
        <span>දේශීය පරීක්ෂක / Simulator Controls</span>
        {state.smsInbox.length > 0 && (
          <span className="bg-warm-turmeric text-ink-navy text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
            {state.smsInbox.length}
          </span>
        )}
      </button>

      {/* Control Drawer */}
      {isOpen && (
        <div
          id="simulator-drawer"
          className="absolute bottom-14 right-0 w-80 sm:w-96 bg-white text-slate-700 rounded-2xl shadow-2xl border border-hairline overflow-hidden transition-all duration-300"
        >
          {/* Header */}
          <div className="bg-paper p-4 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-ink-navy" />
              <span className="font-bold text-sm text-ink-navy tracking-wider uppercase">PsyNova Sandbox Simulator</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-ink-navy p-1 rounded-lg hover:bg-paper transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-paper/50 px-4 py-2 text-xs flex justify-between border-b border-hairline text-slate-500">
            <span>වත්මන් භූමිකාව: <strong className="text-ink-navy capitalize">{currentRole}</strong></span>
            <span>කොමිස් අනුපාතය: <strong className="text-amber-800">{state.config.commissionRate}%</strong></span>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-hairline bg-paper text-xs">
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 py-2.5 text-center font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'roles'
                  ? 'border-warm-turmeric text-ink-navy bg-white'
                  : 'border-transparent text-slate-500 hover:text-ink-navy'
              }`}
            >
              භූමිකා මාරුකිරීම් (Roles)
            </button>
            <button
              onClick={() => setActiveTab('sms')}
              className={`flex-1 py-2.5 text-center font-semibold border-b-2 transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'sms'
                  ? 'border-warm-turmeric text-ink-navy bg-white'
                  : 'border-transparent text-slate-500 hover:text-ink-navy'
              }`}
            >
              <span>SMS ලොගය ({state.smsInbox.length})</span>
              {state.smsInbox.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-warm-turmeric animate-ping" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[350px] overflow-y-auto space-y-4">
            {activeTab === 'roles' && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  මෙම පුවරුව මඟින් එක් එක් භූමිකාවන් අතර මාරුවෙමින් පද්ධතිය පරීක්ෂා කළ හැක. / Toggle roles to test customer, doctor, and admin workflows immediately without complex logging in.
                </p>

                {/* Group 1: Guest */}
                <button
                  onClick={() => handleRoleSwitch('guest')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'guest'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">1. අමුත්තා (Guest User)</span>
                    <span className="text-[10px] text-slate-500">අගුළු හැර නැත, වෛද්‍යවරුන් සෙවීම සහ විස්තර බැලීම</span>
                  </div>
                  {currentRole === 'guest' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>

                {/* Group 2: Client */}
                <button
                  onClick={() => handleRoleSwitch('client', 'client-1')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'client' && loggedInUserId === 'client-1'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">2. සේවාලාභියා (Client Kavindu)</span>
                    <span className="text-[10px] text-slate-500">සැසිවාර වෙන් කිරීම්, පාලක පුවරුව, පැමිණිලි ඉදිරිපත් කිරීම</span>
                  </div>
                  {currentRole === 'client' && loggedInUserId === 'client-1' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>

                {/* Group 3: Doctor Verified */}
                <button
                  onClick={() => handleRoleSwitch('psychiatrist', 'psy-1')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'psychiatrist' && loggedInUserId === 'psy-1'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">3. වෛද්‍ය (Dr. Ruwan - SLMC Verified)</span>
                    <span className="text-[10px] text-slate-500">සැසිවාර පාලනය, වාර්තා ලිවීම, පැතිකඩ ප්‍රමුඛ කිරීම (Boosting)</span>
                  </div>
                  {currentRole === 'psychiatrist' && loggedInUserId === 'psy-1' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>

                {/* Group 4: Doctor Unverified */}
                <button
                  onClick={() => handleRoleSwitch('psychiatrist', 'psy-6')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'psychiatrist' && loggedInUserId === 'psy-6'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">4. වෛද්‍ය (Dr. Priyantha - Pending Approved)</span>
                    <span className="text-[10px] text-slate-500">නව වෛද්‍ය ලියාපදිංචිය - SLMC අනුමැතිය අවශ්‍යයි</span>
                  </div>
                  {currentRole === 'psychiatrist' && loggedInUserId === 'psy-6' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>

                {/* Group 5: Admin */}
                <button
                  onClick={() => handleRoleSwitch('admin')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'admin'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">5. පරිපාලක (Admin Panel)</span>
                    <span className="text-[10px] text-slate-500">වෛද්‍යවරුන් අනුමත කිරීම, පැමිණිලි, මුදල් ආපසු ගෙවීම්</span>
                  </div>
                  {currentRole === 'admin' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>

                {/* Group 6: Super Admin */}
                <button
                  onClick={() => handleRoleSwitch('superadmin')}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer ${
                    currentRole === 'superadmin'
                      ? 'bg-paper border-warm-turmeric text-ink-navy font-semibold'
                      : 'bg-white border-hairline text-slate-600 hover:bg-paper'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">6. ප්‍රධාන පරිපාලක (Super Admin)</span>
                    <span className="text-[10px] text-slate-500">පද්ධති සැකසුම්, කොමිස් සකස් කිරීම, වාර්තා අපනයනය</span>
                  </div>
                  {currentRole === 'superadmin' && <span className="text-[10px] bg-warm-turmeric text-ink-navy font-bold px-1.5 py-0.5 rounded-full">Active</span>}
                </button>
              </div>
            )}

            {activeTab === 'sms' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center space-x-1">
                    <Smartphone className="w-3.5 h-3.5 text-ink-navy" />
                    <span>දේශීය SMS ද්වාරය (Sandbox)</span>
                  </span>
                  {state.smsInbox.length > 0 && (
                    <button
                      onClick={() => store.clearSMS()}
                      className="text-[10px] text-red-650 hover:underline cursor-pointer font-semibold"
                    >
                      ලොගය මකන්න
                    </button>
                  )}
                </div>

                {state.smsInbox.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-hairline rounded-xl">
                    <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <span>තවමත් SMS පණිවිඩ ලැබී නැත. සැසියක් වෙන් කර හෝ පැමිණිල්ලක් ඉදිරිපත් කර පරීක්ෂා කරන්න.</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {state.smsInbox.map((sms) => (
                      <div key={sms.id} className="bg-paper p-2.5 rounded-lg border border-hairline text-[11px] space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>ලැබුම්කරු: {sms.recipient}</span>
                          <span>{sms.date}</span>
                        </div>
                        <p className="text-slate-800 font-mono leading-relaxed bg-white p-1.5 rounded border border-hairline">
                          {sms.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="bg-paper p-3 border-t border-hairline flex justify-between text-xs">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 text-red-655 hover:text-red-750 font-semibold cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>සිමියුලේටරය යළි පිහිටුවන්න (Reset)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
