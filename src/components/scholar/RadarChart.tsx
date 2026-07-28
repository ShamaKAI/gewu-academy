"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[];
  size?: number;
  color?: string;
}

export default function RadarChart({ labels, values, size = 280, color = "#388e3c" }: RadarChartProps) {
  const cx = size / 2, cy = size / 2, r = size * 0.35;
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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid rings */}
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
      {/* Axis lines */}
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
      {/* Data polygon */}
      <motion.polygon
        points={points(1)}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={2.5}
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
        return <circle key={`dot-${i}`} cx={dx} cy={dy} r={4.5} fill={color} stroke="#fff" strokeWidth={1.5} />;
      })}
      {/* Axis labels — positioned at extended radius */}
      {labels.map((l, i) => {
        const a = angleStep * i - Math.PI / 2;
        const labelR = r + 22;
        const lx = cx + Math.cos(a) * labelR;
        const ly = cy + Math.sin(a) * labelR;
        // Anchor depends on position
        const anchor = Math.abs(Math.cos(a)) < 0.3 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
        return (
          <text
            key={`lbl-${i}`}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="central"
            fill="#000"
            fontSize={11}
            fontWeight={600}
            fontFamily="var(--font-serif, serif)"
          >
            {l}
          </text>
        );
      })}
    </svg>
  );
}
