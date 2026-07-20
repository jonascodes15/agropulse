import { trustStats } from "../data/mockData";
import { useCountOnView } from "../hooks/useCountOnView";
import ScrollReveal from "./ScrollReveal";

export default function TrustStats() {
  return (
    <section className="border-b border-line/70 bg-soil-900/40 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-[0.2em] text-parchment-faint">
            Trusted by field operations across three continents
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustStats.map((stat, i) => (
            <ScrollReveal key={stat.id} delay={i * 0.08} className="text-center">
              <StatValue stat={stat} />
              <p className="mt-2 text-sm text-parchment-dim">{stat.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatValue({ stat }: { stat: (typeof trustStats)[number] }) {
  const [ref, value] = useCountOnView(stat.to, 1700);
  return (
    <p ref={ref as React.RefObject<HTMLParagraphElement>} className="readout text-3xl font-semibold text-chlorophyll-bright sm:text-4xl">
      {stat.prefix}
      {value.toFixed(stat.decimals)}
      {stat.suffix}
    </p>
  );
}
