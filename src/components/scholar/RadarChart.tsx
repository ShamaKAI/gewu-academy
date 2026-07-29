"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  labels: string[];
  values: number[];
  avgValues?: number[];  // school average for comparison
  size?: number;
  color?: string;
  avgColor?: string;
}

export default function RadarChart({ labels, values, avgValues, size = 320, color = "#388e3c", avgColor = "#ccc" }: RadarChartProps) {
  const margin = 30; // extra space for axis labels
  const cx = size / 2, cy = size / 2, r = size * 0.30; // smaller radius to fit labels
  const n = labels.length;
  const angleStep = (Math.PI * 2) / n;

  const points = (vals: number[], scale: number) =>
    vals.map((v, i) => {
      const a = angleStep * i - Math.PI / 2;
      const rr = (v / 100) * r * scale;
      return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
    }).join(" ");

  return (
    <div className="flex justify-center">
      <svg width={size + margin * 2} height={size + margin * 2} viewBox={`${-margin} ${-margin} ${size + margin * 2} ${size + margin * 2}`}>
        {/* Grid rings */}
        {[0.25, 0.5, 0.75, 1].map((s) => (
          <polygon key={s} points={points(values, s)} fill="none" stroke="#ddd" strokeWidth={s === 1 ? 1.5 : 0.5} opacity={0.6} />
        ))}
        {/* Axis lines */}
        {labels.map((_, i) => {
          const a = angleStep * i - Math.PI / 2;
          return <line key={`ax-${i}`} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="#ddd" strokeWidth={0.5} opacity={0.4} />;
        })}
        {/* School average polygon */}
        {avgValues && (
          <motion.polygon points={points(avgValues, 1)} fill={`${avgColor}10`} stroke={avgColor} strokeWidth={2} strokeDasharray="6 3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
        )}
        {/* User data polygon */}
        <motion.polygon points={points(values, 1)} fill={`${color}15`} stroke={color} strokeWidth={2.5}
          initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }} />
        {/* Dots — user */}
        {values.map((v, i) => {
          const a = angleStep * i - Math.PI / 2;
          return <circle key={`dot-${i}`} cx={cx + Math.cos(a) * (v/100) * r} cy={cy + Math.sin(a) * (v/100) * r} r={4} fill={color} stroke="#fff" strokeWidth={1.5} />;
        })}
        {/* Dots — avg */}
        {avgValues && avgValues.map((v, i) => {
          const a = angleStep * i - Math.PI / 2;
          return <circle key={`adot-${i}`} cx={cx + Math.cos(a) * (v/100) * r} cy={cy + Math.sin(a) * (v/100) * r} r={3} fill={avgColor} />;
        })}
        {/* Axis labels — farther out for full visibility */}
        {labels.map((l, i) => {
          const a = angleStep * i - Math.PI / 2;
          const labelR = r + 28;
          const lx = cx + Math.cos(a) * labelR;
          const ly = cy + Math.sin(a) * labelR;
          const anchor = Math.abs(Math.cos(a)) < 0.2 ? "middle" : Math.cos(a) > 0 ? "start" : "end";
          return (
            <text key={`lbl-${i}`} x={lx} y={ly} textAnchor={anchor} dominantBaseline="central" fill="#000"
              fontSize={12} fontWeight={600} fontFamily="var(--font-serif, serif)">{l}</text>
          );
        })}
      </svg>
    </div>
  );
}
