import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PrecautionBadge } from '../common/Badge';
import { DailyLogModal } from '../patient/DailyLogModal';
import { GPSCheckinModal } from '../caregiver/GPSCheckinModal';
import { DailyCareReportModal } from '../caregiver/DailyCareReportModal';
import { PostVisitModal } from '../escort/PostVisitModal';
import { DoctorVisitModal } from '../patient/DoctorVisitModal';
import { 
  HeartHandshake, 
  Activity, 
  Calendar, 
  MapPin, 
  FileText, 
  Heart, 
  Car, 
  User, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Send, 
  Camera, 
  Stethoscope, 
  ChevronRight, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

export const MobileAppView: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    patients, 
    appointments, 
    caregivers, 
    dailyReports, 
    checkins,
    addDoctorQuestion 
  } = useApp();

  const [mobileTab, setMobileTab] = useState<'home' | 'vitals' | 'escort' | 'reports'>('home');
  const [selectedMobilePatientId, setSelectedMobilePatientId] = useState<string>(patients[0]?.id || '');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDoctorVisitModal, setShowDoctorVisitModal] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPostVisitModal, setShowPostVisitModal] = useState(false);
  const [activeAptId, setActiveAptId] = useState<string>(appointments[0]?.id || '');

  const currentPatient = patients.find(p => p.id === selectedMobilePatientId) || patients[0];
  const activeAppointment = appointments.find(a => a.id === activeAptId) || appointments[0];
  const activeCaregiver = caregivers[0];

  return (
    <div className="py-6 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      {/* Mobile Device Container Frame (iPhone/Android Simulation) */}
      <div className="relative w-full max-w-[400px] bg-[#111827] p-3.5 rounded-[48px] shadow-2xl border-4 border-gray-800">
        {/* Notch / Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#1e293b] mr-3" />
          <div className="w-2 h-2 rounded-full bg-blue-900" />
        </div>

        {/* Screen Content */}
        <div className="relative w-full bg-[#FAF7F2] rounded-[38px] overflow-hidden min-h-[720px] flex flex-col justify-between text-gray-900 font-sans shadow-inner">
          
          {/* Top Status Bar Simulator */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-[11px] font-bold text-gray-700 select-none">
            <span>09:41</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span className="w-5 h-2.5 rounded-sm border border-gray-700 relative inline-block">
                <span className="w-3.5 h-1.5 bg-gray-700 absolute top-0.5 left-0.5 rounded-xs" />
              </span>
            </div>
          </div>

          {/* Main App Bar */}
          <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sage-800 text-cream-100 flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-4 h-4 text-cream-200" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-gray-900 leading-tight">CareNest Mobile</h3>
                <p className="text-[10px] text-gray-400 capitalize">โหมด: {currentRole.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Quick Role switch in mobile */}
            <select
              value={currentRole}
              onChange={e => setCurrentRole(e.target.value as any)}
              className="text-[10px] font-bold bg-cream-100 border border-cream-300 rounded-lg px-2 py-1 text-gray-700 focus:outline-none"
            >
              <option value="caregiver">Caregiver View</option>
              <option value="escort">Medical Escort</option>
              <option value="family">Family Portal</option>
              <option value="doctor">Doctor View</option>
            </select>
          </div>

          {/* Scrollable Screen Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[580px]">
            
            {/* 1. Mobile Home View */}
            {mobileTab === 'home' && (
              <div className="space-y-4">
                {/* Greeting banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-sage-800 to-sage-900 text-white shadow-soft">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-cream-300">ยินดีต้อนรับสู่ระบบดูแล</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                      วันนี้ 7 ก.ย.
                    </span>
                  </div>
                  <h4 className="text-base font-bold mt-1">{currentPatient.thaiName}</h4>
                  <p className="text-xs text-cream-300 mt-0.5">HN: {currentPatient.hn} • {currentPatient.careType === 'nursing_home' ? currentPatient.roomBed : 'Home Care'}</p>

                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs gap-1.5 flex-wrap">
                    <StatusBadge status={currentPatient.healthStatus} size="sm" />
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setShowDoctorVisitModal(true)}
                        className="px-2.5 py-1 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 hover:bg-emerald-700"
                      >
                        <Stethoscope className="w-3 h-3" />
                        <span>พบแพทย์</span>
                      </button>
                      <button
                        onClick={() => setShowLogModal(true)}
                        className="px-2.5 py-1 rounded-xl bg-white text-sage-900 text-[11px] font-bold shadow-xs flex items-center gap-1 hover:bg-cream-100"
                      >
                        <Plus className="w-3 h-3" />
                        <span>สัญญาณชีพ</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Role Specific Actions */}
                {currentRole === 'caregiver' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowGpsModal(true)}
                      className="p-3 rounded-2xl bg-white border border-gray-100 shadow-soft text-left hover:border-sage-300 transition-all"
                    >
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 w-fit mb-1.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-gray-900">GPS Check-in</h5>
                      <p className="text-[10px] text-gray-400">ลงเวลาเริ่ม/เลิกงาน</p>
                    </button>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="p-3 rounded-2xl bg-white border border-gray-100 shadow-soft text-left hover:border-sage-300 transition-all"
                    >
                      <div className="p-2 rounded-xl bg-sage-800 text-white w-fit mb-1.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h5 className="text-xs font-bold text-gray-900">ส่งรายงานวัน</h5>
                      <p className="text-[10px] text-gray-400">สรุปอาหาร & ยา</p>
                    </button>
                  </div>
                )}

                {/* Latest Vitals Glance */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-sage-700" />
                      สัญญาณชีพล่าสุด
                    </span>
                    <span className="text-[10px] text-gray-400">{currentPatient.vitalsHistory[0]?.timestamp || 'วันนี้'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                    <div className="p-2 rounded-xl bg-cream-50">
                      <span className="text-[10px] text-gray-400 block">ความดัน BP</span>
                      <strong className="text-xs font-bold text-gray-900">{currentPatient.vitalsHistory[0]?.sys}/{currentPatient.vitalsHistory[0]?.dia}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-cream-50">
                      <span className="text-[10px] text-gray-400 block">น้ำตาล DTX</span>
                      <strong className="text-xs font-bold text-amber-700">{currentPatient.vitalsHistory[0]?.glucose || 140}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-cream-50">
                      <span className="text-[10px] text-gray-400 block">อุณหภูมิ</span>
                      <strong className="text-xs font-bold text-gray-900">{currentPatient.vitalsHistory[0]?.temp}°C</strong>
                    </div>
                  </div>
                </div>

                {/* Precaution Badges */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft">
                  <span className="text-xs font-bold text-gray-900 block mb-2">
                    ข้อควรระวังสำคัญ (Care Alerts):
                  </span>
                  <div className="space-y-1.5">
                    {currentPatient.carePlan.precautions.map(alert => (
                      <PrecautionBadge key={alert.id} alert={alert} />
                    ))}
                  </div>
                </div>

                {/* Upcoming Escort Trip Glance */}
                {activeAppointment && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-soft">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5" />
                        นัดพบแพทย์รอบถัดไป
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        {activeAppointment.status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-2">{activeAppointment.hospitalName}</p>
                    <p className="text-[11px] text-gray-600">{activeAppointment.department} • 📅 {activeAppointment.dateTime}</p>

                    <button
                      onClick={() => setMobileTab('escort')}
                      className="w-full mt-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold flex items-center justify-center gap-1 hover:bg-amber-100"
                    >
                      <span>เปิดแฟ้มข้อมูล Pre-Briefing</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 2. Mobile Vitals & Health Trends */}
            {mobileTab === 'vitals' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900">บันทึก & สัญญาณชีพ</h4>
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="px-2.5 py-1 bg-sage-800 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มข้อมูล</span>
                  </button>
                </div>

                {/* History Timeline */}
                <div className="space-y-2.5">
                  {currentPatient.vitalsHistory.map(v => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-soft text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">⏰ {v.timestamp}</span>
                        <StatusBadge status={v.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-gray-50 text-[11px]">
                        <div>BP: <strong>{v.sys}/{v.dia}</strong></div>
                        <div>DTX: <strong>{v.glucose || '-'}</strong></div>
                        <div>SpO2: <strong>{v.spo2}%</strong></div>
                      </div>
                      {v.notes && <p className="text-[10px] text-gray-500 italic">"{v.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Mobile Escort & Briefing View */}
            {mobileTab === 'escort' && activeAppointment && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sage-800 bg-sage-50 px-2 py-0.5 rounded border border-sage-200">
                      {activeAppointment.appointmentNumber}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ● {activeAppointment.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{activeAppointment.patientName}</h4>
                  <p className="text-gray-600">🏥 {activeAppointment.hospitalName}</p>
                  <p className="text-gray-600">🩺 {activeAppointment.doctorName} ({activeAppointment.department})</p>
                  <p className="text-sage-900 font-bold">📅 {activeAppointment.dateTime} น.</p>
                </div>

                {/* Checklist of Questions for Doctor */}
                <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-900">
                      คำถามฝากถามแพทย์ ({activeAppointment.preAppointmentBriefing.questionsChecklist.length})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeAppointment.preAppointmentBriefing.questionsChecklist.map((q, i) => (
                      <div key={q.id} className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs">
                        <p className="font-bold text-gray-900">❓ {q.question}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">โดย {q.submittedBy}</p>
                        {q.answered && q.doctorAnswer && (
                          <div className="mt-1.5 p-2 rounded-lg bg-white text-emerald-800 text-[11px] font-semibold">
                            ✓ แพทย์ตอบ: {q.doctorAnswer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Post Visit Action Button */}
                  <button
                    onClick={() => setShowPostVisitModal(true)}
                    className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-soft flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกผลพบแพทย์ & อัปโหลดใบเสร็จ</span>
                  </button>
                </div>
              </div>
            )}

            {/* 4. Mobile Daily Reports Feed */}
            {mobileTab === 'reports' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900">รายงานการดูแลผู้ป่วย</h4>
                {dailyReports.map(rep => (
                  <div key={rep.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-soft space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{rep.patientName}</span>
                      <span className="text-[10px] text-gray-400">{rep.date}</span>
                    </div>
                    <p className="text-gray-600">{rep.mealsSummary}</p>
                    <div className="p-2 rounded-xl bg-cream-50 text-[11px] text-gray-700">
                      <span>BP {rep.vitalSummary.bp} • ชีพจร {rep.vitalSummary.pulse} bpm</span>
                    </div>
                    {rep.photos[0] && (
                      <img
                        src={rep.photos[0]}
                        alt=""
                        className="w-full h-28 rounded-xl object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Bottom Navigation Bar */}
          <div className="bg-white border-t border-gray-200 px-6 py-2.5 flex items-center justify-between text-gray-400 select-none">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                mobileTab === 'home' ? 'text-sage-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <HeartHandshake className="w-5 h-5" />
              <span className="text-[10px]">หน้าหลัก</span>
            </button>
            <button
              onClick={() => setMobileTab('vitals')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                mobileTab === 'vitals' ? 'text-sage-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="text-[10px]">สุขภาพ</span>
            </button>
            <button
              onClick={() => setMobileTab('escort')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                mobileTab === 'escort' ? 'text-sage-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <Car className="w-5 h-5" />
              <span className="text-[10px]">นัดหมาย</span>
            </button>
            <button
              onClick={() => setMobileTab('reports')}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                mobileTab === 'reports' ? 'text-sage-800 font-bold' : 'hover:text-gray-600'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px]">รายงาน</span>
            </button>
          </div>

          {/* Bottom Home Indicator bar */}
          <div className="pb-1.5 pt-0.5 flex justify-center bg-white">
            <div className="w-28 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>

      {/* Modals triggered from Mobile */}
      {showLogModal && (
        <DailyLogModal
          patient={currentPatient}
          onClose={() => setShowLogModal(false)}
        />
      )}

      {showDoctorVisitModal && (
        <DoctorVisitModal
          patient={currentPatient}
          onClose={() => setShowDoctorVisitModal(false)}
        />
      )}

      {showGpsModal && (
        <GPSCheckinModal
          caregiver={activeCaregiver}
          onClose={() => setShowGpsModal(false)}
        />
      )}

      {showReportModal && (
        <DailyCareReportModal
          caregiver={activeCaregiver}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {showPostVisitModal && activeAppointment && (
        <PostVisitModal
          appointment={activeAppointment}
          onClose={() => setShowPostVisitModal(false)}
        />
      )}
    </div>
  );
};
