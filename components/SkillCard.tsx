"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { Skill, SkillCategory } from "@/lib/types";
import { useTilt } from "@/lib/useTilt";

export type SkillAccent = "indigo" | "cyan" | "violet";

const accentHex: Record<SkillAccent, string> = {
  indigo: "#6366F1",
  cyan: "#22D3EE",
  violet: "#A855F7",
};

const accentStyles: Record<SkillAccent, { icon: string; hoverBadge: string; fill: string }> = {
  indigo: {
    icon: "text-glow-indigo",
    hoverBadge: "hover:border-indigo-500/50 hover:text-indigo-200",
    fill: "linear-gradient(90deg, #6366F1, #818CF8)",
  },
  cyan: {
    icon: "text-glow-cyan",
    hoverBadge: "hover:border-cyan-400/50 hover:text-cyan-200",
    fill: "linear-gradient(90deg, #22D3EE, #67E8F9)",
  },
  violet: {
    icon: "text-glow-violet",
    hoverBadge: "hover:border-purple-500/50 hover:text-purple-200",
    fill: "linear-gradient(90deg, #A855F7, #D8B4FE)",
  },
};

/** Coarse label for the category's average proficiency, shown as a small badge. */
function levelLabel(avg: number) {
  if (avg >= 90) return "Expert";
  if (avg >= 80) return "Advanced";
  if (avg >= 70) return "Proficient";
  return "Familiar";
}

const badgeRow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.12 } },
};

const badge: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 24 } },
};

/**
 * One skill chip: minimal and unfilled at rest — no pre-loaded proficiency
 * gauge — that only comes alive on interaction. Hovering (or tapping, on
 * touch) sweeps in a gradient fill, lifts the chip with a soft glow, and
 * brightens the text, so the "how much" story is told through a reaction
 * rather than a static bar sitting there filled from the first paint.
 */
function SkillChip({ skill, accent }: { skill: Skill; accent: SkillAccent }) {
  const styles = accentStyles[accent];
  const hex = accentHex[accent];

  return (
    <motion.span
      variants={badge}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.97 }}
      title={skill.name}
      className={`mono-tag group/chip relative cursor-default select-none overflow-hidden rounded-full border border-white/10 bg-zinc-800/50 px-2 py-0.5 text-[10px] font-medium text-zinc-300 transition-[border-color,box-shadow,color] duration-300 ease-out ${styles.hoverBadge}`}
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 origin-left opacity-0 transition-opacity duration-300 group-hover/chip:opacity-95"
        style={{ background: styles.fill }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      />
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover/chip:opacity-70"
        style={{ background: hex }}
      />
      <span className="relative flex items-center gap-1.5 transition-colors duration-300 group-hover/chip:text-white">
        <span
          className="h-1 w-1 rounded-full opacity-50 transition-opacity group-hover/chip:opacity-100"
          style={{ backgroundColor: hex, boxShadow: `0 0 6px ${hex}` }}
        />
        {skill.name}
      </span>
    </motion.span>
  );
}

export default function SkillCard({
  category,
  icon: Icon,
  accent,
  index = 0,
}: {
  category: SkillCategory;
  icon: LucideIcon;
  accent: SkillAccent;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();
  const tilt = useTilt({ max: 6 });
  const styles = accentStyles[accent];
  const hex = accentHex[accent];

  const avgLevel = Math.round(
    category.skills.reduce((sum, s) => sum + s.level, 0) / category.skills.length
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        delay: reduceMotion ? 0 : (index % 2) * 0.08,
      }}
      className="h-full"
    >
      <motion.div
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformPerspective: 1000,
        }}
        className="group relative h-full"
      >
        {/* Soft ambient bloom, sitting outside the clipped ring below so it
            can actually spread past the card's edges. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-1.5 rounded-[22px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
          style={{ background: hex }}
        />

        {/* Gradient ring: a 1px padding lets a slowly rotating conic
            gradient show through only as a thin glowing border, rather
            than washing over the whole card. Framer's `rotate` (a plain
            transform) rather than an animated CSS custom property, so the
            spin works identically in every browser without a fallback. */}
        <div className="relative h-full overflow-hidden rounded-xl p-px">
          {!reduceMotion && (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 block h-[240%] w-[240%] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `conic-gradient(from 0deg, ${hex}, transparent 30%, transparent 70%, ${hex})`,
                marginLeft: "-120%",
                marginTop: "-120%",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          )}

          <div className="relative z-10 flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 p-3 backdrop-blur-md transition-colors duration-300 group-hover:border-zinc-700">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/[0.04] to-transparent opacity-70"
            />
            <div className="flex items-start justify-between gap-2">
              <div
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/60 transition-transform duration-300 group-hover:scale-110 ${styles.icon}`}
              >
                <Icon size={14} />
              </div>

              {/* Overall proficiency badge — a quick-read signal before a
                  recruiter has scanned a single chip below it. */}
              <span
                className="mono-tag inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium"
                style={{ borderColor: `${hex}55`, color: hex, backgroundColor: `${hex}14` }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
                {levelLabel(avgLevel)}
              </span>
            </div>

            <h3 className="mt-2 font-display text-[13px] font-semibold leading-snug text-ink">
              {category.name}
            </h3>

            <motion.div
              variants={badgeRow}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="mt-2 flex flex-wrap gap-1"
            >
              {category.skills.map((skill) => (
                <SkillChip key={skill.name} skill={skill} accent={accent} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
