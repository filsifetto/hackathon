import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execFile } from "child_process";
import { promisify } from "util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFileAsync = promisify(execFile);

const supportedExtensions = new Set([".md", ".txt", ".docx"]);

function decodeXmlEntities(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function extractDocxText(filePath) {
  // .docx is a zip; document text is in word/document.xml
  const { stdout } = await execFileAsync("unzip", ["-p", filePath, "word/document.xml"]);
  const xml = String(stdout || "");
  const withBreaks = xml.replace(/<\/w:p>/g, "\n").replace(/<\/w:tr>/g, "\n");
  const noTags = withBreaks.replace(/<[^>]+>/g, " ");
  const decoded = decodeXmlEntities(noTags);
  return decoded.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function readContextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!supportedExtensions.has(ext)) return "";
  if (ext === ".docx") {
    return extractDocxText(filePath);
  }
  return readFile(filePath, "utf8");
}

/**
 * Load chatbot context from a folder of source files (.md, .txt, .docx).
 * Defaults to the drive-download folder in repo root.
 */
export async function loadPartyProgram() {
  const repoRoot = path.resolve(__dirname, "../../../..");
  const defaultContextDir = path.join(repoRoot, "drive-download-20260214T001712Z-1-001");
  const configuredDir = process.env.BOT_CONTEXT_DIR?.trim();
  const configuredFilePath = process.env.BOT_CONTEXT_FILE?.trim();

  // If a single file is explicitly configured, prefer that.
  if (configuredFilePath) {
    try {
      return await readContextFile(configuredFilePath);
    } catch (err) {
      if (err.code === "ENOENT") return "";
      throw err;
    }
  }

  const contextDir = configuredDir || defaultContextDir;
  try {
    const entries = await readdir(contextDir, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => path.join(contextDir, entry.name))
      .filter((filePath) => supportedExtensions.has(path.extname(filePath).toLowerCase()))
      .sort();

    const chunks = [];
    for (const filePath of files) {
      try {
        const content = await readContextFile(filePath);
        if (content?.trim()) {
          chunks.push(`\n### Kilde: ${path.basename(filePath)}\n${content.trim()}\n`);
        }
      } catch {
        // Skip unreadable/unsupported files without crashing the chatbot.
      }
    }
    return chunks.join("\n").trim();
  } catch (err) {
    if (err.code === "ENOENT") {
      return "";
    }
    throw err;
  }
}
