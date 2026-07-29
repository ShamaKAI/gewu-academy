"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { mentors } from "@/data/mentors";

export default function MentorSelector() {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const handleSelect = (mentorId: string) => {
    localStorage.setItem("gewu-mentor-id", mentorId);
    router.push(`/${locale}/mentor`);
  };

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen px-10 py-20" style={{ background: "#fff" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Logo */}
      <div className="text-center mb-12">
        <h1 className="text-[36px] text-[#000] tracking-[calc(var(--ls-scale)*6px)] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-calligraphy)" }}>
          格物讲堂
        </h1>
        <p className="text-[14px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] uppercase opacity-40 m-0" style={{ fontFamily: "var(--font-display)" }}>
          MENTOR PORTAL
        </p>
      </div>

      <h2 className="text-[20px] text-[#000] tracking-[calc(var(--ls-scale)*4px)] mb-8 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
        选择先生身份
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 max-w-4xl">
        {mentors.map((m, i) => (
          <motion.button key={m.id}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.35 }}
            onClick={() => handleSelect(m.id)}
            className="flex flex-col items-center gap-3 p-6 bg-white rounded-[16px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-center"
            whileHover={{ y: -4, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-md opacity-15 scale-110 bg-[#000]" />
              <img src={m.avatar} alt={m.name} className="relative w-[80px] h-[80px] rounded-full object-cover border-[2px] border-[#000]" />
            </div>
            <div>
              <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{m.name}</p>
              <p className="text-[12px] text-[#000] m-0 mt-0.5 opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>{m.nameEn}</p>
              <p className="text-[10px] text-[#000] mt-2 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{m.courseIds.length} 门课程</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
