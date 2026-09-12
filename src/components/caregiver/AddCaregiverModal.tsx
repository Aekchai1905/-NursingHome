import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Caregiver, WageType } from '../../types';
import { X, UserCheck, Award, Briefcase, DollarSign, Phone, Mail, MapPin, Camera, Upload, Image as ImageIcon, Check } from 'lucide-react';

interface AddCaregiverModalProps {
  onClose: () => void;
}

const presetCaregiverAvatars = [
  { id: 'cg-av-1', label: 'ผู้ดูแล ศศิ', url: 'https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80' },
  { id: 'cg-av-2', label: 'ผู้ดูแล มินต์', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80' },
  { id: 'cg-av-3', label: 'ผู้ดูแล อร', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
  { id: 'cg-av-4', label: 'ผู้ดูแล โต้ง', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80' },
  { id: 'cg-av-5', label: 'ผู้ดูแล นัท', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'cg-av-6', label: 'ผู้ดูแล เมย์', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' }
];

export const AddCaregiverModal: React.FC<AddCaregiverModalProps> = ({ onClose }) => {
  const { addCaregiver } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thaiName, setThaiName] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [phone, setPhone] = useState('089-123-4567');
  const [email, setEmail] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);
  const [education, setEducation] = useState('ประกาศนียบัตรวิชาชีพพนักงานบริบาลผู้สูงอายุ (NA 840 ชม.)');
  const [certifications, setCertifications] = useState('Elderly Care Certified Specialist, First Aid & CPR');
  const [specialSkills, setSpecialSkills] = useState('การดูแลผู้ป่วยติดเตียง, ให้อาหารทางสายยาง, วัดสัญญาณชีพ');
  const [serviceAreas, setServiceAreas] = useState('พญาไท, อารีย์, จตุจักร');
  const [wageType, setWageType] = useState<WageType>('monthly');
  const [standardRate, setStandardRate] = useState(25000);
  const [bio, setBio] = useState('ใจเย็น ละเอียดรอบคอบ และมีประสบการณ์ดูแลผู้สูงอายุอย่างต่อเนื่อง');
  const [avatar, setAvatar] = useState(presetCaregiverAvatars[0].url);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thaiName.trim()) return;

    const newCaregiver: Caregiver = {
      id: `cg-${Date.now()}`,
      name: name || thaiName,
      thaiName,
      gender,
      age: Number(age),
      avatar,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '') || 'caregiver'}@carenest.health`,
      experienceYears: Number(experienceYears),
      education,
      certifications: certifications.split(',').map(s => s.trim()).filter(Boolean),
      specialSkills: specialSkills.split(',').map(s => s.trim()).filter(Boolean),
      serviceAreas: serviceAreas.split(',').map(s => s.trim()).filter(Boolean),
      status: 'available',
      rating: 5.0,
      totalPatientsServed: 1,
      startDate: new Date().toISOString().slice(0, 10),
      wageType,
      standardRate: Number(standardRate),
      bio
    };

    addCaregiver(newCaregiver);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                เพิ่มข้อมูลผู้ดูแลคนใหม่ (Add New Caregiver)
              </h2>
              <p className="text-xs text-gray-500">
                เลือกรูปภาพ บันทึกประวัติ คุณสมบัติ ใบเซอร์ และอัตราค่าบริการ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Photo Selector */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <label className="block text-xs font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-sage-700" />
              <span>รูปภาพประจำตัวผู้ดูแล (Caregiver Profile Photo)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Caregiver Avatar Preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-sage-800 text-white shadow-md hover:bg-sage-900 transition-colors"
                  title="อัปโหลดรูปจากเครื่อง"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 min-w-0 space-y-2.5 w-full">
                <div>
                  <span className="text-[11px] text-gray-500 font-medium block mb-1.5">
                    เลือกรูปโปรไฟล์ตัวอย่าง หรืออัปโหลดรูปเอง:
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {presetCaregiverAvatars.map(preset => {
                      const isSelected = avatar === preset.url;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => setAvatar(preset.url)}
                          className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                            isSelected 
                              ? 'border-sage-800 ring-2 ring-sage-600/30 scale-105' 
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt="" className="w-full h-full object-cover" />
                          {isSelected && (
                            <span className="absolute inset-0 bg-sage-900/30 flex items-center justify-center text-white">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
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
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-sage-400 hover:bg-gray-50 text-xs font-bold text-sage-900 shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-sage-700" />
                    <span>อัปโหลดรูปจากเครื่องคอมพิวเตอร์ / กล้อง</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ชื่อ-นามสกุล (ภาษาไทย) *
              </label>
              <input
                type="text"
                placeholder="เช่น วิภาดา มีสุข (ผู้ดูแล นก)"
                value={thaiName}
                onChange={e => setThaiName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ชื่อภาษาอังกฤษ (English Name)
              </label>
              <input
                type="text"
                placeholder="เช่น Wiphada Meesook"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                อายุ (ปี)
              </label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="female">หญิง</option>
                <option value="male">ชาย</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                เบอร์โทรศัพท์
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                อีเมล (Email)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@carenest.health"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Education and Certifications */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                วุฒิการศึกษา
              </label>
              <input
                type="text"
                value={education}
                onChange={e => setEducation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ใบประกาศนียบัตร / ใบเซอร์เฉพาะทาง (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={certifications}
                onChange={e => setCertifications(e.target.value)}
                placeholder="เช่น Bedridden Care Certified, First Aid & CPR"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ทักษะความชำนาญเฉพาะด้าน (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={specialSkills}
                onChange={e => setSpecialSkills(e.target.value)}
                placeholder="เช่น ดูแลผู้ป่วยติดเตียง, ให้อาหารทางสายยาง, ดูดเสมหะ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Wage and Service Area */}
          <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ประเภทอัตราค่าจ้าง
              </label>
              <select
                value={wageType}
                onChange={e => setWageType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
              >
                <option value="monthly">รายเดือน</option>
                <option value="daily">รายวัน</option>
                <option value="hourly">รายชั่วโมง</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                อัตรามาตรฐาน (บาท)
              </label>
              <input
                type="number"
                value={standardRate}
                onChange={e => setStandardRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                พื้นที่ให้บริการ
              </label>
              <input
                type="text"
                value={serviceAreas}
                onChange={e => setServiceAreas(e.target.value)}
                placeholder="เช่น พญาไท, อารีย์"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              คำแนะนำตัว / ประวัติโดยย่อ (Bio)
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft"
            >
              บันทึกข้อมูลผู้ดูแลคนใหม่
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
