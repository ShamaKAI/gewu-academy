"use client";

import { motion } from "framer-motion";
import CourseCard, { type CourseData } from "./CourseCard";

/* ============================================================
   CourseSection — 模块容器（标题栏 + 卡片网格）
   columns: 2 | 3 | 4
   ============================================================ */

interface CourseSectionProps {
  title: string;
  moreLabel: string;
  courses: CourseData[];
  columns?: 2 | 3 | 4;
  variant?: "large" | "medium" | "small";
  showRating?: boolean;
  showMentor?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
  onMore?: () => void;
}

export default function CourseSection({
  title,
  moreLabel,
  courses,
  columns = 4,
  variant = "small",
  showRating = false,
  showMentor = false,
  showBadge = false,
  badgeLabel = "必修",
  onMore,
}: CourseSectionProps) {
  /* 列数 → grid 类名 */
  const gridClass =
    columns === 2
      ? "grid grid-cols-2 gap-5"
      : columns === 3
        ? "grid grid-cols-3 gap-4"
        : "grid grid-cols-4 gap-4";

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* -------- 标题栏 -------- */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h2>
        <span
          className="text-[13px] text-[#999] cursor-pointer hover:text-[#333] hover:underline transition-colors font-bold"
          style={{ fontFamily: "var(--font-serif)" }}
          onClick={onMore}
        >
          {moreLabel} →
        </span>
      </div>

      {/* -------- 卡片网格 -------- */}
      <div className={gridClass}>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            variant={variant}
            showRating={showRating}
            showMentor={showMentor}
            showBadge={showBadge}
            badgeLabel={badgeLabel}
          />
        ))}
      </div>
    </motion.div>
  );
}
