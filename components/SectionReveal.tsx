"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps a whole page section so it fades up and gently scales in as it
 * enters the viewport, instead of just appearing. Individual pieces inside
 * a section (headings, cards) already stagger themselves on their own
 * `whileInView` triggers — this adds the outer "section arrives" beat that
 * ties the page's scroll rhythm together.
 */
export default function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Extra delay in seconds, for staggering adjacent sections slightly. */
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-140px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
