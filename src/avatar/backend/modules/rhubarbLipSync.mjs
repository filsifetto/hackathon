import { execCommand } from "../utils/files.mjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");

const getPhonemes = async ({ message }) => {
  try {
    const time = new Date().getTime();
    console.log(`Starting conversion for message ${message}`);
    await execCommand({
      command: `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`,
      cwd: backendDir,
    });
    console.log(`Conversion done in ${new Date().getTime() - time}ms`);
    const binPath = path.join(backendDir, "bin", "rhubarb");
    await execCommand({
      command: `"${binPath}" -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`,
      cwd: backendDir,
    });
    console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
  } catch (error) {
    console.error(`Error while getting phonemes for message ${message}:`, error);
  }
};

export { getPhonemes };
