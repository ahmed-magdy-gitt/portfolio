import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#08090D",
          surface: "#111319",
          raised: "#171A22",
          border: "#232733",
        },
        // Alias for base.DEFAULT used only where a "text-*" color utility is
        // needed — "text-base" would otherwise collide with Tailwind's
        // built-in font-size scale (which also defines a "base" key).
        canvas: "#08090D",
        ink: {
          DEFAULT: "#E7E9EE",
          muted: "#9198A9",
          faint: "#5B6274",
        },
        glow: {
          indigo: "#6366F1",
          violet: "#9B5DE5",
          cyan: "#22D3EE",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "72rem",
        prose: "42rem",
      },
      boxShadow: {
        "glow-indigo":
          "0 0 0 1px rgba(99,102,241,0.35), 0 8px 30px -8px rgba(99,102,241,0.35)",
        "glow-violet":
          "0 0 0 1px rgba(155,93,229,0.35), 0 8px 30px -8px rgba(155,93,229,0.35)",
        "glow-cyan":
          "0 0 0 1px rgba(34,211,238,0.35), 0 8px 30px -8px rgba(34,211,238,0.35)",
        "glow-soft": "0 8px 40px -12px rgba(99,102,241,0.25)",
      },
      backgroundImage: {
        "field-glow":
          "radial-gradient(circle at 15% 10%, rgba(99,102,241,0.16), transparent 42%), radial-gradient(circle at 85% 0%, rgba(34,211,238,0.12), transparent 40%), radial-gradient(circle at 50% 100%, rgba(155,93,229,0.14), transparent 48%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        // Drifts an oversized gradient across clipped text (the navbar
        // wordmark) so the colour slowly travels through the letterforms.
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        // Combines a gradient sweep with a pulsing drop-shadow in one
        // keyframe (rather than two competing `animation` utilities) so the
        // hero name's colour and its glow breathe together — used nowhere
        // else, so the effect reads as a one-off signature rather than a
        // repeated site-wide tic.
        "name-shimmer": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            filter: "drop-shadow(0 0 10px rgba(56,189,248,0.30))",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            filter: "drop-shadow(0 0 22px rgba(168,85,247,0.55))",
          },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        // Sweeps a bright soft-edged highlight left-to-right along a
        // divider line, on top of its own static gradient — used for the
        // between-section separators so they read as "alive" rather than
        // static rules.
        "divider-sweep": {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulse-soft 3.2s ease-in-out infinite",
        "gradient-pan": "gradient-pan 6s ease-in-out infinite",
        "name-shimmer": "name-shimmer 5s ease-in-out infinite",
        bob: "bob 3.4s ease-in-out infinite",
        "divider-sweep": "divider-sweep 3.2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
