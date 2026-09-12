import React, { useState } from 'react';
import { VitalSign } from '../../types';
import { Activity, Calendar, Clock, User, HeartPulse } from 'lucide-react';

interface VitalChartProps {
  vitals: VitalSign[];
}

export const VitalChart: React.FC<VitalChartProps> = ({ vitals }) => {
  const [metric, setMetric] = useState<'bp' | 'glucose' | 'temp' | 'spo2'>('bp');
  const [timeRange, setTimeRange] = useState<'all' | 'recent'>('all');
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Sort chronological for charting
  const sortedVitals = [...vitals].reverse();
  const displayData = timeRange === 'recent' ? sortedVitals.slice(-5) : sortedVitals;

  // Compute stats
  const computeStats = () => {
    if (metric === 'bp') {
      const sysVals = displayData.map(d => d.sys);
      const diaVals = displayData.map(d => d.dia);
      const avgSys = Math.round(sysVals.reduce((a, b) => a + b, 0) / sysVals.length || 0);
      const avgDia = Math.round(diaVals.reduce((a, b) => a + b, 0) / diaVals.length || 0);
      const maxSys = Math.max(...sysVals, 0);
      const minSys = Math.min(...sysVals, 0);
      return { avg: `${avgSys}/${avgDia}`, max: `${maxSys}`, min: `${minSys}`, unit: 'mmHg' };
    } else if (metric === 'glucose') {
      const vals = displayData.map(d => d.glucose || 0).filter(v => v > 0);
      if (vals.length === 0) return { avg: 'N/A', max: 'N/A', min: 'N/A', unit: 'mg/dL' };
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
      return { avg: `${avg}`, max: `${Math.max(...vals)}`, min: `${Math.min(...vals)}`, unit: 'mg/dL' };
    } else if (metric === 'temp') {
      const vals = displayData.map(d => d.temp);
      const avg = (vals.reduce((a, b) => a + b, 0) / vals.length || 0).toFixed(1);
      return { avg: `${avg}`, max: `${Math.max(...vals).toFixed(1)}`, min: `${Math.min(...vals).toFixed(1)}`, unit: '°C' };
    } else {
      const vals = displayData.map(d => d.spo2);
      const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length || 0);
      return { avg: `${avg}`, max: `${Math.max(...vals)}`, min: `${Math.min(...vals)}`, unit: '%' };
    }
  };

  const stats = computeStats();

  // Helper to parse date and time cleanly
  const formatDateTime = (timestampStr: string) => {
    const parts = timestampStr.split(' ');
    let dateStr = parts[0] || 'วันนี้';
    let timeStr = parts[1] || '08:00';

    // Format date string to short Thai (e.g. 2026-09-07 -> 07 ก.ย.)
    if (dateStr.includes('-')) {
      const dParts = dateStr.split('-');
      if (dParts.length === 3) {
        const monthNames = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const mIdx = parseInt(dParts[1], 10);
        dateStr = `${dParts[2]} ${monthNames[mIdx] || dParts[1]}`;
      }
    }

    return { date: dateStr, time: timeStr };
  };

  // SVG Chart helpers
  const width = 640;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 35;
  const paddingBottom = 45;

  const getPoints = () => {
    if (displayData.length === 0) return [];
    
    let minVal = 0;
    let maxVal = 100;

    if (metric === 'bp') {
      minVal = 60;
      maxVal = 180;
    } else if (metric === 'glucose') {
      minVal = 80;
      maxVal = 220;
    } else if (metric === 'temp') {
      minVal = 35.5;
      maxVal = 38.5;
    } else if (metric === 'spo2') {
      minVal = 90;
      maxVal = 100;
    }

    const usableHeight = height - paddingTop - paddingBottom;
    const stepX = (width - paddingX * 2) / Math.max(displayData.length - 1, 1);

    return displayData.map((d, index) => {
      const x = paddingX + index * stepX;
      let y = 0;
      let y2 = 0; // For DIA in BP
      let valLabel = '';

      if (metric === 'bp') {
        y = height - paddingBottom - ((d.sys - minVal) / (maxVal - minVal)) * usableHeight;
        y2 = height - paddingBottom - ((d.dia - minVal) / (maxVal - minVal)) * usableHeight;
        valLabel = `${d.sys}/${d.dia}`;
      } else if (metric === 'glucose') {
        const val = d.glucose || 120;
        y = height - paddingBottom - ((val - minVal) / (maxVal - minVal)) * usableHeight;
        valLabel = `${val}`;
      } else if (metric === 'temp') {
        y = height - paddingBottom - ((d.temp - minVal) / (maxVal - minVal)) * usableHeight;
        valLabel = `${d.temp}°C`;
      } else {
        y = height - paddingBottom - ((d.spo2 - minVal) / (maxVal - minVal)) * usableHeight;
        valLabel = `${d.spo2}%`;
      }

      const dt = formatDateTime(d.timestamp);

      return {
        x,
        y,
        y2,
        dateFormatted: dt.date,
        timeFormatted: dt.time,
        fullTimestamp: d.timestamp,
        valLabel,
        raw: d
      };
    });
  };

  const points = getPoints();

  // Create SVG path string
  const createPathD = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    return pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  };

  const primaryPathD = createPathD(points.map(p => ({ x: p.x, y: p.y })));
  const secondaryPathD = metric === 'bp' ? createPathD(points.map(p => ({ x: p.x, y: p.y2 }))) : '';

  const activePoint = selectedPointIndex !== null ? points[selectedPointIndex] : points[points.length - 1];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sage-100 text-sage-800">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">กราฟแนวโน้มสุขภาพ (Health Trend Chart)</h3>
            <p className="text-xs text-gray-400">แสดงผลเปรียบเทียบพร้อมระบุวันและเวลาที่ตรวจวัดชัดเจน</p>
          </div>
        </div>

        {/* Metric Switcher Pills */}
        <div className="flex items-center gap-1 bg-cream-100 p-1 rounded-xl border border-cream-200">
          <button
            onClick={() => setMetric('bp')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'bp' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ความดัน (BP)
          </button>
          <button
            onClick={() => setMetric('glucose')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'glucose' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            น้ำตาล (DTX)
          </button>
          <button
            onClick={() => setMetric('temp')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'temp' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            อุณหภูมิ (°C)
          </button>
          <button
            onClick={() => setMetric('spo2')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              metric === 'spo2' ? 'bg-sage-800 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ออกซิเจน (SpO2)
          </button>
        </div>
      </div>

      {/* Summary Stat Mini-Cards */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="p-3 rounded-xl bg-cream-50 border border-cream-200 text-center">
          <p className="text-[11px] font-medium text-gray-500">ค่าเฉลี่ย (Average)</p>
          <p className="text-base font-extrabold text-sage-900 mt-0.5">{stats.avg} <span className="text-xs font-normal text-gray-500">{stats.unit}</span></p>
        </div>
        <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-center">
          <p className="text-[11px] font-medium text-rose-600">ค่าสูงสุด (Max)</p>
          <p className="text-base font-extrabold text-rose-700 mt-0.5">{stats.max} <span className="text-xs font-normal text-rose-500">{stats.unit}</span></p>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-center">
          <p className="text-[11px] font-medium text-emerald-600">ค่าต่ำสุด (Min)</p>
          <p className="text-base font-extrabold text-emerald-700 mt-0.5">{stats.min} <span className="text-xs font-normal text-emerald-500">{stats.unit}</span></p>
        </div>
      </div>

      {/* SVG Interactive Visual Chart with Date & Time Labels */}
      <div className="relative w-full overflow-x-auto bg-gradient-to-b from-cream-50/40 to-white rounded-xl border border-gray-100 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none">
          <defs>
            <linearGradient id="sageGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#43705C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#43705C" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingTop} x2={width - paddingX} y2={paddingTop} stroke="#E5EDE8" strokeDasharray="3 3" />
          <line x1={paddingX} y1={(paddingTop + height - paddingBottom) / 2} x2={width - paddingX} y2={(paddingTop + height - paddingBottom) / 2} stroke="#E5EDE8" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingBottom} x2={width - paddingX} y2={height - paddingBottom} stroke="#E5EDE8" strokeWidth="1.5" />

          {/* Paths */}
          {primaryPathD && (
            <path
              d={primaryPathD}
              fill="none"
              stroke="#243E33"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {metric === 'bp' && secondaryPathD && (
            <path
              d={secondaryPathD}
              fill="none"
              stroke="#D97706"
              strokeWidth="2.2"
              strokeDasharray="4 4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points & Data Callouts */}
          {points.map((pt, idx) => {
            const isHovered = selectedPointIndex === idx;
            return (
              <g 
                key={idx} 
                className="cursor-pointer transition-all"
                onClick={() => setSelectedPointIndex(idx)}
              >
                {/* Vertical helper guide line on click */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingTop}
                    x2={pt.x}
                    y2={height - paddingBottom}
                    stroke="#243E33"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                )}

                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "6" : "4.5"}
                  fill="#243E33"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {metric === 'bp' && (
                  <circle
                    cx={pt.x}
                    cy={pt.y2}
                    r={isHovered ? "5" : "3.5"}
                    fill="#D97706"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                )}

                {/* Value Label above point */}
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#243E33"
                >
                  {pt.valLabel}
                </text>

                {/* 📅 Date Label (Line 1 below axis) */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 16}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#243E33"
                >
                  {pt.dateFormatted}
                </text>

                {/* ⏰ Time Label (Line 2 below axis) */}
                <text
                  x={pt.x}
                  y={height - paddingBottom + 28}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight="500"
                  fill="#6B7280"
                >
                  {pt.timeFormatted} น.
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Point Detail Callout (shows full Date, Time, Value, and Notes) */}
      {activePoint && (
        <div className="mt-3 p-3.5 rounded-xl bg-cream-100/80 border border-cream-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sage-800 text-white shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900">
                  📅 {activePoint.fullTimestamp} น.
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white text-sage-900 border border-sage-200">
                  {metric === 'bp' ? `BP ${activePoint.raw.sys}/${activePoint.raw.dia} mmHg` : 
                   metric === 'glucose' ? `DTX ${activePoint.raw.glucose || '-'} mg/dL` :
                   metric === 'temp' ? `Temp ${activePoint.raw.temp}°C` : `SpO2 ${activePoint.raw.spo2}%`}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                ผู้บันทึก: {activePoint.raw.recordedBy} ({activePoint.raw.recorderRole}) {activePoint.raw.notes && `• "${activePoint.raw.notes}"`}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-gray-400 self-end sm:self-center">
            คลิกที่จุดบนกราฟเพื่อดูรายละเอียดแต่ละรอบ
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-sage-800 rounded-full" />
            <span>{metric === 'bp' ? 'Systolic (SYS บน)' : 'ค่าตรวจวัด'}</span>
          </div>
          {metric === 'bp' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded-full" />
              <span>Diastolic (DIA ล่าง)</span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-gray-400">อัปเดตล่าสุด: {vitals[0]?.timestamp || 'ไม่มีข้อมูล'}</span>
      </div>
    </div>
  );
};
