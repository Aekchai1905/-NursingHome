import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { 
  X, 
  Stethoscope, 
  Building2, 
  Calendar, 
  Clock, 
  UserCheck, 
  FileText, 
  Pill, 
  Upload, 
  CheckCircle2, 
  Camera, 
  AlertCircle,
  Video,
  Home,
  FileSpreadsheet,
  Plus,
  Trash2,
  Sparkles
} from 'lucide-react';

interface DoctorVisitModalProps {
  patient?: Patient;
  onClose: () => void;
}

export const DoctorVisitModal: React.FC<DoctorVisitModalProps> = ({ patient, onClose }) => {
  const { patients, recordDoctorVisit, currentRole } = useApp();

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patient?.id || patients[0]?.id || ''
  );
  const activePatient = patients.find(p => p.id === selectedPatientId) || patient || patients[0];

  // Visit Type / Mode
  const [visitType, setVisitType] = useState<'onsite' | 'hospital' | 'telemed'>('onsite');

  // Doctor & Facility Info
  const [doctorName, setDoctorName] = useState('นพ. วรพจน์ ธนสารสมบัติ');
  const [hospitalName, setHospitalName] = useState('CareNest Nursing Home (On-site Clinic)');
  const [department, setDepartment] = useState('อายุรกรรมทั่วไปและผู้สูงอายุ');

  // Date & Time
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  const [visitDate, setVisitDate] = useState(defaultDate);
  const [visitTime, setVisitTime] = useState(defaultTime);

  // Clinical Details
  const [reason, setReason] = useState('ตรวจติดตามสุขภาพประจำเดือนและประเมินระดับความดันโลหิต');
  const [diagnosis, setDiagnosis] = useState('ความดันโลหิตสูงและเบาหวานชนิดที่ 2 ควบคุมได้ดี ไม่มีภาวะแทรกซ้อนเฉียบพลัน');
  const [treatmentOrders, setTreatmentOrders] = useState('ควบคุมอาหารเค็มต่อเนื่อง, พลิกตัวสม่ำเสมอทุก 2-3 ชม., ออกกำลังกายกายภาพเบาๆ ช่วงเช้า');
  const [medicationChanges, setMedicationChanges] = useState('คงยาเดิม Amlodipine 5mg 1 tab od pc เช้า, Metformin 500mg 1 tab bid pc');

  // Next Appointment
  const [hasNextAppointment, setHasNextAppointment] = useState(true);
  const [nextAppointmentDate, setNextAppointmentDate] = useState('2026-10-10 10:00');
  const [nextAppointmentDept, setNextAppointmentDept] = useState('อายุรกรรมผู้สูงอายุ');

  // Documents / Photos
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
  const [uploadedSlip, setUploadedSlip] = useState<string | null>(null);
  const [uploadedPrescription, setUploadedPrescription] = useState<string | null>(null);

  // Recorder Info
  const [recordedBy, setRecordedBy] = useState(
    currentRole === 'doctor' 
      ? 'นพ. วรพจน์ ธนสารสมบัติ (แพทย์ผู้ตรวจ)' 
      : currentRole === 'care_manager' 
      ? 'พว. มัลลิกา วงศ์สุวรรณ (Care Manager)' 
      : 'พยาบาลวิชาชีพประจำเวร CareNest'
  );

  // Preset Reasons
  const quickReasons = [
    'ตรวจสุขภาพประจำรอบเดือน',
    'ปรับขนาดยาความดัน / เบาหวาน',
    'ตรวจประเมินแผลกดทับ & ทำแผล',
    'ตรวจประเมินการกลืน & กายภาพบำบัด',
    'มีอาการไอ เสมหะ หรือไข้ต่ำ',
    'ติดตามผลการตรวจทางห้องปฏิบัติการ (Lab)'
  ];

  // Quick preset templates
  const handleVisitTypeChange = (type: 'onsite' | 'hospital' | 'telemed') => {
    setVisitType(type);
    if (type === 'onsite') {
      setHospitalName('CareNest Nursing Home (On-site Clinic)');
      setDoctorName('นพ. วรพจน์ ธนสารสมบัติ');
      setDepartment('เวชศาสตร์ผู้สูงอายุ (Geriatrics)');
    } else if (type === 'hospital') {
      setHospitalName('โรงพยาบาลศิริราช ปิยมหาราชการุณย์');
      setDoctorName('ศ.นพ. สิทธิชัย เกียรติอนันต์');
      setDepartment('ศูนย์อายุรกรรมระบบประสาทและสมอง');
    } else {
      setHospitalName('CareNest Telemedicine Service');
      setDoctorName('พญ. ณิชชา ประเสริฐกุล');
      setDepartment('คลินิกให้คำปรึกษาแพทย์ทางไกล');
    }
  };

  // Image Upload Handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    recordDoctorVisit({
      patientId: activePatient.id,
      visitLocation: visitType === 'onsite' ? 'ศูนย์ Nursing Home (On-site)' : visitType === 'hospital' ? hospitalName : 'Telemedicine',
      doctorName,
      hospitalName,
      department,
      visitDateTime: `${visitDate} ${visitTime}`,
      reason,
      diagnosis,
      treatmentOrders,
      medicationChanges,
      nextAppointmentDate: hasNextAppointment ? nextAppointmentDate : undefined,
      receiptUrl: uploadedReceipt || undefined,
      slipUrl: uploadedSlip || undefined,
      recordedBy
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sage-800 text-white flex items-center justify-center shadow-md shadow-sage-800/20">
              <Stethoscope className="w-6 h-6 text-cream-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-sage-900 font-serif">
                  บันทึกการพบแพทย์ (Doctor Visit Record)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sage-100 text-sage-800 border border-sage-200">
                  Nursing Home Log
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                บันทึกประวัติการตรวจรักษา คำวินิจฉัย การปรับเปลี่ยนยา และส่งแจ้งเตือนครอบครัวอัตโนมัติ
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          
          {/* Section 1: Patient Selection */}
          <div className="bg-cream-50/50 p-4 rounded-2xl border border-cream-200">
            <label className="block text-xs font-bold text-sage-900 mb-2">
              1. เลือกผู้ป่วย Nursing Home ที่เข้ารับการตรวจ
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.thaiName} ({p.hn}) - {p.roomBed || 'Home Care'} [อายุ {p.age} ปี]
                  </option>
                ))}
              </select>

              {activePatient && (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                  <img
                    src={activePatient.avatar}
                    alt={activePatient.thaiName}
                    className="w-10 h-10 rounded-full object-cover border border-sage-200"
                  />
                  <div className="text-xs overflow-hidden">
                    <div className="font-bold text-gray-900 truncate">{activePatient.thaiName}</div>
                    <div className="text-[11px] text-gray-500">
                      HN: {activePatient.hn} • {activePatient.roomBed || 'Home Care'} • แพทย์ประจำ: {activePatient.primaryDoctorName || '-'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Precautions Alert Chips */}
            {activePatient?.carePlan?.precautions && activePatient.carePlan.precautions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-cream-200 flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  ข้อควรระวังของผู้ป่วย:
                </span>
                {activePatient.carePlan.precautions.map((prec, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    ⚠️ {prec.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Visit Type / Location Mode */}
          <div>
            <label className="block text-xs font-bold text-sage-900 mb-2">
              2. รูปแบบและสถานที่การพบแพทย์
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleVisitTypeChange('onsite')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  visitType === 'onsite'
                    ? 'border-sage-600 bg-sage-50/80 text-sage-900 shadow-xs ring-1 ring-sage-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${visitType === 'onsite' ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">ตรวจ ณ เนอร์สซิ่งโฮม</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">แพทย์เวร / Round ประจำศูนย์</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleVisitTypeChange('hospital')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  visitType === 'hospital'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${visitType === 'hospital' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">พาไปตรวจ รพ. / คลินิก</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">OPD ตรวจเฉพาะทางภายนอก</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleVisitTypeChange('telemed')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  visitType === 'telemed'
                    ? 'border-sky-600 bg-sky-50/80 text-sky-900 shadow-xs ring-1 ring-sky-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600 bg-white'
                }`}
              >
                <div className={`p-2 rounded-xl ${visitType === 'telemed' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Telemedicine</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">ปรึกษาแพทย์ผ่านระบบวิดีโอ</div>
                </div>
              </button>
            </div>
          </div>

          {/* Section 3: Doctor & Facility Information */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ชื่อแพทย์ผู้ตรวจ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                placeholder="เช่น นพ. วรพจน์ ธนสารสมบัติ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                โรงพยาบาล / ศูนย์บริการ <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                placeholder="เช่น CareNest On-site Clinic หรือ รพ.ศิริราช"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                แผนก / สาขาวิชา
              </label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="เช่น อายุรกรรมผู้สูงอายุ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Section 4: Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-cream-50/40 p-3.5 rounded-2xl border border-cream-200">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sage-700" />
                วันที่พบแพทย์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sage-700" />
                เวลาที่พบแพทย์ <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={visitTime}
                onChange={e => setVisitTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Section 5: Reason & Symptoms */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-gray-700">
                สาเหตุการตรวจ / อาการนำ (Reason for Consultation) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-gray-400">คลิกข้อความลัดด้านล่างเพื่อเลือก</span>
            </div>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="ระบุอาการสำคัญ หรือวัตถุประสงค์ในการพบแพทย์..."
              required
            />
            {/* Quick Reason Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickReasons.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReason(chip)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gray-100 hover:bg-sage-100 hover:text-sage-800 text-gray-600 transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Physical Exam & Diagnosis */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sage-700" />
              ผลการตรวจร่างกาย & คำวินิจฉัยของแพทย์ (Doctor's Examination & Diagnosis) <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="ระบุผลการฟังปอด เสียงหัวใจ อาการบวม คำวินิจฉัยของแพทย์..."
              required
            />
          </div>

          {/* Section 7: Treatment Orders & Care Directives */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              คำสั่งการรักษาใหม่ & คำแนะนำสำหรับทีมพยาบาล/ผู้ดูแล (Treatment Orders & Nursing Directives)
            </label>
            <textarea
              value={treatmentOrders}
              onChange={e => setTreatmentOrders(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="เช่น การจัดท่านอน การฝึกทำกายภาพ การสังเกตอาการผิดปกติ..."
            />
          </div>

          {/* Section 8: Medication Changes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-purple-700" />
              การปรับขนาดยา / รายการยาสั่งใหม่ (Medication Adjustments & New Prescriptions)
            </label>
            <textarea
              value={medicationChanges}
              onChange={e => setMedicationChanges(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              placeholder="ระบุชื่อยา ขนาดรับประทาน เวลา และยาที่หยุดหรือเริ่มใหม่..."
            />
          </div>

          {/* Section 9: Next Appointment Scheduling */}
          <div className="bg-cream-50/60 p-4 rounded-2xl border border-cream-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-sage-900 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hasNextAppointment}
                  onChange={e => setHasNextAppointment(e.target.checked)}
                  className="rounded text-sage-800 focus:ring-sage-600 w-4 h-4"
                />
                มีการนัดหมายตรวจครั้งถัดไป (Follow-up Appointment)
              </label>
              {hasNextAppointment && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  เปิดระบบแจ้งเตือนอัตโนมัติ
                </span>
              )}
            </div>

            {hasNextAppointment && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    วันและเวลานัดหมายครั้งถัดไป
                  </label>
                  <input
                    type="text"
                    value={nextAppointmentDate}
                    onChange={e => setNextAppointmentDate(e.target.value)}
                    placeholder="เช่น 2026-10-10 10:00"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    แผนก / แพทย์ที่นัดตรวจ
                  </label>
                  <input
                    type="text"
                    value={nextAppointmentDept}
                    onChange={e => setNextAppointmentDept(e.target.value)}
                    placeholder="เช่น แผนกอายุรกรรมผู้สูงอายุ"
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 bg-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 10: Document & Slip Uploads */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-sage-700" />
                แนบภาพถ่ายเอกสารทางการแพทย์ (ใบเสร็จ / ใบนัด / ใบสั่งยา)
              </label>
              <span className="text-[10px] text-gray-400">อัปโหลดไฟล์รูปภาพหรือเลือกภาพตัวอย่าง</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Receipt Upload Box */}
              <div className="p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-sage-400 bg-cream-50/40 flex flex-col items-center justify-center text-center relative group min-h-[120px]">
                {uploadedReceipt ? (
                  <div className="w-full relative">
                    <img
                      src={uploadedReceipt}
                      alt="ใบเสร็จค่ารักษา"
                      className="w-full h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="text-[10px] font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      แนบใบเสร็จแล้ว
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedReceipt(null)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer py-2 w-full flex flex-col items-center">
                    <Camera className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-bold text-sage-800">1. ใบเสร็จค่าตรวจ</span>
                    <span className="text-[10px] text-gray-400">คลิกอัปโหลด / ถ่ายรูป</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setUploadedReceipt)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setUploadedReceipt('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
                      }}
                      className="mt-1 px-2 py-0.5 rounded bg-sage-100 text-[10px] text-sage-800 hover:bg-sage-200"
                    >
                      ใช้รูปตัวอย่าง
                    </button>
                  </label>
                )}
              </div>

              {/* Slip Upload Box */}
              <div className="p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-sage-400 bg-cream-50/40 flex flex-col items-center justify-center text-center relative group min-h-[120px]">
                {uploadedSlip ? (
                  <div className="w-full relative">
                    <img
                      src={uploadedSlip}
                      alt="ใบนัดหมายแพทย์"
                      className="w-full h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="text-[10px] font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      แนบใบนัดแพทย์แล้ว
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedSlip(null)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer py-2 w-full flex flex-col items-center">
                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-bold text-sage-800">2. ใบนัดตรวจรอบถัดไป</span>
                    <span className="text-[10px] text-gray-400">คลิกอัปโหลด / ถ่ายรูป</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setUploadedSlip)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setUploadedSlip('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80');
                      }}
                      className="mt-1 px-2 py-0.5 rounded bg-sage-100 text-[10px] text-sage-800 hover:bg-sage-200"
                    >
                      ใช้รูปตัวอย่าง
                    </button>
                  </label>
                )}
              </div>

              {/* Prescription / Lab Box */}
              <div className="p-3 rounded-2xl border-2 border-dashed border-gray-200 hover:border-sage-400 bg-cream-50/40 flex flex-col items-center justify-center text-center relative group min-h-[120px]">
                {uploadedPrescription ? (
                  <div className="w-full relative">
                    <img
                      src={uploadedPrescription}
                      alt="ใบสั่งยาหรือผลตรวจ"
                      className="w-full h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="text-[10px] font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      แนบใบสั่งยา/ผลแล็บแล้ว
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedPrescription(null)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg opacity-80 hover:opacity-100"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer py-2 w-full flex flex-col items-center">
                    <Pill className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs font-bold text-sage-800">3. ใบสั่งยา / ผลแล็บ</span>
                    <span className="text-[10px] text-gray-400">คลิกอัปโหลด / ถ่ายรูป</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, setUploadedPrescription)}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setUploadedPrescription('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80');
                      }}
                      className="mt-1 px-2 py-0.5 rounded bg-sage-100 text-[10px] text-sage-800 hover:bg-sage-200"
                    >
                      ใช้รูปตัวอย่าง
                    </button>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Section 11: Recorded By */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sage-700" />
              ผู้บันทึกข้อมูล (Recorder Signature) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={recordedBy}
              onChange={e => setRecordedBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500 bg-cream-50/30"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-5 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft flex items-center gap-2 transition-all transform active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-cream-300" />
              บันทึกผลการพบแพทย์ & ซิงค์ข้อมูลเข้าสู่ระบบ
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
