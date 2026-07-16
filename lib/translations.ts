export type Language = 'si' | 'ta' | 'en';

export interface TranslationSet {
  // Navigation
  brandName: string;
  tagline: string;
  home: string;
  about: string;
  support: string;
  terms: string;
  privacy: string;
  login: string;
  logout: string;
  register: string;
  bookSession: string;
  myDashboard: string;
  roleClient: string;
  roleDoctor: string;
  roleAdmin: string;
  roleSuperAdmin: string;

  // Homepage / Landing
  heroTitle: string;
  heroSub: string;
  searchTitle: string;
  boostedTitle: string;
  boostedSub: string;
  searchPlaceholder: string;
  findButton: string;
  onlineNotice: string;
  emergencyDisclaimer: string;

  // Search Filters
  filterDistrict: string;
  filterLanguage: string;
  filterDate: string;
  filterFee: string;
  allDistricts: string;
  allLanguages: string;
  anyDate: string;
  maxFee: string;

  // Doctor Card & Profile
  slmcVerified: string;
  slmcPending: string;
  viewProfile: string;
  hourlyFee: string;
  qualifications: string;
  specializations: string;
  consultationLanguage: string;
  availableSlots: string;
  bookNow: string;
  boostedLabel: string;

  // Booking Flow
  bookingTitle: string;
  reviewSummary: string;
  patientName: string;
  patientNIC: string;
  patientPhone: string;
  patientEmail: string;
  patientDistrict: string;
  patientLanguage: string;
  feeAmount: string;
  commissionLabel: string;
  totalAmount: string;
  payWithLankaPay: string;
  payWithCard: string;
  simulatedGateway: string;
  paymentSuccess: string;
  paymentFailed: string;
  confirmAndPay: string;
  slotTimeoutWarning: string;

  // Consultation Room
  joinRoom: string;
  roomStatus: string;
  sessionStarted: string;
  sessionEnded: string;
  videoNotice: string;
  submitSessionReport: string;
  reportNotes: string;
  submitComplaint: string;
  complaintNotes: string;
  submitButton: string;
  successMessage: string;

  // Dashboards - Common
  dashboardTitle: string;
  overview: string;
  sessions: string;
  upcomingSessions: string;
  completedSessions: string;
  earnings: string;
  profile: string;
  settings: string;
  actions: string;
  cancelBooking: string;
  status: string;
  date: string;
  time: string;
  amount: string;

  // Client Dashboard
  newComplaint: string;
  deactivateAccount: string;
  deactivateHoldWarning: string;
  confirmDeactivate: string;

  // Doctor Dashboard
  addSlot: string;
  slmcUpload: string;
  earningsTitle: string;
  netEarnings: string;
  purchaseBoost: string;
  boostPackageTitle: string;
  boostPackageDesc: string;

  // Admin Dashboard
  platformStats: string;
  totalDoctors: string;
  totalClients: string;
  totalBookings: string;
  totalRevenue: string;
  approveDoctor: string;
  suspendClient: string;
  refundBooking: string;
  viewComplaints: string;
  setCommission: string;
  activePromotions: string;

  // SMS Templates (What actually gets simulated on SMS notifications)
  smsBookingConfirmed: string;
  smsReminder: string;
  smsComplaintReceived: string;

  // Sri Lankan Districts
  districts: Record<string, string>;
}

export const translations: Record<Language, TranslationSet> = {
  si: {
    brandName: "PsyNova",
    tagline: "ශ්‍රී ලංකාවේ ප්‍රමුඛතම මාර්ගගත මනෝ වෛද්‍ය උපදේශන සේවාව",
    home: "මුල් පිටුව",
    about: "අප ගැන",
    support: "සහාය සේවාව",
    terms: "කොන්දේසි",
    privacy: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
    login: "ඇතුල් වන්න",
    logout: "පිටවන්න",
    register: "ලියාපදිංචි වන්න",
    bookSession: "වෙන්කරවා ගැනීම",
    myDashboard: "මගේ පාලක පුවරුව",
    roleClient: "සේවාලාභියා",
    roleDoctor: "මනෝ වෛද්‍යවරයා",
    roleAdmin: "පරිපාලක (Admin)",
    roleSuperAdmin: "ප්‍රධාන පරිපාලක",

    heroTitle: "ඔබේ මානසික සුවතාවය වෙනුවෙන් විශ්වසනීය මඟපෙන්වීමක්",
    heroSub: "ශ්‍රී ලංකාවේ ලියාපදිංචි සහතිකලත් විශේෂඥ මනෝ වෛද්‍යවරුන් පහසුවෙන්ම මාර්ගගතව (Online) සම්බන්ධ කරගන්න.",
    searchTitle: "විශේෂඥ වෛද්‍යවරයෙකු සොයන්න",
    boostedTitle: "අනුමත ප්‍රමුඛ මනෝ වෛද්‍යවරුන්",
    boostedSub: "අපගේ වේදිකාවේ සක්‍රීය විශේෂඥ මනෝ වෛද්‍යවරුන්",
    searchPlaceholder: "නම හෝ සුදුසුකම් අනුව සොයන්න...",
    findButton: "සොයන්න",
    onlineNotice: "සියලුම සාකච්ඡා මාර්ගගතව (Online Video) පමණක් සිදුකෙරේ.",
    emergencyDisclaimer: "අවධානයට: PsyNova හදිසි ප්‍රතිකාර සේවාවක් නොවේ. ඔබට ක්ෂණික මානසික ආතතියක් හෝ හදිසි අවස්ථාවක් ඇත්නම් කරුණාකර ජාතික මානසික සෞඛ්‍ය උපකාරක අංකය 1926 අමතන්න.",

    filterDistrict: "දිස්ත්‍රික්කය",
    filterLanguage: "උපදේශන භාෂාව",
    filterDate: "දිනය",
    filterFee: "උපරිම ගාස්තුව",
    allDistricts: "සියලුම දිස්ත්‍රික්ක",
    allLanguages: "සියලුම භාෂා (සිංහල / தமிழ் / English)",
    anyDate: "ඕනෑම දිනයක්",
    maxFee: "ඕනෑම ගාස්තුවක්",

    slmcVerified: "SLMC සහතිකලත්",
    slmcPending: "අනුමැතිය අපේක්ෂාවෙන්",
    viewProfile: "විස්තර බලන්න",
    hourlyFee: "සැසියක ගාස්තුව",
    qualifications: "සුදුසුකම්",
    specializations: "විශේෂඥතා",
    consultationLanguage: "උපදේශන භාෂාවන්",
    availableSlots: "ලබාගත හැකි වේලාවන්",
    bookNow: "සැසියක් වෙන් කරන්න",
    boostedLabel: "ප්‍රමුඛ",

    bookingTitle: "සැසි වෙන්කිරීමේ පියවර",
    reviewSummary: "තොරතුරු සමාලෝචනය",
    patientName: "රෝගියාගේ සම්පූර්ණ නම",
    patientNIC: "ජාතික හැඳුනුම්පත් (NIC) හෝ විදේශ ගමන් බලපත්‍ර අංකය",
    patientPhone: "ජංගම දුරකථන අංකය",
    patientEmail: "විද්‍යුත් තැපෑල",
    patientDistrict: "දිස්ත්‍රික්කය",
    patientLanguage: "කතා කරන භාෂාව",
    feeAmount: "වෛද්‍ය ගාස්තුව",
    commissionLabel: "පද්ධති ගාස්තුව (Commission)",
    totalAmount: "මුළු මුදල",
    payWithLankaPay: "LankaPay හරහා ගෙවන්න",
    payWithCard: "Visa / Mastercard හරහා ගෙවන්න",
    simulatedGateway: "PayHere ගෙවීම් ද්වාරය (සිමියුලේටරය)",
    paymentSuccess: "ගෙවීම සාර්ථකයි! ඔබගේ වෙන් කිරීම තහවුරු කරන ලදී.",
    paymentFailed: "ගෙවීම අසාර්ථකයි! කරුණාකර නැවත උත්සාහ කරන්න.",
    confirmAndPay: "ගෙවීම් සිදුකර තහවුරු කරන්න",
    slotTimeoutWarning: "අවධානයට: ගෙවීම් විනාඩි 5ක් ඇතුළත සම්පූර්ණ නොකළහොත් මෙම වේලාව ස්වයංක්‍රීයව අන් අය සඳහා නිදහස් කෙරේ.",

    joinRoom: "වීඩියෝ සැසියට සම්බන්ධ වන්න",
    roomStatus: "සැසියේ තත්ත්වය",
    sessionStarted: "සැසිය ආරම්භ කර ඇත",
    sessionEnded: "සැසිය අවසන් කර ඇත",
    videoNotice: "මෙම සැසිය Jitsi Meet ආරක්ෂිත මාධ්‍යය ඔස්සේ සිදුකෙරේ. කිසිදු රෙකෝඩ් කිරීමක් සිදු නොවේ.",
    submitSessionReport: "වෛද්‍ය වාර්තාව ඇතුලත් කරන්න",
    reportNotes: "ප්‍රතිකාර තොරතුරු සහ ඖෂධ නියමයන්",
    submitComplaint: "පැමිණිල්ලක් ඉදිරිපත් කරන්න",
    complaintNotes: "සිදුවූ ගැටලුව පිළිබඳ විස්තරය",
    submitButton: "ඉදිරිපත් කරන්න",
    successMessage: "සාර්ථකව ඇතුලත් කරන ලදී!",

    dashboardTitle: "පාලක පුවරුව",
    overview: "සාරාංශය",
    sessions: "සැසිවාර",
    upcomingSessions: "ඉදිරි සැසිවාර",
    completedSessions: "පසුගිය සැසිවාර",
    earnings: "ප්‍රතිලාභ සහ ආදායම්",
    profile: "පැතිකඩ",
    settings: "සැකසුම්",
    actions: "ක්‍රියාකාරකම්",
    cancelBooking: "වෙන්කිරීම අවලංගු කරන්න",
    status: "තත්ත්වය",
    date: "දිනය",
    time: "වේලාව",
    amount: "මුදල",

    newComplaint: "නව පැමිණිල්ලක් ඉදිරිපත් කරන්න",
    deactivateAccount: "ගිණුම අක්‍රීය කරන්න",
    deactivateHoldWarning: "අවධානයට: ආරක්ෂිත හේතුන් මත ගිණුමක් අක්‍රීය කිරීමෙන් පසු දින 7ක් යනතුරු එය සම්පූර්ණයෙන්ම ඉවත් නොකෙරේ.",
    confirmDeactivate: "ගිණුම අක්‍රීය කිරීම තහවුරු කරන්න",

    addSlot: "නව වේලාවක් එක් කරන්න",
    slmcUpload: "SLMC ලියාපදිංචි සහතිකය (පින්තූරය/PDF)",
    earningsTitle: "ආදායම් වාර්තාව",
    netEarnings: "ශුද්ධ ආදායම (කොමිස් කපාහැරීමෙන් පසු)",
    purchaseBoost: "පැතිකඩ ප්‍රමුඛ කිරීමේ පැකේජ (Profile Boosting)",
    boostPackageTitle: "ප්‍රමුඛ කිරීම් පැකේජය",
    boostPackageDesc: "ඔබගේ පැතිකඩ දින 7ක් සඳහා මුල් පිටුවේ ඉහළින්ම ප්‍රදර්ශනය කර රෝගීන් ආකර්ෂණය කරගන්න.",

    platformStats: "පද්ධති සංඛ්‍යාලේඛන",
    totalDoctors: "මුළු වෛද්‍යවරුන්",
    totalClients: "මුළු සේවාලාභීන්",
    totalBookings: "මුළු වෙන්කිරීම්",
    totalRevenue: "මුළු පද්ධති ආදායම",
    approveDoctor: "වෛද්‍යවරයා අනුමත කරන්න",
    suspendClient: "ගිණුම අත්හිටුවන්න",
    refundBooking: "මුදල් ආපසු ගෙවන්න",
    viewComplaints: "පැමිණිලි සමාලෝචනය",
    setCommission: "පද්ධති කොමිස් අනුපාතය සකසන්න",
    activePromotions: "ක්‍රියාකාරී ප්‍රවර්ධන",

    smsBookingConfirmed: "[PsyNova] ඔබගේ වෙන් කිරීම සාර්ථකයි! වෛද්‍ය {doc} සමඟ සැසිය {date} දින {time} ට පැවැත්වේ. වීඩියෝ ලින්ක් එක: {link}",
    smsReminder: "[PsyNova] මතක් කිරීමයි: වෛද්‍ය {doc} සමඟ ඔබගේ උපදේශන සැසිය අද {time} ට ආරම්භ වේ. කරුණාකර වේලාවට සම්බන්ධ වන්න: {link}",
    smsComplaintReceived: "[PsyNova] ඔබගේ පැමිණිල්ල අංක {id} යටතේ අප වෙත ලැබී ඇත. පැය 24ක් ඇතුළත පරිපාලක කණ්ඩායම ඔබව සම්බන්ධ කරගනු ඇත.",

    districts: {
      "Colombo": "කොළඹ",
      "Gampaha": "ගම්පහ",
      "Kalutara": "කළුතර",
      "Kandy": "මහනුවර",
      "Matale": "මාතලේ",
      "Nuwara Eliya": "නුවරඑළිය",
      "Galle": "ගාල්ල",
      "Matara": "මාතර",
      "Hambantota": "හම්බන්තොට",
      "Jaffna": "යාපනය",
      "Kilinochchi": "කිලිනොච්චිය",
      "Mannar": "මන්නාරම",
      "Vavuniya": "වවුනියාව",
      "Mullaitivu": "මුලතිව්",
      "Batticaloa": "මඩකලපුව",
      "Ampara": "අම්පාර",
      "Trincomalee": "ත්‍රිකුණාමලය",
      "Kurunegala": "කුරුණෑගල",
      "Puttalam": "පුත්තලම",
      "Anuradhapura": "අනුරාධපුරය",
      "Polonnaruwa": "පොළොන්නරුව",
      "Badulla": "බදුල්ල",
      "Moneragala": "මොණරාගල",
      "Ratnapura": "රත්නපුරය",
      "Kegalle": "කෑගල්ල"
    }
  },
  ta: {
    brandName: "PsyNova",
    tagline: "இலங்கையின் முன்னணி ஆன்லைன் மனநல மருத்துவ ஆலோசனை தளம்",
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    support: "உதவி",
    terms: "நிபந்தனைகள்",
    privacy: "தனியுரிமைக் கொள்கை",
    login: "உள்நுழைக",
    logout: "வெளியேறு",
    register: "பதிவு செய்க",
    bookSession: "முன்பதிவு செய்ய",
    myDashboard: "எனது கட்டுப்பாட்டு வாரியம்",
    roleClient: "நோயாளி / பயனர்",
    roleDoctor: "மனநல மருத்துவர்",
    roleAdmin: "நிர்வாகி",
    roleSuperAdmin: "தலைமை நிர்வாகி",

    heroTitle: "உங்கள் மன நலத்திற்கு நம்பகமான வழிகாட்டி",
    heroSub: "இலங்கையில் உரிமம் பெற்ற சிறந்த மனநல மருத்துவர்களை ஆன்லைன் வீடியோ மூலம் எளிதாகத் தொடர்பு கொள்ளுங்கள்.",
    searchTitle: "மனநல மருத்துவரைத் தேடுங்கள்",
    boostedTitle: "முன்னணி மனநல மருத்துவர்கள்",
    boostedSub: "எங்கள் தளத்தில் உள்ள அங்கீகரிக்கப்பட்ட சிறப்பு மருத்துவர்கள்",
    searchPlaceholder: "பெயர் அல்லது தகுதி கொண்டு தேடுக...",
    findButton: "தேடுக",
    onlineNotice: "அனைத்து ஆலோசனைகளும் ஆன்லைன் வீடியோ மூலம் மட்டுமே வழங்கப்படும்.",
    emergencyDisclaimer: "குறிப்பு: PsyNova அவசர சிகிச்சை தளம் அல்ல. உங்களுக்கு உடனடி மன உளைச்சல் அல்லது ஆபத்து இருந்தால், தயவுசெய்து 1926 மனநல உதவி எண்ணை அழைக்கவும்.",

    filterDistrict: "மாவட்டம்",
    filterLanguage: "ஆலோசனை மொழி",
    filterDate: "தேதி",
    filterFee: "அதிகபட்ச கட்டணம்",
    allDistricts: "அனைத்து மாவட்டங்கள்",
    allLanguages: "அனைத்து மொழிகள் (සිංහල / தமிழ் / English)",
    anyDate: "எந்த தேதியும்",
    maxFee: "எந்த கட்டணமும்",

    slmcVerified: "SLMC சான்றளிக்கப்பட்ட",
    slmcPending: "அங்கீகாரத்திற்கு காத்திருக்கிறது",
    viewProfile: "விவரங்களைப் பார்க்க",
    hourlyFee: "ஆலோசனைக் கட்டணம்",
    qualifications: "தகுதிகள்",
    specializations: "சிறப்பம்சங்கள்",
    consultationLanguage: "ஆலோசனை மொழிகள்",
    availableSlots: "கிடைக்கக்கூடிய நேரங்கள்",
    bookNow: "முன்பதிவு செய்க",
    boostedLabel: "விளம்பரப்படுத்தப்பட்ட",

    bookingTitle: "முன்பதிவு நிலைகள்",
    reviewSummary: "முன்பதிவு சுருக்கம்",
    patientName: "நோயாளியின் முழுப் பெயர்",
    patientNIC: "தேசிய அடையாள அட்டை (NIC) அல்லது பாஸ்போர்ட் எண்",
    patientPhone: "கைபேசி எண்",
    patientEmail: "மின்னஞ்சல் முகவரி",
    patientDistrict: "மாவட்டம்",
    patientLanguage: "பேசும் மொழி",
    feeAmount: "மருத்துவர் கட்டணம்",
    commissionLabel: "தள கட்டணம் (கமிஷன்)",
    totalAmount: "மொத்த தொகை",
    payWithLankaPay: "LankaPay மூலம் செலுத்தவும்",
    payWithCard: "Visa / Mastercard மூலம் செலுத்தவும்",
    simulatedGateway: "PayHere கட்டண தளம் (மாதிரி)",
    paymentSuccess: "கட்டணம் செலுத்தப்பட்டது! உங்கள் முன்பதிவு உறுதிசெய்யப்பட்டது.",
    paymentFailed: "கட்டணம் தோல்வியுற்றது! தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    confirmAndPay: "கட்டணத்தை உறுதி செய்க",
    slotTimeoutWarning: "எச்சரிக்கை: 5 நிமிடங்களுக்குள் கட்டணம் செலுத்தப்படாவிட்டால், இந்த நேரம் மற்றவர்களுக்கு ஒதுக்கப்படும்.",

    joinRoom: "ஆன்லைன் வீடியோவில் இணையுங்கள்",
    roomStatus: "ஆலோசனை நிலை",
    sessionStarted: "ஆலோசனை தொடங்கப்பட்டது",
    sessionEnded: "ஆலோசனை நிறைவடைந்தது",
    videoNotice: "இந்த ஆலோசனை Jitsi Meet மூலம் பாதுகாப்பாக நடத்தப்படுகிறது. எவ்வித பதிவுகளும் செய்யப்பட மாட்டாது.",
    submitSessionReport: "மருத்துவ அறிக்கையை உள்ளிடவும்",
    reportNotes: "சிகிச்சை விவரங்கள் மற்றும் மருந்துச் சீட்டு",
    submitComplaint: "புகார் சமர்ப்பிக்கவும்",
    complaintNotes: "பிரச்சினை பற்றிய விபரம்",
    submitButton: "சமர்ப்பிக்கவும்",
    successMessage: "வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",

    dashboardTitle: "கட்டுப்பாட்டு பலகை",
    overview: "சுருக்கம்",
    sessions: "ஆலோசனைகள்",
    upcomingSessions: "வரவிருக்கும் ஆலோசனைகள்",
    completedSessions: "கடந்த ஆலோசனைகள்",
    earnings: "வருமானம்",
    profile: "சுயவிவரம்",
    settings: "அமைப்புகள்",
    actions: "நடவடிக்கைகள்",
    cancelBooking: "முன்பதிவை ரத்து செய்",
    status: "நிலை",
    date: "தேதி",
    time: "நேரம்",
    amount: "தொகை",

    newComplaint: "புதிய புகாரை சமர்ப்பிக்கவும்",
    deactivateAccount: "கணக்கை முடக்கவும்",
    deactivateHoldWarning: "எச்சரிக்கை: பாதுகாப்பு காரணங்களுக்காக கணக்கை முடக்கிய பின் 7 நாட்கள் வரை அது முழுமையாக நீக்கப்படாது.",
    confirmDeactivate: "கணக்கு முடக்கலை உறுதி செய்க",

    addSlot: "புதிய நேரத்தை சேர்க்கவும்",
    slmcUpload: "SLMC பதிவு சான்றிதழ் (படம்/PDF)",
    earningsTitle: "வருமான அறிக்கை",
    netEarnings: "நிகர வருமானம் (கமிஷன் கழித்த பின்)",
    purchaseBoost: "சுயவிவரத்தை மேம்படுத்தவும் (Boosting)",
    boostPackageTitle: "மேம்படுத்தல் தொகுப்பு",
    boostPackageDesc: "உங்கள் சுயவிவரத்தை 7 நாட்களுக்கு முகப்புப் பக்கத்தின் உச்சியில் காண்பித்து கூடுதல் நோயாளிகளை ஈர்க்கவும்.",

    platformStats: "தள புள்ளிவிவரங்கள்",
    totalDoctors: "மொத்த மருத்துவர்கள்",
    totalClients: "மொத்த நோயாளிகள்",
    totalBookings: "மொத்த முன்பதிவுகள்",
    totalRevenue: "மொத்த வருவாய்",
    approveDoctor: "மருத்துவருக்கு ஒப்புதல் அளிக்கவும்",
    suspendClient: "கணக்கை நிறுத்தி வைக்கவும்",
    refundBooking: "பணம் திருப்பிச் செலுத்தவும்",
    viewComplaints: "புகார்களை ஆய்வு செய்க",
    setCommission: "கமிஷன் விகிதத்தை அமைக்கவும்",
    activePromotions: "செயலில் உள்ள விளம்பரங்கள்",

    smsBookingConfirmed: "[PsyNova] முன்பதிவு வெற்றிகரமாக முடிந்தது! டாக்டர் {doc} உடனான ஆலோசனை {date} அன்று {time} மணிக்கு நடைபெறும். வீடியோ இணைப்பு: {link}",
    smsReminder: "[PsyNova] நினைவூட்டல்: டாக்டர் {doc} உடனான ஆலோசனை இன்று {time} மணிக்கு தொடங்கும். தயவுசெய்து இணையுங்கள்: {link}",
    smsComplaintReceived: "[PsyNova] உங்கள் புகார் எண் {id} பெறப்பட்டுள்ளது. 24 மணி நேரத்திற்குள் எங்கள் குழு உங்களைத் தொடர்புகொள்ளும்.",

    districts: {
      "Colombo": "கொழும்பு",
      "Gampaha": "கம்பஹா",
      "Kalutara": "களுத்துறை",
      "Kandy": "கண்டி",
      "Matale": "மாத்தளை",
      "Nuwara Eliya": "நுவரெலியா",
      "Galle": "காலி",
      "Matara": "மாத்தறை",
      "Hambantota": "அம்பாந்தோட்டை",
      "Jaffna": "யாழ்ப்பாணம்",
      "Kilinochchi": "கிளிநொச்சி",
      "Mannar": "மன்னார்",
      "Vavuniya": "வவுனியா",
      "Mullaitivu": "முல்லைத்தீவு",
      "Batticaloa": "மட்டக்களப்பு",
      "Ampara": "அம்பாறை",
      "Trincomalee": "திருகோணமலை",
      "Kurunegala": "குருநாகல்",
      "Puttalam": "புத்தளம்",
      "Anuradhapura": "அனுராதபுரம்",
      "Polonnaruwa": "பொலன்னறுவை",
      "Badulla": "பதுளை",
      "Moneragala": "மொனராகலை",
      "Ratnapura": "இரத்தினபுரி",
      "Kegalle": "கேகாலை"
    }
  },
  en: {
    brandName: "PsyNova",
    tagline: "Sri Lanka's Premium Online Psychiatrist Consultation Platform",
    home: "Home",
    about: "About Us",
    support: "Support Hub",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    login: "Login",
    logout: "Logout",
    register: "Register",
    bookSession: "Book Session",
    myDashboard: "My Dashboard",
    roleClient: "Client / Patient",
    roleDoctor: "Psychiatrist",
    roleAdmin: "Admin",
    roleSuperAdmin: "Super Admin",

    heroTitle: "Compassionate Mental Health Support, Online",
    heroSub: "Easily discover, connect, and schedule secure video consultations with SLMC-licensed expert psychiatrists in Sri Lanka.",
    searchTitle: "Find a Psychiatric Specialist",
    boostedTitle: "Featured Specialists",
    boostedSub: "Highly recommended SLMC-certified experts active on our platform",
    searchPlaceholder: "Search by doctor name or qualification...",
    findButton: "Search Specialists",
    onlineNotice: "All consultations are conducted online via high-definition secure video.",
    emergencyDisclaimer: "Please Note: PsyNova is NOT a crisis intervention platform. If you are experiencing suicidal thoughts or an immediate medical emergency, please dial 1926 (Sri Lanka National Mental Health Helpline) or visit your nearest hospital.",

    filterDistrict: "District",
    filterLanguage: "Consultation Language",
    filterDate: "Consultation Date",
    filterFee: "Max Consultation Fee",
    allDistricts: "All 25 Districts",
    allLanguages: "All Languages (සිංහල / தமிழ் / English)",
    anyDate: "Any Date Available",
    maxFee: "Any Consultation Fee",

    slmcVerified: "SLMC Certified",
    slmcPending: "Pending SLMC Verification",
    viewProfile: "View Specialist Profile",
    hourlyFee: "Consultation Fee",
    qualifications: "Qualifications",
    specializations: "Specialization & Expertise",
    consultationLanguage: "Consultation Languages",
    availableSlots: "Available Slots",
    bookNow: "Secure Session",
    boostedLabel: "Featured",

    bookingTitle: "Secure Appointment Booking",
    reviewSummary: "Review Booking Summary",
    patientName: "Full Legal Name",
    patientNIC: "National Identity Card (NIC) or Passport No",
    patientPhone: "Mobile Phone Number",
    patientEmail: "Email Address",
    patientDistrict: "Residential District",
    patientLanguage: "Preferred Communication Language",
    feeAmount: "Doctor Consultation Fee",
    commissionLabel: "Platform Facilitation Fee",
    totalAmount: "Total Booking Value (LKR)",
    payWithLankaPay: "Secure LankaPay Transfer",
    payWithCard: "Visa / Mastercard Payment",
    simulatedGateway: "PayHere Payment Gateway (Simulation Mode)",
    paymentSuccess: "Transaction Approved! Your appointment is officially booked.",
    paymentFailed: "Transaction Declined! Please check your card credentials and retry.",
    confirmAndPay: "Process Payment & Confirm",
    slotTimeoutWarning: "Please Note: This slot is reserved for 5 minutes. If checkout isn't completed, the slot releases for other clients.",

    joinRoom: "Enter Tele-health Video consultation",
    roomStatus: "Consultation Session Progress",
    sessionStarted: "Consultation Active",
    sessionEnded: "Consultation Closed",
    videoNotice: "This tele-psychiatry session runs on peer-to-peer encrypted Jitsi streams. No recording is kept by PsyNova.",
    submitSessionReport: "Submit Medical Record",
    reportNotes: "Patient Clinical Observations & Prescriptions",
    submitComplaint: "File a Complaint / Report Issue",
    complaintNotes: "Provide complete details about the issue",
    submitButton: "File Record",
    successMessage: "Record submitted successfully!",

    dashboardTitle: "Dashboard Overview",
    overview: "Summary",
    sessions: "My Appointments",
    upcomingSessions: "Upcoming Appointments",
    completedSessions: "Historic Sessions",
    earnings: "Earnings Ledger",
    profile: "Profile settings",
    settings: "Platform Settings",
    actions: "Available Actions",
    cancelBooking: "Cancel Appointment",
    status: "Status",
    date: "Scheduled Date",
    time: "Scheduled Time",
    amount: "Total Paid",

    newComplaint: "File New Incident Report",
    deactivateAccount: "Deactivate Member Profile",
    deactivateHoldWarning: "Note: In compliance with health record safety guidelines, a 7-day administrative hold is enforced on deactivation before data erasure.",
    confirmDeactivate: "Confirm Profile Deactivation",

    addSlot: "Publish Availability Slot",
    slmcUpload: "SLMC Registry Proof (Photo or PDF)",
    earningsTitle: "Financial Earnings & Commissions",
    netEarnings: "Net Payout (After Platform Commission)",
    purchaseBoost: "Premium Profile Boosting Packages",
    boostPackageTitle: "Featured Profile Boost",
    boostPackageDesc: "Display your profile on the featured homepage carousel for 7 days to maximize patient exposure.",

    platformStats: "Platform Core Telemetry",
    totalDoctors: "Total Verified Psychiatrists",
    totalClients: "Total Client Profiles",
    totalBookings: "Total Appointments Facilitated",
    totalRevenue: "Gross Platform Commissions",
    approveDoctor: "Approve SLMC License",
    suspendClient: "Restrict Client Profile",
    refundBooking: "Issue Refund",
    viewComplaints: "Resolve Incident Reports",
    setCommission: "Adjust Base Commission Rate",
    activePromotions: "Active Boost Promotions",

    smsBookingConfirmed: "[PsyNova] Booking Confirmed! Your video session with Dr. {doc} is scheduled on {date} at {time}. Link: {link}",
    smsReminder: "[PsyNova] Reminder: Your consultation with Dr. {doc} starts today at {time}. Join promptly: {link}",
    smsComplaintReceived: "[PsyNova] Complaint logged under Ticket #{id}. An admin officer will contact you within 24 hours.",

    districts: {
      "Colombo": "Colombo",
      "Gampaha": "Gampaha",
      "Kalutara": "Kalutara",
      "Kandy": "Kandy",
      "Matale": "Matale",
      "Nuwara Eliya": "Nuwara Eliya",
      "Galle": "Galle",
      "Matara": "Matara",
      "Hambantota": "Hambantota",
      "Jaffna": "Jaffna",
      "Kilinochchi": "Kilinochchi",
      "Mannar": "Mannar",
      "Vavuniya": "Vavuniya",
      "Mullaitivu": "Mullaitivu",
      "Batticaloa": "Batticaloa",
      "Ampara": "Ampara",
      "Trincomalee": "Trincomalee",
      "Kurunegala": "Kurunegala",
      "Puttalam": "Puttalam",
      "Anuradhapura": "Anuradhapura",
      "Polonnaruwa": "Polonnaruwa",
      "Badulla": "Badulla",
      "Moneragala": "Moneragala",
      "Ratnapura": "Ratnapura",
      "Kegalle": "Kegalle"
    }
  }
};
