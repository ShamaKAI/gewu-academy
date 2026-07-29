"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import MentorSidebar from "@/components/mentor/Sidebar";
import { mentors } from "@/data/mentors";
import LangSwitch from "@/components/landing/LangSwitch";

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const [mentorName, setMentorName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const id = localStorage.getItem("gewu-mentor-id");
    if (id) {
      const found = mentors.find((m) => m.id === id);
      if (found) setMentorName(found.name);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#ffffff" }}>
      <MentorSidebar mentorName={mentorName} />
      <main className="flex-1 ml-[220px] overflow-y-auto relative z-10" style={{ height: "100vh" }}>
        <div className="fixed top-3 right-8 z-30"><LangSwitch /></div>
        <div className="relative z-10">{children}</div>
      </main>
    </div>
  );
}
