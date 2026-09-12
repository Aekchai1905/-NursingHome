import React from 'react';
import { useApp } from '../../context/AppContext';
import { EscortStaff } from '../../types';
import { Star, ShieldCheck, MapPin, Calendar, Phone, Award, CheckCircle } from 'lucide-react';

export const EscortStaffList: React.FC = () => {
  const { escortStaff } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            พนักงานพาผู้ป่วยไปพบแพทย์ (Medical Escort Roster & Availability)
          </h3>
          <p className="text-xs text-gray-500">
            ตรวจสอบความพร้อม ทักษะเฉพาะทาง และตารางเวลาให้บริการ
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-100 text-gray-700">
          ทั้งหมด {escortStaff.length} คน
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {escortStaff.map(staff => (
          <div
            key={staff.id}
            className="bg-white rounded-3xl border border-gray-100 p-5 shadow-soft hover:shadow-soft-lg transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header with Avatar & Availability */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cream-200 shadow-xs"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{staff.name}</h4>
                    <p className="text-xs text-gray-500">{staff.phone}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" />
                      <span>{staff.rating}</span>
                      <span className="text-gray-400 font-normal">({staff.totalTrips} ทริป)</span>
                    </div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  staff.availability === 'available' ? 'bg-emerald-100 text-emerald-800' :
                  staff.availability === 'busy' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  ● {staff.availability}
                </span>
              </div>

              {/* Certifications */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                <p className="text-[11px] font-bold text-gray-700">ใบรับรอง & วุฒิบัตร:</p>
                {staff.certifications.map((c, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-sage-900 font-medium">
                    <Award className="w-3.5 h-3.5 text-sage-600 shrink-0" />
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="mt-3 pt-2 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-700 mb-1.5">ทักษะความชำนาญ:</p>
                <div className="flex flex-wrap gap-1">
                  {staff.skills.map((skill, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-gray-700 border border-cream-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Areas */}
              <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{staff.serviceAreas.join(', ')}</span>
              </div>
            </div>

            {/* Schedule Slot status */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs">
                <p className="text-[11px] font-bold text-gray-700 mb-1">ตารางงานวันนี้ / พรุ่งนี้:</p>
                {staff.schedule[0]?.timeSlots.map((slot, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="text-gray-600">{slot.time}</span>
                    <span className={`font-semibold ${slot.status === 'booked' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {slot.status === 'booked' ? '🔒 ติดนัดหมาย' : '✓ ว่างรับงาน'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
