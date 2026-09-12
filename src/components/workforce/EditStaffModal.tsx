import React, { useState, useRef } from 'react';
import { UnifiedStaffMember, StaffCategory, UnifiedStaffStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Save, 
  User, 
  Building2, 
  Home, 
  Phone, 
  Mail, 
  Award, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  Camera, 
  Upload, 
  Check, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Star, 
  GraduationCap, 
  MapPin, 
  MessageSquare,
  MessageCircle,
  FileText
} from 'lucide-react';

interface EditStaffModalProps {
  staffMember: UnifiedStaffMember;
  onClose: () => void;
  onSaved?: (updated: UnifiedStaffMember) => void;
}

const sampleAvatars = [
  { url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80', label: 'บริบาล/พยาบาล 1' },
  { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80', label: 'พยาบาลวิชาชีพ 2' },
  { url: 'https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80', label: 'บริบาลหญิง 3' },
  { url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80', label: 'ผู้ช่วยพยาบาล 4' },
  { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80', label: 'นักกายภาพ 5' },
  { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', label: 'Escort ชาย 1' },
  { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', label: 'Escort ชาย 2' },
  { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80', label: 'Caregiver ชาย 3' },
  { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', label: 'Trainer ชาย 4' },
  { url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80', label: 'Driver ชาย 5' },
];

export const EditStaffModal: React.FC<EditStaffModalProps> = ({ staffMember, onClose, onSaved }) => {
  const { updateStaffMember, patients } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<'basic' | 'role' | 'contact' | 'assignment' | 'skills'>('basic');

  // Form States
  const [avatar, setAvatar] = useState(staffMember.avatar);
  const [thaiName, setThaiName] = useState(staffMember.thaiName);
  const [name, setName] = useState(staffMember.name);
  const [nickname, setNickname] = useState(staffMember.nickname || '');
  const [code, setCode] = useState(staffMember.code);
  const [gender, setGender] = useState<'male' | 'female'>(staffMember.gender);
  const [age, setAge] = useState(staffMember.age);

  // Category & Role
  const [category, setCategory] = useState<StaffCategory>(staffMember.category);
  const [subRole, setSubRole] = useState(staffMember.subRole);
  const [standardRate, setStandardRate] = useState(staffMember.standardRate || '');
  const [education, setEducation] = useState(staffMember.education || '');
  const [experienceYears, setExperienceYears] = useState(staffMember.experienceYears);
  const [rating, setRating] = useState(staffMember.rating);
  const [totalCases, setTotalCases] = useState(staffMember.totalCases);

  // Contact Info & LINE ID
  const [phone, setPhone] = useState(staffMember.phone);
  const [lineId, setLineId] = useState(staffMember.lineId || '');
  const [email, setEmail] = useState(staffMember.email);

  // Status & Assignment
  const [status, setStatus] = useState<UnifiedStaffStatus>(staffMember.status);
  const [assignedPatientName, setAssignedPatientName] = useState(staffMember.currentAssignment?.patientName || '');
  const [assignedLocation, setAssignedLocation] = useState(staffMember.currentAssignment?.locationOrRoom || '');
  const [assignedDetails, setAssignedDetails] = useState(staffMember.currentAssignment?.details || '');
  const [assignedStartTime, setAssignedStartTime] = useState(staffMember.currentAssignment?.startTime || '08:00 น.');
  const [assignedType, setAssignedType] = useState<'nursing_home_patient' | 'escort_trip' | 'home_care_patient'>(
    staffMember.currentAssignment?.type || (staffMember.category === 'nursing_home_escort' ? 'nursing_home_patient' : 'home_care_patient')
  );

  // Skills, Certs, Areas, Notes
  const [skillsText, setSkillsText] = useState(staffMember.skills.join(', '));
  const [certsText, setCertsText] = useState(staffMember.certifications.join(', '));
  const [serviceAreasText, setServiceAreasText] = useState((staffMember.serviceAreas || []).join(', '));
  const [notes, setNotes] = useState(staffMember.notes || '');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (newCat: StaffCategory) => {
    setCategory(newCat);
    if (newCat === 'nursing_home_escort' && category !== 'nursing_home_escort') {
      if (subRole.includes('ดูแลผู้ป่วยที่บ้าน')) {
        setSubRole('พนักงานบริบาลประจำศูนย์ (Nursing Home Care)');
      }
    } else if (newCat === 'home_care' && category !== 'home_care') {
      if (subRole.includes('ประจำศูนย์')) {
        setSubRole('ผู้ดูแลผู้ป่วยที่บ้าน (Home Caregiver)');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thaiName.trim()) return;

    let currentAssignment = undefined;
    if (status === 'working' && (assignedPatientName.trim() || assignedLocation.trim())) {
      currentAssignment = {
        type: assignedType,
        patientName: assignedPatientName.trim() || 'เคสผู้ป่วยที่กำลังปฏิบัติงาน',
        locationOrRoom: assignedLocation.trim() || 'สถานที่ปฏิบัติงาน',
        details: assignedDetails.trim() || undefined,
        startTime: assignedStartTime.trim() || undefined
      };
    }

    const updatedStaffMember: UnifiedStaffMember = {
      ...staffMember,
      code: code.trim() || staffMember.code,
      name: name.trim() || thaiName.trim(),
      thaiName: thaiName.trim(),
      nickname: nickname.trim() || undefined,
      avatar,
      gender,
      age: Number(age),
      phone: phone.trim(),
      lineId: lineId.trim() || undefined,
      email: email.trim(),
      category,
      subRole: subRole.trim(),
      status,
      experienceYears: Number(experienceYears),
      rating: Number(rating),
      totalCases: Number(totalCases),
      currentAssignment,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      certifications: certsText.split(',').map(c => c.trim()).filter(Boolean),
      serviceAreas: serviceAreasText.split(',').map(a => a.trim()).filter(Boolean),
      standardRate: standardRate.trim() || undefined,
      education: education.trim() || undefined,
      notes: notes.trim() || undefined
    };

    updateStaffMember(updatedStaffMember);
    if (onSaved) onSaved(updatedStaffMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#EAE2D3] flex items-center justify-between bg-gradient-to-r from-[#FAF0E6] via-white to-[#FAF6F0] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#CF7C4E] text-white flex items-center justify-center shadow-md shadow-[#CF7C4E]/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#142332] font-heading">
                  แก้ไขข้อมูลพนักงาน (Edit Staff Profile)
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6]">
                  {staffMember.code}
                </span>
              </div>
              <p className="text-xs text-[#5C6B64] mt-0.5 font-medium">
                ปรับปรุงประวัติส่วนตัว, ตำแหน่ง, เบอร์โทร, LINE ID, ทักษะ, และสถานะการปฏิบัติงาน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#FAF6F0]/80 px-6 pt-3 border-b border-[#EAE2D3] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'basic', label: '1. ข้อมูลทั่วไป & รูปภาพ', icon: User },
            { id: 'contact', label: '2. เบอร์โทร & LINE ID', icon: MessageSquare },
            { id: 'role', label: '3. กลุ่มงาน & ตำแหน่ง', icon: Building2 },
            { id: 'assignment', label: '4. สถานะ & เคสที่ดูแล', icon: Briefcase },
            { id: 'skills', label: '5. ทักษะ & ใบรับรอง', icon: Award },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#CF7C4E] text-[#9E4E28] font-extrabold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#CF7C4E]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: BASIC INFO & AVATAR */}
          {/* ========================================================================= */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Photo Section */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3]">
                <label className="block text-xs font-bold text-[#142332] mb-2.5 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#CF7C4E]" />
                  <span>รูปถ่ายประจำตัวพนักงาน (Profile Photo)</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="relative group shrink-0">
                    <img
                      src={avatar}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#CF7C4E] text-white shadow-md hover:bg-[#BE673B] transition-colors cursor-pointer"
                      title="อัปโหลดรูปจากเครื่อง"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2.5 w-full">
                    <span className="text-[11px] text-gray-500 font-medium block">
                      เลือกรูปภาพโปรไฟล์ตัวอย่าง หรืออัปโหลดรูปใหม่:
                    </span>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {sampleAvatars.map((preset, idx) => {
                        const isSelected = avatar === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setAvatar(preset.url)}
                            className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all cursor-pointer ${
                              isSelected 
                                ? 'border-[#CF7C4E] ring-2 ring-[#CF7C4E]/30 scale-105' 
                                : 'border-transparent opacity-70 hover:opacity-100'
                            }`}
                            title={preset.label}
                          >
                            <img src={preset.url} alt="" className="w-full h-full object-cover" />
                            {isSelected && (
                              <span className="absolute inset-0 bg-[#CF7C4E]/40 flex items-center justify-center text-white">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE2D3] bg-white text-xs font-semibold text-[#1A2E25] hover:bg-[#FAF6F0] shadow-2xs cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#5C6B64]" />
                        <span>อัปโหลดรูปภาพจากอุปกรณ์</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Names, Nickname & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาไทย) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={thaiName}
                    onChange={e => setThaiName(e.target.value)}
                    placeholder="เช่น นภาพร ใจอารีย์"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E] font-bold text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ชื่อเล่น (Nickname)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="เช่น ก้อย, เมย์, บาส"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="เช่น Naphaporn Jai-aree"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    รหัสพนักงาน (Staff Code) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#CF7C4E] bg-gray-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    เพศ & อายุ
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as any)}
                      className="w-1/2 px-2.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E] bg-white font-medium"
                    >
                      <option value="female">หญิง</option>
                      <option value="male">ชาย</option>
                    </select>
                    <input
                      type="number"
                      value={age}
                      onChange={e => setAge(Number(e.target.value))}
                      placeholder="อายุ"
                      className="w-1/2 px-2.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                      min={18}
                      max={75}
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CONTACT & LINE ID */}
          {/* ========================================================================= */}
          {activeTab === 'contact' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Highlight LINE ID Card */}
              <div className="p-4 rounded-2xl bg-[#06C755]/10 border border-[#06C755]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#06C755] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                    <span className="text-xs font-bold">LINE</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0B6830]">
                      LINE ID สำหรับติดต่อสื่อสารงานและส่งเคส
                    </h3>
                    <p className="text-[11px] text-[#0B6830]/80">
                      ระบุ LINE ID หรือ Line Phone เพื่อให้ทีมและครอบครัวสามารถติดต่อได้สะดวก
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={lineId}
                    onChange={e => setLineId(e.target.value)}
                    placeholder="เช่น @arunee_care หรือ 0874432211"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#06C755]/40 bg-white text-xs font-bold text-[#0B6830] focus:outline-none focus:ring-2 focus:ring-[#06C755]"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#CF7C4E]" />
                    <span>เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="เช่น 087-443-2211"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#2B5975]" />
                    <span>อีเมลติดต่อ (Email)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="เช่น staff@carenest.health"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                  />
                </div>
              </div>

              {/* Notes on communication */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  LINE ID และเบอร์โทรศัพท์ที่บันทึกไว้ จะแสดงบนการ์ดพนักงานในหน้ารวมพนักงาน และในหน้าต่างดูโปรไฟล์ เพื่อให้เจ้าหน้าที่ Care Manager และหัวหน้าเวรสามารถกดติดต่อได้ทันที
                </span>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: CATEGORY & POSITION */}
          {/* ========================================================================= */}
          {activeTab === 'role' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-[#142332] mb-2.5">
                  เลือกกลุ่มพนักงานหลัก (2 กลุ่ม):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div
                    onClick={() => handleCategoryChange('nursing_home_escort')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      category === 'nursing_home_escort'
                        ? 'border-[#23382E] bg-[#EAF7F0] ring-2 ring-[#23382E]/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#142332]">
                      <Building2 className="w-4 h-4 text-[#1E7E52]" />
                      <span>กลุ่มที่ 1: Nursing Home & Escort</span>
                    </div>
                    <p className="text-[11px] text-[#5C6B64] mt-1">
                      พนักงานบริบาลประจำศูนย์ Nursing Home, พยาบาล RN/PN และทีมพาพบแพทย์
                    </p>
                  </div>

                  <div
                    onClick={() => handleCategoryChange('home_care')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      category === 'home_care'
                        ? 'border-[#CF7C4E] bg-[#FAF0E6] ring-2 ring-[#CF7C4E]/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-[#9E4E28]">
                      <Home className="w-4 h-4 text-[#CF7C4E]" />
                      <span>กลุ่มที่ 2: ผู้ดูแลผู้ป่วยที่บ้าน (Home Care)</span>
                    </div>
                    <p className="text-[11px] text-[#5C6B64] mt-1">
                      พนักงานผู้บริบาลและผู้ช่วยพยาบาลดูแลผู้ป่วย ณ บ้านพัก (รายวัน/รายเดือน)
                    </p>
                  </div>

                </div>
              </div>

              {/* Sub-role & Standard Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ตำแหน่ง / บทบาทงาน (Position Title) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subRole}
                    onChange={e => setSubRole(e.target.value)}
                    placeholder="เช่น พยาบาลวิชาชีพประจำศูนย์ (RN) หรือ ผู้ดูแลผู้ป่วยที่บ้าน"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                    <span>อัตราค่าบริการมาตรฐาน (Standard Rate)</span>
                  </label>
                  <input
                    type="text"
                    value={standardRate}
                    onChange={e => setStandardRate(e.target.value)}
                    placeholder="เช่น 25,000 บาท/เดือน หรือ 1,200 บาท/วัน"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-[#1E7E52] focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                  />
                </div>
              </div>

              {/* Education, Experience, Rating, Total Cases */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2B5975]" />
                    <span>วุฒิการศึกษา / สถาบันที่สำเร็จการศึกษา</span>
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    placeholder="เช่น พยาบาลศาสตรบัณฑิต มหาวิทยาลัยมหิดล หรือ บริบาล 840 ชม."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ประสบการณ์ (ปี)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                    min={0}
                    max={45}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>คะแนนเรตติ้ง (0 - 5.0)</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                    min={0}
                    max={5}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    จำนวนเคสที่เคยดูแล (เคส)
                  </label>
                  <input
                    type="number"
                    value={totalCases}
                    onChange={e => setTotalCases(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                    min={0}
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STATUS & CURRENT ASSIGNMENT */}
          {/* ========================================================================= */}
          {activeTab === 'assignment' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Status Radio Buttons */}
              <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] space-y-3">
                <label className="block text-xs font-bold text-[#142332]">
                  สถานะความพร้อมของพนักงาน (Availability Status):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  
                  <button
                    type="button"
                    onClick={() => setStatus('available')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      status === 'available'
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>🟢 ว่างพร้อมรับงาน</span>
                    </span>
                    {status === 'available' && <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('working')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      status === 'working'
                        ? 'border-amber-500 bg-amber-100 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-amber-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>🟡 กำลังติดเคส</span>
                    </span>
                    {status === 'working' && <Check className="w-4 h-4 text-amber-700 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStatus('leave')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                      status === 'leave'
                        ? 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-rose-50'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span>🔴 ลางาน / พักผ่อน</span>
                    </span>
                    {status === 'leave' && <Check className="w-4 h-4 text-rose-700 stroke-[3]" />}
                  </button>

                </div>
              </div>

              {/* If Working, show assignment detail form */}
              {status === 'working' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3.5">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs border-b border-amber-200/80 pb-2">
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    <span>ข้อมูลเคสผู้ป่วยที่กำลังดูแลอยู่ (Active Duty Assignment)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        ชื่อผู้ป่วยที่ดูแล:
                      </label>
                      <input
                        type="text"
                        value={assignedPatientName}
                        onChange={e => setAssignedPatientName(e.target.value)}
                        placeholder="เช่น คุณยายสมศรี รัตนพร"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        สถานที่ปฏิบัติงาน / ห้องพัก:
                      </label>
                      <input
                        type="text"
                        value={assignedLocation}
                        onChange={e => setAssignedLocation(e.target.value)}
                        placeholder="เช่น ศูนย์ Nursing Home อาคาร B หรือ บ้านพักย่านอารีย์"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        รายละเอียดงานที่ได้รับมอบหมาย:
                      </label>
                      <input
                        type="text"
                        value={assignedDetails}
                        onChange={e => setAssignedDetails(e.target.value)}
                        placeholder="เช่น ดูแลฟื้นฟูหลังผ่าตัด กายภาพบำบัด และเช็กอินสัญญาณชีพ"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        เวลาเริ่มงาน:
                      </label>
                      <input
                        type="text"
                        value={assignedStartTime}
                        onChange={e => setAssignedStartTime(e.target.value)}
                        placeholder="เช่น 08:00 น."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notes / Bio */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  หมายเหตุเพิ่มเติม / ข้อควรระวังในการปฏิบัติงาน
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="ระบุข้อความ เช่น สแตนด์บายเวร On-site Clinic หรือ ลากิจถึงวันที่..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                />
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: SKILLS & CERTIFICATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'skills' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>ทักษะและความชำนาญเฉพาะทาง (คั่นด้วยเครื่องหมายจุลภาค ,)</span>
                </label>
                <textarea
                  value={skillsText}
                  onChange={e => setSkillsText(e.target.value)}
                  placeholder="เช่น การประเมินสัญญาณชีพ, กายภาพบำบัดฟื้นฟู, การดูแลแผลกดทับ, CPR & First Aid"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>ใบประกาศนียบัตร & ใบประกอบวิชาชีพ (คั่นด้วยเครื่องหมายจุลภาค ,)</span>
                </label>
                <textarea
                  value={certsText}
                  onChange={e => setCertsText(e.target.value)}
                  placeholder="เช่น Registered Nurse License, NA 840 ชม., Basic Life Support (BLS)"
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>พื้นที่ให้บริการประจำ (Service Areas คั่นด้วยเครื่องหมายจุลภาค ,)</span>
                </label>
                <input
                  type="text"
                  value={serviceAreasText}
                  onChange={e => setServiceAreasText(e.target.value)}
                  placeholder="เช่น ศูนย์ Nursing Home Main Facility, พญาไท, อารีย์, สุขุมวิท"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#CF7C4E]"
                />
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#EAE2D3] flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#CF7C4E] hover:bg-[#BE673B] text-white shadow-md flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>บันทึกการแก้ไขข้อมูลพนักงาน</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
