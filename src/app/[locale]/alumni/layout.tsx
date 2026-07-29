"use client";

import { useParams } from "next/navigation";
import AlumniSidebar from "@/components/alumni/Sidebar";
import LangSwitch from "@/components/landing/LangSwitch";

export default function AlumniLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#ffffff" }}>
      <AlumniSidebar />
      <div className="fixed inset-0 ml-[220px] pointer-events-none z-0" style={{ background: "rgba(255,255,255,0.95)" }} />
      <main className="flex-1 ml-[220px] overflow-y-auto relative z-10" style={{ height: "100vh" }}>
        <div className="fixed top-3 right-8 z-30"><LangSwitch /></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
