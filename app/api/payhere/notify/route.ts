import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function md5(value: string): string {
  return crypto.createHash("md5").update(value).digest("hex").toUpperCase();
}

function mapPayHereStatus(statusCode: string) {
  switch (statusCode) {
    case "2":
      return "paid";
    case "0":
      return "pending";
    case "-1":
      return "cancelled";
    case "-2":
      return "failed";
    case "-3":
      return "chargeback";
    default:
      return "unknown";
  }
}

export async function POST(request: NextRequest) {
  const appUrl = request.nextUrl.origin;
  console.log("PAYHERE WEBHOOK ENDPOINT HIT");
  console.log("PayHere notify URL:", `${appUrl}/api/payhere/notify`);

  try {
    const formData = await request.formData();

    console.log(
      "Raw PayHere notification:",
      Object.fromEntries(formData.entries()),
    );

    const merchantId = String(formData.get("merchant_id") ?? "");
    const orderId = String(formData.get("order_id") ?? "");
    const paymentId = String(formData.get("payment_id") ?? "");
    const amount = String(formData.get("payhere_amount") ?? "");
    const currency = String(formData.get("payhere_currency") ?? "");
    const statusCode = String(formData.get("status_code") ?? "");
    const statusMessage = String(formData.get("status_message") ?? "");
    const receivedSignature = String(
      formData.get("md5sig") ?? "",
    ).toUpperCase();

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const configuredMerchantId = process.env.PAYHERE_MERCHANT_ID;

    if (!merchantSecret || !configuredMerchantId) {
      console.error("PayHere environment variables are missing");
      return NextResponse.json(
        { error: "PayHere is not configured" },
        { status: 500 },
      );
    }

    if (!orderId || !statusCode || !receivedSignature) {
      console.error("Incomplete PayHere notification", {
        orderId,
        statusCode,
      });

      return NextResponse.json(
        { error: "Invalid notification" },
        { status: 400 },
      );
    }

    if (merchantId !== configuredMerchantId) {
      console.error("Merchant ID mismatch", {
        received: merchantId,
      });

      return NextResponse.json({ error: "Merchant mismatch" }, { status: 400 });
    }

    const hashedSecret = md5(merchantSecret);

    const expectedSignature = md5(
      merchantId + orderId + amount + currency + statusCode + hashedSecret,
    );

    if (expectedSignature !== receivedSignature) {
      console.error("Invalid PayHere signature", {
        orderId,
        expectedSignature,
        receivedSignature,
      });

      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const paymentStatus = mapPayHereStatus(statusCode);

    const { error } = await supabaseAdmin
      .from("payment_transactions")
      .update({
        payment_id: paymentId || null,
        status: paymentStatus,
        status_code: Number(statusCode),
        status_message: statusMessage || null,
        paid_amount: Number(amount),
        currency,
        verified_at: new Date().toISOString(),
      })
      .eq("order_id", orderId);

    if (error) {
      console.error("Failed to update payment transaction", error);

      return NextResponse.json(
        { error: "Database update failed" },
        { status: 500 },
      );
    }

    console.log("PayHere notification verified", {
      orderId,
      paymentId,
      paymentStatus,
      statusCode,
    });
    console.log(
      "PayHere notification data:",
      Object.fromEntries(formData.entries()),
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayHere notification error", error);

    return NextResponse.json(
      { error: "Notification processing failed" },
      { status: 500 },
    );
  }
}
