import { loadPolitikkContent } from "./politikk.mjs";
import { loadPartyProgram } from "./partyProgram.mjs";

/**
 * Single entry point for all content that can be indexed and searched by the retriever.
 * Add or remove sources here; the retriever stays unchanged.
 *
 * @returns {Promise<string>} Combined indexable text (e.g. for chunking and embedding).
 */
export async function getIndexableContent() {
  const [politikk, partyProgram] = await Promise.all([
    loadPolitikkContent(),
    loadPartyProgram(),
  ]);

  const parts = [];
  if (partyProgram?.trim()) parts.push(partyProgram.trim());
  if (politikk?.trim()) parts.push(politikk.trim());

  return parts.join("\n\n---\n\n") || "";
}
