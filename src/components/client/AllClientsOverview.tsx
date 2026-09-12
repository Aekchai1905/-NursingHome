import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, ClientServiceStatus, PatientCareType, PrecautionAlert } from '../../types';
import { ClientStatusModal } from './ClientStatusModal';
import { EditPatientModal } from '../patient/EditPatientModal';
import { AddPatientModal } from '../patient/AddPatientModal';
import { PatientHistoryModal } from '../patient/PatientHistoryModal';
import { PatientDetail } from '../patient/PatientDetail';
import { ClientScrollingShowcase } from './ClientScrollingShowcase';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  UserX, 
  Sparkles, 
  Building2, 
  Home, 
  Car, 
  AlertTriangle, 
  ShieldAlert, 
  HeartPulse, 
  Activity, 
  Pill, 
  Phone, 
  MapPin, 
  Edit3, 
  Eye, 
  HelpCircle, 
  Calendar, 
  UserCheck, 
  FileText, 
  LayoutGrid, 
  List, 
  ChevronRight, 
  ArrowRight,
  ArrowUpRight, 
  Info, 
  ShieldCheck,
  Stethoscope,
  Check,
  X,
  Layers,
  Hospital,
  Navigation
} from 'lucide-react';

export const AllClientsOverview: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId } = useApp();

  // If a patient is selected, display Level 2 Detail Screen
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  if (selectedPatient) {
    return (
      <PatientDetail
        patient={selectedPatient}
        onBack={() => setSelectedPatientId(null)}
        onBackText="← ย้อนกลับหน้ารวมลูกค้าทั้งหมด (All Clients Master)"
      />
    );
  }

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ClientServiceStatus>('all');
  const [careTypeFilter, setCareTypeFilter] = useState<'all' | PatientCareType>('all');
  const [precautionFilter, setPrecautionFilter] = useState<'all' | 'high_risk' | 'fall_risk' | 'allergy'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table' | 'scroll'>('grid');

  // Modal State
  const [statusModalPatient, setStatusModalPatient] = useState<Patient | null>(null);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter(p => (p.serviceStatus || 'active') === 'active').length;
    const discharged = patients.filter(p => p.serviceStatus === 'discharged').length;
    const suspended = patients.filter(p => p.serviceStatus === 'suspended').length;
    const inactive = patients.filter(p => p.serviceStatus === 'inactive').length;

    // Care Types / Services counts
    const nursingHome = patients.filter(p => p.careType === 'nursing_home').length;
    const escort = patients.filter(p => p.careType === 'medical_escort').length;
    const homeCare = patients.filter(p => p.careType === 'home_care').length;

    // Active counts per service
    const nursingHomeActive = patients.filter(p => p.careType === 'nursing_home' && (p.serviceStatus || 'active') === 'active').length;
    const escortActive = patients.filter(p => p.careType === 'medical_escort' && (p.serviceStatus || 'active') === 'active').length;
    const homeCareActive = patients.filter(p => p.careType === 'home_care' && (p.serviceStatus || 'active') === 'active').length;

    const highRisk = patients.filter(p => 
      (p.carePlan?.precautions || []).some(pr => pr.severity === 'high') ||
      p.healthStatus === 'attention' ||
      (p.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 7
    ).length;

    const fallRiskCount = patients.filter(p => 
      (p.carePlan?.precautions || []).some(pr => pr.type === 'fall_risk') || 
      (p.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 6
    ).length;

    const allergyCount = patients.filter(p => 
      p.drugAllergies.length > 0 || p.foodAllergies.length > 0
    ).length;

    return {
      total,
      active,
      discharged,
      suspended,
      inactive,
      nursingHome,
      nursingHomeActive,
      escort,
      escortActive,
      homeCare,
      homeCareActive,
      highRisk,
      fallRiskCount,
      allergyCount
    };
  }, [patients]);

  // Filtered Clients List
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      const currentStatus = patient.serviceStatus || 'active';

      // Status Filter
      if (statusFilter !== 'all' && currentStatus !== statusFilter) {
        return false;
      }

      // Care Type (Our Services) Filter
      if (careTypeFilter !== 'all' && patient.careType !== careTypeFilter) {
        return false;
      }

      // Precaution Filter
      if (precautionFilter === 'high_risk') {
        const hasHigh = (patient.carePlan?.precautions || []).some(pr => pr.severity === 'high') || patient.healthStatus === 'attention';
        if (!hasHigh) return false;
      } else if (precautionFilter === 'fall_risk') {
        const hasFall = (patient.carePlan?.precautions || []).some(pr => pr.type === 'fall_risk') || (patient.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 6;
        if (!hasFall) return false;
      } else if (precautionFilter === 'allergy') {
        const hasAllergy = patient.drugAllergies.length > 0 || patient.foodAllergies.length > 0;
        if (!hasAllergy) return false;
      }

      // Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchName = patient.thaiName.toLowerCase().includes(q) || patient.name.toLowerCase().includes(q);
        const matchHN = patient.hn.toLowerCase().includes(q);
        const matchCaregiver = (patient.primaryCaregiverName || '').toLowerCase().includes(q);
        const matchDiseases = patient.chronicDiseases.some(d => d.toLowerCase().includes(q));
        const matchReason = (patient.inactiveReason || '').toLowerCase().includes(q);
        const matchDoctor = patient.primaryDoctorName.toLowerCase().includes(q);
        const matchHospital = (patient.primaryHospital || '').toLowerCase().includes(q);
        const matchRoom = (patient.roomBed || '').toLowerCase().includes(q);
        const matchAddress = (patient.address || '').toLowerCase().includes(q);

        if (!matchName && !matchHN && !matchCaregiver && !matchDiseases && !matchReason && !matchDoctor && !matchHospital && !matchRoom && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [patients, statusFilter, careTypeFilter, precautionFilter, searchTerm]);

  // Service details mapping for display
  const servicesConfig = [
    {
      id: 'all' as const,
      label: 'ทุกบริการของเรา',
      shortLabel: 'ทุกบริการ',
      englishLabel: 'All Services',
      desc: 'แสดงภาพรวมรายชื่อลูกค้าทั้งหมดในทุกรูปแบบบริการ',
      icon: Layers,
      count: stats.total,
      activeCount: stats.active,
      activeBg: 'bg-[#23382E]',
      activeText: 'text-white',
      badgeBg: 'bg-[#FAF6F0] text-[#1A2E25] border-[#EAE2D3]',
      highlightColor: '#23382E'
    },
    {
      id: 'nursing_home' as const,
      label: '1. ศูนย์ดูแลผู้สูงอายุ Nursing Home',
      shortLabel: 'ศูนย์ Nursing Home',
      englishLabel: 'Nursing Home Care',
      desc: 'บริบาลประจำศูนย์ 24 ชั่วโมง • พักฟื้น • กิจวัตร & กายภาพ',
      icon: Building2,
      count: stats.nursingHome,
      activeCount: stats.nursingHomeActive,
      activeBg: 'bg-[#1E7E52]',
      activeText: 'text-white',
      badgeBg: 'bg-[#EAF7F0] text-[#1E7E52] border-[#BEE7D0]',
      highlightColor: '#1E7E52'
    },
    {
      id: 'medical_escort' as const,
      label: '2. บริการพาผู้ป่วยไปพบแพทย์',
      shortLabel: 'นัดพบแพทย์ (Escort)',
      englishLabel: 'Medical Escort Service',
      desc: 'บริการรับ-ส่ง รพ. • สรุปประวัติก่อนพบแพทย์ • ติดตามผลตรวจ',
      icon: Car,
      count: stats.escort,
      activeCount: stats.escortActive,
      activeBg: 'bg-[#2B5975]',
      activeText: 'text-white',
      badgeBg: 'bg-[#EEF5F9] text-[#2B5975] border-[#C6DEED]',
      highlightColor: '#2B5975'
    },
    {
      id: 'home_care' as const,
      label: '3. บริการผู้ดูแลผู้ป่วยที่บ้าน',
      shortLabel: 'ผู้ดูแลที่บ้าน (Home Care)',
      englishLabel: 'Home Caregiver Service',
      desc: 'ผู้บริบาลดูแลถึงบ้าน • เช็กอินพิกัด GPS • ส่งรายงานประจำวัน',
      icon: Home,
      count: stats.homeCare,
      activeCount: stats.homeCareActive,
      activeBg: 'bg-[#CF7C4E]',
      activeText: 'text-white',
      badgeBg: 'bg-[#FAF0E6] text-[#9E4E28] border-[#F0BFA6]',
      highlightColor: '#CF7C4E'
    }
  ];

  // Helper for Care Type Badges
  const renderCareTypeBadge = (careType: PatientCareType, isInteractive = true) => {
    switch (careType) {
      case 'nursing_home':
        return (
          <span 
            onClick={e => {
              if (isInteractive) {
                e.stopPropagation();
                setCareTypeFilter(careTypeFilter === 'nursing_home' ? 'all' : 'nursing_home');
              }
            }}
            title={isInteractive ? 'คลิกเพื่อกรองเฉพาะบริการ Nursing Home' : undefined}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0] shadow-2xs ${
              isInteractive ? 'cursor-pointer hover:bg-[#D4EFE0] transition-colors' : ''
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#1E7E52]" />
            <span>Nursing Home</span>
          </span>
        );
      case 'medical_escort':
        return (
          <span 
            onClick={e => {
              if (isInteractive) {
                e.stopPropagation();
                setCareTypeFilter(careTypeFilter === 'medical_escort' ? 'all' : 'medical_escort');
              }
            }}
            title={isInteractive ? 'คลิกเพื่อกรองเฉพาะบริการนัดพบแพทย์ (Escort)' : undefined}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#EEF5F9] text-[#2B5975] border border-[#C6DEED] shadow-2xs ${
              isInteractive ? 'cursor-pointer hover:bg-[#DCEBF5] transition-colors' : ''
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#2B5975]" />
            <span>นัดพบแพทย์ Escort</span>
          </span>
        );
      case 'home_care':
        return (
          <span 
            onClick={e => {
              if (isInteractive) {
                e.stopPropagation();
                setCareTypeFilter(careTypeFilter === 'home_care' ? 'all' : 'home_care');
              }
            }}
            title={isInteractive ? 'คลิกเพื่อกรองเฉพาะบริการดูแลที่บ้าน (Home Care)' : undefined}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] shadow-2xs ${
              isInteractive ? 'cursor-pointer hover:bg-[#FCEEE7] transition-colors' : ''
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#CF7C4E]" />
            <span>ดูแลที่บ้าน Home Care</span>
          </span>
        );
    }
  };

  // Helper for Service Status Badges
  const renderStatusBadge = (status: ClientServiceStatus = 'active') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1E7E52] text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#A3E7C1] animate-pulse"></span>
            <span>🟢 กำลังใช้บริการ</span>
          </span>
        );
      case 'discharged':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#2B5975] text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>🔵 จำหน่ายกลับบ้านแล้ว</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#B87A1E] text-white shadow-xs">
            <Clock className="w-3.5 h-3.5 text-amber-200" />
            <span>🟡 พักบริการชั่วคราว</span>
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#9C3E3A] text-white shadow-xs">
            <UserX className="w-3.5 h-3.5 text-rose-200" />
            <span>🔴 สิ้นสุดบริการ</span>
          </span>
        );
    }
  };

  const getActiveServiceName = () => {
    switch (careTypeFilter) {
      case 'nursing_home': return 'ศูนย์ดูแลผู้สูงอายุ Nursing Home';
      case 'medical_escort': return 'บริการพาผู้ป่วยไปพบแพทย์ (Medical Escort)';
      case 'home_care': return 'บริการผู้ดูแลผู้ป่วยที่บ้าน (Home Care)';
      default: return 'ทุกบริการ';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner - Inspired by Light & Warm Elegant Aesthetic */}
      <div className="rounded-3xl bg-white text-[#1A2E25] p-6 sm:p-8 shadow-sm relative overflow-hidden border border-[#EAE2D3]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CF7C4E]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#4D7D67]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] text-xs font-extrabold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>1. สรุปรายชื่อผู้ป่วยทั้งหมด (All Patients Master Hub)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#142332] font-heading">
              สรุปรายชื่อผู้ป่วยทั้งหมด (All Patients Directory)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6B64] max-w-2xl leading-relaxed font-medium">
              ศูนย์รวมข้อมูลผู้ป่วยและลูกค้าครบวงจร: เลือกกรองตาม <b>บริการของเรา (3 กลุ่ม)</b>, ตรวจสอบผู้ดูแลที่รับผิดชอบ, 
              ข้อควรระวัง/ความเสี่ยง, โรคประจำตัว, ประวัติการรักษา และสถานะการใช้บริการ พร้อมปรับปรุงข้อมูลได้แบบเรียลไทม์
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddPatientModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#CF7C4E] hover:bg-[#BE673B] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>+ ลงทะเบียนลูกค้าใหม่</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-[#F4EFE5]">
          
          <div 
            onClick={() => { setCareTypeFilter('all'); setStatusFilter('all'); }}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              careTypeFilter === 'all' && statusFilter === 'all'
                ? 'bg-white border-[#23382E] shadow-sm ring-2 ring-[#23382E]/20'
                : 'bg-[#FAF6F0] border-[#EAE2D3] hover:bg-white shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#5C6B64] font-bold block">👥 ลูกค้าทั้งหมด</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#142332] font-heading">{stats.total}</span>
              <span className="text-xs font-semibold text-[#7D8C85]">ราย</span>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('active')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-[#EAF7F0] border-[#1E7E52] shadow-sm ring-2 ring-[#1E7E52]/20'
                : 'bg-[#EAF7F0]/60 border-[#BEE7D0] hover:bg-[#EAF7F0] shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#1E7E52] font-bold block">🟢 กำลังใช้บริการ</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#1E7E52] font-heading">{stats.active}</span>
              <span className="text-xs font-semibold text-[#1E7E52]/80">ราย</span>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('discharged')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'discharged'
                ? 'bg-[#EEF5F9] border-[#2B5975] shadow-sm ring-2 ring-[#2B5975]/20'
                : 'bg-[#EEF5F9]/60 border-[#C6DEED] hover:bg-[#EEF5F9] shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#2B5975] font-bold block">🔵 จำหน่ายกลับบ้านแล้ว</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#2B5975] font-heading">{stats.discharged}</span>
              <span className="text-xs font-semibold text-[#2B5975]/80">ราย</span>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('suspended')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'suspended'
                ? 'bg-[#FDF6E8] border-[#8F5B13] shadow-sm ring-2 ring-[#8F5B13]/20'
                : 'bg-[#FDF6E8]/60 border-[#F6DC9F] hover:bg-[#FDF6E8] shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#8F5B13] font-bold block">🟡 พักบริการชั่วคราว</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#8F5B13] font-heading">{stats.suspended}</span>
              <span className="text-xs font-semibold text-[#8F5B13]/80">ราย</span>
            </div>
          </div>

          <div 
            onClick={() => setStatusFilter('inactive')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-[#FDF0EF] border-[#9C3E3A] shadow-sm ring-2 ring-[#9C3E3A]/20'
                : 'bg-[#FDF0EF]/60 border-[#F7BDB9] hover:bg-[#FDF0EF] shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#9C3E3A] font-bold block">🔴 สิ้นสุดการให้บริการ</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#9C3E3A] font-heading">{stats.inactive}</span>
              <span className="text-xs font-semibold text-[#9C3E3A]/80">ราย</span>
            </div>
          </div>

          <div 
            onClick={() => setPrecautionFilter('high_risk')}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer col-span-2 sm:col-span-4 lg:col-span-1 ${
              precautionFilter === 'high_risk'
                ? 'bg-[#FDF0EF] border-[#9C3E3A] shadow-sm ring-2 ring-[#9C3E3A]/20'
                : 'bg-[#FAF6F0] border-[#EAE2D3] hover:bg-[#FDF0EF]/40 shadow-2xs'
            }`}
          >
            <span className="text-[11px] text-[#9C3E3A] font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-[#9C3E3A]" />
              <span>เฝ้าระวังพิเศษ</span>
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#9C3E3A] font-heading">{stats.highRisk}</span>
              <span className="text-xs font-semibold text-[#9C3E3A]/80">ราย</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* OUR SERVICES FILTER PANEL (ตัวกรองบริการของเรา) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE2D3] shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE5] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#9E4E28] flex items-center justify-center font-bold shadow-2xs border border-[#F0BFA6]">
              <Filter className="w-4 h-4 text-[#CF7C4E]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-[#142332] font-heading flex items-center gap-2">
                <span>ตัวกรองบริการของเรา (Our Care Services Filter)</span>
                {careTypeFilter !== 'all' && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] font-bold">
                    กำลังเลือก: {getActiveServiceName()}
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#7D8C85]">
                คลิกเลือกบริการที่ต้องการ เพื่อกรองรายชื่อลูกค้าและแสดงรายละเอียดเฉพาะบริการนั้น
              </p>
            </div>
          </div>

          {careTypeFilter !== 'all' && (
            <button
              onClick={() => setCareTypeFilter('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF6F0] hover:bg-[#EAE2D3] text-[#1A2E25] text-xs font-bold transition-all border border-[#EAE2D3] shadow-2xs cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5 text-[#5C6B64]" />
              <span>แสดงทุกบริการ</span>
            </button>
          )}
        </div>

        {/* 4 Interactive Service Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {servicesConfig.map(svc => {
            const Icon = svc.icon;
            const isSelected = careTypeFilter === svc.id;

            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setCareTypeFilter(svc.id)}
                className={`relative group flex flex-col justify-between p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? `${svc.activeBg} text-white border-transparent shadow-md ring-2 ring-[#CF7C4E]/40 scale-[1.02]`
                    : 'bg-[#FAF6F0] hover:bg-[#F4EFE5] text-[#1A2E25] border-[#EAE2D3] hover:border-[#CF7C4E]/50 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Active Indicator Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-white/15 text-white shadow-inner'
                        : 'bg-white text-[#23382E] border border-[#EAE2D3] group-hover:border-[#CF7C4E]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1 pr-4">
                      <h3 className={`text-xs sm:text-sm font-extrabold leading-tight font-heading truncate ${
                        isSelected ? 'text-white' : 'text-[#142332]'
                      }`}>
                        {svc.shortLabel}
                      </h3>
                      <span className={`text-[10px] block font-medium truncate ${
                        isSelected ? 'text-white/80' : 'text-[#7D8C85]'
                      }`}>
                        {svc.englishLabel}
                      </span>
                    </div>
                  </div>

                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                    isSelected ? 'text-white/90' : 'text-[#5C6B64]'
                  }`}>
                    {svc.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-xs">
                  <span className={`text-[11px] font-bold ${
                    isSelected ? 'text-white/80' : 'text-[#7D8C85]'
                  }`}>
                    {svc.id === 'all' ? 'ผู้ป่วยรวม:' : 'ลูกค้าในบริการ:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-base font-black font-heading ${
                      isSelected ? 'text-white' : 'text-[#142332]'
                    }`}>
                      {svc.count}
                    </span>
                    <span className={`text-[11px] font-semibold ${
                      isSelected ? 'text-white/80' : 'text-[#5C6B64]'
                    }`}>
                      ราย
                    </span>
                    {svc.id !== 'all' && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#EAF7F0] text-[#1E7E52]'
                      }`}>
                        ใช้จริง {svc.activeCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECONDARY FILTER & SEARCH TOOLBAR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-[#EAE2D3] shadow-sm space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D8C85]" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อลูกค้า, รหัส HN, ชื่อผู้ดูแล, โรงพยาบาล, โรคประจำตัว หรือสาเหตุ..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E4D9C8] bg-[#FAF6F0] text-xs text-[#1A2E25] placeholder-[#7D8C85] focus:outline-none focus:ring-2 focus:ring-[#23382E] focus:bg-white transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7D8C85] hover:text-[#1A2E25] font-bold cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Mode Switch */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-2xl bg-[#F4EFE5] border border-[#EAE2D3] flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setViewMode('scroll')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'scroll'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
                title="แอนิเมชันเลื่อนขึ้นแถวเดี่ยวแบบ 21st.dev (1-Row Continuous Marquee)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CF7C4E]" />
                <span>🎬 เลื่อนขึ้นอัตโนมัติ (1 แถว)</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>การ์ดรายคน</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>ตารางภาพรวม</span>
              </button>
            </div>
          </div>

        </div>

        {/* Filter Chips Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F4EFE5]">
          
          {/* Status Filters */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5C6B64] mr-1">
            <Filter className="w-3 h-3" />
            <span>สถานะลูกค้า:</span>
          </div>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#23382E] text-white shadow-xs'
                : 'bg-[#F4EFE5] text-[#3D4C44] hover:bg-[#EAE2D3] border border-[#EAE2D3]'
            }`}
          >
            ทั้งหมด ({stats.total})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-[#1E7E52] text-white shadow-xs'
                : 'bg-[#EAF7F0] text-[#1E7E52] hover:bg-[#D4EFE0] border border-[#BEE7D0]'
            }`}
          >
            🟢 ใช้บริการ ({stats.active})
          </button>

          <button
            onClick={() => setStatusFilter('discharged')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'discharged'
                ? 'bg-[#2B5975] text-white shadow-xs'
                : 'bg-[#EEF5F9] text-[#2B5975] hover:bg-[#DCEBF5] border border-[#C6DEED]'
            }`}
          >
            🔵 จำหน่ายแล้ว ({stats.discharged})
          </button>

          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'suspended'
                ? 'bg-[#B87A1E] text-white shadow-xs'
                : 'bg-[#FDF6E8] text-[#8F5B13] hover:bg-[#FBEDD1] border border-[#F6DC9F]'
            }`}
          >
            🟡 พักบริการ ({stats.suspended})
          </button>

          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'inactive'
                ? 'bg-[#9C3E3A] text-white shadow-xs'
                : 'bg-[#FDF0EF] text-[#9C3E3A] hover:bg-[#FCE0DF] border border-[#F7BDB9]'
            }`}
          >
            🔴 สิ้นสุดบริการ ({stats.inactive})
          </button>

          <span className="text-[#DCD0BD] mx-1">|</span>

          {/* Precautions Filters */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#5C6B64] mr-1">
            <ShieldAlert className="w-3 h-3" />
            <span>ข้อควรระวัง:</span>
          </div>

          <button
            onClick={() => setPrecautionFilter(precautionFilter === 'fall_risk' ? 'all' : 'fall_risk')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              precautionFilter === 'fall_risk'
                ? 'bg-[#9C3E3A] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#8F5B13] hover:bg-[#FDF6E8] border border-[#F6DC9F]'
            }`}
          >
            ⚠️ เสี่ยงหกล้ม ({stats.fallRiskCount})
          </button>

          <button
            onClick={() => setPrecautionFilter(precautionFilter === 'allergy' ? 'all' : 'allergy')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              precautionFilter === 'allergy'
                ? 'bg-[#9C3E3A] text-white shadow-xs'
                : 'bg-[#FAF6F0] text-[#8F5B13] hover:bg-[#FDF6E8] border border-[#F6DC9F]'
            }`}
          >
            💊 มีประวัติแพ้ ({stats.allergyCount})
          </button>

          {(statusFilter !== 'all' || precautionFilter !== 'all' || careTypeFilter !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setCareTypeFilter('all');
                setPrecautionFilter('all');
                setSearchTerm('');
              }}
              className="ml-auto text-[11px] font-extrabold text-[#CF7C4E] hover:underline cursor-pointer flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              <span>ล้างตัวกรองทั้งหมด</span>
            </button>
          )}

        </div>

      </div>

      {/* Active Filter Result Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-[#5C6B64] font-semibold">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            แสดงผลลัพธ์: <strong className="text-[#142332] font-extrabold text-sm">{filteredPatients.length}</strong> รายการ
          </span>
          {careTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] font-bold text-[11px]">
              บริการ: {getActiveServiceName()}
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FAF6F0] text-[#1A2E25] border border-[#EAE2D3] font-bold text-[11px]">
              สถานะ: {statusFilter}
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#FAF6F0] text-[#1A2E25] border border-[#EAE2D3] font-bold text-[11px]">
              ค้นหา: "{searchTerm}"
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#7D8C85]">
          💡 สามารถกดปุ่ม "⚡ เปลี่ยนสถานะ" หรือ "✏️ แก้ไขข้อมูล" เพื่อปรับปรุงข้อมูลได้ทันที
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1-ROW CONTINUOUS SCROLLING SHOWCASE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'scroll' && (
        <ClientScrollingShowcase
          patients={filteredPatients}
          onSelectPatient={setSelectedPatientId}
          onOpenStatusModal={setStatusModalPatient}
          onOpenHistoryModal={setHistoryPatient}
        />
      )}

      {/* ========================================================================= */}
      {/* CARD GRID VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map(patient => {
            const currentStatus = patient.serviceStatus || 'active';
            const precautions = patient.carePlan?.precautions || [];
            const fallRisk = precautions.find(p => p.type === 'fall_risk') || (patient.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 6;
            const allergies = [...patient.drugAllergies, ...patient.foodAllergies];

            return (
              <div
                key={patient.id}
                className="bg-white rounded-3xl border border-[#EAE2D3] hover:border-[#CF7C4E]/60 shadow-sm hover:shadow-soft-lg transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top Banner */}
                <div>
                  
                  {/* Top Status & Care Service Bar */}
                  <div className="p-4 bg-[#FAF6F0] border-b border-[#EAE2D3] flex items-center justify-between gap-2">
                    <div>
                      {renderCareTypeBadge(patient.careType)}
                    </div>
                    <div>
                      {renderStatusBadge(currentStatus)}
                    </div>
                  </div>

                  {/* Client Info Header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start gap-4">
                      
                      <div 
                        onClick={() => setSelectedPatientId(patient.id)}
                        className="relative shrink-0 cursor-pointer group/avatar"
                        title="คลิกเพื่อดูรายละเอียดลูกค้า"
                      >
                        <img
                          src={patient.avatar}
                          alt={patient.thaiName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover/avatar:scale-105 group-hover/avatar:ring-2 group-hover/avatar:ring-[#CF7C4E]/50 transition-all"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                          currentStatus === 'active' ? 'bg-[#1E7E52]' :
                          currentStatus === 'discharged' ? 'bg-[#2B5975]' :
                          currentStatus === 'suspended' ? 'bg-[#B87A1E]' : 'bg-[#9C3E3A]'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedPatientId(patient.id)}
                            className="text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-lg bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] hover:bg-[#FCEEE7] transition-colors cursor-pointer"
                            title="คลิกเพื่อดูรายละเอียดลูกค้า"
                          >
                            {patient.hn}
                          </button>
                          <span className="text-xs font-semibold text-[#5C6B64]">
                            {patient.gender === 'female' ? 'หญิง' : 'ชาย'}, อายุ {patient.age} ปี
                          </span>
                        </div>

                        <h3 
                          onClick={() => setSelectedPatientId(patient.id)}
                          className="text-base font-extrabold text-[#1A2E25] font-heading mt-1 truncate hover:text-[#CF7C4E] hover:underline cursor-pointer flex items-center gap-1.5 transition-colors group/link"
                          title="คลิกเพื่อดูรายละเอียดของลูกค้าคนนี้"
                        >
                          <span className="truncate">{patient.thaiName}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all text-[#CF7C4E] shrink-0" />
                        </h3>
                        <p 
                          onClick={() => setSelectedPatientId(patient.id)}
                          className="text-xs text-[#7D8C85] truncate hover:text-[#1A2E25] cursor-pointer font-medium"
                          title="คลิกเพื่อดูรายละเอียดลูกค้า"
                        >
                          {patient.name}
                        </p>

                        {/* Location / Room by Care Type */}
                        <div className="flex items-center gap-1.5 text-[11px] text-[#5C6B64] mt-1">
                          {patient.careType === 'nursing_home' && <Building2 className="w-3.5 h-3.5 text-[#1E7E52] shrink-0" />}
                          {patient.careType === 'medical_escort' && <Hospital className="w-3.5 h-3.5 text-[#2B5975] shrink-0" />}
                          {patient.careType === 'home_care' && <Navigation className="w-3.5 h-3.5 text-[#CF7C4E] shrink-0" />}
                          <span className="truncate font-medium">{patient.roomBed || patient.address || 'ที่พักผู้ป่วย'}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Non-Service Reason Box (If Discharged / Suspended / Inactive) */}
                  {currentStatus !== 'active' && (
                    <div className="mx-5 mb-3 p-3 rounded-2xl bg-[#FDF6E8] border border-[#F6DC9F]">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-[#8F5B13] shrink-0 mt-0.5" />
                        <div className="text-xs space-y-0.5">
                          <span className="font-bold text-[#5A3B0F] block">
                            สาเหตุที่ไม่ใช้บริการ:
                          </span>
                          <p className="text-[#8F5B13] leading-snug font-medium">
                            {patient.inactiveReason || 'ไม่ได้ระบุสาเหตุ'}
                          </p>
                          {patient.inactiveDate && (
                            <span className="text-[10px] text-[#B87A1E] block mt-1">
                              📅 วันที่จำหน่าย/หยุดบริการ: {patient.inactiveDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Details Section */}
                  <div className="px-5 space-y-3.5 text-xs">
                    
                    {/* 1. Who Cares For Them (ผู้ดูแลหลัก) */}
                    <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#E5EDE8] text-[#23382E] flex items-center justify-center font-bold text-xs shadow-2xs border border-[#C8DBD0]">
                          <UserCheck className="w-4 h-4 text-[#23382E]" />
                        </div>
                        <div>
                          <span className="text-[10px] text-[#5C6B64] font-bold block uppercase tracking-wider">
                            ผู้ดูแลรับผิดชอบเคส:
                          </span>
                          <span className="text-xs font-extrabold text-[#1A2E25]">
                            {patient.primaryCaregiverName || 'ทีมบริบาลประจำศูนย์'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setEditPatient(patient)}
                        className="text-[11px] font-bold text-[#23382E] hover:text-[#CF7C4E] hover:underline px-2.5 py-1 rounded-xl bg-white border border-[#E2D6C4] shadow-2xs cursor-pointer"
                      >
                        เปลี่ยนผู้ดูแล
                      </button>
                    </div>

                    {/* 2. Chronic Diseases (โรคประจำตัว) */}
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#1A2E25] mb-1.5">
                        <HeartPulse className="w-3.5 h-3.5 text-[#CF7C4E]" />
                        <span>โรคประจำตัว / ภาวะสุขภาพ:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {patient.chronicDiseases.length > 0 ? (
                          patient.chronicDiseases.map((disease, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-[#FAF4ED] text-[#873E1E] font-semibold border border-[#F0BFA6]"
                            >
                              {disease}
                            </span>
                          ))
                        ) : (
                          <span className="text-[#7D8C85] text-[11px] italic">ไม่มีโรคประจำตัวร้ายแรง</span>
                        )}
                      </div>
                    </div>

                    {/* 3. Precautions & Alerts (ข้อควรระวัง) */}
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-[#1A2E25] mb-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-[#B87A1E]" />
                        <span>ข้อควรระวัง & ความเสี่ยง:</span>
                      </div>
                      <div className="space-y-1.5">
                        
                        {/* Fall Risk Badge */}
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                            (patient.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 7
                              ? 'bg-[#FDF0EF] text-[#9C3E3A] border border-[#F7BDB9]'
                              : (patient.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 5
                              ? 'bg-[#FDF6E8] text-[#8F5B13] border border-[#F6DC9F]'
                              : 'bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0]'
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>ความเสี่ยงหกล้ม: {patient.carePlan?.riskAssessment?.fallRiskScore ?? 5}/10</span>
                          </span>

                          <span className="text-[10px] text-[#5C6B64] font-medium">
                            ({patient.carePlan?.riskAssessment?.bedriddenScale === 'bedridden' ? 'ผู้ป่วยติดเตียง' : patient.carePlan?.riskAssessment?.bedriddenScale === 'wheelchair' ? 'นั่งรถเข็น' : 'เดินได้ปกติ'})
                          </span>
                        </div>

                        {/* Allergy Warnings */}
                        {allergies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {allergies.map((alg, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-[#FDF6E8] text-[#8F5B13] font-bold border border-[#F6DC9F] flex items-center gap-1"
                              >
                                <Pill className="w-2.5 h-2.5 text-[#B87A1E]" />
                                <span>แพ้: {alg}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Doctor & Hospital */}
                        <div className="text-[11px] text-[#5C6B64] flex items-center gap-1 pt-1">
                          <Stethoscope className="w-3 h-3 text-[#23382E] shrink-0" />
                          <span className="truncate">แพทย์: {patient.primaryDoctorName} ({patient.primaryHospital})</span>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-4 mt-4 bg-[#FAF6F0] border-t border-[#EAE2D3] flex items-center justify-between gap-2">
                  
                  {/* Quick Change Status */}
                  <button
                    onClick={() => setStatusModalPatient(patient)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-[#E2D6C4] text-[#1A2E25] text-xs font-bold hover:bg-[#F4EFE5] transition-all shadow-2xs cursor-pointer"
                  >
                    <span>⚡ เปลี่ยนสถานะ</span>
                  </button>

                  {/* Full Edit */}
                  <button
                    onClick={() => setEditPatient(patient)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl bg-[#23382E] text-white text-xs font-bold hover:bg-[#1A2E25] transition-all shadow-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>แก้ไขข้อมูล</span>
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => setSelectedPatientId(patient.id)}
                    title="เปิดดูรายละเอียดลูกค้า (สัญญาณชีพ, Care Plan, บันทึกการดูแล)"
                    className="px-3.5 py-2 rounded-2xl bg-[#F4EFE5] border border-[#E2D6C4] text-[#23382E] hover:bg-[#CF7C4E] hover:text-white hover:border-[#CF7C4E] transition-all shadow-2xs cursor-pointer flex items-center gap-1 font-bold text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>รายละเอียด</span>
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TABLE VIEW */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-[#EAE2D3] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4EFE5] border-b border-[#EAE2D3] text-[#1A2E25] font-extrabold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">ลูกค้า / HN</th>
                  <th className="py-3.5 px-3">บริการของเรา</th>
                  <th className="py-3.5 px-3">ผู้ดูแลรับผิดชอบ</th>
                  <th className="py-3.5 px-3">โรคประจำตัว</th>
                  <th className="py-3.5 px-3">ข้อควรระวัง & ความเสี่ยง</th>
                  <th className="py-3.5 px-3">สถานะ & สาเหตุที่ไม่ใช้บริการ</th>
                  <th className="py-3.5 px-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE5] text-[#1A2E25]">
                {filteredPatients.map(patient => {
                  const currentStatus = patient.serviceStatus || 'active';
                  const precautions = patient.carePlan?.precautions || [];
                  const allergies = [...patient.drugAllergies, ...patient.foodAllergies];

                  return (
                    <tr key={patient.id} className="hover:bg-[#FAF6F0] transition-all">
                      
                      {/* 1. Client Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={patient.avatar}
                            alt={patient.thaiName}
                            onClick={() => setSelectedPatientId(patient.id)}
                            className="w-11 h-11 rounded-xl object-cover border border-white shadow-xs cursor-pointer hover:scale-105 transition-all"
                            title="คลิกเพื่อดูรายละเอียดลูกค้า"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedPatientId(patient.id)}
                                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] hover:bg-[#FCEEE7] cursor-pointer"
                                title="คลิกเพื่อดูรายละเอียดลูกค้า"
                              >
                                {patient.hn}
                              </button>
                              <span className="text-[11px] text-[#5C6B64] font-medium">
                                อายุ {patient.age} ปี
                              </span>
                            </div>
                            <div 
                              onClick={() => setSelectedPatientId(patient.id)}
                              className="font-extrabold text-[#1A2E25] text-xs mt-0.5 hover:text-[#CF7C4E] hover:underline cursor-pointer flex items-center gap-1 group/name font-heading"
                              title="คลิกเพื่อดูรายละเอียดลูกค้า"
                            >
                              <span>{patient.thaiName}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover/name:opacity-100 transition-opacity text-[#CF7C4E]" />
                            </div>
                            <div className="text-[10px] text-[#7D8C85]">
                              {patient.roomBed || patient.address || '-'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Care Group / Service */}
                      <td className="py-3.5 px-3">
                        {renderCareTypeBadge(patient.careType)}
                      </td>

                      {/* 3. Who Cares For Them */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-[#1A2E25] text-xs">
                          {patient.primaryCaregiverName || 'ทีมบริบาลประจำศูนย์'}
                        </div>
                        <div className="text-[10px] text-[#5C6B64] flex items-center gap-1 mt-0.5">
                          <span>แพทย์: {patient.primaryDoctorName}</span>
                        </div>
                      </td>

                      {/* 4. Chronic Diseases */}
                      <td className="py-3.5 px-3 max-w-[200px]">
                        <div className="flex flex-wrap gap-1">
                          {patient.chronicDiseases.map((d, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF4ED] text-[#873E1E] font-semibold border border-[#F0BFA6]"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 5. Precautions */}
                      <td className="py-3.5 px-3 max-w-[220px]">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold ${
                            (patient.carePlan?.riskAssessment?.fallRiskScore ?? 0) >= 7
                              ? 'bg-[#FDF0EF] text-[#9C3E3A]'
                              : 'bg-[#FDF6E8] text-[#8F5B13]'
                          }`}>
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>เสี่ยงหกล้ม {patient.carePlan?.riskAssessment?.fallRiskScore ?? 5}/10</span>
                          </span>

                          {allergies.length > 0 && (
                            <div className="text-[10px] text-[#8F5B13] font-medium">
                              แพ้: {allergies.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 6. Status & Reason */}
                      <td className="py-3.5 px-3 max-w-[240px]">
                        <div className="space-y-1">
                          <div>
                            {renderStatusBadge(currentStatus)}
                          </div>
                          {currentStatus !== 'active' && (
                            <div className="p-2 rounded-xl bg-[#FDF6E8] text-[#5A3B0F] text-[11px] border border-[#F6DC9F] leading-tight">
                              <span className="font-bold text-[#8F5B13]">สาเหตุ: </span>
                              {patient.inactiveReason || 'ไม่ได้ระบุ'}
                              {patient.inactiveDate && (
                                <span className="block text-[10px] text-[#B87A1E] mt-0.5">
                                  ({patient.inactiveDate})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 7. Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setStatusModalPatient(patient)}
                            title="เปลี่ยนสถานะการใช้บริการ"
                            className="p-1.5 rounded-xl bg-white border border-[#E2D6C4] text-[#23382E] hover:bg-[#F4EFE5] shadow-2xs font-bold text-[11px] cursor-pointer"
                          >
                            ⚡ สถานะ
                          </button>
                          <button
                            onClick={() => setEditPatient(patient)}
                            title="แก้ไขข้อมูลผู้ป่วย"
                            className="p-1.5 rounded-xl bg-[#23382E] text-white hover:bg-[#1A2E25] shadow-xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedPatientId(patient.id)}
                            title="เปิดดูรายละเอียดลูกค้าแบบเจาะลึก"
                            className="px-2.5 py-1.5 rounded-xl bg-[#F4EFE5] border border-[#E2D6C4] text-[#23382E] hover:bg-[#CF7C4E] hover:text-white hover:border-[#CF7C4E] font-bold text-xs inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>เปิดดู</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Results Fallback */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE2D3] p-8">
          <Users className="w-12 h-12 text-[#7D8C85] mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#1A2E25]">ไม่พบข้อมูลลูกค้าตามเงื่อนไขบริการหรือคำค้นหา</h3>
          <p className="text-xs text-[#7D8C85] mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกบริการอื่นเพื่อค้นหาใหม่</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCareTypeFilter('all');
              setPrecautionFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#23382E] text-white text-xs font-bold hover:bg-[#1A2E25] transition-all shadow-xs cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP MODALS */}
      {/* ========================================================================= */}
      
      {/* 1. Quick Status Modal */}
      {statusModalPatient && (
        <ClientStatusModal
          patient={statusModalPatient}
          onClose={() => setStatusModalPatient(null)}
        />
      )}

      {/* 2. Full Edit Patient Modal */}
      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
        />
      )}

      {/* 3. Patient History Modal */}
      {historyPatient && (
        <PatientHistoryModal
          patient={historyPatient}
          onClose={() => setHistoryPatient(null)}
        />
      )}

      {/* 4. Add Patient Modal */}
      {showAddPatientModal && (
        <AddPatientModal
          onClose={() => setShowAddPatientModal(false)}
        />
      )}

    </div>
  );
};
