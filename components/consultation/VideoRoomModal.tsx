'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileDown, FileUp, MessageSquare, Send, X } from 'lucide-react';
import { Booking } from '@/lib/store';
import { Language } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

interface VideoRoomModalProps {
  booking: Booking;
  lang: Language;
  onClose: () => void;
}

type ConsultationMessage = {
  id: string;
  sender: 'doctor' | 'patient';
  text: string;
  sentAt: string;
  attachment?: {
    name: string;
    size: number;
    type: string;
    dataUrl?: string;
  };
};

const MAX_ATTACHMENT_BYTES = 1.5 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VideoRoomModal({ booking, lang, onClose }: VideoRoomModalProps) {
  const copy = uiCopy[lang];
  const storageKey = `psynova_consult_chat_${booking.id}`;
  const [messages, setMessages] = useState<ConsultationMessage[]>(() => {
    if (typeof window === 'undefined') return [];

    try {
      const savedMessages = localStorage.getItem(`psynova_consult_chat_${booking.id}`);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch {
      return [];
    }
  });
  const [messageText, setMessageText] = useState('');
  const [sender, setSender] = useState<'doctor' | 'patient'>('doctor');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        const response = await fetch(
          `/api/consultation/messages?bookingId=${encodeURIComponent(booking.id)}`,
          { cache: 'no-store' },
        );
        const result = await response.json().catch(() => ({}));

        if (!cancelled && response.ok && Array.isArray(result.messages)) {
          setMessages(result.messages);
        }
      } catch (error) {
        console.warn('Unable to load consultation chat from Supabase.', error);
      }
    }

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [booking.id]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== storageKey || !event.newValue) return;

      try {
        setMessages(JSON.parse(event.newValue));
      } catch {
        setMessages([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  const canDownload = messages.length > 0;

  const chatTranscript = useMemo(() => {
    const lines = [
      'PsyNova Consultation Chat Transcript',
      `Booking: ${booking.id}`,
      `Doctor: ${booking.psychiatristName}`,
      `Patient: ${booking.clientName}`,
      `Meeting: ${booking.meetingLink}`,
      '',
      ...messages.map((message) => {
        const attachment = message.attachment
          ? ` [Document: ${message.attachment.name}, ${formatFileSize(message.attachment.size)}]`
          : '';
        return `[${new Date(message.sentAt).toLocaleString()}] ${message.sender.toUpperCase()}: ${message.text}${attachment}`;
      }),
      '',
    ];

    return lines.join('\n');
  }, [booking, messages]);

  const addMessage = (message: Omit<ConsultationMessage, 'id' | 'sentAt'>) => {
    const nextMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sentAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, nextMessage]);

    void fetch('/api/consultation/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, message: nextMessage }),
    }).catch((error) => {
      console.warn('Unable to save consultation chat to Supabase.', error);
    });
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text) return;

    addMessage({ sender, text });
    setMessageText('');
  };

  const handleDocumentSend = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_ATTACHMENT_BYTES) {
      alert('Please attach a document smaller than 1.5 MB for this sandbox consultation chat.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      addMessage({
        sender,
        text: 'Shared a consultation document.',
        attachment: {
          name: file.name,
          size: file.size,
          type: file.type || 'Unknown file',
          dataUrl: typeof reader.result === 'string' ? reader.result : undefined,
        },
      });
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  };

  const handleDownloadDocument = (attachment: NonNullable<ConsultationMessage['attachment']>) => {
    if (!attachment.dataUrl) return;

    const link = document.createElement('a');
    link.href = attachment.dataUrl;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([chatTranscript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `psynova_chat_${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 p-3 sm:p-6 animate-fade-in flex flex-col">
      <div className="bg-white border border-hairline rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
        <div className="bg-paper border-b border-hairline p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-2 py-1 rounded-md uppercase">
              {copy.jitsiRoom}
            </span>
            <h3 className="font-bold text-ink-navy text-sm mt-1 font-display">{booking.psychiatristName} · {booking.clientName}</h3>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 bg-white border border-hairline px-3 py-2 rounded-xl text-xs font-bold text-ink-navy hover:border-warm-turmeric"
          >
            <X className="h-3.5 w-3.5" />
            <span>{copy.exitRoom}</span>
          </button>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">
          <iframe
            src={booking.meetingLink}
            title="PsyNova Jitsi consultation room"
            className="h-[48vh] w-full bg-slate-900 lg:h-full lg:min-h-[70vh]"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />

          <aside className="flex min-h-[420px] flex-col border-t border-hairline bg-white lg:min-h-0 lg:border-l lg:border-t-0">
            <div className="flex items-center justify-between gap-3 border-b border-hairline bg-paper px-4 py-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-warm-turmeric" />
                <div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wide text-ink-navy">
                    Consultation chat
                  </h4>
                  <p className="text-[10px] font-medium text-slate-500">
                    Shared messages and documents
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadTranscript}
                disabled={!canDownload}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-white text-ink-navy transition-all hover:border-warm-turmeric disabled:opacity-40"
                title="Download chat"
                aria-label="Download chat"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
              <button
                type="button"
                onClick={() => setSender('doctor')}
                className={`flex-1 rounded-xl border px-3 py-2 text-[11px] font-bold ${
                  sender === 'doctor'
                    ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                    : 'border-hairline bg-white text-slate-600'
                }`}
              >
                Doctor
              </button>
              <button
                type="button"
                onClick={() => setSender('patient')}
                className={`flex-1 rounded-xl border px-3 py-2 text-[11px] font-bold ${
                  sender === 'patient'
                    ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                    : 'border-hairline bg-white text-slate-600'
                }`}
              >
                Patient
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.length === 0 ? (
                <div className="rounded-xl border border-dashed border-hairline bg-paper p-4 text-center text-[11px] font-semibold text-slate-500">
                  No chat messages yet.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-xl border p-3 text-xs ${
                      message.sender === 'doctor'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-950'
                        : 'border-amber-200 bg-amber-50 text-amber-950'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-extrabold capitalize">{message.sender}</span>
                      <span className="text-[9px] font-bold text-slate-500">
                        {new Date(message.sentAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="font-medium leading-relaxed">{message.text}</p>
                    {message.attachment && (
                      <div className="mt-2 flex items-center justify-between gap-2 rounded-lg border border-white/70 bg-white/80 p-2">
                        <div className="min-w-0">
                          <span className="block break-all font-bold text-ink-navy">
                            {message.attachment.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {formatFileSize(message.attachment.size)} · {message.attachment.type}
                          </span>
                        </div>
                        {message.attachment.dataUrl && (
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(message.attachment!)}
                            className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-hairline bg-white text-ink-navy hover:border-warm-turmeric"
                            title="Download document"
                            aria-label="Download document"
                          >
                            <FileDown className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="border-t border-hairline bg-paper p-3">
              <div className="mb-2 flex items-center gap-2">
                <label className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-hairline bg-white text-ink-navy transition-all hover:border-warm-turmeric" title="Send document">
                  <FileUp className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleDocumentSend}
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,image/*"
                  />
                </label>
                <input
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Type consultation message..."
                  className="h-10 min-w-0 flex-1 rounded-xl border border-hairline bg-white px-3 text-xs font-semibold text-ink-navy outline-hidden focus:ring-1 focus:ring-warm-turmeric"
                />
                <button
                  type="submit"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-warm-turmeric text-ink-navy transition-all hover:bg-warm-turmeric/90"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[10px] font-medium text-slate-500">
                Use this PsyNova chat for shared consultation documents.
              </p>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}
