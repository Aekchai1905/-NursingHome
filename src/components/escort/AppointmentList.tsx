import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { StatCard } from '../common/StatCard';
import { PreAppointmentBriefing } from './PreAppointmentBriefing';
import { EscortStaffList } from './EscortStaffList';
import { JobMatchingModal } from './JobMatchingModal';
import { 
  Car, 
  Calendar, 
  Clock, 
  UserCheck, 
  Sparkles, 
  Search, 
  Building2, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  FileText 
} from 'lucide-react';

export const AppointmentList: React.FC = () => {
  const { appointments, selectedAppointmentId, setSelectedAppointmentId, setActiveTab } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'appointments' | 'staff'>('appointments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [matchingAppointment, setMatchingAppointment] = useState<Appointment | null>(null);

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

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointmentNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = appointments.length;
  const inProgressCount = appointments.filter(a => a.status === 'in_progress').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sage-800 text-cream-200">
              Module 2
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Medical Escort & Appointment Management
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            หน้ารวมรายการนัดหมายและพนักงานพาพบแพทย์ (Level 1) พร้อมระบบจับคู่งานและแฟ้มสรุปก่อนพบแพทย์
          </p>
        </div>

        {/* Tab switch between Appointments and Staff Availability */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('staff')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-sage-900 text-xs font-bold border border-cream-300 shadow-2xs transition-all"
          >
            <Users className="w-3.5 h-3.5 text-sage-700" />
            <span>ดูสถานะพนักงาน 2 กลุ่ม (เช็คคนว่าง)</span>
          </button>
          <div className="flex items-center gap-1.5 bg-cream-200 p-1.5 rounded-2xl border border-cream-300">
            <button
              onClick={() => setActiveSubTab('appointments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'appointments' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>ตารางนัดหมาย ({totalCount})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('staff')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'staff' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>พนักงาน Escort & ความว่าง</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="นัดหมายทั้งหมด (Total Trips)"
          value={totalCount}
          subtitle="สัปดาห์นี้"
          icon={Calendar}
          iconBg="bg-sage-100"
          iconColor="text-sage-800"
        />
        <StatCard
          title="กำลังดำเนินการ (In Progress)"
          value={inProgressCount}
          subtitle="พนักงานกำลังพาไปพบแพทย์"
          icon={Car}
          iconBg="bg-blue-100"
          iconColor="text-blue-700"
          trend={{ value: `${inProgressCount} เคส`, isPositive: true }}
        />
        <StatCard
          title="ยืนยันแล้ว / รอเดินทาง"
          value={confirmedCount}
          subtitle="พร้อมแฟ้มสรุป Pre-briefing"
          icon={UserCheck}
          iconBg="bg-amber-100"
          iconColor="text-amber-700"
        />
        <StatCard
          title="เสร็จสิ้นแล้ว (Completed)"
          value={completedCount}
          subtitle="อัปโหลดผลตรวจ & ใบเสร็จครบ"
          icon={CheckCircle2}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-700"
          trend={{ value: '100% ตรงเวลา', isPositive: true }}
        />
      </div>

      {activeSubTab === 'staff' ? (
        <EscortStaffList />
      ) : (
        <>
          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหานัดหมาย, โรงพยาบาล, ผู้ป่วย, หรือแพทย์..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'confirmed', label: 'ยืนยันแล้ว' },
                { id: 'in_progress', label: 'กำลังพบแพทย์' },
                { id: 'completed', label: 'เสร็จสิ้น' }
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

          {/* Appointments Grid */}
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
              <Calendar className="w-12 h-12 mx-auto text-gray-300 stroke-1 mb-2" />
              <h3 className="text-base font-bold text-gray-800">ไม่พบรายการนัดหมายที่ตรงตามเงื่อนไข</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAppointments.map(apt => {
                const isCompleted = apt.status === 'completed';
                const isInProgress = apt.status === 'in_progress';
                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className="group bg-white rounded-3xl border border-gray-100 hover:border-sage-300 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-sage-50 text-sage-900 border border-sage-200">
                          {apt.appointmentNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' :
                          isInProgress ? 'bg-blue-100 text-blue-800 animate-pulse' : 'bg-amber-100 text-amber-800'
                        }`}>
                          ● {apt.status}
                        </span>
                      </div>

                      {/* Patient & Date */}
                      <div className="flex items-center gap-3.5 mt-4">
                        <img
                          src={apt.patientAvatar}
                          alt=""
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-sage-800 transition-colors truncate">
                            {apt.patientName}
                          </h3>
                          <p className="text-xs text-sage-900 font-semibold mt-0.5">
                            📅 {apt.dateTime} น.
                          </p>
                        </div>
                      </div>

                      {/* Hospital Details */}
                      <div className="mt-4 p-3 rounded-xl bg-cream-50 border border-cream-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-gray-800">
                          <Building2 className="w-3.5 h-3.5 text-sage-700 shrink-0" />
                          <span className="truncate">{apt.hospitalName}</span>
                        </div>
                        <p className="text-gray-600 pl-5 truncate">
                          {apt.department} • {apt.doctorName}
                        </p>
                      </div>

                      {/* Escort Staff assignment info */}
                      <div className="mt-3 pt-2 text-xs flex items-center justify-between">
                        <span className="text-gray-500">พนักงาน Escort:</span>
                        {apt.escortStaffName ? (
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            <span>🚗 {apt.escortStaffName.split(' ')[0]}</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMatchingAppointment(apt);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs hover:bg-amber-600 transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>จับคู่พนักงาน</span>
                          </button>
                        )}
                      </div>

                      {/* Doctor Questions Preview */}
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3 text-amber-600" />
                          <span>คำถามแพทย์ ({apt.preAppointmentBriefing.questionsChecklist.length})</span>
                        </span>
                        {isCompleted && (
                          <span className="text-emerald-700 font-bold">✓ แนบใบเสร็จแล้ว</span>
                        )}
                      </div>
                    </div>

                    {/* Drilldown Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400 text-[11px]">คลิกดูแฟ้ม Pre-briefing</span>
                      <span className="font-bold text-sage-800 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        <span>เปิดแฟ้ม</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Job Matching Modal */}
      {matchingAppointment && (
        <JobMatchingModal
          appointment={matchingAppointment}
          onClose={() => setMatchingAppointment(null)}
        />
      )}
    </div>
  );
};
