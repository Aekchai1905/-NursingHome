import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Navbar } from './components/common/Navbar';
import { AllClientsOverview } from './components/client/AllClientsOverview';
import { StaffRoster } from './components/workforce/StaffRoster';
import { TaskTrackingDashboard } from './components/operations/TaskTrackingDashboard';
import { PeriodicReportsDashboard } from './components/analytics/PeriodicReportsDashboard';
import { CustomerPortal } from './components/portals/CustomerPortal';
import { StaffPortal } from './components/portals/StaffPortal';
import { TestimonialsSection } from './components/common/TestimonialsSection';
import { MobileAppView } from './components/mobile/MobileAppView';
import { ShieldCheck, Heart, Sparkles, Layers, Activity } from 'lucide-react';

const MainContent: React.FC = () => {
  const { viewMode, activeTab } = useApp();

  if (viewMode === 'mobile') {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sage-800 text-cream-200 shadow-xs">
            📱 Mobile App Simulation Mode
          </span>
          <h2 className="text-xl font-extrabold text-gray-900 mt-2">
            ประสบการณ์การใช้งานบนมือถือ (Caregiver / Escort / Family)
          </h2>
          <p className="text-xs text-gray-500">
            จำลองฟังก์ชัน GPS เช็กอิน, แฟ้มสรุปก่อนพบแพทย์, บันทึกสัญญาณชีพด่วน และส่งรายงานประจำวัน
          </p>
        </div>
        <MobileAppView />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF6F0]">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Section 1: สรุปรายชื่อผู้ป่วยทั้งหมด */}
          {(activeTab === 'all_clients' || activeTab === 'patients') && <AllClientsOverview />}

          {/* Section 2: สรุปรายชื่อพนักงาน */}
          {(activeTab === 'staff' || activeTab === 'caregivers') && <StaffRoster />}

          {/* Section 3: สรุปรายงานติดตามงาน (3.1 ปฏิทินนัดหมอ & 3.2 กราฟคนว่าง) */}
          {activeTab === 'appointments' && <TaskTrackingDashboard />}

          {/* Section 4: รายงานสรุปในแต่ละเรื่อง (4.1 ยอดลูกค้า & 4.2 ยอดพนักงาน: วัน/เดือน/ปี) */}
          {(activeTab === 'reports' || activeTab === 'analytics') && <PeriodicReportsDashboard />}

          {/* Section 5: เสียงตอบรับและความประทับใจ (Testimonials Columns Showcase) */}
          {activeTab === 'testimonials' && <TestimonialsSection />}

          {/* Role Portals Support */}
          {activeTab === 'customer_portal' && <CustomerPortal />}
          {activeTab === 'staff_portal' && <StaffPortal />}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-[#EAE2D3] py-6 text-xs text-[#5C6B64]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#1A2E25] font-bold">
            <span className="font-heading tracking-tight">CareNest Platform</span>
            <span className="text-[#DCD0BD]">•</span>
            <span className="text-[#5C6B64] font-normal">ระบบบริหารจัดการและติดตามการดูแลผู้ป่วยแบบครบวงจร</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#7D8C85]">
            <span className="flex items-center gap-1 text-[#2A9D68] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              PDPA & Medical Data Privacy Compliant
            </span>
            <span>REST API / Firebase FCM Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#FAF6F0] font-sans antialiased text-[#1A2E25]">
        <Header />
        <MainContent />
      </div>
    </AppProvider>
  );
}

export default App;
