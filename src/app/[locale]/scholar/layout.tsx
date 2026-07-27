import Sidebar from "@/components/scholar/Sidebar";
import StudyOverview from "@/components/scholar/StudyOverview";
import DecorBg from "@/components/scholar/DecorBg";
import InkRipple from "@/components/scholar/InkRipple";
import LangSwitch from "@/components/landing/LangSwitch";

/** 三栏布局: 左侧200px导航 | 中间主内容flex-1 | 右侧学习概况 */
export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: "#ffffff" }}>
      <DecorBg />
      <InkRipple />
      <Sidebar />

      {/* 中间主内容 */}
      <main
        className="flex-1 ml-[200px] overflow-y-auto relative z-10"
        style={{ height: "100vh" }}
      >
        {/* 背景图 — 30% 透明度 */}
        <div
          className="fixed inset-0 ml-[200px] pointer-events-none"
          style={{ zIndex: 0, opacity: 0.30 }}
        >
          <img
            src="/bgxueziduan.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* 白色柔光层，确保文字可读 */}
        <div
          className="fixed inset-0 ml-[200px] pointer-events-none"
          style={{ zIndex: 1, background: "rgba(255,255,255,0.55)" }}
        />

        <div className="relative z-10">{children}</div>
      </main>

      {/* 右上语言切换 */}
      <div className="fixed top-3 right-[316px] z-30">
        <LangSwitch />
      </div>

      {/* 右侧学习概况 */}
      <aside
        className="w-[300px] flex-shrink-0 h-screen overflow-y-auto border-l border-[#ccc] relative z-10"
        style={{ background: "#fafafa" }}
      >
        <StudyOverview />
      </aside>
    </div>
  );
}
