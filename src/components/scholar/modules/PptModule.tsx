"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PptFile } from "@/data/courses";

const COLORS = ["#000000", "#C04040", "#C5A46D", "#666666", "#3B82F6"];
const SIZES = [2, 3, 5];

interface PptModuleProps { pptFiles: PptFile[]; s: Record<string, string>; }

function MixedFont({ text, style }: { text: string; style?: React.CSSProperties }) {
  const segs: { text: string; isChinese: boolean }[] = [];
  let cur = ""; let curIs: boolean | null = null;
  for (const ch of text) {
    const is = /[一-鿿]/.test(ch);
    if (curIs === null) { curIs = is; cur = ch; }
    else if (is === curIs) { cur += ch; }
    else { segs.push({ text: cur, isChinese: curIs }); cur = ch; curIs = is; }
  }
  if (cur) segs.push({ text: cur, isChinese: curIs ?? false });
  return <span style={style}>{segs.map((seg, i) => <span key={i} style={{ fontFamily: seg.isChinese ? "'KaiTi','STKaiti','楷体',serif" : "'Times New Roman',serif" }}>{seg.text}</span>)}</span>;
}

export default function PptModule({ pptFiles, s }: PptModuleProps) {
  const [activeFile, setActiveFile] = useState<PptFile | null>(pptFiles.length > 0 ? pptFiles[0] : null);
  const [userFiles, setUserFiles] = useState<PptFile[]>([]);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fcRef = useRef<{ canvas: any; ready: boolean }>({ canvas: null, ready: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colorRef = useRef(color); colorRef.current = color;
  const strokeRef = useRef(strokeWidth); strokeRef.current = strokeWidth;

  const allFiles = [...pptFiles, ...userFiles];

  const getDims = useCallback(() => {
    const w = containerRef.current?.clientWidth || 800;
    return { width: w, height: Math.max(600, w * 0.75) };
  }, []);

  /* ---- Upload ---- */
  const handleUpload = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files?.length) return;
    Array.from(files).forEach((f) => {
      const url = URL.createObjectURL(f);
      const ext = f.name.split(".").pop()?.toLowerCase() || "pdf";
      const type = (["pdf","html","ppt","pptx"].includes(ext) ? ext : "pdf") as PptFile["type"];
      const nf: PptFile = { id: `up-${Date.now()}-${Math.random().toString(36).slice(2,6)}`, title: f.name, type, src: url };
      setUserFiles((p) => [...p, nf]); setActiveFile(nf);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const deleteUserFile = (id: string) => {
    setUserFiles((p) => {
      const next = p.filter((x) => x.id !== id);
      if (activeFile?.id === id) setActiveFile(next.length > 0 ? next[next.length-1] : (pptFiles.length > 0 ? pptFiles[0] : null));
      return next;
    });
    const f = userFiles.find((x) => x.id === id);
    if (f) URL.revokeObjectURL(f.src);
  };

  /* ---- Fabric canvas init — pen only (free drawing) ---- */
  useEffect(() => {
    if (!canvasRef.current || !activeFile || fcRef.current.ready) return;
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fc: any = null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    import("fabric").then((fm: any) => {
      if (cancelled || !canvasRef.current) return;
      const { Canvas, PencilBrush } = fm;
      const { width, height } = getDims();

      fc = new Canvas(canvasRef.current, {
        isDrawingMode: true, width, height, selection: false, backgroundColor: "transparent",
      });
      fc.freeDrawingBrush = new PencilBrush(fc);
      fc.freeDrawingBrush.color = colorRef.current;
      fc.freeDrawingBrush.width = strokeRef.current;

      fcRef.current = { canvas: fc, ready: true };
    });

    return () => { cancelled = true; if (fc) { fc.dispose(); fcRef.current = { canvas: null, ready: false }; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile?.id]);

  /* Update brush color/width */
  useEffect(() => {
    const { canvas: fc } = fcRef.current;
    if (!fc || !fcRef.current.ready) return;
    fc.isDrawingMode = true;
    if (fc.freeDrawingBrush) {
      fc.freeDrawingBrush.color = color;
      fc.freeDrawingBrush.width = strokeWidth;
    }
  }, [color, strokeWidth]);

  const clearAnnotations = () => {
    const { canvas: fc } = fcRef.current;
    if (fc) { fc.clear(); fc.renderAll(); }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.tab_ppt}</h2>

      <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.html,.htm" onChange={handleFileChange} className="hidden" />

      <button onClick={handleUpload} className="mb-5 px-5 py-2.5 border border-dashed border-[#000] rounded-[10px] text-[13px] cursor-pointer hover:border-[#000] hover:bg-[#f0f0f0] transition-colors" style={{ fontFamily: "var(--font-serif)", color: "#000", background: "#fafafa" }}>
        <MixedFont text={`+ ${s.upload_ppt}（PDF, PPT, PPTX, HTML）`} />
      </button>

      {allFiles.length === 0 ? (
        <p className="text-[#000] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>暂无课件，请上传</p>
      ) : (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {allFiles.map((f) => {
              const isUser = userFiles.some((uf) => uf.id === f.id);
              return (
                <div key={f.id} className="flex items-center gap-1">
                  <button onClick={() => setActiveFile(f)}
                    className={`px-4 py-2 rounded-[8px] text-[13px] border cursor-pointer transition-colors ${activeFile?.id === f.id ? "bg-[#000] text-white border-[#000]" : "bg-white text-[#000] border-[#000] hover:bg-[#f0f0f0]"}`}
                    style={{ fontFamily: "var(--font-serif)" }}><MixedFont text={f.title} /></button>
                  {isUser && <button onClick={() => deleteUserFile(f.id)} className="w-5 h-5 rounded-full bg-[#fee] text-[#C04040] text-[12px] border-none cursor-pointer hover:bg-[#fcc] flex items-center justify-center">×</button>}
                </div>
              );
            })}
          </div>

          {activeFile && (
            <div className="border border-[#000] rounded-[12px] overflow-hidden">
              {/* Toolbar — pen colors + sizes + clear */}
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] border-b border-[#000] flex-wrap">
                <span className="text-[12px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>画笔</span>
                <span className="text-[#ccc]">|</span>
                <span className="text-[11px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_color}:</span>
                {COLORS.map((c) => <button key={c} onClick={() => setColor(c)} className="w-5 h-5 rounded-full border-2 cursor-pointer hover:scale-110" style={{ backgroundColor: c, borderColor: color===c?"#000":"#e0e0e0" }} />)}
                <span className="text-[#ccc]">|</span>
                <span className="text-[11px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_size}:</span>
                {SIZES.map((sz) => <button key={sz} onClick={() => setStrokeWidth(sz)}
                  className={`px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition-colors ${strokeWidth===sz?"bg-[#e0e0e0] text-[#000] border-[#000]":"bg-white text-[#000] border-[#ccc] hover:border-[#000]"}`}
                  style={{ fontFamily: "var(--font-display)" }}>{sz}px</button>)}
                <span className="text-[#ccc]">|</span>
                <button onClick={clearAnnotations} className="px-2.5 py-1.5 rounded-[6px] text-[12px] bg-[#fef2f2] text-[#C04040] border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2] transition-colors" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_clear}</button>
              </div>

              {/* Document + canvas overlay */}
              <div ref={containerRef} className="relative" style={{ minHeight: 500 }}>
                <iframe src={activeFile.src} className="w-full h-[500px] border-none" title={activeFile.title} />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-auto z-10" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
