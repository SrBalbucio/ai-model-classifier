import type { CatalogItem } from "./types";
import { getCatalogCache, setCatalogCache } from "./db";
import { logoUrlForProvider, providerFromId } from "./provider-utils";

export { logoUrlForProvider };

const OR_API = "https://openrouter.ai/api/v1/models";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface ORModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: { prompt?: string; completion?: string };
  hugging_face_id?: string | null;
  benchmarks?: { artificial_analysis?: Record<string, number | null> };
  created?: number;
}

function pick(v: number | null | undefined): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function normalize(item: ORModel): CatalogItem {
  const aa = item.benchmarks?.artificial_analysis;
  return {
    id: item.id.replace(/\//g, "::"),
    name: item.name,
    provider: providerFromId(item.id),
    description: item.description ?? null,
    context_length: item.context_length ?? null,
    price_prompt: item.pricing?.prompt != null ? Number(item.pricing.prompt) : null,
    price_completion: item.pricing?.completion != null ? Number(item.pricing.completion) : null,
    logo_url: item.hugging_face_id
      ? `https://huggingface.co/${item.hugging_face_id}/resolve/main/README.md`
      : null,
    hugging_face_id: item.hugging_face_id ?? null,
    aa_intelligence: pick(aa?.intelligence_index),
    aa_coding: pick(aa?.coding_index),
    aa_agentic: pick(aa?.agentic_index),
    created: item.created ?? 0,
  };
}

export async function fetchCatalog(): Promise<CatalogItem[]> {
  const cached = getCatalogCache();
  if (cached) {
    const age = Date.now() - new Date(cached.fetched_at).getTime();
    if (age < CACHE_TTL_MS) {
      try {
        return JSON.parse(cached.payload) as CatalogItem[];
      } catch {
        // fall through to re-fetch
      }
    }
  }

  const res = await fetch(OR_API, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`OpenRouter fetch failed: ${res.status}`);
  const json = (await res.json()) as { data: ORModel[] };
  const items = json.data.map(normalize);
  try {
    setCatalogCache(JSON.stringify(items));
  } catch {
    // cache write failure is non-fatal
  }
  return items;
}

export async function searchCatalog(query: string): Promise<CatalogItem[]> {
  const all = await fetchCatalog();
  const q = query.trim().toLowerCase();
  if (!q) return all.slice(0, 60);
  return all
    .filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q),
    )
    .slice(0, 60);
}
