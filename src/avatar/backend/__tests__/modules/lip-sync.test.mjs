import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../modules/elevenLabs.mjs", () => ({
  convertTextToSpeech: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../modules/rhubarbLipSync.mjs", () => ({
  getPhonemes: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../utils/files.mjs", () => ({
  readJsonTranscript: vi.fn().mockResolvedValue({ mouthCues: [] }),
  audioFileToBase64: vi.fn().mockResolvedValue("base64audio"),
}));

describe("lip-sync.mjs", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.doMock("../../utils/files.mjs", () => ({
      readJsonTranscript: vi.fn().mockResolvedValue({ mouthCues: [] }),
      audioFileToBase64: vi.fn().mockResolvedValue("base64audio"),
    }));
  });

  it("adds audio and lipsync to messages", async () => {
    const { lipSync } = await import("../../modules/lip-sync.mjs");
    const { readJsonTranscript, audioFileToBase64 } = await import(
      "../../utils/files.mjs"
    );

    const messages = [
      { text: "Hello", facialExpression: "smile", animation: "Idle" },
    ];
    const result = await lipSync({ messages });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("audio");
    expect(result[0]).toHaveProperty("lipsync");
    expect(result[0].audio).toBe("base64audio");
    expect(result[0].lipsync).toEqual({ mouthCues: [] });
  });
});
