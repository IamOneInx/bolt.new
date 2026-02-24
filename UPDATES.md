# Bolt.new — Updates & Usage Guide

## What Was Changed

Six improvements were made to the base bolt.new codebase:

---

### 1. Multi-Model / Multi-Provider Support

**Files changed:** `app/lib/.server/llm/model.ts`, `app/lib/.server/llm/api-key.ts`, `app/lib/.server/llm/stream-text.ts`, `app/utils/constants.ts`, `worker-configuration.d.ts`

You can now use any of the following AI providers:

| Provider | Needs API Key | Notes |
|---|---|---|
| **Anthropic** | Yes | Claude 3.5 Sonnet/Haiku, Claude 3 Opus/Sonnet/Haiku |
| **OpenAI** | Yes | GPT-4o, GPT-4, GPT-3.5 |
| **Google** | Yes | Gemini 1.5 Pro/Flash |
| **Groq** | Yes | Llama 3.1, Mixtral, Gemma2 (free tier available) |
| **Mistral** | Yes | Mistral Large/Small, Codestral |
| **Deepseek** | Yes | Deepseek Coder, Deepseek Chat |
| **xAI** | Yes | Grok Beta |
| **OpenRouter** | Yes | Routes to 100+ models via one key |
| **HuggingFace** | Yes | Qwen 2.5 Coder and others |
| **Ollama** | No | Local models — auto-detected (see below) |
| **LMStudio** | No | Local models — auto-detected (see below) |
| **OpenAILike** | Optional | Any OpenAI-compatible local/remote API |

---

### 2. Automatic Local Model Discovery

**File added:** `app/lib/hooks/useModelDiscovery.ts`

When the app loads, it automatically scans for locally running models:

- **Ollama** — queries `http://localhost:11434/api/tags`
- **LMStudio** — queries `http://localhost:1234/v1/models`
- **OpenAILike** — queries your custom base URL if set

The provider dropdown shows live status:
- `Ollama (3)` — 3 models found
- `Ollama (none found)` — Ollama not running or no models pulled
- `Ollama (scanning...)` — discovery in progress

No configuration needed for local providers — just have the server running.

---

### 3. MAX_RESPONSE_SEGMENTS Raised: 2 → 5

**File changed:** `app/lib/.server/llm/constants.ts`

Previously the AI could only continue a response once if it hit the token limit, meaning complex projects could get cut off mid-generation. Now it can continue up to 5 times before stopping.

---

### 4. Improved Error Handling

**File changed:** `app/routes/api.chat.ts`

Errors now return meaningful messages instead of a blank 500:

- **Rate limit hit** → HTTP 429 with a clear explanation
- **Invalid API key** → HTTP 401 with a clear explanation
- **Other errors** → HTTP 500 with the actual error message

---

### 5. Token Usage Display

**File added:** `app/lib/stores/token-usage.ts`

A session token counter is shown in the bottom-right of the input bar (e.g. `~1,240 tokens`). This tracks estimated usage across the current session. Resets on page refresh.

> Note: This is an estimate (~4 chars = 1 token). Exact counts vary by model and tokenizer.

---

### 6. Model Selector UI

**File changed:** `app/components/chat/BaseChat.tsx`

Two dropdowns appear in the chat input bar:
1. **Provider** — select which AI service to use
2. **Model** — select the specific model for that provider

Switching providers automatically selects the first available model for that provider.

---

## How to Run

### Development
```bash
cd bolt.new
pnpm dev
```
App runs at `http://localhost:5173`

### Production Build
```bash
pnpm build
```

### Deploy to Cloudflare Pages
```bash
pnpm deploy
```

---

## Setting API Keys

### Option A — Environment Variables (recommended for dev)

Create a `.env` file in the `bolt.new` root:

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
GROQ_API_KEY=gsk_...
MISTRAL_API_KEY=...
DEEPSEEK_API_KEY=...
XAI_API_KEY=...
OPEN_ROUTER_API_KEY=sk-or-...
HUGGINGFACE_API_KEY=hf_...

# For OpenAI-compatible local/custom APIs:
OPENAI_LIKE_API_KEY=...
OPENAI_LIKE_API_BASE_URL=http://localhost:8080

# For local model servers (optional — auto-detected at defaults):
OLLAMA_API_BASE_URL=http://localhost:11434
LMSTUDIO_API_BASE_URL=http://localhost:1234
```

### Option B — In-Browser (per-session)

API keys can be stored in the browser's localStorage under the key `bolt_api_keys` as a JSON object:

```js
// Paste this in browser DevTools console
localStorage.setItem('bolt_api_keys', JSON.stringify({
  Anthropic: 'sk-ant-...',
  OpenAI: 'sk-...',
  Groq: 'gsk_...',
}))
```

These keys are sent with each request and override env vars. They are never sent anywhere except directly to the selected provider via the Bolt server.

### Option C — Cloudflare Pages (production)

Set environment variables in the Cloudflare dashboard:
`Pages → Your Project → Settings → Environment Variables`

---

## Using Ollama (Free Local Models)

1. Install Ollama: https://ollama.com
2. Pull a model:
   ```bash
   ollama pull llama3.1
   ollama pull codellama
   ollama pull deepseek-coder
   ```
3. Ollama starts automatically. Leave it running.
4. Open Bolt — select **Ollama** from the provider dropdown. Your pulled models appear automatically.

**Recommended models for coding:**
- `deepseek-coder:6.7b` — fast, good for code
- `codellama:13b` — solid general coding
- `llama3.1:8b` — good all-rounder
- `qwen2.5-coder:7b` — excellent for web dev

---

## Using LMStudio (Free Local Models)

1. Download LMStudio: https://lmstudio.ai
2. Download a model from the Discover tab (GGUF format)
3. Start the local server: `Local Server → Start Server`
4. Open Bolt — select **LMStudio** from the provider dropdown

---

## Packages Added

```
@ai-sdk/openai@0.0.36
@ai-sdk/google@0.0.22
@ai-sdk/mistral@0.0.14
ollama-ai-provider@0.9.1
@openrouter/ai-sdk-provider@0.0.5
```

These are pinned to versions compatible with the existing `ai@^3.3.4` SDK.
