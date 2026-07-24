create table if not exists public.app_clients (
  id text primary key,
  name text not null,
  nic text,
  phone text,
  email text,
  district text,
  languages text[] not null default '{}',
  suspended boolean not null default false,
  deactivated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_psychiatrists (
  id text primary key,
  name text not null,
  photo text,
  qualifications text,
  specializations text[] not null default '{}',
  languages text[] not null default '{}',
  district text,
  fee integer not null default 0,
  slmc_number text,
  slmc_verified boolean not null default false,
  is_boosted boolean not null default false,
  boost_expires_at timestamptz,
  available_slots text[] not null default '{}',
  bio text,
  slmc_document_name text,
  deactivated_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_bookings (
  id text primary key,
  client_id text not null,
  client_name text not null,
  client_phone text,
  client_nic text,
  psychiatrist_id text not null,
  psychiatrist_name text not null,
  scheduled_date date not null,
  scheduled_time text not null,
  fee integer not null,
  commission integer not null,
  total integer not null,
  status text not null check (status in ('pending_payment', 'paid', 'cancelled', 'refunded', 'completed')),
  meeting_link text not null,
  clinical_notes text,
  video_room_used_at timestamptz,
  patient_video_room_used_at timestamptz,
  doctor_video_room_used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_bookings
  add column if not exists video_room_used_at timestamptz,
  add column if not exists patient_video_room_used_at timestamptz,
  add column if not exists doctor_video_room_used_at timestamptz;

create table if not exists public.app_complaints (
  id text primary key,
  booking_id text not null,
  submitted_by text not null check (submitted_by in ('client', 'psychiatrist')),
  user_name text not null,
  user_role text not null,
  notes text not null,
  complaint_date date not null default current_date,
  status text not null default 'pending' check (status in ('pending', 'resolved')),
  resolution_details text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_consultation_messages (
  id text primary key,
  booking_id text not null,
  sender text not null check (sender in ('doctor', 'patient')),
  message_text text not null,
  sent_at timestamptz not null default now(),
  attachment jsonb
);

create table if not exists public.app_sms_messages (
  id text primary key,
  recipient text not null,
  content text not null,
  message_time text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_system_config (
  id text primary key default 'default',
  commission_rate integer not null default 18,
  sms_gateway_url text not null default 'https://api.notify.lk/send',
  sms_sender_id text not null default 'PsyNovaSMS',
  lanka_pay_enabled boolean not null default true,
  card_payment_enabled boolean not null default true,
  reminder_lead_hours integer not null default 24,
  boost_package_lkr integer not null default 5000,
  admin_accounts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.app_system_config (id)
values ('default')
on conflict (id) do nothing;

alter table public.app_clients enable row level security;
alter table public.app_psychiatrists enable row level security;
alter table public.app_bookings enable row level security;
alter table public.app_complaints enable row level security;
alter table public.app_consultation_messages enable row level security;
alter table public.app_sms_messages enable row level security;
alter table public.app_system_config enable row level security;

create index if not exists app_psychiatrists_verified_idx on public.app_psychiatrists(slmc_verified);
create index if not exists app_bookings_client_id_idx on public.app_bookings(client_id);
create index if not exists app_bookings_psychiatrist_id_idx on public.app_bookings(psychiatrist_id);
create index if not exists app_complaints_status_idx on public.app_complaints(status);
create index if not exists app_consultation_messages_booking_id_idx on public.app_consultation_messages(booking_id);
