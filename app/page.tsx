'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import SimulatorSettings from '../components/SimulatorSettings';
import PwaRegister from '../components/PwaRegister';
import ClientRegistrationModal from '../components/booking/ClientRegistrationModal';
import ComplaintModal from '../components/booking/ComplaintModal';
import PaymentModal from '../components/payment/PaymentModal';
import SessionReportModal from '../components/consultation/SessionReportModal';
import VideoRoomModal from '../components/consultation/VideoRoomModal';
import { store, AppState, Psychiatrist, Booking, Complaint, ClientProfile } from '../lib/store';
import { translations, Language } from '../lib/translations';
import { 
  Search, Calendar, MapPin, Globe, UserCheck, DollarSign, 
  CheckCircle2, ShieldAlert, Plus, Star, Trash2, 
  TrendingUp, BarChart3, FileSpreadsheet, AlertTriangle, 
  Activity, Video, UserX, AlertCircle, HeartHandshake
} from 'lucide-react';

export default function HomePage() {
  const [state, setState] = useState<AppState>(() => store.getState());

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [maxFee, setMaxFee] = useState<number>(6000);

  // Modal / Interaction State
  const [selectedDoc, setSelectedDoc] = useState<Psychiatrist | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);
  
  // Registration Flow (Triggered when unauthenticated books a slot)
  const [showRegisterFlow, setShowRegisterFlow] = useState(false);
  const [regName, setRegName] = useState('');
  const [regNIC, setRegNIC] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDistrict, setRegDistrict] = useState('Colombo');
  const [regLanguages, setRegLanguages] = useState<string[]>(['Sinhala']);
  const [regPassword, setRegPassword] = useState('');

  // Doctor Registration Form
  const [docName, setDocName] = useState('');
  const [docSLMC, setDocSLMC] = useState('');
  const [docSLMCDocument, setDocSLMCDocument] = useState('');
  const [docFee, setDocFee] = useState<number>(3500);
  const [docDistrict, setDocDistrict] = useState('Colombo');
  const [docLanguages, setDocLanguages] = useState<('Sinhala' | 'Tamil' | 'English')[]>(['Sinhala']);
  const [docQualifications, setDocQualifications] = useState('');
  const [docBio, setDocBio] = useState('');

  // Payment Flow State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCountdown, setPaymentCountdown] = useState(300);
  const [paymentPendingBooking, setPaymentPendingBooking] = useState<{
    docId: string;
    docName: string;
    fee: number;
    date: string;
    time: string;
  } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'lankapay' | 'card'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [payStatus, setPayStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  // Doctor Calendar Slot State
  const [newSlotDateTime, setNewSlotDateTime] = useState('');

  // Active Session state
  const [activeSessionRoom, setActiveSessionRoom] = useState<Booking | null>(null);
  const [activeVideoRoom, setActiveVideoRoom] = useState<Booking | null>(null);
  const [sessionReportNotes, setSessionReportNotes] = useState('');
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState(false);

  // Complaints / Reports
  const [activeComplaintBooking, setActiveComplaintBooking] = useState<Booking | null>(null);
  const [complaintNotes, setComplaintNotes] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Admin / Settings Inputs
  const [commissionInput, setCommissionInput] = useState<number>(18);
  const [adminResolutionInput, setAdminResolutionInput] = useState<Record<string, string>>({});

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const s = store.getState();
      setState({ ...s });
    });
    return unsub;
  }, []);

  const t = translations[state.currentLanguage];
  const lang = state.currentLanguage;

  // Filter and Search Logic
  const filteredDoctors = state.psychiatrists.filter(doc => {
    // Search input (Name or qualifications)
    const matchSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());
    
    // District Filter
    const matchDistrict = selectedDistrict === '' || doc.district === selectedDistrict;

    // Doctor consults in selected language
    const matchLanguage = selectedLanguage === '' || doc.languages.includes(selectedLanguage as any);

    // Availability Filter (Checks if doctor has any slot matching the date)
    const matchDate = selectedDate === '' || doc.availableSlots.some(slot => slot.startsWith(selectedDate));

    // Fee range filter
    const matchFee = doc.fee <= maxFee;

    return doc.slmcVerified && !doc.deactivatedAt && matchSearch && matchDistrict && matchLanguage && matchDate && matchFee;
  });

  // Split into Boosted and Normal
  const boostedDocs = filteredDoctors.filter(d => d.isBoosted && d.slmcVerified).slice(0, 6);
  const regularDocs = filteredDoctors.filter(d => !d.isBoosted || !d.slmcVerified);

  useEffect(() => {
    if (!showPaymentModal || !paymentPendingBooking) return;
    const timer = window.setInterval(() => {
      setPaymentCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPayStatus('failed');
          setShowPaymentModal(false);
          setPaymentPendingBooking(null);
          alert('Payment window expired. The appointment slot has been released.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showPaymentModal, paymentPendingBooking]);

  const handleBookTrigger = (doc: Psychiatrist, slotStr: string) => {
    // 1. If unauthenticated, trigger registration/login flow
    if (state.currentRole === 'guest') {
      setSelectedDoc(doc);
      setBookingSlot(slotStr);
      setShowRegisterFlow(true);
      return;
    }

    // 2. If authenticated as Client, redirect straight to Pre-payment screen
    if (state.currentRole === 'client') {
      const [datePart, timePart] = slotStr.split('T');
      setPaymentPendingBooking({
        docId: doc.id,
        docName: doc.name,
        fee: doc.fee,
        date: datePart,
        time: formatTimeStr(timePart),
      });
      setPaymentCountdown(300);
      setShowPaymentModal(true);
    } else {
      alert("Please switch role to Client to book an appointment!");
    }
  };

  const formatTimeStr = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const displayHr = hr % 12 || 12;
    return `${displayHr}:${m} ${ampm}`;
  };

  const closeRegisterFlow = () => {
    setShowRegisterFlow(false);
    setSelectedDoc(null);
    setBookingSlot(null);
  };

  const handleUseSandboxClient = () => {
    store.setRole('client', 'client-1');
    setShowRegisterFlow(false);

    if (selectedDoc && bookingSlot) {
      const [datePart, timePart] = bookingSlot.split('T');
      setPaymentPendingBooking({
        docId: selectedDoc.id,
        docName: selectedDoc.name,
        fee: selectedDoc.fee,
        date: datePart,
        time: formatTimeStr(timePart),
      });
      setPaymentCountdown(300);
      setShowPaymentModal(true);
    }
  };

  const handleClientRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regNIC || !regPhone || !regEmail || !regPassword) return;

    const newClient = store.registerClient({
      name: regName,
      nic: regNIC,
      phone: regPhone,
      email: regEmail,
      district: regDistrict,
      languages: regLanguages,
      password: regPassword,
    });

    setShowRegisterFlow(false);

    // If client was mid-booking, immediately transition to payment screen
    if (selectedDoc && bookingSlot) {
      const [datePart, timePart] = bookingSlot.split('T');
      setPaymentPendingBooking({
        docId: selectedDoc.id,
        docName: selectedDoc.name,
        fee: selectedDoc.fee,
        date: datePart,
        time: formatTimeStr(timePart),
      });
      setPaymentCountdown(300);
      setShowPaymentModal(true);
    }
  };

  const completePaidBooking = () => {
    if (!paymentPendingBooking) return;
    const fee = paymentPendingBooking.fee;
    const commission = Math.round(fee * (state.config.commissionRate / 100));
    const total = fee + commission;

    store.createBooking({
      clientId: state.loggedInUserId || "client-1",
      clientName: state.clients.find(c => c.id === state.loggedInUserId)?.name || "Kavindu Wickramasinghe",
      clientPhone: state.clients.find(c => c.id === state.loggedInUserId)?.phone || "+94771234567",
      clientNIC: state.clients.find(c => c.id === state.loggedInUserId)?.nic || "199428392019V",
      psychiatristId: paymentPendingBooking.docId,
      psychiatristName: paymentPendingBooking.docName,
      date: paymentPendingBooking.date,
      time: paymentPendingBooking.time,
      fee,
      commission,
      total,
      status: 'paid',
    });

    setPayStatus('success');
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentPendingBooking(null);
      setBookingSlot(null);
      setPayStatus('idle');
      setCardNumber('');
      setCardExpiry('');
      setCardCVV('');
    }, 2000);
  };

  const loadPayHereScript = () => {
    if (typeof window === 'undefined') return Promise.reject();
    if ((window as any).payhere) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const existing = document.getElementById('payhere-sdk');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.id = 'payhere-sdk';
      script.src = 'https://www.payhere.lk/lib/payhere.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleProcessPayment = async () => {
    if (!paymentPendingBooking) return;
    setPayStatus('processing');

    const fee = paymentPendingBooking.fee;
    const commission = Math.round(fee * (state.config.commissionRate / 100));
    const total = fee + commission;
    const activeClient = state.clients.find(c => c.id === state.loggedInUserId) || state.clients[0];
    const orderId = `PSYNOVA-${Date.now()}`;

    try {
      const res = await fetch('/api/payhere/hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount: total, currency: 'LKR' }),
      });
      const payhereConfig = await res.json();

      if (payhereConfig.configured) {
        await loadPayHereScript();
        const payhere = (window as any).payhere;

        payhere.onCompleted = () => completePaidBooking();
        payhere.onDismissed = () => setPayStatus('idle');
        payhere.onError = () => setPayStatus('failed');

        payhere.startPayment({
          sandbox: payhereConfig.sandbox,
          merchant_id: payhereConfig.merchantId,
          return_url: payhereConfig.returnUrl,
          cancel_url: payhereConfig.cancelUrl,
          notify_url: payhereConfig.notifyUrl,
          order_id: payhereConfig.orderId,
          items: `PsyNova consultation with ${paymentPendingBooking.docName}`,
          amount: payhereConfig.amount,
          currency: payhereConfig.currency,
          hash: payhereConfig.hash,
          first_name: activeClient?.name?.split(' ')[0] || 'PsyNova',
          last_name: activeClient?.name?.split(' ').slice(1).join(' ') || 'Client',
          email: activeClient?.email || 'client@psynova.lk',
          phone: activeClient?.phone || '+94770000000',
          address: activeClient?.district || 'Colombo',
          city: activeClient?.district || 'Colombo',
          country: 'Sri Lanka',
        });
        return;
      }
    } catch (error) {
      console.warn('PayHere checkout unavailable, using local simulator fallback.', error);
    }

    setTimeout(() => {
      if (paymentMethod === 'card' && cardNumber.length < 12) {
        setPayStatus('failed');
        return;
      }
      completePaidBooking();
    }, 1200);
  };

  // Doctor Action
  const handleAddAvailabilitySlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDateTime || !state.loggedInUserId) return;
    store.addSlot(state.loggedInUserId, newSlotDateTime);
    setNewSlotDateTime('');
    alert("Slot published successfully!");
  };

  // Session Action
  const handleStartConsultation = (booking: Booking) => {
    setActiveSessionRoom(booking);
    setSessionReportNotes('');
    setSessionSuccessMsg(false);
  };

  const handleCloseSessionWithReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSessionRoom) return;

    store.completeBooking(activeSessionRoom.id, sessionReportNotes);
    setSessionSuccessMsg(true);

    setTimeout(() => {
      setActiveSessionRoom(null);
      setSessionSuccessMsg(false);
    }, 2000);
  };

  // Complaint Submission
  const handleFileComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaintBooking || !complaintNotes) return;

    store.submitComplaint({
      bookingId: activeComplaintBooking.id,
      submittedBy: state.currentRole === 'psychiatrist' ? 'psychiatrist' : 'client',
      userName: state.currentRole === 'client' 
        ? state.clients.find(c => c.id === state.loggedInUserId)?.name || "Client"
        : state.psychiatrists.find(d => d.id === state.loggedInUserId)?.name || "Psychiatrist",
      userRole: state.currentRole === 'client' ? 'Client' : 'Psychiatrist',
      notes: complaintNotes,
    });

    setComplaintSuccess(true);
    setComplaintNotes('');

    setTimeout(() => {
      setActiveComplaintBooking(null);
      setComplaintSuccess(false);
    }, 2000);
  };

  // Doctor Registration
  const handleDoctorRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName || !docSLMC || !docQualifications || !docBio) return;

    store.registerDoctor({
      name: docName,
      photo: `https://picsum.photos/seed/doctor-${Math.floor(Math.random()*100)}/300/300`,
      qualifications: docQualifications,
      specializations: ["Depression Counselling", "Mood Regulation"],
      languages: docLanguages,
      district: docDistrict,
      fee: docFee,
      slmcNumber: docSLMC,
      slmcDocumentName: docSLMCDocument || 'SLMC-proof-upload-sandbox.pdf',
      bio: docBio,
    });

    // Clear form
    setDocName('');
    setDocSLMC('');
    setDocSLMCDocument('');
    setDocQualifications('');
    setDocBio('');

    alert("Registration submitted! Undergoing mandatory SLMC verification by PsyNova Admins.");
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Booking ID,Patient,Doctor,Date,Total LKR,Commission LKR,Status"]
        .concat(state.bookings.map(b => `${b.id},${b.clientName},${b.psychiatristName},${b.date},${b.total},${b.commission},${b.status}`))
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `psynova_booking_reports_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Districts for select inputs
  const districtList = Object.keys(translations.en.districts);

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans" id="home-root">
      <PwaRegister />
      <Navbar activeSection="home" />

      {/* Hero Search Section */}
      <section className="relative overflow-hidden bg-paper py-20 sm:py-28 text-ink-navy border-b border-hairline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.08),rgba(255,255,255,0))]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="space-y-2">
                <span className="text-warm-turmeric text-xs sm:text-sm font-bold tracking-widest uppercase block">
                  Welcome To PsyNova
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-ink-navy leading-[1.1] max-w-2xl font-display">
                  The <span className="bg-warm-turmeric text-ink-navy px-4 py-1 rounded-2xl mx-1 font-black inline-block leading-none select-none shadow-md shadow-warm-turmeric/10">Healthy</span> Mind Is A Wealthy Soul
                </h1>
              </div>

              {/* Signature Hero Concept — "The Calming Shoreline" */}
              <div className="bg-white p-4 rounded-2xl border border-hairline shadow-md shadow-ink-navy/5 space-y-2 max-w-xl">
                <div className="w-full h-12 relative overflow-hidden select-none" id="calming-shoreline">
                  <svg className="w-full h-full" viewBox="0 0 800 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 10 25 L 20 10 L 35 40 L 50 12 L 65 38 L 80 15 L 95 35 L 110 20 L 125 30 L 140 22 L 155 28 Q 180 38, 205 25 T 265 25 T 325 25 T 385 25 T 445 25 T 505 25 T 565 25 T 625 25 T 685 25 T 745 25 T 790 25"
                      stroke="url(#shoreline-grad)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-pulse"
                    />
                    <defs>
                      <linearGradient id="shoreline-grad" x1="0%" y1="0%" x2="800" y2="0" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#F2D5D5" />
                        <stop offset="30%" stopColor="#8DAA9D" />
                        <stop offset="70%" stopColor="#ECC09B" />
                        <stop offset="100%" stopColor="#ECC09B" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[8px] text-red-600 uppercase tracking-widest font-mono font-bold">
                    high stress (ලැදියාව)
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] text-amber-800 uppercase tracking-widest font-mono font-bold">
                    calming shoreline (සන්සුන් වෙරළ)
                  </div>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-600 font-sans">
                  <span>Sri Lanka Calming Shoreline Metaphor</span>
                  <span className="font-mono text-emerald-750">Transitioning anxiety into absolute peace</span>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-xl font-sans">
                {t.heroSub}
              </p>

              <div className="flex items-center space-x-4 pt-2 font-sans">
                <button
                  onClick={() => {
                    const searchSec = document.getElementById('search-anchor');
                    if (searchSec) {
                      searchSec.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-warm-turmeric text-ink-navy hover:bg-warm-turmeric/90 text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-full flex items-center space-x-2.5 shadow-xl shadow-warm-turmeric/15 transition-all cursor-pointer group"
                >
                  <span>Let&apos;s Get Started</span>
                  <span className="text-base font-bold transition-transform group-hover:translate-x-1">→</span>
                </button>

                <button
                  onClick={() => {
                    const searchSec = document.getElementById('search-anchor');
                    if (searchSec) {
                      searchSec.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center text-ink-navy hover:bg-paper hover:border-ink-navy/40 transition-all cursor-pointer shadow-md"
                  title="Watch Intro Video"
                >
                  <span className="text-xs ml-0.5">▶</span>
                </button>
              </div>
            </div>

            {/* Right Column Image Presentation with Overlapping Cards */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="aspect-4/3 w-full bg-white rounded-3xl overflow-hidden border border-hairline shadow-xl relative">
                <Image 
                  src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=800" 
                  alt="Psychotherapy Session" 
                  fill
                  className="object-cover opacity-85 select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              </div>

              {/* Floating Card 1: Expert Psychiatrist */}
              <div className="absolute -top-5 -right-4 bg-white border border-hairline rounded-2xl p-3 flex items-center space-x-3 shadow-xl max-w-[220px]">
                <div className="w-9 h-9 rounded-full bg-slate-800 overflow-hidden border border-warm-turmeric/30 flex-shrink-0 relative">
                  <Image 
                    src="https://picsum.photos/seed/doctor-ruwan/100/100" 
                    alt="Dr. Ruwan" 
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 font-sans">
                  <span className="block text-[11px] font-bold text-ink-navy truncate">Dr. Ruwan Fernando</span>
                  <span className="block text-[9px] text-[#9E642A] font-medium truncate">Chief Psychiatrist / Founder</span>
                </div>
              </div>

              {/* Floating Card 2: Stars and Overlapping Avatars */}
              <div className="absolute -bottom-5 -left-4 bg-white border border-hairline rounded-2xl p-3.5 shadow-xl flex flex-col space-y-1.5 max-w-[195px] font-sans">
                <div className="flex items-center space-x-0.5 text-amber-400">
                  {[1, 2, 3, 4, 5].map((s, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div>
                  <span className="block text-xs font-black text-ink-navy leading-tight">1000+ Happy Souls</span>
                  <span className="block text-[9px] text-slate-600 font-semibold uppercase tracking-wider">Active Patient Base</span>
                </div>
                <div className="flex -space-x-1.5 pt-1 overflow-hidden">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="relative h-5.5 w-5.5 rounded-full ring-2 ring-white overflow-hidden inline-block">
                      <Image
                        src={`https://picsum.photos/seed/patient-avatar-${id}/60/60`}
                        alt="User Avatar"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                  <div className="inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-warm-turmeric text-ink-navy font-black text-[9px] ring-2 ring-white">
                    +
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Key Statistics Grid */}
          <div className="border-t border-hairline pt-12 mt-12 grid grid-cols-3 gap-4 max-w-5xl mx-auto font-sans">
            <div className="text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-ink-navy tracking-tight font-display">25+</span>
              <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Years Experience</span>
            </div>
            <div className="text-center space-y-1 border-x border-hairline">
              <span className="block text-3xl sm:text-4xl font-extrabold text-ink-navy tracking-tight font-display">7.8K+</span>
              <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Active Members</span>
            </div>
            <div className="text-center space-y-1">
              <span className="block text-3xl sm:text-4xl font-extrabold text-amber-800 tracking-tight font-display">99%</span>
              <span className="block text-[10px] sm:text-xs text-slate-600 font-semibold uppercase tracking-wider">Satisfied Client</span>
            </div>
          </div>

          {/* Trusted By Brands Row */}
          <div className="pt-10 border-t border-hairline space-y-5 max-w-5xl mx-auto font-sans">
            <span className="block text-center text-xs text-slate-600 font-bold tracking-widest uppercase">
              Trusted By 100,245+ PsyNova Patients Across Sri Lanka
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-30 hover:opacity-45 transition-opacity duration-300 select-none">
              {['logo-1', 'logo-2', 'logo-3', 'logo-4', 'logo-5'].map((logo, idx) => (
                <div key={idx} className="flex items-center space-x-1.5 font-mono text-[10px] sm:text-xs tracking-widest text-slate-600 font-black">
                  <div className="w-2.5 h-2.5 bg-slate-500 rounded-xs rotate-45" />
                  <span>logoipsum</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Main Search Filters and Listing Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* About Us section matching MindTalk style */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6 border-b border-hairline" id="about-us-section">
          
          {/* Left Column (Mission, Vision, and mini image) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Vision Card */}
              <div className="bg-white p-5 rounded-2xl border border-hairline shadow-sm space-y-3.5">
                <div className="bg-warm-turmeric/10 p-2.5 rounded-xl w-fit">
                  <Activity className="w-5 h-5 text-warm-turmeric" />
                </div>
                <h4 className="font-extrabold text-sm text-ink-navy font-display">Our Vision</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  Pioneering state-of-the-art mental care accessibility for every home across Sri Lanka.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white p-5 rounded-2xl border border-hairline shadow-sm space-y-3.5">
                <div className="bg-warm-turmeric/10 p-2.5 rounded-xl w-fit">
                  <HeartHandshake className="w-5 h-5 text-warm-turmeric" />
                </div>
                <h4 className="font-extrabold text-sm text-ink-navy font-display">Our Mission</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  Delivering empathetic, fully certified and secure tele-health treatments instantly.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column (Core Copy) */}
          <div className="lg:col-span-6 space-y-6 text-left font-sans">
            <div className="space-y-1.5">
              <span className="text-warm-turmeric text-xs font-bold uppercase tracking-wider block">About Us</span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-ink-navy leading-tight font-display">
                Quality Care From Quality <span className="border border-warm-turmeric/35 text-warm-turmeric bg-warm-turmeric/10 px-3 py-0.5 rounded-2xl mx-1 font-bold inline-block select-none shadow-md shadow-warm-turmeric/5">Experts</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              At PsyNova, we gather Sri Lanka&apos;s leading licensed psychiatrists to assist you through virtual consultation sessions. From diagnostic checkups to treatment programs, our platform guarantees highly certified, discrete and supportive clinical results without high hospital costs or travel constraints.
            </p>

            <button
              onClick={() => {
                const searchSec = document.getElementById('search-anchor');
                if (searchSec) {
                  searchSec.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-warm-turmeric text-ink-navy hover:bg-warm-turmeric/90 text-xs font-extrabold px-6 py-3 rounded-full flex items-center space-x-2 transition-all cursor-pointer shadow-md"
            >
              <span>Learn More</span>
              <span>→</span>
            </button>
          </div>

        </section>

        {/* Why Choose Us & Key Pillars Section */}
        <section className="space-y-8 border-b border-hairline pb-12" id="why-choose-section">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <span className="text-warm-turmeric text-xs font-bold uppercase tracking-wider block">Why Choose Us</span>
              <h3 className="text-3xl font-light text-ink-navy tracking-tight font-display">
                Getting You <span className="bg-warm-turmeric text-ink-navy px-3 py-0.5 rounded-2xl mx-1 font-bold inline-block select-none">Back</span> In Shape
              </h3>
            </div>
            <p className="text-xs text-slate-600 max-w-sm font-normal leading-relaxed font-sans">
              Empathetic clinical consultations tailored perfectly around your personal timeline, language requirements and local privacy needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <UserCheck className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h4 className="font-bold text-base text-ink-navy font-display">Personalized Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Custom clinical reports, medicine instructions and diagnostic reviews created by leading medical specialists.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <Video className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h4 className="font-bold text-base text-ink-navy font-display">Free Sandbox Tools</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore simulated billing checkouts, view mock SMS dispatches, and trigger instant tele-health rooms.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-4">
              <div className="bg-warm-turmeric/10 p-3 rounded-xl w-fit">
                <ShieldAlert className="w-6 h-6 text-warm-turmeric" />
              </div>
              <h4 className="font-bold text-base text-ink-navy font-display">24/7 Good Service</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Sri Lankan compliance desk is online to assist with scheduling, refund requests and administrative security audits.
              </p>
            </div>

          </div>

        </section>

        {/* Dynamic Booking Core filters & lookup */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-hairline pb-3" id="search-anchor">
            <div className="font-sans">
              <h3 className="text-lg font-black text-ink-navy font-display">{t.searchTitle}</h3>
              <p className="text-slate-600 text-xs">Search and secure live sessions instantly below</p>
            </div>
            
            {/* Embedded Search input */}
            <div className="mt-3 md:mt-0 max-w-xs bg-white p-2 rounded-xl border border-hairline flex items-center space-x-2 text-ink-navy shadow-sm">
              <Search className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1.5" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs outline-hidden border-none text-ink-navy focus:ring-0 placeholder-slate-500 font-medium bg-transparent"
              />
            </div>
          </div>

          {/* Disaster warning banner */}
        <div className="bg-amber-50 border-l-4 border-warm-turmeric p-4 rounded-r-xl flex items-start space-x-3 text-amber-900 border-y border-r border-hairline shadow-xs font-sans">
          <AlertCircle className="w-5 h-5 text-warm-turmeric flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed text-slate-700">
            <strong>{t.emergencyDisclaimer.split(":")[0]}:</strong> {t.emergencyDisclaimer.split(":")[1]}
          </p>
        </div>

        {/* 2-Column Search Layout: Left Filter Sidebar, Right Results list */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Filters Panel */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-hairline shadow-sm space-y-5 font-sans">
            <h3 className="font-bold text-sm text-ink-navy tracking-tight uppercase border-b border-hairline pb-2.5 font-display">
              {t.searchTitle}
            </h3>

            {/* Filter 1: District */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-warm-turmeric" />
                <span>{t.filterDistrict}</span>
              </label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy"
              >
                <option value="">{t.allDistricts}</option>
                {districtList.map(dist => (
                  <option key={dist} value={dist}>{t.districts[dist] || dist}</option>
                ))}
              </select>
            </div>

            {/* Filter 2: Language */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-warm-turmeric" />
                <span>{t.filterLanguage}</span>
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy"
              >
                <option value="">{t.allLanguages}</option>
                <option value="Sinhala">සිංහල (Sinhala)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="English">English</option>
              </select>
            </div>

            {/* Filter 3: Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600 uppercase flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-warm-turmeric" />
                <span>{t.filterDate}</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-hairline rounded-xl p-2.5 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden bg-white text-ink-navy scheme-light"
              />
            </div>

            {/* Filter 4: Fee */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 uppercase">
                <span className="flex items-center space-x-1">
                  <DollarSign className="w-3.5 h-3.5 text-warm-turmeric" />
                  <span>{t.filterFee}</span>
                </span>
                <span className="text-ink-navy">LKR {maxFee}</span>
              </div>
              <input
                type="range"
                min="3000"
                max="6000"
                step="500"
                value={maxFee}
                onChange={(e) => setMaxFee(parseInt(e.target.value))}
                className="w-full accent-warm-turmeric cursor-pointer"
              />
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDistrict('');
                setSelectedLanguage('');
                setSelectedDate('');
                setMaxFee(6000);
              }}
              className="w-full bg-paper hover:bg-slate-100 text-ink-navy text-[11px] font-semibold py-2.5 rounded-xl transition-all cursor-pointer text-center block border border-hairline"
            >
              Filters Clear
            </button>
          </div>

          {/* Results Listing Panel */}
          <div className="lg:col-span-9 space-y-10 font-sans">
            
            {/* 1. BOOSTED SECTION (MAX 6) */}
            {boostedDocs.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-warm-turmeric text-ink-navy text-[10px] font-extrabold tracking-widest px-2.5 py-1 rounded-md uppercase">
                    {t.boostedLabel}
                  </span>
                  <h2 className="text-lg font-extrabold text-ink-navy tracking-tight font-display">
                    {t.boostedTitle}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {boostedDocs.map(doc => (
                    <div 
                      key={doc.id} 
                      className="bg-white border-2 border-warm-turmeric rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                      id={`doc-card-${doc.id}`}
                    >
                      <div className="p-5 flex space-x-4 items-start">
                        {/* Doctor photo */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-paper flex-shrink-0 relative">
                          <Image 
                            src={doc.photo} 
                            alt={doc.name} 
                            fill
                            className="object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <h4 className="font-bold text-ink-navy text-sm sm:text-base truncate leading-tight font-display">{doc.name}</h4>
                            <div className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 border border-emerald-200">
                              <UserCheck className="w-2.5 h-2.5" />
                              <span>SLMC OK</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium truncate">{doc.qualifications}</p>
                          <Link
                            href={`/psychiatrist/${doc.id}`}
                            className="inline-flex text-[10px] font-bold text-amber-800 hover:text-ink-navy hover:underline"
                          >
                            {t.viewProfile}
                          </Link>
                          
                          {/* Metadata pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
                              <MapPin className="w-3 h-3 text-warm-turmeric" />
                              <span>{t.districts[doc.district] || doc.district}</span>
                            </span>
                            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
                              <Globe className="w-3 h-3 text-warm-turmeric" />
                              <span>{doc.languages.join(' / ')}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Scheduling slots footer */}
                      <div className="bg-paper border-t border-hairline p-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium">{t.hourlyFee}</span>
                          <span className="font-bold text-amber-800">LKR {doc.fee}</span>
                        </div>

                        {/* Available times row */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">{t.availableSlots}</span>
                          {doc.availableSlots.length === 0 ? (
                            <span className="block text-slate-500 text-[11px] italic">No active slots published.</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {doc.availableSlots.map(slot => {
                                const [datePart, timePart] = slot.split('T');
                                const displayTime = formatTimeStr(timePart);
                                return (
                                  <button
                                    key={slot}
                                    onClick={() => handleBookTrigger(doc, slot)}
                                    className="bg-white border border-hairline text-slate-700 hover:border-warm-turmeric hover:bg-warm-turmeric hover:text-ink-navy px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                                  >
                                    {datePart} | {displayTime}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. REGULAR DOCTORS LISTING */}
            <div className="space-y-4">
              <h2 className="text-lg font-extrabold text-ink-navy tracking-tight font-display">
                {t.boostedSub}
              </h2>

              {regularDocs.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-hairline">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium">No psychiatrists match your search filter criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularDocs.map(doc => (
                    <div 
                      key={doc.id} 
                      className="bg-white border border-hairline rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                      id={`doc-card-${doc.id}`}
                    >
                      <div className="p-5 flex space-x-4 items-start">
                        {/* Doctor photo */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-paper flex-shrink-0 relative">
                          <Image 
                            src={doc.photo} 
                            alt={doc.name} 
                            fill
                            className="object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <h4 className="font-bold text-ink-navy text-sm sm:text-base truncate leading-tight font-display">{doc.name}</h4>
                            <div className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center space-x-0.5 border ${
                              doc.slmcVerified 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              <UserCheck className="w-2.5 h-2.5" />
                              <span>{doc.slmcVerified ? "SLMC OK" : "SLMC PENDING"}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 font-medium truncate">{doc.qualifications}</p>
                          <Link
                            href={`/psychiatrist/${doc.id}`}
                            className="inline-flex text-[10px] font-bold text-amber-800 hover:text-ink-navy hover:underline"
                          >
                            {t.viewProfile}
                          </Link>
                          
                          {/* Metadata pills */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
                              <MapPin className="w-3 h-3 text-warm-turmeric" />
                              <span>{t.districts[doc.district] || doc.district}</span>
                            </span>
                            <span className="bg-paper text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center space-x-0.5 border border-hairline">
                              <Globe className="w-3 h-3 text-warm-turmeric" />
                              <span>{doc.languages.join(' / ')}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Scheduling slots footer */}
                      <div className="bg-paper border-t border-hairline p-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-600 font-medium">{t.hourlyFee}</span>
                          <span className="font-bold text-amber-800">LKR {doc.fee}</span>
                        </div>

                        {/* Available times row */}
                        <div className="space-y-1.5">
                          <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">{t.availableSlots}</span>
                          {doc.availableSlots.length === 0 ? (
                            <span className="block text-slate-500 text-[11px] italic">No active slots published.</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {doc.availableSlots.map(slot => {
                                const [datePart, timePart] = slot.split('T');
                                const displayTime = formatTimeStr(timePart);
                                return (
                                  <button
                                    key={slot}
                                    onClick={() => handleBookTrigger(doc, slot)}
                                    className="bg-white border border-hairline text-slate-700 hover:border-warm-turmeric hover:bg-warm-turmeric hover:text-ink-navy px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                                  >
                                    {datePart} | {displayTime}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </section>
      </section>

        {/* Dynamic Contextual Stakeholder Portal Views */}
        <section className="border-t border-hairline pt-10" id="dashboard-view">
          
          {/* GUEST MODE ONBOARDING FOR PSYCHIATRISTS */}
          {state.currentRole === 'guest' && (
            <div className="bg-white rounded-2xl border border-hairline p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
              <div className="text-center space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold text-ink-navy tracking-tight font-display">වෘත්තීය මනෝ වෛද්‍යවරුන් ලියාපදිංචිය / Psychiatrist Onboarding</h3>
                <p className="text-slate-600 text-xs sm:text-sm font-normal">ලියාපදිංචි වී ශ්‍රී ලංකා වෛද්‍ය සභාවේ (SLMC) සහතිකපත්‍රය සත්‍යාපනය කර උපදේශන සේවා අරඹන්න.</p>
              </div>

              <form onSubmit={handleDoctorRegisterSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">වෛද්‍ය නම / Legal Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Dr. Priyantha Jayasuriya"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">SLMC ලියාපදිංචි අංකය / SLMC Number</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="SLMC-PSY-XXXXX"
                    value={docSLMC}
                    onChange={(e) => setDocSLMC(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">උපදේශන ගාස්තුව / Fee per session (LKR)</label>
                  <input 
                    type="number" 
                    required 
                    value={docFee}
                    onChange={(e) => setDocFee(parseInt(e.target.value))}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">ප්‍රාදේශීය දිස්ත්‍රික්කය / District</label>
                  <select
                    value={docDistrict}
                    onChange={(e) => setDocDistrict(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  >
                    {districtList.map(dist => (
                      <option key={dist} value={dist}>{t.districts[dist] || dist}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">SLMC සහතිකය / Registry proof file name</label>
                  <input
                    type="text"
                    required
                    placeholder="SLMC-registration-proof.pdf"
                    value={docSLMCDocument}
                    onChange={(e) => setDocSLMCDocument(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-500">Sandbox mode stores the file name only. Production should upload and verify the actual PDF/image.</p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">වෛද්‍ය සුදුසුකම් / Professional Qualifications</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="MBBS, MD (Psychiatry), FCPS"
                    value={docQualifications}
                    onChange={(e) => setDocQualifications(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-700">කෙටි ජීව දත්ත විස්තරය / Bio Summary</label>
                  <textarea 
                    rows={3} 
                    required 
                    placeholder="Provide short clinical bio description..."
                    value={docBio}
                    onChange={(e) => setDocBio(e.target.value)}
                    className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                  />
                </div>

                <button 
                  type="submit" 
                  className="sm:col-span-2 bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-2.5 rounded-xl transition-all duration-300 text-xs tracking-wide cursor-pointer shadow-md shadow-warm-turmeric/10"
                >
                  Onboarding On Platform
                </button>
              </form>
            </div>
          )}

          {/* CLIENT DASHBOARD */}
          {state.currentRole === 'client' && (
            <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
                <div>
                  <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">{t.myDashboard}</h3>
                  <p className="text-slate-600 text-xs">{t.roleClient}: Kavindu Wickramasinghe</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm(t.deactivateHoldWarning + "\n\nAre you sure you want to deactivate?")) {
                      store.deactivateClient(state.loggedInUserId || 'client-1');
                      alert("Profile enters a mandatory 7-calendar-day safety hold. Deactivation request scheduled!");
                    }
                  }}
                  className="mt-3 sm:mt-0 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 w-fit border border-red-200 cursor-pointer transition-all"
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>{t.deactivateAccount}</span>
                </button>
              </div>

              {/* Client Profile & Payment Ledger */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-paper border border-hairline rounded-2xl p-4 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Profile Management</h4>
                  {(() => {
                    const client = state.clients.find(c => c.id === (state.loggedInUserId || 'client-1'));
                    if (!client) return null;
                    return (
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-slate-600">Name</span><strong>{client.name}</strong></div>
                        <div className="flex justify-between"><span className="text-slate-600">Mobile</span><strong>{client.phone}</strong></div>
                        <div className="flex justify-between"><span className="text-slate-600">Email</span><strong>{client.email}</strong></div>
                        <button
                          onClick={() => {
                            const phone = prompt('Update mobile number', client.phone);
                            const email = prompt('Update email', client.email);
                            if (phone && email) store.updateClient(client.id, { phone, email });
                          }}
                          className="bg-white border border-hairline px-3 py-2 rounded-xl font-bold hover:border-warm-turmeric"
                        >
                          Edit Profile
                        </button>
                      </div>
                    );
                  })()}
                </div>
                <div className="bg-paper border border-hairline rounded-2xl p-4 space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Payment History</h4>
                  <div className="space-y-2 text-xs">
                    {state.bookings.filter(b => b.clientId === (state.loggedInUserId || 'client-1')).map(b => (
                      <div key={`pay-${b.id}`} className="flex justify-between bg-white border border-hairline rounded-xl p-2">
                        <span>#{b.id} - {b.status}</span>
                        <strong>LKR {b.total}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking History */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-sm text-slate-600 tracking-wider uppercase font-display">{t.sessions}</h4>
                
                <div className="overflow-x-auto text-slate-700 border border-hairline rounded-xl">
                  <table className="w-full text-xs text-left text-slate-750">
                    <thead className="text-[10px] text-ink-navy uppercase bg-paper border-b border-hairline">
                      <tr>
                        <th className="px-4 py-3 border-b border-hairline">Booking ID</th>
                        <th className="px-4 py-3 border-b border-hairline">Doctor</th>
                        <th className="px-4 py-3 border-b border-hairline">Scheduled Date</th>
                        <th className="px-4 py-3 border-b border-hairline">Amount</th>
                        <th className="px-4 py-3 border-b border-hairline">Status</th>
                        <th className="px-4 py-3 border-b border-hairline text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline bg-white">
                      {state.bookings.filter(b => b.clientId === (state.loggedInUserId || 'client-1')).map(booking => (
                        <tr key={booking.id} className="hover:bg-paper/35">
                          <td className="px-4 py-3 font-semibold text-ink-navy">#{booking.id}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{booking.psychiatristName}</td>
                          <td className="px-4 py-3">{booking.date} at {booking.time}</td>
                          <td className="px-4 py-3 font-bold text-ink-navy">LKR {booking.total}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              booking.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              booking.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-y-1 sm:space-y-0 sm:space-x-2">
                            {booking.status === 'paid' && (
                              <button
                                onClick={() => {
                                  setActiveVideoRoom(booking);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-md font-bold text-[10px] inline-flex items-center space-x-1 cursor-pointer transition-all"
                              >
                                <Video className="w-3 h-3" />
                                <span>{t.joinRoom}</span>
                              </button>
                            )}
                            {booking.status === 'paid' && (
                              <button
                                onClick={() => {
                                  store.sendAppointmentReminder(booking.id);
                                  alert('Appointment reminder SMS queued in sandbox log.');
                                }}
                                className="text-amber-800 hover:underline text-[10px] font-bold block sm:inline mt-1 sm:mt-0"
                              >
                                Send Reminder
                              </button>
                            )}
                            
                            {booking.status === 'completed' && booking.clinicalNotes && (
                              <div className="bg-paper p-3 rounded-lg text-left mt-2 text-[11px] text-slate-700 border border-hairline leading-normal">
                                <strong>Diagnosis & Prescriptions:</strong> {booking.clinicalNotes}
                              </div>
                            )}

                            {booking.status === 'paid' && (
                              <button
                                onClick={() => {
                                  setActiveComplaintBooking(booking);
                                  setComplaintNotes('');
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-[10px] font-bold block sm:inline mt-1 sm:mt-0"
                              >
                                File Complaint
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PSYCHIATRIST DASHBOARD */}
          {state.currentRole === 'psychiatrist' && (
            <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
              
              {/* Doctor Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
                <div>
                  <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">{t.myDashboard}</h3>
                  <p className="text-slate-600 text-xs">
                    Specialist: <strong className="text-ink-navy">{state.psychiatrists.find(d => d.id === state.loggedInUserId)?.name || "Dr. Ruwan Fernando"}</strong>
                  </p>
                </div>
                
                {/* Boosting Package Option */}
                <button
                  onClick={() => {
                    if (confirm(`Boost profile to home page carousel for LKR ${state.config.boostPackageLkr}? (Simulated Package Transaction)`)) {
                      store.purchaseBoost(state.loggedInUserId || 'psy-1');
                      alert("Boost package activated! Your profile now displays in the prominent Homepage Carousel.");
                    }
                  }}
                  className="mt-3 sm:mt-0 bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 w-fit shadow-xs cursor-pointer transition-all"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-ink-navy" />
                  <span>{t.purchaseBoost} (LKR {state.config.boostPackageLkr})</span>
                </button>
              </div>

              {(() => {
                const doctor = state.psychiatrists.find(d => d.id === (state.loggedInUserId || 'psy-1'));
                if (!doctor) return null;
                return (
                  <div className="bg-paper border border-hairline rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                    <div className="lg:col-span-2 space-y-2">
                      <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Profile & SLMC Document</h4>
                      <p className="text-slate-700 leading-relaxed">{doctor.bio}</p>
                      <p className="text-[10px] text-slate-500">Registry proof: <strong>{doctor.slmcDocumentName || 'Verified from seed registry record'}</strong></p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          const fee = prompt('Update consultation fee', String(doctor.fee));
                          const bio = prompt('Update profile bio', doctor.bio);
                          if (fee && bio) store.updateDoctorProfile(doctor.id, { fee: parseInt(fee), bio });
                        }}
                        className="bg-white border border-hairline px-3 py-2 rounded-xl font-bold hover:border-warm-turmeric"
                      >
                        Edit Profile / Fee
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(t.deactivateHoldWarning)) {
                            store.deactivateDoctor(doctor.id);
                            alert('Doctor account enters the 7-calendar-day hold queue.');
                          }
                        }}
                        className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl font-bold hover:bg-red-100"
                      >
                        {t.deactivateAccount}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Top Row Grid: Financial Telemetry & Scheduling slots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Add Availability slot */}
                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">{t.addSlot}</h4>
                  
                  <form onSubmit={handleAddAvailabilitySlot} className="flex space-x-2">
                    <input 
                      type="datetime-local" 
                      required
                      value={newSlotDateTime}
                      onChange={(e) => setNewSlotDateTime(e.target.value)}
                      className="border border-hairline bg-white text-ink-navy rounded-xl p-2.5 text-xs flex-1 scheme-light"
                    />
                    <button 
                      type="submit" 
                      className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </form>
                </div>

                {/* 2. Earnings Ledgers */}
                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">{t.earningsTitle}</h4>
                  
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Platform Commission Band:</span>
                    <span className="font-bold text-ink-navy">{state.config.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 border-t border-hairline pt-2">
                    <span>Total Consultations:</span>
                    <span className="font-bold text-ink-navy">
                      {state.bookings.filter(b => b.psychiatristId === (state.loggedInUserId || 'psy-1') && b.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-hairline pt-2 font-bold text-ink-navy">
                    <span>{t.netEarnings}:</span>
                    <span className="text-emerald-700 font-bold">
                      LKR {state.bookings
                        .filter(b => b.psychiatristId === (state.loggedInUserId || 'psy-1') && b.status === 'completed')
                        .reduce((acc, b) => acc + (b.fee - b.commission), 0)
                      }
                    </span>
                  </div>
                </div>

              </div>

              {/* Appointments List for Doctor */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">{t.upcomingSessions}</h4>

                <div className="overflow-x-auto text-slate-700 border border-hairline rounded-xl">
                  <table className="w-full text-xs text-left text-slate-750">
                    <thead className="text-[10px] text-ink-navy uppercase bg-paper border-b border-hairline">
                      <tr>
                        <th className="px-4 py-3 border-b border-hairline">Booking ID</th>
                        <th className="px-4 py-3 border-b border-hairline">Patient Name</th>
                        <th className="px-4 py-3 border-b border-hairline">Patient NIC</th>
                        <th className="px-4 py-3 border-b border-hairline">Scheduled Date</th>
                        <th className="px-4 py-3 border-b border-hairline">Status</th>
                        <th className="px-4 py-3 border-b border-hairline text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hairline bg-white">
                      {state.bookings.filter(b => b.psychiatristId === (state.loggedInUserId || 'psy-1')).map(booking => (
                        <tr key={booking.id} className="hover:bg-paper/35">
                          <td className="px-4 py-3 font-semibold text-ink-navy">#{booking.id}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{booking.clientName}</td>
                          <td className="px-4 py-3 font-mono text-slate-600">{booking.clientNIC}</td>
                          <td className="px-4 py-3">{booking.date} at {booking.time}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                              booking.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              booking.status === 'completed' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                              'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-y-1.5">
                            {booking.status === 'paid' && (
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end space-y-1.5 sm:space-y-0 sm:space-x-2">
                                <button
                                  onClick={() => {
                                    setActiveVideoRoom(booking);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-md font-bold text-[10px] inline-flex items-center space-x-1 cursor-pointer transition-all"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Start Consultation</span>
                                </button>
                                <button
                                  onClick={() => handleStartConsultation(booking)}
                                  className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-2.5 py-1.5 rounded-md font-bold text-[10px] cursor-pointer transition-all shadow-xs"
                                >
                                  File Session Report
                                </button>
                              </div>
                            )}

                            {booking.status === 'completed' && (
                              <span className="text-slate-500 italic text-[10px]">Report Filed & Approved</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ADMIN DASHBOARD */}
          {state.currentRole === 'admin' && (
            <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
                <div>
                  <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">{t.roleAdmin} Panel</h3>
                  <p className="text-slate-600 text-xs font-sans">Verify SLMC Licenses, moderate disputes, configure platform parameters.</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="mt-3 sm:mt-0 bg-paper hover:bg-slate-100 text-ink-navy px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 w-fit border border-hairline cursor-pointer transition-all font-sans shadow-xs"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <span>Export Booking Reports (CSV)</span>
                </button>
              </div>

              {/* Telemetry Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                  <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Verified Psychiatrists</span>
                  <span className="text-xl font-extrabold text-ink-navy mt-1 block font-display">
                    {state.psychiatrists.filter(d => d.slmcVerified).length}
                  </span>
                </div>
                <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                  <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">Pending Approval</span>
                  <span className="text-xl font-extrabold text-amber-600 mt-1 block font-display">
                    {state.psychiatrists.filter(d => !d.slmcVerified).length}
                  </span>
                </div>
                <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                  <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">Total Client Accounts</span>
                  <span className="text-xl font-extrabold text-ink-navy mt-1 block font-display">
                    {state.clients.length}
                  </span>
                </div>
                <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                  <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">Gross Facilitation Revenue</span>
                  <span className="text-xl font-extrabold text-amber-800 mt-1 block font-mono font-bold">
                    LKR {state.bookings.filter(b => b.status === 'completed' || b.status === 'paid').reduce((acc, b) => acc + b.commission, 0)}
                  </span>
                </div>
              </div>

              {/* Client and Payment Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Client Account Controls</h4>
                  <div className="space-y-3">
                    {state.clients.map(client => (
                      <div key={client.id} className="bg-paper border border-hairline rounded-xl p-3 flex items-center justify-between">
                        <div className="text-xs">
                          <strong className="block text-ink-navy">{client.name}</strong>
                          <span className="text-slate-600">{client.phone} · {client.district}</span>
                          {client.deactivatedAt && <span className="block text-red-600 text-[10px]">7-day deactivation hold started {client.deactivatedAt.slice(0, 10)}</span>}
                        </div>
                        <button
                          onClick={() => store.setClientSuspended(client.id, !client.suspended)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                            client.suspended ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          {client.suspended ? 'Reactivate' : 'Suspend'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Transactions & Refund Approval</h4>
                  <div className="space-y-3">
                    {state.bookings.map(booking => (
                      <div key={`admin-pay-${booking.id}`} className="bg-paper border border-hairline rounded-xl p-3 flex items-center justify-between">
                        <div className="text-xs">
                          <strong className="block text-ink-navy">#{booking.id} · LKR {booking.total}</strong>
                          <span className="text-slate-600">{booking.clientName} → {booking.psychiatristName}</span>
                          <span className="block text-[10px] text-slate-500">Commission LKR {booking.commission} · {booking.status}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Approve manual refund for booking #${booking.id}?`)) store.refundBooking(booking.id);
                          }}
                          disabled={booking.status === 'refunded'}
                          className="bg-white border border-hairline disabled:opacity-50 px-3 py-1.5 rounded-lg text-[10px] font-bold hover:border-warm-turmeric"
                        >
                          {t.refundBooking}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 1. Approvals Management */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Mandatory SLMC Registry Auditing</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {state.psychiatrists.map(doc => (
                    <div key={doc.id} className="bg-paper p-4 rounded-xl border border-hairline flex items-center justify-between font-sans shadow-xs">
                      <div className="space-y-1">
                        <span className="block font-bold text-ink-navy text-xs">{doc.name}</span>
                        <span className="block text-[10px] text-slate-600">{doc.qualifications}</span>
                        <span className="block text-[10px] font-mono text-slate-500 font-semibold">{doc.slmcNumber}</span>
                      </div>
                      <button
                        onClick={() => store.toggleDoctorVerification(doc.id)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          doc.slmcVerified 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {doc.slmcVerified ? "Verified (Revoke)" : "Pending (Approve)"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Complaints Dispute Resolution */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">{t.viewComplaints}</h4>

                {state.complaints.length === 0 ? (
                  <p className="text-slate-500 text-xs italic">No user grievances or incident reports logged.</p>
                ) : (
                  <div className="space-y-4">
                    {state.complaints.map(cmp => (
                      <div key={cmp.id} className="bg-paper p-4 rounded-xl border border-hairline space-y-3 font-sans shadow-xs">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="font-bold text-ink-navy uppercase font-display">Ticket #{cmp.id}</span>
                          <span className="text-slate-500">{cmp.date}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-normal font-normal">
                          <strong>{cmp.userName} ({cmp.userRole}):</strong> {cmp.notes}
                        </p>

                        {cmp.status === 'pending' ? (
                          <div className="flex space-x-2">
                            <input 
                              type="text" 
                              placeholder="Write resolution decision..."
                              value={adminResolutionInput[cmp.id] || ''}
                              onChange={(e) => setAdminResolutionInput(prev => ({ ...prev, [cmp.id]: e.target.value }))}
                              className="border border-hairline bg-white text-ink-navy rounded-lg p-1.5 text-xs flex-1"
                            />
                            <button
                              onClick={() => {
                                const notes = adminResolutionInput[cmp.id];
                                if (!notes) return;
                                store.resolveComplaint(cmp.id, notes);
                                alert("Complaint resolved manually and notifications sent!");
                              }}
                              className="bg-warm-turmeric text-ink-navy px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:bg-warm-turmeric/90"
                            >
                              Resolve
                            </button>
                          </div>
                        ) : (
                          <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-800 text-[11px] leading-normal font-medium">
                            <strong>Resolved Decision:</strong> {cmp.resolutionDetails}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* SUPER ADMIN DASHBOARD */}
          {state.currentRole === 'superadmin' && (
            <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
              
              {/* Header */}
              <div className="border-b border-hairline pb-4">
                <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">{t.roleSuperAdmin} Dashboard</h3>
                <p className="text-slate-600 text-xs font-sans">Adjust global commission policies, manage administrative users, and analyze revenue margins.</p>
              </div>

              {/* Multi-language Commission Rates Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Commission Band Slider */}
                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">{t.setCommission}</h4>
                    <p className="text-slate-500 text-[10px]">Commission values must remain strictly within the 15% - 20% bracket.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Rate:</span>
                      <span className="text-amber-800 font-mono text-sm font-bold">{commissionInput}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="15" 
                      max="20" 
                      step="1"
                      value={commissionInput}
                      onChange={(e) => setCommissionInput(parseInt(e.target.value))}
                      className="w-full accent-warm-turmeric cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      store.updateConfig({ commissionRate: commissionInput });
                      alert(`Platform commission successfully set to ${commissionInput}% on future bookings!`);
                    }}
                    className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-4 py-2.5 rounded-xl text-xs font-bold w-full transition-all cursor-pointer shadow-xs"
                  >
                    Save Commission Rule
                  </button>
                </div>

                {/* Simulated payment Gateway and SMS Credentials */}
                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">SMS Gateway Configuration</h4>
                  
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <span className="block text-slate-600 font-semibold text-[10px] uppercase">API Gateway Endpoint</span>
                      <input 
                        type="text" 
                        value={state.config.smsGatewayUrl} 
                        onChange={(e) => store.updateConfig({ smsGatewayUrl: e.target.value })}
                        className="w-full border border-hairline rounded-lg p-2 bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-slate-600 font-semibold text-[10px] uppercase">Gateway Mask / Sender ID</span>
                      <input 
                        type="text" 
                        value={state.config.smsSenderId} 
                        onChange={(e) => store.updateConfig({ smsSenderId: e.target.value })}
                        className="w-full border border-hairline rounded-lg p-2 text-xs bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Boosting & Payment Settings</h4>
                  <div className="space-y-3 text-xs">
                    <label className="block space-y-1">
                      <span className="block text-slate-600 font-semibold text-[10px] uppercase">Boost Package Price (LKR)</span>
                      <input
                        type="number"
                        value={state.config.boostPackageLkr}
                        onChange={(e) => store.updateConfig({ boostPackageLkr: parseInt(e.target.value) })}
                        className="w-full border border-hairline rounded-lg p-2 bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                      />
                    </label>
                    <label className="flex items-center justify-between bg-white border border-hairline p-2 rounded-lg">
                      <span className="font-semibold">LankaPay enabled</span>
                      <input type="checkbox" checked={state.config.lankaPayEnabled} onChange={(e) => store.updateConfig({ lankaPayEnabled: e.target.checked })} />
                    </label>
                    <label className="flex items-center justify-between bg-white border border-hairline p-2 rounded-lg">
                      <span className="font-semibold">Visa/Mastercard enabled</span>
                      <input type="checkbox" checked={state.config.cardPaymentEnabled} onChange={(e) => store.updateConfig({ cardPaymentEnabled: e.target.checked })} />
                    </label>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">Admin Accounts & Permissions</h4>
                    <button
                      onClick={() => {
                        const name = prompt('Admin name');
                        const role = prompt('Admin role', 'Support Officer');
                        const permissions = prompt('Permissions comma separated', 'Complaint resolution,Refund approval');
                        if (name && role && permissions) {
                          store.addAdminAccount(name, role, permissions.split(',').map(p => p.trim()).filter(Boolean));
                        }
                      }}
                      className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-3 py-2 rounded-xl text-xs font-bold"
                    >
                      Create Admin
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {state.config.adminAccounts.map(admin => (
                      <div key={admin.id} className="bg-white border border-hairline rounded-xl p-3 text-xs">
                        <strong className="block text-ink-navy">{admin.name}</strong>
                        <span className="text-slate-600">{admin.role}</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {admin.permissions.map(permission => (
                            <span key={permission} className="bg-paper border border-hairline px-2 py-1 rounded-md text-[10px] font-bold text-slate-600">
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white text-ink-navy mt-12 py-10 border-t border-hairline font-normal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-slate-600">
          <div className="space-y-3">
            <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">PsyNova Sri Lanka</h4>
            <p className="leading-relaxed">Connecting clients with verified SLMC-licensed expert psychiatrists. 100% online, secure, and multi-lingual.</p>
          </div>
          <div className="space-y-3">
            <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">Quick Navigations</h4>
            <div className="space-y-1">
              <Link href="/" className="block hover:text-amber-800 transition-colors">Home</Link>
              <Link href="/about" className="block hover:text-amber-800 transition-colors">About PsyNova</Link>
              <Link href="/support" className="block hover:text-amber-800 transition-colors">Support Hub</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">Legal</h4>
            <div className="space-y-1">
              <Link href="/terms" className="block hover:text-amber-800 transition-colors">Terms & Conditions</Link>
              <Link href="/privacy" className="block hover:text-amber-800 transition-colors">Privacy Policy</Link>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-ink-navy font-bold text-sm tracking-wide font-display">PDPA Compliance</h4>
            <p className="leading-relaxed font-sans">Fully compliant with the Sri Lanka Personal Data Protection Act (PDPA) No. 9 of 2022. All clinical recordings are strictly barred.</p>
          </div>
        </div>
        <div className="border-t border-hairline mt-8 pt-4 text-center text-[11px] text-slate-500">
          © 2026 PsyNova. Developed and optimized for the Ministry of Health tele-psychiatry standard.
        </div>
      </footer>


      {/* --- ALL MODALS & FLYOUTS (Single-screen architecture) --- */}

      {showRegisterFlow && selectedDoc && bookingSlot && (
        <ClientRegistrationModal
          selectedDoc={selectedDoc}
          bookingSlot={bookingSlot}
          districtList={districtList}
          t={t}
          regName={regName}
          regNIC={regNIC}
          regPhone={regPhone}
          regEmail={regEmail}
          regDistrict={regDistrict}
          regPassword={regPassword}
          setRegName={setRegName}
          setRegNIC={setRegNIC}
          setRegPhone={setRegPhone}
          setRegEmail={setRegEmail}
          setRegDistrict={setRegDistrict}
          setRegPassword={setRegPassword}
          onClose={closeRegisterFlow}
          onUseSandboxClient={handleUseSandboxClient}
          onSubmit={handleClientRegisterSubmit}
        />
      )}

      {showPaymentModal && paymentPendingBooking && (
        <PaymentModal
          booking={paymentPendingBooking}
          paymentCountdown={paymentCountdown}
          commissionRate={state.config.commissionRate}
          paymentMethod={paymentMethod}
          cardNumber={cardNumber}
          cardExpiry={cardExpiry}
          cardCVV={cardCVV}
          payStatus={payStatus}
          lankaPayEnabled={state.config.lankaPayEnabled}
          cardPaymentEnabled={state.config.cardPaymentEnabled}
          t={t}
          setPaymentMethod={setPaymentMethod}
          setCardNumber={setCardNumber}
          setCardExpiry={setCardExpiry}
          setCardCVV={setCardCVV}
          onCancel={() => {
            setShowPaymentModal(false);
            setPaymentPendingBooking(null);
          }}
          onProcessPayment={handleProcessPayment}
        />
      )}

      {activeVideoRoom && (
        <VideoRoomModal
          booking={activeVideoRoom}
          onClose={() => setActiveVideoRoom(null)}
        />
      )}

      {activeSessionRoom && (
        <SessionReportModal
          booking={activeSessionRoom}
          notes={sessionReportNotes}
          sessionSuccessMsg={sessionSuccessMsg}
          t={t}
          setNotes={setSessionReportNotes}
          onClose={() => setActiveSessionRoom(null)}
          onFileIncident={() => {
            setActiveComplaintBooking(activeSessionRoom);
            setActiveSessionRoom(null);
          }}
          onSubmit={handleCloseSessionWithReport}
        />
      )}

      {activeComplaintBooking && (
        <ComplaintModal
          booking={activeComplaintBooking}
          complaintNotes={complaintNotes}
          complaintSuccess={complaintSuccess}
          t={t}
          setComplaintNotes={setComplaintNotes}
          onClose={() => setActiveComplaintBooking(null)}
          onSubmit={handleFileComplaintSubmit}
        />
      )}

      {/* Floating Sandbox Controls */}
      <SimulatorSettings />
    </div>
  );
}
