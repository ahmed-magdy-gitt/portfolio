"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Server,
  Smartphone,
  Layers,
  Globe,
  Database,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import { skillCategories } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import SkillCard, { type SkillAccent } from "./SkillCard";
import TextReveal from "./TextReveal";
import StatsCounter from "./StatsCounter";
import LiveWebsiteBuilder from "./LiveWebsiteBuilder";

const iconMap: Record<string, LucideIcon> = {
  backend: Server,
  android: Smartphone,
  flutter: Layers,
  web: Globe,
  data: Database,
  quality: FlaskConical,
};

/** Short pill labels — the full category names run too long for a filter bar. */
const shortLabel: Record<string, string> = {
  flutter: "Flutter",
  android: "Android",
  backend: "Backend",
  web: "Web",
  data: "Database",
  quality: "Tooling",
};

const accentByIndex: SkillAccent[] = ["indigo", "cyan", "violet"];

export default function SkillsMatrix() {
  const [filter, setFilter] = useState<string>("All");

  const visible = useMemo(
    () => (filter === "All" ? skillCategories : skillCategories.filter((c) => c.id === filter)),
    [filter]
  );

  return (
    <section id="skills" className="relative mx-auto max-w-content px-6 py-24 md:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 h-64 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_65%)]"
      />
      <SectionHeading
        kicker="Skills"
        title="Skills & Technologies"
        description="The tools and frameworks I use every day to build performant mobile apps and scalable platforms — plus a live look at how those screens come together."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(17.5rem,24rem)] lg:gap-12">
        <div>
          <StatsCounter />

          <div className="mb-5 mt-12 flex flex-wrap gap-1.5">
            {["All", ...skillCategories.map((c) => c.id)].map((id, i) => (
              <motion.button
                key={id}
                type="button"
                onClick={() => setFilter(id)}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17, delay: i * 0.04 }}
                className="relative rounded-full px-3 py-1.5 text-xs transition-colors"
              >
                {filter === id && (
                  <motion.span
                    layoutId="active-skill-filter-pill"
                    className="absolute inset-0 rounded-full border border-violet-500/50 bg-zinc-900/80 shadow-[0_0_20px_-8px_rgba(168,85,247,0.7)]"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className={filter === id ? "relative text-ink" : "relative text-ink-muted hover:text-ink"}>
                  <TextReveal
                    as="span"
                    text={id === "All" ? "All" : shortLabel[id] ?? id}
                    splitBy="char"
                    stagger={0.02}
                    delay={0.1 + i * 0.04}
                  />
                </span>
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid gap-3 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {visible.map((category, i) => (
                <SkillCard
                  key={category.id}
                  category={category}
                  icon={iconMap[category.id] ?? Server}
                  accent={accentByIndex[i % accentByIndex.length]}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <LiveWebsiteBuilder />
        </div>
      </div>
    </section>
  );
}
