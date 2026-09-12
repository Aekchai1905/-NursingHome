import React, { useState } from 'react';
import { VitalSign } from '../../types';
import { StatusBadge } from '../common/Badge';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  HeartPulse, 
  Droplets, 
  Thermometer, 
  Wind, 
  Activity,
  GitCompare,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface HealthTrendCompareProps {
  vitals: VitalSign[];
}

export const HealthTrendCompare: React.FC<HealthTrendCompareProps> = ({ vitals }) => {
  if (!vitals || vitals.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-gray-100 text-center text-gray-400">
        ยังไม่มีประวัติการบันทึกสัญญาณชีพ
      </div>
    );
  }

  const latest = vitals[0];
  // Default baseline is the immediately preceding record (index 1) if available, else index 0
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>(
    vitals.length > 1 ? vitals[1].id : vitals[0].id
  );

  const baseline = vitals.find(v => v.id === selectedBaselineId) || (vitals.length > 1 ? vitals[1] : vitals[0]);
  const isComparingSame = latest.id === baseline.id;

  const getDelta = (curr?: number, base?: number) => {
    if (curr === undefined || curr === null || base === undefined || base === null) return null;
    const diff = Number((curr - base).toFixed(1));
    const percent = base !== 0 ? Number(((diff / base) * 100).toFixed(1)) : 0;
    return { diff, percent };
  };

  // Deltas for all key numeric vital signs
  const bpSysDelta = getDelta(latest.sys, baseline.sys);
  const bpDiaDelta = getDelta(latest.dia, baseline.dia);
  const pulseDelta = getDelta(latest.pulse, baseline.pulse);
  const glucoseDelta = (latest.glucose && baseline.glucose) ? getDelta(latest.glucose, baseline.glucose) : null;
  const tempDelta = getDelta(latest.temp, baseline.temp);
  const spo2Delta = getDelta(latest.spo2, baseline.spo2);
  const respDelta = (latest.respirationRate && baseline.respirationRate) 
    ? getDelta(latest.respirationRate, baseline.respirationRate) 
    : null;

  // Generate automated clinical Thai analysis summary
  const getSummaryNarrative = () => {
    if (isComparingSame) {
      return 'กรุณาเลือกบันทึกรอบก่อนหน้าจากเมนูด้านบน เพื่อทำการเปรียบเทียบค่าความเปลี่ยนแปลง';
    }

    const points: string[] = [];

    if (bpSysDelta) {
      if (bpSysDelta.diff > 0) {
        points.push(`ความดันตัวบน (SYS) เพิ่มขึ้น +${bpSysDelta.diff} mmHg`);
      } else if (bpSysDelta.diff < 0) {
        points.push(`ความดันตัวบน (SYS) ลดลง ${Math.abs(bpSysDelta.diff)} mmHg (แนวโน้มดีขึ้น)`);
      } else {
        points.push(`ความดันโลหิตคงที่ (${latest.sys}/${latest.dia} mmHg)`);
      }
    }

    if (glucoseDelta) {
      if (glucoseDelta.diff > 0) {
        points.push(`ระดับน้ำตาล DTX สูงขึ้น +${glucoseDelta.diff} mg/dL (+${glucoseDelta.percent}%)`);
      } else if (glucoseDelta.diff < 0) {
        points.push(`ระดับน้ำตาล DTX ลดลง ${Math.abs(glucoseDelta.diff)} mg/dL (${glucoseDelta.percent}%)`);
      }
    }

    if (tempDelta) {
      if (tempDelta.diff > 0.5) {
        points.push(`อุณหภูมิร่างกายเพิ่มขึ้น +${tempDelta.diff}°C (เฝ้าระวังไข้)`);
      } else if (tempDelta.diff < -0.3 && baseline.temp > 37.2) {
        points.push(`ไข้ลดลง ${Math.abs(tempDelta.diff)}°C (ตอบสนองต่อการดูแลดี)`);
      }
    }

    if (spo2Delta) {
      if (spo2Delta.diff < 0) {
        points.push(`ระดับ SpO2 ลดลง ${Math.abs(spo2Delta.diff)}%`);
      } else if (spo2Delta.diff > 0) {
        points.push(`ระดับ SpO2 ดีขึ้น +${spo2Delta.diff}%`);
      }
    }

    if (points.length === 0) {
      return 'ค่าสัญญาณชีพทุกรายการคงที่ ไม่พบความเปลี่ยนแปลงที่มีนัยสำคัญ';
    }

    return `เปรียบเทียบกับรอบ [${baseline.timestamp}]: ` + points.join(', ');
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-5">
      {/* Header & Baseline Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sage-100 text-sage-800">
              <GitCompare className="w-4 h-4" />
            </span>
            <h3 className="text-base font-extrabold text-gray-900">
              ระบบเปรียบเทียบตัวเลข & แนวโน้มสัญญาณชีพ (Interactive Vital Comparison)
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            แสดง <strong className="text-sage-900 font-bold">ข้อมูลรอบล่าสุด</strong> เปรียบเทียบกับ <strong className="text-amber-800 font-bold">รอบที่เลือก</strong> แสดงผลต่าง (+/- Delta) และทิศทางแนวโน้ม
          </p>
        </div>

        {/* Dropdown Selector for Baseline Record */}
        <div className="flex flex-wrap items-center gap-2 bg-cream-50 p-2 rounded-2xl border border-cream-200">
          <label className="text-xs font-bold text-gray-700 whitespace-nowrap flex items-center gap-1.5 pl-1">
            <Clock className="w-3.5 h-3.5 text-sage-700" />
            <span>เปรียบเทียบกับบันทึกรอบ:</span>
          </label>
          <select
            value={selectedBaselineId}
            onChange={(e) => setSelectedBaselineId(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-sage-600 shadow-xs cursor-pointer"
          >
            {vitals.map((v, index) => (
              <option key={v.id} value={v.id}>
                {index === 0 ? '⭐ [รอบล่าสุด] ' : `[รอบที่ ${index + 1}] `}
                {v.timestamp} — BP: {v.sys}/{v.dia}, DTX: {v.glucose || '-'}, SpO2: {v.spo2}% ({v.recordedBy})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Compare Indicator Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-cream-100/70 border border-cream-300/80 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-sage-600 shrink-0" />
          <div>
            <span className="text-gray-500 block text-[11px]">ข้อมูลรอบปัจจุบัน (ล่าสุด):</span>
            <span className="font-extrabold text-gray-900 text-xs sm:text-sm">
              🕒 {latest.timestamp}
            </span>
            <span className="ml-2 text-gray-500">โดย {latest.recordedBy}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:border-l md:border-cream-300 md:pl-4">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
          <div>
            <span className="text-gray-500 block text-[11px]">ข้อมูลรอบเปรียบเทียบ (ฐาน):</span>
            <span className="font-extrabold text-amber-900 text-xs sm:text-sm">
              🕒 {baseline.timestamp}
            </span>
            <span className="ml-2 text-gray-500">โดย {baseline.recordedBy}</span>
          </div>
        </div>
      </div>

      {/* Comparison Numeric Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Blood Pressure Card */}
        <div className="p-4 rounded-2xl bg-cream-50/80 border border-cream-200 shadow-xs transition-all hover:border-sage-300">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-gray-800">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              ความดันโลหิต (BP)
            </span>
            <span className="text-[10px] font-mono text-gray-400">mmHg</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {latest.sys}/{latest.dia}
              </span>
            </div>

            {/* Delta Badges */}
            {!isComparingSame && bpSysDelta && bpDiaDelta && (
              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                  bpSysDelta.diff > 0 
                    ? 'bg-rose-100 text-rose-800' 
                    : bpSysDelta.diff < 0 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {bpSysDelta.diff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : bpSysDelta.diff < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  {bpSysDelta.diff > 0 ? `+${bpSysDelta.diff}` : `${bpSysDelta.diff}`} SYS
                </span>
                <span className={`text-[10px] font-semibold ${
                  bpDiaDelta.diff > 0 ? 'text-rose-700' : bpDiaDelta.diff < 0 ? 'text-emerald-700' : 'text-gray-500'
                }`}>
                  {bpDiaDelta.diff > 0 ? `+${bpDiaDelta.diff}` : `${bpDiaDelta.diff}`} DIA
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-cream-200/80 flex items-center justify-between text-[11px] text-gray-600">
            <span>รอบที่เลือก: <strong className="text-gray-900">{baseline.sys}/{baseline.dia}</strong></span>
            <span className={`font-semibold ${latest.sys > 140 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {latest.sys > 140 ? '⚠️ เฝ้าระวัง' : '✓ ปกติ'}
            </span>
          </div>
        </div>

        {/* 2. Blood Glucose Card */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 shadow-xs transition-all hover:border-amber-300">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-amber-900">
              <Droplets className="w-4 h-4 text-amber-600" />
              ระดับน้ำตาล (DTX)
            </span>
            <span className="text-[10px] font-mono text-gray-400">mg/dL</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {latest.glucose ?? '140'}
            </span>

            {/* Glucose Delta */}
            {!isComparingSame && glucoseDelta && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                glucoseDelta.diff > 0 
                  ? 'bg-rose-100 text-rose-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {glucoseDelta.diff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {glucoseDelta.diff > 0 ? `+${glucoseDelta.diff}` : `${glucoseDelta.diff}`} ({glucoseDelta.percent > 0 ? `+${glucoseDelta.percent}%` : `${glucoseDelta.percent}%`})
              </span>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-amber-200/70 flex items-center justify-between text-[11px] text-gray-600">
            <span>รอบที่เลือก: <strong className="text-gray-900">{baseline.glucose ?? 'N/A'} mg/dL</strong></span>
            <span className="text-amber-800 font-medium">
              {latest.glucoseType === 'fasting' ? 'งดอาหาร' : 'หลังอาหาร'}
            </span>
          </div>
        </div>

        {/* 3. Body Temperature Card */}
        <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 shadow-xs transition-all hover:border-blue-300">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-blue-900">
              <Thermometer className="w-4 h-4 text-blue-600" />
              อุณหภูมิ (Temp)
            </span>
            <span className="text-[10px] font-mono text-gray-400">°C</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {latest.temp.toFixed(1)}°C
            </span>

            {/* Temp Delta */}
            {!isComparingSame && tempDelta && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                tempDelta.diff > 0.3 
                  ? 'bg-rose-100 text-rose-800' 
                  : tempDelta.diff < 0 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tempDelta.diff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : tempDelta.diff < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {tempDelta.diff > 0 ? `+${tempDelta.diff}` : `${tempDelta.diff}`}°C
              </span>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-blue-200/70 flex items-center justify-between text-[11px] text-gray-600">
            <span>รอบที่เลือก: <strong className="text-gray-900">{baseline.temp.toFixed(1)}°C</strong></span>
            <span className={`font-semibold ${latest.temp >= 37.5 ? 'text-rose-700' : 'text-blue-700'}`}>
              {latest.temp >= 37.5 ? '🔥 มีไข้' : '✓ อุณหภูมิปกติ'}
            </span>
          </div>
        </div>

        {/* 4. Oxygen SpO2 Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 shadow-xs transition-all hover:border-emerald-300">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-emerald-900">
              <Wind className="w-4 h-4 text-emerald-600" />
              ออกซิเจน (SpO2)
            </span>
            <span className="text-[10px] font-mono text-gray-400">%</span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">
              {latest.spo2}%
            </span>

            {/* SpO2 Delta */}
            {!isComparingSame && spo2Delta && (
              <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-lg ${
                spo2Delta.diff >= 0 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {spo2Delta.diff > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : spo2Delta.diff < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {spo2Delta.diff > 0 ? `+${spo2Delta.diff}%` : `${spo2Delta.diff}%`}
              </span>
            )}
          </div>

          <div className="mt-3 pt-2.5 border-t border-emerald-200/70 flex items-center justify-between text-[11px] text-gray-600">
            <span>รอบที่เลือก: <strong className="text-gray-900">{baseline.spo2}%</strong></span>
            <span className="text-emerald-800 font-medium">
              ชีพจร: {latest.pulse} bpm {pulseDelta && !isComparingSame && `(${pulseDelta.diff >= 0 ? '+' : ''}${pulseDelta.diff})`}
            </span>
          </div>
        </div>

      </div>

      {/* Respiration Rate and Additional Delta Detail if available */}
      {latest.respirationRate && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 flex items-center gap-1.5 font-medium">
              <Activity className="w-4 h-4 text-sage-700" />
              อัตราการหายใจ (Respiration Rate):
            </span>
            <span className="font-bold text-gray-900">
              {latest.respirationRate} ครั้ง/นาที 
              {respDelta && !isComparingSame && (
                <span className={`ml-2 text-xs font-semibold ${respDelta.diff > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  ({respDelta.diff > 0 ? `+${respDelta.diff}` : `${respDelta.diff}`})
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center justify-between sm:border-l sm:border-gray-200 sm:pl-4">
            <span className="text-gray-600 font-medium">อัตราการเต้นของหัวใจ (Pulse):</span>
            <span className="font-bold text-gray-900">
              {latest.pulse} ครั้ง/นาที 
              {pulseDelta && !isComparingSame && (
                <span className={`ml-2 text-xs font-semibold ${pulseDelta.diff > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  ({pulseDelta.diff > 0 ? `+${pulseDelta.diff}` : `${pulseDelta.diff}`})
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Clinical Interpretation & Natural Summary Box */}
      <div className="p-4 rounded-2xl bg-sage-50 border border-sage-200 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage-800 shrink-0" />
          <h4 className="font-bold text-sage-950">สรุปการวิเคราะห์เปรียบเทียบเชิงคลินิก (Clinical Comparison Analysis)</h4>
        </div>
        <p className="text-sage-900 leading-relaxed font-medium">
          {getSummaryNarrative()}
        </p>
        {latest.notes && (
          <div className="pt-2 border-t border-sage-200/80 text-[11px] text-gray-600 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-sage-700 shrink-0 mt-0.5" />
            <span>หมายเหตุผู้บันทึกรอบล่าสุด: "{latest.notes}" (บันทึกโดย {latest.recordedBy} - {latest.recorderRole})</span>
          </div>
        )}
      </div>

    </div>
  );
};

