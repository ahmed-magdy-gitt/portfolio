"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import TextReveal from "./TextReveal";

export default function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center"
      )}
    >
      {kicker && (
        <div
          className={cn(
            "mb-3 flex items-center gap-2 text-sm text-glow-indigo",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-6 bg-glow-indigo/60" />
          {kicker}
        </div>
      )}
      {/* Word-by-word rise, gated on the heading itself entering the
          viewport (not the parent fade above), so headings further down
          the page still get their own stagger rather than firing early. */}
      <TextReveal
        as="h2"
        text={title}
        inView
        stagger={0.045}
        className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
      />
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </motion.div>
  );
}
