import { useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimatedNumber } from "./useAnimatedNumber";

export function useCountOnView(
  to: number,
  durationMs = 1600,
  from = 0
): [React.RefObject<HTMLElement | null>, number] {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const value = useAnimatedNumber(from, to, durationMs, { start: inView });
  return [ref, value];
}
