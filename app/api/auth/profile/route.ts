import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

type RegisterRole = 'client' | 'psychiatrist';

interface ProfileRequestBody {
  accessToken?: string;
  password?: string;
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
    slmcNumber: string;
    qualifications: string;
    specializations: string[];
    languages: string[];
    slmcDocumentName: string;
  };
}

async function findAuthUserIdByEmail(
  admin: ReturnType<typeof getSupabaseAdmin>,
  email: string,
) {
  const normalizedEmail = email.toLowerCase();

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;

    const match = data.users.find(user => user.email?.toLowerCase() === normalizedEmail);
    if (match) return match.id;
    if (data.users.length < 1000) return null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProfileRequestBody;

    if (body.role !== 'client' && body.role !== 'psychiatrist') {
      return NextResponse.json({ error: 'Invalid registration role.' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    let userId = '';

    if (body.accessToken) {
      const { data: userData, error: userError } = await admin.auth.getUser(body.accessToken);

      if (userError || !userData.user) {
        return NextResponse.json({ error: userError?.message || 'Invalid auth session.' }, { status: 401 });
      }

      userId = userData.user.id;
    } else {
      if (!body.password || body.password.length < 6) {
        return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
      }

      const authMetadata = {
        full_name: body.profile.fullName,
        phone: body.profile.phone,
        role: body.role,
        district: body.profile.district,
      };

      const existingUserId = await findAuthUserIdByEmail(admin, body.profile.email);

      if (existingUserId) {
        const { data: updatedUser, error: updateError } = await admin.auth.admin.updateUserById(existingUserId, {
          email: body.profile.email,
          password: body.password,
          email_confirm: true,
          phone: body.profile.phone,
          user_metadata: authMetadata,
        });

        if (updateError || !updatedUser.user) {
          return NextResponse.json(
            { error: updateError?.message || 'Unable to update existing auth account.' },
            { status: 400 },
          );
        }

        userId = updatedUser.user.id;
      } else {
        const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
        email: body.profile.email,
        password: body.password,
        email_confirm: true,
        phone: body.profile.phone,
        user_metadata: authMetadata,
        });

        if (createError || !createdUser.user) {
          return NextResponse.json(
            { error: createError?.message || 'Unable to create auth account.' },
            { status: 400 },
          );
        }

        userId = createdUser.user.id;
      }
    }

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
        .upsert({ user_id: userId, nic: body.client.nic }, { onConflict: 'user_id' });

      if (clientError) {
        return NextResponse.json({ error: clientError.message }, { status: 500 });
      }
    }

    if (body.role === 'psychiatrist') {
      if (!body.psychiatrist?.bio || !body.psychiatrist.fee) {
        return NextResponse.json({ error: 'Missing psychiatrist profile details.' }, { status: 400 });
      }

      const doctorPayload = {
        user_id: userId,
        bio: body.psychiatrist.bio,
        consultation_fee: body.psychiatrist.fee,
        slmc_number: body.psychiatrist.slmcNumber,
        qualifications: body.psychiatrist.qualifications,
        specializations: body.psychiatrist.specializations,
        languages: body.psychiatrist.languages,
        slmc_document_name: body.psychiatrist.slmcDocumentName,
        verification_status: 'pending',
      };

      const { error: doctorError } = await admin
        .from('psychiatrist_profiles')
        .upsert(doctorPayload, { onConflict: 'user_id' });

      if (doctorError) {
        const missingColumn = /column .* does not exist/i.test(doctorError.message);

        if (!missingColumn) {
          return NextResponse.json({ error: doctorError.message }, { status: 500 });
        }

        const { error: fallbackDoctorError } = await admin
          .from('psychiatrist_profiles')
          .upsert({
            user_id: userId,
            bio: body.psychiatrist.bio,
            consultation_fee: body.psychiatrist.fee,
            verification_status: 'pending',
          }, { onConflict: 'user_id' });

        if (fallbackDoctorError) {
          return NextResponse.json({ error: fallbackDoctorError.message }, { status: 500 });
        }
      }
    }

    return NextResponse.json({
      profile: {
        ...profilePayload,
        role: body.role,
        nic: body.client?.nic,
        bio: body.psychiatrist?.bio,
        fee: body.psychiatrist?.fee,
        slmcNumber: body.psychiatrist?.slmcNumber,
        qualifications: body.psychiatrist?.qualifications,
        specializations: body.psychiatrist?.specializations,
        languages: body.psychiatrist?.languages,
        slmcDocumentName: body.psychiatrist?.slmcDocumentName,
        verificationStatus: body.role === 'psychiatrist' ? 'pending' : undefined,
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
