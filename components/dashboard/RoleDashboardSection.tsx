"use client";

import { Dispatch, SetStateAction } from "react";
import { FileSpreadsheet, Plus, TrendingUp, UserX, Video } from "lucide-react";
import { AppState, Booking, store } from "@/lib/store";
import { TranslationSet } from "@/lib/translations";

interface RoleDashboardSectionProps {
  state: AppState;
  t: TranslationSet;
  districtList: string[];
  docName: string;
  docSLMC: string;
  docSLMCDocument: string;
  docFee: number;
  docDistrict: string;
  docQualifications: string;
  docBio: string;
  newSlotDateTime: string;
  adminResolutionInput: Record<string, string>;
  commissionInput: number;
  setDocName: Dispatch<SetStateAction<string>>;
  setDocSLMC: Dispatch<SetStateAction<string>>;
  setDocSLMCDocument: Dispatch<SetStateAction<string>>;
  setDocFee: Dispatch<SetStateAction<number>>;
  setDocDistrict: Dispatch<SetStateAction<string>>;
  setDocQualifications: Dispatch<SetStateAction<string>>;
  setDocBio: Dispatch<SetStateAction<string>>;
  setNewSlotDateTime: Dispatch<SetStateAction<string>>;
  setActiveVideoRoom: Dispatch<SetStateAction<Booking | null>>;
  setActiveComplaintBooking: Dispatch<SetStateAction<Booking | null>>;
  setComplaintNotes: Dispatch<SetStateAction<string>>;
  setAdminResolutionInput: Dispatch<SetStateAction<Record<string, string>>>;
  setCommissionInput: Dispatch<SetStateAction<number>>;
  handleDoctorRegisterSubmit: (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  handleAddAvailabilitySlot: (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  handleStartConsultation: (booking: Booking) => void;
  handleExportCSV: () => void;
}

const dashboardCopy = {
  en: {
    doctorOnboarding: "Psychiatrist Onboarding",
    doctorOnboardingSub:
      "Register, verify your SLMC credentials, and start consultation services.",
    doctorName: "Legal Full Name",
    slmcNumber: "SLMC Number",
    feePerSession: "Fee per session (LKR)",
    district: "District",
    slmcProof: "Registry proof file name",
    sandboxProofNote:
      "Sandbox mode stores the file name only. Production should upload and verify the actual PDF/image.",
    professionalQualifications: "Professional Qualifications",
    bioSummary: "Bio Summary",
    bioPlaceholder: "Provide short clinical bio description...",
    onboardingButton: "Onboard On Platform",
    deactivateConfirm: "Are you sure you want to deactivate?",
    deactivateScheduled:
      "Profile enters a mandatory 7-calendar-day safety hold. Deactivation request scheduled!",
    profileManagement: "Profile Management",
    name: "Name",
    mobile: "Mobile",
    email: "Email",
    updateMobile: "Update mobile number",
    updateEmail: "Update email",
    editProfile: "Edit Profile",
    paymentHistory: "Payment History",
    bookingId: "Booking ID",
    doctor: "Doctor",
    scheduledDate: "Scheduled Date",
    amount: "Amount",
    status: "Status",
    actions: "Actions",
    reminderQueued: "Appointment reminder SMS queued in sandbox log.",
    diagnosisPrescriptions: "Diagnosis & Prescriptions",
    specialist: "Specialist",
    boostConfirm: "Boost profile to home page carousel",
    simulatedPackage: "Simulated Package Transaction",
    boostActivated:
      "Boost package activated! Your profile now displays in the prominent Homepage Carousel.",
    profileSlmc: "Profile & SLMC Document",
    registryProof: "Registry proof",
    verifiedSeed: "Verified from seed registry record",
    updateFee: "Update consultation fee",
    updateBio: "Update profile bio",
    doctorHoldQueued: "Doctor account enters the 7-calendar-day hold queue.",
    add: "Add",
    platformCommissionBand: "Platform Commission Band",
    totalConsultations: "Total Consultations",
    patientName: "Patient Name",
    patientNic: "Patient NIC",
    startConsultation: "Start Consultation",
    reportApproved: "Report Filed & Approved",
    adminSub:
      "Verify SLMC licenses, moderate disputes, configure platform parameters.",
    exportCsv: "Export Booking Reports (CSV)",
    totalVerified: "Total Verified Psychiatrists",
    pendingApproval: "Pending Approval",
    totalClientAccounts: "Total Client Accounts",
    grossRevenue: "Gross Facilitation Revenue",
    clientControls: "Client Account Controls",
    transactionsRefund: "Transactions & Refund Approval",
    refundConfirm: "Approve manual refund for booking",
    slmcAudit: "Mandatory SLMC Registry Auditing",
    noComplaints: "No user grievances or incident reports logged.",
    resolutionPlaceholder: "Write resolution decision...",
    complaintResolved: "Complaint resolved manually and notifications sent!",
    resolvedDecision: "Resolved Decision",
    superadminSub:
      "Adjust global commission policies, manage administrative users, and analyze revenue margins.",
    commissionNote:
      "Commission values must remain strictly within the 15% - 20% bracket.",
    rate: "Rate",
    commissionSet: "Platform commission successfully set",
    futureBookings: "on future bookings!",
    smsConfig: "SMS Gateway Configuration",
    apiEndpoint: "API Gateway Endpoint",
    senderId: "Gateway Mask / Sender ID",
    boostPaymentSettings: "Boosting & Payment Settings",
    boostPrice: "Boost Package Price (LKR)",
    lankaPayEnabled: "LankaPay enabled",
    cardEnabled: "Visa/Mastercard enabled",
    adminAccounts: "Admin Accounts & Permissions",
    adminName: "Admin name",
    adminRole: "Admin role",
    permissionsPrompt: "Permissions comma separated",
  },
  si: {
    doctorOnboarding: "මනෝ වෛද්‍ය ලියාපදිංචිය",
    doctorOnboardingSub: "SLMC අක්තපත්‍ර සත්‍යාපනය කර උපදේශන සේවා ආරම්භ කරන්න.",
    doctorName: "නීතිමය සම්පූර්ණ නම",
    slmcNumber: "SLMC අංකය",
    feePerSession: "සැසියකට ගාස්තුව (LKR)",
    district: "දිස්ත්‍රික්කය",
    slmcProof: "ලියාපදිංචි සාක්ෂි ගොනු නම",
    sandboxProofNote:
      "Sandbox mode තුළ ගොනු නම පමණක් සුරකියි. Production තුළ සැබෑ PDF/image upload කර verify කළ යුතුය.",
    professionalQualifications: "වෘත්තීය සුදුසුකම්",
    bioSummary: "කෙටි ජීව දත්ත",
    bioPlaceholder: "කෙටි සායනික bio විස්තරයක් ලියන්න...",
    onboardingButton: "වේදිකාවට ලියාපදිංචි කරන්න",
    deactivateConfirm: "ගිණුම අක්‍රීය කිරීමට ඔබට විශ්වාසද?",
    deactivateScheduled:
      "පැතිකඩ දින 7ක අනිවාර්ය safety hold වෙත යවයි. අක්‍රීය කිරීම සැලසුම් කරන ලදී!",
    profileManagement: "පැතිකඩ කළමනාකරණය",
    name: "නම",
    mobile: "ජංගම",
    email: "ඊමේල්",
    updateMobile: "ජංගම අංකය යාවත්කාලීන කරන්න",
    updateEmail: "ඊමේල් යාවත්කාලීන කරන්න",
    editProfile: "පැතිකඩ සංස්කරණය",
    paymentHistory: "ගෙවීම් ඉතිහාසය",
    bookingId: "වෙන්කිරීම් අංකය",
    doctor: "වෛද්‍යවරයා",
    scheduledDate: "නියමිත දිනය",
    amount: "මුදල",
    status: "තත්ත්වය",
    actions: "ක්‍රියා",
    reminderQueued: "වෙන්කිරීම් මතක් කිරීමේ SMS එක sandbox log වෙත යවන ලදී.",
    diagnosisPrescriptions: "රෝග නිර්ණය සහ ඖෂධ නියම",
    specialist: "විශේෂඥයා",
    boostConfirm: "පැතිකඩ homepage carousel වෙත boost කරන්න",
    simulatedPackage: "Simulated package transaction",
    boostActivated:
      "Boost package සක්‍රීයයි! ඔබේ පැතිකඩ homepage carousel තුළ පෙන්වයි.",
    profileSlmc: "පැතිකඩ සහ SLMC ලේඛනය",
    registryProof: "ලියාපදිංචි සාක්ෂිය",
    verifiedSeed: "Seed registry record මඟින් සත්‍යාපිතයි",
    updateFee: "උපදේශන ගාස්තුව යාවත්කාලීන කරන්න",
    updateBio: "පැතිකඩ bio යාවත්කාලීන කරන්න",
    doctorHoldQueued: "වෛද්‍ය ගිණුම දින 7ක hold queue වෙත යවයි.",
    add: "එකතු කරන්න",
    platformCommissionBand: "වේදිකා කොමිස් පරාසය",
    totalConsultations: "මුළු උපදේශන",
    patientName: "රෝගියාගේ නම",
    patientNic: "රෝගියාගේ NIC",
    startConsultation: "උපදේශනය ආරම්භ කරන්න",
    reportApproved: "වාර්තාව යවා අනුමතයි",
    adminSub:
      "SLMC බලපත්‍ර verify කරන්න, disputes moderate කරන්න, platform settings සකසන්න.",
    exportCsv: "වෙන්කිරීම් වාර්තා CSV ලෙස export කරන්න",
    totalVerified: "සත්‍යාපිත මනෝ වෛද්‍යවරු",
    pendingApproval: "අනුමැතිය සඳහා pending",
    totalClientAccounts: "මුළු සේවාලාභී ගිණුම්",
    grossRevenue: "මුළු පහසුකම් ආදායම",
    clientControls: "සේවාලාභී ගිණුම් පාලනය",
    transactionsRefund: "ගනුදෙනු සහ refund අනුමැතිය",
    refundConfirm: "manual refund අනුමත කරන්න: booking",
    slmcAudit: "අනිවාර්ය SLMC registry audit",
    noComplaints: "පරිශීලක පැමිණිලි හෝ incident reports නොමැත.",
    resolutionPlaceholder: "විසඳුම් තීරණය ලියන්න...",
    complaintResolved: "පැමිණිල්ල අතින් විසඳා notifications යවන ලදී!",
    resolvedDecision: "විසඳූ තීරණය",
    superadminSub:
      "Global commission policies සකසන්න, admins කළමනාකරණය කරන්න, revenue margins විශ්ලේෂණය කරන්න.",
    commissionNote: "Commission අගයන් 15% - 20% පරාසය තුළම තිබිය යුතුය.",
    rate: "අනුපාතය",
    commissionSet: "Platform commission සාර්ථකව සකසන ලදී",
    futureBookings: "ඉදිරි වෙන්කිරීම් සඳහා!",
    smsConfig: "SMS gateway සැකසුම්",
    apiEndpoint: "API gateway endpoint",
    senderId: "Gateway mask / sender ID",
    boostPaymentSettings: "Boosting සහ payment settings",
    boostPrice: "Boost package price (LKR)",
    lankaPayEnabled: "LankaPay සක්‍රීයයි",
    cardEnabled: "Visa/Mastercard සක්‍රීයයි",
    adminAccounts: "Admin ගිණුම් සහ අවසර",
    adminName: "Admin නම",
    adminRole: "Admin භූමිකාව",
    permissionsPrompt: "අවසර comma වලින් වෙන් කර ලියන්න",
  },
  ta: {
    doctorOnboarding: "மனநல மருத்துவர் பதிவு",
    doctorOnboardingSub:
      "SLMC சான்றுகளை சரிபார்த்து ஆலோசனை சேவைகளைத் தொடங்குங்கள்.",
    doctorName: "சட்டப்பூர்வ முழுப் பெயர்",
    slmcNumber: "SLMC எண்",
    feePerSession: "ஒரு அமர்வுக்கான கட்டணம் (LKR)",
    district: "மாவட்டம்",
    slmcProof: "பதிவு சான்று கோப்பு பெயர்",
    sandboxProofNote:
      "Sandbox mode கோப்பு பெயரை மட்டும் சேமிக்கும். Production-இல் உண்மையான PDF/image upload செய்து verify செய்ய வேண்டும்.",
    professionalQualifications: "தொழில்முறை தகுதிகள்",
    bioSummary: "சுருக்கமான bio",
    bioPlaceholder: "சுருக்கமான மருத்துவ bio விவரத்தை எழுதவும்...",
    onboardingButton: "தளத்தில் பதிவு செய்",
    deactivateConfirm: "கணக்கை செயலிழக்கச் செய்ய உறுதியாக உள்ளீர்களா?",
    deactivateScheduled:
      "சுயவிவரம் கட்டாய 7 நாள் safety hold-க்கு செல்கிறது. செயலிழப்பு கோரிக்கை திட்டமிடப்பட்டது!",
    profileManagement: "சுயவிவர மேலாண்மை",
    name: "பெயர்",
    mobile: "கைபேசி",
    email: "மின்னஞ்சல்",
    updateMobile: "கைபேசி எண்ணை புதுப்பிக்கவும்",
    updateEmail: "மின்னஞ்சலை புதுப்பிக்கவும்",
    editProfile: "சுயவிவரத்தைத் திருத்து",
    paymentHistory: "கட்டண வரலாறு",
    bookingId: "முன்பதிவு ID",
    doctor: "மருத்துவர்",
    scheduledDate: "திட்டமிட்ட தேதி",
    amount: "தொகை",
    status: "நிலை",
    actions: "செயல்கள்",
    reminderQueued:
      "முன்பதிவு நினைவூட்டல் SMS sandbox log-க்கு அனுப்பப்பட்டது.",
    diagnosisPrescriptions: "நோயறிதல் மற்றும் மருந்துகள்",
    specialist: "நிபுணர்",
    boostConfirm: "சுயவிவரத்தை homepage carousel-க்கு boost செய்யவும்",
    simulatedPackage: "Simulated package transaction",
    boostActivated:
      "Boost package செயல்படுத்தப்பட்டது! உங்கள் சுயவிவரம் homepage carousel-ல் தெரியும்.",
    profileSlmc: "சுயவிவரம் மற்றும் SLMC ஆவணம்",
    registryProof: "பதிவு சான்று",
    verifiedSeed: "Seed registry record மூலம் சரிபார்க்கப்பட்டது",
    updateFee: "ஆலோசனை கட்டணத்தை புதுப்பிக்கவும்",
    updateBio: "சுயவிவர bio புதுப்பிக்கவும்",
    doctorHoldQueued: "மருத்துவர் கணக்கு 7 நாள் hold queue-க்கு செல்கிறது.",
    add: "சேர்",
    platformCommissionBand: "தள கமிஷன் வரம்பு",
    totalConsultations: "மொத்த ஆலோசனைகள்",
    patientName: "நோயாளி பெயர்",
    patientNic: "நோயாளி NIC",
    startConsultation: "ஆலோசனையைத் தொடங்கு",
    reportApproved: "அறிக்கை சமர்ப்பிக்கப்பட்டு அங்கீகரிக்கப்பட்டது",
    adminSub:
      "SLMC உரிமங்களை verify செய்யவும், disputes moderate செய்யவும், platform settings அமைக்கவும்.",
    exportCsv: "முன்பதிவு அறிக்கைகளை CSV ஆக export செய்",
    totalVerified: "மொத்த சரிபார்க்கப்பட்ட மனநல மருத்துவர்கள்",
    pendingApproval: "அங்கீகாரம் நிலுவை",
    totalClientAccounts: "மொத்த பயனர் கணக்குகள்",
    grossRevenue: "மொத்த வசதி வருவாய்",
    clientControls: "பயனர் கணக்கு கட்டுப்பாடு",
    transactionsRefund: "பரிவர்த்தனை மற்றும் refund அங்கீகாரம்",
    refundConfirm: "manual refund அங்கீகரிக்கவும்: booking",
    slmcAudit: "கட்டாய SLMC registry audit",
    noComplaints: "பயனர் புகார்கள் அல்லது incident reports இல்லை.",
    resolutionPlaceholder: "தீர்வு முடிவை எழுதவும்...",
    complaintResolved:
      "புகார் கைமுறையாக தீர்க்கப்பட்டு notifications அனுப்பப்பட்டது!",
    resolvedDecision: "தீர்க்கப்பட்ட முடிவு",
    superadminSub:
      "Global commission policies அமைக்கவும், admins மேலாண்மை செய்யவும், revenue margins ஆய்வு செய்யவும்.",
    commissionNote:
      "Commission மதிப்புகள் 15% - 20% வரம்பிற்குள் இருக்க வேண்டும்.",
    rate: "விகிதம்",
    commissionSet: "Platform commission வெற்றிகரமாக அமைக்கப்பட்டது",
    futureBookings: "எதிர்கால முன்பதிவுகளுக்கு!",
    smsConfig: "SMS gateway அமைப்பு",
    apiEndpoint: "API gateway endpoint",
    senderId: "Gateway mask / sender ID",
    boostPaymentSettings: "Boosting மற்றும் payment settings",
    boostPrice: "Boost package price (LKR)",
    lankaPayEnabled: "LankaPay இயங்குகிறது",
    cardEnabled: "Visa/Mastercard இயங்குகிறது",
    adminAccounts: "Admin கணக்குகள் மற்றும் அனுமதிகள்",
    adminName: "Admin பெயர்",
    adminRole: "Admin பங்கு",
    permissionsPrompt: "அனுமதிகளை comma கொண்டு பிரித்து எழுதவும்",
  },
};

export default function RoleDashboardSection({
  state,
  t,
  districtList,
  docName,
  docSLMC,
  docSLMCDocument,
  docFee,
  docDistrict,
  docQualifications,
  docBio,
  newSlotDateTime,
  adminResolutionInput,
  commissionInput,
  setDocName,
  setDocSLMC,
  setDocSLMCDocument,
  setDocFee,
  setDocDistrict,
  setDocQualifications,
  setDocBio,
  setNewSlotDateTime,
  setActiveVideoRoom,
  setActiveComplaintBooking,
  setComplaintNotes,
  setAdminResolutionInput,
  setCommissionInput,
  handleDoctorRegisterSubmit,
  handleAddAvailabilitySlot,
  handleStartConsultation,
  handleExportCSV,
}: RoleDashboardSectionProps) {
  const copy = dashboardCopy[state.currentLanguage];

  return (
    <>
      {/* Dynamic Contextual Stakeholder Portal Views */}
      <section className="border-t border-hairline pt-10" id="dashboard-view">
        {/* GUEST MODE ONBOARDING FOR PSYCHIATRISTS */}
        {state.currentRole === "guest" && (
          <div className="bg-white rounded-2xl border border-hairline p-8 shadow-sm max-w-3xl mx-auto space-y-6 animate-fade-in font-sans">
            <div className="text-center space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-ink-navy tracking-tight font-display">
                {copy.doctorOnboarding}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-normal">
                {copy.doctorOnboardingSub}
              </p>
            </div>

            <form
              onSubmit={handleDoctorRegisterSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {copy.doctorName}
                </label>
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
                <label className="font-bold text-slate-700">
                  {copy.slmcNumber}
                </label>
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
                <label className="font-bold text-slate-700">
                  {copy.feePerSession}
                </label>
                <input
                  type="number"
                  required
                  value={docFee}
                  onChange={(e) => setDocFee(parseInt(e.target.value))}
                  className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  {copy.district}
                </label>
                <select
                  value={docDistrict}
                  onChange={(e) => setDocDistrict(e.target.value)}
                  className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                >
                  {districtList.map((dist) => (
                    <option key={dist} value={dist}>
                      {t.districts[dist] || dist}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700">
                  {copy.slmcProof}
                </label>
                <input
                  type="text"
                  required
                  placeholder="SLMC-registration-proof.pdf"
                  value={docSLMCDocument}
                  onChange={(e) => setDocSLMCDocument(e.target.value)}
                  className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-500">
                  {copy.sandboxProofNote}
                </p>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-bold text-slate-700">
                  {copy.professionalQualifications}
                </label>
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
                <label className="font-bold text-slate-700">
                  {copy.bioSummary}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={copy.bioPlaceholder}
                  value={docBio}
                  onChange={(e) => setDocBio(e.target.value)}
                  className="w-full border border-hairline bg-paper text-ink-navy rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:border-warm-turmeric focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="sm:col-span-2 bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-2.5 rounded-xl transition-all duration-300 text-xs tracking-wide cursor-pointer shadow-md shadow-warm-turmeric/10"
              >
                {copy.onboardingButton}
              </button>
            </form>
          </div>
        )}

        {/* CLIENT DASHBOARD */}
        {state.currentRole === "client" && (
          <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">
                  {t.myDashboard}
                </h3>
                <p className="text-slate-600 text-xs">
                  {t.roleClient}: Kavindu Wickramasinghe
                </p>
              </div>
              <button
                onClick={() => {
                  if (
                    confirm(
                      `${t.deactivateHoldWarning}\n\n${copy.deactivateConfirm}`,
                    )
                  ) {
                    store.deactivateClient(state.loggedInUserId || "client-1");
                    alert(copy.deactivateScheduled);
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
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.profileManagement}
                </h4>
                {(() => {
                  const client = state.clients.find(
                    (c) => c.id === (state.loggedInUserId || "client-1"),
                  );
                  if (!client) return null;
                  return (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">{copy.name}</span>
                        <strong>{client.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{copy.mobile}</span>
                        <strong>{client.phone}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">{copy.email}</span>
                        <strong>{client.email}</strong>
                      </div>
                      <button
                        onClick={() => {
                          const phone = prompt(copy.updateMobile, client.phone);
                          const email = prompt(copy.updateEmail, client.email);
                          if (phone && email)
                            store.updateClient(client.id, { phone, email });
                        }}
                        className="bg-white border border-hairline px-3 py-2 rounded-xl font-bold hover:border-warm-turmeric"
                      >
                        {copy.editProfile}
                      </button>
                    </div>
                  );
                })()}
              </div>
              <div className="bg-paper border border-hairline rounded-2xl p-4 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.paymentHistory}
                </h4>
                <div className="space-y-2 text-xs">
                  {state.bookings
                    .filter(
                      (b) =>
                        b.clientId === (state.loggedInUserId || "client-1"),
                    )
                    .map((b) => (
                      <div
                        key={`pay-${b.id}`}
                        className="flex justify-between bg-white border border-hairline rounded-xl p-2"
                      >
                        <span>
                          #{b.id} - {b.status}
                        </span>
                        <strong>LKR {b.total}</strong>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Booking History */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-600 tracking-wider uppercase font-display">
                {t.sessions}
              </h4>

              <div className="overflow-x-auto text-slate-700 border border-hairline rounded-xl">
                <table className="w-full text-xs text-left text-slate-750">
                  <thead className="text-[10px] text-ink-navy uppercase bg-paper border-b border-hairline">
                    <tr>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.bookingId}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.doctor}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.scheduledDate}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.amount}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.status}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline text-right">
                        {copy.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline bg-white">
                    {state.bookings
                      .filter(
                        (b) =>
                          b.clientId === (state.loggedInUserId || "client-1"),
                      )
                      .map((booking) => (
                        <tr key={booking.id} className="hover:bg-paper/35">
                          <td className="px-4 py-3 font-semibold text-ink-navy">
                            #{booking.id}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {booking.psychiatristName}
                          </td>
                          <td className="px-4 py-3">
                            {booking.date} at {booking.time}
                          </td>
                          <td className="px-4 py-3 font-bold text-ink-navy">
                            LKR {booking.total}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                booking.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : booking.status === "completed"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-y-1 sm:space-y-0 sm:space-x-2">
                            {booking.status === "paid" && (
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
                            {booking.status === "paid" && (
                              <button
                                onClick={() => {
                                  store.sendAppointmentReminder(booking.id);
                                  alert(copy.reminderQueued);
                                }}
                                className="text-amber-800 hover:underline text-[10px] font-bold block sm:inline mt-1 sm:mt-0"
                              >
                                {t.smsReminder}
                              </button>
                            )}

                            {booking.status === "completed" &&
                              booking.clinicalNotes && (
                                <div className="bg-paper p-3 rounded-lg text-left mt-2 text-[11px] text-slate-700 border border-hairline leading-normal">
                                  <strong>
                                    {copy.diagnosisPrescriptions}:
                                  </strong>{" "}
                                  {booking.clinicalNotes}
                                </div>
                              )}

                            {booking.status === "paid" && (
                              <button
                                onClick={() => {
                                  setActiveComplaintBooking(booking);
                                  setComplaintNotes("");
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-[10px] font-bold block sm:inline mt-1 sm:mt-0"
                              >
                                {t.submitComplaint}
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
        {state.currentRole === "psychiatrist" && (
          <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
            {/* Doctor Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">
                  {t.myDashboard}
                </h3>
                <p className="text-slate-600 text-xs">
                  {copy.specialist}:{" "}
                  <strong className="text-ink-navy">
                    {state.psychiatrists.find(
                      (d) => d.id === state.loggedInUserId,
                    )?.name || "Dr. Ruwan Fernando"}
                  </strong>
                </p>
              </div>

              {/* Boosting Package Option */}
              <button
                onClick={() => {
                  if (
                    confirm(
                      `${copy.boostConfirm} for LKR ${state.config.boostPackageLkr}? (${copy.simulatedPackage})`,
                    )
                  ) {
                    store.purchaseBoost(state.loggedInUserId || "psy-1");
                    alert(copy.boostActivated);
                  }
                }}
                className="mt-3 sm:mt-0 bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 w-fit shadow-xs cursor-pointer transition-all"
              >
                <TrendingUp className="w-3.5 h-3.5 text-ink-navy" />
                <span>
                  {t.purchaseBoost} (LKR {state.config.boostPackageLkr})
                </span>
              </button>
            </div>

            {(() => {
              const doctor = state.psychiatrists.find(
                (d) => d.id === (state.loggedInUserId || "psy-1"),
              );
              if (!doctor) return null;
              return (
                <div className="bg-paper border border-hairline rounded-2xl p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                  <div className="lg:col-span-2 space-y-2">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                      {copy.profileSlmc}
                    </h4>
                    <p className="text-slate-700 leading-relaxed">
                      {doctor.bio}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {copy.registryProof}:{" "}
                      <strong>
                        {doctor.slmcDocumentName || copy.verifiedSeed}
                      </strong>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const fee = prompt(copy.updateFee, String(doctor.fee));
                        const bio = prompt(copy.updateBio, doctor.bio);
                        if (fee && bio)
                          store.updateDoctorProfile(doctor.id, {
                            fee: parseInt(fee),
                            bio,
                          });
                      }}
                      className="bg-white border border-hairline px-3 py-2 rounded-xl font-bold hover:border-warm-turmeric"
                    >
                      Edit Profile / Fee
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(t.deactivateHoldWarning)) {
                          store.deactivateDoctor(doctor.id);
                          alert(copy.doctorHoldQueued);
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
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {t.addSlot}
                </h4>

                <form
                  onSubmit={handleAddAvailabilitySlot}
                  className="flex space-x-2"
                >
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
                    <span>{copy.add}</span>
                  </button>
                </form>
              </div>

              {/* 2. Earnings Ledgers */}
              <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-3">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {t.earningsTitle}
                </h4>

                <div className="flex justify-between items-center text-xs text-slate-600">
                  <span>{copy.platformCommissionBand}:</span>
                  <span className="font-bold text-ink-navy">
                    {state.config.commissionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-600 border-t border-hairline pt-2">
                  <span>{copy.totalConsultations}:</span>
                  <span className="font-bold text-ink-navy">
                    {
                      state.bookings.filter(
                        (b) =>
                          b.psychiatristId ===
                            (state.loggedInUserId || "psy-1") &&
                          b.status === "completed",
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-hairline pt-2 font-bold text-ink-navy">
                  <span>{t.netEarnings}:</span>
                  <span className="text-emerald-700 font-bold">
                    LKR{" "}
                    {state.bookings
                      .filter(
                        (b) =>
                          b.psychiatristId ===
                            (state.loggedInUserId || "psy-1") &&
                          b.status === "completed",
                      )
                      .reduce((acc, b) => acc + (b.fee - b.commission), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointments List for Doctor */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                {t.upcomingSessions}
              </h4>

              <div className="overflow-x-auto text-slate-700 border border-hairline rounded-xl">
                <table className="w-full text-xs text-left text-slate-750">
                  <thead className="text-[10px] text-ink-navy uppercase bg-paper border-b border-hairline">
                    <tr>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.bookingId}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.patientName}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.patientNic}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.scheduledDate}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline">
                        {copy.status}
                      </th>
                      <th className="px-4 py-3 border-b border-hairline text-right">
                        {copy.actions}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline bg-white">
                    {state.bookings
                      .filter(
                        (b) =>
                          b.psychiatristId ===
                          (state.loggedInUserId || "psy-1"),
                      )
                      .map((booking) => (
                        <tr key={booking.id} className="hover:bg-paper/35">
                          <td className="px-4 py-3 font-semibold text-ink-navy">
                            #{booking.id}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {booking.clientName}
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-600">
                            {booking.clientNIC}
                          </td>
                          <td className="px-4 py-3">
                            {booking.date} at {booking.time}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                booking.status === "paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : booking.status === "completed"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-y-1.5">
                            {booking.status === "paid" && (
                              <div className="flex flex-col sm:flex-row items-end sm:items-center justify-end space-y-1.5 sm:space-y-0 sm:space-x-2">
                                <button
                                  onClick={() => {
                                    setActiveVideoRoom(booking);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-md font-bold text-[10px] inline-flex items-center space-x-1 cursor-pointer transition-all"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>{copy.startConsultation}</span>
                                </button>
                                <button
                                  onClick={() =>
                                    handleStartConsultation(booking)
                                  }
                                  className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-2.5 py-1.5 rounded-md font-bold text-[10px] cursor-pointer transition-all shadow-xs"
                                >
                                  {t.submitSessionReport}
                                </button>
                              </div>
                            )}

                            {booking.status === "completed" && (
                              <span className="text-slate-500 italic text-[10px]">
                                {copy.reportApproved}
                              </span>
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
        {state.currentRole === "admin" && (
          <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-hairline pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">
                  {t.roleAdmin}
                </h3>
                <p className="text-slate-600 text-xs font-sans">
                  {copy.adminSub}
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="mt-3 sm:mt-0 bg-paper hover:bg-slate-100 text-ink-navy px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 w-fit border border-hairline cursor-pointer transition-all font-sans shadow-xs"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                <span>{copy.exportCsv}</span>
              </button>
            </div>

            {/* Telemetry Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {copy.totalVerified}
                </span>
                <span className="text-xl font-extrabold text-ink-navy mt-1 block font-display">
                  {state.psychiatrists.filter((d) => d.slmcVerified).length}
                </span>
              </div>
              <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {copy.pendingApproval}
                </span>
                <span className="text-xl font-extrabold text-amber-600 mt-1 block font-display">
                  {state.psychiatrists.filter((d) => !d.slmcVerified).length}
                </span>
              </div>
              <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {copy.totalClientAccounts}
                </span>
                <span className="text-xl font-extrabold text-ink-navy mt-1 block font-display">
                  {state.clients.length}
                </span>
              </div>
              <div className="bg-paper p-4 rounded-xl border border-hairline text-center shadow-xs">
                <span className="block text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                  {copy.grossRevenue}
                </span>
                <span className="text-xl font-extrabold text-amber-800 mt-1 block font-mono font-bold">
                  LKR{" "}
                  {state.bookings
                    .filter(
                      (b) => b.status === "completed" || b.status === "paid",
                    )
                    .reduce((acc, b) => acc + b.commission, 0)}
                </span>
              </div>
            </div>

            {/* Client and Payment Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.clientControls}
                </h4>
                <div className="space-y-3">
                  {state.clients.map((client) => (
                    <div
                      key={client.id}
                      className="bg-paper border border-hairline rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="text-xs">
                        <strong className="block text-ink-navy">
                          {client.name}
                        </strong>
                        <span className="text-slate-600">
                          {client.phone} · {client.district}
                        </span>
                        {client.deactivatedAt && (
                          <span className="block text-red-600 text-[10px]">
                            7-day deactivation hold started{" "}
                            {client.deactivatedAt.slice(0, 10)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          store.setClientSuspended(client.id, !client.suspended)
                        }
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border ${
                          client.suspended
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {client.suspended ? "Reactivate" : "Suspend"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.transactionsRefund}
                </h4>
                <div className="space-y-3">
                  {state.bookings.map((booking) => (
                    <div
                      key={`admin-pay-${booking.id}`}
                      className="bg-paper border border-hairline rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="text-xs">
                        <strong className="block text-ink-navy">
                          #{booking.id} · LKR {booking.total}
                        </strong>
                        <span className="text-slate-600">
                          {booking.clientName} → {booking.psychiatristName}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          Commission LKR {booking.commission} · {booking.status}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`${copy.refundConfirm} #${booking.id}?`))
                            store.refundBooking(booking.id);
                        }}
                        disabled={booking.status === "refunded"}
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
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                {copy.slmcAudit}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.psychiatrists.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-paper p-4 rounded-xl border border-hairline flex items-center justify-between font-sans shadow-xs"
                  >
                    <div className="space-y-1">
                      <span className="block font-bold text-ink-navy text-xs">
                        {doc.name}
                      </span>
                      <span className="block text-[10px] text-slate-600">
                        {doc.qualifications}
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 font-semibold">
                        {doc.slmcNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => store.toggleDoctorVerification(doc.id)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        doc.slmcVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      {doc.slmcVerified
                        ? "Verified (Revoke)"
                        : "Pending (Approve)"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Complaints Dispute Resolution */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                {t.viewComplaints}
              </h4>

              {state.complaints.length === 0 ? (
                <p className="text-slate-500 text-xs italic">
                  {copy.noComplaints}
                </p>
              ) : (
                <div className="space-y-4">
                  {state.complaints.map((cmp) => (
                    <div
                      key={cmp.id}
                      className="bg-paper p-4 rounded-xl border border-hairline space-y-3 font-sans shadow-xs"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-ink-navy uppercase font-display">
                          Ticket #{cmp.id}
                        </span>
                        <span className="text-slate-500">{cmp.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-normal font-normal">
                        <strong>
                          {cmp.userName} ({cmp.userRole}):
                        </strong>{" "}
                        {cmp.notes}
                      </p>

                      {cmp.status === "pending" ? (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder={copy.resolutionPlaceholder}
                            value={adminResolutionInput[cmp.id] || ""}
                            onChange={(e) =>
                              setAdminResolutionInput((prev) => ({
                                ...prev,
                                [cmp.id]: e.target.value,
                              }))
                            }
                            className="border border-hairline bg-white text-ink-navy rounded-lg p-1.5 text-xs flex-1"
                          />
                          <button
                            onClick={() => {
                              const notes = adminResolutionInput[cmp.id];
                              if (!notes) return;
                              store.resolveComplaint(cmp.id, notes);
                              alert(copy.complaintResolved);
                            }}
                            className="bg-warm-turmeric text-ink-navy px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all hover:bg-warm-turmeric/90"
                          >
                            {t.submitButton}
                          </button>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-800 text-[11px] leading-normal font-medium">
                          <strong>{copy.resolvedDecision}:</strong>{" "}
                          {cmp.resolutionDetails}
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
        {state.currentRole === "superadmin" && (
          <div className="bg-white rounded-2xl border border-hairline p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="border-b border-hairline pb-4">
              <h3 className="text-xl font-bold text-ink-navy tracking-tight font-display">
                {t.roleSuperAdmin}
              </h3>
              <p className="text-slate-600 text-xs font-sans">
                {copy.superadminSub}
              </p>
            </div>

            {/* Multi-language Commission Rates Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Commission Band Slider */}
              <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                    {t.setCommission}
                  </h4>
                  <p className="text-slate-500 text-[10px]">
                    {copy.commissionNote}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>{copy.rate}:</span>
                    <span className="text-amber-800 font-mono text-sm font-bold">
                      {commissionInput}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="20"
                    step="1"
                    value={commissionInput}
                    onChange={(e) =>
                      setCommissionInput(parseInt(e.target.value))
                    }
                    className="w-full accent-warm-turmeric cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => {
                    store.updateConfig({ commissionRate: commissionInput });
                    alert(
                      `${copy.commissionSet} ${commissionInput}% ${copy.futureBookings}`,
                    );
                  }}
                  className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-4 py-2.5 rounded-xl text-xs font-bold w-full transition-all cursor-pointer shadow-xs"
                >
                  {t.setCommission}
                </button>
              </div>

              {/* Simulated payment Gateway and SMS Credentials */}
              <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.smsConfig}
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="block text-slate-600 font-semibold text-[10px] uppercase">
                      {copy.apiEndpoint}
                    </span>
                    <input
                      type="text"
                      value={state.config.smsGatewayUrl}
                      onChange={(e) =>
                        store.updateConfig({ smsGatewayUrl: e.target.value })
                      }
                      className="w-full border border-hairline rounded-lg p-2 bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-slate-600 font-semibold text-[10px] uppercase">
                      {copy.senderId}
                    </span>
                    <input
                      type="text"
                      value={state.config.smsSenderId}
                      onChange={(e) =>
                        store.updateConfig({ smsSenderId: e.target.value })
                      }
                      className="w-full border border-hairline rounded-lg p-2 text-xs bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4">
                <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                  {copy.boostPaymentSettings}
                </h4>
                <div className="space-y-3 text-xs">
                  <label className="block space-y-1">
                    <span className="block text-slate-600 font-semibold text-[10px] uppercase">
                      {copy.boostPrice}
                    </span>
                    <input
                      type="number"
                      value={state.config.boostPackageLkr}
                      onChange={(e) =>
                        store.updateConfig({
                          boostPackageLkr: parseInt(e.target.value),
                        })
                      }
                      className="w-full border border-hairline rounded-lg p-2 bg-white text-ink-navy focus:ring-1 focus:ring-warm-turmeric"
                    />
                  </label>
                  <label className="flex items-center justify-between bg-white border border-hairline p-2 rounded-lg">
                    <span className="font-semibold">
                      {copy.lankaPayEnabled}
                    </span>
                    <input
                      type="checkbox"
                      checked={state.config.lankaPayEnabled}
                      onChange={(e) =>
                        store.updateConfig({
                          lankaPayEnabled: e.target.checked,
                        })
                      }
                    />
                  </label>
                  <label className="flex items-center justify-between bg-white border border-hairline p-2 rounded-lg">
                    <span className="font-semibold">{copy.cardEnabled}</span>
                    <input
                      type="checkbox"
                      checked={state.config.cardPaymentEnabled}
                      onChange={(e) =>
                        store.updateConfig({
                          cardPaymentEnabled: e.target.checked,
                        })
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="bg-paper p-5 rounded-2xl border border-hairline shadow-xs space-y-4 md:col-span-2">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider font-display">
                    {copy.adminAccounts}
                  </h4>
                  <button
                    onClick={() => {
                      const name = prompt(copy.adminName);
                      const role = prompt(copy.adminRole, "Support Officer");
                      const permissions = prompt(
                        copy.permissionsPrompt,
                        "Complaint resolution,Refund approval",
                      );
                      if (name && role && permissions) {
                        store.addAdminAccount(
                          name,
                          role,
                          permissions
                            .split(",")
                            .map((p) => p.trim())
                            .filter(Boolean),
                        );
                      }
                    }}
                    className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy px-3 py-2 rounded-xl text-xs font-bold"
                  >
                    {t.roleAdmin}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {state.config.adminAccounts.map((admin) => (
                    <div
                      key={admin.id}
                      className="bg-white border border-hairline rounded-xl p-3 text-xs"
                    >
                      <strong className="block text-ink-navy">
                        {admin.name}
                      </strong>
                      <span className="text-slate-600">{admin.role}</span>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {admin.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="bg-paper border border-hairline px-2 py-1 rounded-md text-[10px] font-bold text-slate-600"
                          >
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
    </>
  );
}
