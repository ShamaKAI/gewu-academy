"use client";

import React, { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = ["课程信息", "讲学影卷", "讲义", "正文", "策问"] as const;
type Step = typeof STEPS[number];

export default function NewCoursePage() {
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  const [step, setStep] = useState<Step>("课程信息");
  const [draft, setDraft] = useState({ title: "", category: "", description: "", duration: "" });
  const stepIdx = STEPS.indexOf(step);

  const updateDraft = (k: string, v: string) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>著书</h1>
      <p className="text-[14px] text-[#000] opacity-50 m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>创建新课程，逐步填写信息后刊行典籍</p>

      {/* Step indicators */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((st, i) => (
          <div key={st} className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[13px] font-bold border ${
            step === st ? "bg-[#000] text-white border-[#000]" : i < stepIdx ? "bg-[#f0f0f0] text-[#000] border-[#000]" : "bg-white text-[#000] border-[#ccc]"
          }`} style={{ fontFamily: "var(--font-serif)" }}>
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]" style={{ borderColor: step === st ? "#fff" : "#000", color: step === st ? "#fff" : "#000" }}>{i + 1}</span>
            {st}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl">
          {/* Step 1: Course Info */}
          {step === "课程信息" && (
            <div className="space-y-4">
              <InputField label="课程名称" value={draft.title} onChange={(v) => updateDraft("title", v)} placeholder="如：《财富管理的底层逻辑》" />
              <InputField label="课程分类" value={draft.category} onChange={(v) => updateDraft("category", v)} placeholder="如：理财规划" />
              <InputField label="课程简介" value={draft.description} onChange={(v) => updateDraft("description", v)} placeholder="简要描述课程内容..." isTextarea />
              <InputField label="学时" value={draft.duration} onChange={(v) => updateDraft("duration", v)} placeholder="如：24h" />
            </div>
          )}

          {/* Step 2-5 */}
          {step === "讲学影卷" && <PlaceholderStep title="讲学影卷" desc="上传课程视频（支持 MP4, MOV, WebM），可按章节组织。内容将同步至学子端。" />}
          {step === "讲义" && <PlaceholderStep title="讲义" desc="上传PPT/PDF课件。同步至学子端课程PPT模块。" />}
          {step === "正文" && <PlaceholderStep title="正文" desc="编写课程正文内容，支持富文本、图片和公式。同步至学子端课程内容模块。" />}
          {step === "策问" && <PlaceholderStep title="策问" desc="布置课后策问（习题），支持单选、多选、判断、填空和简答题型。" />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 max-w-2xl">
        <button onClick={() => stepIdx > 0 && setStep(STEPS[stepIdx - 1])}
          disabled={stepIdx === 0}
          className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border border-[#000] bg-transparent cursor-pointer hover:bg-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-serif)" }}>上一步</button>

        <div className="flex gap-3">
          <button onClick={() => alert("草稿已保存。")}
            className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]"
            style={{ fontFamily: "var(--font-serif)" }}>保存草稿</button>

          {stepIdx < STEPS.length - 1 ? (
            <button onClick={() => setStep(STEPS[stepIdx + 1])}
              className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333]"
              style={{ fontFamily: "var(--font-serif)" }}>下一步</button>
          ) : (
            <button onClick={() => alert("课程已刊行！同步至学子端典籍。")}
              className="px-5 py-2.5 rounded-[8px] text-[14px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333]"
              style={{ fontFamily: "var(--font-serif)" }}>刊行典籍</button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function InputField({ label, value, onChange, placeholder, isTextarea }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; isTextarea?: boolean }) {
  const C = isTextarea ? "textarea" : "input";
  return (
    <div>
      <label className="block text-[13px] text-[#000] font-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>{label}</label>
      <C value={value} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-[10px] border-2 border-[#000] text-[15px] text-[#000] outline-none ${isTextarea ? "h-[120px] resize-y" : ""}`}
        style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }} />
    </div>
  );
}

function PlaceholderStep({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-10 border-2 border-dashed border-[#000] rounded-[14px] text-center">
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
      <p className="text-[14px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{desc}</p>
    </div>
  );
}
