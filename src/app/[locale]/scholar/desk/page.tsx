"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data/courses";
import type { Exercise } from "@/data/courses";

type TabKey = "exercises" | "mistakes" | "todos";

interface MistakeItem { id: string; exercise: Exercise; courseTitle: string; wrongAnswer: string; date: string; }
const mockMistakes: MistakeItem[] = [
  { id: "m1", exercise: { id:"x1",type:"single",question:"《大学》三纲领中，明明德的第一个明是什么意思？",options:["光明","彰明、发扬","明天","明亮"],answer:"彰明、发扬"}, courseTitle:"《大学》精读", wrongAnswer:"光明", date:"7/26" },
  { id: "m2", exercise: { id:"x2",type:"truefalse",question:"八条目中，治国平天下是起点。",answer:"错误"}, courseTitle:"《大学》精读", wrongAnswer:"正确", date:"7/22" },
  { id: "m3", exercise: { id:"x3",type:"fill",question:"八条目中居于中心枢纽位置的是？",answer:"修身"}, courseTitle:"《论语》精讲", wrongAnswer:"诚意", date:"7/18" },
  { id: "m4", exercise: { id:"x4",type:"single",question:"以下哪项不属于风险管理的步骤？",options:["风险识别","风险评估","风险消除","风险监控"],answer:"风险消除"}, courseTitle:"风险管理基础", wrongAnswer:"风险监控", date:"7/15" },
  { id: "m5", exercise: { id:"x5",type:"single",question:"ETF的全称是什么？",options:["Exchange Traded Fund","Electronic Trade Format","Equity Transfer Fund","Enhanced Treasury Fund"],answer:"Exchange Traded Fund"}, courseTitle:"ETF投资实践", wrongAnswer:"Electronic Trade Format", date:"7/10" },
  { id: "m6", exercise: { id:"x6",type:"fill",question:"价值投资最重要的概念是______。",answer:"安全边际"}, courseTitle:"长期价值投资", wrongAnswer:"低价买入", date:"7/08" },
];

interface TodoItem { id: string; text: string; course?: string; done: boolean; due?: string; }
const initialTodos: TodoItem[] = [
  { id: "t1", text: "完成《财富管理的底层逻辑》第1章", course: "财富管理的底层逻辑", done: false, due: "明天" },
  { id: "t2", text: "复习全球资产配置第三章", course: "全球资产配置", done: false, due: "7/30" },
  { id: "t3", text: "完成《大学》第四章课后习题", course: "《大学》精读", done: false, due: "8/2" },
  { id: "t4", text: "阅读《ETF投资实践》前两章", course: "ETF投资实践", done: true, due: "已完成" },
  { id: "t5", text: "提交企业风险管理案例分析", course: "企业风险管理", done: false, due: "8/8" },
  { id: "t6", text: "完成女性财富成长练习", course: "女性财富成长", done: true, due: "已完成" },
  { id: "t7", text: "预习长期价值投资第四章", course: "长期价值投资", done: false, due: "8/10" },
  { id: "t8", text: "整理医疗保险体系笔记", course: "医疗保障体系", done: false, due: "本周" },
];

const allExercises = courses.flatMap((c) =>
  c.chapters.flatMap((ch) =>
    ch.modules.exercises.map((ex) => ({ ...ex, courseTitle: c.title, courseId: c.id, chapterTitle: ch.title }))
  )
);

type ExItem = (typeof allExercises)[number];

const TABS: { key: TabKey; label: string; count?: number }[] = [
  { key: "exercises", label: "习题库", count: allExercises.length },
  { key: "mistakes", label: "错题库", count: mockMistakes.length },
  { key: "todos", label: "待办事项", count: initialTodos.filter((t) => !t.done).length },
];

export default function DeskPage() {
  const { t } = useTranslation();
  const s = t.scholar as Record<string, string>;
  const [tab, setTab] = useState<TabKey>("todos");
  const [todos, setTodos] = useState(initialTodos);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  // Drill-down state
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // course title
  const [selectedMistakeCourse, setSelectedMistakeCourse] = useState<string | null>(null);

  const toggleTodo = (id: string) => setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done: !td.done } : td)));
  const setAnswer = (exId: string, val: string | string[]) => { if (submitted.has(exId)) return; setAnswers((prev) => ({ ...prev, [exId]: val })); };
  const submitAnswer = (exId: string) => { setSubmitted((prev) => { const n = new Set(prev); n.add(exId); return n; }); };
  const isCorrect = (ex: ExItem): boolean | null => {
    if (!submitted.has(ex.id)) return null; const ua = answers[ex.id]; if (!ua) return false;
    if (ex.type === "multi") return Array.isArray(ua) && (ex.answer as string[]).every((a) => ua.includes(a)) && ua.length === (ex.answer as string[]).length;
    return ua === ex.answer;
  };

  // Group exercises by course, sorted by chapter order appearance
  const exercisesByCourse = useMemo(() => {
    const map = new Map<string, ExItem[]>();
    allExercises.forEach((ex) => { if (!map.has(ex.courseTitle)) map.set(ex.courseTitle, []); map.get(ex.courseTitle)!.push(ex); });
    return Array.from(map.entries());
  }, []);

  // Group mistakes by course, sorted newest first
  const mistakesByCourse = useMemo(() => {
    const map = new Map<string, MistakeItem[]>();
    [...mockMistakes].sort((a, b) => b.date.localeCompare(a.date)).forEach((m) => {
      if (!map.has(m.courseTitle)) map.set(m.courseTitle, []); map.get(m.courseTitle)!.push(m);
    });
    return Array.from(map.entries());
  }, []);

  const renderQuestion = (ex: ExItem, i: number) => {
    const correct = isCorrect(ex);
    return (
      <motion.div key={`${ex.id}-${i}`} className={`p-4 rounded-[12px] border ${correct===true?"bg-[#f0faf0] border-[#388e3c]":correct===false?"bg-[#fef5f5] border-[#C04040]":"bg-white border-[#000]"}`}
        initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.02 }}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-[13px] font-bold flex-shrink-0 mt-[3px]" style={{ fontFamily:"'Times New Roman',serif" }}>{i+1}.</span>
          <div className="flex-1">
            <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily:"var(--font-serif)" }}>{ex.question}</p>
            <p className="text-[10px] text-[#000] m-0 mt-1 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>
              {ex.chapterTitle} · {ex.type==="single"?"单选":ex.type==="multi"?"多选":ex.type==="truefalse"?"判断":"填空"}
            </p>
          </div>
        </div>
        {ex.type === "fill" ? (
          <div className="ml-7 flex gap-2">
            <input type="text" disabled={submitted.has(ex.id)} value={(answers[ex.id] as string)||""} onChange={(e)=>setAnswer(ex.id,e.target.value)}
              placeholder="输入答案..." className="flex-1 px-4 py-2 rounded-[8px] border border-[#000] text-[14px] outline-none disabled:opacity-50" style={{ fontFamily:"var(--font-serif)" }} />
            <button onClick={()=>submitAnswer(ex.id)} disabled={submitted.has(ex.id)||!answers[ex.id]}
              className="px-4 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily:"var(--font-serif)" }}>提交</button>
          </div>
        ) : (
          <div className="ml-7 space-y-1.5">
            {ex.options?.map((opt)=>(<button key={opt} disabled={submitted.has(ex.id)}
              onClick={()=>{ if(ex.type==="multi"){ const cur=(answers[ex.id] as string[])||[]; setAnswer(ex.id,cur.includes(opt)?cur.filter(o=>o!==opt):[...cur,opt]); } else setAnswer(ex.id,opt); }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-[8px] text-[14px] text-left border cursor-pointer transition-colors ${(ex.type==="multi"?((answers[ex.id] as string[])||[]).includes(opt):answers[ex.id]===opt)?"bg-[#e8e8e8] border-[#000] font-bold":"bg-white border-[#ccc] hover:border-[#000]"} disabled:cursor-default`}
              style={{ fontFamily:"var(--font-serif)"}}>
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${(ex.type==="multi"?((answers[ex.id] as string[])||[]).includes(opt):answers[ex.id]===opt)?"border-[#000]":"border-[#ccc]"}`}>
                {(ex.type==="multi"?((answers[ex.id] as string[])||[]).includes(opt):answers[ex.id]===opt) && <span className="w-2 h-2 rounded-full bg-[#000]"/>}
              </span>{opt}
            </button>))}
            <button onClick={()=>submitAnswer(ex.id)} disabled={submitted.has(ex.id)||!answers[ex.id]}
              className="mt-2 px-4 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed" style={{ fontFamily:"var(--font-serif)" }}>提交</button>
          </div>
        )}
        {correct!==null && (<p className={`text-[13px] m-0 mt-3 ml-7 font-bold ${correct?"text-[#388e3c]":"text-[#C04040]"}`} style={{ fontFamily:"var(--font-serif)"}}>
          {correct ? "✓ 正确" : `✗ 错误 · 正确答案：${Array.isArray(ex.answer)?ex.answer.join(", "):ex.answer}`}</p>)}
      </motion.div>
    );
  };

  // === Exercises Tab ===
  const exercisesContent = (
    <div className="max-w-2xl">
      <AnimatePresence mode="wait">
        {!selectedCourse ? (
          <motion.div key="ex-courses" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <div className="space-y-3">
              {exercisesByCourse.map(([courseTitle, exs]) => (
                <motion.button key={courseTitle} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  onClick={() => setSelectedCourse(courseTitle)}
                  className="w-full flex items-center justify-between p-5 bg-white rounded-[14px] border border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left"
                  whileHover={{ y:-1, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                  <div>
                    <h3 className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily:"var(--font-serif)" }}>{courseTitle}</h3>
                    <p className="text-[12px] text-[#000] m-0 mt-1 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>{exs.length} 道习题 · {exs[0]?.chapterTitle}</p>
                  </div>
                  <span className="text-[20px] text-[#000] opacity-40">→</span>
                </motion.button>
              ))}
              {exercisesByCourse.length === 0 && <p className="text-[#000] py-8 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>暂无习题</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex-questions" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <button onClick={() => setSelectedCourse(null)} className="flex items-center gap-2 mb-5 text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70" style={{ fontFamily:"var(--font-serif)" }}>← {selectedCourse}</button>
            <div className="space-y-4">
              {exercisesByCourse.find(([c])=>c===selectedCourse)?.[1].map((ex, i) => renderQuestion(ex, i))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // === Mistakes Tab ===
  const mistakesContent = (
    <div className="max-w-2xl">
      <AnimatePresence mode="wait">
        {!selectedMistakeCourse ? (
          <motion.div key="mi-courses" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            {mistakesByCourse.length === 0 ? (
              <p className="text-[#000] py-8 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>暂无错题，继续加油！</p>
            ) : (
              <div className="space-y-3">
                {mistakesByCourse.map(([courseTitle, items]) => (
                  <motion.button key={courseTitle} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                    onClick={() => setSelectedMistakeCourse(courseTitle)}
                    className="w-full flex items-center justify-between p-5 bg-white rounded-[14px] border border-[#000] border-l-[4px] border-l-[#C04040] cursor-pointer hover:bg-[#f9f9f9] text-left"
                    whileHover={{ y:-1, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div>
                      <h3 className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily:"var(--font-serif)" }}>{courseTitle}</h3>
                      <p className="text-[12px] text-[#000] m-0 mt-1 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>{items.length} 道错题 · 最近：{items[0]?.date}</p>
                    </div>
                    <span className="text-[20px] text-[#000] opacity-40">→</span>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="mi-detail" initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <button onClick={() => setSelectedMistakeCourse(null)} className="flex items-center gap-2 mb-5 text-[14px] text-[#000] bg-transparent border-none cursor-pointer hover:opacity-70" style={{ fontFamily:"var(--font-serif)" }}>← {selectedMistakeCourse}</button>
            <div className="space-y-4">
              {mistakesByCourse.find(([c])=>c===selectedMistakeCourse)?.[1].map((m, i) => (
                <motion.div key={m.id} className="p-5 bg-white rounded-[12px] border border-[#000] border-l-[4px] border-l-[#C04040]"
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.03 }}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-[13px] font-bold flex-shrink-0 mt-[3px]" style={{ fontFamily:"'Times New Roman',serif" }}>{i+1}.</span>
                    <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily:"var(--font-serif)" }}>{m.exercise.question}</p>
                  </div>
                  <div className="ml-8 flex flex-col gap-1">
                    <p className="text-[12px] text-[#000] m-0" style={{ fontFamily:"var(--font-serif)" }}>你的答案：<span className="text-[#C04040] font-bold">{m.wrongAnswer}</span></p>
                    <p className="text-[12px] text-[#000] m-0" style={{ fontFamily:"var(--font-serif)" }}>正确答案：<span className="text-[#388e3c] font-bold">{Array.isArray(m.exercise.answer)?m.exercise.answer.join(", "):m.exercise.answer}</span></p>
                    <p className="text-[10px] text-[#000] m-0 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>{m.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // === Todos ===
  const pendingTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);
  const todosContent = (
    <div className="max-w-2xl space-y-6">
      <div className="flex gap-3">
        <input type="text" placeholder="添加新的待办事项..."
          onKeyDown={(e) => { if (e.key==="Enter" && e.currentTarget.value.trim()) { setTodos((p) => [{ id:`t${Date.now()}`, text:e.currentTarget.value.trim(), done:false }, ...p]); e.currentTarget.value = ""; } }}
          className="flex-1 px-4 py-3 rounded-[10px] border border-[#000] text-[15px] text-[#000] outline-none" style={{ fontFamily: "var(--font-serif)" }} />
      </div>
      {pendingTodos.length > 0 && (
        <div>
          <h3 className="text-[15px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily:"var(--font-serif)" }}>待完成 ({pendingTodos.length})</h3>
          <div className="space-y-2">
            {pendingTodos.map((td) => (
              <motion.div key={td.id} className="flex items-center gap-3 p-4 bg-white rounded-[10px] border border-[#000] cursor-pointer" whileHover={{ x:2 }} onClick={() => toggleTodo(td.id)}>
                <div className="w-5 h-5 rounded-[5px] border-2 border-[#000] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] text-[#000] m-0" style={{ fontFamily:"var(--font-serif)" }}>{td.text}</p>
                  {td.course && <p className="text-[11px] text-[#000] m-0 mt-0.5 opacity-50" style={{ fontFamily:"var(--font-serif)" }}>{td.course}</p>}
                </div>
                {td.due && <span className="text-[12px] text-[#000] flex-shrink-0" style={{ fontFamily:"'Times New Roman',serif" }}>{td.due}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}
      {doneTodos.length > 0 && (
        <div>
          <h3 className="text-[15px] text-[#000] font-bold m-0 mb-3 opacity-40" style={{ fontFamily:"var(--font-serif)" }}>已完成 ({doneTodos.length})</h3>
          <div className="space-y-1">
            {doneTodos.map((td) => (
              <div key={td.id} className="flex items-center gap-3 p-4 rounded-[10px] cursor-pointer opacity-40" onClick={() => toggleTodo(td.id)}>
                <div className="w-5 h-5 rounded-[5px] bg-[#000] flex-shrink-0 flex items-center justify-center"><span className="text-white text-[12px]">✓</span></div>
                <p className="text-[15px] text-[#000] line-through m-0" style={{ fontFamily:"var(--font-serif)" }}>{td.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <h1 className="text-[32px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily:"var(--font-serif)" }}>{s.nav_desk}</h1>
      <div className="flex gap-1 mb-8 border-b border-[#ccc]">
        {TABS.map(({ key, label, count }) => (
          <button key={key} onClick={() => { setTab(key); setSelectedCourse(null); setSelectedMistakeCourse(null); }}
            className={`px-5 py-3 text-[15px] border-none cursor-pointer transition-colors bg-transparent ${tab===key?"text-[#000] font-bold border-b-[3px] border-[#000] -mb-[1px]":"text-[#000] opacity-50 hover:opacity-80"}`}
            style={{ fontFamily:"var(--font-serif)" }}>{label}{count !== undefined && count > 0 && <span className="ml-1.5 text-[12px] opacity-50">({count})</span>}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
          {tab === "exercises" && exercisesContent}
          {tab === "mistakes" && mistakesContent}
          {tab === "todos" && todosContent}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
