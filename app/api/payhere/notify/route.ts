import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  // In production, verify PayHere notification signatures and update the booking
  // server-side. This local project keeps bookings in client state, so we only
  // acknowledge the webhook endpoint for integration readiness.
  console.log('PayHere notify received', Object.fromEntries(formData.entries()));

  return NextResponse.json({ received: true });
}
