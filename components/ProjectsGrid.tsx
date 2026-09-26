"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { projects } from "@/lib/data";
import {
  filterCategories,
  projectMatchesTechFilter,
  TECH_FILTER_EVENT,
  type HeroTechFilter,
} from "@/lib/constants";
import type { FilterCategory, Project } from "@/lib/types";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";
import TextReveal from "./TextReveal";
import ProjectCaseStudyModal from "./ProjectCaseStudyModal";

export default function ProjectsGrid() {
  const [category, setCategory] = useState<FilterCategory>("All");
  const [techFilter, setTechFilter] = useState<HeroTechFilter | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  // Bridges the clickable tech pills in the hero to this grid — see
  // Hero.tsx, which dispatches the same event name on pill click.
  useEffect(() => {
    function handleTechFilterEvent(e: Event) {
      const tech = (e as CustomEvent<HeroTechFilter>).detail;
      setTechFilter(tech);
      setCategory("All");
    }
    window.addEventListener(TECH_FILTER_EVENT, handleTechFilterEvent);
    return () => window.removeEventListener(TECH_FILTER_EVENT, handleTechFilterEvent);
  }, []);

  const visible = useMemo(() => {
    if (techFilter) {
      return projects.filter((p) => projectMatchesTechFilter(p, techFilter));
    }
    return category === "All" ? projects : projects.filter((p) => p.category === category);
  }, [category, techFilter]);

  return (
    <section id="projects" className="mx-auto max-w-content px-6 py-24 md:px-10">
      <SectionHeading
        title="Projects"
        description="A curated selection of mobile applications and full-stack systems I've architected and shipped."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filterCategories.map((cat, i) => (
          <motion.button
            key={cat}
            type="button"
            onClick={() => {
              setTechFilter(null);
              setCategory(cat);
            }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17, delay: i * 0.04 }}
            className="relative rounded-full px-4 py-2 text-sm transition-colors"
          >
            {!techFilter && category === cat && (
              <motion.span
                layoutId="active-filter-pill"
                className="absolute inset-0 rounded-full border border-violet-500/50 bg-zinc-900/80 shadow-[0_0_20px_-8px_rgba(168,85,247,0.7)]"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
            <span
              className={
                !techFilter && category === cat
                  ? "relative text-ink"
                  : "relative text-ink-muted hover:text-ink"
              }
            >
              <TextReveal as="span" text={cat} splitBy="char" stagger={0.02} delay={0.1 + i * 0.04} />
            </span>
          </motion.button>
        ))}
      </div>

      {techFilter && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-2 text-sm text-ink-muted"
        >
          <span>Showing projects built with</span>
          <motion.button
            type="button"
            onClick={() => setTechFilter(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="mono-tag inline-flex items-center gap-1.5 rounded-full border border-violet-500/50 bg-zinc-900/80 px-3 py-1 text-xs text-ink shadow-[0_0_16px_-8px_rgba(168,85,247,0.7)] transition-shadow hover:shadow-[0_0_20px_-6px_rgba(168,85,247,0.9)]"
          >
            {techFilter}
            <X size={12} />
          </motion.button>
        </motion.div>
      )}

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} onOpen={setSelected} />
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectCaseStudyModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
