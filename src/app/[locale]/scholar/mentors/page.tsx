"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { courses as allCourses } from "@/data/courses";

/* ============================================================
   格物学院 · 师者页面 — 钻取式：师者列表 → 课程列表
   ============================================================ */

interface MentorData {
  name: string;
  title: string;
  avatar: string;
  courseIds: string[];
  // Decorative background accent
  accent: string;
}

const mentors: MentorData[] = [
  {
    name: "王阳明",
    title: "心学宗师",
    avatar: "https://picsum.photos/seed/portrait-wang/300/300",
    courseIds: ["great-learning"],
    accent: "#8B5E83",
  },
  {
    name: "孔孟研",
    title: "儒学传道",
    avatar: "https://picsum.photos/seed/portrait-kong/300/300",
    courseIds: ["lunyu"],
    accent: "#C4736E",
  },
  {
    name: "孙武",
    title: "兵道谋主",
    avatar: "https://picsum.photos/seed/portrait-sun/300/300",
    courseIds: ["sunzi"],
    accent: "#5B8C85",
  },
  {
    name: "老子风",
    title: "道法自然",
    avatar: "https://picsum.photos/seed/portrait-lao/300/300",
    courseIds: ["daodejing"],
    accent: "#6E8DC4",
  },
  {
    name: "陈省身",
    title: "数理推手",
    avatar: "https://picsum.photos/seed/portrait-chen/300/300",
    courseIds: ["fin-math", "risk-mgmt"],
    accent: "#C49A3C",
  },
];

export default function MentorsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;
  const [selectedMentor, setSelectedMentor] = useState<MentorData | null>(null);

  return (
    <motion.div
      className="px-10 py-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* ====== Level 1: Mentor List ====== */}
      <AnimatePresence mode="wait">
        {!selectedMentor && (
          <motion.div
            key="mentor-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h1
              className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {s.nav_mentors}
            </h1>

            <div className="flex flex-col gap-5">
              {mentors.map((mentor, idx) => {
                const teacherCourses = mentor.courseIds
                  .map((cid) => allCourses.find((c) => c.id === cid))
                  .filter(Boolean);

                return (
                  <motion.button
                    key={mentor.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.35 }}
                    onClick={() => setSelectedMentor(mentor)}
                    className="w-full relative overflow-hidden rounded-[16px] border-2 border-[#000] bg-white text-left cursor-pointer group"
                    whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                  >
                    {/* Decorative accent strip */}
                    <div
                      className="absolute top-0 left-0 w-2 h-full"
                      style={{ background: mentor.accent }}
                    />

                    <div className="flex items-center gap-6 pl-8 pr-8 py-6">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="absolute inset-0 rounded-full blur-md opacity-30 scale-110"
                          style={{ background: mentor.accent }}
                        />
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="relative w-[90px] h-[90px] rounded-full object-cover border-[3px] border-[#000]"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-2">
                          <h2
                            className="text-[24px] text-[#000] font-bold m-0"
                            style={{ fontFamily: "var(--font-serif)" }}
                          >
                            {mentor.name}
                          </h2>
                          <span
                            className="text-[12px] text-white px-3 py-[4px] rounded-[20px] font-bold"
                            style={{
                              background: mentor.accent,
                              fontFamily: "var(--font-serif)",
                            }}
                          >
                            {mentor.title}
                          </span>
                        </div>
                        <p
                          className="text-[13px] text-[#000] m-0 mb-3"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          讲授 {teacherCourses.length} 门课程 · 学子 {Math.floor(Math.random() * 3000) + 500} 人
                        </p>
                        {/* Course name tags */}
                        <div className="flex gap-2 flex-wrap">
                          {teacherCourses.map((c) => (
                            c && (
                              <span
                                key={c.id}
                                className="text-[12px] text-[#000] px-3 py-[3px] rounded-[6px] border border-[#000] font-bold bg-[#fafafa]"
                                style={{ fontFamily: "var(--font-serif)" }}
                              >
                                {c.title}
                              </span>
                            )
                          ))}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0 text-[24px] text-[#000] opacity-30 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== Level 2: Selected Mentor's Courses ====== */}
      <AnimatePresence mode="wait">
        {selectedMentor && (
          <motion.div
            key="mentor-courses"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Back button */}
            <button
              onClick={() => setSelectedMentor(null)}
              className="flex items-center gap-2 mb-8 text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              ← 返回师者列表
            </button>

            {/* Mentor header */}
            <div className="flex items-center gap-5 mb-8">
              <div className="relative flex-shrink-0">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-25 scale-110"
                  style={{ background: selectedMentor.accent }}
                />
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="relative w-[70px] h-[70px] rounded-full object-cover border-[3px] border-[#000]"
                />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1
                    className="text-[26px] text-[#000] font-bold m-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {selectedMentor.name}
                  </h1>
                  <span
                    className="text-[12px] text-white px-3 py-[3px] rounded-[20px] font-bold"
                    style={{
                      background: selectedMentor.accent,
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    {selectedMentor.title}
                  </span>
                </div>
                <p
                  className="text-[13px] text-[#000] m-0"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  所授课程
                </p>
              </div>
            </div>

            {/* Course list — long horizontal cards */}
            <div className="flex flex-col gap-3">
              {selectedMentor.courseIds.map((cid, idx) => {
                const course = allCourses.find((c) => c.id === cid);
                if (!course) return null;
                return (
                  <motion.button
                    key={cid}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    onClick={() =>
                      router.push(`/${locale}/scholar/courses/${cid}`)
                    }
                    className="flex items-center gap-5 bg-white rounded-[14px] border-2 border-[#000] p-4 cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left"
                    whileHover={{ y: -1, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="w-[5px] h-[60px] rounded-full flex-shrink-0"
                      style={{ background: selectedMentor.accent }}
                    />

                    {/* Cover image */}
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-[100px] h-[65px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]"
                    />

                    {/* Course info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-[16px] text-[#000] font-bold m-0 mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {course.title}
                      </h3>
                      <p
                        className="text-[12px] text-[#000] m-0 line-clamp-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {course.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex-shrink-0 flex flex-col items-end gap-1">
                      <span
                        className="text-[13px] text-[#000] font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        ★ {course.rating}
                      </span>
                      <span
                        className="text-[11px] text-[#000]"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {course.duration} · {course.category}
                      </span>
                    </div>

                    {/* Arrow */}
                    <span className="flex-shrink-0 text-[#000] text-[20px] opacity-40">
                      →
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
