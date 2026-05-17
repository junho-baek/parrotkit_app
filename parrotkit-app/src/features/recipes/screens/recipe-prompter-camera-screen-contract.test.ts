import { readFileSync } from "fs";
import { join } from "path";

const source = readFileSync(
  join(__dirname, "recipe-prompter-camera-screen.tsx"),
  "utf8",
);

const forbiddenVisibleCopy = [
  "READY",
  "Scene {sceneIndex",
  "SHOOTING GUIDELINE",
  "CARD PROMPT",
  "FULL SCRIPT",
  "Prev cut",
  "Next cut",
];

for (const copy of forbiddenVisibleCopy) {
  if (source.includes(copy)) {
    throw new Error(`Camera prompter still exposes AI-slop visible copy: ${copy}`);
  }
}

if (!source.includes("currentCutIndex") || !source.includes("totalCuts")) {
  throw new Error("Camera prompter should display cut progress from board cuts.");
}

if (!source.includes("getPrompterCutNavigation")) {
  throw new Error("Camera prompter should navigate by shoot-board cuts.");
}

if (!source.includes("GestureDetector")) {
  throw new Error("Camera prompter should support pinch text sizing.");
}

if (!source.includes("prompterOpacity")) {
  throw new Error("Camera prompter should expose opacity controls.");
}
