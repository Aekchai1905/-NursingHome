import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, HealthStatus } from '../../types';
import { StatusBadge, PrecautionBadge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { PatientDetail } from './PatientDetail';
import { DailyLogModal } from './DailyLogModal';
import { AddPatientModal } from './AddPatientModal';
import { EditPatientModal } from './EditPatientModal';
import { DoctorVisitModal } from './DoctorVisitModal';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserPlus,
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HeartPulse, 
  ArrowRight, 
  Activity, 
  LayoutGrid, 
  List, 
  Building2, 
  Home, 
  Car, 
  Stethoscope, 
  Sparkles, 
  ChevronRight, 
  ShieldAlert, 
  MapPin, 
  Calendar,
  Edit3
} from 'lucide-react';

export const PatientList: React.FC = () => {
  const { patients, selectedPatientId, setSelectedPatientId } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [careTypeFilter, setCareTypeFilter] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'grid' | 'table'>('grid');
  const [quickLogPatient, setQuickLogPatient] = useState<Patient | null>(null);
  const [doctorVisitPatient, setDoctorVisitPatient] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);

  // If a patient is selected, display Level 2 Detail Screen
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  if (selectedPatient) {
    return (
      <PatientDetail
        patient={selectedPatient}
        onBack={() => setSelectedPatientId(null)}
      />
    );
  }

  // Filter logic
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.thaiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.primaryDoctorName && p.primaryDoctorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.primaryHospital && p.primaryHospital.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.primaryCaregiverName && p.primaryCaregiverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.chronicDiseases.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.healthStatus === statusFilter;
    const matchesCareType = careTypeFilter === 'all' || p.careType === careTypeFilter;

    return matchesSearch && matchesStatus && matchesCareType;
  });

  // Calculate statistics across all 3 care groups
  const totalCount = patients.length;
  const nursingHomeCount = patients.filter(p => p.careType === 'nursing_home').length;
  const medicalEscortCount = patients.filter(p => p.careType === 'medical_escort').length;
  const homeCareCount = patients.filter(p => p.careType === 'home_care').length;

  // Health status statistics
  const attentionCount = patients.filter(p => p.healthStatus === 'attention').length;
  const monitorCount = patients.filter(p => p.healthStatus === 'monitor').length;
  const stableCount = patients.filter(p => p.healthStatus === 'stable').length;

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sage-800 text-cream-200 shadow-xs">
              Module 1
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              ระบบบริหารจัดการและติดตามข้อมูลผู้ป่วย (Patient Management)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            ศูนย์รวมข้อมูลผู้ป่วยทั้งหมด 3 กลุ่มการดูแล: Nursing Home, บริการนัดพบแพทย์ (Medical Escort) และ ผู้ดูแลที่บ้าน (Home Care)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddPatientModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ ลงทะเบียนผู้ป่วยใหม่</span>
          </button>
          <button
            onClick={() => {
              if (patients.length > 0) setDoctorVisitPatient(patients[0]);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-soft transition-all"
          >
            <Stethoscope className="w-4 h-4 text-emerald-200" />
            <span>+ บันทึกการพบแพทย์</span>
          </button>
          <button
            onClick={() => {
              if (patients.length > 0) setQuickLogPatient(patients[0]);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-sage-900 text-xs font-bold border border-cream-300 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ บันทึกสัญญาณชีพด่วน</span>
          </button>
        </div>
      </div>

      {/* 🌟 3 Care Groups Breakdown Dashboard (Hero KPI Panel) */}
      <div className="bg-white rounded-3xl border border-[#E6EDE8] p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-cream-100 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  สรุปจำนวนผู้ป่วยแยกตามประเภทการดูแล 3 กลุ่ม
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-900">
                  ทั้งหมด {totalCount} คน
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                คลิกการ์ดแต่ละกลุ่มเพื่อกรองดูรายชื่อผู้ป่วยในกลุ่มนั้นๆ ทันที
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">สถานะสุขภาพ:</span>
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-semibold text-[11px]">🔴 เฝ้าระวัง {attentionCount}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold text-[11px]">🟡 ติดตาม {monitorCount}</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[11px]">🟢 ปกติ {stableCount}</span>
          </div>
        </div>

        {/* 3 Care Category Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Group 1: Nursing Home */}
          <div
            onClick={() => setCareTypeFilter(careTypeFilter === 'nursing_home' ? 'all' : 'nursing_home')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              careTypeFilter === 'nursing_home'
                ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-md'
                : 'border-emerald-100 bg-emerald-50/30 hover:border-emerald-300 hover:bg-emerald-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-emerald-950">
                    กลุ่มที่ 1: ผู้ป่วย Nursing Home
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-200/70 text-emerald-900">
                  {totalCount > 0 ? Math.round((nursingHomeCount / totalCount) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-emerald-950 tracking-tight">
                  {nursingHomeCount}
                </span>
                <span className="text-xs text-emerald-800 font-medium">คน (ในศูนย์)</span>
              </div>

              <p className="text-[11px] text-emerald-800/90 mt-1.5 leading-relaxed">
                ผู้ป่วยที่พักรักษาตัวในศูนย์ 24 ชั่วโมง มีเตียง/ห้องพัก และพยาบาลดูแลอย่างใกล้ชิด
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-900 font-semibold">
              <span>{careTypeFilter === 'nursing_home' ? '✓ กำลังแสดงกลุ่มนี้' : 'คลิกเพื่อดูเฉพาะกลุ่มนี้'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
            </div>
          </div>

          {/* Group 2: Medical Escort */}
          <div
            onClick={() => setCareTypeFilter(careTypeFilter === 'medical_escort' ? 'all' : 'medical_escort')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              careTypeFilter === 'medical_escort'
                ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-md'
                : 'border-sky-100 bg-sky-50/30 hover:border-sky-300 hover:bg-sky-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-sky-950">
                    กลุ่มที่ 2: บริการนัดพบแพทย์
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-200/70 text-sky-900">
                  {totalCount > 0 ? Math.round((medicalEscortCount / totalCount) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-sky-950 tracking-tight">
                  {medicalEscortCount}
                </span>
                <span className="text-xs text-sky-800 font-medium">คน (ผู้ป่วยนอก/พาไป รพ.)</span>
              </div>

              <p className="text-[11px] text-sky-800/90 mt-1.5 leading-relaxed">
                ผู้ป่วยที่ใช้บริการเจ้าหน้าที่ Escort พานัดพบแพทย์ ณ โรงพยาบาล เตรียมแฟ้มและบันทึกคำสั่งแพทย์
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-sky-200/60 flex items-center justify-between text-[11px] text-sky-900 font-semibold">
              <span>{careTypeFilter === 'medical_escort' ? '✓ กำลังแสดงกลุ่มนี้' : 'คลิกเพื่อดูเฉพาะกลุ่มนี้'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-700" />
            </div>
          </div>

          {/* Group 3: Home Care */}
          <div
            onClick={() => setCareTypeFilter(careTypeFilter === 'home_care' ? 'all' : 'home_care')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              careTypeFilter === 'home_care'
                ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-md'
                : 'border-amber-100 bg-amber-50/30 hover:border-amber-300 hover:bg-amber-50/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-600 text-white shadow-xs">
                    <Home className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold text-amber-950">
                    กลุ่มที่ 3: ผู้ป่วยที่ดูแลที่บ้าน
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-900">
                  {totalCount > 0 ? Math.round((homeCareCount / totalCount) * 100) : 0}%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-amber-950 tracking-tight">
                  {homeCareCount}
                </span>
                <span className="text-xs text-amber-800 font-medium">คน (ณ บ้านพัก)</span>
              </div>

              <p className="text-[11px] text-amber-800/90 mt-1.5 leading-relaxed">
                ผู้ป่วยที่รับบริการผู้ดูแลมืออาชีพไปประจำบ้าน เช็กอิน GPS รายงานผลประจำวัน และทำกายภาพ
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-900 font-semibold">
              <span>{careTypeFilter === 'home_care' ? '✓ กำลังแสดงกลุ่มนี้' : 'คลิกเพื่อดูเฉพาะกลุ่มนี้'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </div>

        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อผู้ป่วย, HN, แพทย์ประจำตัว, โรงพยาบาล, ผู้ดูแล หรือโรคประจำตัว..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-gray-400 mr-1 hidden sm:inline">สถานะ:</span>
            {[
              { id: 'all', label: `ทั้งหมด (${totalCount})` },
              { id: 'attention', label: `🔴 Attention (${attentionCount})` },
              { id: 'monitor', label: `🟡 Monitor (${monitorCount})` },
              { id: 'stable', label: `🟢 Stable (${stableCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === tab.id
                    ? 'bg-sage-800 text-white shadow-xs'
                    : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-cream-200 p-1 rounded-xl border border-cream-300">
            <button
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'grid' ? 'bg-white shadow-xs text-sage-900' : 'text-gray-500'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewStyle('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewStyle === 'table' ? 'bg-white shadow-xs text-sage-900' : 'text-gray-500'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Secondary Filter: 3 Care Types Filter Pills */}
        <div className="pt-2 border-t border-gray-100 flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0 no-scrollbar">
          <span className="text-gray-400 shrink-0 font-medium">กรองประเภทการดูแล:</span>
          
          <button
            onClick={() => setCareTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              careTypeFilter === 'all' 
                ? 'bg-sage-800 text-white shadow-xs' 
                : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
            }`}
          >
            🌟 ทั้งหมด ({totalCount} คน)
          </button>

          <button
            onClick={() => setCareTypeFilter('nursing_home')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              careTypeFilter === 'nursing_home' 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Nursing Home ({nursingHomeCount} คน)</span>
          </button>

          <button
            onClick={() => setCareTypeFilter('medical_escort')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              careTypeFilter === 'medical_escort' 
                ? 'bg-sky-800 text-white shadow-xs' 
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>2. บริการนัดพบแพทย์ ({medicalEscortCount} คน)</span>
          </button>

          <button
            onClick={() => setCareTypeFilter('home_care')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              careTypeFilter === 'home_care' 
                ? 'bg-amber-800 text-white shadow-xs' 
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>3. ดูแลที่บ้าน ({homeCareCount} คน)</span>
          </button>
        </div>
      </div>

      {/* Patient List (Level 1 View) */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
          <Users className="w-12 h-12 mx-auto text-gray-300 stroke-1 mb-2" />
          <h3 className="text-base font-bold text-gray-800">ไม่พบข้อมูลผู้ป่วยที่ตรงตามเงื่อนไข</h3>
          <p className="text-xs text-gray-400 mt-1">ลองเปลี่ยนคำค้นหาหรือตัวกรองสถานะใหม่อีกครั้ง</p>
        </div>
      ) : viewStyle === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map(patient => {
            const latestVital = patient.vitalsHistory[0];

            // Badge styling per care type
            let careTypeBadge = {
              label: '🏢 Nursing Home',
              desc: patient.roomBed || 'พักในศูนย์',
              className: 'bg-emerald-50 text-emerald-800 border-emerald-200'
            };
            if (patient.careType === 'medical_escort') {
              careTypeBadge = {
                label: '🏥 บริการนัดพบแพทย์',
                desc: patient.primaryHospital || 'บริการ Escort พาไป รพ.',
                className: 'bg-sky-50 text-sky-800 border-sky-200'
              };
            } else if (patient.careType === 'home_care') {
              careTypeBadge = {
                label: '🏡 บริการดูแลที่บ้าน',
                desc: patient.address ? patient.address.split(' ')[1] || 'บ้านพักผู้ป่วย' : 'บ้านพักผู้ป่วย',
                className: 'bg-amber-50 text-amber-800 border-amber-200'
              };
            }

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientId(patient.id)}
                className="group relative bg-white rounded-3xl border border-[#E8ECE9] hover:border-sage-300 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Status, HN and Care Type Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        {patient.hn}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${careTypeBadge.className}`}>
                        {careTypeBadge.label}
                      </span>
                    </div>
                    <StatusBadge status={patient.healthStatus} size="sm" />
                  </div>

                  {/* Profile Header */}
                  <div className="flex items-center gap-3.5 mt-4">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-sage-800 transition-colors truncate">
                        {patient.thaiName}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {patient.name} • {patient.age} ปี
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate flex items-center gap-1">
                        <span className="font-medium text-gray-700">{careTypeBadge.desc}</span>
                      </p>
                    </div>
                  </div>

                  {/* Primary Doctor & Hospital */}
                  <div className="mt-3 p-2 rounded-xl bg-cream-50/70 border border-cream-200/70 text-[11px] space-y-0.5">
                    <div className="text-gray-700 truncate">
                      🩺 <strong>แพทย์:</strong> {patient.primaryDoctorName}
                    </div>
                    <div className="text-gray-500 truncate">
                      🏥 <strong>โรงพยาบาล:</strong> {patient.primaryHospital}
                    </div>
                  </div>

                  {/* Precaution Badges Preview */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {patient.carePlan.precautions.slice(0, 2).map(alert => (
                      <PrecautionBadge key={alert.id} alert={alert} compact />
                    ))}
                    {patient.carePlan.precautions.length > 2 && (
                      <span className="text-[10px] font-semibold text-gray-400 px-1.5 py-0.5 rounded bg-gray-100">
                        +{patient.carePlan.precautions.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Latest Vital Summary */}
                  {latestVital && (
                    <div className="mt-3 p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs">
                      <div className="flex items-center justify-between text-gray-500 text-[11px] mb-1">
                        <span className="font-semibold text-gray-700 flex items-center gap-1">
                          <HeartPulse className="w-3.5 h-3.5 text-sage-700" />
                          สัญญาณชีพล่าสุด ({latestVital.timestamp.split(' ')[1] || 'เช้า'})
                        </span>
                        <span>{latestVital.temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between font-bold text-gray-900">
                        <span>ความดัน: {latestVital.sys}/{latestVital.dia} mmHg</span>
                        <span>ชีพจร: {latestVital.pulse} bpm</span>
                      </div>
                    </div>
                  )}

                  {/* Status Notes */}
                  {patient.statusNotes && (
                    <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 italic">
                      "{patient.statusNotes}"
                    </p>
                  )}
                </div>

                {/* Footer Drilldown & Quick Edit link */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate max-w-[130px]">
                    ผู้ดูแล: <strong className="text-gray-700">{patient.primaryCaregiverName?.split(' ')[0] || 'รอกำหนด'}</strong>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPatient(patient);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 text-sage-900 font-bold text-[11px] inline-flex items-center gap-1 transition-colors border border-cream-200"
                      title="แก้ไขข้อมูลผู้ป่วย"
                    >
                      <Edit3 className="w-3 h-3 text-sage-700" />
                      <span>แก้ไข</span>
                    </button>
                    <span className="font-bold text-sage-800 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 pl-1">
                      <span>เปิดดู</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-cream-50/80 border-b border-gray-100 text-gray-500 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-bold">ผู้ป่วย (Patient)</th>
                  <th className="py-3.5 px-4 font-bold">HN / อายุ</th>
                  <th className="py-3.5 px-4 font-bold">ประเภทการดูแล (Care Group)</th>
                  <th className="py-3.5 px-4 font-bold">โรงพยาบาล & แพทย์</th>
                  <th className="py-3.5 px-4 font-bold">สัญญาณชีพล่าสุด</th>
                  <th className="py-3.5 px-4 font-bold">สถานะสุขภาพ</th>
                  <th className="py-3.5 px-4 font-bold">ผู้ดูแล / Escort</th>
                  <th className="py-3.5 px-4 font-bold text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPatients.map(patient => {
                  const latest = patient.vitalsHistory[0];

                  let groupLabel = '🏢 Nursing Home';
                  let groupClass = 'bg-emerald-50 text-emerald-800';
                  if (patient.careType === 'medical_escort') {
                    groupLabel = '🏥 นัดพบแพทย์';
                    groupClass = 'bg-sky-50 text-sky-800';
                  } else if (patient.careType === 'home_care') {
                    groupLabel = '🏡 ดูแลที่บ้าน';
                    groupClass = 'bg-amber-50 text-amber-800';
                  }

                  return (
                    <tr
                      key={patient.id}
                      onClick={() => setSelectedPatientId(patient.id)}
                      className="hover:bg-cream-50/60 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={patient.avatar}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-cream-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{patient.thaiName}</p>
                            <p className="text-[11px] text-gray-400">{patient.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-gray-800">{patient.hn}</span>
                        <p className="text-[11px] text-gray-500">{patient.age} ปี</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-md font-bold text-[11px] inline-block ${groupClass}`}>
                          {groupLabel}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate max-w-[140px]">
                          {patient.careType === 'nursing_home' ? patient.roomBed : patient.careType === 'medical_escort' ? 'Escort Companion' : 'Home Visit'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-gray-900 truncate max-w-[160px]">{patient.primaryHospital}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-[160px]">{patient.primaryDoctorName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {latest ? (
                          <div>
                            <span className="font-bold text-gray-900">{latest.sys}/{latest.dia}</span>
                            <span className="text-[10px] text-gray-400 ml-1">mmHg</span>
                            <p className="text-[11px] text-gray-500">{latest.pulse} bpm | {latest.temp}°C</p>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={patient.healthStatus} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {patient.primaryCaregiverName?.split(' ')[0] || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditPatient(patient);
                            }}
                            className="px-2.5 py-1.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-sage-900 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-cream-200"
                            title="แก้ไขข้อมูลผู้ป่วย"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-sage-700" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientId(patient.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-900 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <span>เปิดดู</span>
                            <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <AddPatientModal onClose={() => setShowAddPatientModal(false)} />
      )}

      {/* Edit Patient Modal */}
      {editPatient && (
        <EditPatientModal
          patient={editPatient}
          onClose={() => setEditPatient(null)}
        />
      )}

      {/* Quick Log Modal if triggered */}
      {quickLogPatient && (
        <DailyLogModal
          patient={quickLogPatient}
          onClose={() => setQuickLogPatient(null)}
        />
      )}

      {/* Doctor Visit Modal if triggered */}
      {doctorVisitPatient && (
        <DoctorVisitModal
          patient={doctorVisitPatient}
          onClose={() => setDoctorVisitPatient(null)}
        />
      )}
    </div>
  );
};
