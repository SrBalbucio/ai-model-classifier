import { randomUUID } from "node:crypto";
import type { CatalogItem, Model } from "./types";
import { logoUrlForProvider } from "./openrouter";
import { listModels, getModel, upsertModel, deleteModel, setRating, setNote } from "./db";

export { listModels, getModel, upsertModel, deleteModel, setRating, setNote };

export function catalogToModel(item: CatalogItem): Model {
  return {
    id: item.id,
    name: item.name,
    provider: item.provider,
    description: item.description,
    context_length: item.context_length,
    price_prompt: item.price_prompt,
    price_completion: item.price_completion,
    logo_url: logoUrlForProvider(item.provider),
    source: "openrouter",
    external_id: item.id,
    aa_intelligence: item.aa_intelligence,
    aa_coding: item.aa_coding,
    aa_agentic: item.aa_agentic,
    created_at: new Date(item.created * 1000 || Date.now()).toISOString(),
  };
}

export function addCatalogModel(item: CatalogItem): Model {
  const model = catalogToModel(item);
  upsertModel(model);
  return model;
}

export function addManualModel(input: {
  name: string;
  provider: string;
  description?: string;
}): Model {
  const id = `manual-${randomUUID()}`;
  const model: Model = {
    id,
    name: input.name.trim(),
    provider: input.provider.trim() || "Custom",
    description: input.description?.trim() ? input.description.trim() : null,
    context_length: null,
    price_prompt: null,
    price_completion: null,
    logo_url: null,
    source: "manual",
    external_id: null,
    aa_intelligence: null,
    aa_coding: null,
    aa_agentic: null,
    created_at: new Date().toISOString(),
  };
  upsertModel(model);
  return model;
}

export function formatContext(length: number | null): string {
  if (length == null) return "—";
  if (length >= 1_000_000) return `${(length / 1_000_000).toFixed(length % 1_000_000 === 0 ? 0 : 1)}M`;
  if (length >= 1_000) return `${(length / 1_000).toFixed(length % 1_000 === 0 ? 0 : 1)}K`;
  return String(length);
}

export function formatPrice(price: number | null): string {
  if (price == null) return "—";
  if (price === 0) return "Free";
  return `$${price.toFixed(4)}`;
}
