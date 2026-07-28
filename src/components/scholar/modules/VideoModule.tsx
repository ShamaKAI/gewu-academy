"use client";

import { useState, useRef } from "react";
import type { VideoItem } from "@/data/courses";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

interface VideoModuleProps {
  videos: VideoItem[];
  s: Record<string, string>;
}

/** Render text with Chinese → KaiTi, English/digits → Times New Roman */
function MixedFont({ text, className = "", style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const segments: { text: string; isChinese: boolean }[] = [];
  let cur = "";
  let curIs: boolean | null = null;
  for (const ch of text) {
    const is = /[一-鿿]/.test(ch);
    if (curIs === null) { curIs = is; cur = ch; }
    else if (is === curIs) { cur += ch; }
    else { segments.push({ text: cur, isChinese: curIs }); cur = ch; curIs = is; }
  }
  if (cur) segments.push({ text: cur, isChinese: curIs ?? false });
  return (
    <span className={className} style={style}>
      {segments.map((seg, i) => (
        <span key={i} style={{ fontFamily: seg.isChinese ? "'KaiTi','STKaiti','楷体',serif" : "'Times New Roman',serif" }}>
          {seg.text}
        </span>
      ))}
    </span>
  );
}

export default function VideoModule({ videos, s }: VideoModuleProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [userVideos, setUserVideos] = useState<VideoItem[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allVideos = [...videos, ...userVideos];

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
      const newVideo: VideoItem = {
        id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        title: file.name,
        src: url,
        type: ext,
      };
      setUserVideos((prev) => {
        const updated = [...prev, newVideo];
        setActiveIdx(videos.length + updated.length - 1);
        return updated;
      });
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const deleteUserVideo = (id: string) => {
    setUserVideos((prev) => {
      const idx = prev.findIndex((v) => v.id === id);
      const next = prev.filter((v) => v.id !== id);
      if (activeIdx >= videos.length + idx && next.length > 0) {
        setActiveIdx(Math.max(0, videos.length + Math.min(idx, next.length - 1)));
      } else if (next.length === 0 && videos.length > 0) {
        setActiveIdx(0);
      }
      return next;
    });
    // Revoke blob URL
    const vid = userVideos.find((v) => v.id === id);
    if (vid) URL.revokeObjectURL(vid.src);
  };

  return (
    <div>
      <h2 className="text-[20px] text-[#000] font-bold m-0 mb-5 tracking-[calc(var(--ls-scale)*2px)]"
        style={{ fontFamily: "var(--font-serif)" }}>
        {s.tab_video}
      </h2>

      <input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,.mp4,.webm,.mov,.avi,.mkv" multiple onChange={handleFileChange} className="hidden" />

      <button onClick={handleUploadClick}
        className="mb-5 px-5 py-2.5 border border-dashed border-[#ccc] rounded-[10px] text-[13px] text-[#000] bg-[#fafafa] cursor-pointer hover:border-[#999] hover:text-[#333] transition-colors">
        <MixedFont text={`+ ${s.upload_video}（MP4, MOV, WebM, AVI, MKV）`} />
      </button>

      {allVideos.length === 0 ? (
        <p className="text-[#000] text-[14px] py-8" style={{ fontFamily: "var(--font-serif)" }}>暂无课程视频，请上传</p>
      ) : (
        <div>
          <div className="bg-black rounded-[12px] overflow-hidden mb-4">
            <video ref={videoRef} key={activeIdx} src={allVideos[activeIdx]?.src} controls
              className="w-full max-h-[480px]" style={{ background: "#000" }} />
          </div>

          <div className="flex items-center gap-2 mb-5">
            <span className="text-[12px] text-[#000]" style={{ fontFamily: "var(--font-serif)" }}>{s.playback_speed}:</span>
            {SPEEDS.map((sp) => (
              <button key={sp} onClick={() => handleSpeedChange(sp)}
                className={`px-2.5 py-1 rounded-[6px] text-[12px] border cursor-pointer transition-colors ${speed === sp ? "bg-[#333] text-white border-[#333]" : "bg-white text-[#000] border-[#ccc] hover:border-[#666]"}`}
                style={{ fontFamily: "var(--font-display)" }}>{sp}×</button>
            ))}
          </div>

          <div className="space-y-2">
            {allVideos.map((v, i) => {
              const isUser = userVideos.some((uv) => uv.id === v.id);
              return (
                <div key={v.id}
                  className={`flex items-center gap-3 p-3 rounded-[10px] border cursor-pointer transition-colors ${i === activeIdx ? "bg-[#f0f0f0] border-[#ccc]" : "bg-white border-[#eee] hover:border-[#ccc]"}`}
                  onClick={() => setActiveIdx(i)}>
                  <span className="text-[18px]">▶</span>
                  <span className="flex-1 text-[14px] text-[#333] font-bold truncate" style={{ fontFamily: "var(--font-serif)" }}><MixedFont text={v.title} /></span>
                  <span className="text-[11px] text-[#000] uppercase" style={{ fontFamily: "var(--font-display)" }}>{v.type}</span>
                  {isUser && (
                    <button onClick={(ev) => { ev.stopPropagation(); deleteUserVideo(v.id); }}
                      className="ml-2 w-6 h-6 rounded-full bg-[#fee] text-[#C04040] text-[14px] border-none cursor-pointer hover:bg-[#fcc] transition-colors flex items-center justify-center leading-none">×</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
