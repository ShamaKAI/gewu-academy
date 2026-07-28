"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { books } from "@/data/library";
// 10 shelves, derived from book data
const SHELVES = Array.from(new Set(books.map((b) => b.shelf)));
import type { Book, BookChapter } from "@/data/library";

const QUOTES = [
  "学而时习之，不亦乐乎",
  "知之真切笃实处，即是行",
  "温故而知新，可以为师矣",
  "知之为知之，不知为不知，是知也",
  "博学之，审问之，慎思之，明辨之，笃行之",
  "格物而后知至，知至而后意诚",
];

type View = "shelves" | "category" | "reader";

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
  const [view, setView] = useState<View>("shelves");
  const [search, setSearch] = useState("");
  const [activeShelf, setActiveShelf] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeChapter, setActiveChapter] = useState<BookChapter | null>(null);
  const [quote] = useState(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  // Group books by shelf
  const shelfBooks = useMemo(() => {
    const map = new Map<string, Book[]>();
    SHELVES.forEach((sh) => map.set(sh, books.filter((b) => b.shelf === sh)));
    return map;
  }, []);

  // Search filter
  const filteredShelfBooks = useMemo(() => {
    if (!search.trim()) return shelfBooks;
    const q = search.trim().toLowerCase();
    const result = new Map<string, Book[]>();
    SHELVES.forEach((sh) => {
      const filtered = books.filter((b) => b.shelf === sh && (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
      if (filtered.length > 0) result.set(sh, filtered);
    });
    return result;
  }, [search, shelfBooks]);

  // Category view — books in selected shelf
  const categoryBooks = activeShelf ? (books.filter((b) => b.shelf === activeShelf)) : [];

  // Restore reading position
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

  // Back navigation
  const goShelf = (shelf: string) => { setActiveShelf(shelf); setView("category"); };
  const goReader = (book: Book) => { setSelectedBook(book); setView("reader"); };
  const goCategory = () => { setSelectedBook(null); setView("category"); };
  const goShelves = () => { setActiveShelf(""); setSelectedBook(null); setView("shelves"); };

  return (
    <motion.div className="flex flex-col h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* ====== Top: Search bar (always visible) ====== */}
      <div className="flex-shrink-0 px-10 pt-8 pb-4 border-b border-[#eee]">
        <div className="flex items-center gap-4 mb-4">
          {view !== "shelves" && (
            <button onClick={view === "reader" ? goCategory : goShelves}
              className="text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70"
              style={{ fontFamily: "var(--font-serif)" }}>
              &larr; {view === "reader" ? "返回书架" : "返回书架"}
            </button>
          )}
          <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{s.nav_library}</h1>
        </div>
        {/* Daily quote + search */}
        <div className="flex items-center gap-4">
          <p className="flex-1 text-[14px] text-[#000] m-0 italic" style={{ fontFamily: "'KaiTi','STKaiti','楷体',serif" }}>
            &ldquo;{quote}&rdquo; &mdash; 每日一句
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); if (view !== "shelves") goShelves(); }}
            placeholder="搜索书名或作者..."
            className="w-[280px] px-4 py-2.5 rounded-[10px] border border-[#000] text-[14px] text-[#000] outline-none"
            style={{ fontFamily: "var(--font-serif)" }}
          />
        </div>
      </div>

      {/* ====== Content area ====== */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* ====== LEVEL 1: Shelves ====== */}
          {view === "shelves" && (
            <motion.div key="shelves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-10 py-6">
              {Array.from(filteredShelfBooks.entries()).map(([shelfName, shelfBks], idx) => (
                <motion.div key={shelfName} className="mb-8"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}>
                  {/* Shelf header */}
                  <button onClick={() => goShelf(shelfName)}
                    className="flex items-center gap-3 mb-3 bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity group">
                    <h2 className="text-[18px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{shelfName}</h2>
                    <span className="text-[13px] text-[#000] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-serif)" }}>
                      {shelfBks.length} 本 &rarr;
                    </span>
                  </button>
                  {/* Book covers row */}
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {shelfBks.map((bk) => (
                      <button key={bk.id} onClick={() => goReader(bk)}
                        className="flex-shrink-0 bg-transparent border-none cursor-pointer p-0 hover:scale-105 transition-transform">
                        <img src={bk.cover} alt={bk.title}
                          className="w-[80px] h-[115px] rounded-[4px] object-cover border border-[#ddd] shadow-sm" />
                        <p className="text-[10px] text-[#000] mt-1.5 m-0 truncate w-[80px] text-center font-bold" style={{ fontFamily: "var(--font-serif)" }}>{bk.title}</p>
                      </button>
                    ))}
                  </div>
                  {/* Shelf divider line */}
                  <div className="mt-3 h-[2px] bg-[#e0e0e0] rounded-full" />
                </motion.div>
              ))}
              {filteredShelfBooks.size === 0 && (
                <p className="text-center text-[#000] py-20 text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>未找到匹配的书籍</p>
              )}
            </motion.div>
          )}

          {/* ====== LEVEL 2: Category grid ====== */}
          {view === "category" && (
            <motion.div key="category" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-10 py-6">
              <h2 className="text-[22px] text-[#000] font-bold m-0 mb-6" style={{ fontFamily: "var(--font-serif)" }}>{activeShelf}</h2>
              <div className="grid grid-cols-4 gap-5">
                {categoryBooks.map((bk, i) => (
                  <motion.button key={bk.id} onClick={() => goReader(bk)}
                    className="bg-transparent border-none cursor-pointer p-0 text-left hover:scale-105 transition-transform"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <img src={bk.cover} alt={bk.title}
                      className="w-full aspect-[3/4] rounded-[6px] object-cover border border-[#ddd] shadow-sm mb-2" />
                    <p className="text-[14px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{bk.title}</p>
                    <p className="text-[12px] text-[#000] m-0 mt-0.5 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>{bk.author}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ====== LEVEL 3: Book reader ====== */}
          {view === "reader" && selectedBook && (
            <motion.div key="reader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1" style={{ height: "calc(100vh - 180px)" }}>
              {/* Chapter nav sidebar */}
              <div className="w-[180px] flex-shrink-0 border-r border-[#eee] bg-[#fafafa] p-5 overflow-y-auto">
                <img src={selectedBook.cover} alt={selectedBook.title}
                  className="w-full aspect-[3/4] rounded-[6px] object-cover border border-[#ddd] mb-4" />
                <h3 className="text-[15px] text-[#000] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{selectedBook.title}</h3>
                <p className="text-[11px] text-[#000] m-0 mb-5 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>{selectedBook.author}</p>
                <nav className="flex flex-col gap-0.5">
                  {selectedBook.chapters.map((ch) => (
                    <button key={ch.slug} onClick={() => selectChapter(ch)}
                      className={`text-left px-3 py-2 rounded-[6px] text-[13px] border-none cursor-pointer transition-colors ${activeChapter?.slug===ch.slug?"bg-[#e0e0e0] font-bold":"bg-transparent hover:bg-[#f0f0f0]"}`}
                      style={{ fontFamily: "var(--font-serif)", color: "#000" }}>{ch.title}</button>
                  ))}
                </nav>
              </div>
              {/* Content */}
              <div className="flex-1 px-10 py-8 overflow-y-auto">
                {activeChapter && (
                  <div className="max-w-2xl">
                    {renderContent(activeChapter.content)}
                    <div className="flex justify-between mt-10 pt-6 border-t border-[#eee]">
                      <button disabled={chIdx<=0} onClick={() => chIdx>0 && selectChapter(selectedBook.chapters[chIdx-1])}
                        className={`text-[14px] border border-[#000] rounded-[8px] px-5 py-2.5 cursor-pointer transition-colors ${chIdx<=0?"opacity-30 cursor-not-allowed":"hover:bg-[#f0f0f0]"} bg-transparent`}
                        style={{ fontFamily: "var(--font-serif)", color: "#000" }}>&larr; 上一章</button>
                      <button disabled={chIdx>=selectedBook.chapters.length-1} onClick={() => chIdx<selectedBook.chapters.length-1 && selectChapter(selectedBook.chapters[chIdx+1])}
                        className={`text-[14px] border border-[#000] rounded-[8px] px-5 py-2.5 cursor-pointer transition-colors ${chIdx>=selectedBook.chapters.length-1?"opacity-30 cursor-not-allowed":"hover:bg-[#f0f0f0]"} bg-transparent`}
                        style={{ fontFamily: "var(--font-serif)", color: "#000" }}>下一章 &rarr;</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
