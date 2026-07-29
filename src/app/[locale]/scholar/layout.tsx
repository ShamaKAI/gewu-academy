"use client";

import { useParams } from "next/navigation";
import Sidebar from "@/components/scholar/Sidebar";
import StudyOverview from "@/components/scholar/StudyOverview";
import DecorBg from "@/components/scholar/DecorBg";
import InkRipple from "@/components/scholar/InkRipple";
import LangSwitch from "@/components/landing/LangSwitch";

export default function ScholarLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const locale = (params?.locale as string) || "zh";

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: "#ffffff" }}>
      <DecorBg />
      <InkRipple />
      <Sidebar />

      <main className="flex-1 ml-[220px] overflow-y-auto relative z-10" style={{ height: "100vh" }}>
        <div className="fixed inset-0 ml-[220px] pointer-events-none" style={{ zIndex: 0, opacity: 0.30 }}>
          <img src="/bgxueziduan.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="fixed inset-0 ml-[220px] pointer-events-none" style={{ zIndex: 1, background: "rgba(255,255,255,0.55)" }} />
        <div className="relative z-10">{children}</div>
      </main>

      <div className="fixed top-3 right-[356px] z-30"><LangSwitch /></div>

      <aside className="w-[300px] flex-shrink-0 h-screen overflow-y-auto border-l border-[#000] relative z-10" style={{ background: "#fafafa" }}>
        <StudyOverview locale={locale} />
      </aside>
    </div>
  );
}
