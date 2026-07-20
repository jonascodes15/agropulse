import { useMemo, useState } from "react";
import { cropProfiles } from "../data/mockData";
import ScrollReveal, { ScrollStagger, staggerItem } from "./ScrollReveal";
import { motion } from "framer-motion";

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export default function ROICalculator() {
  const [hectares, setHectares] = useState(150);
  const [cropId, setCropId] = useState(cropProfiles[0].id);

  const crop = cropProfiles.find((c) => c.id === cropId)!;

  const results = useMemo(() => {
    const baselineWater = crop.waterLitersPerHectarePerYear * hectares;
    const waterSaved = baselineWater * crop.savingsRatePct;
    // Rough blended cost-per-liter assumption to translate water savings into a dollar figure.
    const costPerMillionLiters = 4.2;
    const dollarsSaved = (waterSaved / 1_000_000) * costPerMillionLiters * 1000;
    const yieldUpliftTons = hectares * crop.yieldUpliftPct * 5.5; // ~5.5 t/ha baseline yield assumption
    return { waterSaved, dollarsSaved, yieldUpliftTons };
  }, [hectares, crop]);

  return (
    <section id="roi" className="border-b border-line/70 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-signal-bright">
            Estimate your impact
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
            What would AgroPulse save on your farm?
          </h2>
          <p className="mt-4 max-w-xl text-parchment-dim">
            A rough estimate based on farm size and crop type — the kind of
            back-of-envelope number a farm manager could sanity-check before a
            real assessment.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mt-12 grid gap-8 lg:grid-cols-5">
          {/* Controls */}
          <div className="panel-border rounded-xl bg-panel/90 p-6 lg:col-span-2">
            <label htmlFor="hectares" className="flex items-center justify-between text-sm text-parchment-dim">
              Farm size
              <span className="readout text-parchment">{formatNumber(hectares)} ha</span>
            </label>
            <input
              id="hectares"
              type="range"
              min={10}
              max={5000}
              step={10}
              value={hectares}
              onChange={(e) => setHectares(Number(e.target.value))}
              className="focus-ring mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-chlorophyll-bright"
            />
            <div className="mt-1 flex justify-between text-xs text-parchment-faint">
              <span>10 ha</span>
              <span>5,000 ha</span>
            </div>

            <fieldset className="mt-8">
              <legend className="text-sm text-parchment-dim">Current crop type</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {cropProfiles.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCropId(c.id)}
                    aria-pressed={cropId === c.id}
                    className={`focus-ring rounded-md border px-3 py-2 text-sm transition-colors ${
                      cropId === c.id
                        ? "border-chlorophyll-bright bg-chlorophyll/15 text-parchment"
                        : "border-line text-parchment-dim hover:border-parchment-dim"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* Results */}
          <ScrollStagger className="grid gap-4 sm:grid-cols-3 lg:col-span-3 lg:grid-cols-1 lg:grid-rows-3">
            <motion.div variants={staggerItem}>
              <ResultCard
                label="Estimated water saved"
                value={`${formatNumber(results.waterSaved / 1000)}`}
                unit="thousand L / year"
                accent="signal"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ResultCard
                label="Estimated cost savings"
                value={`$${formatNumber(results.dollarsSaved)}`}
                unit="per year"
                accent="amber"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <ResultCard
                label="Projected yield uplift"
                value={`+${formatNumber(results.yieldUpliftTons)}`}
                unit="tons / season"
                accent="chlorophyll"
              />
            </motion.div>
          </ScrollStagger>
        </ScrollReveal>

        <p className="mt-6 text-xs text-parchment-faint">
          Figures are illustrative estimates for demonstration purposes, not a
          guarantee of results.
        </p>
      </div>
    </section>
  );
}

function ResultCard({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent: "signal" | "amber" | "chlorophyll";
}) {
  const accentClass = {
    signal: "text-signal-bright",
    amber: "text-amber",
    chlorophyll: "text-chlorophyll-bright",
  }[accent];

  return (
    <div className="panel-border flex flex-col justify-center rounded-xl bg-panel/90 px-6 py-5">
      <p className="text-sm text-parchment-dim">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`readout mt-1 text-3xl font-semibold ${accentClass}`}
      >
        {value}
      </motion.p>
      <p className="text-xs text-parchment-faint">{unit}</p>
    </div>
  );
}
