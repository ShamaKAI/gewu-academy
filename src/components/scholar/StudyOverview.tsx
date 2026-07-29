"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { IconClock, IconMail, IconCalendar, IconBell } from "./Icons";

interface StudyOverviewProps {
  locale: string;
}

/* ── Mock detail data ── */
const weeklyBreakdown = [
  { date: "7/28", course: "《大学》精读", hours: 3.5 },
  { date: "7/28", course: "金融数学建模", hours: 2.0 },
  { date: "7/27", course: "风险管理基础", hours: 4.0 },
  { date: "7/27", course: "数据分析导论", hours: 1.5 },
  { date: "7/26", course: "《大学》精读", hours: 2.5 },
  { date: "7/26", course: "Python 与量化投资", hours: 3.0 },
  { date: "7/25", course: "金融数学建模", hours: 4.5 },
  { date: "7/24", course: "《孙子兵法》与决策", hours: 2.0 },
  { date: "7/23", course: "风险管理基础", hours: 3.0 },
  { date: "7/22", course: "数据分析导论", hours: 2.5 },
  { date: "7/21", course: "《道德经》现代解读", hours: 1.5 },
  { date: "7/21", course: "统计学习基础", hours: 2.5 },
];

const completedCourses = [
  { id: "stats-ml", title: "统计学习基础", category: "数据科学", score: 92, date: "7/20", rating: 4.1, cover: "https://picsum.photos/seed/stats-cover/400/250" },
  { id: "fin-math", title: "金融数学建模", category: "金融工程", score: 95, date: "7/25", rating: 4.7, cover: "https://picsum.photos/seed/finance-cover/400/250" },
  { id: "python-quant", title: "Python 与量化投资", category: "编程应用", score: 88, date: "7/15", rating: 4.3, cover: "https://picsum.photos/seed/python-quant-cover/400/250" },
  { id: "shijing", title: "《诗经》鉴赏", category: "文学艺术", score: 90, date: "7/10", rating: 4.2, cover: "https://picsum.photos/seed/shijing-cover/400/250" },
  { id: "lunyu", title: "《论语》精讲", category: "伦理文化", score: 87, date: "7/05", rating: 4.7, cover: "https://picsum.photos/seed/lunyu-cover/400/250" },
  { id: "great-learning", title: "《大学》精读", category: "伦理文化", score: 93, date: "6/28", rating: 4.9, cover: "https://picsum.photos/seed/great-learning-cover/400/250" },
  { id: "risk-mgmt", title: "风险管理基础", category: "保险精算", score: 85, date: "6/20", rating: 4.5, cover: "https://picsum.photos/seed/risk-cover/400/250" },
  { id: "data-science", title: "数据分析导论", category: "数据科学", score: 89, date: "6/15", rating: 4.3, cover: "https://picsum.photos/seed/data-sci-cover/400/250" },
  { id: "sunzi", title: "《孙子兵法》与决策", category: "战略思维", score: 91, date: "6/10", rating: 4.7, cover: "https://picsum.photos/seed/sunzi-cover/400/250" },
  { id: "daodejing", title: "《道德经》现代解读", category: "道家哲学", score: 86, date: "6/05", rating: 4.4, cover: "https://picsum.photos/seed/daode-cover/400/250" },
  { id: "fin-math-2", title: "《传习录》研读", category: "心学经典", score: 94, date: "5/28", rating: 4.8, cover: "https://picsum.photos/seed/philosophy-scroll/400/250" },
  { id: "python-quant-2", title: "《论语》研讨会论文", category: "伦理文化", score: 88, date: "5/20", rating: 4.6, cover: "https://picsum.photos/seed/confucius-analects/400/250" },
];

const creditBreakdown = [
  { course: "《大学》精读", credits: 48, progress: 78 },
  { course: "金融数学建模", credits: 42, progress: 92 },
  { course: "风险管理基础", credits: 36, progress: 60 },
  { course: "数据分析导论", credits: 30, progress: 45 },
  { course: "《孙子兵法》与决策", credits: 28, progress: 55 },
  { course: "Python 与量化投资", credits: 24, progress: 0 },
  { course: "《论语》精讲", credits: 22, progress: 82 },
  { course: "《道德经》现代解读", credits: 20, progress: 70 },
  { course: "《诗经》鉴赏", credits: 18, progress: 38 },
  { course: "统计学习基础", credits: 18, progress: 88 },
];

const recentCourses = [
  { id: "great-learning", name: "《大学》精读", timeKey: "recent_time_1", progress: 78, cover: "https://picsum.photos/seed/great-learning-cover/400/250" },
  { id: "risk-mgmt", name: "风险管理基础", timeKey: "recent_time_2", progress: 60, cover: "https://picsum.photos/seed/risk-cover/400/250" },
  { id: "data-science", name: "数据分析导论", timeKey: "recent_time_3", progress: 45, cover: "https://picsum.photos/seed/data-sci-cover/400/250" },
  { id: "fin-math", name: "金融数学建模", timeKey: "recent_time_4", progress: 92, cover: "https://picsum.photos/seed/finance-cover/400/250" },
];

type PanelKey = "hours" | "courses" | "credits" | null;

export default function StudyOverview({ locale }: StudyOverviewProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;
  const [openPanel, setOpenPanel] = useState<PanelKey>(null);

  const overviewItems = [
    { key: "hours" as PanelKey, icon: <IconClock />, label: s.week_hours, value: s.hero_progress_val, trend: s.overview_up, clickable: true },
    { key: "courses" as PanelKey, icon: <IconMail />, label: s.total_courses, value: s.hero_hours_val, trend: s.overview_total, clickable: true },
    { key: "credits" as PanelKey, icon: <IconCalendar />, label: s.total_credits, value: s.hero_credits_val, trend: s.overview_total, clickable: true },
    { key: null, icon: <IconBell />, label: s.current_rank, value: s.hero_rank_val, trend: s.overview_rank_up, clickable: false },
  ];

  return (
    <div className="px-5 py-6 relative">
      <h3 className="text-[18px] text-[#000] font-bold tracking-[calc(var(--ls-scale)*2px)] m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>
        {s.overview_title}
      </h3>

      {/* Stat cards with clickable drill-down */}
      <div className="flex flex-col gap-3 mb-6">
        {overviewItems.map((item) => (
          <div key={item.label}
            onClick={() => item.clickable && setOpenPanel(openPanel === item.key ? null : item.key)}
            className={`flex items-center gap-3 bg-white rounded-[12px] p-3.5 border border-[#000] ${item.clickable ? "cursor-pointer hover:bg-[#f9f9f9] transition-colors" : ""}`}>
            <span className="text-[#000] flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{item.label}</p>
              <p className="text-[20px] text-[#000] font-bold m-0 leading-tight" style={{ fontFamily: "'Times New Roman', serif" }}>{item.value}</p>
            </div>
            <span className="text-[11px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{item.trend}</span>
            {item.clickable && <span className="text-[#000] text-[12px] opacity-40">→</span>}
          </div>
        ))}
      </div>

      {/* ── Drill-down overlay panels ── */}
      <AnimatePresence>
        {openPanel === "hours" && (
          <motion.div key="panel-hours" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-white z-20 overflow-y-auto border-l border-[#000]"
            style={{ width: 300 }}>
            <div className="px-5 py-6">
              <button onClick={() => setOpenPanel(null)}
                className="text-[13px] text-[#000] bg-transparent border-none cursor-pointer mb-4 hover:opacity-70" style={{ fontFamily: "var(--font-serif)" }}>← 返回</button>
              <h3 className="text-[16px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>本周学习详情</h3>
              <div className="space-y-2">
                {weeklyBreakdown.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#eee]">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{d.course}</p>
                      <p className="text-[10px] text-[#000] m-0 opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>{d.date}</p>
                    </div>
                    <span className="text-[14px] text-[#000] font-bold flex-shrink-0 ml-2" style={{ fontFamily: "'Times New Roman', serif" }}>{d.hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {openPanel === "courses" && (
          <motion.div key="panel-courses" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-white z-20 overflow-y-auto border-l border-[#000]"
            style={{ width: 300 }}>
            <div className="px-5 py-6">
              <button onClick={() => setOpenPanel(null)}
                className="text-[13px] text-[#000] bg-transparent border-none cursor-pointer mb-4 hover:opacity-70" style={{ fontFamily: "var(--font-serif)" }}>← 返回</button>
              <h3 className="text-[16px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>已完成课程</h3>
              <div className="space-y-2">
                {completedCourses.map((c, i) => (
                  <button key={i}
                    onClick={() => router.push(`/${locale}/scholar/courses/${c.id}`)}
                    className="w-full flex items-center gap-3 p-3 bg-white rounded-[10px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left">
                    <img src={c.cover} alt={c.title} className="w-[40px] h-[28px] rounded-[4px] object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</p>
                      <p className="text-[10px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.category} · {c.date}</p>
                    </div>
                    <span className="text-[13px] text-[#000] font-bold flex-shrink-0" style={{ fontFamily: "'Times New Roman', serif" }}>{c.score}分</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {openPanel === "credits" && (
          <motion.div key="panel-credits" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-white z-20 overflow-y-auto border-l border-[#000]"
            style={{ width: 300 }}>
            <div className="px-5 py-6">
              <button onClick={() => setOpenPanel(null)}
                className="text-[13px] text-[#000] bg-transparent border-none cursor-pointer mb-4 hover:opacity-70" style={{ fontFamily: "var(--font-serif)" }}>← 返回</button>
              <h3 className="text-[16px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>学分组{creditBreakdown.reduce((sum, c) => sum + c.credits, 0)}分</h3>
              <div className="space-y-2">
                {creditBreakdown.map((c, i) => (
                  <div key={i} className="p-3 bg-[#fafafa] rounded-[8px] border border-[#eee]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-[#000] font-bold m-0 truncate flex-1" style={{ fontFamily: "var(--font-serif)" }}>{c.course}</p>
                      <span className="text-[13px] text-[#000] font-bold flex-shrink-0 ml-2" style={{ fontFamily: "'Times New Roman', serif" }}>{c.credits}分</span>
                    </div>
                    <div className="h-[4px] bg-[#eee] rounded-full overflow-hidden">
                      <div className="h-full bg-[#000] rounded-full" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Recent learning ── */}
      <h3 className="text-[15px] text-[#000] font-bold tracking-[calc(var(--ls-scale)*2px)] m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>{s.recent_title}</h3>
      <div className="flex flex-col gap-2">
        {recentCourses.map((rc, i) => (
          <button key={i}
            onClick={() => router.push(`/${locale}/scholar/courses/${rc.id}`)}
            className="flex items-center gap-3 bg-white rounded-[10px] p-3 border border-[#000] cursor-pointer hover:bg-[#f9f9f9] hover:shadow-sm transition-all duration-200 text-left">
            <img src={rc.cover} alt={rc.name} className="w-9 h-9 rounded-[8px] object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{rc.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-[5px] bg-[#eee] rounded-full overflow-hidden">
                  <div className="h-full bg-[#000] rounded-full" style={{ width: `${rc.progress}%` }} />
                </div>
                <span className="text-[10px] text-[#000] flex-shrink-0" style={{ fontFamily: "'Times New Roman', serif" }}>{rc.progress}%</span>
              </div>
            </div>
            <span className="text-[10px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{s[rc.timeKey]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
