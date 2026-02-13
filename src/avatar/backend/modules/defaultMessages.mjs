import { audioFileToBase64, readJsonTranscript } from "../utils/files.mjs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");
const audiosDir = path.join(backendDir, "audios");

const openAIApiKey = process.env.OPENAI_API_KEY;
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

async function readAudioJson(name) {
  const p = path.join(audiosDir, `${name}.json`);
  if (!fs.existsSync(p)) return null;
  return readJsonTranscript({ fileName: p });
}

async function readAudioBase64(name) {
  const p = path.join(audiosDir, `${name}.wav`);
  if (!fs.existsSync(p)) return null;
  return audioFileToBase64({ fileName: p });
}

async function sendDefaultMessages({ userMessage }) {
  let messages;
  if (!userMessage) {
    const intro0Audio = await readAudioBase64("intro_0");
    const intro1Audio = await readAudioBase64("intro_1");
    const intro0Lipsync = await readAudioJson("intro_0");
    const intro1Lipsync = await readAudioJson("intro_1");
    if (intro0Audio && intro1Audio && intro0Lipsync && intro1Lipsync) {
      messages = [
        {
          text: "Hey there... How was your day?",
          audio: intro0Audio,
          lipsync: intro0Lipsync,
          facialExpression: "smile",
          animation: "TalkingOne",
        },
        {
          text: "I represent our party. Ask me anything about our positions and priorities.",
          audio: intro1Audio,
          lipsync: intro1Lipsync,
          facialExpression: "smile",
          animation: "TalkingTwo",
        },
      ];
      return messages;
    }
    return null;
  }
  if (!elevenLabsApiKey || !openAIApiKey) {
    const api0Audio = await readAudioBase64("api_0");
    const api1Audio = await readAudioBase64("api_1");
    const api0Lipsync = await readAudioJson("api_0");
    const api1Lipsync = await readAudioJson("api_1");
    if (api0Audio && api1Audio && api0Lipsync && api1Lipsync) {
      messages = [
        {
          text: "Please add your API keys in the backend .env file.",
          audio: api0Audio,
          lipsync: api0Lipsync,
          facialExpression: "angry",
          animation: "TalkingThree",
        },
        {
          text: "You need OpenAI and ElevenLabs keys for the avatar to work.",
          audio: api1Audio,
          lipsync: api1Lipsync,
          facialExpression: "smile",
          animation: "Angry",
        },
      ];
      return messages;
    }
  }
  return null;
}

const defaultResponse = [
  {
    text: "I'm sorry, I didn't catch that or couldn't answer. Could you please repeat or rephrase your question?",
    facialExpression: "sad",
    animation: "Idle",
  },
];

export { sendDefaultMessages, defaultResponse };
