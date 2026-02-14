# Source code

This directory contains the main applications and libraries of the project. Each app is self-contained with its own dependencies and run instructions.

## Contents

| Path | Description |
|------|--------------|
| **[avatar/](avatar/)** | **Party representative avatar** — Interactive 3D talking avatar that answers questions using the party program. Node.js backend (Express, OpenAI, ElevenLabs, lip-sync) + React + Three.js frontend. |
| **[rag/](rag/)** | **RAG system** — Retrieval-augmented generation with Qdrant and OpenAI. Ingest documents, hybrid search, and AI answers with citations. Python (core + CLI scripts). |

## Quick links

- **Run the avatar:** [avatar/README.md](avatar/README.md) — backend + frontend, env vars, party program.
- **Run RAG:** [rag/README.md](rag/README.md) — Python venv, Docker (Qdrant), ingest, interactive search, document feedback.
- **Project-wide docs (API keys, structure):** [../docs/README.md](../docs/README.md).

## Conventions

- **Documentation:** Each app has a top-level `README.md` with setup and run instructions. Deeper design docs live inside that app (e.g. `avatar/backend/docs/`, `rag/docs/`).
- **Environment:** Prefer a single `.env` at the repo root; app-specific overrides (e.g. `rag/.env`) are supported where documented.
- **Dependencies:** Avatar backend and frontend use Node (yarn); RAG uses Python (pip/venv). Install and run from each app’s directory or via root `package.json` scripts for the avatar.
