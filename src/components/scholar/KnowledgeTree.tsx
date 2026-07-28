"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Line, Sphere, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — Click-to-expand, draggable nodes, full text
   Chapters start visible. Click chapter → expand its sections.
   Click section → navigate. All nodes draggable.
   ============================================================ */

interface TreeNodeData {
  id: string;
  label: string;
  labelEn: string;
  labelMs: string;
  level: number; // 1=chapter, 2=section
  parentId: string | null; // null for chapter, chapter slug for section
  slug: string;
}

function getBestLabel(n: TreeNodeData, locale: string): string {
  if (locale === "en" && n.labelEn) return n.labelEn;
  if (locale === "ms" && n.labelMs) return n.labelMs;
  return n.label;
}

function isChinese(text: string): boolean {
  return /[一-鿿]/.test(text);
}

/* ---- Drag behaviour for a single node ---- */
function DraggableNode({
  position: initialPos,
  radius,
  color,
  label,
  useKaiTi,
  isChapter,
  onClick,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  label: string;
  useKaiTi: boolean;
  isChapter: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [pos, setPos] = useState(initialPos);
  const dragging = useRef(false);
  const dragStart = useRef<{ x: number; y: number; z: number } | null>(null);
  const { gl } = useThree();

  // Sync when initialPos changes from outside
  const prevInitial = useRef(initialPos);
  if (prevInitial.current[0] !== initialPos[0] || prevInitial.current[1] !== initialPos[1] || prevInitial.current[2] !== initialPos[2]) {
    prevInitial.current = initialPos;
    if (!dragging.current) setPos(initialPos);
  }

  const handlePointerDown = useCallback(
    (e: { stopPropagation: () => void; point: { x: number; y: number; z: number } }) => {
      e.stopPropagation();
      dragging.current = true;
      dragStart.current = { x: e.point.x, y: e.point.y, z: e.point.z };
      (gl.domElement as HTMLElement).style.cursor = "grabbing";
    },
    [gl]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useFrame((_state, _delta) => {
    // Drag handled in onPointerMove
  });

  const handlePointerMove = useCallback(
    (e: { point: { x: number; y: number; z: number } }) => {
      if (!dragging.current || !dragStart.current) return;
      // Project pointer onto the plane at the node's depth
      const dx = e.point.x - dragStart.current.x;
      const dy = e.point.y - dragStart.current.y;
      setPos((prev) => [prev[0] + dx, prev[1] + dy, prev[2]]);
      dragStart.current = { x: e.point.x, y: e.point.y, z: e.point.z };
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    if (!dragging.current) {
      // It was a click, not a drag
      onClick();
    }
    dragging.current = false;
    dragStart.current = null;
    (gl.domElement as HTMLElement).style.cursor = "";
  }, [onClick, gl]);

  return (
    <group position={pos}>
      <Sphere
        ref={meshRef}
        args={[radius, 16, 16]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
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
              fontFamily: useKaiTi
                ? "'KaiTi', 'STKaiti', '楷体', serif"
                : "'Times New Roman', serif",
              fontSize: isChapter ? "14px" : "12px",
              fontWeight: isChapter ? 700 : 400,
              color: "#333",
              whiteSpace: "nowrap",
              textShadow: "0 0 4px rgba(255,255,255,0.95)",
            }}
          >
            {label}
          </span>
        </Html>
      )}
    </group>
  );
}

/* ---- Position helpers ---- */
function chapterPositions(chapters: TreeNodeData[]) {
  const m = new Map<string, [number, number, number]>();
  const count = chapters.length;
  // Spread chapters in a wider ring
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

/* ---- ---- */

function TreeScene({
  chapters,
  sections,
  locale,
  expanded,
  toggleChapter,
  onSectionClick,
}: {
  chapters: TreeNodeData[];
  sections: TreeNodeData[];
  locale: string;
  expanded: Set<string>;
  toggleChapter: (slug: string) => void;
  onSectionClick: (slug: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const chapPos = useMemo(() => chapterPositions(chapters), [chapters]);

  return (
    <group ref={groupRef}>
      {/* Edges: chapters connected to center */}
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

      {/* Edges: sections → parent chapters */}
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

      {/* Center origin dot */}
      <Sphere args={[0.12, 16, 16]} position={[0, 3.0, 0]}>
        <meshStandardMaterial color="#999" />
      </Sphere>

      {/* Chapter nodes */}
      {chapters.map((ch) => {
        const pos = chapPos.get(ch.id)!;
        const label = getBestLabel(ch, locale);
        const useKaiTi = isChinese(label);
        return (
          <DraggableNode
            key={ch.id}
            position={pos}
            radius={0.18}
            color="#555"
            label={label}
            useKaiTi={useKaiTi}
            isChapter
            onClick={() => toggleChapter(ch.slug)}
          />
        );
      })}

      {/* Section nodes — only for expanded chapters */}
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
          const useKaiTi = isChinese(label);
          return (
            <DraggableNode
              key={sec.id}
              position={pos}
              radius={0.1}
              color="#888"
              label={label}
              useKaiTi={useKaiTi}
              isChapter={false}
              onClick={() => onSectionClick(sec.slug)}
            />
          );
        })}
    </group>
  );
}

/* ---- ---- */

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
      />
      <TreeScene
        chapters={chapterNodes}
        sections={sectionNodes}
        locale={locale}
        expanded={expanded}
        toggleChapter={toggleChapter}
        onSectionClick={handleSectionClick}
      />
    </Canvas>
  );
}
