import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load party program content from content/party_program.md (relative to avatar root).
 * Used to give the avatar situational awareness for answering as the party.
 */
export async function loadPartyProgram() {
  const avatarRoot = path.resolve(__dirname, "../..");
  const filePath = path.join(avatarRoot, "content", "party_program.md");
  try {
    return await readFile(filePath, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      return "";
    }
    throw err;
  }
}
