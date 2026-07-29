"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";

function NavIcon({ name }: { name: string }) {
  return <img src={`/icons/mentor-${name}.png`} alt="" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />;
}

function SubIcon({ name }: { name: string }) {
  return <img src={`/icons/mentor-${name}.png`} alt="" style={{ width: 20, height: 20, objectFit: "contain", flexShrink: 0 }} />;
}

function NavSection({ iconName, label, defaultOpen, children }: { iconName: string; label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 text-[17px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/40 rounded-[10px] transition-all text-left"
        style={{ fontFamily: "var(--font-serif)" }}>
        <NavIcon name={iconName} />
        <span className="flex-1">{label}</span>
        <motion.span className="text-[14px] opacity-40" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>▼</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-4 flex flex-col gap-0.5 mt-1">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubLink({ href, iconName, label, active }: { href: string; iconName: string; label: string; active: boolean }) {
  return (
    <Link href={href}
      className={`flex items-center gap-2.5 pl-8 pr-4 py-2.5 rounded-[8px] text-[15px] no-underline font-bold transition-all ${
        active ? "bg-white text-[#000] shadow-sm" : "text-[#000] hover:bg-white/50"
      }`}
      style={{ fontFamily: "var(--font-serif)" }}>
      <SubIcon name={iconName} />
      <span>{label}</span>
    </Link>
  );
}

export default function MentorSidebar({ mentorName }: { mentorName?: string }) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const s = t.mentor as Record<string, string>;

  const isActive = (path: string) => pathname === `/${locale}${path}`;

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col border-r border-[#000]" style={{ background: "#f7f7f7", zIndex: 40 }}>
      {/* Logo */}
      <div className="px-5 pt-8 pb-4 border-b border-[#000]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#000] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[14px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>讲</span>
          </div>
          <div>
            <h2 className="text-[17px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] m-0 leading-tight font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              格物讲堂
            </h2>
            <p className="text-[9px] text-[#000] tracking-[calc(var(--ls-scale)*1.5px)] uppercase m-0 font-bold" style={{ fontFamily: "var(--font-display)" }}>
              MENTOR PORTAL
            </p>
          </div>
        </div>
        {mentorName && (
          <p className="text-[12px] text-[#000] m-0 mt-2 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{mentorName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <NavSection iconName="lectures" label={s.mentor_nav_lectures} defaultOpen>
          <SubLink href={`/${locale}/mentor`} iconName="library" label={s.mentor_nav_library} active={pathname === `/${locale}/mentor`} />
          <SubLink href={`/${locale}/mentor/courses/new`} iconName="new-course" label={s.mentor_nav_new_course} active={isActive("/mentor/courses/new")} />
        </NavSection>
        <NavSection iconName="events" label={s.mentor_nav_events}>
          <SubLink href={`/${locale}/mentor/events`} iconName="event-log" label={s.mentor_nav_event_log} active={isActive("/mentor/events")} />
          <SubLink href={`/${locale}/mentor/events/new`} iconName="new-event" label={s.mentor_nav_new_event} active={isActive("/mentor/events/new")} />
        </NavSection>
        <NavSection iconName="analytics" label={s.mentor_nav_analytics}>
          <SubLink href={`/${locale}/mentor/analytics`} iconName="analytics" label={s.mentor_nav_analytics} active={isActive("/mentor/analytics")} />
        </NavSection>
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-1 border-t border-[#000] pt-3">
        <button onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[15px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left"
          style={{ fontFamily: "var(--font-serif)" }}>← {s.mentor_nav_back}</button>
        <button onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[15px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left"
          style={{ fontFamily: "var(--font-serif)" }}>{s.mentor_nav_logout}</button>
      </div>
    </aside>
  );
}
