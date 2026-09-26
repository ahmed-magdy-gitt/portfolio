/**
 * Crisp, officially-styled brand marks for the hero visualizer.
 *
 * lucide-react has no icons for these stacks, and pulling in a full brand-icon
 * package for six glyphs isn't worth the bundle cost. These are faithful,
 * clean-vector renditions of each brand's mark — built from scratch to read
 * sharply at 14-20px, using each brand's real silhouette and (where the mark
 * is multi-tone) its official gradient/duotone treatment. Each is decorative
 * (`aria-hidden`) because the parent node button already carries the
 * accessible label.
 */

import type { ReactElement } from "react";

export interface GlyphProps {
  size?: number;
  className?: string;
}

// ReactElement rather than JSX.Element: the global JSX namespace is not
// declared by React 19's types, and this keeps the file portable either way.
type GlyphComponent = (props: GlyphProps) => ReactElement;

function glyphProps({ size = 16, className }: GlyphProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-hidden": true,
    focusable: false as const,
  };
}

/** Flutter — the folded double-chevron "F", in the brand's two-tone blue. */
export const FlutterGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <path d="M14.31 0 2.3 12 6 15.7 21.7.01Z" fill="#42A5F5" />
    <path d="M14.31 11.07 7.86 17.53l4.46 4.46 2.12-2.12-2.33-2.34 6.47-6.46 2.12 2.12L14.31 22h7.4v-.01l-6.47-6.46 6.47-6.47-2.13-2.12Z" fill="#0D47A1" opacity="0.6" />
    <path d="M12.32 19.99 15.75 23h5.94l-5.94-5.94Z" fill="#1976D2" />
  </svg>
);

/** Kotlin — the folded square, in the brand's orange-to-purple-to-blue gradient. */
export const KotlinGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <defs>
      <linearGradient id="kotlinGrad" x1="22" y1="0" x2="0" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0.003" stopColor="#E44857" />
        <stop offset="0.469" stopColor="#C711E1" />
        <stop offset="1" stopColor="#7F52FF" />
      </linearGradient>
    </defs>
    <path d="M22 22H2V2h20L12 12Z" fill="url(#kotlinGrad)" />
  </svg>
);

/** Java — the steaming coffee cup with the classic under-cup wave, in Java red-orange. */
export const JavaGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <path
      d="M9.1 2.3c-1.5 1.4-1.5 2.5 0 3.9M13.1 1.6c-2 1.8-2 3.2 0 5"
      stroke="#ED8B00"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M4.5 10.5h13v4.8a4.2 4.2 0 0 1-4.2 4.2H8.7a4.2 4.2 0 0 1-4.2-4.2Z"
      fill="#ED8B00"
      opacity="0.14"
    />
    <path
      d="M4.5 10.5h13v4.8a4.2 4.2 0 0 1-4.2 4.2H8.7a4.2 4.2 0 0 1-4.2-4.2Z"
      stroke="#ED8B00"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M17.3 12h1.5a2.35 2.35 0 1 1 0 4.7h-1.5"
      stroke="#ED8B00"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2.6 21.3c2.1-.9 4.9-.9 7 0M2 23c3.3-1.1 8.1-1.1 11.4 0"
      stroke="#ED8B00"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

/** Spring / Spring Boot — the curled sprig leaf, in Spring green. */
export const SpringGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <path
      d="M20.9 3c1.7 8.1-1.9 13.9-6.4 16.5-4.9 2.9-11.1 1.6-13.3-2.4-1.7-3.1.1-6.6 3.4-7.1 2.6-.4 4.5 1.2 4.4 3.1-.1 1.5-1.3 2.5-2.7 2.5"
      stroke="#6DB33F"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M20.9 3c-5.1 2.1-9.2 6-11.7 12.4"
      stroke="#6DB33F"
      strokeWidth="1.4"
      strokeLinecap="round"
      opacity="0.55"
    />
    <circle cx="19" cy="5.1" r="1.7" fill="#6DB33F" />
  </svg>
);

/** .NET — the rounded violet tile with the platform's triangular mark. */
export const DotNetGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <rect x="1.5" y="1.5" width="21" height="21" rx="4.5" fill="#512BD4" />
    <path
      d="M5.6 16.4V7.6h1.9l4 6.1V7.6h1.8v8.8h-1.9l-4-6.1v6.1Z"
      fill="#fff"
    />
    <path
      d="M14.7 9.2V7.6h5.7v1.6h-2v6.6a.5.5 0 0 1-.9.35"
      stroke="#fff"
      strokeWidth="1.3"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="17.6" cy="15.6" r="0.95" fill="#fff" />
  </svg>
);

/** React — the nucleus and its three orbital ellipses, in React cyan. */
export const ReactGlyph: GlyphComponent = (props) => (
  <svg {...glyphProps(props)} fill="none">
    <circle cx="12" cy="12" r="2.2" fill="#61DAFB" />
    <g stroke="#61DAFB" strokeWidth="1.2">
      <ellipse cx="12" cy="12" rx="10" ry="4.1" />
      <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

/** Every glyph keyed by the name used in the visualizer's node config. */
export const techGlyphs = {
  Flutter: { Glyph: FlutterGlyph, color: "#54C5F8" },
  Kotlin: { Glyph: KotlinGlyph, color: "#A97BFF" },
  Java: { Glyph: JavaGlyph, color: "#F0943C" },
  Spring: { Glyph: SpringGlyph, color: "#6DB33F" },
  ".NET": { Glyph: DotNetGlyph, color: "#8B7BF5" },
  React: { Glyph: ReactGlyph, color: "#61DAFB" },
} as const;

export type TechGlyphName = keyof typeof techGlyphs;
