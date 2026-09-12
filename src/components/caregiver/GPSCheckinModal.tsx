import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Caregiver } from '../../types';
import { X, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Navigation } from 'lucide-react';

interface GPSCheckinModalProps {
  caregiver: Caregiver;
  onClose: () => void;
}

export const GPSCheckinModal: React.FC<GPSCheckinModalProps> = ({ caregiver, onClose }) => {
  const { patients, performCheckin } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    caregiver.currentPatientId || patients[0]?.id || ''
  );
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const handleSimulateGPS = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerified(true);
      performCheckin(caregiver.id, selectedPatientId);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-sage-800 text-white shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ระบบเช็กอิน & GPS Service Log
              </h2>
              <p className="text-xs text-gray-500">
                {caregiver.thaiName}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Patient Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              เลือกผู้ป่วยที่ปฏิบัติงานดูแล:
            </label>
            <select
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.thaiName} ({p.careType === 'nursing_home' ? p.roomBed : 'Home Care'})
                </option>
              ))}
            </select>
          </div>

          {/* Location details card */}
          {selectedPatient && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-sage-900 font-bold">
                <Navigation className="w-4 h-4 text-sage-700" />
                <span>พิกัดเป้าหมายบ้านพักผู้ป่วย:</span>
              </div>
              <p className="text-gray-600 pl-6">{selectedPatient.address || 'ที่พักผู้ป่วย'}</p>
              <div className="pl-6 text-[11px] font-mono text-gray-500">
                GPS Lat: {selectedPatient.gpsCoords?.lat || 13.7745}, Lng: {selectedPatient.gpsCoords?.lng || 100.5367}
              </div>
            </div>
          )}

          {/* Visual Geofencing Map simulation */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sage-900 to-sage-800 text-white relative overflow-hidden text-center py-6 shadow-inner">
            <div className="relative z-10 space-y-2">
              <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto animate-pulse">
                <MapPin className="w-6 h-6 text-cream-200" />
              </div>
              <p className="text-xs font-bold">
                {verified ? '✅ Geofencing Verified: เช็กอินสำเร็จ' : 'ระบบตรวจสอบรัศมีระยะห่าง 50 เมตร'}
              </p>
              <p className="text-[11px] text-cream-300">
                ระยะห่างปัจจุบัน: <strong>15 เมตร</strong> (อยู่ในเขตพื้นที่ให้บริการ)
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            {!verified ? (
              <button
                type="button"
                onClick={handleSimulateGPS}
                disabled={isVerifying}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shadow-soft flex items-center justify-center gap-2 transition-all"
              >
                {isVerifying ? (
                  <span>กำลังตรวจจับพิกัดดาวเทียม GPS...</span>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    <span>กดเพื่อเช็กอินเข้าเริ่มงาน (Clock-in)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                  ✓ บันทึกเวลาเริ่มงานและส่ง Notification ให้ญาติเรียบร้อย
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
