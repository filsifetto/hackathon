import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadPartyProgram } from "../../utils/partyProgram.mjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("partyProgram.mjs", () => {
  const avatarRoot = path.resolve(__dirname, "../../..");
  const contentDir = path.join(avatarRoot, "content");
  const programPath = path.join(avatarRoot, "content", "party_program.md");

  it("loads party program content when file exists", async () => {
    const content = await loadPartyProgram();
    expect(typeof content).toBe("string");
    expect(content.length).toBeGreaterThan(0);
  });

  it("returns content containing expected structure", async () => {
    const content = await loadPartyProgram();
    expect(content).toMatch(/party program|Party program|situational awareness/i);
  });
});
