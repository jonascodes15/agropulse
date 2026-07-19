import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from `from` to `to` over `durationMs`,
 * using an ease-out curve. Used to fake "live telemetry" without a backend.
 */
export function useAnimatedNumber(
  from: number,
  to: number,
  durationMs = 1800,
  delayMs = 0
): number {
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    const timeout = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const t = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
        setValue(from + (to - from) * eased);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, durationMs, delayMs]);

  return value;
}
