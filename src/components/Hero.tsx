import { motion } from "framer-motion";
import { heroMetrics } from "../data/mockData";
import LiveMetricReadout from "./LiveMetricReadout";

export default function Hero() {
  return (
    <section id="top" className="contour-field relative overflow-hidden border-b border-line/70">
      {/* ambient scanline — the one deliberate motion accent in the hero */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]" aria-hidden="true">
        <div className="h-40 w-full bg-gradient-to-b from-transparent via-chlorophyll-bright to-transparent animate-scan" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:items-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-signal-bright">
            <span className="h-px w-6 bg-signal-bright" aria-hidden="true" />
            Precision agriculture platform
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-parchment sm:text-5xl lg:text-6xl">
            The operating system for modern agriculture.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-parchment-dim">
            AgroPulse turns soil sensors, satellite imagery, and drone flights
            into one live picture of the farm — so decisions get made from
            data, not from a guess at the fence line.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#roi"
              className="focus-ring rounded-md bg-chlorophyll px-6 py-3 text-sm font-semibold text-soil-950 transition-colors hover:bg-chlorophyll-bright"
            >
              Estimate your savings
            </a>
            <a
              href="#tour"
              className="focus-ring rounded-md border border-line px-6 py-3 text-sm font-medium text-parchment transition-colors hover:border-parchment-dim"
            >
              See the platform
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="panel-border rounded-xl bg-panel/90 p-5 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-parchment-faint">Field 04 — North Block</p>
                <p className="readout text-xs text-signal-bright">STREAMING · SENSOR-GW-118</p>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-chlorophyll-bright animate-pulse-slow" aria-hidden="true" />
            </div>

            <div className="divide-y divide-line/60">
              {heroMetrics.map((metric, i) => (
                <LiveMetricReadout key={metric.id} metric={metric} delayMs={200 + i * 220} />
              ))}
            </div>

            <div className="mt-4 rounded-md bg-soil-900/70 px-3 py-2 text-xs text-parchment-faint">
              Irrigation triggered automatically at 27.3% moisture threshold.
            </div>
          </div>

          {/* signature: a faint secondary panel peeking out behind, implying a stack of field reports */}
          <div
            className="panel-border absolute -right-4 -top-4 -z-10 h-full w-full rounded-xl bg-panel/40"
            aria-hidden="true"
          />
        </motion.div>
      </div>
    </section>
  );
}
