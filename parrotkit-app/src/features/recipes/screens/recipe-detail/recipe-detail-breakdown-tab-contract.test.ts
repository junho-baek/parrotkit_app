import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
  path.resolve(__dirname, "../recipe-detail-screen.tsx"),
  "utf8",
);

if (!source.includes('useState<"board" | "breakdown">("board")')) {
  throw new Error("Recipe detail must default to the Board tab");
}

if (!source.includes('boardTab?: "board" | "breakdown"')) {
  throw new Error("Recipe detail must support deep-linking to the Board/Breakdown sub-tab for QA.");
}

if (!source.includes('analysisQaState?: "partial" | "failed"')) {
  throw new Error("Recipe detail must support partial/failed analysis QA states.");
}

if (!source.includes('setActiveBoardTab(params.boardTab === "breakdown" ? "breakdown" : "board")')) {
  throw new Error("Board initialization must preserve the Breakdown deep link.");
}

if (!source.includes("nativeRecipe, params.boardTab, recipeSaved")) {
  throw new Error("Board initialization must rerun when the Board/Breakdown deep link changes.");
}

if (!source.includes("Board") || !source.includes("Breakdown")) {
  throw new Error("Recipe detail must expose Board / Breakdown labels");
}

if (!source.includes("<RecipeBreakdownPanel")) {
  throw new Error("Breakdown tab must render RecipeBreakdownPanel");
}

if (source.includes("Hook / Proof / Demonstration / CTA")) {
  throw new Error("Board tab must not expose analysis taxonomy as a tab label");
}

const breakdownSource = fs.readFileSync(
  path.resolve(__dirname, "../../lib/recipe-breakdown-summary.ts"),
  "utf8",
);

for (const label of [
  "Summary",
  "Transcript",
  "Idea Analysis",
  "Hook",
  "Storytelling",
  "Visual Layout",
]) {
  if (!breakdownSource.includes(label)) {
    throw new Error(`Breakdown tab must support Sandcastle label: ${label}`);
  }
}

for (const label of [
  "Video hook",
  "Why this works",
  "Idea angle",
  "Story format",
  "Proof points",
]) {
  if (breakdownSource.includes(label)) {
    throw new Error(`Breakdown tab must not use old ad hoc label: ${label}`);
  }
}
