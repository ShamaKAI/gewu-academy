"use client";

import { motion } from "framer-motion";
import { IconStar } from "./Icons";

/* ============================================================
   CourseCard — 三种尺寸变体的课程卡片
   variant: "large" (镇院典籍·2列) | "medium" (修习必读·3列) | "small" (格物精选·4列)
   ============================================================ */

export interface CourseData {
  id: string;
  title: string;
  category: string;
  rating?: number;
  cover: string;
  progress?: number;
  mentor?: string;
  required?: boolean;
}

interface CourseCardProps {
  course: CourseData;
  variant?: "large" | "medium" | "small";
  showProgress?: boolean;
  showRating?: boolean;
  showMentor?: boolean;
  showBadge?: boolean;
  badgeLabel?: string;
}

/** 渲染金色星级 */
function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="text-[11px]"
          style={{ color: i <= Math.round(rating) ? "#C5A46D" : "#ddd" }}
        >
          <IconStar />
        </span>
      ))}
      <span
        className="text-[10px] ml-1 font-bold"
        style={{ color: "#C5A46D", fontFamily: "var(--font-display)" }}
      >
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

export default function CourseCard({
  course,
  variant = "small",
  showProgress = true,
  showRating = false,
  showMentor = false,
  showBadge = false,
  badgeLabel = "必修",
}: CourseCardProps) {
  const { title, category, rating, cover, progress, mentor } = course;

  /* ---------- 尺寸配置 ---------- */
  const coverHeight = variant === "large" ? "h-[180px]" : variant === "medium" ? "h-[140px]" : "h-[120px]";
  const padding = variant === "large" ? "p-5" : "p-3";
  const titleSize = variant === "large" ? "text-[15px]" : "text-[14px]";

  return (
    <motion.div
      className={`bg-white rounded-[12px] border border-[#eee] overflow-hidden cursor-pointer flex-shrink-0 w-full`}
      whileHover={{ y: -2, borderColor: "#ccc", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", transition: { duration: 0.2 } }}
    >
      {/* -------- 封面区 -------- */}
      <div className={`${coverHeight} bg-[#e8e8e8] relative overflow-hidden`}>
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* 必修标签 - 左上角朱砂红 */}
        {showBadge && (
          <span
            className="absolute top-2.5 left-2.5 px-2.5 py-[3px] rounded-[6px] text-[10px] font-bold tracking-[calc(var(--ls-scale)*1.5px)] text-white"
            style={{ background: "#C04040", fontFamily: "var(--font-serif)" }}
          >
            {badgeLabel}
          </span>
        )}
        {/* 大卡片渐变遮罩，让下侧文字更清晰 */}
        {variant === "large" && (
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.25), transparent)" }}
          />
        )}
      </div>

      {/* -------- 信息区 -------- */}
      <div className={padding}>
        <h4
          className={`${titleSize} text-[#333] font-bold m-0 mb-0.5 truncate`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {title}
        </h4>
        <p
          className={`text-[11px] text-[#000] m-0 mb-0.5`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {category}
        </p>

        {/* 评分 + 师者（仅大卡片） */}
        {showRating && rating && (
          <div className="flex items-center gap-3 mt-1.5">
            <StarRating rating={rating} />
            {showMentor && mentor && (
              <span
                className="text-[11px] text-[#000]"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {mentor}
              </span>
            )}
          </div>
        )}

        {/* 进度条 */}
        {showProgress && progress !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-[4px] bg-[#eee] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "#333" }}
              />
            </div>
            <span
              className="text-[10px] text-[#000] flex-shrink-0"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {progress}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
