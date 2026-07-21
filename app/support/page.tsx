'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar';
import SimulatorSettings from '../../components/SimulatorSettings';
import PwaRegister from '../../components/PwaRegister';
import { store, AppState } from '../../lib/store';
import { translations } from '../../lib/translations';
import { HelpCircle, PhoneCall, Bot, Send, User, Loader2, ShieldAlert } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export default function SupportPage() {
  const [state, setState] = useState<AppState>(() => store.getState());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const initialLang = store.getState().currentLanguage;
    const welcomes = {
      si: "ආයුබෝවන්! මම PsyNova AI සහායකයා වෙමි. ඔබට අවශ්‍ය වෛද්‍ය තොරතුරු හෝ පද්ධතිය භාවිතය පිළිබඳ ගැටළු මෙහිදී සාකච්ඡා කළ හැක. (මතක් කිරීම: මම හදිසි ප්‍රතිකාර සේවාවක් නොවේ)",
      ta: "வணக்கம்! நான் PsyNova AI உதவியாளர். உங்களுக்குத் தேவையான மருத்துவ தகவல்கள் அல்லது கணக்குத் தொடர்பான சந்தேகங்களை இங்கே என்னிடம் கேட்கலாம். (நினைவூட்டல்: நான் அவசர சிகிச்சை தளம் அல்ல)",
      en: "Hello! I am your PsyNova AI virtual advocate. You can ask me how to schedule appointments, find psychiatrists, or inquire about basic psychological concepts. How can I support your wellbeing today?"
    };
    return [
      { id: 'welcome', sender: 'assistant', text: welcomes[initialLang] }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Form states for manual support tickets
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketNotes, setTicketNotes] = useState('');
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsub;
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const lang = state.currentLanguage;
  const t = translations[lang];

  const supportTexts = {
    si: {
      title: "සහාය සේවා මධ්‍යස්ථානය",
      sub: "ඔබේ ගැටළු සහ තාක්ෂණික අවශ්‍යතා සඳහා කඩිනම් සහාය.",
      crisisTitle: "ක්ෂණික හදිසි සහාය",
      crisisText: "ඔබ බරපතල මානසික ආතතියකින් හෝ ක්ෂණික අනතුරක පසුවේ නම් කරුණාකර පහත දුරකථන අංක ඔස්සේ වෘත්තීය උපදේශන කණ්ඩායම් සම්බන්ධ කරගන්න:",
      aiChatTitle: "PsyNova AI සහායකයා (සජීවී)",
      aiChatSub: "ගැටළු හෝ වෛද්‍ය තොරතුරු පරීක්ෂා කිරීමට සජීවීව කතා කරන්න.",
      ticketTitle: "විද්‍යුත් උපකාරක ටිකට්පතක් ඉදිරිපත් කරන්න",
      ticketSub: "පැය 24ක් තුළ අපගේ පරිපාලක කණ්ඩායම ඔබව අමතනු ඇත.",
      inputPlaceholder: "පණිවිඩය මෙහි ලියන්න...",
      formName: "ඔබගේ නම",
      formPhone: "ජංගම දුරකථන අංකය",
      formNotes: "ගැටලුව පිළිබඳ කෙටි විස්තරයක්",
      formSubmit: "ටිකට්පත ඉදිරිපත් කරන්න",
      formSuccess: "ටිකට්පත සාර්ථකව ලැබුණි! ඔබගේ දුරකථනයට කෙටි පණිවිඩයක් (SMS) යවා ඇත.",
      nationalHelpline: "ජාතික උපකාරක අංකය",
      aiTyping: "AI පිළිතුර සකසමින්...",
      aiFallback: "මට පිළිතුරක් සකස් කළ නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.",
      aiConnectionError: "සම්බන්ධතාව බිඳ වැටුණි. කරුණාකර නැවත උත්සාහ කරන්න.",
      notesPlaceholder: "වෙන්කළ සැසියට ඇතුල් වීමට මට ගැටලුවක් තිබේ...",
      footer: "© 2026 PsyNova සහාය මධ්‍යස්ථානය. ශ්‍රී ලංකා ප්‍රධාන කාර්යාලය."
    },
    ta: {
      title: "உதவி மையம்",
      sub: "உங்களின் கேள்விகள் மற்றும் தொழில்நுட்பத் தேவைகளுக்கான விரைவான ஆதரவு.",
      crisisTitle: "உடனடி அவசர உதவி",
      crisisText: "நீங்கள் கடுமையான மன உளைச்சலில் அல்லது அவசரத் தேவையில் இருந்தால், தயவுசெய்து பின்வரும் தொலைபேசி எண்கள் மூலம் தொழில்முறை ஆலோசனைக் குழுக்களைத் தொடர்பு கொள்ளவும்:",
      aiChatTitle: "PsyNova AI உதவியாளர் (நேரடி)",
      aiChatSub: "சந்தேகங்கள் அல்லது மருத்துவ தகவல்களை அறிய உடனடியாக உரையாடுங்கள்.",
      ticketTitle: "ஆதரவு டிக்கெட்டைச் சமர்ப்பிக்கவும்",
      ticketSub: "24 மணி நேரத்திற்குள் எங்களின் குழு உங்களைத் தொடர்புகொள்ளும்.",
      inputPlaceholder: "பதிலை இங்கே தட்டச்சு செய்யவும்...",
      formName: "உங்கள் பெயர்",
      formPhone: "கைபேசி எண்",
      formNotes: "பிரச்சினையின் சுருக்கமான விபரம்",
      formSubmit: "டிக்கெட்டைச் சமர்ப்பி",
      formSuccess: "டிக்கெட் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! உங்களது கைபேசிக்கு உறுதிப்படுத்தல் SMS அனுப்பப்பட்டுள்ளது.",
      nationalHelpline: "தேசிய உதவி எண்",
      aiTyping: "AI பதில் தட்டச்சு செய்கிறது...",
      aiFallback: "மன்னிக்கவும், பதிலை உருவாக்க முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      aiConnectionError: "இணைப்பு துண்டிக்கப்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
      notesPlaceholder: "என் முன்பதிவு செய்யப்பட்ட ஆலோசனையை அணுகுவதில் சிக்கல் உள்ளது...",
      footer: "© 2026 PsyNova உதவி மையம். இலங்கை தலைமையகம்."
    },
    en: {
      title: "Support Hub",
      sub: "We are online to resolve your issues, process refunds, and assist with appointments.",
      crisisTitle: "Immediate Crisis Support",
      crisisText: "If you are experiencing acute emotional distress or clinical urgency, please utilize the following national emergency helplines immediately:",
      aiChatTitle: "PsyNova AI Helper (Live)",
      aiChatSub: "Converse with our intelligent assistant regarding general inquiries or platform use.",
      ticketTitle: "File an Administrative Help Ticket",
      ticketSub: "Submit details and our team will get back to you within 24 hours.",
      inputPlaceholder: "Type your query here...",
      formName: "Your Legal Name",
      formPhone: "Mobile Phone Number",
      formNotes: "Describe your inquiry or system issue",
      formSubmit: "Dispatch Ticket",
      formSuccess: "Support Ticket logged successfully! A confirmation SMS has been dispatched.",
      nationalHelpline: "National Helpline",
      aiTyping: "AI typing...",
      aiFallback: "I apologize, but I could not compute a reply. Please try again.",
      aiConnectionError: "Connection disrupted. Please retry.",
      notesPlaceholder: "I am having trouble accessing my booked appointment on Dr. Ruwan's list...",
      footer: "© 2026 PsyNova Support Center. Sri Lanka Headquarters."
    }
  }[lang];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsg.text, language: lang })
      });
      const data = await response.json();
      
      setChatMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || supportTexts.aiFallback
      }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: supportTexts.aiConnectionError
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketPhone || !ticketNotes) return;

    // Simulate creating a complaint log
    store.submitComplaint({
      bookingId: `bk-ticket-${Math.floor(100+Math.random()*900)}`,
      submittedBy: 'client',
      userName: ticketName,
      userRole: 'Guest / Client',
      notes: `[Support Ticket] Phone: ${ticketPhone}. Details: ${ticketNotes}`
    });

    setTicketSuccess(true);
    setTicketName('');
    setTicketPhone('');
    setTicketNotes('');

    setTimeout(() => {
      setTicketSuccess(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-paper text-ink-navy flex flex-col font-sans" id="support-page-root">
      <PwaRegister />
      <Navbar activeSection="support" />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-paper py-12 text-ink-navy border-b border-hairline">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,192,155,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative text-center space-y-3">
          <div className="mx-auto bg-white p-3 rounded-full w-fit mb-2 border border-hairline">
            <HelpCircle className="w-6 h-6 text-warm-turmeric" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-light tracking-tight">{supportTexts.title}</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm">
            {supportTexts.sub}
          </p>
        </div>
      </section>

      {/* Support Grid */}
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Helplines & AI Assist */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Crisis Banner */}
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-red-600 font-extrabold text-sm sm:text-base">
              <ShieldAlert className="w-5.5 h-5.5 text-red-500 animate-pulse" />
              <span>{supportTexts.crisisTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-red-700 leading-relaxed font-normal">
              {supportTexts.crisisText}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white p-3 rounded-xl border border-hairline flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">{supportTexts.nationalHelpline}</span>
                  <span className="text-sm font-bold text-ink-navy">1926 (Free 24/7)</span>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-hairline flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg text-red-600">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">Sumithrayo</span>
                  <span className="text-sm font-bold text-ink-navy">+94 11 268 2535</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Chat Bot */}
          <div className="bg-white rounded-2xl border border-hairline shadow-2xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-paper px-4 py-3 flex items-center justify-between text-ink-navy border-b border-hairline">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 text-warm-turmeric" />
                <div>
                  <span className="block text-xs font-bold tracking-tight">{supportTexts.aiChatTitle}</span>
                  <span className="block text-[10px] text-slate-600">{supportTexts.aiChatSub}</span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-warm-turmeric animate-pulse" />
            </div>

            {/* Messages body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-paper text-xs leading-relaxed">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'user' ? 'bg-warm-turmeric text-ink-navy font-semibold' : 'bg-warm-turmeric/10 text-warm-turmeric border border-warm-turmeric/40'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border ${
                      msg.sender === 'user'
                        ? 'bg-warm-turmeric/20 text-ink-navy border-warm-turmeric/50 rounded-tr-none'
                        : 'bg-white text-slate-700 border-hairline rounded-tl-none shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line font-normal">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center space-x-2 text-slate-600 italic">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-warm-turmeric" />
                  <span>{supportTexts.aiTyping}</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-hairline bg-paper flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={supportTexts.inputPlaceholder}
                className="flex-1 bg-white border border-hairline text-ink-navy rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden"
                disabled={isGenerating}
              />
              <button
                type="submit"
                className="bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                disabled={isGenerating || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Ticket Submission */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-hairline shadow-2xl space-y-4">
            <div>
              <h2 className="text-lg font-bold text-ink-navy tracking-tight">{supportTexts.ticketTitle}</h2>
              <p className="text-slate-600 text-xs font-normal leading-relaxed">{supportTexts.ticketSub}</p>
            </div>

            {ticketSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold animate-pulse">
                {supportTexts.formSuccess}
              </div>
            )}

            <form onSubmit={handleTicketSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">{supportTexts.formName}</label>
                <input
                  type="text"
                  required
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  className="w-full bg-paper border border-hairline rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden text-ink-navy"
                  placeholder="Kavindu Perera"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">{supportTexts.formPhone}</label>
                <input
                  type="text"
                  required
                  value={ticketPhone}
                  onChange={(e) => setTicketPhone(e.target.value)}
                  className="w-full bg-paper border border-hairline rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden text-ink-navy"
                  placeholder="+94 77 123 4567"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">{supportTexts.formNotes}</label>
                <textarea
                  required
                  rows={4}
                  value={ticketNotes}
                  onChange={(e) => setTicketNotes(e.target.value)}
                  className="w-full bg-paper border border-hairline rounded-xl p-2.5 focus:ring-1 focus:ring-warm-turmeric focus:outline-hidden text-ink-navy"
                  placeholder={supportTexts.notesPlaceholder}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-warm-turmeric hover:bg-warm-turmeric/90 text-ink-navy font-bold py-2.5 rounded-xl transition-all duration-300 text-xs tracking-wide cursor-pointer"
              >
                {supportTexts.formSubmit}
              </button>
            </form>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-paper text-slate-500 py-6 border-t border-hairline text-center text-xs">
        <p>{supportTexts.footer}</p>
      </footer>

      <SimulatorSettings />
    </div>
  );
}
