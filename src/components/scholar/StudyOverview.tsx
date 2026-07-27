"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { IconClock, IconMail, IconCalendar, IconBell } from "./Icons";

/** 右侧学习概况面板 */
export default function StudyOverview() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  const overviewItems = [
    { icon: <IconClock />, label: s.week_hours, value: s.hero_progress_val, trend: s.overview_up },
    { icon: <IconMail />, label: s.total_courses, value: s.hero_hours_val, trend: s.overview_total },
    { icon: <IconCalendar />, label: s.total_credits, value: s.hero_credits_val, trend: s.overview_total },
    { icon: <IconBell />, label: s.current_rank, value: s.hero_rank_val, trend: s.overview_rank_up },
  ];

  const recentCourses = [
    { name: "《大学》精读", timeKey: "recent_time_1", progress: 78 },
    { name: "风险管理基础", timeKey: "recent_time_2", progress: 60 },
    { name: "数据分析导论", timeKey: "recent_time_3", progress: 45 },
    { name: "金融数学建模", timeKey: "recent_time_4", progress: 92 },
  ];

  return (
    <div className="px-5 py-6">
      <h3
        className="text-[18px] text-[#000] font-bold tracking-[calc(var(--ls-scale)*2px)] m-0 mb-5"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {s.overview_title}
      </h3>

      <div className="flex flex-col gap-3 mb-6">
        {overviewItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 bg-white rounded-[12px] p-3.5 border border-[#eee]"
          >
            <span className="text-[#666] flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-[#999] m-0" style={{ fontFamily: "var(--font-serif)" }}>{item.label}</p>
              <p className="text-[20px] text-[#000] font-bold m-0 leading-tight" style={{ fontFamily: "var(--font-display)" }}>{item.value}</p>
            </div>
            <span className="text-[11px] text-[#666] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{item.trend}</span>
          </div>
        ))}
      </div>

      <h3
        className="text-[15px] text-[#000] font-bold tracking-[calc(var(--ls-scale)*2px)] m-0 mb-3"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {s.recent_title}
      </h3>
      <div className="flex flex-col gap-2">
        {recentCourses.map((rc, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white rounded-[10px] p-3 border border-[#eee] cursor-pointer hover:border-[#ccc] hover:shadow-sm transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-[8px] bg-[#e8e8e8] flex-shrink-0 flex items-center justify-center text-[11px] text-[#666] font-bold"
              style={{ fontFamily: "var(--font-serif)" }}>{s.recent_book}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] text-[#333] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{rc.name}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-[5px] bg-[#eee] rounded-full">
                  <div className="h-full bg-[#333] rounded-full" style={{ width: `${rc.progress}%` }} />
                </div>
                <span className="text-[10px] text-[#999]" style={{ fontFamily: "var(--font-display)" }}>{rc.progress}%</span>
              </div>
            </div>
            <span className="text-[10px] text-[#999] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>{s[rc.timeKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
