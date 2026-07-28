"use client";

interface NotesModuleProps {
  content: string;
  s: Record<string, string>;
}

export default function NotesModule({ content, s }: NotesModuleProps) {
  return (
    <div>
      <h3 className="text-[18px] font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_notes}
      </h3>
      <p className="text-[14px] text-[#999] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {s.generate_notes || "生成笔记"}
      </p>
      <div className="border border-[#eee] rounded-[8px] p-6 min-h-[200px] bg-[#fafafa]">
        <p className="text-[14px] text-[#666]" style={{ fontFamily: "var(--font-serif)" }}>
          {content ? content.substring(0, 200) + "..." : "暂无笔记内容"}
        </p>
      </div>
    </div>
  );
}
