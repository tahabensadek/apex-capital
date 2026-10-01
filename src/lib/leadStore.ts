import fs from "fs";
import path from "path";

/**
 * Where real leads live.
 *
 * Production (Vercel): Upstash Redis over its REST API. In Vercel, go to Storage and add
 * "Upstash for Redis"; it injects KV_REST_API_URL and KV_REST_API_TOKEN automatically.
 * Local dev without those vars: a JSON file in data/ (gitignored, it contains personal info).
 */

import type { LeadRecord } from "./leadTypes";

export * from "./leadTypes";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const hasDurableStore = Boolean(KV_URL && KV_TOKEN);

const leadKey = (id: string) => `lead:${id}`;
const INDEX_KEY = "leads:by_created";

async function kv<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(KV_URL!, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result: T; error?: string };
  if (data.error) throw new Error(`KV ${command[0]} error: ${data.error}`);
  return data.result;
}

const FILE = path.join(process.cwd(), "data", "lead_store.json");

function readFile(): LeadRecord[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeFile(rows: LeadRecord[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(rows, null, 2), "utf-8");
}

export async function saveLead(lead: LeadRecord): Promise<void> {
  if (hasDurableStore) {
    await kv(["SET", leadKey(lead.id), JSON.stringify(lead)]);
    await kv(["ZADD", INDEX_KEY, Date.parse(lead.createdAt), lead.id]);
    return;
  }
  const rows = readFile();
  rows.unshift(lead);
  writeFile(rows);
}

export async function getLead(id: string): Promise<LeadRecord | null> {
  if (hasDurableStore) {
    const raw = await kv<string | null>(["GET", leadKey(id)]);
    return raw ? (JSON.parse(raw) as LeadRecord) : null;
  }
  return readFile().find((l) => l.id === id) ?? null;
}

export async function updateLead(id: string, patch: Partial<LeadRecord>): Promise<LeadRecord | null> {
  const current = await getLead(id);
  if (!current) return null;
  const next: LeadRecord = { ...current, ...patch, id: current.id, updatedAt: new Date().toISOString() };
  if (hasDurableStore) {
    await kv(["SET", leadKey(id), JSON.stringify(next)]);
  } else {
    writeFile(readFile().map((l) => (l.id === id ? next : l)));
  }
  return next;
}

export async function listLeads(limit = 200): Promise<LeadRecord[]> {
  if (hasDurableStore) {
    const ids = await kv<string[]>(["ZRANGE", INDEX_KEY, 0, limit - 1, "REV"]);
    if (!ids.length) return [];
    const raws = await kv<(string | null)[]>(["MGET", ...ids.map(leadKey)]);
    return raws.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as LeadRecord);
  }
  return readFile().slice(0, limit);
}

/** Minutes from form submission to first call, or null if not called yet. */
export const minutesToCall = (lead: LeadRecord) =>
  lead.firstCalledAt ? (Date.parse(lead.firstCalledAt) - Date.parse(lead.createdAt)) / 60000 : null;
