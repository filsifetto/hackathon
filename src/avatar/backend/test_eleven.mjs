#!/usr/bin/env node
import dotenv from "dotenv";

dotenv.config();

import { convertTextToSpeech } from "./modules/elevenLabs.mjs";

(async function runTest() {
  try {
    const text = "Hello — this is a quick ElevenLabs text-to-speech test.";
    const fileName = "eleven_test.wav";

    console.log("Calling convertTextToSpeech...");
    await convertTextToSpeech({ text, fileName });
    console.log(`TTS finished — output file: ${fileName}`);
  } catch (err) {
    console.error("TTS test failed:", err);
    process.exit(1);
  }
})();
