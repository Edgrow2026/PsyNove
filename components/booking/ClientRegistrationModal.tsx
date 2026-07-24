"use client";

import { Dispatch, SetStateAction } from "react";
import { Psychiatrist } from "@/lib/store";
import { Language, TranslationSet } from "@/lib/translations";
import { uiCopy } from "@/lib/ui-copy";

interface ClientRegistrationModalProps {
  selectedDoc: Psychiatrist;
  bookingSlot: string;
  districtList: string[];
  t: TranslationSet;
  lang: Language;
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
  onSubmit: (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => void | Promise<void>;
}
export default function ClientRegistrationModal({
  districtList,
  t,
  lang,
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
  onSubmit,
}: ClientRegistrationModalProps) {
  const copy = uiCopy[lang];

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      id="register-flow-modal"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-hairline text-slate-700">
        <div className="p-5 border-b border-hairline flex justify-between items-center bg-paper">
          <div className="space-y-0.5">
            <h3 className="font-bold text-ink-navy text-sm sm:text-base font-display">
              {copy.patientRegistrationTitle}
            </h3>
            <p className="text-slate-500 text-[11px] font-sans">
              {copy.patientRegistrationSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-ink-navy cursor-pointer text-xs font-bold transition-colors font-sans"
          >
            {copy.close}
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                {copy.fullName}
              </label>
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
              <label className="font-bold text-slate-700">
                {copy.nicPassport}
              </label>
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
              <label className="font-bold text-slate-700">
                {copy.mobilePhone}
              </label>
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
              <label className="font-bold text-slate-700">{copy.email}</label>
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
              <label className="font-bold text-slate-700">
                {copy.district}
              </label>
              <select
                value={regDistrict}
                onChange={(e) => setRegDistrict(e.target.value)}
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden scheme-light"
              >
                {districtList.map((dist) => (
                  <option key={dist} value={dist}>
                    {t.districts[dist] || dist}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 font-sans">
              <label className="font-bold text-slate-700">
                {copy.password}
              </label>
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
            {copy.registerProceed}
          </button>
        </form>
      </div>
    </div>
  );
}
