import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient } from '../../types';
import { StatusBadge, PrecautionBadge } from '../common/Badge';
import { VitalChart } from './VitalChart';
import { HealthTrendCompare } from './HealthTrendCompare';
import { CarePlanCard } from './CarePlanCard';
import { DailyLogModal } from './DailyLogModal';
import { EditPatientModal } from './EditPatientModal';
import { DoctorVisitModal } from './DoctorVisitModal';
import { PatientHistoryModal } from './PatientHistoryModal';
import { 
  ArrowLeft, 
  PlusCircle, 
  Calendar, 
  HeartHandshake, 
  User, 
  Phone, 
  Building, 
  Stethoscope, 
  AlertTriangle, 
  Utensils, 
  Droplets, 
  Moon, 
  Activity, 
  FileText, 
  Printer,
  FileCheck2,
  Image as ImageIcon,
  Edit3,
  History
} from 'lucide-react';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onBackText?: string;
}

export const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onBackText }) => {
  const { currentRole, appointments } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'careplan' | 'dailylog' | 'appointments'>('vitals');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDoctorVisitModal, setShowDoctorVisitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyModalTab, setHistoryModalTab] = useState<'medications' | 'allergies' | 'caregivers' | 'audit_logs'>('medications');

  // Filter patient's appointments
  const patientAppointments = appointments.filter(a => a.patientId === patient.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar: Back button & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-sage-800 hover:text-sage-950 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{onBackText || '← ย้อนกลับหน้ารวมรายชื่อ'}</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setHistoryModalTab('medications');
              setShowHistoryModal(true);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="ดูและบันทึกประวัติยา, ประวัติการแพ้, ประวัติผู้ดูแล, และ Audit Log"
          >
            <History className="w-3.5 h-3.5 text-purple-200" />
            <span>📜 ดูประวัติการบันทึกทั้งหมด</span>
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cream-200 hover:bg-cream-300 text-sage-950 text-xs font-bold border border-cream-300 shadow-xs transition-all cursor-pointer"
            title="แก้ไขข้อมูลผู้ป่วยทั้งหมด"
          >
            <Edit3 className="w-3.5 h-3.5 text-sage-700" />
            <span>✏️ แก้ไขข้อมูลผู้ป่วย</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
            title="พิมพ์สรุปเวชระเบียนผู้ป่วย"
          >
            <Printer className="w-3.5 h-3.5 text-gray-500" />
            <span>พิมพ์รายงาน</span>
          </button>
          <button
            onClick={() => setShowDoctorVisitModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-soft transition-all cursor-pointer"
          >
            <Stethoscope className="w-4 h-4 text-emerald-200" />
            <span>+ บันทึกการพบแพทย์</span>
          </button>
          <button
            onClick={() => setShowLogModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ บันทึกสัญญาณชีพ / กิจวัตร</span>
          </button>
        </div>
      </div>

      {/* Patient Profile Card (Level 2 Header) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-cream-200 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {patient.thaiName}
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gray-100 text-gray-600">
                  {patient.hn}
                </span>
                <StatusBadge status={patient.healthStatus} size="sm" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {patient.name} • อายุ {patient.age} ปี • เพศ {patient.gender === 'female' ? 'หญิง' : 'ชาย'} • วันเกิด {patient.birthDate}
              </p>

              {/* Badges / Care Type */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-sage-100 text-sage-800">
                  🏠 {patient.careType === 'nursing_home' ? 'ศูนย์ดูแล Nursing Home' : 'บริการดูแลที่บ้าน Home Care'}
                </span>
                {patient.roomBed && (
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                    📍 {patient.roomBed}
                  </span>
                )}
                <button
                  onClick={() => {
                    setHistoryModalTab('caregivers');
                    setShowHistoryModal(true);
                  }}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="คลิกเพื่อดูและบันทึกประวัติการมอบหมายผู้ดูแล"
                >
                  <span>👤 ผู้ดูแลหลัก: {patient.primaryCaregiverName || 'ยังไม่ระบุ'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-200/80 text-amber-950 font-bold">📜 ดูประวัติ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Doctor & Hospital Info Box */}
          <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 text-xs space-y-1.5 md:min-w-[280px]">
            <div className="flex items-center gap-2 text-gray-700">
              <Stethoscope className="w-4 h-4 text-sage-700 shrink-0" />
              <span className="font-semibold">{patient.primaryDoctorName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{patient.primaryHospital}</span>
            </div>
            <div className="flex items-center gap-2 text-rose-700 pt-1 border-t border-cream-200/80">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span>ฉุกเฉิน: {patient.emergencyContact.name} ({patient.emergencyContact.phone})</span>
            </div>
          </div>
        </div>

        {/* Chronic Diseases & Allergy Banner (Shows Latest Active Only, with links to History) */}
        <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-gray-50">
            <span className="font-bold text-gray-700 block mb-1">โรคประจำตัว:</span>
            <div className="flex flex-wrap gap-1">
              {patient.chronicDiseases.map((d, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 text-[11px]">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-rose-800">ประวัติแพ้ยา (Active ล่าสุด):</span>
              <button
                onClick={() => {
                  setHistoryModalTab('allergies');
                  setShowHistoryModal(true);
                }}
                className="text-[10px] font-bold text-rose-700 hover:text-rose-900 underline cursor-pointer"
              >
                📜 ดูประวัติทั้งหมด
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.drugAllergies.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-700 font-semibold text-[11px]">
                  💊 {a}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-800">ประวัติแพ้อาหาร (Active ล่าสุด):</span>
              <button
                onClick={() => {
                  setHistoryModalTab('allergies');
                  setShowHistoryModal(true);
                }}
                className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                📜 ดูประวัติทั้งหมด
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.foodAllergies.map((a, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-800 font-semibold text-[11px]">
                  🦐 {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('vitals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'vitals'
              ? 'bg-sage-800 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-cream-100 hover:text-gray-900 border border-gray-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>สัญญาณชีพ & กราฟแนวโน้ม (Vitals & Trends)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('careplan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'careplan'
              ? 'bg-sage-800 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-cream-100 hover:text-gray-900 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>แผนการดูแล & ข้อควรระวัง (Care Plan & Precautions)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dailylog')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'dailylog'
              ? 'bg-sage-800 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-cream-100 hover:text-gray-900 border border-gray-200'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>บันทึกกิจวัตรประจำวัน (Daily Activities)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('appointments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSubTab === 'appointments'
              ? 'bg-sage-800 text-white shadow-soft'
              : 'bg-white text-gray-600 hover:bg-cream-100 hover:text-gray-900 border border-gray-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>ประวัตินัดพบแพทย์ ({patientAppointments.length})</span>
        </button>
      </div>

      {/* Sub-tab 1: Vitals & Health Trends */}
      {activeSubTab === 'vitals' && (
        <div className="space-y-6">
          <HealthTrendCompare vitals={patient.vitalsHistory} />
          <VitalChart vitals={patient.vitalsHistory} />

          {/* Vitals History Table */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900">
                ประวัติการตรวจวัดสัญญาณชีพย้อนหลัง (Vital Signs History)
              </h3>
              <span className="text-xs text-gray-400">
                ทั้งหมด {patient.vitalsHistory.length} รายการ
              </span>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-2.5 font-semibold">วัน-เวลา</th>
                    <th className="pb-2.5 font-semibold">ความดัน (BP)</th>
                    <th className="pb-2.5 font-semibold">ชีพจร (Pulse)</th>
                    <th className="pb-2.5 font-semibold">น้ำตาล (DTX)</th>
                    <th className="pb-2.5 font-semibold">อุณหภูมิ</th>
                    <th className="pb-2.5 font-semibold">SpO2</th>
                    <th className="pb-2.5 font-semibold">สถานะ</th>
                    <th className="pb-2.5 font-semibold">ผู้บันทึก</th>
                    <th className="pb-2.5 font-semibold">หมายเหตุ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patient.vitalsHistory.map(v => (
                    <tr key={v.id} className="hover:bg-cream-50/50 transition-colors">
                      <td className="py-3 pr-3 font-semibold text-gray-900 whitespace-nowrap">
                        {v.timestamp}
                      </td>
                      <td className="py-3 pr-3 font-bold text-gray-800">
                        {v.sys}/{v.dia} <span className="text-[10px] text-gray-400 font-normal">mmHg</span>
                      </td>
                      <td className="py-3 pr-3 font-medium text-gray-700">
                        {v.pulse} <span className="text-[10px] text-gray-400">bpm</span>
                      </td>
                      <td className="py-3 pr-3 font-medium text-gray-700">
                        {v.glucose ? `${v.glucose} mg/dL` : '-'}
                      </td>
                      <td className="py-3 pr-3 font-medium text-gray-700">
                        {v.temp.toFixed(1)} °C
                      </td>
                      <td className="py-3 pr-3 font-medium text-gray-700">
                        {v.spo2}%
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={v.status} size="sm" />
                      </td>
                      <td className="py-3 pr-3 text-gray-600 whitespace-nowrap">
                        {v.recordedBy} <span className="text-[10px] text-gray-400">({v.recorderRole})</span>
                      </td>
                      <td className="py-3 text-gray-500 max-w-xs truncate">
                        {v.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Care Plan & Precautions */}
      {activeSubTab === 'careplan' && (
        <CarePlanCard 
          carePlan={patient.carePlan} 
          onOpenMedHistory={() => {
            setHistoryModalTab('medications');
            setShowHistoryModal(true);
          }}
        />
      )}

      {/* Sub-tab 3: Daily Activity Logs */}
      {activeSubTab === 'dailylog' && (
        <div className="space-y-4">
          {patient.dailyLogs.map(log => (
            <div key={log.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-sage-100 text-sage-800 font-bold text-xs">
                    📅 {log.date}
                  </span>
                  <span className="text-xs text-gray-500">
                    บันทึกโดย {log.recordedBy} เวลา {log.recordedAt}
                  </span>
                </div>
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>🌅 มื้อเช้า</span>
                    <span className="text-sage-800 font-extrabold">{log.mealBreakfast.amountPercent}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{log.mealBreakfast.type}</p>
                  {log.mealBreakfast.notes && <p className="text-[11px] text-gray-400 mt-0.5 italic">{log.mealBreakfast.notes}</p>}
                </div>
                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>☀️ มื้อกลางวัน</span>
                    <span className="text-sage-800 font-extrabold">{log.mealLunch.amountPercent}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{log.mealLunch.type}</p>
                  {log.mealLunch.notes && <p className="text-[11px] text-gray-400 mt-0.5 italic">{log.mealLunch.notes}</p>}
                </div>
                <div className="p-3.5 rounded-xl bg-cream-50 border border-cream-200">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>🌆 มื้อเย็น</span>
                    <span className="text-sage-800 font-extrabold">{log.mealDinner.amountPercent}%</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{log.mealDinner.type}</p>
                  {log.mealDinner.notes && <p className="text-[11px] text-gray-400 mt-0.5 italic">{log.mealDinner.notes}</p>}
                </div>
              </div>

              {/* Habits: Hydration, Bowel, Sleep */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2 text-gray-700">
                  <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>ดื่มน้ำรวม: <strong className="text-gray-900">{log.waterIntakeMl} มล.</strong></span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>การขับถ่าย: <strong className="text-gray-900">{log.bowelMovement.times} ครั้ง</strong> (Bristol Type {log.bowelMovement.bristolScale})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Moon className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>การนอนหลับ: <strong className="text-gray-900">{log.sleepHours} ชม.</strong> ({log.sleepQuality === 'good' ? 'หลับดี' : 'ปานกลาง'})</span>
                </div>
              </div>

              {/* Activities and Abnormal Notes */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-3 text-xs">
                <div className="flex-1">
                  <span className="font-bold text-gray-700">กิจกรรมที่ทำ: </span>
                  <span className="text-gray-600">{log.dailyActivities.join(', ')}</span>
                </div>
                {log.abnormalSymptoms.length > 0 && (
                  <div className="flex-1 text-rose-700">
                    <span className="font-bold">อาการผิดปกติ: </span>
                    <span>{log.abnormalSymptoms.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-tab 4: Doctor Appointments */}
      {activeSubTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">
              ประวัติการพบแพทย์และนัดหมาย ({patientAppointments.length} รายการ)
            </h3>
            <button
              onClick={() => setShowDoctorVisitModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-soft transition-all cursor-pointer"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-200" />
              <span>+ บันทึกการพบแพทย์รอบใหม่</span>
            </button>
          </div>

          {patientAppointments.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-gray-100 text-center text-gray-400 text-xs">
              ยังไม่มีประวัติการนัดพบแพทย์
            </div>
          ) : (
            patientAppointments.map(apt => (
              <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-soft space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sage-100 text-sage-900">
                        {apt.appointmentNumber}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        {apt.hospitalName} ({apt.department})
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      แพทย์ผู้ตรวจ: {apt.doctorName} • วันที่ {apt.dateTime}
                    </p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    apt.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {apt.status === 'completed' ? '✓ ตรวจเรียบร้อย' : '⏳ นัดหมายล่วงหน้า'}
                  </span>
                </div>

                {/* Escort Info */}
                {apt.escortStaffName && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                    <User className="w-3.5 h-3.5 text-sage-700" />
                    <span>เจ้าหน้าที่ดูแลพาพบแพทย์ (Escort): <strong className="text-gray-900">{apt.escortStaffName}</strong> ({apt.escortStaffPhone || '081-xxx-xxxx'})</span>
                  </div>
                )}

                {/* Pre-visit Briefing */}
                <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-xl">
                  <p className="font-bold text-gray-800">📋 ข้อมูลสรุปก่อนพบแพทย์ (Pre-Appointment Briefing):</p>
                  <p className="text-gray-600">การวินิจฉัยเดิม: {apt.preAppointmentBriefing.previousDiagnosis}</p>
                  <p className="text-gray-600">สัญญาณชีพล่าสุด: {apt.preAppointmentBriefing.recentVitalSummary}</p>
                  {apt.preAppointmentBriefing.questionsChecklist && apt.preAppointmentBriefing.questionsChecklist.length > 0 && (
                    <div className="pt-2">
                      <p className="font-semibold text-gray-700 mb-1">คำถามที่เตรียมถามแพทย์:</p>
                      <ul className="list-disc pl-4 space-y-0.5 text-gray-600">
                        {apt.preAppointmentBriefing.questionsChecklist.map(q => (
                          <li key={q.id}>
                            {q.question} {q.answered && q.doctorAnswer && <span className="text-emerald-700 font-bold">↳ คำตอบ: {q.doctorAnswer}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Post-visit Summary */}
                {apt.postVisitSummary && (
                  <div className="text-xs space-y-2 bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-xl">
                    <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-700" />
                      ผลการตรวจและคำสั่งการรักษาหลังพบแพทย์ (Post-Visit Doctor Orders):
                    </p>
                    <p className="text-emerald-900 leading-relaxed font-medium">
                      {apt.postVisitSummary.visitNotes}
                    </p>
                    {apt.postVisitSummary.medicationChanges && (
                      <p className="text-purple-900 font-semibold pt-1 border-t border-emerald-200/60">
                        💊 การปรับเปลี่ยนยา: {apt.postVisitSummary.medicationChanges}
                      </p>
                    )}
                    {apt.postVisitSummary.nextAppointmentDate && (
                      <p className="text-gray-700 font-semibold">
                        🗓️ วันนัดหมายครั้งต่อไป: {apt.postVisitSummary.nextAppointmentDate} ({apt.postVisitSummary.nextAppointmentDept})
                      </p>
                    )}

                    {/* Documents list */}
                    {apt.postVisitSummary.documents && apt.postVisitSummary.documents.length > 0 && (
                      <div className="pt-2 border-t border-emerald-200/60">
                        <p className="font-bold text-emerald-950 mb-2">📁 เอกสารทางการแพทย์ที่แนบ:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {apt.postVisitSummary.documents.map((doc, dIdx) => (
                            <div key={dIdx} className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center gap-2">
                              {doc.fileUrl ? (
                                <img src={doc.fileUrl} alt={doc.title} className="w-10 h-10 rounded object-cover" />
                              ) : (
                                <FileText className="w-6 h-6 text-emerald-700" />
                              )}
                              <div className="text-[11px] overflow-hidden">
                                <div className="font-bold text-gray-900 truncate">{doc.title}</div>
                                <div className="text-[10px] text-gray-500">{doc.type}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for editing patient */}
      {showEditModal && (
        <EditPatientModal patient={patient} onClose={() => setShowEditModal(false)} />
      )}

      {/* Modal for adding log */}
      {showLogModal && (
        <DailyLogModal patient={patient} onClose={() => setShowLogModal(false)} />
      )}

      {/* Modal for viewing and managing patient history */}
      {showHistoryModal && (
        <PatientHistoryModal 
          patient={patient} 
          initialTab={historyModalTab} 
          onClose={() => setShowHistoryModal(false)} 
        />
      )}

      {/* Modal for recording doctor visit */}
      {showDoctorVisitModal && (
        <DoctorVisitModal patient={patient} onClose={() => setShowDoctorVisitModal(false)} />
      )}
    </div>
  );
};
