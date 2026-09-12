import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TestimonialsColumn, TestimonialItem } from '../ui/testimonials-columns-1';
import { 
  Sparkles, 
  Star, 
  ShieldCheck, 
  Heart, 
  Play, 
  Pause, 
  PlusCircle, 
  CheckCircle2, 
  Send, 
  Users, 
  Stethoscope, 
  Car, 
  Award,
  MessageSquareHeart,
  X
} from 'lucide-react';

const mockTestimonials: TestimonialItem[] = [
  {
    text: "ประทับใจระบบ GPS Check-in และการบันทึกสัญญาณชีพแบบเรียลไทม์มากค่ะ ตอนไปทำงานต่างประเทศสามารถเปิดดูความดันและกิจวัตรประจำวันของคุณแม่ได้ตลอดเวลา รู้สึกอุ่นใจและคลายกังวลได้จริงๆ",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    name: "คุณวิภาวรรณ ศิริวัฒนา",
    role: "ญาติผู้ป่วย (บุตรสาวคุณยายสมศรี)",
    location: "กรุงเทพฯ",
    rating: 5,
    tag: "Home Care VIP",
    category: "family"
  },
  {
    text: "บริการ Medical Escort พาคุณพ่อไปพบแพทย์ที่ รพ.ศิริราช ช่วยประหยัดเวลาและลดความเครียดของครอบครัวได้มาก เจ้าหน้าที่มีแฟ้มสรุปก่อนพบแพทย์ครบถ้วน แพทย์ชมว่าข้อมูลสัญญาณชีพละเอียดมาก",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    name: "คุณธนกร สุขเจริญ",
    role: "ญาติผู้ป่วยโรคหลอดเลือดสมอง",
    location: "นนทบุรี",
    rating: 5,
    tag: "Medical Escort",
    category: "escort"
  },
  {
    text: "ในฐานะแพทย์เวชศาสตร์ผู้สูงอายุ ระบบ CareNest ช่วยให้ติดตาม Care Plan และการปรับยาของผู้ป่วยได้อย่างแม่นยำ การมีบันทึกประวัติการแพ้ยาและสัญญาณชีพย้อนหลังช่วยลดความเสี่ยงทางการแพทย์ได้สูงมาก",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200",
    name: "นพ. กิตติศักดิ์ เมธาพงศ์",
    role: "แพทย์ที่ปรึกษาด้านอายุรกรรม",
    location: "ศูนย์บริบาลผู้สูงอายุ",
    rating: 5,
    tag: "Medical Advisory",
    category: "medical"
  },
  {
    text: "ผู้ดูแลของ CareNest ผ่านการอบรมและคัดกรองมาดีเยี่ยม มีความใจเย็นและใส่ใจสุขอนามัยของคุณยายอย่างดีมาก ช่วยฝึกทำกายภาพเบื้องต้นจนคุณยายเริ่มลุกนั่งได้เองแล้วค่ะ",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    name: "พญ. ภัทราภรณ์ วรรณกิจ",
    role: "ญาติผู้ป่วยพักฟื้นผ่าตัดกระดูกสะโพก",
    location: "ปทุมธานี",
    rating: 5,
    tag: "Rehab Care",
    category: "family"
  },
  {
    text: "การทำงานในฐานะพนักงานพาพบแพทย์ผ่านระบบนี้สะดวกมากครับ หน้าสรุปประวัติมีคำถามที่ญาติฝากถามหมออย่างชัดเจน เมื่อตรวจเสร็จก็อัปโหลดรูปใบเสร็จและใบนัดใหม่ส่งตรงถึงญาติได้ทันที",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    name: "นายวรวุฒิ ชัยชนะ",
    role: "เจ้าหน้าที่ Medical Escort ประจำศูนย์",
    location: "CareNest Center",
    rating: 5,
    tag: "Staff Escort",
    category: "escort"
  },
  {
    text: "ศูนย์เนอร์สซิ่งโฮมสะอาด บรรยากาศร่มรื่น และมีระบบบริหารเวรพนักงานที่พร้อมจัดหาผู้ดูแลทดแทนได้ทันทีเมื่อมีผู้ดูแลลา ทำให้การดูแลคุณพ่อไม่เคยขาดตอนเลยแม้แต่วันเดียว",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    name: "คุณนลินรัตน์ เกียรติไพบูลย์",
    role: "ญาติผู้ป่วยพักฟื้นระยะยาว",
    location: "สมุทรปราการ",
    rating: 5,
    tag: "Nursing Home",
    category: "family"
  },
  {
    text: "ระบบแจ้งเตือนฉุกเฉินเมื่อสัญญาณชีพผิดปกติทำงานได้รวดเร็วมาก มีครั้งหนึ่งความดันคุณตาพุ่งสูง ระบบส่งแจ้งเตือนทันทีทำให้พยาบาลและทีมแพทย์เข้าปฐมพยาบาลได้ทันท่วงที",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    name: "พว. สุภาพร มิ่งขวัญ",
    role: "พยาบาลวิชาชีพหัวหน้าเวร",
    location: "CareNest Clinic",
    rating: 5,
    tag: "Clinical Team",
    category: "medical"
  },
  {
    text: "ประทับใจฟังก์ชันคำถามแพทย์ (Doctor Questions Checklist) มากครับ เราสามารถพิมพ์ฝากคำถามที่กังวลไว้ล่วงหน้า และเจ้าหน้าที่นำไปถามคุณหมอพร้อมบันทึกคำตอบกลับมาให้อย่างครบถ้วน",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    name: "คุณปิยะวัฒน์ เลิศสถิตย์",
    role: "ญาติผู้ป่วยโรคเบาหวานและความดัน",
    location: "กรุงเทพฯ",
    rating: 5,
    tag: "Doctor Q&A",
    category: "family"
  },
  {
    text: "ในฐานะผู้ดูแลประจำบ้าน แอปพลิเคชันใช้งานง่ายมาก เช็กอินพิกัด GPS ได้แม่นยำ บันทึกมื้ออาหารและการขับถ่ายได้สะดวกรวดเร็ว ทำให้มีเวลาโฟกัสกับการดูแลผู้ป่วยอย่างเต็มที่",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    name: "น.ส. กานดา ศรีสะอาด",
    role: "ผู้ช่วยพยาบาล (PN Home Care)",
    location: "CareNest Staff",
    rating: 5,
    tag: "Caregiver Specialist",
    category: "medical"
  }
];

export const TestimonialsSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'family' | 'medical' | 'escort'>('all');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<'normal' | 'slow' | 'fast'>('normal');
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Form State for Write Review
  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    location: 'กรุงเทพฯ',
    text: '',
    rating: 5,
    category: 'family' as const
  });

  const filteredTestimonials = selectedCategory === 'all'
    ? mockTestimonials
    : mockTestimonials.filter(item => item.category === selectedCategory);

  // Speed mapping (durations in seconds)
  const speedDurations = {
    normal: { col1: 22, col2: 28, col3: 25 },
    slow: { col1: 34, col2: 40, col3: 36 },
    fast: { col1: 14, col2: 18, col3: 16 }
  }[speedMultiplier];

  // Distribute items into 3 columns
  const firstColumn = filteredTestimonials.filter((_, i) => i % 3 === 0);
  const secondColumn = filteredTestimonials.filter((_, i) => i % 3 === 1);
  const thirdColumn = filteredTestimonials.filter((_, i) => i % 3 === 2);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setNewReview({
        name: '',
        role: '',
        location: 'กรุงเทพฯ',
        text: '',
        rating: 5,
        category: 'family'
      });
    }, 1800);
  };

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#23382E] via-[#1A2E25] to-[#12221B] text-white p-8 sm:p-12 shadow-xl border border-[#2E473B]">
        {/* Subtle glowing ambient circles */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#CF7C4E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#2A9D68]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-[#E5EDE8] mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#CF7C4E]" />
            เสียงตอบรับและความประทับใจ (Testimonials & Trust Showcase)
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight leading-tight text-white"
          >
            ความไว้วางใจจากครอบครัว & เสียงยืนยันจากทีมวิชาชีพ
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-[#C8DCD1] max-w-2xl mx-auto leading-relaxed"
          >
            สัมผัสประสบการณ์การดูแลแบบองค์รวมที่ผสานระบบบันทึกสุขภาพ GPS Check-in และความใส่ใจมาตรฐานสากล เพื่อรอยยิ้มและคุณภาพชีวิตที่ดีที่สุดของผู้สูงอายุ
          </motion.p>

          {/* Key Stat Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8"
          >
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="text-xl sm:text-2xl font-black font-heading">4.96</span>
              </div>
              <p className="text-[11px] text-[#A5C0B3] font-medium">คะแนนความพึงพอใจ</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-[#4ADE80] mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black font-heading">1,200+</span>
              </div>
              <p className="text-[11px] text-[#A5C0B3] font-medium">ครอบครัวที่ไว้วางใจ</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-[#CF7C4E] mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black font-heading">100%</span>
              </div>
              <p className="text-[11px] text-[#A5C0B3] font-medium">ทีมบริบาลผ่านการรับรอง</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-center gap-1 text-[#38BDF8] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xl sm:text-2xl font-black font-heading">&lt; 15 นาที</span>
              </div>
              <p className="text-[11px] text-[#A5C0B3] font-medium">การตอบสนองเหตุเร่งด่วน</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EAE2D3] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-center sm:justify-start">
          <span className="text-xs font-bold text-[#5C6B64] mr-1 hidden sm:inline">หมวดหมู่:</span>
          {[
            { id: 'all' as const, label: 'ทั้งหมด (All)', icon: MessageSquareHeart },
            { id: 'family' as const, label: 'ญาติ & ครอบครัว (Family)', icon: Heart },
            { id: 'medical' as const, label: 'ทีมแพทย์ & พยาบาล (Medical)', icon: Stethoscope },
            { id: 'escort' as const, label: 'บริการพาพบแพทย์ (Escort)', icon: Car },
          ].map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#23382E] text-white shadow-xs scale-102'
                    : 'bg-[#FAF6F0] text-[#3D4C44] hover:bg-[#F4EFE5] border border-[#EAE2D3]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Animation & Action Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-center md:justify-end">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isPaused
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 shadow-2xs'
            }`}
            title={isPaused ? 'เริ่มเลื่อนต่อ (Resume Scroll)' : 'หยุดการเลื่อนชั่วคราว (Pause Scroll)'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            <span>{isPaused ? 'เล่นต่อ (Resume)' : 'หยุดชั่วคราว (Pause)'}</span>
          </button>

          {/* Speed Toggle */}
          <div className="bg-[#FAF6F0] p-1 rounded-xl flex items-center border border-[#EAE2D3]">
            {(['slow', 'normal', 'fast'] as const).map(s => (
              <button
                key={s}
                onClick={() => setSpeedMultiplier(s)}
                className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                  speedMultiplier === s
                    ? 'bg-[#23382E] text-white shadow-2xs'
                    : 'text-[#5C6B64] hover:text-[#1A2E25]'
                }`}
              >
                {s === 'slow' ? 'ช้า' : s === 'normal' ? 'ปกติ' : 'เร็ว'}
              </button>
            ))}
          </div>

          {/* Write a Review Button */}
          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#CF7C4E] hover:bg-[#B86B40] text-white shadow-xs transition-all cursor-pointer hover:scale-102"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>เขียนรีวิวความประทับใจ</span>
          </button>
        </div>
      </div>

      {/* Main Animated Testimonials Columns with Gradient Fade Mask */}
      <section 
        className="relative bg-gradient-to-b from-[#FAF6F0] via-white to-[#FAF6F0] rounded-3xl border border-[#EAE2D3] p-4 sm:p-8 shadow-xs overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="max-w-7xl mx-auto">
          {/* Info pill about hover to pause */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-[#7D8C85] bg-white px-3 py-1 rounded-full border border-[#EAE2D3] shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D68] animate-ping" />
              เลื่อนเมาส์ชี้บนการ์ด (Hover) เพื่อหยุดอ่านข้อความได้ตามต้องการ
            </span>
          </div>

          {/* The 3 Animated Scrolling Columns */}
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] max-h-[760px] overflow-hidden py-4">
            {/* Column 1 */}
            <TestimonialsColumn
              testimonials={firstColumn}
              duration={speedDurations.col1}
              isPaused={isPaused}
              className="w-full max-w-[360px]"
            />

            {/* Column 2 (md screens and up) */}
            <TestimonialsColumn
              testimonials={secondColumn}
              duration={speedDurations.col2}
              isPaused={isPaused}
              className="hidden md:block w-full max-w-[360px]"
            />

            {/* Column 3 (lg screens and up) */}
            <TestimonialsColumn
              testimonials={thirdColumn}
              duration={speedDurations.col3}
              isPaused={isPaused}
              className="hidden lg:block w-full max-w-[360px]"
            />
          </div>
        </div>
      </section>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EAE2D3] animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {reviewSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-heading">
                  ขอบพระคุณสำหรับความประทับใจ!
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  ข้อความรีวิวของคุณได้รับการบันทึกและส่งต่อไปยังทีมงานเพื่อเป็นกำลังใจในการพัฒนาบริการอย่างต่อเนื่อง
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#23382E] text-white flex items-center justify-center shadow-xs">
                    <MessageSquareHeart className="w-5 h-5 text-[#E5EDE8]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1A2E25] font-heading">
                      ร่วมส่งต่อความประทับใจ (Write a Review)
                    </h3>
                    <p className="text-xs text-gray-500">
                      แชร์เรื่องราวการดูแลและความไว้วางใจที่มีต่อ CareNest
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ระดับความพึงพอใจ
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-gray-600 ml-2">
                      ({newReview.rating} ดาว)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      ชื่อ-นามสกุลของคุณ *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น คุณสมชาย เจริญสุข"
                      value={newReview.name}
                      onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#CF7C4E] focus:ring-1 focus:ring-[#CF7C4E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      บทบาท / ความสัมพันธ์
                    </label>
                    <input
                      type="text"
                      placeholder="เช่น บุตรชายคุณยายมาลี"
                      value={newReview.role}
                      onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#CF7C4E] focus:ring-1 focus:ring-[#CF7C4E] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    หมวดหมู่บริการ
                  </label>
                  <select
                    value={newReview.category}
                    onChange={e => setNewReview({ ...newReview, category: e.target.value as any })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#CF7C4E] focus:ring-1 focus:ring-[#CF7C4E] outline-none bg-white"
                  >
                    <option value="family">ญาติและครอบครัว (Home Care / Nursing Home)</option>
                    <option value="escort">บริการพาพบแพทย์ (Medical Escort)</option>
                    <option value="medical">ทีมแพทย์และสหสาขาวิชาชีพ (Clinical Staff)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ข้อความบอกเล่าความประทับใจ *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="เล่าประสบการณ์ที่คุณประทับใจ เช่น การดูแลของพนักงาน, การติดตามผลผ่านระบบ..."
                    value={newReview.text}
                    onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-gray-200 focus:border-[#CF7C4E] focus:ring-1 focus:ring-[#CF7C4E] outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#23382E] text-white hover:bg-[#1A2E25] shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>ส่งรีวิวความประทับใจ</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
