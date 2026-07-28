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

  if (exercises.length === 0) {
    return (
      <p className="text-[#999] text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
        {s.no_courses_found || "暂无习题"}
      </p>
    );
  }

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    let correct = 0;
    exercises.forEach((ex) => {
      const userAnswer = answers[ex.id];
      if (!userAnswer) return;
      if (Array.isArray(ex.answer) && Array.isArray(userAnswer)) {
        if (
          ex.answer.length === userAnswer.length &&
          ex.answer.every((a) => userAnswer.includes(a))
        ) {
          correct++;
        }
      } else if (userAnswer === ex.answer) {
        correct++;
      }
    });
    return `${correct}/${exercises.length}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          {s.tab_exercises}
        </h3>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#333] text-white rounded-[6px] text-[13px] border-none cursor-pointer hover:bg-[#555] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_exercises}
        </button>
      </div>

      {submitted && (
        <div className="mb-4 p-3 bg-[#f0f7f0] rounded-[6px]">
          <p className="text-[14px] text-[#333] m-0" style={{ fontFamily: "var(--font-serif)" }}>
            {s.exercise_score}: {getScore()}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {exercises.map((ex, idx) => (
          <div key={ex.id} className="border border-[#eee] rounded-[8px] p-4">
            <p className="text-[14px] text-[#333] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              {idx + 1}. {ex.question}
            </p>
            {ex.type === "single" && ex.options && (
              <div className="flex flex-col gap-2">
                {ex.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-[13px] cursor-pointer"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    <input
                      type="radio"
                      name={ex.id}
                      value={opt}
                      checked={answers[ex.id] === opt}
                      onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {ex.type === "multi" && ex.options && (
              <div className="flex flex-col gap-2">
                {ex.options.map((opt) => {
                  const current = (answers[ex.id] as string[]) || [];
                  return (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-[13px] cursor-pointer"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      <input
                        type="checkbox"
                        checked={current.includes(opt)}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...current, opt]
                            : current.filter((v) => v !== opt);
                          setAnswers({ ...answers, [ex.id]: next });
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            )}
            {ex.type === "truefalse" && (
              <div className="flex flex-col gap-2">
                {["正确", "错误"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 text-[13px] cursor-pointer"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    <input
                      type="radio"
                      name={ex.id}
                      value={opt}
                      checked={answers[ex.id] === opt}
                      onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
            {ex.type === "fill" && (
              <input
                type="text"
                className="border border-[#ddd] rounded-[4px] px-3 py-2 text-[13px] w-full max-w-[400px]"
                style={{ fontFamily: "var(--font-serif)" }}
                placeholder="请输入答案..."
                value={(answers[ex.id] as string) || ""}
                onChange={(e) => setAnswers({ ...answers, [ex.id]: e.target.value })}
              />
            )}
            {submitted && answers[ex.id] && (
              <p
                className={`text-[12px] mt-2 ${answers[ex.id] === ex.answer || (Array.isArray(ex.answer) && Array.isArray(answers[ex.id]) && ex.answer.length === (answers[ex.id] as string[]).length && ex.answer.every((a) => (answers[ex.id] as string[]).includes(a))) ? "text-[#4caf50]" : "text-[#f44336]"}`}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {answers[ex.id] === ex.answer || (Array.isArray(ex.answer) && Array.isArray(answers[ex.id]) && ex.answer.length === (answers[ex.id] as string[]).length && ex.answer.every((a) => (answers[ex.id] as string[]).includes(a)))
                  ? s.exercise_correct
                  : `${s.exercise_wrong}${Array.isArray(ex.answer) ? ex.answer.join(", ") : ex.answer}`}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
