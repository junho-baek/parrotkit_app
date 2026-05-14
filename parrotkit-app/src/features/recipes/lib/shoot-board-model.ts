import { ugcMedia } from "@/core/mocks/ugc-media";
import type { ImageSourcePropType } from "react-native";
import type {
  NativeRecipe,
  NativeRecipeScene,
} from "@/features/recipes/types/recipe-domain";

export type ShootBoardCutRole = "hook" | "proof" | "scene" | "cta" | "custom";

export type ShootBoardTakeStatus = "none" | "saved" | "final" | "needs_reshoot";

export type ShootBoardTake = {
  id: string;
  label: string;
  durationSeconds: number;
  recordedAtLabel: string;
  status: Exclude<ShootBoardTakeStatus, "none">;
};

export type ShootBoardRecipeSummary = {
  recipeType: string;
  recipeTypeKo: string;
  whenToUse: string;
  whenToUseKo: string;
  hookType: string;
  hookTypeKo: string;
  visualStyle: string;
  visualStyleKo: string;
  bestUseCases: string[];
  bestUseCasesKo: string[];
  totalScenes: number;
  estimatedLengthSeconds: number;
};

export type ShootBoardChecklistItem = {
  id: string;
  label: string;
  labelKo: string;
  checked: boolean;
};

export type ShootBoardCutCompletionState = "none" | "partial" | "complete";

export type ShootBoardCut = {
  id: string;
  order: number;
  role: ShootBoardCutRole;
  roleLabel: string;
  hook: string;
  lineToSay: string;
  shotAction: string;
  note: string;
  durationSeconds: number;
  timeRangeLabel: string;
  title: string;
  titleKo: string;
  instruction: string;
  instructionKo: string;
  purpose: string;
  purposeKo: string;
  templateLine: string;
  templateLineKo: string;
  shootingGuideline: string;
  shootingGuidelineKo: string;
  requiredChecklist: ShootBoardChecklistItem[];
  takes: ShootBoardTake[];
  finalTakeId?: string;
  takeStatus: ShootBoardTakeStatus;
  speakingLine: string;
  speakingLineKo?: string;
  prompterLine: string;
  shootingDirections: string[];
  shootingDirectionsKo?: string[];
  requiredChecks: string[];
  requiredChecksKo?: string[];
  thumbnailSource?: ImageSourcePropType;
  thumbnailUrl: string;
  takeThumbnailUrl?: string;
  takeThumbnailSource?: ImageSourcePropType;
  referenceVideoUrl?: string | number;
  isShot: boolean;
  shotCount?: number;
  notes?: string;
  sceneId?: string;
};

export type ShootBoardRecipe = {
  id: string;
  title: string;
  summary: ShootBoardRecipeSummary;
  totalCuts: number;
  totalDurationSeconds: number;
  shotCount: number;
  isSaved: boolean;
  cuts: ShootBoardCut[];
};

export type ShootBoardCutTextPatch = {
  hook?: string;
  instruction?: string;
  instructionKo?: string;
  lineToSay?: string;
  note?: string;
  requiredChecklist?: Array<{
    id: string;
    label?: string;
    labelKo?: string;
  }>;
  shotAction?: string;
  shootingGuideline?: string;
  shootingGuidelineKo?: string;
  speakingLine?: string;
  speakingLineKo?: string;
  roleLabel?: string;
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

type ChecklistDefinition = {
  id: string;
  label: string;
  labelKo: string;
};

type CutDefinition = {
  durationSeconds: number;
  finalTakeId?: string;
  idSuffix?: string;
  instruction: string;
  instructionKo: string;
  purpose: string;
  purposeKo: string;
  referenceThumbnailUrl?: string;
  referenceThumbnailSource?: ImageSourcePropType;
  requiredChecklist: ChecklistDefinition[];
  role: ShootBoardCutRole;
  sceneIndex: number;
  shootingGuideline: string;
  shootingGuidelineKo: string;
  speakingLine: string;
  speakingLineKo: string;
  startSeconds: number;
  takeThumbnailUrl?: string;
  takeThumbnailSource?: ImageSourcePropType;
  takeStatus?: ShootBoardTakeStatus;
  takes?: ShootBoardTake[];
  templateLine: string;
  templateLineKo: string;
};

const roleCopy: Record<ShootBoardCutRole, RoleCopy> = {
  hook: {
    instruction: "Lead with the payoff.",
    instructionKo: "결과를 먼저 보여준다.",
    label: "Hook",
    speakingLine: "Here is the {payoff/result} before anything else.",
    speakingLineKo: "먼저 {payoff/result}를 보여주세요.",
  },
  proof: {
    instruction: "Show the proof visual.",
    instructionKo: "증거 장면을 보여준다.",
    label: "Proof",
    speakingLine: "The proof is visible when {proof visual} appears.",
    speakingLineKo: "{proof visual}이 보이면 증거가 됩니다.",
  },
  scene: {
    instruction: "Show the repeatable method.",
    instructionKo: "반복 가능한 방법을 보여준다.",
    label: "Demonstration",
    speakingLine:
      "This is the simple order that moves {before state} to {after state}.",
    speakingLineKo:
      "{before state}에서 {after state}로 가는 간단한 순서입니다.",
  },
  cta: {
    instruction: "Ask for the next action.",
    instructionKo: "다음 행동을 요청한다.",
    label: "CTA",
    speakingLine: "Save this when {target viewer} wants {payoff/result}.",
    speakingLineKo:
      "{target viewer}가 {payoff/result}를 원할 때 저장하게 하세요.",
  },
  custom: {
    instruction: "Add a clear filming cue.",
    instructionKo: "새 촬영 지시를 추가한다.",
    label: "Scene",
    speakingLine: "Add the reusable line you want to say.",
    speakingLineKo: "다시 쓸 수 있는 촬영 문장을 입력하세요.",
  },
};

const reusableRecipeSummary: ShootBoardRecipeSummary = {
  bestUseCases: [
    "Before-after proof",
    "Result-led product demos",
    "Fast repeatable UGC shoots",
  ],
  bestUseCasesKo: [
    "비포/애프터 증거",
    "결과 중심 제품 데모",
    "빠르게 반복하는 UGC 촬영",
  ],
  estimatedLengthSeconds: 40,
  hookType: "Payoff first",
  hookTypeKo: "결과 선공개",
  recipeType: "Payoff-first proof recipe",
  recipeTypeKo: "결과 선공개 증거형 레시피",
  totalScenes: 4,
  visualStyle: "Close proof, simple action, clear final frame",
  visualStyleKo: "가까운 증거 컷, 단순한 행동, 명확한 마지막 프레임",
  whenToUse:
    "Use when {target viewer} needs to see the result before the explanation.",
  whenToUseKo: "{target viewer}가 설명보다 결과를 먼저 봐야 할 때 사용합니다.",
};

const defaultRecipeSummary: ShootBoardRecipeSummary = {
  bestUseCases: ["Reusable scene planning", "Prompter-led shooting"],
  bestUseCasesKo: ["반복 가능한 장면 기획", "프롬프터 기반 촬영"],
  estimatedLengthSeconds: 0,
  hookType: "Scene-led",
  hookTypeKo: "장면 중심",
  recipeType: "Reusable shooting recipe",
  recipeTypeKo: "재사용 촬영 레시피",
  totalScenes: 0,
  visualStyle: "Clear action with a steady frame",
  visualStyleKo: "안정적인 프레임의 명확한 행동",
  whenToUse: "Use when a shoot needs reusable scene structure.",
  whenToUseKo: "촬영에 재사용 가능한 장면 구조가 필요할 때 사용합니다.",
};

const koreanDietCutDefinitions: CutDefinition[] = [
  {
    durationSeconds: 5,
    instruction: "Lead with the payoff.",
    instructionKo: "결과를 먼저 보여준다.",
    purpose:
      "Stop the scroll by showing {payoff/result} before explaining {product}.",
    purposeKo:
      "{product}를 설명하기 전에 {payoff/result}를 보여줘 스크롤을 멈춥니다.",
    requiredChecklist: [
      {
        id: "hook-payoff-visible",
        label: "{payoff/result} is visible in the first beat",
        labelKo: "첫 박자에 {payoff/result}가 보임",
      },
      {
        id: "hook-main-item-framed",
        label: "{main item} is centered and readable",
        labelKo: "{main item}이 중앙에서 분명히 보임",
      },
      {
        id: "hook-line-ready",
        label: "Opening line names the result without extra context",
        labelKo: "첫 문장이 추가 설명 없이 결과를 말함",
      },
    ],
    referenceThumbnailSource: ugcMedia.foodPromo.image,
    role: "hook",
    sceneIndex: 0,
    shootingGuideline:
      "Open on the final-looking frame, hold for one beat, then say the result plainly.",
    shootingGuidelineKo:
      "완성된 느낌의 프레임으로 시작해 한 박자 유지한 뒤 결과를 짧게 말합니다.",
    speakingLine: "Here is the {payoff/result} from {product}.",
    speakingLineKo: "{product}로 만든 {payoff/result}입니다.",
    startSeconds: 0,
    takeThumbnailSource: ugcMedia.beautyHero.image,
    templateLine:
      'Start with {payoff/result}: "{product} helped me get {payoff/result} without the usual {before state}."',
    templateLineKo:
      '{payoff/result}로 시작: "{product} 덕분에 평소의 {before state} 없이 {payoff/result}를 얻었어요."',
  },
  {
    durationSeconds: 8,
    instruction: "Show the proof visual.",
    instructionKo: "증거 장면을 보여준다.",
    purpose:
      "Make the claim believable by showing {proof visual} close enough to inspect.",
    purposeKo:
      "확인할 수 있을 만큼 가까운 {proof visual}로 주장을 믿게 만듭니다.",
    requiredChecklist: [
      {
        id: "proof-visual-clear",
        label: "{proof visual} is sharp and fills the frame",
        labelKo: "{proof visual}이 선명하고 화면을 채움",
      },
      {
        id: "proof-before-after",
        label: "{before state} and {after state} are easy to compare",
        labelKo: "{before state}와 {after state} 비교가 쉬움",
      },
      {
        id: "proof-no-gap",
        label: "No long pause before the proof appears",
        labelKo: "증거가 나오기 전 긴 공백이 없음",
      },
    ],
    referenceThumbnailSource: ugcMedia.foodPromo.image,
    role: "proof",
    sceneIndex: 1,
    shootingGuideline:
      "Move from {before state} into {proof visual}, then hold the clearest proof frame.",
    shootingGuidelineKo:
      "{before state}에서 {proof visual}로 이동한 뒤 가장 선명한 증거 프레임을 유지합니다.",
    speakingLine: "The proof is {proof visual}.",
    speakingLineKo: "증거는 {proof visual}입니다.",
    startSeconds: 5,
    takeThumbnailSource: ugcMedia.beautyResult.image,
    takeStatus: "saved",
    takes: [
      {
        durationSeconds: 8,
        id: "proof-take-1",
        label: "Proof take 1",
        recordedAtLabel: "Saved draft",
        status: "saved",
      },
      {
        durationSeconds: 8,
        id: "proof-take-2",
        label: "Proof take 2",
        recordedAtLabel: "Saved draft",
        status: "saved",
      },
    ],
    templateLine:
      'Cut to {proof visual}: "You can see the difference from {before state} to {after state}."',
    templateLineKo:
      '{proof visual}로 컷: "{before state}에서 {after state}로 달라진 게 보여요."',
  },
  {
    durationSeconds: 12,
    instruction: "Show the repeatable method.",
    instructionKo: "반복 가능한 방법을 보여준다.",
    purpose:
      "Show the exact action pattern so {target viewer} can repeat the result with {product}.",
    purposeKo:
      "{target viewer}가 {product}로 결과를 반복할 수 있도록 정확한 행동 순서를 보여줍니다.",
    requiredChecklist: [
      {
        id: "demo-main-action",
        label: "Each action with {main item} is visible",
        labelKo: "{main item}을 쓰는 각 행동이 보임",
      },
      {
        id: "demo-order-clear",
        label: "The order from {before state} to {after state} is clear",
        labelKo: "{before state}에서 {after state}까지의 순서가 분명함",
      },
      {
        id: "demo-one-action",
        label: "Each shot contains one main action",
        labelKo: "각 컷에 핵심 행동이 하나만 있음",
      },
    ],
    referenceThumbnailSource: ugcMedia.foodPromo.image,
    role: "scene",
    sceneIndex: 1,
    shootingGuideline:
      "Film the repeatable steps in order, with one clean action per shot.",
    shootingGuidelineKo:
      "반복 가능한 단계를 순서대로 찍고, 각 컷에는 행동 하나만 담습니다.",
    speakingLine:
      "Repeat it in this order: {before state}, {main item}, then {after state}.",
    speakingLineKo:
      "{before state}, {main item}, {after state} 순서로 반복하세요.",
    startSeconds: 13,
    takeThumbnailSource: ugcMedia.appDemo.image,
    templateLine:
      'Show the method: "{before state} first, then {main item}, then the {after state} payoff."',
    templateLineKo:
      '방법 보여주기: "먼저 {before state}, 다음 {main item}, 마지막은 {after state} 결과입니다."',
  },
  {
    durationSeconds: 5,
    instruction: "Ask for the next action.",
    instructionKo: "다음 행동을 요청한다.",
    purpose:
      "Turn the reusable pattern into a clear next step for {target viewer}.",
    purposeKo:
      "재사용 가능한 패턴을 {target viewer}의 명확한 다음 행동으로 연결합니다.",
    requiredChecklist: [
      {
        id: "cta-final-frame",
        label: "Final frame holds {after state} for one beat",
        labelKo: "마지막 프레임에서 {after state}를 한 박자 유지",
      },
      {
        id: "cta-next-action",
        label: "CTA tells {target viewer} exactly what to do next",
        labelKo: "CTA가 {target viewer}의 다음 행동을 정확히 말함",
      },
      {
        id: "cta-caption-space",
        label: "Frame leaves space for caption or button",
        labelKo: "자막이나 버튼이 들어갈 여백이 있음",
      },
    ],
    referenceThumbnailSource: ugcMedia.foodPromo.image,
    role: "cta",
    sceneIndex: 2,
    shootingGuideline:
      "End on {after state}, pause, then give one simple save/share/try instruction.",
    shootingGuidelineKo:
      "{after state}로 끝내고 잠깐 멈춘 뒤 저장/공유/시도 중 하나의 행동을 요청합니다.",
    speakingLine: "Save this for the next time you want {payoff/result}.",
    speakingLineKo: "다음에 {payoff/result}가 필요할 때 저장하세요.",
    startSeconds: 25,
    takeThumbnailSource: ugcMedia.beautyResult.image,
    takeStatus: "needs_reshoot",
    takes: [
      {
        durationSeconds: 5,
        id: "cta-take-1",
        label: "CTA take 1",
        recordedAtLabel: "Needs retake",
        status: "needs_reshoot",
      },
    ],
    templateLine:
      'End with {after state}: "Save this when you want {payoff/result} for {target viewer}."',
    templateLineKo:
      '{after state}로 마무리: "{target viewer}에게 {payoff/result}가 필요할 때 저장하세요."',
  },
];

export function createShootBoardRecipe(
  recipe: NativeRecipe,
  options: CreateShootBoardRecipeOptions = {},
): ShootBoardRecipe {
  const shotCutIds = new Set(options.shotCutIds ?? []);
  const cuts =
    recipe.id === "recipe-korean-diet-hook"
      ? createKoreanDietViralCuts(recipe, shotCutIds)
      : recipe.scenes.map((scene, index) =>
          createShootBoardCutFromScene(recipe, scene, index, shotCutIds),
        );
  const totalDurationSeconds = getShootBoardTotalDuration(recipe, cuts);

  return {
    cuts,
    id: recipe.id,
    isSaved: options.isSaved ?? true,
    shotCount: getShotCount(cuts),
    summary: getShootBoardSummary(recipe, cuts, totalDurationSeconds),
    title: getShootBoardTitle(recipe),
    totalCuts: cuts.length,
    totalDurationSeconds,
  };
}

export function getShootBoardCutCompletionState(
  cut: ShootBoardCut,
): ShootBoardCutCompletionState {
  if (cut.requiredChecklist.length === 0) {
    return cut.isShot ? "complete" : "none";
  }

  const checkedCount = cut.requiredChecklist.filter(
    (item) => item.checked,
  ).length;

  if (checkedCount === 0) return "none";
  if (checkedCount === cut.requiredChecklist.length) return "complete";
  return "partial";
}

export function setShootBoardCutCompletion(
  board: ShootBoardRecipe,
  cutId: string,
  checked: boolean,
): ShootBoardRecipe {
  const cuts = board.cuts.map((cut) => {
    if (cut.id !== cutId) return cut;

    const requiredChecklist = cut.requiredChecklist.map((item) => ({
      ...item,
      checked,
    }));

    return syncLegacyChecks({
      ...cut,
      isShot: checked,
      requiredChecklist,
    });
  });

  return updateBoardCuts(board, cuts);
}

export function setShootBoardChecklistItem(
  board: ShootBoardRecipe,
  cutId: string,
  checklistItemId: string,
  checked: boolean,
): ShootBoardRecipe {
  const cuts = board.cuts.map((cut) => {
    if (cut.id !== cutId) return cut;

    const requiredChecklist = cut.requiredChecklist.map((item) =>
      item.id === checklistItemId ? { ...item, checked } : item,
    );
    const isShot =
      requiredChecklist.length > 0 &&
      requiredChecklist.every((item) => item.checked);

    return syncLegacyChecks({
      ...cut,
      isShot,
      requiredChecklist,
    });
  });

  return updateBoardCuts(board, cuts);
}

export function selectShootBoardFinalTake(
  board: ShootBoardRecipe,
  cutId: string,
  takeId: string,
): ShootBoardRecipe {
  const cuts = board.cuts.map((cut): ShootBoardCut => {
    if (cut.id !== cutId || !cut.takes.some((take) => take.id === takeId))
      return cut;

    return {
      ...cut,
      finalTakeId: takeId,
      takeStatus: "final",
      takes: cut.takes.map((take) => ({
        ...take,
        status:
          take.id === takeId
            ? "final"
            : normalizeNonFinalTakeStatus(take.status),
      })),
    };
  });

  return updateBoardCuts(board, cuts);
}

export function reorderShootBoardCuts(
  board: ShootBoardRecipe,
  cutId: string,
  targetOrder: number,
): ShootBoardRecipe {
  const orderedCuts = [...board.cuts].sort((a, b) => a.order - b.order);
  const currentIndex = orderedCuts.findIndex((cut) => cut.id === cutId);
  if (currentIndex < 0) return board;

  const nextCuts = [...orderedCuts];
  const [movedCut] = nextCuts.splice(currentIndex, 1);
  const targetIndex = Math.min(Math.max(targetOrder - 1, 0), nextCuts.length);
  nextCuts.splice(targetIndex, 0, movedCut);

  return updateBoardCuts(
    board,
    nextCuts.map((cut, index) => renumberShootBoardCut(cut, index + 1)),
  );
}

export function replaceShootBoardCutOrder(
  board: ShootBoardRecipe,
  orderedCuts: ShootBoardCut[],
): ShootBoardRecipe {
  if (orderedCuts.length !== board.cuts.length) {
    return board;
  }

  const currentCutsById = new Map(board.cuts.map((cut) => [cut.id, cut]));
  const orderedCutIds = new Set(orderedCuts.map((cut) => cut.id));

  if (orderedCutIds.size !== board.cuts.length) {
    return board;
  }

  const nextCuts = orderedCuts.map((orderedCut, index) => {
    const currentCut = currentCutsById.get(orderedCut.id);
    return renumberShootBoardCut(currentCut ?? orderedCut, index + 1);
  });

  if (nextCuts.some((cut) => !currentCutsById.has(cut.id))) {
    return board;
  }

  return updateBoardCuts(board, nextCuts);
}

export function moveShootBoardCut(
  board: ShootBoardRecipe,
  cutId: string,
  direction: -1 | 1,
): ShootBoardRecipe {
  const orderedCuts = [...board.cuts].sort((a, b) => a.order - b.order);
  const currentIndex = orderedCuts.findIndex((cut) => cut.id === cutId);
  if (currentIndex < 0) return board;

  const targetOrder = currentIndex + 1 + direction;
  if (targetOrder < 1 || targetOrder > orderedCuts.length) return board;

  return reorderShootBoardCuts(board, cutId, targetOrder);
}

export function updateShootBoardCutText(
  board: ShootBoardRecipe,
  cutId: string,
  patch: ShootBoardCutTextPatch,
): ShootBoardRecipe {
  const cuts = board.cuts.map((cut) => {
    if (cut.id !== cutId) return cut;

    const requiredChecklist = patch.requiredChecklist
      ? cut.requiredChecklist.map((item) => {
          const itemPatch = patch.requiredChecklist?.find(
            (nextItem) => nextItem.id === item.id,
          );
          if (!itemPatch) return item;

          return {
            ...item,
            label: itemPatch.label ?? item.label,
            labelKo: itemPatch.labelKo ?? item.labelKo,
          };
        })
      : cut.requiredChecklist;

    const nextHook =
      patch.hook ?? patch.instruction ?? cut.hook ?? cut.instruction;
    const nextLineToSay =
      patch.lineToSay ??
      patch.speakingLine ??
      cut.lineToSay ??
      cut.speakingLine;
    const nextShotAction =
      patch.shotAction ??
      patch.shootingGuideline ??
      cut.shotAction ??
      cut.shootingGuideline;
    const nextNote = patch.note ?? cut.note ?? cut.notes ?? cut.purpose;

    return syncLegacyChecks({
      ...cut,
      hook: nextHook,
      instruction: nextHook,
      instructionKo: patch.instructionKo ?? cut.instructionKo,
      lineToSay: nextLineToSay,
      note: nextNote,
      notes: nextNote,
      prompterLine: patch.speakingLineKo ?? cut.prompterLine,
      requiredChecklist,
      shotAction: nextShotAction,
      shootingGuideline: nextShotAction,
      shootingGuidelineKo: patch.shootingGuidelineKo ?? cut.shootingGuidelineKo,
      speakingLine: nextLineToSay,
      speakingLineKo: patch.speakingLineKo ?? cut.speakingLineKo,
      ...(patch.roleLabel !== undefined
        ? {
            roleLabel: patch.roleLabel,
            title: createSceneTitle(cut.order, patch.roleLabel),
            titleKo: createSceneTitleKo(cut.order, patch.roleLabel),
          }
        : null),
    });
  });

  return updateBoardCuts(board, cuts);
}

export function resetShootBoardCut(
  board: ShootBoardRecipe,
  originalCut: ShootBoardCut,
): ShootBoardRecipe {
  const cuts = board.cuts.map((cut) => {
    if (cut.id !== originalCut.id) return cut;

    const requiredChecklist = cut.requiredChecklist.map((item, index) => {
      const originalItem =
        originalCut.requiredChecklist.find(
          (nextItem) => nextItem.id === item.id,
        ) ?? originalCut.requiredChecklist[index];

      return originalItem
        ? {
            ...item,
            label: originalItem.label,
            labelKo: originalItem.labelKo,
          }
        : item;
    });

    return syncLegacyChecks({
      ...cut,
      hook: originalCut.hook ?? originalCut.instruction,
      instruction: originalCut.instruction,
      instructionKo: originalCut.instructionKo,
      lineToSay: originalCut.lineToSay ?? originalCut.speakingLine,
      note: originalCut.note ?? originalCut.notes ?? originalCut.purpose,
      notes: originalCut.note ?? originalCut.notes ?? originalCut.purpose,
      prompterLine: originalCut.prompterLine,
      requiredChecklist,
      shotAction: originalCut.shotAction ?? originalCut.shootingGuideline,
      shootingGuideline: originalCut.shootingGuideline,
      shootingGuidelineKo: originalCut.shootingGuidelineKo,
      speakingLine: originalCut.speakingLine,
      speakingLineKo: originalCut.speakingLineKo,
      roleLabel: originalCut.roleLabel,
      templateLine: originalCut.templateLine,
      templateLineKo: originalCut.templateLineKo,
      title: createSceneTitle(cut.order, originalCut.roleLabel),
      titleKo: createSceneTitleKo(cut.order, originalCut.roleLabel),
    });
  });

  return updateBoardCuts(board, cuts);
}

export function toggleShootBoardCutStatus(
  board: ShootBoardRecipe,
  cutId: string,
): ShootBoardRecipe {
  const targetCut = board.cuts.find((cut) => cut.id === cutId);
  if (!targetCut) return board;

  return setShootBoardCutCompletion(board, cutId, !targetCut.isShot);
}

export function createAddedShootBoardCut(
  board: ShootBoardRecipe,
): ShootBoardCut {
  const order = board.cuts.length + 1;
  const startSeconds = board.cuts.reduce(
    (total, cut) => total + cut.durationSeconds,
    0,
  );
  const requiredChecklist = createRequiredChecklist(
    [
      {
        id: "custom-main-line",
        label: "",
        labelKo: "",
      },
      {
        id: "custom-action-clear",
        label: "",
        labelKo: "",
      },
      {
        id: "custom-lighting-stable",
        label: "",
        labelKo: "",
      },
    ],
    false,
  );

  return {
    durationSeconds: 5,
    finalTakeId: undefined,
    hook: "",
    id: `custom-cut-${Date.now()}`,
    instruction: "",
    instructionKo: "",
    isShot: false,
    lineToSay: "",
    note: "",
    notes: "",
    order,
    prompterLine: "",
    purpose: "",
    purposeKo: "",
    referenceVideoUrl: board.cuts[board.cuts.length - 1]?.referenceVideoUrl,
    requiredChecklist,
    requiredChecks: requiredChecklist.map((item) => item.label),
    requiredChecksKo: requiredChecklist.map((item) => item.labelKo),
    role: "custom",
    roleLabel: "",
    sceneId: board.cuts[board.cuts.length - 1]?.sceneId,
    shotAction: "",
    shootingDirections: [],
    shootingDirectionsKo: [],
    shootingGuideline: "",
    shootingGuidelineKo: "",
    speakingLine: "",
    speakingLineKo: "",
    takeStatus: "none",
    takeThumbnailSource: board.cuts[board.cuts.length - 1]?.takeThumbnailSource,
    takeThumbnailUrl: board.cuts[board.cuts.length - 1]?.takeThumbnailUrl,
    takes: [],
    templateLine: "",
    templateLineKo: "",
    thumbnailSource: board.cuts[board.cuts.length - 1]?.thumbnailSource,
    thumbnailUrl: board.cuts[board.cuts.length - 1]?.thumbnailUrl ?? "",
    timeRangeLabel: createTimeRangeLabel(startSeconds, startSeconds + 5),
    title: createSceneTitle(order, ""),
    titleKo: createSceneTitleKo(order, ""),
  };
}

export function appendShootBoardCut(
  board: ShootBoardRecipe,
  cut: ShootBoardCut,
): ShootBoardRecipe {
  const cuts = [...board.cuts, cut].map((item, index) =>
    renumberShootBoardCut(item, index + 1),
  );

  return updateBoardCuts(board, cuts);
}

export function getShootBoardFullScript(board: ShootBoardRecipe): string {
  return [...board.cuts]
    .sort((first, second) => first.order - second.order)
    .map((cut) => (cut.lineToSay || cut.speakingLine).trim())
    .filter(Boolean)
    .join("\n\n");
}

export function getShootBoardHref(recipeId: string) {
  return `/recipe/${recipeId}`;
}

export function getRecipePrompterHref(recipeId: string, sceneId?: string) {
  return sceneId
    ? `/recipe/${recipeId}/prompter?sceneId=${sceneId}`
    : `/recipe/${recipeId}/prompter`;
}

export function getRecipeRetakePrompterHref({
  cut,
  recipeId,
  take,
}: {
  cut: Pick<ShootBoardCut, "id" | "sceneId">;
  recipeId: string;
  take?: Pick<ShootBoardTake, "id">;
}) {
  const query = new URLSearchParams();

  if (cut.sceneId) {
    query.set("sceneId", cut.sceneId);
  }
  query.set("cutId", cut.id);

  if (take?.id) {
    query.set("retakeTakeId", take.id);
  }

  const queryString = query.toString();

  return queryString
    ? `/recipe/${recipeId}/prompter?${queryString}`
    : `/recipe/${recipeId}/prompter`;
}

function createKoreanDietViralCuts(
  recipe: NativeRecipe,
  shotCutIds: Set<string>,
) {
  return koreanDietCutDefinitions.map((definition, index) => {
    const scene =
      recipe.scenes[
        Math.min(definition.sceneIndex, recipe.scenes.length - 1)
      ] ?? recipe.scenes[0];
    const id = definition.idSuffix
      ? `${scene?.id ?? "scene"}-${definition.idSuffix}`
      : `${scene?.id ?? "scene"}-cut-${index + 1}`;

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
  const requiredChecklist = createRequiredChecklist(
    definition.requiredChecklist,
    isShot,
  );
  const takes = definition.takes ?? [];

  return {
    durationSeconds: definition.durationSeconds,
    finalTakeId: definition.finalTakeId,
    hook: definition.instruction,
    id,
    instruction: definition.instruction,
    instructionKo: definition.instructionKo,
    isShot,
    lineToSay: definition.speakingLine,
    note: definition.purpose,
    notes: definition.purpose,
    order,
    prompterLine: definition.speakingLineKo,
    purpose: definition.purpose,
    purposeKo: definition.purposeKo,
    referenceVideoUrl: recipe.referenceVideoSource ?? recipe.sourceUrl,
    requiredChecklist,
    requiredChecks: requiredChecklist.map((item) => item.label),
    requiredChecksKo: requiredChecklist.map((item) => item.labelKo),
    role: definition.role,
    roleLabel: roleDefinition.label,
    sceneId: scene?.id,
    shotAction: definition.shootingGuideline,
    shootingDirections: createShootingDirections(definition),
    shootingDirectionsKo: createShootingDirectionsKo(definition),
    shootingGuideline: definition.shootingGuideline,
    shootingGuidelineKo: definition.shootingGuidelineKo,
    speakingLine: definition.speakingLine,
    speakingLineKo: definition.speakingLineKo,
    takeStatus: definition.takeStatus ?? getInitialTakeStatus(takes),
    takes,
    templateLine: definition.templateLine,
    templateLineKo: definition.templateLineKo,
    takeThumbnailSource:
      definition.takeThumbnailSource ?? scene?.thumbnailSource ?? recipe.thumbnailSource,
    takeThumbnailUrl:
      definition.takeThumbnailUrl ?? scene?.thumbnail ?? recipe.thumbnail,
    thumbnailSource:
      definition.referenceThumbnailSource ?? scene?.thumbnailSource ?? recipe.thumbnailSource,
    thumbnailUrl:
      definition.referenceThumbnailUrl ?? scene?.thumbnail ?? recipe.thumbnail,
    timeRangeLabel: createTimeRangeLabel(
      definition.startSeconds,
      definition.startSeconds + definition.durationSeconds,
    ),
    title: createSceneTitle(order, roleDefinition.label),
    titleKo: createSceneTitleKo(order, roleDefinition.label),
  };
}

function createShootBoardCutFromScene(
  recipe: NativeRecipe,
  scene: NativeRecipeScene,
  index: number,
  shotCutIds: Set<string>,
): ShootBoardCut {
  const role = getRoleForScene(index, recipe.scenes.length);
  const roleDefinition = roleCopy[role];
  const durationSeconds = getSceneDurationSeconds(scene);
  const speakingLine = getPrompterLine(scene, role);
  const isShot = shotCutIds.has(scene.id);
  const requiredChecklist = createRequiredChecklist(
    getRequiredChecks(scene, role).map((label, itemIndex) => ({
      id: `${scene.id}-check-${itemIndex + 1}`,
      label,
      labelKo: getRequiredChecksKo(role)[itemIndex] ?? label,
    })),
    isShot,
  );
  const shootingDirections = getShootingDirections(scene, role);
  const shootingDirectionsKo = getShootingDirectionsKo(role);
  const hook =
    scene.recipe.appealPoint ||
    scene.recipe.objective ||
    scene.summary ||
    roleDefinition.instruction;
  const note =
    scene.recipe.objective ||
    `Show why {target viewer} should care about {payoff/result}.`;
  const shotAction = shootingDirections[0] ?? roleDefinition.instruction;

  return {
    durationSeconds,
    finalTakeId: undefined,
    hook,
    id: scene.id,
    instruction: hook,
    instructionKo: roleDefinition.instructionKo,
    isShot,
    lineToSay: speakingLine,
    note,
    notes: note,
    order: index + 1,
    prompterLine: speakingLine,
    purpose: note,
    purposeKo: roleDefinition.instructionKo,
    referenceVideoUrl: recipe.referenceVideoSource ?? recipe.sourceUrl,
    requiredChecklist,
    requiredChecks: requiredChecklist.map((item) => item.label),
    requiredChecksKo: requiredChecklist.map((item) => item.labelKo),
    role,
    roleLabel: roleDefinition.label,
    sceneId: scene.id,
    shotAction,
    shootingDirections,
    shootingDirectionsKo,
    shootingGuideline: shotAction,
    shootingGuidelineKo:
      shootingDirectionsKo[0] ?? roleDefinition.instructionKo,
    speakingLine,
    speakingLineKo: speakingLine,
    takeStatus: "none",
    takes: [],
    templateLine: speakingLine || roleDefinition.speakingLine,
    templateLineKo: speakingLine || roleDefinition.speakingLineKo,
    takeThumbnailSource: recipe.thumbnailSource,
    takeThumbnailUrl: recipe.thumbnail,
    thumbnailSource: scene.thumbnailSource ?? recipe.thumbnailSource,
    thumbnailUrl: scene.thumbnail || recipe.thumbnail,
    timeRangeLabel: getSceneTimeRangeLabel(scene),
    title: createSceneTitle(index + 1, roleDefinition.label),
    titleKo: createSceneTitleKo(index + 1, roleDefinition.label),
  };
}

function getShootBoardSummary(
  recipe: NativeRecipe,
  cuts: ShootBoardCut[],
  totalDurationSeconds: number,
): ShootBoardRecipeSummary {
  if (recipe.id === "recipe-korean-diet-hook") {
    return reusableRecipeSummary;
  }

  return {
    ...defaultRecipeSummary,
    estimatedLengthSeconds: totalDurationSeconds,
    totalScenes: cuts.length,
  };
}

function getShootBoardTitle(recipe: NativeRecipe) {
  if (recipe.id === "recipe-korean-diet-hook") {
    return recipe.title;
  }

  return recipe.title;
}

function getShootBoardTotalDuration(
  recipe: NativeRecipe,
  cuts: ShootBoardCut[],
) {
  if (recipe.id === "recipe-korean-diet-hook") {
    return 40;
  }

  return cuts.reduce((total, cut) => total + cut.durationSeconds, 0);
}

function updateBoardCuts(
  board: ShootBoardRecipe,
  cuts: ShootBoardCut[],
): ShootBoardRecipe {
  const totalDurationSeconds = getBoardTotalDuration(board, cuts);

  return {
    ...board,
    cuts,
    shotCount: getShotCount(cuts),
    summary: {
      ...board.summary,
      estimatedLengthSeconds: totalDurationSeconds,
      totalScenes: cuts.length,
    },
    totalCuts: cuts.length,
    totalDurationSeconds,
  };
}

function getBoardTotalDuration(board: ShootBoardRecipe, cuts: ShootBoardCut[]) {
  if (board.id === "recipe-korean-diet-hook") {
    const addedDurationSeconds = cuts
      .slice(reusableRecipeSummary.totalScenes)
      .reduce((total, cut) => total + cut.durationSeconds, 0);

    return reusableRecipeSummary.estimatedLengthSeconds + addedDurationSeconds;
  }

  return cuts.reduce((total, cut) => total + cut.durationSeconds, 0);
}

function renumberShootBoardCut(
  cut: ShootBoardCut,
  order: number,
): ShootBoardCut {
  return {
    ...cut,
    order,
    title: createSceneTitle(order, cut.roleLabel),
    titleKo: createSceneTitleKo(order, cut.roleLabel),
  };
}

function syncLegacyChecks(cut: ShootBoardCut): ShootBoardCut {
  return {
    ...cut,
    requiredChecks: cut.requiredChecklist.map((item) => item.label),
    requiredChecksKo: cut.requiredChecklist.map((item) => item.labelKo),
  };
}

function createRequiredChecklist(
  checklist: ChecklistDefinition[],
  checked: boolean,
): ShootBoardChecklistItem[] {
  return checklist.map((item) => ({
    ...item,
    checked,
  }));
}

function createShootingDirections(definition: CutDefinition) {
  return [
    definition.shootingGuideline,
    definition.purpose,
    definition.templateLine,
  ];
}

function createShootingDirectionsKo(definition: CutDefinition) {
  return [
    definition.shootingGuidelineKo,
    definition.purposeKo,
    definition.templateLineKo,
  ];
}

function normalizeNonFinalTakeStatus(
  status: Exclude<ShootBoardTakeStatus, "none">,
): Exclude<ShootBoardTakeStatus, "none"> {
  return status === "final" ? "saved" : status;
}

function getInitialTakeStatus(takes: ShootBoardTake[]): ShootBoardTakeStatus {
  if (takes.some((take) => take.status === "final")) return "final";
  if (takes.some((take) => take.status === "needs_reshoot"))
    return "needs_reshoot";
  if (takes.length > 0) return "saved";
  return "none";
}

function createSceneTitle(order: number, roleLabel: string) {
  return roleLabel ? `Cut #${order}: ${roleLabel}` : `Cut #${order}`;
}

function createSceneTitleKo(order: number, roleLabel: string) {
  return roleLabel ? `컷 #${order}: ${roleLabel}` : `컷 #${order}`;
}

function getRoleForScene(
  index: number,
  totalScenes: number,
): ShootBoardCutRole {
  if (index === 0) return "hook";
  if (index === totalScenes - 1) return "cta";
  if (index === 1) return "proof";
  return "scene";
}

function getPrompterLine(scene: NativeRecipeScene, role: ShootBoardCutRole) {
  return (
    scene.recipe.keyLine?.trim() ||
    scene.prompter.blocks[0]?.content?.trim() ||
    scene.recipe.scriptLines[0]?.trim() ||
    roleCopy[role].speakingLine
  );
}

function getShootingDirections(
  scene: NativeRecipeScene,
  role: ShootBoardCutRole,
) {
  return [
    scene.recipe.keyAction ||
      scene.analysis.motionDescription ||
      roleCopy[role].instruction,
    scene.recipe.mustInclude[0] || "Keep the action clear and centered",
    scene.recipe.mustAvoid[0]
      ? `Avoid: ${scene.recipe.mustAvoid[0]}`
      : "Hold the final beat",
  ].filter(Boolean);
}

function getShootingDirectionsKo(role: ShootBoardCutRole) {
  if (role === "hook") {
    return [
      "결과를 먼저 보여준다",
      "첫 장면은 클로즈업으로 시작한다",
      "설명보다 결과 문장을 먼저 말한다",
    ];
  }

  if (role === "proof") {
    return [
      "증거가 되는 장면을 보여준다",
      "손과 대상을 프레임 안에 둔다",
      "중간 공백 없이 이어간다",
    ];
  }

  if (role === "cta") {
    return [
      "마지막 결과를 한 번 더 보여준다",
      "다음 행동을 짧게 말한다",
      "자막이 들어갈 여백을 남긴다",
    ];
  }

  return [
    "핵심 행동을 한 번에 보여준다",
    "컷을 짧고 분명하게 유지한다",
    "흔들림을 줄인다",
  ];
}

function getRequiredChecks(scene: NativeRecipeScene, role: ShootBoardCutRole) {
  return [
    scene.recipe.mustInclude[0] || "Main subject is visible",
    role === "hook"
      ? "Payoff appears within 1 second"
      : "Action is easy to understand",
    "Lighting and focus are stable",
  ];
}

function getRequiredChecksKo(role: ShootBoardCutRole) {
  return [
    role === "hook" ? "결과가 1초 안에 보임" : "핵심 행동이 화면에 보임",
    "말할 문장이 준비됨",
    "밝기와 초점이 안정적임",
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
  const parts = timestamp.split(":").map((part) => Number(part));

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

  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}
