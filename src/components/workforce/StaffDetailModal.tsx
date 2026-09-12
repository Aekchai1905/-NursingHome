import React, { useState } from 'react';
import { UnifiedStaffMember, UnifiedStaffStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { EditStaffModal } from './EditStaffModal';
import { 
  X, 
  Phone, 
  Mail, 
  Award, 
  Briefcase, 
  MapPin, 
  Star, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Building2, 
  Home, 
  FileText,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Edit3,
  MessageSquare,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';

interface StaffDetailModalProps {
  staffMember: UnifiedStaffMember;
  onClose: () => void;
  onEdit?: (member: UnifiedStaffMember) => void;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({ staffMember, onClose, onEdit }) => {
  const { updateStaffStatus, staff } = useApp();
  const [showEditModal, setShowEditModal] = useState(false);
  const [copiedLine, setCopiedLine] = useState(false);

  // Get freshest data from context in case it was updated
  const currentMember = staff.find(s => s.id === staffMember.id) || staffMember;

  const handleStatusChange = (newStatus: UnifiedStaffStatus) => {
    updateStaffStatus(currentMember.id, newStatus);
  };

  const handleCopyLine = () => {
    if (currentMember.lineId) {
      navigator.clipboard.writeText(currentMember.lineId);
      setCopiedLine(true);
      setTimeout(() => setCopiedLine(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header with Cover */}
          <div className="relative bg-gradient-to-r from-sage-800 to-sage-950 p-6 text-white">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => onEdit ? onEdit(currentMember) : setShowEditModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all backdrop-blur-xs cursor-pointer"
                title="แก้ไขข้อมูลพนักงานท่านนี้"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>แก้ไขข้อมูล</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <img
                  src={currentMember.avatar}
                  alt={currentMember.thaiName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
                />
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                  currentMember.status === 'available' ? 'bg-emerald-500' : currentMember.status === 'working' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
              </div>

              <div className="text-center sm:text-left flex-1 pr-16">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white/20 text-cream-200">
                    {currentMember.code}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                    currentMember.category === 'nursing_home_escort' 
                      ? 'bg-cream-100 text-sage-900' 
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {currentMember.category === 'nursing_home_escort' ? '🏢 กลุ่มที่ 1: Nursing Home & Escort' : '🏡 กลุ่มที่ 2: Home Caregiver'}
                  </span>
                </div>

                <h2 className="text-xl font-extrabold mt-1.5 font-serif">
                  {currentMember.thaiName} {currentMember.nickname && `(${currentMember.nickname})`}
                </h2>
                <p className="text-xs text-cream-200 font-medium">{currentMember.subRole}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-cream-300">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <strong className="text-white">{currentMember.rating}</strong> (จาก {currentMember.totalCases} เคส)
                  </span>
                  <span>•</span>
                  <span>ประสบการณ์ {currentMember.experienceYears} ปี</span>
                  <span>•</span>
                  <span>อายุ {currentMember.age} ปี</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Quick Status Control Bar */}
            <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-sage-900 block">สถานะความพร้อมปัจจุบัน:</span>
                <p className="text-[11px] text-gray-500 mt-0.5">คลิกเปลี่ยนสถานะเพื่อแจ้งระบบและทีมจัดคิวงาน</p>
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStatusChange('available')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentMember.status === 'available'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 border border-gray-200'
                  }`}
                >
                  🟢 ว่าง / พร้อมรับงาน
                </button>
                <button
                  onClick={() => handleStatusChange('working')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentMember.status === 'working'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700 border border-gray-200'
                  }`}
                >
                  🟡 กำลังติดเคส
                </button>
                <button
                  onClick={() => handleStatusChange('leave')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentMember.status === 'leave'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-700 border border-gray-200'
                  }`}
                >
                  🔴 ลางาน
                </button>
              </div>
            </div>

            {/* Current Assignment Section */}
            {currentMember.currentAssignment ? (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    งาน / ผู้ป่วยที่ดูแลอยู่ขณะนี้ (Active Assignment)
                  </span>
                  {currentMember.currentAssignment.startTime && (
                    <span className="font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                      เริ่มงาน: {currentMember.currentAssignment.startTime}
                    </span>
                  )}
                </div>
                <div className="font-bold text-gray-900 text-sm mt-1">
                  ผู้ป่วย: {currentMember.currentAssignment.patientName}
                </div>
                <p className="text-gray-600">
                  📍 สถานที่: <strong>{currentMember.currentAssignment.locationOrRoom}</strong>
                </p>
                {currentMember.currentAssignment.details && (
                  <p className="text-gray-500 italic mt-0.5">
                    "{currentMember.currentAssignment.details}"
                  </p>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs flex items-center gap-2 text-emerald-900 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>พนักงานท่านนี้ว่าง ไม่มีเคสค้าง สามารถมอบหมายเคสผู้ป่วยใหม่หรือทริปพาพบแพทย์ได้ทันที</span>
              </div>
            )}

            {/* Contact Information (Phone, LINE ID, Email) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Phone */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sage-100 text-sage-800 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block">เบอร์โทรศัพท์</span>
                  <a href={`tel:${currentMember.phone}`} className="font-bold text-gray-900 hover:text-sage-800 block truncate">
                    {currentMember.phone}
                  </a>
                </div>
              </div>

              {/* LINE ID */}
              <div className="p-3 rounded-2xl bg-[#06C755]/10 border border-[#06C755]/25 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#06C755] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    LINE
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] text-[#0B6830] font-semibold block">LINE ID</span>
                    <span className="font-bold text-[#0B6830] block truncate">
                      {currentMember.lineId || 'ไม่ได้ระบุ'}
                    </span>
                  </div>
                </div>
                {currentMember.lineId && (
                  <button
                    type="button"
                    onClick={handleCopyLine}
                    className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-[#0B6830] transition-colors shrink-0 cursor-pointer shadow-2xs"
                    title="คัดลอก LINE ID"
                  >
                    {copiedLine ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Email */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sage-100 text-sage-800 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-gray-400 block">อีเมล</span>
                  <span className="font-bold text-gray-900 block truncate" title={currentMember.email}>
                    {currentMember.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Education & Standard Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentMember.education && (
                <div className="p-3.5 rounded-2xl bg-cream-50/50 border border-cream-200 text-xs space-y-1">
                  <span className="font-bold text-sage-900 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-sage-700" />
                    วุฒิการศึกษา / สถาบัน
                  </span>
                  <p className="text-gray-700">{currentMember.education}</p>
                </div>
              )}

              {currentMember.standardRate && (
                <div className="p-3.5 rounded-2xl bg-cream-50/50 border border-cream-200 text-xs space-y-1">
                  <span className="font-bold text-sage-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
                    อัตราค่าบริการมาตรฐาน
                  </span>
                  <p className="text-sage-900 font-extrabold text-sm">{currentMember.standardRate}</p>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div>
              <h4 className="text-xs font-bold text-sage-900 mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                ใบรับรองวิชาชีพ & ใบประกาศนียบัตร (Certifications)
              </h4>
              <div className="space-y-1.5">
                {currentMember.certifications.map((cert, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-gray-200 text-xs flex items-center gap-2 text-gray-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Skills */}
            <div>
              <h4 className="text-xs font-bold text-sage-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                ทักษะและความชำนาญเฉพาะทาง (Special Skills)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {currentMember.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-medium bg-sage-50 text-sage-900 border border-sage-200">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Service Areas */}
            {currentMember.serviceAreas && currentMember.serviceAreas.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-sage-900 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  พื้นที่ให้บริการประจำ (Service Areas)
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {currentMember.serviceAreas.map((area, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs bg-gray-100 text-gray-700">
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {currentMember.notes && (
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-600 italic">
                หมายเหตุ: "{currentMember.notes}"
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-cream-50/40 flex items-center justify-between gap-3">
            <button
              onClick={() => onEdit ? onEdit(currentMember) : setShowEditModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-cream-100 text-sage-900 border border-cream-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>แก้ไขข้อมูลทั้งหมด</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>

        </div>
      </div>

      {/* Edit Staff Modal */}
      {showEditModal && (
        <EditStaffModal
          staffMember={currentMember}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

