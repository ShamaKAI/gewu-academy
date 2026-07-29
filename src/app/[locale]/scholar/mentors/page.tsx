"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { courses as allCourses } from "@/data/courses";

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

/** Match mentor course title to real course id */
function findCourseId(title: string): string | null {
  // Try exact match on title
  let found = allCourses.find((c) => c.title === title);
  if (found) return found.id;
  // Try matching by stripping book-guillemet marks 《》
  const stripped = title.replace(/[《》]/g, "");
  found = allCourses.find((c) => c.title.replace(/[《》]/g, "").includes(stripped) || stripped.includes(c.title.replace(/[《》]/g, "")));
  return found?.id || null;
}

const QUOTE_L = "“";
const QUOTE_R = "”";

const mentors: MentorData[] = [
  // ── Original 5 mentors ──
  {
    name: "王阳明", title: "心学宗师", avatar: "https://picsum.photos/seed/portrait-wang2/400/400", accent: "#8B5E83",
    achievements: ["格物学院创院师者", "心学研究会会长", "《大学》研习体系创建者", "十余年经典教学经验", "培养学子逾千人"],
    specialties: ["《大学》精读", "心学哲学", "知行合一", "儒家经典", "格物致知"],
    experience: "王阳明先生是格物学院创院师者之一，早年游学四方，遍访名师，后归隐书院，终身致力于儒家经典的研习与传承。先生的课堂以'心即理'为宗，强调知行合一，不尚空谈，注重实修。无论是初入学院的懵懂学子，还是久经淬炼的资深学者，都在他的教导下收获了成长。",
    courses: ["《大学》精读", "《传习录》研读"],
  },
  {
    name: "孔孟研", title: "儒学传道", avatar: "https://picsum.photos/seed/portrait-kong2/400/400", accent: "#C4736E",
    achievements: ["儒学研究院主任", "《论语》国际研讨会召集人", "新加坡儒学推广委员会顾问", "著有三部儒学普及读物", "获书院教学卓越奖"],
    specialties: ["《论语》精讲", "儒学思想", "礼学文化", "教育哲学", "东西方比较哲学"],
    experience: "孔孟研先生自幼浸润于儒学氛围，曾在新加坡国立大学攻读中国哲学博士学位，此后致力于儒学的现代转化与教育工作。他在格物学院开设的《论语》精讲课程，以深入浅出、平易近人的风格广受学子喜爱。先生常说：'读《论语》，不是读一个两千年前的文本，而是与两千年前的智者对话。'",
    courses: ["《论语》精讲"],
  },
  {
    name: "孙武", title: "兵道谋主", avatar: "https://picsum.photos/seed/portrait-sun2/400/400", accent: "#5B8C85",
    achievements: ["战略管理博士", "多家跨国企业战略顾问", "《孙子兵法与现代管理》著者", "国际管理学会会员", "格物学院企业发展中心导师"],
    specialties: ["《孙子兵法》", "战略思维", "商业决策", "竞争分析", "组织管理"],
    experience: "孙武先生兼具学者与实战家的双重身份。他在企业战略管理领域深耕二十年，将《孙子兵法》的古老智慧与现代管理科学和方法论相结合，形成了独树一帜的教学体系。他的课堂既有兵法的深厚底蕴，也有商战的现实洞察。",
    courses: ["《孙子兵法》与决策"],
  },
  {
    name: "老子风", title: "道法自然", avatar: "https://picsum.photos/seed/portrait-lao2/400/400", accent: "#6E8DC4",
    achievements: ["道家文化研究所所长", "《道德经》现代解读系列课程创始人", "东西方哲学对话论坛常驻嘉宾", "出版《道的智慧》等四部著作", "超过十年的道家文化推广经验"],
    specialties: ["《道德经》", "道家哲学", "无为管理", "自然哲学", "东西方文化比较"],
    experience: "老子风先生是一位融贯中西的学者。他早年负笈海外，在比较哲学的视角下重新审视道家思想的当代价值。回到新加坡后，他在格物学院创立了道家文化研究所，致力于推动道家智慧在现代社会中的实际应用。",
    courses: ["《道德经》现代解读"],
  },
  {
    name: "陈省身", title: "数理推手", avatar: "https://picsum.photos/seed/portrait-chen2/400/400", accent: "#C49A3C",
    achievements: ["金融数学博士", "CFA & FRM 双持证人", "国际量化金融协会会员", "前大型资产管理公司量化总监", "多项金融科技专利持有者"],
    specialties: ["金融数学建模", "量化投资", "风险管理", "衍生品定价", "金融科技应用"],
    experience: "陈省身先生在金融数学领域拥有深厚的学术背景和丰富的行业经验。他曾在国际顶级资产管理公司担任量化研究总监，后选择回归教育。先生擅长用数学的语言解析金融世界，让复杂的模型变得清晰可感。",
    courses: ["金融数学建模", "风险管理基础"],
  },
  // ── New 5 mentors ──
  {
    name: "栖云先生", title: "Jason Lim", avatar: "https://picsum.photos/seed/portrait-jason/400/400", accent: "#7B5E8B",
    achievements: ["从业14年，长期深耕财富管理领域", "MDRT连续8届会员，TOT会员", "服务超过500组高净值家庭", "累计规划资产规模逾4亿新币", "长期担任企业家财富规划顾问"],
    specialties: ["家族财富传承", "高净值资产配置", "企业主财富规划", "信托与财富架构", "长期退休现金流设计"],
    experience: `十四年来，始终专注于财富管理这一件事。服务对象涵盖企业创始人、上市公司高管及高净值家庭，帮助客户建立兼顾保障、投资、税务与传承的长期财富体系。秉持${QUOTE_L}财富不止于积累，更在于有序传承${QUOTE_R}的理念，为不同人生阶段提供可持续的规划方案。`,
    courses: ["《财富管理的底层逻辑》", "《家族财富传承》", "《企业主财富架构设计》", "《长期资产配置》", "《退休现金流规划》"],
  },
  {
    name: "知微先生", title: "Michelle Tan", avatar: "https://picsum.photos/seed/portrait-michelle/400/400", accent: "#C4736E",
    achievements: ["从业11年", "MDRT连续6届会员", "服务800余组家庭", "女性财富规划导师", "家庭保障体系设计顾问"],
    specialties: ["家庭财富规划", "教育金规划", "医疗保障体系", "女性财富成长", "家庭现金流管理"],
    experience: "长期关注家庭财富的稳健成长。多年服务年轻家庭、新婚夫妇及职业女性，帮助客户建立完整的保障体系、教育基金规划及家庭资产配置方案。相信真正的财富，不只是数字的增长，更是家庭面对未来时的从容与底气。",
    courses: ["《家庭财富规划》", "《教育金配置策略》", "《医疗保障体系》", "《女性财富成长》", "《人生不同阶段的财富规划》"],
  },
  {
    name: "观澜先生", title: "Daniel Wong", avatar: "https://picsum.photos/seed/portrait-daniel/400/400", accent: "#5B8C85",
    achievements: ["从业16年", "CFA Charterholder", "CFP®国际金融理财师", "企业财富顾问", "全球资产配置实践导师"],
    specialties: ["全球资产配置", "ETF投资体系", "长期价值投资", "风险管理", "企业现金流管理"],
    experience: "拥有十余年国际财富管理经验。曾长期参与跨境财富规划及全球资产配置咨询，擅长构建符合不同风险偏好的投资组合。坚持长期主义，以纪律代替情绪，以配置平衡周期，帮助客户实现财富的稳健增长。",
    courses: ["《全球资产配置》", "《ETF投资实践》", "《长期价值投资》", "《风险管理进阶》", "《美元资产规划》"],
  },
  {
    name: "抱朴先生", title: "Ethan Chua", avatar: "https://picsum.photos/seed/portrait-ethan/400/400", accent: "#6E8DC4",
    achievements: ["从业15年", "MDRT连续10届会员", "服务企业客户300余家", "企业财富规划顾问", "商业风险管理专家"],
    specialties: ["企业风险管理", "企业财富规划", "商业保险架构", "股权传承规划", "创业者财富保护"],
    experience: "长期服务创业者与企业管理者。专注于企业经营风险、股东保障及财富传承规划，帮助企业在成长过程中建立更加稳健的风险管理体系。认为企业财富与个人财富并非孤立，而应共同构建完整的财富生态。",
    courses: ["《企业财富管理》", "《企业风险管理》", "《创业者财富保护》", "《企业传承规划》", "《股东保障体系》"],
  },
  {
    name: "清衡先生", title: "Sophia Lee", avatar: "https://picsum.photos/seed/portrait-sophia/400/400", accent: "#C49A3C",
    achievements: ["从业9年", "MDRT会员", "FinTech Wealth Planner", "数字财富管理导师", "AI财富规划实践者"],
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

            <div className="space-y-5">
              {mentors.map((mentor, idx) => (
                <motion.button key={mentor.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
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
          <motion.div key="mentor-detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
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
                <p className="text-[15px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{selectedMentor.experience}</p>
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
              <p className="text-[15px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{selectedMentor.experience}</p>
            </div>

            <div>
              <h2 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>教授课程</h2>
              <div className="flex flex-col gap-2 w-full">
                {selectedMentor.courses.map((course, i) => {
                  const cid = findCourseId(course);
                  return cid ? (
                    <button key={i} onClick={() => router.push(`/${locale}/scholar/courses/${cid}`)}
                      className="flex items-center gap-3 p-4 bg-white rounded-[10px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] transition-colors text-left"
                      style={{ borderLeftWidth: 4, borderLeftColor: selectedMentor.accent }}>
                      <span className="text-[13px] font-bold text-[#000] flex-shrink-0 w-[28px]" style={{ fontFamily: "'Times New Roman', serif" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[15px] text-[#000] font-bold flex-1" style={{ fontFamily: "var(--font-serif)" }}>{course}</span>
                      <span className="text-[#000] opacity-30">&rarr;</span>
                    </button>
                  ) : (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-[10px] border border-[#000]" style={{ borderLeftWidth: 4, borderLeftColor: selectedMentor.accent }}>
                      <span className="text-[13px] font-bold text-[#000] flex-shrink-0 w-[28px]" style={{ fontFamily: "'Times New Roman', serif" }}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-[15px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{course}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
