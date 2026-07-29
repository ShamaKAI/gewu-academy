"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";

interface ForumPost {
  id: string; author: string; avatar: string; title: string; category: string;
  preview: string; date: string; likes: number; comments: number; views: number;
}

const CATEGORIES = ["全部", "案例分析", "行业洞察", "保险规划", "财富管理", "客户心得", "职业成长", "书院随笔"];

const mockPosts: ForumPost[] = [
  { id: "p1", author: "张物学", avatar: "ZM", title: "从一张保单看新加坡家庭保障缺口", category: "案例分析", preview: "最近服务了一位35岁的年轻家庭客户。表面上他们已经购买了足够的保险，但深入分析后发现...", date: "7/28", likes: 48, comments: 12, views: 320 },
  { id: "p2", author: "李文思", avatar: "LW", title: "利率下行周期中的资产配置思考", category: "财富管理", preview: "随着全球央行进入降息周期，传统的固收类资产收益率持续走低。如何在这个环境下为客户构建稳健组合...", date: "7/26", likes: 65, comments: 22, views: 480 },
  { id: "p3", author: "王知行", avatar: "WZ", title: "AI辅助保险规划：实践与展望", category: "行业洞察", preview: "过去三个月，我在日常工作中系统性地使用了AI工具来辅助保险方案设计。这里分享一些实际经验...", date: "7/24", likes: 89, comments: 35, views: 750 },
  { id: "p4", author: "陈明德", avatar: "CM", title: "新人顾问如何建立客户信任", category: "职业成长", preview: "入行第一年是最难的。没有客户基础，没有丰富经验，唯一的优势是热情和愿意学习的态度...", date: "7/22", likes: 120, comments: 48, views: 980 },
  { id: "p5", author: "吴思远", avatar: "WS", title: "家族办公室在新加坡的发展趋势", category: "行业洞察", preview: "新加坡正在迅速成为亚洲家族办公室的首选地。这背后既有政策优势，也有深层的行业变革...", date: "7/20", likes: 55, comments: 18, views: 410 },
  { id: "p6", author: "赵算法", avatar: "ZS", title: "量化投资与传统财富管理的融合", category: "财富管理", preview: "量化投资并非与传统财富管理对立。恰恰相反，量化工具能够让顾问做出更精准的资产配置决策...", date: "7/18", likes: 72, comments: 28, views: 560 },
];

export default function ForumPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = (t.alumni as Record<string, string>) || {};
  const [filter, setFilter] = useState("全部");
  const filtered = filter === "全部" ? mockPosts : mockPosts.filter((p) => p.category === filter);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>百家论道</h1>
          <p className="text-[13px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>先生与同窗共同沉淀行业经验</p>
        </div>
        <button onClick={() => alert("发表文章功能即将开放")}
          className="px-5 py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333]" style={{ fontFamily: "var(--font-serif)" }}>
          + 著文论道
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-[8px] text-[13px] font-bold border cursor-pointer transition-colors ${filter===cat?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
            style={{ fontFamily: "var(--font-serif)" }}>{cat}</button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4 max-w-3xl">
        {filtered.map((p, i) => (
          <motion.button key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="w-full p-5 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left"
            whileHover={{ y: -1 }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#ddd] flex items-center justify-center text-[10px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{p.avatar}</div>
              <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{p.author}</span>
              <span className="text-[11px] px-2 py-[2px] rounded-[4px] border border-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{p.category}</span>
              <span className="text-[11px] text-[#000] opacity-40 ml-auto" style={{ fontFamily: "'Times New Roman', serif" }}>{p.date}</span>
            </div>
            <h2 className="text-[17px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{p.title}</h2>
            <p className="text-[13px] text-[#000] opacity-60 m-0 line-clamp-2 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>{p.preview}</p>
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[11px] text-[#000] opacity-40" style={{ fontFamily: "var(--font-serif)" }}>❤ {p.likes}</span>
              <span className="text-[11px] text-[#000] opacity-40" style={{ fontFamily: "var(--font-serif)" }}>💬 {p.comments}</span>
              <span className="text-[11px] text-[#000] opacity-40" style={{ fontFamily: "var(--font-serif)" }}>👁 {p.views}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
