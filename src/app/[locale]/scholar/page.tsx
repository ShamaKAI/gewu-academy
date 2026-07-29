"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch, IconBell, IconMail, IconClock, IconCalendar, IconArrowRight } from "@/components/scholar/Icons";
import CourseSection from "@/components/scholar/CourseSection";
import type { CourseData } from "@/components/scholar/CourseCard";
import { courses as staticCourses } from "@/data/courses";
import type { Course } from "@/data/courses";
import { newsItems } from "@/data/news";

function loadPublished(): Course[] {
  try { const raw = localStorage.getItem("gewu-published-courses"); if (raw) return JSON.parse(raw); } catch {}
  return [];
}

/* ============================================================
   格物学院 · 学子端 — 主页面
   模块查看更多 → 书院内钻取（纵向列表+搜索），
   点击具体课程 → 典籍详情页。
   近期活动数据打通院讯。
   ============================================================ */

type DrillKey = "my" | "featured" | "required" | "selection" | "mentor" | null;

interface ModuleInfo { key: DrillKey; title: string; courses: CourseData[]; }

const COVERS = {
  daxue: "https://picsum.photos/seed/classics-book/400/300",
  chuanxi: "https://picsum.photos/seed/philosophy-scroll/400/300",
  jinrong: "https://picsum.photos/seed/finance-chart/400/300",
  sunzi: "https://picsum.photos/seed/strategy-general/400/300",
  lunyu: "https://picsum.photos/seed/confucius-analects/400/300",
  fengxian: "https://picsum.photos/seed/risk-management/400/300",
  shuju: "https://picsum.photos/seed/data-science/400/300",
  daode: "https://picsum.photos/seed/tao-te-ching/400/300",
  python: "https://picsum.photos/seed/python-quant/400/300",
  shijing: "https://picsum.photos/seed/poetry-classic/400/300",
  tongji: "https://picsum.photos/seed/statistics-learn/400/300",
};

const myCourses: CourseData[] = [
  { id: "great-learning", title: "《大学》精读", category: "伦理文化", cover: COVERS.daxue, progress: 78, rating: 4.9, mentor: "王阳明" },
  { id: "risk-mgmt", title: "风险管理基础", category: "保险精算", cover: COVERS.fengxian, progress: 60, rating: 4.5, mentor: "陈省身" },
  { id: "data-science", title: "数据分析导论", category: "数据科学", cover: COVERS.shuju, progress: 45, rating: 4.3, mentor: "吴思远" },
  { id: "fin-math", title: "金融数学建模", category: "金融工程", cover: COVERS.jinrong, progress: 92, rating: 4.7, mentor: "李归" },
];
const featuredCourses: CourseData[] = [
  { id: "great-learning", title: "《大学》精读", category: "伦理文化", cover: COVERS.daxue, progress: 78, rating: 4.9, mentor: "王阳明" },
  { id: "lunyu", title: "《传习录》研读", category: "心学经典", cover: COVERS.chuanxi, progress: 65, rating: 4.8, mentor: "陆九渊" },
  { id: "fin-math", title: "金融数学建模", category: "金融工程", cover: COVERS.jinrong, progress: 92, rating: 4.7, mentor: "陈省身" },
  { id: "sunzi", title: "《孙子兵法》与决策", category: "战略思维", cover: COVERS.sunzi, progress: 55, rating: 4.7, mentor: "孙武" },
];
const requiredCourses: CourseData[] = [
  { id: "lunyu", title: "《论语》精讲", category: "伦理文化", cover: COVERS.lunyu, progress: 82, required: true },
  { id: "risk-mgmt", title: "风险管理基础", category: "保险精算", cover: COVERS.fengxian, progress: 60, required: true },
  { id: "data-science", title: "数据分析导论", category: "数据科学", cover: COVERS.shuju, progress: 45, required: true },
];
const selectionCourses: CourseData[] = [
  { id: "daodejing", title: "《道德经》现代解读", category: "道家哲学", cover: COVERS.daode, progress: 70, rating: 4.4 },
  { id: "python-quant", title: "Python 与量化投资", category: "编程应用", cover: COVERS.python, progress: 50, rating: 4.3 },
  { id: "shijing", title: "《诗经》鉴赏", category: "文学艺术", cover: COVERS.shijing, progress: 38, rating: 4.2 },
  { id: "stats-ml", title: "统计学习基础", category: "数据科学", cover: COVERS.tongji, progress: 88, rating: 4.1 },
];
// All courses from data + published, deduplicated and formatted for display
const formatCourse = (c: Course): CourseData => ({
  id: c.id, title: c.title, category: c.category,
  cover: c.coverImage || `https://picsum.photos/seed/${c.id}/400/250`,
  progress: c.progress, rating: c.rating, mentor: c.instructor,
});

/* ── Activities — synced from news data (latest 4 activities) ── */
const activityData = newsItems.filter((n) => n.category === "activity").slice(0, 4);

function DataStatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub: string }) {
  return (
    <motion.div className="bg-[#f7f7f7] rounded-[12px] p-5 cursor-pointer border border-[#000]"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <div className="text-[#000] mb-3">{icon}</div>
      <p className="text-[28px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[13px] text-[#000] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[11px] text-[#000] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p>
    </motion.div>
  );
}

function ActivityCard({ newsItem, locale }: { newsItem: typeof newsItems[number]; locale: string }) {
  const router = useRouter();
  const d = new Date(newsItem.date);
  return (
    <motion.div className="flex gap-4 p-4 bg-white rounded-[12px] border border-[#000] cursor-pointer"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
      onClick={() => router.push(`/${locale}/scholar/news?open=${newsItem.id}`)}>
      <img src={newsItem.cover} alt={newsItem.title} className="w-[80px] h-[60px] rounded-[8px] object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h4 className="text-[15px] text-[#000] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{newsItem.title}</h4>
        <p className="text-[12px] text-[#000] m-0 leading-relaxed line-clamp-1" style={{ fontFamily: "var(--font-serif)" }}>{newsItem.summary}</p>
      </div>
      <span className="text-[12px] text-[#000] self-center flex-shrink-0 opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>
        {d.getMonth() + 1}/{d.getDate()}
      </span>
    </motion.div>
  );
}

/* ── Inline drill-down course list ── */
function DrillDownList({ title, courses, locale, onBack }: { title: string; courses: CourseData[]; locale: string; onBack: () => void }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.trim().toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || (c.mentor || "").toLowerCase().includes(q));
  }, [search, courses]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70" style={{ fontFamily: "var(--font-serif)" }}>← 返回书院首页</button>

      <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{title}</h1>
      <p className="text-[13px] text-[#000] m-0 mb-6 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{filtered.length} 门课程</p>

      {/* Search bar */}
      <div className="relative w-full mb-6">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索课程名称、导师..."
          className="w-full h-[42px] pl-5 pr-12 border border-[#000] rounded-[10px] text-[14px] text-[#000] outline-none bg-white"
          style={{ fontFamily: "var(--font-serif)" }} />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000]"><IconSearch /></span>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {filtered.length === 0 ? (
          <p className="text-[#000] py-10 opacity-50 text-center" style={{ fontFamily: "var(--font-serif)" }}>未找到匹配的课程</p>
        ) : (
          filtered.map((c, i) => (
            <motion.button key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              onClick={() => router.push(`/${locale}/scholar/courses/${c.id}`)}
              className="flex items-center gap-5 p-4 bg-white rounded-[12px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left transition-colors"
              whileHover={{ y: -1, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <img src={c.cover} alt={c.title} className="w-[120px] h-[80px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</h3>
                  {c.required && <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold bg-[#C04040] text-white" style={{ fontFamily: "var(--font-serif)" }}>必修</span>}
                </div>
                <p className="text-[12px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.mentor} · {c.category}</p>
                {c.progress !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-[4px] bg-[#eee] rounded-full max-w-[160px]"><div className="h-full bg-[#000] rounded-full" style={{ width: `${c.progress}%` }} /></div>
                    <span className="text-[10px] text-[#000]" style={{ fontFamily: "'Times New Roman', serif" }}>{c.progress}%</span>
                  </div>
                )}
              </div>
              <span className="text-[#000] text-[20px] opacity-30 flex-shrink-0">→</span>
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
}

/* ============================================================ */
export default function ScholarHome() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;
  const [search, setSearch] = useState("");
  const [drillDown, setDrillDown] = useState<DrillKey>(null);
  const username = "SHA";
  const [pubCourses, setPubCourses] = useState<Course[]>([]);

  useEffect(() => { setPubCourses(loadPublished()); }, []);

  const allCourses = useMemo(() => {
    const seen = new Set(staticCourses.map((c) => c.id));
    const extra = pubCourses.filter((c) => !seen.has(c.id));
    return [...staticCourses, ...extra];
  }, [pubCourses]);

  const getGreeting = () => { const h = new Date().getHours(); if (h < 6) return "晚安"; if (h < 12) return "早安"; if (h < 18) return "午安"; return "晚安"; };
  const greetingWord = getGreeting();

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return allCourses.filter((c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0, 6);
  }, [search, allCourses]);

  const stats = [
    { icon: <IconClock />, value: s.hero_progress_val, label: s.hero_progress, sub: "本周" },
    { icon: <IconMail />, value: s.hero_hours_val, label: s.hero_hours, sub: "总计" },
    { icon: <IconCalendar />, value: s.hero_credits_val, label: s.hero_credits, sub: "总计" },
    { icon: <IconBell />, value: s.hero_rank_val, label: s.hero_rank, sub: "本院" },
  ];

  const modules: { key: DrillKey; title: string; moreLabel: string; previewCourses: CourseData[]; fullCourses: CourseData[]; cols: 2|3|4; variant: "large"|"medium"|"small"; showRating?: boolean; showMentor?: boolean; showBadge?: boolean; badgeLabel?: string }[] = [
    { key: "my", title: s.courses_title, moreLabel: s.courses_more, previewCourses: myCourses, fullCourses: myCourses, cols: 4, variant: "small" },
    { key: "featured", title: s.featured_title, moreLabel: s.featured_more, previewCourses: featuredCourses, fullCourses: featuredCourses, cols: 2, variant: "large", showRating: true, showMentor: true },
    { key: "required", title: s.required_title, moreLabel: s.required_more, previewCourses: requiredCourses, fullCourses: requiredCourses, cols: 3, variant: "medium", showBadge: true, badgeLabel: s.required_badge },
    { key: "selection", title: s.selection_title, moreLabel: s.selection_more, previewCourses: selectionCourses, fullCourses: selectionCourses, cols: 4, variant: "small" },
    { key: "mentor", title: "所有课程", moreLabel: "查看全部", previewCourses: allCourses.map(formatCourse).slice(0, 12), fullCourses: allCourses.map(formatCourse), cols: 4, variant: "small" },
  ];

  const activeModule = drillDown ? modules.find((m) => m.key === drillDown) : null;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {activeModule ? (
          /* ====== DRILL-DOWN VIEW ====== */
          <DrillDownList key={activeModule.key} title={activeModule.title} courses={activeModule.fullCourses} locale={locale} onBack={() => setDrillDown(null)} />
        ) : (
          /* ====== MAIN VIEW ====== */
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {greetingWord}，<span style={{ fontFamily: "'Times New Roman', serif" }}>{username}</span>
                </h1>
                <p className="text-[14px] text-[#000] m-0 mt-1.5" style={{ fontFamily: "var(--font-serif)" }}>{s.hero_subtitle}</p>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-[#000] cursor-pointer hover:opacity-70"><IconBell /></span>
                <span className="text-[#000] cursor-pointer hover:opacity-70"><IconMail /></span>
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                  <div className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-[12px] font-bold" style={{ fontFamily: "'Times New Roman', serif", color: "#000" }}>{username[0]}</div>
                  <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>{username}</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full mb-8">
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={s.search_placeholder}
                className="w-full h-[46px] pl-5 pr-12 border border-[#000] rounded-[12px] text-[14px] text-[#000] outline-none bg-white"
                style={{ fontFamily: "var(--font-serif)" }} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000]"><IconSearch /></span>
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#000] shadow-lg z-50 overflow-hidden">
                    {searchResults.map((course) => (
                      <button key={course.id} onClick={() => { router.push(`/${locale}/scholar/courses/${course.id}`); setSearch(""); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[#eee] last:border-b-0 bg-transparent cursor-pointer hover:bg-[#f9f9f9]">
                        <img src={course.coverImage} alt="" className="w-10 h-10 rounded-[6px] object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{course.title}</p>
                          <p className="text-[11px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{course.instructor} · {course.category} · ★{course.rating}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {search.trim() && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[12px] border border-[#000] shadow-lg z-50 p-5 text-center">
                  <p className="text-[13px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>未找到相关课程</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-10">
              {stats.map((st) => <DataStatCard key={st.label} icon={st.icon} value={st.value} label={st.label} sub={st.sub} />)}
            </div>

            {/* Course modules */}
            {modules.map((m) => (
              <CourseSection key={m.key} title={m.title} moreLabel={m.moreLabel} courses={m.previewCourses}
                columns={m.cols} variant={m.variant} showRating={m.showRating} showMentor={m.showMentor}
                showBadge={m.showBadge} badgeLabel={m.badgeLabel} locale={locale}
                onMore={() => setDrillDown(m.key)} />
            ))}

            {/* ====== 近期活动 — linked to 院讯 ====== */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.activity_title}</h2>
                <Link href={`/${locale}/scholar/news`} className="text-[13px] text-[#000] cursor-pointer hover:underline transition-colors font-bold no-underline" style={{ fontFamily: "var(--font-serif)" }}>{s.activity_more} →</Link>
              </div>
              <div className="flex flex-col gap-3">
                {activityData.map((a) => <ActivityCard key={a.id} newsItem={a} locale={locale} />)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
