import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const bootLines = [
  "Connecting sensor gateways...",
  "Calibrating soil probes...",
  "Syncing satellite imagery...",
  "Field network ready.",
];

interface Props {
  onFinish: () => void;
}

export default function LoadingScreen({ onFinish }: Props) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const totalMs = prefersReduced ? 400 : 2100;
    const start = performance.now();

    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / totalMs, 1);
      setProgress(Math.round(t * 100));
      setLineIndex(Math.min(bootLines.length - 1, Math.floor(t * bootLines.length)));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setExiting(true), prefersReduced ? 100 : 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {!exiting && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-soil-950"
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        >
          <div className="relative flex h-28 w-28 items-center justify-center">
            {[0, 0.5, 1].map((delay) => (
              <motion.span
                key={delay}
                className="absolute rounded-full border border-chlorophyll-bright"
                initial={{ width: 24, height: 24, opacity: 0.6 }}
                animate={{ width: 112, height: 112, opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity, delay }}
              />
            ))}
            <span className="h-3 w-3 rounded-full bg-chlorophyll-bright" />
          </div>

          <motion.p
            className="font-display mt-8 text-2xl font-semibold tracking-tight text-parchment"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            AgroPulse
          </motion.p>

          <div className="mt-6 h-px w-56 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full bg-chlorophyll-bright"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="readout mt-4 flex items-center gap-2 text-xs text-parchment-faint">
            <span className="tabular-nums">{String(progress).padStart(3, "0")}%</span>
            <span aria-live="polite">{bootLines[lineIndex]}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
