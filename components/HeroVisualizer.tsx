"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Smartphone, Monitor, Share2, Cloud, type LucideIcon } from "lucide-react";
import { techGlyphs, type TechGlyphName } from "./TechGlyphs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The SVG and the HTML node buttons share one coordinate space so the
 * absolutely-positioned buttons land exactly on the drawn circles. Node
 * positions are authored in view units and converted to percentages at
 * render time, which keeps the whole thing fluid at any container width.
 * ------------------------------------------------------------------ */

const VIEW_W = 520;
const VIEW_H = 440;
const CENTER = { x: 262, y: 220 };

type NodeId = "mobile" | "web" | "gateway" | "backend";
type Accent = "violet" | "cyan" | "indigo" | "sky";

interface TopologyNode {
  id: NodeId;
  label: string;
  /** Plain-language summary of the node's job, shown in the tooltip. */
  blurb: string;
  x: number;
  y: number;
  icon: LucideIcon;
  accent: Accent;
  /** Brand glyphs that orbit this node and headline its tooltip. */
  tech: TechGlyphName[];
  /** Extra stack detail listed as text chips in the tooltip. */
  stack: string[];
  tooltipSide: "right" | "left" | "top" | "bottom";
  /** id of the portfolio section this node navigates to on click. */
  targetSection: "skills" | "projects" | "experience" | "contact";
}

interface Link {
  id: string;
  from: NodeId;
  to: NodeId;
  /** Curve drawn between the two nodes; packets ride this exact path. */
  d: string;
  /** Number of light packets travelling this link at idle. */
  packets: number;
}

const accentHex: Record<Accent, string> = {
  violet: "#A855F7",
  sky: "#38BDF8",
  indigo: "#6366F1",
  cyan: "#22D3EE",
};

const nodes: TopologyNode[] = [
  {
    id: "mobile",
    label: "Mobile Client",
    blurb: "Cross-platform and native Android screens, driven by BLoC and Compose state.",
    x: 92,
    y: 104,
    icon: Smartphone,
    accent: "violet",
    tech: ["Flutter", "Kotlin"],
    stack: ["Jetpack Compose", "BLoC / Cubit"],
    // Opens upward: outward from the hub and away from every other node,
    // rather than "right" toward the gateway where it used to sit on top
    // of the center node's icon and pulse rings.
    tooltipSide: "top",
    targetSection: "projects",
  },
  {
    id: "web",
    label: "Web Client",
    blurb: "Typed, component-driven front ends built on a utility-first design system.",
    x: 92,
    y: 336,
    icon: Monitor,
    accent: "sky",
    tech: ["React"],
    stack: ["TypeScript", "Tailwind CSS"],
    // Opens downward for the same reason mobile opens upward: outward from
    // the hub, not "right" across the gateway.
    tooltipSide: "bottom",
    targetSection: "projects",
  },
  {
    id: "gateway",
    label: "API Gateway",
    blurb: "Routes every request and checks who is asking before a service ever sees it.",
    x: 262,
    y: 220,
    icon: Share2,
    accent: "indigo",
    tech: [".NET"],
    stack: ["Spring Cloud Gateway", "JWT & RBAC"],
    // Opens downward: the centre node has the whole lower half free, whereas
    // a tooltip above it would cover the mobile branch and its glyphs.
    tooltipSide: "bottom",
    targetSection: "projects",
  },
  {
    id: "backend",
    label: "Cloud Backend",
    blurb: "Containerized services that scale on their own, over SQL and document stores.",
    x: 434,
    y: 220,
    icon: Cloud,
    accent: "cyan",
    tech: ["Java", "Spring"],
    stack: ["Docker", "SQL Server / MongoDB"],
    // Opens rightward, outward past the edge of the diagram — "left" used
    // to swing it back over the gateway node sitting between backend and
    // the rest of the topology.
    tooltipSide: "right",
    targetSection: "projects",
  },
];

const links: Link[] = [
  { id: "mobile-gateway", from: "mobile", to: "gateway", d: "M 92 104 C 168 116 196 150 262 220", packets: 2 },
  { id: "web-gateway", from: "web", to: "gateway", d: "M 92 336 C 168 324 196 290 262 220", packets: 2 },
  { id: "gateway-backend", from: "gateway", to: "backend", d: "M 262 220 C 310 182 386 182 434 220", packets: 2 },
  // The return leg — responses travelling back from the backend — bowed the
  // opposite way so the pair reads as a two-directional channel.
  { id: "backend-gateway", from: "backend", to: "gateway", d: "M 434 220 C 386 258 310 258 262 220", packets: 1 },
];

function nodeById(id: NodeId) {
  return nodes.find((n) => n.id === id) as TopologyNode;
}

/** Positions the floating glyphs on a small arc around their node. */
function glyphOffset(index: number, total: number) {
  const spread = 52;
  const start = -((total - 1) * spread) / 2;
  return start + index * spread;
}

/* ------------------------------------------------------------------ *
 * Ambient layers
 * ------------------------------------------------------------------ */

/** Slowly counter-rotating rings that sit behind the whole topology. */
function OrbitRings() {
  return (
    <g className="pointer-events-none" opacity={0.65}>
      <ellipse
        cx={CENTER.x}
        cy={CENTER.y}
        rx={196}
        ry={150}
        fill="none"
        stroke="url(#orbit-stroke)"
        strokeWidth={1}
        strokeDasharray="7 13"
        className="orbit-slow"
      />
      <ellipse
        cx={CENTER.x}
        cy={CENTER.y}
        rx={148}
        ry={188}
        fill="none"
        stroke="url(#orbit-stroke)"
        strokeWidth={1}
        strokeDasharray="4 10"
        className="orbit-reverse"
      />
      <circle
        cx={CENTER.x}
        cy={CENTER.y}
        r={118}
        fill="none"
        stroke="url(#orbit-stroke)"
        strokeWidth={1.6}
        strokeDasharray="70 270"
        className="orbit-fast"
      />
    </g>
  );
}

/**
 * Light packets riding a link.
 *
 * These use SMIL `animateMotion` rather than a JS-driven transform: the browser
 * runs the motion off the main thread against the exact same path geometry the
 * line is drawn from, so packets stay glued to the curve at any container size
 * without a single React re-render per frame.
 */
function Packets({
  link,
  color,
  active,
  dimmed,
}: {
  link: Link;
  color: string;
  active: boolean;
  dimmed: boolean;
}) {
  const duration = active ? 1.4 : 3.6;

  return (
    <g opacity={dimmed ? 0.25 : 1} className="transition-opacity duration-300">
      {Array.from({ length: link.packets }).map((_, i) => (
        <g key={i}>
          <circle r={active ? 8 : 5.5} fill={color} opacity={0.2} />
          <circle r={active ? 3.4 : 2.3} fill={color} />
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${(i * duration) / link.packets}s`}
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          >
            <mpath href={`#path-${link.id}`} />
          </animateMotion>
        </g>
      ))}
    </g>
  );
}

/** Concentric rings that bloom outward while a node is focused or hovered. */
function PulseRings({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g className="pointer-events-none">
      {[0, 0.55, 1.1].map((delay) => (
        <motion.circle
          key={delay}
          cx={x}
          cy={y}
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          initial={{ r: 30, opacity: 0.55 }}
          animate={{ r: 62, opacity: 0 }}
          transition={{ duration: 1.65, repeat: Infinity, delay, ease: "easeOut" }}
        />
      ))}
    </g>
  );
}

/**
 * One-shot ripple burst fired the instant a node is clicked/tapped.
 *
 * Distinct from `PulseRings` (which loops for as long as a node stays
 * hovered/pinned): this plays exactly once per click, so it reads as direct
 * feedback for the tap itself rather than an ambient "focused" state. Two
 * rings are staggered slightly for a softer, less mechanical bloom, and the
 * whole group unmounts itself via `onAnimationComplete` so repeated clicks
 * on the same node always restart cleanly.
 */
function ClickRipple({
  x,
  y,
  color,
  onDone,
}: {
  x: number;
  y: number;
  color: string;
  onDone: () => void;
}) {
  return (
    <g className="pointer-events-none">
      {[0, 0.12].map((delay, i) => (
        <motion.circle
          key={delay}
          cx={x}
          cy={y}
          fill="none"
          stroke={color}
          strokeWidth={i === 0 ? 2.2 : 1.3}
          initial={{ r: 20, opacity: 0.6 }}
          animate={{ r: 68, opacity: 0 }}
          transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={i === 0 ? onDone : undefined}
        />
      ))}
      {/* A quick inward flash on the node body itself, so the click reads
          instantly before the rings have travelled far outward. */}
      <motion.circle
        cx={x}
        cy={y}
        r={34}
        fill={color}
        initial={{ opacity: 0.4, scale: 0.7 }}
        animate={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function HeroVisualizer() {
  const [hoveredId, setHoveredId] = useState<NodeId | null>(null);
  // Tapping pins a node open, which is the only way to read a tooltip on a
  // touch screen where there is no hover state at all.
  const [pinnedId, setPinnedId] = useState<NodeId | null>(null);
  // A one-shot click ripple, keyed so clicking the same node twice in a row
  // still restarts the animation instead of no-oping on an unchanged key.
  const [clickRipple, setClickRipple] = useState<{ id: NodeId; key: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const activeId = pinnedId ?? hoveredId;
  const activeNode = activeId ? nodeById(activeId) : null;

  const isLinkActive = (link: Link) => activeId === link.from || activeId === link.to;

  /** Smooth-scrolls to the section a node represents, honoring reduced-motion. */
  const scrollToSection = (sectionId: TopologyNode["targetSection"]) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <div className="relative mx-auto w-full max-w-lg select-none">
      {/* Reserved inspect dock — sits fully above the topology so hover
          cards never clip against the Hero overflow, overlap sibling
          nodes, or hide behind the hub. */}
      <div className="relative z-30 mb-3 min-h-[8.75rem]">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 top-0 mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-base-surface/80 backdrop-blur-xl"
              style={{
                boxShadow: `0 0 0 1px ${accentHex[activeNode.accent]}33, 0 24px 60px -18px ${accentHex[activeNode.accent]}99`,
              }}
            >
              <div
                className="h-[3px] w-full"
                style={{
                  background: `linear-gradient(90deg, ${accentHex[activeNode.accent]}, transparent)`,
                }}
              />
              <div className="p-4">
                <div className="flex items-center gap-2">
                  {activeNode.tech.map((tech) => {
                    const { Glyph, color } = techGlyphs[tech];
                    return (
                      <span key={tech} style={{ color }}>
                        <Glyph size={14} />
                      </span>
                    );
                  })}
                  <p className="font-display text-xs font-semibold text-ink">{activeNode.label}</p>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">{activeNode.blurb}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {[...activeNode.tech, ...activeNode.stack].map((tech) => (
                    <span
                      key={tech}
                      className="mono-tag rounded-md border border-white/10 bg-base/40 px-1.5 py-0.5 text-[10px] text-ink-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

    <div
      className="relative mx-auto aspect-[13/11] w-full overflow-visible"
      onClick={() => setPinnedId(null)}
    >
      {/* Ambient backdrop bloom — the one deliberately loud, always-on layer. */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-[40%] bg-gradient-to-br from-cyan-500/20 via-violet-600/12 to-transparent blur-3xl" />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="absolute inset-0 h-full w-full overflow-visible"
        role="img"
        aria-label="Interactive diagram of a distributed system: a mobile client and a web client both reach an API gateway, which forwards traffic to a cloud backend. Data flows continuously between them."
      >
        <defs>
          <pattern id="hv-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(148,163,184,0.07)" strokeWidth="1" />
          </pattern>
          <radialGradient id="hv-grid-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hv-grid-mask">
            <rect width={VIEW_W} height={VIEW_H} fill="url(#hv-grid-fade)" />
          </mask>

          <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6366F1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A855F7" stopOpacity="0.9" />
          </linearGradient>

          {(Object.keys(accentHex) as Accent[]).map((accent) => (
            <radialGradient key={accent} id={`hv-glow-${accent}`}>
              <stop offset="0%" stopColor={accentHex[accent]} stopOpacity={0.5} />
              <stop offset="70%" stopColor={accentHex[accent]} stopOpacity={0.08} />
              <stop offset="100%" stopColor={accentHex[accent]} stopOpacity={0} />
            </radialGradient>
          ))}

          <filter id="hv-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={VIEW_W} height={VIEW_H} fill="url(#hv-grid)" mask="url(#hv-grid-mask)" />

        {!reduceMotion && <OrbitRings />}

        {/* Link curves. The <path> is both the visible edge and the motion
            track the packets above are bound to via <mpath>. */}
        {links.map((link, i) => {
          const active = isLinkActive(link);
          const dimmed = Boolean(activeId) && !active;
          const color = active && activeId ? accentHex[nodeById(activeId).accent] : "#2E3446";

          return (
            <g key={link.id}>
              <motion.path
                id={`path-${link.id}`}
                d={link.d}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: 1,
                  opacity: dimmed ? 0.4 : 1,
                  stroke: color,
                  strokeWidth: active ? 2.4 : 1.4,
                }}
                transition={{
                  pathLength: { duration: 1.1, delay: 0.12 * i, ease: [0.16, 1, 0.3, 1] },
                  default: { duration: 0.35 },
                }}
                filter={active ? "url(#hv-soft-glow)" : undefined}
              />
              {!reduceMotion && (
                <Packets link={link} color={active ? color : "#8B93A7"} active={active} dimmed={dimmed} />
              )}
            </g>
          );
        })}

        {/* Node bodies. The icon and label live in the HTML layer below so they
            stay crisp and keyboard-focusable; only the shapes are drawn here. */}
        {nodes.map((n, i) => {
          const isActive = activeId === n.id;
          const color = accentHex[n.accent];

          return (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={n.y}
                r={54}
                fill={`url(#hv-glow-${n.accent})`}
                className="animate-pulse-soft"
                opacity={isActive ? 1 : 0.5}
              />
              {isActive && !reduceMotion && <PulseRings x={n.x} y={n.y} color={color} />}
              {clickRipple?.id === n.id && (
                <ClickRipple
                  key={clickRipple.key}
                  x={n.x}
                  y={n.y}
                  color={color}
                  onDone={() => setClickRipple((r) => (r?.id === n.id ? null : r))}
                />
              )}
              <motion.circle
                cx={n.x}
                cy={n.y}
                fill="#0B0D13"
                stroke={color}
                initial={{ opacity: 0, r: 18 }}
                animate={{
                  opacity: 1,
                  r: isActive ? 34 : 29,
                  strokeWidth: isActive ? 2.4 : 1.4,
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.45 + i * 0.1 },
                  default: { type: "spring", stiffness: 300, damping: 20 },
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive layer: one button per node, plus its floating glyphs. */}
      {nodes.map((n) => {
        const isActive = activeId === n.id;
        const Icon = n.icon;
        const leftPct = (n.x / VIEW_W) * 100;
        const topPct = (n.y / VIEW_H) * 100;

        return (
          <div
            key={n.id}
            className="absolute"
            style={{ left: `${leftPct}%`, top: `${topPct}%` }}
          >
            {/* Bobbing brand glyphs, arranged on an arc above the node. */}
            {n.tech.map((tech, i) => {
              const { Glyph, color } = techGlyphs[tech];
              return (
                <motion.span
                  key={tech}
                  className="pointer-events-none absolute flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-base-surface/80 backdrop-blur-sm"
                  style={{
                    left: glyphOffset(i, n.tech.length),
                    top: -70,
                    color,
                    transformOrigin: "50% 50%",
                    boxShadow: isActive ? `0 0 16px -2px ${color}` : "none",
                  }}
                  // x lives alongside y/scale as a motion value (rather than a
                  // Tailwind -translate-x-1/2 class) so the bob-and-scale
                  // animation composes into one transform instead of a class
                  // and an inline style fighting over the same CSS property —
                  // that fight was what let the glyph drift off-center.
                  animate={
                    reduceMotion
                      ? { x: "-50%", opacity: 1 }
                      : {
                          x: "-50%",
                          y: [0, -6, 0],
                          opacity: 1,
                          scale: isActive ? 1.15 : 1,
                        }
                  }
                  transition={{
                    y: { duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                    scale: { type: "spring", stiffness: 320, damping: 18 },
                  }}
                  initial={{ x: "-50%", opacity: 0 }}
                >
                  <Glyph size={15} className="shrink-0" />
                </motion.span>
              );
            })}

            <motion.a
              href={`#${n.targetSection}`}
              aria-label={`${n.label}. Built with ${[...n.tech, ...n.stack].join(", ")}. Jumps to the ${n.targetSection} section.`}
              aria-expanded={isActive}
              onMouseEnter={() => setHoveredId(n.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(n.id)}
              onBlur={() => setHoveredId(null)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setPinnedId((p) => (p === n.id ? null : n.id));
                if (!reduceMotion) {
                  setClickRipple((r) => ({ id: n.id, key: (r?.id === n.id ? r.key : 0) + 1 }));
                }
                scrollToSection(n.targetSection);
              }}
              // x/y (not Tailwind's translate-* classes) so Framer Motion owns
              // the whole transform string. Mixing a class-based `transform`
              // with motion's hover/tap scale means whichever writes last wins
              // the `transform` CSS property outright — that's what was
              // dropping the -50%/-50% centering the instant a hover/tap scale
              // kicked in, letting the icon drift off its node and clip past
              // the circular boundary instead of scaling from its own center.
              initial={{ x: "-50%", y: "-50%", scale: 1 }}
              whileHover={{ x: "-50%", y: "-50%", scale: 1.12 }}
              whileTap={{ x: "-50%", y: "-50%", scale: 0.93 }}
              transition={{ type: "spring", stiffness: 400, damping: 16 }}
              style={{ transformOrigin: "50% 50%" }}
              className="absolute left-0 top-0 flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow-cyan/70"
            >
              <span
                className="flex h-full w-full items-center justify-center text-ink transition-colors duration-300"
                style={isActive ? { color: accentHex[n.accent] } : undefined}
              >
                <Icon size={18} className="shrink-0" />
              </span>
            </motion.a>

            {/* Kept outside the button: the button is transformed, which would
                otherwise make it the containing block for this label. */}
            <span
              className={cn(
                "mono-tag pointer-events-none absolute left-0 top-[42px] -translate-x-1/2 whitespace-nowrap text-[10px] transition-colors duration-300",
                !isActive && "text-ink-muted"
              )}
              style={isActive ? { color: accentHex[n.accent] } : undefined}
            >
              {n.label}
            </span>
          </div>
        );
      })}
    </div>
    </div>
  );
}
