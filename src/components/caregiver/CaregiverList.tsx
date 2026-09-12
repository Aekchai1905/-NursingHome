import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Caregiver } from '../../types';
import { StatCard } from '../common/StatCard';
import { CaregiverDetail } from './CaregiverDetail';
import { ContractManager } from './ContractManager';
import { GPSCheckinModal } from './GPSCheckinModal';
import { DailyCareReportModal } from './DailyCareReportModal';
import { AddCaregiverModal } from './AddCaregiverModal';
import { 
  Users, 
  Search, 
  Star, 
  MapPin, 
  Award, 
  FileText, 
  Map, 
  Plus, 
  UserPlus,
  ArrowRight, 
  Clock, 
  UserCheck, 
  Building 
} from 'lucide-react';

export const CaregiverList: React.FC = () => {
  const { caregivers, selectedCaregiverId, setSelectedCaregiverId, setActiveTab } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'contracts'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [gpsModalCaregiver, setGpsModalCaregiver] = useState<Caregiver | null>(null);
  const [reportModalCaregiver, setReportModalCaregiver] = useState<Caregiver | null>(null);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);

  // If a caregiver is selected, render Level 2 Detail Screen
  const selectedCaregiver = caregivers.find(c => c.id === selectedCaregiverId);
  if (selectedCaregiver) {
    return (
      <CaregiverDetail
        caregiver={selectedCaregiver}
        onBack={() => setSelectedCaregiverId(null)}
      />
    );
  }

  // Filter caregivers
  const filteredCaregivers = caregivers.filter(cg => {
    const matchesSearch =
      cg.thaiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cg.specialSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cg.certifications.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || cg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = caregivers.length;
  const workingCount = caregivers.filter(c => c.status === 'working').length;
  const availableCount = caregivers.filter(c => c.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sage-800 text-cream-200">
              Module 3
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Home Caregiver Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            หน้ารวมรายชื่อผู้ดูแลผู้ป่วยที่บ้าน (Level 1) ตรวจสอบคุณสมบัติ ใบเซอร์ สัญญาจ้าง และระบบ GPS เช็กอิน
          </p>
        </div>

        {/* Action / Sub-tab Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('staff')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-sage-900 text-xs font-bold border border-cream-300 shadow-2xs transition-all"
          >
            <Users className="w-3.5 h-3.5 text-sage-700" />
            <span>ดูสถานะพนักงาน 2 กลุ่ม (เช็คคนว่าง)</span>
          </button>
          <button
            onClick={() => setShowAddCaregiverModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ เพิ่มผู้ดูแลคนใหม่</span>
          </button>
          <div className="flex items-center gap-1 bg-cream-200 p-1.5 rounded-2xl border border-cream-300">
            <button
              onClick={() => setActiveSubTab('roster')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'roster' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>รายชื่อผู้ดูแล ({totalCount})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('contracts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'contracts' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>สัญญาจ้าง & ค่าจ้าง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="ผู้ดูแลทั้งหมด (Total Staff)"
          value={totalCount}
          subtitle="ผ่านการตรวจประวัติ & รับรอง"
          icon={Users}
          iconBg="bg-sage-100"
          iconColor="text-sage-800"
        />
        <StatCard
          title="กำลังปฏิบัติงาน (Working)"
          value={workingCount}
          subtitle="ประจำบ้านผู้ป่วย / เนอร์สซิ่งโฮม"
          icon={UserCheck}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          trend={{ value: `${workingCount} คน`, isPositive: true }}
        />
        <StatCard
          title="พร้อมรับงานใหม่ (Available)"
          value={availableCount}
          subtitle="สามารถส่งตัวได้ทันที"
          icon={Clock}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          trend={{ value: 'พร้อมจัดส่ง', isPositive: true }}
        />
        <StatCard
          title="ความพึงพอใจเฉลี่ย"
          value="4.9 / 5.0"
          subtitle="คะแนนรีวิวจากญาติผู้ป่วย"
          icon={Star}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
          trend={{ value: 'ยอดเยี่ยม (98%)', isPositive: true }}
        />
      </div>

      {activeSubTab === 'contracts' ? (
        <ContractManager />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อผู้ดูแล, ทักษะ (เช่น ผู้ป่วยติดเตียง, เจาะคอ, ฟอกไต), หรือใบเซอร์..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'working', label: 'กำลังปฏิบัติงาน' },
                { id: 'available', label: 'ว่างพร้อมเริ่มงาน' }
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
          </div>

          {/* Caregivers Grid (Level 1) */}
          {filteredCaregivers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
              <Users className="w-12 h-12 mx-auto text-gray-300 stroke-1 mb-2" />
              <h3 className="text-base font-bold text-gray-800">ไม่พบรายชื่อผู้ดูแลที่ตรงตามเงื่อนไข</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCaregivers.map(cg => (
                <div
                  key={cg.id}
                  onClick={() => setSelectedCaregiverId(cg.id)}
                  className="group bg-white rounded-3xl border border-gray-100 hover:border-sage-300 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    {/* Header Avatar & Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={cg.avatar}
                          alt={cg.name}
                          className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-sage-800 transition-colors">
                            {cg.thaiName}
                          </h3>
                          <p className="text-xs text-gray-500">
                            อายุ {cg.age} ปี • ประสบการณ์ {cg.experienceYears} ปี
                          </p>
                          <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                            <span>{cg.rating}</span>
                            <span className="text-gray-400 font-normal">({cg.totalPatientsServed} เคส)</span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cg.status === 'working' ? 'bg-blue-100 text-blue-800' :
                        cg.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        ● {cg.status}
                      </span>
                    </div>

                    {/* Current Assigned Patient if working */}
                    {cg.currentPatientName && (
                      <div className="mt-3.5 p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-700">
                        <span className="text-gray-400 text-[10px] block">ผู้ป่วยที่กำลังดูแล:</span>
                        <strong className="text-sage-900">{cg.currentPatientName}</strong>
                      </div>
                    )}

                    {/* Skills & Certifications Tags */}
                    <div className="mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-gray-700">ทักษะ & ใบเซอร์เด่น:</p>
                      <div className="flex flex-wrap gap-1">
                        {cg.specialSkills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-sage-50 text-sage-800 border border-sage-200 font-medium truncate max-w-[170px]">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Standard Wage Rate */}
                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">อัตราค่าบริการ:</span>
                      <strong className="text-emerald-700 font-extrabold">
                        {cg.standardRate.toLocaleString()} ฿ / {cg.wageType}
                      </strong>
                    </div>
                  </div>

                  {/* Action Bar & Drilldown */}
                  <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                    {/* Quick GPS Checkin / Daily Report trigger */}
                    <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => setGpsModalCaregiver(cg)}
                        className="py-1.5 px-2.5 rounded-xl bg-cream-100 hover:bg-cream-200 text-gray-800 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-sage-700" />
                        <span>GPS เช็กอิน</span>
                      </button>
                      <button
                        onClick={() => setReportModalCaregiver(cg)}
                        className="py-1.5 px-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>ส่งรายงาน</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-gray-400 text-[11px]">ดูประวัติและสัญญาจ้าง</span>
                      <span className="font-bold text-sage-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>ดูโปรไฟล์</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Add Caregiver Modal */}
      {showAddCaregiverModal && (
        <AddCaregiverModal onClose={() => setShowAddCaregiverModal(false)} />
      )}

      {/* GPS Checkin Modal */}
      {gpsModalCaregiver && (
        <GPSCheckinModal
          caregiver={gpsModalCaregiver}
          onClose={() => setGpsModalCaregiver(null)}
        />
      )}

      {/* Daily Care Report Modal */}
      {reportModalCaregiver && (
        <DailyCareReportModal
          caregiver={reportModalCaregiver}
          onClose={() => setReportModalCaregiver(null)}
        />
      )}
    </div>
  );
};
