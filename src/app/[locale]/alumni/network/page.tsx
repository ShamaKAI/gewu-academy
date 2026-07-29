"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

interface Person {
  name: string; title: string; city: string; country: string; specialty: string;
  courses: number; joined: string; avatar: string;
}

const mockPeople: Person[] = [
  { name: "张物学", title: "高级财富顾问", city: "新加坡", country: "新加坡", specialty: "家族财富传承", courses: 12, joined: "2025-03", avatar: "ZM" },
  { name: "李文思", title: "保险规划师", city: "吉隆坡", country: "马来西亚", specialty: "医疗保险", courses: 8, joined: "2025-06", avatar: "LW" },
  { name: "王知行", title: "投资顾问", city: "新加坡", country: "新加坡", specialty: "全球资产配置", courses: 15, joined: "2024-11", avatar: "WZ" },
  { name: "陈明德", title: "风险管理师", city: "香港", country: "中国香港", specialty: "企业风险管理", courses: 10, joined: "2025-01", avatar: "CM" },
  { name: "吴思远", title: "财富规划师", city: "新加坡", country: "新加坡", specialty: "退休规划", courses: 7, joined: "2025-04", avatar: "WS" },
  { name: "赵算法", title: "量化分析师", city: "上海", country: "中国大陆", specialty: "量化投资", courses: 14, joined: "2024-09", avatar: "ZS" },
  { name: "周概率", title: "精算顾问", city: "新加坡", country: "新加坡", specialty: "保险精算", courses: 9, joined: "2025-07", avatar: "ZG" },
  { name: "风雅颂", title: "财务顾问", city: "台北", country: "中国台湾", specialty: "税务规划", courses: 6, joined: "2025-05", avatar: "FY" },
  { name: "老子风", title: "投资总监", city: "新加坡", country: "新加坡", specialty: "ETF投资", courses: 16, joined: "2024-07", avatar: "LZ" },
  { name: "孙武", title: "战略顾问", city: "东京", country: "日本", specialty: "商业决策", courses: 11, joined: "2025-02", avatar: "SW" },
  { name: "陈省身", title: "金融教授", city: "伦敦", country: "英国", specialty: "金融数学", courses: 20, joined: "2024-03", avatar: "CS" },
  { name: "孔孟研", title: "儒学研究员", city: "新加坡", country: "新加坡", specialty: "伦理文化", courses: 13, joined: "2024-12", avatar: "KM" },
];

const CITIES = ["全部", "新加坡", "吉隆坡", "香港", "上海", "台北", "东京", "伦敦"];

export default function NetworkPage() {
  const { t } = useTranslation();
  const s = (t.alumni as Record<string, string>) || {};
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("全部");

  const filtered = useMemo(() => {
    let r = mockPeople;
    if (city !== "全部") r = r.filter((p) => p.city === city);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter((p) => p.name.includes(q) || p.specialty.includes(q) || p.title.includes(q));
    }
    return r;
  }, [search, city]);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>同道</h1>
      <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>连接全球华人财富管理从业者</p>

      <div className="flex items-center gap-4 mb-6">
        <input type="text" value={search} onChange={(e)=>setSearch(e.target.value)}
          placeholder="搜索姓名、专业方向..."
          className="w-[280px] px-4 py-2.5 rounded-[10px] border-2 border-[#000] text-[14px] text-[#000] outline-none"
          style={{ fontFamily: "var(--font-serif)" }} />
        <div className="flex gap-2 flex-wrap">
          {CITIES.map((c) => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-bold border cursor-pointer transition-colors ${city===c?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
              style={{ fontFamily: "var(--font-serif)" }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="p-5 bg-white rounded-[14px] border-2 border-[#000] hover:bg-[#f9f9f9] transition-colors cursor-pointer">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#eee] flex items-center justify-center text-[14px] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{p.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{p.name}</p>
                <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{p.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] px-2 py-[2px] rounded-[4px] border border-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{p.specialty}</span>
              <span className="text-[11px] text-[#000] opacity-40" style={{ fontFamily: "var(--font-serif)" }}>{p.city} · {p.country}</span>
            </div>
            <p className="text-[11px] text-[#000] opacity-40 m-0" style={{ fontFamily: "var(--font-serif)" }}>
              {p.courses} 门课程 · 加入 {p.joined}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
