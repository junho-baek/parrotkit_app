import { NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

function containsKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function searchableSceneText(scene: NativeRecipeScene) {
  return [
    scene.title,
    scene.summary || '',
    scene.recipe.objective,
    scene.recipe.appealPoint,
    scene.recipe.keyLine,
    scene.recipe.keyAction,
    scene.recipe.cta || '',
    scene.analysis.motionDescription || '',
    scene.analysis.transcriptSnippet || '',
  ]
    .join(' ')
    .toLowerCase();
}

function getHookPattern(text: string) {
  if (containsKeyword(text, ['myth', 'actually', 'truth', 'instead', 'secret', '속지', '몰랐', '반전'])) {
    return 'Myth-Busting';
  }

  if (containsKeyword(text, ['problem', 'mistake', 'avoid', 'stop', 'warning', 'wrong', '실수', '문제', '조심', '피하', '절대'])) {
    return 'Problem-Led';
  }

  return 'Outcome-First';
}

function getBasePattern(text: string) {
  if (containsKeyword(text, ['?', 'why', 'how', 'what', '여러분', '아세요'])) {
    return 'Question Lead';
  }

  if (containsKeyword(text, ['kitchen', 'store', 'shop', 'cafe', 'room', 'desk', 'table', 'outside', 'inside', '가서', '에서'])) {
    return 'Scene Change';
  }

  if (containsKeyword(text, ['expert', 'doctor', 'founder', 'coach', 'chef', 'specialist', 'authority', '전문가', '현직', '추천'])) {
    return 'Authority Cue';
  }

  return 'Real Example';
}

function getCtaPattern(text: string) {
  if (containsKeyword(text, ['now', 'today', 'must', 'save this', 'follow', 'click', 'buy', 'join', 'download', '지금', '바로', '꼭', '무조건'])) {
    return 'Hard CTA';
  }

  return 'Soft CTA';
}

export function sceneSupportsAnalysis(scene: NativeRecipeScene) {
  const transcriptLines = scene.analysis.transcriptOriginal?.filter((line) => line.trim().length > 0) || [];
  const hasTranscript = transcriptLines.length > 0 || Boolean(scene.analysis.transcriptSnippet?.trim());
  const hasMotion = Boolean(scene.analysis.motionDescription?.trim());
  const hasWhy = scene.analysis.whyItWorks.some((item) => item.trim().length > 0);

  return hasTranscript || hasMotion || hasWhy;
}

export function getSceneStrategyMeta(scene: NativeRecipeScene, sceneIndex: number, totalScenes: number) {
  const text = searchableSceneText(scene);

  if (sceneIndex === 0) {
    return { stageLabel: 'HOOK', patternLabel: getHookPattern(text) };
  }

  if (sceneIndex === totalScenes - 1) {
    return { stageLabel: 'CTA', patternLabel: getCtaPattern(text) };
  }

  return {
    stageLabel: `BASE #${sceneIndex}`,
    patternLabel: getBasePattern(text),
  };
}

export function getSceneCardSummary(scene: NativeRecipeScene) {
  return (
    scene.recipe.appealPoint.trim()
    || scene.recipe.keyLine.trim()
    || scene.analysis.motionDescription?.trim()
    || scene.summary?.trim()
    || scene.title
  );
}
