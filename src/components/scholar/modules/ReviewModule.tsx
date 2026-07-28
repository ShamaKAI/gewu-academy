"use client";

import { useState } from "react";
import type { ReviewItem } from "@/data/courses";
import { IconStar } from "@/components/scholar/Icons";

interface ReviewModuleProps {
  reviews: ReviewItem[];
  s: Record<string, string>;
}

export default function ReviewModule({ reviews, s }: ReviewModuleProps) {
  const [myRating, setMyRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allReviews, setAllReviews] = useState<ReviewItem[]>(reviews);

  const submitRating = () => {
    if (myRating === 0) return;
    setRatingSubmitted(true);
    alert(`已提交评分: ${myRating} 星`);
  };

  const submitComment = () => {
    if (!commentText.trim()) return;
    const newReview: ReviewItem = {
      id: `rv-new-${Date.now()}`,
      userName: "我",
      rating: myRating,
      comment: commentText.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    setAllReviews((prev) => [newReview, ...prev]);
    setCommentText("");
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_review}
      </h2>

      {/* Rating section */}
      <div className="mb-8 p-6 bg-[#fafafa] rounded-[12px] border border-[#eee] max-w-md">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          给本课程打分
        </p>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => !ratingSubmitted && setMyRating(star)}
              disabled={ratingSubmitted}
              className="text-[28px] bg-transparent border-none cursor-pointer transition-transform hover:scale-110 disabled:cursor-default"
              style={{
                color: star <= myRating ? "#C5A46D" : "#ddd",
              }}
            >
              <IconStar />
            </button>
          ))}
          {myRating > 0 && (
            <span className="ml-2 text-[14px] font-bold" style={{ color: "#C5A46D", fontFamily: "var(--font-display)" }}>
              {myRating}.0
            </span>
          )}
        </div>
        {!ratingSubmitted ? (
          <button
            onClick={submitRating}
            disabled={myRating === 0}
            className={`px-5 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer transition-colors ${
              myRating === 0
                ? "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
                : "bg-[#333] text-white hover:bg-[#555]"
            }`}
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {s.submit_review}
          </button>
        ) : (
          <p className="text-[13px] text-[#666] m-0" style={{ fontFamily: "var(--font-serif)" }}>
            评分已提交 ✓
          </p>
        )}
      </div>

      {/* Comment section */}
      <div className="max-w-lg mb-6">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          {s.write_review}
        </p>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={s.write_review}
          rows={3}
          className="w-full px-4 py-3 border border-[#ccc] rounded-[10px] text-[14px] text-[#333] outline-none resize-none focus:border-[#666] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        />
        <button
          onClick={submitComment}
          disabled={!commentText.trim()}
          className={`mt-3 px-5 py-2 rounded-[8px] text-[13px] font-bold border-none cursor-pointer transition-colors ${
            !commentText.trim()
              ? "bg-[#e0e0e0] text-[#999] cursor-not-allowed"
              : "bg-[#333] text-white hover:bg-[#555]"
          }`}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_review}
        </button>
      </div>

      {/* Existing reviews */}
      <div className="max-w-lg">
        <p className="text-[15px] text-[#333] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
          {s.reviews_existing} ({allReviews.length})
        </p>
        {allReviews.length === 0 ? (
          <p className="text-[13px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
            暂无评价
          </p>
        ) : (
          <div className="space-y-3">
            {allReviews.map((rv) => (
              <div key={rv.id} className="p-4 bg-white rounded-[10px] border border-[#eee]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[13px] text-[#333] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                    {rv.userName}
                  </span>
                  <span className="inline-flex items-center gap-[1px]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[10px]" style={{ color: s <= rv.rating ? "#C5A46D" : "#ddd" }}>
                        <IconStar />
                      </span>
                    ))}
                  </span>
                  <span className="text-[11px] text-[#999] ml-auto" style={{ fontFamily: "var(--font-display)" }}>
                    {rv.date}
                  </span>
                </div>
                <p className="text-[13px] text-[#666] m-0 leading-relaxed" style={{ fontFamily: "var(--font-serif)" }}>
                  {rv.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
