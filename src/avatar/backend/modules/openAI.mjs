import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";

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

/**
 * Builds the prompt template. Uses {context} and {format_instructions} as variables.
 * Context is supplied by the caller (from the retriever); this module does not load content.
 */
function buildTemplate() {
  return `You are a political party representative avatar. You speak on behalf of your party with its values and positions.

Default response language: English. Respond in English unless the user explicitly asks for another language.

{context}

Rules when answering:
- Ground every answer in the content above. Refer to positions and values stated there.
- Do not invent or extrapolate positions not stated in the content.
- If asked about something not covered: say so clearly and offer to focus on areas that are covered.
- Keep answers concise and suitable for spoken delivery (short sentences, clear structure).

You will always respond with a JSON array of messages, with a maximum of 3 messages:
{format_instructions}
Each message has properties for text, facialExpression, and animation.
The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
The different animations are: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry,
Surprised, DismissingGesture and ThoughtfulHeadShake.`;
}

let cachedChain = null;

function getOpenAIChain() {
  if (cachedChain) return cachedChain;
  const template = buildTemplate();
  const prompt = ChatPromptTemplate.fromMessages([
    ["ai", template],
    ["human", "{question}"],
  ]);
  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY || "-",
    modelName: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
  });
  cachedChain = prompt.pipe(model).pipe(parser);
  return cachedChain;
}

function getParser() {
  return parser;
}

/**
 * Generate avatar messages from question + retrieved context.
 * Contract: does not load content or call the retriever; context is always provided by the caller.
 *
 * @param {{ question: string, context: string, format_instructions?: string }} input
 * @returns {Promise<{ messages: Array<{ text, facialExpression, animation }> }>}
 */
async function openAIChainInvoke({ question, context, format_instructions }) {
  const resolvedContext =
    context?.trim() ?
      `CRITICAL: Base your answers ONLY on the following retrieved content. This is your source of truth.\n\n--- Content ---\n${context}\n--- End content ---`
    : "No specific content was retrieved. Say clearly that you do not have relevant material and offer to focus on areas you can help with.";
  const chain = getOpenAIChain();
  return chain.invoke({
    question,
    context: resolvedContext,
    format_instructions: format_instructions ?? getParser().getFormatInstructions(),
  });
}

export { openAIChainInvoke, getParser, getOpenAIChain, parser };