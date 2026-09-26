"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Github, ExternalLink, Store, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryAccent, categoryIcon, categoryPlaceholder } from "@/lib/constants";
import { useTilt } from "@/lib/useTilt";
import { cn } from "@/lib/utils";
import TextReveal from "./TextReveal";
import DeviceFrame from "./DeviceFrame";

// Snappier than an ambient carousel would be, since this only runs while
// someone is actively hovering the card to preview the screenshots.
const HOVER_AUTOPLAY_MS = 1600;
// Three fits on one line in the compact layout; the rest collapse to a "+n".
const KEY_TECH_LIMIT = 3;

/** Badges cascade in behind the card itself rather than all at once. */
const badgeRow: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const badge: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 420, damping: 24 } },
};

/** Horizontal slide for the screenshot carousel, direction-aware. */
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 36 : -36 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -36 : 36 }),
};

export default function ProjectCard({
  project,
  index = 0,
  onOpen,
}: {
  project: Project;
  /** Position in the grid, used to stagger the scroll-in reveal. */
  index?: number;
  onOpen: (project: Project) => void;
}) {
  const accent = categoryAccent[project.category];
  const Icon = categoryIcon[project.category];
  const images = project.images ?? [];
  const reduceMotion = useReducedMotion();
  const tilt = useTilt({ max: 6 });

  // Slide index paired with the direction it arrived from, so the outgoing
  // image exits the opposite way to the incoming one.
  const [[slideIndex, direction], setSlide] = useState<[number, number]>([0, 1]);
  const [failed, setFailed] = useState<boolean[]>(() => images.map(() => false));
  const [hovered, setHovered] = useState(false);
  // Each screenshot's true width/height ratio, measured once it loads. Lets
  // the frame around it be shaped to match — the actual fix for pillarboxing
  // rather than just centering the image inside a fixed-ratio box.
  const [ratios, setRatios] = useState<Record<number, number>>({});

  const validCount = failed.filter((f) => !f).length;
  const showPlaceholder = images.length === 0 || validCount === 0;
  const canCycle = !showPlaceholder && validCount > 1;

  useEffect(() => {
    if (!canCycle || !hovered) return;
    const id = window.setInterval(() => {
      setSlide(([i]) => {
        const len = images.length;
        for (let step = 1; step <= len; step++) {
          const next = (i + step) % len;
          if (!failed[next]) return [next, 1];
        }
        return [i, 1];
      });
    }, HOVER_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [canCycle, hovered, images.length, failed]);

  const handleImageError = (i: number) => {
    setFailed((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const handleImageLoad = (i: number, e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    setRatios((prev) =>
      prev[i] ? prev : { ...prev, [i]: naturalWidth / naturalHeight }
    );
  };

  const activeRatio = ratios[slideIndex];
  // Clearly-portrait screenshots (phone apps) get a slim device notch; wider
  // ones (dashboards, browser shots) read better as a plain glass panel.
  const isPhoneLike = (activeRatio ?? 0.5) < 0.68;

  const keyTech = project.techStack.slice(0, KEY_TECH_LIMIT);
  const extraTechCount = project.techStack.length - keyTech.length;

  return (
    // The outer element owns layout + the scroll reveal; the inner one owns
    // the tilt. Keeping them apart stops Framer's layout projection from
    // fighting the rotation transforms during filter changes.
    <motion.article
      layout
      custom={index}
      initial={{ opacity: 0, y: 26, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        delay: reduceMotion ? 0 : (index % 3) * 0.08,
      }}
      className="h-full"
    >
      <motion.div
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={() => {
          tilt.onPointerLeave();
          setHovered(false);
          setSlide([0, 1]);
        }}
        onPointerEnter={() => setHovered(true)}
        onClick={() => onOpen(project)}
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
          transformPerspective: 1000,
        }}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-purple-500/50 hover:shadow-[0_22px_55px_-22px_rgba(168,85,247,0.55)]"
      >
        {/* Outer glow, painted just inside the border so it reads as the card
            lighting up rather than a second ring around it. */}
        <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [box-shadow:inset_0_0_30px_-12px_rgba(168,85,247,0.55)]" />

        {/* Stage background matches the card's own surface (zinc-900) rather
            than a near-black zinc-950. Height increased slightly to give the
            device frame below room to breathe. */}
        <div className="relative h-56 w-full shrink-0 overflow-hidden bg-zinc-900">
          {showPlaceholder ? (
            <div
              className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-2.5 bg-gradient-to-br p-4",
                categoryPlaceholder[project.category]
              )}
            >
              <Icon size={24} className={cn("opacity-70", accent.text)} />
              <div className="flex flex-wrap justify-center gap-1.5">
                {keyTech.map((tech) => (
                  <span
                    key={tech}
                    className="mono-tag rounded-full border border-zinc-700/60 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={slideIndex}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 30 },
                  opacity: { duration: 0.35 },
                }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                {/* Ambient glow: a heavily blurred, oversized copy of the same
                    screenshot fills the whole stage. It reads as colored
                    lighting rather than a picture, so it never competes with
                    the crisp copy in front — and it means the leftover space
                    around a portrait shot is never flat, dead black. */}
                <Image
                  aria-hidden
                  src={images[slideIndex]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="scale-125 object-cover opacity-40 blur-2xl saturate-150"
                  onError={() => handleImageError(slideIndex)}
                />
                <div className="pointer-events-none absolute inset-0 bg-zinc-900/55" />

                {/* Device frame: shaped to this screenshot's own aspect ratio
                    (measured on load), so `object-contain` inside it never
                    needs to pillarbox — the frame IS the image's shape. A
                    full phone mockup is used for portrait shots; wider shots
                    (dashboards, browser views) get a plain glass panel. */}
                <DeviceFrame
                  ratio={activeRatio}
                  isPhoneLike={isPhoneLike}
                  className={!activeRatio ? "w-full" : undefined}
                >
                  <Image
                    src={images[slideIndex]}
                    alt={`${project.title} screenshot ${slideIndex + 1}`}
                    fill
                    sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                    className="object-contain"
                    onLoad={(e) => handleImageLoad(slideIndex, e)}
                    onError={() => handleImageError(slideIndex)}
                  />
                </DeviceFrame>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Slide position, only while the carousel is actually running. */}
          {canCycle && (
            <div className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {images.map((src, i) =>
                failed[i] ? null : (
                  <span
                    key={src}
                    className={cn(
                      "h-1 rounded-full transition-all duration-300",
                      i === slideIndex ? "w-4 bg-purple-400" : "w-1 bg-zinc-600"
                    )}
                  />
                )
              )}
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900/40 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", accent.dot)} />
            <span className={cn("mono-tag text-[11px]", accent.text)}>{project.category}</span>
          </div>

          <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-ink">
            {project.title}
          </h3>
          {project.titleAr && (
            <p className="text-xs text-ink-faint" dir="rtl">
              {project.titleAr}
            </p>
          )}
          <p className="mt-0.5 text-xs text-ink-muted">{project.role}</p>

          {/* Clamped to two lines: the full write-up lives in the case study,
              and an unclamped summary is what made these cards uneven. */}
          <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-ink-muted">
            {project.summary}
          </p>

          <motion.div
            variants={badgeRow}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-3 flex flex-wrap gap-1.5"
          >
            {keyTech.map((tech) => (
              <motion.span
                key={tech}
                variants={badge}
                whileHover={{ scale: 1.08, y: -2 }}
                className="mono-tag cursor-default rounded-full border border-zinc-700/60 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-300 transition-colors duration-300 hover:border-purple-500/50 hover:text-purple-200"
              >
                {tech}
              </motion.span>
            ))}
            {extraTechCount > 0 && (
              <motion.span
                variants={badge}
                className="mono-tag rounded-full border border-zinc-700/60 bg-zinc-800/50 px-2 py-0.5 text-[10px] text-zinc-500"
              >
                +{extraTechCount}
              </motion.span>
            )}
          </motion.div>

          {/* mt-auto pins the action row to the bottom, so cards of differing
              text length still line their buttons up across the grid. The
              gap above it comes from pt-3, not a margin that would fight it. */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/70 pt-3">
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(project);
              }}
              whileHover={{ scale: 1.045 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className="group/cta inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_0_20px_-6px_rgba(168,85,247,0.7)] transition-shadow duration-300 hover:shadow-[0_0_28px_-4px_rgba(168,85,247,0.9)]"
            >
              <TextReveal as="span" text="Case study" stagger={0.02} />
              <ArrowUpRight
                size={12}
                className="transition-transform duration-300 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
              />
            </motion.button>

            {/* Icon-only links: the labels were the other half of the height. */}
            <div className="flex items-center gap-1">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} source code on GitHub`}
                  title="Source code"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-zinc-800/70 hover:text-ink"
                >
                  <Github size={14} />
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} live demo`}
                  title="Live demo"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-zinc-800/70 hover:text-ink"
                >
                  <ExternalLink size={14} />
                </a>
              )}
              {project.links.store && (
                <a
                  href={project.links.store}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} on the Play Store`}
                  title="Play Store"
                  className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-zinc-800/70 hover:text-ink"
                >
                  <Store size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
