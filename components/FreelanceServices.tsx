"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  Database,
  Globe2,
  Heart,
  Home as HomeIcon,
  Layers,
  Search,
  Send,
  ServerCog,
  ShoppingBag,
  Smartphone,
  Star,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

/* ------------------------------------------------------------------ */
/*  Types & data                                                       */
/* ------------------------------------------------------------------ */

type Accent = "cyan" | "indigo" | "violet";
type ServiceTabId = "flutter" | "kotlin" | "web" | "backend";
type MockupVariant = "phone" | "browser" | "architecture";

interface ServiceTab {
  id: ServiceTabId;
  label: string;
  icon: LucideIcon;
  accent: Accent;
  title: string;
  description: string;
  bullets: string[];
  mockup: MockupVariant;
  /** How many auto-cycling screens this tab's mockup renders. */
  screenCount: number;
}

const accentHex: Record<Accent, string> = {
  cyan: "#22D3EE",
  indigo: "#6366F1",
  violet: "#9B5DE5",
};

const serviceTabs: ServiceTab[] = [
  {
    id: "flutter",
    label: "Flutter",
    icon: Smartphone,
    accent: "cyan",
    title: "Premium cross-platform products for modern mobile brands",
    description:
      "I design and build polished mobile experiences that feel native, convert naturally, and ship fast across iOS and Android.",
    bullets: [
      "Launch-ready app architecture with clean state management",
      "Conversion-focused UX for onboarding, checkout, and engagement",
      "Realtime data flows, notifications, and scalable product polish",
    ],
    mockup: "phone",
    screenCount: 3,
  },
  {
    id: "kotlin",
    label: "Kotlin",
    icon: Layers,
    accent: "indigo",
    title: "Native Android apps built for performance and practicality",
    description:
      "From booking flows to secure member portals, I build Kotlin products that work beautifully on real devices.",
    bullets: [
      "Jetpack-based UI patterns with smooth, device-native interactions",
      "Reliable auth, scheduling logic, and background task handling",
      "Optimized experiences for booking, services, and utility flows",
    ],
    mockup: "phone",
    screenCount: 3,
  },
  {
    id: "web",
    label: "Web",
    icon: Globe2,
    accent: "violet",
    title: "High-converting web products with polished product thinking",
    description:
      "I create scalable dashboards, storefronts, and marketing sites that are visual, intuitive, and business-ready.",
    bullets: [
      "Responsive product design for B2B, SaaS, and service businesses",
      "Clear dashboards, conversion flows, and decision-support UX",
      "Modern frontend architecture that feels premium across devices",
    ],
    mockup: "browser",
    screenCount: 4,
  },
  {
    id: "backend",
    label: "Backend",
    icon: ServerCog,
    accent: "cyan",
    title: "Reliable systems behind product growth and operational scale",
    description:
      "I build secure APIs, service architecture, and infrastructure that keep your product stable, observable, and easy to extend.",
    bullets: [
      "Secure authentication, role access, and scalable API design",
      "Modular microservices for orders, billing, and data flows",
      "Monitoring, health checks, and reliable deployment pipelines",
    ],
    mockup: "architecture",
    screenCount: 3,
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const CYCLE_MS = 3000;

const initialScreenIndex: Record<ServiceTabId, number> = {
  flutter: 0,
  kotlin: 0,
  web: 0,
  backend: 0,
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function FreelanceServices() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<ServiceTabId>("flutter");
  const [screenIndex, setScreenIndex] =
    useState<Record<ServiceTabId, number>>(initialScreenIndex);

  const active = serviceTabs.find((tab) => tab.id === activeTab) ?? serviceTabs[0];

  // Reset the active tab's slideshow to its first screen whenever it becomes active.
  useEffect(() => {
    setScreenIndex((prev) => ({ ...prev, [active.id]: 0 }));
  }, [active.id]);

  // Auto-cycle only the currently visible tab's screens.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setScreenIndex((prev) => ({
        ...prev,
        [active.id]: (prev[active.id] + 1) % active.screenCount,
      }));
    }, CYCLE_MS);

    return () => window.clearInterval(interval);
  }, [active.id, active.screenCount]);

  return (
    <section
      id="freelance"
      className="relative mx-auto max-w-content px-6 py-14 md:px-10 md:py-16"
    >
      <SectionHeading
        kicker="Freelance Services"
        title="What I Can Build For You"
        description="Available for freelance and contract engagements — from a single mobile app to a full-stack product, delivered with the same clean-architecture discipline behind every project on this site."
      />

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative mx-auto w-full max-w-5xl rounded-[28px] bg-gradient-to-r from-cyan-500/25 via-indigo-500/20 to-purple-500/25 p-[1px] shadow-[0_30px_90px_-35px_rgba(34,211,238,0.35)]"
      >
        {/* Floating ambient light nodes — purely decorative */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
          <motion.span
            className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/25 blur-3xl"
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 22, 0], y: [0, 16, 0], scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }
            }
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute -bottom-12 right-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl"
            animate={
              reduceMotion
                ? undefined
                : { x: [0, -18, 0], y: [0, -14, 0], scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }
            }
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.span
            className="absolute right-1/3 top-1/2 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl"
            animate={
              reduceMotion
                ? undefined
                : { x: [0, 14, 0], y: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }
            }
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Drifting glow particles */}
          {reduceMotion
            ? null
            : Array.from({ length: 10 }).map((_, i) => {
                const size = 3 + ((i * 7) % 5);
                const left = (i * 37) % 100;
                const top = (i * 53) % 100;
                const duration = 5 + (i % 5);
                return (
                  <motion.span
                    key={i}
                    className="absolute rounded-full bg-white/50"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      width: size,
                      height: size,
                      filter: "blur(0.5px)",
                    }}
                    animate={{
                      y: [0, -14, 0],
                      opacity: [0, 0.5, 0],
                    }}
                    transition={{
                      duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.4,
                    }}
                  />
                );
              })}
        </div>

        <div className="relative overflow-hidden rounded-[27px] border border-white/5 bg-zinc-900/70 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 bg-zinc-950/40 px-4 py-2.5 sm:px-5">
            {serviceTabs.map((tab) => {
              const Icon = tab.icon;
              const selected = tab.id === active.id;

              return (
                <motion.button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  className={`relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-300 ${
                    selected
                      ? "border-zinc-700 text-white"
                      : "border-transparent bg-transparent text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                  }`}
                  style={
                    selected
                      ? {
                          boxShadow: `0 0 0 1px ${accentHex[tab.accent]}44 inset, 0 0 18px -6px ${accentHex[tab.accent]}88`,
                          backgroundColor: `${accentHex[tab.accent]}14`,
                        }
                      : undefined
                  }
                >
                  <Icon size={15} className={selected ? "text-white" : "text-zinc-400"} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Content — FIXED, uniform size across every tab. Never grows/shrinks. */}
          <div className="px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.985 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid items-center gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-8 lg:min-h-[430px]"
            >
              {/* Copy */}
              <div className="flex flex-col justify-center">
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.02 }}
                  className="mb-3 inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{
                    borderColor: `${accentHex[active.accent]}55`,
                    backgroundColor: `${accentHex[active.accent]}12`,
                    color: accentHex[active.accent],
                  }}
                >
                  {active.label} solutions
                </motion.div>

                <motion.h3
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.06 }}
                  className="font-display text-2xl font-semibold text-white sm:text-3xl lg:text-[2rem]"
                >
                  {active.title}
                </motion.h3>

                <motion.p
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}
                  className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300"
                >
                  {active.description}
                </motion.p>

                <ul className="mt-5 space-y-2.5">
                  {active.bullets.map((bullet, i) => (
                    <motion.li
                      key={bullet}
                      initial={reduceMotion ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, ease: EASE, delay: 0.08 + i * 0.07 }}
                      whileHover={{ x: 4 }}
                      className="group flex items-start gap-3 rounded-xl px-2 py-1.5 text-sm text-zinc-200 -mx-2 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      <motion.span
                        className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${accentHex[active.accent]}20` }}
                        whileHover={{ scale: 1.15, rotate: 8 }}
                        transition={{ duration: 0.2, ease: EASE }}
                      >
                        <Check size={12} style={{ color: accentHex[active.accent] }} />
                      </motion.span>
                      <span>{bullet}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Device mockup — fixed-height stage, content is centered inside it */}
              <div className="flex h-full min-h-[420px] items-center justify-center">
                {active.mockup === "phone" ? (
                  <PhoneMockup
                    tabId={active.id}
                    screenIndex={screenIndex[active.id]}
                    accent={active.accent}
                  />
                ) : active.mockup === "browser" ? (
                  <BrowserMockup screenIndex={screenIndex[active.id]} accent={active.accent} />
                ) : (
                  <ArchitectureMockup screenIndex={screenIndex[active.id]} accent={active.accent} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Phone mockup — realistic size, dynamic island                      */
/*  Flutter → e-commerce app | Kotlin → booking/services app           */
/* ------------------------------------------------------------------ */

function PhoneMockup({
  tabId,
  screenIndex,
  accent,
}: {
  tabId: ServiceTabId;
  screenIndex: number;
  accent: Accent;
}) {
  const isKotlin = tabId === "kotlin";
  const appName = isKotlin ? "BookIt" : "Shoply";
  const showBottomNav = screenIndex === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      className="relative mx-auto flex h-[420px] w-[200px] shrink-0 items-center justify-center"
    >
      {/* Ambient glow behind the device */}
      <motion.div
        className="absolute inset-x-6 bottom-2 top-6 rounded-[3rem] opacity-60 blur-3xl"
        style={{ background: `${accentHex[accent]}25` }}
        animate={{ opacity: [0.45, 0.75, 0.45], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Chassis */}
      <div className="relative h-full w-full overflow-hidden rounded-[2.25rem] border border-zinc-700 bg-zinc-950 p-1.5 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.85)]">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

        {/* Side buttons (decorative) */}
        <span className="absolute -right-px top-20 h-10 w-[3px] rounded-full bg-zinc-700" />
        <span className="absolute -left-px top-16 h-6 w-[3px] rounded-full bg-zinc-700" />
        <span className="absolute -left-px top-[6.5rem] h-6 w-[3px] rounded-full bg-zinc-700" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.85rem] border border-zinc-800 bg-zinc-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${tabId}-${screenIndex}`}
              initial={{ opacity: 0, x: 22, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -22, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col"
            >
              <MobileStatusBar />

              {!isKotlin && screenIndex === 0 && (
                <EcomHomeScreen appName={appName} accent={accent} />
              )}
              {!isKotlin && screenIndex === 1 && <ProductDetailScreen accent={accent} />}
              {!isKotlin && screenIndex === 2 && <CheckoutScreen accent={accent} />}

              {isKotlin && screenIndex === 0 && (
                <ServiceListScreen appName={appName} accent={accent} />
              )}
              {isKotlin && screenIndex === 1 && <DateTimePickerScreen accent={accent} />}
              {isKotlin && screenIndex === 2 && <BookingConfirmationScreen accent={accent} />}

              {showBottomNav && <MobileBottomNav active={0} accent={accent} />}
            </motion.div>
          </AnimatePresence>

          {/* Home indicator */}
          <div className="absolute inset-x-0 bottom-1.5 z-20 flex justify-center">
            <span className="h-1 w-24 rounded-full bg-zinc-500/70" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MobileStatusBar() {
  return (
    <div className="flex items-center justify-between px-5 pt-3 text-[10px] font-medium text-zinc-300">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
        <span className="h-1.5 w-2.5 rounded-sm bg-zinc-300" />
      </div>
    </div>
  );
}

function MobileHeader({
  title,
  accent,
}: {
  title: string;
  accent: Accent;
}) {
  return (
    <div className="flex items-center gap-2.5 px-4 pt-2">
      <span
        className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900"
        style={{ color: accentHex[accent] }}
      >
        <ArrowLeft size={13} />
      </span>
      <p className="text-xs font-semibold text-white">{title}</p>
    </div>
  );
}

function MobileBottomNav({ active, accent }: { active: number; accent: Accent }) {
  const items = [
    { icon: HomeIcon, index: 0 },
    { icon: TrendingUp, index: 1 },
    { icon: User, index: 2 },
  ];

  return (
    <div className="mt-auto flex items-center justify-around border-t border-zinc-800/80 bg-zinc-950/95 px-4 py-2.5">
      {items.map(({ icon: Icon, index }) => (
        <span
          key={index}
          className="flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-200"
          style={{
            backgroundColor: active === index ? `${accentHex[accent]}22` : "transparent",
            color: active === index ? accentHex[accent] : "#71717a",
          }}
        >
          <Icon size={16} />
        </span>
      ))}
    </div>
  );
}

/* ---------------------------- Flutter: e-commerce ------------------- */

/** Screen 1 — brand store home with product grid. */
function EcomHomeScreen({ appName, accent }: { appName: string; accent: Accent }) {
  const products = [
    { name: "Runner Zero", price: "$89" },
    { name: "Trail Mid", price: "$114" },
    { name: "Court Flex", price: "$76" },
    { name: "Cloud Knit", price: "$98" },
  ];

  return (
    <div className="flex-1 overflow-hidden px-4 pb-2 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Welcome back</p>
          <p className="text-sm font-semibold text-white">{appName}</p>
        </div>
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <ShoppingBag size={13} className="text-zinc-300" />
          <span
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full text-center text-[8px] font-semibold leading-[14px] text-white"
            style={{ backgroundColor: accentHex[accent] }}
          >
            2
          </span>
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2">
        <Search size={12} className="text-zinc-500" />
        <span className="h-2 w-20 rounded-full bg-zinc-800" />
      </div>

      <div className="mt-3 flex gap-2">
        {["All", "Shoes", "Bags"].map((chip, i) => (
          <span
            key={chip}
            className="rounded-full px-2.5 py-1 text-[9px] font-medium"
            style={
              i === 0
                ? { backgroundColor: `${accentHex[accent]}22`, color: accentHex[accent] }
                : { backgroundColor: "#18181b", color: "#a1a1aa" }
            }
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {products.map((product, i) => (
          <div key={product.name} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-2">
            <div
              className="h-14 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${accentHex[accent]}${
                  i % 2 === 0 ? "45" : "30"
                }, rgba(255,255,255,0.04))`,
              }}
            />
            <p className="mt-1.5 truncate text-[10px] font-medium text-white">{product.name}</p>
            <p className="text-[10px] font-semibold" style={{ color: accentHex[accent] }}>
              {product.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Screen 2 — product details with size selector. */
function ProductDetailScreen({ accent }: { accent: Accent }) {
  return (
    <div className="flex-1 overflow-hidden px-4 pb-2 pt-2">
      <div className="flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <ArrowLeft size={13} className="text-zinc-300" />
        </span>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <Heart size={13} className="text-zinc-300" />
        </span>
      </div>

      <div
        className="mt-3 h-28 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${accentHex[accent]}50, rgba(255,255,255,0.05))` }}
      />

      <p className="mt-3 text-sm font-semibold text-white">Runner Zero</p>
      <div className="mt-1 flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={9}
            fill={i < 4 ? accentHex[accent] : "transparent"}
            style={{ color: accentHex[accent] }}
          />
        ))}
        <span className="ml-1 text-[9px] text-zinc-500">(214)</span>
      </div>
      <p className="mt-1 text-base font-semibold" style={{ color: accentHex[accent] }}>
        $89.00
      </p>

      <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-zinc-500">Size</p>
      <div className="mt-1.5 flex gap-1.5">
        {["S", "M", "L", "XL"].map((size, i) => (
          <span
            key={size}
            className="flex h-6 w-6 items-center justify-center rounded-lg border text-[9px] font-medium"
            style={
              i === 1
                ? {
                    borderColor: accentHex[accent],
                    backgroundColor: `${accentHex[accent]}1f`,
                    color: accentHex[accent],
                  }
                : { borderColor: "#27272a", color: "#a1a1aa" }
            }
          >
            {size}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white"
        style={{ backgroundColor: accentHex[accent] }}
      >
        Add to Cart
      </button>
    </div>
  );
}

/** Screen 3 — checkout & payment. */
function CheckoutScreen({ accent }: { accent: Accent }) {
  const items = [
    { name: "Runner Zero × 1", price: "$89.00" },
    { name: "Cloud Knit × 1", price: "$98.00" },
  ];

  return (
    <div className="flex-1 overflow-hidden px-4 pb-2 pt-2">
      <MobileHeader title="Checkout" accent={accent} />

      <div className="mt-3 space-y-1.5">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2"
          >
            <span className="text-[10px] text-zinc-300">{item.name}</span>
            <span className="text-[10px] font-medium text-white">{item.price}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-zinc-500">Payment method</p>
      <div
        className="mt-1.5 flex items-center justify-between rounded-xl border px-3 py-2"
        style={{ borderColor: `${accentHex[accent]}55`, backgroundColor: `${accentHex[accent]}12` }}
      >
        <div className="flex items-center gap-2">
          <CreditCard size={13} style={{ color: accentHex[accent] }} />
          <span className="text-[10px] text-white">•••• 4821</span>
        </div>
        <Check size={12} style={{ color: accentHex[accent] }} />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-2.5">
        <span className="text-[10px] text-zinc-400">Total</span>
        <span className="text-sm font-semibold text-white">$187.00</span>
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white"
        style={{ backgroundColor: accentHex[accent] }}
      >
        Pay Now
      </button>
    </div>
  );
}

/* ---------------------------- Kotlin: booking / services ------------ */

/** Screen 1 — service listing. */
function ServiceListScreen({ appName, accent }: { appName: string; accent: Accent }) {
  const services = [
    { name: "Deep Cleaning", meta: "2–3 hrs", price: "$65" },
    { name: "Plumbing Visit", meta: "60 min", price: "$40" },
    { name: "Home Styling", meta: "90 min", price: "$85" },
  ];

  return (
    <div className="flex-1 overflow-hidden px-4 pb-2 pt-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Book a service</p>
          <p className="text-sm font-semibold text-white">{appName}</p>
        </div>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900">
          <Bell size={13} className="text-zinc-300" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2">
        <Search size={12} className="text-zinc-500" />
        <span className="h-2 w-20 rounded-full bg-zinc-800" />
      </div>

      <div className="mt-3 space-y-2">
        {services.map((service, i) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${accentHex[accent]}22`, color: accentHex[accent] }}
              >
                <Layers size={14} />
              </span>
              <div>
                <p className="text-[11px] font-medium text-white">{service.name}</p>
                <p className="text-[9px] text-zinc-500">{service.meta}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-semibold text-white">{service.price}</span>
              <span
                className="rounded-full px-2 py-0.5 text-[8px] font-semibold"
                style={{
                  backgroundColor: i === 0 ? accentHex[accent] : `${accentHex[accent]}18`,
                  color: i === 0 ? "#000" : accentHex[accent],
                }}
              >
                Book
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Screen 2 — date & time picker. */
function DateTimePickerScreen({ accent }: { accent: Accent }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const selectedDay = 14;
  const slots = ["9:00", "10:30", "13:00", "15:30"];

  return (
    <div className="flex-1 overflow-hidden px-4 pb-2 pt-2">
      <MobileHeader title="Select Date & Time" accent={accent} />

      <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400">
        <span className="font-medium text-white">March 2026</span>
        <Calendar size={12} style={{ color: accentHex[accent] }} />
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={`${d}-${i}`} className="text-[8px] text-zinc-600">
            {d}
          </span>
        ))}
        {days.map((day) => (
          <span
            key={day}
            className="mx-auto flex h-5 w-5 items-center justify-center rounded-full text-[8.5px]"
            style={
              day === selectedDay
                ? { backgroundColor: accentHex[accent], color: "#000", fontWeight: 600 }
                : { color: "#a1a1aa" }
            }
          >
            {day}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-zinc-500">Available times</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {slots.map((slot, i) => (
          <span
            key={slot}
            className="rounded-lg border px-2.5 py-1.5 text-[9.5px] font-medium"
            style={
              i === 1
                ? {
                    borderColor: accentHex[accent],
                    backgroundColor: `${accentHex[accent]}1f`,
                    color: accentHex[accent],
                  }
                : { borderColor: "#27272a", color: "#a1a1aa" }
            }
          >
            {slot}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl py-2.5 text-[11px] font-semibold text-white"
        style={{ backgroundColor: accentHex[accent] }}
      >
        Confirm Booking
      </button>
    </div>
  );
}

/** Screen 3 — booking confirmation. */
function BookingConfirmationScreen({ accent }: { accent: Accent }) {
  return (
    <div className="flex flex-1 flex-col items-center overflow-hidden px-5 pb-2 pt-6 text-center">
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${accentHex[accent]}22`, color: accentHex[accent] }}
      >
        <CheckCircle2 size={26} />
      </span>

      <p className="mt-3 text-sm font-semibold text-white">Booking Confirmed</p>
      <p className="mt-1 text-[10px] text-zinc-500">
        You&apos;ll receive a reminder before your appointment.
      </p>

      <div className="mt-4 w-full space-y-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">Service</span>
          <span className="text-[10px] font-medium text-white">Deep Cleaning</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">Date</span>
          <span className="text-[10px] font-medium text-white">Mar 14, 10:30 AM</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">Total</span>
          <span className="text-[10px] font-medium" style={{ color: accentHex[accent] }}>
            $65.00
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-xl border py-2.5 text-[11px] font-semibold"
        style={{ borderColor: `${accentHex[accent]}55`, color: accentHex[accent] }}
      >
        Add to Calendar
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Browser mockup — macOS-style chrome, 4-screen SaaS product tour     */
/* ------------------------------------------------------------------ */

function BrowserMockup({ screenIndex, accent }: { screenIndex: number; accent: Accent }) {
  const urls = ["app.dashboard.io", "yourbrand.com", "app.dashboard.io/analytics", "yourbrand.com/pricing"];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 shadow-[0_20px_70px_-25px_rgba(155,93,229,0.45)] ring-1 ring-white/[0.03]"
    >
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/90 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-2 flex-1 truncate rounded-full border border-zinc-700 bg-zinc-950/80 px-3 py-1 text-center text-[10px] tracking-wide text-zinc-400">
          {urls[screenIndex]}
        </div>
      </div>

      <div className="relative h-[330px] overflow-hidden bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {screenIndex === 0 && <WebDashboardScreen accent={accent} />}
            {screenIndex === 1 && <WebLandingScreen accent={accent} />}
            {screenIndex === 2 && <WebAnalyticsScreen accent={accent} />}
            {screenIndex === 3 && <WebPricingScreen accent={accent} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Screen 1 — ultra-modern SaaS analytics platform: nav, glowing CTA, live chart. */
function WebDashboardScreen({ accent }: { accent: Accent }) {
  const points = [24, 30, 26, 40, 34, 52, 44, 62, 54, 74, 64, 86];
  const path = points
    .map((p, i) => `${(i / (points.length - 1)) * 300},${96 - p * 0.8}`)
    .join(" ");

  return (
    <div className="flex h-full flex-col bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_60%)] p-4">
      {/* Nav bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-5 w-5 rounded-md"
            style={{ background: `linear-gradient(135deg, ${accentHex[accent]}, #a855f7)` }}
          />
          <span className="text-[11px] font-semibold text-white">Pulse</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] text-zinc-500">
          <span className="text-zinc-300">Overview</span>
          <span>Customers</span>
          <span>Billing</span>
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[9px] font-semibold text-white shadow-[0_0_14px_-2px_var(--glow)]"
          style={{ backgroundColor: accentHex[accent], ["--glow" as string]: accentHex[accent] }}
        >
          Upgrade
        </span>
      </div>

      {/* Hero KPI + live sparkline */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">Monthly recurring revenue</p>
          <p className="mt-1 text-2xl font-semibold text-white">$124,800</p>
          <span
            className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-semibold"
            style={{ borderColor: `${accentHex[accent]}55`, color: accentHex[accent] }}
          >
            +18.4% this month
          </span>
        </div>
      </div>

      <div className="relative mt-3 flex-1 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <svg viewBox="0 0 300 100" className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="webAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentHex[accent]} stopOpacity="0.45" />
              <stop offset="100%" stopColor={accentHex[accent]} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.polygon
            points={`0,100 ${path} 300,100`}
            fill="url(#webAreaFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
          <motion.polyline
            fill="none"
            stroke={accentHex[accent]}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={path}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Active users", "24.1k"],
          ["Conversion", "8.6%"],
          ["Churn", "1.2%"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <p className="text-[8px] uppercase tracking-[0.15em] text-zinc-500">{label}</p>
            <p className="mt-1 text-xs font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebLandingScreen({ accent }: { accent: Accent }) {
  return (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="h-2.5 w-16 rounded-full bg-zinc-700" />
        <div className="flex gap-3">
          {["Product", "Pricing", "Docs"].map((label) => (
            <span key={label} className="text-[10px] text-zinc-500">
              {label}
            </span>
          ))}
        </div>
        <span
          className="rounded-full px-2.5 py-1 text-[9px] font-semibold"
          style={{ backgroundColor: `${accentHex[accent]}22`, color: accentHex[accent] }}
        >
          Get Started
        </span>
      </div>

      <div className="mt-8 flex flex-1 items-center gap-8">
        <div className="max-w-[220px]">
          <div className="h-3.5 w-40 rounded-full bg-zinc-700" />
          <div className="mt-2 h-3.5 w-32 rounded-full bg-zinc-800" />
          <p className="mt-3 text-[10px] leading-relaxed text-zinc-500">
            Ship a premium product experience your customers actually enjoy using.
          </p>
          <span
            className="mt-4 inline-block rounded-full px-3 py-1.5 text-[10px] font-semibold text-white"
            style={{ backgroundColor: accentHex[accent] }}
          >
            Book a demo
          </span>
        </div>

        <div className="hidden flex-1 sm:block">
          <div
            className="h-32 rounded-2xl border border-zinc-800"
            style={{
              background: `linear-gradient(135deg, ${accentHex[accent]}30, transparent)`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {["Fast setup", "Secure by default", "Scales with you"].map((label) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: accentHex[accent] }} />
            <p className="mt-1.5 text-[9px] text-zinc-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Screen 3 — analytics view with KPI cards and a trend line. */
function WebAnalyticsScreen({ accent }: { accent: Accent }) {
  const points = [20, 35, 28, 48, 40, 60, 52, 74, 66, 88, 78, 95];

  return (
    <div className="h-full overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-white">Traffic Analytics</p>
        <span className="rounded-full border border-zinc-800 px-2 py-0.5 text-[9px] text-zinc-400">
          Last 30 days
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          ["Sessions", "48.2k"],
          ["Bounce rate", "24.1%"],
          ["Avg. session", "3m 42s"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-2.5">
            <p className="text-[9px] uppercase tracking-[0.15em] text-zinc-500">{label}</p>
            <p className="mt-1 text-sm font-semibold text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
        <svg viewBox="0 0 240 70" className="h-20 w-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={accentHex[accent]}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points
              .map((p, i) => `${(i / (points.length - 1)) * 240},${70 - p * 0.65}`)
              .join(" ")}
          />
        </svg>
      </div>

      <div className="mt-3 space-y-1.5">
        {["Organic search", "Direct", "Referral"].map((label, i) => (
          <div key={label} className="flex items-center justify-between text-[10px] text-zinc-300">
            <span>{label}</span>
            <div className="ml-3 h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <span
                className="block h-full rounded-full"
                style={{ width: `${70 - i * 20}%`, backgroundColor: accentHex[accent] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Screen 4 — pricing tiers. */
function WebPricingScreen({ accent }: { accent: Accent }) {
  const tiers = [
    { name: "Starter", price: "$19", features: ["1 project", "Community support"] },
    { name: "Pro", price: "$49", features: ["Unlimited projects", "Priority support", "Analytics"] },
    { name: "Enterprise", price: "$129", features: ["Dedicated infra", "SLA & SSO"] },
  ];

  return (
    <div className="flex h-full flex-col items-center overflow-hidden p-5 text-center">
      <div className="h-2.5 w-24 rounded-full bg-zinc-700" />
      <p className="mt-2 text-[10px] text-zinc-500">Simple, transparent pricing</p>

      <div className="mt-4 grid w-full grid-cols-3 gap-2.5">
        {tiers.map((tier, i) => (
          <div
            key={tier.name}
            className="relative rounded-xl border p-2.5 text-left"
            style={
              i === 1
                ? { borderColor: accentHex[accent], backgroundColor: `${accentHex[accent]}12` }
                : { borderColor: "#27272a", backgroundColor: "rgba(24,24,27,0.6)" }
            }
          >
            {i === 1 && (
              <span
                className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[7px] font-semibold text-black"
                style={{ backgroundColor: accentHex[accent] }}
              >
                Popular
              </span>
            )}
            <p className="text-[10px] font-semibold text-white">{tier.name}</p>
            <p className="mt-1 text-sm font-semibold" style={{ color: accentHex[accent] }}>
              {tier.price}
            </p>
            <ul className="mt-2 space-y-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-1 text-[8px] text-zinc-400">
                  <Check size={8} style={{ color: accentHex[accent] }} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Architecture mockup — visual systems/API UI (no raw source code)   */
/* ------------------------------------------------------------------ */

function ArchitectureMockup({ screenIndex, accent }: { screenIndex: number; accent: Accent }) {
  const titles = ["api-gateway.live", "api-tester", "system-health"];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border border-zinc-700/80 bg-[#0b0f17] shadow-[0_20px_70px_-25px_rgba(34,211,238,0.45)] ring-1 ring-white/[0.03]"
    >
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/90 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="ml-2 text-[10px] tracking-wide text-zinc-500">{titles[screenIndex]}</div>
      </div>

      <div className="relative h-[330px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={screenIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 p-3.5"
          >
            {screenIndex === 0 && <MicroservicesFlowScreen accent={accent} />}
            {screenIndex === 1 && <ApiTesterScreen accent={accent} />}
            {screenIndex === 2 && <ServerHealthScreen accent={accent} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/** Screen 1 — live API Gateway & microservices architecture dashboard. */
function MicroservicesFlowScreen({ accent }: { accent: Accent }) {
  const services = ["Auth", "Orders", "Billing"];
  const latency = [18, 24, 16, 30, 22, 34, 20, 28, 24, 36, 26, 20];
  const logs = [
    "gateway   route matched → orders-svc",
    "orders    POST /v1/orders  201  88ms",
    "billing   charge.create() succeeded",
    "auth      token refreshed for cus_88a1",
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">API Gateway</p>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          200 OK
        </span>
      </div>

      {/* Architecture flow */}
      <div className="mt-2.5 flex items-center justify-between gap-1.5">
        <FlowNode label="Client" accent={accent} />
        <ArrowRight size={12} className="shrink-0 text-zinc-600" />
        <FlowNode label="Gateway" accent={accent} highlight />
        <ArrowRight size={12} className="shrink-0 text-zinc-600" />

        <div className="flex flex-col gap-1.5">
          {services.map((service) => (
            <FlowNode key={service} label={service} accent={accent} compact />
          ))}
        </div>

        <ArrowRight size={12} className="shrink-0 text-zinc-600" />
        <FlowNode label="DB Pool" accent={accent} icon={Database} />
      </div>

      {/* Latency graph + connection pool */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <p className="text-[8px] uppercase tracking-[0.15em] text-zinc-500">Latency (ms)</p>
          <div className="mt-1 flex h-9 items-end gap-[3px]">
            {latency.map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ backgroundColor: `${accentHex[accent]}${i === 9 ? "" : "99"}` }}
                animate={{ height: [`${h * 1.4}%`, `${h * 2}%`, `${h * 1.4}%`] }}
                transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.08, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
          <p className="text-[8px] uppercase tracking-[0.15em] text-zinc-500">DB connection pool</p>
          <div className="mt-1.5 flex items-center gap-2">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
              <motion.span
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: accentHex[accent] }}
                animate={{ width: ["58%", "76%", "58%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="text-[9px] font-medium text-zinc-300">29/40</span>
          </div>
        </div>
      </div>

      {/* Live log ticker */}
      <div className="mt-2.5 flex-1 overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-[8.5px] leading-relaxed text-zinc-400">
        {logs.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.35 }}
            className="truncate"
          >
            <span className="text-emerald-400">[OK]</span> {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

function FlowNode({
  label,
  accent,
  highlight,
  compact,
  icon: Icon,
}: {
  label: string;
  accent: Accent;
  highlight?: boolean;
  compact?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border text-center text-[9px] font-medium ${
        compact ? "px-2 py-1.5" : "px-2.5 py-3"
      }`}
      style={
        highlight
          ? { borderColor: accentHex[accent], backgroundColor: `${accentHex[accent]}18`, color: accentHex[accent] }
          : { borderColor: "#27272a", backgroundColor: "rgba(24,24,27,0.7)", color: "#d4d4d8" }
      }
    >
      {Icon && <Icon size={11} className="mr-1" />}
      {label}
    </div>
  );
}

/** Screen 2 — visual REST API tester with a 200 OK response. */
function ApiTesterScreen({ accent }: { accent: Accent }) {
  const responseFields = [
    { label: "id", value: "ord_1042" },
    { label: "status", value: "fulfilled" },
    { label: "total", value: "$248.00" },
    { label: "customer", value: "cus_88a1" },
  ];

  return (
    <div className="flex h-full flex-col">
      <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">API request</p>

      <div className="flex items-center gap-2">
        <span
          className="rounded-md px-2 py-1 text-[9px] font-semibold"
          style={{ backgroundColor: `${accentHex[accent]}22`, color: accentHex[accent] }}
        >
          GET
        </span>
        <div className="flex-1 truncate rounded-md border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[9.5px] text-zinc-400">
          /v1/orders/1042
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-md" style={{ backgroundColor: accentHex[accent] }}>
          <Send size={11} className="text-black" />
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
          200 OK
        </span>
        <span className="text-[9px] text-zinc-500">42ms</span>
      </div>

      <div className="mt-2 flex-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
        <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-zinc-500">Response</p>
        <div className="space-y-1.5">
          {responseFields.map((field) => (
            <div key={field.label} className="flex items-center justify-between text-[10px]">
              <span className="text-zinc-500">{field.label}</span>
              <span className="font-medium text-zinc-200">{field.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Screen 3 — server health monitoring dashboard. */
function ServerHealthScreen({ accent }: { accent: Accent }) {
  const usage = [
    { label: "CPU", value: 42 },
    { label: "Memory", value: 68 },
  ];
  const statuses = [
    { name: "Auth", state: "Healthy", tone: "#34d399" },
    { name: "Orders", state: "Healthy", tone: "#34d399" },
    { name: "Billing", state: "Degraded", tone: "#fbbf24" },
  ];

  return (
    <div className="h-full overflow-hidden">
      <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">System health</p>

      <div className="grid grid-cols-2 gap-2.5">
        {usage.map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-2.5">
            <div
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(${accentHex[accent]} ${item.value * 3.6}deg, #27272a 0deg)`,
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0b0f17] text-[8px] font-semibold text-white">
                {item.value}%
              </div>
            </div>
            <span className="text-[10px] text-zinc-400">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-2.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
        <p className="mb-1.5 text-[9px] uppercase tracking-[0.15em] text-zinc-500">Requests / sec</p>
        <div className="flex h-10 items-end gap-1">
          {[20, 35, 28, 48, 40, 60, 52, 74, 66, 88, 78, 60].map((h, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-sm"
              style={{ height: `${h}%`, backgroundColor: i === 9 ? accentHex[accent] : "#27272a" }}
            />
          ))}
        </div>
      </div>

      <div className="mt-2.5 space-y-1.5">
        {statuses.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-md border border-zinc-800/70 bg-zinc-900/50 px-2.5 py-1.5 text-[10px] text-zinc-300"
          >
            <span>{service.name}</span>
            <span className="flex items-center gap-1.5" style={{ color: service.tone }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: service.tone }} />
              {service.state}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
