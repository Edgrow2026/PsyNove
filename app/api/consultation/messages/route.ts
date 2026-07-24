import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: NextRequest) {
  try {
    const bookingId = request.nextUrl.searchParams.get('bookingId');
    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required.' }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from('app_consultation_messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('sent_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      messages: (data || []).map((message: any) => ({
        id: message.id,
        sender: message.sender,
        text: message.message_text,
        sentAt: message.sent_at,
        attachment: message.attachment || undefined,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load consultation messages.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.bookingId || !body.message?.id) {
      return NextResponse.json({ error: 'bookingId and message are required.' }, { status: 400 });
    }

    const sender = body.message.sender;
    const text = String(body.message.text || '').trim();
    const sentAt = body.message.sentAt ? new Date(body.message.sentAt) : new Date();

    if (sender !== 'doctor' && sender !== 'patient') {
      return NextResponse.json({ error: 'Invalid message sender.' }, { status: 400 });
    }

    if (!text) {
      return NextResponse.json({ error: 'Message text is required.' }, { status: 400 });
    }

    if (Number.isNaN(sentAt.getTime())) {
      return NextResponse.json({ error: 'Invalid message timestamp.' }, { status: 400 });
    }

    const { error } = await getSupabaseAdmin().from('app_consultation_messages').upsert({
      id: body.message.id,
      booking_id: body.bookingId,
      sender,
      message_text: text,
      sent_at: sentAt.toISOString(),
      attachment: body.message.attachment || null,
    });

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save consultation message.' },
      { status: 500 },
    );
  }
}
