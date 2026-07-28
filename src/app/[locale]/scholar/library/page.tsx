"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { books, BOOK_CATEGORIES } from "@/data/library";
import type { Book, BookChapter } from "@/data/library";

const QUOTES = [
  "学而时习之，不亦乐乎",
  "知之真切笃实处，即是行",
  "温故而知新，可以为师矣",
  "知之为知之，不知为不知，是知也",
  "博学之，审问之，慎思之，明辨之，笃行之",
  "格物而后知至，知至而后意诚",
];

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    if (line.startsWith("# ")) return <h2 key={i} className="text-[20px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>{line.slice(2)}</h2>;
    return <p key={i} className="text-[15px] text-[#000] leading-relaxed m-0 mb-4" style={{ fontFamily: "var(--font-serif)", textIndent: "2em" }}>{line}</p>;
  });
}

export default function LibraryPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeChapter, setActiveChapter] = useState<BookChapter | null>(null);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const filtered = useMemo(() => {
    let result = filter === "all" ? books : books.filter((b) => b.category === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return result;
  }, [filter, search]);

  useEffect(() => {
    if (!selectedBook) return;
    const saved = localStorage.getItem(`lib-${selectedBook.id}`);
    const ch = saved ? selectedBook.chapters.find((c) => c.slug === saved) : null;
    setActiveChapter(ch || selectedBook.chapters[0]);
  }, [selectedBook]);

  const selectChapter = (ch: BookChapter) => {
    setActiveChapter(ch);
    if (selectedBook) localStorage.setItem(`lib-${selectedBook.id}`, ch.slug);
  };

  const chIdx = selectedBook?.chapters.findIndex((c) => c.slug === activeChapter?.slug) ?? -1;

  return (
    <motion.div className="flex h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Left panel */}
      <div className="w-[200px] flex-shrink-0 border-r border-[#000] bg-[#fafafa] flex flex-col">
        <div className="px-5 py-6 border-b border-[#eee]">
          <p className="text-[16px] text-[#000] leading-relaxed m-0 italic" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
            &ldquo;{quote}&rdquo;
          </p>
          <p className="text-[10px] text-[#000] mt-1" style={{ fontFamily: "var(--font-serif)" }}>&mdash; 每日一句</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-[#eee]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索书名或作者..."
            className="w-full px-3 py-2 rounded-[8px] border border-[#ccc] text-[12px] text-[#000] outline-none focus:border-[#000]"
            style={{ fontFamily: "var(--font-serif)" }}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 px-5 py-3 border-b border-[#eee]">
          <button onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold border cursor-pointer transition-colors ${filter==="all"?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000]"}`}
            style={{ fontFamily: "var(--font-serif)" }}>全部</button>
          {Object.entries(BOOK_CATEGORIES).map(([k, v]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-2.5 py-1 rounded-[5px] text-[10px] font-bold border cursor-pointer transition-colors ${filter===k?"bg-[#000] text-white border-[#000]":"bg-white text-[#000] border-[#000]"}`}
              style={{ fontFamily: "var(--font-serif)" }}>{v}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map((bk) => (
            <button key={bk.id} onClick={() => { setSelectedBook(bk); setActiveChapter(null); }}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left border-b border-[#eee] cursor-pointer transition-colors ${selectedBook?.id===bk.id?"bg-[#e8e8e8]":"bg-transparent hover:bg-[#f0f0f0]"}`}>
              <img src={bk.cover} alt={bk.title} className="w-[34px] h-[48px] rounded-[3px] object-cover border border-[#ddd] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[12px] text-[#000] font-bold m-0 truncate leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{bk.title}</p>
                <p className="text-[10px] text-[#000] m-0 opacity-70 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{bk.author}</p>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-[11px] text-[#000] px-5 py-5 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>未找到匹配的书籍</p>
          )}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 overflow-y-auto flex">
        {!selectedBook ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#000] text-[16px]" style={{ fontFamily: "var(--font-serif)" }}>&larr; 从左侧选择一本书开始阅读</p>
          </div>
        ) : (
          <>
            <div className="w-[180px] flex-shrink-0 border-r border-[#eee] bg-[#fafafa] p-5 overflow-y-auto">
              <h3 className="text-[18px] text-[#000] font-bold m-0 mb-4" style={{ fontFamily: "var(--font-serif)" }}>{selectedBook.title}</h3>
              <p className="text-[11px] text-[#000] m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>{selectedBook.author}</p>
              <nav className="flex flex-col gap-0.5">
                {selectedBook.chapters.map((ch) => (
                  <button key={ch.slug} onClick={() => selectChapter(ch)}
                    className={`text-left px-3 py-2 rounded-[6px] text-[13px] border-none cursor-pointer transition-colors ${activeChapter?.slug===ch.slug?"bg-[#e0e0e0] font-bold":"bg-transparent hover:bg-[#f0f0f0]"}`}
                    style={{ fontFamily: "var(--font-serif)", color: "#000" }}>{ch.title}</button>
                ))}
              </nav>
            </div>
            <div className="flex-1 px-10 py-8 overflow-y-auto">
              {activeChapter && (
                <div className="max-w-2xl">
                  {renderContent(activeChapter.content)}
                  <div className="flex justify-between mt-10 pt-6 border-t border-[#eee]">
                    <button disabled={chIdx<=0} onClick={() => chIdx>0 && selectChapter(selectedBook.chapters[chIdx-1])}
                      className={`text-[13px] border border-[#000] rounded-[8px] px-4 py-2 cursor-pointer transition-colors ${chIdx<=0?"opacity-30 cursor-not-allowed":"hover:bg-[#f0f0f0]"} bg-transparent`}
                      style={{ fontFamily: "var(--font-serif)", color: "#000" }}>&larr; 上一章</button>
                    <button disabled={chIdx>=selectedBook.chapters.length-1} onClick={() => chIdx<selectedBook.chapters.length-1 && selectChapter(selectedBook.chapters[chIdx+1])}
                      className={`text-[13px] border border-[#000] rounded-[8px] px-4 py-2 cursor-pointer transition-colors ${chIdx>=selectedBook.chapters.length-1?"opacity-30 cursor-not-allowed":"hover:bg-[#f0f0f0]"} bg-transparent`}
                      style={{ fontFamily: "var(--font-serif)", color: "#000" }}>下一章 &rarr;</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
