# AgroPulse

**The operating system for modern agriculture — a marketing site and interactive product demo for a precision agriculture platform.**

AgroPulse is a portfolio project: an enterprise SaaS landing page built for a fictional company that sells soil analytics, yield forecasting, and drone mapping software to commercial farms. It focuses on translating live, data-heavy product concepts into interactive frontend UI — animated telemetry readouts, a tabbed feature tour, a slider-driven ROI calculator, and a billing-toggle pricing matrix.

This repo currently covers the **frontend**. A Kafka + Postgres ETL pipeline that will feed the dashboard with real (simulated) sensor data is in progress — see [Roadmap](#roadmap).

## Live demo

https://agropulsehq.netlify.app

## Features

- **Live mini-dashboard hero** — soil moisture, canopy temperature, nitrogen index, and irrigation draw animate from baseline to current values on load, simulating a real-time sensor feed.
- **Interactive product tour** — tabbed interface (Soil Analytics / Yield Forecasting / Drone Mapping) with animated panel transitions, a stylized field-stress grid, a dark-mode predictive yield chart (Recharts), and an SVG drone orthomosaic preview.
- **ROI calculator** — farm size and crop type inputs drive live-recalculated water savings, cost savings, and yield uplift estimates.
- **Pricing matrix** — three-tier subscription grid with a monthly/annual billing toggle.

## Tech stack

| Layer | Tools |
|---|---|
| Framework | React 19, TypeScript, Vite |
| Styling | Tailwind CSS v4 (CSS-first `@theme` config, no `tailwind.config.js`) |
| Animation | Framer Motion |
| Charts | Recharts |
| Fonts | Space Grotesk, Inter, JetBrains Mono — self-hosted via Fontsource |

### Design notes

The visual direction avoids generic SaaS defaults (cream/terracotta gradients, neon-on-black) in favor of a deep soil-toned dark palette with chlorophyll green, amber, and signal-teal accents. Every live number on the page renders in monospace as a "readout" with a status dot, reinforcing that this is meant to feel like an instrument panel, not just marketing copy.

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Project structure

```
src/
├── data/mockData.ts           # Hardcoded telemetry, pricing, and crop data
├── hooks/useAnimatedNumber.ts # Count-up/down animation hook
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── LiveMetricReadout.tsx
│   ├── InteractiveTour.tsx
│   ├── SoilGrid.tsx
│   ├── YieldChart.tsx
│   ├── DroneMapPreview.tsx
│   ├── ROICalculator.tsx
│   ├── PricingMatrix.tsx
│   └── Footer.tsx
├── App.tsx
└── main.tsx
```

## Roadmap

The current build uses hardcoded mock data (`src/data/mockData.ts`) standing in for a real ingestion pipeline. Planned next phase:

- [ ] Simulated sensor producer streaming to a Kafka topic
- [ ] ETL consumer service (clean, validate, transform readings)
- [ ] TimescaleDB (Postgres) for time-series storage
- [ ] API layer serving live data to this frontend
- [ ] Airflow DAG for nightly yield-forecast recomputation
- [ ] Docker Compose to orchestrate the full stack locally

