"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch, IconBell, IconMail, IconClock, IconCalendar, IconArrowRight } from "@/components/scholar/Icons";
import CourseSection from "@/components/scholar/CourseSection";
import type { CourseData } from "@/components/scholar/CourseCard";
import { courses as allCourses } from "@/data/courses";

/* ============================================================
   格物学院 · 学子端 — 主页面
   设计规范：黑白灰水墨新中式，三栏(侧栏+主内容+手机预览)
   搜索功能：搜索典籍页课程
   ============================================================ */

/* ---------- Mock 封面图 — picsum 文化/书籍主题 ---------- */
const COVERS = {
  daxue:    "https://picsum.photos/seed/classics-book/400/300",
  chuanxi:  "https://picsum.photos/seed/philosophy-scroll/400/300",
  jinrong:  "https://picsum.photos/seed/finance-chart/400/300",
  sunzi:    "https://picsum.photos/seed/strategy-general/400/300",
  lunyu:    "https://picsum.photos/seed/confucius-analects/400/300",
  fengxian: "https://picsum.photos/seed/risk-management/400/300",
  shuju:    "https://picsum.photos/seed/data-science/400/300",
  daode:    "https://picsum.photos/seed/tao-te-ching/400/300",
  python:   "https://picsum.photos/seed/python-quant/400/300",
  shijing:  "https://picsum.photos/seed/poetry-classic/400/300",
  tongji:   "https://picsum.photos/seed/statistics-learn/400/300",
};

/* ---------- Mock 数据 ---------- */
const myCourses: CourseData[] = [
  { id: "c1", title: "《大学》精读",     category: "伦理文化", cover: COVERS.daxue,    progress: 78, rating: 4.9, mentor: "王阳明" },
  { id: "c2", title: "风险管理基础",     category: "保险精算", cover: COVERS.fengxian, progress: 60, rating: 4.5, mentor: "陈省身" },
  { id: "c3", title: "数据分析导论",     category: "数据科学", cover: COVERS.shuju,    progress: 45, rating: 4.3, mentor: "吴思远" },
  { id: "c4", title: "金融数学建模",     category: "金融工程", cover: COVERS.jinrong,  progress: 92, rating: 4.7, mentor: "李归" },
];

const featuredCourses: CourseData[] = [
  { id: "f1", title: "《大学》精读",         category: "伦理文化", cover: COVERS.daxue,    progress: 78, rating: 4.9, mentor: "王阳明" },
  { id: "f2", title: "《传习录》研读",       category: "心学经典", cover: COVERS.chuanxi,  progress: 65, rating: 4.8, mentor: "陆九渊" },
  { id: "f3", title: "金融数学建模",         category: "金融工程", cover: COVERS.jinrong,  progress: 92, rating: 4.7, mentor: "陈省身" },
  { id: "f4", title: "《孙子兵法》与决策",   category: "战略思维", cover: COVERS.sunzi,    progress: 55, rating: 4.7, mentor: "孙武" },
];

const requiredCourses: CourseData[] = [
  { id: "r1", title: "《论语》精讲",         category: "伦理文化", cover: COVERS.lunyu,    progress: 82, required: true },
  { id: "r2", title: "风险管理基础",         category: "保险精算", cover: COVERS.fengxian, progress: 60, required: true },
  { id: "r3", title: "数据分析导论",         category: "数据科学", cover: COVERS.shuju,    progress: 45, required: true },
];

const selectionCourses: CourseData[] = [
  { id: "s1", title: "《道德经》现代解读",   category: "道家哲学", cover: COVERS.daode,    progress: 70, rating: 4.4 },
  { id: "s2", title: "Python 与量化投资",    category: "编程应用", cover: COVERS.python,   progress: 50, rating: 4.3 },
  { id: "s3", title: "《诗经》鉴赏",         category: "文学艺术", cover: COVERS.shijing,  progress: 38, rating: 4.2 },
  { id: "s4", title: "统计学习基础",         category: "数据科学", cover: COVERS.tongji,   progress: 88, rating: 4.1 },
];

/* ---------- 原有小组件 ---------- */
function DataStatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub: string }) {
  return (
    <motion.div className="bg-[#f7f7f7] rounded-[12px] p-5 cursor-pointer"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
      <div className="text-[#000] mb-3">{icon}</div>
      <p className="text-[28px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-[13px] text-[#333] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[11px] text-[#000] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p>
    </motion.div>
  );
}

function ActivityCard({ date, month, title, time, location, speaker }: { date: string; month: string; title: string; time: string; location: string; speaker: string }) {
  return (
    <motion.div className="flex gap-4 p-4 bg-white rounded-[12px] border border-[#eee] cursor-pointer"
      whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}>
      <div className="w-12 h-12 bg-[#f7f7f7] rounded-[10px] flex flex-col items-center justify-center flex-shrink-0 border border-[#eee]">
        <span className="text-[18px] text-[#000] font-bold leading-none" style={{ fontFamily: "var(--font-display)" }}>{date}</span>
        <span className="text-[10px] text-[#000] mt-0.5 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{month}</span>
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] text-[#333] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{title}</h4>
        <p className="text-[12px] text-[#000] m-0 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>{time} | {location} | {speaker}</p>
      </div>
      <span className="text-[#ccc] self-center"><IconArrowRight /></span>
    </motion.div>
  );
}

/* ============================================================ */
export default function ScholarHome() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const username = "SHA";

  // Dynamic greeting based on local time
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6) return "晚安";
    if (h < 12) return "早安";
    if (h < 18) return "午安";
    return "晚安";
  };
  const greetingWord = getGreeting();

  // Search courses from the courses list
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allCourses
      .filter((c) =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      )
      .slice(0, 6); // max 6 results in dropdown
  }, [search]);

  const stats = [
    { icon: <IconClock />, value: s.hero_progress_val, label: s.hero_progress, sub: "本周" },
    { icon: <IconMail />, value: s.hero_hours_val, label: s.hero_hours, sub: "总计" },
    { icon: <IconCalendar />, value: s.hero_credits_val, label: s.hero_credits, sub: "总计" },
    { icon: <IconBell />, value: s.hero_rank_val, label: s.hero_rank, sub: "本院" },
  ];

  const activities = [
    { date: "25", month: "五月", title: "《论语》研讨会", time: "14:00-16:00", location: "格物书院·明理堂", speaker: "主讲：王老师" },
    { date: "28", month: "五月", title: "风险管理案例分享会", time: "10:00-12:00", location: "线上会议", speaker: "主讲：陈师者" },
  ];

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      {/* ====== Header ====== */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
            {greetingWord}，
            <span style={{ fontFamily: "'Times New Roman', serif" }}>{username}</span>
          </h1>
          <p className="text-[14px] text-[#000] m-0 mt-1.5" style={{ fontFamily: "var(--font-serif)" }}>{s.hero_subtitle}</p>
        </div>
        <div className="flex items-center gap-4 mt-1">
          <span className="text-[#000] cursor-pointer hover:text-[#333] transition-colors"><IconBell /></span>
          <span className="text-[#000] cursor-pointer hover:text-[#333] transition-colors"><IconMail /></span>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-[12px] text-[#333] font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>{username[0]}</div>
            <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>{username}</span>
          </div>
        </div>
      </div>

      {/* Search — with course search dropdown */}
      <div className="relative w-full mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
          placeholder={s.search_placeholder}
          className="w-full h-[46px] pl-5 pr-12 border border-[#cccccc] rounded-[12px] text-[14px] text-[#333] outline-none bg-white transition-colors focus:border-[#666]"
          style={{ fontFamily: "var(--font-serif)" }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000] cursor-pointer"><IconSearch /></span>

        {/* Search results dropdown */}
        <AnimatePresence>
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#ddd] shadow-lg z-50 overflow-hidden"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            >
              {searchResults.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    router.push(`/${locale}/scholar/courses/${course.id}`);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[#f0f0f0] last:border-b-0 bg-transparent cursor-pointer hover:bg-[#f9f9f9] transition-colors"
                >
                  <img
                    src={course.coverImage}
                    alt=""
                    className="w-10 h-10 rounded-[6px] object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#333] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>
                      {course.title}
                    </p>
                    <p className="text-[11px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
                      {course.instructor} · {course.category} · ★{course.rating}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-display)" }}>
                    {course.duration}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results */}
        {search.trim() && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#ddd] shadow-lg z-50 p-5 text-center">
            <p className="text-[13px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
              未找到相关课程
            </p>
          </div>
        )}
      </div>

      {/* ====== Stats ====== */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((st) => <DataStatCard key={st.label} icon={st.icon} value={st.value} label={st.label} sub={st.sub} />)}
      </div>

      {/* ====== 我的课程 ====== */}
      <CourseSection title={s.courses_title} moreLabel={s.courses_more} courses={myCourses} columns={4} variant="small" />

      {/* ====== 镇院典籍 ====== */}
      <CourseSection title={s.featured_title} moreLabel={s.featured_more} courses={featuredCourses} columns={2} variant="large" showRating showMentor />

      {/* ====== 修习必读 ====== */}
      <CourseSection title={s.required_title} moreLabel={s.required_more} courses={requiredCourses} columns={3} variant="medium" showBadge badgeLabel={s.required_badge} />

      {/* ====== 格物精选 ====== */}
      <CourseSection title={s.selection_title} moreLabel={s.selection_more} courses={selectionCourses} columns={4} variant="small" />

      {/* ====== 近期活动 ====== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.activity_title}</h2>
          <span className="text-[13px] text-[#000] cursor-pointer hover:text-[#333] hover:underline transition-colors font-bold" style={{ fontFamily: "var(--font-serif)" }}>{s.activity_more} →</span>
        </div>
        <div className="flex flex-col gap-3">
          {activities.map((a) => <ActivityCard key={a.title} date={a.date} month={a.month} title={a.title} time={a.time} location={a.location} speaker={a.speaker} />)}
        </div>
      </div>
    </motion.div>
  );
}
