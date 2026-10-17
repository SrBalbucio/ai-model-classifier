import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import type { Model, ModelWithRatings, Note, Rating } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "classifier.db");

let db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const conn = new DatabaseSync(DB_PATH);
  conn.exec("PRAGMA journal_mode = WAL;");
  conn.exec("PRAGMA foreign_keys = ON;");
  migrate(conn);
  db = conn;
  return db;
}

function migrate(conn: DatabaseSync) {
  conn.exec(`
    CREATE TABLE IF NOT EXISTS models (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      provider TEXT NOT NULL,
      description TEXT,
      context_length INTEGER,
      price_prompt REAL,
      price_completion REAL,
      logo_url TEXT,
      source TEXT NOT NULL DEFAULT 'manual',
      external_id TEXT,
      aa_intelligence REAL,
      aa_coding REAL,
      aa_agentic REAL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model_id TEXT NOT NULL REFERENCES models(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      score REAL NOT NULL CHECK (score >= 1 AND score <= 10),
      updated_at TEXT NOT NULL,
      UNIQUE(model_id, category)
    );

    CREATE TABLE IF NOT EXISTS notes (
      model_id TEXT PRIMARY KEY REFERENCES models(id) ON DELETE CASCADE,
      body TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS catalog_cache (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL,
      fetched_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_ratings_model ON ratings(model_id);
    CREATE INDEX IF NOT EXISTS idx_ratings_category ON ratings(category);
  `);
}

function rowToModel(r: Record<string, unknown>): Model {
  return {
    id: r.id as string,
    name: r.name as string,
    provider: r.provider as string,
    description: r.description as string | null,
    context_length: r.context_length as number | null,
    price_prompt: r.price_prompt as number | null,
    price_completion: r.price_completion as number | null,
    logo_url: r.logo_url as string | null,
    source: r.source as Model["source"],
    external_id: r.external_id as string | null,
    aa_intelligence: r.aa_intelligence as number | null,
    aa_coding: r.aa_coding as number | null,
    aa_agentic: r.aa_agentic as number | null,
    created_at: r.created_at as string,
  };
}

export function listModels(): ModelWithRatings[] {
  const conn = getDb();
  const rows = conn
    .prepare(
      `SELECT m.*,
              (SELECT AVG(score) FROM ratings r WHERE r.model_id = m.id) AS average,
              (SELECT COUNT(*) FROM ratings r WHERE r.model_id = m.id) AS rated_count
       FROM models m
       ORDER BY average IS NULL, average DESC, m.name ASC`,
    )
    .all() as Record<string, unknown>[];

  const ids = rows.map((r) => r.id as string);
  const ratingsMap = new Map<string, Record<string, number>>();
  if (ids.length) {
    const placeholders = ids.map(() => "?").join(",");
    const ratingRows = conn
      .prepare(`SELECT model_id, category, score FROM ratings WHERE model_id IN (${placeholders})`)
      .all(...ids) as unknown as Rating[];
    for (const rating of ratingRows) {
      const m = ratingsMap.get(rating.model_id) ?? {};
      m[rating.category] = rating.score;
      ratingsMap.set(rating.model_id, m);
    }
  }
  const noteStmt = conn.prepare("SELECT body FROM notes WHERE model_id = ?");
  return rows.map((r) => {
    const { average, rated_count, ...modelRow } = r;
    const note = noteStmt.get(modelRow.id as string) as { body: string } | undefined;
    return {
      ...rowToModel(modelRow),
      average: average == null ? null : Number(average),
      rated_count: Number(rated_count),
      note: note?.body ?? null,
      ratings: ratingsMap.get(modelRow.id as string) ?? {},
    };
  });
}

export function getModel(id: string): ModelWithRatings | null {
  const conn = getDb();
  const r = conn.prepare("SELECT * FROM models WHERE id = ?").get(id) as
    | Record<string, unknown>
    | undefined;
  if (!r) return null;
  const avg = conn
    .prepare("SELECT AVG(score) AS average FROM ratings WHERE model_id = ?")
    .get(id) as { average: number | null };
  const count = conn
    .prepare("SELECT COUNT(*) AS c FROM ratings WHERE model_id = ?")
    .get(id) as { c: number };
  const ratings = conn
    .prepare("SELECT category, score FROM ratings WHERE model_id = ?")
    .all(id) as unknown as Rating[];
  const note = conn.prepare("SELECT body FROM notes WHERE model_id = ?").get(id) as
    | Note
    | undefined;
  const ratingsMap: Record<string, number> = {};
  for (const rating of ratings) ratingsMap[rating.category] = rating.score;
  return {
    ...rowToModel(r),
    average: avg.average == null ? null : Number(avg.average),
    rated_count: Number(count.c),
    ratings: ratingsMap,
    note: note?.body ?? null,
  };
}

export function upsertModel(model: Model): void {
  getDb()
    .prepare(
      `INSERT INTO models (id, name, provider, description, context_length, price_prompt, price_completion, logo_url, source, external_id, aa_intelligence, aa_coding, aa_agentic, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         name=excluded.name, provider=excluded.provider, description=excluded.description,
         context_length=excluded.context_length, price_prompt=excluded.price_prompt,
         price_completion=excluded.price_completion, logo_url=excluded.logo_url,
         external_id=excluded.external_id, aa_intelligence=excluded.aa_intelligence,
         aa_coding=excluded.aa_coding, aa_agentic=excluded.aa_agentic`,
    )
    .run(
      model.id,
      model.name,
      model.provider,
      model.description,
      model.context_length,
      model.price_prompt,
      model.price_completion,
      model.logo_url,
      model.source,
      model.external_id,
      model.aa_intelligence,
      model.aa_coding,
      model.aa_agentic,
      model.created_at,
    );
}

export function deleteModel(id: string): void {
  getDb().prepare("DELETE FROM models WHERE id = ?").run(id);
}

export function setRating(modelId: string, category: string, score: number): void {
  getDb()
    .prepare(
      `INSERT INTO ratings (model_id, category, score, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(model_id, category) DO UPDATE SET score=excluded.score, updated_at=excluded.updated_at`,
    )
    .run(modelId, category, score, new Date().toISOString());
}

export function setNote(modelId: string, body: string): void {
  getDb()
    .prepare(
      `INSERT INTO notes (model_id, body, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(model_id) DO UPDATE SET body=excluded.body, updated_at=excluded.updated_at`,
    )
    .run(modelId, body, new Date().toISOString());
}

export function modelExists(id: string): boolean {
  const r = getDb().prepare("SELECT 1 FROM models WHERE id = ?").get(id);
  return !!r;
}

export interface CatalogCache {
  payload: string;
  fetched_at: string;
}

export function getCatalogCache(): CatalogCache | null {
  const r = getDb()
    .prepare("SELECT payload, fetched_at FROM catalog_cache WHERE id = 1")
    .get() as CatalogCache | undefined;
  return r ?? null;
}

export function setCatalogCache(payload: string): void {
  getDb()
    .prepare(
      `INSERT INTO catalog_cache (id, payload, fetched_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET payload=excluded.payload, fetched_at=excluded.fetched_at`,
    )
    .run(payload, new Date().toISOString());
}
