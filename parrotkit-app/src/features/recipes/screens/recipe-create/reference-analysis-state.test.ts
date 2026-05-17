import { readFileSync } from "node:fs";
import { join } from "node:path";

const screenSource = readFileSync(
  join(__dirname, "..", "recipe-create-screen.tsx"),
  "utf8",
);
const copySource = readFileSync(
  join(__dirname, "recipe-create-copy.ts"),
  "utf8",
);

if (!screenSource.includes("generateRecipeFromYouTubeReference")) {
  throw new Error("Reference Paste flow should call the live reference analysis API adapter.");
}

if (screenSource.includes("buildLocalFallbackResult")) {
  throw new Error("Recipe create screen must not silently seed local fallback boards.");
}

if (!screenSource.includes("setReferenceAnalysisError(copy.analysisFailed as string)")) {
  throw new Error("Failed reference analysis should keep the drawer open with concise recovery copy.");
}

if (!screenSource.includes("setIsAnalyzingReference(true)")) {
  throw new Error("Reference analysis should expose a submitting state before navigation.");
}

if (!screenSource.includes("!submitState.enabled || isAnalyzingReference")) {
  throw new Error("Primary action should be disabled while live reference analysis is running.");
}

if (!copySource.includes("analysisFailed") || !copySource.includes("analyzingCta")) {
  throw new Error("Recipe create copy should include reference analysis recovery and loading labels.");
}
