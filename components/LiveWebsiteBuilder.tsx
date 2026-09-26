"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  AnimatePresence,
} from "framer-motion";

/**
 * Visual UI-building showcase: layout blocks, buttons, and wireframes
 * assemble themselves into a finished screen. Aimed at non-technical
 * clients — no source editor, no file tree.
 */

const STAGES = ["canvas", "nav", "hero", "cards", "actions", "done"] as const;
type Stage = (typeof STAGES)[number];

const STAGE_LABEL: Record<Stage, string> = {
  canvas: "Starting with a blank canvas",
  nav: "Placing the navigation",
  hero: "Building the hero section",
  cards: "Assembling the feature cards",
  actions: "Dropping in buttons & CTAs",
  done: "Polishing the finished screen",
};

const LAYERS = [
  { id: "nav", label: "Nav" },
  { id: "hero", label: "Hero" },
  { id: "cards", label: "Cards" },
  { id: "actions", label: "Buttons" },
  { id: "done", label: "Footer" },
] as const;

const HOLD_MS = 1100;
const PAUSE_AT_END_MS = 2200;
const PAUSE_AT_START_MS = 700;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function LiveWebsiteBuilder() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(containerRef, { once: false, margin: "-80px" });
  const [stageIndex, setStageIndex] = useState(reduceMotion ? STAGES.length - 1 : 0);

  useEffect(() => {
    if (reduceMotion || !inView) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    function step(i: number) {
      if (cancelled) return;
      setStageIndex(i);
      const isLast = i === STAGES.length - 1;
      const delay = isLast ? PAUSE_AT_END_MS : i === 0 ? PAUSE_AT_START_MS : HOLD_MS;
      timeout = setTimeout(() => {
        step(isLast ? 0 : i + 1);
      }, delay);
    }

    step(0);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [reduceMotion, inView]);

  const stage = STAGES[stageIndex];
  const stageAt = (s: Stage) => STAGES.indexOf(s) <= STAGES.indexOf(stage);

  return (
    <div ref={containerRef} className="relative">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-ink-faint">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glow-cyan/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-glow-cyan" />
          </span>
          <span className="text-[11px] tracking-wide">
            {reduceMotion ? "Live UI builder" : STAGE_LABEL[stage]}
          </span>
        </div>
        <span className="hidden text-[10px] uppercase tracking-wider text-ink-faint sm:inline">
          Visual build
        </span>
      </div>

      <div className="[perspective:1600px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          animate={
            reduceMotion
              ? undefined
              : {
                  rotateX: [6.5, 5.4, 6.5],
                  rotateY: [-8, -6.5, -8],
                }
          }
          transition={{
            rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative origin-center will-change-transform"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-cyan-500/18 via-indigo-500/10 to-violet-600/18 blur-2xl"
          />

          <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-zinc-950/75 shadow-[0_40px_80px_-28px_rgba(15,23,42,0.9),0_0_0_1px_rgba(34,211,238,0.12)] backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex flex-1 items-center justify-center">
                <span className="rounded-md border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-ink-faint">
                  {stageAt("nav") ? "yourproduct.app" : "New screen"}
                </span>
              </div>
            </div>

            <div className="grid min-h-[18rem] grid-cols-[4.25rem_minmax(0,1fr)] sm:min-h-[22rem]">
              <aside className="border-r border-white/10 bg-black/25 px-2 py-3">
                <p className="mb-2 px-1 text-[9px] uppercase tracking-widest text-ink-faint">
                  Layers
                </p>
                <ul className="space-y-1">
                  {LAYERS.map((layer) => {
                    const visible = stageAt(layer.id as Stage);
                    const current = stage === layer.id;
                    return (
                      <li key={layer.id}>
                        <motion.div
                          initial={false}
                          animate={{
                            opacity: visible ? 1 : 0.28,
                            x: visible ? 0 : -3,
                          }}
                          transition={{ duration: 0.35 }}
                          className="rounded-md px-1.5 py-1 text-[10px]"
                          style={{
                            color: current ? "#22D3EE" : "#8B93A7",
                            backgroundColor: current ? "rgba(34,211,238,0.12)" : "transparent",
                          }}
                        >
                          {layer.label}
                        </motion.div>
                      </li>
                    );
                  })}
                </ul>
              </aside>

              <div className="relative bg-base p-3">
                <div className="relative h-[16rem] overflow-hidden rounded-xl border border-dashed border-white/15 bg-[#08090D] p-3 sm:h-[19.5rem]">
                  <AnimatePresence>
                    {!stageAt("nav") && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 grid grid-cols-6 grid-rows-8 gap-2 p-4 opacity-40"
                      >
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-md border border-white/10 bg-white/[0.02]"
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative z-10 flex h-full flex-col gap-2.5">
                    {stageAt("nav") && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="flex shrink-0 items-center justify-between rounded-lg border border-white/10 bg-zinc-900/90 px-2.5 py-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-3.5 w-3.5 rounded-md bg-gradient-to-br from-cyan-400 to-violet-500" />
                          <span className="h-1.5 w-10 rounded-full bg-white/50" />
                        </div>
                        <div className="flex gap-1.5">
                          <span className="h-1.5 w-7 rounded-full bg-white/20" />
                          <span className="h-1.5 w-7 rounded-full bg-white/20" />
                          <span className="h-4 w-10 rounded-md bg-glow-cyan/35 ring-1 ring-glow-cyan/40" />
                        </div>
                      </motion.div>
                    )}

                    {stageAt("hero") && (
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-cyan-500/12 via-transparent to-violet-600/16 p-3"
                      >
                        <div className="h-2.5 w-[70%] rounded-full bg-white/75" />
                        <div className="mt-2 h-1.5 w-[88%] rounded-full bg-white/18" />
                        <div className="mt-1 h-1.5 w-[55%] rounded-full bg-white/12" />
                        {stageAt("actions") && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 flex gap-2"
                          >
                            <span className="h-6 w-[4.5rem] rounded-md bg-glow-cyan/45 ring-1 ring-glow-cyan/60" />
                            <span className="h-6 w-[4.5rem] rounded-md border border-white/15 bg-white/5" />
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {stageAt("cards") && (
                      <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.1 } },
                        }}
                        className="grid flex-1 grid-cols-3 gap-1.5"
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            variants={{
                              hidden: { opacity: 0, y: 10, scale: 0.92 },
                              show: {
                                opacity: 1,
                                y: 0,
                                scale: 1,
                                transition: { duration: 0.35, ease: EASE },
                              },
                            }}
                            className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-zinc-900/80 p-2"
                          >
                            <div
                              className={`h-8 rounded-md ${
                                ["bg-indigo-500/25", "bg-violet-500/25", "bg-cyan-500/25"][i]
                              }`}
                            />
                            <div className="h-1.5 w-4/5 rounded-full bg-white/25" />
                            <div className="h-1 w-3/5 rounded-full bg-white/12" />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}

                    {stageAt("done") && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-auto flex shrink-0 items-center justify-between rounded-md border-t border-white/10 pt-2"
                      >
                        <div className="h-1.5 w-16 rounded-full bg-white/15" />
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-glow-cyan/70" />
                          <div className="h-2 w-2 rounded-full bg-glow-violet/70" />
                          <div className="h-2 w-2 rounded-full bg-glow-indigo/70" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
