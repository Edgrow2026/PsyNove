import { supabase } from './supabase';
import { PsychiatristRegisterValues } from '@/components/auth/PsychiatristRegisterModal';
import { ClientRegisterValues } from '@/components/auth/ClientRegisterModal';
import { LoginRole } from '@/components/auth/LoginModal';

export type AppRole = 'client' | 'psychiatrist' | 'admin' | 'superadmin';

export interface AuthProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  role: AppRole;
  district: string | null;
}

export interface AuthResult {
  profile: AuthProfile;
  warning?: string;
}

function normalizeRole(role: string | null | undefined): AppRole {
  if (role === 'psychiatrist' || role === 'admin' || role === 'superadmin') return role;
  return 'client';
}

function authError(message: string) {
  return new Error(message);
}

async function createProfileRecords(payload: {
  accessToken?: string;
  password?: string;
  role: 'client' | 'psychiatrist';
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
}) {
  let response: Response;
  try {
    response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw authError('Unable to reach the profile API. Restart npm run dev after changing .env.local and try again.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw authError(result.error || 'Unable to save account profile.');
  }

  return result.profile as AuthProfile;
}

export async function getProfile(userId: string): Promise<AuthProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, email, role, district')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw authError(error?.message || 'Unable to load account profile.');
  }

  return {
    ...data,
    role: normalizeRole(data.role),
  };
}

async function resolveEmail(identifier: string) {
  if (identifier.includes('@')) return identifier;

  const response = await fetch('/api/auth/resolve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.email) {
    throw authError(result.error || 'No account found for this mobile number.');
  }

  return result.email as string;
}

export async function signInWithRole(
  role: LoginRole,
  identifier: string,
  password: string,
): Promise<AuthResult> {
  const email = await resolveEmail(identifier);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw authError(error?.message || 'Login failed.');
  }

  const profile = await getProfile(data.user.id);
  if (profile.role !== role) {
    await supabase.auth.signOut();
    throw authError(`This account is registered as ${profile.role}, not ${role}.`);
  }

  if (role === 'psychiatrist') {
    const { data: doctorProfile, error: doctorError } = await supabase
      .from('psychiatrist_profiles')
      .select('verification_status')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (doctorError) throw authError(doctorError.message);

    const status = doctorProfile?.verification_status || 'pending';
    if (status !== 'verified') {
      return {
        profile,
        warning: 'Doctor account is signed in, but profile is still pending admin approval.',
      };
    }
  }

  return { profile };
}

export async function registerClient(values: ClientRegisterValues): Promise<AuthResult> {
  const profile = await createProfileRecords({
    password: values.password,
    role: 'client',
    profile: {
      fullName: values.name,
      phone: values.phone,
      email: values.email,
      district: values.district,
    },
    client: {
      nic: values.nic,
    },
  });

  await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  return {
    profile,
  };
}

export async function registerPsychiatrist(values: PsychiatristRegisterValues): Promise<AuthResult> {
  const profile = await createProfileRecords({
    password: values.password,
    role: 'psychiatrist',
    profile: {
      fullName: values.name,
      phone: values.phone,
      email: values.email,
      district: values.district,
    },
    psychiatrist: {
      bio: values.bio,
      fee: values.fee,
    },
  });

  await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  return {
    profile,
    warning: 'Doctor registration submitted. Admin approval is required before the profile goes live.',
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw authError(error.message);
}
