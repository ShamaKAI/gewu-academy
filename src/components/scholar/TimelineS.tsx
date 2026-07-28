"use client";

import { motion } from "framer-motion";

interface TimelineEvent {
  date: string;
  text: string;
}

interface TimelineSProps {
  events: TimelineEvent[];
}

/** Points along a cubic bezier S-curve */
function sCurve(t: number, w: number, h: number): { x: number; y: number } {
  // Cubic bezier: start(0,0) → cp1(0.6,0) → cp2(0.4,1) → end(1,1), mapped to width/height
  const mt = 1 - t;
  const x = w * (3 * mt * mt * t * 0.6 + 3 * mt * t * t * 0.4 + t * t * t);
  const y = h * (3 * mt * mt * t * 0.0 + 3 * mt * t * t * 1.0 + t * t * t);
  return { x, y };
}

export default function TimelineS({ events }: TimelineSProps) {
  const w = 560, h = 400;

  return (
    <div className="relative" style={{ width: w + 120, height: h + 10 }}>
      {/* SVG S-curve path */}
      <svg
        className="absolute top-0 left-0"
        width={w + 120}
        height={h + 10}
        style={{ pointerEvents: "none" }}
      >
        {/* S curve dashed line */}
        {/* cubic-bezier path: M(0,0) C(0.6w,0, 0.4w,h, w,h) */}
        <motion.path
          d={`M 30,20 C ${w * 0.7},20 ${w * 0.3},${h} ${w + 30},${h - 20}`}
          fill="none"
          stroke="#000"
          strokeWidth={1}
          strokeDasharray="6 4"
          opacity={0.3}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </svg>

      {/* Event nodes along the curve */}
      {events.map((ev, i) => {
        const t = events.length > 1 ? i / (events.length - 1) : 0.5;
        const { x, y } = sCurve(t, w, h);

        // Stagger: nodes alternate left/right of the curve
        const side = i % 2 === 0 ? -1 : 1;
        const labelX = x + side * 65;
        const connectorX = x + side * 10;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: 0, top: 0, transform: `translate(${x}px, ${y}px)` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            {/* Dot on the curve */}
            <div
              className="absolute w-[8px] h-[8px] rounded-full bg-[#000]"
              style={{ transform: "translate(-50%, -50%)" }}
            />
            {/* Horizontal connector line */}
            <div
              className="absolute top-0 h-[1px] bg-[#000] opacity-20"
              style={{
                left: 0,
                width: Math.abs(labelX - x),
                transform: side > 0 ? "translate(0, -50%)" : `translate(${connectorX - x}px, -50%)`,
              }}
            />
            {/* Date + text label */}
            <div
              className="absolute w-[120px]"
              style={{
                left: side > 0 ? 18 : -138,
                top: -10,
                textAlign: side > 0 ? "left" : "right",
              }}
            >
              <p
                className="text-[10px] text-[#000] m-0 font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {ev.date}
              </p>
              <p
                className="text-[11px] text-[#000] m-0 mt-0.5 leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {ev.text}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
