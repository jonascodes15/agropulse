import { soilGrid } from "../data/mockData";

/** Maps a 0–1 stress value to a swatch on the palette: healthy chlorophyll -> stressed amber. */
function cellColor(v: number): string {
  if (v >= 0.75) return "var(--color-chlorophyll)";
  if (v >= 0.5) return "color-mix(in oklab, var(--color-chlorophyll) 50%, var(--color-amber) 50%)";
  return "var(--color-amber)";
}

export default function SoilGrid() {
  return (
    <div>
      <div className="grid grid-cols-6 gap-1.5" role="img" aria-label="Field stress grid, six columns by four rows">
        {soilGrid.map((v, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px] transition-transform hover:scale-105"
            style={{ backgroundColor: cellColor(v) }}
            title={`Block ${i + 1}: ${Math.round(v * 100)}% moisture index`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-parchment-faint">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-chlorophyll" /> Healthy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "color-mix(in oklab, var(--color-chlorophyll) 50%, var(--color-amber) 50%)" }} /> Watch
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber" /> Stressed
        </span>
      </div>
    </div>
  );
}
