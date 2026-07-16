import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { orderId, amount, currency = 'LKR' } = await request.json();
  const merchantId = process.env.PAYHERE_MERCHANT_ID || process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const sandbox = process.env.NEXT_PUBLIC_PAYHERE_SANDBOX !== 'false';

  if (!merchantId || !merchantSecret || !orderId || !amount) {
    return NextResponse.json({
      configured: false,
      message: 'PayHere credentials are not configured. Using sandbox simulator fallback.',
    });
  }

  const formattedAmount = Number(amount).toFixed(2);
  const hashedSecret = crypto.createHash('md5').update(merchantSecret).digest('hex').toUpperCase();
  const hash = crypto
    .createHash('md5')
    .update(`${merchantId}${orderId}${formattedAmount}${currency}${hashedSecret}`)
    .digest('hex')
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
}
