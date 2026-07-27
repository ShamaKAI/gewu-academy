"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslation, LOCALES, type Locale } from "@/i18n/useTranslation";

const localeLabels: Record<Locale, string> = { zh: "中文", en: "EN", ms: "BM" };

interface LangSwitchProps {
  className?: string;
}

export default function LangSwitch({ className = "" }: LangSwitchProps) {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (nextLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split("/").filter(Boolean);
    segments[0] = nextLocale;
    router.push("/" + segments.join("/"));
  };

  return (
    <div className={`z-30 flex items-center gap-1 pointer-events-auto ${className}`}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          <button
            onClick={() => switchTo(l)}
            className={`text-xs tracking-[calc(var(--ls-scale)*2px)] px-1 py-0.5 transition-colors duration-200 ${
              locale === l
                ? "text-[#000] cursor-default"
                : "text-[#000] hover:text-[#000] cursor-pointer"
            }`}
            style={{ fontFamily: "var(--font-display)", background: "none", border: "none" }}
            disabled={locale === l}
          >
            {localeLabels[l]}
          </button>
          {i < LOCALES.length - 1 && (
            <span className="text-[#000] text-xs mx-0.5 select-none">|</span>
          )}
        </span>
      ))}
    </div>
  );
}
