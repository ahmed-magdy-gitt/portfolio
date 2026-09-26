"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/lib/data";

const accents = ["#22D3EE", "#6366F1", "#9B5DE5", "#38BDF8"] as const;

function Counter({ value, duration = 1.4 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

export default function StatsCounter() {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:gap-x-4">
        {stats.map((stat, i) => {
          const accent = accents[i % accents.length];

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              className="group relative cursor-default px-1 py-1 text-left"
            >
              <div
                className="font-display text-3xl font-semibold tracking-tight text-ink transition-[filter,color] duration-500 sm:text-4xl"
                style={{
                  textShadow: `0 0 0 transparent`,
                }}
              >
                <span
                  className="inline-block transition-[filter,transform] duration-500 group-hover:scale-[1.04]"
                  style={{ color: accent }}
                >
                  <span className="transition-[filter] duration-500 group-hover:[filter:drop-shadow(0_0_14px_currentColor)]">
                    {stat.displayValue ? (
                      stat.displayValue
                    ) : (
                      <>
                        {stat.prefix}
                        <Counter value={stat.value} />
                        {stat.suffix}
                      </>
                    )}
                  </span>
                </span>
              </div>
              <div className="mt-1.5 text-[13px] font-medium text-ink">{stat.label}</div>
              <p className="mt-1 max-w-[16rem] text-xs leading-relaxed text-ink-faint transition-colors duration-300 group-hover:text-ink-muted">
                {stat.description}
              </p>
              <span
                aria-hidden
                className="mt-3 block h-px w-6 origin-left scale-x-100 bg-current opacity-30 transition-all duration-500 group-hover:w-12 group-hover:opacity-90"
                style={{ color: accent }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
