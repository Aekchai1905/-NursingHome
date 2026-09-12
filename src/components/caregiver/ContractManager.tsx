import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CaregiverContract } from '../../types';
import { FileText, DollarSign, Calendar, Clock, User, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

export const ContractManager: React.FC = () => {
  const { contracts } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredContracts = contracts.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            การจัดการสัญญาจ้าง & อัตราค่าจ้าง (Wage & Contract Management)
          </h3>
          <p className="text-xs text-gray-500">
            จัดเก็บข้อตกลง อัตราค่าบริการรายชั่วโมง/รายวัน/รายเดือน และเงื่อนไขการทำงาน
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-100 text-gray-700">
          รวม {contracts.length} สัญญา
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredContracts.map(ctr => (
          <div
            key={ctr.id}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-sage-50 text-sage-900 border border-sage-200">
                  {ctr.contractNumber}
                </span>
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  ● {ctr.status}
                </span>
              </div>

              {/* Patient & Caregiver */}
              <div className="mt-4 space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-cream-50/80 border border-cream-200">
                  <span className="text-gray-400 text-[10px] block">ผู้ป่วยในความดูแล:</span>
                  <strong className="text-sm font-bold text-gray-900">{ctr.patientName}</strong>
                </div>
                <div className="p-3 rounded-xl bg-cream-50/80 border border-cream-200">
                  <span className="text-gray-400 text-[10px] block">ผู้ดูแลที่ว่าจ้าง:</span>
                  <strong className="text-sm font-bold text-sage-900">{ctr.caregiverName}</strong>
                </div>
              </div>

              {/* Wage and Working Type */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <span className="text-gray-400 text-[10px] block">อัตราค่าจ้าง:</span>
                  <strong className="text-emerald-700 font-extrabold text-sm">
                    {ctr.wageRate.toLocaleString()} ฿
                  </strong>
                  <span className="text-gray-400 text-[10px] block">/{ctr.wageType}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-xs">
                  <span className="text-gray-400 text-[10px] block">ประเภทการทำงาน:</span>
                  <strong className="text-gray-800 text-xs block truncate">
                    {ctr.workingType === 'live_in' ? 'พักค้างคืน 24 ชม.' : 'ไป-กลับ'}
                  </strong>
                </div>
              </div>

              {/* Working Hours & Terms */}
              <div className="mt-3 p-3 rounded-xl bg-gray-50 text-xs text-gray-600 space-y-1">
                <p><strong>เวลาทำงาน:</strong> {ctr.workingHours}</p>
                <p><strong>สัญญา:</strong> {ctr.startDate} ถึง {ctr.endDate}</p>
                <p className="text-[11px] text-gray-500 pt-1 border-t border-gray-200/60">
                  <strong>เงื่อนไข:</strong> {ctr.specialTerms}
                </p>
              </div>
            </div>

            {/* Contract PDF download simulation */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 text-[11px]">เอกสารสัญญาฉบับจริง</span>
              <button 
                onClick={() => alert(`ดาวน์โหลดเอกสารสัญญา ${ctr.contractNumber} เรียบร้อย`)}
                className="text-sage-800 font-bold hover:text-sage-950 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
