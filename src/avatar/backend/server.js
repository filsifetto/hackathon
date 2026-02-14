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

console.log("ENV CHECK", {
  OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  ELEVEN_LABS_API_KEY: !!process.env.ELEVEN_LABS_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL || null,
});

const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

async function enrichMessagesWithAudio(messages) {
  try {
    return await lipSync({ messages });
  } catch (error) {
    console.error("TTS/lip-sync failed, returning text-only response:", error?.message || error);
    return messages.map((msg) => ({
      ...msg,
      audio: null,
      lipsync: { mouthCues: [] },
    }));
  }
}

// --- ElevenLabs voices (for frontend voice selection) ---
app.get("/voices", async (req, res) => {
  try {
    res.send(await voice.getVoices(elevenLabsApiKey));
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

// --- Chat only: user message -> OpenAI (no TTS/lip-sync) ---
app.post("/chat", async (req, res) => {
  const userMessage = req.body?.message;
  if (!userMessage || !String(userMessage).trim()) {
    res.send({
      messages: [
        {
          text: "Skriv et spørsmål, så svarer jeg.",
          facialExpression: "default",
          animation: "Idle",
        },
      ],
    });
    return;
  }

  const parser = await getParser();
  try {
    const openAImessages = await openAIChainInvoke({
      question: userMessage,
      format_instructions: parser.getFormatInstructions(),
    });
    res.send({ messages: openAImessages.messages });
  } catch (error) {
    console.error("OpenAI chain failed on /chat:", error);
    res.status(500).json({
      error: "OPENAI_CHAT_FAILED",
      detail: error?.message || "Unknown OpenAI error",
      code: error?.code || error?.error?.code || null,
    });
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
    console.error("OpenAI chain failed on /tts:", error?.message || error);
    openAImessages = { messages: defaultResponse };
  }
  openAImessages = await enrichMessagesWithAudio(openAImessages.messages);
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
    console.error("OpenAI chain failed on /sts:", error?.message || error);
    openAImessages = { messages: defaultResponse };
  }
  openAImessages = await enrichMessagesWithAudio(openAImessages.messages);
  res.send({ messages: openAImessages });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Party avatar backend listening on port ${port}`);
  });
}

export { app };
