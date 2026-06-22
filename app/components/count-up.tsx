"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts a stat value up to its target once, when scrolled into view.
 * - Preserves prefix/suffix: "£40m+" → counts "40", keeps "£" and "m+".
 * - Leaves non-stat values static (e.g. "< 1 day", or values under 5).
 * - SSR + reduced-motion render the final value; off-screen it resets to 0,
 *   so there's no flicker when it scrolls in.
 */
function parse(value: string) {
  const match = value.match(/^(£?)(\d+)(.*)$/);
  if (!match) return null;
  const target = Number(match[2]);
  if (target < 5) return null;
  return { prefix: match[1], target, suffix: match[3] };
}

export function CountUp({
  value,
  className = "",
  duration = 0.9,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();

  // Drive the text via the DOM node directly — no per-frame React state.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const parsed = parse(value);
    if (!parsed || reduce) {
      node.textContent = value;
      return;
    }
    if (!inView) {
      node.textContent = `${parsed.prefix}0${parsed.suffix}`;
      return;
    }
    const controls = animate(0, parsed.target, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        node.textContent = `${parsed.prefix}${Math.round(v)}${parsed.suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
