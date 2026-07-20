import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface LiveReading {
  metric: string;
  value: number;
  unit: string;
  status: "nominal" | "watch" | "alert";
  time: string;
}

/**
 * Fetches the latest reading per metric for a field from the real API.
 * Returns `data: null` (not an error state) if the backend isn't running or
 * has no data yet — callers should fall back to mock/demo data in that case
 * rather than showing a broken UI. This is intentionally NOT wired into any
 * component yet; swap it in wherever you're ready to replace mockData.ts.
 *
 * Example usage in Hero.tsx:
 *   const { data } = useLiveReadings("field-04");
 *   const metrics = data ?? heroMetrics; // fall back to the existing mock data
 */
export function useLiveReadings(fieldId: string, pollMs = 5000) {
  const [data, setData] = useState<LiveReading[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: number;

    async function fetchOnce() {
      try {
        const res = await fetch(`${API_BASE}/fields/${fieldId}/readings/latest`);
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const json = (await res.json()) as LiveReading[];
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : "Failed to reach API");
        }
      }
    }

    fetchOnce();
    timer = window.setInterval(fetchOnce, pollMs);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [fieldId, pollMs]);

  return { data, error };
}
