"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";
import { newsItems } from "@/data/news";
import { mentors } from "@/data/mentors";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "dean_greeting_morning";
  if (h < 18) return "dean_greeting_afternoon";
  return "dean_greeting_evening";
}

export default function DeanHome() {
  const { t } = useTranslation();
  const s = (t.dean as Record<string, string>) || {};
  const greetingKey = getGreeting();

  const totalCourses = courses.length;
  const totalMentors = mentors.length;
  const totalScholars = 320;
  const totalAlumni = 158;
  const upcomingEvents = newsItems.filter((n) => n.category === "activity").length;

  const affairs = [
    { time: "今日", text: "《论语》夏季研讨会报名人数已达128人", type: "雅集" },
    { time: "今日", text: "栖云先生上传新课程《财富管理的底层逻辑》更新", type: "典籍" },
    { time: "昨日", text: "5位新学子加入格物学院", type: "学子" },
    { time: "昨日", text: "百家论道新增3篇行业文章待审核", type: "论道" },
    { time: "7/26", text: "陈省身师者完成金融建模工作坊讲义更新", type: "师者" },
    { time: "7/25", text: "风险管理案例分享会录像已发布至典籍", type: "雅集" },
    { time: "7/24", text: "3位同窗获得格物勤学徽章", type: "功名" },
    { time: "7/22", text: "书院夏季作息调整已生效", type: "院务" },
  ];

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Greeting + header */}
      <div className="mb-8 p-8 bg-white rounded-[16px] border-2 border-[#000]" style={{ background: "linear-gradient(135deg, #fafaf7 0%, #ece5d8 100%)" }}>
        <p className="text-[18px] text-[#000] m-0 font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          {(s[greetingKey] || "上午好").replace("{name}", "山长")}，书院今日运转如常。
        </p>
        <p className="text-[13px] text-[#000] m-0 mt-2 opacity-50 italic" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
          &ldquo;致知在格物，格物而后知至。&rdquo;
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-5 gap-4 mb-10">
        <StatCard icon="📖" value={String(totalCourses)} label="典籍" />
        <StatCard icon="👨‍🏫" value={String(totalMentors)} label="师者" />
        <StatCard icon="🎓" value={String(totalScholars)} label="学子" />
        <StatCard icon="🤝" value={String(totalAlumni)} label="同窗" />
        <StatCard icon="🎋" value={String(upcomingEvents)} label="雅集" />
      </div>

      {/* 今日院务 */}
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <h2 className="text-[20px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>今日院务</h2>
          <div className="relative ml-2">
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#ccc]" />
            <div className="space-y-2">
              {affairs.map((a, i) => (
                <motion.div key={i} className="flex items-center gap-3 pl-5 relative" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full bg-[#555] border-2 border-white" />
                  <span className="text-[11px] px-2 py-[2px] rounded-[4px] border border-[#000] font-bold flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{a.type}</span>
                  <span className="text-[13px] text-[#000] flex-1" style={{ fontFamily: "var(--font-serif)" }}>{a.text}</span>
                  <span className="text-[11px] text-[#000] opacity-40 flex-shrink-0" style={{ fontFamily: "'Times New Roman', serif" }}>{a.time}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats panel */}
        <div className="space-y-3">
          <h2 className="text-[20px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>书院概况</h2>
          <QuickCard icon="📚" label="课程完成率" value="82%" />
          <QuickCard icon="⭐" label="平均评分" value="4.6" />
          <QuickCard icon="🌏" label="覆盖国家" value="5" />
          <QuickCard icon="📈" label="月度新增" value="+28" />
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="p-5 bg-[#fafafa] rounded-[14px] border-2 border-[#000] text-center">
      <p className="text-[24px] m-0 mb-1">{icon}</p>
      <p className="text-[26px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
    </div>
  );
}
function QuickCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-[12px] border border-[#000]">
      <span className="text-[20px]">{icon}</span>
      <span className="text-[13px] text-[#000] flex-1 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{label}</span>
      <span className="text-[16px] text-[#000] font-bold" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</span>
    </div>
  );
}
