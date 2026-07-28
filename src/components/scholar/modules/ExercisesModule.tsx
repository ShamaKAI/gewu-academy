"use client";

import { useState } from "react";
import type { Exercise } from "@/data/courses";

interface ExercisesModuleProps {
  exercises: Exercise[];
  s: Record<string, string>;
}

export default function ExercisesModule({ exercises, s }: ExercisesModuleProps) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSingleChoice = (qId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleMultiChoice = (qId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => {
      const current = (prev[qId] as string[]) || [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [qId]: next };
    });
  };

  const handleTrueFalse = (qId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleFill = (qId: string, value: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    let correct = 0;
    exercises.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;
      if (q.type === "multi") {
        const correctAnswer = q.answer as string[];
        const userArr = userAnswer as string[];
        if (
          correctAnswer.length === userArr.length &&
          correctAnswer.every((a) => userArr.includes(a))
        ) {
          correct++;
        }
      } else {
        if (userAnswer === q.answer) correct++;
      }
    });
    setScore(correct);
    setSubmitted(true);
  };

  const isCorrect = (q: Exercise): boolean => {
    if (!submitted) return false;
    const userAnswer = answers[q.id];
    if (!userAnswer) return false;
    if (q.type === "multi") {
      const correctAnswer = q.answer as string[];
      const userArr = (userAnswer as string[]) || [];
      return (
        correctAnswer.length === userArr.length &&
        correctAnswer.every((a) => userArr.includes(a))
      );
    }
    return userAnswer === q.answer;
  };

  if (exercises.length === 0) {
    return (
      <div>
        <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>
          {s.tab_exercises}
        </h2>
        <p className="text-[#000] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课后习题
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_exercises}
      </h2>

      {/* Score */}
      {submitted && score !== null && (
        <div className="mb-6 p-5 bg-[#f7f7f7] rounded-[12px] border border-[#eee]">
          <p className="text-[16px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>
            {s.exercise_score}: {score} / {exercises.length}
            <span className="text-[14px] text-[#000] font-normal ml-2">
              ({Math.round((score / exercises.length) * 100)}%)
            </span>
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6 max-w-2xl">
        {exercises.map((q, i) => {
          const correct = isCorrect(q);
          return (
            <div
              key={q.id}
              className={`p-5 rounded-[12px] border ${
                submitted
                  ? correct
                    ? "bg-[#f5faf5] border-[#d4edda]"
                    : "bg-[#fef5f5] border-[#fecaca]"
                  : "bg-white border-[#eee]"
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-3 mb-3">
                <span
                  className="text-[12px] text-[#000] flex-shrink-0 mt-0.5 font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {i + 1}.
                </span>
                <div className="flex-1">
                  <p className="text-[14px] text-[#333] font-bold m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                    {q.question}
                  </p>
                  <span
                    className="text-[10px] px-2 py-[2px] rounded-[4px]"
                    style={{
                      fontFamily: "var(--font-serif)",
                      background: "#eee",
                      color: "#000",
                    }}
                  >
                    {q.type === "single"
                      ? "单选题"
                      : q.type === "multi"
                        ? "多选题"
                        : q.type === "truefalse"
                          ? "判断题"
                          : "填空题"}
                  </span>
                </div>
              </div>

              {/* Options */}
              {q.type === "fill" ? (
                <input
                  type="text"
                  disabled={submitted}
                  value={(answers[q.id] as string) || ""}
                  onChange={(e) => handleFill(q.id, e.target.value)}
                  placeholder="请输入答案..."
                  className={`w-full px-4 py-2.5 rounded-[8px] text-[14px] outline-none transition-colors ${
                    submitted
                      ? correct
                        ? "border border-[#4caf50] bg-[#f5faf5]"
                        : "border border-[#C04040] bg-[#fef5f5]"
                      : "border border-[#ccc] bg-white focus:border-[#666]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                />
              ) : (
                <div className="space-y-1.5 ml-6">
                  {q.options?.map((opt) => {
                    const isSelected =
                      q.type === "multi"
                        ? ((answers[q.id] as string[]) || []).includes(opt)
                        : answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          if (q.type === "multi") handleMultiChoice(q.id, opt);
                          else if (q.type === "truefalse") handleTrueFalse(q.id, opt);
                          else handleSingleChoice(q.id, opt);
                        }}
                        disabled={submitted}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-[8px] text-[14px] text-left border cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-[#e8e8e8] border-[#999] text-[#333] font-bold"
                            : "bg-white border-[#eee] text-[#000] hover:border-[#ccc]"
                        } ${submitted ? "cursor-default" : ""}`}
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            isSelected ? "border-[#333]" : "border-[#ccc]"
                          }`}
                        >
                          {isSelected && <span className="w-2 h-2 rounded-full bg-[#333]" />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Feedback after submit */}
              {submitted && (
                <p
                  className={`text-[13px] m-0 mt-3 ml-6 font-bold ${
                    correct ? "text-[#4caf50]" : "text-[#C04040]"
                  }`}
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {correct
                    ? `✓ ${s.exercise_correct}`
                    : `✗ ${s.exercise_wrong}${Array.isArray(q.answer) ? q.answer.join(", ") : q.answer}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-6 px-8 py-3 bg-[#333] text-white rounded-[10px] text-[14px] font-bold border-none cursor-pointer hover:bg-[#555] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_exercises}
        </button>
      )}

      {submitted && (
        <button
          onClick={() => {
            setAnswers({});
            setSubmitted(false);
            setScore(null);
          }}
          className="mt-6 px-8 py-3 bg-white text-[#000] rounded-[10px] text-[14px] font-bold border border-[#ccc] cursor-pointer hover:border-[#666] hover:text-[#333] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          重新作答
        </button>
      )}
    </div>
  );
}
