"use client";

import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Line, Sphere, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { Chapter, CourseSection } from "@/data/courses";

/* ============================================================
   3D Knowledge Tree — react-three-fiber
   Nodes: Root → Chapter → Section (2 levels)
   Auto-rotates, draggable, clickable nodes
   ============================================================ */

interface TreeNodeData {
  id: string;
  label: string;
  level: number; // 0=root, 1=chapter, 2=section
  parentId: string | null;
  slug: string;
}

function layoutTree(chapters: Chapter[], sections: CourseSection[]): TreeNodeData[] {
  const nodes: TreeNodeData[] = [
    { id: "root", label: "", level: 0, parentId: null, slug: "" },
  ];
  chapters.forEach((ch) => {
    nodes.push({ id: ch.slug, label: ch.title, level: 1, parentId: "root", slug: ch.slug });
  });
  sections.forEach((sec) => {
    nodes.push({ id: sec.slug, label: sec.title, level: 2, parentId: sec.chapterSlug, slug: sec.slug });
  });
  return nodes;
}

function positions(nodes: TreeNodeData[]) {
  const posMap = new Map<string, [number, number, number]>();

  // Root at center top
  posMap.set("root", [0, 2.5, 0]);

  // Chapters: ring around root
  const level1 = nodes.filter((n) => n.level === 1);
  const radius1 = 2.2;
  level1.forEach((n, i) => {
    const angle = (i / level1.length) * Math.PI * 2 - Math.PI / 2;
    posMap.set(n.id, [Math.cos(angle) * radius1, 0.8, Math.sin(angle) * radius1]);
  });

  // Sections: ring around their parent chapter
  const level2 = nodes.filter((n) => n.level === 2 && n.parentId !== null) as (TreeNodeData & { parentId: string })[];
  const radius2 = 1.3;
  const countMap = new Map<string, number>();
  level2.forEach((n) => {
    countMap.set(n.parentId, (countMap.get(n.parentId) || 0) + 1);
  });
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
  onNodeClick,
}: {
  nodes: TreeNodeData[];
  onNodeClick: (slug: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const posMap = useMemo(() => positions(nodes), [nodes]);

  // Auto-rotate
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const handleClick = useCallback(
    (slug: string) => {
      onNodeClick(slug);
    },
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

        return (
          <group key={n.id}>
            <Sphere
              args={[radius, 16, 16]}
              position={pos}
              onClick={() => n.slug && handleClick(n.slug)}
            >
              <meshStandardMaterial color={color} />
            </Sphere>
            {n.label && (
              <Text
                position={[pos[0], pos[1] - (isChapter ? 0.3 : 0.2), pos[2]]}
                fontSize={isChapter ? 0.25 : 0.18}
                color="#333"
                anchorX="center"
                anchorY="top"
                maxWidth={3}
              >
                {n.label.length > 6 ? n.label.slice(0, 6) + "…" : n.label}
              </Text>
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
  onNodeClick: (slug: string) => void;
}

export default function KnowledgeTree({ chapters, sections, onNodeClick }: KnowledgeTreeProps) {
  const nodes = useMemo(() => layoutTree(chapters, sections), [chapters, sections]);

  if (chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[#999] text-[13px]" style={{ fontFamily: "var(--font-serif)" }}>
        暂无知识图谱
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
      <OrbitControls enableDamping enableZoom={false} autoRotate={false} />
      <TreeScene nodes={nodes} onNodeClick={onNodeClick} />
    </Canvas>
  );
}
