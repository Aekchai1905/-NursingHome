import { 
  Patient, 
  Appointment, 
  EscortStaff, 
  Caregiver, 
  CaregiverContract, 
  CheckinRecord, 
  DailyCareReport, 
  NotificationItem,
  UnifiedStaffMember 
} from '../types';

export const initialPatients: Patient[] = [
  {
    id: 'p-001',
    hn: 'HN-6701042',
    name: 'Somsee Ratanaporn',
    thaiName: 'คุณยายสมศรี รัตนพร',
    gender: 'female',
    age: 78,
    birthDate: '1948-03-12',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
    roomBed: 'Ward A - Room 204',
    careType: 'nursing_home',
    serviceStatus: 'active',
    serviceStartDate: '2026-01-15',
    primaryCaregiverName: 'ศศิธร พรประสิทธิ์ (Caregiver ศศิ)',
    primaryDoctorName: 'นพ. วิรัช วงศ์สว่าง (อายุรกรรมหัวใจ)',
    primaryHospital: 'โรงพยาบาลกรุงเทพคริสเตียน',
    chronicDiseases: ['ความดันโลหิตสูง (Hypertension)', 'เบาหวานชนิดที่ 2 (Type 2 DM)', 'กระดูกพรุน (Osteoporosis)'],
    drugAllergies: ['Penicillin (ผื่นคัน แน่นหน้าอก)', 'Aspirin (ระคายเคืองกระเพาะ)'],
    foodAllergies: ['กุ้ง (Seafood Allergy)', 'อาหารรสเค็มจัด (Low Sodium Recommended)'],
    emergencyContact: {
      name: 'คุณธนพล รัตนพร (บุตรชาย)',
      relationship: 'บุตรชาย (Son)',
      phone: '081-456-7890'
    },
    healthStatus: 'monitor',
    statusNotes: 'ระดับน้ำตาลหลังอาหารเช้าค่อนข้างสูง (168 mg/dL) เฝ้าระวังความดันช่วงเย็น',
    carePlan: {
      id: 'cp-001',
      patientId: 'p-001',
      updatedAt: '2026-09-06 09:30',
      doctorRecommendations: [
        'ควบคุมปริมาณแป้งและน้ำตาล ไม่เกิน 1,500 kcal/วัน',
        'วัดความดันโลหิตและระดับน้ำตาลวันละ 2 ครั้ง (เช้า-เย็น)',
        'กายภาพบำบัดกล้ามเนื้อขาทุกวัน เพื่อป้องกันภาวะกล้ามเนื้อลีบ',
        'ดื่มน้ำสะอาดวันละอย่างน้อย 1,500 - 1,800 มล.'
      ],
      guidelines: [
        'หลีกเลี่ยงการลุกจากเตียงกะทันหัน ต้องมีผู้ดูแลช่วยพยุงเสมอ',
        'ตรวจวัดระดับน้ำตาลก่อนอาหารเช้า และ 2 ชั่วโมงหลังอาหาร',
        'บันทึกปริมาณอาหารและการขับถ่ายทุกมื้อ'
      ],
      medications: [
        {
          id: 'med-1',
          name: 'Amlodipine (Norvasc)',
          dosage: '5 mg',
          frequency: 'วันละ 1 ครั้ง หลังอาหารเช้า',
          timing: ['morning', 'after_meal'],
          instructions: 'ลดความดันโลหิต ทานตรงเวลาทุกวัน',
          prescribedBy: 'นพ. วิรัช'
        },
        {
          id: 'med-2',
          name: 'Metformin HCl',
          dosage: '500 mg',
          frequency: 'วันละ 2 ครั้ง หลังอาหารเช้า-เย็น',
          timing: ['morning', 'evening', 'after_meal'],
          instructions: 'ควบคุมระดับน้ำตาลในเลือด',
          prescribedBy: 'พญ. นภาพร'
        },
        {
          id: 'med-3',
          name: 'Calcium Carbonate + Vit D3',
          dosage: '1,000 mg',
          frequency: 'วันละ 1 ครั้ง หลังอาหารเย็น',
          timing: ['evening', 'after_meal'],
          instructions: 'บำรุงกระดูก',
          prescribedBy: 'นพ. ธีรเดช'
        }
      ],
      recommendedActivities: ['เดินแกว่งแขนเบาๆ 15 นาที', 'ฝึกหายใจลึกและกายบริหารกล้ามเนื้อมือ', 'เล่นเกมจับคู่การ์ดฝึกสมอง'],
      restrictedActivities: ['ห้ามยกของหนัก', 'ห้ามลุกเดินคนเดียวในห้องน้ำ', 'ห้ามรับประทานผลไม้หวานจัด เช่น ทุเรียน ลำไย'],
      precautions: [
        { id: 'al-1', type: 'fall_risk', label: 'ความเสี่ยงพลัดตกหกล้ม (High Fall Risk)', severity: 'high', details: 'เคยมีประวัติลื่นล้ม ต้องมีผู้ดูแลพยุงเสมอเมื่อเคลื่อนย้าย', icon: 'AlertTriangle' },
        { id: 'al-2', type: 'drug_allergy', label: 'แพ้ยา Penicillin & Aspirin', severity: 'high', details: 'ห้ามจ่ายยากลุ่ม Penicillin และ NSAIDs โดยเด็ดขาด', icon: 'Pill' },
        { id: 'al-3', type: 'diabetes', label: 'ผู้ป่วยเบาหวาน (Diabetes Mellitus)', severity: 'medium', details: 'ระวังภาวะน้ำตาลตกและแผลที่เท้า ตรวจสอบเท้าทุกวัน', icon: 'Activity' },
        { id: 'al-4', type: 'hypertension', label: 'ความดันโลหิตสูง (Hypertension)', severity: 'medium', details: 'เฝ้าระวังเมื่อความดัน SYS > 140 หรือ DIA > 90', icon: 'HeartPulse' }
      ],
      riskAssessment: {
        fallRiskScore: 8,
        bedriddenScale: 'wheelchair',
        dietaryRestrictions: ['Low Sodium (เกลือต่ำ)', 'Low Glycemic (น้ำตาลต่ำ)', 'No Seafood (งดอาหารทะเล)']
      }
    },
    vitalsHistory: [
      { id: 'v-101', timestamp: '2026-09-07 14:00', sys: 138, dia: 86, pulse: 76, glucose: 154, glucoseType: 'post_meal', temp: 36.7, spo2: 98, respirationRate: 18, status: 'monitor', recordedBy: 'ศศิธร พรประสิทธิ์', recorderRole: 'Caregiver', notes: 'หลังอาหารกลางวัน อาการทั่วไปสดชื่น พูดคุยรู้เรื่อง' },
      { id: 'v-102', timestamp: '2026-09-07 08:30', sys: 142, dia: 88, pulse: 80, glucose: 168, glucoseType: 'fasting', temp: 36.8, spo2: 97, respirationRate: 19, status: 'monitor', recordedBy: 'ศศิธร พรประสิทธิ์', recorderRole: 'Caregiver', notes: 'ตื่นเช้าความดันและน้ำตาลค่อนข้างสูง ให้ยาตามเวลา' },
      { id: 'v-103', timestamp: '2026-09-06 18:00', sys: 132, dia: 82, pulse: 74, glucose: 140, glucoseType: 'post_meal', temp: 36.6, spo2: 98, respirationRate: 18, status: 'stable', recordedBy: 'กัญญา สุขสม', recorderRole: 'Nurse', notes: 'หลังทานข้าวเย็น พักผ่อนดี' },
      { id: 'v-104', timestamp: '2026-09-06 12:00', sys: 128, dia: 80, pulse: 72, glucose: 132, glucoseType: 'post_meal', temp: 36.5, spo2: 99, respirationRate: 16, status: 'stable', recordedBy: 'กัญญา สุขสม', recorderRole: 'Nurse', notes: 'ปกติ' },
      { id: 'v-105', timestamp: '2026-09-06 08:00', sys: 130, dia: 82, pulse: 75, glucose: 125, glucoseType: 'fasting', temp: 36.6, spo2: 98, respirationRate: 18, status: 'stable', recordedBy: 'ศศิธร พรประสิทธิ์', recorderRole: 'Caregiver', notes: 'เช้าตรู่ นอนหลับเต็มอิ่ม' },
      { id: 'v-106', timestamp: '2026-09-05 18:00', sys: 148, dia: 94, pulse: 88, glucose: 175, glucoseType: 'post_meal', temp: 37.1, spo2: 96, respirationRate: 20, status: 'attention', recordedBy: 'ศศิธร พรประสิทธิ์', recorderRole: 'Caregiver', notes: 'บ่นเวียนศีรษะเล็กน้อย ความดันสูง แจ้งพยาบาลเวร' }
    ],
    dailyLogs: [
      {
        id: 'dl-001',
        patientId: 'p-001',
        date: '2026-09-07',
        mealBreakfast: { type: 'ข้าวต้มปลาแซลมอนบด + นมถั่วเหลืองจืด', amountPercent: 90, notes: 'ทานได้ดี ไม่สำลัก' },
        mealLunch: { type: 'โจ๊กหมูสับเห็ดหอม + ผักต้มบด', amountPercent: 85, notes: 'เจริญอาหาร ทานเกือบหมด' },
        mealDinner: { type: 'ซุปฟักทอง + ไข่ตุ๋นเนื้อนุ่ม', amountPercent: 80, notes: 'ทานพร้อมน้ำอุ่น' },
        waterIntakeMl: 1650,
        bowelMovement: { times: 1, bristolScale: 4, notes: 'อุจจาระนิ่มปกติ ขับถ่ายเวลา 09:15' },
        sleepHours: 7.5,
        sleepQuality: 'good',
        dailyActivities: ['ทำกายภาพกล้ามเนื้อมือ 20 นาที', 'นั่งรับลมที่สวนชั้น 2', 'ฟังเพลงธรรมะ'],
        abnormalSymptoms: ['มีอาการไอเล็กน้อยช่วงตื่นนอน ไม่มีเสมหะ'],
        recordedBy: 'ศศิธร พรประสิทธิ์',
        recordedAt: '2026-09-07 16:30'
      }
    ],
    address: 'บ้านเลขที่ 88/12 ซอยอารีย์สัมพันธ์ 3 พญาไท กรุงเทพฯ 10400',
    gpsCoords: { lat: 13.7745, lng: 100.5367 },
    medicationHistory: [
      {
        id: 'mh-101',
        patientId: 'p-001',
        medicationName: 'Amlodipine (Norvasc)',
        dosage: '5 mg (ปรับเพิ่มจาก 2.5 mg)',
        frequency: 'วันละ 1 ครั้ง หลังอาหารเช้า',
        actionType: 'dosage_changed',
        actionLabel: 'ปรับเพิ่มขนาดยา',
        reason: 'ความดันโลหิตช่วงบ่ายยังสูงเฉลี่ย 145/90 mmHg',
        prescribedBy: 'นพ. วิรัช วงศ์สว่าง',
        effectiveDate: '2026-09-01',
        recordedAt: '2026-09-01 10:30',
        notes: 'ติดตามวัดความดันโลหิตเช้า-เย็น ต่อเนื่อง 1 สัปดาห์'
      },
      {
        id: 'mh-102',
        patientId: 'p-001',
        medicationName: 'Metformin HCl',
        dosage: '500 mg',
        frequency: 'วันละ 2 ครั้ง หลังอาหารเช้า-เย็น',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาใหม่',
        reason: 'ผลตรวจ HbA1c 7.2% และน้ำตาลสะสมสูง',
        prescribedBy: 'พญ. นภาพร สุขเกษม',
        effectiveDate: '2026-08-15',
        recordedAt: '2026-08-15 14:00',
        notes: 'เริ่มทานหลังอาหารทันทีเพื่อลดการระคายเคืองกระเพาะ'
      },
      {
        id: 'mh-103',
        patientId: 'p-001',
        medicationName: 'Hydrochlorothiazide (HCTZ)',
        dosage: '25 mg',
        frequency: 'วันละ 1 ครั้ง เช้า',
        actionType: 'discontinued',
        actionLabel: 'หยุดยาถาวร',
        reason: 'ตรวจพบระดับเกลือแร่โซเดียมในเลือดต่ำ (Mild Hyponatremia)',
        prescribedBy: 'นพ. วิรัช วงศ์สว่าง',
        effectiveDate: '2026-07-20',
        recordedAt: '2026-07-20 11:15',
        notes: 'เปลี่ยนไปควบคุมด้วย Amlodipine เดี่ยว'
      },
      {
        id: 'mh-104',
        patientId: 'p-001',
        medicationName: 'Calcium Carbonate + Vit D3',
        dosage: '1,000 mg',
        frequency: 'วันละ 1 ครั้ง หลังอาหารเย็น',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาเสริม',
        reason: 'ผลตรวจมวลกระดูกพบภาวะกระดูกพรุน (Osteoporosis T-score -2.8)',
        prescribedBy: 'นพ. ธีรเดช เกียรติคุณ',
        effectiveDate: '2026-06-10',
        recordedAt: '2026-06-10 09:45',
        notes: 'ทานพร้อมน้ำอุ่น 1 แก้ว'
      }
    ],
    allergyHistory: [
      {
        id: 'ah-101',
        patientId: 'p-001',
        allergen: 'Penicillin (กลุ่มยาเพนิซิลลิน)',
        category: 'drug',
        severity: 'high',
        symptoms: 'ผื่นลมพิษทั่วตัว แน่นหน้าอก หายใจมีเสียงหวีด',
        identifiedDate: '2024-05-12',
        recordedBy: 'พญ. พิมพา กัลยา',
        status: 'active',
        notes: 'เคยมีประวัติ Anaphylaxis ติดสติกเกอร์แดงเตือนบนเวชระเบียน'
      },
      {
        id: 'ah-102',
        patientId: 'p-001',
        allergen: 'Aspirin (แอสไพริน / NSAIDs)',
        category: 'drug',
        severity: 'medium',
        symptoms: 'ระคายเคืองกระเพาะอาหาร คลื่นไส้ แน่นท้องรุนแรง',
        identifiedDate: '2025-02-18',
        recordedBy: 'นพ. วิรัช วงศ์สว่าง',
        status: 'active',
        notes: 'หลีกเลี่ยงยากลุ่ม NSAIDs ทุกชนิด'
      },
      {
        id: 'ah-103',
        patientId: 'p-001',
        allergen: 'กุ้งทะเล (Shrimp / Crustaceans)',
        category: 'food',
        severity: 'medium',
        symptoms: 'ริมฝีปากบวม คันรอบตา คันคอ',
        identifiedDate: '2023-11-04',
        recordedBy: 'คุณธนพล (บุตรชาย)',
        status: 'active',
        notes: 'แจ้งฝ่ายโภชนาการงดอาหารทะเลที่มีเปลือกแข็งทุกเมนู'
      }
    ],
    caregiverHistory: [
      {
        id: 'ch-101',
        patientId: 'p-001',
        caregiverName: 'ศศิธร พรประสิทธิ์ (Caregiver ศศิ)',
        role: 'พนักงานบริบาลประจำศูนย์ (Nursing Home Care)',
        phone: '081-334-9988',
        startDate: '2026-08-01',
        status: 'current',
        handoverSummary: 'ดูแลประจำ Ward A ห้อง 204 ช่วยเหลือกิจวัตรทั่วไป ฟื้นฟูกายภาพเบาๆ และบันทึกสัญญาณชีพเช้า-เย็น',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      },
      {
        id: 'ch-102',
        patientId: 'p-001',
        caregiverName: 'สุภาพร มั่งมี (Caregiver สุ)',
        role: 'พนักงานบริบาลประจำศูนย์',
        phone: '089-223-4411',
        startDate: '2026-05-01',
        endDate: '2026-07-31',
        status: 'completed',
        handoverSummary: 'ส่งมอบเวรราบรื่น ผู้ป่วยปรับตัวเข้ากับศูนย์ได้ดี ย้ายไปรับผิดชอบผู้ป่วยพักฟื้นผ่าตัด Ward C',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      },
      {
        id: 'ch-103',
        patientId: 'p-001',
        caregiverName: 'นงลักษณ์ เจริญชัย (Caregiver นง)',
        role: 'ผู้ช่วยพยาบาล (PN)',
        phone: '086-554-1122',
        startDate: '2026-01-15',
        endDate: '2026-04-30',
        status: 'completed',
        handoverSummary: 'ดูแลช่วงแรกรับ ส่งต่อเวรเนื่องจากลาคลอดบุตร',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      }
    ],
    auditLogs: [
      {
        id: 'al-101',
        patientId: 'p-001',
        changedAt: '2026-09-06 09:30',
        changedBy: 'นพ. วิรัช วงศ์สว่าง',
        category: 'แผนการดูแลรักษา',
        changes: [
          { field: 'อาหาร', from: 'ทั่วไป', to: 'Low Sodium & Low Glycemic' },
          { field: 'คำแนะนำแพทย์', from: 'เดิม', to: 'เพิ่มกายภาพกล้ามเนื้อขาและควบคุมแป้งไม่เกิน 1,500 kcal' }
        ],
        summary: 'ปรับแผนโภชนาการและคำแนะนำฟื้นฟูกล้ามเนื้อขา'
      },
      {
        id: 'al-102',
        patientId: 'p-001',
        changedAt: '2026-08-20 14:15',
        changedBy: 'รวิวรรณ แสงดาว (Care Manager)',
        category: 'ข้อมูลห้องพัก / อาคาร',
        changes: [
          { field: 'ห้องพัก', from: 'Ward B - Room 102', to: 'Ward A - Room 204' }
        ],
        summary: 'ย้ายห้องพักผู้ป่วยขึ้นชั้น 2 ใกล้สถานีพยาบาล'
      },
      {
        id: 'al-103',
        patientId: 'p-001',
        changedAt: '2026-08-01 08:00',
        changedBy: 'ธนพล รัตนพร (Care Admin)',
        category: 'การมอบหมายผู้ดูแล',
        changes: [
          { field: 'ผู้ดูแลหลัก', from: 'สุภาพร มั่งมี', to: 'ศศิธร พรประสิทธิ์' }
        ],
        summary: 'มอบหมายคุณศศิธรเป็นผู้ดูแลหลักประจำตัว'
      }
    ]
  },
  {
    id: 'p-002',
    hn: 'HN-6701089',
    name: 'Prasert Charoenwong',
    thaiName: 'คุณตาประเสริฐ เจริญวงศ์',
    gender: 'male',
    age: 83,
    birthDate: '1943-08-20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    roomBed: 'Home Care (บ้านพักผู้ป่วย)',
    careType: 'home_care',
    serviceStatus: 'active',
    serviceStartDate: '2026-05-10',
    primaryCaregiverName: 'มนัสวี ดีพร้อม (Caregiver มินต์)',
    primaryDoctorName: 'พญ. พิมพ์ใจ กุลพงษ์ (ระบบประสาทและสมอง)',
    primaryHospital: 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
    chronicDiseases: ['โรคหลอดเลือดสมองตีบ (Ischemic Stroke)', 'อัลไซเมอร์ระยะแรก (Mild Alzheimer)', 'ต่อมลูกหมากโต (BPH)'],
    drugAllergies: ['Sulfa (แพ้ผื่นลมพิษ)'],
    foodAllergies: ['นมวัว (Lactose Intolerant)'],
    emergencyContact: {
      name: 'คุณณัฐญา เจริญวงศ์ (บุตรสาว)',
      relationship: 'บุตรสาว (Daughter)',
      phone: '089-765-4321'
    },
    healthStatus: 'attention',
    statusNotes: 'ผู้ป่วยติดเตียงช่วยเหลือตัวเองได้น้อย เฝ้าระวังแผลกดทับและเสมหะอุดกั้น',
    carePlan: {
      id: 'cp-002',
      patientId: 'p-002',
      updatedAt: '2026-09-05 14:00',
      doctorRecommendations: [
        'พลิกตะแคงตัวทุก 2 ชั่วโมงอย่างเคร่งครัด',
        'ดูดเสมหะเมื่อมีเสียงครืดคราด หรือก่อนป้อนอาหาร',
        'ให้อาหารเหลวทางสายยาง (NG Tube) ตามสูตรแพทย์กำหนด 4 มื้อ/วัน',
        'ทำกายภาพ passive range of motion แขนขา 2 ครั้ง/วัน'
      ],
      guidelines: [
        'สังเกตสีผิวบริเวณปุ่มกระดูก ก้นกบ สะโพก ป้องกันแผลกดทับ',
        'ยกหัวเตียงสูง 45 องศา ระหว่างให้อาหารและหลังให้ 1 ชม.',
        'เช็ดตัวและดูแลสุขอนามัยช่องปากเช้า-เย็น'
      ],
      medications: [
        {
          id: 'med-201',
          name: 'Clopidogrel (Plavix)',
          dosage: '75 mg',
          frequency: 'วันละ 1 ครั้ง หลังอาหารเช้า',
          timing: ['morning', 'after_meal'],
          instructions: 'ยาต้านเกล็ดเลือด บดละเอียดผสมน้ำทางสายยาง',
          prescribedBy: 'พญ. พิมพ์ใจ'
        },
        {
          id: 'med-202',
          name: 'Donepezil (Aricept)',
          dosage: '10 mg',
          frequency: 'วันละ 1 ครั้ง ก่อนนอน',
          timing: ['bedtime'],
          instructions: 'ชะลอการเสื่อมของสมอง',
          prescribedBy: 'พญ. พิมพ์ใจ'
        }
      ],
      recommendedActivities: ['ดัดข้อต่อแขนขา ป้องกันข้อยึดติด', 'เปิดเพลงเบาๆ กระตุ้นการรับรู้', 'นวดผ่อนคลายกล้ามเนื้อ'],
      restrictedActivities: ['ห้ามให้อาหารขณะผู้ป่วยนอนราบ', 'ห้ามปล่อยให้ผิวหนังอับชื้น'],
      precautions: [
        { id: 'al-201', type: 'bedridden', label: 'ผู้ป่วยติดเตียง (Bedridden Stage 3)', severity: 'high', details: 'ต้องการการดูแลพลิกตัวทุก 2 ชม. และฟื้นฟูกายภาพบำบัด', icon: 'Bed' },
        { id: 'al-202', type: 'dementia', label: 'ภาวะสับสน / อัลไซเมอร์ (Dementia)', severity: 'medium', details: 'อาจมีอาการสับสนช่วงพลบค่ำ (Sundowning syndrome)', icon: 'Brain' },
        { id: 'al-203', type: 'drug_allergy', label: 'แพ้ยากลุ่ม Sulfa', severity: 'high', details: 'ห้ามใช้ยาปฏิชีวนะกลุ่มซัลฟา', icon: 'Pill' }
      ],
      riskAssessment: {
        fallRiskScore: 10,
        bedriddenScale: 'bedridden',
        dietaryRestrictions: ['Blended Tube Feed Diet (อาหารปั่นผสมทางสายยาง)', 'Lactose Free (ปราศจากนมวัว)']
      }
    },
    vitalsHistory: [
      { id: 'v-201', timestamp: '2026-09-07 15:00', sys: 124, dia: 78, pulse: 70, temp: 37.4, spo2: 95, respirationRate: 22, status: 'attention', recordedBy: 'มนัสวี ดีพร้อม', recorderRole: 'Caregiver', notes: 'มีไข้ต่ำๆ และมีเสมหะเหนียวเล็กน้อย ดูดเสมหะแล้ว SpO2 ดีขึ้น' },
      { id: 'v-202', timestamp: '2026-09-07 09:00', sys: 120, dia: 76, pulse: 68, temp: 36.9, spo2: 96, respirationRate: 18, status: 'stable', recordedBy: 'มนัสวี ดีพร้อม', recorderRole: 'Caregiver', notes: 'ให้อาหารสายยางมื้อเช้า ย่อยได้ดี' },
      { id: 'v-203', timestamp: '2026-09-06 17:00', sys: 122, dia: 75, pulse: 72, temp: 36.7, spo2: 97, respirationRate: 18, status: 'stable', recordedBy: 'มนัสวี ดีพร้อม', recorderRole: 'Caregiver', notes: 'ทำกายภาพช่วงบ่าย ไม่มีบวม' }
    ],
    dailyLogs: [
      {
        id: 'dl-002',
        patientId: 'p-002',
        date: '2026-09-07',
        mealBreakfast: { type: 'อาหารปั่นผสมสูตรเบาหวาน 350 ml ทางสายยาง', amountPercent: 100, notes: 'ไม่มี residue ตกค้าง' },
        mealLunch: { type: 'อาหารปั่นผสมสูตรเบาหวาน 350 ml ทางสายยาง', amountPercent: 100, notes: 'ให้ช้าๆ 45 นาที' },
        mealDinner: { type: 'อาหารปั่นผสมสูตรเบาหวาน 350 ml ทางสายยาง', amountPercent: 100, notes: 'ล้างสายยางด้วยน้ำต้มสุก 50 ml' },
        waterIntakeMl: 1400,
        bowelMovement: { times: 1, bristolScale: 5, notes: 'ขับถ่ายบนเตียง เปลี่ยนแผ่นรองซับและทำความสะอาดเรียบร้อย' },
        sleepHours: 8,
        sleepQuality: 'fair',
        dailyActivities: ['พลิกตัวทุก 2 ชั่วโมง (ซ้าย-หงาย-ขวา)', 'กายภาพบำบัดขยับข้อต่อ 30 นาที', 'ดูดเสมหะ 3 ครั้ง'],
        abnormalSymptoms: ['มีเสมหะเหนียวสีขาวขุ่น อุณหภูมิ 37.4 C'],
        recordedBy: 'มนัสวี ดีพร้อม',
        recordedAt: '2026-09-07 17:00'
      }
    ],
    address: 'บ้านเลขที่ 154/9 หมู่บ้านปัญญารามอินทรา คันนายาว กรุงเทพฯ 10230',
    gpsCoords: { lat: 13.8291, lng: 100.6782 },
    medicationHistory: [
      {
        id: 'mh-201',
        patientId: 'p-002',
        medicationName: 'Clopidogrel (Plavix)',
        dosage: '75 mg',
        frequency: 'วันละ 1 ครั้ง หลังอาหารเช้า',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาต่อเนื่อง',
        reason: 'ป้องกันการกลับเป็นซ้ำของโรคหลอดเลือดสมองตีบ (Secondary Stroke Prevention)',
        prescribedBy: 'พญ. พิมพ์ใจ กุลพงษ์',
        effectiveDate: '2026-05-10',
        recordedAt: '2026-05-10 11:00',
        notes: 'บดผสมน้ำให้ทางสาย NG Tube'
      },
      {
        id: 'mh-202',
        patientId: 'p-002',
        medicationName: 'Donepezil (Aricept)',
        dosage: '10 mg (ปรับเพิ่มจาก 5 mg)',
        frequency: 'วันละ 1 ครั้ง ก่อนนอน',
        actionType: 'dosage_changed',
        actionLabel: 'ปรับเพิ่มขนาดยา',
        reason: 'ชะลอการถดถอยของการรับรู้และสมองเสื่อม',
        prescribedBy: 'พญ. พิมพ์ใจ กุลพงษ์',
        effectiveDate: '2026-07-01',
        recordedAt: '2026-07-01 15:30',
        notes: 'ติดตามภาวะคลื่นไส้หรือหัวใจเต้นช้า'
      },
      {
        id: 'mh-203',
        patientId: 'p-002',
        medicationName: 'Piracetam (Nootropil)',
        dosage: '800 mg',
        frequency: 'วันละ 2 ครั้ง เช้า-เย็น',
        actionType: 'discontinued',
        actionLabel: 'หยุดยา',
        reason: 'ครบระยะฟื้นฟูระบบประสาทระยะเฉียบพลัน และเปลี่ยนมาใช้ Donepezil แทน',
        prescribedBy: 'พญ. พิมพ์ใจ กุลพงษ์',
        effectiveDate: '2026-06-30',
        recordedAt: '2026-06-30 16:00',
        notes: 'ไม่มีผลข้างเคียงจากการหยุดยา'
      }
    ],
    allergyHistory: [
      {
        id: 'ah-201',
        patientId: 'p-002',
        allergen: 'Sulfonamides (ยากลุ่มซัลฟา เช่น Bactrim)',
        category: 'drug',
        severity: 'high',
        symptoms: 'ผื่นลมพิษ บวมรอบตาและริมฝีปาก แน่นหน้าอก',
        identifiedDate: '2022-08-14',
        recordedBy: 'พญ. พิมพ์ใจ กุลพงษ์',
        status: 'active',
        notes: 'ห้ามจ่ายยาปฏิชีวนะกลุ่มซัลฟาทุกชนิด'
      },
      {
        id: 'ah-202',
        patientId: 'p-002',
        allergen: 'นมวัว / แลคโตส (Cow Milk / Lactose)',
        category: 'food',
        severity: 'medium',
        symptoms: 'ท้องอืด ท้องเสีย ถ่ายเหลว มีแก๊สในกระเพาะอาหารมาก',
        identifiedDate: '2024-01-20',
        recordedBy: 'คุณณัฐญา (บุตรสาว)',
        status: 'active',
        notes: 'ใช้อาหารปั่นผสมสูตร Lactose-Free ปราศจากนมวัว'
      }
    ],
    caregiverHistory: [
      {
        id: 'ch-201',
        patientId: 'p-002',
        caregiverName: 'มนัสวี ดีพร้อม (Caregiver มินต์)',
        role: 'ผู้ช่วยพยาบาลดูแลผู้ป่วยที่บ้าน (Home Care Live-in)',
        phone: '084-776-5544',
        startDate: '2026-06-01',
        status: 'current',
        handoverSummary: 'ดูแลประจำบ้านพักผู้ป่วย 24 ชั่วโมง พลิกตัวทุก 2 ชม. ให้อาหารทางสายยาง ดูดเสมหะ และกายภาพข้อต่อ',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      },
      {
        id: 'ch-202',
        patientId: 'p-002',
        caregiverName: 'ธนสาร พูนสุข (Caregiver ท็อป)',
        role: 'พนักงานบริบาลดูแลผู้ป่วยที่บ้าน (Home Care Part-time)',
        phone: '082-113-7788',
        startDate: '2026-05-10',
        endDate: '2026-05-31',
        status: 'completed',
        handoverSummary: 'ดูแลช่วงเปลี่ยนผ่านหลังออกจากโรงพยาบาล ก่อนส่งมอบให้คุณมนัสวีดูแลระยะยาว',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      }
    ],
    auditLogs: [
      {
        id: 'al-201',
        patientId: 'p-002',
        changedAt: '2026-09-05 14:00',
        changedBy: 'รวิวรรณ แสงดาว (Care Manager)',
        category: 'แผนการพยาบาล',
        changes: [
          { field: 'การพลิกตัว', from: 'ทุก 3 ชม.', to: 'ทุก 2 ชม. อย่างเคร่งครัด' },
          { field: 'การดูดเสมหะ', from: 'ตามอาการ', to: 'ดูดก่อนมื้ออาหารและก่อนนอน' }
        ],
        summary: 'ยกระดับการเฝ้าระวังแผลกดทับและทางเดินหายใจ'
      },
      {
        id: 'al-202',
        patientId: 'p-002',
        changedAt: '2026-06-01 08:30',
        changedBy: 'ธนพล รัตนพร (Care Admin)',
        category: 'การมอบหมายผู้ดูแล',
        changes: [
          { field: 'ผู้ดูแลหลัก', from: 'ธนสาร พูนสุข', to: 'มนัสวี ดีพร้อม (Caregiver มินต์)' },
          { field: 'รูปแบบการดูแล', from: 'Part-time', to: 'Live-in ประจำบ้าน' }
        ],
        summary: 'เริ่มสัญญาการดูแลที่บ้านแบบพักอาศัยประจำ (Live-in Care)'
      }
    ]
  },
  {
    id: 'p-003',
    hn: 'HN-6701124',
    name: 'Wanna Siriporn',
    thaiName: 'คุณยายวรรณา ศิริพร',
    gender: 'female',
    age: 72,
    birthDate: '1954-11-05',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    roomBed: 'Ward B - Room 102 (Discharged)',
    careType: 'nursing_home',
    serviceStatus: 'discharged',
    inactiveReason: 'อาการฟื้นฟูหลังผ่าตัดข้อเข่าดีขึ้นมาก สามารถเดินด้วย Walker ได้คล่องตัวและกลับไปพักฟื้นที่บ้านตามคำแนะนำแพทย์',
    inactiveDate: '2026-09-06',
    serviceStartDate: '2026-06-10',
    primaryCaregiverName: 'อรุณี พ่วงแพ (Caregiver อร)',
    primaryDoctorName: 'นพ. อนุชา เลิศพิพัฒน์ (ออร์โธปิดิกส์)',
    primaryHospital: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    chronicDiseases: ['ผ่าตัดเปลี่ยนข้อเข่าเทียมข้างขวา (Post Total Knee Arthroplasty)', 'ไขมันในเลือดสูง (Dyslipidemia)'],
    drugAllergies: ['ไม่มีประวัติแพ้ยา (NKDA)'],
    foodAllergies: ['ไม่มีประวัติแพ้อาหาร'],
    emergencyContact: {
      name: 'คุณพัชรี ศิริพร (บุตรสาว)',
      relationship: 'บุตรสาว (Daughter)',
      phone: '085-112-9988'
    },
    healthStatus: 'stable',
    statusNotes: 'ฟื้นฟูกล้ามเนื้อหลังผ่าตัดเข่าได้ดี เดินด้วย Walker ได้คล่องตัว สภาพจิตใจแจ่มใส',
    carePlan: {
      id: 'cp-003',
      patientId: 'p-003',
      updatedAt: '2026-09-07 10:00',
      doctorRecommendations: [
        'ฝึกเดินลงน้ำหนักด้วย Walker วันละ 2 รอบ รอบละ 15-20 นาที',
        'ประคบเย็นรอบข้อเข่าหลังฝึกกายภาพบำบัด 15 นาที',
        'ตรวจเช็คแผลผ่าตัดข้อเข่า ห้ามแผลโดนน้ำโดยตรง'
      ],
      guidelines: [
        'สวมใส่รองเท้ากันลื่นทุกครั้งเมื่อลุกเดิน',
        'รับประทานอาหารที่มีโปรตีนและแคลเซียมสูงเสริมสร้างกล้ามเนื้อ'
      ],
      medications: [
        {
          id: 'med-301',
          name: 'Atorvastatin',
          dosage: '20 mg',
          frequency: 'วันละ 1 ครั้ง ก่อนนอน',
          timing: ['bedtime'],
          instructions: 'ลดไขมันในเลือด',
          prescribedBy: 'นพ. อนุชา'
        },
        {
          id: 'med-302',
          name: 'Paracetamol',
          dosage: '500 mg',
          frequency: 'ทาน 1 เม็ด เมื่อมีอาการปวดข้อเข่า ทุก 6 ชม.',
          timing: ['after_meal'],
          instructions: 'บรรเทาอาการปวดเฉพาะเวลาจำเป็น',
          prescribedBy: 'นพ. อนุชา'
        }
      ],
      recommendedActivities: ['ฝึกเหยียด-งอข้อเข่าบนเตียง (Quad Set)', 'นั่งเก้าอี้เตะขา (Seated Leg Raise)', 'ทำสวนบำบัดปลูกต้นไม้กระถาง'],
      restrictedActivities: ['ห้ามนั่งยอง นั่งพับเพียบ หรือนั่งขัดสมาธิ', 'ห้ามบิดหมุนเข่ารุนแรง'],
      precautions: [
        { id: 'al-301', type: 'fall_risk', label: 'ความเสี่ยงหกล้มระหว่างฟื้นฟูข้อเข่า', severity: 'medium', details: 'ต้องใช้ Walker และมีผู้ดูแลประกบข้างเสมอ', icon: 'AlertTriangle' }
      ],
      riskAssessment: {
        fallRiskScore: 5,
        bedriddenScale: 'ambulatory',
        dietaryRestrictions: ['High Protein (โปรตีนเสริมฟื้นฟู)', 'Low Fat (ลดไขมันอิ่มตัว)']
      }
    },
    vitalsHistory: [
      { id: 'v-301', timestamp: '2026-09-07 11:30', sys: 118, dia: 75, pulse: 74, temp: 36.5, spo2: 99, respirationRate: 16, status: 'stable', recordedBy: 'อรุณี พ่วงแพ', recorderRole: 'Caregiver', notes: 'หลังกายภาพเดิน Walker 15 นาที ชีพจรปกติ ไม่เหนื่อย' },
      { id: 'v-302', timestamp: '2026-09-07 07:30', sys: 120, dia: 76, pulse: 72, temp: 36.4, spo2: 99, respirationRate: 16, status: 'stable', recordedBy: 'อรุณี พ่วงแพ', recorderRole: 'Caregiver', notes: 'เช้าตรู่ สดชื่นดี' }
    ],
    dailyLogs: [
      {
        id: 'dl-003',
        patientId: 'p-003',
        date: '2026-09-07',
        mealBreakfast: { type: 'แซนด์วิชไข่ต้มอกไก่ + นมสดไขมันต่ำ', amountPercent: 100, notes: 'ทานหมด ทานน้ำผลไม้ 1 แก้ว' },
        mealLunch: { type: 'ก๋วยเตี๋ยวปลาน้ำใสผักรวม', amountPercent: 95, notes: 'อร่อย ทานได้ดี' },
        mealDinner: { type: 'ข้าวกล้อง + ต้มจืดเต้าหู้หมูสับสาหร่าย', amountPercent: 90, notes: 'ทานพร้อมผลไม้มะละกอสุก' },
        waterIntakeMl: 1900,
        bowelMovement: { times: 1, bristolScale: 4, notes: 'ปกติ เข้าห้องน้ำเองโดยมีผู้ดูแลช่วยประคอง' },
        sleepHours: 8.5,
        sleepQuality: 'good',
        dailyActivities: ['ฝึกเดิน Walker 20 นาที', 'กายภาพบำบัดกับนักกายภาพ', 'วาดรูประบายสี'],
        abnormalSymptoms: [],
        recordedBy: 'อรุณี พ่วงแพ',
        recordedAt: '2026-09-07 16:00'
      }
    ],
    address: 'ศูนย์เนอร์สซิ่งโฮม อาคารแคร์เวล ชั้น 2 ห้อง 102',
    gpsCoords: { lat: 13.7563, lng: 100.5018 },
    medicationHistory: [
      {
        id: 'mh-301',
        patientId: 'p-003',
        medicationName: 'Atorvastatin',
        dosage: '20 mg',
        frequency: 'วันละ 1 ครั้ง ก่อนนอน',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาต่อเนื่อง',
        reason: 'ควบคุมระดับคอเลสเตอรอลในเลือด',
        prescribedBy: 'นพ. อนุชา เลิศพิพัฒน์',
        effectiveDate: '2026-06-15',
        recordedAt: '2026-06-15 10:00',
        notes: 'ทานก่อนนอนเป็นประจำ'
      },
      {
        id: 'mh-302',
        patientId: 'p-003',
        medicationName: 'Paracetamol',
        dosage: '500 mg',
        frequency: 'ทาน 1 เม็ด เมื่อปวดข้อเข่า ทุก 6 ชม.',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาเฉพาะเวลาจำเป็น',
        reason: 'บรรเทาอาการปวดตึงข้อเข่าหลังทำกายภาพบำบัด',
        prescribedBy: 'นพ. อนุชา เลิศพิพัฒน์',
        effectiveDate: '2026-09-01',
        recordedAt: '2026-09-01 11:30',
        notes: 'ให้ทานเฉพาะเมื่อมีอาการปวดเกิน 4/10'
      },
      {
        id: 'mh-303',
        patientId: 'p-003',
        medicationName: 'Celecoxib (Celebrex)',
        dosage: '200 mg',
        frequency: 'วันละ 1 ครั้ง หลังอาหารเช้า',
        actionType: 'discontinued',
        actionLabel: 'หยุดยา',
        reason: 'อาการอักเสบเฉียบพลันของแผลผ่าตัดข้อเข่าทุเลาลงแล้ว',
        prescribedBy: 'นพ. อนุชา เลิศพิพัฒน์',
        effectiveDate: '2026-08-30',
        recordedAt: '2026-08-30 09:00',
        notes: 'เปลี่ยนมาใช้ Paracetamol เฉพาะเวลาจำเป็นแทน เพื่อถนอมไตและกระเพาะ'
      }
    ],
    allergyHistory: [
      {
        id: 'ah-301',
        patientId: 'p-003',
        allergen: 'ไม่มีประวัติแพ้ยาหรือสารเคมี (NKDA)',
        category: 'drug',
        severity: 'low',
        symptoms: 'ไม่มี',
        identifiedDate: '2026-06-10',
        recordedBy: 'พยาบาลแรกรับ สุภาพร',
        status: 'active',
        notes: 'ซักประวัติแรกรับเข้าพักฟื้นศูนย์เนอร์สซิ่งโฮม ไม่พบประวัติแพ้'
      }
    ],
    caregiverHistory: [
      {
        id: 'ch-301',
        patientId: 'p-003',
        caregiverName: 'อรุณี พ่วงแพ (Caregiver อร)',
        role: 'พนักงานบริบาลประจำศูนย์ (Nursing Home Care)',
        phone: '083-445-6677',
        startDate: '2026-08-15',
        status: 'current',
        handoverSummary: 'ดูแลประจำห้อง 102 พาฝึกเดิน Walker วันละ 2 รอบ และช่วยประคบเย็นข้อเข่า',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      }
    ],
    auditLogs: [
      {
        id: 'al-301',
        patientId: 'p-003',
        changedAt: '2026-09-07 10:00',
        changedBy: 'นพ. อนุชา เลิศพิพัฒน์',
        category: 'แผนกายภาพบำบัด',
        changes: [
          { field: 'การเดิน', from: 'ฝึกยืนทรงตัว', to: 'เดินลงน้ำหนักด้วย Walker 15-20 นาที' }
        ],
        summary: 'เพิ่มโปรแกรมฝึกเดิน Walker และประคบเย็นหลังฝึก'
      }
    ]
  },
  {
    id: 'p-004',
    hn: 'HN-6701155',
    name: 'Vinai Sukkasem',
    thaiName: 'คุณตาวินัย สุขเกษม',
    gender: 'male',
    age: 80,
    birthDate: '1946-04-18',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    roomBed: 'Ward A - Room 201 (Suspended)',
    careType: 'nursing_home',
    serviceStatus: 'suspended',
    inactiveReason: 'ผู้ป่วยเดินทางไปพักผ่อนต่างจังหวัดกับครอบครัวชั่วคราว 2 สัปดาห์ (กำหนดกลับเข้าศูนย์ 20 ก.ย.)',
    inactiveDate: '2026-09-02',
    serviceStartDate: '2026-03-01',
    primaryCaregiverName: 'กานดา รัตนกุล (Caregiver กานต์)',
    primaryDoctorName: 'นพ. เกรียงไกร สมบูรณ์ (ระบบทางเดินหายใจ)',
    primaryHospital: 'โรงพยาบาลพระมงกุฎเกล้า',
    chronicDiseases: ['โรคปอดอุดกั้นเรื้อรัง (COPD)', 'ความดันโลหิตสูง (HT)'],
    drugAllergies: ['ไม่มีประวัติแพ้ยา'],
    foodAllergies: ['อาหารรสจัด'],
    emergencyContact: {
      name: 'คุณวิชัย สุขเกษม (บุตรชาย)',
      relationship: 'บุตรชาย (Son)',
      phone: '081-334-5566'
    },
    healthStatus: 'stable',
    statusNotes: 'อาการคงที่ ปอดเสียงใส อัตราหายใจสม่ำเสมอ พ่นยาตรงเวลา',
    carePlan: {
      id: 'cp-004',
      patientId: 'p-004',
      updatedAt: '2026-09-06 11:00',
      doctorRecommendations: [
        'พ่นยาขยายหลอดลมเช้า-เย็น และเคาะปอดระบายเสมหะ',
        'ควบคุมออกซิเจนในเลือด SpO2 ไม่ต่ำกว่า 95%',
        'จิบน้ำอุ่นสม่ำเสมอตลอดวัน'
      ],
      guidelines: [
        'หลีกเลี่ยงฝุ่นควันและอากาศเย็นจัด',
        'ประเมินเสียงหายใจก่อนและหลังพ่นยา'
      ],
      medications: [
        {
          id: 'med-401',
          name: 'Symbicort Turbuhaler',
          dosage: '160/4.5 mcg',
          frequency: 'สูดพ่นเช้า-เย็น ครั้งละ 1 สูด',
          timing: ['morning', 'evening'],
          instructions: 'บ้วนปากทุกครั้งหลังพ่นยา',
          prescribedBy: 'นพ. เกรียงไกร'
        }
      ],
      recommendedActivities: ['ฝึกหายใจลึกชะลอจังหวะ (Pursed-lip Breathing)', 'ยืดเหยียดเบาๆ บนเตียง'],
      restrictedActivities: ['ห้ามออกแรงหนัก ห้ามสัมผัสควันธูปหรือควันบุหรี่'],
      precautions: [
        { id: 'al-401', type: 'other', label: 'โรคปอด COPD เฝ้าระวังอาการหอบเหนื่อย', severity: 'medium', details: 'หาก SpO2 ต่ำกว่า 92% ให้ให้ออกซิเจน cannula ทันที', icon: 'Activity' }
      ],
      riskAssessment: {
        fallRiskScore: 4,
        bedriddenScale: 'ambulatory',
        dietaryRestrictions: ['Low Sodium', 'Warm Fluids Preferred']
      }
    },
    vitalsHistory: [
      { id: 'v-401', timestamp: '2026-09-07 15:30', sys: 126, dia: 80, pulse: 78, temp: 36.6, spo2: 97, respirationRate: 18, status: 'stable', recordedBy: 'กานดา รัตนกุล', recorderRole: 'Caregiver', notes: 'หลังพ่นยา อาการหอบเหนื่อยไม่มี หายใจโล่ง' },
      { id: 'v-402', timestamp: '2026-09-07 08:00', sys: 130, dia: 82, pulse: 80, temp: 36.5, spo2: 96, respirationRate: 19, status: 'stable', recordedBy: 'กานดา รัตนกุล', recorderRole: 'Caregiver', notes: 'เช้าปกติ' }
    ],
    dailyLogs: [],
    address: 'ศูนย์เนอร์สซิ่งโฮม อาคารแคร์เวล ชั้น 2 ห้อง 201',
    gpsCoords: { lat: 13.7565, lng: 100.5020 }
  },
  {
    id: 'p-005',
    hn: 'HN-6701201',
    name: 'Kamala Wongpanich',
    thaiName: 'คุณยายกมลา วงศ์พานิช',
    gender: 'female',
    age: 76,
    birthDate: '1950-02-14',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    roomBed: 'ผู้ป่วยนอก (บริการพาพบแพทย์ Escort)',
    careType: 'medical_escort',
    serviceStatus: 'active',
    serviceStartDate: '2026-04-18',
    primaryCaregiverName: 'ธีรเดช มั่นคง (Escort บาส)',
    primaryDoctorName: 'นพ. วิรัช วงศ์สว่าง (อายุรกรรมหัวใจ)',
    primaryHospital: 'โรงพยาบาลกรุงเทพคริสเตียน',
    chronicDiseases: ['ภาวะหัวใจเต้นผิดจังหวะ (Atrial Fibrillation)', 'ไขมันในเลือดสูง'],
    drugAllergies: ['Aspirin (ผื่นคัน ปวดท้อง)'],
    foodAllergies: ['ไม่มีประวัติแพ้อาหาร'],
    emergencyContact: {
      name: 'คุณศิริชัย วงศ์พานิช (บุตรชาย)',
      relationship: 'บุตรชาย (Son)',
      phone: '081-889-4455'
    },
    healthStatus: 'stable',
    statusNotes: 'มีนัดตรวจคลื่นไฟฟ้าหัวใจ EKG และรับยาวันที่ 8 ก.ย. บริการ Escort จัดเตรียมรถเข็นและเอกสารพร้อม',
    carePlan: {
      id: 'cp-005',
      patientId: 'p-005',
      updatedAt: '2026-09-07 09:00',
      doctorRecommendations: [
        'ตรวจเช็คผลเลือดค่าการแข็งตัวของเลือด INR ทุก 3 เดือน',
        'ทานยาต้านการแข็งตัวของเลือด Warfarin ตรงเวลาเป๊ะ',
        'สังเกตรอยช้ำหรือเลือดออกผิดปกติ'
      ],
      guidelines: [
        'ใช้บริการรถรับส่งและ Escort เจ้าหน้าที่ช่วยเข็นรถเข็นใน รพ.',
        'เตรียมผลตรวจและยาเดิมไปพบแพทย์ทุกครั้ง'
      ],
      medications: [
        {
          id: 'med-501',
          name: 'Warfarin Sodium',
          dosage: '3 mg',
          frequency: 'วันละ 1 เม็ด เวลา 18:00 น.',
          timing: ['evening'],
          instructions: 'ทานเวลาเดิมทุกวัน สม่ำเสมอ',
          prescribedBy: 'นพ. วิรัช'
        }
      ],
      recommendedActivities: ['เดินแกว่งแขนเบาๆ ในบ้าน 15 นาที'],
      restrictedActivities: ['ห้ามทานผักใบเขียวเข้มปริมาณมากเกินไป (มีผลต่อ INR)', 'ระวังการกระแทกฟกช้ำ'],
      precautions: [
        { id: 'al-501', type: 'drug_allergy', label: 'ยาต้านการแข็งตัวของเลือด Warfarin', severity: 'high', details: 'ระวังเลือดหยุดยาก แจ้งแพทย์/ทันตแพทย์ทุกครั้ง', icon: 'Pill' }
      ],
      riskAssessment: {
        fallRiskScore: 5,
        bedriddenScale: 'ambulatory',
        dietaryRestrictions: ['Consistent Vitamin K Diet', 'Low Sodium']
      }
    },
    vitalsHistory: [
      { id: 'v-501', timestamp: '2026-09-07 08:30', sys: 128, dia: 82, pulse: 74, temp: 36.6, spo2: 98, status: 'stable', recordedBy: 'ธีรเดช มั่นคง', recorderRole: 'Medical Escort', notes: 'สัญญาณชีพก่อนนัดหมายปกติ พร้อมเดินทางพบแพทย์' }
    ],
    dailyLogs: [],
    address: 'บ้านเลขที่ 22/5 ซอยสุขุมวิท 39 แขวงคลองตันเหนือ วัฒนา กรุงเทพฯ 10110',
    gpsCoords: { lat: 13.7382, lng: 100.5734 },
    medicationHistory: [
      {
        id: 'mh-501',
        patientId: 'p-005',
        medicationName: 'Warfarin Sodium',
        dosage: '3 mg (ปรับลดจาก 4 mg)',
        frequency: 'วันละ 1 เม็ด เวลา 18:00 น.',
        actionType: 'dosage_changed',
        actionLabel: 'ปรับลดขนาดยา',
        reason: 'ผลตรวจเลือด INR ครั้งก่อนอยู่ที่ 3.4 (เป้าหมาย 2.0 - 3.0)',
        prescribedBy: 'นพ. วิรัช วงศ์สว่าง',
        effectiveDate: '2026-08-20',
        recordedAt: '2026-08-20 11:30',
        notes: 'นัดตรวจเลือดซ้ำ 8 ก.ย. และพกบัตรประจำตัวผู้ใช้ยาวาร์ฟารินเสมอ'
      },
      {
        id: 'mh-502',
        patientId: 'p-005',
        medicationName: 'Simvastatin',
        dosage: '20 mg',
        frequency: 'วันละ 1 เม็ด ก่อนนอน',
        actionType: 'prescribed',
        actionLabel: 'สั่งจ่ายยาต่อเนื่อง',
        reason: 'ควบคุมระดับไขมันในกระแสเลือด',
        prescribedBy: 'นพ. วิรัช วงศ์สว่าง',
        effectiveDate: '2026-05-12',
        recordedAt: '2026-05-12 10:00',
        notes: 'หลีกเลี่ยงการดื่มน้ำเกรปฟรุต'
      }
    ],
    allergyHistory: [
      {
        id: 'ah-501',
        patientId: 'p-005',
        allergen: 'Aspirin & NSAIDs (แอสไพรินและยาแก้ปวดกลุ่มเอ็นเสด)',
        category: 'drug',
        severity: 'high',
        symptoms: 'ผื่นคัน ปวดแสบท้อง เลือดออกในทางเดินอาหาร',
        identifiedDate: '2023-04-10',
        recordedBy: 'นพ. วิรัช วงศ์สว่าง',
        status: 'active',
        notes: 'ห้ามใช้เด็ดขาด โดยเฉพาะอย่างยิ่งร่วมกับ Warfarin'
      }
    ],
    caregiverHistory: [
      {
        id: 'ch-501',
        patientId: 'p-005',
        caregiverName: 'ธีรเดช มั่นคง (Escort บาส)',
        role: 'พนักงานพาพบแพทย์ (Medical Escort)',
        phone: '085-332-1100',
        startDate: '2026-09-01',
        status: 'current',
        handoverSummary: 'รับหน้าที่พาไปพบแพทย์ รพ.กรุงเทพคริสเตียน วันที่ 8 ก.ย. เตรียมรถเข็นและดูแลเอกสารส่งตัว',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      },
      {
        id: 'ch-502',
        patientId: 'p-005',
        caregiverName: 'กานดา ชัยชนะ (Escort เมย์)',
        role: 'พนักงานพาพบแพทย์ (Medical Escort)',
        phone: '081-998-3322',
        startDate: '2026-06-15',
        endDate: '2026-08-20',
        status: 'completed',
        handoverSummary: 'พาพบแพทย์ตรวจหัวใจ EKG 2 ครั้ง บริการเรียบร้อย ปลอดภัย ญาติพึงพอใจ 5 ดาว',
        assignedBy: 'รวิวรรณ แสงดาว (Care Manager)'
      }
    ],
    auditLogs: [
      {
        id: 'al-501',
        patientId: 'p-005',
        changedAt: '2026-09-07 09:00',
        changedBy: 'ธีรเดช มั่นคง (Escort บาส)',
        category: 'การเตรียมนัดหมายแพทย์',
        changes: [
          { field: 'สถานะนัดหมาย', from: 'รอยืนยัน', to: 'ยืนยันคิวตรวจ EKG วันที่ 8 ก.ย.' }
        ],
        summary: 'ตรวจสอบเอกสารการส่งตัวและเตรียมรถเข็นสำหรับวันนัดหมาย'
      }
    ]
  },
  {
    id: 'p-006',
    hn: 'HN-6701244',
    name: 'Somjit Sriprasert',
    thaiName: 'คุณตาสมจิตร์ ศรีประเสริฐ',
    gender: 'male',
    age: 81,
    birthDate: '1945-08-10',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    roomBed: 'ผู้ป่วยนอก (Inactive - ส่งตัวต่อ รพ.)',
    careType: 'medical_escort',
    serviceStatus: 'inactive',
    inactiveReason: 'ย้ายไปรับการผ่าตัดต่อมลูกหมากและรักษาเฉพาะทางต่อที่โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
    inactiveDate: '2026-08-25',
    serviceStartDate: '2026-02-10',
    primaryCaregiverName: 'กานดา ชัยชนะ (Escort เมย์)',
    primaryDoctorName: 'พญ. ชิดชนก สว่างอารมณ์ (ระบบทางเดินปัสสาวะ)',
    primaryHospital: 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
    chronicDiseases: ['ต่อมลูกหมากโต (BPH)', 'เบาหวานชนิดที่ 2', 'ความดันโลหิตสูง'],
    drugAllergies: ['Sulfa (ผื่นลมพิษ)'],
    foodAllergies: ['ไม่มีประวัติแพ้อาหาร'],
    emergencyContact: {
      name: 'คุณวราภรณ์ ศรีประเสริฐ (บุตรสาว)',
      relationship: 'บุตรสาว (Daughter)',
      phone: '089-665-2233'
    },
    healthStatus: 'monitor',
    statusNotes: 'มีนัดตรวจอัลตราซาวด์ระบบทางเดินปัสสาวะและเจาะเลือดเบาหวาน เจ้าหน้าที่ Escort เตรียมแฟ้มประวัติครบถ้วน',
    carePlan: {
      id: 'cp-006',
      patientId: 'p-006',
      updatedAt: '2026-09-06 14:00',
      doctorRecommendations: [
        'งดน้ำงดอาหาร 8 ชั่วโมงก่อนเจาะเลือดเวลา 07:30 น.',
        'ดื่มน้ำตามปกติหลังเจาะเลือดเสร็จสิ้น'
      ],
      guidelines: [
        'เจ้าหน้าที่ Escort พยุงเข้าห้องตรวจและช่วยรับยาแทน'
      ],
      medications: [
        {
          id: 'med-601',
          name: 'Tamsulosin HCl',
          dosage: '0.4 mg',
          frequency: 'วันละ 1 แคปซูล หลังอาหารเช้า',
          timing: ['morning', 'after_meal'],
          instructions: 'ช่วยลดอาการปัสสาวะขัด',
          prescribedBy: 'พญ. ชิดชนก'
        }
      ],
      recommendedActivities: ['ฝึกขมิบกล้ามเนื้ออุ้งเชิงกราน'],
      restrictedActivities: ['ห้ามกลั้นปัสสาวะ'],
      precautions: [
        { id: 'al-601', type: 'fall_risk', label: 'ระวังอาการวิงเวียนจากยาความดัน/ต่อมลูกหมาก', severity: 'medium', details: 'ลุกเปลี่ยนท่าช้าๆ', icon: 'AlertTriangle' }
      ],
      riskAssessment: {
        fallRiskScore: 6,
        bedriddenScale: 'wheelchair',
        dietaryRestrictions: ['Low Glycemic Index', 'Adequate Hydration']
      }
    },
    vitalsHistory: [
      { id: 'v-601', timestamp: '2026-09-07 09:15', sys: 136, dia: 84, pulse: 76, glucose: 142, glucoseType: 'fasting', temp: 36.7, spo2: 97, status: 'monitor', recordedBy: 'กานดา ชัยชนะ', recorderRole: 'Medical Escort', notes: 'น้ำตาลช่วงเช้าค่อนข้างสูงเล็กน้อย เตรียมนัดพบแพทย์ตามแผน' }
    ],
    dailyLogs: [],
    address: 'บ้านเลขที่ 45/12 ซอยบรมราชชนนี 15 บางพลัด กรุงเทพฯ 10700',
    gpsCoords: { lat: 13.7854, lng: 100.4789 }
  },
  {
    id: 'p-007',
    hn: 'HN-6701289',
    name: 'Doungjai Pongsiri',
    thaiName: 'คุณป้าดวงใจ พงษ์ศิริ',
    gender: 'female',
    age: 69,
    birthDate: '1957-09-25',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    roomBed: 'ผู้ป่วยนอก (บริการพาพบแพทย์ Escort)',
    careType: 'medical_escort',
    serviceStatus: 'active',
    serviceStartDate: '2026-07-01',
    primaryCaregiverName: 'ปกรณ์ ภักดีสุข (Escort นัท)',
    primaryDoctorName: 'พญ. พรรณนิภา อัจฉริยะ (จักษุแพทย์)',
    primaryHospital: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    chronicDiseases: ['ต้อกระจกตาซ้าย (Cataract Left Eye)', 'โรคตาแห้งเรื้อรัง'],
    drugAllergies: ['ไม่มีประวัติแพ้ยา'],
    foodAllergies: ['ไม่มีประวัติแพ้อาหาร'],
    emergencyContact: {
      name: 'คุณเอกชัย พงษ์ศิริ (บุตรชาย)',
      relationship: 'บุตรชาย (Son)',
      phone: '084-221-7788'
    },
    healthStatus: 'stable',
    statusNotes: 'นัดตรวจประเมินก่อนผ่าตัดสลายต้อกระจก ตาพร่ามัวเล็กน้อย ต้องการผู้ช่วยจูงเดินและหยอดยาขยายม่านตา',
    carePlan: {
      id: 'cp-007',
      patientId: 'p-007',
      updatedAt: '2026-09-05 16:00',
      doctorRecommendations: [
        'หยอดยาปฏิชีวนะและน้ำตาเทียมตามเวลา',
        'ใส่แว่นกันแดดหลังการตรวจขยายม่านตา'
      ],
      guidelines: [
        'Escort ประกบจูงเดินตลอดเวลาหลังตรวจขยายม่านตา'
      ],
      medications: [
        {
          id: 'med-701',
          name: 'Tears Natural Free',
          dosage: '1-2 หยด',
          frequency: 'หยอดตาวันละ 4 ครั้ง',
          timing: ['morning', 'noon', 'evening', 'bedtime'],
          instructions: 'บรรเทาอาการตาแห้ง',
          prescribedBy: 'พญ. พรรณนิภา'
        }
      ],
      recommendedActivities: ['ฟังพอดแคสต์/เพลงผ่อนคลาย พักสายตา'],
      restrictedActivities: ['ห้ามขยี้ตา ห้ามขับรถเองหลังตรวจ'],
      precautions: [
        { id: 'al-701', type: 'fall_risk', label: 'สายตามัวชั่วคราวหลังขยายม่านตา', severity: 'high', details: 'ต้องมี Escort ประคองเดิน ห้ามเดินตามลำพัง', icon: 'AlertTriangle' }
      ],
      riskAssessment: {
        fallRiskScore: 7,
        bedriddenScale: 'ambulatory',
        dietaryRestrictions: ['General Healthy Diet']
      }
    },
    vitalsHistory: [
      { id: 'v-701', timestamp: '2026-09-07 10:00', sys: 122, dia: 78, pulse: 72, temp: 36.5, spo2: 99, status: 'stable', recordedBy: 'ปกรณ์ ภักดีสุข', recorderRole: 'Medical Escort', notes: 'สัญญาณชีพปกติ พร้อมสำหรับนัดตรวจจักษุ' }
    ],
    dailyLogs: [],
    address: 'บ้านเลขที่ 77/3 ซอยงามวงศ์วาน 23 นนทบุรี 11000',
    gpsCoords: { lat: 13.8598, lng: 100.5298 }
  },
  {
    id: 'p-008',
    hn: 'HN-6701312',
    name: 'Supha Mankong',
    thaiName: 'คุณยายสุภา มั่นคง',
    gender: 'female',
    age: 79,
    birthDate: '1947-06-11',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
    roomBed: 'Home Care (บ้านพักสุขุมวิท 71)',
    careType: 'home_care',
    serviceStatus: 'active',
    serviceStartDate: '2026-08-01',
    primaryCaregiverName: 'ชนัญชิดา สว่างจิตต์ (Caregiver น้ำ)',
    primaryDoctorName: 'นพ. ธนภัทร รุ่งเรือง (เวชศาสตร์ฟื้นฟู)',
    primaryHospital: 'โรงพยาบาลสมิติเวช สุขุมวิท',
    chronicDiseases: ['กระดูกสะโพกหักหลังผ่าตัดดามเหล็ก (Post-op Hip Fracture)', 'ความดันโลหิตสูง'],
    drugAllergies: ['Morphine (คลื่นไส้ อาเจียนรุนแรง)'],
    foodAllergies: ['ไม่มีประวัติแพ้อาหาร'],
    emergencyContact: {
      name: 'คุณภาณุ มั่นคง (บุตรชาย)',
      relationship: 'บุตรชาย (Son)',
      phone: '083-998-1122'
    },
    healthStatus: 'stable',
    statusNotes: 'ผู้ดูแลประจำบ้านฝึกกายภาพฟื้นฟูการลงน้ำหนักข้อสะโพก รับประทานอาหารครบ 3 มื้อ อารมณ์แจ่มใส',
    carePlan: {
      id: 'cp-008',
      patientId: 'p-008',
      updatedAt: '2026-09-06 10:00',
      doctorRecommendations: [
        'กายภาพบำบัดกล้ามเนื้อสะโพกและต้นขาวันละ 2 ครั้ง',
        'ฝึกยืนทรงตัวด้วย Walker 10-15 นาที',
        'รับประทานอาหารแคลเซียมสูงและตากแดดอ่อนยามเช้า'
      ],
      guidelines: [
        'หรืองอสะโพกเกิน 90 องศา หรือนั่งไขว่ห้าง',
        'ใช้เก้าอี้ขับถ่ายแบบปรับระดับความสูง'
      ],
      medications: [
        {
          id: 'med-801',
          name: 'Calcium Carbonate + Vit D',
          dosage: '1,500 mg',
          frequency: 'วันละ 1 เม็ด หลังอาหารเช้า',
          timing: ['morning', 'after_meal'],
          instructions: 'บำรุงมวลกระดูก',
          prescribedBy: 'นพ. ธนภัทร'
        }
      ],
      recommendedActivities: ['กายภาพท่ายืนย่อเข่าเบาๆ (Mini Squat)', 'ฟังเพลงสวดมนต์'],
      restrictedActivities: ['ห้ามนั่งเก้าอี้เตี้ย ห้ามนั่งพับเพียบ'],
      precautions: [
        { id: 'al-801', type: 'fall_risk', label: 'ระวังข้อสะโพกหลุดและลื่นล้ม', severity: 'high', details: 'หรืองอสะโพกเกิน 90 องศา', icon: 'AlertTriangle' }
      ],
      riskAssessment: {
        fallRiskScore: 8,
        bedriddenScale: 'wheelchair',
        dietaryRestrictions: ['High Calcium', 'Low Sodium']
      }
    },
    vitalsHistory: [
      { id: 'v-801', timestamp: '2026-09-07 14:00', sys: 124, dia: 78, pulse: 72, temp: 36.6, spo2: 98, status: 'stable', recordedBy: 'ชนัญชิดา สว่างจิตต์', recorderRole: 'Caregiver', notes: 'หลังกายภาพสะโพก อาการคงที่ ไม่มีอาการปวดเพิ่ม' }
    ],
    dailyLogs: [],
    address: 'บ้านเลขที่ 112 ซอยปรีดีพนมยงค์ 26 สุขุมวิท 71 วัฒนา กรุงเทพฯ 10110',
    gpsCoords: { lat: 13.7225, lng: 100.5988 }
  }
];

export const initialEscortStaff: EscortStaff[] = [
  {
    id: 'esc-001',
    name: 'ธีรเดช มั่นคง (Escort บาส)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    phone: '082-334-9988',
    skills: ['ปฐมพยาบาล CPR & First Aid', 'เทคนิคพยุงและเคลื่อนย้ายผู้ป่วยนั่งวีลแชร์', 'การดูแลผู้สูงอายุที่มีภาวะสมองเสื่อม', 'ขับรถพยาบาลฉุกเฉิน'],
    serviceAreas: ['กรุงเทพฯ ชั้นใน', 'พญาไท', 'สีลม', 'ปทุมวัน'],
    availability: 'available',
    rating: 4.9,
    totalTrips: 142,
    certifications: ['Basic Life Support (BLS) - สภากาชาดไทย', 'Certified Senior Escort Specialist 2025'],
    schedule: [
      {
        date: '2026-09-08',
        timeSlots: [
          { time: '08:00 - 12:00', status: 'booked', appointmentId: 'apt-101' },
          { time: '13:00 - 17:00', status: 'free' }
        ]
      },
      {
        date: '2026-09-09',
        timeSlots: [
          { time: '08:00 - 12:00', status: 'free' },
          { time: '13:00 - 17:00', status: 'free' }
        ]
      }
    ]
  },
  {
    id: 'esc-002',
    name: 'กานดา ชัยชนะ (Escort เมย์)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    phone: '086-778-1234',
    skills: ['ผู้ช่วยพยาบาล (PN)', 'ดูแลผู้ป่วยฟอกไตและโรคหัวใจ', 'ทักษะประสานงานคลินิกและเบิกจ่ายประกัน', 'ภาษาอังกฤษระดับสื่อสารทางการแพทย์'],
    serviceAreas: ['ธนบุรี', 'บางกอกน้อย', 'ปิ่นเกล้า', 'ราชพฤกษ์'],
    availability: 'busy',
    rating: 4.95,
    totalTrips: 215,
    certifications: ['Practical Nurse (PN) License', 'Advanced Cardiac Life Support Companion'],
    currentJobId: 'apt-102',
    schedule: [
      {
        date: '2026-09-08',
        timeSlots: [
          { time: '08:30 - 13:00', status: 'booked', appointmentId: 'apt-102' },
          { time: '14:00 - 18:00', status: 'free' }
        ]
      }
    ]
  },
  {
    id: 'esc-003',
    name: 'ปกรณ์ ภักดีสุข (Escort นัท)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: '084-556-2211',
    skills: ['การจัดการรถเข็นและอุปกรณ์ออกซิเจนพกพา', 'การสื่อสารกับแพทย์เฉพาะทาง', 'จิตวิทยาผู้สูงวัย'],
    serviceAreas: ['บางนา', 'สุขุมวิท', 'รามคำแหง'],
    availability: 'available',
    rating: 4.85,
    totalTrips: 98,
    certifications: ['CPR & AED Healthcare Provider', 'Elderly Mobility Assistant'],
    schedule: [
      {
        date: '2026-09-08',
        timeSlots: [
          { time: '08:00 - 12:00', status: 'free' },
          { time: '13:00 - 17:00', status: 'free' }
        ]
      }
    ]
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-101',
    appointmentNumber: 'APT-20260908-01',
    patientId: 'p-001',
    patientName: 'คุณยายสมศรี รัตนพร',
    patientAvatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&auto=format&fit=crop&q=80',
    patientAge: 78,
    patientCondition: 'ติดตามอาการโรคหัวใจ & เบาหวาน (Follow-up Cardiology)',
    hospitalName: 'โรงพยาบาลกรุงเทพคริสเตียน',
    department: 'ศูนย์หัวใจและหลอดเลือด ชั้น 3 (Cardiology Clinic)',
    doctorName: 'นพ. วิรัช วงศ์สว่าง',
    dateTime: '2026-09-08 09:00',
    escortStaffId: 'esc-001',
    escortStaffName: 'ธีรเดช มั่นคง (Escort บาส)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '082-334-9988',
    status: 'confirmed',
    preAppointmentBriefing: {
      previousDiagnosis: 'ความดันโลหิตเริ่มทรงตัว แต่ค่าน้ำตาลสะสม HbA1c ล่าสุดอยู่ที่ 7.2% ยังต้องการการควบคุม',
      previousTreatment: 'คงยา Amlodipine 5mg และ Metformin 500mg วันละ 2 ครั้ง',
      recentVitalSummary: 'ค่าความดันเฉลี่ย 134/84 mmHg, น้ำตาลเฉลี่ย 150 mg/dL ไม่มีอาการแน่นหน้าอก',
      precautionAlerts: ['High Fall Risk (ใช้รถเข็นตลอดการเดินทาง)', 'แพ้ยา Penicillin และ Aspirin'],
      relevantMedications: ['Amlodipine 5mg (1 tab เช้า)', 'Metformin 500mg (1 tab เช้า-เย็น)', 'Calcium + D3 (1 tab เย็น)'],
      questionsChecklist: [
        {
          id: 'q-1',
          question: 'ช่วงเช้ามีอาการเวียนศีรษะเบาๆ ต้องปรับลดยาความดันหรือทานยาตัวเดิมต่อ?',
          submittedBy: 'คุณธนพล (บุตรชาย)',
          submittedAt: '2026-09-06 20:00',
          answered: false
        },
        {
          id: 'q-2',
          question: 'ระดับน้ำตาลสะสมรอบนี้มีแนวโน้มลดลงพอที่จะลดปริมาณยาเบาหวานได้หรือไม่?',
          submittedBy: 'ศศิธร (Caregiver)',
          submittedAt: '2026-09-07 09:15',
          answered: false
        },
        {
          id: 'q-3',
          question: 'สามารถฉีดวัคซีนไข้หวัดใหญ่เข็มกระตุ้นประจำปีในวันนี้ได้เลยหรือไม่?',
          submittedBy: 'คุณธนพล (บุตรชาย)',
          submittedAt: '2026-09-07 11:00',
          answered: false
        }
      ]
    }
  },
  {
    id: 'apt-102',
    appointmentNumber: 'APT-20260908-02',
    patientId: 'p-002',
    patientName: 'คุณตาประเสริฐ เจริญวงศ์',
    patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    patientAge: 83,
    patientCondition: 'เปลี่ยนสายยางให้อาหาร NG Tube & ตรวจระบบประสาท',
    hospitalName: 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
    department: 'คลินิกผู้ป่วยนอกอายุรกรรมประสาท ชั้น 4',
    doctorName: 'พญ. พิมพ์ใจ กุลพงษ์',
    dateTime: '2026-09-08 10:30',
    escortStaffId: 'esc-002',
    escortStaffName: 'กานดา ชัยชนะ (Escort เมย์)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '086-778-1234',
    status: 'in_progress',
    preAppointmentBriefing: {
      previousDiagnosis: 'Ischemic Stroke ผู้ป่วยติดเตียง เปลี่ยนสายยางให้อาหารครบกำหนด 1 เดือน',
      previousTreatment: 'ให้อาหารปั่นผสมทางสายยาง ยาละลายลิ่มเลือด Clopidogrel',
      recentVitalSummary: 'BP 124/78 mmHg, SpO2 95-97%, มีไข้ต่ำๆ 37.4 C เมื่อวานนี้',
      precautionAlerts: ['Bedridden Stage 3 (ใช้เปลนอน Ambulance)', 'แพ้ยา Sulfa', 'ระวังภาวะสำลักเสมหะ'],
      relevantMedications: ['Clopidogrel 75mg', 'Donepezil 10mg'],
      questionsChecklist: [
        {
          id: 'q-201',
          question: 'สายยาง NG Tube รอบนี้ควรเปลี่ยนเป็นซิลิโคนแบบอยู่ได้ 3 เดือนหรือไม่?',
          submittedBy: 'คุณณัฐญา (บุตรสาว)',
          submittedAt: '2026-09-07 14:20',
          answered: false
        },
        {
          id: 'q-202',
          question: 'เสมหะเหนียวข้นมากขึ้น ต้องการให้แพทย์ตรวจฟังเสียงปอดเพิ่มเติม',
          submittedBy: 'มนัสวี (Caregiver)',
          submittedAt: '2026-09-07 15:45',
          answered: false
        }
      ]
    }
  },
  {
    id: 'apt-103',
    appointmentNumber: 'APT-20260901-03',
    patientId: 'p-003',
    patientName: 'คุณยายวรรณา ศิริพร',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    patientAge: 72,
    patientCondition: 'ตรวจติดตามแผลผ่าตัดข้อเข่าเทียม ครบ 4 สัปดาห์ (Post-op Knee Follow-up)',
    hospitalName: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    department: 'คลินิกกระดูกและข้อ (Orthopedic Clinic)',
    doctorName: 'นพ. อนุชา เลิศพิพัฒน์',
    dateTime: '2026-09-01 13:30',
    escortStaffId: 'esc-001',
    escortStaffName: 'ธีรเดช มั่นคง (Escort บาส)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '082-334-9988',
    status: 'completed',
    preAppointmentBriefing: {
      previousDiagnosis: 'Post Total Knee Arthroplasty Right Knee',
      previousTreatment: 'กายภาพบำบัดกล้ามเนื้อต้นขา งดลงน้ำหนักเต็มที่',
      recentVitalSummary: 'Vitals ปกติ ไม่มีไข้ แผลแห้งดี',
      precautionAlerts: ['ระวังลื่นล้ม', 'ห้ามนั่งยอง'],
      relevantMedications: ['Atorvastatin 20mg', 'Paracetamol 500mg prn'],
      questionsChecklist: [
        {
          id: 'q-301',
          question: 'สามารถเริ่มฝึกเดินโดยไม่ใช้ Walker ได้หรือยัง?',
          submittedBy: 'คุณพัชรี (บุตรสาว)',
          submittedAt: '2026-08-31 16:00',
          answered: true,
          doctorAnswer: 'แพทย์แจ้งว่ากระดูกสมานดี สามารถเริ่มฝึกเดินด้วยไม้เท้าขาเดียว (Single Cane) ได้ในสัปดาห์หน้า'
        }
      ]
    },
    postVisitSummary: {
      visitNotes: 'แผลผ่าตัดติดสนิทดีมาก ไม่มีการอักเสบหรือบวมแดง แพทย์ตัดไหมเรียบร้อย เอกซเรย์ข้อเข่าอยู่ในตำแหน่งที่สมบูรณ์',
      newTreatmentOrders: 'เพิ่มโปรแกรมกายภาพฝึกขึ้น-ลงบันได และอนุญาตให้เดินด้วย Single Cane ได้',
      medicationChanges: 'หยุดยาแก้ปวด Paracetamol ให้ทานเฉพาะเวลาปวดมาก ทานยา Atorvastatin ต่อเนื่องตามเดิม',
      nextAppointmentDate: '2026-10-06 13:30',
      nextAppointmentDept: 'คลินิกออร์โธปิดิกส์ อาคาร ภปร ชั้น 5',
      documents: [
        {
          id: 'doc-01',
          title: 'ใบเสร็จรับเงินค่าตรวจและเอกซเรย์ รพ.จุฬาลงกรณ์ (2,450 บาท)',
          type: 'receipt',
          fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
          uploadedAt: '2026-09-01 15:45',
          uploadedBy: 'ธีรเดช มั่นคง'
        },
        {
          id: 'doc-02',
          title: 'ใบนัดหมายแพทย์รอบถัดไป (6 ต.ค. 2026)',
          type: 'appointment_slip',
          fileUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
          uploadedAt: '2026-09-01 15:46',
          uploadedBy: 'ธีรเดช มั่นคง'
        }
      ],
      submittedAt: '2026-09-01 16:10',
      submittedBy: 'ธีรเดช มั่นคง (Medical Escort)'
    }
  },
  {
    id: 'apt-104',
    appointmentNumber: 'APT-20260908-04',
    patientId: 'p-005',
    patientName: 'คุณยายกมลา วงศ์พานิช',
    patientAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80',
    patientAge: 76,
    patientCondition: 'ตรวจคลื่นไฟฟ้าหัวใจ EKG และปรับยาต้านการแข็งตัวของเลือด Warfarin',
    hospitalName: 'โรงพยาบาลกรุงเทพคริสเตียน',
    department: 'ศูนย์หัวใจและหลอดเลือด ชั้น 3 (Cardiology Clinic)',
    doctorName: 'นพ. วิรัช วงศ์สว่าง',
    dateTime: '2026-09-08 08:30',
    escortStaffId: 'esc-001',
    escortStaffName: 'ธีรเดช มั่นคง (Escort บาส)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '082-334-9988',
    status: 'confirmed',
    preAppointmentBriefing: {
      previousDiagnosis: 'Atrial Fibrillation ค่า INR ล่าสุด 2.3 อยู่ในเกณฑ์เป้าหมาย',
      previousTreatment: 'Warfarin 3mg วันละ 1 เม็ด',
      recentVitalSummary: 'BP 128/82 mmHg, Pulse 74 bpm ปกติ ไม่มีรอยฟกช้ำ',
      precautionAlerts: ['ทานยาต้านการแข็งตัวของเลือด Warfarin', 'แพ้ยา Aspirin'],
      relevantMedications: ['Warfarin 3mg (1 tab เย็น)'],
      questionsChecklist: [
        {
          id: 'q-501',
          question: 'ตรวจเลือด INR รอบนี้ต้องปรับขนาดยา Warfarin หรือไม่?',
          submittedBy: 'คุณศิริชัย (บุตรชาย)',
          submittedAt: '2026-09-07 10:00',
          answered: false
        }
      ]
    }
  },
  {
    id: 'apt-105',
    appointmentNumber: 'APT-20260908-05',
    patientId: 'p-006',
    patientName: 'คุณตาสมจิตร์ ศรีประเสริฐ',
    patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    patientAge: 81,
    patientCondition: 'อัลตราซาวด์ระบบทางเดินปัสสาวะ & เจาะเลือดเบาหวาน (Urology & DM)',
    hospitalName: 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
    department: 'คลินิกศัลยกรรมระบบทางเดินปัสสาวะ ชั้น 3',
    doctorName: 'พญ. ชิดชนก สว่างอารมณ์',
    dateTime: '2026-09-08 09:30',
    escortStaffId: 'esc-002',
    escortStaffName: 'กานดา ชัยชนะ (Escort เมย์)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '086-778-1234',
    status: 'confirmed',
    preAppointmentBriefing: {
      previousDiagnosis: 'BPH และ เบาหวานชนิดที่ 2',
      previousTreatment: 'Tamsulosin 0.4mg, Metformin 500mg',
      recentVitalSummary: 'BP 136/84 mmHg, Fasting Glucose 142 mg/dL',
      precautionAlerts: ['งดน้ำและอาหารก่อนเจาะเลือด', 'แพ้ยากลุ่ม Sulfa'],
      relevantMedications: ['Tamsulosin 0.4mg', 'Metformin 500mg'],
      questionsChecklist: [
        {
          id: 'q-601',
          question: 'ผลอัลตราซาวด์ต่อมลูกหมากขนาดลดลงหรือไม่ และต้องผ่าตัดหรือไม่?',
          submittedBy: 'คุณวราภรณ์ (บุตรสาว)',
          submittedAt: '2026-09-07 11:30',
          answered: false
        }
      ]
    }
  },
  {
    id: 'apt-106',
    appointmentNumber: 'APT-20260909-06',
    patientId: 'p-007',
    patientName: 'คุณป้าดวงใจ พงษ์ศิริ',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    patientAge: 69,
    patientCondition: 'ตรวจประเมินก่อนผ่าตัดสลายต้อกระจกและวัดขนาดเลนส์ตา (Eye Clinic)',
    hospitalName: 'โรงพยาบาลจุฬาลงกรณ์ สภากาชาดไทย',
    department: 'ศูนย์จักษุวิทยา อาคาร ภปร ชั้น 7',
    doctorName: 'พญ. พรรณนิภา อัจฉริยะ',
    dateTime: '2026-09-09 10:00',
    escortStaffId: 'esc-003',
    escortStaffName: 'ปกรณ์ ภักดีสุข (Escort นัท)',
    escortStaffAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    escortStaffPhone: '084-556-2211',
    status: 'confirmed',
    preAppointmentBriefing: {
      previousDiagnosis: 'Cataract Left Eye (ต้อกระจกตาซ้าย)',
      previousTreatment: 'น้ำตาเทียม Tears Natural Free',
      recentVitalSummary: 'BP 122/78 mmHg, SpO2 99% พร้อมตรวจขยายม่านตา',
      precautionAlerts: ['ระวังลื่นล้มจากสายตามัวหลังหยอดขยายม่านตา', 'ห้ามขับรถเอง'],
      relevantMedications: ['Tears Natural Free eye drops'],
      questionsChecklist: [
        {
          id: 'q-701',
          question: 'กำหนดวันผ่าตัดสลายต้อกระจกสามารถเลือกช่วงปลายเดือนนี้ได้หรือไม่?',
          submittedBy: 'คุณเอกชัย (บุตรชาย)',
          submittedAt: '2026-09-07 14:00',
          answered: false
        }
      ]
    }
  }
];

export const initialCaregivers: Caregiver[] = [
  {
    id: 'cg-001',
    name: 'Sasithorn Pornprasit',
    thaiName: 'ศศิธร พรประสิทธิ์ (ผู้ดูแล ศศิ)',
    avatar: 'https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 36,
    phone: '089-112-3344',
    email: 'sasi.care@carenest.health',
    experienceYears: 8,
    education: 'ประกาศนียบัตรวิชาชีพพนักงานบริบาลผู้สูงอายุ (NA 840 ชั่วโมง) - วิทยาลัยพยาบาลบรมราชชนนี',
    certifications: [
      'Elderly Care Certified Specialist (กรมการแพทย์)',
      'Basic Life Support & First Aid Certified 2025',
      'Diabetes & Hypertension Home Care Management',
      'Dementia & Alzheimer Compassion Care'
    ],
    specialSkills: [
      'การดูแลผู้ป่วยโรคเรื้อรัง (NCDs)',
      'การจัดยาตามมื้อและตรวจวัดน้ำตาลปลายนิ้ว (DTX)',
      'การทำอาหารเฉพาะโรค (เบาหวาน, ไต, โรคเกาต์)',
      'กายภาพบำบัดกล้ามเนื้อแขนขาเบื้องต้น'
    ],
    serviceAreas: ['พญาไท', 'อารีย์', 'จตุจักร', 'ดินแดง'],
    status: 'working',
    rating: 4.95,
    totalPatientsServed: 18,
    startDate: '2023-04-15',
    wageType: 'monthly',
    standardRate: 26000,
    currentPatientId: 'p-001',
    currentPatientName: 'คุณยายสมศรี รัตนพร',
    bio: 'มีความชำนาญการดูแลผู้สูงอายุที่มีโรคประจำตัวเบาหวานและความดันสูง ใจเย็น ละเอียดรอบคอบ และสื่อสารกับญาติสม่ำเสมอ'
  },
  {
    id: 'cg-002',
    name: 'Manatsawee Deeprom',
    thaiName: 'มนัสวี ดีพร้อม (ผู้ดูแล มินต์)',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 32,
    phone: '081-998-7766',
    email: 'mint.care@carenest.health',
    experienceYears: 6,
    education: 'ผู้ช่วยพยาบาล (Practical Nurse - PN) มหาวิทยาลัยมหิดล',
    certifications: [
      'Bedridden & Stroke Rehabilitation Care Specialist',
      'Enteral Tube Feeding (NG Tube) & Suction Certified',
      'Pressure Ulcer Prevention & Wound Dressing',
      'CPR Healthcare Provider (AHA)'
    ],
    specialSkills: [
      'การดูแลผู้ป่วยติดเตียงและผู้ป่วยหลังโรคหลอดเลือดสมอง',
      'การให้อาหารทางสายยาง (NG Tube / PEG Tube)',
      'การดูดเสมหะและการพ่นยา',
      'การทำแผลกดทับระดับ 1-3 และการป้องกันการติดเชื้อ'
    ],
    serviceAreas: ['คันนายาว', 'รามอินทรา', 'มีนบุรี', 'บึงกุ่ม'],
    status: 'working',
    rating: 4.9,
    totalPatientsServed: 14,
    startDate: '2024-01-10',
    wageType: 'monthly',
    standardRate: 30000,
    currentPatientId: 'p-002',
    currentPatientName: 'คุณตาประเสริฐ เจริญวงศ์',
    bio: 'อดีตผู้ช่วยพยาบาลแผนกผู้ป่วยหนัก ชำนาญพิเศษด้านการดูแลผู้ป่วยติดเตียง ท่อให้อาหาร และการดูดเสมหะ'
  },
  {
    id: 'cg-003',
    name: 'Arunee Phuangphae',
    thaiName: 'อรุณี พ่วงแพ (ผู้ดูแล อร)',
    avatar: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 41,
    phone: '087-443-2211',
    email: 'arunee.p@carenest.health',
    experienceYears: 11,
    education: 'ประกาศนียบัตรการดูแลผู้สูงอายุและผู้ป่วยระยะพักฟื้น 420 ชั่วโมง',
    certifications: [
      'Post-Orthopedic Surgery Rehabilitation Care',
      'Fall Prevention Master Trainer',
      'Geriatric Nutrition and Mobility Assistant'
    ],
    specialSkills: [
      'การฟื้นฟูหลังผ่าตัดกระดูกและข้อ',
      'การฝึกเดินด้วยอุปกรณ์ช่วยเดิน (Walker, Cane)',
      'นันทนาการและศิลปะบำบัดผู้สูงอายุ'
    ],
    serviceAreas: ['ราชเทวี', 'ปทุมวัน', 'สาทร'],
    status: 'working',
    rating: 4.88,
    totalPatientsServed: 25,
    startDate: '2022-08-01',
    wageType: 'daily',
    standardRate: 1200,
    currentPatientId: 'p-003',
    currentPatientName: 'คุณยายวรรณา ศิริพร',
    bio: 'ประสบการณ์ดูแลผู้สูงอายุมากกว่า 10 ปี เชี่ยวชาญการฟื้นฟูหลังผ่าตัด อารมณ์ดี สร้างรอยยิ้มและกำลังใจให้ผู้ป่วยเสมอ'
  },
  {
    id: 'cg-004',
    name: 'Kitti Somwong',
    thaiName: 'กิตติ สมวงศ์ (ผู้ดูแล โต้ง)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 29,
    phone: '090-221-5544',
    email: 'kitti.care@carenest.health',
    experienceYears: 4,
    education: 'วิทยาศาสตรบัณฑิต วิทยาศาสตร์การกีฬา มหาวิทยาลัยเกษตรศาสตร์',
    certifications: [
      'Certified Elderly Exercise Trainer',
      'First Aid & AED Certified (Thai Red Cross)',
      'Dialysis Care Companion'
    ],
    specialSkills: [
      'การฟื้นฟูกล้ามเนื้อและฝึกการทรงตัว',
      'การดูแลผู้ป่วยฟอกไตทางหลอดเลือด (Hemodialysis)',
      'การอุ้มยกเคลื่อนย้ายผู้ป่วยตัวใหญ่'
    ],
    serviceAreas: ['ลาดพร้าว', 'จตุจักร', 'รัชดา'],
    status: 'available',
    rating: 4.8,
    totalPatientsServed: 9,
    startDate: '2025-02-01',
    wageType: 'hourly',
    standardRate: 250,
    bio: 'แข็งแรง คล่องแคล่ว เชี่ยวชาญการทำกายภาพเพื่อป้องกันกล้ามเนื้อลีบ และพาผู้ป่วยออกกำลังกาย'
  }
];

export const initialContracts: CaregiverContract[] = [
  {
    id: 'ctr-001',
    contractNumber: 'CTR-2026-0089',
    patientId: 'p-001',
    patientName: 'คุณยายสมศรี รัตนพร',
    caregiverId: 'cg-001',
    caregiverName: 'ศศิธร พรประสิทธิ์',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    wageType: 'monthly',
    wageRate: 26000,
    workingType: 'live_in',
    workingHours: 'พักค้างคืน 24 ชม. (พักสัปดาห์ละ 1 วัน ในวันอาทิตย์)',
    specialTerms: 'รวมอาหาร 3 มื้อ และห้องพักส่วนตัว จัดเตรียมยาและบันทึก Daily Vitals ส่งให้ครอบครัวทุกวัน',
    status: 'active'
  },
  {
    id: 'ctr-002',
    contractNumber: 'CTR-2026-0094',
    patientId: 'p-002',
    patientName: 'คุณตาประเสริฐ เจริญวงศ์',
    caregiverId: 'cg-002',
    caregiverName: 'มนัสวี ดีพร้อม',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    wageType: 'monthly',
    wageRate: 30000,
    workingType: 'live_in',
    workingHours: 'พักค้างคืน 24 ชม. ดูแลพลิกตัวและให้อาหารทางสายยาง',
    specialTerms: 'ดูแลความสะอาดแผล ท่อให้อาหาร และดูดเสมหะ รายงานผลผ่านแอปพลิเคชันทุกเย็น',
    status: 'active'
  },
  {
    id: 'ctr-003',
    contractNumber: 'CTR-2026-0112',
    patientId: 'p-003',
    patientName: 'คุณยายวรรณา ศิริพร',
    caregiverId: 'cg-003',
    caregiverName: 'อรุณี พ่วงแพ',
    startDate: '2026-08-15',
    endDate: '2026-11-15',
    wageType: 'daily',
    wageRate: 1200,
    workingType: 'live_out',
    workingHours: 'ไป-กลับ 08:00 - 18:00 น. (จันทร์ - เสาร์)',
    specialTerms: 'เน้นช่วยฝึกเดิน กายภาพข้อเข่า และพาไปทำกิจกรรมนอกห้องพัก',
    status: 'active'
  }
];

export const initialCheckins: CheckinRecord[] = [
  {
    id: 'chk-001',
    caregiverId: 'cg-001',
    caregiverName: 'ศศิธร พรประสิทธิ์',
    patientId: 'p-001',
    patientName: 'คุณยายสมศรี รัตนพร',
    checkinTime: '2026-09-07 07:00',
    gpsLocation: {
      lat: 13.7744,
      lng: 100.5368,
      address: 'ซอยอารีย์สัมพันธ์ 3 พญาไท กรุงเทพฯ'
    },
    isInsideRadius: true,
    distanceFromPatientMeters: 18,
    status: 'active'
  },
  {
    id: 'chk-002',
    caregiverId: 'cg-002',
    caregiverName: 'มนัสวี ดีพร้อม',
    patientId: 'p-002',
    patientName: 'คุณตาประเสริฐ เจริญวงศ์',
    checkinTime: '2026-09-07 07:15',
    gpsLocation: {
      lat: 13.8290,
      lng: 100.6780,
      address: 'หมู่บ้านปัญญารามอินทรา คันนายาว'
    },
    isInsideRadius: true,
    distanceFromPatientMeters: 25,
    status: 'active'
  }
];

export const initialDailyReports: DailyCareReport[] = [
  {
    id: 'dcr-001',
    reportNumber: 'DCR-20260906-01',
    patientId: 'p-001',
    patientName: 'คุณยายสมศรี รัตนพร',
    caregiverId: 'cg-001',
    caregiverName: 'ศศิธร พรประสิทธิ์',
    date: '2026-09-06',
    mealsSummary: 'เช้า: ข้าวต้มปลา (90%), กลางวัน: โจ๊กหมูสับ (85%), เย็น: ซุปฟักทอง (80%) ดื่มน้ำรวม 1,650 ml',
    medsCompliance: 'all_given',
    bowelStatus: 'ขับถ่ายปกติ 1 ครั้ง อุจจาระนิ่ม ปัสสาวะสีเหลืองใสปกติ',
    sleepSummary: 'นอนหลับ 7.5 ชั่วโมง หลับรวดเดียว ไม่ตื่นกลางดึก',
    activityNotes: 'ทำกายภาพกล้ามเนื้อมือ 20 นาที นั่งชมสวนช่วงเย็น อารมณ์ดี ยิ้มแย้มแจ่มใส',
    abnormalSigns: 'ไม่มีอาการหอบเหนื่อยหรือเวียนศีรษะ',
    vitalSummary: {
      bp: '132/82 mmHg',
      pulse: 74,
      glucose: 140,
      temp: 36.6,
      spo2: 98
    },
    photos: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80'
    ],
    submittedAt: '2026-09-06 19:30',
    familyAcknowledged: true,
    acknowledgedAt: '2026-09-06 20:15'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    title: '⚠️ แจ้งเตือนค่าน้ำตาลในเลือดสูงกว่าเกณฑ์',
    message: 'คุณยายสมศรี รัตนพร มีระดับน้ำตาล 168 mg/dL (เกณฑ์ปกติ < 140) ช่วงเช้าวันนี้ กรุณาติดตามอาหารมื้อถัดไป',
    type: 'vital_alert',
    severity: 'warning',
    timestamp: '2026-09-07 08:35',
    read: false,
    targetRoles: ['doctor', 'care_manager', 'family'],
    patientId: 'p-001'
  },
  {
    id: 'notif-002',
    title: '🏥 นัดหมายพบแพทย์วันพรุ่งนี้ (09:00 น.)',
    message: 'คุณยายสมศรี รัตนพร มีนัดตรวจโรคหัวใจ ณ รพ.กรุงเทพคริสเตียน พนักงาน Escort: คุณธีรเดช มั่นคง พร้อมแฟ้มสรุป Pre-Appointment Briefing',
    type: 'appointment',
    severity: 'info',
    timestamp: '2026-09-07 10:00',
    read: false,
    targetRoles: ['escort', 'family', 'care_manager'],
    patientId: 'p-001'
  },
  {
    id: 'notif-003',
    title: '📍 ผู้ดูแลเช็กอินเข้าปฏิบัติงานเรียบร้อย',
    message: 'คุณศศิธร พรประสิทธิ์ ได้ทำการเช็กอิน GPS ณ บ้านพักคุณยายสมศรี รัตนพร (พิกัดถูกต้อง ระยะห่าง 18 เมตร)',
    type: 'checkin',
    severity: 'success',
    timestamp: '2026-09-07 07:00',
    read: true,
    targetRoles: ['family', 'care_manager'],
    patientId: 'p-001'
  },
  {
    id: 'notif-004',
    title: '🌡️ อุณหภูมิร่างกายผู้ป่วยมีไข้ต่ำ',
    message: 'คุณตาประเสริฐ เจริญวงศ์ มีอุณหภูมิ 37.4 °C และเสมหะเหนียว ดูดเสมหะและเฝ้าระวังอาการแล้ว',
    type: 'vital_alert',
    severity: 'warning',
    timestamp: '2026-09-07 15:05',
    read: false,
    targetRoles: ['doctor', 'care_manager', 'family'],
    patientId: 'p-002'
  },
  {
    id: 'notif-005',
    title: '💊 แจ้งเตือนเวลาทานยาประจำมื้อเย็น',
    message: 'ถึงเวลาให้ยา Calcium Carbonate + Vit D3 สำหรับคุณยายสมศรี รัตนพร',
    type: 'med_reminder',
    severity: 'info',
    timestamp: '2026-09-07 17:30',
    read: false,
    targetRoles: ['caregiver', 'family'],
    patientId: 'p-001'
  }
];

export const initialUnifiedStaff: UnifiedStaffMember[] = [
  // ==========================================
  // กลุ่มที่ 1: พนักงาน Nursing Home & บริการพาพบแพทย์
  // ==========================================
  {
    id: 'stf-001',
    code: 'STF-NH01',
    name: 'Arunee Phuangphae',
    thaiName: 'อรุณี พ่วงแพ',
    nickname: 'พี่อร',
    avatar: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 41,
    phone: '087-443-2211',
    lineId: 'arunee_care',
    email: 'arunee.p@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พนักงานบริบาลประจำศูนย์ (Nursing Home Care)',
    status: 'working',
    experienceYears: 11,
    rating: 4.88,
    totalCases: 25,
    currentAssignment: {
      type: 'nursing_home_patient',
      patientName: 'คุณยายวรรณา ศิริพร',
      locationOrRoom: 'ศูนย์ Nursing Home อาคาร B ห้อง 102',
      details: 'ดูแลฟื้นฟูหลังผ่าตัดเปลี่ยนข้อเข่า ฝึกเดิน Walker และช่วยกิจวัตรประจำวัน',
      startTime: '07:00 น.'
    },
    skills: ['ฟื้นฟูกายภาพหลังผ่าตัดกระดูก', 'การฝึกเดินด้วย Walker / ไม้เท้า', 'นันทนาการและศิลปะบำบัดผู้สูงอายุ'],
    certifications: ['NA 420 ชั่วโมง', 'Post-Orthopedic Surgery Care', 'Fall Prevention Master Trainer'],
    serviceAreas: ['ศูนย์ Nursing Home Main Facility', 'ราชเทวี', 'ปทุมวัน'],
    standardRate: '1,200 บาท/วัน',
    education: 'ประกาศนียบัตรการดูแลผู้สูงอายุและผู้ป่วยระยะพักฟื้น 420 ชม.'
  },
  {
    id: 'stf-002',
    code: 'STF-NH02',
    name: 'Supaporn Rattanavech',
    thaiName: 'สุภาพร รัตนเวช',
    nickname: 'พว. เก๋',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 35,
    phone: '081-332-8877',
    lineId: 'supaporn_rn',
    email: 'supaporn.rn@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พยาบาลวิชาชีพประจำศูนย์ (Registered Nurse - RN)',
    status: 'available',
    experienceYears: 10,
    rating: 4.98,
    totalCases: 180,
    skills: ['ประเมินสัญญาณชีพขั้นสูง & Triage', 'การดูแลแผลกดทับระดับ 3-4', 'การให้สารน้ำและยาทางหลอดเลือด', 'การจัดการภาวะฉุกเฉินผู้สูงอายุ'],
    certifications: ['Registered Nurse License (สภาการพยาบาล)', 'ACLS Provider 2026', 'Wound & Stoma Care Specialist'],
    serviceAreas: ['ศูนย์ Nursing Home Main Facility (On-site Rounds)'],
    standardRate: '38,000 บาท/เดือน',
    education: 'พยาบาลศาสตรบัณฑิต (เกียรตินิยม) มหาวิทยาลัยมหิดล',
    notes: 'สแตนด์บายเวร On-site Clinic พร้อมออกตรวจ Round และดูแลเคสฉุกเฉิน'
  },
  {
    id: 'stf-003',
    code: 'STF-ESC01',
    name: 'Theeradech Mankong',
    thaiName: 'ธีรเดช มั่นคง',
    nickname: 'บาส',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 31,
    phone: '082-334-9988',
    lineId: 'bas_escort',
    email: 'theeradech.escort@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พนักงานพาพบแพทย์ผู้เชี่ยวชาญ (Medical Escort Specialist)',
    status: 'available',
    experienceYears: 6,
    rating: 4.9,
    totalCases: 142,
    skills: ['ปฐมพยาบาล CPR & First Aid', 'เทคนิคพยุงและเคลื่อนย้ายผู้ป่วยนั่งวีลแชร์', 'การดูแลผู้สูงอายุสมองเสื่อมระหว่างเดินทาง', 'ขับรถพยาบาลฉุกเฉิน'],
    certifications: ['Basic Life Support (BLS) - สภากาชาดไทย', 'Certified Senior Escort Specialist 2025'],
    serviceAreas: ['กรุงเทพฯ ชั้นใน', 'พญาไท', 'สีลม', 'ปทุมวัน'],
    standardRate: '1,500 บาท/ทริป (4 ชม.)',
    education: 'วิทยาศาสตรบัณฑิต มหาวิทยาลัยธรรมศาสตร์',
    notes: 'พร้อมรับงานพาพบแพทย์ทริปใหม่ทันที สแตนด์บายรถรับส่งและอุปกรณ์ Wheelchair'
  },
  {
    id: 'stf-004',
    code: 'STF-ESC02',
    name: 'Kanda Chaichana',
    thaiName: 'กานดา ชัยชนะ',
    nickname: 'เมย์',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 28,
    phone: '086-778-1234',
    lineId: 'kanda_escort',
    email: 'kanda.escort@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'ผู้ช่วยพยาบาลพาพบแพทย์ (Escort Practical Nurse)',
    status: 'working',
    experienceYears: 5,
    rating: 4.95,
    totalCases: 215,
    currentAssignment: {
      type: 'escort_trip',
      patientName: 'คุณตาประเสริฐ เจริญวงศ์',
      locationOrRoom: 'โรงพยาบาลศิริราช ปิยมหาราชการุณย์',
      details: 'พาตรวจระบบประสาทและเปลี่ยนสายยางให้อาหาร NG Tube ณ คลินิกอายุรกรรมประสาท',
      startTime: '08:30 น.'
    },
    skills: ['ผู้ช่วยพยาบาล (PN)', 'ดูแลผู้ป่วยฟอกไตและโรคหัวใจ', 'ทักษะประสานงานคลินิกและเบิกจ่ายประกัน', 'ภาษาอังกฤษสื่อสารการแพทย์'],
    certifications: ['Practical Nurse (PN) License', 'Advanced Cardiac Life Support Companion'],
    serviceAreas: ['ธนบุรี', 'บางกอกน้อย', 'ปิ่นเกล้า', 'ราชพฤกษ์'],
    standardRate: '1,800 บาท/ทริป (4 ชม.)',
    education: 'ประกาศนียบัตรผู้ช่วยพยาบาล (PN) วิทยาลัยพยาบาลกองทัพบก'
  },
  {
    id: 'stf-005',
    code: 'STF-ESC03',
    name: 'Pakorn Phakdeesuk',
    thaiName: 'ปกรณ์ ภักดีสุข',
    nickname: 'นัท',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 29,
    phone: '084-556-2211',
    lineId: 'nut_paramedic',
    email: 'pakorn.p@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พนักงานพาพบแพทย์ & รถเข็นฉุกเฉิน (Mobility Assistant)',
    status: 'available',
    experienceYears: 4,
    rating: 4.85,
    totalCases: 98,
    skills: ['การจัดการรถเข็นและถังออกซิเจนพกพา', 'การสื่อสารสรุปคำถามแพทย์', 'จิตวิทยาผู้สูงวัย'],
    certifications: ['CPR & AED Healthcare Provider', 'Elderly Mobility Assistant'],
    serviceAreas: ['บางนา', 'สุขุมวิท', 'รามคำแหง', 'ประเวศ'],
    standardRate: '1,400 บาท/ทริป',
    education: 'อนุปริญญาวิทยาศาสตร์สุขภาพ มหาวิทยาลัยบูรพา'
  },
  {
    id: 'stf-006',
    code: 'STF-NH03',
    name: 'Wiphada Sukjai',
    thaiName: 'วิภาดา สุขใจ',
    nickname: 'โบว์',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 33,
    phone: '085-889-1122',
    lineId: 'bow_pt_rehab',
    email: 'wiphada.pt@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'นักกายภาพบำบัดประจำศูนย์ (Physiotherapist - PT)',
    status: 'working',
    experienceYears: 8,
    rating: 4.92,
    totalCases: 110,
    currentAssignment: {
      type: 'nursing_home_patient',
      patientName: 'ผู้ป่วยฟื้นฟูกล้ามเนื้อกลุ่ม Ward A',
      locationOrRoom: 'ห้องกายภาพบำบัดและฟื้นฟู ชั้น 1',
      details: 'จัดคอร์สฝึกทรงตัว ยืดเหยียดข้อต่อ และฝึกออกแรงกล้ามเนื้อขา',
      startTime: '09:00 น.'
    },
    skills: ['กายภาพบำบัดฟื้นฟูกล้ามเนื้ออ่อนแรง', 'การฝึกเดินและทรงตัว (Gait & Balance Training)', 'อัลตราซาวด์บำบัดลดปวด'],
    certifications: ['Physiotherapist License (สภากายภาพบำบัด)', 'Geriatric Physical Therapy Specialist'],
    serviceAreas: ['ศูนย์ Nursing Home Main Facility'],
    standardRate: '35,000 บาท/เดือน',
    education: 'กายภาพบำบัดบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย'
  },
  {
    id: 'stf-007',
    code: 'STF-NH04',
    name: 'Chatchawal Lertpanya',
    thaiName: 'ชัชวาล เลิศปัญญา',
    nickname: 'อาร์ม',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 30,
    phone: '089-771-4455',
    lineId: 'arm_care840',
    email: 'chatchawal.care@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พนักงานบริบาลประจำศูนย์ (Nursing Home Caregiver)',
    status: 'available',
    experienceYears: 5,
    rating: 4.82,
    totalCases: 45,
    skills: ['การพลิกตัวและจัดท่านอนป้องกันแผลกดทับ', 'การอาบน้ำและสุขอนามัยผู้ป่วย', 'การวัดสัญญาณชีพ'],
    certifications: ['NA 840 ชั่วโมง (กรม สบส.)', 'First Aid & CPR'],
    serviceAreas: ['ศูนย์ Nursing Home Main Facility'],
    standardRate: '22,000 บาท/เดือน',
    education: 'ประกาศนียบัตรบริบาลผู้สูงอายุ 840 ชม.'
  },
  {
    id: 'stf-008',
    code: 'STF-NH05',
    name: 'Somsak Wongthai',
    thaiName: 'สมศักดิ์ วงศ์ไทย',
    nickname: 'ศักดิ์',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 45,
    phone: '081-665-3322',
    lineId: 'somsak_driver',
    email: 'somsak.driver@carenest.health',
    category: 'nursing_home_escort',
    subRole: 'พนักงานขับรถรับส่งพยาบาล & พยุงผู้ป่วย (Ambulance Driver & Escort)',
    status: 'leave',
    experienceYears: 14,
    rating: 4.86,
    totalCases: 320,
    skills: ['ขับรถพยาบาลฉุกเฉินและรถตู้ลิฟต์ยกรถเข็น', 'การเคลื่อนย้ายผู้ป่วยเปลนอน (Stretcher)', 'การแก้ไขสถานการณ์เฉพาะหน้า'],
    certifications: ['Emergency Medical Responder (EMR)', 'Defensive Driving Certified 2025'],
    serviceAreas: ['กรุงเทพฯ และปริมณฑล'],
    standardRate: '25,000 บาท/เดือน',
    education: 'มัธยมศึกษาตอนปลาย และอบรมหลักสูตรกู้ชีพฉุกเฉิน',
    notes: 'ลากิจส่วนตัว 7-8 ก.ย. (กลับมาปฏิบัติงานวันที่ 9 ก.ย.)'
  },

  // ==========================================
  // กลุ่มที่ 2: พนักงานผู้ดูแลผู้ป่วยที่บ้าน (Home Care Caregivers)
  // ==========================================
  {
    id: 'stf-009',
    code: 'STF-HC01',
    name: 'Sasithorn Pornprasit',
    thaiName: 'ศศิธร พรประสิทธิ์',
    nickname: 'ศศิ',
    avatar: 'https://images.unsplash.com/photo-1594824813590-7f28ba24227f?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 36,
    phone: '089-112-3344',
    lineId: 'sasi_caregiver',
    email: 'sasi.care@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ดูแลผู้ป่วยที่บ้าน (Home Care NA Specialist)',
    status: 'working',
    experienceYears: 8,
    rating: 4.95,
    totalCases: 18,
    currentAssignment: {
      type: 'home_care_patient',
      patientName: 'คุณยายสมศรี รัตนพร',
      locationOrRoom: 'บ้านพักย่านอารีย์ (พญาไท)',
      details: 'ดูแลอาหารเบาหวาน จัดยา ตรวจวัดน้ำตาลปลายนิ้ว DTX และสัญญาณชีพ',
      startTime: '07:00 น.'
    },
    skills: ['การดูแลผู้ป่วยโรคเรื้อรัง (NCDs)', 'จัดยาตามมื้อและตรวจวัดน้ำตาล DTX', 'ทำอาหารเฉพาะโรค (เบาหวาน/ไต/เกาต์)', 'กายภาพบำบัดเบื้องต้น'],
    certifications: ['Elderly Care Certified Specialist (กรมการแพทย์)', 'Basic Life Support 2025', 'Diabetes & Hypertension Care'],
    serviceAreas: ['พญาไท', 'อารีย์', 'จตุจักร', 'ดินแดง'],
    standardRate: '26,000 บาท/เดือน',
    education: 'ประกาศนียบัตรพนักงานบริบาลผู้สูงอายุ (NA 840 ชั่วโมง) วิทยาลัยพยาบาลบรมราชชนนี'
  },
  {
    id: 'stf-010',
    code: 'STF-HC02',
    name: 'Manatsawee Deeprom',
    thaiName: 'มนัสวี ดีพร้อม',
    nickname: 'มินต์',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 32,
    phone: '081-998-7766',
    lineId: 'mint_pn_care',
    email: 'mint.care@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ช่วยพยาบาลดูแลผู้ป่วยติดเตียงที่บ้าน (PN Home Care)',
    status: 'working',
    experienceYears: 6,
    rating: 4.9,
    totalCases: 14,
    currentAssignment: {
      type: 'home_care_patient',
      patientName: 'คุณตาประเสริฐ เจริญวงศ์',
      locationOrRoom: 'หมู่บ้านปัญญารามอินทรา (คันนายาว)',
      details: 'ดูแลผู้ป่วยติดเตียง ให้อาหารทางสายยาง NG Tube ดูดเสมหะ และพลิกตัวป้องกันแผลกดทับ',
      startTime: '07:30 น.'
    },
    skills: ['ดูแลผู้ป่วยติดเตียงและหลัง Stroke', 'ให้อาหารทางสายยาง (NG/PEG Tube)', 'ดูดเสมหะและการพ่นยา', 'ทำแผลกดทับระดับ 1-3'],
    certifications: ['Practical Nurse (PN) License', 'Enteral Feeding & Suction Certified', 'Pressure Ulcer Care Specialist'],
    serviceAreas: ['คันนายาว', 'รามอินทรา', 'มีนบุรี', 'บึงกุ่ม'],
    standardRate: '30,000 บาท/เดือน',
    education: 'ผู้ช่วยพยาบาล (PN) มหาวิทยาลัยมหิดล'
  },
  {
    id: 'stf-011',
    code: 'STF-HC03',
    name: 'Kitti Somwong',
    thaiName: 'กิตติ สมวงศ์',
    nickname: 'โต้ง',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 29,
    phone: '090-221-5544',
    lineId: 'tong_physio',
    email: 'kitti.care@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ดูแลและฝึกฟื้นฟูกายภาพที่บ้าน (Exercise & Home Care)',
    status: 'available',
    experienceYears: 4,
    rating: 4.8,
    totalCases: 9,
    skills: ['การฟื้นฟูกล้ามเนื้อและฝึกการทรงตัว', 'การดูแลผู้ป่วยฟอกไตทางหลอดเลือด (Hemodialysis)', 'การอุ้มยกเคลื่อนย้ายผู้ป่วยตัวใหญ่'],
    certifications: ['Certified Elderly Exercise Trainer', 'First Aid & AED (Thai Red Cross)', 'Dialysis Care Companion'],
    serviceAreas: ['ลาดพร้าว', 'จตุจักร', 'รัชดา', 'ห้วยขวาง'],
    standardRate: '250 บาท/ชม. (หรือ 1,300 บาท/วัน)',
    education: 'วิทยาศาสตรบัณฑิต วิทยาศาสตร์การกีฬา มหาวิทยาลัยเกษตรศาสตร์',
    notes: 'พร้อมรับงานดูแลที่บ้านรายวัน/รายชั่วโมง ย่านลาดพร้าวและรัชดา'
  },
  {
    id: 'stf-012',
    code: 'STF-HC04',
    name: 'Chananchida Sawangjit',
    thaiName: 'ชนัญชิดา สว่างจิตต์',
    nickname: 'น้ำ',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 27,
    phone: '083-441-9988',
    lineId: 'nam_rehab',
    email: 'nam.care@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ดูแลผู้สูงอายุระยะพักฟื้นที่บ้าน (Post-Rehab Caregiver)',
    status: 'available',
    experienceYears: 3,
    rating: 4.85,
    totalCases: 8,
    skills: ['การจัดเตรียมอาหารคลีนสำหรับผู้สูงอายุ', 'การกระตุ้นความจำและสมอง', 'การพาเดินออกกำลังกายยามเช้า'],
    certifications: ['Elderly Caregiver Certificate 420 hrs', 'CPR & Basic First Aid'],
    serviceAreas: ['สุขุมวิท', 'บางนา', 'พระโขนง', 'อ่อนนุช'],
    standardRate: '22,000 บาท/เดือน (หรือ 1,000 บาท/วัน)',
    education: 'ประกาศนียบัตรวิชาชีพบริบาลผู้สูงอายุ 420 ชม.',
    notes: 'สถานะว่าง พร้อมเริ่มงานทันทีทั้งแบบไป-กลับ และรายสัปดาห์'
  },
  {
    id: 'stf-013',
    code: 'STF-HC05',
    name: 'Thanakrit Maneerat',
    thaiName: 'ธนกฤต มณีรัตน์',
    nickname: 'กริช',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    age: 34,
    phone: '088-332-1144',
    lineId: 'krit_dialysis',
    email: 'thanakrit.m@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ดูแลผู้ป่วยฟอกไตและแผลเบาหวานที่บ้าน (Dialysis & Wound Caregiver)',
    status: 'available',
    experienceYears: 7,
    rating: 4.91,
    totalCases: 16,
    skills: ['การดูแลสายฟอกไตทางหน้าท้อง (CAPD)', 'การทำแผลเบาหวานปลอดเชื้อ', 'การควบคุมอาหารจำกัดฟอสฟอรัส/โพแทสเซียม'],
    certifications: ['Peritoneal Dialysis Care Certified', 'Sterile Wound Dressing Certificate'],
    serviceAreas: ['ธนบุรี', 'ปิ่นเกล้า', 'ภาษีเจริญ', 'บางแค'],
    standardRate: '28,000 บาท/เดือน',
    education: 'อนุปริญญาวิทยาศาสตร์สุขภาพ มหาวิทยาลัยเชียงใหม่',
    notes: 'พร้อมรับงานเคสผู้ป่วยโรคไตและเบาหวาน ฝั่งธนบุรี'
  },
  {
    id: 'stf-014',
    code: 'STF-HC06',
    name: 'Panida Chanphen',
    thaiName: 'พนิดา จันทร์เพ็ญ',
    nickname: 'นิด',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 48,
    phone: '086-112-9900',
    lineId: 'panida_livein',
    email: 'panida.c@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ดูแลผู้สูงอายุแบบพักอาศัยประจำ (Live-in Caregiver 24 Hrs)',
    status: 'leave',
    experienceYears: 16,
    rating: 4.96,
    totalCases: 22,
    skills: ['ดูแลผู้สูงอายุ 24 ชั่วโมงแบบ Live-in', 'การทำอาหารไทยรสชาติดีและถูกหลักโภชนาการ', 'การดูแลผู้ป่วยความจำเสื่อมและนอนไม่หลับ'],
    certifications: ['Master Caregiver Level 3 (สมาคมบริบาลไทย)', 'Dementia Advanced Compassion Training'],
    serviceAreas: ['กรุงเทพฯ และปริมณฑล (Live-in 24 ชม.)'],
    standardRate: '32,000 บาท/เดือน (พักประจำ)',
    education: 'มัธยมศึกษาตอนปลาย และประกาศนียบัตรบริบาล 840 ชม.',
    notes: 'ลากิจพักผ่อนประจำเดือน (พร้อมรับงานเคสใหม่วันที่ 15 ก.ย.)'
  },
  {
    id: 'stf-015',
    code: 'STF-HC07',
    name: 'Juthamas Sapsiri',
    thaiName: 'จุฑามาศ ทรัพย์ศิริ',
    nickname: 'จ๋า',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    age: 38,
    phone: '089-445-6677',
    lineId: 'ja_nurse_care',
    email: 'juthamas.s@carenest.health',
    category: 'home_care',
    subRole: 'ผู้ช่วยพยาบาลดูแลผู้ป่วยพักฟื้นที่บ้าน (PN Home Care)',
    status: 'available',
    experienceYears: 9,
    rating: 4.89,
    totalCases: 19,
    skills: ['การดูแลผู้ป่วยหลังผ่าตัดใหญ่', 'การดูดเสมหะและพ่นยา', 'การประเมินภาวะขาดน้ำและสัญญาณชีพ'],
    certifications: ['Practical Nurse (PN) License', 'Elderly Fall Prevention'],
    serviceAreas: ['สาทร', 'สีลม', 'ยานนาวา', 'บางรัก'],
    standardRate: '27,000 บาท/เดือน',
    education: 'ผู้ช่วยพยาบาล (PN) โรงพยาบาลรามาธิบดี',
    notes: 'สถานะว่าง พร้อมรับเคสดูแลผู้ป่วยที่บ้านโซนสีลม-สาทร'
  }
];

