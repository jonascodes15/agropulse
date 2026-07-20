import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { tourTabs } from "../data/mockData";
import SoilGrid from "./SoilGrid";
import YieldChart from "./YieldChart";
import DroneMapPreview from "./DroneMapPreview";
import ScrollReveal from "./ScrollReveal";

const visuals: Record<string, React.ReactNode> = {
  soil: <SoilGrid />,
  yield: <YieldChart />,
  drone: <DroneMapPreview />,
};

export default function InteractiveTour() {
  const [activeId, setActiveId] = useState(tourTabs[0].id);
  const active = tourTabs.find((t) => t.id === activeId)!;

  return (
    <section id="tour" className="border-b border-line/70 bg-soil-900/40 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-signal-bright">
            The platform
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
            One tool, three ways to see the farm.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div
            role="tablist"
            aria-label="Platform features"
            className="mt-10 flex flex-wrap gap-2 border-b border-line/70"
          >
            {tourTabs.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeId === tab.id}
                onClick={() => setActiveId(tab.id)}
                className={`focus-ring relative rounded-t-md px-4 py-3 text-sm font-medium transition-colors ${
                  activeId === tab.id
                    ? "text-parchment"
                    : "text-parchment-faint hover:text-parchment-dim"
                }`}
              >
                {tab.label}
                {activeId === tab.id && (
                  <motion.span
                    layoutId="tour-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-chlorophyll-bright"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <p className="text-xs uppercase tracking-widest text-parchment-faint">{active.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl font-semibold text-parchment sm:text-3xl">
                {active.headline}
              </h3>
              <p className="mt-4 max-w-md leading-relaxed text-parchment-dim">{active.body}</p>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id + "-visual"}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              whileHover={{ scale: 1.01 }}
              className="panel-border rounded-xl bg-panel/90 p-5"
            >
              {visuals[active.id]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
