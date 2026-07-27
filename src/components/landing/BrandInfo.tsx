"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion, type Variants } from "framer-motion";

export const brandVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

function Seal() {
  const size = 48;
  const r = 22; // outer radius
  const ir = 18; // inner ring radius

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
        {/* 外圆底色 */}
        <circle cx={size/2} cy={size/2} r={r} fill="#b33a3a" />
        {/* 外圆描边 */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#8b2020" strokeWidth="0.8" />
        {/* 内圆镂空 */}
        <circle cx={size/2} cy={size/2} r={ir} fill="none" stroke="rgba(250,250,247,0.3)" strokeWidth="0.7" />
        {/* AAG 文字 — 强制楷体 */}
        <text
          x={size / 2}
          y={size / 2 + 5.5}
          textAnchor="middle"
          fill="#fafaf7"
          fontFamily="Times New Roman, Times, serif"
          fontSize="15"
          fontWeight="bold"
          letterSpacing="0.5"
          style={{ fontFamily: "Times New Roman, Times, serif" }}
        >
          AAG
        </text>
      </svg>
    </div>
  );
}

interface BrandInfoProps { visible: boolean; }

export default function BrandInfo({ visible }: BrandInfoProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex flex-col items-center pointer-events-none z-30"
      variants={brandVariants}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
    >
      <div className="flex items-center gap-5">
        <h1
          className="text-[clamp(52px,7vw,96px)] text-[#000] tracking-[calc(var(--ls-scale)*12px)] leading-tight m-0"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          {t.common.academy_name}
        </h1>
        <Seal />
      </div>
      <p
        className="text-[clamp(15px,1vw,20px)] text-[#000] tracking-[calc(var(--ls-tagline)*8px)] leading-loose m-0 mt-3 font-bold"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t.landing.tagline1}
      </p>
      <p
        className="text-[clamp(15px,1vw,20px)] text-[#000] tracking-[calc(var(--ls-tagline)*8px)] leading-loose m-0 font-bold"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {t.landing.tagline2}
      </p>
    </motion.div>
  );
}
