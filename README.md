# Political Party Project

A project for building and running a political party — platform, movement, or campaign.

## Overview

This repository contains the code, documentation, and assets for the political party project created during the hackathon.

## Project structure

```
hackathon/
├── README.md           # This file
├── docs/               # Documentation, manifestos, strategy notes
├── src/                # Application source code
│   └── avatar/         # Party representative talking avatar (see below)
└── assets/             # Static assets (images, media, branding)
```

### Party representative avatar (`src/avatar/`)

Interactive avatar that answers user questions using the party’s positions from a **party program** file. Users type or speak; the avatar responds in line with your party’s views.

- **Backend:** `src/avatar/backend` – API (OpenAI, ElevenLabs, lip-sync, Whisper).
- **Frontend:** `src/avatar/frontend` – React + Three.js avatar and chat UI.
- **Content:** `src/avatar/content/party_program.md` – edit this to define the party’s positions and tone.

See **[src/avatar/README.md](src/avatar/README.md)** for setup and running the avatar.

## Getting started

1. Clone the repository (if you haven’t already).
2. See `docs/` for project documentation and setup details.
3. Add and run the application code from `src/` as the project grows.

**Avatar:** To run the party representative avatar: `yarn avatar:install`, then `yarn avatar:backend` (in one terminal) and `yarn avatar:frontend` (in another). Details in [src/avatar/README.md](src/avatar/README.md).

## Contributing

Open an issue or submit a pull request. For larger changes, discuss in an issue first.

## License

TBD.
