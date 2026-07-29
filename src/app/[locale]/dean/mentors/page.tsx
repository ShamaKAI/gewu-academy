"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { mentors } from "@/data/mentors";
import { courses } from "@/data/courses";

export default function DeanMentorsPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>师者管理</h1>
          <p className="text-[13px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{mentors.length} 位师者 · 管理教师生态</p>
        </div>
        <button onClick={() => alert("邀请师者功能即将开放")}
          className="px-5 py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>+ 邀请师者</button>
      </div>

      <div className="space-y-4">
        {mentors.map((m, i) => {
          const mCourses = m.courseIds.map((cid) => courses.find((c) => c.id === cid)).filter(Boolean);
          const avgRating = mCourses.length > 0 ? (mCourses.reduce((s, c) => s + (c?.rating || 0), 0) / mCourses.length).toFixed(1) : "—";
          return (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="p-5 bg-white rounded-[14px] border-2 border-[#000] flex items-center gap-5">
              <img src={m.avatar} alt={m.name} className="w-[70px] h-[70px] rounded-full object-cover border-2 border-[#000] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-3 mb-1">
                  <h2 className="text-[18px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{m.name}</h2>
                  <span className="text-[13px] text-[#000] opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>{m.nameEn}</span>
                  <span className="px-2 py-[2px] rounded-[4px] text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32]" style={{ fontFamily: "var(--font-serif)" }}>已认证</span>
                </div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {m.specialties.slice(0, 3).map((sp) => (
                    <span key={sp} className="text-[11px] px-2 py-[2px] rounded-[4px] border border-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{sp}</span>
                  ))}
                </div>
                <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{mCourses.length} 门课程 · 均分 {avgRating}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]" style={{ fontFamily: "var(--font-serif)" }}>查看</button>
                <button className="px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]" style={{ fontFamily: "var(--font-serif)" }}>编辑</button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
