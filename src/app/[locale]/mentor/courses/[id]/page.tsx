"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data/courses";
import type { VideoItem, PptFile, Exercise, ReviewItem } from "@/data/courses";

type TabKey = "videos" | "ppt" | "content" | "exercises" | "students" | "reviews" | "data";

const TAB_LABELS: { key: TabKey; label: string }[] = [
  { key: "videos", label: "讲学影卷" },
  { key: "ppt", label: "讲义" },
  { key: "content", label: "正文" },
  { key: "exercises", label: "策问" },
  { key: "students", label: "门下学子" },
  { key: "reviews", label: "讲席评分" },
  { key: "data", label: "学习数据" },
];

/* ── Mock student data ── */
const mockStudents = [
  { name: "张物学", progress: 78, lastActive: "2小时前", avatar: "https://picsum.photos/seed/stu-1/40/40" },
  { name: "李文思", progress: 65, lastActive: "1天前", avatar: "https://picsum.photos/seed/stu-2/40/40" },
  { name: "王知行", progress: 92, lastActive: "30分钟前", avatar: "https://picsum.photos/seed/stu-3/40/40" },
  { name: "陈明德", progress: 45, lastActive: "3天前", avatar: "https://picsum.photos/seed/stu-4/40/40" },
  { name: "吴思远", progress: 88, lastActive: "5小时前", avatar: "https://picsum.photos/seed/stu-5/40/40" },
  { name: "赵算法", progress: 30, lastActive: "1周前", avatar: "https://picsum.photos/seed/stu-6/40/40" },
  { name: "周概率", progress: 55, lastActive: "2天前", avatar: "https://picsum.photos/seed/stu-7/40/40" },
  { name: "风雅颂", progress: 70, lastActive: "昨天", avatar: "https://picsum.photos/seed/stu-8/40/40" },
];

function MixedFont({ text }: { text: string }) {
  const segs: { text: string; isChinese: boolean }[] = [];
  let cur = ""; let curIs: boolean | null = null;
  for (const ch of text) {
    const is = /[一-鿿]/.test(ch);
    if (curIs === null) { curIs = is; cur = ch; }
    else if (is === curIs) { cur += ch; }
    else { segs.push({ text: cur, isChinese: curIs }); cur = ch; curIs = is; }
  }
  if (cur) segs.push({ text: cur, isChinese: curIs ?? false });
  return <>{segs.map((seg, i) => <span key={i} style={{ fontFamily: seg.isChinese ? "'KaiTi','STKaiti','楷体',serif" : "'Times New Roman',serif" }}>{seg.text}</span>)}</>;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.id as string;
  const course = courses.find((c) => c.id === courseId);
  const [tab, setTab] = useState<TabKey>("videos");

  // Local state for editing
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const chVids = course?.chapters.flatMap((ch) => ch.modules.videos) || [];
    return chVids;
  });
  const [pptFiles, setPptFiles] = useState<PptFile[]>(() => {
    const chPpts = course?.chapters.flatMap((ch) => ch.modules.pptFiles) || [];
    return chPpts;
  });
  const [content, setContent] = useState(() => {
    const chContent = course?.chapters.map((ch) => ch.modules.content).join("\n\n---\n\n") || "";
    return chContent;
  });
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const chEx = course?.chapters.flatMap((ch) => ch.modules.exercises) || [];
    return chEx;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!course) return <div className="px-10 py-8"><p className="text-[#000]">课程不存在</p></div>;

  const totalStudents = mockStudents.length;
  const avgProgress = Math.round(mockStudents.reduce((s, st) => s + st.progress, 0) / totalStudents);
  const completionRate = Math.round(mockStudents.filter((st) => st.progress >= 80).length / totalStudents * 100);

  const handleFileUpload = (type: "video" | "ppt") => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    alert("课程内容已保存（Demo 阶段本地保存）。");
  };

  return (
    <motion.div className="flex h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Left tab nav */}
      <div className="w-[180px] flex-shrink-0 border-r border-[#000] bg-[#fafafa] flex flex-col">
        {/* Back + course name */}
        <div className="px-4 py-4 border-b border-[#000]">
          <p className="text-[11px] text-[#000] m-0 mb-1 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>藏经阁</p>
          <p className="text-[14px] text-[#000] font-bold m-0 truncate" style={{ fontFamily: "var(--font-serif)" }}>{course.title}</p>
        </div>
        <nav className="flex-1 py-2">
          {TAB_LABELS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-2 px-5 py-3 text-[14px] text-left border-none cursor-pointer transition-all bg-transparent ${
                tab === key ? "text-[#000] font-bold bg-white border-r-[3px] border-[#000]" : "text-[#000] hover:bg-white/50 border-r-[3px] border-transparent"
              }`}
              style={{ fontFamily: "var(--font-serif)" }}>{label}</button>
          ))}
        </nav>
        <div className="px-4 pb-4">
          <button onClick={handleSave}
            className="w-full py-2.5 bg-[#000] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#333] transition-colors"
            style={{ fontFamily: "var(--font-serif)" }}>保存修改</button>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-10 py-8">
          {/* Course header */}
          <div className="flex items-start gap-5 mb-8 pb-6 border-b border-[#000]">
            <img src={course.coverImage} alt={course.title} className="w-[120px] h-[80px] rounded-[10px] object-cover border-2 border-[#000] flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-[26px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{course.title}</h1>
              <p className="text-[13px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>
                {course.category} · {course.duration} · 评分 {course.rating} · {course.chapters.length} 章 · {course.reviewCount} 人评价
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {/* ====== 讲学影卷 ====== */}
              {tab === "videos" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[20px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>讲学影卷</h2>
                    <button onClick={() => alert("视频上传功能将在完整版中提供。")}
                      className="px-4 py-2 bg-[#000] text-white rounded-[8px] text-[13px] font-bold border-none cursor-pointer" style={{ fontFamily: "var(--font-serif)" }}>+ 上传影卷</button>
                  </div>
                  {videos.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-[#000] rounded-[14px] text-center">
                      <p className="text-[#000] text-[14px] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>暂无讲学影卷。上传课程视频后同步至学子端课程视频模块。</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {videos.map((v) => (
                        <div key={v.id} className="flex items-center gap-4 p-4 bg-[#fafafa] rounded-[10px] border border-[#000]">
                          <span className="text-[20px]">▶</span>
                          <div className="flex-1"><p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}><MixedFont text={v.title} /></p></div>
                          <span className="text-[11px] text-[#000] uppercase opacity-50" style={{ fontFamily: "var(--font-display)" }}>{v.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ====== 讲义 (PPT) ====== */}
              {tab === "ppt" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[20px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>讲义</h2>
                    <button onClick={() => alert("PPT上传功能将在完整版中提供。")}
                      className="px-4 py-2 bg-[#000] text-white rounded-[8px] text-[13px] font-bold border-none cursor-pointer" style={{ fontFamily: "var(--font-serif)" }}>+ 上传讲义</button>
                  </div>
                  {pptFiles.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-[#000] rounded-[14px] text-center">
                      <p className="text-[#000] text-[14px] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>暂无讲义。上传PPT/PDF后同步至学子端课程PPT模块。</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pptFiles.map((f) => (
                        <div key={f.id} className="flex items-center gap-3 p-3 bg-[#fafafa] rounded-[8px] border border-[#000]">
                          <span>📄</span><span className="text-[14px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}><MixedFont text={f.title} /></span>
                          <span className="text-[11px] text-[#000] opacity-50 ml-auto uppercase" style={{ fontFamily: "var(--font-display)" }}>{f.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ====== 正文 ====== */}
              {tab === "content" && (
                <div>
                  <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>课程正文</h2>
                  <textarea value={content} onChange={(e) => setContent(e.target.value)}
                    className="w-full min-h-[400px] p-6 rounded-[14px] border-2 border-[#000] text-[15px] text-[#000] leading-relaxed outline-none resize-y"
                    style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }}
                    placeholder="在此编写课程正文内容。支持章节标题。修改后同步至学子端课程内容模块。" />
                </div>
              )}

              {/* ====== 策问 ====== */}
              {tab === "exercises" && (
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[20px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>策问（{exercises.length} 题）</h2>
                    <button onClick={() => alert("添加策问功能将在完整版中提供。")}
                      className="px-4 py-2 bg-[#000] text-white rounded-[8px] text-[13px] font-bold border-none cursor-pointer" style={{ fontFamily: "var(--font-serif)" }}>+ 添加策问</button>
                  </div>
                  {exercises.length === 0 ? (
                    <div className="p-8 border-2 border-dashed border-[#000] rounded-[14px] text-center">
                      <p className="text-[#000] text-[14px] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>暂无策问。课后习题将同步至学子端课后习题模块。</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exercises.map((ex, i) => (
                        <div key={ex.id || i} className="p-4 bg-[#fafafa] rounded-[10px] border border-[#000]">
                          <p className="text-[14px] text-[#000] font-bold m-0 mb-2" style={{ fontFamily: "var(--font-serif)" }}>{i + 1}. {ex.question}</p>
                          <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>
                            {ex.type === "single" ? "单选题" : ex.type === "multi" ? "多选题" : ex.type === "truefalse" ? "判断题" : "填空题"} · 答案：{Array.isArray(ex.answer) ? ex.answer.join(", ") : ex.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ====== 门下学子 ====== */}
              {tab === "students" && (
                <div>
                  <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>门下学子（{totalStudents} 人）</h2>
                  <div className="space-y-2">
                    {mockStudents.map((st) => (
                      <div key={st.name} className="flex items-center gap-4 p-4 bg-white rounded-[10px] border border-[#000]">
                        <img src={st.avatar} alt={st.name} className="w-10 h-10 rounded-full object-cover border border-[#ddd] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{st.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-[5px] bg-[#eee] rounded-full max-w-[200px]"><div className="h-full bg-[#000] rounded-full" style={{ width: `${st.progress}%` }} /></div>
                            <span className="text-[10px] text-[#000] flex-shrink-0" style={{ fontFamily: "'Times New Roman', serif" }}>{st.progress}%</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-[#000] opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{st.lastActive}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====== 讲席评分 & 评语 ====== */}
              {tab === "reviews" && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="p-5 bg-[#fafafa] rounded-[14px] border border-[#000] text-center">
                      <p className="text-[34px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>★ {course.rating}</p>
                      <p className="text-[13px] text-[#000] m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>平均评分</p>
                      <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>{course.reviewCount} 人评价</p>
                    </div>
                    <div className="p-5 bg-[#fafafa] rounded-[14px] border border-[#000] text-center">
                      <p className="text-[34px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>92%</p>
                      <p className="text-[13px] text-[#000] m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>好评率</p>
                      <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>4-5星占比</p>
                    </div>
                    <div className="p-5 bg-[#fafafa] rounded-[14px] border border-[#000] text-center">
                      <p className="text-[34px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>86%</p>
                      <p className="text-[13px] text-[#000] m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>推荐率</p>
                      <p className="text-[11px] text-[#000] opacity-50 m-0" style={{ fontFamily: "var(--font-serif)" }}>会推荐给他人</p>
                    </div>
                  </div>

                  <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>学子评语</h2>
                  <div className="space-y-3">
                    {(course.chapters[0]?.modules.reviews || []).map((rv: ReviewItem) => (
                      <div key={rv.id} className="p-4 bg-white rounded-[10px] border border-[#000]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[14px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{rv.userName}</span>
                          <span className="text-[13px] text-[#C5A46D]" style={{ fontFamily: "'Times New Roman', serif" }}>{"★".repeat(rv.rating)}{"☆".repeat(5 - rv.rating)}</span>
                          <span className="text-[11px] text-[#000] opacity-40 ml-auto" style={{ fontFamily: "'Times New Roman', serif" }}>{rv.date}</span>
                        </div>
                        <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)" }}>{rv.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ====== 学习数据 ====== */}
              {tab === "data" && (
                <div>
                  <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>学习数据</h2>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <DataCard value={`${totalStudents}人`} label="报名人数" />
                    <DataCard value={`${Math.round(totalStudents * 0.65)}人`} label="完成人数" />
                    <DataCard value={`${completionRate}%`} label="完课率" />
                    <DataCard value={`${avgProgress}%`} label="平均学习进度" />
                    <DataCard value="4.2h" label="平均学习时长" />
                    <DataCard value={`${Math.round(exercises.length * 0.7)}/${exercises.length}`} label="作业完成率" />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function DataCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-5 bg-[#fafafa] rounded-[14px] border border-[#000] text-center">
      <p className="text-[28px] text-[#000] font-bold m-0" style={{ fontFamily: "'Times New Roman', serif" }}>{value}</p>
      <p className="text-[13px] text-[#000] m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p>
    </div>
  );
}
