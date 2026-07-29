"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { courses } from "@/data/courses";

export default function CourseDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  const courseId = params?.id as string;
  const course = courses.find((c) => c.id === courseId);

  if (!course) return <div className="px-10 py-8"><p className="text-[#000]">课程不存在</p></div>;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>{course.title}</h1>
      <p className="text-[14px] text-[#000] opacity-50 mb-8" style={{ fontFamily: "var(--font-serif)" }}>{course.category} · {course.instructor} · {course.duration}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-5 bg-[#fafafa] rounded-[12px] border border-[#000]"><p className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>课程详情（学子同步）</p><p className="text-[12px] text-[#000] opacity-50 mt-1" style={{ fontFamily: "var(--font-serif)" }}>此页面将展示课程的全部管理信息</p></div>
        <div className="p-5 bg-[#fafafa] rounded-[12px] border border-[#000]"><p className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>门下学子 {course.reviewCount} 人</p><p className="text-[12px] text-[#000] opacity-50 mt-1" style={{ fontFamily: "var(--font-serif)" }}>评分 ★{course.rating} · 完课率 78%</p></div>
      </div>
      <p className="text-[14px] text-[#000] opacity-40" style={{ fontFamily: "var(--font-serif)" }}>完整课程管理面板开发中（子项目B）。</p>
    </motion.div>
  );
}
