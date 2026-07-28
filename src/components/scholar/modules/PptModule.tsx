"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PptFile } from "@/data/courses";

const COLORS = ["#000000", "#C04040", "#C5A46D", "#666666", "#3B82F6"];
const SIZES = [2, 3, 5];
type ToolType = "pen" | "rect" | "circle" | "arrow" | "eraser";

interface PptModuleProps { pptFiles: PptFile[]; s: Record<string, string>; }

/* Chinese→KaiTi, EN/num→Times New Roman */
function MixedFont({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const segs: { text: string; isChinese: boolean }[] = [];
  let cur = ""; let curIs: boolean | null = null;
  for (const ch of text) {
    const is = /[一-鿿]/.test(ch);
    if (curIs === null) { curIs = is; cur = ch; }
    else if (is === curIs) { cur += ch; }
    else { segs.push({ text: cur, isChinese: curIs }); cur = ch; curIs = is; }
  }
  if (cur) segs.push({ text: cur, isChinese: curIs ?? false });
  return <span className={className} style={style}>{segs.map((seg, i) => <span key={i} style={{ fontFamily: seg.isChinese ? "'KaiTi','STKaiti','楷体',serif" : "'Times New Roman',serif" }}>{seg.text}</span>)}</span>;
}

export default function PptModule({ pptFiles, s }: PptModuleProps) {
  const [activeFile, setActiveFile] = useState<PptFile | null>(pptFiles.length > 0 ? pptFiles[0] : null);
  const [userFiles, setUserFiles] = useState<PptFile[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fcRef = useRef<ReturnType<typeof initFabricCanvas> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setUserFiles((p) => [...p, nf]); setActiveFile(nf); setPreviewMode(false);
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

  /* ---- Fabric init ---- */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function initFabricCanvas() { const fcObj = { canvas: null as any, isDrawing: false, drawStart: null as {x:number;y:number} | null, curShape: null as any }; return fcObj; }

  useEffect(() => {
    if (!previewMode || !canvasRef.current) return;
    let cancelled = false;
    const fcObj = initFabricCanvas();
    fcRef.current = fcObj;

    const init = async () => {
      try {
        const fm = await import("fabric");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Canvas, PencilBrush } = fm as any;
        if (cancelled || !canvasRef.current) return;
        const { width, height } = getDims();

        fcObj.canvas = new Canvas(canvasRef.current, { isDrawingMode: false, width, height, selection: false, backgroundColor: "transparent" });
        const fc = fcObj.canvas;

        // ---- mouse:down — start drag-to-draw ----
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fc.on("mouse:down", (opt: any) => {
          if (tool === "pen" || tool === "eraser") return;
          const p = fc.getPointer(opt.e);
          fcObj.isDrawing = true;
          fcObj.drawStart = { x: p.x, y: p.y };
          const common = { left: p.x, top: p.y, stroke: color, strokeWidth, fill: "transparent", selectable: false, evented: false };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let s: any = null;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (tool === "rect") s = new (fm as any).Rect({ ...common, width: 0, height: 0 });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          else if (tool === "circle") s = new (fm as any).Circle({ ...common, radius: 0 });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          else if (tool === "arrow") s = new (fm as any).Line([p.x, p.y, p.x, p.y], common);
          if (s) { fcObj.curShape = s; fc.add(s); fc.renderAll(); }
        });

        // ---- mouse:move — resize shape ----
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fc.on("mouse:move", (opt: any) => {
          if (!fcObj.isDrawing || !fcObj.drawStart || !fcObj.curShape) return;
          const p = fc.getPointer(opt.e);
          const st = fcObj.drawStart;
          if (tool === "rect") {
            fcObj.curShape.set({ left: Math.min(st.x, p.x), top: Math.min(st.y, p.y), width: Math.abs(p.x - st.x), height: Math.abs(p.y - st.y) });
          } else if (tool === "circle") {
            const r = Math.sqrt((p.x-st.x)**2 + (p.y-st.y)**2) / 2;
            fcObj.curShape.set({ left: st.x-r, top: st.y-r, radius: r });
          } else if (tool === "arrow") {
            fcObj.curShape.set({ x2: p.x, y2: p.y });
          }
          fc.renderAll();
        });

        // ---- mouse:up — finish ----
        fc.on("mouse:up", () => {
          if (fcObj.isDrawing && fcObj.curShape) { fcObj.curShape.set({ selectable: true, evented: true }); fc.renderAll(); }
          fcObj.isDrawing = false; fcObj.drawStart = null; fcObj.curShape = null;
        });

        // Tool init
        if (tool === "pen" || tool === "eraser") {
          fc.isDrawingMode = true;
          fc.freeDrawingBrush = new PencilBrush(fc);
          fc.freeDrawingBrush.color = tool === "eraser" ? "#ffffff" : color;
          fc.freeDrawingBrush.width = tool === "eraser" ? strokeWidth * 3 : strokeWidth;
        }
      } catch (err) { console.error("Fabric:", err); }
    };
    init();
    return () => { cancelled = true; if (fcObj.canvas) fcObj.canvas.dispose(); fcRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  // Update brush when tool/color/size change
  useEffect(() => {
    const fcObj = fcRef.current; if (!fcObj?.canvas) return;
    const fc = fcObj.canvas;
    if (tool === "pen" || tool === "eraser") {
      fc.isDrawingMode = true; fc.selection = false;
      if (fc.freeDrawingBrush) { fc.freeDrawingBrush.color = tool === "eraser" ? "#ffffff" : color; fc.freeDrawingBrush.width = tool === "eraser" ? strokeWidth * 3 : strokeWidth; }
    } else { fc.isDrawingMode = false; fc.selection = false; }
  }, [tool, color, strokeWidth]);

  const clearAll = () => { const fcObj = fcRef.current; if (fcObj?.canvas) { fcObj.canvas.clear(); fcObj.canvas.renderAll(); } };

  /* ---- Render ---- */
  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]" style={{ fontFamily: "var(--font-serif)" }}>{s.tab_ppt}</h2>
      <input ref={fileInputRef} type="file" accept=".pdf,.ppt,.pptx,.html,.htm,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/html" onChange={handleFileChange} className="hidden" />

      <button onClick={handleUpload} className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors">
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
                  <button onClick={() => { setActiveFile(f); setPreviewMode(false); }}
                    className={`px-4 py-2 rounded-[8px] text-[13px] border cursor-pointer transition-colors ${activeFile?.id === f.id ? "bg-[#333] text-white border-[#333]" : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                    style={{ fontFamily: "var(--font-serif)" }}>
                    <MixedFont text={f.title} />
                  </button>
                  {isUser && (
                    <button onClick={() => deleteUserFile(f.id)}
                      className="w-5 h-5 rounded-full bg-[#fee] text-[#C04040] text-[12px] border-none cursor-pointer hover:bg-[#fcc] flex items-center justify-center">×</button>
                  )}
                </div>
              );
            })}
          </div>

          {activeFile && (
            <div className="border border-[#eee] rounded-[12px] overflow-hidden">
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] border-b border-[#eee] flex-wrap">
                <button onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${previewMode ? "bg-[#333] text-white border-[#333]" : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                  style={{ fontFamily: "var(--font-serif)" }}>{previewMode ? "退出标注" : "预览 + 标注"}</button>
                {previewMode && (<>
                  <span className="text-[#ccc] select-none">|</span>
                  {(["pen","rect","circle","arrow","eraser"] as ToolType[]).map((t) => (
                    <button key={t} onClick={() => setTool(t)}
                      className={`px-2.5 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${tool===t?"bg-[#e0e0e0] text-[#333] border-[#999]":"bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                      style={{ fontFamily: "var(--font-serif)" }}>{s[`annotation_${t}`]}</button>
                  ))}
                  <span className="text-[#ccc]">|</span>
                  <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_color}:</span>
                  {COLORS.map((c) => <button key={c} onClick={() => setColor(c)} className="w-5 h-5 rounded-full border-2 cursor-pointer hover:scale-110 transition-transform" style={{ backgroundColor: c, borderColor: color===c?"#333":"#e0e0e0" }} />)}
                  <span className="text-[#ccc]">|</span>
                  <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_size}:</span>
                  {SIZES.map((sz) => <button key={sz} onClick={() => setStrokeWidth(sz)}
                    className={`px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition-colors ${strokeWidth===sz?"bg-[#e0e0e0] text-[#333] border-[#999]":"bg-white text-[#666] border-[#ccc] hover:border-[#666]"}`}
                    style={{ fontFamily: "var(--font-display)" }}>{sz}px</button>)}
                  <span className="text-[#ccc]">|</span>
                  <button onClick={clearAll} className="px-2.5 py-1.5 rounded-[6px] text-[12px] bg-[#fef2f2] text-[#C04040] border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2] transition-colors" style={{ fontFamily: "var(--font-serif)" }}>{s.annotation_clear}</button>
                </>)}
              </div>
              <div ref={containerRef} className="relative" style={{ minHeight: 400 }}>
                {!previewMode ? (
                  <iframe src={activeFile.src} className="w-full h-[600px] border-none" title={activeFile.title} />
                ) : (
                  <div className="relative bg-white" style={{ minHeight: 600 }}>
                    <canvas ref={canvasRef} className="block border-none w-full" />
                    <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-[#999] pointer-events-none" style={{ fontFamily: "var(--font-serif)" }}>
                      {tool==="pen"||tool==="eraser"?"按住鼠标自由绘制":tool==="rect"?"拖拽绘制矩形":tool==="circle"?"拖拽绘制圆形":"拖拽绘制箭头"}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
