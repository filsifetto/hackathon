import { describe, it, expect } from "vitest";
import { retrieve } from "../../modules/retriever.mjs";

describe("retriever.mjs", () => {
  describe("retrieve", () => {
    it("returns an object with context string", async () => {
      const result = await retrieve({ query: "climate" });
      expect(result).toHaveProperty("context");
      expect(typeof result.context).toBe("string");
    });

    it("returns empty context for empty query", async () => {
      const result = await retrieve({ query: "" });
      expect(result.context).toBe("");
    });

    it("handles missing query (treats as empty)", async () => {
      const result = await retrieve({ query: undefined });
      expect(result).toHaveProperty("context");
      expect(typeof result.context).toBe("string");
    });
  });
});
