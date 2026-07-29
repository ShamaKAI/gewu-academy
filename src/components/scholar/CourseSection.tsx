"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import CourseCard, { type CourseData } from "./CourseCard";

/* ============================================================
   CourseSection — 模块容器（标题栏 + 卡片网格）
   columns: 2 | 3 | 4  — 查看更多跳转到典籍页，可携带分类筛选
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
  locale?: string;
  filterCategory?: string;
  filterModule?: string; // e.g. "my" | "featured" | "required" | "selection" | "mentor"
  filterCourseIds?: string[]; // comma-separated in URL
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
  locale = "zh",
  filterCategory,
}: CourseSectionProps) {
  const gridClass =
    columns === 2
      ? "grid grid-cols-2 gap-5"
      : columns === 3
        ? "grid grid-cols-3 gap-4"
        : "grid grid-cols-4 gap-4";

  const courseIds = courses.map((c) => c.id).join(",");
  const moreHref = onMore ? "#" : `/${locale}/scholar/courses?ids=${encodeURIComponent(courseIds)}${filterCategory ? `&cat=${encodeURIComponent(filterCategory)}` : ""}`;

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-[18px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h2>
        {onMore ? (
          <span onClick={onMore}
            className="text-[13px] text-[#000] cursor-pointer hover:underline transition-colors font-bold"
            style={{ fontFamily: "var(--font-serif)" }}>{moreLabel} →</span>
        ) : (
          <Link href={moreHref}
            className="text-[13px] text-[#000] cursor-pointer hover:underline transition-colors font-bold no-underline"
            style={{ fontFamily: "var(--font-serif)" }}>{moreLabel} →</Link>
        )}
      </div>

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
            locale={locale}
          />
        ))}
      </div>
    </motion.div>
  );
}
