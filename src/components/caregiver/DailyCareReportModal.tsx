import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Caregiver } from '../../types';
import { X, FileCheck2, Camera, Upload, Utensils, Pill, Activity, Moon, CheckCircle2 } from 'lucide-react';

interface DailyCareReportModalProps {
  caregiver: Caregiver;
  onClose: () => void;
}

export const DailyCareReportModal: React.FC<DailyCareReportModalProps> = ({ caregiver, onClose }) => {
  const { patients, submitDailyReport } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    caregiver.currentPatientId || patients[0]?.id || ''
  );

  const [mealsSummary, setMealsSummary] = useState('เช้า: ข้าวต้มปลา (90%), กลางวัน: โจ๊กหมูสับ (85%), เย็น: ซุปฟักทอง (80%) ดื่มน้ำรวม 1,600 ml');
  const [medsCompliance, setMedsCompliance] = useState<'all_given' | 'partial' | 'missed'>('all_given');
  const [bowelStatus, setBowelStatus] = useState('ขับถ่ายปกติ 1 ครั้ง อุจจาระนิ่ม ปัสสาวะสีเหลืองใส');
  const [sleepSummary, setSleepSummary] = useState('นอนหลับ 8 ชั่วโมง หลับสนิท ไม่ตื่นกลางดึก');
  const [activityNotes, setActivityNotes] = useState('ทำกายภาพกล้ามเนื้อมือและแขน 20 นาที นั่งชมสวนช่วงบ่าย อารมณ์แจ่มใส');
  const [abnormalSigns, setAbnormalSigns] = useState('ไม่มีอาการผิดปกติ ไม่มีไข้');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80');

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const latestVital = selectedPatient?.vitalsHistory[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    submitDailyReport({
      patientId: selectedPatient.id,
      patientName: selectedPatient.thaiName,
      caregiverId: caregiver.id,
      caregiverName: caregiver.thaiName,
      date: new Date().toISOString().slice(0, 10),
      mealsSummary,
      medsCompliance,
      bowelStatus,
      sleepSummary,
      activityNotes,
      abnormalSigns,
      vitalSummary: {
        bp: latestVital ? `${latestVital.sys}/${latestVital.dia} mmHg` : '120/80 mmHg',
        pulse: latestVital?.pulse || 74,
        glucose: latestVital?.glucose || 135,
        temp: latestVital?.temp || 36.6,
        spo2: latestVital?.spo2 || 98
      },
      photos: photoUrl ? [photoUrl] : []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ส่งรายงานการดูแลประจำวัน (Daily Care Report)
              </h2>
              <p className="text-xs text-gray-500">
                ผู้บันทึก: {caregiver.thaiName}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ผู้ป่วยที่รายงาน:
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.thaiName} ({p.hn})
                </option>
              ))}
            </select>
          </div>

          {/* Meals & Hydration */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              สรุปอาหารและปริมาณน้ำดื่ม
            </label>
            <textarea
              value={mealsSummary}
              onChange={e => setMealsSummary(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              required
            />
          </div>

          {/* Medication Compliance */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              การรับประทานยาตามแผนแพทย์
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'all_given', label: '✓ ทานครบทุกมื้อ' },
                { id: 'partial', label: 'ทานได้บางส่วน' },
                { id: 'missed', label: 'ลืมทาน/ปฏิเสธ' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMedsCompliance(item.id as any)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                    medsCompliance === item.id 
                      ? 'bg-sage-800 text-white border-sage-800 shadow-xs' 
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bowel & Sleep */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                การขับถ่าย
              </label>
              <input
                type="text"
                value={bowelStatus}
                onChange={e => setBowelStatus(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                การนอนหลับ
              </label>
              <input
                type="text"
                value={sleepSummary}
                onChange={e => setSleepSummary(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Activities & Abnormal signs */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              กิจกรรมบำบัด & สภาพอารมณ์
            </label>
            <textarea
              value={activityNotes}
              onChange={e => setActivityNotes(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Photo attachment preview */}
          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              แนบภาพถ่ายกิจกรรม / สภาพผู้ป่วยประจำวัน
            </label>
            <div className="flex items-center gap-3">
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt="Daily care preview"
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs shrink-0"
                />
              )}
              <div className="text-xs text-gray-500">
                <span className="font-bold text-sage-900 block">ภาพถ่ายกิจกรรมทำกายภาพ</span>
                <span className="text-[11px] text-emerald-700 font-semibold">✓ แนบภาพพร้อมส่งต่อให้ญาติ</span>
              </div>
            </div>
          </div>

          {/* Actions */}
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
              ส่งรายงานประจำวัน & แจ้งเตือนญาติ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
