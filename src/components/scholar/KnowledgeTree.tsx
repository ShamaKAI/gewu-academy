"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Line, Sphere, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — Click to expand, drag to move
   - R3F onClick for clicks (auto-detects click vs drag)
   - Manual drag via pointer events when dragging
   - OrbitControls disabled when hovering a node
   - Full text, no ellipsis, KaiTi + Times New Roman
   ============================================================ */

interface TreeNodeData {
  id: string;
  label: string;
  labelEn: string;
  labelMs: string;
  level: number;
  parentId: string | null;
  slug: string;
}

function getBestLabel(n: TreeNodeData, locale: string): string {
  if (locale === "en" && n.labelEn) return n.labelEn;
  if (locale === "ms" && n.labelMs) return n.labelMs;
  return n.label;
}

/** Detect if a string contains any Chinese character (used by MixedFontLabel) */
function MixedFontLabel({ text }: { text: string }) {
  if (!text) return null;
  const segments: { text: string; isChinese: boolean }[] = [];
  let current = "";
  let currentIsChinese: boolean | null = null;

  for (const char of text) {
    const isCJK = /[一-鿿]/.test(char);
    if (currentIsChinese === null) {
      currentIsChinese = isCJK;
      current = char;
    } else if (isCJK === currentIsChinese) {
      current += char;
    } else {
      segments.push({ text: current, isChinese: currentIsChinese });
      current = char;
      currentIsChinese = isCJK;
    }
  }
  if (current) {
    segments.push({ text: current, isChinese: currentIsChinese ?? false });
  }

  return (
    <span style={{ whiteSpace: "nowrap", textShadow: "0 0 4px rgba(255,255,255,0.95)" }}>
      {segments.map((seg, i) => (
        <span
          key={i}
          style={{
            fontFamily: seg.isChinese
              ? "'KaiTi', 'STKaiti', '楷体', serif"
              : "'Times New Roman', serif",
          }}
        >
          {seg.text}
        </span>
      ))}
    </span>
  );
}

/* ---- Draggable Node ---- */
function DraggableNode({
  position: initialPos,
  radius,
  color,
  label,
  isChapter,
  onClick,
  onHoverChange,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  label: string;
  isChapter: boolean;
  onClick: () => void;
  onHoverChange: (hovering: boolean) => void;
}) {
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const hasMoved = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const { gl } = useThree();

  // Sync when initialPos changes from outside
  const prevInitial = useRef(initialPos);
  if (
    !dragging.current &&
    (prevInitial.current[0] !== initialPos[0] ||
      prevInitial.current[1] !== initialPos[1] ||
      prevInitial.current[2] !== initialPos[2])
  ) {
    prevInitial.current = initialPos;
    setPos(initialPos);
  }

  const DRAG_THRESHOLD = 4; // pixels — below this it's a click

  const handlePointerDown = useCallback(
    (e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
      e.stopPropagation();
      dragging.current = false;
      hasMoved.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
      onHoverChange(true);
    },
    [onHoverChange]
  );

  const handlePointerMove = useCallback(
    (e: { stopPropagation: () => void; clientX: number; clientY: number }) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > DRAG_THRESHOLD && !dragging.current) {
        dragging.current = true;
        hasMoved.current = true;
        (gl.domElement as HTMLElement).style.cursor = "grabbing";
      }

      if (dragging.current) {
        e.stopPropagation();
        // Use screen-space deltas mapped to world-space movement
        const sensitivity = 0.015;
        setPos((prev) => [prev[0] + dx * sensitivity, prev[1] - dy * sensitivity, prev[2]]);
        dragStart.current = { x: e.clientX, y: e.clientY };
      }
    },
    [gl]
  );

  const handlePointerUp = useCallback(() => {
    if (!hasMoved.current) {
      onClick();
    }
    dragging.current = false;
    hasMoved.current = false;
    dragStart.current = null;
    (gl.domElement as HTMLElement).style.cursor = "";
    onHoverChange(false);
  }, [onClick, onHoverChange, gl]);

  return (
    <group position={pos}>
      <Sphere
        args={[radius, 16, 16]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          if (dragging.current) {
            dragging.current = false;
            dragStart.current = null;
            (gl.domElement as HTMLElement).style.cursor = "";
          }
          onHoverChange(false);
        }}
      >
        <meshStandardMaterial color={color} />
      </Sphere>
      {label && (
        <Html
          position={[0, -(isChapter ? 0.4 : 0.3), 0]}
          center
          style={{ pointerEvents: "none" }}
        >
          <span
            style={{
              fontSize: isChapter ? "14px" : "12px",
              fontWeight: isChapter ? 700 : 400,
              color: "#333",
            }}
          >
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
  const count = chapters.length;
  const radius = Math.max(count * 0.7, 2.0);
  chapters.forEach((n, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    m.set(n.id, [Math.cos(angle) * radius, 1.0, Math.sin(angle) * radius]);
  });
  return m;
}

function sectionPositions(
  sections: TreeNodeData[],
  parentPos: [number, number, number],
  parentId: string
) {
  const siblings = sections.filter((s) => s.parentId === parentId);
  const m = new Map<string, [number, number, number]>();
  const radius = Math.max(siblings.length * 0.35, 1.2);
  siblings.forEach((n, i) => {
    const angle = (i / siblings.length) * Math.PI * 2 - Math.PI / 2;
    m.set(n.id, [
      parentPos[0] + Math.cos(angle) * radius,
      parentPos[1] - 1.0,
      parentPos[2] + Math.sin(angle) * radius,
    ]);
  });
  return m;
}

function buildTree(chapters: Chapter[], sections: CourseSection[]): TreeNodeData[] {
  const result: TreeNodeData[] = [];
  chapters.forEach((ch) => {
    result.push({
      id: ch.slug,
      label: ch.title,
      labelEn: ch.titleEn || ch.title,
      labelMs: ch.titleMs || ch.title,
      level: 1,
      parentId: null,
      slug: ch.slug,
    });
  });
  sections.forEach((sec) => {
    result.push({
      id: sec.slug,
      label: sec.title,
      labelEn: sec.titleEn || sec.title,
      labelMs: sec.titleMs || sec.title,
      level: 2,
      parentId: sec.chapterSlug,
      slug: sec.slug,
    });
  });
  return result;
}

/* ---- Scene ---- */
function TreeScene({
  chapters,
  sections,
  locale,
  expanded,
  toggleChapter,
  onSectionClick,
  onAnyHover,
}: {
  chapters: TreeNodeData[];
  sections: TreeNodeData[];
  locale: string;
  expanded: Set<string>;
  toggleChapter: (slug: string) => void;
  onSectionClick: (slug: string) => void;
  onAnyHover: (hovering: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const chapPos = useMemo(() => chapterPositions(chapters), [chapters]);

  return (
    <group ref={groupRef}>
      {/* Edges: center → chapters */}
      {chapters.map((ch) => {
        const pos = chapPos.get(ch.id)!;
        return (
          <Line
            key={`edge-root-${ch.id}`}
            points={[[0, 3.0, 0], pos]}
            color="#ccc"
            lineWidth={0.3}
            transparent
            opacity={0.4}
          />
        );
      })}

      {/* Edges: chapters → sections */}
      {sections
        .filter((sec) => expanded.has(sec.parentId!))
        .map((sec) => {
          const parentPos = chapPos.get(sec.parentId!)!;
          const secSiblings = sections.filter(
            (s) => s.parentId === sec.parentId && expanded.has(sec.parentId!)
          );
          const secMap = sectionPositions(secSiblings, parentPos, sec.parentId!);
          const myPos = secMap.get(sec.id)!;
          return (
            <Line
              key={`edge-${sec.id}`}
              points={[parentPos, myPos]}
              color="#ddd"
              lineWidth={0.3}
              transparent
              opacity={0.35}
            />
          );
        })}

      {/* Center origin */}
      <Sphere args={[0.12, 16, 16]} position={[0, 3.0, 0]}>
        <meshStandardMaterial color="#999" />
      </Sphere>

      {/* Chapter nodes */}
      {chapters.map((ch) => {
        const pos = chapPos.get(ch.id)!;
        const label = getBestLabel(ch, locale);
        return (
          <DraggableNode
            key={ch.id}
            position={pos}
            radius={0.18}
            color="#555"
            label={label}
            isChapter
            onClick={() => toggleChapter(ch.slug)}
            onHoverChange={onAnyHover}
          />
        );
      })}

      {/* Section nodes */}
      {sections
        .filter((sec) => expanded.has(sec.parentId!))
        .map((sec) => {
          const parentPos = chapPos.get(sec.parentId!)!;
          const siblings = sections.filter(
            (s) => s.parentId === sec.parentId && expanded.has(sec.parentId!)
          );
          const secMap = sectionPositions(siblings, parentPos, sec.parentId!);
          const pos = secMap.get(sec.id)!;
          const label = getBestLabel(sec, locale);
          return (
            <DraggableNode
              key={sec.id}
              position={pos}
              radius={0.1}
              color="#888"
              label={label}
              isChapter={false}
              onClick={() => onSectionClick(sec.slug)}
              onHoverChange={onAnyHover}
            />
          );
        })}
    </group>
  );
}

/* ---- Export ---- */

interface KnowledgeTreeProps {
  chapters: Chapter[];
  sections: CourseSection[];
  locale: string;
  onNodeClick: (slug: string) => void;
}

export default function KnowledgeTree({
  chapters,
  sections,
  locale,
  onNodeClick,
}: KnowledgeTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [nodeHovered, setNodeHovered] = useState(false);

  const allNodes = useMemo(
    () => buildTree(chapters, sections),
    [chapters, sections]
  );
  const chapterNodes = useMemo(
    () => allNodes.filter((n) => n.level === 1),
    [allNodes]
  );
  const sectionNodes = useMemo(
    () => allNodes.filter((n) => n.level === 2),
    [allNodes]
  );

  const toggleChapter = useCallback((slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const handleSectionClick = useCallback(
    (slug: string) => {
      onNodeClick(slug);
    },
    [onNodeClick]
  );

  const handleNodeHover = useCallback((hovering: boolean) => {
    setNodeHovered(hovering);
  }, []);

  if (chapters.length === 0) {
    const emptyLabel =
      locale === "en"
        ? "No knowledge tree"
        : locale === "ms"
        ? "Tiada pohon ilmu"
        : "暂无知识图谱";
    return (
      <div
        className="flex items-center justify-center h-full text-[#999] text-[13px]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0.5, 8], fov: 55 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={0.5} />
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        enableZoom
        autoRotate={false}
        minDistance={3}
        maxDistance={15}
        enabled={!nodeHovered}
      />
      <TreeScene
        chapters={chapterNodes}
        sections={sectionNodes}
        locale={locale}
        expanded={expanded}
        toggleChapter={toggleChapter}
        onSectionClick={handleSectionClick}
        onAnyHover={handleNodeHover}
      />
    </Canvas>
  );
}
