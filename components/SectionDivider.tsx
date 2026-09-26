"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Glowing section seam that opens as it enters the viewport and
 * contracts as it leaves — driven by scroll progress, not a one-shot
 * whileInView.
 */
export default function SectionDivider() {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.92", "end 0.08"],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0.06, 1, 1, 0.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.15, 1, 1, 0.15]);
  const dotScale = useTransform(scrollYProgress, [0, 0.32, 0.68, 1], [0.4, 1, 1, 0.4]);

  return (
    <div
      ref={ref}
      className="relative mx-auto max-w-content px-6 py-2 md:px-10"
      aria-hidden="true"
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { scaleX, opacity, transformOrigin: "50% 50%" }
        }
        className="relative origin-center"
      >
        <div className="absolute inset-x-6 -top-2.5 h-6 rounded-full bg-gradient-to-r from-glow-cyan via-glow-indigo to-glow-violet bg-[length:200%_100%] opacity-25 blur-xl animate-gradient-pan md:inset-x-16" />

        <div className="relative h-px w-full overflow-hidden rounded-full bg-gradient-to-r from-transparent via-zinc-700/70 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-glow-cyan via-glow-indigo to-glow-violet bg-[length:200%_100%] opacity-70 animate-gradient-pan" />
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-[1px] animate-divider-sweep" />
        </div>

        <motion.span
          style={reduceMotion ? undefined : { scale: dotScale }}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-glow-cyan shadow-[0_0_12px_3px_rgba(34,211,238,0.65)] animate-pulse-soft"
        />
      </motion.div>
    </div>
  );
}
