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
        <span key={i} className="text-[11px]" style={{ color: i <= Math.round(rating) ? "#C5A46D" : "#ddd" }}>
          <IconStar />
        </span>
      ))}
      <span className="text-[12px] ml-1 font-bold" style={{ color: "#C5A46D", fontFamily: "var(--font-display)" }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

const STATUS_MAP = {
  not_started: { color: "#999", bg: "#eee" },
  in_progress: { color: "#C5A46D", bg: "#faf5eb" },
  completed: { color: "#666", bg: "#e8e8e8" },
} as const;

export default function CourseListCard({ course, locale }: { course: Course; locale: string }) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <Link href={`/${locale}/scholar/courses/${course.id}`} className="no-underline">
      <motion.div
        className="flex gap-5 bg-white rounded-[12px] border border-[#eee] p-4 cursor-pointer"
        whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
      >
        {/* Cover */}
        <div className="w-[160px] h-[100px] flex-shrink-0 rounded-[8px] overflow-hidden bg-[#e8e8e8]">
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-[16px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>
                {course.title}
              </h3>
              {/* Status badge */}
              {course.status !== "not_started" && (
                <span
                  className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold flex-shrink-0"
                  style={{
                    color: STATUS_MAP[course.status].color,
                    background: STATUS_MAP[course.status].bg,
                    fontFamily: "var(--font-serif)",
                  }}
                >
                  {s[`courses_status_${course.status}`]}
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#666] m-0 mb-1 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-serif)" }}>
              {course.description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
            <span>{course.instructor}</span>
            <span>·</span>
            <span>{course.category}</span>
            <span>·</span>
            <span>{course.duration}</span>
            <span>·</span>
            <StarRating rating={course.rating} />
            <span className="text-[#999]">({course.reviewCount})</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
