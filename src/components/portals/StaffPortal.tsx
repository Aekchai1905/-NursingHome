import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, UnifiedStaffMember, DailyLog } from '../../types';
import { StatusBadge, PrecautionBadge } from '../common/Badge';
import { DailyLogModal } from '../patient/DailyLogModal';
import { DoctorVisitModal } from '../patient/DoctorVisitModal';
import { GPSCheckinModal } from '../caregiver/GPSCheckinModal';
import { DailyCareReportModal } from '../caregiver/DailyCareReportModal';
import { 
  Building2, 
  Home, 
  HeartPulse, 
  Stethoscope, 
  MapPin, 
  FileText, 
  Plus, 
  CheckCircle2, 
  Clock, 
  User, 
  AlertCircle, 
  Users, 
  Calendar, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Activity,
  Bed,
  Check,
  Send,
  Lock,
  ChevronRight
} from 'lucide-react';

interface StaffPortalProps {
  defaultGroup?: 'home_care' | 'nursing_home';
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ defaultGroup = 'home_care' }) => {
  const { 
    patients, 
    staff, 
    caregivers, 
    checkins, 
    dailyReports, 
    addVitalSign, 
    addDailyLog, 
    currentRole 
  } = useApp();

  // Active Staff Portal Group: Home Care Staff vs Nursing Home Staff
  const [staffGroup, setStaffGroup] = useState<'home_care' | 'nursing_home'>(defaultGroup);

  // Group 1: Home Care Staff Members
  const homeCareStaff = staff.filter(s => s.category === 'home_care');
  const [selectedHomeCareStaffId, setSelectedHomeCareStaffId] = useState<string>(homeCareStaff[0]?.id || 'stf-009');
  const currentHomeCareStaff = staff.find(s => s.id === selectedHomeCareStaffId) || homeCareStaff[0];

  // Group 2: Nursing Home Staff Members
  const nursingHomeStaff = staff.filter(s => s.category === 'nursing_home_escort');
  const [selectedNursingStaffId, setSelectedNursingStaffId] = useState<string>(nursingHomeStaff[0]?.id || 'stf-001');
  const currentNursingStaff = staff.find(s => s.id === selectedNursingStaffId) || nursingHomeStaff[0];

  // Modals state
  const [logModalPatient, setLogModalPatient] = useState<Patient | null>(null);
  const [doctorVisitModalPatient, setDoctorVisitModalPatient] = useState<Patient | null>(null);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [showDailyReportModal, setShowDailyReportModal] = useState(false);

  // =========================================================================
  // Group 1 Filtering: Home Care Staff sees ONLY assigned patient(s)
  // =========================================================================
  const homeCareAssignedPatients = patients.filter(p => {
    if (p.careType !== 'home_care') return false;
    // Match by assigned name or currentAssignment
    if (currentHomeCareStaff?.currentAssignment?.patientName) {
      return p.thaiName.includes(currentHomeCareStaff.currentAssignment.patientName.replace('คุณยาย', '').replace('คุณตา', '').trim()) ||
             currentHomeCareStaff.currentAssignment.patientName.includes(p.thaiName);
    }
    return p.primaryCaregiverName?.includes(currentHomeCareStaff?.thaiName || '') || false;
  });

  // Default fallback if matching is empty
  const activeHomeCarePatient = homeCareAssignedPatients[0] || patients.find(p => p.careType === 'home_care') || patients[0];

  // =========================================================================
  // Group 2 Filtering: Nursing Home Staff sees ALL Nursing Home patients ONLY
  // =========================================================================
  const nursingHomePatients = patients.filter(p => p.careType === 'nursing_home');
  const [selectedNursingPatientId, setSelectedNursingPatientId] = useState<string>(nursingHomePatients[0]?.id || '');
  const activeNursingPatient = nursingHomePatients.find(p => p.id === selectedNursingPatientId) || nursingHomePatients[0];

  // Home Care check-in status for this staff
  const staffCheckin = checkins.find(c => c.caregiverName.includes(currentHomeCareStaff?.nickname || '') || c.caregiverName.includes(currentHomeCareStaff?.thaiName?.slice(0, 5) || ''));

  return (
    <div className="space-y-6">
      
      {/* Staff Portal Main Header */}
      <div className="bg-gradient-to-r from-sage-950 via-sage-900 to-sage-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cream-100 text-sage-950 shadow-xs">
                👩‍⚕️ Staff & Caregiver Portal
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 text-cream-200 border border-white/20">
                ระบบบันทึกและจัดการงานสำหรับพนักงาน
              </span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 font-serif">
              {staffGroup === 'home_care' 
                ? 'หน้าจอสำหรับพนักงานดูแลผู้ป่วยที่บ้าน (Home Care)' 
                : 'หน้าจอสำหรับพนักงานดูแลประจำศูนย์ Nursing Home'}
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 mt-1 max-w-2xl">
              {staffGroup === 'home_care'
                ? 'บันทึกสัญญาณชีพ, กิจวัตร, GPS เช็กอิน, และส่งรายงานประจำวันเฉพาะผู้ป่วยที่ได้รับมอบหมายดูแล'
                : 'บันทึกสัญญาณชีพประจำเวร, บันทึกการพบแพทย์, และประเมินการดูแลสำหรับผู้ป่วยทุกคนในศูนย์ Nursing Home'}
            </p>
          </div>

          {/* Group Switcher (Segmented Buttons) */}
          <div className="bg-black/30 p-1.5 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
            <button
              onClick={() => setStaffGroup('home_care')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                staffGroup === 'home_care'
                  ? 'bg-cream-100 text-sage-950 shadow-md scale-100'
                  : 'text-cream-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>1. พนักงานดูแลที่บ้าน (Home Care)</span>
            </button>

            <button
              onClick={() => setStaffGroup('nursing_home')}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                staffGroup === 'nursing_home'
                  ? 'bg-cream-100 text-sage-950 shadow-md scale-100'
                  : 'text-cream-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. พนักงานดูแล Nursing Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: พนักงานที่ดูแลผู้ป่วยที่บ้าน (Home Care Caregiver Staff Portal) */}
      {/* ========================================================================= */}
      {staffGroup === 'home_care' && (
        <div className="space-y-6">
          
          {/* Active Logged-in Staff Bar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentHomeCareStaff.avatar}
                alt={currentHomeCareStaff.thaiName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-300 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {currentHomeCareStaff.code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900">
                    ผู้ดูแลผู้ป่วยที่บ้าน (Home Caregiver)
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  ยินดีต้อนรับ: {currentHomeCareStaff.thaiName} {currentHomeCareStaff.nickname && `(${currentHomeCareStaff.nickname})`}
                </h3>
                <p className="text-xs text-gray-500">{currentHomeCareStaff.subRole} • โทร: {currentHomeCareStaff.phone}</p>
              </div>
            </div>

            {/* Switch Active Staff Account Simulator */}
            <div className="flex items-center gap-2 self-end md:self-auto bg-cream-50 p-2 rounded-2xl border border-cream-200">
              <span className="text-[11px] font-bold text-gray-600">สลับบัญชีผู้ดูแล:</span>
              <select
                value={selectedHomeCareStaffId}
                onChange={e => setSelectedHomeCareStaffId(e.target.value)}
                className="text-xs font-bold text-sage-900 bg-white border border-gray-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                {homeCareStaff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.thaiName} ({s.code}) - {s.status === 'working' ? '🟡 กำลังติดเคส' : '🟢 ว่าง'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strict Permission & Assigned Patient Header */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>สิทธิ์การบันทึกข้อมูล:</strong> ท่านสามารถดูและบันทึกประวัติสุขภาพได้ <strong>เฉพาะผู้ป่วยที่ได้รับมอบหมายดูแลเท่านั้น</strong>
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-200 text-amber-900 shrink-0">
              เคสที่ดูแล: {activeHomeCarePatient.thaiName}
            </span>
          </div>

          {/* Assigned Patient Detail & Action Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Patient Profile & Quick Actions */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Patient Card */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={activeHomeCarePatient.avatar}
                    alt={activeHomeCarePatient.thaiName}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cream-300 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                      {activeHomeCarePatient.hn}
                    </span>
                    <h4 className="text-base font-bold text-gray-900 mt-1">{activeHomeCarePatient.thaiName}</h4>
                    <p className="text-xs text-gray-500">อายุ {activeHomeCarePatient.age} ปี • {activeHomeCarePatient.gender === 'female' ? 'หญิง' : 'ชาย'}</p>
                    <p className="text-[11px] text-emerald-800 font-semibold mt-1">🏡 {activeHomeCarePatient.address}</p>
                  </div>
                </div>

                {/* Precautions */}
                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-900 block">⚠️ ข้อควรระวังในการดูแล:</span>
                  {activeHomeCarePatient.carePlan.precautions.map(prec => (
                    <div key={prec.id} className="p-2 rounded-xl bg-amber-50 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{prec.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions for Home Caregiver */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider text-sage-900">
                  ⚡ ฟังก์ชันการบันทึกงานประจำวัน
                </h4>

                <button
                  onClick={() => setShowGpsModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-soft flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>1. GPS เช็กอิน / เช็กเอาท์</span>
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setLogModalPatient(activeHomeCarePatient)}
                  className="w-full py-3 px-4 rounded-2xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4" />
                    <span>2. บันทึกสัญญาณชีพ & DTX</span>
                  </span>
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowDailyReportModal(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-cream-200 hover:bg-cream-300 text-sage-950 text-xs font-bold border border-cream-300 shadow-xs flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sage-800" />
                    <span>3. ส่งรายงานการดูแลประจำวัน (รูปถ่าย)</span>
                  </span>
                  <Send className="w-3.5 h-3.5 text-sage-800" />
                </button>
              </div>

            </div>

            {/* Right 2 Cols: Patient Log History & Directives */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Latest Vitals Timeline */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-sage-700" />
                    ประวัติสัญญาณชีพที่บันทึกไว้ ({activeHomeCarePatient.vitalsHistory.length} รอบ)
                  </h4>
                  <button
                    onClick={() => setLogModalPatient(activeHomeCarePatient)}
                    className="px-3 py-1.5 rounded-xl bg-sage-800 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ บันทึกรอบใหม่</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeHomeCarePatient.vitalsHistory.map(v => (
                    <div key={v.id} className="p-3.5 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">⏰ {v.timestamp}</span>
                        <StatusBadge status={v.status} size="sm" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-semibold text-gray-800 pt-1 border-t border-cream-200">
                        <div>ความดัน: <strong className="text-sage-900">{v.sys}/{v.dia}</strong></div>
                        <div>ชีพจร: <strong>{v.pulse} bpm</strong></div>
                        <div>น้ำตาล DTX: <strong className="text-amber-700">{v.glucose || '-'}</strong></div>
                        <div>SpO2: <strong className="text-emerald-700">{v.spo2}%</strong></div>
                      </div>
                      {v.notes && <p className="text-[11px] text-gray-500 italic mt-1">"{v.notes}"</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Medication and Care Directives Checklist */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  รายการยาที่ต้องให้ตามมื้อ (Medication Directives)
                </h4>

                <div className="space-y-2 text-xs">
                  {activeHomeCarePatient.carePlan.medications.map(m => (
                    <div key={m.id} className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-gray-900">{m.name} ({m.dosage})</span>
                        <p className="text-gray-600">{m.frequency} • {m.instructions}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white font-bold text-[11px] text-sage-900 shadow-2xs">
                        {m.timing.join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: พนักงานที่ดูแล Nursing Home (On-site Nurse & Staff Portal) */}
      {/* ========================================================================= */}
      {staffGroup === 'nursing_home' && (
        <div className="space-y-6">
          
          {/* Active Logged-in Staff Bar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                src={currentNursingStaff.avatar}
                alt={currentNursingStaff.thaiName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sage-300 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                    {currentNursingStaff.code}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sage-100 text-sage-900">
                    🏢 พนักงานประจำศูนย์ Nursing Home
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-0.5">
                  ยินดีต้อนรับ: {currentNursingStaff.thaiName} {currentNursingStaff.nickname && `(${currentNursingStaff.nickname})`}
                </h3>
                <p className="text-xs text-gray-500">{currentNursingStaff.subRole} • โทร: {currentNursingStaff.phone}</p>
              </div>
            </div>

            {/* Switch Active Nursing Staff Simulator */}
            <div className="flex items-center gap-2 self-end md:self-auto bg-cream-50 p-2 rounded-2xl border border-cream-200">
              <span className="text-[11px] font-bold text-gray-600">สลับบัญชีเจ้าหน้าที่:</span>
              <select
                value={selectedNursingStaffId}
                onChange={e => setSelectedNursingStaffId(e.target.value)}
                className="text-xs font-bold text-sage-900 bg-white border border-gray-200 px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
              >
                {nursingHomeStaff.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.thaiName} ({s.subRole})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Scope Header: ALL Nursing Home Patients ONLY */}
          <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs text-sage-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sage-700 shrink-0" />
              <span>
                <strong>ขอบเขตข้อมูล:</strong> แสดงและบันทึกข้อมูล <strong>เฉพาะผู้ป่วยทุกคนที่อยู่ในกลุ่ม Nursing Home ({nursingHomePatients.length} ท่าน)</strong> เท่านั้น
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDoctorVisitModalPatient(nursingHomePatients[0])}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-900 flex items-center gap-1"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>+ บันทึกการพบแพทย์ On-site</span>
              </button>
            </div>
          </div>

          {/* Ward Bed / Patient Grid (Nursing Home All Patients) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nursingHomePatients.map(pt => {
              const latestV = pt.vitalsHistory[0];

              return (
                <div
                  key={pt.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-soft hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 hover:border-sage-300"
                >
                  <div>
                    {/* Room & Bed Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-sage-100 text-sage-900 border border-sage-200 flex items-center gap-1">
                        <Bed className="w-3.5 h-3.5" />
                        {pt.roomBed || 'เตียงประจำศูนย์'}
                      </span>
                      <StatusBadge status={pt.healthStatus} size="sm" />
                    </div>

                    {/* Patient Overview */}
                    <div className="flex items-center gap-3.5 mt-3.5">
                      <img
                        src={pt.avatar}
                        alt={pt.thaiName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold text-gray-500">{pt.hn}</span>
                        <h4 className="text-base font-bold text-gray-900 truncate">{pt.thaiName}</h4>
                        <p className="text-xs text-gray-500">อายุ {pt.age} ปี • แพทย์: {pt.primaryDoctorName}</p>
                      </div>
                    </div>

                    {/* Latest Vital Signs */}
                    {latestV && (
                      <div className="mt-3.5 p-3 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-semibold">
                          <span>สัญญาณชีพล่าสุด ({latestV.timestamp.split(' ')[1] || 'เช้า'})</span>
                          <span>{latestV.temp}°C</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 font-bold text-gray-900">
                          <div>BP: <strong className="text-sage-900">{latestV.sys}/{latestV.dia}</strong></div>
                          <div>ชีพจร: <strong>{latestV.pulse} bpm</strong></div>
                        </div>
                      </div>
                    )}

                    {/* Precautions alert */}
                    {pt.carePlan.precautions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {pt.carePlan.precautions.slice(0, 2).map(pr => (
                          <span key={pr.id} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            ⚠️ {pr.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bedside Action Buttons */}
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setLogModalPatient(pt)}
                      className="py-2 px-3 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-900 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>จดสัญญาณชีพ</span>
                    </button>

                    <button
                      onClick={() => setDoctorVisitModalPatient(pt)}
                      className="py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-colors"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>บันทึกพบแพทย์</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Modals */}
      {logModalPatient && (
        <DailyLogModal
          patient={logModalPatient}
          onClose={() => setLogModalPatient(null)}
        />
      )}

      {doctorVisitModalPatient && (
        <DoctorVisitModal
          patient={doctorVisitModalPatient}
          onClose={() => setDoctorVisitModalPatient(null)}
        />
      )}

      {showGpsModal && (
        <GPSCheckinModal
          caregiver={caregivers[0]}
          onClose={() => setShowGpsModal(false)}
        />
      )}

      {showDailyReportModal && (
        <DailyCareReportModal
          caregiver={caregivers[0]}
          onClose={() => setShowDailyReportModal(false)}
        />
      )}

    </div>
  );
};
