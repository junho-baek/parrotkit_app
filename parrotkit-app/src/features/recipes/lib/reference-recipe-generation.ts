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
    platform: 'youtube-shorts';
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

const generationSteps = [
  'Detecting hook',
  'Extracting shot rhythm',
  'Mapping product moments',
  'Drafting creator lines',
  'Building cut-by-cut recipe',
  'Preparing shooting mode',
];

export const referenceBreakdownSteps = generationSteps;

const sceneTypes: GeneratedReferenceSceneType[] = ['hook', 'proof', 'demonstration', 'cta'];
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
  return configured || 'https://parrotkit-deploy.vercel.app';
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

function buildLocalFallbackResult({
  goalId,
  nicheId,
  referenceUrl,
}: {
  goalId: RecipeCreateGoalId;
  nicheId: RecipeCreateNicheId;
  referenceUrl: string;
}): ReferenceRecipeGenerationResult {
  const videoId = getYouTubeVideoId(referenceUrl) || 'dtnIqkMmbs0';
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return {
    recipe: buildLocalFallbackRecipe({ goalId, nicheId }),
    reference: {
      platform: 'youtube-shorts',
      thumbnailUrl,
      title: 'YouTube Shorts Reference',
      url: referenceUrl,
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
  nicheId,
  referenceUrl,
}: {
  goalId: RecipeCreateGoalId;
  nicheId: RecipeCreateNicheId;
  referenceUrl: string;
}): Promise<ReferenceRecipeGenerationResult> {
  const fallback = buildLocalFallbackResult({ goalId, nicheId, referenceUrl });

  if (!isYouTubeReferenceUrl(referenceUrl)) {
    return fallback;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/mobile/reference-recipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: normalizeGoalForApi(goalId),
        niche: nicheId,
        referenceUrl: referenceUrl.trim(),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json() as ReferenceRecipeGenerationResult;

    if (!data?.recipe?.scenes?.length || !data.reference?.thumbnailUrl) {
      return fallback;
    }

    return data;
  } catch {
    return fallback;
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

  return sceneTypes.map((type, index) => {
    const generated = result.recipe.scenes[index] || buildLocalFallbackRecipe({ goalId: 'ad', nicheId: 'other' }).scenes[index];
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
