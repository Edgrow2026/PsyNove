import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {

  const { orderId, amount, currency = 'LKR' } = await request.json();
  const merchantId = process.env.PAYHERE_MERCHANT_ID || process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const sandboxFlag = process.env.PAYHERE_SANDBOX || process.env.NEXT_PUBLIC_PAYHERE_SANDBOX;
  const sandbox = sandboxFlag !== 'false';
=======
  try {
    const {
      orderId,
      amount,
      currency = "LKR",
      clientId,
      psychiatristId,
    } = await request.json();

    const merchantId =
      process.env.PAYHERE_MERCHANT_ID ||
      process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const appUrl = process.env.APP_URL || "http://localhost:3000";
    const sandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== "false";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const notifyUrl = `${appUrl}/api/payhere/notify`;

    console.log("PayHere notify URL:", notifyUrl);

    if (!merchantId || !merchantSecret) {
      return NextResponse.json(
        {
          configured: false,
          message: "PayHere credentials are not configured.",
        },
        { status: 500 },
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          configured: false,
          message: "Supabase server credentials are not configured.",
        },
        { status: 500 },
      );
    }

    if (!orderId || !amount) {
      return NextResponse.json(
        {
          configured: false,
          message: "Order ID and amount are required.",
        },
        { status: 400 },
      );
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        {
          configured: false,
          message: "Invalid payment amount.",
        },
        { status: 400 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log("Creating PayHere transaction:", {
      orderId,
      amount: numericAmount,
      currency,
      clientId,
      psychiatristId,
    });

    const { error: transactionError } = await supabaseAdmin
      .from("payment_transactions")
      .insert({
        order_id: orderId,
        amount: numericAmount,
        currency,
        status: "initiated",
      });
    if (transactionError) {
      console.error("Payment transaction insert failed:", transactionError);

      return NextResponse.json(
        {
          configured: false,
          message: "Could not initialize payment transaction.",
          error: transactionError.message,
        },
        { status: 500 },
      );
    }

    const formattedAmount = numericAmount.toFixed(2);

    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    const hash = crypto
      .createHash("md5")
      .update(
        `${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`,
      )
      .digest("hex")
      .toUpperCase();


    return NextResponse.json({
      configured: true,
      sandbox,
      merchantId,
      orderId,
      amount: formattedAmount,
      currency,
      hash,
      returnUrl: appUrl,
      cancelUrl: appUrl,
      notifyUrl: `${appUrl}/api/payhere/notify`,
    });
  } catch (error) {
    console.error("PayHere hash route error:", error);

    return NextResponse.json(
      {
        configured: false,
        message: "Failed to initialize PayHere payment.",
      },
      { status: 500 },
    );
  }
}
