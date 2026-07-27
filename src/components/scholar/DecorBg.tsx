"use client";

/** 低透明度水墨远山 + 荷花装饰背景，不影响主体阅读 */
export default function DecorBg() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* 远山 — 右上角 */}
      <svg
        className="absolute top-0 right-0 opacity-[0.04]"
        width="600" height="400" viewBox="0 0 600 400"
        style={{ transform: "translate(10%, -5%)" }}
      >
        <path d="M0 350 Q50 200 120 250 Q180 120 260 200 Q320 60 400 160 Q460 80 520 180 Q580 120 600 200 L600 400 L0 400Z"
          fill="#000" />
        <path d="M50 380 Q120 240 200 290 Q280 160 380 260 Q440 130 500 220 Q560 160 600 240 L600 400 L50 400Z"
          fill="#000" opacity="0.6" />
      </svg>

      {/* 远山 — 左下角 */}
      <svg
        className="absolute bottom-0 left-0 opacity-[0.03]"
        width="500" height="350" viewBox="0 0 500 350"
        style={{ transform: "translate(-8%, 8%)" }}
      >
        <path d="M0 300 Q80 180 160 250 Q240 100 340 200 Q400 120 460 180 Q500 150 500 200 L500 350 L0 350Z"
          fill="#000" />
        <path d="M0 330 Q100 220 200 280 Q300 160 400 240 Q460 190 500 230 L500 350 L0 350Z"
          fill="#000" opacity="0.5" />
      </svg>

      {/* 荷花 — 右下角，极淡 */}
      <svg
        className="absolute bottom-0 right-0 opacity-[0.035]"
        width="280" height="320" viewBox="0 0 280 320"
        style={{ transform: "translate(5%, 5%)" }}
      >
        {/* 荷叶 */}
        <ellipse cx="140" cy="280" rx="100" ry="30" fill="#000" opacity="0.4" />
        <path d="M140 280 Q60 180 40 140" stroke="#000" strokeWidth="2" fill="none" opacity="0.3" />
        {/* 荷花花瓣 */}
        <path d="M140 140 Q110 80 140 50 Q170 80 140 140Z" fill="#000" opacity="0.5" />
        <path d="M140 145 Q95 100 115 65 Q135 95 140 145Z" fill="#000" opacity="0.35" />
        <path d="M140 145 Q185 100 165 65 Q145 95 140 145Z" fill="#000" opacity="0.35" />
        {/* 花蕊 */}
        <circle cx="140" cy="130" r="12" fill="#000" opacity="0.25" />
        <line x1="140" y1="140" x2="140" y2="260" stroke="#000" strokeWidth="2.5" opacity="0.3" />
      </svg>

      {/* 水纹 — 底部横线 */}
      <svg
        className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-[0.025]"
        width="800" height="60" viewBox="0 0 800 60"
      >
        <path d="M0 30 Q100 20 200 35 Q300 45 400 30 Q500 20 600 35 Q700 45 800 30"
          stroke="#000" strokeWidth="1.5" fill="none" />
        <path d="M0 42 Q100 35 200 45 Q300 52 400 42 Q500 35 600 45 Q700 52 800 42"
          stroke="#000" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>
    </div>
  );
}
