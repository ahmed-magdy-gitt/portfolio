"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shapes itself to a screenshot's own aspect ratio (passed in as `ratio`,
 * measured by the caller on image load) and renders one of two chrome
 * styles around whatever is passed as `children` (typically a single
 * `object-contain` <Image fill />):
 *
 *  - `isPhoneLike`: a full physical phone mockup — bezel, side buttons,
 *    speaker/camera cutout, rounded screen corners.
 *  - otherwise: a plain glass panel, for browser/dashboard-style shots
 *    where a phone chassis wouldn't make sense.
 *
 * Used by both ProjectCard (grid preview) and ProjectCaseStudyModal
 * (full-size view) so screenshots read identically in both places.
 */
export default function DeviceFrame({
  ratio,
  isPhoneLike,
  className,
  children,
}: {
  ratio?: number;
  isPhoneLike: boolean;
  className?: string;
  children: ReactNode;
}) {
  const sizing = ratio ? { aspectRatio: ratio } : undefined;

  if (isPhoneLike) {
    return (
      <div className={cn("relative h-full max-w-full", className)} style={sizing}>
        {/* Chassis — kept deliberately thin (hairline border, minimal
            padding) so the screenshot itself fills almost the entire frame,
            like a modern bezel-less phone render rather than a chunky toy. */}
        <div className="relative h-full w-full rounded-[1.3rem] border border-zinc-700/80 bg-zinc-950 p-[2px] shadow-[0_18px_45px_-15px_rgba(0,0,0,0.75)]">
          {/* Physical buttons, protruding outside the chassis edge */}
          <span className="absolute -right-px top-[17%] h-8 w-[2px] rounded-full bg-zinc-700" />
          <span className="absolute -left-px top-[13%] h-4 w-[2px] rounded-full bg-zinc-700" />
          <span className="absolute -left-px top-[19%] h-4 w-[2px] rounded-full bg-zinc-700" />

          {/* Screen — the image fills this completely; only a tiny punch-hole
              camera dot sits on top of it, the way an actual bezel-less
              phone's front camera punches through the display glass. */}
          <div className="relative h-full w-full overflow-hidden rounded-[1.15rem] bg-black">
            <span className="absolute left-1/2 top-1 z-20 h-[5px] w-[5px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

            {children}

            {/* Glass sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full max-w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/40 shadow-[0_18px_45px_-15px_rgba(0,0,0,0.75)] backdrop-blur-sm",
        className
      )}
      style={sizing}
    >
      {children}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
    </div>
  );
}
