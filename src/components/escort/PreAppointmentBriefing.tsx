import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Building2, 
  User, 
  FileText, 
  HelpCircle, 
  CheckCircle2, 
  Send, 
  Phone, 
  ShieldAlert, 
  Pill, 
  Upload, 
  Activity, 
  Sparkles, 
  FileCheck 
} from 'lucide-react';
import { PostVisitModal } from './PostVisitModal';

interface PreAppointmentBriefingProps {
  appointment: Appointment;
  onBack: () => void;
}

export const PreAppointmentBriefing: React.FC<PreAppointmentBriefingProps> = ({ appointment, onBack }) => {
  const { addDoctorQuestion, answerDoctorQuestion, currentRole } = useApp();
  const [newQuestion, setNewQuestion] = useState('');
  const [showPostVisitModal, setShowPostVisitModal] = useState(false);
  const [answeringQId, setAnsweringQId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState('');

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    const author = currentRole === 'family' ? 'ญาติผู้ป่วย (Family)' : 'ผู้ดูแล (Caregiver)';
    addDoctorQuestion(appointment.id, newQuestion, author);
    setNewQuestion('');
  };

  const handleSaveAnswer = (qId: string) => {
    if (!answerInput.trim()) return;
    answerDoctorQuestion(appointment.id, qId, answerInput);
    setAnsweringQId(null);
    setAnswerInput('');
  };

  const briefing = appointment.preAppointmentBriefing;
  const isCompleted = appointment.status === 'completed';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-sage-800 hover:text-sage-950 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-xs transition-all w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← ย้อนกลับหน้ารายการนัดหมาย (Level 1)</span>
        </button>

        <div className="flex items-center gap-2">
          {!isCompleted && (
            <button
              onClick={() => setShowPostVisitModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold shadow-soft transition-all"
            >
              <FileCheck className="w-4 h-4" />
              <span>บันทึกผลหลังพบแพทย์ (Post-Visit Summary)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Appointment Briefing Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-sage-100 text-sage-900">
                {appointment.appointmentNumber}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                appointment.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                appointment.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
              }`}>
                ● {appointment.status}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mt-2">
              แฟ้มข้อมูลสรุปก่อนพบแพทย์ (Pre-Appointment Briefing)
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              เอกสารสรุปอัตโนมัติสำหรับพนักงาน Medical Escort และทีมแพทย์
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-semibold text-gray-500">วันและเวลานัดหมาย:</p>
            <p className="text-base font-extrabold text-sage-900">📅 {appointment.dateTime} น.</p>
          </div>
        </div>

        {/* Patient & Hospital Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Patient Card */}
          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 flex items-start gap-4">
            <img
              src={appointment.patientAvatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-xs shrink-0"
            />
            <div>
              <h3 className="text-base font-bold text-gray-900">{appointment.patientName}</h3>
              <p className="text-xs text-gray-500">อายุ {appointment.patientAge} ปี</p>
              <p className="text-xs text-sage-800 font-semibold mt-1">
                อาการ: {appointment.patientCondition}
              </p>
            </div>
          </div>

          {/* Escort & Hospital Details */}
          <div className="p-4 rounded-2xl bg-cream-50/70 border border-cream-200 text-xs space-y-2">
            <div className="flex items-center gap-2 text-gray-800">
              <Building2 className="w-4 h-4 text-sage-700 shrink-0" />
              <span><strong>โรงพยาบาล:</strong> {appointment.hospitalName}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <User className="w-4 h-4 text-sage-700 shrink-0" />
              <span><strong>แพทย์ / แผนก:</strong> {appointment.doctorName} ({appointment.department})</span>
            </div>
            <div className="flex items-center gap-2 text-gray-800 pt-1 border-t border-cream-200">
              <Phone className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>พนักงาน Escort:</strong> {appointment.escortStaffName || 'ยังไม่มอบหมาย'} {appointment.escortStaffPhone && `(${appointment.escortStaffPhone})`}
              </span>
            </div>
          </div>
        </div>

        {/* Briefing Clinical Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <FileText className="w-4 h-4 text-sage-700" />
              ผลการตรวจรอบก่อนหน้า
            </h4>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {briefing.previousDiagnosis}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Activity className="w-4 h-4 text-blue-600" />
              สัญญาณชีพล่าสุด
            </h4>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {briefing.recentVitalSummary}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              ข้อควรระวัง & ยาที่เกี่ยวข้อง
            </h4>
            <div className="mt-2 space-y-1">
              {briefing.precautionAlerts.map((al, i) => (
                <span key={i} className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 mr-1 mb-1">
                  ⚠️ {al}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Questions Checklist (Interactive Feature 4.4) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                รายการคำถามปรึกษาแพทย์ (Doctor Questions Checklist)
              </h3>
              <p className="text-xs text-gray-500">
                ญาติหรือผู้ดูแลฝากถามแพทย์ล่วงหน้า เพื่อให้พนักงาน Escort ซักถามขณะตรวจ
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cream-100 text-gray-700 border border-cream-200">
            {briefing.questionsChecklist.length} คำถามที่บันทึกไว้
          </span>
        </div>

        {/* Questions list */}
        <div className="space-y-3 mt-4">
          {briefing.questionsChecklist.map((q, idx) => (
            <div
              key={q.id}
              className={`p-4 rounded-2xl border transition-all ${
                q.answered 
                  ? 'bg-emerald-50/50 border-emerald-200' 
                  : 'bg-cream-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                    q.answered ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{q.question}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      โดย {q.submittedBy} • {q.submittedAt}
                    </p>

                    {/* Doctor's Answer if available */}
                    {q.answered && q.doctorAnswer && (
                      <div className="mt-2.5 p-3 rounded-xl bg-white border border-emerald-200 text-xs">
                        <span className="font-bold text-emerald-800 block mb-0.5">
                          🩺 คำตอบ/ข้อแนะนำจากแพทย์:
                        </span>
                        <p className="text-gray-700">{q.doctorAnswer}</p>
                      </div>
                    )}

                    {/* Inline answering input */}
                    {answeringQId === q.id && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="พิมพ์คำตอบที่แพทย์แจ้ง..."
                          value={answerInput}
                          onChange={e => setAnswerInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-xl border border-emerald-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          onClick={() => handleSaveAnswer(q.id)}
                          className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                        >
                          บันทึก
                        </button>
                        <button
                          onClick={() => setAnsweringQId(null)}
                          className="px-2 py-1.5 text-xs text-gray-400"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action button: mark answer */}
                {!q.answered && answeringQId !== q.id && (
                  <button
                    onClick={() => {
                      setAnsweringQId(q.id);
                      setAnswerInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-emerald-500 hover:text-emerald-700 text-xs font-semibold text-gray-600 transition-colors shrink-0 shadow-xs"
                  >
                    + บันทึกคำตอบแพทย์
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Form */}
        <form onSubmit={handleAddQuestion} className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="พิมพ์คำถามที่ต้องการฝากปรึกษาแพทย์เพิ่มเติม..."
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-sage-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-sage-800 hover:bg-sage-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-soft"
          >
            <Send className="w-3.5 h-3.5" />
            <span>เพิ่มคำถาม</span>
          </button>
        </form>
      </div>

      {/* Post-Visit Summary Display if already completed */}
      {appointment.postVisitSummary && (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-soft space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                สรุปผลการพบแพทย์ & ใบนัดใหม่ (Post-Visit Summary)
              </h3>
              <p className="text-xs text-gray-500">
                บันทึกโดย {appointment.postVisitSummary.submittedBy} เมื่อ {appointment.postVisitSummary.submittedAt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
              <strong className="text-gray-900 block mb-1">สรุปการรักษา:</strong>
              <p className="text-gray-700 leading-relaxed">{appointment.postVisitSummary.visitNotes}</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200">
              <strong className="text-gray-900 block mb-1">คำสั่งยา & แผนการรักษาใหม่:</strong>
              <p className="text-gray-700 leading-relaxed">{appointment.postVisitSummary.newTreatmentOrders}</p>
              {appointment.postVisitSummary.nextAppointmentDate && (
                <p className="text-emerald-800 font-bold mt-2">
                  📅 นัดครั้งถัดไป: {appointment.postVisitSummary.nextAppointmentDate} ({appointment.postVisitSummary.nextAppointmentDept})
                </p>
              )}
            </div>
          </div>

          {/* Attached Documents / Slips */}
          {appointment.postVisitSummary.documents.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 mb-2">เอกสารและใบเสร็จที่แนบ:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {appointment.postVisitSummary.documents.map(doc => (
                  <div key={doc.id} className="p-3 rounded-xl border border-gray-200 bg-white flex items-center gap-3">
                    <img
                      src={doc.fileUrl}
                      alt={doc.title}
                      className="w-14 h-14 rounded-lg object-cover ring-1 ring-gray-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{doc.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">อัปโหลด: {doc.uploadedAt}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-sage-800 hover:underline">
                        🔍 ดูภาพขยาย
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Post-Visit Summary Submission */}
      {showPostVisitModal && (
        <PostVisitModal
          appointment={appointment}
          onClose={() => setShowPostVisitModal(false)}
        />
      )}
    </div>
  );
};
