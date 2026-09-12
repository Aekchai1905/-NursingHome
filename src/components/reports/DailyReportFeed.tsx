import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  HeartPulse, 
  Utensils, 
  Moon, 
  UserCheck, 
  Camera, 
  ShieldCheck, 
  Navigation 
} from 'lucide-react';

export const DailyReportFeed: React.FC = () => {
  const { dailyReports, checkins, performCheckout } = useApp();

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-sage-800 text-cream-200">
              Module 3 & 4
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Daily Care Reports & GPS Service Logs
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            รายงานการดูแลผู้ป่วยประจำวัน บันทึกพิกัด GPS เข้า-ออกงาน และการรับทราบรายงานโดยญาติ
          </p>
        </div>
      </div>

      {/* Grid: GPS Check-in Stream & Daily Care Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: GPS Live Check-in Stream */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">บันทึก GPS Check-in</h3>
                  <p className="text-[11px] text-gray-400">ประวัติการลงเวลาและพิกัดงาน</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 animate-pulse">
                ● Live GPS
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {checkins.map(chk => (
                <div key={chk.id} className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <strong className="text-sage-900 font-bold">{chk.caregiverName}</strong>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      chk.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {chk.status === 'active' ? '● กำลังปฏิบัติงาน' : '✓ เลิกงานแล้ว'}
                    </span>
                  </div>

                  <div className="text-gray-600 space-y-0.5 text-[11px]">
                    <p>ผู้ป่วย: <strong>{chk.patientName}</strong></p>
                    <p>เวลาเข้างาน: <strong>{chk.checkinTime} น.</strong> {chk.checkoutTime && `| เลิกงาน: ${chk.checkoutTime} น.`}</p>
                    <p className="text-gray-500 truncate">📍 {chk.gpsLocation.address}</p>
                    <div className="flex items-center gap-1 text-emerald-700 font-bold pt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Geofencing: ห่างจากจุดเป้าหมาย {chk.distanceFromPatientMeters} ม.</span>
                    </div>
                  </div>

                  {chk.status === 'active' && (
                    <button
                      onClick={() => performCheckout(chk.id)}
                      className="w-full mt-2 py-1.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 text-[11px] font-bold shadow-xs transition-colors"
                    >
                      เช็กเอาต์ออกงาน (Clock-out)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2 & 3: Daily Care Reports Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sage-800 text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    ฟีดรายงานการดูแลประจำวัน (Daily Care Reports Feed)
                  </h3>
                  <p className="text-[11px] text-gray-400">ส่งต่อให้ครอบครัวตรวจสอบแบบเรียลไทม์</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-100 text-gray-700">
                {dailyReports.length} รายงาน
              </span>
            </div>

            <div className="mt-4 space-y-5">
              {dailyReports.map(report => (
                <div key={report.id} className="p-5 rounded-3xl bg-cream-50/70 border border-cream-200 space-y-4">
                  {/* Report Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sage-800 text-white">
                          {report.reportNumber}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900">{report.patientName}</h4>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ผู้ดูแล: {report.caregiverName} • วันที่ {report.date} (ส่งเมื่อ {report.submittedAt} น.)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        report.medsCompliance === 'all_given' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        💊 {report.medsCompliance === 'all_given' ? 'ยาครบทุกมื้อ' : 'ทานยาบางส่วน'}
                      </span>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-white border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">🍲 การรับประทานอาหาร & น้ำ:</span>
                      <p className="text-gray-700 leading-relaxed">{report.mealsSummary}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-gray-100">
                      <span className="text-gray-400 font-bold block mb-1">💤 การขับถ่าย & การนอน:</span>
                      <p className="text-gray-700 leading-relaxed">{report.bowelStatus} • {report.sleepSummary}</p>
                    </div>
                  </div>

                  {/* Vital Summary pill */}
                  <div className="p-3 rounded-2xl bg-white border border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      สัญญาณชีพรอบวัน:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      BP {report.vitalSummary.bp} | Pulse {report.vitalSummary.pulse} bpm | Temp {report.vitalSummary.temp}°C | SpO2 {report.vitalSummary.spo2}%
                    </span>
                  </div>

                  {/* Activities and remarks */}
                  <div className="text-xs text-gray-700 bg-white p-3.5 rounded-2xl border border-gray-100">
                    <strong className="text-gray-900 block mb-1">กิจกรรมบำบัด & สภาพอารมณ์:</strong>
                    <p>{report.activityNotes}</p>
                    {report.abnormalSigns && (
                      <p className="mt-1 text-gray-500 italic">อาการผิดปกติ: {report.abnormalSigns}</p>
                    )}
                  </div>

                  {/* Photos */}
                  {report.photos.length > 0 && (
                    <div>
                      <span className="text-xs font-bold text-gray-700 block mb-2">ภาพประกอบการดูแล:</span>
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {report.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt=""
                            className="w-28 h-20 rounded-2xl object-cover ring-2 ring-white shadow-xs"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Family acknowledgement footer */}
                  <div className="pt-2 border-t border-cream-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{report.familyAcknowledged ? `ญาติรับทราบรายงานแล้ว (${report.acknowledgedAt || 'ผ่านแอป'})` : 'รอญาติกดยืนยันรับทราบ'}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">แจ้งเตือนผ่าน Firebase FCM แล้ว</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
