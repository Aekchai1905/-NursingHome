import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, ClientServiceStatus } from '../../types';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  UserX, 
  Save, 
  HelpCircle,
  Calendar,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

interface ClientStatusModalProps {
  patient: Patient;
  onClose: () => void;
}

const presetReasons = [
  'อาการดีขึ้น / ฟื้นฟูกล้ามเนื้อและข้อเข่าสมบูรณ์ ญาติรับกลับบ้าน',
  'ส่งตัวไปรับการรักษาเฉพาะทาง / ผ่าตัดต่อที่โรงพยาบาล',
  'ญาติดูแลเองที่บ้านชั่วคราว (อาการคงที่)',
  'พักบริการชั่วคราวเนื่องจากครอบครัวเดินทางต่างจังหวัด/ต่างประเทศ',
  'ครบกำหนดตามสัญญาการให้บริการ (3 เดือน / 6 เดือน)',
  'ผู้ป่วยขอยกเลิกบริการเนื่องจากย้ายถิ่นพำนัก',
  'ผู้ป่วยถึงแก่กรรมอย่างสงบ'
];

export const ClientStatusModal: React.FC<ClientStatusModalProps> = ({ patient, onClose }) => {
  const { updatePatient } = useApp();

  const [status, setStatus] = useState<ClientServiceStatus>(patient.serviceStatus || 'active');
  const [inactiveReason, setInactiveReason] = useState<string>(patient.inactiveReason || '');
  const [inactiveDate, setInactiveDate] = useState<string>(
    patient.inactiveDate || new Date().toISOString().split('T')[0]
  );
  const [serviceStartDate, setServiceStartDate] = useState<string>(
    patient.serviceStartDate || '2026-01-01'
  );
  const [notes, setNotes] = useState<string>('');

  const handleStatusSelect = (newStatus: ClientServiceStatus) => {
    setStatus(newStatus);
    if (newStatus === 'active') {
      setInactiveReason('');
    } else if (!inactiveReason && presetReasons.length > 0) {
      // Preselect first suggestion if empty
      if (newStatus === 'discharged') {
        setInactiveReason(presetReasons[0]);
      } else if (newStatus === 'suspended') {
        setInactiveReason(presetReasons[3]);
      } else {
        setInactiveReason(presetReasons[1]);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const previousStatus = patient.serviceStatus || 'active';
    const statusLabels: Record<ClientServiceStatus, string> = {
      active: '🟢 กำลังใช้บริการ (Active)',
      discharged: '🔵 จำหน่ายกลับบ้านแล้ว / ฟื้นฟูหายดี (Discharged)',
      suspended: '🟡 พักบริการชั่วคราว (Suspended)',
      inactive: '🔴 สิ้นสุดการให้บริการ (Inactive)'
    };

    const changes: { field: string; from: string; to: string }[] = [];
    if (previousStatus !== status) {
      changes.push({
        field: 'สถานะการใช้บริการ',
        from: statusLabels[previousStatus],
        to: statusLabels[status]
      });
    }
    if (status !== 'active' && (patient.inactiveReason || '') !== inactiveReason.trim()) {
      changes.push({
        field: 'สาเหตุที่ไม่ใช้บริการ / หมายเหตุจำหน่าย',
        from: patient.inactiveReason || 'ยังไม่ระบุ',
        to: inactiveReason.trim() || 'ยังไม่ระบุ'
      });
    }

    let auditLogs = [...(patient.auditLogs || [])];
    if (changes.length > 0) {
      auditLogs.unshift({
        id: `al-status-${Date.now()}`,
        patientId: patient.id,
        changedAt: new Date().toLocaleString('th-TH'),
        changedBy: 'เจ้าหน้าที่ผู้ดูแล (Care Manager)',
        category: 'เปลี่ยนสถานะการใช้บริการ',
        changes,
        summary: `ปรับสถานะเป็น "${statusLabels[status]}" โดยมีสาเหตุ: ${inactiveReason || 'ไม่มี'}`
      });
    }

    const updatedPatient: Patient = {
      ...patient,
      serviceStatus: status,
      inactiveReason: status === 'active' ? undefined : inactiveReason.trim(),
      inactiveDate: status === 'active' ? undefined : inactiveDate,
      serviceStartDate: serviceStartDate,
      statusNotes: notes.trim() ? `${patient.statusNotes ? patient.statusNotes + ' | ' : ''}${notes.trim()}` : patient.statusNotes,
      auditLogs
    };

    updatePatient(updatedPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-cream-200 flex flex-col">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-cream-200 bg-gradient-to-r from-cream-100 via-white to-sage-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={patient.avatar}
              alt={patient.thaiName}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sage-800 text-cream-100">
                  {patient.hn}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  อายุ {patient.age} ปี
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-sage-950 mt-0.5">
                {patient.thaiName}
              </h2>
              <p className="text-xs text-gray-500">
                ปรับสถานะการใช้บริการ & บันทึกสาเหตุ (Real-time Audit Log)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-cream-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 space-y-6">
          
          {/* Status Selection Cards */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              1. เลือกสถานะการใช้บริการ (Service Status):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option 1: Active */}
              <div
                onClick={() => handleStatusSelect('active')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'active'
                    ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-cream-50/50'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  status === 'active' ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <span>🟢 กำลังใช้บริการ</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-800">Active</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    รับการดูแลตามปกติ มีพนักงานและบันทึกสัญญาณชีพประจำวัน
                  </p>
                </div>
              </div>

              {/* Option 2: Discharged / Recovered */}
              <div
                onClick={() => handleStatusSelect('discharged')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'discharged'
                    ? 'border-sky-600 bg-sky-50/80 ring-2 ring-sky-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-sky-300 hover:bg-cream-50/50'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  status === 'discharged' ? 'bg-sky-600 text-white' : 'bg-sky-100 text-sky-800'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <span>🔵 จำหน่ายกลับบ้านแล้ว</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-sky-200 text-sky-800">Discharged</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    อาการดีขึ้น ฟื้นฟูหายดี ญาติรับกลับไปดูแลต่อเอง
                  </p>
                </div>
              </div>

              {/* Option 3: Suspended */}
              <div
                onClick={() => handleStatusSelect('suspended')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'suspended'
                    ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-cream-50/50'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  status === 'suspended' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                }`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🟡 พักบริการชั่วคราว</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-800">Suspended</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    ระงับบริการชั่วคราว เช่น เดินทางต่างจังหวัด หรือแอดมิท รพ.
                  </p>
                </div>
              </div>

              {/* Option 4: Inactive */}
              <div
                onClick={() => handleStatusSelect('inactive')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  status === 'inactive'
                    ? 'border-rose-500 bg-rose-50/80 ring-2 ring-rose-500/20 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-rose-300 hover:bg-cream-50/50'
                }`}
              >
                <div className={`p-2 rounded-xl mt-0.5 ${
                  status === 'inactive' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                }`}>
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                    <span>🔴 สิ้นสุดการให้บริการ</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-800">Inactive</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                    หมดสัญญา, ย้ายศูนย์, ย้ายโรงพยาบาล, หรือเสียชีวิต
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* If Inactive / Discharged / Suspended: Show Reason Section */}
          {status !== 'active' && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-sage-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sage-700" />
                  <span>2. ระบุสาเหตุที่ไม่ใช้บริการ / หมายเหตุการจำหน่าย: <span className="text-rose-500">*</span></span>
                </label>
                <span className="text-[11px] text-gray-500">คลิกเลือกข้อความด่วนด้านล่างได้</span>
              </div>

              {/* Quick Chip Suggestions */}
              <div className="flex flex-wrap gap-1.5">
                {presetReasons.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setInactiveReason(preset)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all text-left ${
                      inactiveReason === preset
                        ? 'bg-sage-800 text-white border-sage-800 font-semibold shadow-xs'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-cream-100 hover:border-cream-300'
                    }`}
                  >
                    + {preset}
                  </button>
                ))}
              </div>

              {/* Text Input for Reason */}
              <div>
                <textarea
                  value={inactiveReason}
                  onChange={e => setInactiveReason(e.target.value)}
                  placeholder="พิมพ์รายละเอียดสาเหตุที่หยุดรับบริการ หรือข้อตกลงในการส่งต่อเคส..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-500 font-medium"
                  required
                />
              </div>

              {/* Date of Discharge / Inactive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    วันที่เริ่มหยุดบริการ / จำหน่าย:
                  </label>
                  <input
                    type="date"
                    value={inactiveDate}
                    onChange={e => setInactiveDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
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
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Status Note or Handover Remark */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              หมายเหตุเพิ่มเติมสำหรับการดูแล (Optional Remarks):
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="เช่น ส่งต่อประวัติยาให้ญาติเรียบร้อย, นัดติดตามอาการทางโทรศัพท์ใน 14 วัน"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-cream-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sage-800 text-cream-100 text-xs font-bold hover:bg-sage-900 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกสถานะ & อัปเดตประวัติ</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
