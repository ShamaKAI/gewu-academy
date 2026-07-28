"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses as allCourses } from "@/data/courses";

/* ============================================================
   格物学院 · 师者页面 — 5 位师者，纵向列表
   ============================================================ */

interface MentorData {
  name: string;
  title: string;
  avatar: string;
  courseIds: string[];
}

const mentors: MentorData[] = [
  {
    name: "王阳明",
    title: "心学宗师",
    avatar: "https://picsum.photos/seed/wang-yangming/200/200",
    courseIds: ["great-learning"],
  },
  {
    name: "孔孟研",
    title: "儒学传道",
    avatar: "https://picsum.photos/seed/kong-meng/200/200",
    courseIds: ["lunyu"],
  },
  {
    name: "孙武",
    title: "兵道谋主",
    avatar: "https://picsum.photos/seed/sun-wu/200/200",
    courseIds: ["sunzi"],
  },
  {
    name: "老子风",
    title: "道法自然",
    avatar: "https://picsum.photos/seed/laozi/200/200",
    courseIds: ["daodejing"],
  },
  {
    name: "陈省身",
    title: "数理推手",
    avatar: "https://picsum.photos/seed/chen-xingshen/200/200",
    courseIds: ["fin-math", "risk-mgmt"],
  },
];

export default function MentorsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;

  return (
    <motion.div
      className="px-10 py-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <h1
        className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {s.nav_mentors}
      </h1>

      <div className="flex flex-col gap-5 max-w-3xl">
        {mentors.map((mentor, idx) => (
          <motion.div
            key={mentor.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.35 }}
            className="bg-white rounded-[14px] border border-[#000] p-5"
          >
            {/* Top: Avatar + Info */}
            <div className="flex items-start gap-5 mb-5">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-[#000]"
              />
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className="text-[20px] text-[#000] font-bold m-0"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {mentor.name}
                  </h2>
                  <span
                    className="text-[12px] text-[#000] px-3 py-[3px] rounded-[20px] border border-[#000] font-bold"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {mentor.title}
                  </span>
                </div>
                <p className="text-[13px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
                  教授 {mentor.courseIds.length} 门课程
                </p>
              </div>
            </div>

            {/* Bottom: Course cards */}
            <div className="flex gap-3 flex-wrap">
              {mentor.courseIds.map((cid) => {
                const course = allCourses.find((c) => c.id === cid);
                if (!course) return null;
                return (
                  <button
                    key={cid}
                    onClick={() =>
                      router.push(`/${locale}/scholar/courses/${cid}`)
                    }
                    className="flex items-center gap-3 px-4 py-3 bg-[#f7f7f7] rounded-[10px] border border-[#000] cursor-pointer hover:bg-[#eee] transition-colors text-left"
                  >
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-11 h-11 rounded-[6px] object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className="text-[14px] text-[#000] font-bold m-0 truncate"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {course.title}
                      </p>
                      <p
                        className="text-[11px] text-[#000] m-0"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {course.category} · ★{course.rating} · {course.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
