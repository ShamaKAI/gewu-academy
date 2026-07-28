"use client";

interface ContentModuleProps {
  content: string;
  s: Record<string, string>;
}

/** Simple markdown line renderer — supports # headers and paragraph text */
function renderContent(text: string) {
  return text.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <br key={i} />;
    if (trimmed.startsWith("# ")) {
      return (
        <h2 key={i} className="text-[22px] text-[#000] font-bold m-0 mt-8 mb-4 tracking-[calc(var(--ls-scale)*2px)]"
          style={{ fontFamily: "var(--font-serif)" }}>
          {trimmed.slice(2)}
        </h2>
      );
    }
    return (
      <p key={i} className="text-[15px] text-[#333] leading-loose m-0 mb-3"
        style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>
        {trimmed}
      </p>
    );
  });
}

export default function ContentModule({ content, s }: ContentModuleProps) {
  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_content}
      </h2>
      <div className="prose max-w-3xl">
        {renderContent(content)}
      </div>
    </div>
  );
}
