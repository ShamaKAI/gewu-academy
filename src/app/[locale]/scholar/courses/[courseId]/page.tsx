"use client";

import { useState } from "react";
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

  const allSections: CourseSection[] = course ? course.chapters.flatMap((ch) => ch.sections) : [];

  const handleNodeClick = (slug: string) => {
    const isSection = allSections.some((s) => s.slug === slug);
    if (isSection) router.push(`/${locale}/scholar/courses/${courseId}/${slug}`);
    else { const el = document.getElementById(`toc-${slug}`); el?.scrollIntoView({ behavior: "smooth" }); }
  };

  if (!course) {
    return <div className="flex items-center justify-center h-full"><p className="text-[#999] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>课程不存在</p></div>;
  }

  return (
    <motion.div className="flex flex-col h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      {/* ====== Top: Knowledge Tree ====== */}
      <div className="relative border-b border-[#eee] bg-[#fafafa]" style={{ height: treeVisible ? "min(65vh, 700px)" : "0px", transition: "height 0.35s ease", overflow: "hidden" }}>
        {/* Centered title overlay */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          <span className="text-[15px] text-[#000] font-bold pointer-events-none" style={{ fontFamily: "var(--font-serif)" }}>
            {s.knowledge_tree}
          </span>
          <span className="text-[12px] text-[#999] pointer-events-none" style={{ fontFamily: "var(--font-serif)" }}>
            — {course.title}
          </span>
        </div>
        {/* Collapse button — top right */}
        <button onClick={() => setTreeVisible(false)}
          className="absolute top-3 right-5 z-10 text-[12px] text-[#999] hover:text-[#333] transition-colors bg-transparent border-none cursor-pointer"
          style={{ fontFamily: "var(--font-serif)" }}>{s.collapse_tree} ▲</button>

        <div className="w-full h-full">
          <KnowledgeTree chapters={course.chapters} sections={allSections} locale={locale} onNodeClick={handleNodeClick} />
        </div>
      </div>

      {/* Expand toggle */}
      {!treeVisible && (
        <button onClick={() => setTreeVisible(true)} className="w-full py-2.5 bg-[#fafafa] border-b border-[#eee] text-[12px] text-[#666] hover:text-[#333] transition-colors cursor-pointer" style={{ fontFamily: "var(--font-serif)" }}>{s.expand_tree} ▼</button>
      )}

      {/* ====== Bottom: Course header + TOC ====== */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 pt-6 pb-5 border-b border-[#eee]">
          <div className="flex items-center gap-4 mb-2">
            <img src={course.coverImage} alt={course.title} className="w-14 h-14 rounded-[8px] object-cover" />
            <div>
              <h1 className="text-[24px] text-[#000] font-bold m-0 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{course.title}</h1>
              <p className="text-[13px] text-[#999] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{course.instructor} · {course.category} · {course.duration}</p>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <TocAccordion chapters={course.chapters} courseId={courseId} locale={locale} />
        </div>
      </div>
    </motion.div>
  );
}
