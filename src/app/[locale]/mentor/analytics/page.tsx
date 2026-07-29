"use client";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  return (
    <motion.div className="px-10 py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-[28px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{s.mentor_nav_analytics || "书录"}</h1>
      <p className="text-[15px] text-[#000] mt-4 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>教学数据仪表盘开发中（子项目D）。</p>
    </motion.div>
  );
}
