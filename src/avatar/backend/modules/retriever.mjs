import OpenAI from "openai";
import { getIndexableContent } from "../utils/contentLoader.mjs";

const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
const CHUNK_SIZE = 600;
const CHUNK_OVERLAP = 80;
const TOP_K = 6;

let store = null;
let initPromise = null;

/**
 * Split text into overlapping chunks for embedding.
 * Kept here so we can change strategy without touching the rest of the pipeline.
 */
function chunkText(text) {
  if (!text?.trim()) return [];
  const chunks = [];
  const step = CHUNK_SIZE - CHUNK_OVERLAP;
  for (let start = 0; start < text.length; start += step) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const slice = text.slice(start, end).trim();
    if (slice) chunks.push(slice);
    if (end >= text.length) break;
  }
  return chunks;
}

function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

async function ensureIndexed() {
  if (store) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const raw = await getIndexableContent();
    const chunks = chunkText(raw);
    if (chunks.length === 0) {
      store = { chunks: [], vectors: [] };
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      store = { chunks, vectors: chunks.map(() => null) };
      return;
    }

    const client = new OpenAI({ apiKey });
    const vectors = [];
    const BATCH = 20;
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const res = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: batch,
      });
      const ordered = res.data.sort((a, b) => a.index - b.index);
      for (const item of ordered) vectors.push(item.embedding);
    }

    store = { chunks, vectors };
  })();

  return initPromise;
}

/**
 * Clear the in-memory store so the next request rebuilds from current content.
 * Use after content is removed or updated so the index is empty or fresh.
 */
function resetStore() {
  store = null;
  initPromise = null;
}

/**
 * Retriever: query → context string.
 * Contract: input { query: string }, output Promise<{ context: string }>.
 * Does not call LLM or speech; used only by the server.
 *
 * @param {{ query: string }} input
 * @returns {Promise<{ context: string }>}
 */
export async function retrieve({ query }) {
  await ensureIndexed();

  const q = (query || "").trim();
  if (!q) return { context: "" };
  if (!store || store.chunks.length === 0) return { context: "" };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { context: store.chunks.slice(0, TOP_K).join("\n\n") };
  }

  const client = new OpenAI({ apiKey });
  const { data } = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: q,
  });
  const queryVector = data[0]?.embedding;
  if (!queryVector) return { context: "" };

  const hasVectors = store.vectors.every(Boolean);
  if (!hasVectors) {
    return { context: store.chunks.slice(0, TOP_K).join("\n\n") };
  }

  const withScore = store.chunks.map((text, i) => ({
    text,
    score: cosineSimilarity(queryVector, store.vectors[i]),
  }));
  withScore.sort((a, b) => b.score - a.score);
  const top = withScore.slice(0, TOP_K).map((x) => x.text);

  return { context: top.join("\n\n") };
}

export { resetStore };
