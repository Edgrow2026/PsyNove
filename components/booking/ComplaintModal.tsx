'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import { Booking } from '@/lib/store';
import { TranslationSet } from '@/lib/translations';

interface ComplaintModalProps {
  booking: Booking;
  complaintNotes: string;
  complaintSuccess: boolean;
  t: TranslationSet;
  setComplaintNotes: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}

export default function ComplaintModal({
  booking,
  complaintNotes,
  complaintSuccess,
  t,
  setComplaintNotes,
  onClose,
  onSubmit,
}: ComplaintModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="complaint-modal">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-hairline text-xs overflow-hidden text-slate-700 font-sans">
        <div className="bg-red-50 text-red-750 p-5 flex items-center justify-between border-b border-red-200">
          <div className="space-y-0.5">
            <h3 className="font-bold text-sm tracking-tight text-red-750 font-display">{t.submitComplaint}</h3>
            <p className="text-red-600 text-[10px] font-sans">Your grievance will be reviewed manually by PsyNova compliance officers.</p>
          </div>
          <button onClick={onClose} className="text-red-600 hover:text-red-800 cursor-pointer transition-colors">
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 space-y-4">
          {complaintSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl font-bold text-center">
              Complaint filed successfully! Check the SMS logs below to see confirmation dispatch.
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-600 font-sans">Booking Associated:</label>
            <span className="block font-semibold text-ink-navy font-sans">
              Appointment #{booking.id} with Dr. {booking.psychiatristName}
            </span>
          </div>

          <div className="space-y-1 font-sans">
            <label className="font-bold text-slate-700">{t.complaintNotes}</label>
            <textarea
              required
              rows={4}
              value={complaintNotes}
              onChange={(e) => setComplaintNotes(e.target.value)}
              placeholder="Provide precise details here..."
              className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white hover:bg-red-700 font-bold py-2.5 rounded-xl transition-all duration-300 text-center cursor-pointer shadow-xs text-xs font-sans"
          >
            Submit Ticket to Compliance Office
          </button>
        </form>
      </div>
    </div>
  );
}
