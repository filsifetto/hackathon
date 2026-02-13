# Party representative avatar

A **digital spokesperson** for a political party: an interactive 3D avatar that answers questions in real time using only the party’s own program. Users type or speak; the avatar replies with clear, on-message answers and natural speech with lip-sync.

## Vision

- **Always on, always consistent** – Citizens and voters can talk to the party anytime. The avatar speaks only from `content/party_program.md`, so it never invents positions or drifts off-message.
- **One source of truth** – Update the party program in one place; the avatar’s answers follow. No separate copy for “chat”, “FAQ”, or “representative script”.
- **Inclusive and accessible** – Support both text (for quiet environments or accessibility) and voice (for a more natural, human conversation).
- **Transparent and controllable** – Parties own the content and the tone. The system is a pipeline (LLM + TTS + lip-sync) you can run yourself and adapt to your campaign or organisation.

## Product goal

- **User:** Types or speaks questions.
- **Avatar:** Answers in line with the party’s positions, using only the content from `content/party_program.md`.

## Model pipeline

![Architecture diagram](../../architecture.drawio.svg)

The system uses **OpenAI** (GPT) for responses, **OpenAI Whisper** for speech-to-text, **ElevenLabs** for text-to-speech, and **Rhubarb Lip-Sync** for lip-sync. The party’s positions come from `content/party_program.md`, which is injected into the LLM so the avatar only states what is in the program.

The backend returns a **sequence of messages**. Each message has text, a facial expression, an animation, base64 audio, and lip-sync cues so the 3D avatar can speak and move in sync.

### Workflow with text input

1. **User input** – The user types a question in the chat.
2. **Request** – The text is sent to the backend (`POST /tts`).
3. **Default messages** – If the input matches a known case (e.g. empty, missing API keys), the backend may return pre-rendered intro or error messages from `audios/`.
4. **LLM** – Otherwise the text is sent to OpenAI GPT with the party program as context. The model returns a JSON array of messages (max 3), each with `text`, `facialExpression`, and `animation`.
5. **TTS** – Each message’s text is sent to ElevenLabs to generate speech; audio is written as `audios/message_N.mp3`.
6. **Lip-sync** – Rhubarb Lip-Sync produces phoneme/viseme timings from the audio; the backend reads `audios/message_N.json` and attaches base64 audio + mouth cues to each message.
7. **Response** – The frontend receives the message array and plays them in order; the avatar plays audio and drives mouth morphs from the lip-sync data.

### Workflow with audio input

1. **User input** – The user records with the microphone (browser `MediaRecorder`).
2. **Request** – The recording is sent as base64 to the backend (`POST /sts`).
3. **Speech-to-text** – The backend uses OpenAI Whisper to transcribe the audio to text.
4. **Same as text path** – From step 3 onward, the flow is the same as for text: default messages or LLM → TTS → lip-sync → response.

### Message shape

Each message in the API response looks like:

```json
{
  "text": "Answer text to be spoken.",
  "facialExpression": "smile",
  "animation": "TalkingOne",
  "audio": "<base64-encoded MP3>",
  "lipsync": { "mouthCues": [ { "start": 0.0, "end": 0.1, "value": "X" }, ... ] }
}
```

- **text** – What the avatar says.
- **facialExpression** – One of: smile, sad, angry, surprised, funnyFace, default.
- **animation** – One of: Idle, TalkingOne, TalkingThree, SadIdle, Defeated, Angry, Surprised, DismissingGesture, ThoughtfulHeadShake.
- **audio** – Base64 MP3 for playback in the browser.
- **lipsync** – Mouth cues (visemes) used to drive the avatar’s mouth morph targets in sync with the audio.

## Layout

```
src/avatar/
├── backend/          # API: LLM, TTS, lip-sync, speech-to-text
│   ├── server.js     # Express app (POST /tts, /sts, GET /voices)
│   ├── modules/      # openAI (party-aware), elevenLabs, whisper, lip-sync, etc.
│   ├── utils/        # files, audios, partyProgram loader
│   └── audios/       # Pre-rendered intro/API messages (optional)
├── frontend/         # React + Three.js: 3D avatar, chat UI, speech
│   ├── src/
│   │   ├── components/  # Avatar, ChatInterface, Scenario
│   │   ├── hooks/       # useSpeech (TTS/STS)
│   │   └── constants/   # facial expressions, visemes, morph targets
│   └── public/models/   # avatar.glb, animations.gltf (see below)
├── content/
│   └── party_program.md # Party positions and tone – main “brain” input
└── README.md         # This file
```

## Quick start

### 1. Party program

Edit `content/party_program.md`: party name, values, policy positions, and how the avatar should behave. The backend injects this into the LLM so answers match your party.

### 2. Backend (run from `src/avatar/backend`)

```bash
cd src/avatar/backend
cp ../../../.env .env   # or create .env with keys below
yarn install
yarn dev
```

**Required in `.env`:**

- `OPENAI_API_KEY` – GPT + Whisper
- `OPENAI_MODEL` – e.g. `gpt-4o-mini`
- `ELEVEN_LABS_API_KEY`, `ELEVEN_LABS_VOICE_ID`, `ELEVEN_LABS_MODEL_ID` – TTS

**Optional:**

- Rhubarb Lip-Sync: put the `rhubarb` binary in `src/avatar/backend/bin/` for lip-sync. Install [Rhubarb Lip-Sync](https://github.com/DanielSWolf/rhubarb-lip-sync/releases).
- `ffmpeg` – for audio conversion (Whisper, lip-sync).

### 3. Frontend

```bash
cd src/avatar/frontend
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173). Backend URL is `http://localhost:3000` by default; override with `VITE_AVATAR_BACKEND_URL` in `.env` if needed.

### 4. Avatar model

The app expects:

- `public/models/avatar.glb` – Ready Player Me (or compatible) avatar.
- `public/models/animations.gltf` – already included.

If you don’t have `avatar.glb` yet:

- Create one at [Ready Player Me](https://readyplayer.me/), export as GLB, and put it in `src/avatar/frontend/public/models/avatar.glb`.

## Running from repo root

From the hackathon root you can run backend and frontend in parallel:

```bash
# Terminal 1 – backend (must run from backend dir so audios/ and bin/ resolve)
cd src/avatar/backend && yarn install && yarn dev

# Terminal 2 – frontend
cd src/avatar/frontend && yarn install && yarn dev
```

Development happens in `src/avatar/`. Party-aware behaviour is added via `content/party_program.md` and `backend/modules/openAI.mjs`.
