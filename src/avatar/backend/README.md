# Avatar backend

Express API for the party representative avatar: **LLM** (OpenAI), **TTS** (ElevenLabs), **lip-sync** (Rhubarb), **speech-to-text** (Whisper), and **retrieval** over the party program.

## Role

- `POST /tts` — Text question → retrieval → LLM → TTS → lip-sync → JSON messages (text, audio, mouth cues).
- `POST /sts` — Audio question → Whisper → same pipeline as `/tts`.
- `GET /voices` — List ElevenLabs voices.
- Serves avatar model: `GET /models/avatar.glb` (from frontend `public/models/`).

## Quick start

From this directory:

```bash
cp ../../../.env .env   # or create .env with keys (see below)
yarn install
yarn dev
```

Required in `.env`: `OPENAI_API_KEY`, `OPENAI_MODEL`, `ELEVEN_LABS_API_KEY`, `ELEVEN_LABS_VOICE_ID`, `ELEVEN_LABS_MODEL_ID`. Optional: Rhubarb binary in `bin/`, `ffmpeg`. See [docs/API_SETUP.md](../../../docs/API_SETUP.md) and the [avatar README](../README.md) for full setup.

## Layout

- `server.js` — Express app and routes.
- `modules/` — retriever, openAI (party-aware LLM), elevenLabs, whisper, lip-sync.
- `utils/` — content loader, audios, file helpers.
- `docs/PIPELINE.md` — RAG pipeline and component contracts.
- `audios/` — Pre-rendered intro/error messages (optional).
- `bin/` — Optional Rhubarb Lip-Sync binary.

For full architecture and run instructions (including from repo root), see **[../README.md](../README.md)**.
