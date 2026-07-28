"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { PptFile } from "@/data/courses";

const COLORS = ["#000000", "#C04040", "#C5A46D", "#666666", "#3B82F6"];
const SIZES = [2, 3, 5];
type ToolType = "pen" | "rect" | "circle" | "arrow" | "eraser";

interface PptModuleProps {
  pptFiles: PptFile[];
  s: Record<string, string>;
}

export default function PptModule({ pptFiles, s }: PptModuleProps) {
  const [activeFile, setActiveFile] = useState<PptFile | null>(
    pptFiles.length > 0 ? pptFiles[0] : null
  );
  const [userFiles, setUserFiles] = useState<PptFile[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Drag-to-draw state
  const isDrawing = useRef(false);
  const drawStart = useRef<{ x: number; y: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentShape = useRef<any>(null);

  const allFiles = [...pptFiles, ...userFiles];

  /* ---- Upload ---- */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const type = ext === "pdf" ? "pdf" : ext === "html" ? "html" : ext === "ppt" ? "ppt" : ext === "pptx" ? "pptx" : "pdf";
      const newFile: PptFile = {
        id: `uploaded-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: file.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: type as any,
        src: url,
      };
      setUserFiles((prev) => [...prev, newFile]);
      setActiveFile(newFile);
      setPreviewMode(false);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---- Canvas helpers ---- */
  const getCanvasDims = useCallback(() => {
    const w = containerRef.current?.clientWidth || 800;
    const h = Math.max(600, w * 0.75);
    return { width: w, height: h };
  }, []);

  /* ---- Init fabric canvas ---- */
  useEffect(() => {
    if (!previewMode || !canvasRef.current) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fc: any = null;

    const initFabric = async () => {
      try {
        const fabricModule = await import("fabric");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Canvas, PencilBrush } = fabricModule as any;

        if (cancelled || !canvasRef.current) return;
        const { width, height } = getCanvasDims();

        fc = new Canvas(canvasRef.current, {
          isDrawingMode: false,
          width,
          height,
          selection: false,
          backgroundColor: "transparent",
        });

        fabricCanvasRef.current = fc;

        // ---- MOUSE EVENTS for drag-to-draw shapes ----
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fc.on("mouse:down", (opt: any) => {
          const pointer = fc.getPointer(opt.e);
          if (tool === "pen" || tool === "eraser") return; // handled by freeDrawing

          isDrawing.current = true;
          drawStart.current = { x: pointer.x, y: pointer.y };

          const common = {
            left: pointer.x,
            top: pointer.y,
            stroke: color,
            strokeWidth,
            fill: "transparent",
            selectable: false,
            evented: false,
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let shape: any = null;
          if (tool === "rect") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape = new (fabricModule as any).Rect({ ...common, width: 0, height: 0 });
          } else if (tool === "circle") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape = new (fabricModule as any).Circle({ ...common, radius: 0, left: pointer.x, top: pointer.y });
          } else if (tool === "arrow") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            shape = new (fabricModule as any).Line([pointer.x, pointer.y, pointer.x, pointer.y], common);
          }

          if (shape) {
            currentShape.current = shape;
            fc.add(shape);
            fc.renderAll();
          }
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fc.on("mouse:move", (opt: any) => {
          if (!isDrawing.current || !drawStart.current || !currentShape.current) return;

          const pointer = fc.getPointer(opt.e);
          const start = drawStart.current;
          const shape = currentShape.current;

          if (tool === "rect") {
            const left = Math.min(start.x, pointer.x);
            const top = Math.min(start.y, pointer.y);
            const w = Math.abs(pointer.x - start.x);
            const h = Math.abs(pointer.y - start.y);
            shape.set({ left, top, width: w, height: h });
          } else if (tool === "circle") {
            const dx = pointer.x - start.x;
            const dy = pointer.y - start.y;
            const r = Math.sqrt(dx * dx + dy * dy) / 2;
            shape.set({
              left: start.x - r,
              top: start.y - r,
              radius: r,
            });
          } else if (tool === "arrow") {
            shape.set({ x2: pointer.x, y2: pointer.y });
          }

          fc.renderAll();
        });

        fc.on("mouse:up", () => {
          if (isDrawing.current && currentShape.current) {
            currentShape.current.set({ selectable: true, evented: true });
            fc.renderAll();
          }
          isDrawing.current = false;
          drawStart.current = null;
          currentShape.current = null;
        });

        // ---- Tool init ----
        if (tool === "pen" || tool === "eraser") {
          fc.isDrawingMode = true;
          fc.freeDrawingBrush = new PencilBrush(fc);
          fc.freeDrawingBrush.color = tool === "eraser" ? "#ffffff" : color;
          fc.freeDrawingBrush.width = tool === "eraser" ? strokeWidth * 3 : strokeWidth;
        }
      } catch (err) {
        console.error("Failed to load fabric:", err);
      }
    };

    initFabric();

    return () => {
      cancelled = true;
      if (fc) {
        fc.dispose();
        fabricCanvasRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  /* ---- Update brush when tool/color/width changes ---- */
  useEffect(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    if (tool === "pen") {
      fc.isDrawingMode = true;
      fc.selection = false;
      if (fc.freeDrawingBrush) {
        fc.freeDrawingBrush.color = color;
        fc.freeDrawingBrush.width = strokeWidth;
      }
    } else if (tool === "eraser") {
      fc.isDrawingMode = true;
      fc.selection = false;
      if (fc.freeDrawingBrush) {
        fc.freeDrawingBrush.color = "#ffffff";
        fc.freeDrawingBrush.width = strokeWidth * 3;
      }
    } else {
      fc.isDrawingMode = false;
      fc.selection = false;
    }
  }, [tool, color, strokeWidth]);

  const clearAnnotations = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (fc) {
      fc.clear();
      fc.renderAll();
    }
  }, []);

  return (
    <div>
      <h2
        className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {s.tab_ppt}
      </h2>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.html,.htm,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/html"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload button */}
      <button
        onClick={handleUploadClick}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        + {s.upload_ppt}（支持 PDF, PPT, PPTX, HTML）
      </button>

      {allFiles.length === 0 ? (
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课件，请上传
        </p>
      ) : (
        <div>
          {/* File list */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {allFiles.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setActiveFile(f);
                  setPreviewMode(false);
                }}
                className={`px-4 py-2 rounded-[8px] text-[13px] border cursor-pointer transition-colors ${
                  activeFile?.id === f.id
                    ? "bg-[#333] text-white border-[#333]"
                    : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                }`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {f.title}
              </button>
            ))}
          </div>

          {/* Preview area */}
          {activeFile && (
            <div className="border border-[#eee] rounded-[12px] overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-3 p-3 bg-[#f7f7f7] border-b border-[#eee] flex-wrap">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                    previewMode
                      ? "bg-[#333] text-white border-[#333]"
                      : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {previewMode ? "退出标注" : "预览 + 标注"}
                </button>

                {previewMode && (
                  <>
                    <span className="text-[#ccc] select-none">|</span>

                    {(["pen", "rect", "circle", "arrow", "eraser"] as ToolType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTool(t)}
                        className={`px-2.5 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                          tool === t
                            ? "bg-[#e0e0e0] text-[#333] border-[#999]"
                            : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                        }`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {t === "pen"
                          ? s.annotation_pen
                          : t === "rect"
                          ? s.annotation_rect
                          : t === "circle"
                          ? s.annotation_circle
                          : t === "arrow"
                          ? s.annotation_arrow
                          : s.annotation_eraser}
                      </button>
                    ))}

                    <span className="text-[#ccc] select-none">|</span>

                    <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.annotation_color}:
                    </span>
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className="w-5 h-5 rounded-full border-2 cursor-pointer transition-transform hover:scale-110"
                        style={{
                          backgroundColor: c,
                          borderColor: color === c ? "#333" : "#e0e0e0",
                        }}
                      />
                    ))}

                    <span className="text-[#ccc] select-none">|</span>

                    <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
                      {s.annotation_size}:
                    </span>
                    {SIZES.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setStrokeWidth(sz)}
                        className={`px-2 py-1 rounded-[6px] text-[11px] border cursor-pointer transition-colors ${
                          strokeWidth === sz
                            ? "bg-[#e0e0e0] text-[#333] border-[#999]"
                            : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                        }`}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {sz}px
                      </button>
                    ))}

                    <span className="text-[#ccc] select-none">|</span>

                    <button
                      onClick={clearAnnotations}
                      className="px-2.5 py-1.5 rounded-[6px] text-[12px] bg-[#fef2f2] text-[#C04040] border border-[#fecaca] cursor-pointer hover:bg-[#fee2e2] transition-colors"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {s.annotation_clear}
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div ref={containerRef} className="relative" style={{ minHeight: 400 }}>
                {!previewMode ? (
                  <iframe
                    src={activeFile.src}
                    className="w-full h-[600px] border-none"
                    title={activeFile.title}
                  />
                ) : (
                  <div className="relative bg-white" style={{ minHeight: 600 }}>
                    <canvas ref={canvasRef} className="block border-none w-full" />
                    {/* Hint text */}
                    <p
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-[#999] pointer-events-none"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      {tool === "pen" || tool === "eraser"
                        ? "按住鼠标自由绘制"
                        : tool === "rect"
                        ? "拖拽绘制矩形"
                        : tool === "circle"
                        ? "拖拽绘制圆形"
                        : tool === "arrow"
                        ? "拖拽绘制箭头"
                        : ""}
                    </p>
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
