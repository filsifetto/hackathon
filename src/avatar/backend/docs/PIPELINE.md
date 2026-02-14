# Avatar response pipeline (RAG)

The backend answers user questions through a **retrieval-augmented generation** pipeline. Each stage has a single responsibility and a narrow interface so components can be changed or replaced without breaking others.

## Data flow

```
User question (text)
    → Retriever (query vector DB)
    → Context string
    → LLM (generate reply from question + context)
    → Messages (text, expression, animation)
    → Speech (TTS + lip-sync)
    → Response to client
```

## Component contracts

### 1. Retriever

**Role:** Turn a user question into relevant source text (no generation).

- **Input:** `{ query: string }`
- **Output:** `Promise<{ context: string }>`
- **Contract:** Returns a single string of relevant content. Empty string if no content or no matches. Does not call the LLM or speech modules. The server is the only caller.

### 2. LLM (generator)

**Role:** Produce avatar messages from question + context only.

- **Input:** `{ question: string, context: string, format_instructions?: string }`
- **Output:** `Promise<{ messages: Array<{ text, facialExpression, animation }> }>`
- **Contract:** Uses only the provided `context`; does not load files or call the retriever. Same output shape as today (for lip-sync and frontend).

### 3. Speech (lip-sync)

**Role:** Add audio and lip-sync data to messages.

- **Input:** `{ messages: Array<{ text, facialExpression, animation }> }`
- **Output:** Same array with `audio` and `lipsync` added to each message.
- **Contract:** Unchanged; no dependency on retriever or LLM internals.

### 4. Orchestrator (server)

**Role:** Run the pipeline and handle defaults/errors.

- Calls: default messages (optional) → retriever → LLM → speech.
- Does not implement retrieval, generation, or TTS logic; only composition and error handling.

## Adding or replacing components

- **Different vector store:** Implement the same retriever interface in a new module and swap the import in the server.
- **Different LLM:** Implement the same generator interface (question + context → messages) and swap in the server.
- **Different content sources:** Change only the content loader used by the retriever; retriever and LLM interfaces stay the same.
