"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { mentors } from "@/data/mentors";
import { courses as staticCourses } from "@/data/courses";
import type { MentorProfile } from "@/data/mentors";
import type { Course } from "@/data/courses";

/* ── Helpers ── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "mentor_greeting_morning";
  if (h < 18) return "mentor_greeting_afternoon";
  return "mentor_greeting_evening";
}

function loadPublishedCourses(): Course[] {
  try {
    const raw = localStorage.getItem("gewu-published-courses");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export default function MentorHome() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.mentor as Record<string, string>;
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [published, setPublished] = useState<Course[]>([]);

  useEffect(() => {
    const id = localStorage.getItem("gewu-mentor-id");
    if (id) {
      const found = mentors.find((m) => m.id === id);
      setMentor(found || null);
    } else {
      localStorage.setItem("gewu-mentor-id", "qiyun");
      setMentor(mentors.find((m) => m.id === "qiyun") || null);
    }
    setPublished(loadPublishedCourses());
  }, []);

  if (!mentor) {
    return <div className="flex items-center justify-center h-full"><p className="text-[#000]">加载中...</p></div>;
  }

  const greetingKey = getGreeting();
  const greetingText = (s[greetingKey] || "上午好").replace("{name}", mentor.name);

  // Merge: static courses + published (deduped by id)
  const seen = new Set<string>();
  const staticMentorCourses = mentor.courseIds
    .map((cid) => staticCourses.find((c) => c.id === cid))
    .filter(Boolean) as Course[];
  staticMentorCourses.forEach((c) => seen.add(c.id));
  const extraPublished = published.filter((c) => !seen.has(c.id));
  const allCourses = [...staticMentorCourses, ...extraPublished];

  return (
    <motion.div className="px-10 py-10 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Greeting */}
      <p className="text-[18px] text-[#000] m-0 mb-10 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
        {greetingText}，欢迎来到格物讲堂。
      </p>

      {/* ====== Mentor Profile (matches scholar mentor detail) ====== */}
      <div className="mb-10">
        <div className="flex items-start gap-6 mb-8">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-full blur-md opacity-25 scale-110" style={{ background: "#8B5E83" }} />
            <img src={mentor.avatar} alt={mentor.name} className="relative w-[110px] h-[110px] rounded-full object-cover border-[3px] border-[#000]" />
          </div>
          <div className="pt-2">
            <div className="flex items-baseline gap-4 mb-2">
              <h1 className="text-[32px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{mentor.name}</h1>
              <span className="text-[16px] text-[#000] opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>{mentor.nameEn}</span>
            </div>
            <p className="text-[15px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{mentor.experience}</p>
          </div>
        </div>

        {/* 行业成就 */}
        <div className="mb-6">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>行业成就</h2>
          <div className="grid grid-cols-2 gap-2">
            {mentor.achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-[8px] border border-[#000]">
                <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: "#8B5E83" }} />
                <span className="text-[13px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 专业领域 */}
        <div className="mb-6">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>专业领域</h2>
          <div className="flex flex-wrap gap-2">
            {mentor.specialties.map((sp) => (
              <span key={sp} className="text-[13px] text-[#000] px-4 py-2 rounded-[20px] border border-[#000] font-bold bg-[#fafafa]" style={{ fontFamily: "var(--font-serif)" }}>{sp}</span>
            ))}
          </div>
        </div>

        {/* 从业经历 */}
        <div className="mb-6">
          <h2 className="text-[18px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>从业经历</h2>
          <p className="text-[15px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{mentor.experience}</p>
        </div>

        {/* 座右铭 */}
        {mentor.motto && (
          <div className="border-l-[3px] border-[#000] pl-5 py-2 mb-6">
            <p className="text-[16px] text-[#000] italic m-0" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
              &ldquo;{mentor.motto}&rdquo;
            </p>
            <p className="text-[11px] text-[#000] m-0 mt-1 opacity-40" style={{ fontFamily: "var(--font-serif)" }}>&mdash; 座右铭</p>
          </div>
        )}
      </div>

      {/* ====== Published Courses (藏经阁) ====== */}
      <div className="border-t border-[#000] pt-8">
        <h2 className="text-[22px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>
          藏经阁（{allCourses.length} 门已刊行典籍）
        </h2>

        {allCourses.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-[#000] rounded-[14px] text-center">
            <p className="text-[#000] text-[15px] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>暂无已刊行的典籍。前往<button onClick={() => router.push(`/${locale}/mentor/courses/new`)} className="text-[#000] underline font-bold bg-transparent border-none cursor-pointer" style={{ fontFamily: "var(--font-serif)" }}>著书</button>创建新课程。</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {allCourses.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                onClick={() => router.push(`/${locale}/mentor/courses/${c.id}`)}
                className="flex gap-4 p-5 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left"
                whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
                <img src={c.coverImage || `https://picsum.photos/seed/${c.id}/400/250`} alt={c.title} className="w-[90px] h-[65px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] text-[#000] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</h3>
                  <p className="text-[12px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.category} · {c.duration}</p>
                  <p className="text-[12px] text-[#000] m-0 mt-1 opacity-40" style={{ fontFamily: "var(--font-serif)" }}>{c.reviewCount} 人评价 · ★{c.rating || "—"}</p>
                </div>
                <span className="self-center text-[20px] text-[#000] opacity-30 flex-shrink-0">→</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
