export type HealthStatus = 'stable' | 'monitor' | 'attention';

export type UserRole = 
  | 'admin' 
  | 'care_manager' 
  | 'doctor' 
  | 'caregiver' 
  | 'escort' 
  | 'family';

export interface PrecautionAlert {
  id: string;
  type: 'fall_risk' | 'food_allergy' | 'drug_allergy' | 'bedridden' | 'diabetes' | 'hypertension' | 'dementia' | 'other';
  label: string;
  severity: 'high' | 'medium' | 'low';
  details: string;
  icon: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: ('morning' | 'noon' | 'evening' | 'bedtime' | 'before_meal' | 'after_meal')[];
  instructions: string;
  prescribedBy: string;
}

export interface VitalSign {
  id: string;
  timestamp: string; // ISO or readable
  sys: number; // Blood pressure systolic
  dia: number; // Blood pressure diastolic
  pulse: number; // Pulse bpm
  glucose?: number; // mg/dL
  glucoseType?: 'fasting' | 'post_meal' | 'random';
  temp: number; // Celsius
  spo2: number; // Oxygen saturation %
  respirationRate?: number; // breaths/min
  status: HealthStatus;
  recordedBy: string;
  recorderRole: string;
  notes?: string;
}

export interface DailyLog {
  id: string;
  patientId: string;
  date: string;
  mealBreakfast: { type: string; amountPercent: number; notes?: string };
  mealLunch: { type: string; amountPercent: number; notes?: string };
  mealDinner: { type: string; amountPercent: number; notes?: string };
  waterIntakeMl: number;
  bowelMovement: { times: number; bristolScale: number; notes?: string }; // 1-7
  sleepHours: number;
  sleepQuality: 'good' | 'fair' | 'poor' | 'restless';
  dailyActivities: string[];
  abnormalSymptoms: string[];
  recordedBy: string;
  recordedAt: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  updatedAt: string;
  doctorRecommendations: string[];
  guidelines: string[];
  medications: Medication[];
  recommendedActivities: string[];
  restrictedActivities: string[];
  precautions: PrecautionAlert[];
  riskAssessment: {
    fallRiskScore: number; // 0-10
    bedriddenScale: 'ambulatory' | 'wheelchair' | 'bedridden';
    dietaryRestrictions: string[];
  };
}

export interface MedicationHistoryRecord {
  id: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  actionType: 'prescribed' | 'dosage_changed' | 'discontinued' | 'switched';
  actionLabel: string;
  reason?: string;
  prescribedBy: string;
  effectiveDate: string;
  recordedAt: string;
  notes?: string;
}

export interface AllergyHistoryRecord {
  id: string;
  patientId: string;
  allergen: string;
  category: 'drug' | 'food' | 'environmental' | 'other';
  severity: 'high' | 'medium' | 'low';
  symptoms: string;
  identifiedDate: string;
  recordedBy: string;
  status: 'active' | 'resolved' | 'suspected';
  notes?: string;
}

export interface CaregiverHistoryRecord {
  id: string;
  patientId: string;
  caregiverName: string;
  role: string;
  phone?: string;
  startDate: string;
  endDate?: string;
  status: 'current' | 'completed' | 'transferred';
  handoverSummary?: string;
  assignedBy: string;
}

export interface PatientAuditLog {
  id: string;
  patientId: string;
  changedAt: string;
  changedBy: string;
  category: string;
  changes: { field: string; from: string; to: string }[];
  summary: string;
}

export type PatientCareType = 'nursing_home' | 'medical_escort' | 'home_care';
export type ClientServiceStatus = 'active' | 'inactive' | 'discharged' | 'suspended';

export interface Patient {
  id: string;
  hn: string;
  name: string;
  thaiName: string;
  gender: 'male' | 'female';
  age: number;
  birthDate: string;
  avatar: string;
  roomBed?: string;
  careType: PatientCareType;
  serviceStatus?: ClientServiceStatus;
  inactiveReason?: string;
  inactiveDate?: string;
  serviceStartDate?: string;
  primaryCaregiverName?: string;
  primaryDoctorName: string;
  primaryHospital: string;
  chronicDiseases: string[];
  drugAllergies: string[];
  foodAllergies: string[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  healthStatus: HealthStatus;
  statusNotes: string;
  carePlan: CarePlan;
  vitalsHistory: VitalSign[];
  dailyLogs: DailyLog[];
  address?: string;
  gpsCoords?: { lat: number; lng: number };
  medicationHistory?: MedicationHistoryRecord[];
  allergyHistory?: AllergyHistoryRecord[];
  caregiverHistory?: CaregiverHistoryRecord[];
  auditLogs?: PatientAuditLog[];
}

export type AppointmentStatus = 'upcoming' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface DoctorQuestion {
  id: string;
  question: string;
  submittedBy: string;
  submittedAt: string;
  answered: boolean;
  doctorAnswer?: string;
}

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'receipt' | 'appointment_slip' | 'lab_result' | 'prescription' | 'photo';
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  patientAge: number;
  patientCondition: string;
  hospitalName: string;
  department: string;
  doctorName: string;
  dateTime: string;
  escortStaffId?: string;
  escortStaffName?: string;
  escortStaffAvatar?: string;
  escortStaffPhone?: string;
  status: AppointmentStatus;
  preAppointmentBriefing: {
    previousDiagnosis: string;
    previousTreatment: string;
    recentVitalSummary: string;
    precautionAlerts: string[];
    relevantMedications: string[];
    questionsChecklist: DoctorQuestion[];
  };
  postVisitSummary?: {
    visitNotes: string;
    newTreatmentOrders: string;
    medicationChanges: string;
    nextAppointmentDate?: string;
    nextAppointmentDept?: string;
    documents: MedicalDocument[];
    submittedAt?: string;
    submittedBy?: string;
  };
}

export type EscortAvailability = 'available' | 'busy' | 'leave';

export interface EscortStaff {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  skills: string[];
  serviceAreas: string[];
  availability: EscortAvailability;
  rating: number;
  totalTrips: number;
  certifications: string[];
  currentJobId?: string;
  schedule: {
    date: string;
    timeSlots: { time: string; status: 'free' | 'booked'; appointmentId?: string }[];
  }[];
}

export type CaregiverStatus = 'available' | 'working' | 'leave';
export type WageType = 'hourly' | 'daily' | 'monthly';
export type WorkingType = 'live_in' | 'live_out' | 'full_time' | 'part_time';

export interface CaregiverContract {
  id: string;
  contractNumber: string;
  patientId: string;
  patientName: string;
  caregiverId: string;
  caregiverName: string;
  startDate: string;
  endDate: string;
  wageType: WageType;
  wageRate: number;
  workingType: WorkingType;
  workingHours: string;
  specialTerms: string;
  status: 'active' | 'pending' | 'completed' | 'terminated';
}

export interface Caregiver {
  id: string;
  name: string;
  thaiName: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  email: string;
  experienceYears: number;
  education: string;
  certifications: string[];
  specialSkills: string[];
  serviceAreas: string[];
  status: CaregiverStatus;
  rating: number;
  totalPatientsServed: number;
  startDate: string;
  wageType: WageType;
  standardRate: number;
  currentPatientId?: string;
  currentPatientName?: string;
  bio: string;
}

export interface CheckinRecord {
  id: string;
  caregiverId: string;
  caregiverName: string;
  patientId: string;
  patientName: string;
  checkinTime: string;
  checkoutTime?: string;
  gpsLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  isInsideRadius: boolean; // Geofencing valid
  distanceFromPatientMeters: number;
  status: 'active' | 'completed';
}

export interface DailyCareReport {
  id: string;
  reportNumber: string;
  patientId: string;
  patientName: string;
  caregiverId: string;
  caregiverName: string;
  date: string;
  mealsSummary: string;
  medsCompliance: 'all_given' | 'partial' | 'missed';
  bowelStatus: string;
  sleepSummary: string;
  activityNotes: string;
  abnormalSigns: string;
  vitalSummary: {
    bp: string;
    pulse: number;
    glucose?: number;
    temp: number;
    spo2: number;
  };
  photos: string[];
  submittedAt: string;
  familyAcknowledged: boolean;
  acknowledgedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'vital_alert' | 'med_reminder' | 'appointment' | 'checkin' | 'care_report' | 'care_plan';
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  targetRoles: UserRole[];
  patientId?: string;
  actionLink?: string;
}

// 2 Staff Groups Definition
export type StaffCategory = 'nursing_home_escort' | 'home_care';
export type UnifiedStaffStatus = 'available' | 'working' | 'leave';

export interface UnifiedStaffMember {
  id: string;
  code: string; // e.g. 'STF-NH01', 'STF-HC02'
  name: string;
  thaiName: string;
  nickname?: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  lineId?: string;
  email: string;
  category: StaffCategory; // 'nursing_home_escort' | 'home_care'
  subRole: string; // e.g., 'พนักงานบริบาลประจำศูนย์ (Nursing Home Care)', 'พนักงานพาพบแพทย์ (Medical Escort)', 'ผู้ช่วยพยาบาลดูแลผู้ป่วยที่บ้าน (PN Home Care)'
  status: UnifiedStaffStatus; // 'available' | 'working' | 'leave'
  experienceYears: number;
  rating: number;
  totalCases: number;
  currentAssignment?: {
    type: 'nursing_home_patient' | 'escort_trip' | 'home_care_patient';
    patientName: string;
    locationOrRoom: string;
    details?: string;
    startTime?: string;
  };
  skills: string[];
  certifications: string[];
  serviceAreas?: string[];
  standardRate?: string;
  education?: string;
  notes?: string;
}

