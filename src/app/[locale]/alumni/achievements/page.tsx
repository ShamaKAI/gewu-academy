"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const badges = [
  { name: "格物勤学", desc: "完成10门课程", icon: "📚", earned: true, date: "2026-07" },
  { name: "知行合一", desc: "完成所有课后策问", icon: "✏️", earned: true, date: "2026-06" },
  { name: "论道先锋", desc: "在百家论道发布5篇文章", icon: "📜", earned: true, date: "2026-05" },
  { name: "雅集常客", desc: "参加10次雅集活动", icon: "🎋", earned: false },
  { name: "传道授业", desc: "指导3位新同窗", icon: "🤝", earned: false },
  { name: "格物致知", desc: "累计学习200小时", icon: "⏱", earned: true, date: "2026-04" },
  { name: "书院栋梁", desc: "加入书院满2年", icon: "🏛", earned: false },
  { name: "全球视野", desc: "参加国际雅集", icon: "🌏", earned: false },
  { name: "行业翘楚", desc: "被推荐为行业导师", icon: "⭐", earned: false },
  { name: "终身学习", desc: "连续12个月保持学习", icon: "♾", earned: true, date: "2026-07" },
];

const certificates = [
  { name: "财富管理基础认证", issuer: "格物学院", date: "2026-03", icon: "📜" },
  { name: "家族财富传承高级认证", issuer: "格物学院", date: "2026-05", icon: "🏅" },
  { name: "风险管理专业认证", issuer: "格物学院", date: "2026-06", icon: "🛡" },
  { name: "全球资产配置认证", issuer: "格物学院", date: "2026-07", icon: "🌐" },
];

export default function AchievementsPage() {
  const { t } = useTranslation();
  const s = (t.alumni as Record<string, string>) || {};
  const earned = badges.filter((b) => b.earned);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>功名录</h1>

      {/* Badges */}
      <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>书院徽章（{earned.length}/{badges.length}）</h2>
      <div className="grid grid-cols-5 gap-3 mb-10">
        {badges.map((b, i) => (
          <motion.div key={b.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className={`p-4 rounded-[14px] border-2 text-center ${b.earned ? "bg-white border-[#000]" : "bg-[#fafafa] border-[#ddd] opacity-50"}`}>
            <p className="text-[28px] m-0 mb-2">{b.icon}</p>
            <p className="text-[13px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{b.name}</p>
            <p className="text-[10px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{b.desc}</p>
            {b.earned && b.date && <p className="text-[10px] text-[#000] opacity-30 m-0 mt-1" style={{ fontFamily: "'Times New Roman', serif" }}>{b.date}</p>}
          </motion.div>
        ))}
      </div>

      {/* Certificates */}
      <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>课程证书（{certificates.length}）</h2>
      <div className="space-y-3 max-w-2xl">
        {certificates.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 bg-white rounded-[12px] border-2 border-[#000]">
            <span className="text-[24px]">{c.icon}</span>
            <div className="flex-1">
              <p className="text-[15px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.name}</p>
              <p className="text-[12px] text-[#000] opacity-40 m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.issuer} · {c.date}</p>
            </div>
            <span className="px-3 py-1 rounded-[6px] text-[11px] font-bold bg-[#000] text-white" style={{ fontFamily: "var(--font-serif)" }}>查看证书</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
