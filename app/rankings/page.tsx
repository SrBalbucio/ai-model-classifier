import { listModels } from "@/lib/models";
import { CATEGORIES } from "@/lib/categories";
import { RankingsClient } from "./RankingsClient";

export default function RankingsPage() {
  const models = listModels();

  const data: Record<string, { model: (typeof models)[number]; score: number }[]> = {};
  for (const cat of CATEGORIES) {
    data[cat.id] = models
      .filter((m) => m.ratings[cat.id] != null)
      .map((m) => ({ model: m, score: m.ratings[cat.id] }))
      .sort((a, b) => b.score - a.score);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rankings</h1>
        <p className="mt-1 text-sm text-fog">Leaderboard per category.</p>
      </div>
      <RankingsClient categories={CATEGORIES} data={data} />
    </div>
  );
}
