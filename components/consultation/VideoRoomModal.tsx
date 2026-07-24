'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileDown, FileUp, MessageSquare, Send, X } from 'lucide-react';
import { Booking } from '@/lib/store';
import { Language } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

interface VideoRoomModalProps {
  booking: Booking;
  lang: Language;
  currentRole: 'client' | 'psychiatrist' | 'admin' | 'superadmin' | 'guest';
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

function mergeMessages(
  current: ConsultationMessage[],
  incoming: ConsultationMessage[],
) {
  const merged = new Map<string, ConsultationMessage>();
  [...current, ...incoming].forEach((message) => {
    merged.set(message.id, message);
  });

  return Array.from(merged.values()).sort(
    (first, second) =>
      new Date(first.sentAt).getTime() - new Date(second.sentAt).getTime(),
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function VideoRoomModal({ booking, lang, currentRole, onClose }: VideoRoomModalProps) {
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
  const sender: 'doctor' | 'patient' = currentRole === 'psychiatrist' ? 'doctor' : 'patient';
  const [syncError, setSyncError] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

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
          setMessages((current) => mergeMessages(current, result.messages));
          setSyncError('');
        }
      } catch (error) {
        console.warn('Unable to load consultation chat from Supabase.', error);
        if (!cancelled) setSyncError('Chat is using local backup until database reconnects.');
      }
    }

    void loadMessages();
    const refreshTimer = window.setInterval(loadMessages, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
    };
  }, [booking.id]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, storageKey]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== storageKey || !event.newValue) return;
      const storedMessages = event.newValue;

      try {
        setMessages((current) => mergeMessages(current, JSON.parse(storedMessages)));
      } catch {
        setMessages((current) => current);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(`psynova_consult_chat_${booking.id}`);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<ConsultationMessage>) => {
      if (!event.data?.id) return;
      setMessages((current) => mergeMessages(current, [event.data]));
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [booking.id]);

  const canDownload = messages.length > 0;

  const chatTranscript = useMemo(() => {
    const rows = messages.map((message) => {
      const isDoctor = message.sender === 'doctor';
      const attachment = message.attachment;
      const attachmentHtml = attachment
        ? `
          <div class="attachment">
            <strong>${escapeHtml(attachment.name)}</strong>
            <span>${formatFileSize(attachment.size)} · ${escapeHtml(attachment.type)}</span>
            ${
              attachment.dataUrl
                ? `<a href="${attachment.dataUrl}" download="${escapeHtml(attachment.name)}">Download document</a>`
                : '<em>Document file data is unavailable in this transcript.</em>'
            }
          </div>
        `
        : '';

      return `
        <article class="message ${isDoctor ? 'doctor' : 'patient'}">
          <div class="meta">
            <strong>${message.sender.toUpperCase()}</strong>
            <span>${new Date(message.sentAt).toLocaleString()}</span>
          </div>
          <p>${escapeHtml(message.text)}</p>
          ${attachmentHtml}
        </article>
      `;
    }).join('');

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>PsyNova Chat Transcript - ${escapeHtml(booking.id)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #18323a; background: #fffaf4; }
    header { border-bottom: 1px solid #e7ded3; padding-bottom: 16px; margin-bottom: 20px; }
    h1 { margin: 0 0 12px; font-size: 24px; }
    dl { display: grid; grid-template-columns: 120px 1fr; gap: 6px 12px; font-size: 14px; }
    dt { font-weight: 700; color: #60717a; }
    dd { margin: 0; }
    .message { border: 1px solid #eadfce; border-radius: 12px; padding: 14px; margin: 12px 0; background: #fff; }
    .doctor { border-color: #a7f3d0; background: #ecfdf5; }
    .patient { border-color: #fde68a; background: #fffbeb; }
    .meta { display: flex; justify-content: space-between; gap: 16px; font-size: 12px; color: #60717a; }
    p { margin: 10px 0 0; }
    .attachment { margin-top: 10px; padding: 10px; border-radius: 10px; background: rgba(255,255,255,.75); border: 1px solid rgba(24,50,58,.12); }
    .attachment span { display: block; margin: 4px 0 8px; color: #60717a; font-size: 12px; }
    .attachment a { color: #92400e; font-weight: 700; }
  </style>
</head>
<body>
  <header>
    <h1>PsyNova Consultation Chat Transcript</h1>
    <dl>
      <dt>Booking</dt><dd>${escapeHtml(booking.id)}</dd>
      <dt>Doctor</dt><dd>${escapeHtml(booking.psychiatristName)}</dd>
      <dt>Patient</dt><dd>${escapeHtml(booking.clientName)}</dd>
      <dt>Meeting</dt><dd>${escapeHtml(booking.meetingLink)}</dd>
    </dl>
  </header>
  <main>${rows || '<p>No chat messages were recorded.</p>'}</main>
</body>
</html>`;
  }, [booking, messages]);

  const addMessage = (message: Omit<ConsultationMessage, 'id' | 'sentAt'>) => {
    const nextMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      sentAt: new Date().toISOString(),
    };

    setMessages((current) => mergeMessages(current, [nextMessage]));
    channelRef.current?.postMessage(nextMessage);

    void fetch('/api/consultation/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, message: nextMessage }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.error || 'Unable to save consultation chat.');
        }
        setSyncError('');
      })
      .catch((error) => {
        console.warn('Unable to save consultation chat to Supabase.', error);
        setSyncError('Message saved locally. Database sync failed.');
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
    const blob = new Blob([chatTranscript], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `psynova_chat_${booking.id}.html`;
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

            <div className="border-b border-hairline px-4 py-3">
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`rounded-xl border px-3 py-2 text-center text-[11px] font-bold ${
                    sender === 'doctor'
                      ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                      : 'border-hairline bg-white text-slate-600'
                  }`}
                >
                  Doctor
                </div>
                <div
                  className={`rounded-xl border px-3 py-2 text-center text-[11px] font-bold ${
                    sender === 'patient'
                      ? 'border-warm-turmeric bg-warm-turmeric/15 text-ink-navy'
                      : 'border-hairline bg-white text-slate-600'
                  }`}
                >
                  Patient
                </div>
              </div>
              {syncError && (
                <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1.5 text-[10px] font-semibold text-amber-800">
                  {syncError}
                </p>
              )}
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
