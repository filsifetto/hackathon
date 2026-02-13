# Project structure

This document describes how the repository is organized so you can find code, docs, and assets quickly.

## High-level layout

```
hackathon/
├── README.md              # Project overview and getting started
├── package.json           # Root scripts (avatar:install, avatar:backend, avatar:frontend)
├── .env.example           # Template for environment variables (copy to .env)
├── docs/                  # Project-wide documentation
│   ├── README.md          # This docs index
│   ├── API_SETUP.md       # API key setup and security
│   └── PROJECT_STRUCTURE.md  # This file
├── src/                   # Application source code
│   └── avatar/            # Party representative talking avatar
│       ├── README.md      # Avatar setup and run instructions
│       ├── backend/       # API server (LLM, TTS, lip-sync, speech-to-text)
│       ├── frontend/      # React + Three.js UI and 3D avatar
│       └── content/       # Party program (positions, tone) for the avatar
└── assets/                # Static assets (images, media, branding) – add as needed
```

## Conventions

- **Documentation:** All project-wide docs live in `docs/`. Component-specific docs (e.g. avatar) live next to the code in `src/avatar/README.md`.
- **Environment:** Never commit real API keys. Use `.env` (gitignored); see [API_SETUP.md](API_SETUP.md).
- **Avatar:** All avatar-related code stays under `src/avatar/`. Backend and frontend are separate apps (different terminals to run).

## Where to change what

| You want to… | Go to… |
|--------------|--------|
| Change the party’s name, values, or policy positions | `src/avatar/content/party_program.md` |
| Add or change API keys / env vars | `.env` (and [docs/API_SETUP.md](API_SETUP.md)) |
| Modify the backend API (endpoints, LLM, TTS) | `src/avatar/backend/` |
| Modify the 3D avatar or chat UI | `src/avatar/frontend/src/` |
| Add project-wide documentation | `docs/` (and list it in [docs/README.md](README.md)) |

## Running the project

From the repo root:

1. **One-time:** Copy `.env.example` to `.env` and add your API keys (see [API_SETUP.md](API_SETUP.md)).
2. **Avatar:**  
   - Terminal 1: `yarn avatar:backend`  
   - Terminal 2: `yarn avatar:frontend`  
   Details: [src/avatar/README.md](../src/avatar/README.md).
