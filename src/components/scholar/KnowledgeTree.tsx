"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Line, Sphere, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — react-three-fiber
   Nodes: Root → Chapter → Section (2 levels)
   Manual drag only (no auto-rotate), locale-aware labels
   Fonts: KaiTi (Chinese), Times New Roman (English/Malay/numbers)
   ============================================================ */

interface TreeNodeData {
  id: string;
  label: string;
  labelEn: string;
  labelMs: string;
  level: number;
  parentId: string | null;
  slug: string;
  parentChapterSlug?: string; // for sections: the chapter slug they belong to
}

function getBestLabel(n: TreeNodeData, locale: string): string {
  if (locale === "en" && n.labelEn) return n.labelEn;
  if (locale === "ms" && n.labelMs) return n.labelMs;
  return n.label; // fallback to zh
}

function isChinese(text: string): boolean {
  return /[一-鿿]/.test(text);
}

function layoutTree(chapters: Chapter[], sections: CourseSection[]): TreeNodeData[] {
  const nodes: TreeNodeData[] = [
    { id: "root", label: "", labelEn: "", labelMs: "", level: 0, parentId: null, slug: "" },
  ];
  chapters.forEach((ch) => {
    nodes.push({
      id: ch.slug,
      label: ch.title,
      labelEn: ch.titleEn || ch.title,
      labelMs: ch.titleMs || ch.title,
      level: 1,
      parentId: "root",
      slug: ch.slug,
    });
  });
  sections.forEach((sec) => {
    nodes.push({
      id: sec.slug,
      label: sec.title,
      labelEn: sec.titleEn || sec.title,
      labelMs: sec.titleMs || sec.title,
      level: 2,
      parentId: sec.chapterSlug,
      slug: sec.slug,
      parentChapterSlug: sec.chapterSlug,
    });
  });
  return nodes;
}

function positions(nodes: TreeNodeData[]) {
  const posMap = new Map<string, [number, number, number]>();
  posMap.set("root", [0, 2.5, 0]);

  const level1 = nodes.filter((n) => n.level === 1);
  const radius1 = 2.2;
  level1.forEach((n, i) => {
    const angle = (i / level1.length) * Math.PI * 2 - Math.PI / 2;
    posMap.set(n.id, [Math.cos(angle) * radius1, 0.8, Math.sin(angle) * radius1]);
  });

  const level2 = nodes.filter((n) => n.level === 2 && n.parentId !== null) as (TreeNodeData & { parentId: string })[];
  const radius2 = 1.3;
  const countMap = new Map<string, number>();
  level2.forEach((n) => { countMap.set(n.parentId, (countMap.get(n.parentId) || 0) + 1); });
  const idxMap = new Map<string, number>();
  level2.forEach((n) => {
    const parentPos = posMap.get(n.parentId)!;
    const totalSibs = countMap.get(n.parentId) || 1;
    const idx = idxMap.get(n.parentId) || 0;
    const angle = (idx / totalSibs) * Math.PI * 2 - Math.PI / 2 + (totalSibs <= 2 ? 0.3 : 0);
    const offset: [number, number, number] = [
      Math.cos(angle) * radius2,
      -0.8,
      Math.sin(angle) * radius2,
    ];
    posMap.set(n.id, [parentPos[0] + offset[0], parentPos[1] + offset[1], parentPos[2] + offset[2]]);
    idxMap.set(n.parentId, idx + 1);
  });

  return posMap;
}

function TreeScene({
  nodes,
  locale,
  onNodeClick,
}: {
  nodes: TreeNodeData[];
  locale: string;
  onNodeClick: (slug: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const posMap = useMemo(() => positions(nodes), [nodes]);

  const handleClick = useCallback(
    (slug: string) => { onNodeClick(slug); },
    [onNodeClick]
  );

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {nodes
        .filter((n): n is TreeNodeData & { parentId: string } => n.parentId !== null)
        .map((n) => {
          const parentPos = posMap.get(n.parentId)!;
          const myPos = posMap.get(n.id)!;
          return (
            <Line
              key={`edge-${n.id}`}
              points={[parentPos, myPos]}
              color="#bbb"
              lineWidth={0.5}
              transparent
              opacity={0.5}
            />
          );
        })}

      {/* Nodes */}
      {nodes.map((n) => {
        const pos = posMap.get(n.id)!;
        const isRoot = n.level === 0;
        const isChapter = n.level === 1;
        const radius = isRoot ? 0.25 : isChapter ? 0.15 : 0.1;
        const color = isRoot ? "#333" : isChapter ? "#555" : "#888";
        const label = getBestLabel(n, locale);
        const useKaiTi = isChinese(label);

        return (
          <group key={n.id}>
            <Sphere
              args={[radius, 16, 16]}
              position={pos}
              onClick={() => n.slug && handleClick(n.slug)}
            >
              <meshStandardMaterial color={color} />
            </Sphere>
            {label && (
              <Html
                position={[pos[0], pos[1] - (isChapter ? 0.3 : 0.2), pos[2]]}
                center
                style={{ pointerEvents: "none" }}
              >
                <span
                  style={{
                    fontFamily: useKaiTi
                      ? "'KaiTi', 'STKaiti', '楷体', serif"
                      : "'Times New Roman', serif",
                    fontSize: isChapter ? "13px" : "11px",
                    color: "#333",
                    whiteSpace: "nowrap",
                    textShadow: "0 0 4px rgba(255,255,255,0.9)",
                  }}
                >
                  {label.length > 8 ? label.slice(0, 8) + "…" : label}
                </span>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface KnowledgeTreeProps {
  chapters: Chapter[];
  sections: CourseSection[];
  locale: string;
  onNodeClick: (slug: string) => void;
}

export default function KnowledgeTree({ chapters, sections, locale, onNodeClick }: KnowledgeTreeProps) {
  const nodes = useMemo(() => layoutTree(chapters, sections), [chapters, sections]);

  if (chapters.length === 0) {
    const emptyLabel = locale === "en" ? "No knowledge tree" : locale === "ms" ? "Tiada pohon ilmu" : "暂无知识图谱";
    return (
      <div className="flex items-center justify-center h-full text-[#999] text-[13px]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {emptyLabel}
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <OrbitControls enableDamping dampingFactor={0.08} enableZoom={false} autoRotate={false} />
      <TreeScene nodes={nodes} locale={locale} onNodeClick={onNodeClick} />
    </Canvas>
  );
}
