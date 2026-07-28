"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[];
  size?: number;
  color?: string;  // accent color for data polygon
}

export default function RadarChart({ labels, values, size = 240, color = "#388e3c" }: RadarChartProps) {
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
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon
            key={s}
            points={points(s)}
            fill="none"
            stroke="#ccc"
            strokeWidth={s === 1 ? 1.5 : 0.5}
            opacity={s === 1 ? 0.5 : 0.25}
          />
        ))}
        {labels.map((_, i) => {
          const a = angleStep * i - Math.PI / 2;
          return (
            <line
              key={`ax-${i}`}
              x1={cx} y1={cy}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="#ccc"
              strokeWidth={0.5}
              opacity={0.3}
            />
          );
        })}
        <motion.polygon
          points={points(1)}
          fill={`${color}18`}
          stroke={color}
          strokeWidth={2}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        {values.map((v, i) => {
          const a = angleStep * i - Math.PI / 2;
          const dx = cx + Math.cos(a) * (v / 100) * r;
          const dy = cy + Math.sin(a) * (v / 100) * r;
          return <circle key={`dot-${i}`} cx={dx} cy={dy} r={4} fill={color} />;
        })}
      </svg>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {labels.map((l) => (
          <span key={l} className="text-[10px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{l}</span>
        ))}
      </div>
    </div>
  );
}
