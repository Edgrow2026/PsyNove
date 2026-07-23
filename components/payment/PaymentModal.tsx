"use client";

import { Clock } from "lucide-react";
import { Language, TranslationSet } from "@/lib/translations";
import { uiCopy } from "@/lib/ui-copy";

export interface PaymentPendingBooking {
  docId: string;
  docName: string;
  fee: number;
  date: string;
  time: string;
}

type PayStatus = "idle" | "processing" | "success" | "failed" | "pending";

interface PaymentModalProps {
  booking: PaymentPendingBooking;
  paymentCountdown: number;
  commissionRate: number;
  payStatus: PayStatus;
  t: TranslationSet;
  lang: Language;
  onCancel: () => void;
  onProcessPayment: () => void;
}

export default function PaymentModal({
  booking,
  paymentCountdown,
  commissionRate,
  payStatus,
  t,
  lang,
  onCancel,
  onProcessPayment,
}: PaymentModalProps) {
  const commission = Math.round(booking.fee * (commissionRate / 100));

  const total = booking.fee + commission;
  const copy = uiCopy[lang];

  return (
    <div
      id="payment-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-white text-xs text-slate-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline bg-paper p-5 font-sans text-ink-navy">
          <div className="space-y-0.5">
            <span className="rounded-md bg-warm-turmeric px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-ink-navy">
              {copy.payhereGateway}
            </span>

            <h3 className="font-display text-sm font-bold tracking-tight">
              PayHere Secure Payment
            </h3>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={payStatus === "processing"}
            className="cursor-pointer text-slate-600 transition-colors hover:text-ink-navy disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.cancel}
          </button>
        </div>

        <div className="space-y-4 p-5 font-sans">
          {/* Reservation countdown */}
          <div className="flex space-x-2 rounded-r-xl border-l-2 border-amber-500 bg-amber-50 p-3 text-amber-800">
            <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />

            <span className="text-[10px] font-medium leading-relaxed">
              {t.slotTimeoutWarning} {copy.timeLeft}:{" "}
              {Math.floor(paymentCountdown / 60)}:
              {String(paymentCountdown % 60).padStart(2, "0")}
            </span>
          </div>

          {/* Booking summary */}
          <div className="space-y-2 rounded-xl border border-hairline bg-paper p-4">
            <div className="flex justify-between font-bold text-ink-navy">
              <span>{copy.specialist}:</span>
              <span>{booking.docName}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{copy.dateAndTime}:</span>
              <span>
                {booking.date} | {booking.time}
              </span>
            </div>

            <div className="flex justify-between border-t border-hairline pt-2 text-slate-600">
              <span>{copy.doctorFee}:</span>
              <span>LKR {booking.fee}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>{copy.platformCommission}:</span>
              <span>LKR {commission}</span>
            </div>

            <div className="flex justify-between border-t border-hairline pt-2 font-display text-sm font-bold text-amber-800">
              <span>{t.totalAmount}:</span>
              <span>LKR {total}</span>
            </div>
          </div>

          {/* PayHere information */}
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-800">
            <p className="font-bold">Secure PayHere Payment</p>

            <p className="mt-1 text-xs leading-relaxed text-slate-600">
              You will enter your card details securely on the PayHere checkout
              page. PsyNova does not store your card information.
            </p>
          </div>

          {/* Processing status */}
          {payStatus === "processing" && (
            <div className="flex items-center justify-center py-3 text-center font-bold text-slate-600">
              <span className="mr-3 h-3 w-3 animate-ping rounded-full bg-warm-turmeric" />
              <span>Verifying your payment...</span>
            </div>
          )}

          {/* Success status */}
          {payStatus === "success" && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center font-semibold text-emerald-800">
              Payment completed successfully. Your appointment has been booked.
            </div>
          )}
          {payStatus === "pending" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center font-semibold text-amber-800">
              Your payment is still being verified. Please check your
              appointments again shortly.
            </div>
          )}

          {/* Failed status */}
          {payStatus === "failed" && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-center font-semibold text-rose-800">
              Payment was not completed. Please try again.
            </div>
          )}

          {/* Payment button */}
          {(payStatus === "idle" || payStatus === "failed") && (
            <button
              type="button"
              onClick={onProcessPayment}
              className="w-full cursor-pointer rounded-xl bg-warm-turmeric py-3 text-center font-bold tracking-wide text-ink-navy shadow-xs transition-all duration-300 hover:bg-warm-turmeric/90"
            >
              {payStatus === "failed"
                ? "Try Payment Again"
                : "Proceed to PayHere Secure Checkout"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
