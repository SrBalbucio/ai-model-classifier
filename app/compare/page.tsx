import { listModels } from "@/lib/models";
import { CATEGORIES } from "@/lib/categories";
import { CompareClient } from "./CompareClient";

export default function ComparePage() {
  const models = listModels();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Compare</h1>
        <p className="mt-1 text-sm text-fog">Two models, side by side.</p>
      </div>
      <CompareClient models={models} categories={CATEGORIES} />
    </div>
  );
}
