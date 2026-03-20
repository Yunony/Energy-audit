// api/storage.js — simple KV store via Vercel KV (Redis)
// Falls back to in-memory store if KV is not configured (useful for preview deploys)

let memStore = {};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // Try to use Vercel KV if available
  let kv = null;
  try {
    const { kv: vercelKv } = await import("@vercel/kv");
    kv = vercelKv;
  } catch (e) {
    // KV not available — will use in-memory fallback
  }

  if (req.method === "GET") {
    const { key } = req.query;
    if (!key) return res.status(400).json({ error: "Missing key" });
    try {
      let value;
      if (kv) {
        value = await kv.get(key);
        // Vercel KV auto-parses JSON — re-stringify if needed
        if (value !== null && typeof value === "object") value = JSON.stringify(value);
      } else {
        value = memStore[key] ?? null;
      }
      return res.status(200).json({ key, value });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    const { key, value } = req.body;
    if (!key || value === undefined) return res.status(400).json({ error: "Missing key or value" });
    try {
      if (kv) {
        // Store as raw string so GET returns it as-is
        await kv.set(key, value);
      } else {
        memStore[key] = value;
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
