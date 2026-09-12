# 🌿 CareNest Platform - ระบบบริหารจัดการและติดตามการดูแลผู้ป่วยแบบครบวงจร

**CareNest** เป็นแพลตฟอร์มบริหารจัดการและติดตามการบริบาลสุขภาพผู้สูงอายุและผู้ป่วยพักฟื้นแบบองค์รวม (Patient Health & Home Caregiver Ecosystem) ครอบคลุมทั้งระบบ Web Admin Dashboard และ Mobile Application Simulation พร้อมระบบติดตามสัญญาณชีพ, GPS Check-in, แฟ้มสรุปก่อนพบแพทย์ (Medical Escort), แอนิเมชัน Infinite Auto-Scroll Showcase และระบบรายงานผู้บริหาร

---

## 🌟 ฟีเจอร์หลัก (Key Modules)

1. **สรุปรายชื่อผู้ป่วยทั้งหมด (All Patients Master Hub)**
   - รวมข้อมูลผู้ป่วยทั้ง 3 บริการ: ศูนย์ดูแลผู้สูงอายุ (Nursing Home), บริการพาพบแพทย์ (Medical Escort), และผู้ดูแลที่บ้าน (Home Care)
   - สรุปสถานะการใช้บริการ, โรคประจำตัว, ประวัติการแพ้ยา/อาหาร, และความเสี่ยงสูง (High Risk / Fall Risk)
   - รองรับ 3 มุมมอง: **🎬 เลื่อนขึ้นอัตโนมัติ 1 แถว (1-Row Auto Scroll)**, **🎴 การ์ดรายคน (Grid)**, และ **📋 ตารางภาพรวม (Table)**

2. **สรุปรายชื่อพนักงาน (Unified Staff & Caregiver Roster)**
   - จัดการพนักงาน 2 กลุ่มหลัก:
     - **กลุ่ม 1:** พนักงานศูนย์ Nursing Home & พนักงานพาพบแพทย์ Escort
     - **กลุ่ม 2:** ผู้ช่วยพยาบาลดูแลผู้ป่วยที่บ้าน (Home Care)
   - เช็กสถานะคนว่าง/ติดเคส/ลางานแบบเรียลไทม์ พร้อมเบอร์โทรและ LINE ID
   - รองรับมุมมอง **🎬 เลื่อนขึ้นอัตโนมัติ 1 แถว (1-Row Auto Scroll)**

3. **สรุปรายงานติดตามงาน (Task & Escort Tracking)**
   - **3.1 ปฏิทินนัดหมายแพทย์:** รายละเอียดคนไป, คนพาไป, คำถามที่ญาติฝากถามแพทย์ (Doctor Checklist)
   - **3.2 กราฟติดตามความพร้อมพนักงาน:** เช็คสถานะกำลังคนว่าง/ติดเคสตลอด 24 ชั่วโมง

4. **รายงานสรุปสำหรับผู้บริหาร (Executive Reports & Analytics)**
   - กราฟแนวโน้มยอดลูกค้าและยอดพนักงาน เลือกดูได้ทั้งแบบ **รายวัน / รายเดือน / รายปี**
   - วิเคราะห์สัดส่วนประเภทการบริการ อัตราการเข้าพัก และประสิทธิภาพทีมงาน

5. **เสียงตอบรับและความประทับใจ (Testimonials & Trust Showcase)**
   - แอนิเมชัน 3 คอลัมน์เลื่อนขึ้นแนวตั้งแบบ Infinite Loop จาก [21st.dev/@efferd/components/testimonials-columns-1](https://21st.dev/@efferd/components/testimonials-columns-1)
   - ระบบตัวกรองหมวดหมู่, ควบคุมความเร็ว, Hover-to-Pause, และฟอร์มจำลองส่งรีวิว

6. **ระบบจำลองการใช้งานบนมือถือ (Mobile App Simulator)**
   - จำลองหน้าจอสำหรับ Caregiver, Medical Escort, และ Family
   - บันทึกสัญญาณชีพด่วน, GPS Check-in, และรายงานประจำวัน

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling & UI:** Tailwind CSS (Custom Color Palette: Forest Sage, Warm Terracotta, Cream Ivory)
- **Icons:** Lucide React
- **Animations:** Motion (`motion/react` / Framer Motion)

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Getting Started)

```bash
# ติดตั้ง dependencies
npm install

# รันในโหมดพัฒนา (Development Server)
npm run dev

# บิลด์สำหรับ Production
npm run build
```

---

## 📄 ใบอนุญาต (License)

โปรเจกต์นี้พัฒนาสำหรับระบบบริหารจัดการ CareNest Platform
