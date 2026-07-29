"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

const NavSection = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mb-2">
    <p className="text-[11px] text-[#000] px-5 py-2 font-bold opacity-40 tracking-[calc(var(--ls-scale)*1.5px)] uppercase m-0" style={{ fontFamily: "var(--font-display)" }}>{label}</p>
    {children}
  </div>
);

function NavLink({ href, label, active, indent }: { href: string; label: string; active: boolean; indent?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 ${indent ? "pl-10" : "pl-5"} pr-4 py-2.5 rounded-[10px] text-[15px] tracking-[calc(var(--ls-scale)*1.5px)] transition-all duration-200 no-underline font-bold ${
        active ? "bg-white text-[#000] shadow-sm" : "text-[#000] hover:bg-white/60"
      }`}
      style={{ fontFamily: "var(--font-serif)" }}
    >
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#000]" />}
      <span className="relative">{label}</span>
    </Link>
  );
}

export default function MentorSidebar({ mentorName }: { mentorName?: string }) {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const s = t.mentor as Record<string, string>;

  const isActive = (path: string) => pathname === `/${locale}${path}` || pathname.startsWith(`/${locale}${path}/`) && path !== "/mentor";

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col border-r border-[#000]" style={{ background: "#f7f7f7", zIndex: 40 }}>
      {/* Logo */}
      <div className="px-5 pt-8 pb-4 border-b border-[#000]">
        <h2 className="text-[19px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] m-0 leading-tight font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          格物讲堂
        </h2>
        <p className="text-[10px] text-[#000] tracking-[calc(var(--ls-scale)*1px)] uppercase m-0 mt-0.5 font-bold opacity-40" style={{ fontFamily: "var(--font-display)" }}>
          MENTOR PORTAL
        </p>
        {mentorName && (
          <p className="text-[12px] text-[#000] m-0 mt-2 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{mentorName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        <NavSection label={s.mentor_nav_lectures}>
          <NavLink href={`/${locale}/mentor`} label={s.mentor_nav_library} active={pathname === `/${locale}/mentor`} indent />
          <NavLink href={`/${locale}/mentor/courses/new`} label={s.mentor_nav_new_course} active={pathname === `/${locale}/mentor/courses/new`} indent />
        </NavSection>
        <NavSection label={s.mentor_nav_events}>
          <NavLink href={`/${locale}/mentor/events`} label={s.mentor_nav_event_log} active={isActive("/mentor/events")} indent />
          <NavLink href={`/${locale}/mentor/events/new`} label={s.mentor_nav_new_event} active={pathname === `/${locale}/mentor/events/new`} indent />
        </NavSection>
        <NavSection label={s.mentor_nav_analytics}>
          <NavLink href={`/${locale}/mentor/analytics`} label={s.mentor_nav_analytics} active={pathname === `/${locale}/mentor/analytics`} indent />
        </NavSection>
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 flex flex-col gap-1 border-t border-[#000] pt-3">
        <button onClick={() => router.push(`/${locale}`)} className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[14px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left" style={{ fontFamily: "var(--font-serif)" }}>← {s.mentor_nav_back}</button>
        <button onClick={() => router.push(`/${locale}`)} className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[14px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left" style={{ fontFamily: "var(--font-serif)" }}>{s.mentor_nav_logout}</button>
      </div>
    </aside>
  );
}
