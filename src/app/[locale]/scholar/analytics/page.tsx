"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import RadarChart from "@/components/scholar/RadarChart";

const courseLabels = ["伦理文化", "数据科学", "金融工程", "战略思维", "道家哲学"];
const courseValues = [78, 65, 92, 55, 40];
const courseAvg = [60, 58, 70, 52, 48];

const abilityLabels = ["理论理解", "实践应用", "批判思维", "创新能力", "团队协作"];
const abilityValues = [85, 72, 68, 55, 60];
const abilityAvg = [65, 60, 55, 50, 58];

const timeline = [
  { date: "7/28", text: "完成《大学》第3章学习 · +2学分" },
  { date: "7/27", text: "提交风险管理作业 · 85分" },
  { date: "7/26", text: "开始Python量化投资 · 第一章" },
  { date: "7/25", text: "通过金融建模考试 · 92分" },
  { date: "7/24", text: "参加《论语》研讨会 · 2h" },
  { date: "7/22", text: "完成数据分析练习 · 1.5h" },
  { date: "7/20", text: "阅读《穷查理宝典》· 3h" },
  { date: "7/18", text: "提交孙子兵法论文 · A" },
  { date: "7/17", text: "完成统计学习作业 · 88分" },
  { date: "7/15", text: "参加风险管理讲座 · 2h" },
  { date: "7/13", text: "开始《道德经》学习" },
  { date: "7/11", text: "完成Python编程练习" },
  { date: "7/09", text: "通过伦理文化测验 · 90分" },
  { date: "7/08", text: "提交金融建模报告" },
];

// Generate 30 days of random hour data
const barData = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (29 - i));
  return {
    date: `${d.getMonth() + 1}/${d.getDate()}`,
    shortDate: `${d.getMonth() + 1}/${d.getDate()}`,
    hours: Math.round((Math.random() * 4 + (i > 20 ? 5 : 1)) * 10) / 10,
  };
});
const maxH = Math.max(...barData.map((d) => d.hours));

function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <motion.div className="bg-[#f7f7f7] rounded-[14px] p-6 cursor-pointer border border-[#000]"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p className="text-[34px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[15px] text-[#000] font-bold m-0 mt-2" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[13px] text-[#000] m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-[32px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>{s.nav_analytics}</h1>

      <div className="grid grid-cols-4 gap-5 mb-10">
        <StatCard value="32.5h" label={s.hero_progress} sub="↑ 12%" />
        <StatCard value="12门" label={s.hero_hours} sub={s.overview_total} />
        <StatCard value="286分" label={s.hero_credits} sub="↑ 5%" />
        <StatCard value="18名" label={s.hero_rank} sub="↑ 3 位" />
      </div>

      {/* 30-day bar chart */}
      <div className="mb-10 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
        <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>近30天学习时长（小时）</h2>
        <div className="flex items-end gap-[2px] h-[140px] px-2">
          {barData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <motion.div className="w-full rounded-t-[2px]"
                initial={{ height: 0 }} animate={{ height: `${(d.hours / maxH) * 120}px` }}
                transition={{ delay: i * 0.015, duration: 0.4 }}
                style={{ background: "linear-gradient(to top, #388e3c, #66bb6a)", minHeight: d.hours > 0 ? 3 : 0 }} />
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#000] text-white text-[10px] px-2 py-[2px] rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                style={{ fontFamily: "'Times New Roman', serif" }}>{d.hours}h</div>
            </div>
          ))}
        </div>
        {/* X axis labels — simplified */}
        <div className="flex gap-[2px] mt-2 px-2">
          {barData.filter((_, i) => i % 5 === 0).map((d, i) => (
            <div key={i} className="flex-1 text-[9px] text-[#000] text-center" style={{ fontFamily: "'Times New Roman', serif" }}>{d.shortDate}</div>
          ))}
        </div>
      </div>

      {/* Dual radar */}
      <div className="flex gap-8 mb-10">
        <div className="flex-1 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>课程分类掌握度</h2>
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex items-center gap-4 text-[11px]" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "#388e3c" }} /> 你</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block border border-dashed border-[#aaa]" style={{ background: "#ccc" }} /> 学院均值</span>
            </div>
          </div>
          <div className="flex justify-center"><RadarChart labels={courseLabels} values={courseValues} avgValues={courseAvg} size={340} color="#388e3c" avgColor="#aaa" /></div>
        </div>
        <div className="flex-1 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>能力维度评估</h2>
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="flex items-center gap-4 text-[11px]" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block" style={{ background: "#2563eb" }} /> 你</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full inline-block border border-dashed border-[#aaa]" style={{ background: "#ccc" }} /> 学院均值</span>
            </div>
          </div>
          <div className="flex justify-center"><RadarChart labels={abilityLabels} values={abilityValues} avgValues={abilityAvg} size={340} color="#2563eb" avgColor="#aaa" /></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
        <h2 className="text-[18px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>学习足迹</h2>
        <div className="relative">
          <div className="absolute left-2 top-0 bottom-0 w-[1px] bg-[#ccc]" />
          <div className="flex flex-col gap-2">
            {timeline.map((ev, i) => (
              <motion.div key={i} className="flex items-center gap-4 pl-8 relative"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                <div className="absolute left-[5px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#555] border-2 border-white" />
                <span className="text-[15px] text-[#000] flex-1" style={{ fontFamily: "var(--font-serif)" }}>{ev.text}</span>
                <span className="text-[12px] text-[#000] flex-shrink-0 opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>{ev.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
