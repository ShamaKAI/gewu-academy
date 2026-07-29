"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const mockScholars = [
  { name: "张物学", progress: 78, courses: 12, hours: 48, city: "新加坡", joined: "2025-03", avatar: "ZM" },
  { name: "李文思", progress: 65, courses: 8, hours: 32, city: "吉隆坡", joined: "2025-06", avatar: "LW" },
  { name: "王知行", progress: 92, courses: 15, hours: 85, city: "新加坡", joined: "2024-11", avatar: "WZ" },
  { name: "陈明德", progress: 45, courses: 10, hours: 28, city: "香港", joined: "2025-01", avatar: "CM" },
  { name: "吴思远", progress: 88, courses: 7, hours: 40, city: "新加坡", joined: "2025-04", avatar: "WS" },
  { name: "赵算法", progress: 30, courses: 14, hours: 22, city: "上海", joined: "2024-09", avatar: "ZS" },
  { name: "周概率", progress: 55, courses: 9, hours: 35, city: "新加坡", joined: "2025-07", avatar: "ZG" },
  { name: "风雅颂", progress: 70, courses: 6, hours: 30, city: "台北", joined: "2025-05", avatar: "FY" },
  { name: "老子风", progress: 95, courses: 16, hours: 110, city: "新加坡", joined: "2024-07", avatar: "LZ" },
  { name: "孙武", progress: 50, courses: 11, hours: 45, city: "东京", joined: "2025-02", avatar: "SW" },
];

export default function DeanScholarsPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return mockScholars;
    const q = search.trim().toLowerCase();
    return mockScholars.filter((sc) => sc.name.includes(q) || sc.city.includes(q));
  }, [search]);

  const avgProg = Math.round(mockScholars.reduce((a, b) => a + b.progress, 0) / mockScholars.length);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>学子管理</h1>
          <p className="text-[13px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{mockScholars.length} 名学子 · 平均进度 {avgProg}%</p>
        </div>
        <button onClick={() => alert("新增学子功能即将开放")}
          className="px-5 py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>+ 新增学子</button>
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索学子姓名或城市..."
        className="w-[300px] px-4 py-2.5 rounded-[10px] border-2 border-[#000] text-[14px] text-[#000] outline-none mb-6" style={{ fontFamily: "var(--font-serif)" }} />

      <div className="space-y-2">
        {filtered.map((sc, i) => (
          <motion.div key={sc.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
            className="flex items-center gap-5 p-4 bg-white rounded-[12px] border border-[#000]">
            <div className="w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-[12px] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{sc.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{sc.name}</p>
              <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{sc.city} · {sc.courses}门课程 · {sc.hours}h · 加入{sc.joined}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[100px] h-[5px] bg-[#eee] rounded-full"><div className="h-full bg-[#000] rounded-full" style={{ width: `${sc.progress}%` }} /></div>
              <span className="text-[12px] text-[#000] font-bold w-[32px]" style={{ fontFamily: "'Times New Roman', serif" }}>{sc.progress}%</span>
            </div>
            <button className="px-3 py-1.5 rounded-[6px] text-[12px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]" style={{ fontFamily: "var(--font-serif)" }}>详情</button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
