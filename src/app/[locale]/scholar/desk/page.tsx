"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data/courses";
import type { Exercise } from "@/data/courses";

/* ============================================================
   格物学院 · 书案 — 习题库 + 错题库 + 待办事项
   ============================================================ */

type TabKey = "exercises" | "mistakes" | "todos";

/* ---- Mock mistake data ---- */
interface MistakeItem { id: string; exercise: Exercise; courseTitle: string; wrongAnswer: string; date: string; }
const mockMistakes: MistakeItem[] = [
  { id: "m1", exercise: courses[0].chapters[0]?.modules.exercises[1] ?? { id:"x",type:"single",question:"?",options:["?"],answer:"?"}, courseTitle: "《大学》精读", wrongAnswer: "光明", date: "7/26" },
  { id: "m2", exercise: courses[0].chapters[0]?.modules.exercises[4] ?? { id:"x",type:"truefalse",question:"?",answer:"?"}, courseTitle: "《大学》精读", wrongAnswer: "正确", date: "7/22" },
  { id: "m3", exercise: { id:"m3", type:"fill", question:"八条目中居于中心枢纽位置的是？", answer:"修身" }, courseTitle: "《论语》精讲", wrongAnswer: "诚意", date: "7/18" },
  { id: "m4", exercise: { id:"m4", type:"single", question:"以下哪项不属于风险管理的步骤？", options:["风险识别","风险评估","风险消除","风险监控"], answer:"风险消除" }, courseTitle: "风险管理基础", wrongAnswer: "风险监控", date: "7/15" },
];

/* ---- Mock todo data ---- */
interface TodoItem { id: string; text: string; course?: string; done: boolean; due?: string; }
const initialTodos: TodoItem[] = [
  { id: "t1", text: "完成《大学》第四章课后习题", course: "《大学》精读", done: false, due: "明天" },
  { id: "t2", text: "复习金融建模第二章知识点", course: "金融数学建模", done: false, due: "7/30" },
  { id: "t3", text: "准备风险管理期中考试", course: "风险管理基础", done: false, due: "8/5" },
  { id: "t4", text: "阅读《孙子兵法》前三章", course: "《孙子兵法》与决策", done: true, due: "已完成" },
  { id: "t5", text: "提交数据分析导论项目报告", course: "数据分析导论", done: false, due: "8/8" },
  { id: "t6", text: "完成Python量化投资练习2", course: "Python 与量化投资", done: true, due: "已完成" },
  { id: "t7", text: "参加《论语》研讨会预习", course: "《论语》精讲", done: false, due: "8/10" },
  { id: "t8", text: "整理统计学习笔记", course: "统计学习基础", done: false, due: "本周" },
];

/* ---- All exercises from all courses ---- */
const allExercises = courses.flatMap((c) =>
  c.chapters.flatMap((ch) =>
    ch.modules.exercises.map((ex) => ({ ...ex, courseTitle: c.title, chapterTitle: ch.title }))
  )
);

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

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((td) => (td.id === id ? { ...td, done: !td.done } : td)));
  };

  /* === Exercises tab === */
  const exercisesContent = (
    <div className="space-y-5 max-w-2xl">
      {allExercises.map((ex, i) => (
        <motion.div key={`${ex.id}-${i}`} className="p-5 bg-white rounded-[12px] border border-[#000]"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
          <div className="flex items-start gap-3 mb-3">
            <span className="text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: "var(--font-display)", color: "#000" }}>{i + 1}.</span>
            <div className="flex-1">
              <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{ex.question}</p>
              <p className="text-[11px] text-[#000] m-0 mt-1 opacity-60" style={{ fontFamily: "var(--font-serif)" }}>
                {ex.courseTitle} · {ex.chapterTitle} · {ex.type==="single"?"单选":ex.type==="multi"?"多选":ex.type==="truefalse"?"判断":"填空"}
              </p>
            </div>
          </div>
          {ex.options && (
            <div className="flex flex-wrap gap-2 ml-7">
              {ex.options.map((opt, oi) => (
                <span key={oi} className="px-3 py-1 rounded-[6px] text-[12px] border border-[#ddd] bg-[#fafafa] text-[#000]"
                  style={{ fontFamily: "var(--font-serif)" }}>{opt}</span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );

  /* === Mistakes tab === */
  const mistakesContent = (
    <div className="space-y-5 max-w-2xl">
      {mockMistakes.length === 0 ? (
        <p className="text-[14px] text-[#000] py-8 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>暂无错题，继续加油！</p>
      ) : (
        mockMistakes.map((m, i) => (
          <motion.div key={m.id} className="p-5 bg-white rounded-[12px] border border-[#000] border-l-[4px] border-l-[#C04040]"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="flex items-start gap-3 mb-2">
              <span className="text-[12px] font-bold flex-shrink-0 mt-0.5" style={{ fontFamily: "var(--font-display)", color: "#000" }}>
                {i + 1}.
              </span>
              <div className="flex-1">
                <p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{m.exercise.question}</p>
              </div>
            </div>
            <div className="ml-7 flex flex-col gap-1">
              <p className="text-[12px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
                你的答案：<span className="text-[#C04040] font-bold">{m.wrongAnswer}</span>
              </p>
              <p className="text-[12px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>
                正确答案：<span className="text-[#388e3c] font-bold">{Array.isArray(m.exercise.answer) ? m.exercise.answer.join(", ") : m.exercise.answer}</span>
              </p>
              <p className="text-[10px] text-[#000] m-0 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>
                {m.courseTitle} · {m.date}
              </p>
            </div>
          </motion.div>
        ))
      )}
    </div>
  );

  /* === Todos tab === */
  const pendingTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);
  const todosContent = (
    <div className="max-w-2xl space-y-6">
      {/* Add todo input */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="添加新的待办事项..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              setTodos((prev) => [{ id: `t${Date.now()}`, text: e.currentTarget.value.trim(), done: false }, ...prev]);
              e.currentTarget.value = "";
            }
          }}
          className="flex-1 px-4 py-2.5 rounded-[10px] border border-[#000] text-[14px] text-[#000] outline-none"
          style={{ fontFamily: "var(--font-serif)" }}
        />
      </div>

      {/* Pending */}
      {pendingTodos.length > 0 && (
        <div>
          <h3 className="text-[14px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            待完成 ({pendingTodos.length})
          </h3>
          <div className="space-y-2">
            {pendingTodos.map((td) => (
              <motion.div key={td.id} className="flex items-center gap-3 p-3 bg-white rounded-[10px] border border-[#000] cursor-pointer"
                whileHover={{ x: 2 }} onClick={() => toggleTodo(td.id)}>
                <div className="w-5 h-5 rounded-[5px] border-2 border-[#000] flex-shrink-0 flex items-center justify-center">
                  {/* empty checkbox */}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{td.text}</p>
                  {td.course && <p className="text-[11px] text-[#000] m-0 mt-0.5 opacity-50" style={{ fontFamily: "var(--font-serif)" }}>{td.course}</p>}
                </div>
                {td.due && <span className="text-[11px] text-[#000] flex-shrink-0" style={{ fontFamily: "var(--font-display)" }}>{td.due}</span>}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {doneTodos.length > 0 && (
        <div>
          <h3 className="text-[14px] text-[#000] font-bold m-0 mb-3 opacity-40" style={{ fontFamily: "var(--font-serif)" }}>
            已完成 ({doneTodos.length})
          </h3>
          <div className="space-y-1">
            {doneTodos.map((td) => (
              <div key={td.id} className="flex items-center gap-3 p-3 rounded-[10px] cursor-pointer opacity-40"
                onClick={() => toggleTodo(td.id)}>
                <div className="w-5 h-5 rounded-[5px] bg-[#000] flex-shrink-0 flex items-center justify-center">
                  <span className="text-white text-[12px]">✓</span>
                </div>
                <p className="text-[14px] text-[#000] line-through m-0" style={{ fontFamily: "var(--font-serif)" }}>{td.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="text-[28px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>
        {s.nav_desk}
      </h1>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 border-b border-[#ccc]">
        {TABS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-[14px] border-none cursor-pointer transition-colors bg-transparent ${
              tab === key
                ? "text-[#000] font-bold border-b-[3px] border-[#000] -mb-[1px]"
                : "text-[#000] opacity-50 hover:opacity-80"
            }`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {label}{count !== undefined && count > 0 && <span className="ml-1.5 text-[11px] opacity-50">({count})</span>}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {tab === "exercises" && exercisesContent}
          {tab === "mistakes" && mistakesContent}
          {tab === "todos" && todosContent}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
