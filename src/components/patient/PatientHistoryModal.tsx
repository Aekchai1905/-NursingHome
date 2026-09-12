import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Patient, 
  MedicationHistoryRecord, 
  AllergyHistoryRecord, 
  CaregiverHistoryRecord, 
  PatientAuditLog,
  Medication
} from '../../types';
import { 
  X, 
  Pill, 
  AlertTriangle, 
  ShieldAlert, 
  UserCheck, 
  History, 
  Plus, 
  Clock, 
  Calendar, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Phone,
  Building2,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

interface PatientHistoryModalProps {
  patient: Patient;
  initialTab?: 'medications' | 'allergies' | 'caregivers' | 'audit_logs';
  onClose: () => void;
}

export const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({ 
  patient, 
  initialTab = 'medications', 
  onClose 
}) => {
  const { updatePatient, staff, caregivers } = useApp();
  const [activeTab, setActiveTab] = useState<'medications' | 'allergies' | 'caregivers' | 'audit_logs'>(initialTab);

  // Toggle Add Forms
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [showAddAllergyForm, setShowAddAllergyForm] = useState(false);
  const [showAddCaregiverForm, setShowAddCaregiverForm] = useState(false);

  // 1. Add Medication Form State
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFrequency, setMedFrequency] = useState('');
  const [medActionType, setMedActionType] = useState<MedicationHistoryRecord['actionType']>('prescribed');
  const [medReason, setMedReason] = useState('');
  const [medPrescribedBy, setMedPrescribedBy] = useState(patient.primaryDoctorName || 'นพ. วิรัช วงศ์สว่าง');
  const [medEffectiveDate, setMedEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [medNotes, setMedNotes] = useState('');

  // 2. Add Allergy Form State
  const [allergenName, setAllergenName] = useState('');
  const [allergyCategory, setAllergyCategory] = useState<AllergyHistoryRecord['category']>('drug');
  const [allergySeverity, setAllergySeverity] = useState<AllergyHistoryRecord['severity']>('high');
  const [allergySymptoms, setAllergySymptoms] = useState('');
  const [allergyIdentifiedDate, setAllergyIdentifiedDate] = useState(new Date().toISOString().split('T')[0]);
  const [allergyRecordedBy, setAllergyRecordedBy] = useState('พยาบาลประจำศูนย์');
  const [allergyStatus, setAllergyStatus] = useState<AllergyHistoryRecord['status']>('active');
  const [allergyNotes, setAllergyNotes] = useState('');

  // 3. Add Caregiver Form State
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverRole, setCaregiverRole] = useState('พนักงานบริบาลประจำศูนย์ (Nursing Home Care)');
  const [caregiverPhone, setCaregiverPhone] = useState('081-000-0000');
  const [caregiverStartDate, setCaregiverStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [caregiverEndDate, setCaregiverEndDate] = useState('');
  const [caregiverStatus, setCaregiverStatus] = useState<CaregiverHistoryRecord['status']>('current');
  const [caregiverHandover, setCaregiverHandover] = useState('');
  const [caregiverAssignedBy, setCaregiverAssignedBy] = useState('รวิวรรณ แสงดาว (Care Manager)');

  // Handlers
  const handleAddMedicationRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    const actionLabelMap: Record<MedicationHistoryRecord['actionType'], string> = {
      prescribed: 'สั่งจ่ายยาใหม่',
      dosage_changed: 'ปรับเปลี่ยนขนาดยา',
      discontinued: 'หยุดใช้ยาถาวร',
      switched: 'สลับเปลี่ยนตัวยา'
    };

    const newRecord: MedicationHistoryRecord = {
      id: `mh-${Date.now()}`,
      patientId: patient.id,
      medicationName: medName.trim(),
      dosage: medDosage.trim() || 'ตามแพทย์สั่ง',
      frequency: medFrequency.trim() || 'วันละ 1 ครั้ง',
      actionType: medActionType,
      actionLabel: actionLabelMap[medActionType],
      reason: medReason.trim() || 'ตามดุลยพินิจของแพทย์',
      prescribedBy: medPrescribedBy.trim(),
      effectiveDate: medEffectiveDate,
      recordedAt: new Date().toLocaleString('th-TH'),
      notes: medNotes.trim()
    };

    const currentHistory = patient.medicationHistory || [];
    const updatedHistory = [newRecord, ...currentHistory];

    // If active medication prescribed, ensure in carePlan
    let updatedMedications = [...(patient.carePlan?.medications || [])];
    if (medActionType === 'prescribed') {
      const newMed: Medication = {
        id: `med-${Date.now()}`,
        name: medName.trim(),
        dosage: medDosage.trim(),
        frequency: medFrequency.trim(),
        timing: ['morning', 'after_meal'],
        instructions: medNotes.trim() || medReason.trim(),
        prescribedBy: medPrescribedBy.trim()
      };
      updatedMedications = [newMed, ...updatedMedications];
    } else if (medActionType === 'discontinued') {
      updatedMedications = updatedMedications.filter(m => !m.name.toLowerCase().includes(medName.trim().toLowerCase()));
    }

    // Auto audit log
    const auditItem: PatientAuditLog = {
      id: `al-${Date.now()}`,
      patientId: patient.id,
      changedAt: new Date().toLocaleString('th-TH'),
      changedBy: medPrescribedBy.trim(),
      category: 'ประวัติยาและการรักษา',
      changes: [
        { field: 'ยา', from: '-', to: `${actionLabelMap[medActionType]}: ${medName} (${medDosage})` }
      ],
      summary: `บันทึกประวัติยา: ${actionLabelMap[medActionType]} ${medName}`
    };

    const updatedPatient: Patient = {
      ...patient,
      medicationHistory: updatedHistory,
      carePlan: {
        ...(patient.carePlan || { id: `cp-${patient.id}`, patientId: patient.id }),
        id: patient.carePlan?.id || `cp-${patient.id}`,
        patientId: patient.id,
        updatedAt: new Date().toLocaleString('th-TH'),
        medications: updatedMedications,
        doctorRecommendations: patient.carePlan?.doctorRecommendations || [],
        guidelines: patient.carePlan?.guidelines || [],
        recommendedActivities: patient.carePlan?.recommendedActivities || [],
        restrictedActivities: patient.carePlan?.restrictedActivities || [],
        precautions: patient.carePlan?.precautions || [],
        riskAssessment: patient.carePlan?.riskAssessment || { fallRiskScore: 5, bedriddenScale: 'ambulatory', dietaryRestrictions: [] }
      },
      auditLogs: [auditItem, ...(patient.auditLogs || [])]
    };

    updatePatient(updatedPatient);
    setMedName('');
    setMedDosage('');
    setMedFrequency('');
    setMedReason('');
    setMedNotes('');
    setShowAddMedForm(false);
  };

  const handleAddAllergyRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergenName.trim()) return;

    const newAllergy: AllergyHistoryRecord = {
      id: `ah-${Date.now()}`,
      patientId: patient.id,
      allergen: allergenName.trim(),
      category: allergyCategory,
      severity: allergySeverity,
      symptoms: allergySymptoms.trim() || 'มีอาการแพ้',
      identifiedDate: allergyIdentifiedDate,
      recordedBy: allergyRecordedBy.trim(),
      status: allergyStatus,
      notes: allergyNotes.trim()
    };

    const currentAllergies = patient.allergyHistory || [];
    const updatedAllergies = [newAllergy, ...currentAllergies];

    // Update drugAllergies or foodAllergies list if active
    let drugAllergies = [...patient.drugAllergies];
    let foodAllergies = [...patient.foodAllergies];

    if (allergyStatus === 'active') {
      if (allergyCategory === 'drug' && !drugAllergies.includes(allergenName.trim())) {
        drugAllergies.push(allergenName.trim());
      } else if (allergyCategory === 'food' && !foodAllergies.includes(allergenName.trim())) {
        foodAllergies.push(allergenName.trim());
      }
    }

    const auditItem: PatientAuditLog = {
      id: `al-${Date.now()}`,
      patientId: patient.id,
      changedAt: new Date().toLocaleString('th-TH'),
      changedBy: allergyRecordedBy.trim(),
      category: 'ประวัติการแพ้',
      changes: [
        { field: 'การแพ้', from: '-', to: `บันทึกแพ้ ${allergenName} (${allergyCategory === 'drug' ? 'ยา' : 'อาหาร'}) ระดับ ${allergySeverity}` }
      ],
      summary: `บันทึกประวัติการแพ้ใหม่: ${allergenName}`
    };

    const updatedPatient: Patient = {
      ...patient,
      drugAllergies,
      foodAllergies,
      allergyHistory: updatedAllergies,
      auditLogs: [auditItem, ...(patient.auditLogs || [])]
    };

    updatePatient(updatedPatient);
    setAllergenName('');
    setAllergySymptoms('');
    setAllergyNotes('');
    setShowAddAllergyForm(false);
  };

  const handleAddCaregiverRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName.trim()) return;

    const newCaregiverRec: CaregiverHistoryRecord = {
      id: `ch-${Date.now()}`,
      patientId: patient.id,
      caregiverName: caregiverName.trim(),
      role: caregiverRole.trim(),
      phone: caregiverPhone.trim(),
      startDate: caregiverStartDate,
      endDate: caregiverEndDate.trim() || undefined,
      status: caregiverStatus,
      handoverSummary: caregiverHandover.trim() || 'ส่งมอบเวรและหน้าที่การดูแลตามมาตรฐาน',
      assignedBy: caregiverAssignedBy.trim()
    };

    const currentHistory = patient.caregiverHistory || [];
    const updatedHistory = [newCaregiverRec, ...currentHistory];

    const auditItem: PatientAuditLog = {
      id: `al-${Date.now()}`,
      patientId: patient.id,
      changedAt: new Date().toLocaleString('th-TH'),
      changedBy: caregiverAssignedBy.trim(),
      category: 'การมอบหมายผู้ดูแล',
      changes: [
        { field: 'ผู้ดูแล', from: patient.primaryCaregiverName || 'ยังไม่ระบุ', to: caregiverName.trim() }
      ],
      summary: `บันทึกการมอบหมายผู้ดูแล: ${caregiverName}`
    };

    const updatedPatient: Patient = {
      ...patient,
      primaryCaregiverName: caregiverStatus === 'current' ? caregiverName.trim() : patient.primaryCaregiverName,
      caregiverHistory: updatedHistory,
      auditLogs: [auditItem, ...(patient.auditLogs || [])]
    };

    updatePatient(updatedPatient);
    setCaregiverName('');
    setCaregiverHandover('');
    setShowAddCaregiverForm(false);
  };

  // Staff picker options
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
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  ศูนย์รวมประวัติการบันทึกและการปรับปรุงข้อมูล (Patient History & Audit Log)
                </h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sage-100 text-sage-900">
                  {patient.hn}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {patient.thaiName} • ข้อมูลปัจจุบันจะแสดงเป็นหลัก และเก็บบันทึกประวัติการเปลี่ยนแปลงทุกครั้ง
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 pt-3 gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('medications')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-t border-x ${
              activeTab === 'medications'
                ? 'bg-white text-sage-900 border-gray-200 -mb-px shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-100/50'
            }`}
          >
            <Pill className="w-4 h-4 text-purple-600" />
            <span>💊 ประวัติยา & การปรับเปลี่ยน ({patient.medicationHistory?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('allergies')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-t border-x ${
              activeTab === 'allergies'
                ? 'bg-white text-sage-900 border-gray-200 -mb-px shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-100/50'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>⚠️ ประวัติการแพ้ยาและอาหาร ({patient.allergyHistory?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('caregivers')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-t border-x ${
              activeTab === 'caregivers'
                ? 'bg-white text-sage-900 border-gray-200 -mb-px shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-100/50'
            }`}
          >
            <UserCheck className="w-4 h-4 text-sage-700" />
            <span>👤 ประวัติการมอบหมายผู้ดูแล ({patient.caregiverHistory?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border-t border-x ${
              activeTab === 'audit_logs'
                ? 'bg-white text-sage-900 border-gray-200 -mb-px shadow-xs'
                : 'text-gray-500 hover:text-gray-800 border-transparent hover:bg-gray-100/50'
            }`}
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>📝 บันทึกประวัติการแก้ไขข้อมูล (Audit Log: {patient.auditLogs?.length || 0})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">

          {/* TAB 1: MEDICATION HISTORY */}
          {activeTab === 'medications' && (
            <div className="space-y-6">
              {/* Active Medications Banner */}
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-purple-700" />
                    <h4 className="text-xs font-extrabold text-purple-950">รายการยาปัจจุบันที่กำลังรับประทาน (Active Medications - ข้อมูลล่าสุด)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-lg">
                    {patient.carePlan?.medications?.length || 0} รายการ
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
                  {patient.carePlan?.medications?.map(m => (
                    <div key={m.id} className="p-2.5 rounded-xl bg-white border border-purple-100 shadow-2xs text-xs space-y-0.5">
                      <div className="font-bold text-gray-900 flex items-center justify-between">
                        <span>{m.name}</span>
                        <span className="text-purple-700 font-semibold">{m.dosage}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">{m.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Medication Adjustment Button & Form */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>ไทม์ไลน์ประวัติการสั่งยาและการปรับเปลี่ยน (Medication History Timeline)</span>
                  </h3>
                  <button
                    onClick={() => setShowAddMedForm(!showAddMedForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddMedForm ? 'ซ่อนแบบฟอร์ม' : '+ บันทึกการปรับยา / ยาใหม่'}</span>
                  </button>
                </div>

                {showAddMedForm && (
                  <form onSubmit={handleAddMedicationRecord} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 mt-4 space-y-4 animate-in fade-in">
                    <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      บันทึกเหตุการณ์การปรับเปลี่ยนยาหรือสั่งจ่ายยาใหม่
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ชื่อยา *</label>
                        <input
                          type="text"
                          required
                          value={medName}
                          onChange={(e) => setMedName(e.target.value)}
                          placeholder="เช่น Amlodipine, Metformin"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ขนาดยา (Dosage)</label>
                        <input
                          type="text"
                          value={medDosage}
                          onChange={(e) => setMedDosage(e.target.value)}
                          placeholder="เช่น 5 mg (ปรับเพิ่มจาก 2.5 mg)"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ประเภทการเปลี่ยนแปลง *</label>
                        <select
                          value={medActionType}
                          onChange={(e) => setMedActionType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-semibold"
                        >
                          <option value="prescribed">🟢 สั่งจ่ายยาใหม่ (Prescribed)</option>
                          <option value="dosage_changed">🟡 ปรับเพิ่ม/ลดขนาดยา (Dosage Changed)</option>
                          <option value="discontinued">🔴 หยุดใช้ยาถาวร (Discontinued)</option>
                          <option value="switched">🔄 สลับเปลี่ยนตัวยา (Switched)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ความถี่ในการทาน</label>
                        <input
                          type="text"
                          value={medFrequency}
                          onChange={(e) => setMedFrequency(e.target.value)}
                          placeholder="เช่น วันละ 1 ครั้ง หลังอาหารเช้า"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">แพทย์ผู้สั่ง / ผู้ดูแล</label>
                        <input
                          type="text"
                          value={medPrescribedBy}
                          onChange={(e) => setMedPrescribedBy(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">วันที่มีผล (Effective Date)</label>
                        <input
                          type="date"
                          value={medEffectiveDate}
                          onChange={(e) => setMedEffectiveDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">เหตุผลทางการแพทย์ (Reason / Indication)</label>
                        <input
                          type="text"
                          value={medReason}
                          onChange={(e) => setMedReason(e.target.value)}
                          placeholder="เช่น ความดันช่วงบ่ายยังสูง, ลดอาการระคายเคืองกระเพาะ"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">คำแนะนำ / หมายเหตุเพิ่มเติม</label>
                        <input
                          type="text"
                          value={medNotes}
                          onChange={(e) => setMedNotes(e.target.value)}
                          placeholder="เช่น ติดตามวัดความดันต่อเนื่อง 1 สัปดาห์"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddMedForm(false)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs"
                      >
                        บันทึกประวัติยา
                      </button>
                    </div>
                  </form>
                )}

                {/* History Timeline List */}
                <div className="space-y-3 mt-4">
                  {(!patient.medicationHistory || patient.medicationHistory.length === 0) ? (
                    <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl">
                      ยังไม่มีประวัติการปรับเปลี่ยนยาที่บันทึกไว้
                    </div>
                  ) : (
                    patient.medicationHistory.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-purple-200 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                              rec.actionType === 'prescribed' ? 'bg-emerald-100 text-emerald-800' :
                              rec.actionType === 'dosage_changed' ? 'bg-amber-100 text-amber-800' :
                              rec.actionType === 'discontinued' ? 'bg-rose-100 text-rose-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {rec.actionLabel || rec.actionType}
                            </span>
                            <span className="font-extrabold text-sm text-gray-900">{rec.medicationName}</span>
                            <span className="text-xs font-semibold text-purple-800">({rec.dosage})</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>มีผลตั้งแต่: <strong className="text-gray-700">{rec.effectiveDate}</strong></span>
                            <span className="text-gray-300">•</span>
                            <span>โดย {rec.prescribedBy}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl">
                          <div>
                            <span className="font-bold text-gray-700">ความถี่: </span>
                            <span>{rec.frequency}</span>
                          </div>
                          <div>
                            <span className="font-bold text-gray-700">เหตุผล: </span>
                            <span className="text-gray-800">{rec.reason || '-'}</span>
                          </div>
                          {rec.notes && (
                            <div className="sm:col-span-2 text-[11px] text-gray-500 italic">
                              หมายเหตุ: {rec.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALLERGY HISTORY */}
          {activeTab === 'allergies' && (
            <div className="space-y-6">
              {/* Active Allergies Banner */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-700" />
                    <h4 className="text-xs font-extrabold text-rose-950">ประวัติการแพ้ที่มีผลในปัจจุบัน (Active Allergies - ข้อมูลล่าสุด)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-lg">
                    {patient.drugAllergies.length + patient.foodAllergies.length} รายการ
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {patient.drugAllergies.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                      💊 แพ้ยา: {a}
                    </span>
                  ))}
                  {patient.foodAllergies.map((a, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-white border border-amber-200 text-amber-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                      🦐 แพ้อาหาร: {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Allergy Record Form & Button */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>ประวัติบันทึกการแพ้ทั้งหมด (Allergy History & Severity Records)</span>
                  </h3>
                  <button
                    onClick={() => setShowAddAllergyForm(!showAddAllergyForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddAllergyForm ? 'ซ่อนแบบฟอร์ม' : '+ บันทึกประวัติการแพ้ใหม่'}</span>
                  </button>
                </div>

                {showAddAllergyForm && (
                  <form onSubmit={handleAddAllergyRecord} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 mt-4 space-y-4 animate-in fade-in">
                    <h4 className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      บันทึกประวัติการแพ้ยา อาหาร หรือสารก่อภูมิแพ้
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">สารก่อภูมิแพ้ / ชื่อยา *</label>
                        <input
                          type="text"
                          required
                          value={allergenName}
                          onChange={(e) => setAllergenName(e.target.value)}
                          placeholder="เช่น Penicillin, กุ้ง, ถั่วลิสง"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">หมวดหมู่</label>
                        <select
                          value={allergyCategory}
                          onChange={(e) => setAllergyCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-semibold"
                        >
                          <option value="drug">💊 แพ้ยา (Drug Allergy)</option>
                          <option value="food">🦐 แพ้อาหาร (Food Allergy)</option>
                          <option value="environmental">🌿 สิ่งแวดล้อม (Environmental)</option>
                          <option value="other">⚠️ อื่นๆ (Other)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ระดับความรุนแรง</label>
                        <select
                          value={allergySeverity}
                          onChange={(e) => setAllergySeverity(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-semibold"
                        >
                          <option value="high">🔴 สูงมาก (Anaphylaxis / หายใจติดขัด)</option>
                          <option value="medium">🟡 ปานกลาง (ผื่นคัน / บวมรอบตา)</option>
                          <option value="low">🟢 เล็กน้อย (คันระคายเคืองเล็กน้อย)</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">สถานะ</label>
                        <select
                          value={allergyStatus}
                          onChange={(e) => setAllergyStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-semibold"
                        >
                          <option value="active">Active (ยังมีผลอยู่)</option>
                          <option value="resolved">Resolved (หายแล้ว)</option>
                          <option value="suspected">Suspected (ต้องสงสัย)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">อาการที่พบ (Symptoms)</label>
                        <input
                          type="text"
                          value={allergySymptoms}
                          onChange={(e) => setAllergySymptoms(e.target.value)}
                          placeholder="เช่น ผื่นลมพิษ แน่นหน้าอก หายใจมีเสียงหวีด คลื่นไส้"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ผู้บันทึก / วันที่ตรวจพบ</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={allergyRecordedBy}
                            onChange={(e) => setAllergyRecordedBy(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                          />
                          <input
                            type="date"
                            value={allergyIdentifiedDate}
                            onChange={(e) => setAllergyIdentifiedDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAllergyForm(false)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs"
                      >
                        บันทึกประวัติการแพ้
                      </button>
                    </div>
                  </form>
                )}

                {/* History List */}
                <div className="space-y-3 mt-4">
                  {(!patient.allergyHistory || patient.allergyHistory.length === 0) ? (
                    <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl">
                      ยังไม่มีประวัติการแพ้ที่บันทึกไว้
                    </div>
                  ) : (
                    patient.allergyHistory.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-rose-200 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                              rec.severity === 'high' ? 'bg-rose-100 text-rose-800' :
                              rec.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              ความรุนแรง: {rec.severity === 'high' ? 'สูงมาก (High)' : rec.severity === 'medium' ? 'ปานกลาง' : 'เล็กน้อย'}
                            </span>
                            <span className="font-extrabold text-sm text-gray-900">{rec.allergen}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-semibold">
                              {rec.category === 'drug' ? 'ยา' : rec.category === 'food' ? 'อาหาร' : 'สิ่งแวดล้อม'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>วันที่ตรวจพบ: <strong className="text-gray-700">{rec.identifiedDate}</strong></span>
                            <span className="text-gray-300">•</span>
                            <span>โดย {rec.recordedBy}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-gray-50/80 text-xs text-gray-700 space-y-1">
                          <div>
                            <span className="font-bold text-gray-900">อาการที่พบ: </span>
                            <span className="text-rose-700 font-semibold">{rec.symptoms}</span>
                          </div>
                          {rec.notes && (
                            <div className="text-[11px] text-gray-500 italic">
                              หมายเหตุ: {rec.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAREGIVER ASSIGNMENT HISTORY */}
          {activeTab === 'caregivers' && (
            <div className="space-y-6">
              {/* Current Caregiver Banner */}
              <div className="p-4 rounded-2xl bg-sage-50/70 border border-sage-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-sage-800" />
                    <h4 className="text-xs font-extrabold text-sage-950">ผู้ดูแลหลักประจำตัวในปัจจุบัน (Current Primary Caregiver - ข้อมูลล่าสุด)</h4>
                  </div>
                  <span className="text-[11px] font-bold text-sage-900 bg-sage-200/70 px-2.5 py-0.5 rounded-lg">
                    ผู้ดูแลปัจจุบัน
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sage-100 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sage-100 text-sage-800 flex items-center justify-center font-bold">
                      👤
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-900">{patient.primaryCaregiverName || 'ยังไม่ระบุ'}</h5>
                      <p className="text-xs text-gray-500">{patient.careType === 'nursing_home' ? 'ประจำศูนย์เนอร์สซิ่งโฮม' : 'บริการดูแลที่บ้าน Home Care'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Caregiver Handover Form & Button */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <span>ประวัติการส่งมอบงานและการมอบหมายผู้ดูแล (Caregiver Handover History)</span>
                  </h3>
                  <button
                    onClick={() => setShowAddCaregiverForm(!showAddCaregiverForm)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddCaregiverForm ? 'ซ่อนแบบฟอร์ม' : '+ บันทึกการเปลี่ยนผู้ดูแล / ส่งมอบงาน'}</span>
                  </button>
                </div>

                {showAddCaregiverForm && (
                  <form onSubmit={handleAddCaregiverRecord} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 mt-4 space-y-4 animate-in fade-in">
                    <h4 className="text-xs font-bold text-sage-950 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-sage-700" />
                      บันทึกการส่งมอบเวรและมอบหมายผู้ดูแลคนใหม่
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">เลือกผู้ดูแล *</label>
                        <input
                          type="text"
                          required
                          list="staff-history-options"
                          value={caregiverName}
                          onChange={(e) => setCaregiverName(e.target.value)}
                          placeholder="พิมพ์หรือเลือกรายชื่อ..."
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-sage-500"
                        />
                        <datalist id="staff-history-options">
                          {uniqueStaffOptions.map((opt, i) => (
                            <option key={i} value={opt} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ตำแหน่ง / บทบาท</label>
                        <input
                          type="text"
                          value={caregiverRole}
                          onChange={(e) => setCaregiverRole(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">เบอร์ติดต่อ</label>
                        <input
                          type="text"
                          value={caregiverPhone}
                          onChange={(e) => setCaregiverPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">วันที่เริ่มดูแล</label>
                        <input
                          type="date"
                          value={caregiverStartDate}
                          onChange={(e) => setCaregiverStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">วันที่สิ้นสุด (ถ้ามี)</label>
                        <input
                          type="date"
                          value={caregiverEndDate}
                          onChange={(e) => setCaregiverEndDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">สถานะ</label>
                        <select
                          value={caregiverStatus}
                          onChange={(e) => setCaregiverStatus(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-semibold"
                        >
                          <option value="current">🟢 ปัจจุบัน (Current)</option>
                          <option value="completed">⚪ สิ้นสุดการดูแลแล้ว (Completed)</option>
                          <option value="transferred">🔄 โอนย้ายเคส (Transferred)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">สรุปการส่งมอบเวร / สภาพผู้ป่วย</label>
                        <input
                          type="text"
                          value={caregiverHandover}
                          onChange={(e) => setCaregiverHandover(e.target.value)}
                          placeholder="เช่น ดูแลประจำห้อง 204 ช่วยเหลือกิจวัตรทั่วไป ฟื้นฟูกายภาพเบาๆ"
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-700 block mb-1">ผู้มอบหมาย (Care Manager / Admin)</label>
                        <input
                          type="text"
                          value={caregiverAssignedBy}
                          onChange={(e) => setCaregiverAssignedBy(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCaregiverForm(false)}
                        className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-xs"
                      >
                        บันทึกประวัติผู้ดูแล
                      </button>
                    </div>
                  </form>
                )}

                {/* Caregiver History List */}
                <div className="space-y-3 mt-4">
                  {(!patient.caregiverHistory || patient.caregiverHistory.length === 0) ? (
                    <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl">
                      ยังไม่มีประวัติการส่งมอบงานผู้ดูแล
                    </div>
                  ) : (
                    patient.caregiverHistory.map((rec) => (
                      <div key={rec.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-sage-200 transition-all space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                              rec.status === 'current' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {rec.status === 'current' ? '🟢 กำลังดูแลอยู่' : '⚪ สิ้นสุดการดูแล'}
                            </span>
                            <span className="font-extrabold text-sm text-gray-900">{rec.caregiverName}</span>
                            <span className="text-xs text-gray-500">({rec.role})</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{rec.startDate} ถึง {rec.endDate || 'ปัจจุบัน'}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-gray-50/80 text-xs text-gray-700 space-y-1">
                          {rec.handoverSummary && (
                            <div>
                              <span className="font-bold text-gray-900">บันทึกการดูแล/ส่งมอบ: </span>
                              <span>{rec.handoverSummary}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                            <span>เบอร์ติดต่อ: {rec.phone || 'ไม่ระบุ'}</span>
                            <span>มอบหมายโดย: {rec.assignedBy}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'audit_logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <span>บันทึกประวัติการแก้ไขข้อมูลเวชระเบียน (Patient Audit Trail)</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    เก็บบันทึกประวัติทุกครั้งที่มีการแก้ไขข้อมูลในหน้าจอ Edit Profile หรือบันทึกใหม่
                  </p>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  ทั้งหมด {patient.auditLogs?.length || 0} รายการ
                </span>
              </div>

              <div className="space-y-3">
                {(!patient.auditLogs || patient.auditLogs.length === 0) ? (
                  <div className="p-6 text-center text-gray-400 text-xs bg-gray-50 rounded-2xl">
                    ยังไม่มีประวัติการแก้ไขข้อมูล
                  </div>
                ) : (
                  patient.auditLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-blue-200 transition-all space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">
                            {log.category}
                          </span>
                          <span className="font-bold text-xs text-gray-900">{log.summary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{log.changedAt}</span>
                          <span className="text-gray-300">•</span>
                          <span>โดย <strong className="text-gray-700">{log.changedBy}</strong></span>
                        </div>
                      </div>

                      {log.changes && log.changes.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-gray-50 text-xs space-y-1">
                          {log.changes.map((c, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-gray-700">
                              <span className="font-bold text-gray-900 shrink-0">{c.field}:</span>
                              <span className="text-gray-400 line-through truncate max-w-xs">{c.from}</span>
                              <ArrowRight className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="text-sage-800 font-semibold">{c.to}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between shrink-0">
          <div className="text-xs text-gray-500">
            ระบบจะอัปเดตข้อมูลล่าสุดบนหน้าจอหลักโดยอัตโนมัติ พร้อมเก็บบันทึกประวัติย้อนหลังทุกครั้ง
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
