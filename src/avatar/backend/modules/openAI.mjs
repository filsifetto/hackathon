import OpenAI from "openai";
import dotenv from "dotenv";
import { loadPartyProgram } from "../utils/partyProgram.mjs";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const llmProvider = (process.env.LLM_PROVIDER || "auto").toLowerCase();
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const ollamaModel = process.env.OLLAMA_MODEL || "llama3.2:3b";
let openaiClient = null;

const validFacialExpressions = ["smile", "sad", "angry", "surprised", "funnyFace", "default"];
const validAnimations = [
  "Idle",
  "TalkingOne",
  "TalkingThree",
  "SadIdle",
  "Defeated",
  "Angry",
  "Surprised",
  "DismissingGesture",
  "ThoughtfulHeadShake",
];

const parser = {
  getFormatInstructions() {
    return 'Svar med JSON-objekt: {"messages":[{"text":"...","facialExpression":"smile|sad|angry|surprised|funnyFace|default","animation":"Idle|TalkingOne|TalkingThree|SadIdle|Defeated|Angry|Surprised|DismissingGesture|ThoughtfulHeadShake"}]}';
  },
};

function buildSystemPrompt(partyProgramText) {
  const context = partyProgramText
    ? `
Partiprogram:
${partyProgramText}
`
    : "";

  return `Du er en digital representant for et politisk parti.
Skriv alltid på norsk bokmal, med mindre brukeren eksplisitt ber om et annet sprak.
Svar kort og tydelig.
Bruk partiprogrammet under som eneste kilde for partiets standpunkter.
Hvis informasjon mangler i programmet, si det tydelig i stedet for a finne opp svar.
Returner KUN gyldig JSON i formatet {"messages":[...]}.
Hver melding ma inneholde feltene text, facialExpression og animation.
Maks 3 meldinger.
Gyldige facialExpression: smile, sad, angry, surprised, funnyFace, default.
Gyldige animation: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake.
${context}`;
}

function normalizeMessagesFromUnknownContent(content) {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
      return {
        messages: parsed.messages.slice(0, 3).map((m) => ({
          text: String(m?.text || "").trim() || "Beklager, jeg fikk ikke formulert et svar.",
          facialExpression: validFacialExpressions.includes(m?.facialExpression) ? m.facialExpression : "default",
          animation: validAnimations.includes(m?.animation) ? m.animation : "TalkingOne",
        })),
      };
    }
  } catch {
    // Not JSON; fall back to plain text output.
  }

  return {
    messages: [
      {
        text: String(content).trim() || "Beklager, jeg fikk ikke formulert et svar.",
        facialExpression: "default",
        animation: "TalkingOne",
      },
    ],
  };
}

async function invokeWithOpenAI({ question, systemPrompt }) {
  if (!openaiApiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: openaiApiKey });
  }

  const configuredModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const candidateModels = Array.from(new Set([configuredModel, "gpt-4o-mini", "gpt-4.1-mini", "gpt-3.5-turbo"]));

  let response = null;
  let lastError = null;

  for (const model of candidateModels) {
    try {
      response = await openaiClient.chat.completions.create({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question || "" },
        ],
      });
      break;
    } catch (error) {
      lastError = error;
      const code = error?.code || error?.error?.code;
      const msg = String(error?.message || "");
      const isModelAccessError =
        code === "model_not_found" ||
        code === "insufficient_quota" ||
        msg.includes("does not exist") ||
        msg.includes("do not have access") ||
        msg.includes("insufficient_quota");

      if (!isModelAccessError) {
        throw error;
      }
    }
  }

  if (!response) {
    throw lastError || new Error("OpenAI request failed for all candidate models");
  }

  const content = response.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response content");
  }
  return normalizeMessagesFromUnknownContent(content);
}

async function invokeWithOllama({ question, systemPrompt }) {
  const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: ollamaModel,
      stream: false,
      format: "json",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question || "" },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data?.message?.content;
  if (!content) {
    throw new Error("Ollama returned empty response content");
  }
  return normalizeMessagesFromUnknownContent(content);
}

async function openAIChainInvoke({ question }) {
  const partyProgramText = await loadPartyProgram();
  const systemPrompt = buildSystemPrompt(partyProgramText);

  if (llmProvider === "ollama") {
    return invokeWithOllama({ question, systemPrompt });
  }
  if (llmProvider === "openai") {
    return invokeWithOpenAI({ question, systemPrompt });
  }

  // auto: prefer OpenAI, then fall back to Ollama
  if (!openaiApiKey) {
    return invokeWithOllama({ question, systemPrompt });
  }
  try {
    return await invokeWithOpenAI({ question, systemPrompt });
  } catch (openaiError) {
    try {
      return await invokeWithOllama({ question, systemPrompt });
    } catch (ollamaError) {
      throw new Error(
        `OpenAI failed: ${openaiError?.message || openaiError}. Ollama failed: ${ollamaError?.message || ollamaError}`
      );
    }
  }
}

async function getParser() {
  return parser;
}

async function getOpenAIChain() {
  return {
    invoke: openAIChainInvoke,
  };
}

export { openAIChainInvoke, getParser, getOpenAIChain, parser };
