import { fetchCatalog } from "../lib/openrouter";
import { providerDomain } from "../lib/provider-utils";
import { upsertModel } from "../lib/db";

const WANTED = [
  "claude",
  "gpt",
  "gemini",
  "deepseek",
  "qwen3-coder",
  "llama",
  "grok",
  "kimi",
  "glm",
  "mistral",
];

function logoUrlForProvider(provider: string): string {
  const domain = providerDomain(provider);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

async function main() {
  const catalog = await fetchCatalog();
  console.log(`Catalog has ${catalog.length} models.`);

  const picked = new Set<string>();
  const providerCount = new Map<string, number>();
  const MAX = 16;
  const MAX_PER_PROVIDER = 2;

  const candidates = catalog.filter(
    (item) =>
      !item.id.includes(":batch") &&
      !item.id.startsWith("~") &&
      item.context_length != null,
  );

  for (const term of WANTED) {
    for (const item of candidates) {
      if (picked.size >= MAX) break;
      const hay = `${item.id} ${item.name}`.toLowerCase();
      if (!hay.includes(term)) continue;
      const id = item.id.replace(/\//g, "::");
      if (picked.has(id)) continue;
      const count = providerCount.get(item.provider) ?? 0;
      if (count >= MAX_PER_PROVIDER) continue;
      picked.add(id);
      providerCount.set(item.provider, count + 1);
      upsertModel({
        id,
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
      });
      console.log(`+ ${id}`);
    }
  }
  console.log(`Seeded ${picked.size} models across ${providerCount.size} providers.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
