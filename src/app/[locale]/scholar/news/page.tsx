"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { newsItems, NEWS_CATEGORIES } from "@/data/news";
import type { NewsItem } from "@/data/news";

/* ── Activity detail card ── */
function ActivityDetail({ item, onBack }: { item: NewsItem; onBack: () => void }) {
  const statusLabel = item.status === "upcoming" ? "即将开始" : item.status === "ongoing" ? "进行中" : "已结束";
  const statusColor = item.status === "upcoming" ? "#5B8C85" : item.status === "ongoing" ? "#2563eb" : "#888";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <button onClick={onBack} className="flex items-center gap-2 mb-6 text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70" style={{ fontFamily: "var(--font-serif)" }}>&larr; 返回院讯</button>

      {/* Hero */}
      <div className="relative rounded-[16px] overflow-hidden mb-6 border-2 border-[#000]" style={{ maxHeight: 300 }}>
        <img src={item.cover} alt={item.title} className="w-full object-cover" style={{ maxHeight: 300 }} />
        <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] px-3 py-[3px] rounded-[5px] font-bold bg-white/90 text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{NEWS_CATEGORIES[item.category]}</span>
            {item.status && (
              <span className="text-[12px] px-3 py-[3px] rounded-[5px] font-bold text-white" style={{ fontFamily: "var(--font-serif)", background: statusColor }}>{statusLabel}</span>
            )}
          </div>
          <h1 className="text-[26px] text-white font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{item.title}</h1>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {item.host && <InfoBlock label="主讲人" value={item.host} />}
        {item.time && <InfoBlock label="时间" value={item.time} />}
        {item.location && <InfoBlock label="地点" value={item.location} />}
        {item.registeredCount !== undefined && (
          <InfoBlock label="已报名人数" value={`${item.registeredCount} 人`} />
        )}
      </div>

      {/* Content */}
      <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000] mb-6">
        <h2 className="text-[16px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>活动详情</h2>
        <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", whiteSpace: "pre-wrap" }}>{item.content}</p>
      </div>

      {/* Registration */}
      {item.status !== "ended" && item.registrationLink && (
        <div className="flex items-center gap-4 mb-6 p-5 bg-[#f7f7f7] rounded-[14px] border border-[#000]">
          <div className="flex-1">
            <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>立即报名</p>
            <p className="text-[12px] text-[#000] m-0 mt-1 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>点击下方按钮前往报名页面</p>
          </div>
          <a href={item.registrationLink} target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-[#000] text-white rounded-[10px] text-[14px] font-bold no-underline hover:bg-[#333] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}>报名</a>
        </div>
      )}

      {/* Feedback (ended only) */}
      {item.status === "ended" && item.feedback && item.feedback.length > 0 && (
        <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000] mb-6">
          <h2 className="text-[16px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>活动评价 ({item.feedback.length})</h2>
          <div className="space-y-3">
            {item.feedback.map((fb, i) => (
              <div key={i} className="p-4 bg-white rounded-[10px] border border-[#eee]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{fb.author}</span>
                  <span className="text-[12px] text-[#C5A46D]" style={{ fontFamily: "'Times New Roman', serif" }}>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</span>
                  <span className="text-[11px] text-[#000] opacity-40 ml-auto" style={{ fontFamily: "'Times New Roman', serif" }}>{fb.date}</span>
                </div>
                <p className="text-[13px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)" }}>{fb.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 bg-[#fafafa] rounded-[10px] border border-[#000]">
      <p className="text-[11px] text-[#000] m-0 mb-1 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
      <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{value}</p>
    </div>
  );
}

/* ── News list ── */
export default function NewsPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const searchParams = useSearchParams();
  const urlOpen = searchParams?.get("open") || "";

  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailItem, setDetailItem] = useState<NewsItem | null>(
    urlOpen ? newsItems.find((n) => n.id === urlOpen) || null : null
  );

  const filtered = filter === "all" ? newsItems : newsItems.filter((n) => n.category === filter);
  const grouped: Record<string, NewsItem[]> = {};
  filtered.forEach((n) => { const m = n.date.slice(0, 7); if (!grouped[m]) grouped[m] = []; grouped[m].push(n); });
  const monthLabel = (m: string) => { const [y, mo] = m.split("-"); return `${y}年${parseInt(mo)}月`; };

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {detailItem ? (
          <ActivityDetail key="detail" item={detailItem} onBack={() => setDetailItem(null)} />
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
                          onClick={() => {
                            if (n.category === "activity") setDetailItem(n);
                            else setExpandedId(expandedId===n.id?null:n.id);
                          }}>
                          {n.isNew && <span className="absolute -top-2 -right-2 px-2.5 py-[3px] rounded-[6px] text-[11px] font-bold bg-[#C04040] text-white" style={{ fontFamily: "var(--font-serif)" }}>NEW</span>}
                          <img src={n.cover} alt={n.title} className="w-[130px] h-[90px] rounded-[10px] object-cover flex-shrink-0 border border-[#eee]" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[12px] px-2.5 py-[3px] rounded-[5px] font-bold border border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{NEWS_CATEGORIES[n.category]}</span>
                              <span className="text-[13px] text-[#000]" style={{ fontFamily: "'Times New Roman', serif" }}>{n.date}</span>
                              {n.status && (
                                <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold"
                                  style={{ fontFamily: "var(--font-serif)", background: n.status==="upcoming"?"#e8f5e9":n.status==="ongoing"?"#e3f2fd":"#eee", color: n.status==="upcoming"?"#2e7d32":n.status==="ongoing"?"#1565c0":"#888" }}>
                                  {n.status==="upcoming"?"即将开始":n.status==="ongoing"?"进行中":"已结束"}
                                </span>
                              )}
                            </div>
                            <h3 className="text-[17px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{n.title}</h3>
                            <p className="text-[14px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)", opacity: 0.6 }}>{n.summary}</p>
                          </div>
                          {n.category === "activity" && <span className="self-center text-[20px] text-[#000] opacity-30">&rarr;</span>}
                        </motion.div>
                        <AnimatePresence>
                          {expandedId===n.id && n.category !== "activity" && (
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
        )}
      </AnimatePresence>
    </motion.div>
  );
}
