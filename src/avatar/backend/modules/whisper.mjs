/**
 * Speech-to-text using OpenAI Whisper API.
 */
import OpenAI from "openai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { convertAudioToMp3 } from "../utils/audios.mjs";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const openAIApiKey = process.env.OPENAI_API_KEY;

async function convertAudioToText({ audioData }) {
  const mp3AudioData = await convertAudioToMp3({ audioData });
  const tmpDir = path.join(__dirname, "../utils/tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const outputPath = path.join(tmpDir, "output.mp3");
  fs.writeFileSync(outputPath, mp3AudioData);

  const openai = new OpenAI({ apiKey: openAIApiKey });
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(outputPath),
    model: "whisper-1",
  });

  fs.unlinkSync(outputPath);
  return transcription.text;
}

export { convertAudioToText };
