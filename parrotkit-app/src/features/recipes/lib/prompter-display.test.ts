import {
  getActiveRecipePrompterFullScript,
  getActiveRecipePrompterCutText,
  getPrompterControlsLayoutModel,
  getPrompterDisplayModel,
  getPrompterDisplayModeOptions,
  getPrompterUiTextRenderModel,
} from "./prompter-display";

const fullScriptModel = getPrompterDisplayModel({
  fallbackLines: ["current cut only", "next cut only"],
  fullScript: "  Hook line\n\nProof line\n\nCTA line  ",
});

if (fullScriptModel.label !== "Script") {
  throw new Error("Prompter full mode should use compact visible copy.");
}

if (
  fullScriptModel.lines.length !== 3 ||
  fullScriptModel.lines[0] !== "Hook line" ||
  fullScriptModel.lines[1] !== "Proof line" ||
  fullScriptModel.lines[2] !== "CTA line"
) {
  throw new Error("Prompter should display the derived full script as readable paragraphs.");
}

const cardFocusedModel = getPrompterDisplayModel({
  fallbackLines: ["  current cut only  ", "next card beat"],
  fullScript: "Hook line\n\nProof line\n\nCTA line",
  mode: "card",
});

if (cardFocusedModel.mode !== "card" || cardFocusedModel.label !== "Line") {
  throw new Error("Prompter current-cut mode should use compact visible copy.");
}

if (
  cardFocusedModel.lines.length !== 2 ||
  cardFocusedModel.lines[0] !== "current cut only" ||
  cardFocusedModel.lines[1] !== "next card beat"
) {
  throw new Error("Card-focused prompter mode should show active cut lines even when full script exists.");
}

const fullScriptFocusedModel = getPrompterDisplayModel({
  fallbackLines: ["current cut only"],
  fullScript: "Hook line\n\nProof line",
  mode: "full-script",
});

if (fullScriptFocusedModel.mode !== "full-script" || fullScriptFocusedModel.label !== "Script") {
  throw new Error("Prompter should expose compact script mode copy.");
}

if (
  fullScriptFocusedModel.lines.length !== 2 ||
  fullScriptFocusedModel.lines[0] !== "Hook line" ||
  fullScriptFocusedModel.lines[1] !== "Proof line"
) {
  throw new Error("Full-script mode should split long-form script copy into vertically spaced paragraphs.");
}

const fallbackModel = getPrompterDisplayModel({
  fallbackLines: ["  current cut only  ", "", "next cut only"],
  fullScript: "   ",
  mode: "full-script",
});

if (fallbackModel.mode !== "card" || fallbackModel.label !== "Line") {
  throw new Error("Prompter should fall back to compact current-cut copy when full script is empty.");
}

if (
  fallbackModel.lines.length !== 2 ||
  fallbackModel.lines[0] !== "current cut only" ||
  fallbackModel.lines[1] !== "next cut only"
) {
  throw new Error("Prompter should fall back to trimmed scene-level lines when no full script exists.");
}

const uiTextRenderModel = getPrompterUiTextRenderModel({
  currentCutLines: ["  Selected cut card line.  ", "Supporting active cut beat."],
  fullScript: "First recipe line.\n\nSecond recipe line.",
  mode: "full-script",
});

if (
  uiTextRenderModel.cardDisplay.mode !== "card" ||
  uiTextRenderModel.cardDisplay.lines[0] !== "Selected cut card line."
) {
  throw new Error("Prompter UI text model should retain the derived current cut text for card rendering.");
}

if (
  uiTextRenderModel.fullScriptDisplay.mode !== "full-script" ||
  uiTextRenderModel.fullScriptDisplay.lines[0] !== "First recipe line." ||
  uiTextRenderModel.fullScriptDisplay.lines[1] !== "Second recipe line."
) {
  throw new Error("Prompter UI text model should retain the derived full recipe script for full-script rendering.");
}

if (uiTextRenderModel.activeDisplay !== uiTextRenderModel.fullScriptDisplay) {
  throw new Error("Prompter UI text model should select the requested full-script display when script text exists.");
}

const activeRecipe = {
  scenes: [
    {
      recipe: {
        keyLine: "Hook line from active recipe.",
      },
    },
    {
      recipe: {
        keyLine: "Proof line from active recipe.",
      },
    },
    {
      prompterLines: ["CTA line from active recipe."],
      recipe: {
        keyLine: "",
      },
    },
  ],
};
const recipeDerivedScript = getActiveRecipePrompterFullScript({
  recipe: activeRecipe,
  shootBoard: null,
});

if (!recipeDerivedScript.includes("Hook line from active recipe.")) {
  throw new Error("Prompter should derive full-script text from the active recipe when no editor board is stored.");
}

if (recipeDerivedScript !== [
  "Hook line from active recipe.",
  "Proof line from active recipe.",
  "CTA line from active recipe.",
].join("\n\n")) {
  throw new Error("Prompter should derive one continuous full-script paragraph per active recipe cut.");
}

const editedBoardScript = getActiveRecipePrompterFullScript({
  recipe: activeRecipe,
  shootBoard: {
    cuts: [
      {
        lineToSay: "Edited board line wins.",
        order: 2,
        speakingLine: "Old board line.",
      },
      {
        lineToSay: "First board line still sorts first.",
        order: 1,
        speakingLine: "",
      },
    ],
  },
});

if (!editedBoardScript.startsWith("First board line still sorts first.\n\nEdited board line wins.")) {
  throw new Error("Prompter should prefer the saved cut-card board over recipe-derived defaults.");
}

const selectedCutText = getActiveRecipePrompterCutText({
  fallbackActionLine: "Stale query action.",
  fallbackLineToSay: "Stale query line.",
  sceneId: "scene-2",
  selectedCutId: "cut-2",
  shootBoard: {
    cuts: [
      {
        id: "cut-1",
        lineToSay: "Wrong card line.",
        order: 1,
        sceneId: "scene-1",
        shootingGuideline: "Wrong card action.",
        speakingLine: "Wrong fallback line.",
      },
      {
        id: "cut-2",
        lineToSay: "Edited selected card line.",
        order: 2,
        sceneId: "scene-2",
        shotAction: "Edited selected card action.",
        shootingGuideline: "Legacy selected action.",
        speakingLine: "Legacy selected line.",
      },
    ],
  },
});

if (
  selectedCutText.lineToSay !== "Edited selected card line." ||
  selectedCutText.shootingGuideline !== "Edited selected card action."
) {
  throw new Error("Prompter should derive the current card prompt from the selected saved cut card.");
}

const sceneMatchedCutText = getActiveRecipePrompterCutText({
  fallbackActionLine: "Scene fallback action.",
  fallbackLineToSay: "Scene fallback line.",
  sceneId: "scene-1",
  shootBoard: {
    cuts: [
      {
        id: "cut-1",
        lineToSay: "Scene-matched card line.",
        order: 1,
        sceneId: "scene-1",
        shotAction: "",
        shootingGuideline: "Scene-matched card action.",
        speakingLine: "Scene-matched fallback line.",
      },
    ],
  },
});

if (
  sceneMatchedCutText.lineToSay !== "Scene-matched card line." ||
  sceneMatchedCutText.shootingGuideline !== "Scene-matched card action."
) {
  throw new Error("Prompter should derive current card prompt from the active scene cut when no cut id is provided.");
}

const staleSelectedCutText = getActiveRecipePrompterCutText({
  fallbackActionLine: "Scene fallback action.",
  fallbackLineToSay: "Scene fallback line.",
  sceneId: "scene-2",
  selectedCutId: "cut-1",
  shootBoard: {
    cuts: [
      {
        id: "cut-1",
        lineToSay: "Stale selected card line.",
        order: 1,
        sceneId: "scene-1",
        shotAction: "Stale selected card action.",
      },
      {
        id: "cut-2",
        lineToSay: "Active scene card line.",
        order: 2,
        sceneId: "scene-2",
        shotAction: "Active scene card action.",
      },
    ],
  },
});

if (
  staleSelectedCutText.lineToSay !== "Active scene card line." ||
  staleSelectedCutText.shootingGuideline !== "Active scene card action."
) {
  throw new Error("Prompter should refresh card text from the active scene when the selected cut id is stale.");
}

const fallbackCutText = getActiveRecipePrompterCutText({
  fallbackActionLine: "Scene fallback action.",
  fallbackLineToSay: "Scene fallback line.",
  sceneId: "missing-scene",
  selectedCutId: "missing-cut",
  shootBoard: {
    cuts: [],
  },
});

if (
  fallbackCutText.lineToSay !== "Scene fallback line." ||
  fallbackCutText.shootingGuideline !== "Scene fallback action."
) {
  throw new Error("Prompter should keep scene fallback text when no selected cut card is available.");
}

const displayModeOptions = getPrompterDisplayModeOptions({
  fullScript: "Hook line\n\nProof line",
});

if (
  displayModeOptions.length !== 2 ||
  displayModeOptions[0].mode !== "card" ||
  displayModeOptions[1].mode !== "full-script" ||
  displayModeOptions[0].label !== "Line" ||
  displayModeOptions[1].label !== "Script"
) {
  throw new Error("Prompter should expose compact switch options in a stable order.");
}

const compactOptions = getPrompterDisplayModeOptions({
  fullScript: "One\n\nTwo",
});

if (compactOptions[0]?.label !== "Line" || compactOptions[1]?.label !== "Script") {
  throw new Error("Prompter mode switch should avoid dashboard copy.");
}

if (displayModeOptions[0].disabled || displayModeOptions[1].disabled) {
  throw new Error("Prompter should keep both switch options enabled when full script exists.");
}

const displayModeOptionsWithoutScript = getPrompterDisplayModeOptions({
  fullScript: "   ",
});

if (!displayModeOptionsWithoutScript[1].disabled) {
  throw new Error("Prompter should disable the full-script switch when no full script exists.");
}

const fullScriptControlLayout = getPrompterControlsLayoutModel({
  mode: "full-script",
});

if (fullScriptControlLayout.controlsRegion !== "persistent-dock") {
  throw new Error("Full-script prompter controls should stay outside the scrollable script body.");
}

if (fullScriptControlLayout.scrollRegion !== "script-body-only") {
  throw new Error("Full-script prompter scrolling should affect only the script body.");
}

if (!fullScriptControlLayout.controlGroups.includes("display-mode")) {
  throw new Error("Persistent prompter controls should include the Card/Full switch.");
}

if (!fullScriptControlLayout.controlGroups.includes("manual-scroll")) {
  throw new Error("Persistent prompter controls should include manual scroll buttons.");
}

if (!fullScriptControlLayout.controlGroups.includes("opacity")) {
  throw new Error("Persistent prompter controls should include opacity controls.");
}
