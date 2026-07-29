"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";

export default function DeanCoursesPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? courses : courses.filter((c) => c.category === filter);
  const cats = ["all", ...new Set(courses.map((c) => c.category))];

  const avgRating = (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>典籍管理</h1>
          <p className="text-[13px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{courses.length} 门典籍 · 均分 {avgRating}</p>
        </div>
        <button onClick={() => alert("新建典籍功能即将开放")}
          className="px-5 py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>+ 新建典籍</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatB value={String(courses.length)} label="典籍总数" />
        <StatB value={avgRating} label="均分" />
        <StatB value={`${cats.length - 1}`} label="分类" />
        <StatB value="85%" label="完课率" />
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {cats.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-bold border cursor-pointer transition-colors ${filter===cat?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
            style={{ fontFamily: "var(--font-serif)" }}>{cat === "all" ? "全部分类" : cat}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="flex items-center gap-5 p-4 bg-white rounded-[12px] border border-[#000]">
            <img src={c.coverImage} alt={c.title} className="w-[60px] h-[42px] rounded-[6px] object-cover border border-[#eee] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</p>
              <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.instructor} · {c.category} · {c.duration} · ★{c.rating}</p>
            </div>
            <span className="px-2 py-[2px] rounded-[4px] text-[10px] font-bold bg-[#e8f5e9] text-[#2e7d32]" style={{ fontFamily: "var(--font-serif)" }}>已刊行</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function StatB({ value, label }: { value: string; label: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[12px] border border-[#000] text-center"><p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[11px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p></div>;
}
