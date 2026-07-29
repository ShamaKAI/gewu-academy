"use client";

import { useTranslation } from "@/i18n/useTranslation";
import { motion, type Variants } from "framer-motion";

const dividerVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface RoleCardProps {
  name: string;
  icon: string;
  desc: string[];
  onClick?: (e: React.MouseEvent) => void;
}

function RoleCard({ name, icon, desc, onClick }: RoleCardProps) {
  return (
    <motion.div
      className="group flex flex-col items-center justify-center text-center cursor-pointer bg-white rounded-[28px] border border-transparent select-auto"
      style={{
        width: "clamp(220px, 20vw, 300px)",
        minHeight: "220px",
        padding: "38px 28px 32px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      whileHover={{ y: -8, borderColor: "#1a1a1a", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
      whileTap={{ y: -4, transition: { duration: 0.1 } }}
      onClick={onClick}
      role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick?.(e as unknown as React.MouseEvent); }}
    >
      <img src={icon} alt={name} className="w-16 h-16 object-contain mb-2 opacity-80" />
      <h3 className="text-[31px] text-[#000] tracking-[calc(var(--ls-scale)*6px)] mb-3 m-0" style={{ fontFamily: "var(--font-calligraphy)" }}>{name}</h3>
      {desc.map((line, i) => (
        <p key={i} className="text-[15px] text-[#000] tracking-[calc(var(--ls-scale)*3px)] leading-loose m-0 font-bold" style={{ fontFamily: "var(--font-serif)" }}>{line}</p>
      ))}
      <div className="w-[36px] h-px bg-[#000] mt-3 transition-all duration-300 group-hover:w-[60px] group-hover:bg-[#000]" />
    </motion.div>
  );
}

interface RoleCardsProps {
  visible: boolean;
  onSelectRole: (role: string, x: number, y: number) => void;
}

export default function RoleCards({ visible, onSelectRole }: RoleCardsProps) {
  const { t } = useTranslation();

  const roles = [
    { role: "student", icon: "/icon-1.png" },
    { role: "mentor", icon: "/icon-2.png" },
    { role: "dean", icon: "/icon-3.png" },
    { role: "alumni", icon: "/alumina.png" },
  ];

  const getDesc = (role: string) => {
    const landing = t.landing as Record<string, string>;
    return [landing[`role_${role}_desc1`], landing[`role_${role}_desc2`]];
  };
  const getName = (role: string) => (t.landing as Record<string, string>)[`role_${role}`];

  return (
    <div className="flex flex-col items-center gap-7 z-30 pointer-events-auto mt-8">
      <motion.div className="flex items-center" variants={dividerVariants} initial="hidden" animate={visible ? "visible" : "hidden"}>
        <span className="w-[60px] h-px bg-[#000]" />
        <span className="text-[15px] text-[#000] tracking-[calc(var(--ls-scale)*4px)] px-4 whitespace-nowrap font-bold" style={{ fontFamily: "var(--font-serif)" }}>
          {t.landing.chooseRole}
        </span>
        <span className="w-[60px] h-px bg-[#000]" />
      </motion.div>
      <motion.div className="flex gap-5 max-md:flex-col max-md:gap-3" initial="hidden" animate={visible ? "visible" : "hidden"} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        {roles.map(({ role, icon }) => (
          <motion.div key={role} variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
            <RoleCard name={getName(role)} icon={icon} desc={getDesc(role)} onClick={(e) => onSelectRole(role, e.clientX, e.clientY)} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
