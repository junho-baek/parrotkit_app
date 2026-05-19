import {
  buildLocalFallbackResult,
  generateRecipeFromYouTubeReference,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  isReferenceAnalysisDevFallbackEnabled,
  isUsableReferenceAnalysisResponse,
  isYouTubeReferenceUrl,
  mapReferenceAnalysisResponseToRecipeGenerationResult,
  mapGeneratedRecipeToMockScenes,
  referenceBreakdownSteps,
  type ReferenceAnalysisAPICutBoardItem,
  type ReferenceAnalysisAPIResponse,
  type ReferenceRecipeGenerationResult,
} from '@/features/recipes/lib/reference-recipe-generation';

const shortsUrl = 'https://www.youtube.com/shorts/dtnIqkMmbs0';

if (getYouTubeVideoId(shortsUrl) !== 'dtnIqkMmbs0') {
  throw new Error('YouTube Shorts video id should be parsed from pasted links.');
}

if (!isYouTubeReferenceUrl(shortsUrl)) {
  throw new Error('YouTube Shorts links should be accepted by the reference generator.');
}

if (isYouTubeReferenceUrl('https://www.tiktok.com/@demo/video/123')) {
  throw new Error('YouTube-specific helpers should not classify TikTok links as YouTube.');
}

if (getYouTubeThumbnailUrl(shortsUrl) !== 'https://img.youtube.com/vi/dtnIqkMmbs0/maxresdefault.jpg') {
  throw new Error('YouTube thumbnail fallback should use the parsed video id.');
}

const fallbackResult = buildLocalFallbackResult({
  goalId: 'ad',
  nicheId: 'beauty',
  referenceUrl: ` ${shortsUrl} `,
});

if (fallbackResult.reference.url !== shortsUrl) {
  throw new Error('Fallback reference generation should trim and preserve the pasted source URL.');
}

if (fallbackResult.reference.videoId !== 'dtnIqkMmbs0') {
  throw new Error('Fallback reference generation should derive metadata from the pasted source URL.');
}

if (referenceBreakdownSteps.length !== 6) {
  throw new Error('Reference generation splash should expose the expected six breakdown steps.');
}

const generated: ReferenceRecipeGenerationResult = {
  recipe: {
    title: 'Generated UGC Recipe',
    oneLineDescription: 'A generated test recipe.',
    totalDurationSec: 30,
    scenes: [
      {
        index: 1,
        type: 'hook',
        title: 'Hook',
        durationSec: 5,
        intent: 'Lead with the payoff.',
        lineToSay: 'Here is the result.',
        shootingGuideline: 'Show the final result first.',
        requiredChecklist: ['Result visible', 'Item centered', 'Line is short'],
        teleprompterLine: 'Here is the result.',
      },
      {
        index: 2,
        type: 'proof',
        title: 'Proof',
        durationSec: 8,
        intent: 'Make it believable.',
        lineToSay: 'Look at the difference.',
        shootingGuideline: 'Show a close-up proof.',
        requiredChecklist: ['Proof visible', 'Close enough', 'Matches hook'],
        teleprompterLine: 'Look at the difference.',
      },
      {
        index: 3,
        type: 'demonstration',
        title: 'Demonstration',
        durationSec: 12,
        intent: 'Show the repeatable method.',
        lineToSay: 'Here is how I use it.',
        shootingGuideline: 'Break the method into simple steps.',
        requiredChecklist: ['Action visible', 'Steps clear', 'Repeatable'],
        teleprompterLine: 'Here is how I use it.',
      },
      {
        index: 4,
        type: 'cta',
        title: 'CTA',
        durationSec: 5,
        intent: 'Ask for the next action.',
        lineToSay: 'Save this for later.',
        shootingGuideline: 'End on a clean final frame.',
        requiredChecklist: ['CTA short', 'Action obvious', 'Frame clean'],
        teleprompterLine: 'Save this for later.',
      },
    ],
  },
  reference: {
    platform: 'youtube-shorts',
    thumbnailUrl: 'https://img.youtube.com/vi/dtnIqkMmbs0/maxresdefault.jpg',
    title: 'Test Short',
    url: shortsUrl,
    videoId: 'dtnIqkMmbs0',
  },
  generation: {
    fallbackUsed: false,
    generatedAt: '2026-05-10T00:00:00.000Z',
    status: 'generated',
  },
};

const scenes = mapGeneratedRecipeToMockScenes(generated);

if (scenes.length !== 4) {
  throw new Error('Generated reference recipes should map to four board scenes.');
}

if (scenes[0]?.recipe?.keyLine !== 'Here is the result.') {
  throw new Error('Generated lineToSay should become the board line to say.');
}

const thirdScene = scenes[2];
const thirdSceneChecklist = thirdScene?.recipe?.mustInclude ?? [];

if (thirdSceneChecklist.length !== 3) {
  throw new Error('Generated checklist should map into board required checks.');
}

if (scenes.some((scene) => scene.thumbnail !== generated.reference.thumbnailUrl)) {
  throw new Error('Generated scenes should reuse the YouTube thumbnail as their board thumbnail.');
}

const readyAnalysisResponse: ReferenceAnalysisAPIResponse = {
  schemaVersion: 'parrotkit.reference_analysis_response.v1',
  status: 'ready',
  requestId: 'req_ready',
  generatedAt: '2026-05-18T00:00:00.000Z',
  referenceUrl: shortsUrl,
  referenceMedia: {
    platform: 'youtube',
    sourceUrl: shortsUrl,
    thumbnailUrl: 'https://cdn.example.com/thumb.jpg',
    title: 'Creator glow review',
  },
  breakdown: {
    schema_version: 'parrotkit.reference_breakdown.v1',
    cuts: [{ id: 'cut-1' }],
  },
  recipe: {
    title: 'Glow Review Recipe',
    oneLineDescription: 'Open with the finished look, then show proof and use.',
    totalDurationSec: 20,
    scenes: [
      {
        durationSec: 6,
        index: 1,
        lineToSay: 'This is the glow before concealer.',
        projectionCutId: 'cut-1',
        requiredChecklist: ['Finished skin visible'],
        shootingGuideline: 'Open on the finished skin result.',
        title: 'Show finished glow',
      },
      {
        durationSec: 14,
        index: 2,
        lineToSay: 'Here is how it sits on skin.',
        projectionCutId: 'cut-2',
        requiredChecklist: ['Product and texture visible'],
        shootingGuideline: 'Show a close texture pass.',
        title: 'Show texture proof',
      },
    ],
  },
  cutBoard: {
    boardTitle: 'Glow Review Recipe',
    estimatedDurationSeconds: 20,
    items: [
      {
        durationSeconds: 6,
        executionTitle: 'Show finished glow',
        lineToSay: 'This is the glow before concealer.',
        myTakeRelationship: 'Use this as the opening take.',
        orderIndex: 0,
        projectionCutId: 'cut-1',
        referenceMediaRef: {
          endMs: 6000,
          mediaAssetId: 'media-1',
          startMs: 0,
          thumbnailUri: 'https://cdn.example.com/cut-1.jpg',
        },
        referenceObservation: 'The creator starts on the result.',
        referenceUsage: 'Lead with your finished result before explaining.',
        shotGuide: 'Frame the finished result in 9:16.',
        sourceCutIds: ['source-1'],
        successCriteria: ['Result is visible immediately'],
      },
      {
        durationSeconds: 14,
        executionTitle: 'Show texture proof',
        lineToSay: 'Here is how it sits on skin.',
        myTakeRelationship: 'Use this as the proof take.',
        orderIndex: 1,
        projectionCutId: 'cut-2',
        referenceMediaRef: {
          endMs: 20000,
          mediaAssetId: 'media-1',
          startMs: 6000,
        },
        referenceObservation: 'The creator moves into proof.',
        referenceUsage: 'Show the product texture close enough to inspect.',
        shotGuide: 'Move from product to skin texture.',
        sourceCutIds: ['source-2'],
        successCriteria: ['Texture is visible'],
      },
    ],
  },
  generation: {
    fallbackUsed: false,
    missingArtifacts: [],
    model: 'google/gemini-2.5-flash',
    providerPipeline: ['superdata.metadata', 'superdata.transcript', 'superdata.extract', 'replicate.model'],
  },
};

if (!isUsableReferenceAnalysisResponse(readyAnalysisResponse)) {
  throw new Error('Ready reference analysis responses should be considered usable.');
}

const mappedReadyResult = mapReferenceAnalysisResponseToRecipeGenerationResult(readyAnalysisResponse, {
  goalId: 'ad',
  nicheId: 'beauty',
  referenceUrl: shortsUrl,
});

if (mappedReadyResult.generation.fallbackUsed) {
  throw new Error('Ready API responses must not be marked as fallback generations.');
}

if (mappedReadyResult.reference.thumbnailUrl !== 'https://cdn.example.com/thumb.jpg') {
  throw new Error('Ready API responses should prefer canonical reference media thumbnails.');
}

const mappedProjection = mappedReadyResult.referenceBreakdown?.shooting_board_projection;
if (!mappedProjection || mappedProjection.items.length !== 2) {
  throw new Error('Ready API responses should preserve cutBoard as a shooting board projection.');
}

if (
  mappedProjection.items[1]?.sourceTimeRangeMs.startMs !== 6000 ||
  mappedProjection.items[1]?.sourceTimeRangeMs.endMs !== 20000
) {
  throw new Error('Generated projection should preserve API cutBoard timestamp spans.');
}

if (mapGeneratedRecipeToMockScenes(mappedReadyResult).length !== 2) {
  throw new Error('Generated API recipe scenes should preserve the live cut count.');
}

const latestThreeCutResponse: ReferenceAnalysisAPIResponse = {
  ...readyAnalysisResponse,
  requestId: 'req_latest_three',
  generatedAt: '2026-05-20T03:00:00.000Z',
  breakdown: {
    ...(readyAnalysisResponse.breakdown as Record<string, unknown>),
    transcript: {
      clean: 'Latest three-cut transcript. Middle proof. Final save line.',
      notable_lines: [],
      raw: ['Latest three-cut transcript. Middle proof. Final save line.'],
    },
  },
  recipe: {
    title: 'Latest Three Cut Recipe',
    oneLineDescription: 'A fresh three-cut generated response.',
    totalDurationSec: 18,
    scenes: [
      {
        durationSec: 5,
        index: 1,
        lineToSay: 'Latest hook line.',
        projectionCutId: 'latest-cut-1',
        requiredChecklist: ['Hook visible'],
        shootingGuideline: 'Open on the latest hook.',
        title: 'Latest hook',
      },
      {
        durationSec: 7,
        index: 2,
        lineToSay: 'Latest proof line.',
        projectionCutId: 'latest-cut-2',
        requiredChecklist: ['Proof visible'],
        shootingGuideline: 'Show the latest proof.',
        title: 'Latest proof',
      },
      {
        durationSec: 6,
        index: 3,
        lineToSay: 'Latest save line.',
        projectionCutId: 'latest-cut-3',
        requiredChecklist: ['CTA visible'],
        shootingGuideline: 'End on the latest CTA.',
        title: 'Latest CTA',
      },
    ],
  },
  cutBoard: {
    boardTitle: 'Latest Three Cut Recipe',
    estimatedDurationSeconds: 18,
    items: [
      createApiCutBoardItem('latest-cut-1', 'Latest hook', 'Latest hook line.', 0, 5000),
      createApiCutBoardItem('latest-cut-2', 'Latest proof', 'Latest proof line.', 5000, 12000),
      createApiCutBoardItem('latest-cut-3', 'Latest CTA', 'Latest save line.', 12000, 18000),
    ],
    variants: {
      sourceFaithful: {
        boardTitle: 'Latest Three Cut Recipe',
        items: [
          createApiCutBoardItem('latest-cut-1', 'Latest hook', 'Latest hook line.', 0, 5000),
          createApiCutBoardItem('latest-cut-2', 'Latest proof', 'Latest proof line.', 5000, 12000),
          createApiCutBoardItem('latest-cut-3', 'Latest CTA', 'Latest save line.', 12000, 18000),
        ],
      },
      goalAdapted: {
        boardTitle: 'Latest Three Cut Recipe Adapted',
        items: [
          createApiCutBoardItem('latest-cut-1', 'Adapted hook', 'Adapted hook line.', 0, 5000),
          createApiCutBoardItem('latest-cut-2', 'Adapted proof', 'Adapted proof line.', 5000, 12000),
          createApiCutBoardItem('latest-cut-3', 'Adapted CTA', 'Adapted save line.', 12000, 18000),
        ],
      },
    },
  },
};

const latestThreeCutResult = mapReferenceAnalysisResponseToRecipeGenerationResult(
  latestThreeCutResponse,
  {
    goalId: 'ad',
    nicheId: 'beauty',
    referenceUrl: shortsUrl,
  },
);

if (latestThreeCutResult.generation.requestId !== 'req_latest_three') {
  throw new Error('Generated result should preserve latest API requestId.');
}

if (mapGeneratedRecipeToMockScenes(latestThreeCutResult).length !== 3) {
  throw new Error('Generated scenes must keep the latest three-cut API count.');
}

const latestProjection = latestThreeCutResult.referenceBreakdown?.shooting_board_projection;

if (!latestProjection || latestProjection.items.length !== 3) {
  throw new Error('Latest API cutBoard must become a three-item sourceFaithful projection.');
}

if (latestProjection.breakdownId !== 'req_latest_three') {
  throw new Error(`Latest projection should carry request freshness. Found: ${latestProjection.breakdownId}`);
}

if (latestProjection.updatedAt !== '2026-05-20T03:00:00.000Z') {
  throw new Error(`Latest projection should carry generatedAt freshness. Found: ${latestProjection.updatedAt}`);
}

if (
  latestThreeCutResult.referenceBreakdown?.transcript.clean !==
  'Latest three-cut transcript. Middle proof. Final save line.'
) {
  throw new Error('Breakdown transcript must come from the latest API response.');
}

const latestGoalProjection =
  latestThreeCutResult.referenceBreakdown?.shooting_board_projection_variants?.goalAdapted;

if (!latestGoalProjection || latestGoalProjection.items[0]?.lineToSay !== 'Adapted hook line.') {
  throw new Error('Goal-adapted projection must remain selectable from the same latest response.');
}

const failedAnalysisResponse: ReferenceAnalysisAPIResponse = {
  schemaVersion: 'parrotkit.reference_analysis_response.v1',
  status: 'failed',
  requestId: 'req_failed',
  generatedAt: '2026-05-18T00:00:00.000Z',
  referenceUrl: shortsUrl,
  error: {
    code: 'analysis_failed',
    recoveryAction: 'retry',
    retryable: true,
    userMessage: 'Try another link.',
  },
  generation: {
    fallbackUsed: false,
    missingArtifacts: [],
    model: null,
    providerPipeline: [],
  },
};

if (isUsableReferenceAnalysisResponse(failedAnalysisResponse)) {
  throw new Error('Failed reference analysis responses must not create a board.');
}

const noThumbnailAnalysisResponse: ReferenceAnalysisAPIResponse = {
  ...readyAnalysisResponse,
  referenceMedia: {
    ...readyAnalysisResponse.referenceMedia,
    thumbnailUrl: null,
  },
  referenceUrl: 'https://www.tiktok.com/@demo/video/123',
  cutBoard: {
    ...readyAnalysisResponse.cutBoard,
    items: readyAnalysisResponse.cutBoard?.items?.map((item) => ({
      ...item,
      referenceMediaRef: {
        ...item.referenceMediaRef,
        thumbnailUri: null,
      },
    })),
  },
};

if (isUsableReferenceAnalysisResponse(noThumbnailAnalysisResponse)) {
  throw new Error('Production reference analysis must not substitute fake thumbnails for non-YouTube references.');
}

async function runAsyncGenerationAssertions() {
  const globalWithFetch = globalThis as typeof globalThis & { fetch: typeof fetch };
  const originalFetch = globalWithFetch.fetch;
  const originalApiUrl = process.env.EXPO_PUBLIC_PARROTKIT_API_URL;
  const originalDevFallback = process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK;

  try {
    const captured: {
      body: Record<string, unknown> | null;
      url: string;
    } = {
      body: null,
      url: '',
    };

    process.env.EXPO_PUBLIC_PARROTKIT_API_URL = 'https://analysis.example.com/';
    process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK = '';
    globalWithFetch.fetch = (async (input, init) => {
      captured.url = String(input);
      captured.body = JSON.parse(String(init?.body ?? '{}')) as Record<string, unknown>;

      return {
        json: async () => readyAnalysisResponse,
        ok: true,
      } as unknown as Response;
    }) as typeof fetch;

    const apiGenerated = await generateRecipeFromYouTubeReference({
      goalId: 'ad',
      languageHint: 'ko',
      nicheId: 'beauty',
      referenceUrl: shortsUrl,
    });

    if (captured.url !== 'https://analysis.example.com/v1/reference-analysis') {
      throw new Error('Reference generation should call the Go /v1/reference-analysis endpoint.');
    }

    if (captured.body?.referenceUrl !== shortsUrl || captured.body.languageHint !== 'ko') {
      throw new Error('Reference generation should forward the trimmed URL and language hint.');
    }

    if (apiGenerated.recipe.title !== 'Glow Review Recipe') {
      throw new Error('Reference generation should map usable API recipes into the current board model.');
    }

    globalWithFetch.fetch = (async () => ({
      json: async () => failedAnalysisResponse,
      ok: true,
    }) as unknown as Response) as typeof fetch;

    let rejectedFailedAnalysis = false;
    try {
      await generateRecipeFromYouTubeReference({
        goalId: 'ad',
        nicheId: 'beauty',
        referenceUrl: shortsUrl,
      });
    } catch {
      rejectedFailedAnalysis = true;
    }

    if (!rejectedFailedAnalysis) {
      throw new Error('Production reference generation must not silently fallback on failed analysis.');
    }

    process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK = 'true';

    if (!isReferenceAnalysisDevFallbackEnabled()) {
      throw new Error('Dev fallback gate should be explicit and opt-in.');
    }

    globalWithFetch.fetch = (async () => ({
      json: async () => failedAnalysisResponse,
      ok: false,
    }) as unknown as Response) as typeof fetch;

    const devFallback = await generateRecipeFromYouTubeReference({
      goalId: 'ad',
      nicheId: 'beauty',
      referenceUrl: shortsUrl,
    });

    if (!devFallback.generation.fallbackUsed) {
      throw new Error('Dev fallback should only run when explicitly enabled.');
    }
  } finally {
    globalWithFetch.fetch = originalFetch;
    process.env.EXPO_PUBLIC_PARROTKIT_API_URL = originalApiUrl;
    process.env.EXPO_PUBLIC_REFERENCE_ANALYSIS_DEV_FALLBACK = originalDevFallback;
  }
}

void runAsyncGenerationAssertions().catch((error) => {
  setTimeout(() => {
    throw error;
  }, 0);
});

function createApiCutBoardItem(
  projectionCutId: string,
  executionTitle: string,
  lineToSay: string,
  startMs: number,
  endMs: number,
): ReferenceAnalysisAPICutBoardItem {
  const orderSuffix = projectionCutId.split('-').slice(-1)[0] ?? '1';

  return {
    durationSeconds: Math.max(1, Math.ceil((endMs - startMs) / 1000)),
    executionTitle,
    lineToSay,
    myTakeRelationship: 'Use this latest beat for your take.',
    orderIndex: Number(orderSuffix) - 1,
    projectionCutId,
    referenceMediaRef: {
      endMs,
      mediaAssetId: 'media-latest',
      startMs,
      thumbnailUri: 'https://cdn.example.com/latest.jpg',
    },
    referenceObservation: 'The latest response owns this beat.',
    referenceUsage: 'Keep the latest source role.',
    shotGuide: `Film ${executionTitle.toLowerCase()}.`,
    sourceCutIds: [projectionCutId],
    successCriteria: [`${executionTitle} is visible`],
  };
}
