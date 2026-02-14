# Avatar frontend

React + Three.js app: 3D party representative avatar, chat UI, and voice input. Talks to the [avatar backend](../backend) for answers, TTS, and lip-sync.

## Quick start

From this directory:

```bash
yarn install
yarn dev
```

Open [http://localhost:5173](http://localhost:5173). Set `VITE_AVATAR_BACKEND_URL` in `.env` if the backend is not at `http://localhost:3000`.

## Layout

- `src/` — React app: `App.jsx`, pages, `components/` (Avatar, ChatInterface, SiteLayout, etc.), `hooks/` (useSpeech), `constants/` (visemes, avatar URL).
- `public/models/` — `avatar.glb`, `animations.gltf`, `animations_data.bin` (required for animations).
- `test-avatar.html` / `test-avatar-debug.html` — Static avatar and diagnostic pages.

For full setup (backend, env, avatar model, design tests), see **[../README.md](../README.md)**.
