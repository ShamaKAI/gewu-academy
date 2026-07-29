"use client";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

export default function NewCoursePage() {
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  return (
    <motion.div className="px-10 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-[28px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{s.mentor_nav_new_course || "著书"}</h1>
      <p className="text-[15px] text-[#000] mt-4 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>课程创建功能即将开放，敬请期待。</p>
    </motion.div>
  );
}
