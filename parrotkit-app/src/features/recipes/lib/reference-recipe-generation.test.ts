import {
  buildLocalFallbackResult,
  getYouTubeThumbnailUrl,
  getYouTubeVideoId,
  isYouTubeReferenceUrl,
  mapGeneratedRecipeToMockScenes,
  referenceBreakdownSteps,
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
  throw new Error('The MVP reference generator should reject non-YouTube links.');
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
