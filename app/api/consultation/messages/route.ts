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

    const { error } = await getSupabaseAdmin().from('app_consultation_messages').upsert({
      id: body.message.id,
      booking_id: body.bookingId,
      sender: body.message.sender,
      message_text: body.message.text,
      sent_at: body.message.sentAt,
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
