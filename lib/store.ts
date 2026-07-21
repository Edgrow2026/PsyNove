import { Language } from './translations';

export interface Psychiatrist {
  id: string;
  name: string;
  photo: string;
  qualifications: string;
  specializations: string[];
  languages: ('Sinhala' | 'Tamil' | 'English')[];
  district: string;
  fee: number; // LKR
  slmcNumber: string;
  slmcVerified: boolean;
  isBoosted: boolean;
  boostExpiresAt?: string;
  availableSlots: string[]; // ISO string of datetimes
  bio: string;
  slmcDocumentName?: string;
  deactivatedAt?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  nic: string;
  phone: string;
  email: string;
  district: string;
  languages: string[];
  password?: string;
  suspended?: boolean;
  deactivatedAt?: string; // ISO string if deactivated
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientNIC: string;
  psychiatristId: string;
  psychiatristName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  fee: number;
  commission: number;
  total: number;
  status: 'pending_payment' | 'paid' | 'cancelled' | 'refunded' | 'completed';
  meetingLink: string;
  clinicalNotes?: string;
}

export interface Complaint {
  id: string;
  bookingId: string;
  submittedBy: 'client' | 'psychiatrist';
  userName: string;
  userRole: string;
  notes: string;
  date: string;
  status: 'pending' | 'resolved';
  resolutionDetails?: string;
}

export interface SystemConfig {
  commissionRate: number; // 15 to 20
  smsGatewayUrl: string;
  smsSenderId: string;
  lankaPayEnabled: boolean;
  cardPaymentEnabled: boolean;
  reminderLeadHours: number;
  boostPackageLkr: number;
  adminAccounts: { id: string; name: string; role: string; permissions: string[] }[];
}

export interface AppState {
  currentLanguage: Language;
  languagePreferenceSet?: boolean;
  currentRole: 'guest' | 'client' | 'psychiatrist' | 'admin' | 'superadmin';
  loggedInUserId: string | null;
  psychiatrists: Psychiatrist[];
  clients: ClientProfile[];
  bookings: Booking[];
  complaints: Complaint[];
  config: SystemConfig;
  smsInbox: { id: string; recipient: string; content: string; date: string }[];
}

const INITIAL_PSYCHIATRISTS: Psychiatrist[] = [
  {
    id: "psy-1",
    name: "Dr. Ruwan M. Fernando",
    photo: "https://picsum.photos/seed/docruwan/300/300",
    qualifications: "MBBS, MD (Psychiatry), MRCPsych (UK)",
    specializations: ["Depression", "Anxiety Disorders", "Cognitive Behavioral Therapy (CBT)"],
    languages: ["Sinhala", "English"],
    district: "Colombo",
    fee: 4500,
    slmcNumber: "SLMC-PSY-48291",
    slmcVerified: true,
    isBoosted: true,
    availableSlots: ["2026-07-20T09:00", "2026-07-20T14:30", "2026-07-21T10:00"],
    bio: "Senior consultant psychiatrist with over 15 years of experience in clinical psychiatry and cognitive therapies at the National Institute of Mental Health."
  },
  {
    id: "psy-2",
    name: "Dr. Sivakumar Jeyakumar",
    photo: "https://picsum.photos/seed/docsiva/300/300",
    qualifications: "MBBS, MD (Psychiatry), Board Certified Specialist",
    specializations: ["ADHD", "Child & Adolescent Psychiatry", "Mood Disorders"],
    languages: ["Tamil", "English"],
    district: "Jaffna",
    fee: 4000,
    slmcNumber: "SLMC-PSY-12903",
    slmcVerified: true,
    isBoosted: true,
    availableSlots: ["2026-07-20T11:00", "2026-07-22T16:00"],
    bio: "Dedicated child and adult psychiatrist specializing in cognitive assessments, emotional regulation, and family-centered psychiatric support."
  },
  {
    id: "psy-3",
    name: "Dr. Fathima Rizna",
    photo: "https://picsum.photos/seed/docrizna/300/300",
    qualifications: "MBBS, DPM (Psychiatry), Consultant Psychotherapist",
    specializations: ["PTSD & Trauma Recovery", "Panic Attacks", "Obsessive-Compulsive Disorder (OCD)"],
    languages: ["Sinhala", "Tamil", "English"],
    district: "Kandy",
    fee: 5000,
    slmcNumber: "SLMC-PSY-77210",
    slmcVerified: true,
    isBoosted: true,
    availableSlots: ["2026-07-21T09:00", "2026-07-23T15:00"],
    bio: "Compassionate practitioner focusing on trauma-informed therapy, stress reduction, and integrated therapeutic interventions."
  },
  {
    id: "psy-4",
    name: "Dr. Ananda Wijesinghe",
    photo: "https://picsum.photos/seed/docananda/300/300",
    qualifications: "MBBS, MD (Psychiatry)",
    specializations: ["Addiction Recovery", "Bipolar Disorder", "Stress Management"],
    languages: ["Sinhala"],
    district: "Kurunegala",
    fee: 3500,
    slmcNumber: "SLMC-PSY-55412",
    slmcVerified: true,
    isBoosted: false,
    availableSlots: ["2026-07-20T10:00", "2026-07-22T14:00"],
    bio: "Experienced specialist in chemical dependencies, substance abuse intervention, and mood-stabilizing clinical therapies."
  },
  {
    id: "psy-5",
    name: "Dr. Dharshini Selvaraj",
    photo: "https://picsum.photos/seed/docdharshi/300/300",
    qualifications: "MBBS, MD (Psychiatry)",
    specializations: ["General Anxiety", "Women's Mental Health", "Geriatric Psychiatry"],
    languages: ["Tamil", "Sinhala"],
    district: "Batticaloa",
    fee: 4200,
    slmcNumber: "SLMC-PSY-30912",
    slmcVerified: true,
    isBoosted: false,
    availableSlots: ["2026-07-21T13:00", "2026-07-24T16:00"],
    bio: "Focusing on community outreach, postnatal depression, age-related dementia counselling, and customized support plans."
  },
  {
    id: "psy-6",
    name: "Dr. Priyantha Jayasuriya",
    photo: "https://picsum.photos/seed/docpriyantha/300/300",
    qualifications: "MBBS, MD, FCPS",
    specializations: ["Schizophrenia Management", "Psychosomatic Disorders"],
    languages: ["Sinhala", "English"],
    district: "Gampaha",
    fee: 4800,
    slmcNumber: "SLMC-PSY-99120",
    slmcVerified: false, // Pending verification to show approval flow!
    isBoosted: false,
    availableSlots: ["2026-07-22T09:00", "2026-07-23T10:00"],
    bio: "Specialist focusing on acute psychotic disorder treatments, outpatient follow-ups, and family counseling modules."
  }
];

const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "client-1",
    name: "Kavindu Wickramasinghe",
    nic: "199428392019V",
    phone: "+94771234567",
    email: "kavindu@gmail.com",
    district: "Colombo",
    languages: ["Sinhala", "English"],
    password: "123456"
  },
  {
    id: "client-2",
    name: "Tharushi Perera",
    nic: "199859203912",
    phone: "+94719876543",
    email: "tharushi@gmail.com",
    district: "Gampaha",
    languages: ["Sinhala"],
    password: "123456"
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-101",
    clientId: "client-1",
    clientName: "Kavindu Wickramasinghe",
    clientPhone: "+94771234567",
    clientNIC: "199428392019V",
    psychiatristId: "psy-1",
    psychiatristName: "Dr. Ruwan M. Fernando",
    date: "2026-07-20",
    time: "10:00 AM",
    fee: 4500,
    commission: 810, // 18%
    total: 5310,
    status: "paid",
    meetingLink: "https://meet.jit.si/PsyNova-Consult-Ruwan-Kavindu",
  },
  {
    id: "bk-102",
    clientId: "client-2",
    clientName: "Tharushi Perera",
    clientPhone: "+94719876543",
    clientNIC: "199859203912",
    psychiatristId: "psy-3",
    psychiatristName: "Dr. Fathima Rizna",
    date: "2026-07-22",
    time: "02:30 PM",
    fee: 5000,
    commission: 900, // 18%
    total: 5900,
    status: "completed",
    meetingLink: "https://meet.jit.si/PsyNova-Consult-Rizna-Tharushi",
    clinicalNotes: "Patient displays signs of moderate generalized anxiety. Prescribed lifestyle adaptations, deep-breathing cycles, and scheduled a 2-week follow-up."
  }
];

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: "cmp-201",
    bookingId: "bk-102",
    submittedBy: "client",
    userName: "Tharushi Perera",
    userRole: "Client",
    notes: "Audio cut out for several minutes during the second half of the consultation.",
    date: "2026-07-14",
    status: "pending"
  }
];

const DEFAULT_STATE: AppState = {
  currentLanguage: 'si',
  languagePreferenceSet: false,
  currentRole: 'guest',
  loggedInUserId: null,
  psychiatrists: INITIAL_PSYCHIATRISTS,
  clients: INITIAL_CLIENTS,
  bookings: INITIAL_BOOKINGS,
  complaints: INITIAL_COMPLAINTS,
  config: {
    commissionRate: 18, // defaults to 18% (within the 15-20% band)
    smsGatewayUrl: "https://api.notify.lk/send",
    smsSenderId: "PsyNovaSMS",
    lankaPayEnabled: true,
    cardPaymentEnabled: true,
    reminderLeadHours: 24,
    boostPackageLkr: 5000,
    adminAccounts: [
      {
        id: "admin-1",
        name: "Platform Admin",
        role: "Compliance Officer",
        permissions: ["SLMC verification", "Refund approval", "Complaint resolution"]
      }
    ]
  },
  smsInbox: []
};

// Vanilla global store object for Client Components compatibility
class StateStore {
  private state: AppState = DEFAULT_STATE;
  private listeners: (() => void)[] = [];
  private hydrated = false;

  private hydrateFromBrowser() {
    if (this.hydrated || typeof window === 'undefined') return;
    this.hydrated = true;

    const stored = localStorage.getItem('psynova_store');
    if (stored) {
      try {
        this.state = JSON.parse(stored);
        if (!this.state.languagePreferenceSet) {
          this.state.currentLanguage = 'si';
          this.save();
        }
      } catch (e) {
        console.error("Failed to parse store, resetting", e);
        this.state = { ...DEFAULT_STATE };
        localStorage.setItem('psynova_store', JSON.stringify(this.state));
      }
    } else {
      localStorage.setItem('psynova_store', JSON.stringify(this.state));
    }

    this.notify();
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    this.hydrateFromBrowser();
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('psynova_store', JSON.stringify(this.state));
    }
    this.notify();
  }

  public setLanguage(lang: Language) {
    this.state.currentLanguage = lang;
    this.state.languagePreferenceSet = true;
    this.save();
  }

  public loginClient(phone: string, password: string): boolean {
    const client = this.state.clients.find(c => c.phone === phone && c.password === password && !c.suspended);
    if (!client) return false;
    this.setRole('client', client.id);
    return true;
  }

  public setRole(role: 'guest' | 'client' | 'psychiatrist' | 'admin' | 'superadmin', userId: string | null = null) {
    this.state.currentRole = role;
    this.state.loggedInUserId = userId;
    this.save();
  }

  public syncAuthenticatedProfile(profile: {
    id: string;
    role: 'client' | 'psychiatrist' | 'admin' | 'superadmin';
    full_name: string | null;
    phone: string | null;
    email: string | null;
    district: string | null;
  }) {
    if (profile.role === 'client') {
      const existing = this.state.clients.find(c => c.id === profile.id);
      const clientProfile: ClientProfile = {
        id: profile.id,
        name: profile.full_name || 'PsyNova Client',
        nic: existing?.nic || '',
        phone: profile.phone || '',
        email: profile.email || '',
        district: profile.district || 'Colombo',
        languages: existing?.languages || ['Sinhala'],
        password: existing?.password,
        suspended: existing?.suspended,
        deactivatedAt: existing?.deactivatedAt,
      };

      this.state.clients = existing
        ? this.state.clients.map(client => client.id === profile.id ? clientProfile : client)
        : [clientProfile, ...this.state.clients];
    }

    if (profile.role === 'psychiatrist') {
      const existing = this.state.psychiatrists.find(d => d.id === profile.id);
      const doctorProfile: Psychiatrist = {
        id: profile.id,
        name: profile.full_name || 'PsyNova Psychiatrist',
        photo: existing?.photo || `https://picsum.photos/seed/${profile.id}/300/300`,
        qualifications: existing?.qualifications || 'Pending qualifications review',
        specializations: existing?.specializations || ['General Psychiatry'],
        languages: existing?.languages || ['Sinhala'],
        district: profile.district || 'Colombo',
        fee: existing?.fee || 3500,
        slmcNumber: existing?.slmcNumber || 'Pending SLMC',
        slmcVerified: existing?.slmcVerified || false,
        isBoosted: existing?.isBoosted || false,
        boostExpiresAt: existing?.boostExpiresAt,
        availableSlots: existing?.availableSlots || [],
        bio: existing?.bio || 'Profile pending admin verification.',
        slmcDocumentName: existing?.slmcDocumentName,
        deactivatedAt: existing?.deactivatedAt,
      };

      this.state.psychiatrists = existing
        ? this.state.psychiatrists.map(doctor => doctor.id === profile.id ? doctorProfile : doctor)
        : [doctorProfile, ...this.state.psychiatrists];
    }

    this.state.currentRole = profile.role;
    this.state.loggedInUserId = profile.id;
    this.save();
  }

  // Doctor functions
  public registerDoctor(doc: Omit<Psychiatrist, 'id' | 'slmcVerified' | 'isBoosted' | 'availableSlots'>) {
    const id = `psy-${Date.now()}`;
    const newDoc: Psychiatrist = {
      ...doc,
      id,
      slmcVerified: false, // must be verified by admin
      isBoosted: false,
      availableSlots: [
        new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10) + "T10:00",
        new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10) + "T14:30"
      ]
    };
    this.state.psychiatrists.push(newDoc);
    this.setRole('psychiatrist', id);
    this.save();
    return newDoc;
  }

  public updateDoctor(updated: Psychiatrist) {
    this.state.psychiatrists = this.state.psychiatrists.map(d => d.id === updated.id ? updated : d);
    this.save();
  }

  public updateDoctorProfile(docId: string, updates: Partial<Psychiatrist>) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      Object.assign(doc, updates);
      this.save();
    }
  }

  public addSlot(docId: string, slot: string) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      if (!doc.availableSlots.includes(slot)) {
        doc.availableSlots.push(slot);
        doc.availableSlots.sort();
        this.save();
      }
    }
  }

  public purchaseBoost(docId: string) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      doc.isBoosted = true;
      doc.boostExpiresAt = new Date(Date.now() + 7 * 86400000).toISOString();
      this.save();
    }
  }

  public deactivateDoctor(docId: string) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      doc.deactivatedAt = new Date().toISOString();
      this.save();
    }
  }

  // Client functions
  public registerClient(cli: Omit<ClientProfile, 'id'>) {
    const id = `client-${Date.now()}`;
    const newCli: ClientProfile = { ...cli, id };
    this.state.clients.push(newCli);
    this.setRole('client', id);
    this.save();
    return newCli;
  }

  public deactivateClient(clientId: string) {
    const cli = this.state.clients.find(c => c.id === clientId);
    if (cli) {
      cli.deactivatedAt = new Date().toISOString();
      this.save();
    }
  }

  public updateClient(clientId: string, updates: Partial<ClientProfile>) {
    const cli = this.state.clients.find(c => c.id === clientId);
    if (cli) {
      Object.assign(cli, updates);
      this.save();
    }
  }

  public setClientSuspended(clientId: string, suspended: boolean) {
    const cli = this.state.clients.find(c => c.id === clientId);
    if (cli) {
      cli.suspended = suspended;
      this.save();
    }
  }

  // Bookings
  public createBooking(bookingData: Omit<Booking, 'id' | 'meetingLink'>) {
    const id = `bk-${Math.floor(100 + Math.random() * 900)}`;
    const meetingLink = `https://meet.jit.si/PsyNova-Consult-${bookingData.psychiatristId}-${bookingData.clientId}`;
    const newBooking: Booking = {
      ...bookingData,
      id,
      meetingLink
    };
    this.state.bookings.push(newBooking);

    // Send simulated SMS confirmations
    this.sendSimulatedSMS(
      bookingData.clientPhone,
      `[PsyNova] Booking Confirmed! Dr. ${bookingData.psychiatristName} consultation scheduled on ${bookingData.date} at ${bookingData.time}. Room Link: ${meetingLink}`
    );

    const doc = this.state.psychiatrists.find(d => d.id === bookingData.psychiatristId);
    if (doc) {
      // Remove booked slot
      const bookedSlotStr = `${bookingData.date}T${bookingData.time}`;
      doc.availableSlots = doc.availableSlots.filter(slot => !slot.includes(bookedSlotStr));
    }

    this.save();
    return newBooking;
  }

  public cancelBooking(bookingId: string) {
    const b = this.state.bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = 'cancelled';
      this.save();
    }
  }

  public refundBooking(bookingId: string) {
    const b = this.state.bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = 'refunded';
      this.sendSimulatedSMS(
        b.clientPhone,
        `[PsyNova] Refund approved for booking #${b.id}. The payment gateway settlement is now marked for manual processing.`
      );
      this.save();
    }
  }

  public sendAppointmentReminder(bookingId: string) {
    const b = this.state.bookings.find(x => x.id === bookingId);
    if (b) {
      this.sendSimulatedSMS(
        b.clientPhone,
        `[PsyNova] Reminder: Your consultation with ${b.psychiatristName} is scheduled on ${b.date} at ${b.time}. Link: ${b.meetingLink}`
      );
    }
    this.save();
  }

  public completeBooking(bookingId: string, notes: string) {
    const b = this.state.bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = 'completed';
      b.clinicalNotes = notes;
      this.save();
    }
  }

  // Complaints
  public submitComplaint(complaintData: Omit<Complaint, 'id' | 'date' | 'status'>) {
    const id = `cmp-${Math.floor(200 + Math.random() * 800)}`;
    const newCmp: Complaint = {
      ...complaintData,
      id,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending'
    };
    this.state.complaints.push(newCmp);

    // Send SMS notification
    const userPhone = complaintData.submittedBy === 'client' 
      ? this.state.bookings.find(b => b.id === complaintData.bookingId)?.clientPhone 
      : "+94770000000"; // Mock Doctor phone or similar
    
    if (userPhone) {
      this.sendSimulatedSMS(
        userPhone,
        `[PsyNova] Complaint logged under Ticket #${id}. PsyNova Support will resolve this manually and contact you within 24 hours.`
      );
    }

    this.save();
    return newCmp;
  }

  public resolveComplaint(id: string, resolution: string) {
    const cmp = this.state.complaints.find(c => c.id === id);
    if (cmp) {
      cmp.status = 'resolved';
      cmp.resolutionDetails = resolution;
      this.sendSimulatedSMS(
        "+94770000000",
        `[PsyNova] Complaint #${id} resolved. Decision: ${resolution}`
      );
      this.save();
    }
  }

  // Admin Configs
  public updateConfig(newConfig: Partial<SystemConfig>) {
    this.state.config = { ...this.state.config, ...newConfig };
    this.save();
  }

  public addAdminAccount(name: string, role: string, permissions: string[]) {
    this.state.config.adminAccounts.push({
      id: `admin-${Date.now()}`,
      name,
      role,
      permissions
    });
    this.save();
  }

  public approveDoctor(docId: string) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      doc.slmcVerified = true;
      this.save();
    }
  }

  public toggleDoctorVerification(docId: string) {
    const doc = this.state.psychiatrists.find(d => d.id === docId);
    if (doc) {
      doc.slmcVerified = !doc.slmcVerified;
      this.save();
    }
  }

  // Simulated SMS Trigger
  private sendSimulatedSMS(recipient: string, content: string) {
    this.state.smsInbox.unshift({
      id: `sms-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      recipient,
      content,
      date: new Date().toLocaleTimeString()
    });
  }

  public clearSMS() {
    this.state.smsInbox = [];
    this.save();
  }
}

let storeInstance: StateStore;
if (typeof window !== 'undefined') {
  if (!(window as any).__psynova_store__) {
    (window as any).__psynova_store__ = new StateStore();
  }
  storeInstance = (window as any).__psynova_store__;
} else {
  storeInstance = new StateStore();
}

export const store = storeInstance;
export default store;
