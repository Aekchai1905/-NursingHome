import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  Car, 
  Home, 
  FileCheck2, 
  Activity, 
  Layers,
  Users,
  UserCheck,
  Stethoscope,
  ClipboardList,
  Contact2,
  BarChart3,
  MessageSquareHeart,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedPatientId, setSelectedCaregiverId, setSelectedAppointmentId, setSelectedStaffId } = useApp();

  const handleTabChange = (tab: 'all_clients' | 'patients' | 'appointments' | 'caregivers' | 'reports' | 'staff' | 'customer_portal' | 'staff_portal' | 'testimonials') => {
    setActiveTab(tab);
    // Reset selections on main tab switch to return to Level 1 List
    setSelectedPatientId(null);
    setSelectedCaregiverId(null);
    setSelectedAppointmentId(null);
    setSelectedStaffId(null);
  };

  const navItems = [
    {
      id: 'all_clients' as const,
      label: 'All Patients Summary',
      thaiLabel: '1. สรุปรายชื่อผู้ป่วยทั้งหมด',
      fullThaiLabel: '1. สรุปรายชื่อผู้ป่วยทั้งหมด (All Patients Master)',
      desc: 'สรุปสถานะ, ผู้ดูแล, ข้อควรระวัง, บันทึกสุขภาพ',
      icon: Users,
      badge: 'ผู้ป่วย'
    },
    {
      id: 'staff' as const,
      label: 'Staff Roster Summary',
      thaiLabel: '2. สรุปรายชื่อพนักงาน',
      fullThaiLabel: '2. สรุปรายชื่อพนักงาน (Staff Roster)',
      desc: 'สถานะว่าง/ติดเคส, ตำแหน่ง, จัดสรรผู้ดูแล',
      icon: Contact2,
      badge: 'พนักงาน'
    },
    {
      id: 'appointments' as const,
      label: 'Task & Escort Tracking',
      thaiLabel: '3. สรุปรายงานติดตามงาน',
      fullThaiLabel: '3. สรุปรายงานติดตามงาน (3.1 ปฏิทินนัดหมอ & 3.2 กราฟคนว่าง)',
      desc: 'ปฏิทินนัดหมอ (คนไป, พาไป, คำถาม) & กราฟคนว่าง',
      icon: Activity,
      badge: 'ติดตามงาน'
    },
    {
      id: 'reports' as const,
      label: 'Executive Reports & Analytics',
      thaiLabel: '4. รายงานสรุปในแต่ละเรื่อง',
      fullThaiLabel: '4. รายงานสรุปในแต่ละเรื่อง (4.1 ยอดลูกค้า & 4.2 ยอดพนักงาน: วัน/เดือน/ปี)',
      desc: 'เลือกช่วงเวลา (วัน, เดือน, ปี) สรุปยอดลูกค้า & พนักงาน',
      icon: BarChart3,
      badge: 'รายงาน'
    },
    {
      id: 'testimonials' as const,
      label: 'Testimonials & Trust',
      thaiLabel: '5. ความประทับใจ & รีวิว',
      fullThaiLabel: '5. เสียงตอบรับและความประทับใจ (Testimonials & Trust)',
      desc: 'แอนิเมชันรีวิว 3 มิติ, คะแนนความพึงพอใจ, เสียงจากญาติและแพทย์',
      icon: MessageSquareHeart,
      badge: 'รีวิว'
    }
  ];

  return (
    <div className="bg-white border-b border-[#EAE2D3] shadow-xs sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 py-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = 
              (item.id === 'all_clients' && (activeTab === 'all_clients' || activeTab === 'patients')) ||
              (item.id === 'staff' && activeTab === 'staff') ||
              (item.id === 'appointments' && activeTab === 'appointments') ||
              (item.id === 'reports' && (activeTab === 'reports' || activeTab === 'analytics')) ||
              (item.id === 'testimonials' && activeTab === 'testimonials');

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`group relative flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive 
                    ? 'bg-[#23382E] text-white border-[#1A2E25] shadow-md ring-2 ring-[#CF7C4E]/40 scale-[1.01]' 
                    : 'bg-[#FAF6F0] hover:bg-[#F4EFE5] text-[#1A2E25] border-[#EAE2D3] hover:border-[#CF7C4E]/50 shadow-2xs'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                  isActive ? 'bg-[#CF7C4E] text-white' : 'bg-white text-[#23382E] border border-[#EAE2D3] group-hover:border-[#CF7C4E]'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs sm:text-sm font-extrabold leading-tight truncate font-heading ${
                      isActive ? 'text-white' : 'text-[#142332]'
                    }`}>
                      {item.thaiLabel}
                    </p>
                  </div>
                  <p className={`text-[11px] leading-snug mt-1 line-clamp-2 ${
                    isActive ? 'text-[#C8DCD1]' : 'text-[#5C6B64]'
                  }`}>
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
