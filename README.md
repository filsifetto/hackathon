# Political Party Project

A project for building and running a political party — platform, movement, or campaign.

## Overview

This repository contains the code, documentation, and assets for the political party project. The main feature is a **party representative avatar**: an interactive talking avatar that answers user questions using your party’s positions from a configurable party program.

## Project structure

```
hackathon/
├── README.md              # This file – start here
├── package.json           # Root scripts (avatar:install, avatar:backend, avatar:frontend)
├── .env.example           # Env template (copy to .env; see docs/API_SETUP.md)
├── docs/                  # Project-wide documentation
│   ├── README.md          # Documentation index and quick links
│   ├── API_SETUP.md       # API keys and .env setup – read before first run
│   └── PROJECT_STRUCTURE.md  # Repo layout and where to change things
├── src/                   # Application source code (see src/README.md)
│   ├── README.md          # Overview of apps and modules
│   ├── avatar/            # Party representative talking avatar
│   │   ├── README.md      # Avatar setup, run instructions, env vars
│   │   ├── backend/       # API: LLM, TTS, lip-sync, speech-to-text
│   │   ├── frontend/      # React + Three.js avatar and chat UI
│   │   └── content/       # party_program.md – party positions and tone
│   └── rag/               # RAG system (Qdrant + OpenAI)
│       ├── README.md      # RAG setup, ingest, search, document feedback
│       ├── core/          # Python library (embedding, search, response gen)
│       ├── scripts/       # CLI: setup DB, ingest, interactive search
│       ├── data/          # Documents and subject-scoped data
│       └── docs/          # RAG design and planning
└── assets/                # Static assets (images, media, branding)
```

For a detailed “where to change what” guide, see **[docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)**.

### Party representative avatar (`src/avatar/`)

The avatar lets users type or speak questions; it answers in line with your party’s views using only the content from **party_program.md**.

- **Backend:** `src/avatar/backend` – Express API (OpenAI, ElevenLabs, lip-sync, Whisper).
- **Frontend:** `src/avatar/frontend` – React + Three.js 3D avatar and chat UI.
- **Content:** `src/avatar/content/party_program.md` – edit this to define the party’s name, values, and policy positions.

Full setup and run instructions: **[src/avatar/README.md](src/avatar/README.md)**.

### RAG system (`src/rag/`)

A separate **Retrieval-Augmented Generation** system: ingest documents (PDF, TXT, etc.) into Qdrant, run hybrid search, and get AI-generated answers with citations. Can be used with or without the avatar. Full setup: **[src/rag/README.md](src/rag/README.md)**.

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

**RAG (optional):** See [src/rag/README.md](src/rag/README.md) for Python venv, Docker (Qdrant), ingest, and interactive search.

## Documentation

- **Documentation index and quick links:** [docs/README.md](docs/README.md)
- **API keys and security:** [docs/API_SETUP.md](docs/API_SETUP.md)
- **Repo structure and conventions:** [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## Contributing

Open an issue or submit a pull request. For larger changes, discuss in an issue first.

## License

TBD.
