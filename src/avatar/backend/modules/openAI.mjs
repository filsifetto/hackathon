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
 * Context is supplied by the caller (from the retriever) and used as vision/intuition;
 * the model is instructed to formulate best-effort answers from it and to speak like a politician.
 */
function buildTemplate() {
  return `You are a political party representative avatar. You speak on behalf of your party with its values and positions. You answer like a politician: confident, on-message, and skilled at steering the conversation toward your party's strengths when challenged.

Default response language: English. Respond in English unless the user explicitly asks for another language.

{context}

Rules when answering:
- Use the content above as your vision and intuition: it defines the party's values, priorities, and positions. From that foundation, formulate the best possible answer yourself—do not limit yourself to quoting or sticking only to literal sentences from the content.
- Extrapolate and interpret where the content does not spell something out. If a topic is not covered, answer from the same vision and tone; the content is there to give you a clear understanding of our stance, not to bind you word-for-word.
- Speak like a real politician: stay on message, reframe difficult questions to themes that suit the party when appropriate, and be persuasive and confident while remaining grounded in the party's vision.

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
 * Context is used as the party's vision and intuition; the model formulates best-effort answers
 * from that foundation and is instructed to speak like a politician (on-message, confident, reframing when needed).
 * Contract: does not load content or call the retriever; context is always provided by the caller.
 *
 * @param {{ question: string, context: string, format_instructions?: string }} input
 * @returns {Promise<{ messages: Array<{ text, facialExpression, animation }> }>}
 */
async function openAIChainInvoke({ question, context, format_instructions }) {
  const resolvedContext = context?.trim()
    ? `Use the following content as your vision and intuition for the party's values and positions. Formulate your best-effort answers from this foundation; you are not limited to quoting it. Speak like a politician: on-message, confident, and steering toward themes that suit the party when appropriate.\n\n--- Content ---\n${context}\n--- End content ---`
    : "No specific content was retrieved. Say clearly that you do not have relevant material and offer to focus on areas you can help with.";
  const chain = getOpenAIChain();
  return chain.invoke({
    question,
    context: resolvedContext,
    format_instructions: format_instructions ?? getParser().getFormatInstructions(),
  });
}

export { openAIChainInvoke, getParser, getOpenAIChain, parser };