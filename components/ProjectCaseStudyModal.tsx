"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Github,
  ExternalLink,
  Store,
  Boxes,
  Puzzle,
  Sparkles,
  MessageSquareWarning,
} from "lucide-react";
import type { Project } from "@/lib/types";
import { categoryAccent, categoryIcon, categoryPlaceholder } from "@/lib/constants";
import { cn } from "@/lib/utils";
import DeviceFrame from "./DeviceFrame";

export default function ProjectCaseStudyModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<boolean[]>([]);
  // Each screenshot's true width/height ratio, measured once it loads — the
  // frame is shaped to match, so `object-contain` never needs to pillarbox.
  const [ratios, setRatios] = useState<Record<number, number>>({});

  const images = project?.images ?? [];

  useEffect(() => {
    setIndex(0);
    setFailed(images.map(() => false));
    setRatios({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % Math.max(images.length, 1));
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, images.length, onClose]);

  const handleImageLoad = (i: number, e: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (!naturalWidth || !naturalHeight) return;
    setRatios((prev) =>
      prev[i] ? prev : { ...prev, [i]: naturalWidth / naturalHeight }
    );
  };

  const validCount = failed.filter((f) => !f).length;
  const showPlaceholder = images.length === 0 || validCount === 0;
  const activeRatio = ratios[index];
  // Clearly-portrait screenshots (phone apps) get the full phone mockup;
  // wider ones (dashboards, browser shots) read better as a glass panel.
  const isPhoneLike = (activeRatio ?? 0.5) < 0.68;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-base/80 p-4 backdrop-blur-sm md:p-8"
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-base-border"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-base/70 text-ink backdrop-blur-sm transition-colors hover:text-glow-cyan"
            >
              <X size={17} />
            </button>

            <div className="overflow-y-auto">
              <div className="relative h-72 w-full shrink-0 overflow-hidden bg-zinc-900 sm:h-96">
                {showPlaceholder ? (
                  <div
                    className={cn(
                      "flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br p-6",
                      categoryPlaceholder[project.category]
                    )}
                  >
                    {(() => {
                      const Icon = categoryIcon[project.category];
                      return (
                        <Icon
                          size={40}
                          className={cn("opacity-70", categoryAccent[project.category].text)}
                        />
                      );
                    })()}
                    <div className="flex flex-wrap justify-center gap-2">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="mono-tag rounded-md border border-base-border/80 bg-base/40 px-2.5 py-1 text-xs text-ink-muted"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex items-center justify-center p-6 sm:p-8"
                      >
                        {/* Ambient glow: a heavily blurred, oversized copy of
                            the same screenshot fills the whole stage, so the
                            space around the device frame reads as colored
                            lighting rather than flat black. */}
                        <Image
                          aria-hidden
                          src={images[index]}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 768px, 100vw"
                          className="scale-125 object-cover opacity-40 blur-2xl saturate-150"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-zinc-950/55" />

                        {/* Device frame: shaped to this screenshot's own
                            aspect ratio, with a full phone mockup for
                            portrait shots and a glass panel for wider ones. */}
                        <DeviceFrame
                          ratio={activeRatio}
                          isPhoneLike={isPhoneLike}
                          className={!activeRatio ? "w-full" : undefined}
                        >
                          <Image
                            src={images[index]}
                            alt={`${project.title} screenshot ${index + 1}`}
                            fill
                            sizes="(min-width: 768px) 768px, 100vw"
                            className="object-contain"
                            onLoad={(e) => handleImageLoad(index, e)}
                            onError={() =>
                              setFailed((prev) => {
                                const next = [...prev];
                                next[index] = true;
                                return next;
                              })
                            }
                          />
                        </DeviceFrame>
                      </motion.div>
                    </AnimatePresence>

                    {images.length > 1 && (
                      <>
                        <button
                          type="button"
                          aria-label="Previous image"
                          onClick={() =>
                            setIndex((i) => (i - 1 + images.length) % images.length)
                          }
                          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-base/60 text-ink backdrop-blur-sm transition-colors hover:text-glow-cyan"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          aria-label="Next image"
                          onClick={() => setIndex((i) => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-base/60 text-ink backdrop-blur-sm transition-colors hover:text-glow-cyan"
                        >
                          <ChevronRight size={18} />
                        </button>
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              aria-label={`Show image ${i + 1}`}
                              onClick={() => setIndex(i)}
                              className={cn(
                                "h-1.5 rounded-full transition-all",
                                i === index ? "w-5 bg-ink" : "w-1.5 bg-ink/40 hover:bg-ink/70"
                              )}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      categoryAccent[project.category].dot
                    )}
                  />
                  <span
                    className={cn(
                      "mono-tag text-xs",
                      categoryAccent[project.category].text
                    )}
                  >
                    {project.category}
                  </span>
                </div>

                <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {project.title}
                </h2>
                {project.titleAr && (
                  <p className="text-sm text-ink-faint" dir="rtl">
                    {project.titleAr}
                  </p>
                )}
                <p className="mt-1 text-sm text-ink-muted">{project.role}</p>

                {project.highlights.length > 0 && (
                  <section className="mt-6">
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                      <Sparkles size={16} className="text-ink-faint" />
                      Highlights
                    </div>
                    <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
                      {project.highlights.map((point, i) => (
                        <li key={i} className="flex gap-2.5">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {project.caseStudy && (
                  <div className="mt-6 space-y-6">
                    <section>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                        <MessageSquareWarning size={16} className="text-glow-cyan" />
                        Problem
                      </div>
                      <p className="text-sm leading-relaxed text-ink-muted">
                        {project.caseStudy.problem}
                      </p>
                    </section>

                    <section>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                        <Boxes size={16} className="text-glow-indigo" />
                        Architecture
                      </div>
                      <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
                        {project.caseStudy.architecture.map((point, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>

                    <section>
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-ink">
                        <Puzzle size={16} className="text-glow-violet" />
                        Key challenges solved
                      </div>
                      <ul className="space-y-2 text-sm leading-relaxed text-ink-muted">
                        {project.caseStudy.challenges.map((point, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="mono-tag rounded-md border border-base-border bg-base-raised/70 px-2 py-1 text-[11px] text-ink-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="mt-7 flex flex-wrap gap-3 border-t border-base-border/70 pt-5">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-canvas transition-transform hover:-translate-y-0.5"
                    >
                      <Github size={16} />
                      View code
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-base-border px-4 py-2.5 text-sm text-ink transition-colors hover:border-glow-cyan/60 hover:text-glow-cyan"
                    >
                      <ExternalLink size={16} />
                      Live demo
                    </a>
                  )}
                  {project.links.store && (
                    <a
                      href={project.links.store}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-base-border px-4 py-2.5 text-sm text-ink transition-colors hover:border-glow-cyan/60 hover:text-glow-cyan"
                    >
                      <Store size={16} />
                      Play Store
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
