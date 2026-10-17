const PROVIDER_DOMAINS: Record<string, string> = {
  openai: "openai.com",
  anthropic: "anthropic.com",
  google: "google.com",
  "x-ai": "x.ai",
  xai: "x.ai",
  deepseek: "deepseek.com",
  qwen: "qwen.ai",
  meta: "meta.com",
  mistral: "mistral.ai",
  mistralai: "mistral.ai",
  microsoft: "microsoft.com",
  nvidia: "nvidia.com",
  amazon: "amazon.com",
  cohere: "cohere.com",
  perplexity: "perplexity.ai",
  minimax: "minimax.io",
  "z-ai": "z.ai",
  inflection: "inflection.ai",
  openrouter: "openrouter.ai",
};

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google",
  "x-ai": "xAI",
  xai: "xAI",
  deepseek: "DeepSeek",
  qwen: "Qwen",
  meta: "Meta",
  mistral: "Mistral",
  mistralai: "Mistral",
  microsoft: "Microsoft",
  nvidia: "NVIDIA",
  amazon: "Amazon",
  cohere: "Cohere",
  perplexity: "Perplexity",
  minimax: "MiniMax",
  "z-ai": "Z.ai",
};

export function providerDomain(provider: string): string {
  const key = provider.toLowerCase();
  return PROVIDER_DOMAINS[key] ?? `${key}.com`;
}

export function logoUrlForProvider(provider: string): string {
  const domain = providerDomain(provider);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export function providerFromId(id: string): string {
  const prefix = id.split("/")[0] ?? "unknown";
  return PROVIDER_LABELS[prefix.toLowerCase()] ?? prefix;
}
