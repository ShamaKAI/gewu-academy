"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

interface Message {
  id: string; sender: string; avatar: string; subject: string; preview: string;
  date: string; unread: boolean; type: "notice" | "reply" | "invite" | "system";
}

const TYPE_ICONS: Record<string, string> = { notice: "📢", reply: "💬", invite: "🤝", system: "⚙" };
const TYPE_LABELS: Record<string, string> = { notice: "课程通知", reply: "先生回复", invite: "合作邀请", system: "系统消息" };

const mockMessages: Message[] = [
  { id: "m1", sender: "王阳明师者", avatar: "王", subject: "《大学》精读课程更新通知", preview: "各位学子，《大学》精读第四章已上线，包含最新的案例分析...", date: "今天", unread: true, type: "notice" },
  { id: "m2", sender: "李文思", avatar: "李", subject: "关于风险管理案例的讨论回复", preview: "针对你在百家论道中提出的问题，我在实践中也有过类似的经历...", date: "今天", unread: true, type: "reply" },
  { id: "m3", sender: "陈省身师者", avatar: "陈", subject: "金融建模工作坊报名确认", preview: "你已成功报名8月1日的金融建模实战工作坊，请在活动开始前...", date: "昨天", unread: false, type: "invite" },
  { id: "m4", sender: "格物书院", avatar: "院", subject: "夏季作息调整通知", preview: "即日起至8月31日，藏经阁开放时间延长至晚上10点...", date: "7/15", unread: false, type: "system" },
  { id: "m5", sender: "吴思远", avatar: "吴", subject: "邀请共同撰写行业白皮书", preview: "我正在准备一篇关于新加坡财富管理行业发展趋势的文章...", date: "7/12", unread: false, type: "invite" },
  { id: "m6", sender: "格物书院", avatar: "院", subject: "恭喜获得格物勤学徽章", preview: "你在过去30天内完成了5门课程的学习，系统已为你颁发...", date: "7/05", unread: false, type: "system" },
];

export default function MessagesPage() {
  const { t } = useTranslation();
  const s = (t.alumni as Record<string, string>) || {};
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? mockMessages : mockMessages.filter((m) => m.type === filter);

  return (
    <motion.div className="px-10 py-8 pb-12 flex h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {/* Left message list */}
      <div className="flex-1 max-w-2xl">
        <h1 className="text-[28px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>书札</h1>
        <p className="text-[13px] text-[#000] opacity-50 m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>书院正式消息与书信往来</p>

        <div className="flex gap-2 mb-6">
          {["all", "notice", "reply", "invite", "system"].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-[6px] text-[12px] font-bold border cursor-pointer transition-colors ${filter===t?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
              style={{ fontFamily: "var(--font-serif)" }}>
              {t === "all" ? "全部" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`flex items-start gap-4 p-4 rounded-[12px] border cursor-pointer transition-colors ${m.unread ? "bg-[#fafaf7] border-[#000] font-bold" : "bg-white border-[#eee] hover:border-[#000]"}`}>
              <div className="w-9 h-9 rounded-full bg-[#eee] flex items-center justify-center text-[11px] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{m.avatar}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[14px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{m.sender}</span>
                  {m.unread && <span className="w-2 h-2 rounded-full bg-[#C04040] flex-shrink-0" />}
                  <span className="text-[11px] text-[#000] opacity-40 ml-auto" style={{ fontFamily: "'Times New Roman', serif" }}>{m.date}</span>
                </div>
                <p className="text-[15px] text-[#000] m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{m.subject}</p>
                <p className="text-[12px] text-[#000] opacity-50 m-0 mt-0.5 line-clamp-1" style={{ fontFamily: "var(--font-serif)" }}>{m.preview}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right preview panel */}
      <div className="w-[320px] flex-shrink-0 ml-8 border-l border-[#000] pl-8 flex items-center justify-center">
        <p className="text-[#000] text-[14px] opacity-40 text-center" style={{ fontFamily: "var(--font-serif)" }}>点击书札查看详情</p>
      </div>
    </motion.div>
  );
}
