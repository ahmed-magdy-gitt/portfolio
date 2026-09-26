"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Masked, word-by-word (or character-by-character) text reveal.
 *
 * Each unit sits in an `overflow-hidden` wrapper and slides up from below it,
 * so the text appears to rise out of the baseline rather than just fading in.
 * The wrapper carries the stagger; individual units only describe their own
 * motion, which keeps nested reveals (headline -> subhead -> bio) in sync.
 *
 * Word mode is the default for prose. Character mode is for short strings —
 * a wordmark, a headline's first line — where per-letter timing reads as a
 * more deliberate "typing on" rather than a paragraph settling into place.
 * Because this component never sets its own color or background, it can be
 * nested inside a parent that paints a gradient through `background-clip:
 * text` (e.g. the header logo) without breaking that gradient: the clip
 * still applies to every descendant glyph, animated or not.
 *
 * When the visitor prefers reduced motion the text renders immediately with
 * no transform, so the copy is never withheld behind an animation.
 */

const unitVariants: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

interface TextRevealProps {
  text: string;
  className?: string;
  /** Seconds between each word/character. Use a smaller value for long paragraphs or char mode. */
  stagger?: number;
  /** Seconds to wait before the first unit moves. */
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
  /** Split the text into words (default) or individual characters. */
  splitBy?: "word" | "char";
  /**
   * Trigger the stagger when the element scrolls into view instead of on
   * mount. Used for headings that sit well below the fold, so the reveal
   * plays as the visitor reaches the section rather than having already
   * finished offscreen. Fires once.
   */
  inView?: boolean;
  /** Margin passed to the viewport check when `inView` is set. */
  viewportMargin?: string;
}

export default function TextReveal({
  text,
  className,
  stagger = 0.05,
  delay = 0,
  as = "p",
  splitBy = "word",
  inView = false,
  viewportMargin = "-80px",
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  // Cast to a single concrete motion component: indexing `motion` with a union
  // of tag names produces a union of component types that JSX can't narrow.
  const MotionTag = motion[as] as typeof motion.p;

  if (reduceMotion) {
    return <MotionTag className={className}>{text}</MotionTag>;
  }

  const units = splitBy === "char" ? Array.from(text) : text.split(" ");

  const triggerProps = inView
    ? { whileInView: "show", viewport: { once: true, margin: viewportMargin } }
    : { animate: "show" };

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      initial="hidden"
      {...triggerProps}
    >
      {units.map((unit, i) => (
        // The extra vertical padding stops descenders (g, y, p) from being
        // clipped by the mask, and the negative margin cancels the space it
        // would otherwise add to the line box.
        <span
          key={`${unit}-${i}`}
          className={cn(
            "inline-flex overflow-hidden pb-[0.14em] mb-[-0.14em] align-bottom"
          )}
        >
          <motion.span variants={unitVariants} className="inline-block">
            {/* A bare space collapses in a flex wrapper, so give it a hair
                of width to render as a real gap between characters. */}
            {unit === " " ? "\u00A0" : unit}
          </motion.span>
          {/* After each word (not character) add a real space so native
              wrapping and text selection stay intact. */}
          {splitBy === "word" && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </MotionTag>
  );
}
