"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const mockAlumni = [
  { name: "张物学", specialty: "家族财富传承", city: "新加坡", country: "新加坡", courses: 12, badges: 5, joined: "2025-03", avatar: "ZM" },
  { name: "李文思", specialty: "医疗保险", city: "吉隆坡", country: "马来西亚", courses: 8, badges: 3, joined: "2025-06", avatar: "LW" },
  { name: "王知行", specialty: "全球资产配置", city: "新加坡", country: "新加坡", courses: 15, badges: 7, joined: "2024-11", avatar: "WZ" },
  { name: "陈明德", specialty: "企业风险管理", city: "香港", country: "中国香港", courses: 10, badges: 4, joined: "2025-01", avatar: "CM" },
  { name: "吴思远", specialty: "退休规划", city: "新加坡", country: "新加坡", courses: 7, badges: 2, joined: "2025-04", avatar: "WS" },
  { name: "赵算法", specialty: "量化投资", city: "上海", country: "中国大陆", courses: 14, badges: 6, joined: "2024-09", avatar: "ZS" },
  { name: "风雅颂", specialty: "税务规划", city: "台北", country: "中国台湾", courses: 6, badges: 2, joined: "2025-05", avatar: "FY" },
  { name: "孔孟研", specialty: "伦理文化", city: "新加坡", country: "新加坡", courses: 13, badges: 5, joined: "2024-12", avatar: "KM" },
];

export default function DeanAlumniPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return mockAlumni;
    const q = search.trim().toLowerCase();
    return mockAlumni.filter((a) => a.name.includes(q) || a.specialty.includes(q) || a.city.includes(q));
  }, [search]);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>同道管理</h1>
      <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>{mockAlumni.length} 名同窗 · 覆盖5个国家</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatBlock value="158" label="全球同窗" />
        <StatBlock value="5" label="覆盖国家" />
        <StatBlock value="85%" label="活跃率" />
        <StatBlock value="12" label="城市社群" />
      </div>

      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索同窗..."
        className="w-[300px] px-4 py-2.5 rounded-[10px] border-2 border-[#000] text-[14px] text-[#000] outline-none mb-6" style={{ fontFamily: "var(--font-serif)" }} />

      <div className="grid grid-cols-2 gap-4">
        {filtered.map((a, i) => (
          <motion.div key={a.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="p-4 bg-white rounded-[12px] border border-[#000] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#eee] flex items-center justify-center text-[12px] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{a.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{a.name}</p>
              <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{a.specialty} · {a.city}, {a.country} · {a.courses}门 · {a.badges}枚徽章</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function StatBlock({ value, label }: { value: string; label: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[12px] border border-[#000] text-center"><p className="text-[24px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p></div>;
}
