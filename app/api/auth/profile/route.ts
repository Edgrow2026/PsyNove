import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type RegisterRole = 'client' | 'psychiatrist';

interface ProfileRequestBody {
  accessToken?: string;
  role: RegisterRole;
  profile: {
    fullName: string;
    phone: string;
    email: string;
    district: string;
  };
  client?: {
    nic: string;
  };
  psychiatrist?: {
    bio: string;
    fee: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProfileRequestBody;

    if (!body.accessToken) {
      return NextResponse.json(
        { error: 'Missing auth session. Please disable email confirmation for local testing or confirm the email first.' },
        { status: 401 },
      );
    }

    if (body.role !== 'client' && body.role !== 'psychiatrist') {
      return NextResponse.json({ error: 'Invalid registration role.' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data: userData, error: userError } = await admin.auth.getUser(body.accessToken);

    if (userError || !userData.user) {
      return NextResponse.json({ error: userError?.message || 'Invalid auth session.' }, { status: 401 });
    }

    const userId = userData.user.id;
    const profilePayload = {
      id: userId,
      full_name: body.profile.fullName,
      phone: body.profile.phone,
      email: body.profile.email,
      role: body.role,
      district: body.profile.district,
    };

    const { error: profileError } = await admin.from('profiles').upsert(profilePayload);
    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (body.role === 'client') {
      if (!body.client?.nic) {
        return NextResponse.json({ error: 'Missing NIC/passport number.' }, { status: 400 });
      }

      const { error: clientError } = await admin
        .from('client_profiles')
        .upsert({ user_id: userId, nic: body.client.nic });

      if (clientError) {
        return NextResponse.json({ error: clientError.message }, { status: 500 });
      }
    }

    if (body.role === 'psychiatrist') {
      if (!body.psychiatrist?.bio || !body.psychiatrist.fee) {
        return NextResponse.json({ error: 'Missing psychiatrist profile details.' }, { status: 400 });
      }

      const { error: doctorError } = await admin.from('psychiatrist_profiles').upsert({
        user_id: userId,
        bio: body.psychiatrist.bio,
        consultation_fee: body.psychiatrist.fee,
        verification_status: 'pending',
      });

      if (doctorError) {
        return NextResponse.json({ error: doctorError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      profile: {
        ...profilePayload,
        role: body.role,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_SERVICE_ROLE_KEY in .env.local. Add it from Supabase project settings.' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save auth profile.' },
      { status: 500 },
    );
  }
}
