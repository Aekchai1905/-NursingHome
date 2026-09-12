import React from 'react';
import { useApp } from '../../context/AppContext';
import { Caregiver } from '../../types';
import { 
  ArrowLeft, 
  Star, 
  Award, 
  Briefcase, 
  FileText, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  HeartHandshake, 
  UserCheck 
} from 'lucide-react';

interface CaregiverDetailProps {
  caregiver: Caregiver;
  onBack: () => void;
}

export const CaregiverDetail: React.FC<CaregiverDetailProps> = ({ caregiver, onBack }) => {
  const { contracts } = useApp();
  const caregiverContracts = contracts.filter(c => c.caregiverId === caregiver.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-sage-800 hover:text-sage-950 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← ย้อนกลับหน้ารวมรายชื่อผู้ดูแล (Level 1)</span>
        </button>
      </div>

      {/* Main Caregiver Profile Card (Level 2 Header) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={caregiver.avatar}
              alt={caregiver.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-cream-200 shadow-md shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {caregiver.thaiName}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  caregiver.status === 'working' ? 'bg-blue-100 text-blue-800' :
                  caregiver.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                }`}>
                  ● {caregiver.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {caregiver.name} • อายุ {caregiver.age} ปี • ประสบการณ์ {caregiver.experienceYears} ปี
              </p>

              <div className="flex items-center gap-3 text-xs mt-3">
                <span className="flex items-center font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none mr-1" />
                  {caregiver.rating} ({caregiver.totalPatientsServed} ผู้ป่วยที่เคยดูแล)
                </span>
                <span className="text-gray-500">
                  เริ่มงานตั้งแต่: {caregiver.startDate}
                </span>
              </div>
            </div>
          </div>

          {/* Contact Box & Standard Wage */}
          <div className="p-4 rounded-2xl bg-cream-100/70 border border-cream-200 text-xs space-y-1.5 md:min-w-[280px]">
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4 text-sage-700 shrink-0" />
              <span>{caregiver.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Mail className="w-4 h-4 text-sage-700 shrink-0" />
              <span>{caregiver.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sage-900 font-bold pt-1.5 border-t border-cream-200">
              <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                อัตรามาตรฐาน: {caregiver.standardRate.toLocaleString()} บาท / {caregiver.wageType === 'monthly' ? 'เดือน' : caregiver.wageType === 'daily' ? 'วัน' : 'ชั่วโมง'}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {caregiver.bio && (
          <div className="mt-5 p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-gray-700 leading-relaxed italic">
            "{caregiver.bio}"
          </div>
        )}
      </div>

      {/* Qualifications, Certifications & Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Education & Certifications */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-xl bg-sage-100 text-sage-800">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                วุฒิการศึกษา & ใบประกาศนียบัตร (Certifications)
              </h3>
              <p className="text-xs text-gray-400">ผ่านการอบรมและรับรองมาตรฐานวิชาชีพ</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-gray-50 text-xs">
              <span className="font-bold text-gray-800 block">วุฒิการศึกษา:</span>
              <p className="text-gray-600 mt-0.5">{caregiver.education}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-800 block">ใบเซอร์เฉพาะทาง:</span>
              {caregiver.certifications.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-sage-50/70 border border-sage-200/80 text-sage-900 font-medium">
                  <ShieldCheck className="w-4 h-4 text-sage-700 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Skills & Service Areas */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                ทักษะความชำนาญเฉพาะด้าน (Special Skills)
              </h3>
              <p className="text-xs text-gray-400">หัตถการและการดูแลที่ผ่านการฝึกฝน</p>
            </div>
          </div>

          <div className="space-y-2">
            {caregiver.specialSkills.map((skill, i) => (
              <div key={i} className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 text-xs text-gray-800 font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-700 block mb-1.5">พื้นที่ให้บริการ (Service Areas):</span>
            <div className="flex flex-wrap gap-1.5">
              {caregiver.serviceAreas.map((area, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                  📍 {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contract & Wage Section (Requirement 6) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                สัญญาจ้างและเงื่อนไขการทำงาน (Wage & Contract Details)
              </h3>
              <p className="text-xs text-gray-500">ข้อมูลอัตราค่าจ้าง ประเภทการพักอาศัย และเงื่อนไขข้อตกลง</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-100 text-gray-700">
            {caregiverContracts.length} สัญญาที่บันทึกไว้
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {caregiverContracts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">ยังไม่มีสัญญาจ้างที่ผูกกับผู้ดูแลท่านนี้</p>
          ) : (
            caregiverContracts.map(ctr => (
              <div key={ctr.id} className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sage-800 text-white">
                      {ctr.contractNumber}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      ผู้ป่วย: {ctr.patientName}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ● สัญญา Active
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                    <span className="text-gray-400 text-[10px] block">อัตราค่าจ้าง:</span>
                    <strong className="text-gray-900 text-sm">{ctr.wageRate.toLocaleString()} บาท</strong>
                    <span className="text-gray-500 text-[11px]"> ({ctr.wageType})</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                    <span className="text-gray-400 text-[10px] block">ประเภทการทำงาน:</span>
                    <strong className="text-gray-900 text-sm">
                      {ctr.workingType === 'live_in' ? 'พักค้างคืน 24 ชม.' : 'ไป-กลับ'}
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-gray-100">
                    <span className="text-gray-400 text-[10px] block">ระยะเวลาสัญญา:</span>
                    <strong className="text-gray-900">{ctr.startDate} ถึง {ctr.endDate}</strong>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-700">เงื่อนไขการทำงาน: </span>
                  {ctr.specialTerms}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
