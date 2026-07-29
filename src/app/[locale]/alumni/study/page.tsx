"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StudyPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = (t.alumni as Record<string, string>) || {};
  const username = "张物学";

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>我的书斋</h1>

      {/* Profile card */}
      <div className="p-6 bg-white rounded-[16px] border-2 border-[#000] mb-8 max-w-2xl">
        <div className="flex items-start gap-5">
          <div className="w-[90px] h-[90px] rounded-full bg-[#eee] flex items-center justify-center text-[28px] font-bold flex-shrink-0 border-2 border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>张</div>
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="text-[24px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{username}</h2>
              <span className="text-[14px] text-[#000] opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>Zhang Wuxue</span>
            </div>
            <p className="text-[13px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>高级财富顾问 · 新加坡 · 加入书院 2025年3月</p>
            <p className="text-[13px] text-[#000] m-0 mt-2 italic" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
              &ldquo;学然后知不足，教然后知困。&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8 max-w-2xl">
        <StatCard icon="📚" value="12" label="完成课程" />
        <StatCard icon="📜" value="5" label="发表文章" />
        <StatCard icon="🎋" value="8" label="参加雅集" />
        <StatCard icon="🏆" value="6" label="获得徽章" />
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl">
        <button onClick={() => router.push(`/${locale}/scholar/courses`)}
          className="p-5 bg-white rounded-[12px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>📖 继续学习</p>
          <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>返回学子端继续课程</p>
        </button>
        <button onClick={() => router.push(`/${locale}/alumni/achievements`)}
          className="p-5 bg-white rounded-[12px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>🏆 功名录</p>
          <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>查看证书与徽章</p>
        </button>
        <button onClick={() => alert("编辑资料功能即将开放")}
          className="p-5 bg-white rounded-[12px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>✏️ 编辑资料</p>
          <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>更新个人名帖</p>
        </button>
        <button onClick={() => alert("设置功能即将开放")}
          className="p-5 bg-white rounded-[12px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>⚙ 设置</p>
          <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>通知与隐私</p>
        </button>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="p-5 bg-[#fafafa] rounded-[14px] border border-[#000] text-center">
      <p className="text-[24px] m-0 mb-1">{icon}</p>
      <p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
    </div>
  );
}
