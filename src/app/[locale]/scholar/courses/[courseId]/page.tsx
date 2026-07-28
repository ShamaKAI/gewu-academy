"use client";

import { useState, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import KnowledgeTree from "@/components/scholar/KnowledgeTree";
import TocAccordion from "@/components/scholar/TocAccordion";
import type { CourseSection } from "@/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const courseId = params?.courseId as string;
  const locale = (params?.locale as string) || "zh";

  const course = courses.find((c) => c.id === courseId);

  const [treeVisible, setTreeVisible] = useState(true);

  // Flatten all sections for the tree
  const allSections: CourseSection[] = course
    ? course.chapters.flatMap((ch) => ch.sections)
    : [];

  const handleNodeClick = (slug: string) => {
    // Navigate to the section page if it's a section slug
    const isSection = allSections.some((s) => s.slug === slug);
    if (isSection) {
      router.push(`/${locale}/scholar/courses/${courseId}/${slug}`);
    } else {
      // It's a chapter slug — scroll to that chapter in TOC
      const el = document.getElementById(`toc-${slug}`);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#999] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>
          课程不存在
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Left: Knowledge Tree */}
      <div className="relative" style={{ width: treeVisible ? "360px" : "0px", transition: "width 0.3s ease" }}>
        {treeVisible && (
          <div className="w-[360px] h-full flex flex-col border-r border-[#eee] bg-[#fafafa]">
            {/* Tree header */}
            <div className="px-5 py-4 border-b border-[#eee] flex items-center justify-between">
              <h2
                className="text-[16px] text-[#000] font-bold m-0"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.knowledge_tree}
              </h2>
              <button
                onClick={() => setTreeVisible(false)}
                className="text-[12px] text-[#999] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {s.collapse_tree} ◀
              </button>
            </div>
            <div className="flex-1">
              <KnowledgeTree
                chapters={course.chapters}
                sections={allSections}
                onNodeClick={handleNodeClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* Toggle button when tree hidden */}
      {!treeVisible && (
        <button
          onClick={() => setTreeVisible(true)}
          className="absolute left-0 top-4 z-20 bg-white border border-[#ccc] rounded-r-[8px] px-2 py-4 text-[12px] text-[#666] hover:text-[#333] transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.expand_tree} ▶
        </button>
      )}

      {/* Right: Course Title + TOC */}
      <div className="flex-1 overflow-y-auto">
        {/* Course header */}
        <div className="px-10 pt-8 pb-6 border-b border-[#eee]">
          <div className="flex items-center gap-4 mb-2">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-14 h-14 rounded-[8px] object-cover"
            />
            <div>
              <h1
                className="text-[24px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {course.title}
              </h1>
              <p className="text-[13px] text-[#999] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>
                {course.instructor} · {course.category} · {course.duration}
              </p>
            </div>
          </div>
        </div>

        {/* TOC */}
        <div className="pt-2">
          <TocAccordion
            chapters={course.chapters}
            courseId={courseId}
            locale={locale}
          />
        </div>
      </div>
    </motion.div>
  );
}
