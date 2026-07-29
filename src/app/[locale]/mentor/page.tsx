"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import MentorCard from "@/components/mentor/MentorCard";
import { mentors } from "@/data/mentors";
import type { MentorProfile } from "@/data/mentors";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "mentor_greeting_morning";
  if (h < 18) return "mentor_greeting_afternoon";
  return "mentor_greeting_evening";
}

export default function MentorHome() {
  const { t } = useTranslation();
  const s = t.mentor as Record<string, string>;
  const [mentor, setMentor] = useState<MentorProfile | null>(null);

  useEffect(() => {
    const id = localStorage.getItem("gewu-mentor-id");
    if (id) {
      const found = mentors.find((m) => m.id === id);
      setMentor(found || null);
    } else {
      localStorage.setItem("gewu-mentor-id", "qiyun");
      setMentor(mentors.find((m) => m.id === "qiyun") || null);
    }
  }, []);

  if (!mentor) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#000] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>加载中...</p>
      </div>
    );
  }

  const greetingKey = getGreeting();
  const greetingText = (s[greetingKey] || "上午好").replace("{name}", mentor.name);

  return (
    <motion.div className="px-10 py-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Greeting */}
      <p className="text-[18px] text-[#000] m-0 mb-10 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
        {greetingText}，欢迎来到格物讲堂。
      </p>

      {/* Mentor Card — centered, spacious */}
      <div className="max-w-2xl mx-auto">
        <MentorCard mentor={mentor} />
      </div>
    </motion.div>
  );
}
