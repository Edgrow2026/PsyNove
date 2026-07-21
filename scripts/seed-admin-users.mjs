import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const DEFAULTS = {
  admin: {
    email: 'admin@psynova.lk',
    password: 'PsyNovaAdmin#2026',
    fullName: 'PsyNova Admin',
    phone: '+94110000001',
    district: 'Colombo',
  },
  superadmin: {
    email: 'superadmin@psynova.lk',
    password: 'PsyNovaSuper#2026',
    fullName: 'PsyNova Super Admin',
    phone: '+94110000002',
    district: 'Colombo',
  },
};

function loadEnvFile(fileName) {
  const filePath = resolve(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Add it to .env.local before running this seed.`);
  }

  return value;
}

function pickRoleConfig(role) {
  const prefix = role === 'superadmin' ? 'SUPERADMIN' : 'ADMIN';
  const fallback = DEFAULTS[role];

  return {
    role,
    email: process.env[`${prefix}_EMAIL`] || fallback.email,
    password: process.env[`${prefix}_PASSWORD`] || fallback.password,
    fullName: process.env[`${prefix}_NAME`] || fallback.fullName,
    phone: process.env[`${prefix}_PHONE`] || fallback.phone,
    district: process.env[`${prefix}_DISTRICT`] || fallback.district,
  };
}

async function findUserByEmail(admin, email) {
  const normalizedEmail = email.toLowerCase();

  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;

    const match = data.users.find((user) => user.email?.toLowerCase() === normalizedEmail);
    if (match) return match;
    if (data.users.length < 1000) return null;
  }

  throw new Error(`Could not find ${email}; auth user list is larger than seed search limit.`);
}

async function upsertRoleUser(admin, config) {
  const userMetadata = {
    full_name: config.fullName,
    phone: config.phone,
    role: config.role,
    district: config.district,
  };

  let user = await findUserByEmail(admin, config.email);

  if (user) {
    const { data, error } = await admin.auth.admin.updateUserById(user.id, {
      email: config.email,
      password: config.password,
      email_confirm: true,
      user_metadata: userMetadata,
    });
    if (error) throw error;
    user = data.user;
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email: config.email,
      password: config.password,
      email_confirm: true,
      user_metadata: userMetadata,
    });
    if (error) throw error;
    user = data.user;
  }

  const { error: profileError } = await admin.from('profiles').upsert(
    {
      id: user.id,
      full_name: config.fullName,
      phone: config.phone,
      email: config.email,
      role: config.role,
      district: config.district,
    },
    { onConflict: 'id' },
  );

  if (profileError) throw profileError;

  return {
    role: config.role,
    email: config.email,
    password: config.password,
    userId: user.id,
  };
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const supabaseUrl = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (serviceRoleKey.startsWith('sb_publishable_')) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is using the publishable key. Use the Supabase service_role/secret key from Project Settings > API.',
    );
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const results = [];
  for (const role of ['admin', 'superadmin']) {
    results.push(await upsertRoleUser(admin, pickRoleConfig(role)));
  }

  console.log('\nSeed complete. Use these private accounts for admin login:\n');
  for (const result of results) {
    console.log(`${result.role.toUpperCase()}`);
    console.log(`  email: ${result.email}`);
    console.log(`  password: ${result.password}`);
    console.log(`  user id: ${result.userId}\n`);
  }
}

main().catch((error) => {
  console.error(`Seed failed: ${error.message}`);
  process.exit(1);
});
