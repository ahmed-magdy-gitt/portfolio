"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/data";
import { cn } from "@/lib/utils";
import TextReveal from "./TextReveal";

const links = [
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#freelance", label: "Freelance" },
  { href: "#contact", label: "Contact" },
];

const spring = { type: "spring" as const, stiffness: 400, damping: 17 };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass border-b border-base-border/80" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
        {/* Wordmark: a cyan-to-violet gradient clipped to the type, with a
            matching blurred copy behind it that only fades in on hover. The
            drop-shadow reads off the painted gradient, so the glow picks up
            the same colours as the letterforms. */}
        <motion.a
          href="#top"
          aria-label={`${profile.name} — back to top`}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          transition={{ ...spring, opacity: { duration: 0.4 }, y: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }}
          className="group relative inline-flex items-baseline font-display text-[15px] font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-full bg-gradient-to-r from-cyan-400/20 via-sky-500/15 to-violet-500/25 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"
          />
          {/* The gradient returns to cyan at the far stop so that, at 200%
              background-size, every frame of the pan still shows a full
              cyan-to-violet spread across the letterforms rather than
              sliding one flat colour through them. TextReveal's character
              spans carry no color/background of their own, so this parent's
              `background-clip: text` still clips through to every animated
              glyph beneath it. */}
          <span className="animate-gradient-pan bg-gradient-to-r from-cyan-300 via-violet-500 to-cyan-300 bg-[length:200%_100%] bg-clip-text text-transparent transition-[filter,letter-spacing] duration-300 group-hover:tracking-[0.005em] group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]">
            <TextReveal as="span" text={profile.name} splitBy="char" stagger={0.035} delay={0.1} />
          </span>
          <span className="ml-[1px] text-glow-cyan transition-[filter] duration-300 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]">
            .
          </span>
        </motion.a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
              className="group relative text-sm text-ink-muted transition-colors duration-300 hover:text-ink"
            >
              <TextReveal as="span" text={link.label} splitBy="char" stagger={0.018} />
              {/* Gradient underline that wipes in from the left. */}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-cyan-400 to-violet-500 transition-transform duration-300 ease-smooth group-hover:scale-x-100" />
              {/* Soft bloom under the label, tied to the same hover. */}
              <span className="pointer-events-none absolute -bottom-1.5 left-0 h-px w-full scale-x-0 bg-glow-cyan opacity-0 blur-[3px] transition-all duration-300 ease-smooth group-hover:scale-x-100 group-hover:opacity-80" />
            </motion.a>
          ))}
          <motion.a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-base-border bg-base-surface px-4 py-2 text-sm text-ink transition-colors duration-300 hover:border-glow-indigo/60 hover:text-glow-cyan hover:shadow-glow-indigo"
          >
            {/* Sheen that sweeps across the button on hover. */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-smooth group-hover:translate-x-full" />
            <TextReveal as="span" text="CV" splitBy="char" stagger={0.03} delay={0.15} />
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.a>
        </div>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          transition={spring}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-base-border text-ink transition-colors duration-300 hover:border-glow-cyan/60 hover:text-glow-cyan md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "menu"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-base-border/80 glass md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  className="rounded-lg px-2 py-3 text-sm text-ink-muted transition-colors hover:bg-base-raised hover:text-ink active:scale-[0.98]"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg border border-base-border px-2 py-3 text-center text-sm text-ink transition-colors active:scale-95"
              >
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
