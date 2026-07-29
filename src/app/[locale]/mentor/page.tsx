"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import MentorCard from "@/components/mentor/MentorCard";
import { mentors } from "@/data/mentors";
import { courses as allCourses } from "@/data/courses";
import type { MentorProfile } from "@/data/mentors";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "mentor_greeting_wan";
  if (h < 12) return "mentor_greeting_chen";
  if (h < 14) return "mentor_greeting_wu";
  if (h < 18) return "mentor_greeting_afternoon";
  return "mentor_greeting_wan";
}

export default function MentorHome() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.mentor as Record<string, string>;
  const [mentor, setMentor] = useState<MentorProfile | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("gewu-mentor-id");
    if (id) {
      const found = mentors.find((m) => m.id === id);
      setMentor(found || null);
      if (!found) router.push(`/${locale}/mentor/select`);
    } else {
      router.push(`/${locale}/mentor/select`);
    }
  }, [locale, router]);

  if (!mentor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#000] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>加载中...</p>
      </div>
    );
  }

  const greetingKey = getGreeting();
  const greetingText = s[greetingKey]?.replace("{name}", mentor.name) || `早安，${mentor.name}，欢迎来到格物讲堂。`;

  // Get mentor's courses from all courses
  const mentorCourses = mentor.courseIds.map((cid) => allCourses.find((c) => c.id === cid)).filter(Boolean);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {/* Greeting */}
      <p className="text-[16px] text-[#000] m-0 mb-8 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
        {greetingText}
      </p>

      {/* Mentor Card */}
      <MentorCard mentor={mentor} />

      {/* Published Courses — 藏经阁 */}
      <h2 className="text-[22px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>
        {s.mentor_nav_library} ({mentor.courseIds.length})
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {mentorCourses.map((c, i) => (
          c && (
            <motion.button key={c.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              onClick={() => router.push(`/${locale}/mentor/courses/${c.id}`)}
              className="flex gap-4 p-5 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left"
              whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
              <img src={c.coverImage} alt={c.title} className="w-[90px] h-[65px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] text-[#000] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{c.title}</h3>
                <p className="text-[12px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{c.category} · {c.duration}</p>
                <p className="text-[12px] text-[#000] m-0 mt-1 opacity-40" style={{ fontFamily: "var(--font-serif)" }}>{c.reviewCount} 人评价 · ★{c.rating}</p>
              </div>
              <span className="self-center text-[20px] text-[#000] opacity-30 flex-shrink-0">→</span>
            </motion.button>
          )
        ))}
      </div>
    </motion.div>
  );
}
