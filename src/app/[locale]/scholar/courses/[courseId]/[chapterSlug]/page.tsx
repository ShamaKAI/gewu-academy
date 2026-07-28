"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import VideoModule from "@/components/scholar/modules/VideoModule";
import PptModule from "@/components/scholar/modules/PptModule";
import ContentModule from "@/components/scholar/modules/ContentModule";
import NotesModule from "@/components/scholar/modules/NotesModule";
import ExercisesModule from "@/components/scholar/modules/ExercisesModule";
import ReviewModule from "@/components/scholar/modules/ReviewModule";

const TAB_ICONS = ["video", "ppt", "content", "notes", "exercises", "review"] as const;
type TabKey = (typeof TAB_ICONS)[number];

function TabIcon({ tab, size = 24 }: { tab: TabKey; size?: number }) {
  return (
    <img
      src={`/icons/tab-${tab}.png`}
      alt=""
      style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const locale = (params?.locale as string) || "zh";
  const courseId = params?.courseId as string;
  const chapterSlug = params?.chapterSlug as string;

  const course = courses.find((c) => c.id === courseId);
  let chapter = course?.chapters.find((ch) => ch.slug === chapterSlug);
  if (!chapter && course) {
    for (const ch of course.chapters) {
      if (ch.sections.some((sec) => sec.slug === chapterSlug)) { chapter = ch; break; }
    }
  }

  const [activeTab, setActiveTab] = useState<TabKey>("video");
  const chapterIdx = course?.chapters.findIndex((ch) => ch.slug === chapter?.slug) ?? -1;
  const prevChapter = chapterIdx > 0 ? course?.chapters[chapterIdx - 1] : null;
  const nextChapter = chapterIdx < (course?.chapters.length ?? 0) - 1 ? course?.chapters[chapterIdx + 1] : null;

  if (!course || !chapter) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#999] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>章节不存在</p>
      </div>
    );
  }

  return (
    <motion.div className="flex h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      {/* Left tab nav */}
      <div className="w-[200px] flex-shrink-0 flex flex-col border-r border-[#eee] bg-[#fafafa]">
        <button onClick={() => router.push(`/${locale}/scholar/courses/${courseId}`)}
          className="flex items-center gap-2 px-4 py-4 text-[13px] text-[#666] hover:text-[#333] bg-transparent border-b border-[#eee] cursor-pointer transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}>← {course.title}</button>

        <div className="px-4 py-3 border-b border-[#eee]">
          <p className="text-[11px] text-[#999] m-0 mb-0.5" style={{ fontFamily: "var(--font-serif)" }}>{chapter.title}</p>
          <div className="flex gap-2 mt-2">
            {prevChapter && <button onClick={() => router.push(`/${locale}/scholar/courses/${courseId}/${prevChapter.slug}`)} className="text-[11px] text-[#666] hover:text-[#333] bg-transparent border-none cursor-pointer px-0" style={{ fontFamily: "var(--font-serif)" }}>← 上一章</button>}
            {nextChapter && <button onClick={() => router.push(`/${locale}/scholar/courses/${courseId}/${nextChapter.slug}`)} className="text-[11px] text-[#666] hover:text-[#333] bg-transparent border-none cursor-pointer ml-auto px-0" style={{ fontFamily: "var(--font-serif)" }}>下一章 →</button>}
          </div>
        </div>

        <nav className="flex-1 flex flex-col py-2">
          {TAB_ICONS.map((key) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-5 py-3 text-[14px] text-left border-none cursor-pointer transition-all duration-200 bg-transparent ${activeTab === key ? "text-[#000] font-bold bg-white border-r-[3px] border-[#333]" : "text-[#666] hover:text-[#333] hover:bg-white/50 border-r-[3px] border-transparent"}`}
              style={{ fontFamily: "var(--font-serif)" }}>
              <TabIcon tab={key} size={22} />
              {s[`tab_${key}`]}
            </button>
          ))}
        </nav>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8">
          {activeTab === "video" && <VideoModule videos={chapter.modules.videos} s={s} />}
          {activeTab === "ppt" && <PptModule pptFiles={chapter.modules.pptFiles} s={s} />}
          {activeTab === "content" && <ContentModule content={chapter.modules.content} s={s} />}
          {activeTab === "notes" && <NotesModule content={chapter.modules.content} s={s} />}
          {activeTab === "exercises" && <ExercisesModule exercises={chapter.modules.exercises} s={s} />}
          {activeTab === "review" && <ReviewModule reviews={chapter.modules.reviews} s={s} />}
        </div>
      </div>
    </motion.div>
  );
}
