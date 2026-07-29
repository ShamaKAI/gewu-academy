"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/i18n/useTranslation";

interface LoginModalProps { open: boolean; role: string; onClose: () => void; }

const VALID_STUDENT = "gwxy2026";
const VALID_PASS_STUDENT = "2026gwxy";
const VALID_MENTOR = "AAG000001";
const VALID_PASS_MENTOR = "AAG000001.gwxy";

export default function LoginModal({ open, role, onClose }: LoginModalProps) {
  const { t, locale } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "student") {
      if (username === VALID_STUDENT && password === VALID_PASS_STUDENT) {
        setError("");
        router.push(`/${locale}/scholar`);
      } else {
        setError(t.landing.login_error);
      }
    } else if (role === "mentor") {
      if (username === VALID_MENTOR && password === VALID_PASS_MENTOR) {
        setError("");
        localStorage.setItem("gewu-mentor-id", "qiyun");
        router.push(`/${locale}/mentor`);
      } else {
        setError(t.landing.login_error);
      }
    } else if (role === "alumni") {
      if (username === VALID_STUDENT && password === VALID_PASS_STUDENT) {
        setError("");
        router.push(`/${locale}/alumni`);
      } else {
        setError(t.landing.login_error);
      }
    } else if (role === "dean") {
      if (username === VALID_STUDENT && password === VALID_PASS_STUDENT) {
        setError("");
        router.push(`/${locale}/dean`);
      } else {
        setError(t.landing.login_error);
      }
    }
  };

  const isLoginable = role === "student" || role === "mentor" || role === "alumni" || role === "dean";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
          data-overlay
          onClick={(e) => { if ((e.target as HTMLElement).dataset.overlay) onClose(); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          style={{ background: "rgba(0,0,0,0.08)", backdropFilter: "blur(2px)" }}
        >
          <motion.div
            className="bg-white rounded-[24px] p-10 w-[456px] max-w-[90vw]"
            style={{ boxShadow: "0 4px 40px rgba(0,0,0,0.08)" }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <h3 className="text-[26px] text-[#000] tracking-[calc(var(--ls-scale)*4px)] text-center mb-8" style={{ fontFamily: "var(--font-calligraphy)" }}>
              {role === "student" ? t.landing.login_title
                : role === "mentor" ? t.landing.login_title_mentor || "先生登录"
                : role === "alumni" ? t.landing.login_title_alumni || "同窗登录"
                : role === "dean" ? t.landing.login_title_dean || "山长登录"
                : t.landing.coming_soon}
            </h3>
            {isLoginable ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[15px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>{t.landing.username}</label>
                  <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }}
                    className="w-full h-11 px-4 border border-[#000] rounded-[12px] text-[18px] text-[#000] outline-none transition-colors focus:border-[#000]"
                    style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }} autoFocus />
                </div>
                <div>
                  <label className="block text-[15px] text-[#000] tracking-[calc(var(--ls-scale)*2px)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>{t.landing.password}</label>
                  <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="w-full h-11 px-4 border border-[#000] rounded-[12px] text-[18px] text-[#000] outline-none transition-colors focus:border-[#000]"
                    style={{ fontFamily: "var(--font-serif)", background: "#fafaf7" }} />
                </div>
                {error && <p className="text-[15px] text-[#b33a3a] text-center m-0" style={{ fontFamily: "var(--font-serif)" }}>{error}</p>}
                <button type="submit" className="w-full h-11 bg-[#1a1a1a] text-white rounded-[12px] text-[18px] tracking-[calc(var(--ls-scale)*3px)] cursor-pointer transition-colors hover:bg-[#333] mt-2"
                  style={{ fontFamily: "var(--font-serif)", border: "none" }}>{t.landing.login_btn}</button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-[18px] text-[#000] tracking-[calc(var(--ls-scale)*3px)]" style={{ fontFamily: "var(--font-serif)" }}>{t.landing.coming_soon}</p>
                <button onClick={onClose} className="mt-6 px-8 py-2.5 bg-transparent border border-[#000] rounded-[12px] text-[15px] text-[#000] cursor-pointer hover:border-[#000] transition-colors tracking-[calc(var(--ls-scale)*2px)]"
                  style={{ fontFamily: "var(--font-serif)" }}>关闭</button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
