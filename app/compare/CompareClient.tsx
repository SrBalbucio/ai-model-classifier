"use client";

import { useMemo, useState } from "react";
import type { Category, ModelWithRatings } from "@/lib/types";
import { ModelLogo } from "@/components/ModelLogo";
import { RadarChart } from "@/components/RadarChart";

function scoreColor(score: number, color: string): string {
  return score >= 7 ? color : score >= 4 ? "var(--color-warn)" : "var(--color-bad)";
}

export function CompareClient({
  models,
  categories,
}: {
  models: ModelWithRatings[];
  categories: Category[];
}) {
  const [aId, setAId] = useState<string>("");
  const [bId, setBId] = useState<string>("");

  const a = useMemo(() => models.find((m) => m.id === aId) ?? null, [models, aId]);
  const b = useMemo(() => models.find((m) => m.id === bId) ?? null, [models, bId]);

  const labels = Object.fromEntries(categories.map((c) => [c.id, c.label]));
  const valuesA = Object.fromEntries(categories.map((c) => [c.id, a?.ratings[c.id] ?? 0]));
  const valuesB = Object.fromEntries(categories.map((c) => [c.id, b?.ratings[c.id] ?? 0]));

  const options = models.map((m) => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card space-y-3 p-5">
          <span className="label">Model A</span>
          <select value={aId} onChange={(e) => setAId(e.target.value)} className="input">
            <option value="">Select a model…</option>
            {options}
          </select>
          {a && (
            <div className="flex items-center gap-3 pt-1">
              <ModelLogo name={a.name} logoUrl={a.logo_url} size={38} />
              <div>
                <div className="text-sm font-medium text-snow">{a.name}</div>
                <div className="text-xs text-fog">
                  {a.provider} · avg{" "}
                  {a.average != null ? a.average.toFixed(1) : "—"}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card space-y-3 p-5">
          <span className="label">Model B</span>
          <select value={bId} onChange={(e) => setBId(e.target.value)} className="input">
            <option value="">Select a model…</option>
            {options}
          </select>
          {b && (
            <div className="flex items-center gap-3 pt-1">
              <ModelLogo name={b.name} logoUrl={b.logo_url} size={38} />
              <div>
                <div className="text-sm font-medium text-snow">{b.name}</div>
                <div className="text-xs text-fog">
                  {b.provider} · avg{" "}
                  {b.average != null ? b.average.toFixed(1) : "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {a && b ? (
        <>
          <div className="card flex flex-col items-center gap-2 p-6">
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--color-accent)" }} />
                {a.name}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: "var(--color-bad)" }} />
                {b.name}
              </span>
            </div>
            <RadarChart
              values={valuesA}
              labels={labels}
              color="var(--color-accent)"
              compareValues={valuesB}
              compareColor="var(--color-bad)"
              size={400}
            />
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge text-left label">
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 text-right font-medium">{a.name}</th>
                  <th className="px-4 py-3 text-right font-medium">{b.name}</th>
                  <th className="px-4 py-3 text-right font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const sa = a.ratings[cat.id] ?? 0;
                  const sb = b.ratings[cat.id] ?? 0;
                  const winner = sa === sb ? "—" : sa > sb ? a.name : b.name;
                  return (
                    <tr key={cat.id} className="border-b border-edge/50 last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-medium" style={{ color: cat.color }}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span style={{ color: scoreColor(sa, cat.color) }}>
                          {sa > 0 ? sa.toFixed(1) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span style={{ color: scoreColor(sb, cat.color) }}>
                          {sb > 0 ? sb.toFixed(1) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-mist">{winner}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="card p-8 text-center text-sm text-fog">
          Pick two models above to compare them.
        </div>
      )}
    </div>
  );
}
