"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const badges = [
  { name: "格物勤学", awarded: 45, desc: "完成10门课程" },
  { name: "知行合一", awarded: 38, desc: "完成所有策问" },
  { name: "论道先锋", awarded: 22, desc: "发表5篇文章" },
  { name: "雅集常客", awarded: 18, desc: "参加10次雅集" },
  { name: "传道授业", awarded: 12, desc: "指导3位新同窗" },
  { name: "格物致知", awarded: 55, desc: "累计学习200小时" },
  { name: "书院栋梁", awarded: 8, desc: "加入2年" },
  { name: "终身学习", awarded: 30, desc: "连续12月学习" },
];

export default function DeanAchievementsPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>功名录</h1>
      <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>管理徽章体系与证书认证</p>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatA value="8" label="徽章类型" />
        <StatA value="228" label="已颁发" />
        <StatA value="4" label="证书体系" />
        <StatA value="92%" label="完成认证率" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {badges.map((b, i) => (
          <motion.div key={b.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className="p-5 bg-white rounded-[14px] border-2 border-[#000] text-center">
            <p className="text-[16px] text-[#000] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{b.name}</p>
            <p className="text-[11px] text-[#000] opacity-50 m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{b.desc}</p>
            <p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{b.awarded}<span className="text-[12px] opacity-50"> 人</span></p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
function StatA({ value, label }: { value: string; label: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[12px] border border-[#000] text-center"><p className="text-[22px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p><p className="text-[11px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p></div>;
}
