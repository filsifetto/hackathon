import { describe, it, expect, vi, beforeEach } from "vitest";
import { defaultResponse } from "../../modules/defaultMessages.mjs";

describe("defaultMessages.mjs", () => {
  describe("defaultResponse", () => {
    it("is an array with one message", () => {
      expect(Array.isArray(defaultResponse)).toBe(true);
      expect(defaultResponse).toHaveLength(1);
    });

    it("has required message properties", () => {
      const msg = defaultResponse[0];
      expect(msg).toHaveProperty("text");
      expect(msg).toHaveProperty("facialExpression");
      expect(msg).toHaveProperty("animation");
      expect(typeof msg.text).toBe("string");
      expect(msg.text.length).toBeGreaterThan(0);
    });

    it("uses fallback expression and animation", () => {
      const msg = defaultResponse[0];
      expect(msg.facialExpression).toBe("sad");
      expect(msg.animation).toBe("Idle");
    });
  });

});
