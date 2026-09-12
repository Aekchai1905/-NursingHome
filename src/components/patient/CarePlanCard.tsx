import React from 'react';
import { CarePlan } from '../../types';
import { PrecautionBadge } from '../common/Badge';
import { 
  FileText, 
  Pill, 
  CheckCircle, 
  XCircle, 
  ShieldAlert, 
  Clock, 
  User, 
  AlertTriangle,
  History
} from 'lucide-react';

interface CarePlanCardProps {
  carePlan: CarePlan;
  onOpenMedHistory?: () => void;
}

export const CarePlanCard: React.FC<CarePlanCardProps> = ({ carePlan, onOpenMedHistory }) => {
  return (
    <div className="space-y-6">
      {/* Visual Alert Infographic Badges */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                ข้อควรระวังเฉพาะบุคคล & การแจ้งเตือน (Care Alerts & Precautions)
              </h3>
              <p className="text-xs text-gray-500">ความเสี่ยงและภาวะที่ผู้ดูแลต้องทราบล่วงหน้า</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
            {carePlan.precautions.length} รายการแจ้งเตือน
          </span>
        </div>

        {/* Infographic Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {carePlan.precautions.map(alert => (
            <PrecautionBadge key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Doctor Recommendations & Care Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="p-2 rounded-xl bg-sage-100 text-sage-800">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">คำแนะนำจากแพทย์ประจำตัว (Doctor's Orders)</h3>
                <p className="text-[11px] text-gray-400">อัปเดตล่าสุด: {carePlan.updatedAt}</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {carePlan.doctorRecommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-sage-100 text-sage-800 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-cream-100 border border-cream-200 text-xs">
            <span className="font-bold text-gray-900">ข้อจำกัดอาหาร: </span>
            <span className="text-gray-700">{carePlan.riskAssessment.dietaryRestrictions.join(', ')}</span>
          </div>
        </div>

        {/* Allowed vs Restricted Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
          <h3 className="text-sm font-bold text-gray-900 pb-3 border-b border-gray-100">
            แนวทางการทำกิจกรรม (Activity Guidelines)
          </h3>

          <div className="space-y-4 mt-4">
            {/* Recommended Activities */}
            <div>
              <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                กิจกรรมที่ควรทำ / กายภาพบำบัด
              </h4>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-gray-600">
                {carePlan.recommendedActivities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>

            {/* Restricted Activities */}
            <div className="pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                กิจกรรมที่ห้ามทำ / ข้อจำกัด
              </h4>
              <ul className="space-y-1.5 pl-5 list-disc text-xs text-rose-700">
                {carePlan.restrictedActivities.map((act, i) => (
                  <li key={i}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Medication Timetable */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">ตารางการรับประทานยา (Medication Schedule - ข้อมูลล่าสุด)</h3>
              <p className="text-xs text-gray-500">รายการยาที่แพทย์สั่งและกำลังใช้อยู่ในปัจจุบัน</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenMedHistory && (
              <button
                onClick={onOpenMedHistory}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold border border-purple-200 shadow-2xs transition-all cursor-pointer"
                title="ดูประวัติการปรับยาและสั่งยาในอดีต"
              >
                <History className="w-3.5 h-3.5 text-purple-700" />
                <span>📜 ดูประวัติการปรับยา</span>
              </button>
            )}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
              {carePlan.medications.length} รายการยา
            </span>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="pb-2.5 font-semibold">ชื่อยา (Medication)</th>
                <th className="pb-2.5 font-semibold">ขนาดยา</th>
                <th className="pb-2.5 font-semibold">เวลา & ความถี่</th>
                <th className="pb-2.5 font-semibold">คำแนะนำ / สรรพคุณ</th>
                <th className="pb-2.5 font-semibold text-right">แพทย์ผู้สั่ง</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {carePlan.medications.map(med => (
                <tr key={med.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 pr-3 font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {med.name}
                  </td>
                  <td className="py-3 pr-3 font-semibold text-gray-700">
                    {med.dosage}
                  </td>
                  <td className="py-3 pr-3">
                    <div className="flex flex-wrap gap-1">
                      {med.timing.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold">
                          {t === 'morning' && '🌅 เช้า'}
                          {t === 'noon' && '☀️ กลางวัน'}
                          {t === 'evening' && '🌆 เย็น'}
                          {t === 'bedtime' && '🌙 ก่อนนอน'}
                          {t === 'before_meal' && 'ก่อนอาหาร'}
                          {t === 'after_meal' && 'หลังอาหาร'}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-gray-600 max-w-xs truncate">
                    {med.instructions}
                  </td>
                  <td className="py-3 text-right text-gray-400 font-medium">
                    {med.prescribedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
