import { describe, it, expect } from "vitest";
import { convertAudioToMp3 } from "../../utils/audios.mjs";

describe("audios.mjs", () => {
  it("exports convertAudioToMp3 as a function", () => {
    expect(typeof convertAudioToMp3).toBe("function");
  });
});
