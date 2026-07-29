"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { newsItems } from "@/data/news";
import { courses } from "@/data/courses";

/* ── 同窗录 — 同道馆首页 ── */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "alumni_greeting_morning";
  if (h < 18) return "alumni_greeting_afternoon";
  return "alumni_greeting_evening";
}

export default function AlumniHome() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = (t.alumni as Record<string, string>) || {};
  const username = "张物学";

  const greetingKey = getGreeting();
  const greetingText = (s[greetingKey] || "上午好").replace("{name}", username);

  const topCourses = [...courses].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const activities = newsItems.filter((n) => n.category === "activity").slice(0, 3);
  const anns = newsItems.filter((n) => n.category === "announcement").slice(0, 2);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Greeting */}
      <div className="mb-8 p-8 bg-white rounded-[16px] border-2 border-[#000]"
        style={{ background: "linear-gradient(135deg, #fafaf7 0%, #f0ece4 100%)" }}>
        <p className="text-[18px] text-[#000] m-0 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          {greetingText}，欢迎回到同窗馆。
        </p>
        <p className="text-[13px] text-[#000] m-0 mt-2 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>
          志同于道，同行致远。
        </p>
      </div>

      {/* ====== 今日院讯 ====== */}
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>今日院讯</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        {anns.map((a) => (
          <motion.button key={a.id} whileHover={{ y: -2 }}
            onClick={() => router.push(`/${locale}/alumni/events/${a.id}`)}
            className="flex gap-4 p-4 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
            <img src={a.cover} alt={a.title} className="w-[70px] h-[50px] rounded-[6px] object-cover flex-shrink-0 border border-[#eee]" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold border border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>公告</span>
              <h3 className="text-[14px] text-[#000] font-bold m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{a.title}</h3>
              <p className="text-[11px] text-[#000] opacity-50 m-0 mt-1 line-clamp-1" style={{ fontFamily: "var(--font-serif)" }}>{a.summary}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* ====== 先生新著 + 热门典籍 ====== */}
      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>热门典籍</h2>
          <div className="space-y-3">
            {topCourses.map((c) => (
              <button key={c.id} onClick={() => router.push(`/${locale}/scholar/courses/${c.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-[10px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
                <img src={c.coverImage} alt={c.title} className="w-[50px] h-[36px] rounded-[4px] object-cover border border-[#eee] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</p>
                  <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.instructor} · ★{c.rating}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>近期雅集</h2>
          <div className="space-y-3">
            {activities.map((a) => (
              <button key={a.id} onClick={() => router.push(`/${locale}/alumni/events/${a.id}`)}
                className="w-full flex items-center gap-3 p-3 bg-white rounded-[10px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
                <img src={a.cover} alt={a.title} className="w-[50px] h-[36px] rounded-[4px] object-cover border border-[#eee] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{a.title}</p>
                  <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{a.date} · {a.host}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
