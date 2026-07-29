"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

const navSections = [
  {
    labelKey: "alumni_nav_space",
    items: [
      { key: "home", href: "", icon: "🏛" },
      { key: "forum", href: "/forum", icon: "📜" },
      { key: "events", href: "/events", icon: "🎋" },
      { key: "messages", href: "/messages", icon: "✉" },
      { key: "network", href: "/network", icon: "🤝" },
      { key: "achievements", href: "/achievements", icon: "🏆" },
    ],
  },
  {
    labelKey: "alumni_nav_personal",
    items: [
      { key: "study", href: "/study", icon: "📚" },
    ],
  },
] as const;

export default function AlumniSidebar() {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const s = (t.alumni as Record<string, string>) || {};

  const isHome = pathname === `/${locale}/alumni`;

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] flex flex-col border-r border-[#000]" style={{ background: "#f7f7f7", zIndex: 40 }}>
      {/* Logo — matches scholar style */}
      <div className="px-5 pt-8 pb-4 border-b border-[#000]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#000] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[14px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>道</span>
          </div>
          <div>
            <h2 className="text-[17px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] m-0 leading-tight font-bold" style={{ fontFamily: "var(--font-serif)" }}>
              同窗馆
            </h2>
            <p className="text-[9px] text-[#000] tracking-[calc(var(--ls-scale)*1.5px)] uppercase m-0 font-bold" style={{ fontFamily: "var(--font-display)" }}>
              ALUMNI GUILD
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.labelKey} className="mb-3">
            <p className="text-[10px] text-[#000] px-4 py-2 font-bold opacity-40 uppercase tracking-wider m-0"
              style={{ fontFamily: "var(--font-display)" }}>
              {s[section.labelKey] || section.labelKey}
            </p>
            {section.items.map((item) => {
              const href = `/${locale}/alumni${item.href}`;
              const active = item.href === "" ? isHome : pathname.startsWith(href);
              return (
                <Link key={item.key} href={href}
                  className={`flex items-center gap-3 pl-4 pr-4 py-2.5 rounded-[10px] text-[15px] no-underline font-bold transition-all ${
                    active ? "bg-white text-[#000] shadow-sm" : "text-[#000] hover:bg-white/50"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}>
                  <span className="text-[18px] w-6 text-center">{item.icon}</span>
                  <span>{s[`alumni_nav_${item.key}`] || item.key}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 flex flex-col gap-1 border-t border-[#000] pt-3">
        <button onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[15px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left"
          style={{ fontFamily: "var(--font-serif)" }}>← 返回书院</button>
        <button onClick={() => router.push(`/${locale}`)}
          className="flex items-center gap-3 pl-5 pr-4 py-2.5 rounded-[10px] text-[15px] text-[#000] font-bold bg-transparent border-none cursor-pointer hover:bg-white/60 transition-all text-left"
          style={{ fontFamily: "var(--font-serif)" }}>退出登录</button>
      </div>
    </aside>
  );
}
