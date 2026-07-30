"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

const navItems = [
  { key: "home",         href: "",            icon: "home" },
  { key: "mentors",      href: "/mentors",     icon: "mentors" },
  { key: "scholars",     href: "/scholars",    icon: "scholars" },
  { key: "alumni",       href: "/alumni",      icon: "alumni" },
  { key: "courses",      href: "/courses",     icon: "courses" },
  { key: "events",       href: "/events",      icon: "events" },
  { key: "forum",        href: "/forum",       icon: "forum" },
  { key: "achievements", href: "/achievements", icon: "achievements" },
  { key: "analytics",    href: "/analytics",   icon: "analytics" },
  { key: "messages",     href: "/messages",    icon: "messages" },
] as const;

function NavIcon({ name }: { name: string }) {
  return <img src={`/icons/dean-${name}.png`} alt="" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />;
}

export default function DeanSidebar() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const s = (t.dean as Record<string, string>) || {};
  const isHome = pathname === `/${locale}/dean`;

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col border-r border-[#000]" style={{ background: "#f7f7f7", zIndex: 40 }}>
      <div className="px-5 pt-8 pb-4 border-b border-[#000]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#000] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[14px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>山</span>
          </div>
          <div>
            <h2 className="text-[17px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] m-0 leading-tight font-bold" style={{ fontFamily: "var(--font-serif)" }}>山长斋</h2>
            <p className="text-[9px] text-[#000] tracking-[calc(var(--ls-scale)*1.5px)] uppercase m-0 font-bold" style={{ fontFamily: "var(--font-display)" }}>DEAN PORTAL</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const href = `/${locale}/dean${item.href}`;
          const active = item.href === "" ? isHome : pathname.startsWith(href);
          return (
            <Link key={item.key} href={href}
              className={`flex items-center gap-3 pl-4 pr-4 py-2.5 rounded-[10px] text-[15px] no-underline font-bold transition-all ${
                active ? "bg-white text-[#000] shadow-sm" : "text-[#000] hover:bg-white/50"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}>
              <NavIcon name={item.icon} />
              <span>{s[`dean_nav_${item.key}`] || item.key}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-6 flex flex-col gap-1 border-t border-[#000] pt-3">
        <button onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[15px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left"
          style={{ fontFamily: "var(--font-serif)" }}>← 返回书院</button>
      </div>
    </aside>
  );
}
