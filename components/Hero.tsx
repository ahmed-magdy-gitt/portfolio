"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { profile } from "@/lib/data";
import { heroTechFilters, TECH_FILTER_EVENT, type HeroTechFilter } from "@/lib/constants";
import HeroVisualizer from "./HeroVisualizer";
import TextReveal from "./TextReveal";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const springTap = { type: "spring" as const, stiffness: 400, damping: 17 };

function handleTechPillClick(tech: HeroTechFilter) {
  window.dispatchEvent(new CustomEvent<HeroTechFilter>(TECH_FILTER_EVENT, { detail: tech }));
  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Hero() {
  return (
    <section id="top" className="relative overflow-x-clip overflow-y-visible pb-20 pt-36 md:pt-44">
      <div className="mx-auto grid max-w-content items-center gap-16 px-6 md:grid-cols-[1.1fr_0.9fr] md:px-10">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="mb-5 text-sm text-glow-cyan">
            Available for new roles &amp; freelance systems work
          </motion.p>

          {/* The name, title and bio all rise word by word. The stagger gets
              progressively tighter as the blocks get longer, so the whole
              sequence lands in about the same beat rather than dragging. */}
          {/* The name alone gets the shimmer treatment — an oversized
              gradient panning through the clipped letterforms with a
              pulsing drop-shadow riding along, so it reads as the page's
              one signature flourish rather than a decoration repeated on
              every heading. `motion-safe:` keeps it off entirely for
              visitors who've asked for reduced motion. */}
          <TextReveal
            as="h1"
            text={profile.name}
            stagger={0.08}
            delay={0.15}
            className="text-balance bg-gradient-to-r from-cyan-300 via-violet-400 to-cyan-300 bg-[length:200%_100%] bg-clip-text font-display text-4xl font-semibold leading-[1.08] tracking-tight text-transparent motion-safe:animate-name-shimmer sm:text-5xl md:text-6xl"
          />

          <TextReveal
            text={profile.title}
            stagger={0.035}
            delay={0.35}
            className="mt-4 max-w-prose text-lg text-ink-muted sm:text-xl"
          />

          <TextReveal
            text={profile.bio}
            stagger={0.012}
            delay={0.55}
            className="mt-6 max-w-prose text-base leading-relaxed text-ink-muted"
          />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {heroTechFilters.map((tech) => (
              <motion.button
                key={tech}
                type="button"
                onClick={() => handleTechPillClick(tech)}
                title={`Show ${tech} projects`}
                whileHover={{ scale: 1.06, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={springTap}
                className="mono-tag rounded-full border border-base-border bg-base-surface px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-glow-indigo/60 hover:text-ink hover:shadow-glow-indigo"
              >
                {tech}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={springTap}
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-canvas shadow-glow-soft"
            >
              <TextReveal as="span" text="View projects" stagger={0.02} delay={1.1} />
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={springTap}
              className="inline-flex items-center gap-2 rounded-full border border-base-border px-5 py-3 text-sm text-ink transition-colors hover:border-glow-cyan/60 hover:text-glow-cyan hover:shadow-glow-cyan"
            >
              <Mail size={16} />
              <TextReveal as="span" text="Get in touch" stagger={0.02} delay={1.2} />
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <HeroVisualizer />
        </motion.div>
      </div>
    </section>
  );
}
