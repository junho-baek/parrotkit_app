import type { NativeRecipe, NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export type ShootBoardCutRole = 'hook' | 'proof' | 'scene' | 'cta' | 'custom';

export type ShootBoardCut = {
  id: string;
  order: number;
  role: ShootBoardCutRole;
  roleLabel: string;
  durationSeconds: number;
  timeRangeLabel: string;
  instruction: string;
  instructionKo?: string;
  speakingLine: string;
  speakingLineKo?: string;
  prompterLine: string;
  shootingDirections: string[];
  shootingDirectionsKo?: string[];
  requiredChecks: string[];
  requiredChecksKo?: string[];
  thumbnailUrl: string;
  referenceVideoUrl?: string;
  isShot: boolean;
  shotCount?: number;
  notes?: string;
  sceneId?: string;
};

export type ShootBoardRecipe = {
  id: string;
  title: string;
  totalCuts: number;
  totalDurationSeconds: number;
  shotCount: number;
  isSaved: boolean;
  cuts: ShootBoardCut[];
};

type CreateShootBoardRecipeOptions = {
  isSaved?: boolean;
  shotCutIds?: string[];
};

type RoleCopy = {
  instruction: string;
  instructionKo: string;
  label: string;
  speakingLine: string;
  speakingLineKo: string;
};

type CutDefinition = {
  durationSeconds: number;
  idSuffix?: string;
  instruction: string;
  instructionKo: string;
  requiredChecks: string[];
  requiredChecksKo: string[];
  role: ShootBoardCutRole;
  sceneIndex: number;
  shootingDirections: string[];
  shootingDirectionsKo: string[];
  speakingLine: string;
  speakingLineKo: string;
  startSeconds: number;
};

const roleCopy: Record<ShootBoardCutRole, RoleCopy> = {
  hook: {
    instruction: 'Lead with the payoff.',
    instructionKo: '결과를 먼저 보여준다.',
    label: 'Hook',
    speakingLine: 'Eating like this actually lasted.',
    speakingLineKo: '이렇게 먹으니까 오래 갔어요.',
  },
  proof: {
    instruction: 'Show texture and speed.',
    instructionKo: '식감과 속도를 보여준다.',
    label: 'Proof',
    speakingLine: '20-minute high-protein, low-effort meal.',
    speakingLineKo: '20분 고단백, 부담 없는 한 끼.',
  },
  scene: {
    instruction: 'Show the routine.',
    instructionKo: '루틴을 순서대로 보여준다.',
    label: 'Scene',
    speakingLine: 'This is the order that makes it easy to repeat.',
    speakingLineKo: '이 순서대로 하면 다시 만들기 쉬워요.',
  },
  cta: {
    instruction: 'Leave curiosity, then link.',
    instructionKo: '궁금증을 남기고 행동을 유도한다.',
    label: 'CTA',
    speakingLine: 'Build one meal you will want again this week.',
    speakingLineKo: '이번 주에 또 먹고 싶은 한 끼 만들기.',
  },
  custom: {
    instruction: 'Add a clear filming cue.',
    instructionKo: '새 촬영 지시를 추가한다.',
    label: 'Scene',
    speakingLine: 'Add the line you want to say.',
    speakingLineKo: '촬영할 문장을 입력하세요.',
  },
};

const koreanDietCutDefinitions: CutDefinition[] = [
  {
    durationSeconds: 5,
    instruction: 'Lead with the payoff.',
    instructionKo: '결과를 먼저 보여준다.',
    requiredChecks: [
      'Meal is centered in frame',
      'Result line lands within 1 second',
      'Exposure and focus are stable',
    ],
    requiredChecksKo: [
      '음식이 화면 중앙에 보임',
      '1초 안에 결과 문장이 나옴',
      '밝기와 초점이 안정적임',
    ],
    role: 'hook',
    sceneIndex: 0,
    shootingDirections: [
      'Show the finished meal first',
      'Start with a food close-up',
      'Say the payoff immediately',
    ],
    shootingDirectionsKo: [
      '완성된 한 끼를 먼저 보여준다',
      '첫 1초는 음식 클로즈업',
      '바로 결과 문장을 말한다',
    ],
    speakingLine: 'Eating like this actually lasted.',
    speakingLineKo: '이렇게 먹으니까 오래 갔어요.',
    startSeconds: 0,
  },
  {
    durationSeconds: 8,
    instruction: 'Show texture and speed.',
    instructionKo: '식감과 속도를 보여준다.',
    requiredChecks: [
      'Hands stay inside frame',
      'Texture shot is visible',
      'No long pause before proof',
    ],
    requiredChecksKo: [
      '손이 프레임 안에 있음',
      '식감 컷이 분명히 보임',
      '증거 컷 전에 긴 공백이 없음',
    ],
    role: 'proof',
    sceneIndex: 1,
    shootingDirections: [
      'Show prep, drizzle, and final bite',
      'Keep the movement centered',
      'Cut quickly between proof moments',
    ],
    shootingDirectionsKo: [
      '준비, 소스, 한 입 컷을 보여준다',
      '움직임을 중앙에 유지한다',
      '증거 장면을 빠르게 이어붙인다',
    ],
    speakingLine: '20-minute high-protein, low-effort meal.',
    speakingLineKo: '20분 고단백, 부담 없는 한 끼.',
    startSeconds: 5,
  },
  {
    durationSeconds: 12,
    instruction: 'Show the routine.',
    instructionKo: '루틴을 순서대로 보여준다.',
    requiredChecks: [
      'Routine order is easy to follow',
      'Each step has one clear action',
      'No extra explanation over the shot',
    ],
    requiredChecksKo: [
      '루틴 순서가 따라가기 쉬움',
      '각 단계의 행동이 하나씩 보임',
      '장면 위에 설명이 과하지 않음',
    ],
    role: 'scene',
    sceneIndex: 1,
    shootingDirections: [
      'Move through the routine in order',
      'Hold each action for one beat',
      'Keep the camera steady',
    ],
    shootingDirectionsKo: [
      '루틴을 실제 순서대로 보여준다',
      '각 행동은 한 박자씩 머문다',
      '카메라 흔들림을 줄인다',
    ],
    speakingLine: 'This is the order that makes it easy to repeat.',
    speakingLineKo: '이 순서대로 하면 다시 만들기 쉬워요.',
    startSeconds: 13,
  },
  {
    durationSeconds: 5,
    instruction: 'Leave curiosity, then link.',
    instructionKo: '궁금증을 남기고 행동을 유도한다.',
    requiredChecks: [
      'Final frame holds for one beat',
      'CTA is simple and reusable',
      'Viewer knows what to do next',
    ],
    requiredChecksKo: [
      '마지막 프레임을 한 박자 유지',
      'CTA가 간단하고 다시 쓸 수 있음',
      '다음 행동이 분명함',
    ],
    role: 'cta',
    sceneIndex: 2,
    shootingDirections: [
      'End on the finished meal',
      'Say one reusable takeaway',
      'Leave space for the caption',
    ],
    shootingDirectionsKo: [
      '완성된 한 끼로 마무리한다',
      '다시 쓸 수 있는 한 문장을 말한다',
      '자막이 들어갈 여백을 남긴다',
    ],
    speakingLine: 'Build one meal you will want again this week.',
    speakingLineKo: '이번 주에 또 먹고 싶은 한 끼 만들기.',
    startSeconds: 25,
  },
];

export function createShootBoardRecipe(
  recipe: NativeRecipe,
  options: CreateShootBoardRecipeOptions = {}
): ShootBoardRecipe {
  const shotCutIds = new Set(options.shotCutIds ?? []);
  const cuts = recipe.id === 'recipe-korean-diet-hook'
    ? createKoreanDietViralCuts(recipe, shotCutIds)
    : recipe.scenes.map((scene, index) => createShootBoardCutFromScene(recipe, scene, index, shotCutIds));

  return {
    cuts,
    id: recipe.id,
    isSaved: options.isSaved ?? true,
    shotCount: getShotCount(cuts),
    title: getShootBoardTitle(recipe),
    totalCuts: cuts.length,
    totalDurationSeconds: getShootBoardTotalDuration(recipe, cuts),
  };
}

export function toggleShootBoardCutStatus(board: ShootBoardRecipe, cutId: string): ShootBoardRecipe {
  const cuts = board.cuts.map((cut) => (cut.id === cutId ? { ...cut, isShot: !cut.isShot } : cut));

  return {
    ...board,
    cuts,
    shotCount: getShotCount(cuts),
  };
}

export function createAddedShootBoardCut(board: ShootBoardRecipe, instruction = roleCopy.custom.instruction): ShootBoardCut {
  const order = board.cuts.length + 1;
  const startSeconds = board.cuts.reduce((total, cut) => total + cut.durationSeconds, 0);

  return {
    durationSeconds: 5,
    id: `custom-cut-${Date.now()}`,
    instruction,
    instructionKo: roleCopy.custom.instructionKo,
    isShot: false,
    order,
    prompterLine: roleCopy.custom.speakingLineKo,
    requiredChecks: ['Main line is ready', 'Action is clear', 'Lighting is stable'],
    requiredChecksKo: ['말할 문장이 준비됨', '해야 할 행동이 분명함', '밝기와 초점이 안정적임'],
    role: 'custom',
    roleLabel: roleCopy.custom.label,
    shootingDirections: ['Add one action cue', 'Keep the shot short', 'End with a clean pause'],
    shootingDirectionsKo: ['행동 지시를 하나 추가한다', '컷을 짧게 유지한다', '마지막에 짧게 멈춘다'],
    speakingLine: roleCopy.custom.speakingLine,
    speakingLineKo: roleCopy.custom.speakingLineKo,
    thumbnailUrl: board.cuts[board.cuts.length - 1]?.thumbnailUrl ?? '',
    timeRangeLabel: createTimeRangeLabel(startSeconds, startSeconds + 5),
  };
}

export function appendShootBoardCut(board: ShootBoardRecipe, cut: ShootBoardCut): ShootBoardRecipe {
  const cuts = [...board.cuts, cut].map((item, index) => ({
    ...item,
    order: index + 1,
  }));

  return {
    ...board,
    cuts,
    shotCount: getShotCount(cuts),
    totalCuts: cuts.length,
    totalDurationSeconds: board.totalDurationSeconds + cut.durationSeconds,
  };
}

export function getShootBoardHref(recipeId: string) {
  return `/recipe/${recipeId}`;
}

export function getRecipePrompterHref(recipeId: string, sceneId?: string) {
  return sceneId ? `/recipe/${recipeId}/prompter?sceneId=${sceneId}` : `/recipe/${recipeId}/prompter`;
}

function createKoreanDietViralCuts(recipe: NativeRecipe, shotCutIds: Set<string>) {
  return koreanDietCutDefinitions.map((definition, index) => {
    const scene = recipe.scenes[Math.min(definition.sceneIndex, recipe.scenes.length - 1)] ?? recipe.scenes[0];
    const id = definition.idSuffix ? `${scene?.id ?? 'scene'}-${definition.idSuffix}` : `${scene?.id ?? 'scene'}-cut-${index + 1}`;

    return createShootBoardCut({
      definition,
      id,
      isShot: shotCutIds.has(id) || (scene ? shotCutIds.has(scene.id) : false),
      order: index + 1,
      recipe,
      scene,
    });
  });
}

function createShootBoardCut({
  definition,
  id,
  isShot,
  order,
  recipe,
  scene,
}: {
  definition: CutDefinition;
  id: string;
  isShot: boolean;
  order: number;
  recipe: NativeRecipe;
  scene?: NativeRecipeScene;
}): ShootBoardCut {
  const roleDefinition = roleCopy[definition.role];

  return {
    durationSeconds: definition.durationSeconds,
    id,
    instruction: definition.instruction,
    instructionKo: definition.instructionKo,
    isShot,
    order,
    prompterLine: definition.speakingLineKo,
    referenceVideoUrl: recipe.sourceUrl,
    requiredChecks: definition.requiredChecks,
    requiredChecksKo: definition.requiredChecksKo,
    role: definition.role,
    roleLabel: roleDefinition.label,
    sceneId: scene?.id,
    shootingDirections: definition.shootingDirections,
    shootingDirectionsKo: definition.shootingDirectionsKo,
    speakingLine: definition.speakingLine,
    speakingLineKo: definition.speakingLineKo,
    thumbnailUrl: scene?.thumbnail || recipe.thumbnail,
    timeRangeLabel: createTimeRangeLabel(definition.startSeconds, definition.startSeconds + definition.durationSeconds),
  };
}

function createShootBoardCutFromScene(
  recipe: NativeRecipe,
  scene: NativeRecipeScene,
  index: number,
  shotCutIds: Set<string>
): ShootBoardCut {
  const role = getRoleForScene(index, recipe.scenes.length);
  const roleDefinition = roleCopy[role];
  const durationSeconds = getSceneDurationSeconds(scene);
  const speakingLine = getPrompterLine(scene, role);

  return {
    durationSeconds,
    id: scene.id,
    instruction: scene.recipe.appealPoint || scene.recipe.objective || scene.summary || roleDefinition.instruction,
    instructionKo: roleDefinition.instructionKo,
    isShot: shotCutIds.has(scene.id),
    order: index + 1,
    prompterLine: speakingLine,
    referenceVideoUrl: recipe.sourceUrl,
    requiredChecks: getRequiredChecks(scene, role),
    requiredChecksKo: getRequiredChecksKo(role),
    role,
    roleLabel: roleDefinition.label,
    sceneId: scene.id,
    shootingDirections: getShootingDirections(scene, role),
    shootingDirectionsKo: getShootingDirectionsKo(role),
    speakingLine,
    speakingLineKo: speakingLine,
    thumbnailUrl: scene.thumbnail || recipe.thumbnail,
    timeRangeLabel: getSceneTimeRangeLabel(scene),
  };
}

function getShootBoardTitle(recipe: NativeRecipe) {
  if (recipe.id === 'recipe-korean-diet-hook') {
    return 'Korean Diet Viral Recipe';
  }

  return recipe.title;
}

function getShootBoardTotalDuration(recipe: NativeRecipe, cuts: ShootBoardCut[]) {
  if (recipe.id === 'recipe-korean-diet-hook') {
    return 40;
  }

  return cuts.reduce((total, cut) => total + cut.durationSeconds, 0);
}

function getRoleForScene(index: number, totalScenes: number): ShootBoardCutRole {
  if (index === 0) return 'hook';
  if (index === totalScenes - 1) return 'cta';
  if (index === 1) return 'proof';
  return 'scene';
}

function getPrompterLine(scene: NativeRecipeScene, role: ShootBoardCutRole) {
  return (
    scene.recipe.keyLine?.trim()
    || scene.prompter.blocks[0]?.content?.trim()
    || scene.recipe.scriptLines[0]?.trim()
    || roleCopy[role].speakingLine
  );
}

function getShootingDirections(scene: NativeRecipeScene, role: ShootBoardCutRole) {
  return [
    scene.recipe.keyAction || scene.analysis.motionDescription || roleCopy[role].instruction,
    scene.recipe.mustInclude[0] || 'Keep the action clear and centered',
    scene.recipe.mustAvoid[0] ? `Avoid: ${scene.recipe.mustAvoid[0]}` : 'Hold the final beat',
  ].filter(Boolean);
}

function getShootingDirectionsKo(role: ShootBoardCutRole) {
  if (role === 'hook') {
    return ['결과를 먼저 보여준다', '첫 장면은 클로즈업으로 시작한다', '설명보다 결과 문장을 먼저 말한다'];
  }

  if (role === 'proof') {
    return ['증거가 되는 장면을 보여준다', '손과 제품을 프레임 안에 둔다', '중간 공백 없이 이어간다'];
  }

  if (role === 'cta') {
    return ['마지막 결과를 한 번 더 보여준다', '다음 행동을 짧게 말한다', '자막이 들어갈 여백을 남긴다'];
  }

  return ['핵심 행동을 한 번에 보여준다', '컷을 짧고 분명하게 유지한다', '흔들림을 줄인다'];
}

function getRequiredChecks(scene: NativeRecipeScene, role: ShootBoardCutRole) {
  return [
    scene.recipe.mustInclude[0] || 'Main subject is visible',
    role === 'hook' ? 'Payoff appears within 1 second' : 'Action is easy to understand',
    'Lighting and focus are stable',
  ];
}

function getRequiredChecksKo(role: ShootBoardCutRole) {
  return [
    role === 'hook' ? '결과가 1초 안에 보임' : '핵심 행동이 화면에 보임',
    '말할 문장이 준비됨',
    '밝기와 초점이 안정적임',
  ];
}

function getShotCount(cuts: ShootBoardCut[]) {
  return cuts.filter((cut) => cut.isShot).length;
}

function getSceneDurationSeconds(scene: NativeRecipeScene) {
  const start = parseTimestamp(scene.startTime);
  const end = parseTimestamp(scene.endTime);

  if (end > start) {
    return Math.max(1, end - start);
  }

  return 5;
}

function getSceneTimeRangeLabel(scene: NativeRecipeScene) {
  const start = parseTimestamp(scene.startTime);
  const end = parseTimestamp(scene.endTime);

  if (end > start) {
    return createTimeRangeLabel(start, end);
  }

  return createTimeRangeLabel(0, 5);
}

function parseTimestamp(timestamp: string) {
  const parts = timestamp.split(':').map((part) => Number(part));

  if (parts.some((part) => !Number.isFinite(part))) {
    return 0;
  }

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }

  return parts[0] ?? 0;
}

function createTimeRangeLabel(startSeconds: number, endSeconds: number) {
  return `${formatSeconds(startSeconds)}–${formatSeconds(endSeconds)}`;
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.max(0, Math.floor(seconds % 60));

  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}
