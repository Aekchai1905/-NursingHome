import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { X, FileCheck2, Camera, Upload, CheckCircle2, Calendar, Pill } from 'lucide-react';

interface PostVisitModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const PostVisitModal: React.FC<PostVisitModalProps> = ({ appointment, onClose }) => {
  const { submitPostVisitSummary } = useApp();

  const [visitNotes, setVisitNotes] = useState('แพทย์ตรวจความดันและการได้ยิน สภาพทั่วไปดีขึ้น มีการปรับขนาดยาเล็กน้อย');
  const [newTreatmentOrders, setNewTreatmentOrders] = useState('ลดขนาดยาความดันลงครึ่งเม็ด และควบคุมอาหารเค็มต่อเนื่อง');
  const [medicationChanges, setMedicationChanges] = useState('Amlodipine ปรับเป็น 2.5 mg วันละ 1 ครั้ง');
  const [nextAppointmentDate, setNextAppointmentDate] = useState('2026-10-15 09:30');
  const [nextAppointmentDept, setNextAppointmentDept] = useState(appointment.department);
  const [uploadedReceipt, setUploadedReceipt] = useState<string | null>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  const [uploadedSlip, setUploadedSlip] = useState<string | null>('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPostVisitSummary(appointment.id, {
      visitNotes,
      newTreatmentOrders,
      medicationChanges,
      nextAppointmentDate,
      nextAppointmentDept,
      receiptUrl: uploadedReceipt || undefined,
      slipUrl: uploadedSlip || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-700 text-white shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                บันทึกผลการพบแพทย์ (Post-Visit Summary)
              </h2>
              <p className="text-xs text-gray-500">
                {appointment.patientName} • {appointment.hospitalName}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Visit Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              สรุปคำวินิจฉัยและผลการตรวจของแพทย์ (Doctor's Consultation Summary)
            </label>
            <textarea
              value={visitNotes}
              onChange={e => setVisitNotes(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              required
            />
          </div>

          {/* Treatment Orders */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              คำสั่งการรักษาใหม่ & แนวทางปฏิบัติ (New Orders & Instructions)
            </label>
            <textarea
              value={newTreatmentOrders}
              onChange={e => setNewTreatmentOrders(e.target.value)}
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              required
            />
          </div>

          {/* Medication Changes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              ยาที่มีการเปลี่ยนแปลง / ยาใหม่ที่ได้รับ
            </label>
            <input
              type="text"
              value={medicationChanges}
              onChange={e => setMedicationChanges(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
            />
          </div>

          {/* Next Appointment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                วันและเวลานัดหมายครั้งถัดไป
              </label>
              <input
                type="text"
                value={nextAppointmentDate}
                onChange={e => setNextAppointmentDate(e.target.value)}
                placeholder="เช่น 2026-10-15 09:30"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                แผนก / คลินิกนัดครั้งถัดไป
              </label>
              <input
                type="text"
                value={nextAppointmentDept}
                onChange={e => setNextAppointmentDept(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>
          </div>

          {/* Document Upload Simulator */}
          <div className="pt-3 border-t border-gray-100">
            <label className="block text-xs font-bold text-gray-700 mb-2">
              อัปโหลดเอกสาร (ใบเสร็จ / ใบนัดหมายแพทย์ / รูปถ่าย)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Receipt Upload Box */}
              <div className="p-3.5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-sage-400 bg-cream-50/50 flex flex-col items-center justify-center text-center">
                {uploadedReceipt ? (
                  <div className="relative group w-full">
                    <img
                      src={uploadedReceipt}
                      alt="ใบเสร็จ"
                      className="w-full h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="text-[11px] font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      แนบใบเสร็จเรียบร้อย
                    </div>
                  </div>
                ) : (
                  <div className="cursor-pointer py-3" onClick={() => setUploadedReceipt('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80')}>
                    <Camera className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-sage-800">ถ่ายรูปใบเสร็จ</span>
                    <p className="text-[10px] text-gray-400">คลิกเพื่อจำลองการอัปโหลด</p>
                  </div>
                )}
              </div>

              {/* Slip Upload Box */}
              <div className="p-3.5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-sage-400 bg-cream-50/50 flex flex-col items-center justify-center text-center">
                {uploadedSlip ? (
                  <div className="relative group w-full">
                    <img
                      src={uploadedSlip}
                      alt="ใบนัด"
                      className="w-full h-24 object-cover rounded-xl shadow-xs"
                    />
                    <div className="text-[11px] font-bold text-emerald-800 mt-1 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      แนบใบนัดแพทย์เรียบร้อย
                    </div>
                  </div>
                ) : (
                  <div className="cursor-pointer py-3" onClick={() => setUploadedSlip('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80')}>
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs font-bold text-sage-800">ถ่ายรูปใบนัดครั้งถัดไป</span>
                    <p className="text-[10px] text-gray-400">คลิกเพื่อจำลองการอัปโหลด</p>
                  </div>
                )}
              </div>
            </div>
          </div>

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
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-soft"
            >
              บันทึกและส่งรายงานผลให้ญาติทันที
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
