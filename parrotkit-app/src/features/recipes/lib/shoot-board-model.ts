import type { NativeRecipe, NativeRecipeScene } from '@/features/recipes/types/recipe-domain';

export type ShootBoardCutRole = 'hook' | 'proof' | 'cta' | 'custom';

export type ShootBoardCut = {
  id: string;
  order: number;
  role: ShootBoardCutRole;
  roleLabel: string;
  durationSeconds: number;
  timeRangeLabel: string;
  instruction: string;
  prompterLine: string;
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

const roleByIndex: ShootBoardCutRole[] = ['hook', 'proof', 'cta'];

const roleCopy: Record<ShootBoardCutRole, { instruction: string; label: string; prompterLine: string }> = {
  hook: {
    instruction: 'Lead with the payoff.',
    label: 'HOOK',
    prompterLine: '이렇게 먹으니까 오래 갔어요.',
  },
  proof: {
    instruction: 'Show texture and speed.',
    label: 'PROOF',
    prompterLine: '20분 고단백, 부담 없는 한 끼.',
  },
  cta: {
    instruction: 'End with a reusable takeaway.',
    label: 'CTA',
    prompterLine: '이번 주에 또 먹고 싶은 한 끼 만들기.',
  },
  custom: {
    instruction: 'Add a clear filming cue.',
    label: 'CUSTOM',
    prompterLine: '촬영할 문장을 입력하세요.',
  },
};

export function createShootBoardRecipe(
  recipe: NativeRecipe,
  options: CreateShootBoardRecipeOptions = {}
): ShootBoardRecipe {
  const shotCutIds = new Set(options.shotCutIds ?? []);
  const cuts = recipe.scenes.map((scene, index) => createShootBoardCutFromScene(recipe, scene, index, shotCutIds));
  const totalDurationSeconds = Math.max(
    cuts.reduce((total, cut) => total + cut.durationSeconds, 0),
    cuts.length * 10
  );

  return {
    cuts,
    id: recipe.id,
    isSaved: options.isSaved ?? true,
    shotCount: getShotCount(cuts),
    title: recipe.title,
    totalCuts: cuts.length,
    totalDurationSeconds,
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

  return {
    durationSeconds: 5,
    id: `custom-cut-${Date.now()}`,
    instruction,
    isShot: false,
    order,
    prompterLine: roleCopy.custom.prompterLine,
    role: 'custom',
    roleLabel: roleCopy.custom.label,
    thumbnailUrl: board.cuts[board.cuts.length - 1]?.thumbnailUrl ?? '',
    timeRangeLabel: createTimeRangeLabel((order - 1) * 5, order * 5),
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
    totalDurationSeconds: Math.max(
      cuts.reduce((total, item) => total + item.durationSeconds, 0),
      cuts.length * 10
    ),
  };
}

export function getShootBoardHref(recipeId: string) {
  return `/recipe/${recipeId}`;
}

export function getRecipePrompterHref(recipeId: string, sceneId?: string) {
  return sceneId ? `/recipe/${recipeId}/prompter?sceneId=${sceneId}` : `/recipe/${recipeId}/prompter`;
}

function createShootBoardCutFromScene(
  recipe: NativeRecipe,
  scene: NativeRecipeScene,
  index: number,
  shotCutIds: Set<string>
): ShootBoardCut {
  const role = roleByIndex[index] ?? 'custom';
  const roleDefinition = roleCopy[role];
  const durationSeconds = getSceneDurationSeconds(scene);

  return {
    durationSeconds,
    id: scene.id,
    instruction: getInstruction(recipe, scene, role),
    isShot: shotCutIds.has(scene.id),
    order: index + 1,
    prompterLine: getPrompterLine(recipe, scene, role),
    referenceVideoUrl: recipe.sourceUrl,
    role,
    roleLabel: roleDefinition.label,
    sceneId: scene.id,
    thumbnailUrl: scene.thumbnail || recipe.thumbnail,
    timeRangeLabel: getSceneTimeRangeLabel(scene),
  };
}

function getInstruction(recipe: NativeRecipe, scene: NativeRecipeScene, role: ShootBoardCutRole) {
  if (recipe.id === 'recipe-korean-diet-hook' && role in roleCopy) {
    return roleCopy[role].instruction;
  }

  return scene.recipe.appealPoint || scene.recipe.objective || scene.summary || roleCopy[role].instruction;
}

function getPrompterLine(recipe: NativeRecipe, scene: NativeRecipeScene, role: ShootBoardCutRole) {
  if (recipe.id === 'recipe-korean-diet-hook' && role in roleCopy) {
    return roleCopy[role].prompterLine;
  }

  return scene.recipe.keyLine || scene.prompter.blocks[0]?.content || roleCopy[role].prompterLine;
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
