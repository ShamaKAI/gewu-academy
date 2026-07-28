"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[]; // 0..100
  size?: number;
}

export default function RadarChart({ labels, values, size = 240 }: RadarChartProps) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const n = labels.length;
  const angleStep = (Math.PI * 2) / n;

  const points = (scale: number) =>
    values
      .map((v, i) => {
        const a = angleStep * i - Math.PI / 2;
        const rr = (v / 100) * r * scale;
        return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
      })
      .join(" ");

  return (
    <div style={{ width: size, height: size + 50 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon
            key={s}
            points={points(s)}
            fill="none"
            stroke="#000"
            strokeWidth={s === 1 ? 1.5 : 0.5}
            opacity={s === 1 ? 0.3 : 0.12}
          />
        ))}
        {/* Axis lines */}
        {labels.map((_, i) => {
          const a = angleStep * i - Math.PI / 2;
          return (
            <line
              key={`ax-${i}`}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="#000"
              strokeWidth={0.5}
              opacity={0.15}
            />
          );
        })}
        {/* Data polygon */}
        <motion.polygon
          points={points(1)}
          fill="rgba(0,0,0,0.08)"
          stroke="#000"
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        {/* Data dots */}
        {values.map((v, i) => {
          const a = angleStep * i - Math.PI / 2;
          const dx = cx + Math.cos(a) * (v / 100) * r;
          const dy = cy + Math.sin(a) * (v / 100) * r;
          return (
            <circle
              key={`dot-${i}`}
              cx={dx}
              cy={dy}
              r={3.5}
              fill="#000"
            />
          );
        })}
      </svg>
      {/* Labels below */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {labels.map((l, i) => {
          const a = angleStep * i - Math.PI / 2;
          const tx = Math.cos(a);
          return (
            <span
              key={l}
              className="text-[10px] text-[#000] font-bold"
              style={{ fontFamily: "var(--font-serif)", order: Math.round(tx * 10) }}
            >
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
}
