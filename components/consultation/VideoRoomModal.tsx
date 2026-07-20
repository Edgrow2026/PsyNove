'use client';

import { Booking } from '@/lib/store';

interface VideoRoomModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function VideoRoomModal({ booking, onClose }: VideoRoomModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 p-3 sm:p-6 animate-fade-in flex flex-col">
      <div className="bg-white border border-hairline rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
        <div className="bg-paper border-b border-hairline p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded-md uppercase">
              Jitsi Meet Live Room
            </span>
            <h3 className="font-bold text-ink-navy text-sm mt-1 font-display">{booking.psychiatristName} · {booking.clientName}</h3>
          </div>
          <button
            onClick={onClose}
            className="bg-white border border-hairline px-3 py-2 rounded-xl text-xs font-bold text-ink-navy hover:border-warm-turmeric"
          >
            Exit Room
          </button>
        </div>
        <iframe
          src={booking.meetingLink}
          title="PsyNova Jitsi consultation room"
          className="w-full flex-1 min-h-[70vh] bg-slate-900"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
        />
      </div>
    </div>
  );
}
