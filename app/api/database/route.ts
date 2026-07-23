import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { AppState, Booking, ClientProfile, Complaint, Psychiatrist, SystemConfig } from '@/lib/store';

type AdminClient = ReturnType<typeof getSupabaseAdmin>;

async function ensureNoError(result: any) {
  const resolved = await result;
  if (resolved.error) throw resolved.error;
}

function doctorToRow(doctor: Psychiatrist) {
  return {
    id: doctor.id,
    name: doctor.name,
    photo: doctor.photo,
    qualifications: doctor.qualifications,
    specializations: doctor.specializations,
    languages: doctor.languages,
    district: doctor.district,
    fee: doctor.fee,
    slmc_number: doctor.slmcNumber,
    slmc_verified: doctor.slmcVerified,
    is_boosted: doctor.isBoosted,
    boost_expires_at: doctor.boostExpiresAt || null,
    available_slots: doctor.availableSlots,
    bio: doctor.bio,
    slmc_document_name: doctor.slmcDocumentName || null,
    deactivated_at: doctor.deactivatedAt || null,
    updated_at: new Date().toISOString(),
  };
}

function rowToDoctor(row: any): Psychiatrist {
  return {
    id: row.id,
    name: row.name,
    photo: row.photo || `https://picsum.photos/seed/${row.id}/300/300`,
    qualifications: row.qualifications || 'Pending qualifications review',
    specializations: row.specializations || [],
    languages: row.languages || ['Sinhala'],
    district: row.district || 'Colombo',
    fee: row.fee || 0,
    slmcNumber: row.slmc_number || '',
    slmcVerified: row.slmc_verified || false,
    isBoosted: row.is_boosted || false,
    boostExpiresAt: row.boost_expires_at || undefined,
    availableSlots: row.available_slots || [],
    bio: row.bio || '',
    slmcDocumentName: row.slmc_document_name || undefined,
    deactivatedAt: row.deactivated_at || undefined,
  };
}

function clientToRow(client: ClientProfile) {
  return {
    id: client.id,
    name: client.name,
    nic: client.nic,
    phone: client.phone,
    email: client.email,
    district: client.district,
    languages: client.languages,
    suspended: client.suspended || false,
    deactivated_at: client.deactivatedAt || null,
    updated_at: new Date().toISOString(),
  };
}

function rowToClient(row: any): ClientProfile {
  return {
    id: row.id,
    name: row.name,
    nic: row.nic || '',
    phone: row.phone || '',
    email: row.email || '',
    district: row.district || 'Colombo',
    languages: row.languages || ['Sinhala'],
    suspended: row.suspended || false,
    deactivatedAt: row.deactivated_at || undefined,
  };
}

function bookingToRow(booking: Booking) {
  return {
    id: booking.id,
    client_id: booking.clientId,
    client_name: booking.clientName,
    client_phone: booking.clientPhone,
    client_nic: booking.clientNIC,
    psychiatrist_id: booking.psychiatristId,
    psychiatrist_name: booking.psychiatristName,
    scheduled_date: booking.date,
    scheduled_time: booking.time,
    fee: booking.fee,
    commission: booking.commission,
    total: booking.total,
    status: booking.status,
    meeting_link: booking.meetingLink,
    clinical_notes: booking.clinicalNotes || null,
    updated_at: new Date().toISOString(),
  };
}

function rowToBooking(row: any): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    clientName: row.client_name,
    clientPhone: row.client_phone || '',
    clientNIC: row.client_nic || '',
    psychiatristId: row.psychiatrist_id,
    psychiatristName: row.psychiatrist_name,
    date: row.scheduled_date,
    time: row.scheduled_time,
    fee: row.fee,
    commission: row.commission,
    total: row.total,
    status: row.status,
    meetingLink: row.meeting_link,
    clinicalNotes: row.clinical_notes || undefined,
  };
}

function complaintToRow(complaint: Complaint) {
  return {
    id: complaint.id,
    booking_id: complaint.bookingId,
    submitted_by: complaint.submittedBy,
    user_name: complaint.userName,
    user_role: complaint.userRole,
    notes: complaint.notes,
    complaint_date: complaint.date,
    status: complaint.status,
    resolution_details: complaint.resolutionDetails || null,
    updated_at: new Date().toISOString(),
  };
}

function rowToComplaint(row: any): Complaint {
  return {
    id: row.id,
    bookingId: row.booking_id,
    submittedBy: row.submitted_by,
    userName: row.user_name,
    userRole: row.user_role,
    notes: row.notes,
    date: row.complaint_date,
    status: row.status,
    resolutionDetails: row.resolution_details || undefined,
  };
}

function configToRow(config: SystemConfig) {
  return {
    id: 'default',
    commission_rate: config.commissionRate,
    sms_gateway_url: config.smsGatewayUrl,
    sms_sender_id: config.smsSenderId,
    lanka_pay_enabled: config.lankaPayEnabled,
    card_payment_enabled: config.cardPaymentEnabled,
    reminder_lead_hours: config.reminderLeadHours,
    boost_package_lkr: config.boostPackageLkr,
    admin_accounts: config.adminAccounts,
    updated_at: new Date().toISOString(),
  };
}

function rowToConfig(row: any): SystemConfig {
  return {
    commissionRate: row.commission_rate,
    smsGatewayUrl: row.sms_gateway_url,
    smsSenderId: row.sms_sender_id,
    lankaPayEnabled: row.lanka_pay_enabled,
    cardPaymentEnabled: row.card_payment_enabled,
    reminderLeadHours: row.reminder_lead_hours,
    boostPackageLkr: row.boost_package_lkr,
    adminAccounts: row.admin_accounts || [],
  };
}

async function upsertSnapshot(admin: AdminClient, state: Partial<AppState>) {
  if (state.psychiatrists?.length) {
    const { error } = await admin.from('app_psychiatrists').upsert(state.psychiatrists.map(doctorToRow));
    if (error) throw error;
  }

  if (state.clients?.length) {
    const { error } = await admin.from('app_clients').upsert(state.clients.map(clientToRow));
    if (error) throw error;
  }

  if (state.bookings?.length) {
    const { error } = await admin.from('app_bookings').upsert(state.bookings.map(bookingToRow));
    if (error) throw error;
  }

  if (state.complaints?.length) {
    const { error } = await admin.from('app_complaints').upsert(state.complaints.map(complaintToRow));
    if (error) throw error;
  }

  if (state.smsInbox?.length) {
    const { error } = await admin.from('app_sms_messages').upsert(
      state.smsInbox.map((sms) => ({
        id: sms.id,
        recipient: sms.recipient,
        content: sms.content,
        message_time: sms.date,
      })),
    );
    if (error) throw error;
  }

  if (state.config) {
    const { error } = await admin.from('app_system_config').upsert(configToRow(state.config));
    if (error) throw error;
  }
}

export async function GET() {
  try {
    const admin = getSupabaseAdmin();
    const [doctors, clients, bookings, complaints, config, sms] = await Promise.all([
      admin.from('app_psychiatrists').select('*').order('updated_at', { ascending: false }),
      admin.from('app_clients').select('*').order('updated_at', { ascending: false }),
      admin.from('app_bookings').select('*').order('created_at', { ascending: false }),
      admin.from('app_complaints').select('*').order('created_at', { ascending: false }),
      admin.from('app_system_config').select('*').eq('id', 'default').maybeSingle(),
      admin.from('app_sms_messages').select('*').order('created_at', { ascending: false }),
    ]);

    const firstError = [doctors.error, clients.error, bookings.error, complaints.error, config.error, sms.error].find(Boolean);
    if (firstError) throw firstError;

    const hasDatabaseRows = Boolean(
      doctors.data?.length ||
      clients.data?.length ||
      bookings.data?.length ||
      complaints.data?.length ||
      sms.data?.length,
    );

    return NextResponse.json({
      hasDatabaseRows,
      psychiatrists: doctors.data?.map(rowToDoctor) || [],
      clients: clients.data?.map(rowToClient) || [],
      bookings: bookings.data?.map(rowToBooking) || [],
      complaints: complaints.data?.map(rowToComplaint) || [],
      config: config.data ? rowToConfig(config.data) : undefined,
      smsInbox:
        sms.data?.map((message: any) => ({
          id: message.id,
          recipient: message.recipient,
          content: message.content,
          date: message.message_time,
        })) || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to load database state.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, payload } = await request.json();
    const admin = getSupabaseAdmin();

    switch (action) {
      case 'replaceSnapshot':
        await upsertSnapshot(admin, payload);
        break;
      case 'syncProfile':
        if (payload.role === 'client') {
          await ensureNoError(admin.from('app_clients').upsert(clientToRow(payload.client)));
        } else if (payload.role === 'psychiatrist') {
          await ensureNoError(admin.from('app_psychiatrists').upsert(doctorToRow(payload.doctor)));
        } else if (payload.config) {
          await ensureNoError(admin.from('app_system_config').upsert(configToRow(payload.config)));
        }
        break;
      case 'upsertDoctor':
        await ensureNoError(admin.from('app_psychiatrists').upsert(doctorToRow(payload)));
        break;
      case 'upsertClient':
        await ensureNoError(admin.from('app_clients').upsert(clientToRow(payload)));
        break;
      case 'upsertBooking':
        await ensureNoError(admin.from('app_bookings').upsert(bookingToRow(payload)));
        break;
      case 'upsertComplaint':
        await ensureNoError(admin.from('app_complaints').upsert(complaintToRow(payload)));
        break;
      case 'updateConfig':
        await ensureNoError(admin.from('app_system_config').upsert(configToRow(payload)));
        break;
      case 'insertSms':
        await ensureNoError(admin.from('app_sms_messages').upsert({
          id: payload.id,
          recipient: payload.recipient,
          content: payload.content,
          message_time: payload.date,
        }));
        break;
      case 'clearSms':
        await ensureNoError(admin.from('app_sms_messages').delete().neq('id', ''));
        break;
      default:
        return NextResponse.json({ error: 'Unknown database action.' }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error
              ? JSON.stringify(error)
              : 'Unable to sync database state.',
      },
      { status: 500 },
    );
  }
}
