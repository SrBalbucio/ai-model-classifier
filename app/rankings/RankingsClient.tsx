"use client";

import { useState } from "react";
import type { Category, ModelWithRatings } from "@/lib/types";
import { ModelLogo } from "@/components/ModelLogo";

interface RankedRow {
  model: ModelWithRatings;
  score: number;
}

export function RankingsClient({
  categories,
  data,
}: {
  categories: Category[];
  data: Record<string, RankedRow[]>;
}) {
  const [active, setActive] = useState(categories[0].id);
  const rows = data[active] ?? [];
  const cat = categories.find((c) => c.id === active)!;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className="btn"
            style={
              active === c.id
                ? { borderColor: c.color, color: c.color }
                : undefined
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className="card p-8 text-center text-sm text-fog">
          No ratings yet for {cat.label}. Rate models from the dashboard.
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge text-left label">
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Model</th>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 text-right font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.model.id}
                  className="border-b border-edge/50 last:border-0 hover:bg-panel-2/40"
                >
                  <td className="px-4 py-2.5 text-fog tabular-nums">{i + 1}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <ModelLogo name={row.model.name} logoUrl={row.model.logo_url} size={30} />
                      <span className="font-medium text-snow">{row.model.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-fog">{row.model.provider}</td>
                  <td
                    className="px-4 py-2.5 text-right font-semibold tabular-nums"
                    style={{ color: cat.color }}
                  >
                    {row.score.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
