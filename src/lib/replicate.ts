import 'server-only';

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';
const DEFAULT_POLL_INTERVAL_MS = 1500;
const DEFAULT_TIMEOUT_MS = 120000;

type ReplicatePredictionStatus =
  | 'starting'
  | 'processing'
  | 'succeeded'
  | 'failed'
  | 'canceled';

type ReplicatePrediction = {
  id: string;
  status: ReplicatePredictionStatus;
  output?: unknown;
  error?: string | null;
  urls?: {
    get?: string;
  };
};

type RunReplicateModelInput = {
  owner: string;
  name: string;
  input: Record<string, unknown>;
  timeoutMs?: number;
};

type GenerateGeminiFlashTextInput = {
  prompt: string;
  systemInstruction?: string | null;
  maxOutputTokens?: number;
  temperature?: number;
  topP?: number;
  thinkingBudget?: number | null;
  dynamicThinking?: boolean;
  images?: string[];
  videos?: string[];
};

function getReplicateApiToken() {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) {
    throw new Error('REPLICATE_API_TOKEN is not set');
  }

  return token;
}

function getReplicateHeaders(extraHeaders?: HeadersInit) {
  const headers = new Headers(extraHeaders);
  headers.set('Authorization', `Bearer ${getReplicateApiToken()}`);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  return headers;
}

function isTerminalStatus(status: ReplicatePredictionStatus) {
  return status === 'succeeded' || status === 'failed' || status === 'canceled';
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parsePredictionResponse(response: Response) {
  const data = (await response.json()) as ReplicatePrediction & { detail?: string };

  if (!response.ok) {
    throw new Error(data.error || data.detail || `Replicate request failed with status ${response.status}`);
  }

  return data;
}

async function fetchPredictionById(predictionId: string) {
  const response = await fetch(`${REPLICATE_API_BASE}/predictions/${predictionId}`, {
    headers: getReplicateHeaders(),
    cache: 'no-store',
  });

  return parsePredictionResponse(response);
}

async function waitForPredictionCompletion(
  initialPrediction: ReplicatePrediction,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
) {
  let prediction = initialPrediction;
  const startedAt = Date.now();

  while (!isTerminalStatus(prediction.status)) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error('Replicate prediction timed out');
    }

    await sleep(DEFAULT_POLL_INTERVAL_MS);
    prediction = await fetchPredictionById(prediction.id);
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(prediction.error || `Replicate prediction ${prediction.status}`);
  }

  return prediction;
}

export async function runReplicateModel({
  owner,
  name,
  input,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: RunReplicateModelInput) {
  const response = await fetch(
    `${REPLICATE_API_BASE}/models/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/predictions`,
    {
      method: 'POST',
      headers: getReplicateHeaders({
        Prefer: 'wait',
      }),
      body: JSON.stringify({ input }),
      cache: 'no-store',
    }
  );

  const prediction = await parsePredictionResponse(response);

  if (prediction.status === 'succeeded') {
    return prediction;
  }

  return waitForPredictionCompletion(prediction, timeoutMs);
}

export function replicateOutputToText(output: unknown) {
  if (typeof output === 'string') {
    return output;
  }

  if (Array.isArray(output)) {
    return output
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        return JSON.stringify(item);
      })
      .join('')
      .trim();
  }

  if (output == null) {
    return '';
  }

  return JSON.stringify(output);
}

export async function generateReplicateGeminiFlashText({
  prompt,
  systemInstruction,
  maxOutputTokens = 2048,
  temperature = 0.9,
  topP = 0.95,
  thinkingBudget = 0,
  dynamicThinking = false,
  images = [],
  videos = [],
}: GenerateGeminiFlashTextInput) {
  const prediction = await runReplicateModel({
    owner: 'google',
    name: 'gemini-2.5-flash',
    input: {
      prompt,
      ...(systemInstruction ? { system_instruction: systemInstruction } : {}),
      max_output_tokens: maxOutputTokens,
      temperature,
      top_p: topP,
      dynamic_thinking: dynamicThinking,
      ...(thinkingBudget !== null ? { thinking_budget: thinkingBudget } : {}),
      ...(images.length > 0 ? { images } : {}),
      ...(videos.length > 0 ? { videos } : {}),
    },
  });

  return replicateOutputToText(prediction.output);
}
