"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * BrushArc — 一笔禅意
 *
 * 加载 chan.png，白底转透明，仅保留墨迹，缩放居中。
 */
export default function BrushArc() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);

  const processImage = useCallback((img: HTMLImageElement) => {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const tmp = document.createElement("canvas");
    tmp.width = iw;
    tmp.height = ih;
    const tctx = tmp.getContext("2d")!;
    tctx.drawImage(img, 0, 0);

    const imageData = tctx.getImageData(0, 0, iw, ih);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
      const brightness = (d[i] + d[i + 1] + d[i + 2]) / 3;
      if (brightness > 238) {
        d[i + 3] = 0;
      } else if (brightness > 160) {
        d[i + 3] = Math.round(((238 - brightness) / 78) * 0.55 * 255);
      }
    }
    tctx.putImageData(imageData, 0, 0);
    return tmp;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    canvas.width = vw * dpr;
    canvas.height = vh * dpr;
    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);

    const scale = (vh * 0.82 * 1.296) / mask.height;
    const dw = mask.width * scale;
    const dh = mask.height * scale;
    ctx.drawImage(mask, (vw - dw) / 2, (vh - dh) / 2, dw, dh);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "/chan.png";
    img.onload = () => {
      maskRef.current = processImage(img);
      render();
    };
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [render, processImage]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
