import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  HeartHandshake, 
  Bell, 
  Smartphone, 
  Monitor, 
  UserCheck, 
  Globe, 
  ShieldCheck, 
  Stethoscope, 
  Car, 
  Heart, 
  Users,
  Sparkles 
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const Header: React.FC = () => {
  const { 
    currentRole, 
    setCurrentRole, 
    viewMode, 
    setViewMode, 
    language, 
    setLanguage, 
    unreadNotifCount,
    setActiveTab 
  } = useApp();

  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleRoleSelect = (roleKey: UserRole) => {
    setCurrentRole(roleKey);
    if (roleKey === 'family') {
      setActiveTab('customer_portal');
    } else if (roleKey === 'caregiver' || roleKey === 'doctor') {
      setActiveTab('staff_portal');
    } else {
      setActiveTab('patients');
    }
  };

  const roleConfigs: Record<UserRole, { label: string; icon: React.ReactNode; desc: string; badge: string }> = {
    admin: {
      label: 'Admin (ผู้ดูแลระบบ)',
      icon: <ShieldCheck className="w-4 h-4 text-purple-600" />,
      desc: 'จัดการระบบและผู้ใช้งานทั้งหมด',
      badge: 'bg-purple-100 text-purple-800'
    },
    care_manager: {
      label: 'Care Manager (ผู้จัดการการดูแล)',
      icon: <Users className="w-4 h-4 text-teal-600" />,
      desc: 'จัดสรรงาน ตารางนัดหมาย และติดตามผู้ป่วย',
      badge: 'bg-teal-100 text-teal-800'
    },
    doctor: {
      label: 'Doctor / Medical Staff (แพทย์/พยาบาล)',
      icon: <Stethoscope className="w-4 h-4 text-blue-600" />,
      desc: 'ประเมินสุขภาพ Care Plan และคำสั่งการรักษา',
      badge: 'bg-blue-100 text-blue-800'
    },
    caregiver: {
      label: 'Caregiver (ผู้ดูแลประจำบ้าน/หอพัก)',
      icon: <Heart className="w-4 h-4 text-emerald-600" />,
      desc: 'บันทึกสัญญาณชีพ กิจวัตร GPS Check-in',
      badge: 'bg-emerald-100 text-emerald-800'
    },
    escort: {
      label: 'Medical Escort (พนักงานพาพบแพทย์)',
      icon: <Car className="w-4 h-4 text-amber-600" />,
      desc: 'แฟ้มสรุปก่อนพบแพทย์ และบันทึกผลตรวจ',
      badge: 'bg-amber-100 text-amber-800'
    },
    family: {
      label: 'Family / Patient (ญาติและผู้ป่วย)',
      icon: <UserCheck className="w-4 h-4 text-rose-600" />,
      desc: 'ติดตามรายงานสุขภาพและฝากคำถามแพทย์',
      badge: 'bg-rose-100 text-rose-800'
    }
  };

  const activeRoleConfig = roleConfigs[currentRole];

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#EAE2D3] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#23382E] text-white flex items-center justify-center shadow-md">
              <HeartHandshake className="w-5 h-5 text-[#E5EDE8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-[#1A2E25] font-heading">
                  CareNest
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#CF7C4E] text-white shadow-xs">
                  Care Platform
                </span>
              </div>
              <p className="text-[11px] text-[#5C6B64] hidden md:block">
                Patient Health & Home Caregiver Ecosystem
              </p>
            </div>
          </div>

          {/* Right Controls: View Switcher, Role Selector, Notifications, Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Testimonials Showcase Quick Button */}
            <button
              onClick={() => {
                setActiveTab('testimonials');
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF6F0] hover:bg-[#F4EFE5] text-[#23382E] border border-[#EAE2D3] hover:border-[#CF7C4E] shadow-2xs transition-all cursor-pointer hover:scale-102"
              title="ดูเสียงตอบรับและความประทับใจ / View Testimonials & Trust"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>ความประทับใจ (Reviews)</span>
              <span className="w-2 h-2 rounded-full bg-[#2A9D68] animate-pulse" />
            </button>

            {/* View Mode Toggle: Desktop vs Mobile */}
            <div className="bg-[#F4EFE5] p-1 rounded-2xl flex items-center border border-[#EAE2D3]">
              <button
                onClick={() => setViewMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#3D4C44] hover:text-[#1A2E25] hover:bg-white'
                }`}
                title="Desktop Web Admin Dashboard"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Web Admin</span>
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#3D4C44] hover:text-[#1A2E25] hover:bg-white'
                }`}
                title="Mobile Application Simulator"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile App</span>
              </button>
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-gray-700 transition-all shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:inline text-gray-500">บทบาท:</span>
                <span className="font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-[160px]">
                  {activeRoleConfig.label.split(' ')[0]}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeRoleConfig.badge}`}>
                  RBAC
                </span>
              </button>

              {showRoleMenu && (
                <div 
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-soft-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setShowRoleMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      สลับบทบาทผู้ใช้งาน (Switch Role)
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      ทดสอบมุมมองและสิทธิ์การเข้าถึงในระบบ
                    </p>
                  </div>
                  <div className="p-1">
                    {(Object.keys(roleConfigs) as UserRole[]).map(roleKey => {
                      const item = roleConfigs[roleKey];
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => handleRoleSelect(roleKey)}
                          className={`w-full text-left p-2.5 rounded-xl flex items-start gap-2.5 transition-colors ${
                            isSelected ? 'bg-sage-50 text-sage-900 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">{item.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs flex items-center justify-between">
                              <span>{item.label}</span>
                              {isSelected && <span className="text-[10px] text-sage-700">● Active</span>}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
              className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-1 shadow-xs"
              title="สลับภาษา / Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifDrawer(true)}
              className="relative p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-cream-200 transition-colors"
              title="การแจ้งเตือน"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      {showNotifDrawer && (
        <NotificationDrawer onClose={() => setShowNotifDrawer(false)} />
      )}
    </>
  );
};
