"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Chapter } from "@/data/courses";

interface TocAccordionProps {
  chapters: Chapter[];
  courseId: string;
  locale: string;
  activeSection?: string;
}

export default function TocAccordion({ chapters, courseId, locale, activeSection }: TocAccordionProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());

  const toggle = (slug: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  if (chapters.length === 0) {
    return (
      <p className="text-center text-[#999] py-12 text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>
        暂无课程目录
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {chapters.map((ch) => {
        const isOpen = openChapters.has(ch.slug);
        return (
          <div key={ch.slug} className="border-b border-[#eee] last:border-b-0">
            {/* Chapter header */}
            <button
              onClick={() => toggle(ch.slug)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-transparent border-none cursor-pointer hover:bg-[#f7f7f7] transition-colors"
            >
              <span className="text-[15px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                {ch.title}
              </span>
              <motion.span
                className="text-[#999] text-[16px]"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </button>

            {/* Sections */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pb-3">
                    {ch.sections.map((sec) => (
                      <Link
                        key={sec.slug}
                        href={`/${locale}/scholar/courses/${courseId}/${ch.slug}`}
                        className={`block px-10 py-2.5 text-[14px] no-underline transition-colors ${
                          activeSection === sec.slug
                            ? "text-[#000] font-bold bg-[#f0f0f0] border-l-[3px] border-[#333]"
                            : "text-[#666] hover:text-[#333] hover:bg-[#f9f9f9] border-l-[3px] border-transparent"
                        }`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {sec.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
