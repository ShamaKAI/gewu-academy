"use client";

import { useRef, useCallback } from "react";
import { rand } from "@/lib/math";

interface Ripple {
  x: number; y: number;
  radius: number; opacity: number;
  speed: number; born: number; lifetime: number;
  currentOpacity?: number;
}

interface InkDrop {
  x: number; y: number;
  radius: number; opacity: number;
  speed: number; born: number; lifetime: number;
  rings: number; currentOpacity?: number;
}

export function useInkSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const dropsRef = useRef<InkDrop[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0, dist: 0 });
  const rafRef = useRef<number>(0);

  const onMove = useCallback((x: number, y: number) => {
    const last = lastPosRef.current;
    const dx = x - last.x;
    const dy = y - last.y;
    last.dist += Math.sqrt(dx * dx + dy * dy);
    last.x = x; last.y = y;
    if (last.dist > 18) {
      last.dist = 0;
      ripplesRef.current.push({
        x, y, radius: 1,
        opacity: rand(0.2, 0.35),
        speed: rand(0.6, 1.2),
        born: performance.now(),
        lifetime: rand(1200, 1800),
      });
    }
  }, []);

  const triggerInk = useCallback((x: number, y: number) => {
    const now = performance.now();
    dropsRef.current.push({
      x, y, radius: 3,
      opacity: rand(0.45, 0.65),
      speed: rand(1.0, 1.8),
      born: now, lifetime: rand(1500, 2000), rings: 3,
    });
    const count = Math.floor(rand(5, 10));
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2);
      const dist = rand(15, 60);
      dropsRef.current.push({
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        radius: 1, opacity: rand(0.25, 0.5),
        speed: rand(0.4, 0.9),
        born: now, lifetime: rand(800, 1500), rings: 1,
      });
    }
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        ripplesRef.current.push({
          x, y, radius: 8 + i * 12,
          opacity: rand(0.12, 0.2),
          speed: rand(1.2, 2.0),
          born: performance.now(),
          lifetime: rand(1400, 1900),
        });
      }, i * 60);
    }
  }, []);

  const DPR = 2;
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = window.innerWidth, h = window.innerHeight;
    const now = performance.now();

    if (canvas.width !== w * DPR || canvas.height !== h * DPR) {
      canvas.width = w * DPR; canvas.height = h * DPR;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    ctx.clearRect(0, 0, w, h);

    const ripples = ripplesRef.current;
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      const age = now - r.born;
      if (age >= r.lifetime) { ripples.splice(i, 1); continue; }
      const progress = age / r.lifetime;
      r.radius += r.speed * (1 - progress * 0.6);
      r.currentOpacity = r.opacity * (1 - progress);
    }

    const drops = dropsRef.current;
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i];
      const age = now - d.born;
      if (age >= d.lifetime) { drops.splice(i, 1); continue; }
      const progress = age / d.lifetime;
      d.radius += d.speed * (1 - progress * 0.7);
      d.currentOpacity = d.opacity * (1 - progress);
    }

    drops.forEach(d => {
      if (d.rings > 1) return;
      const alpha = d.currentOpacity ?? d.opacity;
      const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius);
      grad.addColorStop(0, `rgba(10,10,10,${alpha * 0.7})`);
      grad.addColorStop(0.5, `rgba(20,20,20,${alpha * 0.3})`);
      grad.addColorStop(1, "rgba(30,30,30,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2); ctx.fill();
    });

    drops.forEach(d => {
      if (d.rings <= 1) return;
      const alpha = d.currentOpacity ?? d.opacity;
      const og = ctx.createRadialGradient(d.x, d.y, d.radius * 0.25, d.x, d.y, d.radius);
      og.addColorStop(0, `rgba(10,10,10,${alpha * 0.25})`);
      og.addColorStop(0.6, `rgba(20,20,20,${alpha * 0.1})`);
      og.addColorStop(1, "rgba(30,30,30,0)");
      ctx.fillStyle = og; ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2); ctx.fill();
      const mg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 0.55);
      mg.addColorStop(0, `rgba(10,10,10,${alpha * 0.6})`);
      mg.addColorStop(0.5, `rgba(15,15,15,${alpha * 0.35})`);
      mg.addColorStop(1, "rgba(25,25,25,0)");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(d.x, d.y, d.radius * 0.55, 0, Math.PI * 2); ctx.fill();
      const cg = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.radius * 0.2);
      cg.addColorStop(0, `rgba(5,5,5,${alpha * 0.85})`);
      cg.addColorStop(1, `rgba(15,15,15,${alpha * 0.2})`);
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(d.x, d.y, d.radius * 0.2, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < d.rings; i++) {
        const rr = d.radius * (0.35 + i * 0.22);
        ctx.strokeStyle = `rgba(10,10,10,${alpha * 0.25 * (1 - i * 0.3)})`;
        ctx.lineWidth = 0.8 + i * 0.4;
        ctx.beginPath(); ctx.arc(d.x, d.y, rr, 0, Math.PI * 2); ctx.stroke();
      }
    });

    ripples.forEach(r => {
      const alpha = r.currentOpacity ?? r.opacity;
      ctx.strokeStyle = `rgba(10,10,10,${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2); ctx.stroke();
      if (r.radius > 6) {
        ctx.strokeStyle = `rgba(20,20,20,${alpha * 0.35})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.arc(r.x, r.y, r.radius * 0.65, 0, Math.PI * 2); ctx.stroke();
      }
      const hg = ctx.createRadialGradient(r.x, r.y, r.radius * 0.75, r.x, r.y, r.radius * 1.25);
      hg.addColorStop(0, `rgba(15,15,15,${alpha * 0.2})`);
      hg.addColorStop(1, "rgba(25,25,25,0)");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(r.x, r.y, r.radius * 1.25, 0, Math.PI * 2); ctx.fill();
    });
  }, []);

  return { canvasRef, onMove, triggerInk, render, rafRef };
}
