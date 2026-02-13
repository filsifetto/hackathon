import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
import { loadPolitikkContent } from "../utils/politikk.mjs";

dotenv.config();

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    messages: z.array(
      z.object({
        text: z.string().describe("Text to be spoken by the AI"),
        facialExpression: z
          .string()
          .describe(
            "Facial expression to be used by the AI. Select from: smile, sad, angry, surprised, funnyFace, and default"
          ),
        animation: z
          .string()
          .describe(
            "Animation to be used by the AI. Select from: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, and ThoughtfulHeadShake."
          ),
      })
    ),
  })
);

function buildTemplate(politikkText) {
  const contentContext = politikkText
    ? `
CRITICAL: You must base your answers ONLY on the following content from content/Politikk. This is your primary source of truth.

--- Content (Politikk) ---
${politikkText}
--- End content ---

Rules when answering:
- Ground every answer in the content above. Refer to positions and values stated there.
- Do not invent or extrapolate positions not stated in the content.
- If asked about something not covered: say so clearly and offer to focus on areas that are covered.
- Keep answers concise and suitable for spoken delivery (short sentences, clear structure).
`
    : "";

  return `
  You are a political party representative avatar. You speak on behalf of your party with its values and positions.
  Default response language: Norwegian (Bokmål). Respond in Norwegian unless the user explicitly asks for another language.
  ${contentContext}
  You will always respond with a JSON array of messages, with a maximum of 3 messages:
  \n{format_instructions}.
  Each message has properties for text, facialExpression, and animation.
  The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
  The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry,
  Surprised, DismissingGesture and ThoughtfulHeadShake.
`;
}

let cachedPrompt = null;
let cachedChain = null;

async function getOpenAIChain() {
  const politikkText = await loadPolitikkContent();
  const template = buildTemplate(politikkText);
  const prompt = ChatPromptTemplate.fromMessages([
    ["ai", template],
    ["human", "{question}"],
  ]);
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY || "-",
    modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
  });
  return prompt.pipe(model).pipe(parser);
}

async function getParser() {
  return parser;
}

/** Invoke the chain with the current party program. */
async function openAIChainInvoke({ question, format_instructions }) {
  const chain = await getOpenAIChain();
  return chain.invoke({
    question,
    format_instructions: format_instructions || (await getParser()).getFormatInstructions(),
  });
}
export { openAIChainInvoke, getParser, getOpenAIChain, parser };