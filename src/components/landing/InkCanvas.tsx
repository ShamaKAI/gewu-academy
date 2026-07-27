"use client";

import { useEffect } from "react";
import { useInkSystem } from "@/hooks/useInkSystem";
import { useInkContext } from "./InkProvider";

export default function InkCanvas() {
  const { canvasRef, onMove, triggerInk, render, rafRef } = useInkSystem();
  const inkCtx = useInkContext();

  useEffect(() => {
    if (inkCtx) {
      inkCtx.setCanvasRef(canvasRef);
      inkCtx.setTriggerInk(triggerInk);
    }
  }, [inkCtx, canvasRef, triggerInk]);

  useEffect(() => {
    let running = true;
    const loop = () => { if (!running) return; render(); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    const hv = () => { if (document.hidden) cancelAnimationFrame(rafRef.current); else rafRef.current = requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", hv);
    return () => { running = false; cancelAnimationFrame(rafRef.current); document.removeEventListener("visibilitychange", hv); };
  }, [render, rafRef]);

  useEffect(() => {
    const hm = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const hd = (e: MouseEvent) => triggerInk(e.clientX, e.clientY);
    window.addEventListener("mousemove", hm);
    window.addEventListener("mousedown", hd);
    return () => { window.removeEventListener("mousemove", hm); window.removeEventListener("mousedown", hd); };
  }, [onMove, triggerInk]);

  useEffect(() => {
    const tm = (e: TouchEvent) => { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY); };
    const ts = (e: TouchEvent) => { e.preventDefault(); const t = e.touches[0]; triggerInk(t.clientX, t.clientY); };
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchstart", ts, { passive: false });
    return () => { window.removeEventListener("touchmove", tm); window.removeEventListener("touchstart", ts); };
  }, [onMove, triggerInk]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }} />
  );
}
