"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================================
   格物学院 · 师者页面 — 5位导师，完整profile卡片
   ============================================================ */

interface MentorData {
  name: string;
  title: string;
  avatar: string;
  accent: string;
  achievements: string[];
  specialties: string[];
  experience: string;
  courses: string[];
}

const QUOTE_L = "“";
const QUOTE_R = "”";

const mentors: MentorData[] = [
  {
    name: "栖云先生", // 栖云先生
    title: "Jason Lim",
    avatar: "https://picsum.photos/seed/portrait-jason/400/400",
    accent: "#8B5E83",
    achievements: [
      "从业14年，长期深耕财富管理领域",
      "MDRT连续8届会员，TOT会员",
      "服务超过500组高净值家庭",
      "累计规划资产规模逾4亿新币",
      "长期担任企业家财富规划顾问",
    ],
    specialties: ["家族财富传承", "高净值资产配置", "企业主财富规划", "信托与财富架构", "长期退休现金流设计"],
    experience: `十四年来，始终专注于财富管理这一件事。服务对象涵盖企业创始人、上市公司高管及高净值家庭，帮助客户建立兼顾保障、投资、税务与传承的长期财富体系。秉持${QUOTE_L}财富不止于积累，更在于有序传承${QUOTE_R}的理念，为不同人生阶段提供可持续的规划方案。`,
    courses: ["《财富管理的底层逻辑》", "《家族财富传承》", "《企业主财富架构设计》", "《长期资产配置》", "《退休现金流规划》"],
  },
  {
    name: "知微先生",
    title: "Michelle Tan",
    avatar: "https://picsum.photos/seed/portrait-michelle/400/400",
    accent: "#C4736E",
    achievements: [
      "从业11年",
      "MDRT连续6届会员",
      "服务800余组家庭",
      "女性财富规划导师",
      "家庭保障体系设计顾问",
    ],
    specialties: ["家庭财富规划", "教育金规划", "医疗保障体系", "女性财富成长", "家庭现金流管理"],
    experience: "长期关注家庭财富的稳健成长。多年服务年轻家庭、新婚夫妇及职业女性，帮助客户建立完整的保障体系、教育基金规划及家庭资产配置方案。相信真正的财富，不只是数字的增长，更是家庭面对未来时的从容与底气。",
    courses: ["《家庭财富规划》", "《教育金配置策略》", "《医疗保障体系》", "《女性财富成长》", "《人生不同阶段的财富规划》"],
  },
  {
    name: "观澜先生",
    title: "Daniel Wong",
    avatar: "https://picsum.photos/seed/portrait-daniel/400/400",
    accent: "#5B8C85",
    achievements: [
      "从业16年",
      "CFA Charterholder",
      "CFP®国际金融理财师",
      "企业财富顾问",
      "全球资产配置实践导师",
    ],
    specialties: ["全球资产配置", "ETF投资体系", "长期价值投资", "风险管理", "企业现金流管理"],
    experience: "拥有十余年国际财富管理经验。曾长期参与跨境财富规划及全球资产配置咨询，擅长构建符合不同风险偏好的投资组合。坚持长期主义，以纪律代替情绪，以配置平衡周期，帮助客户实现财富的稳健增长。",
    courses: ["《全球资产配置》", "《ETF投资实践》", "《长期价值投资》", "《风险管理》", "《美元资产规划》"],
  },
  {
    name: "抱朴先生",
    title: "Ethan Chua",
    avatar: "https://picsum.photos/seed/portrait-ethan/400/400",
    accent: "#6E8DC4",
    achievements: [
      "从业15年",
      "MDRT连续10届会员",
      "服务企业客户300余家",
      "企业财富规划顾问",
      "商业风险管理专家",
    ],
    specialties: ["企业风险管理", "企业财富规划", "商业保险架构", "股权传承规划", "创业者财富保护"],
    experience: "长期服务创业者与企业管理者。专注于企业经营风险、股东保障及财富传承规划，帮助企业在成长过程中建立更加稳健的风险管理体系。认为企业财富与个人财富并非孤立，而应共同构建完整的财富生态。",
    courses: ["《企业财富管理》", "《企业风险管理》", "《创业者财富保护》", "《企业传承规划》", "《股东保障体系》"],
  },
  {
    name: "清衡先生",
    title: "Sophia Lee",
    avatar: "https://picsum.photos/seed/portrait-sophia/400/400",
    accent: "#C49A3C",
    achievements: [
      "从业9年",
      "MDRT会员",
      "FinTech Wealth Planner",
      "数字财富管理导师",
      "AI财富规划实践者",
    ],
    specialties: ["AI财富规划", "智能投顾", "数字化财富管理", "年轻家庭资产配置", "财富科技应用"],
    experience: "致力于推动财富管理与科技融合。长期研究人工智能在财富规划中的实际应用，将数字化工具与专业咨询相结合，为年轻专业人士提供更加高效、透明、可持续的财富管理体验，帮助客户建立适应新时代的财富思维。",
    courses: ["《AI时代的财富管理》", "《数字财富规划》", "《智能投顾实践》", "《年轻人的第一份财富规划》", "《财富顾问数字化工具》"],
  },
];

export default function MentorsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = t.scholar as Record<string, string>;
  const [selectedMentor, setSelectedMentor] = useState<MentorData | null>(null);

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {!selectedMentor && (
          <motion.div key="mentor-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
            <h1 className="text-[32px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>{s.nav_mentors}</h1>

            <div className="flex flex-col gap-5 max-w-3xl">
              {mentors.map((mentor, idx) => (
                <motion.button key={mentor.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07, duration: 0.35 }}
                  onClick={() => setSelectedMentor(mentor)}
                  className="w-full relative overflow-hidden rounded-[16px] border-2 border-[#000] bg-white text-left cursor-pointer group"
                  whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}>
                  <div className="absolute top-0 left-0 w-2 h-full" style={{ background: mentor.accent }} />
                  <div className="flex items-center gap-6 pl-8 pr-8 py-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 rounded-full blur-md opacity-30 scale-110" style={{ background: mentor.accent }} />
                      <img src={mentor.avatar} alt={mentor.name} className="relative w-[100px] h-[100px] rounded-full object-cover border-[3px] border-[#000]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-4 mb-2">
                        <h2 className="text-[26px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{mentor.name}</h2>
                        <span className="text-[14px] text-[#000] opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>{mentor.title}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-3">
                        {mentor.specialties.slice(0, 4).map((sp) => (
                          <span key={sp} className="text-[11px] text-[#000] px-3 py-[3px] rounded-[20px] border border-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{sp}</span>
                        ))}
                      </div>
                      <p className="text-[12px] text-[#000] m-0 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>讲授 {mentor.courses.length} 门课程</p>
                    </div>
                    <div className="flex-shrink-0 text-[28px] text-[#000] opacity-30 group-hover:opacity-100 transition-opacity">&rarr;</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {selectedMentor && (
          <motion.div key="mentor-detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="max-w-3xl">
            <button onClick={() => setSelectedMentor(null)}
              className="flex items-center gap-2 mb-8 text-[15px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity" style={{ fontFamily: "var(--font-serif)" }}>&larr; 返回师者列表</button>

            <div className="flex items-start gap-6 mb-10">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-full blur-md opacity-25 scale-110" style={{ background: selectedMentor.accent }} />
                <img src={selectedMentor.avatar} alt={selectedMentor.name} className="relative w-[110px] h-[110px] rounded-full object-cover border-[3px] border-[#000]" />
              </div>
              <div className="pt-2">
                <div className="flex items-baseline gap-4 mb-2">
                  <h1 className="text-[32px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{selectedMentor.name}</h1>
                  <span className="text-[16px] text-[#000] opacity-50" style={{ fontFamily: "'Times New Roman', serif" }}>{selectedMentor.title}</span>
                </div>
                <p className="text-[15px] text-[#000] leading-relaxed m-0 max-w-2xl" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{selectedMentor.experience}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>行业成就</h2>
              <div className="grid grid-cols-2 gap-2">
                {selectedMentor.achievements.map((ach, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-[8px] border border-[#000]">
                    <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: selectedMentor.accent }} />
                    <span className="text-[13px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{ach}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>专业领域</h2>
              <div className="flex flex-wrap gap-2">
                {selectedMentor.specialties.map((sp) => (
                  <span key={sp} className="text-[13px] text-[#000] px-4 py-2 rounded-[20px] border border-[#000] font-bold bg-[#fafafa]" style={{ fontFamily: "var(--font-serif)" }}>{sp}</span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-[18px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>从业经历</h2>
              <p className="text-[15px] text-[#000] leading-relaxed m-0 max-w-2xl" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{selectedMentor.experience}</p>
            </div>

            <div>
              <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>教授课程</h2>
              <div className="flex flex-col gap-2">
                {selectedMentor.courses.map((course, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-[10px] border border-[#000]" style={{ borderLeftWidth: 4, borderLeftColor: selectedMentor.accent }}>
                    <span className="text-[13px] font-bold text-[#000] flex-shrink-0 w-[28px]" style={{ fontFamily: "'Times New Roman', serif" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[15px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
