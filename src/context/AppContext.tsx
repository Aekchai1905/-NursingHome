import React, { createContext, useContext, useState } from 'react';
import { 
  Patient, 
  Appointment, 
  EscortStaff, 
  Caregiver, 
  CaregiverContract, 
  CheckinRecord, 
  DailyCareReport, 
  NotificationItem, 
  UserRole,
  VitalSign,
  DailyLog,
  UnifiedStaffMember,
  UnifiedStaffStatus
} from '../types';
import { 
  initialPatients, 
  initialAppointments, 
  initialEscortStaff, 
  initialCaregivers, 
  initialContracts, 
  initialCheckins, 
  initialDailyReports, 
  initialNotifications,
  initialUnifiedStaff 
} from '../data/mockData';

interface AppContextType {
  // State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
  
  // Active Navigation
  activeTab: 'patients' | 'appointments' | 'caregivers' | 'analytics' | 'reports' | 'staff' | 'all_clients' | 'customer_portal' | 'staff_portal' | 'testimonials';
  setActiveTab: (tab: 'patients' | 'appointments' | 'caregivers' | 'analytics' | 'reports' | 'staff' | 'all_clients' | 'customer_portal' | 'staff_portal' | 'testimonials') => void;
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
  selectedCaregiverId: string | null;
  setSelectedCaregiverId: (id: string | null) => void;
  selectedAppointmentId: string | null;
  setSelectedAppointmentId: (id: string | null) => void;
  selectedStaffId: string | null;
  setSelectedStaffId: (id: string | null) => void;

  // Data
  patients: Patient[];
  appointments: Appointment[];
  escortStaff: EscortStaff[];
  caregivers: Caregiver[];
  staff: UnifiedStaffMember[];
  contracts: CaregiverContract[];
  checkins: CheckinRecord[];
  dailyReports: DailyCareReport[];
  notifications: NotificationItem[];
  unreadNotifCount: number;

  // Actions
  updateStaffStatus: (staffId: string, status: UnifiedStaffStatus) => void;
  addStaffMember: (staffMember: UnifiedStaffMember) => void;
  updateStaffMember: (staffMember: UnifiedStaffMember) => void;

  // Actions
  addVitalSign: (patientId: string, vital: Omit<VitalSign, 'id' | 'status'>) => void;
  addDailyLog: (patientId: string, log: Omit<DailyLog, 'id' | 'patientId'>) => void;
  assignEscortStaff: (appointmentId: string, escortStaffId: string) => void;
  addDoctorQuestion: (appointmentId: string, questionText: string, submittedBy: string) => void;
  answerDoctorQuestion: (appointmentId: string, questionId: string, answerText: string) => void;
  submitPostVisitSummary: (
    appointmentId: string, 
    summary: {
      visitNotes: string;
      newTreatmentOrders: string;
      medicationChanges: string;
      nextAppointmentDate?: string;
      nextAppointmentDept?: string;
      receiptUrl?: string;
      slipUrl?: string;
    }
  ) => void;
  performCheckin: (caregiverId: string, patientId: string) => void;
  performCheckout: (checkinId: string) => void;
  submitDailyReport: (report: Omit<DailyCareReport, 'id' | 'reportNumber' | 'submittedAt' | 'familyAcknowledged'>) => void;
  addPatient: (patient: Patient) => void;
  updatePatient: (patient: Patient) => void;
  addCaregiver: (caregiver: Caregiver) => void;
  recordDoctorVisit: (visitData: {
    patientId: string;
    visitLocation: string;
    doctorName: string;
    hospitalName: string;
    department: string;
    visitDateTime: string;
    reason: string;
    diagnosis: string;
    treatmentOrders: string;
    medicationChanges: string;
    nextAppointmentDate?: string;
    receiptUrl?: string;
    slipUrl?: string;
    recordedBy: string;
  }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('care_manager');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments' | 'caregivers' | 'analytics' | 'reports' | 'staff' | 'all_clients' | 'customer_portal' | 'staff_portal' | 'testimonials'>('all_clients');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [escortStaff, setEscortStaff] = useState<EscortStaff[]>(initialEscortStaff);
  const [caregivers, setCaregivers] = useState<Caregiver[]>(initialCaregivers);
  const [staff, setStaff] = useState<UnifiedStaffMember[]>(initialUnifiedStaff);
  const [contracts] = useState<CaregiverContract[]>(initialContracts);
  const [checkins, setCheckins] = useState<CheckinRecord[]>(initialCheckins);
  const [dailyReports, setDailyReports] = useState<DailyCareReport[]>(initialDailyReports);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // Add Vital Sign
  const addVitalSign = (patientId: string, vitalInput: Omit<VitalSign, 'id' | 'status'>) => {
    let status: 'stable' | 'monitor' | 'attention' = 'stable';
    if (vitalInput.sys >= 140 || vitalInput.sys < 90 || vitalInput.dia >= 90 || (vitalInput.glucose && vitalInput.glucose >= 180) || vitalInput.temp >= 37.5 || vitalInput.spo2 < 95) {
      status = 'attention';
    } else if (vitalInput.sys >= 130 || (vitalInput.glucose && vitalInput.glucose >= 140) || vitalInput.temp >= 37.2 || vitalInput.spo2 <= 96) {
      status = 'monitor';
    }

    const newVital: VitalSign = {
      ...vitalInput,
      id: `v-${Date.now()}`,
      status
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          healthStatus: status,
          vitalsHistory: [newVital, ...p.vitalsHistory]
        };
      }
      return p;
    }));

    if (status === 'attention') {
      const patient = patients.find(p => p.id === patientId);
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `🚨 สัญญาณชีพล่าสุดอยู่ในเกณฑ์ต้องเฝ้าระวัง (${patient?.thaiName})`,
        message: `ความดัน ${vitalInput.sys}/${vitalInput.dia} mmHg, อุณหภูมิ ${vitalInput.temp}°C, SpO2 ${vitalInput.spo2}%`,
        type: 'vital_alert',
        severity: 'critical',
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        read: false,
        targetRoles: ['doctor', 'care_manager', 'family'],
        patientId
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  // Add Daily Log
  const addDailyLog = (patientId: string, logInput: Omit<DailyLog, 'id' | 'patientId'>) => {
    const newLog: DailyLog = {
      ...logInput,
      id: `dl-${Date.now()}`,
      patientId
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          dailyLogs: [newLog, ...p.dailyLogs]
        };
      }
      return p;
    }));
  };

  // Assign Escort Staff
  const assignEscortStaff = (appointmentId: string, escortStaffId: string) => {
    const staff = escortStaff.find(s => s.id === escortStaffId);
    if (!staff) return;

    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          escortStaffId: staff.id,
          escortStaffName: staff.name,
          escortStaffAvatar: staff.avatar,
          escortStaffPhone: staff.phone,
          status: 'confirmed'
        };
      }
      return apt;
    }));

    // Update staff status
    setEscortStaff(prev => prev.map(s => {
      if (s.id === escortStaffId) {
        return { ...s, availability: 'busy' };
      }
      return s;
    }));

    // Create Notification
    const apt = appointments.find(a => a.id === appointmentId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🚗 มอบหมายพนักงาน Escort เรียบร้อย`,
      message: `${staff.name} ได้รับมอบหมายดูแล ${apt?.patientName} สำหรับนัดหมายวันที่ ${apt?.dateTime}`,
      type: 'appointment',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['escort', 'family', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add Doctor Question
  const addDoctorQuestion = (appointmentId: string, questionText: string, submittedBy: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const newQ = {
          id: `q-${Date.now()}`,
          question: questionText,
          submittedBy,
          submittedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          answered: false
        };
        return {
          ...apt,
          preAppointmentBriefing: {
            ...apt.preAppointmentBriefing,
            questionsChecklist: [...apt.preAppointmentBriefing.questionsChecklist, newQ]
          }
        };
      }
      return apt;
    }));
  };

  // Answer Doctor Question
  const answerDoctorQuestion = (appointmentId: string, questionId: string, answerText: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          preAppointmentBriefing: {
            ...apt.preAppointmentBriefing,
            questionsChecklist: apt.preAppointmentBriefing.questionsChecklist.map(q => {
              if (q.id === questionId) {
                return { ...q, answered: true, doctorAnswer: answerText };
              }
              return q;
            })
          }
        };
      }
      return apt;
    }));
  };

  // Submit Post Visit Summary
  const submitPostVisitSummary = (
    appointmentId: string, 
    summary: {
      visitNotes: string;
      newTreatmentOrders: string;
      medicationChanges: string;
      nextAppointmentDate?: string;
      nextAppointmentDept?: string;
      receiptUrl?: string;
      slipUrl?: string;
    }
  ) => {
    const docs: import('../types').MedicalDocument[] = [];
    if (summary.receiptUrl) {
      docs.push({
        id: `doc-rcpt-${Date.now()}`,
        title: 'ใบเสร็จรับเงินค่าตรวจรักษาและค่ายา',
        type: 'receipt' as const,
        fileUrl: summary.receiptUrl,
        uploadedAt: new Date().toLocaleString('th-TH'),
        uploadedBy: 'พนักงาน Medical Escort'
      });
    }
    if (summary.slipUrl) {
      docs.push({
        id: `doc-slip-${Date.now()}`,
        title: `ใบนัดหมายแพทย์รอบถัดไป (${summary.nextAppointmentDate || 'ระบุวัน'})`,
        type: 'appointment_slip' as const,
        fileUrl: summary.slipUrl,
        uploadedAt: new Date().toLocaleString('th-TH'),
        uploadedBy: 'พนักงาน Medical Escort'
      });
    }

    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        return {
          ...apt,
          status: 'completed',
          postVisitSummary: {
            visitNotes: summary.visitNotes,
            newTreatmentOrders: summary.newTreatmentOrders,
            medicationChanges: summary.medicationChanges,
            nextAppointmentDate: summary.nextAppointmentDate,
            nextAppointmentDept: summary.nextAppointmentDept,
            documents: docs,
            submittedAt: new Date().toLocaleString('th-TH'),
            submittedBy: apt.escortStaffName || 'Medical Escort'
          }
        };
      }
      return apt;
    }));

    // Notify Family and Care Manager
    const apt = appointments.find(a => a.id === appointmentId);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `✅ บันทึกผลตรวจแพทย์หลังพบแพทย์เรียบร้อย`,
      message: `การพบแพทย์ของ ${apt?.patientName} เสร็จสิ้น พร้อมอัปเดตคำสั่งยาและใบนัดหมายใหม่แล้ว`,
      type: 'appointment',
      severity: 'success',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['family', 'care_manager', 'doctor']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Perform GPS Check-in
  const performCheckin = (caregiverId: string, patientId: string) => {
    const cg = caregivers.find(c => c.id === caregiverId);
    const pt = patients.find(p => p.id === patientId);
    if (!cg || !pt) return;

    const newCheckin: CheckinRecord = {
      id: `chk-${Date.now()}`,
      caregiverId,
      caregiverName: cg.thaiName,
      patientId,
      patientName: pt.thaiName,
      checkinTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      gpsLocation: {
        lat: pt.gpsCoords?.lat || 13.7563,
        lng: pt.gpsCoords?.lng || 100.5018,
        address: pt.address || 'ที่พักผู้ป่วย'
      },
      isInsideRadius: true,
      distanceFromPatientMeters: 15,
      status: 'active'
    };

    setCheckins(prev => [newCheckin, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `📍 ผู้ดูแลเช็กอินเริ่มงานแล้ว`,
      message: `${cg.thaiName} เช็กอิน GPS ณ ${pt.thaiName} พิกัดถูกต้องสมบูรณ์`,
      type: 'checkin',
      severity: 'success',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['family', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Perform Checkout
  const performCheckout = (checkinId: string) => {
    setCheckins(prev => prev.map(chk => {
      if (chk.id === checkinId) {
        return {
          ...chk,
          checkoutTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          status: 'completed'
        };
      }
      return chk;
    }));
  };

  // Submit Daily Report
  const submitDailyReport = (reportInput: Omit<DailyCareReport, 'id' | 'reportNumber' | 'submittedAt' | 'familyAcknowledged'>) => {
    const newReport: DailyCareReport = {
      ...reportInput,
      id: `dcr-${Date.now()}`,
      reportNumber: `DCR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(10 + Math.random()*90)}`,
      submittedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      familyAcknowledged: false
    };

    setDailyReports(prev => [newReport, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `📋 รายงานการดูแลประจำวันใหม่พร้อมให้ตรวจสอบ`,
      message: `${reportInput.caregiverName} ส่งรายงานสรุปการดูแล ${reportInput.patientName} ประจำวันที่ ${reportInput.date}`,
      type: 'care_report',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['family', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add New Patient
  const addPatient = (patient: Patient) => {
    setPatients(prev => [patient, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `👤 เพิ่มข้อมูลผู้ป่วยใหม่เรียบร้อย`,
      message: `${patient.thaiName} (${patient.hn}) ได้รับการลงทะเบียนเข้าสู่ระบบแล้ว`,
      type: 'care_plan',
      severity: 'success',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager', 'doctor']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Existing Patient
  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `✏️ บันทึกการแก้ไขข้อมูลผู้ป่วยเรียบร้อย`,
      message: `อัปเดตข้อมูลของ ${updatedPatient.thaiName} (${updatedPatient.hn}) ในระบบแล้ว`,
      type: 'care_plan',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager', 'doctor', 'family', 'caregiver']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add New Caregiver
  const addCaregiver = (caregiver: Caregiver) => {
    setCaregivers(prev => [caregiver, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `👩‍⚕️ เพิ่มข้อมูลผู้ดูแลคนใหม่เรียบร้อย`,
      message: `${caregiver.thaiName} ได้รับการลงทะเบียนในระบบพร้อมรับงานแล้ว`,
      type: 'checkin',
      severity: 'success',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Record Doctor Visit for Nursing Home / Home Care Patient
  const recordDoctorVisit = (visitData: {
    patientId: string;
    visitLocation: string;
    doctorName: string;
    hospitalName: string;
    department: string;
    visitDateTime: string;
    reason: string;
    diagnosis: string;
    treatmentOrders: string;
    medicationChanges: string;
    nextAppointmentDate?: string;
    receiptUrl?: string;
    slipUrl?: string;
    recordedBy: string;
  }) => {
    const pt = patients.find(p => p.id === visitData.patientId);
    if (!pt) return;

    const docs: import('../types').MedicalDocument[] = [];
    if (visitData.receiptUrl) {
      docs.push({
        id: `doc-rcpt-${Date.now()}`,
        title: `ใบเสร็จค่าตรวจรักษา (${visitData.hospitalName})`,
        type: 'receipt',
        fileUrl: visitData.receiptUrl,
        uploadedAt: new Date().toLocaleString('th-TH'),
        uploadedBy: visitData.recordedBy
      });
    }
    if (visitData.slipUrl) {
      docs.push({
        id: `doc-slip-${Date.now()}`,
        title: `ใบนัดตรวจรอบถัดไป (${visitData.nextAppointmentDate || 'ระบุวัน'})`,
        type: 'appointment_slip',
        fileUrl: visitData.slipUrl,
        uploadedAt: new Date().toLocaleString('th-TH'),
        uploadedBy: visitData.recordedBy
      });
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`,
      patientId: pt.id,
      patientName: pt.thaiName,
      patientAvatar: pt.avatar,
      patientAge: pt.age,
      patientCondition: visitData.reason || 'ตรวจติดตามสุขภาพประจำรอบ',
      hospitalName: visitData.hospitalName,
      department: visitData.department,
      doctorName: visitData.doctorName,
      dateTime: visitData.visitDateTime,
      status: 'completed',
      preAppointmentBriefing: {
        previousDiagnosis: visitData.reason,
        previousTreatment: 'การดูแลต่อเนื่อง ณ เนอร์สซิ่งโฮม',
        recentVitalSummary: 'ตรวจวัดสัญญาณชีพขณะพบแพทย์',
        precautionAlerts: pt.carePlan.precautions.map(p => p.label),
        relevantMedications: pt.carePlan.medications.map(m => `${m.name} ${m.dosage}`),
        questionsChecklist: []
      },
      postVisitSummary: {
        visitNotes: `[สถานที่: ${visitData.visitLocation}] คำวินิจฉัย: ${visitData.diagnosis}`,
        newTreatmentOrders: visitData.treatmentOrders,
        medicationChanges: visitData.medicationChanges,
        nextAppointmentDate: visitData.nextAppointmentDate,
        nextAppointmentDept: visitData.department,
        documents: docs,
        submittedAt: new Date().toLocaleString('th-TH'),
        submittedBy: visitData.recordedBy
      }
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Update patient status notes
    setPatients(prev => prev.map(p => {
      if (p.id === pt.id) {
        return {
          ...p,
          statusNotes: `บันทึกพบแพทย์ล่าสุด (${visitData.visitDateTime}): ${visitData.diagnosis}`
        };
      }
      return p;
    }));

    // Dispatch Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🩺 บันทึกผลการพบแพทย์เรียบร้อย (${pt.thaiName})`,
      message: `แพทย์: ${visitData.doctorName} (${visitData.hospitalName}) สรุปผล: ${visitData.diagnosis}`,
      type: 'appointment',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['doctor', 'care_manager', 'family', 'caregiver'],
      patientId: pt.id
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Unified Staff Status (Available, Working, Leave)
  const updateStaffStatus = (staffId: string, status: UnifiedStaffStatus) => {
    setStaff(prev => prev.map(s => {
      if (s.id === staffId) {
        return { 
          ...s, 
          status,
          currentAssignment: status === 'available' ? undefined : s.currentAssignment
        };
      }
      return s;
    }));

    const member = staff.find(s => s.id === staffId);
    const statusText = status === 'available' ? '🟢 ว่าง / พร้อมรับงาน' : status === 'working' ? '🟡 กำลังปฏิบัติงาน / ติดเคส' : '🔴 ลางาน / พักผ่อน';

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🔄 อัปเดตสถานะพนักงาน (${member?.thaiName || staffId})`,
      message: `เปลี่ยนสถานะเป็น ${statusText} เรียบร้อยแล้ว`,
      type: 'care_plan',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager', 'doctor']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Add New Staff Member
  const addStaffMember = (staffMember: UnifiedStaffMember) => {
    setStaff(prev => [staffMember, ...prev]);
    const groupName = staffMember.category === 'nursing_home_escort' 
      ? 'Nursing Home & Escort' 
      : 'ผู้ดูแลที่บ้าน (Home Care)';

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `👤 เพิ่มพนักงานใหม่ (${staffMember.thaiName})`,
      message: `กลุ่ม: ${groupName} • ตำแหน่ง: ${staffMember.subRole} รหัส ${staffMember.code}`,
      type: 'checkin',
      severity: 'success',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Update Existing Staff Member
  const updateStaffMember = (updatedMember: UnifiedStaffMember) => {
    setStaff(prev => prev.map(s => s.id === updatedMember.id ? updatedMember : s));
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `✏️ บันทึกการแก้ไขข้อมูลพนักงานเรียบร้อย`,
      message: `อัปเดตข้อมูลของ ${updatedMember.thaiName} (${updatedMember.code}) ในระบบแล้ว`,
      type: 'care_plan',
      severity: 'info',
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRoles: ['admin', 'care_manager']
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider value={{
      currentRole,
      setCurrentRole,
      viewMode,
      setViewMode,
      language,
      setLanguage,
      activeTab,
      setActiveTab,
      selectedPatientId,
      setSelectedPatientId,
      selectedCaregiverId,
      setSelectedCaregiverId,
      selectedAppointmentId,
      setSelectedAppointmentId,
      selectedStaffId,
      setSelectedStaffId,
      patients,
      appointments,
      escortStaff,
      caregivers,
      staff,
      contracts,
      checkins,
      dailyReports,
      notifications,
      unreadNotifCount,
      updateStaffStatus,
      addStaffMember,
      updateStaffMember,
      addVitalSign,
      addDailyLog,
      assignEscortStaff,
      addDoctorQuestion,
      answerDoctorQuestion,
      submitPostVisitSummary,
      performCheckin,
      performCheckout,
      submitDailyReport,
      addPatient,
      updatePatient,
      addCaregiver,
      recordDoctorVisit,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
