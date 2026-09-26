"use client";

import { useRef } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";

interface TiltOptions {
  /** Maximum rotation in degrees at the far edge of the card. */
  max?: number;
}

export interface Tilt {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  /** 0-1 pointer position, for a highlight that follows the cursor. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/**
 * Cursor-following 3D tilt.
 *
 * Pointer position is normalised to 0-1 across the element and mapped to a
 * small rotation, then run through a spring so the card settles rather than
 * snapping. Two deliberate limits:
 *
 * - Mouse only. Touch pointers are ignored, because on a phone the "tilt"
 *   would fire on the same gesture used to tap or scroll the card.
 * - Reduced motion disables it entirely, returning values pinned to centre.
 */
export function useTilt({ max = 7 }: TiltOptions = {}): Tilt {
  const reduceMotion = useReducedMotion();
  const enabled = useRef(true);
  enabled.current = !reduceMotion;

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 22, mass: 0.4 };
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-max, max]), spring);

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!enabled.current || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX.set((e.clientX - rect.left) / rect.width);
    pointerY.set((e.clientY - rect.top) / rect.height);
  };

  const onPointerLeave = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
  };

  return { rotateX, rotateY, pointerX, pointerY, onPointerMove, onPointerLeave };
}
