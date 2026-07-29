"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";

export default function DeanAnalyticsPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};
  const avgRating = (courses.reduce((s, c) => s + c.rating, 0) / courses.length).toFixed(1);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>书院数据</h1>
      <p className="text-[13px] text-[#000] opacity-50 m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>山长治理决策中心</p>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPI icon="📖" value={String(courses.length)} label="典籍" sub="已刊行" />
        <KPI icon="👨‍🏫" value="10" label="师者" sub="已认证" />
        <KPI icon="🎓" value="320" label="学子" sub="学习中" />
        <KPI icon="🤝" value="158" label="同窗" sub="5国" />
      </div>

      {/* Course ranking */}
      <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000] mb-8">
        <h2 className="text-[18px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>课程热度排行</h2>
        <div className="space-y-3">
          {[...courses].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8).map((c, i) => (
            <div key={c.id} className="flex items-center gap-3">
              <span className="text-[16px] text-[#000] font-bold w-[30px]" style={{ fontFamily: "'Times New Roman', serif" }}>#{i + 1}</span>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-[14px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</span>
                <span className="text-[12px] text-[#000] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.instructor} · ★{c.rating} · {c.reviewCount}人</span>
              </div>
              <div className="w-[120px] h-[4px] bg-[#eee] rounded-full"><div className="h-full bg-[#000] rounded-full" style={{ width: `${Math.min((c.reviewCount / 500) * 100, 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Region + growth */}
      <div className="grid grid-cols-2 gap-8">
        <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000]">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>地区分布</h2>
          {[{ city: "新加坡", pct: 62 }, { city: "马来西亚", pct: 15 }, { city: "中国大陆", pct: 10 }, { city: "中国香港", pct: 8 }, { city: "其他", pct: 5 }].map((r) => (
            <div key={r.city} className="flex items-center gap-3 mb-3">
              <span className="w-[80px] text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{r.city}</span>
              <div className="flex-1 h-[6px] bg-[#eee] rounded-full"><div className="h-full bg-[#000] rounded-full" style={{ width: `${r.pct}%` }} /></div>
              <span className="text-[12px] text-[#000] font-bold w-[36px] text-right" style={{ fontFamily: "'Times New Roman', serif" }}>{r.pct}%</span>
            </div>
          ))}
        </div>
        <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000]">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>月度增长</h2>
          {["7月", "6月", "5月", "4月", "3月"].map((m, i) => {
            const vals = [28, 22, 35, 18, 40];
            return (
              <div key={m} className="flex items-center gap-3 mb-3">
                <span className="w-[40px] text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{m}</span>
                <div className="flex-1 h-[6px] bg-[#eee] rounded-full"><div className="h-full bg-[#000] rounded-full" style={{ width: `${(vals[i] / 45) * 100}%` }} /></div>
                <span className="text-[12px] text-[#000] font-bold w-[40px] text-right" style={{ fontFamily: "'Times New Roman', serif" }}>+{vals[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
function KPI({ icon, value, label, sub }: { icon: string; value: string; label: string; sub: string }) {
  return <div className="p-5 bg-[#fafafa] rounded-[14px] border-2 border-[#000] text-center"><p className="text-[26px] m-0 mb-1">{icon}</p><p className="text-[26px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[13px] text-[#000] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p><p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p></div>;
}
