"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { newsItems } from "@/data/news";

export default function EventsPage() {
  const [detailId, setDetailId] = useState<string | null>(null);
  const activities = newsItems.filter((n) => n.category === "activity");
  const detail = detailId ? activities.find((a) => a.id === detailId) : null;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <AnimatePresence mode="wait">
        {detail ? (
          <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
            <button onClick={() => setDetailId(null)} className="text-[14px] text-[#000] bg-transparent border-none cursor-pointer mb-6" style={{ fontFamily: "var(--font-serif)" }}>← 返回雅集录</button>
            <div className="max-w-2xl">
              <img src={detail.cover} alt={detail.title} className="w-full h-[220px] object-cover rounded-[16px] border-2 border-[#000] mb-6" />
              <h1 className="text-[26px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>{detail.title}</h1>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {detail.host && <InfoBlock label="主讲" value={detail.host} />}
                {detail.time && <InfoBlock label="时间" value={detail.time} />}
                {detail.location && <InfoBlock label="地点" value={detail.location} />}
                {detail.registeredCount !== undefined && <InfoBlock label="参与人数" value={`${detail.registeredCount} 人`} />}
              </div>
              <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000] mb-6">
                <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", whiteSpace: "pre-wrap" }}>{detail.content}</p>
              </div>
              {detail.feedback && detail.feedback.length > 0 && (
                <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000]">
                  <h2 className="text-[16px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>参与者评价（{detail.feedback.length}）</h2>
                  <div className="space-y-2">
                    {detail.feedback.map((fb, i) => (
                      <div key={i} className="p-3 bg-white rounded-[8px] border border-[#eee]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{fb.author}</span>
                          <span className="text-[12px] text-[#C5A46D]">{fb.rating}★</span>
                          <span className="text-[11px] text-[#000] opacity-40 ml-auto">{fb.date}</span>
                        </div>
                        <p className="text-[13px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{fb.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-[28px] text-[#000] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>雅集录</h1>
            <div className="space-y-4 max-w-2xl">
              {activities.map((a, i) => (
                <motion.button key={a.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setDetailId(a.id)}
                  className="w-full flex gap-5 p-5 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left"
                  whileHover={{ y: -2 }}>
                  <img src={a.cover} alt={a.title} className="w-[120px] h-[80px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{a.title}</h3>
                    <p className="text-[12px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>
                      {a.host || ""} · {a.date} · {a.registeredCount ? `${a.registeredCount} 人参与` : ""}
                    </p>
                  </div>
                  <span className="text-[#000] opacity-30 self-center text-[20px]">→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[10px] border border-[#000]"><p className="text-[11px] text-[#000] opacity-50 m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p><p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{value}</p></div>;
}
