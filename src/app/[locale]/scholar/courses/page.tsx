"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses as allCourses } from "@/data/courses";
import FilterPanel, { type FilterState } from "@/components/scholar/FilterPanel";
import CourseListCard from "@/components/scholar/CourseListCard";

export default function CoursesPage() {
  const { t, locale } = useTranslation();
  const s = t.scholar as Record<string, string>;

  const [filter, setFilter] = useState<FilterState>({
    category: "all",
    difficulty: "all",
    status: "all",
    sort: "rating",
  });

  const filtered = useMemo(() => {
    let result = [...allCourses];

    // Filter
    if (filter.category !== "all") {
      result = result.filter((c) => c.category === filter.category);
    }
    if (filter.difficulty !== "all") {
      result = result.filter((c) => c.difficulty === filter.difficulty);
    }
    if (filter.status !== "all") {
      result = result.filter((c) => c.status === filter.status);
    }

    // Sort
    switch (filter.sort) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "likes":
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case "views":
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case "newest":
        result.reverse(); // mock: reverse insertion order
        break;
    }

    return result;
  }, [filter]);

  return (
    <motion.div
      className="px-10 py-8 pb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-1.5"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.courses_title}
        </h1>
        <p className="text-[14px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
          {filtered.length} 门课程
        </p>
      </div>

      {/* Filter + Sort */}
      <FilterPanel filter={filter} onChange={setFilter} />

      {/* Course list */}
      {filtered.length === 0 ? (
        <p className="text-center text-[#000] py-20 text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
          {s.no_courses_found}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <CourseListCard course={course} locale={locale} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
