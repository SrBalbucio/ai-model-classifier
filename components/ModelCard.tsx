import Link from "next/link";
import type { ModelWithRatings } from "@/lib/types";
import { CATEGORIES } from "@/lib/categories";
import { ModelLogo } from "./ModelLogo";
import { RadarChart } from "./RadarChart";

export function ModelCard({ model }: { model: ModelWithRatings }) {
  const labels = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  const radarValues = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, model.ratings[c.id] ?? 0]),
  );

  return (
    <Link href={`/models/${encodeURIComponent(model.id)}`} className="card card-hover block p-5">
      <div className="flex items-start gap-4">
        <ModelLogo name={model.name} logoUrl={model.logo_url} size={52} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-snow">{model.name}</h3>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: model.average != null ? "var(--color-accent)" : "var(--color-edge-2)" }}
            >
              {model.average != null ? model.average.toFixed(1) : "—"}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="chip">{model.provider}</span>
            <span className="text-xs text-fog">{model.rated_count}/9 rated</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <RadarChart
          values={radarValues}
          labels={labels}
          color="var(--color-accent)"
          size={230}
        />
      </div>
    </Link>
  );
}
