"use client";

import type { PptFile } from "@/data/courses";

interface PptModuleProps {
  pptFiles: PptFile[];
  s: Record<string, string>;
}

export default function PptModule({ pptFiles, s }: PptModuleProps) {
  if (pptFiles.length === 0) {
    return (
      <p className="text-[#999] text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
        {s.no_courses_found || "暂无课件"}
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-[18px] font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_ppt}
      </h3>
      <div className="flex flex-col gap-4">
        {pptFiles.map((ppt) => (
          <div key={ppt.id} className="border border-[#eee] rounded-[8px] p-4">
            <p className="text-[14px] text-[#333]" style={{ fontFamily: "var(--font-serif)" }}>
              {ppt.title}
            </p>
            <p className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
              {ppt.type.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
