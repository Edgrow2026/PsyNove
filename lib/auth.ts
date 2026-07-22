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
  nic?: string | null;
  languages?: string[] | null;
  bio?: string | null;
  fee?: number | null;
  slmcNumber?: string | null;
  qualifications?: string | null;
  specializations?: string[] | null;
  slmcDocumentName?: string | null;
  verificationStatus?: string | null;
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
    slmcNumber: string;
    qualifications: string;
    specializations: string[];
    languages: string[];
    slmcDocumentName: string;
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

  const profile: AuthProfile = {
    ...data,
    role: normalizeRole(data.role),
  };

  if (profile.role === 'client') {
    const { data: clientData, error: clientError } = await supabase
      .from('client_profiles')
      .select('nic')
      .eq('user_id', userId)
      .maybeSingle();

    if (clientError) throw authError(clientError.message);

    profile.nic = clientData?.nic || null;
  }

  if (profile.role === 'psychiatrist') {
    const { data: doctorData, error: doctorError } = await supabase
      .from('psychiatrist_profiles')
      .select('bio, consultation_fee, verification_status')
      .eq('user_id', userId)
      .maybeSingle();

    if (doctorError) throw authError(doctorError.message);

    profile.bio = doctorData?.bio || null;
    profile.fee = doctorData?.consultation_fee || null;
    profile.verificationStatus = doctorData?.verification_status || null;
  }

  return profile;
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
    profile: {
      ...profile,
      nic: values.nic,
      languages: values.languages,
    },
  };
}

export async function registerPsychiatrist(values: PsychiatristRegisterValues): Promise<AuthResult> {
  const specializations = values.specializations
    .split(',')
    .map((specialization) => specialization.trim())
    .filter(Boolean);

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
      slmcNumber: values.slmcNumber,
      qualifications: values.qualifications,
      specializations,
      languages: values.languages,
      slmcDocumentName: values.slmcDocumentName,
    },
  });

  await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  return {
    profile: {
      ...profile,
      bio: values.bio,
      fee: values.fee,
      slmcNumber: values.slmcNumber,
      qualifications: values.qualifications,
      specializations,
      languages: values.languages,
      slmcDocumentName: values.slmcDocumentName,
      verificationStatus: 'pending',
    },
    warning: 'Doctor registration submitted. Admin approval is required before the profile goes live.',
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw authError(error.message);
}
