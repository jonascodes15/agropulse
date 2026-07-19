import { useState } from "react";
import { pricingTiers } from "../data/mockData";

export default function PricingMatrix() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-signal-bright">
              Pricing
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-parchment sm:text-4xl">
              Priced to the size of the operation.
            </h2>
          </div>

          <div className="panel-border flex items-center gap-1 rounded-full bg-panel/90 p-1">
            <ToggleButton active={!annual} onClick={() => setAnnual(false)}>
              Billed monthly
            </ToggleButton>
            <ToggleButton active={annual} onClick={() => setAnnual(true)}>
              Billed annually
              <span className="ml-1.5 text-signal-bright">−20%</span>
            </ToggleButton>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricingTiers.map((tier) => {
            const isCustom = tier.monthly === 0;
            const price = annual ? tier.annualMonthly : tier.monthly;

            return (
              <div
                key={tier.id}
                className={`relative rounded-xl p-7 transition-colors ${
                  tier.highlighted
                    ? "border-2 border-chlorophyll-bright bg-panel-raised"
                    : "panel-border bg-panel/90"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-7 rounded-full bg-chlorophyll-bright px-3 py-1 text-xs font-semibold text-soil-950">
                    Most deployed
                  </span>
                )}

                <h3 className="font-display text-xl font-semibold text-parchment">{tier.name}</h3>
                <p className="mt-2 min-h-[2.5rem] text-sm text-parchment-dim">{tier.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  {isCustom ? (
                    <span className="readout text-3xl font-semibold text-parchment">Custom</span>
                  ) : (
                    <>
                      <span className="readout text-3xl font-semibold text-parchment">${price}</span>
                      <span className="text-sm text-parchment-faint">/ month</span>
                    </>
                  )}
                </div>
                {!isCustom && annual && (
                  <p className="mt-1 text-xs text-parchment-faint">billed annually</p>
                )}

                <ul className="mt-6 space-y-3 text-sm text-parchment-dim">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-chlorophyll-bright" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  className={`focus-ring mt-8 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-chlorophyll-bright text-soil-950 hover:bg-chlorophyll"
                      : "border border-line text-parchment hover:border-parchment-dim"
                  }`}
                >
                  {isCustom ? "Talk to sales" : "Start free trial"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`focus-ring rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active ? "bg-chlorophyll text-soil-950" : "text-parchment-dim hover:text-parchment"
      }`}
    >
      {children}
    </button>
  );
}
