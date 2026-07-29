"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  replies: Comment[];
}

const LQ = "“";
const RQ = "”";
const LDQ = "‘";
const RDQ = "’";

const mockComments: Comment[] = [
  {
    id: "c1", author: "张物学", date: "7/28",
    content: `这一节的三纲领讲解非常清晰！请问明明德的第一个${LQ}明${RQ}作动词解，是否在先秦文献中能找到类似的用法佐证？`,
    replies: [
      { id: "r1", author: "王知行", date: "7/28", content: `《荀子·劝学》中有${LQ}明于天人之分${RQ}的用法，其中的${LQ}明${RQ}也是动词性的彰明之义。先秦文献中类似用法相当普遍。`, replies: [] },
      { id: "r2", author: "李文思", date: "7/29", content: `补充一点：《尚书·尧典》中的${LQ}克明俊德${RQ}也是类似的语法结构。`, replies: [] },
    ],
  },
  {
    id: "c2", author: "陈明德", date: "7/25",
    content: `格物致知的工夫论非常精深。我在实际操作中感到很难入手——如何判断自己是否真的${LQ}格${RQ}到了一物之理？有没有具体的实践方法可以参考？`,
    replies: [
      { id: "r3", author: "王阳明", date: "7/26", content: `格物不在事事物物上求，而在心上用功。心之所发便是意，意之所在便是物。正其不正以归于正，就是格物的功夫。建议先从静坐观心开始，每日半小时。`, replies: [] },
    ],
  },
  {
    id: "c3", author: "赵算法", date: "7/20",
    content: "笔记模块的AI总结很实用！不过有个建议——能否让AI生成的内容支持更多自定义选项？比如可以选择总结的详细程度，或者只针对某一个核心概念进行深度拓展。",
    replies: [],
  },
  {
    id: "c4", author: "吴思远", date: "7/18",
    content: `课后习题第五题判断${LQ}止于至善${RQ}是否为最高目标——答案是正确。但我觉得这个命题可以讨论得更深一些，${LQ}至善${RQ}在不同学派中是否存在不同的理解？比如道家对${LQ}至善${RQ}的看法就和儒家完全不同。`,
    replies: [
      { id: "r4", author: "老子风", date: "7/19", content: `说得好。道家不以${LQ}善${RQ}为最高范畴，《道德经》第二章就说${LQ}天下皆知善之为善，斯不善矣${RQ}。道家追求的是自然无为，超越了善恶的二元对立。`, replies: [] },
    ],
  },
];

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const today = new Date();
    setComments((prev) => [{ id: `c${Date.now()}`, author: "我", date: `${today.getMonth()+1}/${today.getDate()}`, content: newComment.trim(), replies: [] }, ...prev]);
    setNewComment("");
  };

  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;
    const today = new Date();
    setComments((prev) => prev.map((c) => {
      if (c.id !== commentId) return c;
      return { ...c, replies: [...c.replies, { id: `r${Date.now()}`, author: "我", date: `${today.getMonth()+1}/${today.getDate()}`, content: replyText.trim(), replies: [] }] };
    }));
    setReplyTo(null); setReplyText("");
  };

  return (
    <div className="mt-10 pt-6 border-t border-[#000] max-w-2xl">
      <h2 className="text-[18px] text-[#000] font-bold m-0 mb-5" style={{ fontFamily: "var(--font-serif)" }}>问答讨论</h2>

      <div className="mb-6">
        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
          placeholder="写下你的问题或想法..." rows={2}
          className="w-full px-4 py-3 rounded-[10px] border border-[#000] text-[14px] text-[#000] outline-none resize-none"
          style={{ fontFamily: "var(--font-serif)" }} />
        <button onClick={handleAddComment} disabled={!newComment.trim()}
          className="mt-2 px-5 py-2.5 rounded-[8px] text-[13px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ fontFamily: "var(--font-serif)" }}>发布</button>
      </div>

      <div className="space-y-5">
        {comments.map((c) => (
          <div key={c.id}>
            <div className="p-4 bg-[#fafafa] rounded-[10px] border border-[#eee]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-[28px] h-[28px] rounded-full bg-[#ddd] flex items-center justify-center text-[10px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{c.author[0]}</div>
                <span className="text-[13px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{c.author}</span>
                <span className="text-[11px] text-[#000] opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>{c.date}</span>
              </div>
              <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)" }}>{c.content}</p>
              <button onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                className="mt-2 text-[12px] text-[#000] bg-transparent border-none cursor-pointer hover:underline opacity-50 hover:opacity-100"
                style={{ fontFamily: "var(--font-serif)" }}>回复</button>
            </div>

            {c.replies.length > 0 && (
              <div className="ml-8 mt-2 space-y-2 border-l-2 border-[#eee] pl-4">
                {c.replies.map((r) => (
                  <div key={r.id} className="p-3 bg-white rounded-[8px] border border-[#eee]">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-[22px] h-[22px] rounded-full bg-[#ddd] flex items-center justify-center text-[9px] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{r.author[0]}</div>
                      <span className="text-[12px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{r.author}</span>
                      <span className="text-[10px] text-[#000] opacity-40" style={{ fontFamily: "'Times New Roman', serif" }}>{r.date}</span>
                    </div>
                    <p className="text-[13px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)" }}>{r.content}</p>
                  </div>
                ))}
              </div>
            )}

            <AnimatePresence>
              {replyTo === c.id && (
                <motion.div className="ml-8 mt-2 flex gap-2" initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}>
                  <input type="text" value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key==="Enter") handleAddReply(c.id); }}
                    placeholder="写回复..." className="flex-1 px-4 py-2 rounded-[8px] border border-[#000] text-[13px] text-[#000] outline-none"
                    style={{ fontFamily:"var(--font-serif)" }} />
                  <button onClick={() => handleAddReply(c.id)} disabled={!replyText.trim()}
                    className="px-4 py-2 rounded-[8px] text-[12px] font-bold border-none cursor-pointer bg-[#000] text-white hover:bg-[#333] disabled:opacity-30"
                    style={{ fontFamily:"var(--font-serif)" }}>发送</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
