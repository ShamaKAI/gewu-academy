"use client";

import { motion } from "framer-motion";
import type { MentorProfile } from "@/data/mentors";

export default function MentorCard({ mentor, collapsed }: { mentor: MentorProfile; collapsed?: boolean }) {
  if (collapsed) return null;

  return (
    <motion.div
      className="mb-8 p-6 bg-white rounded-[16px] border-2 border-[#000]"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-full blur-md opacity-20 scale-110 bg-[#000]" />
          <img src={mentor.avatar} alt={mentor.name}
            className="relative w-[90px] h-[90px] rounded-full object-cover border-[3px] border-[#000]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 mb-2">
            <h1 className="text-[26px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{mentor.name}</h1>
            <span className="text-[15px] text-[#000] opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>{mentor.nameEn}</span>
            <button className="ml-auto text-[12px] text-[#000] px-3 py-1.5 rounded-[8px] border border-[#000] bg-transparent cursor-pointer hover:bg-[#f0f0f0] transition-colors font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              编辑资料
            </button>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap gap-2 mb-3">
            {mentor.achievements.map((ach, i) => (
              <span key={i} className="text-[11px] text-[#000] px-2.5 py-[2px] rounded-[5px] border border-[#000] font-bold bg-[#fafafa]" style={{ fontFamily: "var(--font-serif)" }}>{ach}</span>
            ))}
          </div>

          {/* Experience snippet */}
          <p className="text-[13px] text-[#000] leading-relaxed m-0 mb-3 opacity-70 line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>
            {mentor.experience}
          </p>

          {/* Motto */}
          {mentor.motto && (
            <div className="border-l-[3px] border-[#000] pl-4 py-1">
              <p className="text-[14px] text-[#000] italic m-0" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
                &ldquo;{mentor.motto}&rdquo;
              </p>
              <p className="text-[10px] text-[#000] m-0 mt-1 opacity-40" style={{ fontFamily: "var(--font-serif)" }}>&mdash; 座右铭</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
