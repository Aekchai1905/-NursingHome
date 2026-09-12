import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment, EscortStaff } from '../../types';
import { X, Sparkles, Check, Star, ShieldCheck, MapPin, Award, UserCheck } from 'lucide-react';

interface JobMatchingModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const JobMatchingModal: React.FC<JobMatchingModalProps> = ({ appointment, onClose }) => {
  const { escortStaff, assignEscortStaff } = useApp();
  const [selectedStaffId, setSelectedStaffId] = useState<string>(appointment.escortStaffId || '');

  // Calculate matching score for each staff
  const staffWithScores = escortStaff.map(staff => {
    let score = 70;
    let matchReasons: string[] = [];

    if (staff.availability === 'available') {
      score += 20;
      matchReasons.push('สถานะว่างพร้อมปฏิบัติงาน');
    } else if (staff.availability === 'busy') {
      score -= 10;
      matchReasons.push('มีคิวงานอื่นในวันเดียวกัน');
    }

    // Check location / skills
    if (staff.skills.some(s => s.includes('วีลแชร์') || s.includes('พยุง') || s.includes('CPR'))) {
      score += 10;
      matchReasons.push('มีทักษะเคลื่อนย้ายและ CPR ตรงตามความเสี่ยง');
    }

    return {
      staff,
      score: Math.min(score, 99),
      matchReasons
    };
  }).sort((a, b) => b.score - a.score);

  const handleConfirmAssignment = () => {
    if (!selectedStaffId) return;
    assignEscortStaff(appointment.id, selectedStaffId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ระบบแนะนำจับคู่พนักงาน (Escort Job Matching)
              </h2>
              <p className="text-xs text-gray-500">
                จับคู่พนักงานที่เหมาะสมตามพื้นที่ ทักษะ และช่วงเวลาว่าง
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

        {/* Target Job Info */}
        <div className="p-4 bg-cream-100/60 border-b border-cream-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-bold text-gray-900">ผู้ป่วย: {appointment.patientName}</span>
            <p className="text-gray-600 mt-0.5">{appointment.hospitalName} ({appointment.department})</p>
          </div>
          <div className="text-right">
            <span className="font-semibold text-sage-900">📅 {appointment.dateTime} น.</span>
          </div>
        </div>

        {/* Staff Candidates List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {staffWithScores.map(({ staff, score, matchReasons }) => {
            const isSelected = selectedStaffId === staff.id;
            return (
              <div
                key={staff.id}
                onClick={() => setSelectedStaffId(staff.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected 
                    ? 'bg-sage-50/70 border-sage-500 ring-2 ring-sage-500/20 shadow-xs' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={staff.avatar}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-gray-900">{staff.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        staff.availability === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        ● {staff.availability}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="flex items-center text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none mr-1" />
                        {staff.rating}
                      </span>
                      <span>• งานสำเร็จ {staff.totalTrips} ทริป</span>
                      <span>• {staff.phone}</span>
                    </div>

                    {/* Match reasons */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {matchReasons.map((r, i) => (
                        <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-cream-200/80 text-gray-700">
                          ✓ {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score badge & Select radio */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-sage-800">Match Score</span>
                    <p className="text-base font-extrabold text-sage-900">{score}%</p>
                  </div>
                  <button
                    type="button"
                    className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected ? 'bg-sage-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected ? '✓ เลือกแล้ว' : 'เลือกคนนี้'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-cream-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirmAssignment}
            disabled={!selectedStaffId}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 disabled:opacity-50 text-white shadow-soft"
          >
            ยืนยันการมอบหมายงาน
          </button>
        </div>
      </div>
    </div>
  );
};
