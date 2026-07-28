"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Course } from "@/data/courses";
import { useTranslation } from "@/i18n/useTranslation";
import { IconStar } from "./Icons";

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="text-[12px]" style={{ color: i <= Math.round(rating) ? "#C5A46D" : "#ddd" }}>
          <IconStar />
        </span>
      ))}
      <span className="text-[13px] ml-1 font-bold text-[#000]" style={{ fontFamily: "'Times New Roman', serif" }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

const STATUS_MAP = {
  not_started: { color: "#000", bg: "#eee" },
  in_progress: { color: "#C5A46D", bg: "#faf5eb" },
  completed: { color: "#000", bg: "#e8e8e8" },
} as const;

export default function CourseListCard({ course, locale }: { course: Course; locale: string }) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <Link href={`/${locale}/scholar/courses/${course.id}`} className="no-underline">
      <motion.div
        className="flex gap-5 bg-white rounded-[12px] border border-[#000] p-4 cursor-pointer"
        whileHover={{ y: -2, borderColor: "#000", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
      >
        <div className="w-[160px] h-[100px] flex-shrink-0 rounded-[8px] overflow-hidden bg-[#e8e8e8]">
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[17px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>
                {course.title}
              </h3>
              {course.status !== "not_started" && (
                <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold flex-shrink-0"
                  style={{ color: STATUS_MAP[course.status].color, background: STATUS_MAP[course.status].bg, fontFamily: "var(--font-serif)" }}>
                  {s[`courses_status_${course.status}`]}
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#000] m-0 mb-1 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>
              {course.description}
            </p>
          </div>
          <div className="flex items-center gap-5 text-[13px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>
            <span className="font-bold">{course.instructor}</span>
            <span className="opacity-30">|</span>
            <span>{course.category}</span>
            <span className="opacity-30">|</span>
            <span>{course.duration}</span>
            <span className="opacity-30">|</span>
            <span className="inline-flex items-center gap-1">
              <StarRating rating={course.rating} />
            </span>
            {/* Views icon */}
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              <span style={{ fontFamily: "'Times New Roman', serif" }}>{course.viewCount.toLocaleString()}</span>
            </span>
            {/* Comments icon */}
            <span className="inline-flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <span style={{ fontFamily: "'Times New Roman', serif" }}>{course.reviewCount.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
