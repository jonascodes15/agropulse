const flags = [
  { x: 22, y: 30, label: "Stand-count gap" },
  { x: 68, y: 55, label: "Canopy stress" },
  { x: 45, y: 78, label: "Drainage pooling" },
];

export default function DroneMapPreview() {
  return (
    <div className="panel-border relative overflow-hidden rounded-lg bg-soil-900">
      <svg viewBox="0 0 100 100" className="h-64 w-full" role="img" aria-label="Drone orthomosaic map with flagged field zones">
        <defs>
          <linearGradient id="rowGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-chlorophyll)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="var(--color-soil-900)" />
        {/* planting rows */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={i}
            x1={i * 7 + 2}
            y1="0"
            x2={i * 7 - 6}
            y2="100"
            stroke="url(#rowGradient)"
            strokeWidth="1.6"
          />
        ))}
        {flags.map((f, i) => (
          <g key={i}>
            <circle cx={f.x} cy={f.y} r="2.4" fill="var(--color-amber)" stroke="var(--color-soil-950)" strokeWidth="0.6" />
            <circle cx={f.x} cy={f.y} r="4.5" fill="none" stroke="var(--color-amber)" strokeWidth="0.4" opacity="0.6" />
          </g>
        ))}
      </svg>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line/60 bg-panel/80 px-4 py-3 text-xs">
        {flags.map((f, i) => (
          <span key={i} className="flex items-center gap-1.5 text-parchment-dim">
            <span className="h-1.5 w-1.5 rounded-full bg-amber" /> {f.label}
          </span>
        ))}
      </div>
    </div>
  );
}
