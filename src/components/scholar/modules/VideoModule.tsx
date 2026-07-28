"use client";

import type { VideoItem } from "@/data/courses";

interface VideoModuleProps {
  videos: VideoItem[];
  s: Record<string, string>;
}

export default function VideoModule({ videos, s }: VideoModuleProps) {
  if (videos.length === 0) {
    return (
      <p className="text-[#999] text-[14px]" style={{ fontFamily: "var(--font-serif)" }}>
        {s.no_courses_found || "暂无视频"}
      </p>
    );
  }

  return (
    <div>
      <h3 className="text-[18px] font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_video}
      </h3>
      <div className="flex flex-col gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border border-[#eee] rounded-[8px] p-4">
            <p className="text-[14px] text-[#333]" style={{ fontFamily: "var(--font-serif)" }}>
              {video.title}
            </p>
            <video
              controls
              className="w-full mt-2 rounded-[4px]"
              src={video.src}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
