/**
 * Lip-sync phoneme generation using Rhubarb Lip-Sync.
 * Requires rhubarb binary in src/avatar/backend/bin/
 * https://github.com/DanielSWolf/rhubarb-lip-sync/releases
 */
import path from "path";
import { fileURLToPath } from "url";
import { execCommand } from "../utils/files.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");
const binDir = path.join(backendDir, "bin");
const audiosDir = path.join(backendDir, "audios");
const rhubarbPath = path.join(binDir, "rhubarb");

async function getPhonemes({ message }) {
  const mp3Path = path.join(audiosDir, `message_${message}.mp3`);
  const wavPath = path.join(audiosDir, `message_${message}.wav`);
  const jsonPath = path.join(audiosDir, `message_${message}.json`);

  // Rhubarb expects WAV; convert MP3 to WAV with ffmpeg if needed
  await execCommand({
    command: `ffmpeg -y -i "${mp3Path}" "${wavPath}"`,
  });

  await execCommand({
    command: `"${rhubarbPath}" "${wavPath}" -o "${jsonPath}"`,
    cwd: backendDir,
  });
}

export { getPhonemes };
