import Link from "next/link";
import { listModels } from "@/lib/models";
import { ModelCard } from "@/components/ModelCard";

export default function DashboardPage() {
  const models = listModels();
  const rated = models.filter((m) => m.rated_count > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your models</h1>
          <p className="mt-1 text-sm text-fog">
            {models.length} saved · {rated.length} rated ·{" "}
            <Link href="/add" className="text-accent hover:underline">
              add a model
            </Link>
          </p>
        </div>
      </div>

      {models.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 p-12 text-center">
          <p className="text-fog">No models yet.</p>
          <Link href="/add" className="btn btn-primary">
            Add your first model
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((m) => (
            <ModelCard key={m.id} model={m} />
          ))}
        </div>
      )}
    </div>
  );
}
