"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { mentors } from "@/data/mentors";
import { courses } from "@/data/courses";
import { newsItems } from "@/data/news";
import type { MentorProfile } from "@/data/mentors";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  const [mentor, setMentor] = useState<MentorProfile | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("gewu-mentor-id");
    if (id) setMentor(mentors.find((m) => m.id === id) || null);
    else setMentor(mentors.find((m) => m.id === "qiyun") || null);
  }, []);

  if (!mentor) return null;

  const mentorCourses = mentor.courseIds.map((cid) => courses.find((c) => c.id === cid)).filter(Boolean);
  const avgRating = mentorCourses.length > 0 ? (mentorCourses.reduce((s, c) => s + (c?.rating || 0), 0) / mentorCourses.length).toFixed(1) : "—";
  const totalStudents = mentorCourses.reduce((s, c) => s + (c?.reviewCount || 0), 0);
  const activities = newsItems.filter((n) => n.category === "activity");

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>书录</h1>

      {/* Stats grid — scroll/ink aesthetic */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard icon="📜" value={String(mentorCourses.length)} label="已刊行典籍" />
        <StatCard icon="👥" value={String(totalStudents)} label="门下学子" />
        <StatCard icon="⏱" value="1,280h" label="总学习时长" />
        <StatCard icon="⭐" value={avgRating} label="平均评分" />
        <StatCard icon="✏️" value="76%" label="策问完成率" />
        <StatCard icon="🎋" value={String(activities.length)} label="雅集举办" />
      </div>

      {/* Course ranking */}
      <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000] mb-8">
        <h2 className="text-[18px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>课程热度排行</h2>
        <div className="space-y-3">
          {[...mentorCourses].sort((a, b) => (b?.reviewCount || 0) - (a?.reviewCount || 0)).slice(0, 5).map((c, i) => (
            c && (
              <div key={c.id} className="flex items-center gap-4 p-3">
                <span className="text-[18px] text-[#000] font-bold w-[30px]" style={{ fontFamily: "'Times New Roman', serif" }}>#{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</p>
                    <span className="text-[12px] text-[#000] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.reviewCount} 人</span>
                  </div>
                  <div className="h-[3px] bg-[#eee] rounded-full"><div className="h-full bg-[#000] rounded-full" style={{ width: `${Math.min((c.reviewCount / 500) * 100, 100)}%` }} /></div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000]">
        <h2 className="text-[18px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>最新评语</h2>
        <div className="space-y-2">
          {mentorCourses.slice(0, 3).map((c) => (
            c?.chapters[0]?.modules.reviews?.slice(0, 1).map((rv) => (
              <div key={rv.id} className="p-3 bg-white rounded-[8px] border border-[#000]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{rv.userName}</span>
                  <span className="text-[12px] text-[#C5A46D]">{rv.rating}★</span>
                  <span className="text-[10px] text-[#000] opacity-40 ml-auto">{rv.date}</span>
                </div>
                <p className="text-[12px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{rv.comment}</p>
                <p className="text-[10px] text-[#000] opacity-30 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</p>
              </div>
            ))
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="p-6 bg-[#fafafa] rounded-[14px] border-2 border-[#000] text-center">
      <p className="text-[28px] m-0 mb-2">{icon}</p>
      <p className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[13px] text-[#000] m-0 mt-1 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
    </div>
  );
}
