"use client";

import { useState } from "react";

interface NotesModuleProps {
  content: string;
  s: Record<string, string>;
}

export default function NotesModule({ content, s }: NotesModuleProps) {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "";
      if (!apiKey) {
        // Fall back to mock if no API key
        await new Promise((r) => setTimeout(r, 1500));
        setNotes(`## 本章要点总结

### 核心概念

1. **三纲领** — "明明德、亲民、止于至善" 是整个《大学》思想的总纲，三者层层递进，构成儒家内圣外王的完整路径。

2. **明明德** — 彰明人先天本具的光明德性。儒家认为修身的过程就是通过格物致知、诚意正心的工夫，去除私欲遮蔽，使明德重新焕发。

3. **亲民** — 朱熹解为"新民"，强调君子不仅要自明其德，更要推己及人，教化天下。

4. **八条目** — 格物、致知、诚意、正心、修身、齐家、治国、平天下。其中修身居于枢纽地位。

### 关键结论

- 格物致知是大学之道的起点，是一切修身为学的基础
- 内圣（明明德）必须走向外王（亲民），两者不可偏废
- 止于至善不是一个静态的标准，而是一个不断趋近的动态过程`);
        return;
      }

      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "你是一位专业的教育助理，擅长总结课程内容。请用中文回答，以结构化的Markdown格式输出，包括核心概念、关键结论等部分。",
            },
            {
              role: "user",
              content: `请根据以下课程内容，总结本章节的核心要点、重点概念和关键结论。以结构化的方式呈现。\n\n${content}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setNotes(data.choices[0]?.message?.content || "无法生成笔记");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_notes}
      </h2>

      <button
        onClick={generateNotes}
        disabled={loading}
        className={`px-6 py-2.5 rounded-[10px] text-[14px] font-bold border-none cursor-pointer transition-colors mb-6 ${
          loading
            ? "bg-[#e0e0e0] text-[#000] cursor-not-allowed"
            : "bg-[#333] text-white hover:bg-[#555]"
        }`}
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {loading ? s.generating_notes : s.generate_notes}
      </button>

      {error && (
        <p className="text-[#C04040] text-[13px] mb-4" style={{ fontFamily: "var(--font-serif)" }}>
          {error}
        </p>
      )}

      {notes && (
        <div className="bg-[#fafafa] border border-[#eee] rounded-[12px] p-6 max-w-3xl">
          <div className="prose text-[14px] text-[#333] leading-relaxed"
            style={{ fontFamily: "var(--font-serif)" }}>
            {/* Render markdown notes */}
            {notes.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={i} />;
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={i} className="text-[18px] text-[#000] font-bold m-0 mt-6 mb-3"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {trimmed.slice(3)}
                  </h3>
                );
              }
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={i} className="text-[15px] text-[#333] font-bold m-0 mt-4 mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}>
                    {trimmed.slice(4)}
                  </h4>
                );
              }
              if (trimmed.startsWith("1. **") || trimmed.startsWith("2. **") || trimmed.startsWith("3. **") || trimmed.startsWith("4. **")) {
                const clean = trimmed.replace(/^\d+\.\s*\*\*/, "").replace(/\*\*/g, "");
                const [title, ...rest] = clean.split("—");
                return (
                  <p key={i} className="text-[14px] text-[#333] m-0 mb-2 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                    <strong>{title.trim()}</strong>{rest.length > 0 ? ` — ${rest.join("—")}` : ""}
                  </p>
                );
              }
              if (trimmed.startsWith("- ")) {
                return (
                  <p key={i} className="text-[14px] text-[#555] m-0 mb-1.5 ml-4 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                    · {trimmed.slice(2)}
                  </p>
                );
              }
              return (
                <p key={i} className="text-[14px] text-[#333] m-0 mb-2 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                  {trimmed}
                </p>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
