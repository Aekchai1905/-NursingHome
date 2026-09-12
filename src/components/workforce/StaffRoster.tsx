import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UnifiedStaffMember, StaffCategory, UnifiedStaffStatus } from '../../types';
import { StatCard } from '../common/StatCard';
import { StaffDetailModal } from './StaffDetailModal';
import { AddStaffModal } from './AddStaffModal';
import { EditStaffModal } from './EditStaffModal';
import { StaffScrollingShowcase } from './StaffScrollingShowcase';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Home, 
  Car, 
  Star, 
  Phone, 
  Award, 
  Briefcase, 
  ArrowRight, 
  LayoutGrid, 
  List, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronDown,
  Edit3,
  MessageSquare,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

export const StaffRoster: React.FC = () => {
  const { staff, updateStaffStatus, setSelectedPatientId, setActiveTab } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | StaffCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UnifiedStaffStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewStyle, setViewStyle] = useState<'grid' | 'table' | 'scroll'>('grid');
  
  const [selectedStaff, setSelectedStaff] = useState<UnifiedStaffMember | null>(null);
  const [editingStaff, setEditingStaff] = useState<UnifiedStaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Statistics calculation
  const totalCount = staff.length;
  const group1Count = staff.filter(s => s.category === 'nursing_home_escort').length;
  const group2Count = staff.filter(s => s.category === 'home_care').length;

  const availableCount = staff.filter(s => s.status === 'available').length;
  const workingCount = staff.filter(s => s.status === 'working').length;
  const leaveCount = staff.filter(s => s.status === 'leave').length;

  const group1Available = staff.filter(s => s.category === 'nursing_home_escort' && s.status === 'available').length;
  const group2Available = staff.filter(s => s.category === 'home_care' && s.status === 'available').length;

  // Filter staff list
  const filteredStaff = staff.filter(member => {
    const matchesCategory = categoryFilter === 'all' || member.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesSearch = 
      member.thaiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.nickname && member.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.lineId && member.lineId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      member.subRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.currentAssignment?.patientName && member.currentAssignment.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.currentAssignment?.locationOrRoom && member.currentAssignment.locationOrRoom.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title Banner & Action Buttons */}
      <div className="rounded-3xl bg-white text-[#1A2E25] p-6 sm:p-8 shadow-sm relative overflow-hidden border border-[#EAE2D3]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CF7C4E]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#4D7D67]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] text-xs font-extrabold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>ส่วนที่ 2: Unified Staff & Caregiver Roster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#142332] font-heading">
              สรุปรายชื่อพนักงาน (Staff Roster Summary)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6B64] max-w-2xl leading-relaxed font-medium">
              ศูนย์รวมข้อมูลพนักงานทั้งหมด 2 กลุ่มหลัก: 1) พนักงานศูนย์ Nursing Home & พนักงานพาพบแพทย์ Escort 
              และ 2) ผู้ช่วยพยาบาลดูแลผู้ป่วยที่บ้าน พร้อมเช็คคนว่าง/ติดเคส LINE ID และกดดู/แก้ไขข้อมูลได้แบบเรียลไทม์
            </p>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#CF7C4E] hover:bg-[#BE673B] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>+ เพิ่มพนักงานใหม่</span>
            </button>
          </div>
        </div>

        {/* Overview KPI Stat Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#F4EFE5]">
          <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] shadow-2xs">
            <span className="text-[11px] text-[#5C6B64] font-bold block">👤 พนักงานทั้งหมด</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#142332] font-heading">{totalCount}</span>
              <span className="text-xs font-semibold text-[#7D8C85]">คน</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EAF7F0] border border-[#BEE7D0] shadow-2xs">
            <span className="text-[11px] text-[#1E7E52] font-bold block">🟢 ว่างพร้อมรับงาน</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#1E7E52] font-heading">{availableCount}</span>
              <span className="text-xs font-semibold text-[#1E7E52]/80">คน</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EEF5F9] border border-[#C6DEED] shadow-2xs">
            <span className="text-[11px] text-[#2B5975] font-bold block">🏥 Nursing Home & Escort</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#2B5975] font-heading">{group1Count}</span>
              <span className="text-xs font-semibold text-[#2B5975]/80">คน</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF0E6] border border-[#F0BFA6] shadow-2xs">
            <span className="text-[11px] text-[#9E4E28] font-bold block">🏠 ผู้ดูแลผู้ป่วยที่บ้าน</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#9E4E28] font-heading">{group2Count}</span>
              <span className="text-xs font-semibold text-[#9E4E28]/80">คน</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Category Control Panel */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft space-y-4">
        
        {/* Category Segmented Control (Tabs) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-cream-100/80 border border-cream-200 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                categoryFilter === 'all'
                  ? 'bg-sage-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>พนักงานทั้งหมด ({totalCount})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('nursing_home_escort')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                categoryFilter === 'nursing_home_escort'
                  ? 'bg-sage-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>กลุ่ม 1: Nursing Home & Escort ({group1Count})</span>
            </button>

            <button
              onClick={() => setCategoryFilter('home_care')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                categoryFilter === 'home_care'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>กลุ่ม 2: ผู้ดูแลผู้ป่วยที่บ้าน ({group2Count})</span>
            </button>
          </div>

          {/* View Toggle (Scroll vs Grid vs Table) */}
          <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-xl border border-cream-200 self-end sm:self-auto flex-wrap">
            <button
              onClick={() => setViewStyle('scroll')}
              className={`p-1.5 px-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                viewStyle === 'scroll' ? 'bg-[#23382E] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="แอนิเมชันเลื่อนขึ้นแถวเดี่ยวแบบ 21st.dev (1-Row Continuous Marquee)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>🎬 เลื่อนขึ้น (1 แถว)</span>
            </button>
            <button
              onClick={() => setViewStyle('grid')}
              className={`p-1.5 px-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                viewStyle === 'grid' ? 'bg-[#23382E] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="มุมมองการ์ด (Grid View)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>การ์ด</span>
            </button>
            <button
              onClick={() => setViewStyle('table')}
              className={`p-1.5 px-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold ${
                viewStyle === 'table' ? 'bg-[#23382E] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="มุมมองตาราง (Table View)"
            >
              <List className="w-3.5 h-3.5" />
              <span>ตาราง</span>
            </button>
          </div>
        </div>

        {/* Search and Status Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามชื่อ, รหัส (STF-NH01), LINE ID, ทักษะ หรือเคสผู้ป่วย..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E] bg-cream-50/40"
            />
          </div>

          {/* Availability Status Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              สถานะ:
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-gray-800 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              ทั้งหมด ({totalCount})
            </button>

            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>🟢 ว่างพร้อมงาน ({availableCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('working')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'working'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              <span>🟡 กำลังติดเคส ({workingCount})</span>
            </button>

            <button
              onClick={() => setStatusFilter('leave')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                statusFilter === 'leave'
                  ? 'bg-rose-700 text-white shadow-2xs'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              <span>🔴 ลางาน ({leaveCount})</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1-ROW CONTINUOUS SCROLLING SHOWCASE VIEW */}
      {/* ========================================================================= */}
      {viewStyle === 'scroll' && (
        <StaffScrollingShowcase
          staff={filteredStaff}
          onSelectStaff={setSelectedStaff}
          onUpdateStatus={updateStaffStatus}
        />
      )}

      {/* Grid View */}
      {viewStyle === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map(member => {
            const isGroup1 = member.category === 'nursing_home_escort';
            const isAvailable = member.status === 'available';
            const isWorking = member.status === 'working';

            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-[#EAE2D3] shadow-soft hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-[#CF7C4E]/50"
              >
                <div className="p-5">
                  
                  {/* Top Header: Code, Category & Live Status */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedStaff(member)}
                        className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 hover:bg-[#FAF0E6] hover:text-[#9E4E28] hover:border-[#F0BFA6] transition-colors cursor-pointer"
                        title="คลิกเพื่อดูโปรไฟล์พนักงาน"
                      >
                        {member.code}
                      </button>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isGroup1 ? 'bg-cream-100 text-sage-900 border border-cream-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {isGroup1 ? '🏢 Nursing Home & Escort' : '🏡 ดูแลที่บ้าน'}
                      </span>
                    </div>

                    {/* Status Badge with Live Dot */}
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                      isAvailable 
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                        : isWorking 
                        ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isAvailable ? 'bg-emerald-600 animate-pulse' : isWorking ? 'bg-amber-600' : 'bg-rose-600'
                      }`} />
                      <span>{isAvailable ? 'ว่างพร้อมงาน' : isWorking ? 'กำลังติดเคส' : 'ลางาน'}</span>
                    </span>
                  </div>

                  {/* Profile Overview (Clickable Card Area / Name / Avatar) */}
                  <div className="flex items-center gap-3.5 mt-4">
                    <div 
                      onClick={() => setSelectedStaff(member)}
                      className="relative shrink-0 cursor-pointer group/avatar"
                      title="คลิกเพื่อดูรายละเอียดและข้อมูลพนักงาน"
                    >
                      <img
                        src={member.avatar}
                        alt={member.thaiName}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs group-hover/avatar:ring-2 group-hover/avatar:ring-[#CF7C4E] group-hover/avatar:scale-105 transition-all"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        isAvailable ? 'bg-emerald-500' : isWorking ? 'bg-amber-500' : 'bg-rose-500'
                      }`} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 
                        onClick={() => setSelectedStaff(member)}
                        className="text-base font-bold text-gray-900 hover:text-[#CF7C4E] hover:underline transition-colors truncate cursor-pointer flex items-center gap-1.5 group/name"
                        title="คลิกเพื่อเปิดดูรายละเอียดพนักงาน"
                      >
                        <span className="truncate">{member.thaiName}</span>
                        {member.nickname && <span className="text-gray-500 font-normal shrink-0">({member.nickname})</span>}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/name:opacity-100 group-hover/name:translate-x-0.5 transition-all text-[#CF7C4E] shrink-0" />
                      </h3>
                      
                      <p 
                        onClick={() => setSelectedStaff(member)}
                        className="text-xs text-sage-800 font-semibold truncate cursor-pointer hover:text-[#CF7C4E] transition-colors"
                        title="คลิกเพื่อเปิดดูรายละเอียดพนักงาน"
                      >
                        {member.subRole}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                        <span className="flex items-center gap-0.5 text-amber-700 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {member.rating}
                        </span>
                        <span>•</span>
                        <span>ประสบการณ์ {member.experienceYears} ปี</span>
                        <span>•</span>
                        <span>{member.totalCases} เคส</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Assignment / Duty Banner */}
                  <div className="mt-4">
                    {isWorking && member.currentAssignment ? (
                      <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-amber-900 font-bold text-[11px]">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-amber-700" />
                            กำลังดูแลผู้ป่วย:
                          </span>
                          {member.currentAssignment.startTime && (
                            <span className="text-[10px] text-amber-800">{member.currentAssignment.startTime}</span>
                          )}
                        </div>
                        <div className="font-bold text-gray-900 truncate">
                          {member.currentAssignment.patientName}
                        </div>
                        <div className="text-[11px] text-gray-600 truncate">
                          📍 {member.currentAssignment.locationOrRoom}
                        </div>
                      </div>
                    ) : isAvailable ? (
                      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-center justify-between text-emerald-900">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>สถานะ: ว่างพร้อมรับงานทันที</span>
                        </div>
                        <span className="text-[10px] bg-emerald-200/70 text-emerald-900 font-bold px-2 py-0.5 rounded">
                          พร้อมจัดคิว
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200 text-xs text-rose-800">
                        <span className="font-bold">สถานะ: ลางาน / พักผ่อน</span>
                        {member.notes && <p className="text-[11px] text-rose-600 mt-0.5 truncate">{member.notes}</p>}
                      </div>
                    )}
                  </div>

                  {/* Skills preview */}
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {member.skills.slice(0, 2).map((sk, sIdx) => (
                      <span key={sIdx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-700">
                        ✓ {sk}
                      </span>
                    ))}
                    {member.skills.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gray-100 text-gray-500">
                        +{member.skills.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Quick Contact & LINE ID & Standard Rate */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 gap-2">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="flex items-center gap-1 shrink-0">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <strong className="text-gray-700">{member.phone}</strong>
                      </span>

                      {member.lineId && (
                        <span 
                          onClick={() => setSelectedStaff(member)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#06C755]/10 text-[#0B6830] font-bold text-[10px] border border-[#06C755]/20 cursor-pointer hover:bg-[#06C755]/20 transition-colors truncate"
                          title={`LINE ID: ${member.lineId} (คลิกเพื่อดูโปรไฟล์)`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#06C755]" />
                          <span>LINE: @{member.lineId}</span>
                        </span>
                      )}
                    </div>

                    {member.standardRate && (
                      <span className="font-bold text-sage-900 text-[11px] bg-cream-100 px-2 py-0.5 rounded shrink-0">
                        {member.standardRate}
                      </span>
                    )}
                  </div>

                </div>

                {/* Card Footer: Status Switcher & Action Buttons */}
                <div className="p-3.5 bg-cream-50/40 border-t border-gray-100 flex items-center justify-between gap-2">
                  
                  {/* Quick Status Change Selector */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold hidden sm:inline">สถานะ:</span>
                    <select
                      value={member.status}
                      onChange={e => updateStaffStatus(member.id, e.target.value as UnifiedStaffStatus)}
                      className="text-[11px] font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#CF7C4E] cursor-pointer shadow-2xs"
                    >
                      <option value="available">🟢 ว่าง</option>
                      <option value="working">🟡 ติดเคส</option>
                      <option value="leave">🔴 ลางาน</option>
                    </select>
                  </div>

                  {/* Actions: Edit & View Profile */}
                  <div className="flex items-center gap-1.5">
                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => setEditingStaff(member)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-cream-100 text-gray-700 hover:text-gray-900 border border-gray-200 text-xs font-bold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                      title="แก้ไขข้อมูลพนักงานทั้งหมด"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#CF7C4E]" />
                      <span>แก้ไข</span>
                    </button>

                    {/* View Details button */}
                    <button
                      type="button"
                      onClick={() => setSelectedStaff(member)}
                      className="px-3 py-1.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                      title="เปิดดูรายละเอียดและโปรไฟล์พนักงาน"
                    >
                      <span>ดูโปรไฟล์</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewStyle === 'table' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-100/70 border-b border-gray-200 text-gray-700 font-bold">
                  <th className="py-3.5 px-4">รหัส & พนักงาน</th>
                  <th className="py-3.5 px-4">กลุ่ม & ตำแหน่ง</th>
                  <th className="py-3.5 px-4">สถานะความพร้อม</th>
                  <th className="py-3.5 px-4">งาน / ผู้ป่วยที่ดูแลอยู่</th>
                  <th className="py-3.5 px-4">เบอร์ & LINE ID</th>
                  <th className="py-3.5 px-4">เรตติ้ง / ประสบการณ์</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.map(member => {
                  const isGroup1 = member.category === 'nursing_home_escort';
                  const isAvailable = member.status === 'available';
                  const isWorking = member.status === 'working';

                  return (
                    <tr
                      key={member.id}
                      onClick={() => setSelectedStaff(member)}
                      className="hover:bg-cream-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatar}
                            alt={member.thaiName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-cream-300 group-hover:ring-[#CF7C4E] transition-all"
                          />
                          <div>
                            <div className="font-bold text-gray-900 group-hover:text-[#CF7C4E] transition-colors">
                              {member.thaiName} {member.nickname && `(${member.nickname})`}
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 font-semibold">{member.code}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold block w-fit mb-0.5 ${
                          isGroup1 ? 'bg-cream-200 text-sage-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {isGroup1 ? '🏢 Nursing Home & Escort' : '🏡 ดูแลที่บ้าน'}
                        </span>
                        <span className="text-gray-600 font-medium">{member.subRole}</span>
                      </td>

                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <select
                          value={member.status}
                          onChange={e => updateStaffStatus(member.id, e.target.value as UnifiedStaffStatus)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border focus:outline-none cursor-pointer ${
                            isAvailable 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                              : isWorking 
                              ? 'bg-amber-50 text-amber-800 border-amber-300' 
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          <option value="available">🟢 ว่างพร้อมงาน</option>
                          <option value="working">🟡 กำลังติดเคส</option>
                          <option value="leave">🔴 ลางาน</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        {member.currentAssignment ? (
                          <div className="text-xs">
                            <span className="font-bold text-gray-900">{member.currentAssignment.patientName}</span>
                            <span className="text-[11px] text-gray-500 block truncate max-w-xs">{member.currentAssignment.locationOrRoom}</span>
                          </div>
                        ) : isAvailable ? (
                          <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            ว่างพร้อมรับงาน
                          </span>
                        ) : (
                          <span className="text-rose-600 text-xs">ลางาน</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        <div>{member.phone}</div>
                        {member.lineId && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#0B6830] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#06C755]" />
                            LINE: @{member.lineId}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-amber-700 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{member.rating}</span>
                          <span className="text-gray-400 font-normal">({member.experienceYears} ปี)</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingStaff(member)}
                            className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-cream-100 text-gray-700 font-bold text-xs inline-flex items-center gap-1 transition-colors border border-gray-200 cursor-pointer"
                            title="แก้ไขข้อมูลพนักงาน"
                          >
                            <Edit3 className="w-3 h-3 text-[#CF7C4E]" />
                            <span>แก้ไข</span>
                          </button>
                          <button
                            onClick={() => setSelectedStaff(member)}
                            className="px-3 py-1.5 rounded-xl bg-sage-100 hover:bg-sage-200 text-sage-900 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
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

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <StaffDetailModal
          staffMember={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onEdit={(m) => {
            setSelectedStaff(null);
            setEditingStaff(m);
          }}
        />
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <EditStaffModal
          staffMember={editingStaff}
          onClose={() => setEditingStaff(null)}
        />
      )}

      {/* Add New Staff Modal */}
      {showAddModal && (
        <AddStaffModal
          defaultCategory={categoryFilter !== 'all' ? categoryFilter : 'nursing_home_escort'}
          onClose={() => setShowAddModal(false)}
        />
      )}

    </div>
  );
};

