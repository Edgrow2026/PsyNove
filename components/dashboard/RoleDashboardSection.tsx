'use client';

import { Dispatch, FormEvent, SetStateAction } from 'react';
import { FileSpreadsheet, Plus, TrendingUp, UserX, Video } from 'lucide-react';
import { AppState, Booking, store } from '@/lib/store';
import { TranslationSet } from '@/lib/translations';

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
  handleDoctorRegisterSubmit: (event: FormEvent) => void;
  handleAddAvailabilitySlot: (event: FormEvent) => void;
  handleStartConsultation: (booking: Booking) => void;
  handleExportCSV: () => void;
}

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
  return (
    <>
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

    </>
  );
}
