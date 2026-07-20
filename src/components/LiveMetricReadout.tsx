import { useAnimatedNumber } from "../hooks/useAnimatedNumber";
import type { FieldMetric } from "../data/mockData";

const statusColor: Record<FieldMetric["status"], string> = {
  nominal: "bg-chlorophyll-bright",
  watch: "bg-amber",
  alert: "bg-danger",
};

interface Props {
  metric: FieldMetric;
  delayMs?: number;
}

export default function LiveMetricReadout({ metric, delayMs = 0 }: Props) {
  const value = useAnimatedNumber(metric.from, metric.to, 2200, { delayMs });

  return (
    <div className="flex items-center justify-between gap-3 border-b border-line/60 py-3 last:border-b-0">
      <div className="flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${statusColor[metric.status]} animate-pulse-slow`}
          aria-hidden="true"
        />
        <span className="text-sm text-parchment-dim">{metric.label}</span>
      </div>
      <div className="readout text-base text-parchment">
        {value.toFixed(metric.decimals)}
        <span className="ml-1 text-xs text-parchment-faint">{metric.unit}</span>
      </div>
    </div>
  );
}
