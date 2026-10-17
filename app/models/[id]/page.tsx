import Link from "next/link";
import { notFound } from "next/navigation";
import { getModel, formatContext, formatPrice } from "@/lib/models";
import { CATEGORIES } from "@/lib/categories";
import { ModelLogo } from "@/components/ModelLogo";
import { RadarChart } from "@/components/RadarChart";
import { RatingSlider } from "@/components/RatingSlider";
import { NotesTextarea } from "@/components/NotesTextarea";
import { DeleteButton } from "@/components/DeleteButton";

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId);
  const model = getModel(id);
  if (!model) notFound();

  const labels = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
  const radarValues = Object.fromEntries(CATEGORIES.map((c) => [c.id, model.ratings[c.id] ?? 0]));

  const external: { label: string; value: string; category?: string }[] = [
    { label: "Context window", value: formatContext(model.context_length), category: "context_window" },
    { label: "Prompt / 1M", value: formatPrice(model.price_prompt), category: "cost" },
    { label: "Completion / 1M", value: formatPrice(model.price_completion), category: "cost" },
    { label: "Intelligence index", value: model.aa_intelligence?.toFixed(1) ?? "—", category: "reasoning" },
    { label: "Coding index", value: model.aa_coding?.toFixed(1) ?? "—", category: "task_completion" },
    { label: "Agentic index", value: model.aa_agentic?.toFixed(1) ?? "—", category: "task_completion" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-fog hover:text-snow">
          ← Back
        </Link>
      </div>

      <div className="card flex flex-wrap items-start gap-6 p-6">
        <ModelLogo name={model.name} logoUrl={model.logo_url} size={84} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{model.name}</h1>
            <span className="chip">{model.provider}</span>
            <span className="chip">{model.source}</span>
          </div>
          {model.description && (
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fog">{model.description}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {external.map((e) => (
              <span key={e.label} className="chip">
                <span className="text-fog">{e.label}:</span>
                <span className="font-medium text-mist">{e.value}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-4xl font-bold tabular-nums"
            style={{ color: model.average != null ? "var(--color-accent)" : "var(--color-edge-2)" }}
          >
            {model.average != null ? model.average.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-fog">average</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card flex flex-col items-center gap-4 p-6">
          <h2 className="self-start text-sm font-semibold text-mist">Profile</h2>
          <RadarChart values={radarValues} labels={labels} color="var(--color-accent)" size={340} />
        </div>

        <div className="card space-y-5 p-6">
          <h2 className="text-sm font-semibold text-mist">Rate this model</h2>
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: cat.color }}>
                      {cat.label}
                    </span>
                    {cat.inverted && (
                      <span className="chip text-[10px]">higher = better</span>
                    )}
                  </div>
                  <p className="text-xs text-fog">{cat.description}</p>
                </div>
              </div>
              <RatingSlider
                modelId={model.id}
                category={cat}
                value={model.ratings[cat.id] ?? null}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card space-y-4 p-6">
        <h2 className="text-sm font-semibold text-mist">Private notes</h2>
        <NotesTextarea modelId={model.id} initial={model.note} />
      </div>

      <div className="flex justify-end">
        <DeleteButton modelId={model.id} />
      </div>
    </div>
  );
}
