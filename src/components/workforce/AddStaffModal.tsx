import React, { useState } from 'react';
import { UnifiedStaffMember, StaffCategory, UnifiedStaffStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  UserPlus, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Building2, 
  Home, 
  Phone, 
  Mail, 
  Award, 
  Sparkles,
  DollarSign
} from 'lucide-react';

interface AddStaffModalProps {
  onClose: () => void;
  defaultCategory?: StaffCategory;
}

export const AddStaffModal: React.FC<AddStaffModalProps> = ({ onClose, defaultCategory = 'nursing_home_escort' }) => {
  const { addStaffMember, staff } = useApp();

  const [category, setCategory] = useState<StaffCategory>(defaultCategory);
  const [name, setName] = useState('');
  const [thaiName, setThaiName] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [age, setAge] = useState<number>(32);
  const [phone, setPhone] = useState('089-123-4567');
  const [lineId, setLineId] = useState('');
  const [email, setEmail] = useState('staff.new@carenest.health');
  const [subRole, setSubRole] = useState(
    defaultCategory === 'nursing_home_escort' 
      ? 'พนักงานบริบาลประจำศูนย์ (Nursing Home Care)' 
      : 'ผู้ดูแลผู้ป่วยที่บ้าน (Home Care NA)'
  );
  const [experienceYears, setExperienceYears] = useState<number>(5);
  const [standardRate, setStandardRate] = useState('25,000 บาท/เดือน');
  const [education, setEducation] = useState('ประกาศนียบัตรพนักงานบริบาลผู้สูงอายุ (NA 840 ชั่วโมง)');
  const [skillsText, setSkillsText] = useState('การวัดสัญญาณชีพ, การพลิกตัวป้องกันแผลกดทับ, การดูแลอาหารเฉพาะโรค, CPR');
  const [certsText, setCertsText] = useState('Elderly Care Certificate, Basic Life Support 2026');
  const [serviceAreasText, setServiceAreasText] = useState('ศูนย์ Nursing Home Main Facility, พญาไท, จตุจักร');
  const [avatar, setAvatar] = useState<string>('https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80');

  // Avatar presets
  const sampleAvatars = [
    { url: 'https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80', label: 'พยาบาล/บริบาลหญิง 1' },
    { url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80', label: 'พยาบาลหญิง 2' },
    { url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80', label: 'บริบาลหญิง 3' },
    { url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80', label: 'Escort ชาย 1' },
    { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80', label: 'Escort ชาย 2' },
    { url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', label: 'Caregiver ชาย 3' },
  ];

  const handleCategoryChange = (newCat: StaffCategory) => {
    setCategory(newCat);
    if (newCat === 'nursing_home_escort') {
      setSubRole('พนักงานบริบาลประจำศูนย์ (Nursing Home Care)');
      setServiceAreasText('ศูนย์ Nursing Home Main Facility, พญาไท, ราชเทวี');
    } else {
      setSubRole('ผู้ดูแลผู้ป่วยที่บ้าน (Home Caregiver)');
      setServiceAreasText('ลาดพร้าว, จตุจักร, สุขุมวิท, บางนา');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const prefix = category === 'nursing_home_escort' ? 'STF-NH' : 'STF-HC';
    const nextNum = staff.filter(s => s.category === category).length + 1;
    const code = `${prefix}${String(nextNum).padStart(2, '0')}`;

    const newMember: UnifiedStaffMember = {
      id: `stf-${Date.now()}`,
      code,
      name: name || thaiName,
      thaiName,
      nickname: nickname || undefined,
      avatar,
      gender,
      age: Number(age),
      phone,
      lineId: lineId.trim() || undefined,
      email,
      category,
      subRole,
      status: 'available', // Newly registered staff starts as available
      experienceYears: Number(experienceYears),
      rating: 5.0,
      totalCases: 0,
      skills: skillsText.split(',').map(s => s.trim()).filter(Boolean),
      certifications: certsText.split(',').map(c => c.trim()).filter(Boolean),
      serviceAreas: serviceAreasText.split(',').map(a => a.trim()).filter(Boolean),
      standardRate,
      education
    };

    addStaffMember(newMember);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-md shadow-sage-800/20">
              <UserPlus className="w-6 h-6 text-cream-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-sage-900 font-serif">
                ลงทะเบียนพนักงานใหม่ (Add New Staff)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                เลือกกลุ่มงานและบันทึกประวัติความเชี่ยวชาญเพื่อเปิดรับงานในระบบ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* 1. Group Selection (Category) */}
          <div>
            <label className="block text-xs font-bold text-sage-900 mb-2">
              1. เลือกกลุ่มพนักงาน (Staff Category) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCategoryChange('nursing_home_escort')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  category === 'nursing_home_escort'
                    ? 'border-sage-700 bg-sage-50/90 text-sage-900 ring-2 ring-sage-600 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${category === 'nursing_home_escort' ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-sage-950">
                    กลุ่มที่ 1: Nursing Home & พาพบแพทย์
                  </span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    พนักงานประจำศูนย์ Nursing Home, RN/PN และ Medical Escort
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('home_care')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  category === 'home_care'
                    ? 'border-emerald-700 bg-emerald-50/90 text-emerald-900 ring-2 ring-emerald-600 shadow-xs'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${category === 'home_care' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-emerald-950">
                    กลุ่มที่ 2: ผู้ดูแลผู้ป่วยที่บ้าน
                  </span>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    พนักงานดูแลผู้ป่วย ณ ที่พักอาศัย (Home Care / Live-in)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Photo / Avatar Selection */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              2. รูปถ่ายโปรไฟล์พนักงาน
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-cream-50/50 border border-cream-200">
              <img
                src={avatar}
                alt="รูปโปรไฟล์"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sage-300 shadow-xs shrink-0"
              />
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <span className="text-xs font-bold text-gray-800 block">เลือกรูปตัวอย่าง หรือ อัปโหลดภาพจริง</span>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {sampleAvatars.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(item.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        avatar === item.url
                          ? 'bg-sage-800 text-white shadow-2xs'
                          : 'bg-white text-gray-600 hover:bg-sage-100 border border-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                  <label className="cursor-pointer px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white border border-sage-300 text-sage-800 hover:bg-sage-50 flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>อัปโหลดจากเครื่อง</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Basic Details */}
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ชื่อเล่น
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="เช่น ก้อย"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ตำแหน่ง / บทบาทงาน <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={subRole}
                onChange={e => setSubRole(e.target.value)}
                placeholder="เช่น ผู้ช่วยพยาบาล (PN)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                เพศ
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              >
                <option value="female">หญิง (Female)</option>
                <option value="male">ชาย (Male)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                อายุ (ปี)
              </label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                min={18}
                max={70}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-sage-700" />
                เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="เช่น 089-123-4567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#06C755] text-white flex items-center justify-center font-bold text-[8px]">L</span>
                LINE ID
              </label>
              <input
                type="text"
                value={lineId}
                onChange={e => setLineId(e.target.value)}
                placeholder="เช่น @nurse_may"
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sage-700" />
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="staff@carenest.health"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* 4. Experience & Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ประสบการณ์ทำงาน (ปี)
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={e => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                min={0}
                max={40}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                อัตราค่าบริการมาตรฐาน
              </label>
              <input
                type="text"
                value={standardRate}
                onChange={e => setStandardRate(e.target.value)}
                placeholder="เช่น 25,000 บาท/เดือน หรือ 1,200 บาท/วัน"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* 5. Education */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              วุฒิการศึกษา / สถาบันที่จบ
            </label>
            <input
              type="text"
              value={education}
              onChange={e => setEducation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* 6. Skills & Certifications */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              ทักษะความชำนาญ (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              ใบประกาศนียบัตร / ใบประกอบวิชาชีพ (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <input
              type="text"
              value={certsText}
              onChange={e => setCertsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              พื้นที่ให้บริการประจำ (คั่นด้วยเครื่องหมายจุลภาค ,)
            </label>
            <input
              type="text"
              value={serviceAreasText}
              onChange={e => setServiceAreasText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-cream-300" />
              บันทึกและเปิดสถานะพร้อมรับงาน
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
