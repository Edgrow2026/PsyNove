"use client";

import { supabase } from "../lib/supabase";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SimulatorSettings from "../components/SimulatorSettings";
import PwaRegister from "../components/PwaRegister";
import ClientRegistrationModal from "../components/booking/ClientRegistrationModal";
import ComplaintModal from "../components/booking/ComplaintModal";
import PaymentModal from "../components/payment/PaymentModal";
import SessionReportModal from "../components/consultation/SessionReportModal";
import VideoRoomModal from "../components/consultation/VideoRoomModal";
import AboutPreview from "../components/home/AboutPreview";
import DoctorSearchSection from "../components/home/DoctorSearchSection";
import HeroSection from "../components/home/HeroSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Footer from "../components/layout/Footer";
import RoleDashboardSection from "../components/dashboard/RoleDashboardSection";
import {
  store,
  AppState,
  Psychiatrist,
  Booking,
  Complaint,
  ClientProfile,
} from "../lib/store";
import { translations, Language } from "../lib/translations";
import { uiCopy } from "../lib/ui-copy";

export default function HomePage() {
  const [state, setState] = useState<AppState>(() => store.getState());

  // Search/Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [maxFee, setMaxFee] = useState<number>(6000);

  // Modal / Interaction State
  const [selectedDoc, setSelectedDoc] = useState<Psychiatrist | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  // Registration Flow (Triggered when unauthenticated books a slot)
  const [showRegisterFlow, setShowRegisterFlow] = useState(false);
  const [regName, setRegName] = useState("");
  const [regNIC, setRegNIC] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regDistrict, setRegDistrict] = useState("Colombo");
  const [regLanguages, setRegLanguages] = useState<string[]>(["Sinhala"]);
  const [regPassword, setRegPassword] = useState("");

  // Doctor Registration Form
  const [docName, setDocName] = useState("");
  const [docSLMC, setDocSLMC] = useState("");
  const [docSLMCDocument, setDocSLMCDocument] = useState("");
  const [docFee, setDocFee] = useState<number>(3500);
  const [docDistrict, setDocDistrict] = useState("Colombo");
  const [docLanguages, setDocLanguages] = useState<
    ("Sinhala" | "Tamil" | "English")[]
  >(["Sinhala"]);
  const [docQualifications, setDocQualifications] = useState("");
  const [docBio, setDocBio] = useState("");

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
  const [paymentMethod, setPaymentMethod] = useState<"lankapay" | "card">(
    "card",
  );
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [payStatus, setPayStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  // Doctor Calendar Slot State
  const [newSlotDateTime, setNewSlotDateTime] = useState("");

  // Active Session state
  const [activeSessionRoom, setActiveSessionRoom] = useState<Booking | null>(
    null,
  );
  const [activeVideoRoom, setActiveVideoRoom] = useState<Booking | null>(null);
  const [sessionReportNotes, setSessionReportNotes] = useState("");
  const [sessionSuccessMsg, setSessionSuccessMsg] = useState(false);

  // Complaints / Reports
  const [activeComplaintBooking, setActiveComplaintBooking] =
    useState<Booking | null>(null);
  const [complaintNotes, setComplaintNotes] = useState("");
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Admin / Settings Inputs
  const [commissionInput, setCommissionInput] = useState<number>(18);
  const [adminResolutionInput, setAdminResolutionInput] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const unsub = store.subscribe(() => {
      const s = store.getState();
      setState({ ...s });
    });
    return unsub;
  }, []);

  useEffect(() => {
    async function fetchPsychiatrists() {
      const { data, error } = await supabase
        .from("psychiatrist_profiles")
        .select(
          `
        user_id,
        slmc_number,
        qualifications,
        bio,
        specializations,
        consultation_languages,
        consultation_fee,
        verification_status,
        is_boosted,
        boost_expires_at,
        profiles (
          full_name,
          district,
          avatar_url
        )
      `,
        )
        .select(
          `
        user_id,
        slmc_number,
        qualifications,
        bio,
        specializations,
        consultation_languages,
        consultation_fee,
        verification_status,
        is_boosted,
        boost_expires_at,
        profiles (
          full_name,
          district,
          avatar_url
        )
      `,
        )
        .eq("verification_status", "verified");

      if (error) {
        console.error("Error fetching psychiatrists:", error);
        console.error("Error fetching psychiatrists:", error);
        return;
      }

      console.log("Psychiatrists:", data);
      console.log("Psychiatrists:", data);
    }

    fetchPsychiatrists();
  }, []);

  const t = translations[state.currentLanguage];
  const lang = state.currentLanguage;
  const copy = uiCopy[lang];

  // Filter and Search Logic
  const filteredDoctors = state.psychiatrists.filter((doc) => {
    // Search input (Name or qualifications)
    const matchSearch =
      searchQuery === "" ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualifications.toLowerCase().includes(searchQuery.toLowerCase());

    // District Filter
    const matchDistrict =
      selectedDistrict === "" || doc.district === selectedDistrict;

    // Doctor consults in selected language
    const matchLanguage =
      selectedLanguage === "" ||
      doc.languages.includes(selectedLanguage as any);

    // Availability Filter (Checks if doctor has any slot matching the date)
    const matchDate =
      selectedDate === "" ||
      doc.availableSlots.some((slot) => slot.startsWith(selectedDate));

    // Fee range filter
    const matchFee = doc.fee <= maxFee;

    return (
      doc.slmcVerified &&
      !doc.deactivatedAt &&
      matchSearch &&
      matchDistrict &&
      matchLanguage &&
      matchDate &&
      matchFee
    );
  });

  // Split into Boosted and Normal
  const boostedDocs = filteredDoctors
    .filter((d) => d.isBoosted && d.slmcVerified)
    .slice(0, 6);
  const regularDocs = filteredDoctors.filter(
    (d) => !d.isBoosted || !d.slmcVerified,
  );

  useEffect(() => {
    if (!showPaymentModal || !paymentPendingBooking) return;
    const timer = window.setInterval(() => {
      setPaymentCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setPayStatus("failed");
          setShowPaymentModal(false);
          setPaymentPendingBooking(null);
          alert(copy.paymentExpired);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [showPaymentModal, paymentPendingBooking, copy.paymentExpired]);

  const handleBookTrigger = (doc: Psychiatrist, slotStr: string) => {
    // 1. If unauthenticated, trigger registration/login flow
    if (state.currentRole === "guest") {
      setSelectedDoc(doc);
      setBookingSlot(slotStr);
      setShowRegisterFlow(true);
      return;
    }

    // 2. If authenticated as Client, redirect straight to Pre-payment screen
    if (state.currentRole === "client") {
      const [datePart, timePart] = slotStr.split("T");
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
      alert(copy.switchToClient);
    }
  };

  const formatTimeStr = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    const displayHr = hr % 12 || 12;
    return `${displayHr}:${m} ${ampm}`;
  };

  const closeRegisterFlow = () => {
    setShowRegisterFlow(false);
    setSelectedDoc(null);
    setBookingSlot(null);
  };

  const handleUseSandboxClient = () => {
    store.setRole("client", "client-1");
    setShowRegisterFlow(false);

    if (selectedDoc && bookingSlot) {
      const [datePart, timePart] = bookingSlot.split("T");
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

  const handleClientRegisterSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!regName || !regNIC || !regPhone || !regEmail || !regPassword) {
      alert("Please complete all required fields.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: {
        data: {
          full_name: regName,
          mobile: regPhone,
          role: "client",
          ui_language: "si",
        },
      },
    });

    if (error) {
      console.error("Registration error:", error);
      alert(error.message);
      return;
    }

    if (!data.user) {
      alert("Unable to create the user account.");
      return;
    }

    const { error: clientProfileError } = await supabase
      .from("client_profiles")
      .insert({
        user_id: data.user.id,
        nic_or_passport_encrypted: regNIC,
      });

    if (clientProfileError) {
      console.error("Client profile error:", clientProfileError);
      alert(clientProfileError.message);
      return;
    }

    // // Keep your current local store temporarily
    // store.registerClient({
    //   name: regName,
    //   nic: regNIC,
    //   phone: regPhone,
    //   email: regEmail,
    //   district: regDistrict,
    //   languages: regLanguages,
    //   password: regPassword,
    // });

    // setShowRegisterFlow(false);

    // Continue your current booking/payment flow
    if (selectedDoc && bookingSlot) {
      const [datePart, timePart] = bookingSlot.split("T");

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

    alert("Registration successful.");
  };
  const completePaidBooking = () => {
    if (!paymentPendingBooking) return;
    const fee = paymentPendingBooking.fee;
    const commission = Math.round(fee * (state.config.commissionRate / 100));
    const total = fee + commission;

    store.createBooking({
      clientId: state.loggedInUserId || "client-1",
      clientName:
        state.clients.find((c) => c.id === state.loggedInUserId)?.name ||
        "Kavindu Wickramasinghe",
      clientPhone:
        state.clients.find((c) => c.id === state.loggedInUserId)?.phone ||
        "+94771234567",
      clientNIC:
        state.clients.find((c) => c.id === state.loggedInUserId)?.nic ||
        "199428392019V",
      psychiatristId: paymentPendingBooking.docId,
      psychiatristName: paymentPendingBooking.docName,
      date: paymentPendingBooking.date,
      time: paymentPendingBooking.time,
      fee,
      commission,
      total,
      status: "paid",
    });

    setPayStatus("success");
    setTimeout(() => {
      setShowPaymentModal(false);
      setPaymentPendingBooking(null);
      setBookingSlot(null);
      setPayStatus("idle");
      setCardNumber("");
      setCardExpiry("");
      setCardCVV("");
    }, 2000);
  };

  const loadPayHereScript = () => {
    if (typeof window === "undefined") return Promise.reject();
    if ((window as any).payhere) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      const existing = document.getElementById("payhere-sdk");
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }

      const script = document.createElement("script");
      script.id = "payhere-sdk";
      script.src = "https://www.payhere.lk/lib/payhere.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleProcessPayment = async () => {
    if (!paymentPendingBooking) return;
    setPayStatus("processing");

    const fee = paymentPendingBooking.fee;
    const commission = Math.round(fee * (state.config.commissionRate / 100));
    const total = fee + commission;
    const activeClient =
      state.clients.find((c) => c.id === state.loggedInUserId) ||
      state.clients[0];
    const orderId = `PSYNOVA-${Date.now()}`;

    try {
      const res = await fetch("/api/payhere/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount: total, currency: "LKR" }),
      });
      const payhereConfig = await res.json();

      if (payhereConfig.configured) {
        await loadPayHereScript();
        const payhere = (window as any).payhere;

        payhere.onCompleted = () => completePaidBooking();
        payhere.onDismissed = () => setPayStatus("idle");
        payhere.onError = () => setPayStatus("failed");

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
          first_name: activeClient?.name?.split(" ")[0] || "PsyNova",
          last_name:
            activeClient?.name?.split(" ").slice(1).join(" ") || "Client",
          email: activeClient?.email || "client@psynova.lk",
          phone: activeClient?.phone || "+94770000000",
          address: activeClient?.district || "Colombo",
          city: activeClient?.district || "Colombo",
          country: "Sri Lanka",
        });
        return;
      }
    } catch (error) {
      console.warn(
        "PayHere checkout unavailable, using local simulator fallback.",
        error,
      );
    }

    setTimeout(() => {
      if (paymentMethod === "card" && cardNumber.length < 12) {
        setPayStatus("failed");
        return;
      }
      completePaidBooking();
    }, 1200);
  };

  // Doctor Action
  const handleAddAvailabilitySlot = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!newSlotDateTime || !state.loggedInUserId) return;
    store.addSlot(state.loggedInUserId, newSlotDateTime);
    setNewSlotDateTime("");
    alert(copy.slotPublished);
  };

  // Session Action
  const handleStartConsultation = (booking: Booking) => {
    setActiveSessionRoom(booking);
    setSessionReportNotes("");
    setSessionSuccessMsg(false);
  };

  const handleCloseSessionWithReport = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!activeSessionRoom) return;

    await store.completeBooking(activeSessionRoom.id, sessionReportNotes);
    setSessionSuccessMsg(true);

    setTimeout(() => {
      setActiveSessionRoom(null);
      setSessionSuccessMsg(false);
    }, 2000);
  };

  // Complaint Submission
  const handleFileComplaintSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!activeComplaintBooking || !complaintNotes) return;

    store.submitComplaint({
      bookingId: activeComplaintBooking.id,
      submittedBy:
        state.currentRole === "psychiatrist" ? "psychiatrist" : "client",
      userName:
        state.currentRole === "client"
          ? state.clients.find((c) => c.id === state.loggedInUserId)?.name ||
            "Client"
          : state.psychiatrists.find((d) => d.id === state.loggedInUserId)
              ?.name || "Psychiatrist",
      userRole: state.currentRole === "client" ? "Client" : "Psychiatrist",
      notes: complaintNotes,
    });

    setComplaintSuccess(true);
    setComplaintNotes("");

    setTimeout(() => {
      setActiveComplaintBooking(null);
      setComplaintSuccess(false);
    }, 2000);
  };

  // Doctor Registration
  const handleDoctorRegisterSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!docName || !docSLMC || !docQualifications || !docBio) return;

    store.registerDoctor({
      name: docName,
      photo: `https://picsum.photos/seed/doctor-${Math.floor(Math.random() * 100)}/300/300`,
      qualifications: docQualifications,
      specializations: ["Depression Counselling", "Mood Regulation"],
      languages: docLanguages,
      district: docDistrict,
      fee: docFee,
      slmcNumber: docSLMC,
      slmcDocumentName: docSLMCDocument || "SLMC-proof-upload-sandbox.pdf",
      bio: docBio,
    });

    // Clear form
    setDocName("");
    setDocSLMC("");
    setDocSLMCDocument("");
    setDocQualifications("");
    setDocBio("");

    alert(copy.doctorRegistrationSubmitted);
  };

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Booking ID,Patient,Doctor,Date,Total LKR,Commission LKR,Status"]
        .concat(
          state.bookings.map(
            (b) =>
              `${b.id},${b.clientName},${b.psychiatristName},${b.date},${b.total},${b.commission},${b.status}`,
          ),
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `psynova_booking_reports_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Districts for select inputs
  const districtList = Object.keys(translations.en.districts);

  return (
    <div
      className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans"
      id="home-root"
    >
      <PwaRegister />
      <Navbar activeSection="home" />

      <HeroSection t={t} lang={lang} />

      {/* Main Search Filters and Listing Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <AboutPreview lang={lang} />

        <WhyChooseUs lang={lang} />

        <DoctorSearchSection
          t={t}
          lang={lang}
          searchQuery={searchQuery}
          selectedDistrict={selectedDistrict}
          selectedLanguage={selectedLanguage}
          selectedDate={selectedDate}
          maxFee={maxFee}
          districtList={districtList}
          boostedDocs={boostedDocs}
          regularDocs={regularDocs}
          setSearchQuery={setSearchQuery}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedLanguage={setSelectedLanguage}
          setSelectedDate={setSelectedDate}
          setMaxFee={setMaxFee}
          formatTime={formatTimeStr}
          onBook={handleBookTrigger}
        />

        <RoleDashboardSection
          state={state}
          t={t}
          districtList={districtList}
          docName={docName}
          docSLMC={docSLMC}
          docSLMCDocument={docSLMCDocument}
          docFee={docFee}
          docDistrict={docDistrict}
          docQualifications={docQualifications}
          docBio={docBio}
          newSlotDateTime={newSlotDateTime}
          adminResolutionInput={adminResolutionInput}
          commissionInput={commissionInput}
          setDocName={setDocName}
          setDocSLMC={setDocSLMC}
          setDocSLMCDocument={setDocSLMCDocument}
          setDocFee={setDocFee}
          setDocDistrict={setDocDistrict}
          setDocQualifications={setDocQualifications}
          setDocBio={setDocBio}
          setNewSlotDateTime={setNewSlotDateTime}
          setActiveVideoRoom={setActiveVideoRoom}
          setActiveComplaintBooking={setActiveComplaintBooking}
          setComplaintNotes={setComplaintNotes}
          setAdminResolutionInput={setAdminResolutionInput}
          setCommissionInput={setCommissionInput}
          handleDoctorRegisterSubmit={handleDoctorRegisterSubmit}
          handleAddAvailabilitySlot={handleAddAvailabilitySlot}
          handleStartConsultation={handleStartConsultation}
          handleExportCSV={handleExportCSV}
        />
      </main>

      <Footer lang={lang} />

      {/* --- ALL MODALS & FLYOUTS (Single-screen architecture) --- */}

      {showRegisterFlow && selectedDoc && bookingSlot && (
        <ClientRegistrationModal
          selectedDoc={selectedDoc}
          bookingSlot={bookingSlot}
          districtList={districtList}
          t={t}
          lang={lang}
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
          lang={lang}
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
          lang={lang}
          onClose={() => setActiveVideoRoom(null)}
        />
      )}

      {activeSessionRoom && (
        <SessionReportModal
          booking={activeSessionRoom}
          notes={sessionReportNotes}
          sessionSuccessMsg={sessionSuccessMsg}
          t={t}
          lang={lang}
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
          lang={lang}
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
