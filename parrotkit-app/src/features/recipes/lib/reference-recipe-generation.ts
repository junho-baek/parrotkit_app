import type { MockRecipeScene } from '@/core/mocks/parrotkit-data';
import type { ShootingBoardProjection, ShootingBoardProjectionItem } from '@/domain/recipes/reference-analysis-contract';
import type {
  ReferenceBreakdown,
  ReferenceBreakdownBoardVariantId,
} from '@/domain/recipes/reference-breakdown';
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
  referenceBreakdown?: ReferenceBreakdown;
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
    requestId?: string | null;
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
  sourceTemplate?: string;
  successCriteria?: string[];
};

export type ReferenceAnalysisAPIResponse = {
  breakdown?: unknown | null;
  cutBoard?: {
    boardTitle?: string;
    estimatedDurationSeconds?: number;
    items?: ReferenceAnalysisAPICutBoardItem[];
    variants?: Partial<
      Record<
        ReferenceBreakdownBoardVariantId,
        {
          boardTitle?: string;
          estimatedDurationSeconds?: number;
          items?: ReferenceAnalysisAPICutBoardItem[];
          label?: string;
        }
      >
    >;
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

function mapApiCutBoardToProjection({
  apiResponse,
  boardTitle,
  items,
  projectionId,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  boardTitle: string;
  items: ReferenceAnalysisAPICutBoardItem[];
  projectionId: string;
}): ShootingBoardProjection {
  const generatedAt = apiResponse.generatedAt || new Date().toISOString();
  const mediaAssetId =
    apiResponse.referenceMedia?.mediaAssetId ||
    items.find((item) => item.referenceMediaRef?.mediaAssetId)?.referenceMediaRef?.mediaAssetId ||
    apiResponse.requestId ||
    'reference-media';
  const missingArtifacts = apiResponse.generation?.missingArtifacts ?? [];
  const projectionItems: ShootingBoardProjectionItem[] = items.map((item, index) => {
    const startMs = safeMilliseconds(item.referenceMediaRef?.startMs);
    const endMs = Math.max(
      safeMilliseconds(item.referenceMediaRef?.endMs),
      startMs,
    );
    const orderIndex = Number.isFinite(Number(item.orderIndex))
      ? Number(item.orderIndex)
      : index;

    return {
      durationSeconds:
        Number.isFinite(item.durationSeconds) && item.durationSeconds
          ? item.durationSeconds
          : Math.max(1, Math.ceil((endMs - startMs) / 1000)),
      editableFields: ['lineToSay', 'shotGuide', 'successCriteria'],
      executionTitle: compactText(item.executionTitle, `Cut ${index + 1}`),
      lineToSay: item.lineToSay ?? null,
      missingArtifacts: [...missingArtifacts],
      myTakeRelationship: compactText(
        item.myTakeRelationship,
        'Apply this source beat to your own take.',
      ),
      orderIndex,
      projectionCutId: compactText(item.projectionCutId, `cut-${index + 1}`),
      referenceMediaRef: {
        endMs,
        mediaAssetId: item.referenceMediaRef?.mediaAssetId || mediaAssetId,
        startMs,
        thumbnailUri:
          item.referenceMediaRef?.thumbnailUri ??
          apiResponse.referenceMedia?.thumbnailUrl ??
          null,
      },
      referenceObservation: compactText(
        item.referenceObservation,
        'The source uses this beat clearly.',
      ),
      referenceUsage: compactText(
        item.referenceUsage,
        'Keep the same source role for this cut.',
      ),
      shotGuide: item.shotGuide ?? null,
      sourceCutIds: item.sourceCutIds?.filter(Boolean).length
        ? item.sourceCutIds.filter(Boolean)
        : [compactText(item.projectionCutId, `cut-${index + 1}`)],
      sourceTemplate: item.sourceTemplate?.trim() || undefined,
      sourceTimeRangeMs: {
        endMs,
        startMs,
      },
      successCriteria: item.successCriteria?.filter(Boolean).length
        ? item.successCriteria.filter(Boolean)
        : ['The source beat is still recognizable.'],
    };
  });

  return {
    analysisProfileVersion: 'reference-analysis-v1',
    boardTitle,
    breakdownId: apiResponse.requestId || 'reference-breakdown',
    confidence: {
      overall: apiResponse.status === 'ready' ? 0.82 : 0.68,
      notes: [],
    },
    createdAt: generatedAt,
    estimatedDurationSeconds:
      apiResponse.cutBoard?.estimatedDurationSeconds ??
      projectionItems.reduce((sum, item) => sum + item.durationSeconds, 0),
    items: projectionItems,
    mediaAssetId,
    mediaAssetVersion: 'v1',
    missingArtifacts: [...missingArtifacts],
    projectionId,
    projectionSchemaVersion: 'parrotkit.shooting_board_projection.v1',
    sourceCutCount: projectionItems.length,
    status: apiResponse.status === 'ready' ? 'ready' : 'partial',
    updatedAt: generatedAt,
    workspaceId: 'local',
  };
}

function mapApiResponseToReferenceBreakdown({
  apiResponse,
  referenceUrl,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  referenceUrl: string;
}): ReferenceBreakdown | undefined {
  const sourceItems =
    apiResponse.cutBoard?.variants?.sourceFaithful?.items ??
    apiResponse.cutBoard?.items ??
    [];
  if (!sourceItems.length) {
    return undefined;
  }

  const sourceProjection = mapApiCutBoardToProjection({
    apiResponse,
    boardTitle:
      apiResponse.cutBoard?.variants?.sourceFaithful?.boardTitle ??
      apiResponse.cutBoard?.boardTitle ??
      apiResponse.recipe?.title ??
      'Reference shooting board',
    items: sourceItems,
    projectionId: `${apiResponse.requestId || 'reference'}-sourceFaithful`,
  });
  const goalItems = apiResponse.cutBoard?.variants?.goalAdapted?.items ?? [];
  const goalProjection = goalItems.length
    ? mapApiCutBoardToProjection({
        apiResponse,
        boardTitle:
          apiResponse.cutBoard?.variants?.goalAdapted?.boardTitle ??
          apiResponse.cutBoard?.boardTitle ??
          sourceProjection.boardTitle,
        items: goalItems,
        projectionId: `${apiResponse.requestId || 'reference'}-goalAdapted`,
      })
    : undefined;
  const existingBreakdown =
    isRecord(apiResponse.breakdown) &&
    apiResponse.breakdown.schema_version === 'parrotkit.reference_breakdown.v1'
      ? (apiResponse.breakdown as ReferenceBreakdown)
      : null;
  const mergedBreakdown = existingBreakdown ?? createMinimalReferenceBreakdown({
    apiResponse,
    referenceUrl,
    sourceProjection,
  });

  return {
    ...mergedBreakdown,
    reference: {
      ...mergedBreakdown.reference,
      source_url: referenceUrl,
    },
    shooting_board_projection: sourceProjection,
    shooting_board_projection_variants: {
      sourceFaithful: sourceProjection,
      ...(goalProjection ? { goalAdapted: goalProjection } : {}),
    },
  };
}

function createMinimalReferenceBreakdown({
  apiResponse,
  referenceUrl,
  sourceProjection,
}: {
  apiResponse: ReferenceAnalysisAPIResponse;
  referenceUrl: string;
  sourceProjection: ShootingBoardProjection;
}): ReferenceBreakdown {
  const transcriptClean = sourceProjection.items
    .map((item) => item.lineToSay)
    .filter((line): line is string => Boolean(line))
    .join(' ');
  const normalizedPlatform = normalizeReferencePlatform(
    apiResponse.referenceMedia?.platform,
  );

  return {
    schema_version: 'parrotkit.reference_breakdown.v1',
    reference: {
      source_url: referenceUrl,
      platform: normalizedPlatform.includes('youtube') ? 'youtube' : 'unknown',
      creator_handle: apiResponse.referenceMedia?.creatorHandle ?? null,
      title: apiResponse.referenceMedia?.title ?? apiResponse.recipe?.title ?? null,
      duration_seconds: apiResponse.referenceMedia?.durationSeconds ?? null,
      language: apiResponse.referenceMedia?.language ?? '',
      thumbnail_description: '',
    },
    summary: {
      one_liner: compactText(
        apiResponse.recipe?.oneLineDescription,
        'A reference-led shooting recipe.',
      ),
      audience: '',
      promise: '',
      why_viewers_keep_watching: '',
    },
    transcript: {
      clean: transcriptClean,
      notable_lines: [],
      raw: transcriptClean ? [transcriptClean] : [],
    },
    idea_analysis: {
      common_belief_to_challenge: '',
      contrarian_reality: '',
      idea_seed: '',
      supporting_evidence: [],
      topic: '',
      unique_angle: '',
      user_application: '',
    },
    hook: {
      adaptation_rule: '',
      category: 'other',
      formula: '',
      spoken_hook: sourceProjection.items[0]?.lineToSay ?? '',
      visual_hook: '',
      why_it_works: '',
    },
    storytelling_format: {
      beat_order: sourceProjection.items.map((item) => item.executionTitle),
      category: 'other',
      description: '',
      reuse_when: '',
      why_it_works: '',
    },
    visual_layout: {
      camera_motion: '',
      caption_strategy: '',
      category: 'other',
      framing: '',
      sub_category: '',
      subject_product_relationship: '',
      user_application: '',
    },
    proof_structure: {
      proof_points: [],
      trust_signals: [],
      risk_or_gap: '',
    },
    cuts: sourceProjection.items.map((item) => ({
      id: item.projectionCutId,
      time_range: `${Math.floor(item.sourceTimeRangeMs.startMs / 1000)}-${Math.floor(item.sourceTimeRangeMs.endMs / 1000)}s`,
      execution_title: item.executionTitle,
      reference_observation: item.referenceObservation,
      line_to_say: item.lineToSay ?? '',
      shooting_guide: item.shotGuide ?? '',
      why_this_beat_exists: item.referenceUsage,
      my_take_success_criteria: item.successCriteria,
    })),
    shooting_projection: {
      board_title: sourceProjection.boardTitle,
      video_level_breakdown: [],
      cut_rows: sourceProjection.items.map((item) => ({
        cut_id: item.projectionCutId,
        execution_title: item.executionTitle,
        line_to_say: item.lineToSay ?? '',
        shot_guide: item.shotGuide ?? '',
        reference_usage: item.referenceUsage,
        my_take_relationship: item.myTakeRelationship,
      })),
    },
    vault_candidates: {
      idea: { title: sourceProjection.boardTitle, tags: [] },
      hook: { formula: '', category: 'other' },
      story_format: { name: '', tags: [] },
      visual_layout: { name: '', tags: [] },
      channel: {
        creator_handle: apiResponse.referenceMedia?.creatorHandle ?? null,
        why_follow: '',
      },
    },
    confidence: {
      overall: sourceProjection.confidence.overall,
      transcript: sourceProjection.confidence.overall,
      visual: 0,
      cut_segmentation: sourceProjection.confidence.overall,
      notes: [],
    },
  };
}

function safeMilliseconds(value: unknown) {
  return Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
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
    referenceBreakdown: mapApiResponseToReferenceBreakdown({
      apiResponse,
      referenceUrl,
    }),
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
      requestId: apiResponse.requestId ?? null,
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
      requestId: null,
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
