import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  UserCheck, 
  Calendar as CalendarIcon, 
  Building2, 
  Home, 
  Car, 
  HeartHandshake, 
  Star, 
  CheckCircle2, 
  Clock, 
  Download, 
  Printer, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  FileText,
  AlertTriangle
} from 'lucide-react';

export const PeriodicReportsDashboard: React.FC = () => {
  const { patients, staff, appointments, dailyReports, checkins, setSelectedPatientId } = useApp();

  // Period Switcher: 'daily' | 'monthly' | 'yearly'
  const [periodType, setPeriodType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');

  // Selected Date / Month / Year
  const [selectedDay, setSelectedDay] = useState('2026-09-08');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedYear, setSelectedYear] = useState('2026');

  // Sub-tab: 4.1 Client Analytics vs 4.2 Staff Analytics
  const [activeSubTab, setActiveSubTab] = useState<'clients' | 'staff'>('clients');

  // Format header period label
  const periodDisplayLabel = useMemo(() => {
    if (periodType === 'daily') {
      return `รายงานประจำวันที่ ${selectedDay}`;
    } else if (periodType === 'monthly') {
      const monthNames = ['', 'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
      const [year, m] = selectedMonth.split('-');
      const mIdx = parseInt(m, 10);
      return `รายงานประจำเดือน ${monthNames[mIdx] || selectedMonth} ${year}`;
    } else {
      return `รายงานสรุปภาพรวมประจำปี ${selectedYear}`;
    }
  }, [periodType, selectedDay, selectedMonth, selectedYear]);

  // Client Analytics Statistics (4.1)
  const clientStats = useMemo(() => {
    const total = patients.length;
    const active = patients.filter(p => (p.serviceStatus || 'active') === 'active').length;
    const discharged = patients.filter(p => p.serviceStatus === 'discharged').length;
    const suspended = patients.filter(p => p.serviceStatus === 'suspended').length;
    const inactive = patients.filter(p => p.serviceStatus === 'inactive').length;

    const nursingHome = patients.filter(p => p.careType === 'nursing_home').length;
    const escort = patients.filter(p => p.careType === 'medical_escort').length;
    const homeCare = patients.filter(p => p.careType === 'home_care').length;

    const attention = patients.filter(p => p.healthStatus === 'attention').length;
    const monitor = patients.filter(p => p.healthStatus === 'monitor').length;
    const stable = patients.filter(p => p.healthStatus === 'stable').length;

    // Monthly Trend Mock Data (for 2026)
    const monthlyTrends = [
      { month: 'ม.ค.', total: 5, newClients: 2, discharged: 0 },
      { month: 'ก.พ.', total: 6, newClients: 1, discharged: 0 },
      { month: 'มี.ค.', total: 6, newClients: 1, discharged: 1 },
      { month: 'เม.ย.', total: 7, newClients: 2, discharged: 1 },
      { month: 'พ.ค.', total: 7, newClients: 1, discharged: 1 },
      { month: 'มิ.ย.', total: 8, newClients: 2, discharged: 1 },
      { month: 'ก.ค.', total: 8, newClients: 1, discharged: 1 },
      { month: 'ส.ค.', total: 8, newClients: 1, discharged: 1 },
      { month: 'ก.ย.', total: 8, newClients: 2, discharged: 1 }
    ];

    return {
      total,
      active,
      discharged,
      suspended,
      inactive,
      nursingHome,
      escort,
      homeCare,
      attention,
      monitor,
      stable,
      monthlyTrends
    };
  }, [patients]);

  // Staff Analytics Statistics (4.2)
  const staffStats = useMemo(() => {
    const total = staff.length;
    const working = staff.filter(s => s.status === 'working').length;
    const available = staff.filter(s => s.status === 'available').length;
    const leave = staff.filter(s => s.status === 'leave').length;

    const totalExperience = staff.reduce((acc, s) => acc + s.experienceYears, 0);
    const avgExperience = total > 0 ? (totalExperience / total).toFixed(1) : '0';

    const totalRatings = staff.reduce((acc, s) => acc + s.rating, 0);
    const avgRating = total > 0 ? (totalRatings / total).toFixed(1) : '5.0';

    const totalCases = staff.reduce((acc, s) => acc + s.totalCases, 0);
    const utilizationRate = total > 0 ? Math.round((working / total) * 100) : 0;

    // Mock Monthly Workload Trend
    const monthlyWorkload = [
      { month: 'พ.ค.', totalCases: 28, hoursWorked: 480, satisfaction: 4.8 },
      { month: 'มิ.ย.', totalCases: 34, hoursWorked: 520, satisfaction: 4.9 },
      { month: 'ก.ค.', totalCases: 40, hoursWorked: 560, satisfaction: 4.8 },
      { month: 'ส.ค.', totalCases: 46, hoursWorked: 610, satisfaction: 4.9 },
      { month: 'ก.ย.', totalCases: 52, hoursWorked: 680, satisfaction: 4.95 }
    ];

    return {
      total,
      working,
      available,
      leave,
      avgExperience,
      avgRating,
      totalCases,
      utilizationRate,
      monthlyWorkload
    };
  }, [staff]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner - Warm & Clean Aesthetic */}
      <div className="rounded-3xl bg-white text-[#1A2E25] p-6 sm:p-8 shadow-sm relative overflow-hidden border border-[#EAE2D3]">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#CF7C4E]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-10 w-56 h-56 bg-[#4D7D67]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#9E4E28] border border-[#F0BFA6] text-xs font-extrabold shadow-2xs">
              <BarChart3 className="w-3.5 h-3.5 text-[#CF7C4E]" />
              <span>ส่วนที่ 4: Periodic Executive Analytics & Reports</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#142332] font-heading">
              รายงานสรุปในแต่ละเรื่อง (Executive Reports)
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6B64] max-w-2xl leading-relaxed font-medium">
              สรุปสถิติและแนวโน้มเชิงลึก สามารถเลือกรายงานตามช่วงเวลา (วัน, เดือน, ปี) 
              ครอบคลุมรายงานสรุปยอดลูกค้า และรายงานสรุปยอดประสิทธิภาพพนักงาน
            </p>
          </div>

          {/* Export & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] text-[#142332] text-xs font-bold hover:bg-[#F4EFE5] transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#5C6B64]" />
              <span>พิมพ์รายงานสรุป</span>
            </button>
            <button
              onClick={() => alert('กำลังดาวน์โหลดรายงานสรุปในรูปแบบ Excel / PDF...')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#CF7C4E] hover:bg-[#BE673B] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>ส่งออกไฟล์ (.CSV / PDF)</span>
            </button>
          </div>
        </div>

        {/* Global Period Selector Controls (วัน / เดือน / ปี) */}
        <div className="mt-6 pt-6 border-t border-[#F4EFE5] flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Period Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#5C6B64]">เลือกรูปแบบรายงาน:</span>
            <div className="p-1 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] flex items-center gap-1">
              <button
                onClick={() => setPeriodType('daily')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  periodType === 'daily'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                📅 รายวัน (Daily)
              </button>
              <button
                onClick={() => setPeriodType('monthly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  periodType === 'monthly'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                🗓️ รายเดือน (Monthly)
              </button>
              <button
                onClick={() => setPeriodType('yearly')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  periodType === 'yearly'
                    ? 'bg-[#23382E] text-white shadow-xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                📊 รายปี (Yearly)
              </button>
            </div>
          </div>

          {/* Date / Month / Year Picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#142332]">{periodDisplayLabel}</span>
            {periodType === 'daily' && (
              <input
                type="date"
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E4D9C8] bg-[#FAF6F0] text-xs text-[#1A2E25] font-bold focus:outline-none focus:ring-2 focus:ring-[#23382E]"
              />
            )}
            {periodType === 'monthly' && (
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E4D9C8] bg-[#FAF6F0] text-xs text-[#1A2E25] font-bold focus:outline-none focus:ring-2 focus:ring-[#23382E] cursor-pointer"
              >
                <option value="2026-09">กันยายน 2026 (ปัจจุบัน)</option>
                <option value="2026-08">สิงหาคม 2026</option>
                <option value="2026-07">กรกฎาคม 2026</option>
                <option value="2026-06">มิถุนายน 2026</option>
              </select>
            )}
            {periodType === 'yearly' && (
              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E4D9C8] bg-[#FAF6F0] text-xs text-[#1A2E25] font-bold focus:outline-none focus:ring-2 focus:ring-[#23382E] cursor-pointer"
              >
                <option value="2026">ปี 2026 (พ.ศ. 2569)</option>
                <option value="2025">ปี 2025 (พ.ศ. 2568)</option>
              </select>
            )}
          </div>

        </div>

      </div>

      {/* Sub-tab Navigation (4.1 vs 4.2) */}
      <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#EAE2D3] shadow-xs">
        <button
          onClick={() => setActiveSubTab('clients')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'clients'
              ? 'bg-[#23382E] text-white shadow-xs'
              : 'text-[#5C6B64] hover:bg-[#FAF6F0] hover:text-[#1A2E25]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>4.1 รายงานสรุปยอดลูกค้า (Client Analytics)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('staff')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'staff'
              ? 'bg-[#23382E] text-white shadow-xs'
              : 'text-[#5C6B64] hover:bg-[#FAF6F0] hover:text-[#1A2E25]'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>4.2 รายงานสรุปยอดพนักงาน (Staff Analytics)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4.1 CLIENT ANALYTICS REPORT */}
      {/* ========================================================================= */}
      {activeSubTab === 'clients' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Metrics KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-3xl bg-white border border-[#EAE2D3] shadow-sm">
              <span className="text-[11px] text-[#5C6B64] font-bold block">👥 ยอดลูกค้ารวม</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#142332] font-heading">{clientStats.total}</span>
                <span className="text-xs text-[#7D8C85]">ราย</span>
              </div>
              <span className="text-[10px] text-[#1E7E52] font-bold block mt-1">↑ +25% เติบโตต่อเนื่อง</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#EAF7F0] border border-[#BEE7D0] shadow-sm">
              <span className="text-[11px] text-[#1E7E52] font-bold block">🟢 กำลังใช้บริการ (Active)</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#1E7E52] font-heading">{clientStats.active}</span>
                <span className="text-xs text-[#1E7E52]/80">ราย</span>
              </div>
              <span className="text-[10px] text-[#1E7E52] font-bold block mt-1">อัตราครองเตียง 88%</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#EEF5F9] border border-[#C6DEED] shadow-sm">
              <span className="text-[11px] text-[#2B5975] font-bold block">🔵 จำหน่ายกลับบ้านแล้ว</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#2B5975] font-heading">{clientStats.discharged}</span>
                <span className="text-xs text-[#2B5975]/80">ราย</span>
              </div>
              <span className="text-[10px] text-[#2B5975] font-bold block mt-1">ฟื้นฟูสุขภาพสำเร็จ</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#FDF6E8] border border-[#F6DC9F] shadow-sm">
              <span className="text-[11px] text-[#8F5B13] font-bold block">🟡 พักบริการชั่วคราว</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#8F5B13] font-heading">{clientStats.suspended}</span>
                <span className="text-xs text-[#8F5B13]/80">ราย</span>
              </div>
              <span className="text-[10px] text-[#8F5B13] font-bold block mt-1">รอดูอาการ/ไปต่างจังหวัด</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#FDF0EF] border border-[#F7BDB9] shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
              <span className="text-[11px] text-[#9C3E3A] font-bold block">🔴 สิ้นสุดการให้บริการ</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#9C3E3A] font-heading">{clientStats.inactive}</span>
                <span className="text-xs text-[#9C3E3A]/80">ราย</span>
              </div>
              <span className="text-[10px] text-[#9C3E3A] font-bold block mt-1">บันทึกสาเหตุครบถ้วน</span>
            </div>

          </div>

          {/* Visual Trend Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart 1: Monthly Client Trend Graph */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE5]">
                <h3 className="text-sm font-extrabold text-[#142332] font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#CF7C4E]" />
                  <span>แนวโน้มการเติบโตของจำนวนลูกค้า (Client Growth & Intake Trend)</span>
                </h3>
                <span className="text-[11px] text-[#5C6B64] font-semibold">ช่วงเวลา: {periodDisplayLabel}</span>
              </div>

              {/* Visual Bar Graph */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                {clientStats.monthlyTrends.map((m, idx) => {
                  const barHeight = (m.total / 10) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#142332] opacity-0 group-hover:opacity-100 transition-opacity">
                        {m.total} ราย
                      </span>
                      <div className="w-full max-w-[36px] bg-[#FAF0E6] rounded-xl overflow-hidden p-0.5 flex flex-col justify-end h-36">
                        <div
                          style={{ height: `${barHeight}%` }}
                          className="w-full bg-gradient-to-t from-[#23382E] to-[#4D7D67] rounded-lg transition-all group-hover:from-[#CF7C4E] group-hover:to-[#E49A76]"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#5C6B64] group-hover:text-[#142332]">
                        {m.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#5C6B64] pt-2 border-t border-[#F4EFE5]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#23382E]" />
                  <span>ลูกค้ารวมในระบบ</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#CF7C4E]" />
                  <span>รับเข้าใหม่เฉลี่ย 1-2 ราย/เดือน</span>
                </span>
              </div>
            </div>

            {/* Chart 2: Care Group & Risk Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#142332] font-heading pb-3 border-b border-[#F4EFE5]">
                  สัดส่วนกลุ่มบริการ & ระดับความเสี่ยง
                </h3>

                <div className="space-y-4 mt-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-[#142332] mb-1">
                      <span>🏥 1. Nursing Home</span>
                      <span>{clientStats.nursingHome} ราย ({Math.round((clientStats.nursingHome / clientStats.total) * 100)}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#FAF6F0] overflow-hidden">
                      <div style={{ width: `${(clientStats.nursingHome / clientStats.total) * 100}%` }} className="h-full bg-emerald-600 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[#142332] mb-1">
                      <span>🚗 2. นัดพบแพทย์ Escort</span>
                      <span>{clientStats.escort} ราย ({Math.round((clientStats.escort / clientStats.total) * 100)}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#FAF6F0] overflow-hidden">
                      <div style={{ width: `${(clientStats.escort / clientStats.total) * 100}%` }} className="h-full bg-sky-600 rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[#142332] mb-1">
                      <span>🏠 3. ดูแลที่บ้าน Home Care</span>
                      <span>{clientStats.homeCare} ราย ({Math.round((clientStats.homeCare / clientStats.total) * 100)}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#FAF6F0] overflow-hidden">
                      <div style={{ width: `${(clientStats.homeCare / clientStats.total) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Health Risk Pills */}
              <div className="p-3 rounded-2xl bg-[#FAF6F0] border border-[#EAE2D3] text-xs">
                <span className="font-bold text-[#142332] block mb-1">สถานะความเสี่ยงสุขภาพ:</span>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#9C3E3A]">🔴 เฝ้าระวัง: {clientStats.attention}</span>
                  <span className="text-[#8F5B13]">🟡 ติดตาม: {clientStats.monitor}</span>
                  <span className="text-[#1E7E52]">🟢 ปกติ: {clientStats.stable}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Detailed Summary Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#142332] font-heading">
              ตารางสรุปรายชื่อและการใช้บริการของลูกค้า ({patients.length} รายการ)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] border-b border-[#EAE2D3] text-[#142332] font-extrabold">
                    <th className="py-3 px-4">ลูกค้า / รหัส HN</th>
                    <th className="py-3 px-3">กลุ่มบริการ</th>
                    <th className="py-3 px-3">วันที่เริ่มรับบริการ</th>
                    <th className="py-3 px-3">ผู้ดูแลประจำเคส</th>
                    <th className="py-3 px-3">สถานะการบริการ</th>
                    <th className="py-3 px-3">หมายเหตุ / สาเหตุหยุดบริการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE5] text-[#142332]">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={p.avatar} alt={p.thaiName} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span 
                              onClick={() => setSelectedPatientId(p.id)}
                              className="font-extrabold hover:text-[#CF7C4E] hover:underline cursor-pointer"
                            >
                              {p.thaiName}
                            </span>
                            <span className="text-[10px] text-[#5C6B64] block font-mono font-bold">{p.hn}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold">
                          {p.careType === 'nursing_home' ? '🏥 Nursing Home' : p.careType === 'medical_escort' ? '🚗 นัดพบแพทย์' : '🏠 ดูแลที่บ้าน'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5C6B64]">
                        {p.serviceStartDate || '2026-01-15'}
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        {p.primaryCaregiverName || 'ทีมบริบาลประจำศูนย์'}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.serviceStatus === 'active' || !p.serviceStatus ? 'bg-[#EAF7F0] text-[#1E7E52]' :
                          p.serviceStatus === 'discharged' ? 'bg-[#EEF5F9] text-[#2B5975]' :
                          p.serviceStatus === 'suspended' ? 'bg-[#FDF6E8] text-[#8F5B13]' : 'bg-[#FDF0EF] text-[#9C3E3A]'
                        }`}>
                          {p.serviceStatus === 'active' || !p.serviceStatus ? '🟢 กำลังใช้บริการ' :
                           p.serviceStatus === 'discharged' ? '🔵 จำหน่ายแล้ว' :
                           p.serviceStatus === 'suspended' ? '🟡 พักบริการ' : '🔴 สิ้นสุดบริการ'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5C6B64] max-w-xs truncate">
                        {p.inactiveReason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4.2 STAFF ANALYTICS REPORT */}
      {/* ========================================================================= */}
      {activeSubTab === 'staff' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Key Metrics KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-3xl bg-white border border-[#EAE2D3] shadow-sm">
              <span className="text-[11px] text-[#5C6B64] font-bold block">👤 พนักงานทั้งหมด</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#142332] font-heading">{staffStats.total}</span>
                <span className="text-xs text-[#7D8C85]">คน</span>
              </div>
              <span className="text-[10px] text-[#1E7E52] font-bold block mt-1">ประสบการณ์เฉลี่ย {staffStats.avgExperience} ปี</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#EAF7F0] border border-[#BEE7D0] shadow-sm">
              <span className="text-[11px] text-[#1E7E52] font-bold block">🟢 อัตราการจัดสรรงาน</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#1E7E52] font-heading">{staffStats.utilizationRate}%</span>
              </div>
              <span className="text-[10px] text-[#1E7E52] font-bold block mt-1">กำลังปฏิบัติงาน {staffStats.working} คน</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#FAF0E6] border border-[#F0BFA6] shadow-sm">
              <span className="text-[11px] text-[#9E4E28] font-bold block">★ ความพึงพอใจเฉลี่ย</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#9E4E28] font-heading">{staffStats.avgRating}</span>
                <span className="text-xs text-[#9E4E28]/80">/ 5.0</span>
              </div>
              <span className="text-[10px] text-[#9E4E28] font-bold block mt-1">ประเมินจากครอบครัวลูกค้า</span>
            </div>

            <div className="p-4 rounded-3xl bg-[#EEF5F9] border border-[#C6DEED] shadow-sm">
              <span className="text-[11px] text-[#2B5975] font-bold block">📋 เคสสะสมที่ดูแล</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#2B5975] font-heading">{staffStats.totalCases}</span>
                <span className="text-xs text-[#2B5975]/80">เคส</span>
              </div>
              <span className="text-[10px] text-[#2B5975] font-bold block mt-1">การดูแลปลอดภัย 100%</span>
            </div>

            <div className="p-4 rounded-3xl bg-white border border-[#EAE2D3] shadow-sm col-span-2 sm:col-span-4 lg:col-span-1">
              <span className="text-[11px] text-[#5C6B64] font-bold block">📍 GPS & Daily Logs</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-black text-[#1E7E52] font-heading">98.5%</span>
              </div>
              <span className="text-[10px] text-[#1E7E52] font-bold block mt-1">เช็กอินและส่งรายงานตรงเวลา</span>
            </div>

          </div>

          {/* Visual Staff Performance & Workload Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE5]">
                <h3 className="text-sm font-extrabold text-[#142332] font-heading flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#CF7C4E]" />
                  <span>ชั่วโมงการทำงานและจำนวนเคสที่ดูแล (Workload & Hours Distribution)</span>
                </h3>
                <span className="text-[11px] text-[#5C6B64] font-semibold">{periodDisplayLabel}</span>
              </div>

              <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
                {staffStats.monthlyWorkload.map((w, idx) => {
                  const barHeight = (w.hoursWorked / 700) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#142332] opacity-0 group-hover:opacity-100 transition-opacity">
                        {w.hoursWorked} ชม. ({w.totalCases} เคส)
                      </span>
                      <div className="w-full max-w-[42px] bg-[#FAF0E6] rounded-xl overflow-hidden p-0.5 flex flex-col justify-end h-36">
                        <div
                          style={{ height: `${barHeight}%` }}
                          className="w-full bg-gradient-to-t from-[#23382E] to-[#4D7D67] rounded-lg transition-all group-hover:from-[#CF7C4E] group-hover:to-[#E49A76]"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-[#5C6B64] group-hover:text-[#142332]">
                        {w.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#5C6B64] pt-2 border-t border-[#F4EFE5]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#23382E]" />
                  <span>ชั่วโมงการปฏิบัติหน้าที่จริง</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-md bg-[#CF7C4E]" />
                  <span>คะแนนความพึงพอใจ 4.9+ / 5.0</span>
                </span>
              </div>
            </div>

            {/* Department Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-[#142332] font-heading pb-3 border-b border-[#F4EFE5]">
                  สัดส่วนพนักงานแยกตามกลุ่มงาน
                </h3>

                <div className="space-y-4 mt-4 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-[#142332] mb-1">
                      <span>🏥 Nursing Home & Escort</span>
                      <span>{staff.filter(s => s.category === 'nursing_home_escort').length} คน</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#FAF6F0] overflow-hidden">
                      <div style={{ width: '60%' }} className="h-full bg-[#2B5975] rounded-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-[#142332] mb-1">
                      <span>🏠 ผู้ดูแลที่บ้าน Home Care</span>
                      <span>{staff.filter(s => s.category === 'home_care').length} คน</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#FAF6F0] overflow-hidden">
                      <div style={{ width: '40%' }} className="h-full bg-[#CF7C4E] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#EAF7F0] border border-[#BEE7D0] text-xs">
                <span className="font-extrabold text-[#1E7E52] block mb-1">✓ มาตรฐานการคัดกรองพนักงาน:</span>
                <p className="text-[11px] text-[#1E7E52] leading-snug">
                  พนักงานทุกคนผ่านการตรวจสอบประวัติอาชญากรรม (Criminal Background Check), มีใบรับรองวิชาชีพ NA/PN และผ่านการอบรม CPR & First Aid ครบ 100%
                </p>
              </div>

            </div>

          </div>

          {/* Staff Roster Performance Table */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE2D3] shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#142332] font-heading">
              ตารางสรุปผลงานและการปฏิบัติงานของพนักงาน ({staff.length} คน)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0] border-b border-[#EAE2D3] text-[#142332] font-extrabold">
                    <th className="py-3 px-4">พนักงาน / รหัส</th>
                    <th className="py-3 px-3">กลุ่มงาน & ตำแหน่ง</th>
                    <th className="py-3 px-3">สถานะปัจจุบัน</th>
                    <th className="py-3 px-3">ประสบการณ์</th>
                    <th className="py-3 px-3">เคสสะสม</th>
                    <th className="py-3 px-3">เรตติ้งความพึงพอใจ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE5] text-[#142332]">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-[#FAF6F0] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={s.avatar} alt={s.thaiName} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-extrabold">{s.thaiName}</span>
                            <span className="text-[10px] text-[#5C6B64] block font-mono font-bold">{s.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold block">{s.subRole}</span>
                        <span className="text-[10px] text-[#7D8C85]">
                          {s.category === 'nursing_home_escort' ? 'ศูนย์ NH & Escort' : 'ผู้ดูแลที่บ้าน'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.status === 'available' ? 'bg-[#EAF7F0] text-[#1E7E52]' :
                          s.status === 'working' ? 'bg-[#FDF6E8] text-[#8F5B13]' : 'bg-[#FDF0EF] text-[#9C3E3A]'
                        }`}>
                          {s.status === 'available' ? '🟢 ว่างพร้อมงาน' : s.status === 'working' ? '🟡 ติดเคส' : '🔴 ลาพัก'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#5C6B64]">
                        {s.experienceYears} ปี
                      </td>
                      <td className="py-3 px-3 font-bold">
                        {s.totalCases} เคส
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#8F5B13]">★ {s.rating.toFixed(1)} / 5.0</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
