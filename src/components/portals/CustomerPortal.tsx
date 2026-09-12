import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, DailyCareReport, Caregiver, PatientCareType } from '../../types';
import { StatusBadge, PrecautionBadge } from '../common/Badge';
import { VitalChart } from '../patient/VitalChart';
import { 
  HeartHandshake, 
  Building2, 
  Home, 
  Car,
  ShieldCheck, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  HeartPulse, 
  Activity, 
  Utensils, 
  Droplets, 
  Moon, 
  Stethoscope, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  MapPin, 
  Lock, 
  ChevronRight,
  HelpCircle,
  Pill,
  Award,
  DollarSign
} from 'lucide-react';

export const CustomerPortal: React.FC = () => {
  const { 
    patients, 
    caregivers, 
    contracts, 
    checkins, 
    dailyReports, 
    appointments, 
    escortStaff,
    addDoctorQuestion 
  } = useApp();

  // Customer Group Switch: 3 Groups
  const [customerGroup, setCustomerGroup] = useState<PatientCareType>('nursing_home');

  // Filter patients based on customer group (Strict Data Isolation)
  const availablePatients = patients.filter(p => p.careType === customerGroup);

  // Selected patient for this family
  const [selectedPatientId, setSelectedPatientId] = useState<string>(availablePatients[0]?.id || '');
  const activePatient = availablePatients.find(p => p.id === selectedPatientId) || availablePatients[0] || patients[0];

  // Active sub-tab inside Customer Portal
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'reports' | 'doctor' | 'caregiver'>('overview');

  // Question submission form state
  const [questionText, setQuestionText] = useState('');
  const [senderName, setSenderName] = useState(activePatient?.emergencyContact?.name || 'ญาติผู้ป่วย');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Home Care specific: Find currently assigned caregiver and contract
  const assignedCaregiver = caregivers.find(c => c.currentPatientId === activePatient?.id || c.name === activePatient?.primaryCaregiverName || c.thaiName === activePatient?.primaryCaregiverName) || caregivers[0];
  const assignedEscort = escortStaff.find(e => e.name === activePatient?.primaryCaregiverName || appointments.some(a => a.patientId === activePatient?.id && a.escortStaffId === e.id)) || escortStaff[0];
  const activeContract = contracts.find(ctr => ctr.patientId === activePatient?.id) || contracts[0];
  const latestCheckin = checkins.find(chk => chk.patientId === activePatient?.id && chk.status === 'active') || checkins[0];
  const patientDailyReports = dailyReports.filter(r => r.patientId === activePatient?.id);
  const patientAppointments = appointments.filter(a => a.patientId === activePatient?.id);

  const handleGroupChange = (newGroup: PatientCareType) => {
    setCustomerGroup(newGroup);
    const newPatients = patients.filter(p => p.careType === newGroup);
    if (newPatients.length > 0) {
      setSelectedPatientId(newPatients[0].id);
      setSenderName(newPatients[0].emergencyContact?.name || 'ญาติผู้ป่วย');
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    if (patientAppointments.length > 0) {
      addDoctorQuestion(patientAppointments[0].id, questionText, senderName);
    }
    setQuestionSubmitted(true);
    setQuestionText('');
    setTimeout(() => setQuestionSubmitted(false), 4000);
  };

  const latestVital = activePatient?.vitalsHistory?.[0];

  return (
    <div className="space-y-6">
      
      {/* Customer Portal Main Header Banner */}
      <div className="bg-gradient-to-r from-sage-900 via-sage-800 to-sage-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-cream-100/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cream-100 text-sage-950 shadow-xs">
                👨‍👩‍👧 Family & Customer Portal
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 text-cream-200 border border-white/20">
                ระบบบริการข้อมูลสำหรับญาติและครอบครัว
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif">
              {customerGroup === 'nursing_home' 
                ? 'ศูนย์ดูแลผู้สูงอายุ Nursing Home' 
                : customerGroup === 'medical_escort'
                ? 'บริการผู้ช่วยและพาพบแพทย์ (Medical Escort)'
                : 'บริการผู้ดูแลผู้ป่วยที่บ้าน (Home Care)'}
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 mt-1 max-w-2xl">
              ติดตามสัญญาณชีพ ผลการตรวจของแพทย์ กิจวัตรประจำวัน และการดูแลแบบเรียลไทม์ พร้อมความปลอดภัยของข้อมูลสูงสุด
            </p>
          </div>

          {/* Group Switcher (Segmented Buttons for 3 Customer Groups) */}
          <div className="bg-black/30 p-1.5 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleGroupChange('nursing_home')}
              className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                customerGroup === 'nursing_home'
                  ? 'bg-cream-100 text-sage-950 shadow-md scale-100'
                  : 'text-cream-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>1. Nursing Home</span>
            </button>

            <button
              onClick={() => handleGroupChange('medical_escort')}
              className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                customerGroup === 'medical_escort'
                  ? 'bg-cream-100 text-sage-950 shadow-md scale-100'
                  : 'text-cream-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>2. นัดพบแพทย์ Escort</span>
            </button>

            <button
              onClick={() => handleGroupChange('home_care')}
              className={`w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                customerGroup === 'home_care'
                  ? 'bg-cream-100 text-sage-950 shadow-md scale-100'
                  : 'text-cream-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>3. ดูแลที่บ้าน</span>
            </button>
          </div>
        </div>
      </div>

      {/* Strict Data Privacy Banner (PDPA Isolation) */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-950 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-700 text-white shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm block">
              ระบบรักษาความปลอดภัยข้อมูลส่วนบุคคล (Strict Data Isolation & Privacy)
            </span>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              {customerGroup === 'nursing_home' 
                ? `ท่านเข้าสู่ระบบในฐานะญาติของ ${activePatient?.thaiName} — ระบบจะแสดงเฉพาะประวัติของท่านเท่านั้น และไม่สามารถเข้าถึงข้อมูลของผู้ป่วยท่านอื่นในศูนย์ได้`
                : customerGroup === 'medical_escort'
                ? `ท่านเข้าสู่ระบบติดตามบริการพาพบแพทย์ของ ${activePatient?.thaiName} — แสดงตารางนัดหมาย สรุปคำสั่งแพทย์ และข้อมูลเจ้าหน้าที่ Escort ผู้ดูแล`
                : `ท่านเข้าสู่ระบบติดตามการดูแลของ ${activePatient?.thaiName} — พร้อมแสดงข้อมูลพนักงานผู้ดูแลประจำบ้านที่กำลังปฏิบัติงาน`}
            </p>
          </div>
        </div>

        {/* Patient Switcher (For family with multiple assigned patients) */}
        {availablePatients.length > 1 && (
          <div className="flex items-center gap-2 self-end sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
            <span className="text-[11px] font-bold text-gray-500">เลือกผู้ป่วย:</span>
            <select
              value={selectedPatientId}
              onChange={e => {
                setSelectedPatientId(e.target.value);
                const pt = patients.find(p => p.id === e.target.value);
                if (pt) setSenderName(pt.emergencyContact?.name || 'ญาติผู้ป่วย');
              }}
              className="text-xs font-bold text-sage-900 bg-transparent focus:outline-none cursor-pointer"
            >
              {availablePatients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.thaiName} ({p.hn})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 🏡 HOME CARE EXCLUSIVE BANNER: "แสดงว่าตอนนี้ใช้บริการพนักงานท่านไหนอยู่" */}
      {/* ========================================================= */}
      {customerGroup === 'home_care' && assignedCaregiver && (
        <div className="bg-white rounded-3xl border-2 border-emerald-600/30 p-6 shadow-soft space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  พนักงานผู้ดูแลประจำตัวขณะนี้ (Active Assigned Caregiver)
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  ปัจจุบันท่านกำลังใช้บริการผู้ดูแล: <strong className="text-emerald-900">{assignedCaregiver.thaiName}</strong>
                </h3>
              </div>
            </div>

            {/* Quick Contact Hotline */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${assignedCaregiver.phone}`}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทรหาผู้ดูแล: {assignedCaregiver.phone}</span>
              </a>
            </div>
          </div>

          {/* Caregiver Details & GPS Check-in Glance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* 1. Caregiver Profile Card */}
            <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 flex items-start gap-3.5">
              <img
                src={assignedCaregiver.avatar}
                alt={assignedCaregiver.thaiName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-300 shadow-xs shrink-0"
              />
              <div className="min-w-0 text-xs">
                <div className="font-bold text-gray-900 text-sm truncate">{assignedCaregiver.thaiName}</div>
                <p className="text-gray-500">{assignedCaregiver.education?.slice(0, 45)}...</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-600">
                  <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                    ★ {assignedCaregiver.rating}
                  </span>
                  <span>•</span>
                  <span>ประสบการณ์ {assignedCaregiver.experienceYears} ปี</span>
                </div>
              </div>
            </div>

            {/* 2. Contract & Wage Details */}
            <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs space-y-1.5">
              <span className="font-bold text-gray-900 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-sage-700" />
                ข้อมูลสัญญาจ้าง & อัตราค่าบริการ
              </span>
              <p className="text-gray-600">เลขที่สัญญา: <strong className="text-gray-900">{activeContract.contractNumber}</strong></p>
              <p className="text-gray-600">รูปแบบการจ้าง: <strong>{activeContract.workingType === 'live_in' ? 'พักอาศัยประจำ (Live-in 24 ชม.)' : 'ไป-กลับ (Full-time)'}</strong></p>
              <p className="text-emerald-800 font-bold">อัตราค่าบริการ: <strong>{activeContract.wageRate.toLocaleString()} บาท/{activeContract.wageType === 'monthly' ? 'เดือน' : 'วัน'}</strong></p>
            </div>

            {/* 3. Live GPS Check-in Status */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  สถานะ GPS เช็กอินวันนี้
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                  ● เข้างานแล้ว
                </span>
              </div>
              <p className="text-emerald-900 text-[11px]">
                ⏰ เช็กอินเมื่อ: <strong>{latestCheckin?.checkinTime || '07:00 น.'}</strong>
              </p>
              <div className="p-2 rounded-xl bg-white border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>พิกัดอยู่ในรัศมีบ้านพักผู้ป่วย (ห่าง {latestCheckin?.distanceFromPatientMeters || 18} ม.)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🏥 MEDICAL ESCORT EXCLUSIVE BANNER: "แสดงว่าตอนนี้ใช้บริการ Escort ท่านไหนอยู่" */}
      {/* ========================================================= */}
      {customerGroup === 'medical_escort' && assignedEscort && (
        <div className="bg-white rounded-3xl border-2 border-sky-600/30 p-6 shadow-soft space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-700 text-white shadow-xs">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  เจ้าหน้าที่พาพบแพทย์ประจำตัวขณะนี้ (Active Medical Escort Staff)
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  ปัจจุบันท่านกำลังใช้บริการ Escort: <strong className="text-sky-900">{assignedEscort.name}</strong>
                </h3>
              </div>
            </div>

            {/* Quick Contact Hotline */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${assignedEscort.phone}`}
                className="px-4 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>โทรหาเจ้าหน้าที่: {assignedEscort.phone}</span>
              </a>
            </div>
          </div>

          {/* Escort Details & Services */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/70 flex items-start gap-3.5">
              <img
                src={assignedEscort.avatar}
                alt={assignedEscort.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-300 shadow-xs shrink-0"
              />
              <div className="min-w-0 text-xs">
                <div className="font-bold text-gray-900 text-sm truncate">{assignedEscort.name}</div>
                <p className="text-gray-500">ความชำนาญ: {assignedEscort.skills.slice(0, 2).join(', ')}</p>
                <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-600">
                  <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                    ★ {assignedEscort.rating}
                  </span>
                  <span>•</span>
                  <span>สะสม {assignedEscort.totalTrips} ทริป</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/30 border border-sky-100 space-y-1.5 text-xs">
              <span className="font-bold text-gray-800 block text-[11px] uppercase tracking-wider text-sky-900">
                โรงพยาบาล & แพทย์นัดหมาย
              </span>
              <p className="font-bold text-gray-900">{activePatient.primaryHospital}</p>
              <p className="text-gray-600">แพทย์: {activePatient.primaryDoctorName}</p>
              <p className="text-[11px] text-sky-700 font-medium">บริการรถเข็น, รอรับยา, และสรุปผลตรวจส่งญาติ</p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-1.5 text-xs">
              <span className="font-bold text-gray-800 block text-[11px] uppercase tracking-wider text-sage-900">
                สถานะการนัดหมายล่าสุด
              </span>
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันรอบนัดหมายและเตรียมรถเรียบร้อย</span>
              </div>
              <p className="text-[11px] text-gray-500">
                ญาติสามารถส่งคำถามฝากถามแพทย์ล่วงหน้าได้ในแท็บ "ปรึกษาแพทย์"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Card Header */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={activePatient.avatar}
              alt={activePatient.thaiName}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cream-200 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold text-gray-900 font-serif">
                  {activePatient.thaiName}
                </h3>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                  {activePatient.hn}
                </span>
                <StatusBadge status={activePatient.healthStatus} size="sm" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                อายุ {activePatient.age} ปี • เพศ {activePatient.gender === 'female' ? 'หญิง' : 'ชาย'} • วันเกิด {activePatient.birthDate}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sage-100 text-sage-900">
                  {activePatient.careType === 'nursing_home' 
                    ? `🏢 ${activePatient.roomBed || 'ศูนย์ Nursing Home'}` 
                    : activePatient.careType === 'medical_escort'
                    ? `🏥 บริการพาพบแพทย์ (${activePatient.primaryHospital})`
                    : '🏡 บริการดูแลที่บ้าน (Home Care)'}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                  แพทย์ประจำตัว: {activePatient.primaryDoctorName} ({activePatient.primaryHospital})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Vital Highlight Card */}
          {latestVital && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs min-w-[260px]">
              <div className="flex items-center justify-between pb-2 border-b border-cream-200 text-[11px] text-gray-500">
                <span className="font-bold text-sage-900 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-sage-700" />
                  สัญญาณชีพล่าสุด ({latestVital.timestamp.split(' ')[1] || 'เช้า'})
                </span>
                <StatusBadge status={latestVital.status} size="sm" />
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 font-bold text-gray-900 text-xs">
                <div>ความดัน BP: <span className="text-sage-800">{latestVital.sys}/{latestVital.dia}</span></div>
                <div>ชีพจร Pulse: <span className="text-sage-800">{latestVital.pulse} bpm</span></div>
                <div>น้ำตาล DTX: <span className="text-amber-700">{latestVital.glucose || 135} mg/dL</span></div>
                <div>ออกซิเจน SpO2: <span className="text-emerald-700">{latestVital.spo2}%</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Precautions Alerts */}
        {activePatient.carePlan.precautions && activePatient.carePlan.precautions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              ข้อควรระวังสำคัญสำหรับคุณยาย/คุณตา:
            </span>
            {activePatient.carePlan.precautions.map(prec => (
              <PrecautionBadge key={prec.id} alert={prec} />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>ภาพรวมสุขภาพ & กิจวัตร</span>
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'vitals'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>กราฟสัญญาณชีพ & ระดับน้ำตาล</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>บันทึกการดูแล & อาหาร ({patientDailyReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('doctor')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'doctor'
              ? 'border-sage-800 text-sage-900'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>ประวัติพบแพทย์ & ฝากคำถาม</span>
        </button>
      </div>

      {/* Tab 1: Overview & Routine */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Routine & Meals Today */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-sage-700" />
                บันทึกอาหารและการดูแลประจำวันล่าสุด
              </h4>

              {activePatient.dailyLogs[0] ? (
                <div className="space-y-4 text-xs">
                  {/* Meals 3 Boxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                      <div className="flex items-center justify-between font-bold text-gray-800 mb-1">
                        <span>🌅 มื้อเช้า</span>
                        <span className="text-sage-800 font-extrabold">{activePatient.dailyLogs[0].mealBreakfast.amountPercent}%</span>
                      </div>
                      <p className="text-gray-600">{activePatient.dailyLogs[0].mealBreakfast.type}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                      <div className="flex items-center justify-between font-bold text-gray-800 mb-1">
                        <span>☀️ มื้อกลางวัน</span>
                        <span className="text-sage-800 font-extrabold">{activePatient.dailyLogs[0].mealLunch.amountPercent}%</span>
                      </div>
                      <p className="text-gray-600">{activePatient.dailyLogs[0].mealLunch.type}</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                      <div className="flex items-center justify-between font-bold text-gray-800 mb-1">
                        <span>🌆 มื้อเย็น</span>
                        <span className="text-sage-800 font-extrabold">{activePatient.dailyLogs[0].mealDinner.amountPercent}%</span>
                      </div>
                      <p className="text-gray-600">{activePatient.dailyLogs[0].mealDinner.type}</p>
                    </div>
                  </div>

                  {/* Vitals & Habits */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>ดื่มน้ำ: <strong>{activePatient.dailyLogs[0].waterIntakeMl} มล.</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Activity className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>การขับถ่าย: <strong>{activePatient.dailyLogs[0].bowelMovement.times} ครั้ง</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Moon className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>การนอนหลับ: <strong>{activePatient.dailyLogs[0].sleepHours} ชม.</strong> ({activePatient.dailyLogs[0].sleepQuality === 'good' ? 'หลับสบาย' : 'ปานกลาง'})</span>
                    </div>
                  </div>

                  {/* Activities */}
                  <div className="pt-2 text-xs">
                    <span className="font-bold text-gray-700">กิจกรรมที่ทำ: </span>
                    <span className="text-gray-600">{activePatient.dailyLogs[0].dailyActivities.join(', ')}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400">ยังไม่มีบันทึกกิจกรรมสำหรับวันนี้</p>
              )}
            </div>

            {/* Care Plan & Doctor Directives */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-600" />
                ยาประจำตัวและแนวทางการพยาบาล
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePatient.carePlan.medications.map(med => (
                  <div key={med.id} className="p-3 rounded-2xl bg-cream-50/60 border border-cream-200 text-xs">
                    <div className="font-bold text-gray-900">{med.name} ({med.dosage})</div>
                    <p className="text-gray-600 mt-0.5">{med.frequency} • {med.instructions}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">สั่งโดย: {med.prescribedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Ask Question to Doctor & Emergency Contacts */}
          <div className="space-y-4">
            
            {/* Ask Doctor / Nursing Team Form */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sage-800 text-white">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">ฝากคำถามถึงแพทย์ / พยาบาล</h4>
                  <p className="text-[11px] text-gray-400">คำถามจะถูกส่งเข้าแฟ้มตรวจของแพทย์ทันที</p>
                </div>
              </div>

              {questionSubmitted && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ส่งคำถามเรียบร้อยแล้ว ทีมงานจะสรุปคำตอบให้หลังพบแพทย์ครับ</span>
                </div>
              )}

              <form onSubmit={handleSendQuestion} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">ชื่อผู้ฝากคำถาม</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">คำถามหรือข้อสงสัยเกี่ยวกับอาการ</label>
                  <textarea
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    rows={3}
                    placeholder="เช่น ช่วงเช้ามีอาการเวียนศีรษะเล็กน้อย หรือต้องการสอบถามเรื่องการปรับยา..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งคำถามไปยังทีมแพทย์และพยาบาล</span>
                </button>
              </form>
            </div>

            {/* Emergency Hotlines */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-sage-900">
                📞 เบอร์ติดต่อฉุกเฉิน & ทีมพยาบาล
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-cream-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">เคาน์เตอร์พยาบาล Nursing Home</span>
                    <span className="text-[11px] text-gray-500">บริการ 24 ชั่วโมง</span>
                  </div>
                  <a href="tel:02-999-8877" className="font-bold text-sage-900 px-3 py-1 bg-white rounded-lg shadow-2xs">
                    02-999-8877
                  </a>
                </div>

                <div className="p-3 rounded-xl bg-cream-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">ผู้จัดการการดูแล (Care Manager)</span>
                    <span className="text-[11px] text-gray-500">พว. มัลลิกา วงศ์สุวรรณ</span>
                  </div>
                  <a href="tel:089-555-1234" className="font-bold text-sage-900 px-3 py-1 bg-white rounded-lg shadow-2xs">
                    089-555-1234
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: Vitals & Glucose Trend */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          <VitalChart
            vitals={activePatient.vitalsHistory}
          />
        </div>
      )}

      {/* Tab 3: Daily Reports Feed */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-900">
              รายงานผลการดูแลประจำวันจากผู้ดูแล ({patientDailyReports.length} รายการ)
            </h4>
          </div>

          {patientDailyReports.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-400">
              ยังไม่มีรายงานส่งเข้ามาสำหรับผู้ป่วยท่านนี้
            </div>
          ) : (
            patientDailyReports.map(rep => (
              <div key={rep.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-bold text-sage-900 text-sm">📅 รายงานวันที่ {rep.date}</span>
                    <p className="text-xs text-gray-500 mt-0.5">บันทึกโดย {rep.caregiverName} • ส่งเมื่อ {rep.submittedAt}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    ✓ ตรวจสอบแล้ว
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                    <span className="font-bold text-gray-900 block mb-1">🍲 สรุปมื้ออาหาร:</span>
                    <p className="text-gray-700">{rep.mealsSummary}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200">
                    <span className="font-bold text-gray-900 block mb-1">💓 สัญญาณชีพระหว่างวัน:</span>
                    <p className="text-gray-700">BP: {rep.vitalSummary.bp} • ชีพจร: {rep.vitalSummary.pulse} bpm • SpO2: {rep.vitalSummary.spo2}%</p>
                  </div>
                </div>

                {rep.photos && rep.photos.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-700 block mb-2">📸 ภาพถ่ายระหว่างวัน:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {rep.photos.map((photo, pIdx) => (
                        <img key={pIdx} src={photo} alt="" className="w-full h-32 rounded-2xl object-cover shadow-xs" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Doctor Appointments & Consultations */}
      {activeTab === 'doctor' && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900">
            ประวัติการพบแพทย์ & แผนการตรวจติดตาม ({patientAppointments.length} รายการ)
          </h4>

          {patientAppointments.map(apt => (
            <div key={apt.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div>
                  <span className="font-mono font-bold text-sage-800 bg-sage-50 px-2.5 py-1 rounded-lg border border-sage-200">
                    {apt.appointmentNumber}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 mt-2">{apt.hospitalName}</h4>
                  <p className="text-xs text-gray-500">{apt.department} • แพทย์: {apt.doctorName}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {apt.status === 'completed' ? '✓ ตรวจแล้ว' : apt.status}
                  </span>
                  <p className="text-xs text-gray-700 font-semibold mt-1">📅 {apt.dateTime}</p>
                </div>
              </div>

              {apt.postVisitSummary && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div>
                    <span className="font-bold text-emerald-950">📋 สรุปผลการตรวจ & คำวินิจฉัยของแพทย์:</span>
                    <p className="text-emerald-900 mt-0.5">{apt.postVisitSummary.visitNotes}</p>
                  </div>
                  {apt.postVisitSummary.newTreatmentOrders && (
                    <div>
                      <span className="font-bold text-emerald-950">🩺 คำแนะนำการพยาบาลใหม่:</span>
                      <p className="text-emerald-900 mt-0.5">{apt.postVisitSummary.newTreatmentOrders}</p>
                    </div>
                  )}
                  {apt.postVisitSummary.nextAppointmentDate && (
                    <div className="pt-2 border-t border-emerald-200 font-bold text-emerald-950 flex items-center justify-between">
                      <span>วันนัดหมายครั้งถัดไป: {apt.postVisitSummary.nextAppointmentDate}</span>
                      <span>แผนก: {apt.postVisitSummary.nextAppointmentDept || apt.department}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
