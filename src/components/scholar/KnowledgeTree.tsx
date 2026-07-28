"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Line, Sphere, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — colorful nodes, particle effects, drag
   ============================================================ */

interface TreeNodeData {
  id: string; label: string; labelEn: string; labelMs: string;
  level: number; parentId: string | null; slug: string;
}

// Vibrant but elegant chapter colors
const CHAPTER_COLORS = [
  "#5B8C85", "#8B5E83", "#C4736E", "#6E8DC4",
  "#7BA05B", "#C49A3C", "#6FB3B8", "#B87C5B",
  "#8A9A5B", "#A05B8D",
];

// Softer pastel section colors
const SECTION_COLORS = [
  "#A8D8D0", "#D0B0CC", "#E8B8B4", "#A8C0E0",
  "#B8D4A0", "#E0C888", "#A0D0D4", "#D4B8A0",
  "#C0D0A0", "#CCA0C0",
];

function getBestLabel(n: TreeNodeData, locale: string): string {
  if (locale === "en" && n.labelEn) return n.labelEn;
  if (locale === "ms" && n.labelMs) return n.labelMs;
  return n.label;
}

function MixedFontLabel({ text }: { text: string }) {
  if (!text) return null;
  const segments: { text: string; isChinese: boolean }[] = [];
  let cur = ""; let curIs: boolean | null = null;
  for (const char of text) {
    const isCJK = /[一-鿿]/.test(char);
    if (curIs === null) { curIs = isCJK; cur = char; }
    else if (isCJK === curIs) cur += char;
    else { segments.push({ text: cur, isChinese: curIs }); cur = char; curIs = isCJK; }
  }
  if (cur) segments.push({ text: cur, isChinese: curIs ?? false });
  return (
    <span style={{ whiteSpace: "nowrap", textShadow: "0 0 6px rgba(255,255,255,0.9)" }}>
      {segments.map((seg, i) => (
        <span key={i} style={{ fontFamily: seg.isChinese ? "'KaiTi','STKaiti','楷体',serif" : "'Times New Roman',serif" }}>{seg.text}</span>
      ))}
    </span>
  );
}

/* ---- Floating particles background ---- */
function ParticleField() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pointsRef = useRef<any>(null);
  const count = 120;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
      // Warm golden / cream tones
      const hue = 0.08 + Math.random() * 0.1;
      const c = new THREE.Color().setHSL(hue, 0.3, 0.6 + Math.random() * 0.3);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.03;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors sizeAttenuation transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ---- Glow ring around a node ---- */
function GlowRing({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) {
  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.6, radius * 2.0, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

/* ---- Draggable Node ---- */
function DraggableNode({
  position: initialPos, radius, color, glowColor, label, isChapter, onClick, onHoverChange,
}: {
  position: [number, number, number]; radius: number; color: string; glowColor: string;
  label: string; isChapter: boolean; onClick: () => void; onHoverChange: (hovering: boolean) => void;
}) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false); const hasMoved = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const { gl } = useThree();
  const DRAG_THRESHOLD = 4;

  const prevInitial = useRef(initialPos);
  if (!dragging.current && (prevInitial.current[0] !== initialPos[0] || prevInitial.current[1] !== initialPos[1] || prevInitial.current[2] !== initialPos[2])) {
    prevInitial.current = initialPos; setPos(initialPos);
  }

  const handlePointerDown = useCallback((e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    e.stopPropagation(); dragging.current = false; hasMoved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY }; onHoverChange(true);
  }, [onHoverChange]);

  const handlePointerMove = useCallback((e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x; const dy = e.clientY - dragStart.current.y;
    if (Math.sqrt(dx*dx+dy*dy) > DRAG_THRESHOLD && !dragging.current) { dragging.current = true; hasMoved.current = true; (gl.domElement as HTMLElement).style.cursor = "grabbing"; }
    if (dragging.current) { e.stopPropagation(); const s = 0.015; setPos((p) => [p[0]+dx*s, p[1]-dy*s, p[2]]); dragStart.current = { x: e.clientX, y: e.clientY }; }
  }, [gl]);

  const handlePointerUp = useCallback(() => {
    if (!hasMoved.current) onClick();
    dragging.current = false; hasMoved.current = false; dragStart.current = null;
    (gl.domElement as HTMLElement).style.cursor = ""; onHoverChange(false);
  }, [onClick, onHoverChange, gl]);

  return (
    <group position={pos}>
      <GlowRing position={[0, 0, 0]} color={glowColor} radius={radius} />
      <Sphere args={[radius, 24, 24]} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}
        onPointerLeave={() => { if (dragging.current) { dragging.current = false; dragStart.current = null; (gl.domElement as HTMLElement).style.cursor = ""; } onHoverChange(false); }}>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </Sphere>
      {label && (
        <Html position={[0, -(isChapter ? 0.45 : 0.35), 0]} center style={{ pointerEvents: "none" }}>
          <span style={{ fontSize: isChapter ? "14px" : "12px", fontWeight: isChapter ? 700 : 400, color: "#222" }}>
            <MixedFontLabel text={label} />
          </span>
        </Html>
      )}
    </group>
  );
}

/* ---- Layout ---- */
function chapterPositions(chapters: TreeNodeData[]) {
  const m = new Map<string, [number, number, number]>();
  const radius = Math.max(chapters.length * 0.7, 2.2);
  chapters.forEach((n, i) => {
    const angle = (i / chapters.length) * Math.PI * 2 - Math.PI / 2;
    m.set(n.id, [Math.cos(angle) * radius, 1.0, Math.sin(angle) * radius]);
  });
  return m;
}

function sectionPositions(sections: TreeNodeData[], parentPos: [number, number, number], parentId: string) {
  const siblings = sections.filter((s) => s.parentId === parentId);
  const m = new Map<string, [number, number, number]>();
  const radius = Math.max(siblings.length * 0.35, 1.2);
  siblings.forEach((n, i) => {
    const angle = (i / siblings.length) * Math.PI * 2 - Math.PI / 2;
    m.set(n.id, [parentPos[0] + Math.cos(angle) * radius, parentPos[1] - 1.0, parentPos[2] + Math.sin(angle) * radius]);
  });
  return m;
}

function buildTree(chapters: Chapter[], sections: CourseSection[]): TreeNodeData[] {
  const r: TreeNodeData[] = [];
  chapters.forEach((ch) => r.push({ id: ch.slug, label: ch.title, labelEn: ch.titleEn||ch.title, labelMs: ch.titleMs||ch.title, level: 1, parentId: null, slug: ch.slug }));
  sections.forEach((sec) => r.push({ id: sec.slug, label: sec.title, labelEn: sec.titleEn||sec.title, labelMs: sec.titleMs||sec.title, level: 2, parentId: sec.chapterSlug, slug: sec.slug }));
  return r;
}

/* ---- Scene ---- */
function TreeScene({
  chapters, sections, locale, expanded, toggleChapter, onSectionClick, onAnyHover,
}: {
  chapters: TreeNodeData[]; sections: TreeNodeData[]; locale: string; expanded: Set<string>;
  toggleChapter: (slug: string) => void; onSectionClick: (slug: string) => void; onAnyHover: (hovering: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const chapPos = useMemo(() => chapterPositions(chapters), [chapters]);

  return (
    <group ref={groupRef}>
      <ParticleField />

      {/* Edges: center → chapters */}
      {chapters.map((ch) => {
        const pos = chapPos.get(ch.id)!;
        return <Line key={`er-${ch.id}`} points={[[0,3,0], pos]} color="#c0c0c0" lineWidth={0.4} transparent opacity={0.5} />;
      })}

      {/* Edges: chapters → sections */}
      {sections.filter((sec) => expanded.has(sec.parentId!)).map((sec) => {
        const pp = chapPos.get(sec.parentId!)!;
        const siblings = sections.filter((s) => s.parentId === sec.parentId && expanded.has(sec.parentId!));
        const sm = sectionPositions(siblings, pp, sec.parentId!);
        return <Line key={`es-${sec.id}`} points={[pp, sm.get(sec.id)!]} color="#d8d8d8" lineWidth={0.3} transparent opacity={0.4} />;
      })}

      {/* Center glow */}
      <Sphere args={[0.18, 24, 24]} position={[0,3,0]}><meshStandardMaterial color="#999" roughness={0.2} metalness={0.3} /></Sphere>

      {/* Chapter nodes */}
      {chapters.map((ch, i) => {
        const label = getBestLabel(ch, locale);
        return (
          <DraggableNode key={ch.id} position={chapPos.get(ch.id)!} radius={0.22}
            color={CHAPTER_COLORS[i % CHAPTER_COLORS.length]} glowColor={CHAPTER_COLORS[i % CHAPTER_COLORS.length]}
            label={label} isChapter onClick={() => toggleChapter(ch.slug)} onHoverChange={onAnyHover} />
        );
      })}

      {/* Section nodes */}
      {sections.filter((sec) => expanded.has(sec.parentId!)).map((sec, i) => {
        const pp = chapPos.get(sec.parentId!)!;
        const siblings = sections.filter((s) => s.parentId === sec.parentId && expanded.has(sec.parentId!));
        const sm = sectionPositions(siblings, pp, sec.parentId!);
        const label = getBestLabel(sec, locale);
        return (
          <DraggableNode key={sec.id} position={sm.get(sec.id)!} radius={0.12}
            color={SECTION_COLORS[i % SECTION_COLORS.length]} glowColor={SECTION_COLORS[i % SECTION_COLORS.length]}
            label={label} isChapter={false} onClick={() => onSectionClick(sec.slug)} onHoverChange={onAnyHover} />
        );
      })}
    </group>
  );
}

/* ---- Export ---- */
interface KnowledgeTreeProps { chapters: Chapter[]; sections: CourseSection[]; locale: string; onNodeClick: (slug: string) => void; }

export default function KnowledgeTree({ chapters, sections, locale, onNodeClick }: KnowledgeTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [nodeHovered, setNodeHovered] = useState(false);
  const allNodes = useMemo(() => buildTree(chapters, sections), [chapters, sections]);
  const chapNodes = useMemo(() => allNodes.filter((n) => n.level === 1), [allNodes]);
  const secNodes = useMemo(() => allNodes.filter((n) => n.level === 2), [allNodes]);

  const toggleChapter = useCallback((slug: string) => setExpanded((p) => { const n = new Set(p); n.has(slug) ? n.delete(slug) : n.add(slug); return n; }), []);

  if (chapters.length === 0) {
    const el = locale==="en"?"No knowledge tree":locale==="ms"?"Tiada pohon ilmu":"暂无知识图谱";
    return <div className="flex items-center justify-center h-full text-[#000] text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>{el}</div>;
  }

  return (
    <Canvas camera={{ position: [0, 0.5, 8], fov: 55 }} style={{ background: "transparent" }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={1.0} />
      <directionalLight position={[5, 8, 5]} intensity={0.7} />
      <directionalLight position={[-5, 2, -3]} intensity={0.3} />
      <OrbitControls enableDamping dampingFactor={0.08} enableZoom autoRotate={false} minDistance={3} maxDistance={15} enabled={!nodeHovered} />
      <TreeScene chapters={chapNodes} sections={secNodes} locale={locale} expanded={expanded}
        toggleChapter={toggleChapter} onSectionClick={onNodeClick} onAnyHover={setNodeHovered} />
    </Canvas>
  );
}
