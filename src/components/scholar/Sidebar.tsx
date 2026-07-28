"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { IconMail, IconLogout } from "./Icons";

const navItems = [
  { key: "academy", href: "/scholar" },
  { key: "courses", href: "/scholar/courses" },
  { key: "analytics", href: "/scholar/analytics" },
  { key: "mentors", href: "/scholar/mentors" },
  { key: "news", href: "/scholar/news" },
  { key: "desk", href: "/scholar/desk" },
  { key: "library", href: "/scholar/library" },
];

function NavIcon({ name }: { name: string }) {
  return (
    <img
      src={`/icons/nav-${name}.png`}
      alt=""
      style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

export default function Sidebar() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const s = t.scholar as Record<string, string>;
  const c = t.common as Record<string, string>;

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[200px] flex flex-col border-r border-[#cccccc]"
      style={{ background: "#f7f7f7", zIndex: 40 }}
    >
      {/* Logo */}
      <div className="px-5 pt-8 pb-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-[#333] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[13px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>格</span>
          </div>
          <div>
            <h2 className="text-[15px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] m-0 leading-tight font-bold"
              style={{ fontFamily: "var(--font-serif)" }}>{c.academy_name}</h2>
            <p className="text-[9px] text-[#999] tracking-[calc(var(--ls-scale)*1.5px)] uppercase m-0"
              style={{ fontFamily: "var(--font-display)" }}>{c.academy_name_en}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {navItems.map(({ key, href }) => {
          const fullHref = `/${locale}${href}`;
          const currentPath = pathname.replace(/^\/[a-z]{2}/, "");
          const isActive = currentPath === href;
          return (
            <Link
              key={key}
              href={fullHref}
              className={`flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-[10px] text-[14px] tracking-[calc(var(--ls-scale)*1.5px)] transition-all duration-200 no-underline relative ${
                isActive
                  ? "bg-white text-[#000] shadow-sm font-bold"
                  : "text-[#666] hover:text-[#333] hover:bg-white/60"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-[#000]" />
              )}
              <NavIcon name={key} />
              <span>{s[`nav_${key}`]}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-4 pb-8 flex flex-col gap-1">
        <div className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-[10px] text-[14px] text-[#666] tracking-[calc(var(--ls-scale)*1.5px)] cursor-pointer hover:text-[#333] hover:bg-white/60 transition-all duration-200"
          style={{ fontFamily: "var(--font-serif)" }}>
          <span className="w-[22px] h-[22px] flex-shrink-0" />
          <span>{s.nav_settings}</span>
        </div>
        <Link href={`/${locale}`}
          className="flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-[10px] text-[14px] text-[#666] tracking-[calc(var(--ls-scale)*1.5px)] hover:text-[#333] hover:bg-white/60 transition-all duration-200 no-underline"
          style={{ fontFamily: "var(--font-serif)" }}>
          <span className="w-[22px] h-[22px] flex-shrink-0" />
          <span>{s.nav_logout}</span>
        </Link>
      </div>
    </aside>
  );
}
