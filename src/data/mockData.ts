// Hardcoded mock states — stand-ins for what would normally stream from
// a telemetry/ingestion pipeline (sensor gateways -> Kafka -> API).

export interface FieldMetric {
  id: string;
  label: string;
  unit: string;
  from: number;
  to: number;
  decimals: number;
  status: "nominal" | "watch" | "alert";
}

// Hero mini-dashboard: values animate from `from` -> `to` on load, then hold,
// simulating a moisture drop that gets caught and stabilized by irrigation.
export const heroMetrics: FieldMetric[] = [
  { id: "moisture", label: "Soil Moisture", unit: "%", from: 41.8, to: 27.3, decimals: 1, status: "watch" },
  { id: "canopy_temp", label: "Canopy Temp", unit: "°C", from: 22.1, to: 24.6, decimals: 1, status: "nominal" },
  { id: "npk", label: "Nitrogen Index", unit: "ppm", from: 38, to: 44, decimals: 0, status: "nominal" },
  { id: "irrigation", label: "Irrigation Draw", unit: "L/min", from: 0, to: 860, decimals: 0, status: "alert" },
];

export interface TourTab {
  id: string;
  label: string;
  eyebrow: string;
  headline: string;
  body: string;
}

export const tourTabs: TourTab[] = [
  {
    id: "soil",
    label: "Soil Analytics",
    eyebrow: "Sensor network",
    headline: "Every hectare, sampled every 15 minutes.",
    body: "Underground probes stream moisture, EC, and nutrient readings into one field map, so you catch drought stress before the canopy shows it.",
  },
  {
    id: "yield",
    label: "Yield Forecasting",
    eyebrow: "Predictive model",
    headline: "A yield curve that updates as the season moves.",
    body: "Weather, soil, and satellite NDVI feed a rolling forecast model, giving you a projected harvest range instead of a single guess in July.",
  },
  {
    id: "drone",
    label: "Drone Mapping",
    eyebrow: "Aerial imagery",
    headline: "Field-scale imagery, resolved down to the row.",
    body: "Scheduled flights stitch into a single orthomosaic per field, flagging stand-count gaps and canopy stress zones automatically.",
  },
];

// Field-level plot grid for the "Soil Analytics" tab — a stylized vector
// representation of stress readings across a subdivided farm block.
export const soilGrid: number[] = [
  0.9, 0.85, 0.4, 0.3, 0.82, 0.88,
  0.86, 0.5, 0.35, 0.28, 0.6, 0.9,
  0.7, 0.42, 0.2, 0.25, 0.55, 0.85,
  0.88, 0.8, 0.45, 0.38, 0.78, 0.92,
];

// Predictive yield curve — tons/hectare, projected across the growing season.
export const yieldCurve = [
  { week: "W1", low: 0, mid: 0, high: 0 },
  { week: "W4", low: 0.8, mid: 1.1, high: 1.4 },
  { week: "W8", low: 2.6, mid: 3.4, high: 4.0 },
  { week: "W12", low: 4.8, mid: 5.9, high: 6.7 },
  { week: "W16", low: 6.5, mid: 8.1, high: 9.2 },
  { week: "W20", low: 7.7, mid: 9.6, high: 10.9 },
  { week: "W24", low: 8.1, mid: 10.2, high: 11.8 },
];

export interface CropProfile {
  id: string;
  label: string;
  waterLitersPerHectarePerYear: number;
  savingsRatePct: number;
  yieldUpliftPct: number;
}

// Baseline water use + expected efficiency gains, by crop type — used by
// the ROI calculator to turn two slider inputs into an estimate.
export const cropProfiles: CropProfile[] = [
  { id: "maize", label: "Maize", waterLitersPerHectarePerYear: 6_500_000, savingsRatePct: 0.18, yieldUpliftPct: 0.09 },
  { id: "wheat", label: "Wheat", waterLitersPerHectarePerYear: 4_200_000, savingsRatePct: 0.16, yieldUpliftPct: 0.07 },
  { id: "soy", label: "Soybean", waterLitersPerHectarePerYear: 5_100_000, savingsRatePct: 0.21, yieldUpliftPct: 0.11 },
  { id: "cotton", label: "Cotton", waterLitersPerHectarePerYear: 7_800_000, savingsRatePct: 0.24, yieldUpliftPct: 0.10 },
];

export interface PricingTier {
  id: string;
  name: string;
  monthly: number;
  annualMonthly: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "standard",
    name: "Standard",
    monthly: 129,
    annualMonthly: 99,
    tagline: "For a single field operation getting off spreadsheets.",
    features: ["Up to 200 hectares", "Soil sensor ingestion", "Weekly satellite NDVI", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 349,
    annualMonthly: 279,
    tagline: "For multi-field operations that need forecasting.",
    features: ["Up to 2,000 hectares", "Yield forecasting model", "Weekly drone mapping", "ROI reporting", "Priority support"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: 0,
    annualMonthly: 0,
    tagline: "For agribusiness portfolios spanning regions.",
    features: ["Unlimited hectares", "Custom data pipelines", "Dedicated agronomist", "SLA-backed uptime", "SSO & audit logs"],
  },
];
