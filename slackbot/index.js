require("dotenv").config();
const { App } = require("@slack/bolt");
const fs = require("fs");
const path = require("path");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const AI_ENABLED = process.env.AI_ENABLED === "true";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const AI_SYSTEM_PROMPT =
  process.env.AI_SYSTEM_PROMPT || "Du er en hjelpsom Slack-assistent.";
const OPENAI_API_KEY = (process.env.OPENAI_API_KEY || "")
  .trim()
  .replace(/^['"]|['"]$/g, "");
const KNOWLEDGE_DIR = process.env.KNOWLEDGE_DIR || "knowledge";
const KNOWLEDGE_MAX_CHARS = Number(process.env.KNOWLEDGE_MAX_CHARS || 12000);

const SCHEDULE_ENABLED = process.env.SCHEDULE_ENABLED === "true";
const SCHEDULE_MINUTES = Number(process.env.SCHEDULE_MINUTES || 15);
const SCHEDULE_TEXT =
  process.env.SCHEDULE_TEXT || "Hei! Dette er en periodisk melding fra boten.";

function loadKnowledgeBase() {
  try {
    const absoluteDir = path.resolve(KNOWLEDGE_DIR);
    if (!fs.existsSync(absoluteDir)) {
      console.log(`📚 Fant ikke knowledge-mappe: ${absoluteDir}`);
      return "";
    }

    const files = fs
      .readdirSync(absoluteDir)
      .filter((file) => file.endsWith(".txt"))
      .sort();

    if (files.length === 0) {
      console.log(`📚 Ingen .txt-filer i ${absoluteDir}`);
      return "";
    }

    const sections = files.map((file) => {
      const fullPath = path.join(absoluteDir, file);
      const content = fs.readFileSync(fullPath, "utf8").trim();
      return `Kilde: ${file}\n${content}`;
    });

    const combined = sections.join("\n\n---\n\n").slice(0, KNOWLEDGE_MAX_CHARS);
    console.log(`📚 Lastet ${files.length} kunnskapsfil(er) fra ${absoluteDir}`);
    return combined;
  } catch (error) {
    console.error("Feil ved lasting av knowledge-filer:", error.message);
    return "";
  }
}

const KNOWLEDGE_CONTEXT = loadKnowledgeBase();

async function generateAIReply(messageText) {
  if (!AI_ENABLED) return null;
  if (!OPENAI_API_KEY) return null;

  const systemContent = KNOWLEDGE_CONTEXT
    ? `${AI_SYSTEM_PROMPT}\n\nBruk følgende kunnskapsgrunnlag når du svarer:\n${KNOWLEDGE_CONTEXT}`
    : AI_SYSTEM_PROMPT;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemContent },
          { role: "user", content: messageText },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI-feil:", err);
      if (response.status === 401) {
        console.error(
          "OPENAI_API_KEY er ugyldig. Lag en ny nøkkel i OpenAI og oppdater .env"
        );
      }
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch (error) {
    console.error("Klarte ikke hente AI-svar:", error.message);
    return null;
  }
}

function startScheduledMessages(client) {
  if (!SCHEDULE_ENABLED) return;
  if (!process.env.CHANNEL_ID) {
    console.error("SCHEDULE_ENABLED=true, men CHANNEL_ID mangler.");
    return;
  }
  if (!Number.isFinite(SCHEDULE_MINUTES) || SCHEDULE_MINUTES <= 0) {
    console.error("SCHEDULE_MINUTES må være et tall større enn 0.");
    return;
  }

  const intervalMs = SCHEDULE_MINUTES * 60 * 1000;
  setInterval(async () => {
    try {
      await client.chat.postMessage({
        channel: process.env.CHANNEL_ID,
        text: SCHEDULE_TEXT,
      });
      console.log(`⏰ Sendte periodisk melding (${SCHEDULE_MINUTES} min).`);
    } catch (error) {
      console.error("Feil ved periodisk melding:", error.message);
    }
  }, intervalMs);

  console.log(`⏰ Periodiske meldinger aktivert: hvert ${SCHEDULE_MINUTES}. minutt.`);
}

app.event("message", async ({ event, client }) => {
  // kun én kanal
  if (event.channel !== process.env.CHANNEL_ID) return;

  // unngå loops
  if (event.bot_id) return;
  if (event.subtype) return;

  const replyText = await generateAIReply(event.text || "");
  if (!replyText) return;

  await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.ts,
    text: replyText,
  });
});

(async () => {
  await app.start();
  startScheduledMessages(app.client);
  console.log("✅ Slack auto-reply bot kjører");
})();
