import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { openAIChainInvoke, getParser } from "./modules/openAI.mjs";
import { retrieve, resetStore } from "./modules/retriever.mjs";
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

app.get("/", (req, res) => {
  res.json({
    message: "Party avatar API",
    endpoints: { voices: "GET /voices", tts: "POST /tts", sts: "POST /sts", reset: "GET /reset" },
    hint: "Open the frontend (e.g. http://localhost:5173) to use the avatar.",
  });
});

app.get("/reset", (req, res) => {
  resetStore();
  res.json({ message: "Retriever store cleared. Next request will rebuild from current content." });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarGlbPath = path.join(__dirname, "..", "frontend", "public", "models", "avatar.glb");
app.get("/models/avatar.glb", (req, res) => {
  res.type("model/gltf-binary");
  res.sendFile(avatarGlbPath, (err) => {
    if (err) {
      console.error("Avatar GLB not found at", avatarGlbPath, err?.message);
      res.status(404).json({ error: "Avatar model not found" });
    }
  });
});

app.get("/voices", async (req, res) => {
  try {
    res.send(await voice.getVoices(elevenLabsApiKey));
  } catch (e) {
    res.status(500).json({ error: String(e.message) });
  }
});

app.post("/tts", async (req, res) => {
  try {
    const userMessage = await req.body.message;
    const defaultMessages = await sendDefaultMessages({ userMessage });
    if (defaultMessages) {
      res.send({ messages: defaultMessages });
      return;
    }
    const { context } = await retrieve({ query: userMessage });
    let openAImessages;
    const parser = getParser();
    try {
      openAImessages = await openAIChainInvoke({
        question: userMessage,
        context,
        format_instructions: parser.getFormatInstructions(),
      });
    } catch (error) {
      openAImessages = { messages: defaultResponse };
    }
    openAImessages = await lipSync({ messages: openAImessages.messages });
    res.send({ messages: openAImessages });
  } catch (error) {
    console.error("TTS error:", error);
    res.status(500).json({ error: error?.message || String(error) });
  }
});

app.post("/sts", async (req, res) => {
  try {
    const base64Audio = req.body.audio;
    const audioData = Buffer.from(base64Audio, "base64");
    const userMessage = await convertAudioToText({ audioData });
    const defaultMessages = await sendDefaultMessages({ userMessage });
    if (defaultMessages) {
      res.send({ messages: defaultMessages });
      return;
    }
    const { context } = await retrieve({ query: userMessage });
    let openAImessages;
    const parser = getParser();
    try {
      openAImessages = await openAIChainInvoke({
        question: userMessage,
        context,
        format_instructions: parser.getFormatInstructions(),
      });
    } catch (error) {
      openAImessages = { messages: defaultResponse };
    }
    openAImessages = await lipSync({ messages: openAImessages.messages });
    res.send({ messages: openAImessages });
  } catch (error) {
    console.error("STS error:", error);
    res.status(500).json({ error: error?.message || String(error) });
  }
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Party avatar backend listening on port ${port}`);
  });
}

export { app };
