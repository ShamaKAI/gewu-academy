"use client";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

export default function ForumPostPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = (t.alumni as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0 }}>
      <button onClick={() => router.back()} className="text-[14px] text-[#000] bg-transparent border-none cursor-pointer mb-6" style={{ fontFamily: "var(--font-serif)" }}>← 返回百家论道</button>
      <div className="max-w-2xl">
        <h1 className="text-[24px] text-[#000] font-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>文章详情</h1>
        <p className="text-[14px] text-[#000] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>文章阅读与评论功能即将开放。</p>
      </div>
    </motion.div>
  );
}
