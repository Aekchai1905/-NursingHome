import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Patient, PatientCareType, ClientServiceStatus } from '../../types';
import { 
  Building2, 
  Car, 
  Home, 
  Sparkles, 
  Play, 
  Pause, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  HeartPulse, 
  Phone, 
  UserCheck, 
  Stethoscope,
  Clock,
  UserX
} from 'lucide-react';

interface ClientScrollingShowcaseProps {
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onOpenStatusModal?: (patient: Patient) => void;
  onOpenHistoryModal?: (patient: Patient) => void;
}

export const ClientScrollingShowcase: React.FC<ClientScrollingShowcaseProps> = ({
  patients,
  onSelectPatient,
  onOpenStatusModal,
  onOpenHistoryModal,
}) => {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<'normal' | 'slow' | 'fast'>('normal');

  // If no patients match the filter
  if (!patients || patients.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE2D3] shadow-xs">
        <p className="text-sm font-bold text-gray-500">ไม่พบข้อมูลลูกค้าตามเงื่อนไขที่เลือก</p>
      </div>
    );
  }

  // Speed durations (seconds)
  const speedDurations = {
    normal: { col1: 22, col2: 28, col3: 25 },
    slow: { col1: 34, col2: 42, col3: 38 },
    fast: { col1: 14, col2: 18, col3: 16 }
  }[speedMultiplier];

  // Distribute patients into 3 columns
  const col1 = patients.filter((_, i) => i % 3 === 0);
  const col2 = patients.filter((_, i) => i % 3 === 1);
  const col3 = patients.filter((_, i) => i % 3 === 2);

  // Fallback if some columns have fewer items
  const normalizedCol1 = col1.length > 0 ? col1 : patients;
  const normalizedCol2 = col2.length > 0 ? col2 : patients;
  const normalizedCol3 = col3.length > 0 ? col3 : patients;

  const renderServiceBadge = (careType: PatientCareType) => {
    switch (careType) {
      case 'nursing_home':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#EAF7F0] text-[#1E7E52] border border-[#BEE7D0]">
            <Building2 className="w-3 h-3 text-[#1E7E52]" />
            <span>Nursing Home</span>
          </span>
        );
      case 'medical_escort':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#EEF5F9] text-[#2B5975] border border-[#C6DEED]">
            <Car className="w-3 h-3 text-[#2B5975]" />
            <span>นัดพบแพทย์ Escort</span>
          </span>
        );
      case 'home_care':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6]">
            <Home className="w-3 h-3 text-[#CF7C4E]" />
            <span>ดูแลที่บ้าน Home Care</span>
          </span>
        );
    }
  };

  const renderStatusBadge = (status: ClientServiceStatus = 'active') => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E7E52] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A3E7C1] animate-pulse" />
            <span>กำลังใช้บริการ</span>
          </span>
        );
      case 'discharged':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2B5975] text-white">
            <span>จำหน่ายแล้ว</span>
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B87A1E] text-white">
            <span>พักบริการ</span>
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9C3E3A] text-white">
            <span>สิ้นสุดบริการ</span>
          </span>
        );
    }
  };

  const renderClientColumn = (clientList: Patient[], duration: number, colClass: string) => {
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
              {clientList.map((patient, itemIndex) => {
                const latestVital = patient.vitalsHistory?.[0];
                const highRiskPrecautions = (patient.carePlan?.precautions || []).filter(p => p.severity === 'high');

                return (
                  <div
                    key={`${groupIndex}-${itemIndex}-${patient.id}`}
                    onClick={() => onSelectPatient(patient.id)}
                    className="relative p-5 rounded-3xl border border-[#EAE2D3] bg-white/95 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-[#CF7C4E]/50 transition-all duration-300 group cursor-pointer hover:-translate-y-1"
                  >
                    {/* Top Bar: HN, Service Badge, Status */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#F4EFE5]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-[#FAF6F0] text-[#142332] border border-[#EAE2D3]">
                          {patient.hn}
                        </span>
                        {renderServiceBadge(patient.careType)}
                      </div>
                      {renderStatusBadge(patient.serviceStatus)}
                    </div>

                    {/* Patient Profile Info */}
                    <div className="flex items-center gap-3.5 my-3.5">
                      <div className="relative shrink-0">
                        <img
                          src={patient.avatar}
                          alt={patient.thaiName}
                          className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#EAE2D3] shadow-2xs group-hover:ring-[#CF7C4E] transition-all"
                        />
                        <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          patient.healthStatus === 'stable'
                            ? 'bg-emerald-500'
                            : patient.healthStatus === 'monitor'
                            ? 'bg-amber-500'
                            : 'bg-rose-500 animate-pulse'
                        }`} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-extrabold text-[#142332] truncate font-heading group-hover:text-[#CF7C4E] transition-colors">
                            {patient.thaiName}
                          </h4>
                          <span className="text-xs font-bold text-[#7D8C85] shrink-0">
                            ({patient.age} ปี)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C6B64] truncate mt-0.5">
                          {patient.roomBed ? `ห้อง/เตียง: ${patient.roomBed}` : patient.address || 'ที่พักผู้ป่วย'}
                        </p>
                      </div>
                    </div>

                    {/* Vitals / Health Ticker */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] text-xs">
                      <div>
                        <span className="text-[10px] text-[#7D8C85] font-semibold block">ความดัน / ชีพจร</span>
                        <span className="font-extrabold text-[#1A2E25]">
                          {latestVital ? `${latestVital.sys}/${latestVital.dia} (${latestVital.pulse})` : '120/80 (75)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#7D8C85] font-semibold block">ผู้ดูแลหลัก</span>
                        <span className="font-bold text-[#1A2E25] truncate block">
                          {patient.primaryCaregiverName || 'ทีมพยาบาลเวร'}
                        </span>
                      </div>
                    </div>

                    {/* High Risk Alerts Pill */}
                    {highRiskPrecautions.length > 0 && (
                      <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-[10px] font-bold text-rose-800">
                        <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
                        <span className="truncate">{highRiskPrecautions.map(p => p.label).join(', ')}</span>
                      </div>
                    )}

                    {/* Card Footer: Action Arrow */}
                    <div className="mt-3 pt-2.5 border-t border-[#F4EFE5] flex items-center justify-between text-xs text-[#CF7C4E] font-bold group-hover:text-[#9E4E28] transition-colors">
                      <span className="text-[11px]">คลิกดูแฟ้มประวัติ & แผนการดูแล</span>
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
            <span>โหมดแอนิเมชันเลื่อนขึ้น (Auto-Scroll Showcase)</span>
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
            ชี้เมาส์ (Hover) ที่การ์ดเพื่อหยุดอ่าน • คลิกการ์ดเพื่อเปิดดูแฟ้มประวัติเต็ม
          </span>
        </div>

        {/* 1 Row Height Scroll Area with Top/Bottom Gradient Mask */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[380px] overflow-hidden py-2">
          {renderClientColumn(normalizedCol1, speedDurations.col1, "w-full max-w-[370px]")}
          {renderClientColumn(normalizedCol2, speedDurations.col2, "hidden md:block w-full max-w-[370px]")}
          {renderClientColumn(normalizedCol3, speedDurations.col3, "hidden lg:block w-full max-w-[370px]")}
        </div>
      </div>
    </div>
  );
};

export default ClientScrollingShowcase;
