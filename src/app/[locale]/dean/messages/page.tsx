"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

const msgs = [
  { sender: "栖云先生", avatar: "栖", subject: "关于新课程发布的申请", preview: "山长大人，我已完成了《家族财富传承》的讲义编制，现申请刊行至学子端典籍...", date: "今天", unread: true, type: "申请" },
  { sender: "陈省身师者", avatar: "陈", subject: "金融建模工作坊总结", preview: "8月3日工作坊圆满结束，共计85人参与，附上活动总结报告...", date: "昨天", unread: true, type: "报告" },
  { sender: "王阳明师者", avatar: "王", subject: "申请增设《传习录》高级研读班", preview: "考虑到当前学子对心学经典的兴趣持续增长，建议下学期增设高级研读课程...", date: "7/26", unread: false, type: "申请" },
  { sender: "系统", avatar: "系", subject: "月度书院运营报告已生成", preview: "7月份的完整运营数据报告已生成，请查阅书院数据中心...", date: "7/25", unread: false, type: "系统" },
];

export default function DeanMessagesPage() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};

  return (
    <motion.div className="px-10 py-8 pb-12 flex h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex-1 max-w-2xl">
        <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>消息中心</h1>
        <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>山长院务书信往来</p>

        <div className="space-y-2">
          {msgs.map((m, i) => (
            <motion.div key={m.subject} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-4 p-4 rounded-[12px] border cursor-pointer transition-colors ${m.unread ? "bg-[#fafaf7] border-[#000] font-bold" : "bg-white border-[#eee] hover:border-[#000]"}`}>
              <div className="w-9 h-9 rounded-full bg-[#eee] flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{m.sender}</span>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-[#C04040] flex-shrink-0" />}
                  <span className="text-[11px] px-2 py-[2px] rounded-[4px] border border-[#000] font-bold ml-2" style={{ fontFamily: "var(--font-serif)" }}>{m.type}</span>
                  <span className="text-[11px] text-[#000] opacity-40 ml-auto" style={{ fontFamily: "'Times New Roman', serif" }}>{m.date}</span>
                </div>
                <p className="text-[15px] text-[#000] m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{m.subject}</p>
                <p className="text-[12px] text-[#000] opacity-50 m-0 mt-0.5 line-clamp-1" style={{ fontFamily: "var(--font-serif)" }}>{m.preview}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="w-[320px] flex-shrink-0 ml-8 border-l border-[#000] pl-8 flex items-center justify-center">
        <p className="text-[#000] text-[14px] opacity-40 text-center" style={{ fontFamily: "var(--font-serif)" }}>点击消息查看详情</p>
      </div>
    </motion.div>
  );
}
