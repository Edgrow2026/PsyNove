'use client';

import { Dispatch, SetStateAction } from 'react';
import { Clock } from 'lucide-react';
import { Language, TranslationSet } from '@/lib/translations';
import { uiCopy } from '@/lib/ui-copy';

export interface PaymentPendingBooking {
  docId: string;
  docName: string;
  fee: number;
  date: string;
  time: string;
}

type PaymentMethod = 'lankapay' | 'card';
type PayStatus = 'idle' | 'processing' | 'success' | 'failed';

interface PaymentModalProps {
  booking: PaymentPendingBooking;
  paymentCountdown: number;
  commissionRate: number;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
  payStatus: PayStatus;
  lankaPayEnabled: boolean;
  cardPaymentEnabled: boolean;
  t: TranslationSet;
  lang: Language;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  setCardNumber: Dispatch<SetStateAction<string>>;
  setCardExpiry: Dispatch<SetStateAction<string>>;
  setCardCVV: Dispatch<SetStateAction<string>>;
  onCancel: () => void;
  onProcessPayment: () => void;
}

export default function PaymentModal({
  booking,
  paymentCountdown,
  commissionRate,
  paymentMethod,
  cardNumber,
  cardExpiry,
  cardCVV,
  payStatus,
  lankaPayEnabled,
  cardPaymentEnabled,
  t,
  lang,
  setPaymentMethod,
  setCardNumber,
  setCardExpiry,
  setCardCVV,
  onCancel,
  onProcessPayment,
}: PaymentModalProps) {
  const commission = Math.round(booking.fee * (commissionRate / 100));
  const total = booking.fee + commission;
  const copy = uiCopy[lang];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in" id="payment-modal">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-hairline overflow-hidden text-xs text-slate-700">
        <div className="bg-paper text-ink-navy p-5 flex items-center justify-between border-b border-hairline font-sans">
          <div className="space-y-0.5">
            <span className="text-[10px] bg-warm-turmeric text-ink-navy font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider font-sans">
              {copy.payhereGateway}
            </span>
            <h3 className="font-bold text-sm tracking-tight font-display">{t.simulatedGateway}</h3>
          </div>
          <button onClick={onCancel} className="text-slate-600 hover:text-ink-navy cursor-pointer transition-colors">
            {copy.cancel}
          </button>
        </div>

        <div className="p-5 space-y-4 font-sans">
          <div className="bg-amber-50 border-l-2 border-amber-500 p-3 rounded-r-xl flex space-x-2 text-amber-800">
            <Clock className="w-4 h-4 text-amber-655 flex-shrink-0 mt-0.5" />
            <span className="text-[10px] leading-relaxed font-medium">
              {t.slotTimeoutWarning} {copy.timeLeft}: {Math.floor(paymentCountdown / 60)}:{String(paymentCountdown % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="bg-paper p-4 rounded-xl border border-hairline space-y-2">
            <div className="flex justify-between font-bold text-ink-navy">
              <span>{copy.specialist}:</span>
              <span>{booking.docName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{copy.dateAndTime}:</span>
              <span>{booking.date} | {booking.time}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-t border-hairline pt-2">
              <span>{copy.doctorFee}:</span>
              <span>LKR {booking.fee}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>{copy.platformCommission}:</span>
              <span>LKR {commission}</span>
            </div>
            <div className="flex justify-between text-amber-800 font-bold text-sm border-t border-hairline pt-2 font-display">
              <span>{t.totalAmount}:</span>
              <span>LKR {total}</span>
            </div>
          </div>

          <div className="flex border border-hairline rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              disabled={!cardPaymentEnabled}
              className={`flex-1 py-2 text-center font-bold transition-all cursor-pointer text-xs ${
                paymentMethod === 'card' ? 'bg-warm-turmeric text-ink-navy' : 'bg-paper text-slate-600'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {t.payWithCard}
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('lankapay')}
              disabled={!lankaPayEnabled}
              className={`flex-1 py-2 text-center font-bold transition-all cursor-pointer text-xs ${
                paymentMethod === 'lankapay' ? 'bg-warm-turmeric text-ink-navy' : 'bg-paper text-slate-600'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {t.payWithLankaPay}
            </button>
          </div>

          {paymentMethod === 'card' ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">{copy.cardNumber} ({copy.cardHint})</label>
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{copy.expiryDate}</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">{copy.cvv}</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl space-y-1 text-sky-800 font-medium animate-fade-in">
              <span className="block font-bold">{copy.lankaPayRouting}</span>
              <p className="text-[10px] leading-normal font-normal text-slate-600">{copy.lankaPayText}</p>
            </div>
          )}

          {payStatus === 'processing' && (
            <div className="text-center py-2 text-slate-600 font-bold flex items-center justify-center space-x-1">
              <span className="w-3 h-3 rounded-full bg-warm-turmeric animate-ping mr-2" />
              <span>{copy.authorizing}</span>
            </div>
          )}

          {payStatus === 'success' && (
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-center border border-emerald-200 font-semibold animate-pulse">
              {t.paymentSuccess}
            </div>
          )}

          {payStatus === 'failed' && (
            <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-center border border-rose-200 font-semibold">
              {t.paymentFailed}
            </div>
          )}

          <button
            type="button"
            onClick={onProcessPayment}
            disabled={payStatus === 'processing' || payStatus === 'success'}
            className="w-full bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-2.5 rounded-xl transition-all duration-300 text-center tracking-wide cursor-pointer shadow-xs"
          >
            {t.confirmAndPay}
          </button>
        </div>
      </div>
    </div>
  );
}
