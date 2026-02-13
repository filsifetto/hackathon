import { describe, it, expect, vi, beforeEach } from "vitest";
import { execCommand, readJsonTranscript, audioFileToBase64 } from "../../utils/files.mjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe("files.mjs", () => {
  describe("readJsonTranscript", () => {
    it("reads and parses a valid JSON file", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "files-test-"));
      const jsonPath = path.join(tmpDir, "transcript.json");
      const data = { mouthCues: [{ start: 0, end: 0.5, value: "X" }] };
      await fs.writeFile(jsonPath, JSON.stringify(data));

      const result = await readJsonTranscript({ fileName: jsonPath });

      expect(result).toEqual(data);
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it("throws on invalid JSON", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "files-test-"));
      const jsonPath = path.join(tmpDir, "invalid.json");
      await fs.writeFile(jsonPath, "not valid json {");

      await expect(readJsonTranscript({ fileName: jsonPath })).rejects.toThrow();
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it("throws on missing file", async () => {
      await expect(
        readJsonTranscript({ fileName: "/nonexistent/path/file.json" })
      ).rejects.toThrow();
    });
  });

  describe("audioFileToBase64", () => {
    it("reads a file and returns base64 string", async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "files-test-"));
      const binPath = path.join(tmpDir, "audio.bin");
      const buffer = Buffer.from([0x00, 0x01, 0x02]);
      await fs.writeFile(binPath, buffer);

      const result = await audioFileToBase64({ fileName: binPath });

      expect(typeof result).toBe("string");
      expect(Buffer.from(result, "base64").equals(buffer)).toBe(true);
      await fs.rm(tmpDir, { recursive: true, force: true });
    });
  });

  describe("execCommand", () => {
    it("resolves with stdout when command succeeds", async () => {
      const result = await execCommand({ command: "echo hello" });
      expect(result.trim()).toBe("hello");
    });

    it("rejects when command fails", async () => {
      await expect(
        execCommand({ command: "false" })
      ).rejects.toBeDefined();
    });

    it("accepts cwd option", async () => {
      const result = await execCommand({
        command: "pwd",
        cwd: os.homedir(),
      });
      expect(result.trim()).toBe(os.homedir());
    });
  });
});
