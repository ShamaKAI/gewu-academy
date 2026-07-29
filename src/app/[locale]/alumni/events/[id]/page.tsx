"use client";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { newsItems } from "@/data/news";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const s = (t.alumni as Record<string, string>) || {};
  const item = newsItems.find((n) => n.id === params?.id);

  if (!item) return <div className="px-10 py-8"><p className="text-[#000]">活动不存在</p></div>;

  const statusLabel = item.status === "upcoming" ? "即将开始" : item.status === "ongoing" ? "进行中" : "已结束";
  const statusColor = item.status === "upcoming" ? "#5B8C85" : item.status === "ongoing" ? "#2563eb" : "#888";

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0 }}>
      <button onClick={() => router.back()} className="text-[14px] text-[#000] bg-transparent border-none cursor-pointer mb-6" style={{ fontFamily: "var(--font-serif)" }}>← 返回雅集</button>
      <div className="max-w-3xl">
        <div className="relative rounded-[16px] overflow-hidden mb-6 border-2 border-[#000]" style={{ maxHeight: 280 }}>
          <img src={item.cover} alt={item.title} className="w-full object-cover" style={{ maxHeight: 280 }} />
          <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
            {item.status && <span className="text-[12px] px-3 py-[3px] rounded-[5px] font-bold text-white" style={{ background: statusColor, fontFamily: "var(--font-serif)" }}>{statusLabel}</span>}
            <h1 className="text-[24px] text-white font-bold m-0 mt-2" style={{ fontFamily: "var(--font-serif)" }}>{item.title}</h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {item.host && <Info label="主讲人" v={item.host} />}
          {item.time && <Info label="时间" v={item.time} />}
          {item.location && <Info label="地点" v={item.location} />}
          {item.registeredCount !== undefined && <Info label="参与人数" v={`${item.registeredCount} 人`} />}
        </div>
        <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000] mb-6">
          <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", whiteSpace: "pre-wrap" }}>{item.content}</p>
        </div>
        {item.feedback && item.feedback.length > 0 && (
          <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000]">
            <h2 className="text-[16px] text-[#000] font-bold m-0 mb-3" style={{ fontFamily: "var(--font-serif)" }}>活动评价 ({item.feedback.length})</h2>
            {item.feedback.map((fb, i) => (
              <div key={i} className="p-3 bg-white rounded-[8px] border border-[#eee] mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] text-[#000] font-bold" style={{ fontFamily: "var(--font-serif)" }}>{fb.author}</span>
                  <span className="text-[12px] text-[#C5A46D]">{fb.rating}★</span>
                  <span className="text-[10px] text-[#000] opacity-40 ml-auto">{fb.date}</span>
                </div>
                <p className="text-[13px] text-[#000] m-0" style={{ fontFamily: "var(--font-serif)" }}>{fb.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
function Info({ label, v }: { label: string; v: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[10px] border border-[#000]"><p className="text-[11px] text-[#000] opacity-50 m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p><p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{v}</p></div>;
}
