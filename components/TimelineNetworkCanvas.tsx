"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient network background for the Experience timeline.
 *
 * Renders a handful of drifting nodes with faint connecting lines on a
 * single <canvas>, positioned absolutely behind the timeline content.
 * Everything is drawn at low opacity so the text stays fully readable.
 *
 * Reactivity, added on top of the base drift:
 *  - Cursor: nodes within a radius of the pointer are gently pushed away
 *    and glow brighter; a few faint lines connect the cursor to nearby
 *    nodes. Pointer position is tracked in viewport coordinates via a
 *    passive `pointermove` listener and converted to canvas-local
 *    coordinates once per animation frame — no per-event work.
 *  - Scroll: each frame's scroll delta is converted into a small shared
 *    velocity impulse applied to every node (mostly vertical, so the field
 *    feels like it drifts with the page) and decays back to zero shortly
 *    after scrolling stops, plus a brief brightness pulse.
 *
 * Performance stays cheap and steady: a single requestAnimationFrame loop
 * drives everything (no per-frame React state/re-renders), node count is
 * capped, connecting lines are distance-culled, the loop pauses entirely
 * when the section is off screen, the tab is hidden, or the visitor has
 * requested reduced motion, and pointer/scroll handlers only write plain
 * variables that the loop reads on its own schedule.
 */

const NODE_COLORS = ["34,211,238", "155,93,229", "99,102,241"]; // cyan / violet / indigo, as raw rgb triplets

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

// Nodes per 10,000px² of canvas area, clamped to a sane range so the effect
// stays light on both a small card and an ultra-wide monitor.
const DENSITY = 1 / 9000;
const MIN_NODES = 14;
const MAX_NODES = 42;
const LINK_DISTANCE = 140;
const MAX_DPR = 2;

// Cursor interaction tuning.
const CURSOR_RADIUS = 120;
const CURSOR_PUSH = 0.55;
const CURSOR_LINKS = 5;

// Scroll interaction tuning.
const SCROLL_IMPULSE_SCALE = 0.02;
const SCROLL_IMPULSE_MAX = 2.2;
const SCROLL_DECAY = 0.92;

export default function TimelineNetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true }) as CanvasRenderingContext2D;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = reduceMotionQuery.matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let nodes: Node[] = [];
    let frameId = 0;
    let running = false;
    let visible = false;

    // Canvas position in viewport coordinates, refreshed on resize/scroll so
    // pointer math stays correct as the page (and this section) moves.
    let rect = { left: 0, top: 0 };

    // Raw pointer position in viewport coordinates, written by the listener
    // below and converted to canvas-local coordinates once per frame.
    let rawPointerX: number | null = null;
    let rawPointerY: number | null = null;

    // Canvas-local pointer coordinates, recomputed once per frame in loop().
    let pointerX: number | null = null;
    let pointerY: number | null = null;

    // Scroll reactivity state.
    let lastScrollY = window.scrollY;
    let scrollImpulse = 0; // signed vertical "kick" shared by all nodes
    let scrollGlow = 0; // 0..1, brief brightness pulse on scroll

    function seedNodes() {
      const count = Math.round(
        Math.min(MAX_NODES, Math.max(MIN_NODES, width * height * DENSITY))
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1 + Math.random() * 1.6,
        color: NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)],
      }));
    }

    function updateRect() {
      const r = canvas!.getBoundingClientRect();
      rect = { left: r.left, top: r.top };
    }

    function resize() {
      if (!canvas) return;
      const r = canvas.getBoundingClientRect();
      width = r.width;
      height = r.height;
      rect = { left: r.left, top: r.top };
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedNodes();
      if (reduceMotion) render();
    }

    function step(node: Node) {
      // Ambient drift plus a share of the current scroll impulse.
      node.x += node.vx;
      node.y += node.vy + scrollImpulse;

      // Gentle cursor repulsion: nodes inside the radius get nudged away,
      // stronger the closer they are.
      if (pointerX !== null && pointerY !== null) {
        const dx = node.x - pointerX;
        const dy = node.y - pointerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 0 && dist < CURSOR_RADIUS) {
          const force = ((CURSOR_RADIUS - dist) / CURSOR_RADIUS) * CURSOR_PUSH;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }

      if (node.x <= 0 || node.x >= width) node.vx *= -1;
      if (node.y <= 0 || node.y >= height) node.vy *= -1;
      node.x = Math.min(Math.max(node.x, 0), width);
      node.y = Math.min(Math.max(node.y, 0), height);
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const glow = scrollGlow; // 0..1 brightness boost from recent scrolling

      // Connecting lines, only between nearby nodes to keep the draw count low.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * (0.16 + glow * 0.1);
            ctx.strokeStyle = `rgba(145,152,169,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Faint lines from the cursor to its closest nearby nodes.
      if (pointerX !== null && pointerY !== null) {
        const px = pointerX;
        const py = pointerY;
        const near = nodes
          .map((n) => {
            const dx = n.x - px;
            const dy = n.y - py;
            return { n, dist: Math.sqrt(dx * dx + dy * dy) };
          })
          .filter((e) => e.dist < CURSOR_RADIUS)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, CURSOR_LINKS);

        for (const { n, dist } of near) {
          const alpha = (1 - dist / CURSOR_RADIUS) * 0.35;
          ctx.strokeStyle = `rgba(34,211,238,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }

      // Nodes on top of the lines. Nodes near the cursor pulse brighter and
      // slightly larger; a recent scroll gives every node a subtle boost.
      for (const node of nodes) {
        let boost = glow * 0.25;
        let radiusBoost = 0;
        if (pointerX !== null && pointerY !== null) {
          const dx = node.x - pointerX;
          const dy = node.y - pointerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS) {
            const proximity = 1 - dist / CURSOR_RADIUS;
            boost += proximity * 0.4;
            radiusBoost = proximity * 1.4;
          }
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${node.color},${Math.min(0.9, 0.55 + boost)})`;
        ctx.arc(node.x, node.y, node.r + radiusBoost, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function loop() {
      if (!running) return;

      // Sample scroll once per frame (not per scroll event) and turn the
      // delta into a small, decaying velocity impulse shared by all nodes.
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      lastScrollY = scrollY;
      if (scrollDelta !== 0) {
        const impulse = Math.max(
          -SCROLL_IMPULSE_MAX,
          Math.min(SCROLL_IMPULSE_MAX, scrollDelta * SCROLL_IMPULSE_SCALE)
        );
        scrollImpulse = impulse;
        scrollGlow = Math.min(1, scrollGlow + Math.abs(scrollDelta) * 0.01);
        updateRect();
      } else {
        scrollImpulse *= SCROLL_DECAY;
      }
      scrollGlow *= SCROLL_DECAY;

      // Convert the tracked viewport pointer into canvas-local coordinates,
      // ignoring points that have drifted far outside the section.
      if (rawPointerX !== null && rawPointerY !== null) {
        const localX = rawPointerX - rect.left;
        const localY = rawPointerY - rect.top;
        if (localX < -40 || localX > width + 40 || localY < -40 || localY > height + 40) {
          pointerX = null;
          pointerY = null;
        } else {
          pointerX = localX;
          pointerY = localY;
        }
      } else {
        pointerX = null;
        pointerY = null;
      }

      for (const node of nodes) step(node);
      render();
      frameId = requestAnimationFrame(loop);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      lastScrollY = window.scrollY;
      frameId = requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      if (frameId) cancelAnimationFrame(frameId);
    }

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(canvas);

    const handlePointerMove = (e: PointerEvent) => {
      rawPointerX = e.clientX;
      rawPointerY = e.clientY;
    };
    const handlePointerLeave = () => {
      rawPointerX = null;
      rawPointerY = null;
    };
    // The canvas itself is pointer-events: none (so the timeline stays
    // clickable/selectable), so listeners live on window; loop() converts
    // to local coordinates and ignores points far outside the section.
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
      if (reduceMotion) {
        stop();
        render();
      } else if (visible) {
        start();
      }
    };
    reduceMotionQuery.addEventListener("change", handleMotionChange);

    const handleVisibilityChange = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("mouseleave", handlePointerLeave);
      reduceMotionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_92%)]"
    />
  );
}
