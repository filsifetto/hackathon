# API Key Setup Guide

This guide explains how to securely add and manage API keys in this project.

## Quick Start

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your API keys to `.env`:**
   Open the `.env` file and add your actual API keys:
   ```
   OPENAI_API_KEY=sk-your-actual-key-here
   GOOGLE_MAPS_API_KEY=your-actual-key-here
   ```

3. **Never commit `.env` to git:**
   The `.gitignore` file is already configured to exclude `.env` files.

## Security Best Practices

### ✅ DO:
- Store API keys in `.env` files (already gitignored)
- Use environment-specific files (`.env.development`, `.env.production`)
- Rotate API keys regularly
- Use API key restrictions (IP allowlists, domain restrictions)
- Use different keys for development and production
- Store production keys in secure secrets management (GitHub Secrets, AWS Secrets Manager, etc.)

### ❌ DON'T:
- Commit API keys to version control
- Share API keys in chat, email, or screenshots
- Use production API keys in development
- Hard-code API keys in source code
- Share the `.env` file publicly

## Using API Keys in Your Code

### Python
```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')
```

### Node.js/JavaScript
```javascript
require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
```

### Python (without external libraries)
```python
import os
api_key = os.environ.get('OPENAI_API_KEY')
```

## Common API Providers

### Idun Cluster (NTNU)
- Website: https://www.hpc.ntnu.no/idun/
- Documentation: https://www.hpc.ntnu.no/
- Purpose: High Performance Computing cluster at NTNU for computational research
- Format: `IDUN_API_KEY=your_idun_api_key_here`
- Usage: For running computational tasks on the Idun HPC cluster

**Note:** To use Idun cluster access in Cline:
1. Add your Idun API key to the `.env` file
2. Cline will automatically load environment variables from `.env`
3. Access the key in your code using `process.env.IDUN_API_KEY` (Node.js) or `os.getenv('IDUN_API_KEY')` (Python)

### OpenAI
- Sign up: https://platform.openai.com/
- Get key: https://platform.openai.com/api-keys
- Format: `OPENAI_API_KEY=sk-...`

### ElevenLabs (Avatar TTS)

Based on [ElevenLabs official documentation](https://elevenlabs.io/docs).

- **Sign up:** https://elevenlabs.io/
- **API key:** https://elevenlabs.io/app/settings/api-keys  
  Format: `ELEVEN_LABS_API_KEY=...` (store in `.env`, never commit)

- **Voice ID:** Unique identifier for each voice. List voices via API:
  - `GET https://api.elevenlabs.io/v1/voices` (requires API key in `xi-api-key` header)
  - `?category=premade` – default voices only
  - `?show_legacy=true` – include legacy voices
  - Response: `{ "voices": [ { "voice_id": "pNInz6obpgDQGcFmaJgB", "name": "Adam", ... } ] }`  
  Or use your avatar backend: `GET http://localhost:3000/voices` when running.

- **Model ID:** TTS model for synthesis. From [ElevenLabs models](https://elevenlabs.io/docs/models):
  - `eleven_multilingual_v2` – High quality, multilingual (default; best for content)
  - `eleven_flash_v2_5` – Low latency (~75ms; for real-time/conversational AI)
  - `eleven_turbo_v2_5` – Balanced quality and speed
  - `eleven_multilingual_ttv_v2` – State-of-the-art multilingual voice designer
  - `eleven_monolingual_v1` – Legacy English-only (outclassed by v2)

**Avatar backend** (`src/avatar/backend/.env`):
```
ELEVEN_LABS_API_KEY=your_key
ELEVEN_LABS_VOICE_ID=your_voice_id
ELEVEN_LABS_MODEL_ID=eleven_multilingual_v2
```

### Google Maps
- Sign up: https://console.cloud.google.com/
- Get key: Enable Maps API and create credentials
- Format: `GOOGLE_MAPS_API_KEY=AIza...`

### Twitter/X API
- Sign up: https://developer.twitter.com/
- Get key: Create an app in Developer Portal
- Format: `TWITTER_API_KEY=...`

### Stripe
- Sign up: https://stripe.com/
- Get key: https://dashboard.stripe.com/apikeys
- Format: `STRIPE_API_KEY=sk_test_...` (development) or `sk_live_...` (production)

## Troubleshooting

**Issue:** "API key not found" error
- **Solution:** Make sure you've copied `.env.example` to `.env` and added your key

**Issue:** API key not loading
- **Solution:** Restart your application after modifying `.env`

**Issue:** API key committed to git
- **Solution:** 
  1. Remove from git history: `git rm --cached .env`
  2. Rotate the API key immediately
  3. Verify `.gitignore` includes `.env`

## Team Collaboration

When working with a team:
1. Share the `.env.example` file (template only, no real keys)
2. Each team member creates their own `.env` file locally
3. Use a team password manager or secrets management system for shared keys
4. Document which APIs are needed in this file

## CI/CD and Production

For production deployments:
- Use your platform's secrets management (GitHub Actions secrets, Heroku config vars, etc.)
- Never store production keys in `.env` files
- Use separate keys for each environment

## Need Help?

If you need to add a specific API key, update this documentation with:
- The API provider name
- Where to obtain the key
- Any specific configuration needed
- Example usage code
