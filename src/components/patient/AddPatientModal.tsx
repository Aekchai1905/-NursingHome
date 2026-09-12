import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, PrecautionAlert, PatientCareType } from '../../types';
import { 
  X, 
  UserPlus, 
  HeartPulse, 
  ShieldAlert, 
  Stethoscope, 
  Building2, 
  Phone, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Check,
  Car,
  Home
} from 'lucide-react';

interface AddPatientModalProps {
  onClose: () => void;
}

const presetAvatars = [
  { id: 'av-1', label: 'คุณยายสมศรี', gender: 'female', url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'คุณยายวรรณา', gender: 'female', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-3', label: 'คุณยายมาลี', gender: 'female', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'คุณตาประเสริฐ', gender: 'male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-5', label: 'คุณตาสมศักดิ์', gender: 'male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'av-6', label: 'คุณตาประสิทธิ์', gender: 'male', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' }
];

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose }) => {
  const { addPatient } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [thaiName, setThaiName] = useState('');
  const [name, setName] = useState('');
  const [hn, setHn] = useState(`HN-6701${Math.floor(100 + Math.random() * 900)}`);
  const [age, setAge] = useState(75);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [birthDate, setBirthDate] = useState('1951-05-15');
  const [careType, setCareType] = useState<PatientCareType>('nursing_home');
  const [roomBed, setRoomBed] = useState('Ward A - Room 205');
  const [primaryDoctor, setPrimaryDoctor] = useState('นพ. วิรัช วงศ์สว่าง');
  const [primaryHospital, setPrimaryHospital] = useState('โรงพยาบาลกรุงเทพคริสเตียน');
  const [chronicDiseases, setChronicDiseases] = useState('ความดันโลหิตสูง, เบาหวาน');
  const [drugAllergies, setDrugAllergies] = useState('ไม่มีประวัติแพ้ยา');
  const [foodAllergies, setFoodAllergies] = useState('ไม่มีประวัติแพ้อาหาร');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('บุตรสาว');
  const [fallRisk, setFallRisk] = useState(true);

  // Avatar Selection State
  const [avatar, setAvatar] = useState(presetAvatars[0].url);

  // Initial vitals
  const [sys, setSys] = useState(128);
  const [dia, setDia] = useState(80);
  const [pulse, setPulse] = useState(75);
  const [temp, setTemp] = useState(36.6);
  const [spo2, setSpo2] = useState(98);

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

    const precautions: PrecautionAlert[] = [];
    if (fallRisk) {
      precautions.push({
        id: `al-${Date.now()}-1`,
        type: 'fall_risk',
        label: 'ความเสี่ยงพลัดตกหกล้ม (Fall Risk)',
        severity: 'medium',
        details: 'ต้องมีผู้ดูแลช่วยพยุงขณะเคลื่อนย้าย',
        icon: 'AlertTriangle'
      });
    }
    if (chronicDiseases.includes('เบาหวาน')) {
      precautions.push({
        id: `al-${Date.now()}-2`,
        type: 'diabetes',
        label: 'ผู้ป่วยเบาหวาน (Diabetes)',
        severity: 'medium',
        details: 'เฝ้าระวังระดับน้ำตาลในเลือด',
        icon: 'Activity'
      });
    }

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      hn,
      name: name || thaiName,
      thaiName,
      gender,
      age: Number(age),
      birthDate,
      avatar,
      careType,
      serviceStatus: 'active',
      serviceStartDate: new Date().toISOString().split('T')[0],
      roomBed: careType === 'nursing_home' ? roomBed : careType === 'medical_escort' ? 'บริการพาพบแพทย์' : 'Home Care ประจำบ้าน',
      primaryCaregiverName: 'ทีมบริบาลประจำศูนย์',
      primaryDoctorName: primaryDoctor,
      primaryHospital,
      chronicDiseases: chronicDiseases.split(',').map(s => s.trim()).filter(Boolean),
      drugAllergies: drugAllergies.split(',').map(s => s.trim()).filter(Boolean),
      foodAllergies: foodAllergies.split(',').map(s => s.trim()).filter(Boolean),
      emergencyContact: {
        name: emergencyName || 'ผู้ติดต่อฉุกเฉิน',
        relationship: emergencyRelation,
        phone: emergencyPhone || '081-000-0000'
      },
      healthStatus: (sys >= 140 || dia >= 90) ? 'attention' : (sys >= 130) ? 'monitor' : 'stable',
      statusNotes: 'ลงทะเบียนผู้ป่วยใหม่เรียบร้อย เริ่มต้นแผนการดูแล',
      carePlan: {
        id: `cp-${Date.now()}`,
        patientId: `p-${Date.now()}`,
        updatedAt: new Date().toLocaleDateString('th-TH'),
        doctorRecommendations: [
          'วัดสัญญาณชีพวันละ 2 ครั้ง (เช้า-เย็น)',
          'รับประทานอาหารรสอ่อน ดื่มน้ำวันละ 1,500 มล.',
          'ออกกำลังกายเบาๆ กายภาพกล้ามเนื้อมือและขา'
        ],
        guidelines: [
          'หลีกเลี่ยงการลุกจากเตียงกะทันหัน',
          'บันทึกปริมาณอาหารและการขับถ่ายทุกวัน'
        ],
        medications: [],
        recommendedActivities: ['ฝึกหายใจลึก', 'เดินเบาๆ พร้อมผู้ดูแล'],
        restrictedActivities: ['ห้ามยกของหนัก', 'ห้ามลุกเดินคนเดียวในห้องน้ำ'],
        precautions,
        riskAssessment: {
          fallRiskScore: fallRisk ? 6 : 2,
          bedriddenScale: 'ambulatory',
          dietaryRestrictions: ['Low Sodium', 'Balanced Diet']
        }
      },
      vitalsHistory: [
        {
          id: `v-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' วันนี้',
          sys: Number(sys),
          dia: Number(dia),
          pulse: Number(pulse),
          temp: Number(temp),
          spo2: Number(spo2),
          status: (sys >= 140 || dia >= 90) ? 'attention' : (sys >= 130) ? 'monitor' : 'stable',
          recordedBy: 'พยาบาลแรกรับ',
          recorderRole: 'Nurse',
          notes: 'ตรวจวัดสัญญาณชีพแรกรับเข้าสู่ระบบ'
        }
      ],
      dailyLogs: []
    };

    addPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ลงทะเบียนผู้ป่วยรายใหม่ (Add New Patient)
              </h2>
              <p className="text-xs text-gray-500">
                เลือกรูปภาพผู้ป่วย กรอกประวัติสุขภาพ และสัญญาณชีพแรกรับ
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
          
          {/* 🖼️ Photo Selection Section */}
          <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200">
            <label className="block text-xs font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-sage-700" />
              <span>รูปภาพประจำตัวผู้ป่วย (Patient Profile Photo)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Main Avatar Preview */}
              <div className="relative group shrink-0">
                <img
                  src={avatar}
                  alt="Patient Avatar Preview"
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
                {/* Preset Thumbnails */}
                <div>
                  <span className="text-[11px] text-gray-500 font-medium block mb-1.5">
                    เลือกรูปโปรไฟล์ตัวอย่าง หรืออัปโหลดรูปเอง:
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {presetAvatars.map(preset => {
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

                {/* Upload Button & Hidden Input */}
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

          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ชื่อ-นามสกุล (ภาษาไทย) *
              </label>
              <input
                type="text"
                placeholder="เช่น คุณยายสมใจ บุญมี"
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
                placeholder="เช่น Somjai Boonmee"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                เลข HN
              </label>
              <input
                type="text"
                value={hn}
                onChange={e => setHn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
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

          {/* Care Type & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ประเภทการดูแล (3 กลุ่ม)
              </label>
              <select
                value={careType}
                onChange={e => setCareType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-500 bg-cream-50/50"
              >
                <option value="nursing_home">🏢 1. ศูนย์ดูแล Nursing Home (พักในศูนย์ 24 ชม.)</option>
                <option value="medical_escort">🏥 2. ผู้ป่วยที่ใช้บริการนัดพบแพทย์ (Medical Escort)</option>
                <option value="home_care">🏡 3. ผู้ป่วยที่ดูแลที่บ้าน (Home Care)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {careType === 'nursing_home' ? 'ห้องพัก / วอร์ดในศูนย์' : careType === 'medical_escort' ? 'หมายเหตุบริการพาพบแพทย์' : 'ที่อยู่ / พิกัดดูแลที่บ้าน'}
              </label>
              <input
                type="text"
                value={roomBed}
                onChange={e => setRoomBed(e.target.value)}
                placeholder={careType === 'nursing_home' ? 'เช่น Ward A - Room 205' : careType === 'medical_escort' ? 'เช่น มีนัดตรวจคลื่นหัวใจ EKG ทุกเดือน' : 'เช่น บ้านพักย่านสุขุมวิท / คันนายาว'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Medical Info */}
          <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                โรคประจำตัว (คั่นด้วยจุลภาค)
              </label>
              <input
                type="text"
                value={chronicDiseases}
                onChange={e => setChronicDiseases(e.target.value)}
                placeholder="เช่น ความดันโลหิตสูง, เบาหวาน"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ประวัติแพ้ยา / แพ้อาหาร
              </label>
              <input
                type="text"
                value={drugAllergies}
                onChange={e => setDrugAllergies(e.target.value)}
                placeholder="เช่น Penicillin, กุ้ง"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Doctor & Hospital */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                แพทย์ประจำตัว
              </label>
              <input
                type="text"
                value={primaryDoctor}
                onChange={e => setPrimaryDoctor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                โรงพยาบาลหลัก
              </label>
              <input
                type="text"
                value={primaryHospital}
                onChange={e => setPrimaryHospital(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-800 block mb-2">ผู้ติดต่อฉุกเฉิน / ญาติ:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="ชื่อผู้ติดต่อ (เช่น คุณกัญญา)"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <input
                type="text"
                placeholder="ความสัมพันธ์ (เช่น บุตรสาว)"
                value={emergencyRelation}
                onChange={e => setEmergencyRelation(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <input
                type="text"
                placeholder="เบอร์โทร (เช่น 089-123-4567)"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Initial Vitals */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-800 block mb-2">สัญญาณชีพแรกรับ (Initial Vitals):</span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="text-[10px] text-gray-500 block">SYS (บน)</span>
                <input
                  type="number"
                  value={sys}
                  onChange={e => setSys(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">DIA (ล่าง)</span>
                <input
                  type="number"
                  value={dia}
                  onChange={e => setDia(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Pulse (ชีพจร)</span>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Fall Risk Precaution checkbox */}
          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="fallRiskCheck"
              checked={fallRisk}
              onChange={e => setFallRisk(e.target.checked)}
              className="rounded text-sage-800 focus:ring-sage-500 w-4 h-4"
            />
            <label htmlFor="fallRiskCheck" className="text-xs font-semibold text-gray-700">
              ผู้ป่วยมีความเสี่ยงพลัดตกหกล้ม (High Fall Risk Alert)
            </label>
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
              บันทึกข้อมูลผู้ป่วยใหม่
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
