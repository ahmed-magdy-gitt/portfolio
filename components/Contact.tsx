"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  Phone,
  MessageCircle,
  Github,
  Linkedin,
  Copy,
  Check,
  ArrowUpRight,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/lib/data";
import { copyToClipboard } from "@/lib/clipboard";
import { useTilt } from "@/lib/useTilt";
import SectionHeading from "./SectionHeading";
import TextReveal from "./TextReveal";

/* ------------------------------------------------------------------ *
 * Channel styling
 *
 * Tailwind only sees class names it can find as complete literals, so each
 * accent is written out in full here rather than assembled from fragments
 * at render time.
 * ------------------------------------------------------------------ */

type Accent = "cyan" | "indigo" | "whatsapp" | "linkedin" | "violet";

const accents: Record<Accent, { icon: string; hover: string; ring: string; glow: string }> = {
  cyan: {
    icon: "text-cyan-300",
    hover: "hover:border-cyan-400/70",
    ring: "group-hover:shadow-[0_0_10px_1px_rgba(34,211,238,0.28),0_16px_36px_-18px_rgba(34,211,238,0.4)]",
    glow: "bg-cyan-400",
  },
  indigo: {
    icon: "text-indigo-300",
    hover: "hover:border-indigo-400/70",
    ring: "group-hover:shadow-[0_0_10px_1px_rgba(99,102,241,0.28),0_16px_36px_-18px_rgba(99,102,241,0.4)]",
    glow: "bg-indigo-400",
  },
  whatsapp: {
    icon: "text-[#25D366]",
    hover: "hover:border-[#25D366]/70",
    ring: "group-hover:shadow-[0_0_10px_1px_rgba(37,211,102,0.28),0_16px_36px_-18px_rgba(37,211,102,0.4)]",
    glow: "bg-[#25D366]",
  },
  linkedin: {
    icon: "text-[#4DA3FF]",
    hover: "hover:border-[#4DA3FF]/70",
    ring: "group-hover:shadow-[0_0_10px_1px_rgba(77,163,255,0.28),0_16px_36px_-18px_rgba(77,163,255,0.4)]",
    glow: "bg-[#4DA3FF]",
  },
  violet: {
    icon: "text-purple-300",
    hover: "hover:border-purple-500/70",
    ring: "group-hover:shadow-[0_0_10px_1px_rgba(168,85,247,0.28),0_16px_36px_-18px_rgba(168,85,247,0.4)]",
    glow: "bg-purple-500",
  },
};

const cardBase =
  "group relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 backdrop-blur-md transition-[border-color,box-shadow] duration-300";

/* ------------------------------------------------------------------ *
 * Toast
 * ------------------------------------------------------------------ */

interface ToastState {
  /** Bumped on every copy so repeat copies restart the dismiss timer. */
  id: number;
  message: string;
  ok: boolean;
}

function Toast({ toast }: { toast: ToastState | null }) {
  return (
    // aria-live sits on the always-mounted wrapper, not the toast itself:
    // a live region has to exist before its content changes to be announced.
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm backdrop-blur-xl ${
              toast.ok
                ? "border-cyan-400/40 bg-zinc-900/80 text-ink shadow-[0_0_30px_-10px_rgba(34,211,238,0.7)]"
                : "border-red-500/40 bg-zinc-900/80 text-ink shadow-[0_0_30px_-10px_rgba(239,68,68,0.7)]"
            }`}
          >
            <span className={toast.ok ? "text-cyan-300" : "text-red-400"}>
              {toast.ok ? <Check size={15} /> : <AlertCircle size={15} />}
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Cards
 * ------------------------------------------------------------------ */

function CardShell({
  accent,
  className = "",
  children,
}: {
  accent: Accent;
  className?: string;
  children: ReactNode;
}) {
  const tilt = useTilt({ max: 8 });

  return (
    <motion.div
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 320, damping: 14, mass: 0.7 }}
      style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, transformPerspective: 1000 }}
      className="group relative h-full"
    >
      {/* Blurred neon halo — sits behind the card, outside its clipped
          border, so the brand-colored glow actually spreads past the edges
          instead of being cut off by the card's own overflow-hidden.
          Kept low-opacity and tightly blurred so it reads as a soft ambient
          lift rather than a neon sign. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute -inset-1.5 rounded-[28px] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${accents[accent].glow}`}
      />
      <div className={`${cardBase} ${accents[accent].hover} ${accents[accent].ring} ${className}`}>
        {children}
      </div>
    </motion.div>
  );
}

function ChannelHeader({
  icon: Icon,
  accent,
  label,
  value,
  mono = false,
}: {
  icon: LucideIcon;
  accent: Accent;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 transition-transform duration-300 group-hover:scale-110 ${accents[accent].icon}`}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-ink-faint">{label}</span>
        {/* break-all so a long address wraps instead of overflowing the card */}
        <span
          className={`block break-all text-sm text-ink ${mono ? "mono-tag" : ""}`}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

function CopyButton({
  onCopy,
  copied,
  children,
}: {
  onCopy: () => void;
  copied: boolean;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onCopy}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-300 hover:border-purple-500/50 hover:text-purple-200"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.15 }}
          className="flex"
        >
          {copied ? <Check size={13} className="text-cyan-300" /> : <Copy size={13} />}
        </motion.span>
      </AnimatePresence>
      {typeof children === "string" ? (
        <TextReveal as="span" text={children} splitBy="char" stagger={0.015} />
      ) : (
        children
      )}
    </motion.button>
  );
}

function LinkAction({
  href,
  accent,
  children,
}: {
  href: string;
  accent: Accent;
  children: ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`group/link inline-flex items-center gap-1.5 rounded-full border border-zinc-700/70 bg-zinc-800/60 px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-300 ${accents[accent].hover}`}
    >
      {typeof children === "string" ? (
        <TextReveal as="span" text={children} splitBy="char" stagger={0.015} />
      ) : (
        children
      )}
      <ArrowUpRight
        size={13}
        className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
      />
    </motion.a>
  );
}

/* ------------------------------------------------------------------ *
 * Network visualizer
 *
 * A background SVG that draws a line between every pair of contact cards,
 * with small pulses travelling along each line. Positions are measured
 * from the DOM (not layout math) so the lines stay correct across
 * breakpoints and while the entrance animation is still settling.
 * ------------------------------------------------------------------ */

const NODE_IDS = ["email", "phone", "linkedin", "github"] as const;
type NodeId = (typeof NODE_IDS)[number];

const NODE_COLORS: Record<NodeId, string> = {
  email: "#22d3ee",
  phone: "#818cf8",
  linkedin: "#4DA3FF",
  github: "#c084fc",
};

/** Every unordered pair of nodes — a full mesh so all five cards read as one network. */
const EDGES: [NodeId, NodeId][] = NODE_IDS.flatMap((a, i) =>
  NODE_IDS.slice(i + 1).map((b) => [a, b] as [NodeId, NodeId])
);

type Point = { x: number; y: number };

function NetworkCanvas({
  containerRef,
  nodeRefs,
  hovered,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  nodeRefs: React.RefObject<Record<string, HTMLDivElement | null>>;
  hovered: NodeId | null;
}) {
  const [positions, setPositions] = useState<Partial<Record<NodeId, Point>>>({});

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const next: Partial<Record<NodeId, Point>> = {};
    for (const id of NODE_IDS) {
      const el = nodeRefs.current?.[id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[id] = {
        x: r.left + r.width / 2 - containerRect.left,
        y: r.top + r.height / 2 - containerRect.top,
      };
    }
    setPositions(next);
  }, [containerRef, nodeRefs]);

  useEffect(() => {
    // Re-measure on every frame for ~1.5s to track the staggered entrance
    // animation, then settle down to resize-driven measurements only.
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      measure();
      if (now - start < 1500) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    const ro = containerRef.current ? new ResizeObserver(onResize) : null;
    if (ro && containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
    };
  }, [measure, containerRef]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <filter id="contact-net-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {EDGES.map(([a, b], i) => (
          <linearGradient
            key={`grad-${i}`}
            id={`contact-net-grad-${i}`}
            gradientUnits="userSpaceOnUse"
            x1={positions[a]?.x ?? 0}
            y1={positions[a]?.y ?? 0}
            x2={positions[b]?.x ?? 0}
            y2={positions[b]?.y ?? 0}
          >
            <stop offset="0%" stopColor={NODE_COLORS[a]} />
            <stop offset="100%" stopColor={NODE_COLORS[b]} />
          </linearGradient>
        ))}
      </defs>

      {EDGES.map(([a, b], i) => {
        const p1 = positions[a];
        const p2 = positions[b];
        if (!p1 || !p2) return null;
        const active = hovered === a || hovered === b;
        return (
          <line
            key={`edge-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke={`url(#contact-net-grad-${i})`}
            strokeWidth={active ? 1.75 : 1}
            opacity={active ? 0.85 : hovered ? 0.08 : 0.22}
            filter={active ? "url(#contact-net-glow)" : undefined}
            style={{ transition: "opacity 300ms ease, stroke-width 300ms ease" }}
          />
        );
      })}

      {EDGES.map(([a, b], i) => {
        const p1 = positions[a];
        const p2 = positions[b];
        if (!p1 || !p2) return null;
        const active = hovered === a || hovered === b;
        const path = `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
        const dur = active ? 1.6 : 3.4;
        return (
          <circle
            key={`pulse-${i}`}
            r={active ? 2.6 : 1.6}
            fill={NODE_COLORS[a]}
            filter="url(#contact-net-glow)"
            opacity={active ? 0.95 : 0.45}
            style={{ transition: "opacity 300ms ease, r 300ms ease" }}
          >
            <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={path} begin={`${i * 0.35}s`} />
            <animate
              attributeName="opacity"
              values={active ? "0;0.95;0.95;0" : "0;0.45;0.45;0"}
              dur={`${dur}s`}
              repeatCount="indefinite"
              begin={`${i * 0.35}s`}
            />
          </circle>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Section
 * ------------------------------------------------------------------ */

const reveal = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function Contact() {
  const [toast, setToast] = useState<ToastState | null>(null);
  /** Which value was copied most recently, for the per-button tick. */
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  /** Which channel card is hovered, driving the network line highlight. */
  const [hoveredNode, setHoveredNode] = useState<NodeId | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const bindNode = useCallback(
    (id: NodeId) => (el: HTMLDivElement | null) => {
      nodeRefs.current[id] = el;
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!copiedKey) return;
    const id = window.setTimeout(() => setCopiedKey(null), 2000);
    return () => window.clearTimeout(id);
  }, [copiedKey]);

  const copy = useCallback(async (key: string, value: string, label: string) => {
    try {
      await copyToClipboard(value);
      setCopiedKey(key);
      setToast({ id: Date.now(), message: `${label} copied to clipboard`, ok: true });
    } catch {
      setCopiedKey(null);
      setToast({
        id: Date.now(),
        message: `Couldn't copy — select and copy ${value} manually`,
        ok: false,
      });
    }
  }, []);

  return (
    <section id="contact" className="mx-auto max-w-content px-6 py-24 md:px-10">
      <SectionHeading
        kicker="Contact"
        title="Let's Build Something Together"
        description="Pick whichever channel suits you — email and WhatsApp are the fastest ways to reach me."
      />

      <div ref={gridRef} className="relative">
        <NetworkCanvas containerRef={gridRef} nodeRefs={nodeRefs} hovered={hoveredNode} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.07 }}
          className="relative grid gap-4 sm:grid-cols-2"
        >
        {/* Email — the primary channel, so it spans the full width. */}
        <motion.div
          ref={bindNode("email")}
          onMouseEnter={() => setHoveredNode("email")}
          onMouseLeave={() => setHoveredNode(null)}
          variants={reveal}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="sm:col-span-2"
        >
          {/* Wider than it is tall, so on sm+ the actions move beside the
              address instead of leaving the right half of the card empty. */}
          <CardShell accent="cyan" className="sm:flex-row sm:items-center sm:justify-between">
            <ChannelHeader
              icon={Mail}
              accent="cyan"
              label="Email"
              value={profile.email}
              mono
            />
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                copied={copiedKey === "email"}
                onCopy={() => copy("email", profile.email, "Email address")}
              >
                Copy email
              </CopyButton>
              <LinkAction href={`mailto:${profile.email}`} accent="cyan">
                Open mail app
              </LinkAction>
            </div>
          </CardShell>
        </motion.div>

        {/* Phone & WhatsApp — merged into one card since they're the same
            number: copy it, call it, or open a WhatsApp chat with it. */}
        <motion.div
          ref={bindNode("phone")}
          onMouseEnter={() => setHoveredNode("phone")}
          onMouseLeave={() => setHoveredNode(null)}
          variants={reveal}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="sm:col-span-2"
        >
          <CardShell accent="indigo" className="sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              {/* Phone glyph with a small WhatsApp badge riding its corner,
                  so the merged card still reads as "two ways in" at a glance. */}
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-indigo-300 transition-transform duration-300 group-hover:scale-110">
                <Phone size={18} />
                <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-950 bg-zinc-900 text-[#25D366]">
                  <MessageCircle size={11} />
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-ink-faint">Phone &amp; WhatsApp</span>
                <span className="mono-tag block break-all text-sm text-ink">{profile.phone}</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CopyButton
                copied={copiedKey === "phone"}
                onCopy={() => copy("phone", profile.phone, "Phone number")}
              >
                Copy number
              </CopyButton>
              <LinkAction href={`tel:${profile.phone}`} accent="indigo">
                Call
              </LinkAction>
              <LinkAction href={profile.whatsapp} accent="whatsapp">
                WhatsApp
              </LinkAction>
            </div>
          </CardShell>
        </motion.div>

        {/* LinkedIn */}
        <motion.div
          ref={bindNode("linkedin")}
          onMouseEnter={() => setHoveredNode("linkedin")}
          onMouseLeave={() => setHoveredNode(null)}
          variants={reveal}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <CardShell accent="linkedin">
            <ChannelHeader
              icon={Linkedin}
              accent="linkedin"
              label="LinkedIn"
              value="Connect professionally"
            />
            <div className="flex flex-wrap items-center gap-2">
              <LinkAction href={profile.linkedin} accent="linkedin">
                View profile
              </LinkAction>
            </div>
          </CardShell>
        </motion.div>

        {/* GitHub */}
        <motion.div
          ref={bindNode("github")}
          onMouseEnter={() => setHoveredNode("github")}
          onMouseLeave={() => setHoveredNode(null)}
          variants={reveal}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <CardShell accent="violet">
            <ChannelHeader
              icon={Github}
              accent="violet"
              label="GitHub"
              value="Browse the source"
            />
            <div className="flex flex-wrap items-center gap-2">
              <LinkAction href={profile.github} accent="violet">
                View repositories
              </LinkAction>
            </div>
          </CardShell>
        </motion.div>
        </motion.div>
      </div>

      <Toast toast={toast} />
    </section>
  );
}
