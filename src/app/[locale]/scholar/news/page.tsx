"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { newsItems, NEWS_CATEGORIES } from "@/data/news";
import type { NewsItem } from "@/data/news";

export default function NewsPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "all" ? newsItems : newsItems.filter((n) => n.category === filter);
  const grouped: Record<string, NewsItem[]> = {};
  filtered.forEach((n) => { const m = n.date.slice(0, 7); if (!grouped[m]) grouped[m] = []; grouped[m].push(n); });
  const monthLabel = (m: string) => { const [y, mo] = m.split("-"); return `${y}年${parseInt(mo)}月`; };

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-[32px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>{s.nav_news}</h1>

      <div className="flex gap-3 mb-8">
        {Object.entries(NEWS_CATEGORIES).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-5 py-2.5 rounded-[10px] text-[15px] font-bold border cursor-pointer transition-colors ${filter===key?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
            style={{ fontFamily: "var(--font-serif)" }}>{label}</button>
        ))}
      </div>

      <div className="relative ml-4">
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#000] opacity-20" />
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="mb-8">
            <div className="flex items-center gap-3 mb-5 -ml-4">
              <div className="w-[10px] h-[10px] rounded-full bg-[#000]" />
              <h2 className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{monthLabel(month)}</h2>
            </div>
            <div className="flex flex-col gap-4 ml-6">
              {items.map((n) => (
                <div key={n.id}>
                  <motion.div whileHover={{ y: -1 }}
                    className="flex gap-5 bg-white rounded-[14px] border border-[#000] p-5 cursor-pointer hover:bg-[#f9f9f9] transition-colors relative w-full"
                    onClick={() => setExpandedId(expandedId===n.id?null:n.id)}>
                    {n.isNew && <span className="absolute -top-2 -right-2 px-2.5 py-[3px] rounded-[6px] text-[11px] font-bold bg-[#C04040] text-white" style={{ fontFamily: "var(--font-serif)" }}>NEW</span>}
                    <img src={n.cover} alt={n.title} className="w-[130px] h-[90px] rounded-[10px] object-cover flex-shrink-0 border border-[#eee]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] px-2.5 py-[3px] rounded-[5px] font-bold border border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{NEWS_CATEGORIES[n.category]}</span>
                        <span className="text-[13px] text-[#000]" style={{ fontFamily: "var(--font-display)" }}>{n.date}</span>
                      </div>
                      <h3 className="text-[17px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{n.title}</h3>
                      <p className="text-[14px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)", opacity: 0.6 }}>{n.summary}</p>
                    </div>
                  </motion.div>
                  <AnimatePresence>
                    {expandedId===n.id && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} className="overflow-hidden">
                        <div className="ml-6 px-6 py-5 mt-2 bg-[#fafafa] rounded-[10px] border border-[#eee]">
                          <p className="text-[15px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", whiteSpace:"pre-wrap" }}>{n.content}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
