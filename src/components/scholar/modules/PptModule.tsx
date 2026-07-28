"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PptFile } from "@/data/courses";

const COLORS = ["#000000", "#C04040", "#C5A46D", "#666666", "#3B82F6"];
const SIZES = [2, 3, 5];
type ToolType = "pen" | "rect" | "circle" | "arrow" | "eraser";

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
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fcRef = useRef<{ canvas: any; ready: boolean }>({ canvas: null, ready: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refs so fabric handlers always read latest values
  const toolRef = useRef(tool); toolRef.current = tool;
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

  /* ---- Fabric canvas init (always on when a file is active) ---- */
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
        isDrawingMode: false, width, height, selection: false, backgroundColor: "transparent",
      });
      fcRef.current = { canvas: fc, ready: true };

      let isDrawing = false;
      let drawStart: { x: number; y: number } | null = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let curShape: any = null;

      const getTool = () => toolRef.current;
      const getColor = () => colorRef.current;
      const getSW = () => strokeRef.current;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fc.on("mouse:down", (opt: any) => {
        const t = getTool();
        if (t === "pen" || t === "eraser") return;
        const p = fc.getPointer(opt.e);
        isDrawing = true; drawStart = { x: p.x, y: p.y };
        const common = { left: p.x, top: p.y, stroke: getColor(), strokeWidth: getSW(), fill: "transparent", selectable: false, evented: false };
        if (t === "rect") curShape = new fm.Rect({ ...common, width: 0, height: 0 });
        else if (t === "circle") curShape = new fm.Circle({ ...common, radius: 0 });
        else if (t === "arrow") curShape = new fm.Line([p.x, p.y, p.x, p.y], common);
        if (curShape) { fc.add(curShape); fc.renderAll(); }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fc.on("mouse:move", (opt: any) => {
        if (!isDrawing || !drawStart || !curShape) return;
        const p = fc.getPointer(opt.e); const st = drawStart;
        const t = getTool();
        if (t === "rect") curShape.set({ left: Math.min(st.x, p.x), top: Math.min(st.y, p.y), width: Math.abs(p.x-st.x), height: Math.abs(p.y-st.y) });
        else if (t === "circle") { const r = Math.sqrt((p.x-st.x)**2+(p.y-st.y)**2)/2; curShape.set({ left: st.x-r, top: st.y-r, radius: r }); }
        else if (t === "arrow") curShape.set({ x2: p.x, y2: p.y });
        fc.renderAll();
      });

      fc.on("mouse:up", () => {
        if (isDrawing && curShape) { curShape.set({ selectable: true, evented: true }); fc.renderAll(); }
        isDrawing = false; drawStart = null; curShape = null;
      });

      const t = getTool();
      if (t === "pen" || t === "eraser") {
        fc.isDrawingMode = true;
        fc.freeDrawingBrush = new PencilBrush(fc);
        fc.freeDrawingBrush.color = t === "eraser" ? "#ffffff" : getColor();
        fc.freeDrawingBrush.width = t === "eraser" ? getSW() * 3 : getSW();
      }
    });

    return () => { cancelled = true; if (fc) { fc.dispose(); fcRef.current = { canvas: null, ready: false }; } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFile?.id]);

  /* Update brush when tool/color/width changes */
  useEffect(() => {
    const { canvas: fc } = fcRef.current;
    if (!fc || !fcRef.current.ready) return;
    if (tool === "pen" || tool === "eraser") {
      fc.isDrawingMode = true; fc.selection = false;
      if (fc.freeDrawingBrush) { fc.freeDrawingBrush.color = tool === "eraser" ? "#ffffff" : color; fc.freeDrawingBrush.width = tool === "eraser" ? strokeWidth * 3 : strokeWidth; }
    } else { fc.isDrawingMode = false; fc.selection = false; }
  }, [tool, color, strokeWidth]);

  const clearAnnotations = () => {
    const { canvas: fc } = fcRef.current;
    if (fc) { fc.clear(); fc.renderAll(); }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.tab_ppt}</h2>

      <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.html,.htm" onChange={handleFileChange} className="hidden" />

      <button onClick={handleUpload} className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors" style={{ fontFamily: "var(--font-serif)", color: "#666", background: "#fafafa" }}>
        <MixedFont text={`+ ${s.upload_ppt}（PDF, PPT, PPTX, HTML）`} />
      </button>

      {allFiles.length === 0 ? (
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>暂无课件，请上传</p>
      ) : (
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {allFiles.map((f) => {
              const isUser = userFiles.some((uf) => uf.id === f.id);
              return (
                <div key={f.id} className="flex items-center gap-1">
                  <button onClick={() => setActiveFile(f)}
                    className={`px-4 py-2 rounded-[8px] text-[13px] border cursor-pointer transition-colors ${activeFile?.id === f.id ? "bg-[#333] text-white border-[#333]" : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                    style={{ fontFamily: "var(--font-serif)" }}><MixedFont text={f.title} /></button>
                  {isUser && <button onClick={() => deleteUserFile(f.id)} className="w-5 h-5 rounded-full bg-[#fee] text-[#C04040] text-[12px] border-none cursor-pointer hover:bg-[#fcc] flex items-center justify-center">×</button>}
                </div>
              );
            })}
          </div>

          {activeFile && (
            <div className="border border-[#eee] rounded-[12px] overflow-hidden">
              {/* Toolbar — always visible */}
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] border-b border-[#eee] flex-wrap">
                {(["pen","rect","circle","arrow","eraser"] as ToolType[]).map((t) => (
                  <button key={t} onClick={() => setTool(t)}
                    className={`px-2.5 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${tool===t ? "bg-[#e0e0e0] text-[#333] border-[#999]" : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                    style={{ fontFamily: "var(--font-serif)" }}>{s[`annotation_${t}`]}</button>
                ))}
                <span className="text-[#ccc]">|</span>
                <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_color}:</span>
                {COLORS.map((c) => <button key={c} onClick={() => setColor(c)} className="w-5 h-5 rounded-full border-2 cursor-pointer hover:scale-110" style={{ backgroundColor: c, borderColor: color===c?"#333":"#e0e0e0" }} />)}
                <span className="text-[#ccc]">|</span>
                <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_size}:</span>
                {SIZES.map((sz) => <button key={sz} onClick={() => setStrokeWidth(sz)}
                  className={`px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition-colors ${strokeWidth===sz?"bg-[#e0e0e0] text-[#333] border-[#999]":"bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                  style={{ fontFamily: "var(--font-display)" }}>{sz}px</button>)}
                <span className="text-[#ccc]">|</span>
                <button onClick={clearAnnotations} className="px-2.5 py-1.5 rounded-[6px] text-[12px] bg-[#fef2f2] text-[#C04040] border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_clear}</button>
              </div>

              {/* Content: document + canvas overlay */}
              <div ref={containerRef} className="relative" style={{ minHeight: 500 }}>
                <iframe src={activeFile.src} className="w-full h-[500px] border-none" title={activeFile.title} />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-auto z-10" style={{ opacity: 1 }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
