import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(__dirname, "../recipe-detail-screen.tsx"), "utf8");
const sceneCardSource = readFileSync(
  join(__dirname, "../../components/shoot-board-scene-card.tsx"),
  "utf8",
);
const boardFacingSource = [
  source,
  sceneCardSource,
  readFileSync(join(__dirname, "../../lib/cut-card-body-preview.ts"), "utf8"),
  readFileSync(join(__dirname, "../../lib/cut-card-editor-fields.ts"), "utf8"),
  readFileSync(join(__dirname, "../../lib/cut-card-header.ts"), "utf8"),
  readFileSync(
    join(__dirname, "../../lib/cut-card-reference-viewer-section.ts"),
    "utf8",
  ),
  readFileSync(join(__dirname, "../../lib/cut-card-take-viewer-section.ts"), "utf8"),
].join("\n");

for (const removedHeaderConcept of [
  "getBoardReferencePreview",
  "cutBoardReference",
]) {
  if (source.includes(removedHeaderConcept)) {
    throw new Error(
      `Recipe detail board should not keep a board-level reference preview: ${removedHeaderConcept}`,
    );
  }
}

for (const requiredCutConcept of [
  "referenceAnchor",
  "referenceThumbnailSource",
  "formatCutTimelineLabel",
  "timeRangeLabel",
]) {
  if (!sceneCardSource.includes(requiredCutConcept)) {
    throw new Error(
      `Each cut card should place reference media above the cut label: ${requiredCutConcept}`,
    );
  }
}

if (source.includes("onToggleSceneComplete")) {
  throw new Error("Board rows should not expose manual completion as the primary check.");
}

if (source.includes("setShootBoardCutCompletion")) {
  throw new Error("Board completion UI should be driven by My Take state, not manual cut completion.");
}

for (const forbiddenVisibleLabel of [
  "Storytelling Format",
  "Visual Layout",
  "Proof point",
  "Proof Point",
  "confidence",
  "model",
  "prompt",
  "Card prompt",
  "Next Cut",
  "Recording Ready",
]) {
  for (const quotedLabel of [
    `"${forbiddenVisibleLabel}"`,
    `'${forbiddenVisibleLabel}'`,
    `>${forbiddenVisibleLabel}<`,
  ]) {
    if (boardFacingSource.includes(quotedLabel)) {
      throw new Error(
        `Board-facing UI should not expose analysis or AI-slop label: ${forbiddenVisibleLabel}`,
      );
    }
  }
}
