"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import RadarChart from "@/components/scholar/RadarChart";
import HeatmapChart from "@/components/scholar/HeatmapChart";
import TimelineS from "@/components/scholar/TimelineS";

const courseLabels = ["伦理文化", "数据科学", "金融工程", "战略思维", "道家哲学"];
const courseValues = [78, 65, 92, 55, 40];
const abilityLabels = ["理论理解", "实践应用", "批判思维", "创新能力", "团队协作"];
const abilityValues = [85, 72, 68, 55, 60];
const timelineEvents = [
  { date: "7/28", text: "完成《大学》第3章学习" }, { date: "7/27", text: "提交风险管理作业" },
  { date: "7/26", text: "开始Python量化投资" }, { date: "7/25", text: "通过金融建模考试" },
  { date: "7/24", text: "参加《论语》研讨会" }, { date: "7/22", text: "完成数据分析练习" },
  { date: "7/20", text: "阅读《穷查理宝典》" }, { date: "7/18", text: "提交孙子兵法论文" },
  { date: "7/17", text: "完成统计学习作业" }, { date: "7/15", text: "参加风险管理讲座" },
  { date: "7/13", text: "开始《道德经》学习" }, { date: "7/11", text: "完成Python编程练习" },
  { date: "7/09", text: "通过伦理文化测验" }, { date: "7/08", text: "提交金融建模报告" },
];

function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <motion.div className="bg-[#f7f7f7] rounded-[14px] p-5 cursor-pointer border border-[#000]"
      whileHover={{ y: -2, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
      <p className="text-[28px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-[13px] text-[#000] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[11px] text-[#000] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{sub}</p>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>{s.nav_analytics}</h1>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <StatCard value="32.5h" label={s.hero_progress} sub="↑ 12%" />
        <StatCard value="12门" label={s.hero_hours} sub={s.overview_total} />
        <StatCard value="286分" label={s.hero_credits} sub="↑ 5%" />
        <StatCard value="18名" label={s.hero_rank} sub="↑ 3 位" />
      </div>

      <div className="mb-10 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
        <h2 className="text-[16px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>每日学习热力图 · 近12周</h2>
        <HeatmapChart />
      </div>

      <div className="flex gap-8 mb-10">
        <div className="flex-1 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
          <h2 className="text-[16px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>课程分类掌握度</h2>
          <div className="flex justify-center"><RadarChart labels={courseLabels} values={courseValues} size={240} /></div>
        </div>
        <div className="flex-1 p-6 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
          <h2 className="text-[16px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>能力维度评估</h2>
          <div className="flex justify-center"><RadarChart labels={abilityLabels} values={abilityValues} size={240} /></div>
        </div>
      </div>

      <div className="p-6 pb-0 bg-[#f7f7f7] rounded-[14px] border border-[#000] overflow-x-auto">
        <h2 className="text-[16px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>学习足迹</h2>
        <TimelineS events={timelineEvents} />
      </div>
    </motion.div>
  );
}
