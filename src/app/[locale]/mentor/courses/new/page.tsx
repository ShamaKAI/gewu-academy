"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import type { Course, Chapter, ChapterModules } from "@/data/courses";

const STEPS = ["课程信息", "讲学影卷", "讲义", "正文", "策问"] as const;
type Step = typeof STEPS[number];

const emptyModules = (): ChapterModules => ({
  videos: [], pptFiles: [],
  content: "", exercises: [], reviews: [],
});

export default function NewCoursePage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = (t.mentor as Record<string, string>) || {};
  const [step, setStep] = useState<Step>("课程信息");

  // Draft state — persisted in localStorage under "gewu-course-draft"
  const [draft, setDraft] = useState<{
    title: string; category: string; description: string; duration: string;
    videoUrls: string; pptUrls: string; content: string; exercises: string;
  }>(() => {
    try { const raw = localStorage.getItem("gewu-course-draft"); if (raw) return JSON.parse(raw); } catch {}
    return { title: "", category: "", description: "", duration: "", videoUrls: "", pptUrls: "", content: "", exercises: "" };
  });

  const stepIdx = STEPS.indexOf(step);
  const update = (k: string, v: string) => {
    const next = { ...draft, [k]: v };
    setDraft(next);
    localStorage.setItem("gewu-course-draft", JSON.stringify(next));
  };

  const saveDraft = () => {
    localStorage.setItem("gewu-course-draft", JSON.stringify(draft));
    alert("草稿已保存至本地。");
  };

  const publish = () => {
    if (!draft.title.trim()) { alert("请填写课程名称。"); return; }

    const newCourse: Course = {
      id: `mentor-${Date.now()}`,
      title: draft.title,
      category: draft.category || "理财规划",
      difficulty: "intermediate",
      instructor: "栖云先生",
      description: draft.description || draft.title,
      duration: draft.duration || "20h",
      rating: 0, reviewCount: 0, likeCount: 0, viewCount: 0,
      coverImage: `https://picsum.photos/seed/${Date.now()}/400/250`,
      progress: 0, status: "not_started",
      chapters: [{
        slug: "ch1",
        title: `第一章 ${draft.title}`,
        sections: [{ slug: "s1-1", title: `1.1 ${draft.title}`, chapterSlug: "ch1" }],
        modules: {
          ...emptyModules(),
          videos: draft.videoUrls ? draft.videoUrls.split("\n").filter(Boolean).map((url, i) => ({ id: `v-${i}`, title: `视频 ${i + 1}`, src: url, type: "mp4" })) : [],
          pptFiles: draft.pptUrls ? draft.pptUrls.split("\n").filter(Boolean).map((url, i) => ({ id: `ppt-${i}`, title: `讲义 ${i + 1}`, type: "pdf" as const, src: url })) : [],
          content: draft.content || `# ${draft.title}\n\n${draft.description || "课程内容待完善。"}`,
          exercises: [],
        },
      }],
    };

    // Save to localStorage
    try {
      const existingRaw = localStorage.getItem("gewu-published-courses");
      const existing: Course[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(newCourse);
      localStorage.setItem("gewu-published-courses", JSON.stringify(existing));
    } catch { /* ignore */ }

    // Clear draft
    localStorage.removeItem("gewu-course-draft");

    alert(`课程"${draft.title}"已刊行！自动同步至学子端书院和典籍页面。`);
    router.push(`/${locale}/mentor`);
  };

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>著书</h1>
      <p className="text-[14px] text-[#000] opacity-50 m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>创建新课程，逐步填写信息后刊行典籍。发布后自动同步至学子端。</p>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {STEPS.map((st, i) => (
          <div key={st} className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-bold border ${
            step === st ? "bg-[#000] text-white border-[#000]" : i < stepIdx ? "bg-[#f0f0f0] text-[#000] border-[#000]" : "bg-white text-[#000] border-[#ccc]"
          }`} style={{ fontFamily: "var(--font-serif)" }}>
            <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px]`} style={{ borderColor: step === st ? "#fff" : "#000", color: step === st ? "#fff" : "#000" }}>{i + 1}</span>
            {st}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl">
          {step === "课程信息" && (
            <div className="space-y-4">
              <F label="课程名称" value={draft.title} onChange={(v) => update("title", v)} placeholder="如：《财富管理的底层逻辑》" />
              <F label="课程分类" value={draft.category} onChange={(v) => update("category", v)} placeholder="如：理财规划" />
              <F label="课程简介" value={draft.description} onChange={(v) => update("description", v)} placeholder="简要描述课程内容..." isTextarea />
              <F label="学时" value={draft.duration} onChange={(v) => update("duration", v)} placeholder="如：24h" />
            </div>
          )}

          {step === "讲学影卷" && (
            <div className="space-y-4">
              <p className="text-[14px] text-[#000] opacity-60 mb-2" style={{ fontFamily: "var(--font-serif)" }}>上传视频链接（每行一个URL）。同步至学子端课程视频模块。</p>
              <F label="视频链接" value={draft.videoUrls} onChange={(v) => update("videoUrls", v)} placeholder="https://example.com/video1.mp4&#10;https://example.com/video2.mp4" isTextarea />
            </div>
          )}

          {step === "讲义" && (
            <div className="space-y-4">
              <p className="text-[14px] text-[#000] opacity-60 mb-2" style={{ fontFamily: "var(--font-serif)" }}>上传讲义链接（每行一个URL）。同步至学子端课程PPT模块。</p>
              <F label="讲义链接" value={draft.pptUrls} onChange={(v) => update("pptUrls", v)} placeholder="https://example.com/slides1.pdf&#10;https://example.com/slides2.pdf" isTextarea />
            </div>
          )}

          {step === "正文" && (
            <div className="space-y-4">
              <p className="text-[14px] text-[#000] opacity-60 mb-2" style={{ fontFamily: "var(--font-serif)" }}>编写课程正文内容。同步至学子端课程内容模块。</p>
              <F label="课程正文" value={draft.content} onChange={(v) => update("content", v)} placeholder="在此编写课程正文内容。支持 Markdown 格式。" isTextarea isLarge />
            </div>
          )}

          {step === "策问" && (
            <div className="space-y-4">
              <p className="text-[14px] text-[#000] opacity-60 mb-2" style={{ fontFamily: "var(--font-serif)" }}>布置课后策问（习题）。暂不支持在此页面直接编辑——课程刊行后在详情页添加。</p>
              <div className="p-8 border-2 border-dashed border-[#000] rounded-[14px] text-center">
                <p className="text-[#000] text-[14px] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>策问将在课程详情页中详细编辑</p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="flex items-center justify-between mt-10 max-w-2xl">
        <button onClick={() => stepIdx > 0 && setStep(STEPS[stepIdx - 1])} disabled={stepIdx === 0}
          className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border border-[#000] bg-transparent cursor-pointer hover:bg-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-serif)" }}>上一步</button>

        <div className="flex gap-3">
          <button onClick={saveDraft}
            className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]"
            style={{ fontFamily: "var(--font-serif)" }}>保存草稿</button>

          {stepIdx < STEPS.length - 1 ? (
            <button onClick={() => setStep(STEPS[stepIdx + 1])}
              className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333]"
              style={{ fontFamily: "var(--font-serif)" }}>下一步</button>
          ) : (
            <button onClick={publish}
              className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333]"
              style={{ fontFamily: "var(--font-serif)" }}>刊行典籍</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function F({ label, value, onChange, placeholder, isTextarea, isLarge }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; isTextarea?: boolean; isLarge?: boolean }) {
  const C = isTextarea ? "textarea" : "input";
  return (
    <div>
      <label className="block text-[13px] text-[#000] font-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>{label}</label>
      <C value={value} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-[10px] border-2 border-[#000] text-[15px] text-[#000] outline-none ${isLarge ? "h-[300px]" : isTextarea ? "h-[120px]" : ""} resize-y`}
        style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }} />
    </div>
  );
}
