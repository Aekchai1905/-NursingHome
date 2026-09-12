import React from "react";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
  tag?: string;
  location?: string;
  category?: 'family' | 'medical' | 'escort' | 'general';
}

export interface TestimonialsColumnProps {
  testimonials: TestimonialItem[];
  duration?: number;
  className?: string;
  isPaused?: boolean;
}

export const TestimonialsColumn: React.FC<TestimonialsColumnProps> = ({
  testimonials,
  duration = 15,
  className = "",
  isPaused = false,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        animate={isPaused ? { translateY: "0%" } : { translateY: "-50%" }}
        transition={{
          duration: duration || 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].fill(0).map((_, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {testimonials.map((item, itemIndex) => (
              <div
                key={`${groupIndex}-${itemIndex}-${item.name}`}
                className="relative p-6 sm:p-7 rounded-3xl border border-[#EAE2D3] bg-white/90 dark:bg-[#1A2E25]/90 backdrop-blur-md shadow-sm hover:shadow-xl hover:border-[#CF7C4E]/40 transition-all duration-300 group hover:-translate-y-1"
              >
                {/* Header with Star Rating & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: item.rating || 5 }).map((_, starIdx) => (
                      <Star key={starIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {item.tag && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF6F0] text-[#23382E] border border-[#EAE2D3] group-hover:bg-[#CF7C4E]/10 group-hover:text-[#CF7C4E] transition-colors">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Quote Icon Background */}
                <Quote className="w-8 h-8 text-[#EAE2D3] absolute right-5 top-5 opacity-40 group-hover:text-[#CF7C4E]/30 transition-colors pointer-events-none" />

                {/* Testimonial Text */}
                <p className="text-sm leading-relaxed text-[#2D3F36] dark:text-[#E2EDE7] font-normal mb-6 relative z-10">
                  "{item.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-[#F0EAE1] relative z-10">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-11 w-11 rounded-full object-cover border-2 border-[#CF7C4E]/30 shadow-2xs group-hover:border-[#CF7C4E] transition-colors shrink-0"
                    loading="lazy"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="font-extrabold text-sm tracking-tight text-[#1A2E25] dark:text-white truncate font-heading">
                      {item.name}
                    </div>
                    <div className="text-xs text-[#5C6B64] dark:text-[#9FB5AA] leading-tight truncate mt-0.5">
                      {item.role} {item.location ? `• ${item.location}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonialsColumn;
