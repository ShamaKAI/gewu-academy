"use client";

import React, { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

export default function NewEventPage() {
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  const [draft, setDraft] = useState({ title: "", host: "", time: "", location: "", description: "", cover: "", limit: "" });
  const update = (k: string, v: string) => setDraft((p) => ({ ...p, [k]: v }));

  return (
    <motion.div className="px-10 py-8 pb-12 max-w-2xl" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>发起雅集</h1>
      <p className="text-[14px] text-[#000] opacity-50 m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>发布后自动同步至学子端院讯</p>

      <div className="space-y-4">
        <F label="雅集主题" v={draft.title} onChange={(v) => update("title", v)} ph="如：《论语》夏季研讨会" />
        <F label="主讲人物" v={draft.host} onChange={(v) => update("host", v)} ph="如：栖云先生" />
        <F label="举办时间" v={draft.time} onChange={(v) => update("time", v)} ph="如：2026年8月15日 14:00-17:00" />
        <F label="举办地点" v={draft.location} onChange={(v) => update("location", v)} ph="如：格物书院·明理堂" />
        <F label="报名人数限制" v={draft.limit} onChange={(v) => update("limit", v)} ph="如：100 人" />
        <F label="活动简介" v={draft.description} onChange={(v) => update("description", v)} ph="简要介绍雅集内容..." isTextarea />
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={() => alert("草稿已保存。")} className="px-6 py-2.5 rounded-[8px] text-[14px] font-bold border border-[#000] bg-white cursor-pointer hover:bg-[#f0f0f0]" style={{ fontFamily: "var(--font-serif)" }}>保存草稿</button>
        <button onClick={() => alert("雅集已发布！同步至学子端院讯。")} className="px-6 py-2.5 rounded-[8px] text-[14px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>发布雅集</button>
      </div>
    </motion.div>
  );
}

function F({ label, v, onChange, ph, isTextarea }: { label: string; v: string; onChange: (v: string) => void; ph: string; isTextarea?: boolean }) {
  const C = isTextarea ? "textarea" : "input";
  return (
    <div>
      <label className="block text-[13px] text-[#000] font-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>{label}</label>
      <C value={v} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)} placeholder={ph}
        className={`w-full px-4 py-3 rounded-[10px] border-2 border-[#000] text-[15px] text-[#000] outline-none ${isTextarea ? "h-[100px] resize-y" : ""}`}
        style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }} />
    </div>
  );
}
