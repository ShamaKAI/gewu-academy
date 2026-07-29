"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { newsItems } from "@/data/news";

export default function DeanEventsPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>雅集管理</h1>
          <p className="text-[13px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{newsItems.length} 场活动 · 管理书院雅集</p>
        </div>
        <button onClick={() => alert("创建雅集功能即将开放")}
          className="px-5 py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>+ 发起雅集</button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatE value="7" label="总雅集" />
        <StatE value="2" label="即将开始" />
        <StatE value="3" label="已结束" />
        <StatE value="92%" label="平均到场率" />
      </div>

      <div className="space-y-3">
        {newsItems.map((item, i) => (
          <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="flex items-center gap-5 p-4 bg-white rounded-[12px] border border-[#000]">
            <img src={item.cover} alt={item.title} className="w-[80px] h-[55px] rounded-[6px] object-cover border border-[#eee] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] px-2 py-[2px] rounded-[4px] font-bold border border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>
                  {item.category === "activity" ? "活动" : item.category === "new-course" ? "新课" : "公告"}
                </span>
                {item.status && <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold" style={{ fontFamily: "var(--font-serif)", background: item.status==="ended"?"#eee":"#e8f5e9", color: item.status==="ended"?"#888":"#2e7d32" }}>{item.status==="upcoming"?"即将开始":item.status==="ended"?"已结束":"进行中"}</span>}
              </div>
              <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{item.title}</p>
              <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{item.date} · {item.registeredCount}人报名</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function StatE({ value, label }: { value: string; label: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[12px] border border-[#000] text-center"><p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[11px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p></div>;
}
