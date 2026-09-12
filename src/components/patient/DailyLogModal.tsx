import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { X, HeartPulse, Utensils, Droplets, Moon, Activity, Sparkles, User, Calendar, Clock } from 'lucide-react';

interface DailyLogModalProps {
  patient?: Patient;
  onClose: () => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({ patient, onClose }) => {
  const { patients, addVitalSign, addDailyLog, currentRole } = useApp();
  
  // Selected Patient State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    patient?.id || patients[0]?.id || ''
  );

  const activePatient = patients.find(p => p.id === selectedPatientId) || patient || patients[0];

  const [tab, setTab] = useState<'vital' | 'routine'>('vital');

  // Date and Time state for record
  const now = new Date();
  const defaultDate = now.toISOString().slice(0, 10);
  const defaultTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false });
  
  const [recordDate, setRecordDate] = useState<string>(defaultDate);
  const [recordTime, setRecordTime] = useState<string>(defaultTime);

  // Vital Signs Form State
  const [sys, setSys] = useState(130);
  const [dia, setDia] = useState(82);
  const [pulse, setPulse] = useState(75);
  const [glucose, setGlucose] = useState<number | ''>(135);
  const [glucoseType, setGlucoseType] = useState<'fasting' | 'post_meal' | 'random'>('post_meal');
  const [temp, setTemp] = useState(36.6);
  const [spo2, setSpo2] = useState(98);
  const [vitalNotes, setVitalNotes] = useState('');

  // Daily Routine Form State
  const [breakfastType, setBreakfastType] = useState('ข้าวต้มปลาแซลมอนบด');
  const [breakfastPct, setBreakfastPct] = useState(90);
  const [waterMl, setWaterMl] = useState(1600);
  const [bowelTimes, setBowelTimes] = useState(1);
  const [bristolScale, setBristolScale] = useState(4);
  const [sleepHours, setSleepHours] = useState(8);
  const [sleepQuality, setSleepQuality] = useState<'good' | 'fair' | 'poor'>('good');
  const [routineNotes, setRoutineNotes] = useState('');

  const handleSaveVital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    // Format timestamp with clear Date and Time: YYYY-MM-DD HH:mm
    const formattedTimestamp = `${recordDate} ${recordTime}`;

    addVitalSign(activePatient.id, {
      timestamp: formattedTimestamp,
      sys: Number(sys),
      dia: Number(dia),
      pulse: Number(pulse),
      glucose: glucose !== '' ? Number(glucose) : undefined,
      glucoseType,
      temp: Number(temp),
      spo2: Number(spo2),
      recordedBy: currentRole === 'doctor' ? 'นพ. แพทย์เวร' : currentRole === 'caregiver' ? 'ผู้ดูแลประจำ' : 'เจ้าหน้าที่พยาบาล',
      recorderRole: currentRole.toUpperCase(),
      notes: vitalNotes
    });
    onClose();
  };

  const handleSaveRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    addDailyLog(activePatient.id, {
      date: recordDate,
      mealBreakfast: { type: breakfastType, amountPercent: breakfastPct },
      mealLunch: { type: 'อาหารมื้อกลางวันตามแผน', amountPercent: 85 },
      mealDinner: { type: 'อาหารมื้อเย็นตามแผน', amountPercent: 80 },
      waterIntakeMl: Number(waterMl),
      bowelMovement: { times: Number(bowelTimes), bristolScale: Number(bristolScale) },
      sleepHours: Number(sleepHours),
      sleepQuality,
      dailyActivities: ['กายภาพบำบัด', 'นั่งพักผ่อน'],
      abnormalSymptoms: routineNotes ? [routineNotes] : [],
      recordedBy: currentRole === 'caregiver' ? 'ผู้ดูแล' : 'พยาบาลผู้ดูแล',
      recordedAt: `${recordDate} ${recordTime}`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                บันทึกสัญญาณชีพด่วน & กิจวัตรประจำวัน
              </h2>
              <p className="text-xs text-gray-500">
                ระบุวัน-เวลา ผู้ป่วย และตรวจวัดค่าสุขภาพพร้อมประเมินแนวโน้ม
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

        {/* 👤 Patient / Client Selector Section */}
        <div className="p-4 bg-cream-100/70 border-b border-cream-200">
          <label className="block text-xs font-bold text-gray-900 mb-1.5 flex items-center gap-1.5">
            <User className="w-4 h-4 text-sage-800" />
            <span>ระบุผู้ป่วย / ลูกค้าที่ต้องการบันทึก (Select Client / Patient):</span>
          </label>
          <div className="flex items-center gap-3">
            {activePatient && (
              <img
                src={activePatient.avatar}
                alt={activePatient.name}
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white shadow-xs shrink-0"
              />
            )}
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-sage-500 shadow-xs"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.thaiName} ({p.hn}) — {p.careType === 'nursing_home' ? p.roomBed : 'Home Care'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 📅 Date & Time Picker Section */}
        <div className="p-4 bg-white border-b border-gray-100">
          <label className="block text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-sage-700" />
            <span>วันและเวลาในการตรวจวัด (Measurement Date & Time):</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">วันที่ตรวจวัด:</label>
              <input
                type="date"
                value={recordDate}
                onChange={e => setRecordDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-cream-50/50 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-gray-500 mb-1">เวลาตรวจวัด:</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="time"
                  value={recordTime}
                  onChange={e => setRecordTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-cream-50/50 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 p-2 bg-white gap-2">
          <button
            onClick={() => setTab('vital')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tab === 'vital' ? 'bg-sage-800 text-white shadow-xs' : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            บันทึกสัญญาณชีพ (Vital Signs)
          </button>
          <button
            onClick={() => setTab('routine')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tab === 'routine' ? 'bg-sage-800 text-white shadow-xs' : 'bg-cream-100 text-gray-600 hover:bg-cream-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            บันทึกกิจวัตร & อาหาร (Daily Routine)
          </button>
        </div>

        {/* Tab 1: Vital Signs Form */}
        {tab === 'vital' && (
          <form onSubmit={handleSaveVital} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ความดันตัวบน SYS (mmHg)
                </label>
                <input
                  type="number"
                  value={sys}
                  onChange={e => setSys(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ความดันตัวล่าง DIA (mmHg)
                </label>
                <input
                  type="number"
                  value={dia}
                  onChange={e => setDia(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ชีพจร Pulse (bpm)
                </label>
                <input
                  type="number"
                  value={pulse}
                  onChange={e => setPulse(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ระดับน้ำตาล DTX (mg/dL)
                </label>
                <input
                  type="number"
                  value={glucose}
                  onChange={e => setGlucose(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  อุณหภูมิร่างกาย Temp (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ออกซิเจนในเลือด SpO2 (%)
                </label>
                <input
                  type="number"
                  value={spo2}
                  onChange={e => setSpo2(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                หมายเหตุ / อาการผิดปกติเพิ่มเติม
              </label>
              <textarea
                value={vitalNotes}
                onChange={e => setVitalNotes(e.target.value)}
                placeholder="เช่น ผู้ป่วยรู้สึกสดชื่น ไม่มีอาการเวียนศีรษะ"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft"
              >
                บันทึกสัญญาณชีพ ({recordDate} {recordTime})
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Daily Routine Form */}
        {tab === 'routine' && (
          <form onSubmit={handleSaveRoutine} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ประเภทอาหารมื้อเช้า/หลัก
              </label>
              <input
                type="text"
                value={breakfastType}
                onChange={e => setBreakfastType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ปริมาณที่ทานได้ (% ของมื้อ)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={breakfastPct}
                  onChange={e => setBreakfastPct(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ปริมาณดื่มน้ำรวม (มล.)
                </label>
                <input
                  type="number"
                  value={waterMl}
                  onChange={e => setWaterMl(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  การขับถ่ายอุจจาระ (ครั้ง / วัน)
                </label>
                <input
                  type="number"
                  value={bowelTimes}
                  onChange={e => setBowelTimes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  การนอนหลับ (ชั่วโมง)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={e => setSleepHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-sage-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                คุณภาพการนอนหลับ
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'good', label: 'หลับลึก สดชื่น' },
                  { id: 'fair', label: 'ตื่นบ้างบางครั้ง' },
                  { id: 'poor', label: 'กระสับกระส่าย' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSleepQuality(item.id as any)}
                    className={`py-2 rounded-xl text-xs font-medium border transition-colors ${
                      sleepQuality === item.id 
                        ? 'bg-sage-800 text-white border-sage-800' 
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                บันทึกเพิ่มเติม / อาการผิดปกติ
              </label>
              <textarea
                value={routineNotes}
                onChange={e => setRoutineNotes(e.target.value)}
                placeholder="เช่น ขับถ่ายปกติ ทำกายภาพช่วงบ่าย 20 นาที"
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-sage-800 hover:bg-sage-900 text-white shadow-soft"
              >
                บันทึกกิจวัตร ({recordDate} {recordTime})
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
