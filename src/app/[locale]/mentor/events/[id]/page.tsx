"use client";
import { useParams } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { newsItems } from "@/data/news";

export default function EventDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const s = (t.mentor as Record<string, string>) || {};
  const event = newsItems.find((n) => n.id === params?.id);

  if (!event) return <div className="px-10 py-8"><p className="text-[#000]">活动不存在</p></div>;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>{event.title}</h1>
      <div className="grid grid-cols-2 gap-3 mb-6 max-w-2xl">
        {event.host && <InfoBlock label="主讲" value={event.host} />}
        {event.time && <InfoBlock label="时间" value={event.time} />}
        {event.location && <InfoBlock label="地点" value={event.location} />}
        {event.registeredCount !== undefined && <InfoBlock label="参与人数" value={`${event.registeredCount} 人`} />}
      </div>
      <div className="p-6 bg-[#fafafa] rounded-[14px] border border-[#000] max-w-2xl">
        <p className="text-[14px] text-[#000] leading-relaxed m-0" style={{ fontFamily: "var(--font-serif)", whiteSpace: "pre-wrap" }}>{event.content}</p>
      </div>
    </motion.div>
  );
}
function InfoBlock({ label, value }: { label: string; value: string }) {
  return <div className="p-4 bg-[#fafafa] rounded-[10px] border border-[#000]"><p className="text-[11px] text-[#000] opacity-50 m-0 mb-1" style={{ fontFamily: "var(--font-serif)" }}>{label}</p><p className="text-[14px] text-[#000] font-bold m-0" style={{ fontFamily: "var(--font-serif)" }}>{value}</p></div>;
}
