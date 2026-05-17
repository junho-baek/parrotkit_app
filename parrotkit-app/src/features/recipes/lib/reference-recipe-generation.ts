import type { MockRecipeScene } from '@/core/mocks/parrotkit-data';
import type { RecipeCreateGoalId, RecipeCreateNicheId } from '@/features/recipes/lib/recipe-create-flow';

export type GeneratedReferenceSceneType = 'hook' | 'proof' | 'demonstration' | 'cta';

export type GeneratedReferenceScene = {
  index: number;
  type: GeneratedReferenceSceneType;
  title: string;
  durationSec: number;
  intent: string;
  lineToSay: string;
  shootingGuideline: string;
  requiredChecklist: string[];
  teleprompterLine: string;
};

export type GeneratedReferenceRecipe = {
  title: string;
  oneLineDescription: string;
  totalDurationSec: number;
  scenes: GeneratedReferenceScene[];
};

export type ReferenceRecipeGenerationResult = {
  recipe: GeneratedReferenceRecipe;
  reference: {
    platform: 'instagram-reels' | 'short-form' | 'tiktok' | 'unknown' | 'youtube-shorts';
    thumbnailUrl: string;
    title: string;
    transcriptLanguage?: string | null;
    transcriptPreview?: string;
    transcriptSource?: string;
    url: string;
    videoId: string;
  };
  generation: {
    fallbackReason?: string | null;
    fallbackUsed: boolean;
    generatedAt: string;
    model?: string | null;
    status: 'fallback' | 'generated';
  };
};

export type ReferenceAnalysisAPIStatus = 'failed' | 'fallback' | 'partial_ready' | 'ready';

export type ReferenceAnalysisAPIMedia = {
  creatorHandle?: string | null;
  durationSeconds?: number | null;
  language?: string | null;
  mediaAssetId?: string;
  platform?: string;
  sourceUrl?: string;
  thumbnailUrl?: string | null;
  title?: string | null;
};

export type ReferenceAnalysisAPIRecipeScene = {
  durationSec?: number;
  index?: number;
  lineToSay?: string;
  projectionCutId?: string;
  requiredChecklist?: string[];
  shootingGuideline?: string;
  title?: string;
};

export type ReferenceAnalysisAPICutBoardItem = {
  durationSeconds?: number;
  executionTitle?: string;
  lineToSay?: string | null;
  myTakeRelationship?: string;
  orderIndex?: number;
  projectionCutId?: string;
  referenceMediaRef?: {
    endMs?: number;
    mediaAssetId?: string;
    startMs?: number;
    thumbnailUri?: string | null;
  };
  referenceObservation?: string;
  referenceUsage?: string;
  shotGuide?: string | null;
  sourceCutIds?: string[];
  successCriteria?: string[];
};

export type ReferenceAnalysisAPIResponse = {
  breakdown?: unknown | null;
  cutBoard?: {
    boardTitle?: string;
    estimatedDurationSeconds?: number;
    items?: ReferenceAnalysisAPICutBoardItem[];
  } | null;
  error?: {
    code?: string;
    recoveryAction?: string;
    retryable?: boolean;
    userMessage?: string;
  } | null;
  generatedAt?: string;
  generation?: {
    fallbackReason?: string | null;
    fallbackUsed?: boolean;
    missingArtifacts?: string[];
    model?: string | null;
    providerPipeline?: string[];
  };
  recipe?: {
    oneLineDescription?: string;
    scenes?: ReferenceAnalysisAPIRecipeScene[];
    title?: string;
    totalDurationSec?: number;
  } | null;
  referenceMedia?: ReferenceAnalysisAPIMedia | null;
  referenceUrl?: string;
  requestId?: string;
  schemaVersion?: string;
  status?: ReferenceAnalysisAPIStatus;
};

const generationSteps = [
  'Detecting hook',
  'Extracting shot rhythm',
  'Mapping product moments',
  'Drafting creator lines',
  'Building cut-by-cut recipe',
  'Preparing shooting mode',
];

export const referenceBreakdownSteps = generationSteps;

const defaultDurations: Record<GeneratedReferenceSceneType, number> = {
  hook: 5,
  proof: 8,
  demonstration: 12,
  cta: 5,
};

export function getYouTubeVideoId(url: string) {
  const trimmed = url.trim();
  const patterns = [
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export function isYouTubeReferenceUrl(url: string) {
  return Boolean(getYouTubeVideoId(url));
}

export function getYouTubeThumbnailUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}

function getApiBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_PARROTKIT_API_URL?.trim();
  return (configured || 'https://parrotkit-deploy.vercel.app').replace(/\/+$/, '');
}

export function isReferenceAnalysisDevFallbackEnabled() {
  return process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK?.trim().toLowerCase() === 'true';
}

function isHttpReferenceUrl(url: string) {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeGoalForApi(goalId: RecipeCreateGoalId) {
  return goalId === 'recipe-product' ? 'recipe-product' : goalId;
}

function fallbackCta(goalId: RecipeCreateGoalId) {
  if (goalId === 'recipe-product') {
    return 'Save this structure and reuse it for your next shoot.';
  }

  if (goalId === 'sell' || goalId === 'conversion') {
    return 'Check the product and try it with your own routine.';
  }

  return 'Save this and try the format with your own idea.';
}

function buildLocalFallbackRecipe({
  goalId,
  nicheId,
}: {
  goalId: RecipeCreateGoalId;
  nicheId: RecipeCreateNicheId;
}): GeneratedReferenceRecipe {
  const cta = fallbackCta(goalId);
  const scenes: GeneratedReferenceScene[] = [
    {
      index: 1,
      type: 'hook',
      title: 'Hook',
      durationSec: defaultDurations.hook,
      intent: 'Lead with the strongest payoff in the first beat.',
      lineToSay: 'Here is the result I wanted from this.',
      shootingGuideline: `Open on the final-looking ${nicheId} result. Keep the payoff centered before explaining.`,
      requiredChecklist: ['The result is visible immediately', 'The main item is centered', 'The opening line is short'],
      teleprompterLine: 'Here is the result I wanted from this.',
    },
    {
      index: 2,
      type: 'proof',
      title: 'Proof',
      durationSec: defaultDurations.proof,
      intent: 'Make the claim believable with a visible proof moment.',
      lineToSay: 'You can see the difference right here.',
      shootingGuideline: 'Show a close-up proof moment, before-after cue, texture, screen, or reaction that supports the hook.',
      requiredChecklist: ['The proof is visible without explanation', 'The shot is close enough', 'The proof connects to the hook'],
      teleprompterLine: 'You can see the difference right here.',
    },
    {
      index: 3,
      type: 'demonstration',
      title: 'Demonstration',
      durationSec: defaultDurations.demonstration,
      intent: 'Show the repeatable method so another creator can copy it.',
      lineToSay: 'Here is exactly how I use it.',
      shootingGuideline: 'Break the action into simple steps. Keep hands, product, or screen movement clean and repeatable.',
      requiredChecklist: ['The action is visible', 'Each step is easy to follow', 'The method feels repeatable'],
      teleprompterLine: 'Here is exactly how I use it.',
    },
    {
      index: 4,
      type: 'cta',
      title: 'CTA',
      durationSec: defaultDurations.cta,
      intent: 'Ask for the next action without over-explaining.',
      lineToSay: cta,
      shootingGuideline: 'End on the cleanest product, result, or next-action frame. Hold it long enough for the save beat.',
      requiredChecklist: ['The CTA is short', 'The next action is obvious', 'The final frame is clean'],
      teleprompterLine: cta,
    },
  ];

  return {
    title: `${nicheId[0].toUpperCase()}${nicheId.slice(1)} UGC Recipe`,
    oneLineDescription: 'A fallback Hook / Proof / Demonstration / CTA shooting recipe generated for the pasted YouTube reference.',
    totalDurationSec: scenes.reduce((sum, scene) => sum + scene.durationSec, 0),
    scenes,
  };
}

function sceneTypeForIndex(index: number, total: number): GeneratedReferenceSceneType {
  if (index === 0) return 'hook';
  if (index === total - 1) return 'cta';
  if (index === 1) return 'proof';
  return 'demonstration';
}

function normalizeReferencePlatform(platform: string | null | undefined): ReferenceRecipeGenerationResult['reference']['platform'] {
  const normalized = platform?.toLowerCase().trim() ?? '';

  if (normalized.includes('youtube')) return 'youtube-shorts';
  if (normalized.includes('tiktok')) return 'tiktok';
  if (normalized.includes('instagram')) return 'instagram-reels';
  if (normalized) return 'short-form';

  return 'unknown';
}

function compactText(value: string | null | undefined, fallback: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function optionalText(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function getBestThumbnailUrl({
  apiResponse,
  referenceUrl,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  referenceUrl: string;
}) {
  const boardThumbnail =
    apiResponse.cutBoard?.items?.find((item) => item.referenceMediaRef?.thumbnailUri)?.referenceMediaRef?.thumbnailUri ?? null;

  return (
    apiResponse.referenceMedia?.thumbnailUrl?.trim() ||
    boardThumbnail?.trim() ||
    getYouTubeThumbnailUrl(referenceUrl) ||
    ''
  );
}

function hasReferenceThumbnail(apiResponse: ReferenceAnalysisAPIResponse) {
  const referenceUrl =
    apiResponse.referenceUrl?.trim() ||
    apiResponse.referenceMedia?.sourceUrl?.trim() ||
    '';

  return Boolean(getBestThumbnailUrl({ apiResponse, referenceUrl }));
}

export function isUsableReferenceAnalysisResponse(
  value: ReferenceAnalysisAPIResponse,
): value is ReferenceAnalysisAPIResponse & {
  cutBoard: NonNullable<ReferenceAnalysisAPIResponse['cutBoard']> & { items: ReferenceAnalysisAPICutBoardItem[] };
  recipe: NonNullable<ReferenceAnalysisAPIResponse['recipe']> & { scenes: ReferenceAnalysisAPIRecipeScene[] };
} {
  if (value.schemaVersion !== 'parrotkit.reference_analysis_response.v1') {
    return false;
  }

  if (value.status !== 'ready' && value.status !== 'partial_ready') {
    return false;
  }

  if (value.generation?.fallbackUsed) {
    return false;
  }

  return Boolean(value.recipe?.scenes?.length && value.cutBoard?.items?.length && hasReferenceThumbnail(value));
}

export function mapReferenceAnalysisResponseToRecipeGenerationResult(
  apiResponse: ReferenceAnalysisAPIResponse,
  fallbackContext: {
    goalId: RecipeCreateGoalId;
    nicheId: RecipeCreateNicheId;
    referenceUrl: string;
  },
): ReferenceRecipeGenerationResult {
  if (!isUsableReferenceAnalysisResponse(apiResponse)) {
    throw new Error(apiResponse.error?.userMessage || 'Reference analysis did not return a usable board.');
  }

  const referenceUrl =
    apiResponse.referenceUrl?.trim() ||
    apiResponse.referenceMedia?.sourceUrl?.trim() ||
    fallbackContext.referenceUrl.trim();
  const thumbnailUrl = getBestThumbnailUrl({ apiResponse, referenceUrl });
  const title =
    optionalText(apiResponse.referenceMedia?.title) ??
    optionalText(apiResponse.recipe.title) ??
    'Reference video';
  const scenes = apiResponse.recipe.scenes.map((scene, index) => {
    const matchingCut =
      apiResponse.cutBoard.items.find((item) => item.projectionCutId && item.projectionCutId === scene.projectionCutId) ??
      apiResponse.cutBoard.items[index];
    const type = sceneTypeForIndex(index, apiResponse.recipe.scenes.length);
    const lineToSay =
      compactText(scene.lineToSay, compactText(matchingCut?.lineToSay ?? undefined, 'Say the key line for this moment.'));
    const shootingGuideline = compactText(
      scene.shootingGuideline,
      compactText(matchingCut?.shotGuide ?? undefined, compactText(matchingCut?.referenceUsage, 'Film the matching creator action clearly.')),
    );
    const intent = compactText(
      matchingCut?.referenceUsage,
      compactText(scene.title, `Capture cut ${index + 1}`),
    );
    const requiredChecklist =
      scene.requiredChecklist?.filter(Boolean) ??
      matchingCut?.successCriteria?.filter(Boolean) ??
      [];

    return {
      durationSec:
        Number.isFinite(scene.durationSec) && scene.durationSec ? scene.durationSec : matchingCut?.durationSeconds ?? defaultDurations[type],
      index: scene.index ?? index + 1,
      intent,
      lineToSay,
      requiredChecklist,
      shootingGuideline,
      teleprompterLine: lineToSay,
      title: compactText(scene.title, compactText(matchingCut?.executionTitle, `Cut ${index + 1}`)),
      type,
    };
  });

  return {
    recipe: {
      oneLineDescription: compactText(apiResponse.recipe.oneLineDescription, 'A reference-led shooting recipe generated from the pasted link.'),
      scenes,
      title: compactText(apiResponse.recipe.title, `${fallbackContext.nicheId} Reference Recipe`),
      totalDurationSec:
        apiResponse.recipe.totalDurationSec ??
        apiResponse.cutBoard.estimatedDurationSeconds ??
        scenes.reduce((sum, scene) => sum + scene.durationSec, 0),
    },
    reference: {
      platform: normalizeReferencePlatform(apiResponse.referenceMedia?.platform),
      thumbnailUrl,
      title,
      transcriptLanguage: apiResponse.referenceMedia?.language ?? null,
      transcriptPreview: undefined,
      transcriptSource: apiResponse.generation?.providerPipeline?.join(' + '),
      url: referenceUrl,
      videoId: getYouTubeVideoId(referenceUrl) || apiResponse.requestId || 'reference',
    },
    generation: {
      fallbackReason: apiResponse.generation?.missingArtifacts?.length
        ? `missing:${apiResponse.generation.missingArtifacts.join(',')}`
        : null,
      fallbackUsed: false,
      generatedAt: apiResponse.generatedAt || new Date().toISOString(),
      model: apiResponse.generation?.model ?? null,
      status: 'generated',
    },
  };
}

export function buildLocalFallbackResult({
  goalId,
  nicheId,
  referenceUrl,
}: {
  goalId: RecipeCreateGoalId;
  nicheId: RecipeCreateNicheId;
  referenceUrl: string;
}): ReferenceRecipeGenerationResult {
  const trimmedReferenceUrl = referenceUrl.trim();
  const videoId = getYouTubeVideoId(trimmedReferenceUrl) || 'dtnIqkMmbs0';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return {
    recipe: buildLocalFallbackRecipe({ goalId, nicheId }),
    reference: {
      platform: 'youtube-shorts',
      thumbnailUrl,
      title: 'YouTube Shorts Reference',
      url: trimmedReferenceUrl,
      videoId,
    },
    generation: {
      fallbackReason: 'local_fallback',
      fallbackUsed: true,
      generatedAt: new Date().toISOString(),
      model: null,
      status: 'fallback',
    },
  };
}

export async function generateRecipeFromYouTubeReference({
  goalId,
  languageHint,
  nicheId,
  referenceUrl,
}: {
  goalId: RecipeCreateGoalId;
  nicheId: RecipeCreateNicheId;
  referenceUrl: string;
  languageHint?: string;
}): Promise<ReferenceRecipeGenerationResult> {
  const trimmedReferenceUrl = referenceUrl.trim();
  const buildDevFallback = () =>
    buildLocalFallbackResult({
      goalId,
      nicheId,
      referenceUrl,
    });

  if (!isHttpReferenceUrl(trimmedReferenceUrl)) {
    if (isReferenceAnalysisDevFallbackEnabled()) {
      return Promise.resolve(buildDevFallback());
    }

    throw new Error('Paste a valid public reference link.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 95000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/v1/reference-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientSchemaVersion: 'parrotkit.expo.reference_recipe_generation.v1',
        goal: normalizeGoalForApi(goalId),
        idempotencyKey: `reference-${Date.now().toString(36)}`,
        languageHint,
        niche: nicheId,
        referenceUrl: trimmedReferenceUrl,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (isReferenceAnalysisDevFallbackEnabled()) {
        return buildDevFallback();
      }

      throw new Error('Reference analysis failed.');
    }

    const data = await response.json() as ReferenceAnalysisAPIResponse;

    if (!isUsableReferenceAnalysisResponse(data)) {
      if (isReferenceAnalysisDevFallbackEnabled()) {
        return buildDevFallback();
      }

      throw new Error(data.error?.userMessage || 'This link could not be analyzed.');
    }

    return mapReferenceAnalysisResponseToRecipeGenerationResult(data, {
      goalId,
      nicheId,
      referenceUrl: trimmedReferenceUrl,
    });
  } catch (error) {
    if (isReferenceAnalysisDevFallbackEnabled()) {
      return buildDevFallback();
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function formatTimestamp(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.max(0, Math.floor(totalSeconds % 60));
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getReferenceSignalType(type: GeneratedReferenceSceneType) {
  if (type === 'hook') return 'hook' as const;
  if (type === 'cta') return 'cta' as const;
  if (type === 'proof') return 'product' as const;
  return 'motion' as const;
}

export function mapGeneratedRecipeToMockScenes(
  result: ReferenceRecipeGenerationResult,
): MockRecipeScene[] {
  let elapsed = 0;
  const sourceScenes = result.recipe.scenes.length
    ? result.recipe.scenes
    : buildLocalFallbackRecipe({ goalId: 'ad', nicheId: 'other' }).scenes;

  return sourceScenes.map((generated, index) => {
    const type = generated.type || sceneTypeForIndex(index, sourceScenes.length);
    const durationSec = Number.isFinite(generated.durationSec) ? generated.durationSec : defaultDurations[type];
    const startTime = formatTimestamp(elapsed);
    elapsed += durationSec;
    const endTime = formatTimestamp(elapsed);
    const sceneId = `scene-generated-${Date.now().toString(36)}-${index + 1}`;
    const title = generated.title || `${index + 1}. ${type}`;

    return {
      id: sceneId,
      sceneNumber: index + 1,
      title,
      summary: generated.intent,
      startTime,
      endTime,
      thumbnail: result.reference.thumbnailUrl,
      analysisLines: [
        generated.intent,
        `Reference: ${result.reference.title}`,
      ],
      recipeLines: [
        generated.lineToSay,
        generated.shootingGuideline,
      ],
      prompterLines: [generated.teleprompterLine],
      analysis: {
        transcriptSnippet: result.reference.transcriptPreview || null,
        motionDescription: generated.shootingGuideline,
        whyItWorks: [generated.intent],
        referenceSignals: [
          {
            type: getReferenceSignalType(generated.type),
            text: generated.intent,
          },
        ],
      },
      recipe: {
        objective: generated.intent,
        appealPoint: generated.lineToSay,
        keyLine: generated.lineToSay,
        scriptLines: [generated.teleprompterLine],
        keyMood: 'Natural UGC',
        keyAction: generated.shootingGuideline,
        mustInclude: generated.requiredChecklist,
        mustAvoid: ['Do not explain before the key visual is clear'],
        cta: generated.type === 'cta' ? generated.lineToSay : '',
      },
      prompter: {
        blocks: [
          {
            id: `${sceneId}-line`,
            type: 'key_line',
            label: 'Line',
            content: generated.teleprompterLine,
            accentColor: 'blue',
            visible: true,
            size: 'xl',
            positionPreset: 'lowerThird',
            scale: 1,
            order: 1,
          },
          {
            id: `${sceneId}-action`,
            type: 'action',
            label: 'Action',
            content: generated.shootingGuideline,
            accentColor: 'coral',
            visible: index === 0,
            size: 'md',
            positionPreset: 'upperThird',
            scale: 1,
            order: 2,
          },
        ],
      },
    };
  });
}
