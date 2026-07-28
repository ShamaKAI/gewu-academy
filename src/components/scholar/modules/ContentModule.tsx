"use client";

interface ContentModuleProps {
  content: string;
  s: Record<string, string>;
}

export default function ContentModule({ content, s }: ContentModuleProps) {
  if (!content) {
    return (
      <p className="text-[#999] text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
        {s.no_courses_found || "暂无内容"}
      </p>
    );
  }

  // Simple Markdown-like rendering: split by double newline into paragraphs,
  // and treat lines starting with "# " as headings
  const blocks = content.split("\n\n").filter(Boolean);

  return (
    <div>
      <h3 className="text-[18px] font-bold mb-6" style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_content}
      </h3>
      <div className="prose max-w-none">
        {blocks.map((block, i) => {
          if (block.startsWith("# ")) {
            const level = block.match(/^#+/)?.[0].length || 1;
            const text = block.replace(/^#+\s*/, "");
            const headingLevel = Math.min(level + 1, 4);
            const sizes: Record<number, string> = { 2: "20px", 3: "18px", 4: "16px" };
            const fontSize = sizes[headingLevel] || "20px";
            if (headingLevel === 2) {
              return (
                <h2
                  key={i}
                  className="font-bold mt-6 mb-3"
                  style={{ fontFamily: "var(--font-serif)", fontSize }}
                >
                  {text}
                </h2>
              );
            }
            if (headingLevel === 3) {
              return (
                <h3
                  key={i}
                  className="font-bold mt-6 mb-3"
                  style={{ fontFamily: "var(--font-serif)", fontSize }}
                >
                  {text}
                </h3>
              );
            }
            return (
              <h4
                key={i}
                className="font-bold mt-6 mb-3"
                style={{ fontFamily: "var(--font-serif)", fontSize }}
              >
                {text}
              </h4>
            );
          }
          return (
            <p
              key={i}
              className="text-[15px] leading-relaxed text-[#333] mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {block}
            </p>
          );
        })}
      </div>
    </div>
  );
}
