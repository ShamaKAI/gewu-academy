"use client";

import { useState } from "react";
import type { ReviewItem } from "@/data/courses";

interface ReviewModuleProps {
  reviews: ReviewItem[];
  s: Record<string, string>;
}

export default function ReviewModule({ reviews, s }: ReviewModuleProps) {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <div>
      <h3 className="text-[18px] font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_review}
      </h3>

      {/* Existing reviews */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <p className="text-[13px] text-[#999] mb-3" style={{ fontFamily: "var(--font-serif)" }}>
            {s.reviews_existing} ({reviews.length})
          </p>
          <div className="flex flex-col gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="border border-[#eee] rounded-[8px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-bold text-[#333]" style={{ fontFamily: "var(--font-serif)" }}>
                    {review.userName}
                  </span>
                  <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
                    {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.date}
                  </span>
                </div>
                <p className="text-[13px] text-[#555]" style={{ fontFamily: "var(--font-serif)" }}>
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New review form */}
      <div className="border border-[#eee] rounded-[8px] p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[13px] text-[#666]" style={{ fontFamily: "var(--font-serif)" }}>
            {s.rating_label || "评分"}:
          </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="bg-transparent border-none cursor-pointer text-[18px]"
            >
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
        <textarea
          className="w-full border border-[#ddd] rounded-[4px] px-3 py-2 text-[13px] resize-none"
          style={{ fontFamily: "var(--font-serif)", minHeight: "80px" }}
          placeholder={s.write_review}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-[#333] text-white rounded-[6px] text-[13px] border-none cursor-pointer hover:bg-[#555] transition-colors"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {s.submit_review}
        </button>
      </div>
    </div>
  );
}
