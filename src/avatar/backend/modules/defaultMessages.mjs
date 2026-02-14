import dotenv from "dotenv";
dotenv.config();

const openAIApiKey = process.env.OPENAI_API_KEY;
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;

async function sendDefaultMessages({ userMessage }) {
  if (!userMessage) {
    return [
      {
        text: "Hei! Hvordan har dagen din vært?",
        facialExpression: "smile",
        animation: "TalkingOne",
      },
      {
        text: "Jeg representerer partiet vårt. Spør meg gjerne om standpunkter og prioriteringer.",
        facialExpression: "smile",
        animation: "TalkingThree",
      },
    ];
  }

  if (!elevenLabsApiKey || !openAIApiKey) {
    return [
      {
        text: "Legg inn API-nøklene dine i backend sin .env-fil.",
        facialExpression: "angry",
        animation: "TalkingThree",
      },
      {
        text: "Du trenger OpenAI- og ElevenLabs-nøkler for at avataren skal fungere.",
        facialExpression: "sad",
        animation: "Idle",
      },
    ];
  }
  return null;
}

const defaultResponse = [
  {
    text: "Beklager, jeg fikk ikke svart på det. Kan du gjenta eller omformulere spørsmålet?",
    facialExpression: "sad",
    animation: "Idle",
  },
];

export { sendDefaultMessages, defaultResponse };
