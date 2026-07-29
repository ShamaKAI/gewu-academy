"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const posts = [
  { title: "从一张保单看新加坡家庭保障缺口", author: "张物学", category: "案例分析", date: "7/28", status: "已发布" },
  { title: "利率下行周期中的资产配置思考", author: "李文思", category: "财富管理", date: "7/26", status: "已发布" },
  { title: "AI辅助保险规划：实践与展望", author: "王知行", category: "行业洞察", date: "7/24", status: "待审核" },
  { title: "新人顾问如何建立客户信任", author: "陈明德", category: "职业成长", date: "7/22", status: "已发布" },
  { title: "家族办公室在新加坡的发展趋势", author: "吴思远", category: "行业洞察", date: "7/20", status: "待审核" },
  { title: "量化投资与传统财富管理的融合", author: "赵算法", category: "财富管理", date: "7/18", status: "已发布" },
];

export default function DeanForumPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>百家论道</h1>
      <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>{posts.length} 篇文章 · 管理论道内容</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatF value="6" label="文章总数" />
        <StatF value="4" label="已发布" />
        <StatF value="2" label="待审核" />
        <StatF value="98%" label="审阅率" />
      </div>

      <div className="space-y-2">
        {posts.map((p, i) => (
          <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center gap-5 p-4 bg-white rounded-[12px] border border-[#000]">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{p.title}</p>
              <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{p.author} · {p.category} · {p.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-[6px] text-[11px] font-bold ${p.status==="已发布"?"bg-[#e8f5e9] text-[#2e7d32]":"bg-[#fff3e0] text-[#e65100]"}`} style={{ fontFamily: "var(--font-serif)" }}>{p.status}</span>
            {p.status === "待审核" && <button className="px-3 py-1.5 rounded-[6px] text-[11px] font-bold bg-[#000] text-white border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>审核</button>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function StatF({ value, label }: { value: string; label: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[12px] border border-[#000] text-center"><p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[11px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p></div>;
}
