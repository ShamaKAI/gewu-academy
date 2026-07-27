"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { IconSearch, IconBell, IconMail, IconClock, IconCalendar, IconArrowRight } from "@/components/scholar/Icons";

/* ============================================================
   格物学院 · 学子端 — 主页面
   设计规范：黑白灰水墨新中式，三栏(侧栏+主内容+手机预览)
   ============================================================ */

/** 数据统计卡片 */
function DataStatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub: string }) {
  return (
    <motion.div
      className="bg-[#f7f7f7] rounded-[12px] p-5 cursor-pointer"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
    >
      <div className="text-[#666] mb-3">{icon}</div>
      <p className="text-[28px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-[13px] text-[#333] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[11px] text-[#999] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p>
    </motion.div>
  );
}

/** 课程卡片 */
function CourseCard({ title, category, progress, cover }: { title: string; category: string; progress: number; cover: string }) {
  return (
    <motion.div
      className="bg-white rounded-[12px] border border-[#eee] overflow-hidden cursor-pointer min-w-[200px] flex-shrink-0"
      style={{ width: "calc(25% - 12px)" }}
      whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
    >
      {/* Cover image — ink wash gradient */}
      <div className="h-[100px] bg-[#e8e8e8] relative flex items-center justify-center overflow-hidden">
        {/* Simulated ink wash texture */}
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(ellipse at 30% 50%, #000 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, #333 0%, transparent 50%)" }} />
        <span className="relative text-[13px] text-[#666] font-bold z-10" style={{ fontFamily: "var(--font-serif)" }}>{cover}</span>
      </div>
      <div className="p-3">
        <h4 className="text-[14px] text-[#333] font-bold m-0 mb-1 truncate" style={{ fontFamily: "var(--font-serif)" }}>{title}</h4>
        <p className="text-[11px] text-[#999] m-0" style={{ fontFamily: "var(--font-serif)" }}>{category}</p>
      </div>
    </motion.div>
  );
}

/** 活动卡片 */
function ActivityCard({ date, month, title, time, location, speaker }: { date: string; month: string; title: string; time: string; location: string; speaker: string }) {
  return (
    <motion.div
      className="flex gap-4 p-4 bg-white rounded-[12px] border border-[#eee] cursor-pointer"
      whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
    >
      {/* Date block */}
      <div className="w-12 h-12 bg-[#f7f7f7] rounded-[10px] flex flex-col items-center justify-center flex-shrink-0 border border-[#eee]">
        <span className="text-[18px] text-[#000] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>{date}</span>
        <span className="text-[10px] text-[#999] mt-0.5 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{month}</span>
      </div>
      {/* Content */}
      <div className="flex-1">
        <h4 className="text-[14px] text-[#333] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{title}</h4>
        <p className="text-[12px] text-[#666] m-0 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
          {time} | {location} | {speaker}
        </p>
      </div>
      <span className="text-[#ccc] self-center"><IconArrowRight /></span>
    </motion.div>
  );
}

/* ============================================================ */
export default function ScholarHome() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [search, setSearch] = useState("");
  // 从登录账号派生显示名: gwxy2026 → SHA
  const username = "SHA";

  const stats = [
    { icon: <IconClock />, value: s.hero_progress_val, label: s.hero_progress, sub: "本周" },
    { icon: <IconMail />, value: s.hero_hours_val, label: s.hero_hours, sub: "总计" },
    { icon: <IconCalendar />, value: s.hero_credits_val, label: s.hero_credits, sub: "总计" },
    { icon: <IconBell />, value: s.hero_rank_val, label: s.hero_rank, sub: "本院" },
  ];

  const courses = [
    { title: "《大学》精读", category: "伦理文化", progress: 78, cover: "大学" },
    { title: "风险管理基础", category: "保险精算", progress: 60, cover: "风险" },
    { title: "数据分析导论", category: "数据科学", progress: 45, cover: "数据" },
    { title: "金融数学建模", category: "金融工程", progress: 92, cover: "金融" },
  ];

  const activities = [
    { date: "25", month: "五月", title: "《论语》研讨会", time: "14:00-16:00", location: "格物书院·明理堂", speaker: "主讲：王老师" },
    { date: "28", month: "五月", title: "风险管理案例分享会", time: "10:00-12:00", location: "线上会议", speaker: "主讲：陈师者" },
  ];

  return (
    <motion.div
      className="px-10 py-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ====== Header: greeting + actions + search ====== */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 leading-tight"
            style={{ fontFamily: "var(--font-serif)" }}>
            {s.hero_greeting.replace("{name}", "")}
            <span style={{ fontFamily: "var(--font-display)" }}>{username}</span>
          </h1>
          <p className="text-[14px] text-[#666] m-0 mt-1.5"
            style={{ fontFamily: "var(--font-serif)" }}>
            {s.hero_subtitle}
          </p>
        </div>
        {/* Top-right icons + avatar */}
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[#666] cursor-pointer hover:text-[#333] transition-colors"><IconBell /></span>
          <span className="text-[#666] cursor-pointer hover:text-[#333] transition-colors"><IconMail /></span>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-[12px] text-[#333] font-bold"
              style={{ fontFamily: "var(--font-serif)" }}>{username[0]}</div>
            <span className="text-[13px] text-[#333] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{username}</span>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative w-full mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={s.search_placeholder}
          className="w-full h-[46px] pl-5 pr-12 border border-[#cccccc] rounded-[12px] text-[14px] text-[#333] outline-none bg-white transition-colors focus:border-[#666]"
          style={{ fontFamily: "var(--font-serif)" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] cursor-pointer"><IconSearch /></span>
      </div>

      {/* ====== Stats row ====== */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((st) => (
          <DataStatCard key={st.label} icon={st.icon} value={st.value} label={st.label} sub={st.sub} />
        ))}
      </div>

      {/* ====== Courses section ====== */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>
            {s.courses_title}
          </h2>
          <span className="text-[13px] text-[#999] cursor-pointer hover:text-[#333] hover:underline transition-colors font-bold"
            style={{ fontFamily: "var(--font-serif)" }}>{s.courses_more} →</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {courses.map((co) => (
            <CourseCard key={co.title} title={co.title} category={co.category} progress={co.progress} cover={co.cover} />
          ))}
        </div>
      </div>

      {/* ====== Activities section ====== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>
            {s.activity_title}
          </h2>
          <span className="text-[13px] text-[#999] cursor-pointer hover:text-[#333] hover:underline transition-colors font-bold"
            style={{ fontFamily: "var(--font-serif)" }}>{s.activity_more} →</span>
        </div>
        <div className="flex flex-col gap-3">
          {activities.map((a) => (
            <ActivityCard key={a.title} date={a.date} month={a.month} title={a.title} time={a.time} location={a.location} speaker={a.speaker} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
