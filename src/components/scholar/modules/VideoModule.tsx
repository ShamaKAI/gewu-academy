"use client";

import { useState, useRef } from "react";
import type { VideoItem } from "@/data/courses";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface VideoModuleProps {
  videos: VideoItem[];
  s: Record<string, string>;
}

export default function VideoModule({ videos, s }: VideoModuleProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_video}
      </h2>

      {/* Upload button */}
      <button
        onClick={() => alert("上传功能即将开放")}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#666] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        + {s.upload_video}（支持 MP4, MOV, WebM, AVI, MKV）
      </button>

      {videos.length === 0 ? (
        <p className="text-[#999] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>
          暂无课程视频，请上传
        </p>
      ) : (
        <div>
          {/* Video player */}
          <div className="bg-black rounded-[12px] overflow-hidden mb-4">
            <video
              ref={videoRef}
              key={activeIdx}
              src={videos[activeIdx].src}
              controls
              className="w-full max-h-[480px]"
              style={{ background: "#000" }}
            />
          </div>

          {/* Speed control */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] text-[#999]" style={{ fontFamily: "var(--font-serif)" }}>
              {s.playback_speed}:
            </span>
            {SPEEDS.map((sp) => (
              <button
                key={sp}
                onClick={() => handleSpeedChange(sp)}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${
                  speed === sp
                    ? "bg-[#333] text-white border-[#333]"
                    : "bg-white text-[#666] border-[#ccc] hover:border-[#666]"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {sp}×
              </button>
            ))}
          </div>

          {/* Video list */}
          <div className="space-y-2">
            {videos.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setActiveIdx(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-[10px] text-left border cursor-pointer transition-colors ${
                  i === activeIdx
                    ? "bg-[#f0f0f0] border-[#ccc]"
                    : "bg-white border-[#eee] hover:border-[#ccc]"
                }`}
              >
                <span className="text-[18px]">▶</span>
                <span className="text-[14px] text-[#333] font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                  {v.title}
                </span>
                <span className="ml-auto text-[11px] text-[#999] uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  {v.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
