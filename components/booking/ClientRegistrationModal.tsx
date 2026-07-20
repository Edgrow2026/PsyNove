'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import { LogIn } from 'lucide-react';
import { Psychiatrist } from '@/lib/store';
import { TranslationSet } from '@/lib/translations';

interface ClientRegistrationModalProps {
  selectedDoc: Psychiatrist;
  bookingSlot: string;
  districtList: string[];
  t: TranslationSet;
  regName: string;
  regNIC: string;
  regPhone: string;
  regEmail: string;
  regDistrict: string;
  regPassword: string;
  setRegName: Dispatch<SetStateAction<string>>;
  setRegNIC: Dispatch<SetStateAction<string>>;
  setRegPhone: Dispatch<SetStateAction<string>>;
  setRegEmail: Dispatch<SetStateAction<string>>;
  setRegDistrict: Dispatch<SetStateAction<string>>;
  setRegPassword: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  onUseSandboxClient: () => void;
  onSubmit: (event: FormEvent) => void;
}

export default function ClientRegistrationModal({
  districtList,
  t,
  regName,
  regNIC,
  regPhone,
  regEmail,
  regDistrict,
  regPassword,
  setRegName,
  setRegNIC,
  setRegPhone,
  setRegEmail,
  setRegDistrict,
  setRegPassword,
  onClose,
  onUseSandboxClient,
  onSubmit,
}: ClientRegistrationModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="register-flow-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-hairline text-slate-700">
        <div className="p-5 border-b border-hairline flex justify-between items-center bg-paper">
          <div className="space-y-0.5">
            <h3 className="font-bold text-ink-navy text-sm sm:text-base font-display">සේවාලාභී ගිණුම සාදන්න / Patient Registration</h3>
            <p className="text-slate-500 text-[11px] font-sans">You must verify your identity to reserve a psychiatric appointment.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-ink-navy cursor-pointer text-xs font-bold transition-colors font-sans"
          >
            Close
          </button>
        </div>

        <div className="px-5 pt-4 font-sans">
          <div className="bg-paper border border-hairline p-3.5 rounded-xl flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-ink-navy block">Quick Sandbox Account Access</span>
              <span className="text-[10px] text-slate-600">Immediately logs in as client &apos;Kavindu&apos; to skip forms.</span>
            </div>
            <button
              onClick={onUseSandboxClient}
              className="bg-warm-turmeric text-ink-navy text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer hover:bg-warm-turmeric/90 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Use Kavindu</span>
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">සම්පූර්ණ නම / Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Kavindu Perera"
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">NIC / Passport Number</label>
              <input
                type="text"
                required
                value={regNIC}
                onChange={(e) => setRegNIC(e.target.value)}
                placeholder="199428392019V"
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">ජංගම දුරකථනය / Mobile Phone</label>
              <input
                type="text"
                required
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                placeholder="+94 77 123 4567"
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">විද්‍යුත් තැපෑල / Email</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="kavindu@gmail.com"
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">දිස්ත්‍රික්කය / District</label>
              <select
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden scheme-light"
              >
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>{t.districts[dist] || dist}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1 font-sans">
              <label className="font-bold text-slate-700">මුරපදය / Password</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-3 rounded-xl transition-all duration-300 tracking-wide cursor-pointer text-center shadow-xs font-sans"
          >
            Register & Proceed To Checkout
          </button>
        </form>
      </div>
    </div>
  );
}
