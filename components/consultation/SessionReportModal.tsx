'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import { Booking } from '@/lib/store';
import { TranslationSet } from '@/lib/translations';

interface SessionReportModalProps {
  booking: Booking;
  notes: string;
  sessionSuccessMsg: boolean;
  t: TranslationSet;
  setNotes: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  onFileIncident: () => void;
  onSubmit: (event: FormEvent) => void;
}

export default function SessionReportModal({
  booking,
  notes,
  sessionSuccessMsg,
  t,
  setNotes,
  onClose,
  onFileIncident,
  onSubmit,
}: SessionReportModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="consultation-modal">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-hairline text-xs overflow-hidden text-slate-700 font-sans">
        <div className="bg-paper text-ink-navy p-5 flex items-center justify-between border-b border-hairline">
          <div className="space-y-0.5">
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">
              Active Consultation Room
            </span>
            <h3 className="font-bold text-sm tracking-tight text-ink-navy font-display">Consultation: {booking.clientName}</h3>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-ink-navy cursor-pointer transition-colors">
            Exit Room
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-paper border border-hairline p-3.5 rounded-xl space-y-1">
            <span className="block font-bold text-ink-navy">Tele-health Session Link (Jitsi Meet)</span>
            <a
              href={booking.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="text-amber-800 hover:underline block font-mono text-[10px] truncate"
            >
              {booking.meetingLink}
            </a>
          </div>

          {sessionSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl font-bold text-center">
              {t.successMessage}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">{t.submitSessionReport}</label>
              <textarea
                required
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.reportNotes}
                className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-2.5 rounded-xl transition-all text-center cursor-pointer shadow-xs text-xs"
              >
                Close Session & Submit Clinical Record
              </button>
              <button
                type="button"
                onClick={onFileIncident}
                className="bg-red-50 hover:bg-red-100 text-red-655 font-bold px-4 py-2.5 rounded-xl transition-all text-center border border-red-200 cursor-pointer text-xs"
              >
                File Incident
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
