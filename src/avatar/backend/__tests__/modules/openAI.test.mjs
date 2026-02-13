import { describe, it, expect } from "vitest";
import { getParser, parser } from "../../modules/openAI.mjs";

describe("openAI.mjs", () => {
  describe("getParser", () => {
    it("returns the parser", async () => {
      const p = await getParser();
      expect(p).toBe(parser);
    });
  });

  describe("parser", () => {
    it("has getFormatInstructions method", () => {
      expect(typeof parser.getFormatInstructions).toBe("function");
      const instructions = parser.getFormatInstructions();
      expect(typeof instructions).toBe("string");
      expect(instructions.length).toBeGreaterThan(0);
    });

    it("format instructions mention JSON and expected schema", () => {
      const instructions = parser.getFormatInstructions();
      expect(instructions.toLowerCase()).toMatch(/json/);
      expect(instructions).toMatch(/text|facialExpression|animation/);
    });

    it("parse parses valid message array", async () => {
      const valid = `\`\`\`json
      {
        "messages": [
          {
            "text": "Hello",
            "facialExpression": "smile",
            "animation": "Idle"
          }
        ]
      }
      \`\`\``;
      const parsed = await parser.parse(valid);
      expect(parsed).toHaveProperty("messages");
      expect(Array.isArray(parsed.messages)).toBe(true);
      expect(parsed.messages[0].text).toBe("Hello");
      expect(parsed.messages[0].facialExpression).toBe("smile");
      expect(parsed.messages[0].animation).toBe("Idle");
    });
  });
});
