"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { IconAcademy, IconCourses, IconAnalytics, IconDesk, IconBell } from "./Icons";

/** 右侧移动端预览浮窗 — 模拟 iPhone 竖屏，320px 定宽 */
export default function MobilePreview() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const c = t.common as Record<string, string>;

  const courses = [
    { name: "《大学》精读", progress: 85 },
    { name: "风险管理基础", progress: 60 },
    { name: "数据分析导论", progress: 40 },
    { name: "金融数学", progress: 92 },
  ];

  const tabs = [
    { key: "academy", Icon: IconAcademy, label: s.nav_academy },
    { key: "courses", Icon: IconCourses, label: s.nav_courses },
    { key: "analytics", Icon: IconAnalytics, label: s.nav_analytics },
    { key: "desk", Icon: IconDesk, label: s.nav_desk },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Phone frame */}
      <div className="w-[320px] h-[640px] bg-white rounded-[28px] border-[6px] border-[#333] overflow-hidden shadow-lg relative">
        {/* Status bar */}
        <div className="h-7 bg-[#f7f7f7] flex items-center justify-between px-5 text-[10px] text-[#333] font-bold"
          style={{ fontFamily: "var(--font-display)" }}>
          <span>9:41</span>
          <span>●●●●○</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eee]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#333] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">格</span>
            </div>
            <span className="text-[12px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              {c.academy_name}
            </span>
          </div>
          <span className="text-[#333]"><IconBell /></span>
        </div>

        {/* Profile card */}
        <div className="mx-3 mt-3 p-3 bg-[#f7f7f7] rounded-[12px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-[#ddd] flex items-center justify-center text-[18px] font-bold text-[#333]"
              style={{ fontFamily: "var(--font-serif)" }}>张</div>
            <div>
              <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{s.student_name}</p>
              <p className="text-[11px] text-[#999] m-0" style={{ fontFamily: "var(--font-display)" }}>{s.student_id}</p>
            </div>
            <span className="ml-auto text-[11px] text-[#666] font-bold" style={{ fontFamily: "var(--font-serif)" }}>学子</span>
          </div>

          {/* 3 stat labels */}
          <div className="flex gap-2">
            {[
              { label: s.total_credits, val: s.hero_credits_val },
              { label: s.week_hours, val: s.hero_progress_val },
              { label: s.current_rank, val: s.hero_rank_val },
            ].map((st) => (
              <div key={st.label} className="flex-1 text-center bg-white rounded-[8px] py-2">
                <p className="text-[16px] text-[#000] font-bold m-0 leading-none" style={{ fontFamily: "var(--font-display)" }}>{st.val}</p>
                <p className="text-[10px] text-[#999] m-0 mt-0.5" style={{ fontFamily: "var(--font-serif)" }}>{st.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Course list */}
        <div className="px-3 mt-3">
          <p className="text-[13px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            {s.courses_title || "我的课程"}
          </p>
          {courses.map((co) => (
            <div key={co.name} className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[6px] bg-[#ddd] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-[#333] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{co.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="flex-1 h-[4px] bg-[#eee] rounded-full">
                    <div className="h-full bg-[#333] rounded-full" style={{ width: `${co.progress}%` }} />
                  </div>
                  <span className="text-[9px] text-[#999]" style={{ fontFamily: "var(--font-display)" }}>{co.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Tab Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#f7f7f7] border-t border-[#eee] flex items-center justify-around px-2">
          {tabs.map(({ key, Icon, label }) => {
            const active = key === "academy";
            return (
              <div key={key} className="flex flex-col items-center gap-0.5 cursor-pointer">
                <span className={active ? "text-[#000]" : "text-[#999]"}><Icon /></span>
                <span className={`text-[9px] ${active ? "text-[#000] font-bold" : "text-[#999]"}`} style={{ fontFamily: "var(--font-serif)" }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-[#999] mt-2" style={{ fontFamily: "var(--font-serif)" }}>移动端预览</p>
    </div>
  );
}
