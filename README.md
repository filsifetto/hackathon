# Political Party Project

A project for building and running a political party — platform, movement, or campaign.

## Overview

This repository contains the code, documentation, and assets for the political party project. The main feature is a **party representative avatar**: an interactive talking avatar that answers user questions using your party’s positions from a configurable party program.

## Project structure

```
hackathon/
├── README.md           # This file – start here
├── docs/               # Project documentation (see docs/README.md for index)
│   ├── README.md       # Documentation index and quick links
│   ├── API_SETUP.md    # API keys and .env setup – read before first run
│   └── PROJECT_STRUCTURE.md   # Repo layout and where to change things
├── src/                # Application source code
│   └── avatar/         # Party representative talking avatar
│       ├── README.md   # Avatar setup, run instructions, env vars
│       ├── backend/    # API: LLM, TTS, lip-sync, speech-to-text
│       ├── frontend/   # React + Three.js avatar and chat UI
│       └── content/    # party_program.md – party positions and tone
└── assets/             # Static assets (images, media, branding)
```

For a detailed “where to change what” guide, see **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)**.

### Party representative avatar (`src/avatar/`)

The avatar lets users type or speak questions; it answers in line with your party’s views using only the content from **party_program.md**.

- **Backend:** `src/avatar/backend` – Express API (OpenAI, ElevenLabs, lip-sync, Whisper).
- **Frontend:** `src/avatar/frontend` – React + Three.js 3D avatar and chat UI.
- **Content:** `src/avatar/content/party_program.md` – edit this to define the party’s name, values, and policy positions.

Full setup and run instructions: **[src/avatar/README.md](src/avatar/README.md)**.

## Getting started

1. **Clone the repository** (if you haven’t already).
2. **Set up API keys** (required for the avatar):  
   Copy `.env.example` to `.env` and add your keys. Step-by-step: **[docs/API_SETUP.md](docs/API_SETUP.md)**.
3. **Run the avatar** (from repo root):
   - Install dependencies: `yarn avatar:install`
   - Terminal 1: `yarn avatar:backend`
   - Terminal 2: `yarn avatar:frontend`
   - Open [http://localhost:5173](http://localhost:5173)

More detail (including optional Rhubarb lip-sync and avatar model): [src/avatar/README.md](src/avatar/README.md).

## Documentation

- **Documentation index and quick links:** [docs/README.md](docs/README.md)
- **API keys and security:** [docs/API_SETUP.md](docs/API_SETUP.md)
- **Repo structure and conventions:** [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## Contributing

Open an issue or submit a pull request. For larger changes, discuss in an issue first.

## License

TBD.
