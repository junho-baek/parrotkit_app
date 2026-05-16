import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(__dirname, "shoot-board-scene-card.tsx"),
  "utf8",
);

for (const removedStyleName of [
  "editorSection",
  "referenceViewerSection",
  "takeViewerSection",
]) {
  if (source.includes(removedStyleName)) {
    throw new Error(
      `Expanded shooting board should not keep nested ${removedStyleName} surfaces.`,
    );
  }
}

for (const requiredConcept of [
  "Line to say",
  "Shot guide",
  "Saved takes",
  "Checklist",
  "requiredChecklist",
  "getChecklistProgressLabel",
  "onToggleChecklistItem",
  "referencePreview",
  "Film",
  "actionControls.retake",
  "actionControls.setFinal",
  "onSetFinalTake",
]) {
  if (!source.includes(requiredConcept)) {
    throw new Error(
      `Expanded shooting board source should retain ${requiredConcept}.`,
    );
  }
}

for (const unboxedBoardArea of [
  "boardPrimaryArea",
  "boardCopyColumn",
  "boardReferenceColumn",
  "savedTakesArea",
  "checklistRail",
]) {
  const styleBlock = getStyleBlock(unboxedBoardArea);

  if (/borderWidth|shadowOpacity|shadowRadius/.test(styleBlock)) {
    throw new Error(
      `Expanded shooting board should not reintroduce renamed nested boxes in ${unboxedBoardArea}.`,
    );
  }
}

for (const cardCentricCopy of ["Open card", "card pile", "card-centric"]) {
  if (source.toLowerCase().includes(cardCentricCopy.toLowerCase())) {
    throw new Error(
      `Expanded shooting board should not use card-centric visible copy: ${cardCentricCopy}.`,
    );
  }
}

function getStyleBlock(styleName: string) {
  const match = source.match(
    new RegExp(`\\n  ${styleName}: \\{[\\s\\S]*?\\n  \\},`),
  );

  if (!match) {
    throw new Error(`Expected style block to exist: ${styleName}`);
  }

  return match[0];
}
