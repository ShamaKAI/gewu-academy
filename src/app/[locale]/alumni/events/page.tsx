"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { motion } from "framer-motion";
import { newsItems } from "@/data/news";

export default function EventsPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const s = (t.alumni as Record<string, string>) || {};
  const allItems = newsItems;

  return (
    <motion.div className="px-10 py-8 pb-12" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-[28px] text-[#000] font-bold m-0 mb-8" style={{ fontFamily: "var(--font-serif)" }}>雅集</h1>
      <div className="space-y-4 max-w-3xl">
        {allItems.map((item, i) => (
          <motion.button key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => router.push(`/${locale}/alumni/events/${item.id}`)}
            className="w-full flex gap-5 p-5 bg-white rounded-[14px] border-2 border-[#000] cursor-pointer hover:bg-[#f9f9f9] text-left"
            whileHover={{ y: -1 }}>
            <img src={item.cover} alt={item.title} className="w-[120px] h-[80px] rounded-[8px] object-cover flex-shrink-0 border border-[#eee]" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] px-2 py-[2px] rounded-[4px] font-bold border border-[#000]" style={{ fontFamily: "var(--font-serif)" }}>
                {item.category === "activity" ? "活动" : item.category === "new-course" ? "新课" : "公告"}
              </span>
              <h2 className="text-[16px] text-[#000] font-bold m-0 mt-2" style={{ fontFamily: "var(--font-serif)" }}>{item.title}</h2>
              <p className="text-[12px] text-[#000] opacity-50 m-0 mt-1" style={{ fontFamily: "var(--font-serif)" }}>{item.summary}</p>
            </div>
            <span className="text-[20px] text-[#000] opacity-30 self-center flex-shrink-0">→</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
