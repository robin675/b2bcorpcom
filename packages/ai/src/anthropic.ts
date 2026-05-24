// Minimal Anthropic Messages API client (fetch-based, Workers-friendly).
// Supports prompt caching via `cache_control` on the system block.

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeOptions {
  apiKey: string;
  model: string;
  system: string;
  messages: ClaudeMessage[];
  maxTokens: number;
  // When true, marks the system prompt for ephemeral prompt caching
  // (Anthropic charges cached reads at ~10% of input).
  cacheSystem?: boolean;
  temperature?: number;
}

interface AnthropicResponse {
  id: string;
  type: "message";
  role: "assistant";
  content: { type: "text"; text: string }[];
  stop_reason: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

export async function callClaude(opts: ClaudeOptions): Promise<{
  text: string;
  usage: AnthropicResponse["usage"];
}> {
  const systemBlock = opts.cacheSystem
    ? [{ type: "text", text: opts.system, cache_control: { type: "ephemeral" } }]
    : opts.system;

  const body = {
    model: opts.model,
    max_tokens: opts.maxTokens,
    system: systemBlock,
    messages: opts.messages,
    ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
  };

  const res = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "x-api-key": opts.apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 400)}`);
  }

  const json = (await res.json()) as AnthropicResponse;
  const text = json.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");

  return { text, usage: json.usage };
}
