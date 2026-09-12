import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, PrecautionAlert, PatientCareType, HealthStatus, ClientServiceStatus } from '../../types';
import { 
  X, 
  Save, 
  User, 
  Building2, 
  Home, 
  Car, 
  Stethoscope, 
  AlertTriangle, 
  HeartPulse, 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Activity, 
  Pill, 
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  UserX
} from 'lucide-react';

interface EditPatientModalProps {
  patient: Patient;
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

export const EditPatientModal: React.FC<EditPatientModalProps> = ({ patient, onClose }) => {
  const { updatePatient, staff, caregivers } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Tab inside Edit Modal
  const [activeTab, setActiveTab] = useState<'basic' | 'care_group' | 'medical' | 'precautions' | 'care_plan'>('basic');

  // Basic Info Form State
  const [avatar, setAvatar] = useState(patient.avatar);
  const [thaiName, setThaiName] = useState(patient.thaiName);
  const [name, setName] = useState(patient.name);
  const [hn, setHn] = useState(patient.hn);
  const [age, setAge] = useState(patient.age);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [birthDate, setBirthDate] = useState(patient.birthDate);

  // Care Group, Service Status & Location Form State
  const [careType, setCareType] = useState<PatientCareType>(patient.careType);
  const [serviceStatus, setServiceStatus] = useState<ClientServiceStatus>(patient.serviceStatus || 'active');
  const [inactiveReason, setInactiveReason] = useState(patient.inactiveReason || '');
  const [inactiveDate, setInactiveDate] = useState(patient.inactiveDate || new Date().toISOString().split('T')[0]);
  const [serviceStartDate, setServiceStartDate] = useState(patient.serviceStartDate || '2026-01-01');
  const [roomBed, setRoomBed] = useState(patient.roomBed || '');
  const [address, setAddress] = useState(patient.address || '');
  const [primaryCaregiverName, setPrimaryCaregiverName] = useState(patient.primaryCaregiverName || '');

  // Medical Info Form State
  const [primaryDoctorName, setPrimaryDoctorName] = useState(patient.primaryDoctorName);
  const [primaryHospital, setPrimaryHospital] = useState(patient.primaryHospital);
  const [healthStatus, setHealthStatus] = useState<HealthStatus>(patient.healthStatus);
  const [statusNotes, setStatusNotes] = useState(patient.statusNotes || '');
  const [chronicDiseasesText, setChronicDiseasesText] = useState(patient.chronicDiseases.join(', '));
  const [drugAllergiesText, setDrugAllergiesText] = useState(patient.drugAllergies.join(', '));
  const [foodAllergiesText, setFoodAllergiesText] = useState(patient.foodAllergies.join(', '));

  // Emergency Contact State
  const [emergencyName, setEmergencyName] = useState(patient.emergencyContact?.name || '');
  const [emergencyRelationship, setEmergencyRelationship] = useState(patient.emergencyContact?.relationship || '');
  const [emergencyPhone, setEmergencyPhone] = useState(patient.emergencyContact?.phone || '');

  // Precautions Form State
  const [precautions, setPrecautions] = useState<PrecautionAlert[]>(patient.carePlan?.precautions || []);
  const [newPrecautionLabel, setNewPrecautionLabel] = useState('');
  const [newPrecautionType, setNewPrecautionType] = useState<PrecautionAlert['type']>('fall_risk');
  const [newPrecautionSeverity, setNewPrecautionSeverity] = useState<'high' | 'medium' | 'low'>('high');
  const [newPrecautionDetails, setNewPrecautionDetails] = useState('');

  // Risk Assessment
  const [fallRiskScore, setFallRiskScore] = useState(patient.carePlan?.riskAssessment?.fallRiskScore ?? 5);
  const [bedriddenScale, setBedriddenScale] = useState<'ambulatory' | 'wheelchair' | 'bedridden'>(
    patient.carePlan?.riskAssessment?.bedriddenScale ?? 'ambulatory'
  );
  const [dietaryRestrictionsText, setDietaryRestrictionsText] = useState(
    (patient.carePlan?.riskAssessment?.dietaryRestrictions || []).join(', ')
  );

  // Care Plan Recommendations & Guidelines
  const [doctorRecommendationsText, setDoctorRecommendationsText] = useState(
    (patient.carePlan?.doctorRecommendations || []).join('\n')
  );
  const [guidelinesText, setGuidelinesText] = useState(
    (patient.carePlan?.guidelines || []).join('\n')
  );
  const [recommendedActivitiesText, setRecommendedActivitiesText] = useState(
    (patient.carePlan?.recommendedActivities || []).join(', ')
  );
  const [restrictedActivitiesText, setRestrictedActivitiesText] = useState(
    (patient.carePlan?.restrictedActivities || []).join(', ')
  );

  // File Upload
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

  // Add new precaution handler
  const handleAddPrecaution = () => {
    if (!newPrecautionLabel.trim()) return;
    const newAlert: PrecautionAlert = {
      id: `al-${Date.now()}`,
      type: newPrecautionType,
      label: newPrecautionLabel.trim(),
      severity: newPrecautionSeverity,
      details: newPrecautionDetails.trim() || 'คำแนะนำพิเศษ',
      icon: newPrecautionType === 'fall_risk' ? 'AlertTriangle' : newPrecautionType === 'drug_allergy' ? 'Pill' : 'Activity'
    };
    setPrecautions([...precautions, newAlert]);
    setNewPrecautionLabel('');
    setNewPrecautionDetails('');
  };

  // Remove precaution handler
  const handleRemovePrecaution = (id: string) => {
    setPrecautions(precautions.filter(p => p.id !== id));
  };

  // Submit & Save Changes
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thaiName.trim()) return;

    const newCareType = careType;
    const newRoomBed = careType === 'nursing_home' ? roomBed.trim() : careType === 'medical_escort' ? 'ผู้ป่วยนอก (บริการพาพบแพทย์)' : 'Home Care (บ้านพักผู้ป่วย)';
    const newDrugAllergies = drugAllergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const newFoodAllergies = foodAllergiesText.split(',').map(s => s.trim()).filter(Boolean);
    const newChronic = chronicDiseasesText.split(',').map(s => s.trim()).filter(Boolean);

    // Track detailed field changes for audit log
    const changes: { field: string; from: string; to: string }[] = [];
    if (patient.thaiName !== thaiName.trim()) {
      changes.push({ field: 'ชื่อ-นามสกุล', from: patient.thaiName, to: thaiName.trim() });
    }
    if (patient.careType !== newCareType) {
      changes.push({ field: 'กลุ่มบริการ', from: patient.careType, to: newCareType });
    }
    if ((patient.primaryCaregiverName || '') !== primaryCaregiverName.trim()) {
      changes.push({ field: 'ผู้ดูแลหลัก', from: patient.primaryCaregiverName || 'ยังไม่ระบุ', to: primaryCaregiverName.trim() || 'ยังไม่ระบุ' });
    }
    if ((patient.roomBed || '') !== newRoomBed) {
      changes.push({ field: 'ห้องพัก/สถานที่', from: patient.roomBed || '-', to: newRoomBed });
    }
    if (patient.healthStatus !== healthStatus) {
      changes.push({ field: 'สถานะสุขภาพ', from: patient.healthStatus, to: healthStatus });
    }
    if (patient.primaryDoctorName !== primaryDoctorName.trim()) {
      changes.push({ field: 'แพทย์ประจำตัว', from: patient.primaryDoctorName, to: primaryDoctorName.trim() });
    }
    if (patient.drugAllergies.join(', ') !== newDrugAllergies.join(', ')) {
      changes.push({ field: 'ประวัติแพ้ยา', from: patient.drugAllergies.join(', ') || 'ไม่มี', to: newDrugAllergies.join(', ') || 'ไม่มี' });
    }
    if (patient.foodAllergies.join(', ') !== newFoodAllergies.join(', ')) {
      changes.push({ field: 'ประวัติแพ้อาหาร', from: patient.foodAllergies.join(', ') || 'ไม่มี', to: newFoodAllergies.join(', ') || 'ไม่มี' });
    }
    if ((patient.carePlan?.riskAssessment?.fallRiskScore ?? 5) !== Number(fallRiskScore)) {
      changes.push({ field: 'คะแนนความเสี่ยงหกล้ม (Fall Risk)', from: `${patient.carePlan?.riskAssessment?.fallRiskScore ?? 5}`, to: `${fallRiskScore}` });
    }
    if ((patient.serviceStatus || 'active') !== serviceStatus) {
      const statusLabels: Record<ClientServiceStatus, string> = {
        active: '🟢 กำลังใช้บริการ (Active)',
        discharged: '🔵 จำหน่ายกลับบ้านแล้ว (Discharged)',
        suspended: '🟡 พักบริการชั่วคราว (Suspended)',
        inactive: '🔴 สิ้นสุดการให้บริการ (Inactive)'
      };
      changes.push({
        field: 'สถานะการใช้บริการ',
        from: statusLabels[patient.serviceStatus || 'active'],
        to: statusLabels[serviceStatus]
      });
    }
    if (serviceStatus !== 'active' && (patient.inactiveReason || '') !== inactiveReason.trim()) {
      changes.push({
        field: 'สาเหตุที่ไม่ใช้บริการ / หมายเหตุจำหน่าย',
        from: patient.inactiveReason || 'ยังไม่ระบุ',
        to: inactiveReason.trim() || 'ยังไม่ระบุ'
      });
    }

    let auditLogs = [...(patient.auditLogs || [])];
    if (changes.length > 0) {
      auditLogs.unshift({
        id: `al-${Date.now()}`,
        patientId: patient.id,
        changedAt: new Date().toLocaleString('th-TH'),
        changedBy: 'เจ้าหน้าที่ผู้ดูแล (Care Manager / Admin)',
        category: 'แก้ไขข้อมูลผู้ป่วย',
        changes,
        summary: `บันทึกการแก้ไขข้อมูล: ${changes.map(c => c.field).join(', ')}`
      });
    }

    let caregiverHistory = [...(patient.caregiverHistory || [])];
    if (primaryCaregiverName.trim() && (patient.primaryCaregiverName || '') !== primaryCaregiverName.trim()) {
      caregiverHistory.unshift({
        id: `ch-${Date.now()}`,
        patientId: patient.id,
        caregiverName: primaryCaregiverName.trim(),
        role: newCareType === 'nursing_home' ? 'พนักงานบริบาลประจำศูนย์' : 'ผู้ดูแลประจำเคส',
        startDate: new Date().toISOString().split('T')[0],
        status: 'current',
        handoverSummary: 'เปลี่ยนผู้ดูแลหลักผ่านหน้าแก้ไขข้อมูลผู้ป่วย',
        assignedBy: 'เจ้าหน้าที่ผู้ดูแล (Care Manager)'
      });
    }

    const updatedPatient: Patient = {
      ...patient,
      thaiName: thaiName.trim(),
      name: name.trim() || thaiName.trim(),
      hn: hn.trim(),
      age: Number(age),
      gender,
      birthDate,
      avatar,
      careType: newCareType,
      serviceStatus,
      inactiveReason: serviceStatus === 'active' ? undefined : inactiveReason.trim(),
      inactiveDate: serviceStatus === 'active' ? undefined : inactiveDate,
      serviceStartDate,
      roomBed: newRoomBed,
      address: address.trim(),
      primaryCaregiverName: primaryCaregiverName.trim(),
      primaryDoctorName: primaryDoctorName.trim(),
      primaryHospital: primaryHospital.trim(),
      healthStatus,
      statusNotes: statusNotes.trim(),
      chronicDiseases: newChronic,
      drugAllergies: newDrugAllergies,
      foodAllergies: newFoodAllergies,
      emergencyContact: {
        name: emergencyName.trim() || 'ผู้ติดต่อฉุกเฉิน',
        relationship: emergencyRelationship.trim() || 'ญาติ',
        phone: emergencyPhone.trim() || '081-000-0000'
      },
      auditLogs,
      caregiverHistory,
      carePlan: {
        ...(patient.carePlan || { id: `cp-${patient.id}`, patientId: patient.id, medications: [] }),
        id: patient.carePlan?.id || `cp-${patient.id}`,
        patientId: patient.id,
        updatedAt: new Date().toLocaleString('th-TH'),
        precautions,
        doctorRecommendations: doctorRecommendationsText.split('\n').map(s => s.trim()).filter(Boolean),
        guidelines: guidelinesText.split('\n').map(s => s.trim()).filter(Boolean),
        recommendedActivities: recommendedActivitiesText.split(',').map(s => s.trim()).filter(Boolean),
        restrictedActivities: restrictedActivitiesText.split(',').map(s => s.trim()).filter(Boolean),
        medications: patient.carePlan?.medications || [],
        riskAssessment: {
          fallRiskScore: Number(fallRiskScore),
          bedriddenScale,
          dietaryRestrictions: dietaryRestrictionsText.split(',').map(s => s.trim()).filter(Boolean)
        }
      }
    };

    updatePatient(updatedPatient);
    onClose();
  };

  // Staff & Caregiver options for quick selection
  const staffOptions = [
    ...staff.map(s => `${s.thaiName} (${s.nickname ? 'Caregiver ' + s.nickname : s.subRole.split(' ')[0]})`),
    ...caregivers.map(c => c.thaiName)
  ];
  const uniqueStaffOptions = Array.from(new Set(staffOptions));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-cream-100 via-white to-cream-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  แก้ไขข้อมูลผู้ป่วย (Edit Patient Profile)
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sage-100 text-sage-900">
                  {patient.hn}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                แก้ไขข้อมูลทะเบียนผู้ป่วย, เปลี่ยนกลุ่มการให้บริการ, ผู้ดูแล, ข้อควรระวัง, และแผนการดูแล
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-cream-50/80 px-6 pt-3 border-b border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'basic', label: '1. ข้อมูลทั่วไป & รูปภาพ', icon: User },
            { id: 'care_group', label: '2. กลุ่มการดูแล & ผู้ดูแล', icon: Building2 },
            { id: 'medical', label: '3. แพทย์ & โรคประจำตัว', icon: Stethoscope },
            { id: 'precautions', label: '4. ข้อควรระวัง & ความเสี่ยง', icon: ShieldAlert },
            { id: 'care_plan', label: '5. แผนการดูแล (Care Plan)', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 text-xs font-bold whitespace-nowrap border-b-2 flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'border-sage-800 text-sage-900 font-extrabold'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sage-800' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: BASIC INFO & AVATAR */}
          {/* ========================================================================= */}
          {activeTab === 'basic' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Photo Section */}
              <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200">
                <label className="block text-xs font-bold text-gray-900 mb-2.5 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-sage-700" />
                  <span>รูปภาพประจำตัวผู้ป่วย (Patient Profile Photo)</span>
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
                      className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-sage-800 text-white shadow-md hover:bg-sage-900 transition-colors"
                      title="อัปโหลดรูปจากเครื่อง"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 space-y-2.5 w-full">
                    <span className="text-[11px] text-gray-500 font-medium block">
                      เลือกรูปโปรไฟล์ตัวอย่าง หรืออัปโหลดรูปใหม่:
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5 text-gray-500" />
                        <span>อัปโหลดรูปจากอุปกรณ์</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Names & HN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาไทย) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={thaiName}
                    onChange={e => setThaiName(e.target.value)}
                    placeholder="เช่น คุณยายสมศรี รัตนพร"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ชื่อ-นามสกุล (ภาษาอังกฤษ)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="เช่น Somsee Ratanaporn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* HN, Age, Gender, BirthDate */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    เลขประจำตัว HN <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={hn}
                    onChange={e => setHn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-gray-50"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-semibold"
                  >
                    <option value="female">หญิง</option>
                    <option value="male">ชาย</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    วันเดือนปีเกิด
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CARE GROUP, LOCATION & CAREGIVER */}
          {/* ========================================================================= */}
          {activeTab === 'care_group' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Care Type Selection */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200">
                <label className="block text-xs font-bold text-gray-900 mb-2.5">
                  🏷️ เปลี่ยนกลุ่มประเภทการให้บริการ (3 กลุ่ม):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Option 1: Nursing Home */}
                  <div
                    onClick={() => setCareType('nursing_home')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      careType === 'nursing_home'
                        ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-950">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>1. Nursing Home</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      พักรักษาตัวในศูนย์ 24 ชั่วโมง มีเตียง/ห้องพัก
                    </p>
                  </div>

                  {/* Option 2: Medical Escort */}
                  <div
                    onClick={() => setCareType('medical_escort')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      careType === 'medical_escort'
                        ? 'border-sky-600 bg-sky-50 ring-2 ring-sky-500/20'
                        : 'border-gray-200 bg-white hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-sky-950">
                      <Car className="w-4 h-4 text-sky-700" />
                      <span>2. นัดพบแพทย์ Escort</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      บริการพาไปพบแพทย์ ณ โรงพยาบาล และรถรับส่ง
                    </p>
                  </div>

                  {/* Option 3: Home Care */}
                  <div
                    onClick={() => setCareType('home_care')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      careType === 'home_care'
                        ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-white hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                      <Home className="w-4 h-4 text-amber-700" />
                      <span>3. ดูแลที่บ้าน Home Care</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      จัดส่งผู้ดูแลไปประจำบ้าน เช็กอิน GPS รายวัน
                    </p>
                  </div>

                </div>
              </div>

              {/* Room / Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {careType === 'nursing_home' ? 'ห้องพัก / วอร์ดในศูนย์' : careType === 'medical_escort' ? 'หมายเหตุบริการพาพบแพทย์' : 'ที่อยู่ / พิกัดประจำบ้าน'}
                  </label>
                  <input
                    type="text"
                    value={roomBed}
                    onChange={e => setRoomBed(e.target.value)}
                    placeholder={careType === 'nursing_home' ? 'เช่น Ward A - Room 204' : careType === 'medical_escort' ? 'เช่น นัดตรวจ EKG ทุกเดือน' : 'เช่น บ้านพักย่านสุขุมวิท 71'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ผู้ดูแลหลัก / เจ้าหน้าที่รับผิดชอบเคส (Primary Caregiver / Escort)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={primaryCaregiverName}
                      onChange={e => setPrimaryCaregiverName(e.target.value)}
                      placeholder="พิมพ์ชื่อ หรือเลือกจากรายชื่อด้านล่าง"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-bold text-sage-900"
                    />
                    <select
                      onChange={e => {
                        if (e.target.value) setPrimaryCaregiverName(e.target.value);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-cream-300 bg-cream-50 text-[11px] text-gray-600 focus:outline-none"
                    >
                      <option value="">-- เลือกจากพนักงาน/ผู้ดูแลในระบบ --</option>
                      {uniqueStaffOptions.map((name, idx) => (
                        <option key={idx} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ที่อยู่ผู้ป่วย / จุดรับส่ง
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="เช่น บ้านเลขที่ 88/12 ซอยอารีย์สัมพันธ์ 3 พญาไท กรุงเทพฯ 10400"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>

              {/* Service Status Section */}
              <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-900 mb-2">
                    ⚡ สถานะการใช้บริการ (Client Service Status):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    
                    <button
                      type="button"
                      onClick={() => {
                        setServiceStatus('active');
                        setInactiveReason('');
                      }}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        serviceStatus === 'active'
                          ? 'border-emerald-600 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>🟢 ใช้บริการ</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal">Active</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceStatus('discharged')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        serviceStatus === 'discharged'
                          ? 'border-sky-600 bg-sky-100 text-sky-950 ring-2 ring-sky-500/20 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>🔵 จำหน่ายแล้ว</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal">Discharged</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceStatus('suspended')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        serviceStatus === 'suspended'
                          ? 'border-amber-500 bg-amber-100 text-amber-950 ring-2 ring-amber-500/20 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>🟡 พักบริการ</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal">Suspended</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceStatus('inactive')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        serviceStatus === 'inactive'
                          ? 'border-rose-500 bg-rose-100 text-rose-950 ring-2 ring-rose-500/20 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-cream-100'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <UserX className="w-3.5 h-3.5 text-rose-600" />
                        <span>🔴 สิ้นสุดบริการ</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-normal">Inactive</span>
                    </button>

                  </div>
                </div>

                {/* If Not Active, Show Reason and Dates */}
                {serviceStatus !== 'active' && (
                  <div className="pt-2 border-t border-cream-200 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        สาเหตุที่ไม่ใช้บริการ / หมายเหตุการจำหน่าย: <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {[
                          'อาการดีขึ้น / ฟื้นฟูกล้ามเนื้อและข้อเข่าสมบูรณ์ ญาติรับกลับบ้าน',
                          'ส่งตัวไปรับการรักษาเฉพาะทาง / ผ่าตัดต่อที่โรงพยาบาล',
                          'ญาติดูแลเองที่บ้านชั่วคราว',
                          'พักบริการชั่วคราวเนื่องจากครอบครัวเดินทางต่างจังหวัด',
                          'ครบกำหนดตามสัญญาการให้บริการ',
                          'ผู้ป่วยขอยกเลิกบริการเนื่องจากย้ายถิ่นพำนัก'
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setInactiveReason(preset)}
                            className={`text-[10px] px-2 py-0.5 rounded-md border transition-all ${
                              inactiveReason === preset
                                ? 'bg-sage-800 text-white border-sage-800 font-semibold'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-cream-100'
                            }`}
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={inactiveReason}
                        onChange={e => setInactiveReason(e.target.value)}
                        placeholder="ระบุเหตุผล เช่น อาการดีขึ้นฟื้นฟูสมบูรณ์, ส่งตัวต่อ รพ.ศิริราช, ญาติดูแลเอง..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          วันที่หยุดรับบริการ / จำหน่าย:
                        </label>
                        <input
                          type="date"
                          value={inactiveDate}
                          onChange={e => setInactiveDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          วันที่เริ่มใช้บริการครั้งแรก:
                        </label>
                        <input
                          type="date"
                          value={serviceStartDate}
                          onChange={e => setServiceStartDate(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MEDICAL, DOCTOR & ALLERGIES */}
          {/* ========================================================================= */}
          {activeTab === 'medical' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Doctor & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    แพทย์ประจำตัว
                  </label>
                  <input
                    type="text"
                    value={primaryDoctorName}
                    onChange={e => setPrimaryDoctorName(e.target.value)}
                    placeholder="เช่น นพ. วิรัช วงศ์สว่าง (อายุรกรรมหัวใจ)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-bold"
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
                    placeholder="เช่น โรงพยาบาลกรุงเทพคริสเตียน"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-bold"
                  />
                </div>
              </div>

              {/* Health Status & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    สถานะสุขภาพ (Overall Health Status)
                  </label>
                  <select
                    value={healthStatus}
                    onChange={e => setHealthStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="stable">🟢 ปกติ (Stable)</option>
                    <option value="monitor">🟡 ติดตามอาการ (Monitor)</option>
                    <option value="attention">🔴 ต้องเฝ้าระวังพิเศษ (Attention)</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    บันทึกสรุปสถานะสุขภาพปัจจุบัน (Status Notes)
                  </label>
                  <input
                    type="text"
                    value={statusNotes}
                    onChange={e => setStatusNotes(e.target.value)}
                    placeholder="เช่น ระดับน้ำตาลค่อนข้างสูง เฝ้าระวังความดันช่วงเย็น"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              {/* Chronic Diseases & Allergies */}
              <div className="p-4 rounded-2xl bg-cream-50/60 border border-cream-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    โรคประจำตัว (คั่นด้วยเครื่องหมายจุลภาค ,)
                  </label>
                  <input
                    type="text"
                    value={chronicDiseasesText}
                    onChange={e => setChronicDiseasesText(e.target.value)}
                    placeholder="เช่น ความดันโลหิตสูง, เบาหวานชนิดที่ 2, กระดูกพรุน"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ประวัติแพ้ยา (Drug Allergies)
                    </label>
                    <input
                      type="text"
                      value={drugAllergiesText}
                      onChange={e => setDrugAllergiesText(e.target.value)}
                      placeholder="เช่น Penicillin, Aspirin"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ประวัติแพ้อาหาร (Food Allergies)
                    </label>
                    <input
                      type="text"
                      value={foodAllergiesText}
                      onChange={e => setFoodAllergiesText(e.target.value)}
                      placeholder="เช่น กุ้ง, อาหารรสเค็มจัด"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-2xl bg-rose-50/40 border border-rose-200/60 space-y-3">
                <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-700" />
                  <span>ข้อมูลผู้ติดต่อฉุกเฉิน / ญาติ (Emergency Contact)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="ชื่อผู้ติดต่อ (เช่น คุณธนพล รัตนพร)"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                  <input
                    type="text"
                    value={emergencyRelationship}
                    onChange={e => setEmergencyRelationship(e.target.value)}
                    placeholder="ความสัมพันธ์ (เช่น บุตรชาย)"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    placeholder="เบอร์โทรศัพท์ (เช่น 081-456-7890)"
                    className="px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PRECAUTIONS & RISK ASSESSMENT */}
          {/* ========================================================================= */}
          {activeTab === 'precautions' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              {/* Existing Precautions List */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>รายการข้อควรระวังที่มีอยู่ ({precautions.length} รายการ):</span>
                  </label>
                  <span className="text-[11px] text-gray-500">
                    แสดงบนป้ายเตือนการดูแลและหน้าจอลูกค้า
                  </span>
                </div>

                {precautions.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-gray-400">
                    ยังไม่มีการระบุข้อควรระวัง
                  </div>
                ) : (
                  <div className="space-y-2">
                    {precautions.map(alert => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                          alert.severity === 'high'
                            ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                            : alert.severity === 'medium'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            alert.severity === 'high' ? 'bg-rose-600 text-white' : alert.severity === 'medium' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                          }`}>
                            {alert.severity.toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <span className="font-bold block truncate">{alert.label}</span>
                            <span className="text-[11px] opacity-80 block truncate">{alert.details}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePrecaution(alert.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
                          title="ลบข้อควรระวังนี้"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Precaution Box */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <span className="text-xs font-bold text-gray-900 block flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-sage-800" />
                  <span>เพิ่มข้อควรระวังใหม่ (Add New Precaution Alert)</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      ประเภทข้อควรระวัง
                    </label>
                    <select
                      value={newPrecautionType}
                      onChange={e => setNewPrecautionType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none"
                    >
                      <option value="fall_risk">⚠️ ความเสี่ยงพลัดตกหกล้ม</option>
                      <option value="drug_allergy">💊 ประวัติแพ้ยา</option>
                      <option value="food_allergy">🦐 ประวัติแพ้อาหาร</option>
                      <option value="bedridden">🛏️ ผู้ป่วยติดเตียง / แผลกดทับ</option>
                      <option value="diabetes">🩸 เบาหวาน (น้ำตาลตก)</option>
                      <option value="hypertension">💓 ความดันโลหิตสูง</option>
                      <option value="dementia">🧠 ภาวะสมองเสื่อม / สับสน</option>
                      <option value="other">📌 อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      ระดับความรุนแรง
                    </label>
                    <select
                      value={newPrecautionSeverity}
                      onChange={e => setNewPrecautionSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none"
                    >
                      <option value="high">🔴 High (สำคัญมาก)</option>
                      <option value="medium">🟡 Medium (ปานกลาง)</option>
                      <option value="low">🟢 Low (เฝ้าระวังทั่วไป)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      ข้อความหัวข้อ
                    </label>
                    <input
                      type="text"
                      value={newPrecautionLabel}
                      onChange={e => setNewPrecautionLabel(e.target.value)}
                      placeholder="เช่น ระวังลื่นล้ม, แพ้ยาซัลฟา"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    รายละเอียดคำแนะนำเฉพาะ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPrecautionDetails}
                      onChange={e => setNewPrecautionDetails(e.target.value)}
                      placeholder="เช่น ต้องมีผู้ดูแลพยุงเสมอเมื่อเคลื่อนย้าย, ห้ามทานยาที่มีส่วนผสมของ Aspirin"
                      className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddPrecaution}
                      className="px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-colors shrink-0"
                    >
                      + เพิ่ม
                    </button>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Scale */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    คะแนนความเสี่ยงหกล้ม (0-10)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={fallRiskScore}
                    onChange={e => setFallRiskScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ระดับความช่วยเหลือตนเอง
                  </label>
                  <select
                    value={bedriddenScale}
                    onChange={e => setBedriddenScale(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none"
                  >
                    <option value="ambulatory">🚶 เดินได้เอง (Ambulatory)</option>
                    <option value="wheelchair">🧑‍🦽 ใช้วีลแชร์ (Wheelchair)</option>
                    <option value="bedridden">🛏️ ผู้ป่วยติดเตียง (Bedridden)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ข้อจำกัดด้านโภชนาการ
                  </label>
                  <input
                    type="text"
                    value={dietaryRestrictionsText}
                    onChange={e => setDietaryRestrictionsText(e.target.value)}
                    placeholder="เช่น Low Sodium, Blended Diet"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CARE PLAN GUIDELINES & RECOMMENDATIONS */}
          {/* ========================================================================= */}
          {activeTab === 'care_plan' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  🩺 คำแนะนำของแพทย์ (Doctor Recommendations - แยกบรรทัดละ 1 ข้อ)
                </label>
                <textarea
                  rows={4}
                  value={doctorRecommendationsText}
                  onChange={e => setDoctorRecommendationsText(e.target.value)}
                  placeholder="เช่น ควบคุมปริมาณแป้งและน้ำตาล ไม่เกิน 1,500 kcal/วัน&#10;วัดความดันโลหิตและระดับน้ำตาลวันละ 2 ครั้ง"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  📋 แนวทางการดูแลของพยาบาล/ผู้ดูแล (Care Guidelines - แยกบรรทัดละ 1 ข้อ)
                </label>
                <textarea
                  rows={4}
                  value={guidelinesText}
                  onChange={e => setGuidelinesText(e.target.value)}
                  placeholder="เช่น หลีกเลี่ยงการลุกจากเตียงกะทันหัน ต้องมีผู้ดูแลช่วยพยุงเสมอ&#10;บันทึกปริมาณอาหารและการขับถ่ายทุกมื้อ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ✨ กิจกรรมที่แนะนำ (Recommended Activities)
                  </label>
                  <input
                    type="text"
                    value={recommendedActivitiesText}
                    onChange={e => setRecommendedActivitiesText(e.target.value)}
                    placeholder="เช่น เดินแกว่งแขน 15 นาที, เล่นเกมฝึกสมอง"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    🚫 กิจกรรมที่ควรหลีกเลี่ยง / ข้อห้าม (Restricted Activities)
                  </label>
                  <input
                    type="text"
                    value={restrictedActivitiesText}
                    onChange={e => setRestrictedActivitiesText(e.target.value)}
                    placeholder="เช่น ห้ามยกของหนัก, ห้ามลุกเดินคนเดียวในห้องน้ำ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการแก้ไขข้อมูลผู้ป่วย</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
