import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UnifiedStaffMember, UnifiedStaffStatus } from '../../types';
import { 
  Building2, 
  Home, 
  Car, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight, 
  Star, 
  Phone, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageCircle,
  Users
} from 'lucide-react';

interface StaffScrollingShowcaseProps {
  staff: UnifiedStaffMember[];
  onSelectStaff: (staff: UnifiedStaffMember) => void;
  onUpdateStatus?: (staffId: string, status: UnifiedStaffStatus) => void;
}

export const StaffScrollingShowcase: React.FC<StaffScrollingShowcaseProps> = ({
  staff,
  onSelectStaff,
  onUpdateStatus,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<'normal' | 'slow' | 'fast'>('normal');

  // If no staff match the filter
  if (!staff || staff.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE2D3] shadow-xs">
        <p className="text-sm font-bold text-gray-500">ไม่พบข้อมูลพนักงานตามเงื่อนไขที่เลือก</p>
      </div>
    );
  }

  // Speed durations (seconds)
  const speedDurations = {
    normal: { col1: 22, col2: 28, col3: 25 },
    slow: { col1: 34, col2: 42, col3: 38 },
    fast: { col1: 14, col2: 18, col3: 16 }
  }[speedMultiplier];

  // Distribute staff into 3 columns
  const col1 = staff.filter((_, i) => i % 3 === 0);
  const col2 = staff.filter((_, i) => i % 3 === 1);
  const col3 = staff.filter((_, i) => i % 3 === 2);

  const normalizedCol1 = col1.length > 0 ? col1 : staff;
  const normalizedCol2 = col2.length > 0 ? col2 : staff;
  const normalizedCol3 = col3.length > 0 ? col3 : staff;

  const renderStaffColumn = (staffList: UnifiedStaffMember[], duration: number, colClass: string) => {
    return (
      <div className={`relative overflow-hidden ${colClass}`}>
        <motion.div
          animate={isPaused ? { translateY: "0%" } : { translateY: "-50%" }}
          transition={{
            duration: duration || 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
          className="flex flex-col gap-5 pb-5"
        >
          {[...new Array(2)].fill(0).map((_, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {staffList.map((member, itemIndex) => {
                const isGroup1 = member.category === 'nursing_home_escort';
                const isAvailable = member.status === 'available';
                const isWorking = member.status === 'working';

                return (
                  <div
                    key={`${groupIndex}-${itemIndex}-${member.id}`}
                    onClick={() => onSelectStaff(member)}
                    className="relative p-5 rounded-3xl border border-[#EAE2D3] bg-white/95 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-[#CF7C4E]/50 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                  >
                    {/* Top Header: Code, Group & Live Status */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F4EFE5]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#142332] border border-[#EAE2D3]">
                          {member.code}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isGroup1 
                            ? 'bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0]' 
                            : 'bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6]'
                        }`}>
                          {isGroup1 ? '🏢 ศูนย์ & Escort' : '🏡 ดูแลที่บ้าน'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                        isAvailable 
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                          : isWorking 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isAvailable ? 'bg-emerald-600 animate-pulse' : isWorking ? 'bg-amber-600' : 'bg-rose-600'
                        }`} />
                        <span>{isAvailable ? 'ว่างพร้อมงาน' : isWorking ? 'ติดเคส' : 'ลางาน'}</span>
                      </span>
                    </div>

                    {/* Profile Row: Avatar, Name, Role */}
                    <div className="flex items-center gap-3.5 my-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={member.avatar}
                          alt={member.thaiName}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#EAE2D3] shadow-2xs group-hover:ring-[#CF7C4E] transition-all"
                        />
                        <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 bg-amber-400 text-[#142332] text-[9px] font-extrabold px-1 py-0.2 rounded-md shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{member.rating}</span>
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-extrabold text-[#142332] truncate font-heading group-hover:text-[#CF7C4E] transition-colors">
                            {member.thaiName}
                          </h4>
                          {member.nickname && (
                            <span className="text-xs font-bold text-[#CF7C4E]">
                              ({member.nickname})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5C6B64] font-medium truncate mt-0.5">
                          {member.subRole}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats: Experience, Total Cases, Line */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] text-xs">
                      <div>
                        <span className="text-[10px] text-[#7D8C85] font-semibold block">ประสบการณ์ / เคส</span>
                        <span className="font-extrabold text-[#1A2E25]">
                          {member.experienceYears} ปี ({member.totalCases} เคส)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7D8C85] font-semibold block">เคสปัจจุบัน</span>
                        <span className="font-bold text-[#1A2E25] truncate block">
                          {member.currentAssignment?.patientName || (isAvailable ? 'พร้อมรับงานใหม่' : 'พักเวร')}
                        </span>
                      </div>
                    </div>

                    {/* Footer: Action Arrow */}
                    <div className="mt-3 pt-2.5 border-t border-[#F4EFE5] flex items-center justify-between text-xs text-[#CF7C4E] font-bold group-hover:text-[#9E4E28] transition-colors">
                      <span className="text-[11px]">คลิกดูโปรไฟล์ & ประวัติงาน</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#142332] bg-white px-3 py-1.5 rounded-xl border border-[#EAE2D3] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#CF7C4E]" />
            <span>โหมดแอนิเมชันเลื่อนขึ้น (Staff Auto-Scroll Showcase)</span>
          </span>
          <span className="text-xs text-[#5C6B64] hidden sm:inline">
            แสดงผลแถวเดี่ยว เลื่อนขึ้นต่อเนื่องอัตโนมัติ
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPaused
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-2xs'
            }`}
            title={isPaused ? 'เริ่มเลื่อนต่อ (Resume Scroll)' : 'หยุดการเลื่อนชั่วคราว (Pause Scroll)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'เล่นต่อ' : 'หยุดชั่วคราว'}</span>
          </button>

          {/* Speed Toggle */}
          <div className="bg-white p-1 rounded-xl flex items-center border border-[#EAE2D3] shadow-2xs">
            {(['slow', 'normal', 'fast'] as const).map(s => (
              <button
                type="button"
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  speedMultiplier === s
                    ? 'bg-[#23382E] text-white shadow-2xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                {s === 'slow' ? 'ช้า' : s === 'normal' ? 'ปกติ' : 'เร็ว'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1-Row Visible Viewport Container with Gradient Mask */}
      <div 
        className="relative bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] rounded-3xl border border-[#EAE2D3] p-4 sm:p-6 shadow-xs overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-[#7D8C85] bg-white px-3 py-0.5 rounded-full border border-[#EAE2D3] shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D68] animate-ping" />
            ชี้เมาส์ (Hover) ที่การ์ดเพื่อหยุดอ่าน • คลิกการ์ดเพื่อดูข้อมูลและจัดการสถานะ
          </span>
        </div>

        {/* 1 Row Height Scroll Area with Top/Bottom Gradient Mask */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[380px] overflow-hidden py-2">
          {renderStaffColumn(normalizedCol1, speedDurations.col1, "w-full max-w-[370px]")}
          {renderStaffColumn(normalizedCol2, speedDurations.col2, "hidden md:block w-full max-w-[370px]")}
          {renderStaffColumn(normalizedCol3, speedDurations.col3, "hidden lg:block w-full max-w-[370px]")}
        </div>
      </div>
    </div>
  );
};

export default StaffScrollingShowcase;
