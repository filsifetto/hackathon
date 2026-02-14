import OpenAI from "openai";
import dotenv from "dotenv";
import { loadPartyProgram } from "../utils/partyProgram.mjs";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
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

function buildSystemPrompt(sourceDocsText) {
  const context = sourceDocsText
    ? `
Kildedokumenter:
${sourceDocsText}
`
    : "";

  return `Du er en offisiell chatbot-representant for Teknologisk Folkeparti.
Skriv alltid pa klar og tilgjengelig norsk bokmal, med mindre brukeren ber om et annet sprak.
Svar i forsteperson flertall ("vi"), som partiets representant.

Politisk linje og tematikk:
- Prioriter partiets kjerneverdier: teknologi, velferd, digitalisering, kunstig intelligens, demokrati og offentlige tjenester.
- Vektlegg ansvarlig, inkluderende og menneskeorientert teknologibruk.
- Bruk kildedokumentene under som primarkilde.
- Kildedokumentene kan vaere pa engelsk; du skal tolke dem og svare pa norsk.
- Hvis et sporsmal ikke er direkte dekket, lag et rimelig og moderat politikkstandpunkt som er konsistent med partiets ideologi.
- Svar trygt og konstruktivt, uten a virke bastant eller ekstrem.

Forbudte formuleringer:
- Ikke nevn "kildedokumenter", "manglende informasjon", "jeg kan ikke svare", "finnes ikke", eller lignende avvisning.
- Ikke be brukeren oppsoke andre kilder/nettsider for standardsvar.

Stil:
- Profesjonell
- Optimistisk
- Teknologifremoverlent
- Kort, tydelig og politisk troverdig

Returner KUN gyldig JSON i formatet {"messages":[...]}.
Hver melding ma inneholde feltene text, facialExpression og animation.
Maks 3 meldinger.
Gyldige facialExpression: smile, sad, angry, surprised, funnyFace, default.
Gyldige animation: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake.
${context}`;
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9æøå]+/g) || []).filter(Boolean);
}

function normalizeToken(token) {
  // Lightweight normalization for Norwegian variants.
  return token
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "")
    .replace(/(hetene|heten|elser|else|ingene|ingen|inger|ing|ane|ene|ers|er|en|et|a|e)$/i, "");
}

function tokensMatch(a, b) {
  if (a === b) return true;
  if (a.length < 3 || b.length < 3) return false;
  return a.startsWith(b) || b.startsWith(a);
}

function expandQueryTokens(tokens) {
  const expanded = new Set(tokens);
  for (const t of tokens) {
    if (t.startsWith("klima") || t.startsWith("klimatrus")) {
      expanded.add("climate");
      expanded.add("warming");
      expanded.add("emission");
      expanded.add("co2");
      expanded.add("sustain");
      expanded.add("environment");
    }
    if (t.startsWith("miljo") || t.startsWith("miljø")) {
      expanded.add("environment");
      expanded.add("sustain");
      expanded.add("nature");
    }
    if (t.startsWith("energi")) {
      expanded.add("energy");
      expanded.add("power");
      expanded.add("renewable");
    }
  }
  return Array.from(expanded);
}

function selectRelevantContext(question, fullContext) {
  const parts = fullContext
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 40);
  if (parts.length === 0) return "";

  const baseTokens = tokenize(question).map(normalizeToken).filter((w) => w.length >= 3);
  const qTokens = expandQueryTokens(baseTokens);
  if (qTokens.length === 0) return parts.slice(0, 10).join("\n\n").slice(0, 8000);

  const scored = parts.map((part) => {
    const partTokens = tokenize(part).map(normalizeToken).filter((w) => w.length >= 3);
    let score = 0;
    for (const qt of qTokens) {
      if (partTokens.some((pt) => tokensMatch(qt, pt))) score += 2;
      if (part.toLowerCase().includes(qt)) score += 1;
    }
    return { part, score };
  });

  const maxScore = scored.reduce((m, x) => Math.max(m, x.score), 0);
  if (maxScore === 0) {
    return fullContext.slice(0, 12000);
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => x.part)
    .join("\n\n")
    .slice(0, 9000);
}

function hasContextOverlap(question, contextText) {
  const stopwords = new Set([
    "hva",
    "hvordan",
    "hvorfor",
    "kan",
    "skal",
    "med",
    "for",
    "til",
    "om",
    "det",
    "den",
    "dere",
    "jeg",
    "som",
    "på",
    "av",
    "er",
    "og",
    "en",
    "et",
    "de",
    "vi",
    "du",
  ]);

  const q = expandQueryTokens(
    tokenize(question)
      .map(normalizeToken)
      .filter((w) => w.length >= 3 && !stopwords.has(w))
  ).filter((w) => w.length >= 3);
  if (q.length === 0) return true;

  const contextTokens = tokenize(contextText).map(normalizeToken).filter((w) => w.length >= 3);
  let hits = 0;
  for (const qw of q) {
    if (contextTokens.some((cw) => tokensMatch(qw, cw))) hits++;
  }
  return hits >= Math.min(2, q.length);
}

function normalizeMessagesFromUnknownContent(content) {
  const cleaned = String(content || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed?.messages) && parsed.messages.length > 0) {
      return {
        messages: parsed.messages.slice(0, 3).map((m) => ({
          text: String(m?.text || "").trim() || "Beklager, jeg fikk ikke formulert et svar.",
          facialExpression: validFacialExpressions.includes(m?.facialExpression) ? m.facialExpression : "default",
          animation: validAnimations.includes(m?.animation) ? m.animation : "TalkingOne",
        })),
      };
    }

    // Some smaller models return {"<text>":""} when forced into JSON mode.
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const keys = Object.keys(parsed);
      if (keys.length === 1 && keys[0].length > 20) {
        return {
          messages: [
            {
              text: keys[0].trim(),
              facialExpression: "default",
              animation: "TalkingOne",
            },
          ],
        };
      }
    }
  } catch {
    // Not JSON; fall back to plain text output.
  }

  return {
    messages: [
      {
        text: cleaned || "Beklager, jeg fikk ikke formulert et svar.",
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

async function openAIChainInvoke({ question }) {
  const sourceDocsText = await loadPartyProgram();
  const overlap = hasContextOverlap(question || "", sourceDocsText || "");
  const relevantContext = selectRelevantContext(question || "", sourceDocsText || "");
  const fallbackContext = (sourceDocsText || "").slice(0, 6000);
  const contextForPrompt = relevantContext || fallbackContext;
  const systemPrompt = buildSystemPrompt(contextForPrompt);
  const questionWithHint = overlap
    ? question || ""
    : `${question || ""}\n\nHint: Hvis du ikke finner direkte match i dokumentene, bruk naerliggende tema i kildene som primarkilde og marker tydelig hva som er antakelser.`;
  return invokeWithOpenAI({ question: questionWithHint, systemPrompt });
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
