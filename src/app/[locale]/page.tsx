"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InkProvider from "@/components/landing/InkProvider";
import InkCanvas from "@/components/landing/InkCanvas";
import BrushArc from "@/components/landing/BrushArc";
import BrandInfo from "@/components/landing/BrandInfo";
import RoleCards from "@/components/landing/RoleCards";
import LangSwitch from "@/components/landing/LangSwitch";
import LoginModal from "@/components/landing/LoginModal";

const logoVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export default function LandingPage() {
  const [phase, setPhase] = useState<"loading" | "logo" | "brand" | "cards" | "done">("loading");
  const [loginRole, setLoginRole] = useState<string | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("logo"), 500);
    const t2 = setTimeout(() => setPhase("brand"), 800);
    const t3 = setTimeout(() => setPhase("cards"), 1500);
    const t4 = setTimeout(() => setPhase("done"), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleSelectRole = useCallback((role: string) => {
    setLoginRole(role);
  }, []);

  const showLogo = phase !== "loading";
  const showBrand = phase === "brand" || phase === "cards" || phase === "done";
  const showCards = phase === "cards" || phase === "done";

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#ffffff",
      overflow: "hidden",
      cursor: "crosshair",
      touchAction: "none",
      userSelect: "none",
      WebkitUserSelect: "none",
    }}>
    <InkProvider>
      <BrushArc />
      <InkCanvas />

      {/* Language switch: fixed top-right */}
      <LangSwitch className="fixed top-8 right-10" />

      {/* Loading */}
      <AnimatePresence>
        {phase === "loading" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "#ffffff" }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeOut" } }}
          >
            <motion.div
              className="w-1 h-1 rounded-full bg-[#1a1a1a]"
              animate={{ scale: [1, 2.5, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo top-left */}
      <motion.div
        className="fixed top-8 left-10 z-30 pointer-events-none"
        variants={logoVariants}
        initial="hidden"
        animate={showLogo ? "visible" : "hidden"}
      >
        <h1
          className="text-[21px] text-[#000] tracking-[calc(var(--ls-scale)*4px)] leading-relaxed m-0"
          style={{ fontFamily: "var(--font-calligraphy)" }}
        >
          格物学院
        </h1>
        <p
          className="text-[12px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] uppercase mt-0.5 m-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          GEWU ACADEMY
        </p>
      </motion.div>

      {/* Center: brand + cards */}
      <div className="fixed inset-0 z-30 flex flex-col items-center justify-center pointer-events-none">
        <BrandInfo visible={showBrand} />
        <RoleCards visible={showCards} onSelectRole={handleSelectRole} />
      </div>

      <LoginModal
        open={loginRole !== null}
        role={loginRole ?? ""}
        onClose={() => setLoginRole(null)}
      />
    </InkProvider>
    </div>
  );
}
