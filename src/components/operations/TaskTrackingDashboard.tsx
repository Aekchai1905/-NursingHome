import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, UnifiedStaffMember } from '../../types';
import { PreAppointmentBriefing } from '../escort/PreAppointmentBriefing';
import { JobMatchingModal } from '../escort/JobMatchingModal';
import { PostVisitModal } from '../escort/PostVisitModal';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Car, 
  Building2, 
  Stethoscope, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  UserCheck, 
  Phone, 
  Search, 
  Filter, 
  BarChart3, 
  PieChart, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  FileText, 
  ChevronLeft, 
  ChevronRight,
  ShieldAlert,
  Heart,
  Home,
  TrendingUp,
  Activity,
  Check
} from 'lucide-react';

export const TaskTrackingDashboard: React.FC = () => {
  const { 
    appointments, 
    staff, 
    selectedAppointmentId, 
    setSelectedAppointmentId,
    setSelectedPatientId,
    patients
  } = useApp();

  // Sub-tab: 3.1 Doctor Appointment Calendar vs 3.2 Staff Availability Graph
  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'staff_graph'>('calendar');

  // Filters for Calendar (3.1)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-08');
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'selected_day' | 'upcoming'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hospitalFilter, setHospitalFilter] = useState<string>('all');

  // Modals
  const [matchingAppointment, setMatchingAppointment] = useState<Appointment | null>(null);
  const [postVisitAppointment, setPostVisitAppointment] = useState<Appointment | null>(null);

  // If appointment is selected, render Level 2 Pre-Appointment Briefing screen
  const selectedApt = appointments.find(a => a.id === selectedAppointmentId);
  if (selectedApt) {
    return (
      <PreAppointmentBriefing
        appointment={selectedApt}
        onBack={() => setSelectedAppointmentId(null)}
      />
    );
  }

  // Filtered Appointments (3.1)
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchPatient = apt.patientName.toLowerCase().includes(q);
        const matchDoctor = apt.doctorName.toLowerCase().includes(q);
        const matchHospital = apt.hospitalName.toLowerCase().includes(q);
        const matchEscort = (apt.escortStaffName || '').toLowerCase().includes(q);
        const matchNum = apt.appointmentNumber.toLowerCase().includes(q);
        if (!matchPatient && !matchDoctor && !matchHospital && !matchEscort && !matchNum) return false;
      }

      // Status
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // Hospital
      if (hospitalFilter !== 'all' && apt.hospitalName !== hospitalFilter) return false;

      // Date Filter
      if (dateFilterMode === 'selected_day') {
        if (!apt.dateTime.startsWith(selectedDate)) return false;
      } else if (dateFilterMode === 'upcoming') {
        if (apt.status === 'completed' || apt.status === 'cancelled') return false;
      }

      return true;
    });
  }, [appointments, searchTerm, statusFilter, hospitalFilter, dateFilterMode, selectedDate]);

  // Unique Hospitals for filter
  const hospitals = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach(a => set.add(a.hospitalName));
    return Array.from(set);
  }, [appointments]);

  // Staff Availability Calculations (3.2)
  const staffStats = useMemo(() => {
    const total = staff.length;
    const available = staff.filter(s => s.status === 'available');
    const working = staff.filter(s => s.status === 'working');
    const leave = staff.filter(s => s.status === 'leave');

    const nhTotal = staff.filter(s => s.category === 'nursing_home_escort');
    const nhAvailable = nhTotal.filter(s => s.status === 'available');
    const nhWorking = nhTotal.filter(s => s.status === 'working');
    const nhLeave = nhTotal.filter(s => s.status === 'leave');

    const hcTotal = staff.filter(s => s.category === 'home_care');
    const hcAvailable = hcTotal.filter(s => s.status === 'available');
    const hcWorking = hcTotal.filter(s => s.status === 'working');
    const hcLeave = hcTotal.filter(s => s.status === 'leave');

    return {
      total,
      availableCount: available.length,
      workingCount: working.length,
      leaveCount: leave.length,
      availablePct: total > 0 ? Math.round((available.length / total) * 100) : 0,
      workingPct: total > 0 ? Math.round((working.length / total) * 100) : 0,
      leavePct: total > 0 ? Math.round((leave.length / total) * 100) : 0,

      nhTotalCount: nhTotal.length,
      nhAvailableCount: nhAvailable.length,
      nhWorkingCount: nhWorking.length,
      nhLeaveCount: nhLeave.length,

      hcTotalCount: hcTotal.length,
      hcAvailableCount: hcAvailable.length,
      hcWorkingCount: hcWorking.length,
      hcLeaveCount: hcLeave.length,

      availableStaffList: available,
      workingStaffList: working
    };
  }, [staff]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* Header Banner - Warm & Clean Aesthetic */}
      <div className="rounded-3xl bg-white text-[#1A2E25] p-6 sm:p-8 shadow-sm relative overflow-hidden border border-[#EAE2D3]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CF7C4E]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#4D7D67]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] text-xs font-extrabold shadow-2xs">
              <Activity className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>ส่วนที่ 3: Operations & Escort Tracking Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#142332] font-heading">
              สรุปรายงานติดตามงาน (Operations Tracking)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6B64] max-w-2xl leading-relaxed font-medium">
              ติดตามตารางนัดหมายพบแพทย์ (ระบุลูกค้า, พนักงานพาไป, ข้อควรระวัง และคำถามที่ต้องถามหมอ) 
              และวิเคราะห์กราฟความพร้อมของพนักงาน (ว่าง / ไม่ว่าง / ลาพัก) แบบเรียลไทม์
            </p>
          </div>

          {/* Sub-tab Navigation Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] shadow-2xs">
            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'calendar'
                  ? 'bg-[#23382E] text-white shadow-xs'
                  : 'text-[#5C6B64] hover:text-[#1A2E25]'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>3.1 ปฏิทินนัดหมายพบแพทย์</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeSubTab === 'calendar' ? 'bg-[#CF7C4E] text-white' : 'bg-[#EAE2D3] text-[#5C6B64]'
              }`}>
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('staff_graph')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'staff_graph'
                  ? 'bg-[#23382E] text-white shadow-xs'
                  : 'text-[#5C6B64] hover:text-[#1A2E25]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>3.2 กราฟสถานะพนักงาน (ว่าง/ไม่ว่าง)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeSubTab === 'staff_graph' ? 'bg-[#CF7C4E] text-white' : 'bg-[#EAE2D3] text-[#5C6B64]'
              }`}>
                {staffStats.availableCount} ว่าง
              </span>
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F4EFE5]">
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3]">
            <span className="text-[11px] text-[#5C6B64] font-bold block">🚗 นัดหมายแพทย์ทั้งหมด</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#142332] font-heading">{appointments.length}</span>
              <span className="text-xs font-semibold text-[#7D8C85]">เคส</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EEF5F9] border border-[#C6DEED]">
            <span className="text-[11px] text-[#2B5975] font-bold block">🔵 นัดหมายเร็วๆ นี้ (Upcoming)</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#2B5975] font-heading">
                {appointments.filter(a => a.status === 'confirmed' || a.status === 'upcoming').length}
              </span>
              <span className="text-xs font-semibold text-[#2B5975]/80">เคส</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF7F0] border border-[#BEE7D0]">
            <span className="text-[11px] text-[#1E7E52] font-bold block">🟢 พนักงานว่างพร้อมรับงาน</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#1E7E52] font-heading">{staffStats.availableCount}</span>
              <span className="text-xs font-semibold text-[#1E7E52]/80">คน ({staffStats.availablePct}%)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FDF6E8] border border-[#F6DC9F]">
            <span className="text-[11px] text-[#8F5B13] font-bold block">🟡 พนักงานติดเคสปฏิบัติงาน</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#8F5B13] font-heading">{staffStats.workingCount}</span>
              <span className="text-xs font-semibold text-[#8F5B13]/80">คน ({staffStats.workingPct}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3.1 DOCTOR APPOINTMENT CALENDAR */}
      {/* ========================================================================= */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6">
          
          {/* Toolbar: Search, Date Filter & Hospital Filter */}
          <div className="bg-white rounded-3xl p-5 border border-[#EAE2D3] shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D8C85]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาชื่อลูกค้า, โรงพยาบาล, แพทย์ผู้นัด, หรือพนักงานที่ไปด้วย..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E4D9C8] bg-[#FAF6F0] text-xs text-[#1A2E25] placeholder-[#7D8C85] focus:outline-none focus:ring-2 focus:ring-[#23382E] focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Date Filter Quick Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3]">
                  <button
                    onClick={() => setDateFilterMode('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dateFilterMode === 'all'
                        ? 'bg-[#23382E] text-white shadow-xs'
                        : 'text-[#5C6B64] hover:text-[#1A2E25]'
                    }`}
                  >
                    ทุกวัน ({appointments.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate('2026-09-08');
                      setDateFilterMode('selected_day');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dateFilterMode === 'selected_day'
                        ? 'bg-[#23382E] text-white shadow-xs'
                        : 'text-[#5C6B64] hover:text-[#1A2E25]'
                    }`}
                  >
                    📅 วันที่ 8 ก.ย. 2026
                  </button>
                  <button
                    onClick={() => setDateFilterMode('upcoming')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dateFilterMode === 'upcoming'
                        ? 'bg-[#23382E] text-white shadow-xs'
                        : 'text-[#5C6B64] hover:text-[#1A2E25]'
                    }`}
                  >
                    ⏳ ยังไม่ถึงวันนัด
                  </button>
                </div>
              </div>

            </div>

            {/* Filter Row: Hospital & Status */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F4EFE5]">
              <span className="text-[11px] font-bold text-[#5C6B64] mr-1">โรงพยาบาล:</span>
              <button
                onClick={() => setHospitalFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  hospitalFilter === 'all'
                    ? 'bg-[#23382E] text-white'
                    : 'bg-[#F4EFE5] text-[#3D4C44] hover:bg-[#EAE2D3]'
                }`}
              >
                ทั้งหมด
              </button>
              {hospitals.map((h, i) => (
                <button
                  key={i}
                  onClick={() => setHospitalFilter(h)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hospitalFilter === h
                      ? 'bg-[#23382E] text-white'
                      : 'bg-[#F4EFE5] text-[#3D4C44] hover:bg-[#EAE2D3]'
                  }`}
                >
                  🏥 {h.replace('โรงพยาบาล', 'รพ.')}
                </button>
              ))}

              <span className="text-[#DCD0BD] mx-1">|</span>

              <span className="text-[11px] font-bold text-[#5C6B64] mr-1">สถานะ:</span>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${statusFilter === 'all' ? 'bg-[#23382E] text-white' : 'bg-[#F4EFE5] text-[#3D4C44]'}`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${statusFilter === 'confirmed' ? 'bg-[#2B5975] text-white' : 'bg-[#EEF5F9] text-[#2B5975]'}`}
              >
                🔵 ยืนยันนัดแล้ว
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${statusFilter === 'in_progress' ? 'bg-[#B87A1E] text-white' : 'bg-[#FDF6E8] text-[#8F5B13]'}`}
              >
                🟡 กำลังเดินทาง
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold ${statusFilter === 'completed' ? 'bg-[#1E7E52] text-white' : 'bg-[#EAF7F0] text-[#1E7E52]'}`}
              >
                🟢 ตรวจเสร็จแล้ว
              </button>
            </div>
          </div>

          {/* Appointment Cards (Rich 4-part View) */}
          <div className="space-y-4">
            {filteredAppointments.map(apt => {
              const questions = apt.preAppointmentBriefing?.questionsChecklist || [];
              const precautions = apt.preAppointmentBriefing?.precautionAlerts || [];

              return (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl border border-[#EAE2D3] hover:border-[#CF7C4E]/50 shadow-sm hover:shadow-soft-lg transition-all p-5 sm:p-6 overflow-hidden"
                >
                  {/* Top Bar: Appointment Number, Date-Time & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4EFE5]">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-xl bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6]">
                        {apt.appointmentNumber}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#142332]">
                        <Clock className="w-3.5 h-3.5 text-[#CF7C4E]" />
                        <span>วัน-เวลานัด: <strong>{apt.dateTime} น.</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        apt.status === 'completed' ? 'bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0]' :
                        apt.status === 'in_progress' ? 'bg-[#FDF6E8] text-[#8F5B13] border border-[#F6DC9F]' :
                        'bg-[#EEF5F9] text-[#2B5975] border border-[#C6DEED]'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          apt.status === 'completed' ? 'bg-[#1E7E52]' :
                          apt.status === 'in_progress' ? 'bg-[#B87A1E] animate-pulse' : 'bg-[#2B5975]'
                        }`} />
                        <span>
                          {apt.status === 'completed' ? '🟢 ตรวจเสร็จสิ้นแล้ว' :
                           apt.status === 'in_progress' ? '🟡 กำลังเดินทาง/ตรวจ' : '🔵 นัดหมายยืนยันแล้ว'}
                        </span>
                      </span>

                      {/* Level 2 Briefing Link */}
                      <button
                        onClick={() => setSelectedAppointmentId(apt.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#23382E] text-white text-xs font-bold hover:bg-[#1A2E25] transition-all flex items-center gap-1 cursor-pointer"
                        title="เปิดแฟ้มสรุปก่อนพบแพทย์ (Pre-Appointment Briefing)"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#E5EDE8]" />
                        <span>เปิดแฟ้มสรุป</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 Core Pillars Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-4 text-xs">
                    
                    {/* Pillar 1: ลูกค้าท่านไหนไป (Patient Info) */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6B64] block mb-2">
                          1. ลูกค้าที่ไปพบแพทย์
                        </span>
                        <div className="flex items-center gap-3">
                          <img
                            src={apt.patientAvatar}
                            alt={apt.patientName}
                            onClick={() => setSelectedPatientId(apt.patientId)}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs cursor-pointer hover:scale-105 transition-all"
                            title="คลิกเพื่อดูรายละเอียดผู้ป่วย"
                          />
                          <div className="min-w-0">
                            <h4 
                              onClick={() => setSelectedPatientId(apt.patientId)}
                              className="font-extrabold text-sm text-[#142332] truncate hover:text-[#CF7C4E] hover:underline cursor-pointer font-heading"
                            >
                              {apt.patientName}
                            </h4>
                            <p className="text-[11px] text-[#5C6B64]">
                              อายุ {apt.patientAge} ปี
                            </p>
                            <p className="text-[11px] text-[#8F5B13] truncate font-medium mt-0.5">
                              {apt.patientCondition}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedPatientId(apt.patientId)}
                        className="mt-3 text-[11px] font-bold text-[#CF7C4E] hover:underline text-left cursor-pointer"
                      >
                        → ดูประวัติสุขภาพผู้ป่วย
                      </button>
                    </div>

                    {/* Pillar 2: พนักงานที่ไปด้วย (Escort / Caregiver) */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6B64] block mb-2">
                          2. พนักงานที่ไปด้วย (Escort)
                        </span>
                        {apt.escortStaffId ? (
                          <div className="flex items-center gap-3">
                            <img
                              src={apt.escortStaffAvatar}
                              alt={apt.escortStaffName}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-xs"
                            />
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-xs text-[#142332] truncate font-heading">
                                {apt.escortStaffName}
                              </h4>
                              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0] mt-0.5">
                                ✓ รับมอบหมายแล้ว
                              </span>
                              {apt.escortStaffPhone && (
                                <p className="text-[11px] text-[#5C6B64] flex items-center gap-1 mt-1 font-mono font-bold">
                                  <Phone className="w-3 h-3 text-[#23382E]" />
                                  <span>{apt.escortStaffPhone}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[#FDF0EF] border border-[#F7BDB9] text-center">
                            <span className="text-[11px] font-bold text-[#9C3E3A] block">ยังไม่มีผู้ดูแลรับผิดชอบ</span>
                            <button
                              onClick={() => setMatchingAppointment(apt)}
                              className="mt-1.5 px-3 py-1 rounded-xl bg-[#CF7C4E] text-white text-[11px] font-bold hover:bg-[#BE673B] cursor-pointer"
                            >
                              + จัดสรรพนักงานทันที
                            </button>
                          </div>
                        )}
                      </div>

                      {apt.escortStaffId && (
                        <button
                          onClick={() => setMatchingAppointment(apt)}
                          className="mt-3 text-[11px] font-bold text-[#5C6B64] hover:text-[#1A2E25] text-left cursor-pointer"
                        >
                          ⚙️ เปลี่ยนพนักงานพาไป
                        </button>
                      )}
                    </div>

                    {/* Pillar 3: โรงพยาบาล & แพทย์ (Hospital & Clinic) */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C6B64] block mb-2">
                          3. สถานพยาบาล & แพทย์
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-1.5 text-[#142332] font-bold text-xs">
                            <Building2 className="w-3.5 h-3.5 text-[#CF7C4E] shrink-0 mt-0.5" />
                            <span className="leading-snug">{apt.hospitalName}</span>
                          </div>
                          <div className="text-[11px] text-[#5C6B64] pl-5">
                            {apt.department}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-[#23382E] font-bold pl-5 pt-0.5">
                            <Stethoscope className="w-3 h-3" />
                            <span>{apt.doctorName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] text-[#7D8C85]">
                        📍 เตรียมเอกสารสิทธิ์ & บัตรประชาชน
                      </div>
                    </div>

                    {/* Pillar 4: ข้อควรระวัง & คำถามที่ต้องถามหมอ (Precautions & Questions) */}
                    <div className="p-4 rounded-2xl bg-[#FAF0E6]/70 border border-[#F0BFA6] flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9E4E28] block mb-2 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#CF7C4E]" />
                          <span>4. ข้อควรระวัง & คำถามถามหมอ</span>
                        </span>

                        {/* Precautions Tag */}
                        {precautions.length > 0 && (
                          <div className="mb-2 space-y-1">
                            {precautions.map((pr, idx) => (
                              <div
                                key={idx}
                                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FDF0EF] text-[#9C3E3A] border border-[#F7BDB9] flex items-center gap-1"
                              >
                                <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{pr}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Doctor Questions Checklist */}
                        <div>
                          <span className="text-[10px] font-bold text-[#5C6B64] block mb-1">
                            💬 คำถามที่ญาติต้องการให้ถามแพทย์ ({questions.length}):
                          </span>
                          {questions.length > 0 ? (
                            <ul className="space-y-1">
                              {questions.slice(0, 2).map((q, idx) => (
                                <li key={idx} className="text-[10px] text-[#142332] flex items-start gap-1 leading-tight">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${q.answered ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                  <span className="line-clamp-2">
                                    {q.question}
                                    {q.answered && <b className="text-emerald-700 ml-1">(ตอบแล้ว)</b>}
                                  </span>
                                </li>
                              ))}
                              {questions.length > 2 && (
                                <li className="text-[10px] text-[#CF7C4E] font-bold">
                                  + อีก {questions.length - 2} คำถามในแฟ้ม
                                </li>
                              )}
                            </ul>
                          ) : (
                            <span className="text-[10px] text-[#7D8C85] italic">ไม่มีคำถามเพิ่มเติม</span>
                          )}
                        </div>
                      </div>

                      {/* Post Visit Summary Button */}
                      {apt.status === 'completed' ? (
                        <div className="mt-3 text-[10px] text-[#1E7E52] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>บันทึกผลตรวจและใบเสร็จแล้ว</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPostVisitAppointment(apt)}
                          className="mt-3 text-[11px] font-bold text-[#23382E] hover:text-[#CF7C4E] hover:underline text-left cursor-pointer"
                        >
                          📝 บันทึกผลตรวจหลังพบแพทย์
                        </button>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3.2 STAFF AVAILABILITY & WORKLOAD GRAPH */}
      {/* ========================================================================= */}
      {activeSubTab === 'staff_graph' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Main Visual Graph Panel */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F4EFE5]">
              <div>
                <h3 className="text-lg font-extrabold text-[#142332] font-heading flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#CF7C4E]" />
                  <span>รายงานสถานะพนักงานแบบกราฟ (Staff Availability Analytics)</span>
                </h3>
                <p className="text-xs text-[#5C6B64] mt-0.5">
                  แสดงสัดส่วนพนักงานที่ว่างพร้อมรับงาน (Available) vs ติดเคสปฏิบัติงาน (On Duty) vs ลาพัก (On Leave)
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-[#1E7E52]">
                  <span className="w-3 h-3 rounded-full bg-[#1E7E52]" />
                  <span>ว่างพร้อมงาน ({staffStats.availableCount})</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#8F5B13]">
                  <span className="w-3 h-3 rounded-full bg-[#D9982E]" />
                  <span>ติดเคส ({staffStats.workingCount})</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#9C3E3A]">
                  <span className="w-3 h-3 rounded-full bg-[#9C3E3A]" />
                  <span>ลาพัก ({staffStats.leaveCount})</span>
                </span>
              </div>
            </div>

            {/* Visual Bar Comparison Graph */}
            <div className="space-y-6">
              
              {/* Overall Total Bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#142332] mb-2">
                  <span>📊 ภาพรวมพนักงานทั้งหมด ({staffStats.total} คน)</span>
                  <span>ความพร้อม: {staffStats.availablePct}% พร้อมรับงาน</span>
                </div>
                <div className="h-7 w-full rounded-2xl bg-[#F4EFE5] overflow-hidden flex p-0.5 shadow-inner">
                  <div
                    style={{ width: `${staffStats.availablePct}%` }}
                    className="h-full rounded-xl bg-gradient-to-r from-[#2A9D68] to-[#1E7E52] flex items-center justify-center text-white text-[11px] font-extrabold transition-all"
                  >
                    {staffStats.availablePct > 10 && `ว่าง ${staffStats.availableCount} (${staffStats.availablePct}%)`}
                  </div>
                  <div
                    style={{ width: `${staffStats.workingPct}%` }}
                    className="h-full rounded-xl bg-gradient-to-r from-[#F9D174] to-[#D9982E] flex items-center justify-center text-[#5A3B0F] text-[11px] font-extrabold transition-all mx-0.5"
                  >
                    {staffStats.workingPct > 10 && `ติดเคส ${staffStats.workingCount} (${staffStats.workingPct}%)`}
                  </div>
                  <div
                    style={{ width: `${staffStats.leavePct}%` }}
                    className="h-full rounded-xl bg-gradient-to-r from-[#F7BDB9] to-[#9C3E3A] flex items-center justify-center text-white text-[11px] font-extrabold transition-all"
                  >
                    {staffStats.leavePct > 5 && `ลา ${staffStats.leaveCount}`}
                  </div>
                </div>
              </div>

              {/* Group 1 Breakdown: Nursing Home & Escort */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#142332] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#2B5975]" />
                    <span>กลุ่มที่ 1: Nursing Home & พาพบแพทย์ Escort ({staffStats.nhTotalCount} คน)</span>
                  </span>
                  <span className="text-[#1E7E52]">
                    ว่าง {staffStats.nhAvailableCount} / ทำงาน {staffStats.nhWorkingCount} / ลา {staffStats.nhLeaveCount}
                  </span>
                </div>
                <div className="h-6 w-full rounded-2xl bg-[#F4EFE5] overflow-hidden flex p-0.5">
                  <div
                    style={{ width: `${staffStats.nhTotalCount > 0 ? (staffStats.nhAvailableCount / staffStats.nhTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#1E7E52] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {staffStats.nhAvailableCount > 0 && `${staffStats.nhAvailableCount} คน`}
                  </div>
                  <div
                    style={{ width: `${staffStats.nhTotalCount > 0 ? (staffStats.nhWorkingCount / staffStats.nhTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#D9982E] text-[#5A3B0F] text-[10px] font-bold flex items-center justify-center mx-0.5"
                  >
                    {staffStats.nhWorkingCount > 0 && `${staffStats.nhWorkingCount} คน`}
                  </div>
                  <div
                    style={{ width: `${staffStats.nhTotalCount > 0 ? (staffStats.nhLeaveCount / staffStats.nhTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#9C3E3A] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {staffStats.nhLeaveCount > 0 && `${staffStats.nhLeaveCount}`}
                  </div>
                </div>
              </div>

              {/* Group 2 Breakdown: Home Care */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-[#142332] mb-2">
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#CF7C4E]" />
                    <span>กลุ่มที่ 2: ผู้ดูแลผู้ป่วยที่บ้าน Home Care ({staffStats.hcTotalCount} คน)</span>
                  </span>
                  <span className="text-[#1E7E52]">
                    ว่าง {staffStats.hcAvailableCount} / ทำงาน {staffStats.hcWorkingCount} / ลา {staffStats.hcLeaveCount}
                  </span>
                </div>
                <div className="h-6 w-full rounded-2xl bg-[#F4EFE5] overflow-hidden flex p-0.5">
                  <div
                    style={{ width: `${staffStats.hcTotalCount > 0 ? (staffStats.hcAvailableCount / staffStats.hcTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#1E7E52] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {staffStats.hcAvailableCount > 0 && `${staffStats.hcAvailableCount} คน`}
                  </div>
                  <div
                    style={{ width: `${staffStats.hcTotalCount > 0 ? (staffStats.hcWorkingCount / staffStats.hcTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#D9982E] text-[#5A3B0F] text-[10px] font-bold flex items-center justify-center mx-0.5"
                  >
                    {staffStats.hcWorkingCount > 0 && `${staffStats.hcWorkingCount} คน`}
                  </div>
                  <div
                    style={{ width: `${staffStats.hcTotalCount > 0 ? (staffStats.hcLeaveCount / staffStats.hcTotalCount) * 100 : 0}%` }}
                    className="h-full rounded-xl bg-[#9C3E3A] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {staffStats.hcLeaveCount > 0 && `${staffStats.hcLeaveCount}`}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Cards of Available Staff Right Now */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE5]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#1E7E52] animate-pulse" />
                <h3 className="text-base font-extrabold text-[#142332] font-heading">
                  รายชื่อพนักงานที่ว่างและพร้อมรับงานทันที ({staffStats.availableCount} คน)
                </h3>
              </div>
              <span className="text-xs text-[#5C6B64] font-semibold">
                สามารถจัดสรรงานพาพบแพทย์หรือเคสใหม่ได้ทันที
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffStats.availableStaffList.map(member => (
                <div
                  key={member.id}
                  className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] hover:border-[#1E7E52]/60 transition-all flex items-start gap-3.5"
                >
                  <img
                    src={member.avatar}
                    alt={member.thaiName}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#E5EDE8] text-[#1E7E52]">
                        {member.code}
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EAF7F0] text-[#1E7E52]">
                        🟢 ว่างพร้อมรับงาน
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-[#142332] font-heading mt-1 truncate">
                      {member.thaiName} {member.nickname && `(${member.nickname})`}
                    </h4>
                    <p className="text-[11px] text-[#5C6B64] truncate">
                      {member.subRole}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#EAE2D3] text-[11px]">
                      <span className="text-[#8F5B13] font-bold">★ {member.rating.toFixed(1)}</span>
                      <span className="text-[#5C6B64]">• ประสบการณ์ {member.experienceYears} ปี</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Matching Modal */}
      {matchingAppointment && (
        <JobMatchingModal
          appointment={matchingAppointment}
          onClose={() => setMatchingAppointment(null)}
        />
      )}

      {/* Post Visit Modal */}
      {postVisitAppointment && (
        <PostVisitModal
          appointment={postVisitAppointment}
          onClose={() => setPostVisitAppointment(null)}
        />
      )}

    </div>
  );
};
