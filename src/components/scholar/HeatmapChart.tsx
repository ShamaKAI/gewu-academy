"use client";

const DAYS = ["一", "二", "三", "四", "五", "六", "日"];
const COLORS = ["#fafafa", "#e8e8e8", "#d0d0d0", "#a0a0a0", "#606060", "#000"];

function randomGrid(weeks: number) {
  return Array.from({ length: weeks }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 6))
  );
}

export default function HeatmapChart() {
  const data = randomGrid(12);

  return (
    <div className="flex items-start gap-3">
      {/* Day labels */}
      <div className="flex flex-col gap-[3px] pt-[14px]">
        {DAYS.map((d) => (
          <span key={d} className="text-[9px] text-[#000] leading-[10px]" style={{ fontFamily: "var(--font-serif)" }}>
            {d}
          </span>
        ))}
      </div>
      {/* Grid */}
      <div className="flex gap-[3px]">
        {data.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((val, di) => (
              <div
                key={`${wi}-${di}`}
                className="w-[10px] h-[10px] rounded-[2px]"
                style={{ background: COLORS[val] }}
                title={`${val}h`}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 ml-4 mt-1">
        <span className="text-[9px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>少</span>
        {COLORS.map((c, i) => (
          <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ background: c }} />
        ))}
        <span className="text-[9px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>多</span>
      </div>
    </div>
  );
}
