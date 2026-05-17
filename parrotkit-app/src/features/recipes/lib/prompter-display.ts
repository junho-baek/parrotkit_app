export type PrompterDisplayMode = "card" | "full-script";

export type PrompterDisplayModel = {
  label: "Line" | "Script";
  lines: string[];
  mode: PrompterDisplayMode;
};

export type PrompterDisplayModeOption = {
  disabled: boolean;
  label: "Line" | "Script";
  mode: PrompterDisplayMode;
};

export type PrompterControlsLayoutModel = {
  controlGroups: Array<"display-mode" | "manual-scroll" | "opacity" | "text-size">;
  controlsRegion: "persistent-dock";
  mode: PrompterDisplayMode;
  scrollRegion: "script-body-only";
};

export type PrompterUiTextRenderModel = {
  activeDisplay: PrompterDisplayModel;
  cardDisplay: PrompterDisplayModel;
  fullScriptDisplay: PrompterDisplayModel;
  modeOptions: PrompterDisplayModeOption[];
};

type PrompterRecipeSceneLike = {
  prompterLines?: string[];
  recipe?: {
    keyLine?: string;
    scriptLines?: string[];
  };
};

type PrompterRecipeLike = {
  scenes?: PrompterRecipeSceneLike[];
};

type PrompterShootBoardLike = {
  cuts?: Array<{
    id?: string;
    lineToSay?: string;
    order?: number;
    sceneId?: string;
    shotAction?: string;
    shootingGuideline?: string;
    speakingLine?: string;
  }>;
};

export type ActiveRecipePrompterCutText = {
  lineToSay: string;
  shootingGuideline: string;
};

function compactPrompterLine(line: string | undefined) {
  return line?.trim() ?? "";
}

function getScriptParagraphs(script: string) {
  return script
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getScenePrompterLine(scene: PrompterRecipeSceneLike) {
  return compactPrompterLine(scene.recipe?.keyLine)
    || compactPrompterLine(scene.recipe?.scriptLines?.[0])
    || compactPrompterLine(scene.prompterLines?.[0]);
}

export function getActiveRecipePrompterFullScript({
  recipe,
  shootBoard,
}: {
  recipe?: PrompterRecipeLike | null;
  shootBoard?: PrompterShootBoardLike | null;
}): string {
  const boardLines = [...(shootBoard?.cuts ?? [])]
    .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
    .map((cut) => compactPrompterLine(cut.lineToSay) || compactPrompterLine(cut.speakingLine))
    .filter(Boolean);

  if (boardLines.length > 0) {
    return boardLines.join("\n\n");
  }

  return (recipe?.scenes ?? [])
    .map(getScenePrompterLine)
    .filter(Boolean)
    .join("\n\n");
}

export function getActiveRecipePrompterCutText({
  fallbackActionLine,
  fallbackLineToSay,
  sceneId,
  selectedCutId,
  shootBoard,
}: {
  fallbackActionLine: string;
  fallbackLineToSay: string;
  sceneId?: string | null;
  selectedCutId?: string | null;
  shootBoard?: PrompterShootBoardLike | null;
}): ActiveRecipePrompterCutText {
  const cuts = shootBoard?.cuts ?? [];
  const selectedCut = selectedCutId
    ? cuts.find((cut) => cut.id === selectedCutId)
    : null;
  const selectedCutMatchesScene = !sceneId || !selectedCut?.sceneId || selectedCut.sceneId === sceneId;
  const sceneCut = sceneId
    ? [...cuts]
      .sort((first, second) => (first.order ?? 0) - (second.order ?? 0))
      .find((cut) => cut.sceneId === sceneId)
    : null;
  const cut = selectedCutMatchesScene ? selectedCut ?? sceneCut ?? null : sceneCut ?? selectedCut ?? null;

  return {
    lineToSay:
      compactPrompterLine(cut?.lineToSay)
      || compactPrompterLine(cut?.speakingLine)
      || compactPrompterLine(fallbackLineToSay),
    shootingGuideline:
      compactPrompterLine(cut?.shotAction)
      || compactPrompterLine(cut?.shootingGuideline)
      || compactPrompterLine(fallbackActionLine),
  };
}

export function getPrompterDisplayModel({
  fallbackLines,
  fullScript,
  mode = "full-script",
}: {
  fallbackLines: string[];
  fullScript?: string;
  mode?: PrompterDisplayMode;
}): PrompterDisplayModel {
  const compactFullScript = fullScript?.trim();
  const compactFallbackLines = fallbackLines.map((line) => line.trim()).filter(Boolean);

  if (mode === "full-script" && compactFullScript) {
    return {
      label: "Script",
      lines: getScriptParagraphs(compactFullScript),
      mode: "full-script",
    };
  }

  return {
    label: "Line",
    lines: compactFallbackLines,
    mode: "card",
  };
}

export function getPrompterDisplayModeOptions({
  fullScript,
}: {
  fullScript?: string;
}): PrompterDisplayModeOption[] {
  const hasFullScript = Boolean(fullScript?.trim());

  return [
    {
      disabled: false,
      label: "Line",
      mode: "card",
    },
    {
      disabled: !hasFullScript,
      label: "Script",
      mode: "full-script",
    },
  ];
}

export function getPrompterUiTextRenderModel({
  currentCutLines,
  fullScript,
  mode,
}: {
  currentCutLines: string[];
  fullScript?: string;
  mode: PrompterDisplayMode;
}): PrompterUiTextRenderModel {
  const cardDisplay = getPrompterDisplayModel({
    fallbackLines: currentCutLines,
    fullScript,
    mode: "card",
  });
  const fullScriptDisplay = getPrompterDisplayModel({
    fallbackLines: currentCutLines,
    fullScript,
    mode: "full-script",
  });
  const activeDisplay =
    mode === "full-script" && fullScriptDisplay.mode === "full-script"
      ? fullScriptDisplay
      : cardDisplay;

  return {
    activeDisplay,
    cardDisplay,
    fullScriptDisplay,
    modeOptions: getPrompterDisplayModeOptions({ fullScript }),
  };
}

export function getPrompterControlsLayoutModel({
  mode,
}: {
  mode: PrompterDisplayMode;
}): PrompterControlsLayoutModel {
  return {
    controlGroups: ["display-mode", "text-size", "opacity", "manual-scroll"],
    controlsRegion: "persistent-dock",
    mode,
    scrollRegion: "script-body-only",
  };
}
