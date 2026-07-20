import { useEffect, useRef, useState } from "react";

/**
 * Animates a numeric value from `from` to `to` over `durationMs`,
 * using an ease-out curve. Used to fake "live telemetry" without a backend.
 *
 * Pass `start: false` to hold at `from` until the caller flips it to true
 * (e.g. once an element scrolls into view) — see useCountOnView.
 */
export function useAnimatedNumber(
  from: number,
  to: number,
  durationMs = 1800,
  options?: { delayMs?: number; start?: boolean }
): number {
  const { delayMs = 0, start = true } = options ?? {};
  const [value, setValue] = useState(from);
  const rafRef = useRef<number | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!start || hasRun.current) return;
    hasRun.current = true;

    let startTime: number | null = null;
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    const timeout = window.setTimeout(() => {
      const step = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
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
  }, [start, from, to, durationMs, delayMs]);

  return value;
}
