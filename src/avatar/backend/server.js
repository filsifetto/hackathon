/**
 * Party Avatar Backend
 *
 * Express server that powers the talking avatar: LLM (party-aware), TTS (ElevenLabs),
 * lip-sync, and speech-to-text (Whisper). All responses are aligned with the party
 * program (see content/party_program.md).
 *
 * Endpoints:
 *   GET  /voices  – List ElevenLabs voices
 *   POST /tts     – Text input → LLM response + TTS + lip-sync
 *   POST /sts     – Speech input (base64 audio) → Whisper → same pipeline as /tts
 */

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openAIChainInvoke, getParser } from "./modules/openAI.mjs";
import { lipSync } from "./modules/lip-sync.mjs";
import { sendDefaultMessages, defaultResponse } from "./modules/defaultMessages.mjs";
import { convertAudioToText } from "./modules/whisper.mjs";
import { voice } from "./modules/elevenLabs.mjs";

dotenv.config();

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

// --- ElevenLabs voices (for frontend voice selection) ---
app.get("/voices", async (req, res) => {
  try {
    res.send(await voice.getVoices(elevenLabsApiKey));
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

// --- Text-to-speech: user message → LLM (party program) → TTS + lip-sync ---
app.post("/tts", async (req, res) => {
  const userMessage = await req.body.message;
  const defaultMessages = await sendDefaultMessages({ userMessage });
  if (defaultMessages) {
    res.send({ messages: defaultMessages });
    return;
  }
  let openAImessages;
  const parser = await getParser();
  try {
    openAImessages = await openAIChainInvoke({
      question: userMessage,
      format_instructions: parser.getFormatInstructions(),
    });
  } catch (error) {
    openAImessages = { messages: defaultResponse };
  }
  openAImessages = await lipSync({ messages: openAImessages.messages });
  res.send({ messages: openAImessages });
});

// --- Speech-to-text: base64 audio → Whisper → same pipeline as /tts ---
app.post("/sts", async (req, res) => {
  const base64Audio = req.body.audio;
  const audioData = Buffer.from(base64Audio, "base64");
  const userMessage = await convertAudioToText({ audioData });
  const defaultMessages = await sendDefaultMessages({ userMessage });
  if (defaultMessages) {
    res.send({ messages: defaultMessages });
    return;
  }
  let openAImessages;
  const parser = await getParser();
  try {
    openAImessages = await openAIChainInvoke({
      question: userMessage,
      format_instructions: parser.getFormatInstructions(),
    });
  } catch (error) {
    openAImessages = { messages: defaultResponse };
  }
  openAImessages = await lipSync({ messages: openAImessages.messages });
  res.send({ messages: openAImessages });
});

app.listen(port, () => {
  console.log(`Party avatar backend listening on port ${port}`);
});
