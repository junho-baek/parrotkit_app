import { NextRequest, NextResponse } from 'next/server';
import { analyzeVideoFrameCandidates, analyzeYouTubeVideo, extractVideoThumbnailsAtTimestamps, type SceneCandidate, type VideoAnalysisResult } from '@/lib/video-analyzer';
import { generateReplicateGeminiFlashText, generateReplicateGeminiProText } from '@/lib/replicate';
import { fetchSupadataTranscript, type TranscriptSegment, type TranscriptSource } from '@/lib/supadata';
import { fetchSocialVideoDownload, type DownloadSource } from '@/lib/social-video-downloader';
import { extractBrandBriefFromPdf } from '@/lib/brand-brief';
import { normalizeRecipeScene } from '@/lib/recipe-scene';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import type { BrandBrief, PrompterBlock, ReferenceSignalType } from '@/types/recipe';

type Platform = 'youtube' | 'youtube-shorts' | 'instagram' | 'tiktok' | 'other';

type PageMedia = {
  imageUrl: string | null;
  videoUrl: string | null;
  source: DownloadSource | 'page_meta' | 'direct_url' | 'none';
  fallbackReason: string | null;
};

type StoredPlaybackVideo = {
  playbackUrl: string | null;
  storagePath: string | null;
  storageError: string | null;
};

type ExtendedVideoAnalysisResult = Omit<VideoAnalysisResult, 'method'> & {
  method?: VideoAnalysisResult['method'] | 'gemini_video_motion';
  motionDescriptions?: string[];
};

type GeminiVideoScene = {
  scene_number: number;
  start_time: string;
  end_time: string;
  motion_description: string;
};

type ReferenceSignalDraft = {
  type: ReferenceSignalType;
  text: string;
};

type PrompterBlockDraft = Omit<PrompterBlock, 'id'> & {
  id?: string;
};

type GeneratedScenePlan = {
  scene_id: number;
  why_it_works?: string[];
  // Legacy compatibility only. The current UI no longer consumes reference signals inline.
  reference_signals?: ReferenceSignalDraft[];
  objective?: string;
  appeal_point?: string;
  key_line?: string;
  script_lines?: string[];
  key_mood?: string;
  key_action?: string;
  must_include?: string[];
  must_avoid?: string[];
  cta?: string;
  prompter_blocks?: PrompterBlockDraft[];
};

type ScenePlanGenerationResult = {
  scenes: GeneratedScenePlan[];
};

type ParsedAnalyzeInput = {
  url: string;
  niche: string;
  goal: string;
  description: string;
  brandBrief: BrandBrief | null;
  brandContextFileName: string | null;
};

type AnalyzeLogLevel = 'info' | 'warn' | 'error';

const RECIPE_SOURCE_VIDEO_BUCKET = 'recipe-source-videos';

function createAnalyzeRequestId() {
  return `analyze_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeUrlForLog(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return rawUrl.slice(0, 160);
  }
}

function logAnalyze(level: AnalyzeLogLevel, requestId: string, message: string, meta?: Record<string, unknown>) {
  const prefix = `[분석][${requestId}] ${message}`;
  const normalizedMeta = meta
    ? Object.fromEntries(Object.entries(meta).filter(([, value]) => value !== undefined))
    : undefined;

  if (!normalizedMeta || Object.keys(normalizedMeta).length === 0) {
    console[level](prefix);
    return;
  }

  console[level](prefix, normalizedMeta);
}

function detectPlatform(url: string): Platform {
  if (url.includes('youtube.com/shorts') || url.includes('youtu.be')) return 'youtube-shorts';
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'other';
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /shorts\/([a-zA-Z0-9_-]+)/,
    /watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function extractInstagramId(url: string): string | null {
  const match = url.match(/\/(reel|p)\/([a-zA-Z0-9_-]+)/);
  return match ? match[2] : null;
}

function extractTikTokId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

function isDirectVideoUrl(url: string) {
  return /\.(mp4|mov|m4v|webm)(\?.*)?$/i.test(url);
}

function sanitizeStoragePathSegment(value: string) {
  const normalized = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return normalized || 'video';
}

function inferVideoFileExtension(videoUrl: string, contentType: string | null) {
  if (contentType) {
    if (contentType.includes('webm')) return 'webm';
    if (contentType.includes('quicktime')) return 'mov';
    if (contentType.includes('m4v')) return 'm4v';
    if (contentType.includes('mp4')) return 'mp4';
  }

  const match = videoUrl.match(/\.([a-z0-9]+)(?:\?.*)?$/i);
  const extension = match?.[1]?.toLowerCase();

  if (extension && ['mp4', 'webm', 'mov', 'm4v'].includes(extension)) {
    return extension;
  }

  return 'mp4';
}

async function uploadPlaybackVideoToStorage({
  sourceVideoUrl,
  platform,
  sourceId,
  requestId,
}: {
  sourceVideoUrl: string;
  platform: Platform;
  sourceId: string | null;
  requestId: string;
}): Promise<StoredPlaybackVideo> {
  try {
    const response = await fetch(sourceVideoUrl, {
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        playbackUrl: null,
        storagePath: null,
        storageError: `storage_fetch_http_${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type');
    const extension = inferVideoFileExtension(sourceVideoUrl, contentType);
    const path = `${sanitizeStoragePathSegment(platform)}/${sanitizeStoragePathSegment(sourceId || requestId)}/${Date.now()}.${extension}`;
    const buffer = Buffer.from(await response.arrayBuffer());
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.storage
      .from(RECIPE_SOURCE_VIDEO_BUCKET)
      .upload(path, buffer, {
        cacheControl: '3600',
        contentType: contentType || undefined,
        upsert: true,
      });

    if (error) {
      return {
        playbackUrl: null,
        storagePath: null,
        storageError: error.message || 'storage_upload_failed',
      };
    }

    const { data } = supabase.storage.from(RECIPE_SOURCE_VIDEO_BUCKET).getPublicUrl(path);

    if (!data.publicUrl) {
      return {
        playbackUrl: null,
        storagePath: path,
        storageError: 'storage_public_url_missing',
      };
    }

    return {
      playbackUrl: data.publicUrl,
      storagePath: path,
      storageError: null,
    };
  } catch (error) {
    return {
      playbackUrl: null,
      storagePath: null,
      storageError: error instanceof Error ? error.message : 'storage_upload_failed',
    };
  }
}

function extractMetaContent(html: string, metaName: string) {
  const escaped = metaName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const directMatch = html.match(new RegExp(`<meta\\s+(?:property|name)=["']${escaped}["']\\s+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+(?:property|name)=["']${escaped}["']`, 'i'));
  return directMatch?.[1] || null;
}

async function fetchPageMedia(url: string): Promise<PageMedia> {
  if (isDirectVideoUrl(url)) {
    return {
      imageUrl: null,
      videoUrl: url,
      source: 'direct_url',
      fallbackReason: null,
    };
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!res.ok) {
      return { imageUrl: null, videoUrl: null, source: 'none', fallbackReason: `page_media_http_${res.status}` };
    }

    const html = await res.text();
    const imageUrl = extractMetaContent(html, 'og:image') || extractMetaContent(html, 'twitter:image');
    const videoUrl = extractMetaContent(html, 'og:video:secure_url')
      || extractMetaContent(html, 'og:video')
      || extractMetaContent(html, 'twitter:player:stream');

    return {
      imageUrl,
      videoUrl,
      source: videoUrl ? 'page_meta' : 'none',
      fallbackReason: videoUrl ? null : 'page_meta_video_missing',
    };
  } catch (error) {
    console.warn('[분석][page-media] 페이지 메타 영상 정보를 가져오지 못했습니다.', error);
    return { imageUrl: null, videoUrl: null, source: 'none', fallbackReason: 'page_media_fetch_failed' };
  }
}

function generatePlaceholderThumbnail(sceneIndex: number, sceneTitle: string): string {
  const colors = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a18cd1', '#fbc2eb'],
  ];
  const [c1, c2] = colors[sceneIndex % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${c1}"/>
      <stop offset="100%" style="stop-color:${c2}"/>
    </linearGradient></defs>
    <rect width="320" height="180" fill="url(#g)"/>
    <text x="160" y="80" text-anchor="middle" fill="white" font-size="20" font-family="Arial" font-weight="bold">#${sceneIndex + 1}</text>
    <text x="160" y="110" text-anchor="middle" fill="white" font-size="14" font-family="Arial" opacity="0.9">${sceneTitle}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.max(0, Math.floor(seconds % 60));
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function timeStringToSeconds(time: string) {
  const [mins, secs] = time.split(':').map(Number);
  return mins * 60 + secs;
}

const defaultSceneDescriptions = [
  'Most people still don\'t know this... you NEED to hear this',
  'Hey everyone, today I\'m sharing a tip you absolutely need to know',
  'I was skeptical at first, but after trying it myself, it actually works',
  'Okay, here\'s the key part. Just follow this and you\'re set',
  'And that\'s it! Easier than you thought, right?',
  'If this helped, hit like and follow! More great tips coming soon!',
];

const defaultSceneScripts: Record<number, string[]> = {
  1: [
    'Most people still don\'t know this... you NEED to hear this',
    '(Look at the camera with confidence)',
    'Slightly surprised expression + spark curiosity',
  ],
  2: [
    'Hey everyone, today I\'m sharing a tip you absolutely need to know',
    '(Start with a natural greeting)',
    'Relaxed, friendly tone',
  ],
  3: [
    'I was skeptical at first, but after trying it myself, it actually works',
    '(Share your experience honestly)',
    'Relatable expression + nodding',
  ],
  4: [
    'Okay, here\'s the key part. Just follow this and you\'re set',
    '(Emphasize the main point clearly)',
    'Point with finger or gesture at screen',
  ],
  5: [
    'And that\'s it! Easier than you thought, right?',
    '(Wrap up with an upbeat tone)',
    'Satisfied expression, nod and smile',
  ],
  6: [
    'If this helped, hit like and follow!',
    'More great tips coming soon!',
    '(Wave and give a closing smile)',
  ],
};

function getDefaultDescription(index: number) {
  return defaultSceneDescriptions[index] || `Scene ${index + 1}`;
}

function getDefaultScript(sceneId: number, description: string) {
  return defaultSceneScripts[sceneId] || [description];
}

function extractJsonObject(text: string) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch?.[0] || null;
}

async function repairJsonObject(rawJson: string) {
  const repairedText = await generateReplicateGeminiFlashText({
    systemInstruction: 'You repair malformed JSON. Return valid JSON only with no markdown fences or commentary.',
    prompt: `Convert the following malformed JSON-like text into valid JSON without changing the meaning.\n\n${rawJson}`,
    maxOutputTokens: 2048,
    temperature: 0,
    topP: 1,
    thinkingBudget: 0,
  });

  const repairedJson = extractJsonObject(repairedText);
  return repairedJson ? JSON.parse(repairedJson) : null;
}

async function parseJsonWithRepair<T>(text: string) {
  const rawJson = extractJsonObject(text);
  if (!rawJson) {
    return null;
  }

  try {
    return JSON.parse(rawJson) as T;
  } catch (error) {
    console.warn('[분석][JSON] 1차 AI JSON 파싱이 실패해 보정 수리를 시도합니다.', error);
  }

  try {
    return await repairJsonObject(rawJson) as T | null;
  } catch (error) {
    console.error('[분석][JSON] AI JSON 보정 수리도 실패했습니다.', error);
    return null;
  }
}

async function parseAnalyzeInput(request: NextRequest): Promise<ParsedAnalyzeInput> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const brandContextPdf = formData.get('brandContextPdf');
    const url = String(formData.get('url') || '').trim();
    const niche = String(formData.get('niche') || '').trim();
    const goal = String(formData.get('goal') || '').trim();
    const description = String(formData.get('description') || '').trim();

    let brandBrief: BrandBrief | null = null;
    let brandContextFileName: string | null = null;

    if (brandContextPdf instanceof File && brandContextPdf.size > 0) {
      brandContextFileName = brandContextPdf.name || 'brand-context.pdf';

      const isPdf =
        brandContextPdf.type === 'application/pdf'
        || brandContextFileName.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        throw new Error('brand_context_pdf_must_be_pdf');
      }

      brandBrief = await extractBrandBriefFromPdf({
        fileName: brandContextFileName,
        fileBuffer: Buffer.from(await brandContextPdf.arrayBuffer()),
        niche,
        goal,
        notes: description,
      });
    }

    return {
      url,
      niche,
      goal,
      description,
      brandBrief,
      brandContextFileName,
    };
  }

  const payload = await request.json();
  return {
    url: String(payload.url || '').trim(),
    niche: String(payload.niche || '').trim(),
    goal: String(payload.goal || '').trim(),
    description: String(payload.description || '').trim(),
    brandBrief: null,
    brandContextFileName: null,
  };
}

function getTranscriptSummary(segments: TranscriptSegment[], limit: number = 14) {
  return segments
    .slice(0, limit)
    .map((segment) => `[${formatTime(segment.start)}-${formatTime(segment.end)}] ${segment.text}`)
    .join('\n');
}

function getTranscriptSnippet(segments: TranscriptSegment[], startTime: number, endTime: number) {
  const matched = segments.filter((segment) => segment.end >= startTime && segment.start <= endTime);
  return matched.map((segment) => segment.text).join(' ').trim();
}

function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const GEMINI_VIDEO_MAX_BYTES = 25 * 1024 * 1024;

async function createVideoDataUri(videoUrl: string) {
  const response = await fetch(videoUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`gemini_video_download_failed_${response.status}`);
  }

  const contentLength = Number(response.headers.get('content-length') || '0');
  if (contentLength > GEMINI_VIDEO_MAX_BYTES) {
    throw new Error('gemini_video_input_too_large');
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.byteLength > GEMINI_VIDEO_MAX_BYTES) {
    throw new Error('gemini_video_input_too_large');
  }

  const mimeType = (response.headers.get('content-type') || 'video/mp4').split(';')[0].trim() || 'video/mp4';
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

function parseTimeToSeconds(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(':').map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2 || parts.length > 3) {
    return null;
  }

  const numbers = parts.map((part) => Number(part));
  if (numbers.some((part) => !Number.isFinite(part) || part < 0)) {
    return null;
  }

  if (numbers.length === 2) {
    return numbers[0] * 60 + numbers[1];
  }

  return numbers[0] * 3600 + numbers[1] * 60 + numbers[2];
}

async function analyzeVideoMotionWithGemini(
  videoUrl: string,
  durationHint: number
): Promise<ExtendedVideoAnalysisResult> {
  try {
    const videoDataUri = await createVideoDataUri(videoUrl);

    const prompt = `Analyze this video scene by scene and return JSON only.

Use this exact schema:
{
  "scenes": [
    {
      "scene_number": 1,
      "start_time": "MM:SS",
      "end_time": "MM:SS",
      "motion_description": "..."
    }
  ]
}

motion_description rules:
- Describe only visible movement over time, not appearance, style, mood, or worldbuilding.
- Write 1 to 2 sentences, 25 to 45 words.
- Include exactly one main action.
- Include up to 2 secondary motions.
- Camera motion is optional but useful when clearly visible.
- Background motion is optional but useful when clearly visible.
- Include speed or intensity.
- Include a clear ending state.
- Translate each segment into a filmable one-shot movement.

Scene rules:
- Return 4 to 8 scenes.
- Cover the whole video in chronological order.
- Do not overlap scenes.
- Keep timestamps concise in MM:SS format.
- Return valid JSON only, no markdown fences or extra commentary.`;

    const response = await generateReplicateGeminiProText({
      systemInstruction:
        'You are a motion segmentation assistant. Describe only visible time-based changes in each scene. Return valid JSON only.',
      prompt,
      maxOutputTokens: 2048,
      temperature: 0.1,
      topP: 0.9,
      videos: [videoDataUri],
    });

    const parsed = await parseJsonWithRepair<{ scenes?: GeminiVideoScene[] }>(response);
    const rawScenes = Array.isArray(parsed?.scenes) ? parsed.scenes : [];

    const normalizedScenes = rawScenes
      .map((scene) => {
        const start = parseTimeToSeconds(String(scene.start_time || ''));
        const end = parseTimeToSeconds(String(scene.end_time || ''));
        const motionDescription = String(scene.motion_description || '').replace(/\s+/g, ' ').trim();

        if (start == null || end == null || end <= start || !motionDescription) {
          return null;
        }

        return {
          sceneNumber: Number(scene.scene_number) || 0,
          start,
          end,
          motionDescription,
        };
      })
      .filter((scene): scene is { sceneNumber: number; start: number; end: number; motionDescription: string } => Boolean(scene))
      .sort((left, right) => left.start - right.start);

    const dedupedScenes = normalizedScenes.filter((scene, index, array) => {
      if (index === 0) return true;
      return scene.start >= array[index - 1].end;
    });

    if (dedupedScenes.length < 4) {
      return {
        scenes: [],
        duration: durationHint,
        error: 'gemini_video_scene_count_too_low',
        fallbackReason: 'gemini_video_scene_count_too_low',
      };
    }

    const duration = Math.max(durationHint, dedupedScenes[dedupedScenes.length - 1]?.end || 0);

    return {
      scenes: dedupedScenes.map((scene) => ({
        timestamp: scene.start,
        thumbnailBase64: '',
      })),
      duration,
      method: 'gemini_video_motion',
      motionDescriptions: dedupedScenes.map((scene) => scene.motionDescription),
    };
  } catch (error) {
    return {
      scenes: [],
      duration: durationHint,
      error: error instanceof Error ? error.message : 'gemini_video_analysis_failed',
      fallbackReason: 'gemini_video_analysis_failed',
    };
  }
}

function buildTranscriptGuidedDetections(
  transcript: TranscriptSegment[],
  duration: number
): VideoAnalysisResult | null {
  if (transcript.length === 0) {
    return null;
  }

  const usableDuration = Math.max(
    duration,
    transcript[transcript.length - 1]?.end || transcript[transcript.length - 1]?.start || 0
  );
  const totalWords = transcript.reduce((sum, segment) => sum + Math.max(1, countWords(segment.text)), 0);
  const targetSceneCount = Math.min(
    6,
    Math.max(4, totalWords >= 180 ? 6 : totalWords >= 90 ? 5 : 4)
  );
  const wordsPerScene = Math.max(1, totalWords / targetSceneCount);

  const timestamps = [Math.max(0, transcript[0]?.start || 0)];
  let runningWords = 0;
  let targetIndex = 1;

  for (const segment of transcript) {
    runningWords += Math.max(1, countWords(segment.text));

    while (
      targetIndex < targetSceneCount &&
      runningWords >= wordsPerScene * targetIndex
    ) {
      const candidateTimestamp = Math.max(segment.start, timestamps[timestamps.length - 1] + 2);
      if (candidateTimestamp < usableDuration - 1) {
        timestamps.push(candidateTimestamp);
      }
      targetIndex += 1;
    }
  }

  if (timestamps.length < 4) {
    const targetRatios = [0.18, 0.38, 0.58, 0.78, 0.9];
    for (const ratio of targetRatios) {
      if (timestamps.length >= targetSceneCount) break;
      const candidateTimestamp = Number((usableDuration * ratio).toFixed(2));
      if (timestamps.every((timestamp) => Math.abs(timestamp - candidateTimestamp) >= 2)) {
        timestamps.push(candidateTimestamp);
      }
    }
  }

  const normalized = Array.from(new Set(timestamps.map((timestamp) => Math.max(0, Math.min(usableDuration, timestamp)))))
    .sort((left, right) => left - right)
    .slice(0, 6);

  if (normalized.length === 0) {
    return null;
  }

  return {
    scenes: normalized.map((timestamp) => ({
      timestamp,
      thumbnailBase64: '',
    })),
    duration: usableDuration,
    method: 'transcript_guided',
  };
}

async function confirmCandidatesWithAI(
  candidates: SceneCandidate[],
  transcript: TranscriptSegment[],
  duration: number
) {
  if (candidates.length === 0) {
    return null;
  }

  const prompt = `Select the best 4 to 6 scene boundaries from the candidate list for a short-form video recipe.

Rules:
- Always include candidate 1 because it is the opening frame.
- Prefer candidates that reflect meaningful visual changes, beat changes, or content pivots.
- Avoid redundant cuts that are too close together unless the change is clearly important.
- Return only JSON in the following shape:
{
  "selectedCandidateIds": [1, 2, 4, 6, 8]
}

Video duration: ${duration.toFixed(1)} seconds

Candidates:
${candidates
  .map((candidate, index) => {
    const snippet = getTranscriptSnippet(
      transcript,
      Math.max(0, candidate.timestamp - 2.5),
      Math.min(duration, candidate.timestamp + 2.5)
    );
    return [
      `Candidate ${index + 1}`,
      `time=${candidate.timestamp.toFixed(2)}s`,
      `diffScore=${candidate.diffScore.toFixed(2)}`,
      `transcript=${snippet || '(none)'}`,
    ].join(' | ');
  })
  .join('\n')}`;

  const runConfirmation = async (useImages: boolean) => {
    const response = await generateReplicateGeminiFlashText({
      systemInstruction: 'You are a video scene boundary selector. Return valid JSON only.',
      prompt,
      maxOutputTokens: 512,
      temperature: 0.1,
      topP: 0.9,
      thinkingBudget: 0,
      images: useImages ? candidates.map((candidate) => candidate.thumbnailBase64) : [],
    });
    return parseJsonWithRepair<{ selectedCandidateIds?: number[] }>(response);
  };

  let parsed = null;
  try {
    parsed = await runConfirmation(true);
  } catch (error) {
    console.warn('[분석][컷 확인] 이미지 포함 AI 확인이 실패해 텍스트 전용으로 다시 시도합니다.', error);
  }

  if (!parsed) {
    try {
      parsed = await runConfirmation(false);
    } catch (error) {
      console.warn('[분석][컷 확인] 텍스트 전용 AI 확인도 실패했습니다.', error);
    }
  }

  const selectedIds = Array.from(
    new Set(
      (parsed?.selectedCandidateIds || [])
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= candidates.length)
    )
  ).sort((left, right) => left - right);

  if (!selectedIds.includes(1)) {
    selectedIds.unshift(1);
  }

  const trimmedIds = selectedIds.slice(0, 6);
  if (trimmedIds.length < 4) {
    return null;
  }

  return trimmedIds
    .map((candidateId) => candidates[candidateId - 1])
    .filter(Boolean)
    .map((candidate) => ({
      timestamp: candidate.timestamp,
      thumbnailBase64: candidate.thumbnailBase64,
    }));
}

async function generateScenePlansWithAI({
  scenes,
  transcript,
  niche,
  goal,
  description,
  sourceTitle,
  brandBrief,
}: {
  scenes: Array<{
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    transcriptOriginal: string[];
    transcriptSnippet: string;
    motionDescription: string;
  }>;
  transcript: TranscriptSegment[];
  niche: string;
  goal: string;
  description: string;
  sourceTitle: string | null;
  brandBrief: BrandBrief | null;
}): Promise<ScenePlanGenerationResult | null> {
  try {
    const prompt = `Design ${scenes.length} short-form creator recipe scenes from a reference video.

Creator context:
- niche: ${niche || '(not provided)'}
- goal: ${goal || '(not provided)'}
- notes: ${description || '(not provided)'}
- source title: ${sourceTitle || '(not provided)'}

Brand brief:
${brandBrief ? JSON.stringify(brandBrief, null, 2) : '(none)'}

Transcript summary:
${getTranscriptSummary(transcript) || '(no transcript available)'}

Reference scenes:
${scenes
  .map(
    (scene) =>
      `${scene.id}. ${scene.title} (${scene.startTime}-${scene.endTime}) | transcript original: ${scene.transcriptOriginal.join(' / ') || '(none)'} | transcript snippet: ${scene.transcriptSnippet || '(none)'} | motion description: ${scene.motionDescription || '(none)'}`
  )
  .join('\n')}

Return valid JSON only in this exact shape:
{
  "scenes": [
    {
      "scene_id": 1,
      "why_it_works": ["", ""],
      "objective": "",
      "appeal_point": "",
      "key_line": "",
      "script_lines": ["", "", ""],
      "key_mood": "",
      "key_action": "",
      "must_include": [""],
      "must_avoid": [""],
      "cta": "",
      "prompter_blocks": [
        {
          "type": "key_line",
          "label": "Main Script",
          "content": "",
          "visible": true,
          "size": "xl",
          "scale": 1,
          "positionPreset": "lowerThird",
          "order": 1
        }
      ]
    }
  ]
}

Requirements:
- Return exactly ${scenes.length} scenes in order.
- why_it_works should explain why the reference performs well in 1 to 3 short bullets.
- appeal_point is the cut goal. It should describe the persuasion job or scene role, not repeat the spoken script.
- script_lines must be 2 to 4 short lines that a creator can actually say or act on.
- key_line should be the single most important line for this cut.
- key_mood should be a short performance cue.
- key_action should describe the main behavior or filming beat for the cut.
- must_include and must_avoid must reflect the brand brief when available.
- prompter_blocks should prioritize key_line, short keyword-style cues, warnings, and CTA.
- prompter block content should stay compact enough to be used as an on-camera cue.
- Do not include reference_signals. That field is legacy compatibility only and will be ignored.
- Keep outputs concrete and creator-friendly, not abstract marketing language.`;

    const text = await generateReplicateGeminiFlashText({
      systemInstruction:
        'You are a creator recipe designer for ParrotKit. Return valid JSON only with no markdown fences or extra commentary.',
      prompt,
      maxOutputTokens: 4096,
      temperature: 0.35,
      topP: 0.95,
      thinkingBudget: 0,
    });

    const parsed = await parseJsonWithRepair<ScenePlanGenerationResult>(text);

    if (!parsed || !Array.isArray(parsed.scenes) || parsed.scenes.length !== scenes.length) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('[분석][컷 설계] AI 컷 설계 생성에 실패했습니다.', error);
    return null;
  }
}

function buildSceneStructure({
  detections,
  duration,
  pageMedia,
  platform,
  videoId,
  transcript,
}: {
  detections: ExtendedVideoAnalysisResult | null;
  duration: number;
  pageMedia: PageMedia;
  platform: Platform;
  videoId: string | null;
  transcript: TranscriptSegment[];
}) {
  const sceneNames = ['Hook', 'Introduction', 'Build Up', 'Peak', 'Resolution', 'Outro'];
  const scenes: Array<{
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    thumbnail: string;
    transcriptOriginal: string[];
    transcriptSnippet: string;
    motionDescription: string;
  }> = [];

  if (detections && detections.scenes.length > 0) {
    for (let index = 0; index < detections.scenes.length; index += 1) {
      const scene = detections.scenes[index];
      const nextScene = detections.scenes[index + 1];
      const startSeconds = scene.timestamp;
      const endSeconds = nextScene ? nextScene.timestamp : duration;
      let thumbnail = scene.thumbnailBase64;

      if (!thumbnail) {
        thumbnail = pageMedia.imageUrl || generatePlaceholderThumbnail(index, sceneNames[index] || `Scene ${index + 1}`);
      }

      scenes.push({
        id: index + 1,
        title: sceneNames[index] || `Scene ${index + 1}`,
        startTime: formatTime(startSeconds),
        endTime: formatTime(endSeconds),
        thumbnail,
        transcriptOriginal: transcript
          .filter((segment) => segment.end >= startSeconds && segment.start <= endSeconds)
          .map((segment) => segment.text)
          .filter(Boolean),
        transcriptSnippet: getTranscriptSnippet(transcript, startSeconds, endSeconds),
        motionDescription: detections.motionDescriptions?.[index] || '',
      });
    }

    return scenes;
  }

  const fallbackDuration = duration || 30;
  const sceneCount = 6;
  const sceneDuration = fallbackDuration / sceneCount;

  for (let index = 0; index < sceneCount; index += 1) {
    const startSeconds = index * sceneDuration;
    const endSeconds = Math.min(fallbackDuration, (index + 1) * sceneDuration);
    let thumbnail = pageMedia.imageUrl || generatePlaceholderThumbnail(index, sceneNames[index] || `Scene ${index + 1}`);

    if (!pageMedia.imageUrl && (platform === 'youtube' || platform === 'youtube-shorts')) {
      const thumbIndexes = [0, 1, 2, 3, 1, 2];
      thumbnail = `https://img.youtube.com/vi/${videoId || 'dQw4w9WgXcQ'}/${thumbIndexes[index % thumbIndexes.length]}.jpg`;
    }

    scenes.push({
      id: index + 1,
      title: sceneNames[index] || `Scene ${index + 1}`,
      startTime: formatTime(startSeconds),
      endTime: formatTime(endSeconds),
      thumbnail,
      transcriptOriginal: transcript
        .filter((segment) => segment.end >= startSeconds && segment.start <= endSeconds)
        .map((segment) => segment.text)
        .filter(Boolean),
      transcriptSnippet: getTranscriptSnippet(transcript, startSeconds, endSeconds),
      motionDescription: '',
    });
  }

  return scenes;
}

export async function POST(request: NextRequest) {
  const requestId = createAnalyzeRequestId();
  let requestUrlForLog: string | null = null;
  let requestPlatformForLog: Platform | null = null;

  try {
    const {
      url,
      niche = '',
      goal = '',
      description = '',
      brandBrief,
      brandContextFileName,
    } = await parseAnalyzeInput(request);

    if (!url) {
      logAnalyze('warn', requestId, '요청 본문에 URL이 없습니다.');
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    const videoId = extractVideoId(url);
    requestUrlForLog = sanitizeUrlForLog(url);
    requestPlatformForLog = platform;

    logAnalyze('info', requestId, '분석 요청을 시작합니다.', {
      platform,
      videoId: videoId || extractInstagramId(url) || extractTikTokId(url) || 'unknown',
      url: requestUrlForLog,
      hasNiche: Boolean(niche.trim()),
      hasGoal: Boolean(goal.trim()),
      hasDescription: Boolean(description.trim()),
      hasBrandBrief: Boolean(brandBrief),
      brandContextFileName: brandContextFileName || null,
    });

    const [rapidMedia, pageMedia, transcriptResult] = await Promise.all([
      fetchSocialVideoDownload(url),
      fetchPageMedia(url),
      fetchSupadataTranscript(url),
    ]);

    logAnalyze('info', requestId, '외부 소스 조회를 마쳤습니다.', {
      rapidMediaSource: rapidMedia.source,
      rapidMediaFallbackReason: rapidMedia.fallbackReason,
      rapidMediaVariantCount: rapidMedia.variants.length,
      pageMediaSource: pageMedia.source,
      pageMediaFallbackReason: pageMedia.fallbackReason,
      transcriptSource: transcriptResult.transcriptSource,
      transcriptFallbackReason: transcriptResult.fallbackReason,
      transcriptSegmentCount: transcriptResult.transcript.length,
    });

    const resolvedMedia: PageMedia = {
      imageUrl: rapidMedia.thumbnailUrl || pageMedia.imageUrl,
      videoUrl: rapidMedia.videoUrl || pageMedia.videoUrl,
      source: rapidMedia.videoUrl ? rapidMedia.source : pageMedia.source,
      fallbackReason: rapidMedia.videoUrl ? null : rapidMedia.fallbackReason || pageMedia.fallbackReason,
    };
    const canonicalSourceId =
      videoId
      || extractInstagramId(url)
      || extractTikTokId(url)
      || transcriptResult.sourceMetadata?.id
      || null;
    let playbackVideoUrl = resolvedMedia.videoUrl;
    let playbackStoragePath: string | null = null;
    let playbackStorageError: string | null = null;

    if (resolvedMedia.videoUrl) {
      const storedPlaybackVideo = await uploadPlaybackVideoToStorage({
        sourceVideoUrl: resolvedMedia.videoUrl,
        platform,
        sourceId: canonicalSourceId,
        requestId,
      });

      playbackVideoUrl = storedPlaybackVideo.playbackUrl || resolvedMedia.videoUrl;
      playbackStoragePath = storedPlaybackVideo.storagePath;
      playbackStorageError = storedPlaybackVideo.storageError;

      logAnalyze(storedPlaybackVideo.playbackUrl ? 'info' : 'warn', requestId, '직접 재생용 비디오 URL을 정리했습니다.', {
        originalMediaSource: resolvedMedia.source,
        playbackSource: storedPlaybackVideo.playbackUrl ? 'supabase_storage' : resolvedMedia.source,
        storageBucket: storedPlaybackVideo.playbackUrl ? RECIPE_SOURCE_VIDEO_BUCKET : null,
        storagePath: storedPlaybackVideo.storagePath,
        storageError: storedPlaybackVideo.storageError,
      });
    }

    let analysisResult: ExtendedVideoAnalysisResult | null = null;
    let sceneDetectionFallbackReason: string | null = null;

    if (resolvedMedia.videoUrl) {
      logAnalyze('info', requestId, '직접 비디오 URL을 확보해 Gemini 비디오 분석을 시도합니다.', {
        mediaSource: resolvedMedia.source,
      });

      const geminiVideoAnalysis = await analyzeVideoMotionWithGemini(
        resolvedMedia.videoUrl,
        transcriptResult.sourceMetadata?.durationSeconds || 0
      );

      if (!geminiVideoAnalysis.error && geminiVideoAnalysis.scenes.length > 0) {
        analysisResult = geminiVideoAnalysis;
        logAnalyze('info', requestId, 'Gemini 비디오 분석에 성공했습니다.', {
          sceneCount: geminiVideoAnalysis.scenes.length,
          durationSeconds: geminiVideoAnalysis.duration,
          method: geminiVideoAnalysis.method || 'gemini_video_motion',
        });
      } else {
        sceneDetectionFallbackReason = geminiVideoAnalysis.fallbackReason || geminiVideoAnalysis.error || 'gemini_video_analysis_failed';
        logAnalyze('warn', requestId, 'Gemini 비디오 분석이 실패해 다음 단계로 넘어갑니다.', {
          reason: sceneDetectionFallbackReason,
        });
      }
    }

    if (!analysisResult && resolvedMedia.videoUrl) {
      logAnalyze('info', requestId, '프레임 차이 기반 후보 추출을 시도합니다.', {
        mediaSource: resolvedMedia.source,
      });

      const candidateAnalysis = await analyzeVideoFrameCandidates(resolvedMedia.videoUrl);
      if (candidateAnalysis.error) {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || candidateAnalysis.fallbackReason || candidateAnalysis.error;
        logAnalyze('warn', requestId, '프레임 차이 기반 분석이 실패했습니다.', {
          reason: sceneDetectionFallbackReason,
        });
      } else if (candidateAnalysis.candidates.length > 0) {
        logAnalyze('info', requestId, '프레임 후보를 추출했습니다. AI 컷 확인을 진행합니다.', {
          candidateCount: candidateAnalysis.candidates.length,
          rawSceneCount: candidateAnalysis.scenes.length,
          durationSeconds: candidateAnalysis.duration,
        });

        const aiConfirmedScenes = await confirmCandidatesWithAI(
          candidateAnalysis.candidates,
          transcriptResult.transcript,
          candidateAnalysis.duration
        );

        if (aiConfirmedScenes && aiConfirmedScenes.length > 0) {
          analysisResult = {
            scenes: aiConfirmedScenes,
            duration: candidateAnalysis.duration,
            method: 'frame_diff_ai_confirmed',
          };
          logAnalyze('info', requestId, '프레임 후보 AI 확인이 성공했습니다.', {
            sceneCount: aiConfirmedScenes.length,
            durationSeconds: candidateAnalysis.duration,
          });
        } else if (candidateAnalysis.scenes.length > 0) {
          analysisResult = {
            scenes: candidateAnalysis.scenes,
            duration: candidateAnalysis.duration,
            method: 'frame_diff_ai_confirmed',
            fallbackReason: 'ai_cut_confirmation_failed_used_raw_candidates',
          };
          sceneDetectionFallbackReason = sceneDetectionFallbackReason || 'ai_cut_confirmation_failed_used_raw_candidates';
          logAnalyze('warn', requestId, 'AI 컷 확인에 실패해 원본 후보 장면을 그대로 사용합니다.', {
            sceneCount: candidateAnalysis.scenes.length,
            reason: sceneDetectionFallbackReason,
          });
        } else {
          sceneDetectionFallbackReason = sceneDetectionFallbackReason || candidateAnalysis.fallbackReason || 'frame_diff_candidates_empty';
          logAnalyze('warn', requestId, '프레임 차이 분석에서 사용할 장면 후보를 만들지 못했습니다.', {
            reason: sceneDetectionFallbackReason,
          });
        }
      } else {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || candidateAnalysis.fallbackReason || 'frame_diff_candidates_empty';
        logAnalyze('warn', requestId, '프레임 차이 분석 결과 후보가 비어 있습니다.', {
          reason: sceneDetectionFallbackReason,
          rawSceneCount: candidateAnalysis.scenes.length,
        });
      }
    }

    if (!analysisResult && (platform === 'youtube' || platform === 'youtube-shorts')) {
      logAnalyze('warn', requestId, '직접 비디오 분석이 성립하지 않아 YouTube 전용 fallback으로 전환합니다.', {
        reason: sceneDetectionFallbackReason || resolvedMedia.fallbackReason || 'unknown',
      });
      const youtubeAnalysis = await analyzeYouTubeVideo(url);
      if (youtubeAnalysis.error) {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || youtubeAnalysis.fallbackReason || youtubeAnalysis.error;
        logAnalyze('error', requestId, 'YouTube 전용 fallback도 실패했습니다.', {
          reason: sceneDetectionFallbackReason,
        });
      } else {
        analysisResult = youtubeAnalysis;
        logAnalyze('info', requestId, 'YouTube 전용 fallback이 성공했습니다.', {
          sceneCount: youtubeAnalysis.scenes.length,
          durationSeconds: youtubeAnalysis.duration,
          method: youtubeAnalysis.method || 'ffmpeg_video_download',
        });
      }
    }

    if (!analysisResult && !resolvedMedia.videoUrl && sceneDetectionFallbackReason === null) {
      sceneDetectionFallbackReason = resolvedMedia.fallbackReason || 'direct_video_url_not_available';
      logAnalyze('warn', requestId, '직접 사용할 비디오 URL을 확보하지 못했습니다.', {
        reason: sceneDetectionFallbackReason,
        mediaSource: resolvedMedia.source,
      });
    }

    if (!analysisResult && transcriptResult.transcript.length > 0) {
      logAnalyze('warn', requestId, '영상 기반 장면 감지가 실패해 대본 기반 분할을 사용합니다.', {
        transcriptSource: transcriptResult.transcriptSource,
        transcriptSegmentCount: transcriptResult.transcript.length,
        reason: sceneDetectionFallbackReason || 'video_detection_unavailable_used_transcript',
      });

      analysisResult = buildTranscriptGuidedDetections(
        transcriptResult.transcript,
        transcriptResult.sourceMetadata?.durationSeconds || 0
      );
      if (analysisResult) {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || 'video_detection_unavailable_used_transcript';
      }
    }

    const detectedDuration = analysisResult?.duration
      || transcriptResult.sourceMetadata?.durationSeconds
      || 30;

    const provisionalScenes = buildSceneStructure({
      detections: analysisResult,
      duration: detectedDuration,
      pageMedia: {
        imageUrl: transcriptResult.sourceMetadata?.thumbnailUrl || resolvedMedia.imageUrl,
        videoUrl: playbackVideoUrl || resolvedMedia.videoUrl,
        source: resolvedMedia.source,
        fallbackReason: resolvedMedia.fallbackReason,
      },
      platform,
      videoId,
      transcript: transcriptResult.transcript,
    });

    let scenesForPlanning = provisionalScenes;

    if (playbackVideoUrl && isDirectVideoUrl(playbackVideoUrl)) {
      const thumbnailTimestamps = provisionalScenes.map((scene) => timeStringToSeconds(scene.startTime));
      const sceneStartThumbnails = await extractVideoThumbnailsAtTimestamps(playbackVideoUrl, thumbnailTimestamps);

      if (sceneStartThumbnails.size > 0) {
        scenesForPlanning = provisionalScenes.map((scene) => {
          const sceneStartSeconds = timeStringToSeconds(scene.startTime);
          return {
            ...scene,
            thumbnail: sceneStartThumbnails.get(sceneStartSeconds) || scene.thumbnail,
          };
        });
      }
    }

    const aiResult = await generateScenePlansWithAI({
      scenes: scenesForPlanning,
      transcript: transcriptResult.transcript,
      niche,
      goal,
      description,
      sourceTitle: transcriptResult.sourceMetadata?.title || rapidMedia.title || null,
      brandBrief,
    });

    const scriptSource = aiResult ? 'scene_designer_ai_generated' : 'default';

    const scenes = scenesForPlanning.map((scene, index) => {
      const generatedScene = aiResult?.scenes.find((item) => Number(item.scene_id) === scene.id);

      return normalizeRecipeScene({
        id: scene.id,
        title: scene.title,
        startTime: scene.startTime,
        endTime: scene.endTime,
        thumbnail: scene.thumbnail,
        analysis: {
          transcriptOriginal: scene.transcriptOriginal,
          transcriptSnippet: scene.transcriptSnippet || null,
          motionDescription: scene.motionDescription,
          whyItWorks: generatedScene?.why_it_works || [],
          referenceSignals: generatedScene?.reference_signals || [],
        },
        recipe: {
          objective: generatedScene?.objective || '',
          appealPoint: generatedScene?.appeal_point || scene.motionDescription || getDefaultDescription(index),
          keyLine: generatedScene?.key_line || getDefaultScript(scene.id, scene.motionDescription || getDefaultDescription(index))[0],
          scriptLines: generatedScene?.script_lines || getDefaultScript(scene.id, scene.motionDescription || getDefaultDescription(index)),
          keyMood: generatedScene?.key_mood || '',
          keyAction: generatedScene?.key_action || scene.motionDescription,
          mustInclude: generatedScene?.must_include || [],
          mustAvoid: generatedScene?.must_avoid || [],
          cta: generatedScene?.cta || '',
        },
        prompter: {
          blocks: generatedScene?.prompter_blocks || [],
        },
        progress: 0,
        description: scene.motionDescription || generatedScene?.appeal_point || getDefaultDescription(index),
        script: generatedScene?.script_lines || getDefaultScript(scene.id, scene.motionDescription || getDefaultDescription(index)),
        transcriptSnippet: scene.transcriptSnippet || null,
      }, index, brandBrief);
    });

    const platformLabels: Record<Platform, string> = {
      youtube: 'YouTube',
      'youtube-shorts': 'YouTube Shorts',
      instagram: 'Instagram Reels',
      tiktok: 'TikTok',
      other: 'Video',
    };
    const sourceMetadata = {
      ...(transcriptResult.sourceMetadata && typeof transcriptResult.sourceMetadata === 'object'
        ? transcriptResult.sourceMetadata
        : {}),
      originalSourceUrl: url,
      resolvedVideoUrl: resolvedMedia.videoUrl,
      playbackVideoUrl: playbackVideoUrl || resolvedMedia.videoUrl || null,
      storageBucket: playbackStoragePath ? RECIPE_SOURCE_VIDEO_BUCKET : null,
      storagePath: playbackStoragePath,
      storageUploadError: playbackStorageError,
    };

    const responseMetadata = {
      title: transcriptResult.sourceMetadata?.title || `${platformLabels[platform]} Video`,
      duration: formatTime(detectedDuration),
      durationSeconds: detectedDuration,
      platform: transcriptResult.sourceMetadata?.platform || platformLabels[platform],
      analyzedWithFFmpeg: analysisResult?.method === 'ffmpeg_video_download',
      mediaSource: resolvedMedia.source,
      mediaFallbackReason: resolvedMedia.fallbackReason,
      sceneDetectionMethod: analysisResult?.method || 'fixed_5s_fallback',
      sceneDetectionFallbackReason:
        sceneDetectionFallbackReason
        || analysisResult?.fallbackReason
        || (analysisResult ? null : platform === 'youtube' || platform === 'youtube-shorts'
          ? 'youtube_scene_detection_not_available'
          : 'no_platform_scene_detector'),
      transcriptSource: transcriptResult.transcriptSource as TranscriptSource,
      transcriptLanguage: transcriptResult.language,
      transcriptSegmentCount: transcriptResult.transcript.length,
      transcriptFallbackReason: transcriptResult.fallbackReason,
      scriptSource,
      brandContextFileName,
      brandBriefStatus: brandBrief?.extractionStatus || 'none',
      sourceMetadata,
    };

    logAnalyze('info', requestId, '분석 응답을 반환합니다.', {
      mediaSource: responseMetadata.mediaSource,
      mediaFallbackReason: responseMetadata.mediaFallbackReason,
      sceneDetectionMethod: responseMetadata.sceneDetectionMethod,
      sceneDetectionFallbackReason: responseMetadata.sceneDetectionFallbackReason,
      transcriptSource: responseMetadata.transcriptSource,
      transcriptFallbackReason: responseMetadata.transcriptFallbackReason,
      sceneCount: scenes.length,
      durationSeconds: responseMetadata.durationSeconds,
    });

    return NextResponse.json({
      success: true,
      videoId: videoId || extractInstagramId(url) || extractTikTokId(url) || transcriptResult.sourceMetadata?.id || 'unknown',
      url,
      videoUrl: playbackVideoUrl || resolvedMedia.videoUrl || url,
      scenes,
      transcript: transcriptResult.transcript,
      brandBrief,
      metadata: responseMetadata,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze video';

    if (message === 'brand_context_pdf_must_be_pdf') {
      logAnalyze('warn', requestId, '브랜드 컨텍스트 PDF 형식이 올바르지 않습니다.', {
        url: requestUrlForLog,
        platform: requestPlatformForLog,
      });
      return NextResponse.json(
        { error: '브랜드 컨텍스트 파일은 PDF만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    logAnalyze('error', requestId, '분석 요청이 예외로 종료되었습니다.', {
      url: requestUrlForLog,
      platform: requestPlatformForLog,
      error: message,
    });
    console.error('[분석] 처리 중 예외가 발생했습니다.', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
