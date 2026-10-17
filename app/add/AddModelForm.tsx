"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addCatalogModelAction, addManualModelAction } from "@/app/actions";
import { logoUrlForProvider } from "@/lib/provider-utils";
import type { CatalogItem } from "@/lib/types";
import { ModelLogo } from "@/components/ModelLogo";

function formatContext(len: number | null): string {
  if (len == null) return "—";
  if (len >= 1_000_000) return `${(len / 1_000_000).toFixed(1)}M`;
  if (len >= 1_000) return `${Math.round(len / 1_000)}K`;
  return String(len);
}

export function AddModelForm() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<"catalog" | "manual">("catalog");
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/openrouter?q=${encodeURIComponent(q)}`);
      const json = (await res.json()) as { results: CatalogItem[] };
      setResults(json.results ?? []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 250);
    return () => clearTimeout(t);
  }, [query, search]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleAdd(item: CatalogItem) {
    const { id } = await addCatalogModelAction(item);
    setAdded((s) => new Set(s).add(id));
    router.refresh();
  }

  async function handleManual(formData: FormData) {
    const { id } = await addManualModelAction(formData);
    router.push(`/models/${encodeURIComponent(id)}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("catalog")}
          className={`btn ${tab === "catalog" ? "btn-primary" : ""}`}
        >
          Search catalog
        </button>
        <button
          onClick={() => setTab("manual")}
          className={`btn ${tab === "manual" ? "btn-primary" : ""}`}
        >
          Add manually
        </button>
      </div>

      {tab === "catalog" ? (
        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 470+ models — e.g. claude, gpt, gemini, qwen, llama…"
            className="input"
          />
          {loading && <p className="text-sm text-fog">Searching…</p>}
          <div className="space-y-2">
            {results.map((item) => {
              const isAdded = added.has(item.id);
              return (
                <div key={item.id} className="card flex items-center gap-4 p-4">
                  <ModelLogo name={item.name} logoUrl={logoUrlForProvider(item.provider)} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-snow">{item.name}</span>
                      <span className="chip shrink-0">{item.provider}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-fog">
                      {item.description ?? "No description."}
                    </p>
                    <div className="mt-1 flex gap-2 text-xs text-fog">
                      <span>ctx {formatContext(item.context_length)}</span>
                      {item.aa_coding != null && <span>· coding {item.aa_coding}</span>}
                      {item.aa_agentic != null && <span>· agentic {item.aa_agentic}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      startTransition(() => {
                        void handleAdd(item);
                      })
                    }
                    disabled={isAdded || pending}
                    className={isAdded ? "btn opacity-60" : "btn btn-primary"}
                  >
                    {isAdded ? "Added ✓" : "Add"}
                  </button>
                </div>
              );
            })}
            {!loading && query && results.length === 0 && (
              <p className="text-sm text-fog">No matches — try the manual tab.</p>
            )}
          </div>
        </div>
      ) : (
        <form action={handleManual} className="card space-y-4 p-6">
          <div>
            <label className="label mb-1 block">Name *</label>
            <input name="name" required className="input" placeholder="e.g. My fine-tune" />
          </div>
          <div>
            <label className="label mb-1 block">Provider</label>
            <input name="provider" className="input" placeholder="e.g. OpenAI" />
          </div>
          <div>
            <label className="label mb-1 block">Description</label>
            <textarea
              name="description"
              rows={3}
              className="input"
              placeholder="What is it? Why are you saving it?"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Adding…" : "Add model"}
          </button>
        </form>
      )}
    </div>
  );
}
