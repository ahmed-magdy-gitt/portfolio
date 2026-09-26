"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Home as HomeIcon,
  Search,
  TrendingUp,
  User,
} from "lucide-react";

type PreviewKind = "phone" | "browser" | "architecture";

export interface PreviewSlide {
  title: string;
  caption: string;
  image?: string;
  kind: PreviewKind;
  /** Layer/service labels used only by architecture (terminal) slides. */
  layers?: string[];
}

const EASE = [0.16, 1, 0.3, 1] as const;
const ROTATE_MS = 3200;

export default function ServicePreviewMockup({
  slides,
  accent,
}: {
  slides: PreviewSlide[];
  accent: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [reduceMotion, slides.length]);

  const slide = slides[index];

  return (
    <div
      className="relative flex h-[380px] flex-col rounded-2xl p-2.5"
      style={{
        background: `linear-gradient(135deg, ${accent}20, transparent 60%)`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.04)`,
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-ink">
            {slide.title}
          </p>
          <p className="truncate text-[11px] text-ink-faint">{slide.caption}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Show ${s.title}`}
              onClick={() => setIndex(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 18 : 6,
                backgroundColor: i === index ? accent : "rgba(91,98,116,0.7)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="flex h-full w-full items-center justify-center"
          >
            {slide.kind === "phone" && (
              <PhoneFrame slide={slide} accent={accent} index={index} />
            )}
            {slide.kind === "browser" && <BrowserFrame slide={slide} accent={accent} />}
            {slide.kind === "architecture" && (
              <TerminalFrame slide={slide} accent={accent} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone — realistic size, dynamic island, real Tailwind app screen   */
/* ------------------------------------------------------------------ */

function PhoneFrame({
  slide,
  accent,
  index,
}: {
  slide: PreviewSlide;
  accent: string;
  index: number;
}) {
  // Rotates which nav item reads as "active" so consecutive slides don't
  // look like a frozen screenshot of the exact same screen state.
  const activeNav = index % 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto h-[380px] w-[190px] shrink-0 overflow-hidden rounded-[2.25rem] border border-white/10 bg-zinc-950 p-2 shadow-2xl sm:h-[400px] sm:w-[200px]"
      style={{ boxShadow: `0 24px 60px -18px ${accent}55` }}
    >
      {/* Dynamic island */}
      <div className="absolute left-1/2 top-2.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

      <div className="relative h-full overflow-hidden rounded-[1.85rem] border border-white/5 bg-zinc-950">
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 text-[9px] font-medium text-white/70">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <span className="h-1 w-1 rounded-full bg-white/60" />
            <span className="h-1 w-1 rounded-full bg-white/60" />
            <span className="h-1 w-2 rounded-sm bg-white/60" />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              Welcome back
            </p>
            <p className="text-[13px] font-semibold text-white">{slide.title}</p>
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Bell size={12} className="text-white/70" />
          </span>
        </div>

        {/* Search */}
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5">
          <Search size={11} className="text-white/40" />
          <span className="h-1.5 w-20 rounded-full bg-white/10" />
        </div>

        {/* Hero stat card with animated bars */}
        <div
          className="mx-4 mt-3 rounded-2xl border border-white/10 p-3"
          style={{ background: `linear-gradient(135deg, ${accent}30, rgba(255,255,255,0.03))` }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">
              {slide.caption}
            </p>
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
            />
          </div>
          <p className="mt-1 text-lg font-semibold text-white">$2,480.00</p>
          <div className="mt-2.5 flex h-8 items-end gap-1">
            {[6, 10, 7, 14, 9, 16, 11].map((h, i) => (
              <motion.span
                key={i}
                className="w-2 rounded-t-sm"
                style={{ backgroundColor: `${accent}99` }}
                animate={{ height: [h * 1.4, h * 2.2, h * 1.4] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        {/* Order rows */}
        <div className="mx-4 mt-3 space-y-1.5">
          {["Order #A231", "Order #A230"].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-2.5 py-2"
            >
              <div>
                <p className="text-[10px] font-medium text-white">{label}</p>
                <p className="text-[8px] text-white/40">Completed</p>
              </div>
              <span className="h-1.5 w-8 rounded-full bg-white/10" />
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-white/10 bg-zinc-950/95 px-4 py-2.5 backdrop-blur-sm">
          {[HomeIcon, TrendingUp, User].map((Icon, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: activeNav === i ? `${accent}22` : "transparent",
                color: activeNav === i ? accent : "rgba(255,255,255,0.35)",
              }}
            >
              <Icon size={13} />
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Browser — macOS-style chrome, real dashboard UI                    */
/* ------------------------------------------------------------------ */

function BrowserFrame({ slide, accent }: { slide: PreviewSlide; accent: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl"
      style={{ boxShadow: `0 24px 50px -18px ${accent}66` }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-900/80 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 flex-1 truncate rounded-md bg-zinc-800 px-2 py-0.5 text-center font-mono text-[10px] text-ink-faint">
          {slide.title.toLowerCase().replace(/\s+/g, "-")}.ahmedmagdy.dev
        </span>
      </div>

      <div className="relative flex aspect-[16/10] overflow-hidden bg-zinc-900">
        {/* Sidebar */}
        <aside className="hidden w-20 shrink-0 border-r border-white/10 bg-zinc-950/60 p-2.5 sm:block">
          <div className="h-2 w-10 rounded-full bg-white/15" />
          <div className="mt-4 space-y-2">
            {["Overview", "Orders", "Users", "Settings"].map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-md px-1.5 py-1"
                style={
                  i === 0
                    ? { backgroundColor: `${accent}22`, color: accent }
                    : { color: "rgba(255,255,255,0.35)" }
                }
              >
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="text-[7px]">{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 p-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="h-2 w-10 rounded-full" style={{ backgroundColor: accent }} />
              <div className="h-2 w-16 rounded-full bg-white/10" />
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-6 rounded-full bg-white/10" />
              <div className="h-2 w-12 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-2.5">
              <div className="flex items-center justify-between">
                <span className="h-2 w-10 rounded-full bg-white/15" />
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
              </div>
              <div
                className="mt-3 h-14 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${accent}55, rgba(255,255,255,0.06))` }}
              />
            </div>
            <div className="w-24 rounded-xl border border-white/10 bg-white/5 p-2.5">
              <div className="h-2 w-10 rounded-full bg-white/15" />
              <div className="mt-3 flex h-14 items-end gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{ backgroundColor: i % 2 === 0 ? accent : "rgba(255,255,255,0.18)" }}
                    animate={{ height: [12 + i * 3, 24 + i * 4, 12 + i * 3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3.1, repeat: Infinity, delay: i * 0.2 }}
                className="rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <div
                  className="h-10 rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${accent}44, rgba(255,255,255,0.04))` }}
                />
                <div className="mt-2 h-1.5 w-3/4 rounded-full bg-white/10" />
                <div className="mt-1 h-1.5 w-1/2 rounded-full bg-white/10" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Terminal — service boot log driven by the same `layers` prop       */
/* ------------------------------------------------------------------ */

function TerminalFrame({ slide, accent }: { slide: PreviewSlide; accent: string }) {
  const layers = slide.layers ?? ["Client", "Gateway", "Services", "Data"];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-[#0b0f17] shadow-2xl"
      style={{ boxShadow: `0 24px 50px -18px ${accent}66` }}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-zinc-950/90 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-2 truncate font-mono text-[10px] text-ink-faint">
          {slide.title.toLowerCase().replace(/\s+/g, "-")} — boot.log
        </span>
      </div>

      <div className="space-y-2 p-4 font-mono text-[10.5px] leading-relaxed text-zinc-300">
        <p className="text-zinc-500">$ {slide.caption.toLowerCase()}</p>

        {layers.map((layer, i) => (
          <motion.div
            key={layer}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
              />
              <span className="text-emerald-400">[OK]</span>
              <span className="text-zinc-200">{layer}</span>
              <span className="text-zinc-600">ready</span>
            </div>
            <div className="ml-3.5 mt-1 h-1 w-40 max-w-full overflow-hidden rounded-full bg-white/5">
              <motion.span
                className="block h-full origin-left rounded-full"
                style={{ backgroundColor: accent }}
                initial={{ scaleX: 0.15 }}
                animate={{ scaleX: [0.15, 0.9, 0.45] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              />
            </div>
          </motion.div>
        ))}

        <div className="flex items-center gap-2 pt-1 text-zinc-500">
          <span className="animate-pulse">▍</span>
        </div>
      </div>
    </motion.div>
  );
}
