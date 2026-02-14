import { readdir, readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mammoth from "mammoth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load all content from content/Politikk (or content/politikk).
 * Reads .docx files and extracts plain text via mammoth.
 * Used to give the avatar political positions and policy context.
 */
export async function loadPolitikkContent() {
  const avatarRoot = path.resolve(__dirname, "../..");
  const politikkDir = path.join(avatarRoot, "content", "Politikk");
  try {
    const entries = await readdir(politikkDir, { withFileTypes: true });
    const docxFiles = entries
      .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".docx"))
      .map((e) => path.join(politikkDir, e.name));

    if (docxFiles.length === 0) {
      return "";
    }

    const sections = [];
    for (const filePath of docxFiles.sort()) {
      const buffer = await readFile(filePath);
      const { value } = await mammoth.extractRawText({ buffer });
      const fileName = path.basename(filePath, ".docx");
      sections.push(`### ${fileName}\n${value.trim()}`);
    }

    return sections.join("\n\n---\n\n");
  } catch (err) {
    if (err.code === "ENOENT") {
      return "";
    }
    throw err;
  }
}
