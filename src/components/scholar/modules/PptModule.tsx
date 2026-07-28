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
  const [previewMode, setPreviewMode] = useState(false);
  const [tool, setTool] = useState<ToolType>("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute canvas dimensions
  const getCanvasDims = useCallback(() => {
    const w = containerRef.current?.clientWidth || 800;
    const h = Math.max(600, w * 0.75);
    return { width: w, height: h };
  }, []);

  // Initialize / reinitialize fabric canvas when entering preview mode
  useEffect(() => {
    if (!previewMode || !canvasRef.current) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let fc: any = null;

    const initFabric = async () => {
      try {
        const fabricModule = await import("fabric");
        // fabric v7.4.0 uses named exports
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { Canvas, PencilBrush } = fabricModule as any;

        if (cancelled || !canvasRef.current) return;

        const { width, height } = getCanvasDims();

        fc = new Canvas(canvasRef.current, {
          isDrawingMode: tool === "pen",
          width,
          height,
          selection: true,
          backgroundColor: "transparent",
        });

        fabricCanvasRef.current = fc;

        if (tool === "pen") {
          fc.isDrawingMode = true;
          fc.freeDrawingBrush = new PencilBrush(fc);
          fc.freeDrawingBrush.color = color;
          fc.freeDrawingBrush.width = strokeWidth;
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
    // We intentionally re-init only when previewMode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  // Update drawing mode and brush when tool / color / strokeWidth changes
  useEffect(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    if (tool === "pen") {
      fc.isDrawingMode = true;
      fc.freeDrawingBrush.color = color;
      fc.freeDrawingBrush.width = strokeWidth;
    } else if (tool === "eraser") {
      fc.isDrawingMode = true;
      fc.freeDrawingBrush.color = "transparent";
      // Eraser is drawn as transparent "pen" strokes; really erasing objects happens
      // on click — for simplicity, the eraser works by setting the canvas background
      // color as the stroke, which visually mimics erasing on a white bg.
      // A proper eraser would use destination-out compositing, but we keep it
      // simple: we set the brush color to white (#fff) so it appears to erase
      // on the transparent canvas. Since the canvas is over a white page
      // background, this looks like erasing.
      if (fc.freeDrawingBrush) {
        fc.freeDrawingBrush.width = strokeWidth * 2;
      }
    } else {
      fc.isDrawingMode = false;
    }
  }, [tool, color, strokeWidth]);

  const clearAnnotations = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (fc) {
      fc.clear();
      fc.renderAll();
    }
  }, []);

  // Handle tool selection: pen/eraser just set the tool; shape tools place a shape immediately
  const handleToolClick = useCallback(
    (t: ToolType) => {
      setTool(t);
      if (t === "rect" || t === "circle" || t === "arrow") {
        // Use a microtask to let React batch the setTool + then addShape
        // We pass the shapes via dynamic import directly
        const fc = fabricCanvasRef.current;
        if (!fc) {
          // Canvas not ready yet — just set the tool
          return;
        }

        const { width, height } = getCanvasDims();
        const cx = width / 2;
        const cy = height / 2;

        const common = {
          left: cx - 75,
          top: cy - 60,
          stroke: color,
          strokeWidth,
          fill: "transparent",
          selectable: true,
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import("fabric").then((mod: any) => {
          const { Rect, Circle, Line } = mod;
          const fc = fabricCanvasRef.current;
          if (!fc) return;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let shape: any;
          switch (t) {
            case "rect":
              shape = new Rect({ ...common, width: 150, height: 100 });
              break;
            case "circle":
              shape = new Circle({ ...common, radius: 60, left: cx - 60, top: cy - 60 });
              break;
            case "arrow": {
              shape = new Line([50, 50, 200, 50], {
                ...common,
                left: cx - 100,
                top: cy,
              });
              break;
            }
          }

          if (shape && fabricCanvasRef.current) {
            fabricCanvasRef.current.add(shape);
            fabricCanvasRef.current.renderAll();
          }
        });
      }
    },
    [color, strokeWidth, getCanvasDims]
  );

  return (
    <div>
      <h2
        className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {s.tab_ppt}
      </h2>

      {/* Upload placeholder button */}
      <button
        onClick={() => alert(s.upload_coming_soon || "上传功能即将开放")}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        + {s.upload_ppt}（PDF, PPT, PPTX, HTML）
      </button>

      {pptFiles.length === 0 ? (
        <p
          className="text-[#999] text-[14px] py-8"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.no_ppt_files || "暂无课件，请上传"}
        </p>
      ) : (
        <div>
          {/* File list switcher */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {pptFiles.map((f) => (
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
                {/* Preview mode toggle */}
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                    previewMode
                      ? "bg-[#333] text-white border-[#333]"
                      : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {previewMode
                    ? s.annotation_exit || "退出标注"
                    : s.annotation_enter || "预览 + 标注"}
                </button>

                {previewMode && (
                  <>
                    <span className="text-[#ccc] select-none">|</span>

                    {/* Annotation tools */}
                    {(["pen", "rect", "circle", "arrow", "eraser"] as ToolType[]).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() =>
                            t === "pen" || t === "eraser"
                              ? setTool(t)
                              : handleToolClick(t)
                          }
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
                      )
                    )}

                    <span className="text-[#ccc] select-none">|</span>

                    {/* Color swatches */}
                    <span
                      className="text-[12px] text-[#999]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
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
                        title={c}
                      />
                    ))}

                    <span className="text-[#ccc] select-none">|</span>

                    {/* Stroke width */}
                    <span
                      className="text-[12px] text-[#999]"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
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

                    {/* Clear all */}
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

              {/* Content area */}
              <div
                ref={containerRef}
                className="relative"
                style={{ minHeight: 400 }}
              >
                {!previewMode ? (
                  <iframe
                    src={activeFile.src}
                    className="w-full h-[600px] border-none"
                    title={activeFile.title}
                  />
                ) : (
                  <div className="relative bg-[#fafafa]" style={{ minHeight: 600 }}>
                    <canvas ref={canvasRef} className="block border-none w-full" />
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
