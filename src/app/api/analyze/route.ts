import { NextRequest, NextResponse } from 'next/server';
import { analyzeVideoFrameCandidates, analyzeYouTubeVideo, type SceneCandidate, type VideoAnalysisResult } from '@/lib/video-analyzer';
import { generateReplicateGeminiFlashText, generateReplicateGeminiProText } from '@/lib/replicate';
import { fetchSupadataTranscript, type TranscriptSegment, type TranscriptSource } from '@/lib/supadata';
import { fetchSocialVideoDownload, type DownloadSource } from '@/lib/social-video-downloader';

type Platform = 'youtube' | 'youtube-shorts' | 'instagram' | 'tiktok' | 'other';

type SceneScriptMap = { [key: number]: string[] };

type ScriptGenerationResult = {
  descriptions: string[];
  scripts: SceneScriptMap;
};

type PageMedia = {
  imageUrl: string | null;
  videoUrl: string | null;
  source: DownloadSource | 'page_meta' | 'direct_url' | 'none';
  fallbackReason: string | null;
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
    console.warn('Failed to fetch page media:', error);
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

const defaultSceneDescriptions = [
  'Most people still don\'t know this... you NEED to hear this',
  'Hey everyone, today I\'m sharing a tip you absolutely need to know',
  'I was skeptical at first, but after trying it myself, it actually works',
  'Okay, here\'s the key part. Just follow this and you\'re set',
  'And that\'s it! Easier than you thought, right?',
  'If this helped, hit like and follow! More great tips coming soon!',
];

const defaultSceneScripts: SceneScriptMap = {
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
    console.warn('Primary AI JSON parse failed, attempting repair:', error);
  }

  try {
    return await repairJsonObject(rawJson) as T | null;
  } catch (error) {
    console.error('AI JSON repair failed:', error);
    return null;
  }
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
    console.warn('AI cut confirmation with images failed, retrying text-only:', error);
  }

  if (!parsed) {
    try {
      parsed = await runConfirmation(false);
    } catch (error) {
      console.warn('AI cut confirmation text-only retry failed:', error);
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

async function generateScriptsWithAI({
  scenes,
  transcript,
  niche,
  goal,
  description,
  sourceTitle,
}: {
  scenes: Array<{ id: number; title: string; startTime: string; endTime: string; transcriptSnippet: string; motionDescription: string }>;
  transcript: TranscriptSegment[];
  niche: string;
  goal: string;
  description: string;
  sourceTitle: string | null;
}): Promise<ScriptGenerationResult | null> {
  try {
    const prompt = `Write scripts for ${scenes.length} scenes of a short-form video recipe.

User info:
- Niche: ${niche || '(not provided)'}
- Goal: ${goal || '(not provided)'}
- Description: ${description || '(not provided)'}
- Source title: ${sourceTitle || '(not provided)'}

Transcript summary:
${getTranscriptSummary(transcript) || '(no transcript available)'}

Scene windows:
${scenes
  .map(
    (scene) =>
      `${scene.id}. ${scene.title} (${scene.startTime}-${scene.endTime}) | transcript snippet: ${scene.transcriptSnippet || '(none)'} | motion description: ${scene.motionDescription || '(none)'}`
  )
  .join('\n')}

Respond ONLY in valid JSON:
{
  "descriptions": ["scene1 one-line summary", "..."],
  "scripts": {
    "1": ["dialogue line", "acting direction", "expression/gesture"]
  }
}

Requirements:
- Keep the response aligned with the transcript when transcript exists.
- Each script entry must have exactly 3 lines.
- Dialogue should be natural, conversational English.
- Acting direction must be in parentheses.
- The descriptions array length must equal ${scenes.length}.`;

    const text = await generateReplicateGeminiFlashText({
      systemInstruction:
        'You are a short-form video script writer for UGC creators. Return valid JSON only with no markdown fences or extra commentary.',
      prompt,
      maxOutputTokens: 2048,
      temperature: 0.4,
      topP: 0.95,
      thinkingBudget: 0,
    });

    const parsed = await parseJsonWithRepair<{
      descriptions?: string[];
      scripts?: Record<string, string[]>;
    }>(text);

    if (!parsed || !Array.isArray(parsed.descriptions) || !parsed.scripts) {
      return null;
    }

    return {
      descriptions: parsed.descriptions,
      scripts: Object.fromEntries(
        Object.entries(parsed.scripts).map(([key, value]) => [parseInt(key, 10), Array.isArray(value) ? value.map(String) : []])
      ) as SceneScriptMap,
    };
  } catch (error) {
    console.error('AI script generation failed:', error);
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
      transcriptSnippet: getTranscriptSnippet(transcript, startSeconds, endSeconds),
      motionDescription: '',
    });
  }

  return scenes;
}

export async function POST(request: NextRequest) {
  try {
    const { url, niche = '', goal = '', description = '' } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const platform = detectPlatform(url);
    const videoId = extractVideoId(url);

    const [rapidMedia, pageMedia, transcriptResult] = await Promise.all([
      fetchSocialVideoDownload(url),
      fetchPageMedia(url),
      fetchSupadataTranscript(url),
    ]);

    const resolvedMedia: PageMedia = {
      imageUrl: rapidMedia.thumbnailUrl || pageMedia.imageUrl,
      videoUrl: rapidMedia.videoUrl || pageMedia.videoUrl,
      source: rapidMedia.videoUrl ? rapidMedia.source : pageMedia.source,
      fallbackReason: rapidMedia.videoUrl ? null : rapidMedia.fallbackReason || pageMedia.fallbackReason,
    };

    let analysisResult: ExtendedVideoAnalysisResult | null = null;
    let sceneDetectionFallbackReason: string | null = null;

    if (resolvedMedia.videoUrl) {
      const geminiVideoAnalysis = await analyzeVideoMotionWithGemini(
        resolvedMedia.videoUrl,
        transcriptResult.sourceMetadata?.durationSeconds || 0
      );

      if (!geminiVideoAnalysis.error && geminiVideoAnalysis.scenes.length > 0) {
        analysisResult = geminiVideoAnalysis;
      } else {
        sceneDetectionFallbackReason = geminiVideoAnalysis.fallbackReason || geminiVideoAnalysis.error || 'gemini_video_analysis_failed';
      }
    }

    if (!analysisResult && resolvedMedia.videoUrl) {
      const candidateAnalysis = await analyzeVideoFrameCandidates(resolvedMedia.videoUrl);
      if (candidateAnalysis.error) {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || candidateAnalysis.fallbackReason || candidateAnalysis.error;
      } else if (candidateAnalysis.candidates.length > 0) {
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
        } else if (candidateAnalysis.scenes.length > 0) {
          analysisResult = {
            scenes: candidateAnalysis.scenes,
            duration: candidateAnalysis.duration,
            method: 'frame_diff_ai_confirmed',
            fallbackReason: 'ai_cut_confirmation_failed_used_raw_candidates',
          };
          sceneDetectionFallbackReason = sceneDetectionFallbackReason || 'ai_cut_confirmation_failed_used_raw_candidates';
        } else {
          sceneDetectionFallbackReason = sceneDetectionFallbackReason || candidateAnalysis.fallbackReason || 'frame_diff_candidates_empty';
        }
      }
    }

    if (!analysisResult && (platform === 'youtube' || platform === 'youtube-shorts')) {
      console.log('Using YouTube scene detection pipeline...');
      const youtubeAnalysis = await analyzeYouTubeVideo(url);
      if (youtubeAnalysis.error) {
        sceneDetectionFallbackReason = sceneDetectionFallbackReason || youtubeAnalysis.fallbackReason || youtubeAnalysis.error;
      } else {
        analysisResult = youtubeAnalysis;
      }
    }

    if (!analysisResult && !resolvedMedia.videoUrl && sceneDetectionFallbackReason === null) {
      sceneDetectionFallbackReason = resolvedMedia.fallbackReason || 'direct_video_url_not_available';
    }

    if (!analysisResult && transcriptResult.transcript.length > 0) {
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
        videoUrl: resolvedMedia.videoUrl,
        source: resolvedMedia.source,
        fallbackReason: resolvedMedia.fallbackReason,
      },
      platform,
      videoId,
      transcript: transcriptResult.transcript,
    });

    const aiResult = await generateScriptsWithAI({
      scenes: provisionalScenes,
      transcript: transcriptResult.transcript,
      niche,
      goal,
      description,
      sourceTitle: transcriptResult.sourceMetadata?.title || rapidMedia.title || null,
    });

    const scriptSource = aiResult ? 'ai_generated' : 'default';

    const scenes = provisionalScenes.map((scene, index) => ({
      id: scene.id,
      title: scene.title,
      startTime: scene.startTime,
      endTime: scene.endTime,
      thumbnail: scene.thumbnail,
      description: scene.motionDescription || aiResult?.descriptions?.[index] || getDefaultDescription(index),
      script: aiResult?.scripts?.[scene.id] || getDefaultScript(scene.id, scene.motionDescription || aiResult?.descriptions?.[index] || getDefaultDescription(index)),
      progress: 0,
      transcriptSnippet: scene.transcriptSnippet || null,
    }));

    const platformLabels: Record<Platform, string> = {
      youtube: 'YouTube',
      'youtube-shorts': 'YouTube Shorts',
      instagram: 'Instagram Reels',
      tiktok: 'TikTok',
      other: 'Video',
    };

    return NextResponse.json({
      success: true,
      videoId: videoId || extractInstagramId(url) || extractTikTokId(url) || transcriptResult.sourceMetadata?.id || 'unknown',
      url,
      scenes,
      transcript: transcriptResult.transcript,
      metadata: {
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
        sourceMetadata: transcriptResult.sourceMetadata,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze video';
    console.error('Analyze error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
