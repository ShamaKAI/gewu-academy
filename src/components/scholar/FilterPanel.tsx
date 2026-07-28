"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/i18n/useTranslation";
import { ALL_CATEGORIES } from "@/data/courses";

export interface FilterState {
  category: string;
  difficulty: string;
  status: string;
  sort: string;
}

interface FilterPanelProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
}

const DIFFICULTIES = ["all", "beginner", "intermediate", "advanced"];
const STATUSES = ["all", "not_started", "in_progress", "completed"];
const SORT_OPTIONS = [
  "rating",
  "reviews",
  "likes",
  "views",
  "newest",
];

export default function FilterPanel({ filter, onChange }: FilterPanelProps) {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [open, setOpen] = useState(false);

  const update = (key: keyof FilterState, value: string) =>
    onChange({ ...filter, [key]: value });

  return (
    <div className="mb-6">
      {/* Sort bar — always visible */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-[13px] text-[#000] hover:text-[#333] transition-colors font-bold cursor-pointer bg-transparent border-none"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
          </svg>
          {s.courses_filter}
          {open ? " ▲" : " ▼"}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>
            {s.courses_sort}:
          </span>
          <select
            value={filter.sort}
            onChange={(e) => update("sort", e.target.value)}
            className="text-[13px] text-[#333] bg-[#f7f7f7] border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {s[`courses_sort_${opt}`]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter panel — collapsible */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-6 p-5 bg-[#f7f7f7] rounded-[12px] border border-[#eee] mb-2">
              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_category}:
                </span>
                <select
                  value={filter.category}
                  onChange={(e) => update("category", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  <option value="all">{s.courses_category_all}</option>
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_difficulty}:
                </span>
                <select
                  value={filter.difficulty}
                  onChange={(e) => update("difficulty", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  <option value="all">{s.courses_status_all}</option>
                  {DIFFICULTIES.filter((d) => d !== "all").map((d) => (
                    <option key={d} value={d}>{s[`courses_difficulty_${d}`]}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-serif)" }}>
                  {s.courses_status}:
                </span>
                <select
                  value={filter.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="text-[13px] text-[#333] bg-white border border-[#ccc] rounded-[8px] px-3 py-1.5 outline-none cursor-pointer focus:border-[#666]"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{s[`courses_status_${st}`]}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
