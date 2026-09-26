"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Award, X } from "lucide-react";
import { useEffect, useState } from "react";
import { timeline } from "@/lib/data";
import SectionHeading from "./SectionHeading";
import TimelineNetworkCanvas from "./TimelineNetworkCanvas";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 18, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Experience() {
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedCertificate) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCertificate(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedCertificate]);

  return (
    <section
      id="experience"
      className="relative mx-auto max-w-content overflow-visible px-6 py-24 md:px-10"
    >
      <TimelineNetworkCanvas />

      <SectionHeading
        kicker="Experience"
        title="Experience & Credentials"
        description="Formal academic background backed by advanced software engineering initiatives and practical achievements."
      />

      <div className="relative max-w-2xl">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-base-border" />

        <motion.ul
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="space-y-10"
        >
          {timeline.map((entry) => {
            const Icon = entry.type === "degree" ? GraduationCap : Award;
            const hasCertificate = Boolean(entry.certificateUrl);

            return (
              <motion.li
                key={entry.id}
                variants={item}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="group relative flex gap-5 pl-0"
              >
                <button
                  type="button"
                  onClick={() => hasCertificate && setSelectedCertificate(entry.certificateUrl ?? null)}
                  disabled={!hasCertificate}
                  aria-label={hasCertificate ? `Open certificate for ${entry.org}` : undefined}
                  title={hasCertificate ? `Open certificate for ${entry.org}` : undefined}
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-base-border bg-base-surface text-glow-cyan transition-all duration-300 ${
                    hasCertificate
                      ? "cursor-pointer hover:border-glow-cyan/70 hover:shadow-glow-cyan group-hover:border-glow-cyan/70 group-hover:shadow-glow-cyan"
                      : "cursor-default opacity-80"
                  }`}
                >
                  <Icon size={17} />
                </button>

                <div className="pt-1.5">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {entry.title}
                  </h3>
                  {entry.orgUrl ? (
                    <a
                      href={entry.orgUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-block text-sm text-ink-muted underline decoration-glow-cyan/0 underline-offset-4 transition-colors duration-300 hover:text-glow-cyan hover:decoration-glow-cyan/70"
                    >
                      {entry.org}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-ink-muted">{entry.org}</p>
                  )}
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-faint">
                    {entry.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_35px_90px_rgba(14,116,144,0.35)]"
            >
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/40 text-white/80 transition hover:bg-slate-900/80 hover:text-white"
                aria-label="Close certificate preview"
              >
                <X size={18} />
              </button>

              <div className="max-h-[82vh] overflow-hidden">
                <img
                  src={selectedCertificate}
                  alt="Official certificate preview"
                  className="h-auto max-h-[82vh] w-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
