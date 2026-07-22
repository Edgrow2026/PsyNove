create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  email text unique,
  role text not null check (role in ('client', 'psychiatrist', 'admin', 'superadmin')),
  district text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  nic text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.psychiatrist_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  bio text not null,
  consultation_fee integer not null,
  slmc_number text,
  qualifications text,
  specializations text[] not null default '{}',
  languages text[] not null default '{}',
  slmc_document_name text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.psychiatrist_profiles
  add column if not exists slmc_number text,
  add column if not exists qualifications text,
  add column if not exists specializations text[] not null default '{}',
  add column if not exists languages text[] not null default '{}',
  add column if not exists slmc_document_name text;

create index if not exists profiles_phone_idx on public.profiles(phone);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists psychiatrist_profiles_verification_status_idx
  on public.psychiatrist_profiles(verification_status);
