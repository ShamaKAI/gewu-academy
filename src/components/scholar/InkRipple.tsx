"use client";

import { useEffect, useRef, useCallback } from "react";

/** 点击水墨涟漪 — Canvas 覆盖层，2秒内完全消失 */
export default function InkRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Array<{ x: number; y: number; r: number; o: number; born: number; maxR: number; life: number }>>([]);
  const rafRef = useRef(0);

  const DPR = 2;
  const MAX_LIFE = 2000;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const now = performance.now();

    if (canvas.width !== vw * DPR || canvas.height !== vh * DPR) {
      canvas.width = vw * DPR; canvas.height = vh * DPR;
      canvas.style.width = vw + "px"; canvas.style.height = vh + "px";
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    ctx.clearRect(0, 0, vw, vh);

    const ripples = ripplesRef.current;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      const age = now - rp.born;
      if (age >= rp.life) { ripples.splice(i, 1); continue; }
      const progress = age / rp.life;
      rp.r += (rp.maxR - rp.r) * 0.08;
      const alpha = rp.o * (1 - progress);

      // 外环
      ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.stroke();
      // 内环淡影
      if (rp.r > 8) {
        ctx.strokeStyle = `rgba(0,0,0,${alpha * 0.4})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }, []);

  useEffect(() => {
    let running = true;
    const loop = () => { if (!running) return; render(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      ripplesRef.current.push({
        x: e.clientX, y: e.clientY, r: 4, o: 0.35, born: now, maxR: 60 + Math.random() * 40, life: MAX_LIFE,
      });
    };
    window.addEventListener("click", onClick);
    return () => { running = false; cancelAnimationFrame(rafRef.current); window.removeEventListener("click", onClick); };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
}
