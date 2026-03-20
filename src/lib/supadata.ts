import 'server-only';

const SUPADATA_API_BASE = 'https://api.supadata.ai/v1';
const DEFAULT_POLL_INTERVAL_MS = 1500;
const DEFAULT_TIMEOUT_MS = 90000;

export type TranscriptSource = 'supadata_native' | 'supadata_generated' | 'none';

export interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
  lang?: string | null;
}

export interface SourceMetadata {
  platform: string | null;
  type: string | null;
  id: string | null;
  title: string | null;
  description: string | null;
  authorName: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  raw: Record<string, unknown> | null;
}

interface SupadataTranscriptChunk {
  text?: string;
  offset?: number;
  duration?: number;
  lang?: string;
}

interface SupadataTranscriptResponse {
  jobId?: string;
  status?: 'queued' | 'active' | 'completed' | 'failed';
  content?: string | SupadataTranscriptChunk[];
  lang?: string;
  availableLangs?: string[];
  error?: {
    error?: string;
    message?: string;
    details?: string;
  };
}

interface FetchTranscriptOptions {
  preferredLanguage?: string | null;
  timeoutMs?: number;
}

export interface FetchTranscriptResult {
  transcript: TranscriptSegment[];
  transcriptSource: TranscriptSource;
  language: string | null;
  availableLanguages: string[];
  sourceMetadata: SourceMetadata | null;
  fallbackReason: string | null;
}

function getSupadataApiKey() {
  return process.env.SUPADATA_API_KEY?.trim() || process.env.SUPADATA_API_TOKEN?.trim() || '';
}

function getHeaders() {
  const apiKey = getSupadataApiKey();
  if (!apiKey) {
    throw new Error('SUPADATA_API_KEY is not set');
  }

  return {
    'x-api-key': apiKey,
    Accept: 'application/json',
  };
}

function buildUrl(pathname: string, params: Record<string, string | number | boolean | null | undefined>) {
  const url = new URL(`${SUPADATA_API_BASE}${pathname}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseJsonResponse<T>(response: Response) {
  const data = (await response.json()) as T & {
    error?: { message?: string; details?: string };
    message?: string;
    details?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error?.message
      || data.error?.details
      || data.message
      || data.details
      || `Supadata request failed with status ${response.status}`
    );
  }

  return data;
}

function normalizeTranscriptSegments(content: string | SupadataTranscriptChunk[] | undefined, lang?: string | null) {
  if (typeof content === 'string') {
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((text, index) => ({
        start: index,
        end: index + 1,
        text,
        lang: lang || null,
      }));
  }

  if (!Array.isArray(content)) {
    return [];
  }

  return content
    .map((chunk) => ({
      start: Number(chunk.offset || 0) / 1000,
      end: (Number(chunk.offset || 0) + Number(chunk.duration || 0)) / 1000,
      text: String(chunk.text || '').trim(),
      lang: chunk.lang || lang || null,
    }))
    .filter((segment) => segment.text.length > 0);
}

async function pollTranscriptResult(jobId: string, timeoutMs: number) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(`${SUPADATA_API_BASE}/transcript/${jobId}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    const data = await parseJsonResponse<SupadataTranscriptResponse>(response);

    if (data.status === 'completed') {
      return data;
    }

    if (data.status === 'failed') {
      throw new Error(data.error?.message || data.error?.details || 'Supadata transcript job failed');
    }

    await new Promise((resolve) => setTimeout(resolve, DEFAULT_POLL_INTERVAL_MS));
  }

  throw new Error('Supadata transcript job timed out');
}

async function fetchTranscriptByMode(
  url: string,
  mode: 'native' | 'generate',
  { preferredLanguage, timeoutMs = DEFAULT_TIMEOUT_MS }: FetchTranscriptOptions
) {
  const transcriptUrl = buildUrl('/transcript', {
    url,
    mode,
    text: false,
    chunkSize: 280,
    lang: preferredLanguage || undefined,
  });

  const response = await fetch(transcriptUrl, {
    headers: getHeaders(),
    cache: 'no-store',
  });
  const data = await parseJsonResponse<SupadataTranscriptResponse>(response);
  const finalData = data.jobId ? await pollTranscriptResult(data.jobId, timeoutMs) : data;

  return {
    transcript: normalizeTranscriptSegments(finalData.content, finalData.lang),
    language: finalData.lang || null,
    availableLanguages: finalData.availableLangs || [],
  };
}

export async function fetchSupadataMetadata(url: string): Promise<SourceMetadata | null> {
  if (!getSupadataApiKey()) {
    return null;
  }

  try {
    const response = await fetch(buildUrl('/metadata', { url }), {
      headers: getHeaders(),
      cache: 'no-store',
    });
    const data = await parseJsonResponse<Record<string, unknown>>(response);

    const media = (typeof data.media === 'object' && data.media !== null ? data.media : {}) as Record<string, unknown>;
    const author = (typeof data.author === 'object' && data.author !== null ? data.author : {}) as Record<string, unknown>;

    return {
      platform: typeof data.platform === 'string' ? data.platform : null,
      type: typeof data.type === 'string' ? data.type : null,
      id: typeof data.id === 'string' ? data.id : null,
      title: typeof data.title === 'string' ? data.title : null,
      description: typeof data.description === 'string' ? data.description : null,
      authorName: typeof author.displayName === 'string' ? author.displayName : typeof author.username === 'string' ? author.username : null,
      thumbnailUrl: typeof media.thumbnailUrl === 'string' ? media.thumbnailUrl : null,
      durationSeconds: typeof media.duration === 'number' ? media.duration : null,
      raw: data,
    };
  } catch (error) {
    console.warn('Supadata metadata fetch failed:', error);
    return null;
  }
}

export async function fetchSupadataTranscript(url: string, options: FetchTranscriptOptions = {}): Promise<FetchTranscriptResult> {
  const sourceMetadata = await fetchSupadataMetadata(url);

  if (!getSupadataApiKey()) {
    return {
      transcript: [],
      transcriptSource: 'none',
      language: null,
      availableLanguages: [],
      sourceMetadata,
      fallbackReason: 'supadata_api_key_missing',
    };
  }

  try {
    const nativeResult = await fetchTranscriptByMode(url, 'native', options);
    if (nativeResult.transcript.length > 0) {
      return {
        transcript: nativeResult.transcript,
        transcriptSource: 'supadata_native',
        language: nativeResult.language,
        availableLanguages: nativeResult.availableLanguages,
        sourceMetadata,
        fallbackReason: null,
      };
    }
  } catch (error) {
    console.warn('Supadata native transcript unavailable, trying generated mode:', error);
  }

  try {
    const generatedResult = await fetchTranscriptByMode(url, 'generate', options);
    return {
      transcript: generatedResult.transcript,
      transcriptSource: generatedResult.transcript.length > 0 ? 'supadata_generated' : 'none',
      language: generatedResult.language,
      availableLanguages: generatedResult.availableLanguages,
      sourceMetadata,
      fallbackReason: generatedResult.transcript.length > 0 ? 'native_transcript_unavailable' : 'generated_transcript_empty',
    };
  } catch (error) {
    console.warn('Supadata generated transcript failed:', error);
    return {
      transcript: [],
      transcriptSource: 'none',
      language: null,
      availableLanguages: [],
      sourceMetadata,
      fallbackReason: error instanceof Error ? error.message : 'supadata_transcript_failed',
    };
  }
}
