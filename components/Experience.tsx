"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Award, Briefcase, ArrowUpRight, X } from "lucide-react";
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

/** Org / partner badge used in Row 2. Renders as a link with a sliding
 * external-link icon when a URL is available, otherwise as plain text. */
function TimelineLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return <span className="text-sm font-medium text-ink-muted">{label}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/link inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition-colors duration-200 ease-in-out hover:text-cyan-300"
    >
      {label}
      <ArrowUpRight
        size={12}
        className="transition-transform duration-200 ease-in-out group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
    </a>
  );
}

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
            const Icon =
              entry.type === "degree"
                ? GraduationCap
                : entry.type === "internship"
                  ? Briefcase
                  : Award;
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
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-base-border bg-base-surface text-glow-cyan transition-all duration-300 ease-in-out group-hover:border-glow-cyan/70 group-hover:bg-glow-cyan/20 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] ${
                    hasCertificate ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <Icon size={17} />
                </button>

                <div className="pt-1.5">
                  <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-ink sm:text-lg">
                    {entry.title}
                  </h3>

                  {/* Row 2: org badge, and partner badge inline right next to
                      it when present — separated by a middle dot. */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <TimelineLink href={entry.orgUrl} label={entry.org} />
                    {entry.partner && (
                      <>
                        <span className="text-xs text-ink-faint">•</span>
                        <TimelineLink href={entry.partner.url} label={entry.partner.name} />
                      </>
                    )}
                  </div>

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
