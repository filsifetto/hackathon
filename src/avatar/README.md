# Party representative avatar

Interactive talking avatar that represents your political party. Users ask questions; the avatar answers using **situational awareness** from the party program.

## Product goal

- **User:** Types or speaks questions.
- **Avatar:** Answers in line with the party’s positions, using only the content from `content/party_program.md`.

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

- Create one at [Ready Player Me](https://readyplayer.me/), export as GLB, and put it in `src/avatar/frontend/public/models/avatar.glb`, or  
- Copy it from the original `talking-avatar-with-ai` repo if you have it locally.

## Running from repo root

From the hackathon root you can run backend and frontend in parallel:

```bash
# Terminal 1 – backend (must run from backend dir so audios/ and bin/ resolve)
cd src/avatar/backend && yarn install && yarn dev

# Terminal 2 – frontend
cd src/avatar/frontend && yarn install && yarn dev
```

## Subrepo note

This code was extracted from the `talking-avatar-with-ai` subrepo. The nested `.git` there is unchanged; all development happens in `src/avatar/`. The party-aware behaviour is added via `content/party_program.md` and `backend/modules/openAI.mjs`.
