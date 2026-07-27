"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";

interface PlaceholderPageProps { titleKey: string; }

export default function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;

  return (
    <motion.div className="px-14 py-12" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      <h1 className="text-[38px] text-[#000] tracking-[calc(var(--ls-scale)*7px)] m-0 mb-4" style={{ fontFamily: "var(--font-calligraphy)" }}>{s[titleKey]}</h1>
      <p className="text-[18px] text-[#000] tracking-[calc(var(--ls-scale)*3px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.page_placeholder}</p>
    </motion.div>
  );
}
