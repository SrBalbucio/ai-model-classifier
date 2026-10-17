export type ModelSource = "openrouter" | "manual";

export interface Model {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  context_length: number | null;
  price_prompt: number | null;
  price_completion: number | null;
  logo_url: string | null;
  source: ModelSource;
  external_id: string | null;
  aa_intelligence: number | null;
  aa_coding: number | null;
  aa_agentic: number | null;
  created_at: string;
}

export interface Rating {
  model_id: string;
  category: string;
  score: number;
  updated_at: string;
}

export interface Note {
  model_id: string;
  body: string;
  updated_at: string;
}

export interface ModelWithRatings extends Model {
  ratings: Record<string, number>;
  average: number | null;
  rated_count: number;
  note: string | null;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  color: string;
  inverted: boolean;
  external: string | null;
}

export interface CatalogItem {
  id: string;
  name: string;
  provider: string;
  description: string | null;
  context_length: number | null;
  price_prompt: number | null;
  price_completion: number | null;
  logo_url: string | null;
  hugging_face_id: string | null;
  aa_intelligence: number | null;
  aa_coding: number | null;
  aa_agentic: number | null;
  created: number;
}
