import { describe, it, expect, vi, beforeEach } from "vitest";
import * as files from "../../utils/files.mjs";

vi.mock("../../utils/files.mjs", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    execCommand: vi.fn().mockResolvedValue(""),
  };
});

const { convertAudioToMp3 } = await import("../../utils/audios.mjs");

describe("audios.mjs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("convertAudioToMp3 calls ffmpeg via execCommand", async () => {
    await convertAudioToMp3({
      audioData: Buffer.from("fake-webm-data"),
    });

    expect(files.execCommand).toHaveBeenCalledTimes(1);
    expect(files.execCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        command: expect.stringContaining("ffmpeg"),
      })
    );
  });
});
