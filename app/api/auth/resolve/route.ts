import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

function phoneCandidates(identifier: string) {
  const trimmed = identifier.trim();
  const digits = trimmed.replace(/\D/g, '');
  const localPhone = digits.startsWith('94') ? digits.slice(2) : digits.replace(/^0/, '');

  return Array.from(
    new Set([
      trimmed,
      digits,
      localPhone,
      `0${localPhone}`,
      `94${localPhone}`,
      `+94${localPhone}`,
    ].filter(Boolean)),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { identifier?: string };
    const identifier = body.identifier?.trim();

    if (!identifier) {
      return NextResponse.json({ error: 'Missing login identifier.' }, { status: 400 });
    }

    if (identifier.includes('@')) {
      return NextResponse.json({ email: identifier });
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('profiles')
      .select('email')
      .in('phone', phoneCandidates(identifier))
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const email = data?.[0]?.email;
    if (!email) {
      return NextResponse.json({ error: 'No account found for this mobile number.' }, { status: 404 });
    }

    return NextResponse.json({ email });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to resolve login account.' },
      { status: 500 },
    );
  }
}
